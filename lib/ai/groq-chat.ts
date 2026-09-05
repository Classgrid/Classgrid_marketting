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
  onThought?: (thought: string) => void;
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
      name: "internal_thought_process",
      description: "CRITICAL: If you need to plan your response, analyze rules, or think step-by-step before answering the user, you MUST call this tool FIRST. Never output raw thoughts as text.",
      parameters: {
        type: "object",
        properties: {
          thought: { type: "string", description: "Your internal reasoning, step-by-step plan, or thought process." }
        },
        required: ["thought"]
      }
    }
  },
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

  const mistralKey = process.env.MISTRAL_API_KEY?.trim();
  if (mistralKey) {
    providers.push({
      name: "mistral",
      url: "https://api.mistral.ai/v1/chat/completions",
      apiKey: mistralKey,
      model: process.env.MISTRAL_MODEL?.trim() || "mistral-small-latest",
    });
  }

  const mistralKey2 = process.env.MISTRAL_API_KEY_2?.trim();
  if (mistralKey2) {
    providers.push({
      name: "mistral-fallback",
      url: "https://api.mistral.ai/v1/chat/completions",
      apiKey: mistralKey2,
      model: process.env.MISTRAL_MODEL?.trim() || "mistral-small-latest",
    });
  }

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (geminiKey) {
    providers.push({
      name: "gemini",
      url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      apiKey: geminiKey,
      model: "gemini-3.5-flash",
    });
  }

  return providers;
}

export function getGroqModel(channel?: "web" | "whatsapp" | "telegram") {
  const chain = getProviderChain(channel);
  return chain.length > 0 ? chain[0].model : "gemini-3.5-flash";
}

// ── Response Extraction ──────────────────────────────────────────────────────

