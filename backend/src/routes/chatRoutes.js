import express from 'express';
import { ConversationRepository } from '../models/Conversation.js';
import {
  streamClaudeResponse,
  isApiKeyConfigured,
  TONE_MODIFIERS,
} from '../services/claudeService.js';
import { dbStatus } from '../config/db.js';

const router = express.Router();

/**
 * Health and diagnostics endpoint
 */
router.get('/health', async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      connected: dbStatus.isConnected,
      mode: dbStatus.mode,
      uri: dbStatus.uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@'),
    },
    claude: {
      apiKeyConfigured: isApiKeyConfigured(),
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
      availableTones: Object.keys(TONE_MODIFIERS),
    },
  });
});

/**
 * Get all conversation threads (sorted by latest activity)
 */
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await ConversationRepository.getAll();
    const summarized = conversations.map((c) => ({
      _id: c._id,
      title: c.title || 'Untitled Chat',
      tone: c.tone || 'Professional',
      messageCount: c.messages?.length || 0,
      lastMessage: c.messages && c.messages.length > 0 ? c.messages[c.messages.length - 1] : null,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));
    res.json(summarized);
  } catch (err) {
    console.error('Error fetching conversations:', err);
    res.status(500).json({ error: 'Failed to retrieve conversations' });
  }
});

/**
 * Create a new conversation thread
 */
router.post('/conversations', async (req, res) => {
  try {
    const { title = 'New Conversation', tone = 'Professional' } = req.body;
    const conversation = await ConversationRepository.create({
      title,
      tone,
      messages: [],
    });
    res.status(201).json(conversation);
  } catch (err) {
    console.error('Error creating conversation:', err);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

/**
 * Get a single conversation thread by ID (with all messages and timestamps)
 */
router.get('/conversations/:id', async (req, res) => {
  try {
    const conversation = await ConversationRepository.getById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (err) {
    console.error('Error fetching conversation:', err);
    res.status(500).json({ error: 'Failed to retrieve conversation' });
  }
});

/**
 * Update conversation tone preference
 */
router.patch('/conversations/:id/tone', async (req, res) => {
  try {
    const { tone } = req.body;
    if (!['Professional', 'Casual', 'Concise'].includes(tone)) {
      return res.status(400).json({ error: 'Invalid tone. Must be Professional, Casual, or Concise' });
    }
    const updated = await ConversationRepository.updateTone(req.params.id, tone);
    if (!updated) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating tone:', err);
    res.status(500).json({ error: 'Failed to update tone' });
  }
});

/**
 * Update conversation title
 */
router.patch('/conversations/:id/title', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Invalid title' });
    }
    const updated = await ConversationRepository.updateTitle(req.params.id, title.trim());
    if (!updated) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(updated);
  } catch (err) {
    console.error('Error updating title:', err);
    res.status(500).json({ error: 'Failed to update title' });
  }
});

/**
 * Delete a conversation thread
 */
router.delete('/conversations/:id', async (req, res) => {
  try {
    await ConversationRepository.delete(req.params.id);
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (err) {
    console.error('Error deleting conversation:', err);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

/**
 * Clear all conversations
 */
router.delete('/conversations', async (req, res) => {
  try {
    await ConversationRepository.deleteAll();
    res.json({ success: true, message: 'All conversations cleared' });
  } catch (err) {
    console.error('Error clearing conversations:', err);
    res.status(500).json({ error: 'Failed to clear conversations' });
  }
});

/**
 * Real-time SSE streaming chat endpoint
 * Passes tone as system instruction modifier to Claude
 * Streams tokens chunk-by-chunk to frontend
 * Saves prompt, AI response, and timestamps to MongoDB
 */
router.post('/chat/stream', async (req, res) => {
  const { conversationId, prompt, tone = 'Professional' } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const selectedTone = ['Professional', 'Casual', 'Concise'].includes(tone)
    ? tone
    : 'Professional';

  try {
    // 1. Retrieve or create the conversation thread
    let conv = null;
    let isNew = false;

    if (conversationId) {
      conv = await ConversationRepository.getById(conversationId);
    }

    if (!conv) {
      // Create new conversation with title from prompt
      isNew = true;
      const initialTitle = prompt.trim().slice(0, 38) + (prompt.length > 38 ? '...' : '');
      conv = await ConversationRepository.create({
        title: initialTitle,
        tone: selectedTone,
        messages: [],
      });
    }

    // 2. Build user message
    const userMsgId = 'msg_' + Date.now() + '_u';
    const userMessage = {
      id: userMsgId,
      sender: 'user',
      content: prompt.trim(),
      timestamp: new Date().toISOString(),
    };

    // 3. Set SSE Response Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering (Nginx, etc.)
    res.flushHeaders?.();

    // Notify client of start and current conversation info
    res.write(
      `data: ${JSON.stringify({
        type: 'start',
        conversationId: conv._id,
        userMessage,
        tone: selectedTone,
      })}\n\n`
    );

    // 4. Stream Claude response with Tone Modifier
    const aiMsgId = 'msg_' + Date.now() + '_a';

    await streamClaudeResponse({
      prompt: prompt.trim(),
      history: conv.messages || [],
      tone: selectedTone,
      onChunk: (chunk) => {
        if (!res.writableEnded) {
          res.write(
            `data: ${JSON.stringify({
              type: 'chunk',
              text: chunk,
            })}\n\n`
          );
        }
      },
      onComplete: async (fullAiResponse) => {
        try {
          // 5. Persist both user prompt and AI response to MongoDB
          const aiMessage = {
            id: aiMsgId,
            sender: 'assistant',
            content: fullAiResponse,
            tone: selectedTone,
            timestamp: new Date().toISOString(),
          };

          await ConversationRepository.addMessages(conv._id, [userMessage, aiMessage]);

          // Update tone preference on conversation if altered
          if (conv.tone !== selectedTone) {
            await ConversationRepository.updateTone(conv._id, selectedTone);
          }

          // If title was default, update with intelligent summary
          if (conv.messages.length === 0 && !isNew) {
            const dynamicTitle = prompt.trim().slice(0, 38) + (prompt.length > 38 ? '...' : '');
            await ConversationRepository.updateTitle(conv._id, dynamicTitle);
          }

          if (!res.writableEnded) {
            res.write(
              `data: ${JSON.stringify({
                type: 'done',
                conversationId: conv._id,
                aiMessage,
              })}\n\n`
            );
            res.end();
          }
        } catch (saveErr) {
          console.error('Error saving messages to MongoDB:', saveErr);
          if (!res.writableEnded) {
            res.write(
              `data: ${JSON.stringify({
                type: 'error',
                message: 'Error saving message to database',
              })}\n\n`
            );
            res.end();
          }
        }
      },
      onError: (err) => {
        console.error('Stream error:', err);
        if (!res.writableEnded) {
          res.write(
            `data: ${JSON.stringify({
              type: 'error',
              message: err.message || 'Stream processing failure',
            })}\n\n`
          );
          res.end();
        }
      },
    });
  } catch (err) {
    console.error('Error handling chat stream:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error processing chat' });
    } else if (!res.writableEnded) {
      res.write(
        `data: ${JSON.stringify({
          type: 'error',
          message: err.message || 'Unexpected server error',
        })}\n\n`
      );
      res.end();
    }
  }
});

export default router;
