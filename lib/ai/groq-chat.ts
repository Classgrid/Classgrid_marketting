/**
 * Multi-Provider LLM Client with Automatic Fallback
 *
 * Provider chain: Gemini → Groq → Mistral
 * Each provider uses the OpenAI-compatible chat completions format.
 * If the primary provider is rate-limited or fails, the next one is tried automatically.
 *
 * Environment variables:
 *   GEMINI_API_KEY   – Google Gemini (primary, 1M TPM free)
 *   GEMINI_MODEL     – default: gemini-2.5-flash
 *   GROQ_API_KEY     – Groq (fallback, 6K TPM free)
 *   GROQ_MODEL       – default: llama-3.1-8b-instant
 *   MISTRAL_API_KEY  – Mistral (last resort, 500K TPM free)
 *   MISTRAL_MODEL    – default: mistral-small-latest
 */

// ── Types (backward-compatible) ──────────────────────────────────────────────

export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GroqChatOptions = {
  messages: GroqMessage[];
  model?: string;
  channel?: "web" | "whatsapp" | "telegram";
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
};

// ── Provider Definitions ─────────────────────────────────────────────────────

type LLMProvider = {
  name: string;
  url: string;
  apiKey: string;
  model: string;
};

function getProviderChain(channel?: "web" | "whatsapp" | "telegram"): LLMProvider[] {
  const providers: LLMProvider[] = [];

  // 1️⃣ Primary: Google Gemini (1M TPM free tier)
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    providers.push({
      name: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      apiKey: geminiKey,
      model: process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash",
    });
  }

  // 2️⃣ Fallback: Groq (6K TPM free tier)
  const groqKey = process.env.GROQ_API_KEY?.trim();
  if (groqKey) {
    const groqModel =
      channel === "whatsapp" || channel === "telegram"
        ? process.env.WHATSAPP_GROQ_MODEL?.trim() || process.env.GROQ_MODEL?.trim() || "llama-3.1-8b-instant"
        : process.env.GROQ_MODEL?.trim() || "llama-3.1-8b-instant";
    providers.push({
      name: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      apiKey: groqKey,
      model: groqModel,
    });
  }

  // 3️⃣ Last resort: Mistral (500K TPM free tier)
  const mistralKey = process.env.MISTRAL_API_KEY?.trim();
  if (mistralKey) {
    providers.push({
      name: "mistral",
      url: "https://api.mistral.ai/v1/chat/completions",
      apiKey: mistralKey,
      model: process.env.MISTRAL_MODEL?.trim() || "mistral-small-latest",
    });
  }

  return providers;
}

// ── Kept for backward compatibility ──────────────────────────────────────────

export function getGroqModel(channel?: "web" | "whatsapp" | "telegram") {
  // Returns the model of the first available provider
  const chain = getProviderChain(channel);
  return chain.length > 0 ? chain[0].model : "gemini-2.5-flash";
}

// ── Response Extraction ──────────────────────────────────────────────────────

function extractAnswer(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return "";

  const first = choices[0] as { message?: { content?: unknown } };
  return typeof first.message?.content === "string" ? first.message.content.trim() : "";
}

// ── Single Provider Request ──────────────────────────────────────────────────

async function tryProvider(
  provider: LLMProvider,
  messages: GroqMessage[],
  temperature: number,
  maxTokens: number,
  timeoutMs: number
): Promise<{ answer: string | null; rateLimited: boolean; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(provider.url, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${provider.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: provider.model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[llm:${provider.name}] HTTP ${response.status} ${body.slice(0, 300)}`);

      if (response.status === 429) {
        return { answer: null, rateLimited: true, error: "rate_limited" };
      }
      // 401/403 = bad key, skip this provider
      if (response.status === 401 || response.status === 403) {
        return { answer: null, rateLimited: false, error: "auth_failed" };
      }
      return { answer: null, rateLimited: false, error: `http_${response.status}` };
    }

    const answer = extractAnswer(await response.json());
    if (answer) {
      console.log(`[llm] ✓ ${provider.name} (${provider.model})`);
    }
    return { answer: answer || null, rateLimited: false };
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const message = error instanceof Error ? error.message : String(error);
    if (name === "AbortError" || message.toLowerCase().includes("abort")) {
      console.warn(`[llm:${provider.name}] aborted after ${timeoutMs}ms`);
    } else {
      console.error(`[llm:${provider.name}]`, message);
    }
    return { answer: null, rateLimited: false, error: message };
  } finally {
    clearTimeout(timeout);
  }
}

// ── Main Entry Point (with fallback chain) ───────────────────────────────────

export async function generateGroqReply({
  messages,
  model,
  channel,
  temperature = 0.35,
  maxTokens = 600,
  timeoutMs = 20000,
}: GroqChatOptions): Promise<string | null> {
  const chain = getProviderChain(channel);

  if (chain.length === 0) {
    console.error("[llm] No API keys configured (GEMINI_API_KEY, GROQ_API_KEY, or MISTRAL_API_KEY)");
    return null;
  }

  let allRateLimited = true;

  for (const provider of chain) {
    const result = await tryProvider(provider, messages, temperature, maxTokens, timeoutMs);

    if (result.answer) {
      return result.answer;
    }

    if (!result.rateLimited) {
      allRateLimited = false;
    }

    // If rate limited or failed, try the next provider
    if (result.rateLimited) {
      console.warn(`[llm] ${provider.name} rate-limited, trying next provider...`);
    } else if (result.error === "auth_failed") {
      console.warn(`[llm] ${provider.name} auth failed (bad key?), trying next provider...`);
    } else {
      console.warn(`[llm] ${provider.name} failed (${result.error}), trying next provider...`);
    }
  }

  // All providers exhausted
  if (allRateLimited) {
    console.error("[llm] All providers rate-limited");
    return "[RATE_LIMITED]";
  }

  console.error("[llm] All providers failed");
  return null;
}
