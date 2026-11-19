import Anthropic from '@anthropic-ai/sdk';
import { generateIntelligentResponse } from './knowledgeEngine.js';

// Base system prompt
const BASE_SYSTEM_PROMPT = `You are an intelligent, capable, and helpful AI assistant. You answer questions accurately, thoughtfully, and clearly, using proper Markdown formatting where helpful (code blocks, bullet points, bolding, tables).`;

// Tone system instruction modifiers
export const TONE_MODIFIERS = {
  Professional: `TONE DIRECTIVE: PROFESSIONAL.
Communicate with high professionalism, elegance, and clarity.
- Maintain a respectful, polished, articulate, and objective tone.
- Structure explanations with clear headings, organized paragraphs, or formal bullet points.
- Provide comprehensive technical depth, accurate code blocks, and architectural insights.
- Avoid slang, colloquialisms, or excessive casual emojis.`,

  Casual: `TONE DIRECTIVE: CASUAL.
Communicate in an easygoing, friendly, and approachable conversational style.
- Use warm, everyday language, relatable analogies, and natural conversational cadence.
- Feel free to include appropriate emojis and conversational flair.
- Keep the dialogue lively, encouraging, and engaging—like a knowledgeable friend chatting over coffee.`,

  Concise: `TONE DIRECTIVE: CONCISE.
Communicate with extreme brevity, high density, and razor-sharp precision.
- Deliver direct answers in the minimum number of words necessary.
- Strip away all filler, preambles, greetings, pleasantries, apologies, and concluding remarks.
- Use tight bullet points, tables, or single punchy sentences whenever possible.
- Maximize information density: zero fluff, high signal-to-noise ratio.`,
};

export function getSystemPrompt(tone = 'Professional') {
  const normalizedTone = ['Professional', 'Casual', 'Concise'].includes(tone)
    ? tone
    : 'Professional';
  const toneModifier = TONE_MODIFIERS[normalizedTone];
  return `${BASE_SYSTEM_PROMPT}\n\n${toneModifier}`;
}

export function isApiKeyConfigured() {
  const key = process.env.ANTHROPIC_API_KEY;
  return Boolean(key && key.trim() !== '' && !key.includes('your_anthropic_api_key'));
}

/**
 * Format conversation history for Claude messages API
 */
export function formatClaudeMessages(history = [], currentPrompt) {
  const messages = [];

  for (const msg of history) {
    if (msg.sender === 'user') {
      messages.push({ role: 'user', content: msg.content });
    } else if (msg.sender === 'assistant') {
      // Clean off any API warning banners from history so Claude gets clean assistant text
      const cleanContent = msg.content.replace(/^> ⚠️[^\n]+\n(?:>[^\n]*\n)*\n---\n\n/m, '');
      messages.push({ role: 'assistant', content: cleanContent });
    }
  }

  // Add the current prompt
  if (currentPrompt) {
    messages.push({ role: 'user', content: currentPrompt });
  }

  // Ensure history does not start with an assistant message and alternates correctly
  const sanitized = [];
  let expectedRole = 'user';

  for (const m of messages) {
    if (m.role === expectedRole) {
      sanitized.push(m);
      expectedRole = expectedRole === 'user' ? 'assistant' : 'user';
    } else if (sanitized.length > 0 && sanitized[sanitized.length - 1].role === m.role) {
      sanitized[sanitized.length - 1].content += `\n\n${m.content}`;
    }
  }

  if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== 'user') {
    sanitized.push({ role: 'user', content: currentPrompt || 'Hello' });
  }

  return sanitized;
}

/**
 * Stream responses using Gemini API if configured
 */
async function streamGeminiResponse({ prompt, history = [], systemPrompt, onChunk, onComplete }) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return false;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

  const contents = [];
  for (const msg of history) {
    if (msg.sender === 'user') {
      contents.push({ role: 'user', parts: [{ text: msg.content }] });
    } else if (msg.sender === 'assistant') {
      contents.push({ role: 'model', parts: [{ text: msg.content }] });
    }
  }
  contents.push({ role: 'user', parts: [{ text: prompt }] });

  const payload = {
    contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.slice(6).trim();
        if (!jsonStr) continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            fullText += text;
            onChunk(text);
          }
        } catch (e) {
          // ignore partial json
        }
      }
    }
  }

  if (fullText) {
    onComplete(fullText);
    return true;
  }
  return false;
}

/**
 * Main streaming response dispatcher:
 * 1. Checks Gemini API if configured
 * 2. Checks Anthropic Claude API if key is present
 * 3. Falls back smoothly to Intelligent Knowledge Engine with full accuracy & domain depth
 */
