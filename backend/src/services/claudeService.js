import Anthropic from '@anthropic-ai/sdk';

// Base system prompt
const BASE_SYSTEM_PROMPT = `You are an intelligent, capable, and helpful AI assistant. You answer questions accurately, thoughtfully, and clearly, using proper Markdown formatting where helpful (code blocks, bullet points, bolding).`;

// Tone system instruction modifiers
export const TONE_MODIFIERS = {
  Professional: `TONE DIRECTIVE: PROFESSIONAL.
Communicate with high professionalism, elegance, and clarity.
- Maintain a respectful, polished, articulate, and objective tone.
- Structure explanations with clear headings, organized paragraphs, or formal bullet points.
- Suitable for executive, enterprise, research, and academic settings.
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
      messages.push({ role: 'assistant', content: msg.content });
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
      // Merge consecutive messages from same role
      sanitized[sanitized.length - 1].content += `\n\n${m.content}`;
    }
  }

  // Ensure last message is from user
  if (sanitized.length === 0 || sanitized[sanitized.length - 1].role !== 'user') {
    sanitized.push({ role: 'user', content: currentPrompt || 'Hello' });
  }

  return sanitized;
}

/**
 * Stream Claude API response or fallback simulator
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
  const apiKeyValid = isApiKeyConfigured();

  if (apiKeyValid) {
    try {
      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const formattedMessages = formatClaudeMessages(history, prompt);
      const model = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';

      console.log(`[Claude API] Sending request with model: ${model}, tone: ${tone}`);

      const stream = anthropic.messages.stream({
        model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: formattedMessages,
      });

      let fullText = '';

      stream.on('text', (text) => {
        fullText += text;
        onChunk(text);
      });

      stream.on('error', (err) => {
        console.error('[Claude API Error]:', err);
        // If there's an API quota / key error, gracefully fallback
        handleFallbackStream(prompt, tone, fullText, onChunk, onComplete, err);
      });

      stream.on('end', () => {
        console.log(`[Claude API] Stream completed. Total characters: ${fullText.length}`);
        onComplete(fullText);
      });

      return;
    } catch (err) {
      console.error('[Claude API Initialization Error]:', err);
      // Fall through to simulated response
    }
  }

  // Fallback simulator with realistic streaming
  console.info(`[Claude Service] ANTHROPIC_API_KEY not configured. Running intelligent tone-aware simulated streaming.`);
  await handleFallbackStream(prompt, tone, '', onChunk, onComplete);
}

/**
 * Fallback streaming response generator for immediate out-of-the-box testing
 */
async function handleFallbackStream(prompt, tone, existingText = '', onChunk, onComplete, priorError = null) {
  let simulatedResponse = generateToneAwareResponse(prompt, tone, priorError);

  // Split into small character / word chunks to simulate real-time typing
  const words = simulatedResponse.split(/(\s+|\n+)/);

  for (const word of words) {
    if (!word) continue;
    onChunk(word);
    // 15ms - 30ms delay to simulate real-time API streaming
    await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 20) + 12));
  }

  onComplete(existingText + simulatedResponse);
}

function generateToneAwareResponse(prompt, tone, priorError) {
  const pLower = prompt.toLowerCase();
  let coreResponse = '';

  if (tone === 'Professional') {
    coreResponse = `Thank you for your inquiry regarding "${prompt.trim()}".

Based on an analysis of your request, here are the principal insights:

### Overview & Key Analysis
1. **Core Consideration:** Addressing "${prompt.trim()}" requires establishing robust foundational parameters and aligning on primary objectives.
2. **Methodology:** We recommend an iterative implementation roadmap incorporating continuous validation and systematic assessment.
3. **Strategic Outcome:** Adopting this framework ensures sustainable efficiency, reliability, and long-term value.

\`\`\`json
{
  "status": "success",
  "tone": "Professional",
  "analyzed_query": "${prompt.trim().replace(/"/g, '\\"')}",
  "confidence_score": 0.98
}
\`\`\`

Please let me know if you would like me to prepare a more granular specification or further elaborate on any specific dimension.`;
  } else if (tone === 'Casual') {
    coreResponse = `Hey there! Great question about "${prompt.trim()}". 😊

Here's the scoop:

* **The Big Picture:** Honestly, "${prompt.trim()}" is super interesting! The trick is to keep things simple and just take it one step at a time.
* **Pro Tip:** Don't overthink the tricky bits early on—build a quick prototype, see what works, and refine as you go!
* **Bottom Line:** You're on the right track! 🚀

Let me know if you want to brainstorm some more fun ideas or dive deeper into anything specific!`;
  } else {
    // Concise
    coreResponse = `**Query:** ${prompt.trim()}

- **Status:** Resolved
- **Key Point 1:** Primary objective identified and verified.
- **Key Point 2:** Direct solution executed with minimal overhead.
- **Summary:** Action complete. Ready for next command.`;
  }

  if (priorError) {
    coreResponse += `\n\n> *Note: Received Claude API notice (${priorError.message || 'API verification'}). To activate live Claude 3.5 Sonnet, provide your \`ANTHROPIC_API_KEY\` in \`backend/.env\`.*`;
  } else if (!isApiKeyConfigured()) {
    coreResponse += `\n\n> 💡 *Live Claude API Note: To stream live Claude 3.5 Sonnet responses directly from Anthropic, enter your \`ANTHROPIC_API_KEY\` in \`backend/.env\`.*`;
  }

  return coreResponse;
}
