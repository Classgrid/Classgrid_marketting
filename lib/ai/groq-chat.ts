const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type GroqChatOptions = {
  messages: GroqMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
};

export function getGroqModel(channel?: "web" | "whatsapp" | "telegram") {
  if (channel === "whatsapp" || channel === "telegram") {
    return process.env.WHATSAPP_GROQ_MODEL?.trim() || process.env.GROQ_MODEL?.trim() || "llama-3.1-8b-instant";
  }

  return process.env.GROQ_MODEL?.trim() || "llama-3.3-70b-versatile";
}

function extractGroqAnswer(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return "";

  const first = choices[0] as { message?: { content?: unknown } };
  return typeof first.message?.content === "string" ? first.message.content.trim() : "";
}

export async function generateGroqReply({
  messages,
  model,
  temperature = 0.35,
  maxTokens = 600,
  timeoutMs = 20000,
}: GroqChatOptions): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(GROQ_CHAT_URL, {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model || getGroqModel(),
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("[groq] HTTP", response.status, body.slice(0, 400));
      if (response.status === 429) {
        return "[RATE_LIMITED]";
      }
      return null;
    }

    return extractGroqAnswer(await response.json());
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const message = error instanceof Error ? error.message : String(error);
    if (name === "AbortError" || message.toLowerCase().includes("abort")) {
      console.warn("[groq] aborted after", timeoutMs, "ms");
    } else {
      console.error("[groq]", message);
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
