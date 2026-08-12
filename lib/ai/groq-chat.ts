/**
 * Multi-Provider LLM Client with Automatic Fallback & Tool Calling
 *
 * Provider chain: Gemini → Groq → Mistral
 * Each provider uses the OpenAI-compatible chat completions format.
 * If the primary provider is rate-limited or fails, the next one is tried automatically.
 */
import google from 'googlethis';
import * as cheerio from 'cheerio';

// ── Types (backward-compatible) ──────────────────────────────────────────────

export type GroqMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  tool_calls?: any[];
  tool_call_id?: string;
};

export type GroqChatOptions = {
  messages: GroqMessage[];
  model?: string;
  channel?: "web" | "whatsapp" | "telegram";
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  onStatus?: (label: string) => void;
};

// ── Provider Definitions ─────────────────────────────────────────────────────

type LLMProvider = {
  name: string;
  url: string;
  apiKey: string;
  model: string;
};

const TOOLS = [
  {
    type: "function",
    function: {
      name: "search_web",
      description: "Search the live web for competitor analysis, news, or external facts.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "The search query (e.g. 'Teachmint features and pricing')" }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "check_status_page",
      description: "Check the live Classgrid Status Page for operational status and incidents.",
      parameters: {
        type: "object",
        properties: {},
        required: []
      }
    }
  },
  {
    type: "function",
    function: {
      name: "read_url",
      description: "Fetch and read the readable text content of any given webpage URL.",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string", description: "The full URL to fetch (e.g. 'https://classgrid.in/docs/introduction')" }
        },
        required: ["url"]
      }
    }
  }
];

function getProviderChain(channel?: "web" | "whatsapp" | "telegram"): LLMProvider[] {
  const providers: LLMProvider[] = [];

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    providers.push({
      name: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      apiKey: geminiKey,
      model: process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash",
    });
  }

  const mistralKey = process.env.MISTRAL_API_KEY?.trim();
  if (mistralKey) {
    providers.push({
      name: "mistral",
      url: "https://api.mistral.ai/v1/chat/completions",
      apiKey: mistralKey,
      model: process.env.MISTRAL_MODEL?.trim() || "mistral-small-latest",
    });
  }

  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  if (openRouterKey) {
    providers.push({
      name: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      apiKey: openRouterKey,
      model: process.env.OPENROUTER_MODEL?.trim() || "meta-llama/llama-3.2-3b-instruct:free",
    });
  }

  return providers;
}

export function getGroqModel(channel?: "web" | "whatsapp" | "telegram") {
  const chain = getProviderChain(channel);
  return chain.length > 0 ? chain[0].model : "gemini-3.5-flash";
}

// ── Response Extraction ──────────────────────────────────────────────────────

function extractResponse(data: unknown): { content: string | null; toolCalls?: any[] } {
  if (!data || typeof data !== "object") return { content: null };
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return { content: null };
  const first = choices[0] as any;
  return {
    content: first.message?.content || null,
    toolCalls: first.message?.tool_calls
  };
}

// ── Single Provider Request (Recursive for Tool Calls) ───────────────────────