function extractResponse(data: unknown): { content: string | null; toolCalls?: any[]; thinking?: string | null } {
  if (!data || typeof data !== "object") return { content: null, thinking: null };
  const choices = (data as { choices?: unknown }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return { content: null, thinking: null };
  const first = choices[0] as any;
  const message = first.message || {};

  // 1. Check standard API fields for universal thinking extraction
  let thinking = message.reasoning_content || message.thinking || message.thought || message.thinkingContent || message.reasoning || null;
  let content = message.content;

  // 2. Handle Anthropic / OpenRouter Array Format
  if (Array.isArray(content)) {
    let textParts: string[] = [];
    for (const block of content) {
      if (typeof block === 'string') {
        textParts.push(block);
      } else if (block.type === 'thinking') {
        if (typeof block.thinking === 'string') {
          thinking = block.thinking;
        } else if (Array.isArray(block.thinking)) {
          thinking = block.thinking
            .filter((t: any) => t.type === 'text' && t.text)
            .map((t: any) => t.text)
            .join('\n');
        } else {
          thinking = JSON.stringify(block.thinking);
        }
      } else if (block.type === 'text' || block.text) {
        textParts.push(block.text);
      }
    }
    content = textParts.join("\n");
  } else if (typeof content === "object" && content !== null) {
    content = JSON.stringify(content);
  }

  // 3. Handle Raw String Leaks (DeepSeek <think> or OpenRouter JSON)
  if (typeof content === "string") {
    // Check for DeepSeek style: <think>...</think>
    const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
    if (thinkMatch) {
      if (!thinking) thinking = thinkMatch[1].trim();
      content = content.replace(/<think>[\s\S]*?<\/think>\n?/g, "").trim();
    }

    // Check for JSON leak style (Mistral often leaks `[{"type":"text"...` instead of calling the tool)
    let cleanForJsonCheck = content.trim();
    const codeBlockMatch = cleanForJsonCheck.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (codeBlockMatch) {
      cleanForJsonCheck = codeBlockMatch[1].trim();
    }

    if (cleanForJsonCheck.startsWith('{') || cleanForJsonCheck.startsWith('[')) {
      try {
        const parsed = JSON.parse(cleanForJsonCheck);

        // It successfully parsed as JSON, meaning Mistral leaked JSON into the content block!
        thinking = content;

        // 2. Extract ONLY the real answer text to show as the final reply
        if (Array.isArray(parsed)) {
          const textBlocks = parsed.filter(b => (b.type === "text" || b.type === "answer") && b.text);
          if (textBlocks.length > 0) {
            content = textBlocks.map(b => b.text).join('\n');
          } else {
            content = "I am processing your request.";
          }
        } else if (parsed.text) {
          content = parsed.text;
        } else {
          content = "I am processing your request.";
        }
      } catch (e) {
        // Not valid JSON, but still might be a leaked array with literal newlines
        let rawStr = cleanForJsonCheck;

        // CRITICAL FIX: If this is a leaked tool call (especially internal_thought_process), wipe it out entirely.
        if (rawStr.includes('"type": "tool"') || rawStr.includes('"internal_thought_process"')) {
          thinking = rawStr;
          content = "I am processing your request.";
        } else {
          // Aggressively strip `[{"type": "text", "text": "` and `"}]`
          rawStr = rawStr.replace(/^\[?\s*\{\s*"type"\s*:\s*"text"\s*,\s*"text"\s*:\s*"/i, "");
          rawStr = rawStr.replace(/"\s*\}\s*\]?$/, "");

          // Replace escaped newlines if any
          rawStr = rawStr.replace(/\\n/g, "\n");
          // Replace escaped quotes
          rawStr = rawStr.replace(/\\"/g, '"');

          content = rawStr;
        }
      }
    }
  }

  return {
    content: content || null,
    toolCalls: message.tool_calls,
    thinking: thinking
  };
}

// ── Single Provider Request (Recursive for Tool Calls) ───────────────────────

async function tryProvider(
  provider: LLMProvider,
  messages: GroqMessage[],
  temperature: number,
  maxTokens: number,
  timeoutMs: number,
  onStatus?: (label: string) => void,
  onThought?: (thought: string) => void,
  depth: number = 0
): Promise<{ answer: string | null; rateLimited: boolean; error?: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = Date.now();

  console.log(`\n🚀 [llm] Requesting answer from ${provider.name.toUpperCase()} (${provider.model})...`);

  try {
    const alreadyThought = messages.some(m =>
      m.tool_calls && m.tool_calls.some(tc => tc.function.name === 'internal_thought_process')
    );
    const currentTools = alreadyThought
      ? TOOLS.filter(t => t.function.name !== 'internal_thought_process')
      : TOOLS;

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
        reasoning_effort: "high", // Tell capable models to think hard
        tools: currentTools,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error(`❌ [llm:${provider.name}] HTTP ${response.status} Error: ${body.slice(0, 300)}`);

      if (response.status === 429) {
        return { answer: null, rateLimited: true, error: "rate_limited" };
      }
      if (response.status === 401 || response.status === 403) {
        return { answer: null, rateLimited: false, error: "auth_failed" };
      }
      return { answer: null, rateLimited: false, error: `http_${response.status}` };
    }

    const data = await response.json();

    // ── ADDED BY AI: PRINT THE RAW PROVIDER JSON TO SERVER LOGS ──────────
    console.log(`\n════════════════ RAW PROVIDER RESPONSE ════════════════`);
    console.log(JSON.stringify(data, null, 2));
    console.log(`═══════════════════════════════════════════════════════\n`);

    const result = extractResponse(data);
    const usage = (data as any).usage ? `[Tokens: ${(data as any).usage.total_tokens || 'Unknown'}]` : '';

    if (result.thinking) {
      console.log(`\n════════════════════════════════════════════════════════════`);
      console.log(`🧠 [thinking] ${provider.name.toUpperCase()} Internal Reasoning:`);
      console.log(`────────────────────────────────────────────────────────────`);
      console.log(result.thinking.trim());
      console.log(`════════════════════════════════════════════════════════════\n`);
      onThought?.(result.thinking.trim());
    }

    // Handle Tool Calling
    if (result.toolCalls && result.toolCalls.length > 0) {

      const isDeepSearch = messages.some(m => m.role === "user" && (m.content.toLowerCase().includes("deep search") || m.content.toLowerCase().includes("exhaustive")));
      const maxDepth = isDeepSearch ? 8 : 5;

      if (depth >= maxDepth) {
        console.error(`❌ [llm:${provider.name}] Maximum tool call depth (${maxDepth}) reached. Aborting loop.`);
        const attemptedTool = result.toolCalls[0]?.function?.name || "unknown";
        console.error(`❌ [llm:${provider.name}] The AI was trying to call tool: "${attemptedTool}" when it was aborted.`);
        return { answer: "I searched the web, but I couldn't find a clear answer or any verified details about that. Could you try rephrasing your question or providing a bit more context?", rateLimited: false, error: "max_depth" };
      }

      const call = result.toolCalls[0];
      console.log(`🛠️  [llm:${provider.name}] Tool Call Triggered: ${call.function.name} (Depth: ${depth + 1}/${maxDepth})`);

      if (call.function.name === 'internal_thought_process') {
        // DUPLICATE THOUGHT BLOCKER
        const alreadyThought = messages.some(m =>
          m.tool_calls && m.tool_calls.some(tc => tc.function.name === 'internal_thought_process')
        );
        if (alreadyThought) {
          console.error(`⚠️ [llm:${provider.name}] Blocked duplicate internal_thought_process call.`);
          const nextMessages: GroqMessage[] = [
            ...messages,
            { role: "assistant", content: result.content || "", tool_calls: [call] },
            { role: "tool", tool_call_id: call.id, content: "ERROR: You have ALREADY used the internal_thought_process tool. You MUST NOW use an external tool like 'search_web' to gather information, or provide your final answer." }
          ];
          clearTimeout(timeout);
          return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus, onThought, depth + 1); // punish for repeating
        }

        let args;
        try {
          args = JSON.parse(call.function.arguments);
        } catch (e) {
          console.error(`❌ [llm:${provider.name}] Bad JSON in thought arguments:`, call.function.arguments);
          const nextMessages: GroqMessage[] = [
            ...messages,
            { role: "assistant", content: result.content || "", tool_calls: [call] },
            { role: "tool", tool_call_id: call.id, content: "Error: Invalid JSON arguments. Please correct and try again." }
          ];
          clearTimeout(timeout);
          return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus, onThought, depth + 1);
        }

        console.log(`\n════════════════════════════════════════════════════════════`);
        console.log(`🧠 [thinking via tool] ${provider.name.toUpperCase()} Internal Reasoning:`);
        console.log(`────────────────────────────────────────────────────────────`);
        console.log(args.thought);
        console.log(`════════════════════════════════════════════════════════════\n`);

        onThought?.(args.thought);
        onStatus?.("analyzing");

        const nextMessages: GroqMessage[] = [
          ...messages,
          { role: "assistant", content: result.content || "", tool_calls: [call] },
          { role: "tool", tool_call_id: call.id, content: "Thought logged successfully. Please provide your final answer to the user now." }
        ];

        clearTimeout(timeout);
        // CRITICAL FIX: Do NOT increment depth for thoughts so we don't punish the model for reasoning!
        return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus, onThought, depth);
      } else if (call.function.name === 'check_status_page') {
        console.log(`🌐 [llm:${provider.name}] Checking Classgrid Status Page...`);
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
          console.error(`❌ [llm:${provider.name}] Status check failed:`, e);
        }

        onStatus?.("analyzing");

        const nextMessages: GroqMessage[] = [
          ...messages,
          { role: "assistant", content: result.content || "", tool_calls: [call] },
          { role: "tool", tool_call_id: call.id, content: statusResultText }
        ];

        clearTimeout(timeout);
        return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus, onThought, depth + 1);
      } else if (call.function.name === 'read_url') {
        let args;
        try {
          args = JSON.parse(call.function.arguments);
        } catch (e) {
          console.error(`❌ [llm:${provider.name}] Bad JSON in tool arguments:`, call.function.arguments);
          const nextMessages: GroqMessage[] = [
            ...messages,
            { role: "assistant", content: result.content || "", tool_calls: [call] },
            { role: "tool", tool_call_id: call.id, content: "Error: Invalid JSON arguments. Please correct and try again." }
          ];
          clearTimeout(timeout);
          return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus, onThought, depth + 1);
        }

        // DUPLICATE URL BLOCKER
        const alreadyRead = messages.some(m =>
          m.tool_calls && m.tool_calls.some(tc => tc.function.name === 'read_url' && tc.function.arguments.includes(args.url))
        );
        if (alreadyRead) {
          console.error(`⚠️ [llm:${provider.name}] Blocked duplicate read_url call for: "${args.url}"`);
          const nextMessages: GroqMessage[] = [
            ...messages,
            { role: "assistant", content: result.content || "", tool_calls: [call] },
            { role: "tool", tool_call_id: call.id, content: "ERROR: You have ALREADY read this exact URL in this conversation. Do NOT read it again. Please use the context you already gathered to provide your final answer to the user immediately." }
          ];
          clearTimeout(timeout);
          return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus, onThought, depth + 1);
        }

        console.log(`🌐 [llm:${provider.name}] Reading URL: "${args.url}"`);
        onStatus?.("reading page");

        let scrapeResultText = "Failed to fetch or parse the URL.";
        try {
          const scrapeController = new AbortController();
          const scrapeTimeout = setTimeout(() => scrapeController.abort(), 20000); // 20 second strict timeout

          const res = await fetch(args.url, {
            signal: scrapeController.signal,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.9',
            },
          });
          clearTimeout(scrapeTimeout);

          if (res.ok) {
            const html = await res.text();
            const $ = cheerio.load(html);
            $('script, style, noscript, iframe, img, svg, nav, footer, header').remove();
            scrapeResultText = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 6000);
            if (!scrapeResultText) scrapeResultText = "Page was empty or unreadable.";
            console.log(`✅ [llm:${provider.name}] Successfully read URL: "${args.url}" (Extracted ${scrapeResultText.length} characters)`);
          } else {
            scrapeResultText = `Failed to fetch URL. HTTP Status: ${res.status}`;
            console.error(`❌ [llm:${provider.name}] Failed to read URL: "${args.url}" (HTTP ${res.status})`);
          }
        } catch (e) {
          console.error(`❌ [llm:${provider.name}] Read URL failed:`, e);
          scrapeResultText = `Failed to fetch URL: ${e instanceof Error ? e.message : String(e)}`;
        }

        onStatus?.("analyzing");

        const nextMessages: GroqMessage[] = [
          ...messages,
          { role: "assistant", content: result.content || "", tool_calls: [call] },
          { role: "tool", tool_call_id: call.id, content: scrapeResultText }
        ];

        clearTimeout(timeout);
        return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus, onThought, depth + 1);
      } else if (call.function.name === 'search_web') {
        let args;
        try {
          args = JSON.parse(call.function.arguments);
        } catch (e) {
          console.error(`❌ [llm:${provider.name}] Bad JSON in tool arguments:`, call.function.arguments);
          const nextMessages: GroqMessage[] = [
            ...messages,
            { role: "assistant", content: result.content || "", tool_calls: [call] },
            { role: "tool", tool_call_id: call.id, content: "Error: Invalid JSON arguments. Please correct and try again." }
          ];
          clearTimeout(timeout);
          return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus, onThought, depth + 1);
        }
        console.log(`🌐 [llm:${provider.name}] Searching Web for: "${args.query}"`);
        onStatus?.("searching");

        let searchResultText = "No reliable search results found.";
        try {
          const searchController = new AbortController();
          const searchTimeout = setTimeout(() => searchController.abort(), 20000); // 20 second strict timeout

          const tavilyKey = process.env.TAVILY_API_KEY?.trim();
          if (tavilyKey) {
            const tavilyRes = await fetch("https://api.tavily.com/search", {
              method: "POST",
              signal: searchController.signal,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                api_key: tavilyKey,
                query: args.query,
                search_depth: "advanced",
                include_answer: true,
                max_results: 5
              })
            });
            clearTimeout(searchTimeout);
            const searchData = await tavilyRes.json();

            console.log(`\n================ TAVILY SEARCH LOG ================`);
            console.log(`🔍 Query: "${args.query}"`);
            console.log(`📡 Status: ${tavilyRes.status}`);

            let combinedResults = "";
            if (searchData.answer) {
              combinedResults += `[Tavily Summary]:\n${searchData.answer}\n\n`;
              console.log(`📝 Tavily AI Answer:`, searchData.answer);
            }
            if (searchData.results && searchData.results.length > 0) {
              console.log(`📄 Found ${searchData.results.length} organic results.`);
              // [AI FIX]: Commented out to prevent massive 25k+ character token explosions. Testing Option 1 (Tavily Summary Only).
              // combinedResults += `[Raw Page Contents]:\n` + searchData.results.map((r: any) => `${r.title} (${r.url})\n${r.content}`).join('\n\n');
            }

            if (combinedResults.trim().length > 0) {
              searchResultText = combinedResults;
              console.log(`✅ [llm:${provider.name}] Successfully searched web. Passing ${searchResultText.length} characters of text to Mistral.`);
              console.log(`===================================================\n`);
            } else {
              console.log(`⚠️ [llm:${provider.name}] Web search returned NO results for: "${args.query}"`);
              console.log(`===================================================\n`);
            }
          } else {
            console.error(`❌ [llm:${provider.name}] TAVILY_API_KEY is missing. Cannot perform live search.`);
            searchResultText = "Search failed because TAVILY_API_KEY is not configured in the server environment.";
          }
        } catch (e) {
          console.error(`❌ [llm:${provider.name}] Web Search failed:`, e);
        }

        onStatus?.("analyzing");

        const nextMessages: GroqMessage[] = [
          ...messages,
          { role: "assistant", content: result.content || "", tool_calls: [call] },
          { role: "tool", tool_call_id: call.id, content: searchResultText.slice(0, 4000) }
        ];

        clearTimeout(timeout);
        return tryProvider(provider, nextMessages, temperature, maxTokens, timeoutMs, onStatus, onThought, depth + 1);
      }
    }

    // Removed duplicate thinking log

    if (result.content) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✅ [llm] ${provider.name.toUpperCase()} answered successfully in ${duration}s! ${usage}`);
    }
    return { answer: result.content || null, rateLimited: false };
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    const message = error instanceof Error ? error.message : String(error);
    if (name === "AbortError" || message.toLowerCase().includes("abort")) {
      console.warn(`⚠️ [llm:${provider.name}] Aborted due to timeout after ${timeoutMs}ms`);
    } else {
      console.error(`❌ [llm:${provider.name}] Fatal error:`, message);
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
  timeoutMs = 15000,
  onStatus,
  onThought,
}: GroqChatOptions): Promise<string | null> {
  const chain = getProviderChain(channel);

  if (chain.length === 0) {
    console.error("[llm] No API keys configured (GEMINI_API_KEY, GROQ_API_KEY, or MISTRAL_API_KEY)");
    return null;
  }

  let allRateLimited = true;

  for (const provider of chain) {
    const result = await tryProvider(provider, messages, temperature, maxTokens, timeoutMs, onStatus, onThought);

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
