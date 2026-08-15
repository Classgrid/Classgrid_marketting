# Future Guide: Enabling AI Reasoning & Thinking Logs

This guide explains exactly how to add reasoning models (like DeepSeek R1 or OpenAI o3-mini) to your Classgrid backend in the future, so you can see the `🧠 [thinking]` block in your PM2 server logs.

> [!WARNING]  
> **OpenAI Hides Reasoning:** If you use an official OpenAI API Key (for models like `o1` or `o3-mini`), OpenAI explicitly hides the raw thinking process from the API response for "safety and competitive reasons." You will not see the `[thinking]` block with official OpenAI models.
> 
> **To see the thinking block, you MUST use DeepSeek R1 via OpenRouter or Groq.**

---

## 1. How to Add OpenRouter (DeepSeek R1)
If you get an OpenRouter API key, this is the best way to see the thinking block.

### Step 1: Add the API Key
On your AWS Server, open your `.env` file and add:
```bash
OPENROUTER_API_KEY="sk-or-v1-your-key-here"
```

### Step 2: Update `lib/ai/groq-chat.ts`
In `lib/ai/groq-chat.ts`, find the `getProviderChain` function and add the OpenRouter block to the very top:

```typescript
function getProviderChain(channel?: "web" | "whatsapp" | "telegram"): LLMProvider[] {
  const providers: LLMProvider[] = [];

  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  if (openRouterKey) {
    providers.push({
      name: "openrouter",
      url: "https://openrouter.ai/api/v1/chat/completions",
      apiKey: openRouterKey,
      model: "deepseek/deepseek-r1:free", 
    });
  }

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  // ... rest of the code ...
}
```

### Step 3: Add `include_reasoning` carefully!
To force OpenRouter to send the thinking block, you must add `include_reasoning: true` to the request payload. **However, you must only add it for OpenRouter**, otherwise Gemini and Mistral will crash!

Find the `tryProvider` function and update the `body` like this:

```typescript
      body: JSON.stringify({
        model: provider.model,
        messages,
        temperature,
        ...(provider.name !== "gemini" ? { max_tokens: maxTokens } : {}),
        
        // ONLY ADD THIS IF THE PROVIDER IS OPENROUTER OR GROQ
        ...(provider.name === "openrouter" || provider.name === "groq" ? { include_reasoning: true } : {}),
        
        tools: TOOLS,
      }),
```

---

## 2. How to Add Official OpenAI
If you get an official OpenAI API key, here is how to add it (remember, you won't see the thinking block).

### Step 1: Add the API Key
On your AWS Server, open your `.env` file and add:
```bash
OPENAI_API_KEY="sk-your-openai-key-here"
```

### Step 2: Update `lib/ai/groq-chat.ts`
Add the OpenAI block to `getProviderChain`:

```typescript
function getProviderChain(channel?: "web" | "whatsapp" | "telegram"): LLMProvider[] {
  const providers: LLMProvider[] = [];

  const openAIKey = process.env.OPENAI_API_KEY?.trim();
  if (openAIKey) {
    providers.push({
      name: "openai",
      url: "https://api.openai.com/v1/chat/completions",
      apiKey: openAIKey,
      model: "gpt-4o", // Or o3-mini
    });
  }

  // ... rest of the code ...
}
```

---

## 3. How the Thinking Block is Extracted
Your `groq-chat.ts` file already contains the perfect logic to extract and print the thinking block! You don't need to change this part.

Whenever an API returns a reasoning block, this code automatically catches it and prints it to your PM2 logs:

```typescript
    if (result.thinking) {
      console.log(`\n════════════════════════════════════════════════════════════`);
      console.log(`🧠 [thinking] ${provider.name.toUpperCase()} Internal Reasoning:`);
      console.log(`────────────────────────────────────────────────────────────`);
      console.log(result.thinking.trim());
      console.log(`════════════════════════════════════════════════════════════\n`);
    }
```