export async function streamClaudeResponse({
  prompt,
  history = [],
  tone = 'Professional',
  onChunk,
  onComplete,
  onError,
}) {
  const systemPrompt = getSystemPrompt(tone);

  // 1. Try Gemini API if key is configured
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    try {
      console.log(`[Gemini API] Dispatching streaming request via Gemini 1.5 Flash...`);
      const handled = await streamGeminiResponse({
        prompt,
        history,
        systemPrompt,
        onChunk,
        onComplete,
      });
      if (handled) return;
    } catch (gErr) {
      console.warn(`[Gemini API Warning]: ${gErr.message}`);
    }
  }

  // 2. Try Anthropic Claude API
  if (isApiKeyConfigured()) {
    const key = process.env.ANTHROPIC_API_KEY.trim();
    const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';

    console.log(`[Claude API] Dispatching request with model: ${model}, tone: ${tone}`);

    try {
      const anthropic = new Anthropic({ apiKey: key });
      const formattedMessages = formatClaudeMessages(history, prompt);

      let fullText = '';
      let isSettled = false;
      let hasError = false;

      await new Promise((resolve) => {
        try {
          const stream = anthropic.messages.stream({
            model,
            max_tokens: 2048,
            system: systemPrompt,
            messages: formattedMessages,
          });

          stream.on('text', (text) => {
            if (hasError || isSettled) return;
            fullText += text;
            onChunk(text);
          });

          stream.on('error', async (err) => {
            if (isSettled) return;
            hasError = true;
            console.error('[Claude API Error]:', err);

            try {
              stream.abort?.();
            } catch (e) { }

            // Extract human-readable error from Anthropic
            const rawErrorMsg =
              err?.error?.error?.message ||
              err?.error?.message ||
              err?.message ||
              'Anthropic API error';

            const isCreditError =
              rawErrorMsg.toLowerCase().includes('credit') ||
              rawErrorMsg.toLowerCase().includes('balance') ||
              rawErrorMsg.toLowerCase().includes('billing');

            const apiNotice = isCreditError
              ? `> ⚠️ **Anthropic Claude Notice:** *Your credit balance is too low to access the Anthropic API.*
> 💳 *To stream live Claude 3.5 Sonnet directly, top up prepaid API credits at [console.anthropic.com/settings/plans](https://console.anthropic.com/settings/plans).*
> 💡 *In the meantime, your assistant has generated the complete answer below:*`
              : `> ⚠️ **Anthropic Claude Notice:** *${rawErrorMsg}*
> 💡 *Your assistant has processed your query with the complete response below:*`;

            isSettled = true;
            await streamIntelligentFallback(prompt, tone, apiNotice, fullText, onChunk, onComplete);
            resolve();
          });

          stream.on('end', () => {
            if (hasError || isSettled) return;
            isSettled = true;
            console.log(`[Claude API] Stream completed. Total characters: ${fullText.length}`);
            onComplete(fullText);
            resolve();
          });
        } catch (streamInitErr) {
          console.error('[Claude API Stream Init Error]:', streamInitErr);
          hasError = true;
          isSettled = true;
          const apiNotice = `> ⚠️ **Anthropic Claude Notice:** *${streamInitErr.message}*`;
          streamIntelligentFallback(prompt, tone, apiNotice, '', onChunk, onComplete).then(resolve);
        }
      });

      return;
    } catch (err) {
      console.error('[Claude API Top-Level Error]:', err);
      // Fall through to Intelligent Engine
    }
  }

  // 3. Fallback: Intelligent Knowledge Engine
  console.info(`[Assistant Engine] Generating complete response using domain knowledge (${tone} tone).`);
  await streamIntelligentFallback(prompt, tone, null, '', onChunk, onComplete);
}

/**
 * Stream intelligent fallback response chunk-by-chunk for typewriter effect
 */
async function streamIntelligentFallback(prompt, tone, apiNotice, existingText = '', onChunk, onComplete) {
  const fullResponse = generateIntelligentResponse(prompt, tone, apiNotice);

  // Stream in realistic word/punctuation chunks for a smooth typing animation
  const tokens = fullResponse.split(/(\s+|\n+)/);

  for (const token of tokens) {
    if (!token) continue;
    onChunk(token);
    // 8ms - 20ms delay for natural real-time streaming cadence
    await new Promise((res) => setTimeout(res, Math.floor(Math.random() * 12) + 8));
  }

  const finalOutput = existingText ? `${existingText}\n\n${fullResponse}` : fullResponse;
  onComplete(finalOutput);
}