async function tryProvider(
  provider: LLMProvider,
  messages: GroqMessage[],
  temperature: number,
  maxTokens: number,
  timeoutMs: number,
  onStatus?: (label: string) => void
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
        ...(provider.name !== "gemini" ? { max_tokens: maxTokens } : {}),
        tools: TOOLS,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`[llm:${provider.name}] HTTP ${response.status} ${body.slice(0, 300)}`);

      if (response.status === 429) {
        return { answer: null, rateLimited: true, error: "rate_limited" };
      }
      if (response.status === 401 || response.status === 403) {
        return { answer: null, rateLimited: false, error: "auth_failed" };
      }
      return { answer: null, rateLimited: false, error: `http_${response.status}` };
    }

    const result = extractResponse(await response.json());
    
    // Handle Tool Calling
    if (result.toolCalls && result.toolCalls.length > 0) {
      const call = result.toolCalls[0];
      console.log(`[llm:${provider.name}] 🔍 Using Tool: ${call.function.name}`);
      
      if (call.function.name === 'check_status_page') {
        console.log(`[llm:${provider.name}] 🌐 Checking Classgrid Status Page...`);
        onStatus?.("checking status");

        let statusResultText = "Failed to fetch status page.";
        try {
          const statusRes = await fetch("https://status.classgrid.in/api/v2/summary.json");
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            const indicator = statusData.status?.description || "Unknown Status";
            const components = (statusData.components || [])
              .map((c: any) => `- ${c.name}: ${c.status}`)
              .join('\n');
            const incidents = (statusData.incidents || [])
              .map((i: any) => `Incident: ${i.name} (Status: ${i.status})`)
              .join('\n');
            
            statusResultText = `Current Classgrid status is: ${indicator}.\n\nComponents:\n${components}\n\nIncidents:\n${incidents || "No active incidents."}`;
          }
        } catch (e) {
          console.error(`[llm:${provider.name}] Status check failed:`, e);
        }

        onStatus?.("analyzing");

        const nextMessages: GroqMessage[] = [
          ...messages,
          { role: "assistant", content: result.content || "", tool_calls: [call] },
          { role: "tool", tool_call_id: call.id, content: statusResultText }
        ];
        
        clearTimeout(timeout);
        return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus);
      } else if (call.function.name === 'read_url') {
        const args = JSON.parse(call.function.arguments);
        console.log(`[llm:${provider.name}] 🌐 Reading URL: "${args.url}"`);
        onStatus?.("reading page");
        
        let scrapeResultText = "Failed to fetch or parse the URL.";
        try {
          const res = await fetch(args.url);
          if (res.ok) {
            const html = await res.text();
            const $ = cheerio.load(html);
            $('script, style, noscript, iframe, img, svg').remove();
            scrapeResultText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 4000);
            if (!scrapeResultText) scrapeResultText = "Page was empty or unreadable.";
          } else {
            scrapeResultText = `Failed to fetch URL. HTTP Status: ${res.status}`;
          }
        } catch (e) {
          console.error(`[llm:${provider.name}] Read URL failed:`, e);
          scrapeResultText = `Failed to fetch URL: ${e instanceof Error ? e.message : String(e)}`;
        }

        onStatus?.("analyzing");
        
        const nextMessages: GroqMessage[] = [
          ...messages,
          { role: "assistant", content: result.content || "", tool_calls: [call] },
          { role: "tool", tool_call_id: call.id, content: scrapeResultText }
        ];
        
        clearTimeout(timeout);
        return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus);
      } else if (call.function.name === 'search_web') {
        const args = JSON.parse(call.function.arguments);
        console.log(`[llm:${provider.name}] 🌐 Searching: "${args.query}"`);
        onStatus?.("searching");
        
        let searchResultText = "No reliable search results found.";
        try {
          const tavilyKey = process.env.TAVILY_API_KEY?.trim();
          if (tavilyKey) {
            const tavilyRes = await fetch("https://api.tavily.com/search", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                api_key: tavilyKey,
                query: args.query,
                search_depth: "basic",
                include_answer: true,
                max_results: 3
              })
            });
            const searchData = await tavilyRes.json();
            if (searchData.answer) {
              // Include the answer plus the actual source URLs
              const sourceUrls = (searchData.results || []).map((r: any) => `- ${r.title}: ${r.url}`).join('\n');
              searchResultText = `${searchData.answer}\n\nSource URLs:\n${sourceUrls}`;
            } else if (searchData.results && searchData.results.length > 0) {
              searchResultText = searchData.results.map((r: any) => `${r.title} (${r.url})\n${r.content}`).join('\n\n');
            }
          } else {
            console.error(`[llm:${provider.name}] TAVILY_API_KEY is missing. Cannot perform live search.`);
            searchResultText = "Search failed because TAVILY_API_KEY is not configured in the server environment.";
          }
        } catch (e) {
          console.error(`[llm:${provider.name}] Search failed:`, e);
        }

        // Notify frontend that search is done, now analyzing
        onStatus?.("analyzing");

        // Recursively call the provider with the search results appended
        // IMPORTANT: We must only pass the specific tool call we processed,
        // otherwise strict providers (Mistral) throw "Not the same number of function calls and responses"
        const nextMessages: GroqMessage[] = [
          ...messages,
          { role: "assistant", content: result.content || "", tool_calls: [call] },
          { role: "tool", tool_call_id: call.id, content: searchResultText.slice(0, 2000) } // Cap at 2000 chars to save tokens
        ];
        
        // Give the recursive call a bit more timeout since we just used some up
        clearTimeout(timeout);
        return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus);
      }
    }

    if (result.content) {
      console.log(`[llm] ✓ ${provider.name} (${provider.model}) answered successfully.`);
    }
    return { answer: result.content || null, rateLimited: false };
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
  onStatus,
}: GroqChatOptions): Promise<string | null> {
  const chain = getProviderChain(channel);

  if (chain.length === 0) {
    console.error("[llm] No API keys configured (GEMINI_API_KEY, GROQ_API_KEY, or MISTRAL_API_KEY)");
    return null;
  }

  let allRateLimited = true;

  for (const provider of chain) {
    const result = await tryProvider(provider, messages, temperature, maxTokens, timeoutMs, onStatus);

    if (result.answer) {
      return result.answer;
    }

    if (!result.rateLimited) {
      allRateLimited = false;
    }

    if (result.rateLimited) {
      console.warn(`[llm] ${provider.name} rate-limited, trying next provider...`);
    } else if (result.error === "auth_failed") {
      console.warn(`[llm] ${provider.name} auth failed (bad key?), trying next provider...`);
    } else {
      console.warn(`[llm] ${provider.name} failed (${result.error}), trying next provider...`);
    }
  }

  if (allRateLimited) {
    console.error("[llm] All providers rate-limited");
    return "[RATE_LIMITED]";
  }

  console.error("[llm] All providers failed");
  return null;
}
