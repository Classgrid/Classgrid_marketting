# Classgrid AI Internal Reasoning (SaaS Level Implementation)

> **Date Implemented:** August 15, 2026
> **Purpose:** This document is the ultimate guide to building a "Hide reasoning" accordion in an AI application (Cloudflare / PostHog Style). We successfully built this highly complex, SaaS-level reasoning architecture into Classgrid AI today. This guide explains how it works, what we learned, and how to instruct future AI assistants to build it in the Platform repo if needed.

---

## 1. What We Achieved Today

Today, we successfully implemented a true **Enterprise JSON Agent Architecture**. 
We realized that AI providers (like OpenAI, Groq, Mistral) **never** give you this feature out of the box. There is no magic "Reasoning API" or "AI Library" (like Vercel AI SDK) that just gives you this box.

We built this manually using a very specific technique: **System Prompting + JSON Tool Calling**.

### Key Learnings:
1. **No Magic Library:** Vercel AI SDK handles streaming, but it does NOT create reasoning accordions. The logic must be custom-built.
2. **System Prompt Control:** We learned that the ONLY way to stop the AI from exposing internal technical jargon (like "RAG", "System Prompt", or "Cosine Similarity") to the end user is by adding a strict rule to its System Prompt demanding it speak like a professional human agent.
3. **Model Limitations:** We learned that smaller models (like Mistral) sometimes fail to execute the JSON tool call properly and instead output raw JSON arrays (`[{"type":"text"...]`) in the logs. Smarter models (like Llama 3.1 70B, GPT-4o) or custom regex interceptors are needed to ensure the reasoning always flows perfectly.

---

## 2. How the Architecture Actually Works

To achieve this in any repo, you need to force the AI to "think out loud" before it answers, capture that thought on the server, stream it separately to the React frontend, and render it in an Accordion.

### Step 1: The "Thought" Tool (Backend)
You must give the LLM a fake "Tool" (function call) that it must execute before answering.
```json
{
  "name": "internal_thought_process",
  "description": "CRITICAL: If you need to plan your response, you MUST call this tool FIRST. Never output raw thoughts as text.",
  "parameters": {
    "type": "object",
    "properties": {
      "thought": { "type": "string", "description": "Your internal reasoning." }
    },
    "required": ["thought"]
  }
}
```

### Step 2: The Strict System Prompt (Backend)
You must instruct the LLM to use this tool and act like a human. 
**Crucial Rule:** If you don't want the AI to leak internal words, you MUST tell it not to!
> *"THINKING RULE (CRITICAL): You must call the 'internal_thought_process' tool FIRST. CRITICAL: When writing your thought, DO NOT use internal developer terms like 'RAG', 'System Prompt', 'Backend', or 'Context'."*

### Step 3: SSE Streaming (Server -> Client)
When the Node/Next.js server detects the LLM calling the `internal_thought_process` tool, it extracts the JSON string, parses the text, and streams it to the frontend via Server-Sent Events (SSE) with a specific type:
`data: {"type": "thought", "thought": "The user is asking for a demo..."}`

### Step 4: The React Accordion (Frontend)
The React frontend (`AskAiPanel.tsx`) catches the `{"type": "thought"}` event and incrementally appends it to a `message.thought` state. If `message.thought` exists, the UI renders a Shadcn/BaseUI `<Accordion>` right above the final message content, dynamically toggling between "Hide reasoning" and "Show reasoning".

---

## 3. How to Build This in the Platform Repo (Future-Proofing)

If you are working with a new AI assistant in the future and want to port this SaaS-level feature to the **Classgrid Platform Repo**, **DO NOT** just say: *"Make it show thoughts like PostHog."* The AI will waste your time with string-matching hacks or tell you to install a library.

**Copy and paste this exact prompt to the new AI:**

> "I want to build a visible 'Reasoning/Thought' accordion in my React frontend, exactly like Cloudflare/PostHog. There is no magic library for this, so we must build the full JSON Tool Calling architecture.
> 
> 1. Add a dummy JSON tool called `internal_thought_process` to the backend LLM parameters.
> 2. Add a system prompt instructing the AI: 'You must call internal_thought_process before answering. Do not use technical jargon like RAG.'
> 3. In the backend server, intercept this tool call and stream the arguments down to the client via SSE as `{"type": "thought", "thought": "..."}`.
> 4. In the React frontend, catch the `thought` SSE event, store it in the message state, and render it using a Shadcn Accordion right above the final message.
> 
> Please implement this across my Next.js backend and React frontend."

---

## 4. Advanced Learnings on Model Behaviors (August 16 Update)

During rigorous testing with multiple AI models, we discovered crucial behavioral differences that impact how the reasoning accordion functions in production. **You cannot perfectly control the AI's internal brain**, you can only architect around its tendencies.

### The "Speed vs. Reasoning" Tradeoff
- **Gemini 3.5 Flash:** "Flash" models are heavily optimized for extreme speed and minimal latency. Because executing the `internal_thought_process` tool adds a server round-trip delay, Gemini Flash will frequently **skip the tool entirely** for simple prompts (like "hello") to give an instant answer. If the tool is skipped, the accordion never triggers unless a manual fallback is injected in the backend.
- **Mistral (Small):** Mistral is aggressively obedient to system prompts demanding tool usage. However, because it is a smaller model with less raw reasoning power, it struggles with complex logic traps. When stressed, Mistral will **stutter and loop its thoughts** multiple times inside the accordion (e.g., repeating its logic three times) before finally generating an answer.

### User Psychology of the "Thinking Loop"
- **Normal Users (Principals/Admins):** When a user opens the accordion and sees the AI looping and double-checking its own logic, they view it as **absolute magic**. They perceive the AI as highly intelligent and careful, which builds immense trust in the product.
- **AI Experts / Developers:** Engineers recognize the loop as a symptom of a small model processing complex logic, but they deeply respect the underlying architecture because it proves the existence of a true **Agentic Chain-of-Thought (CoT)** system rather than a basic chatbot.

### The Ultimate Enterprise Solution
To achieve perfect, simultaneous execution of massive workloads (e.g., processing huge RAG document payloads + Web Search + Internal Reasoning) without skipping tools or stuttering, small/free-tier models are insufficient. The architecture built here is perfect, but to scale it to production, you **must plug in a Flagship Enterprise Model** (the highest capability tier available from providers like OpenAI, Anthropic, or Google at the time of reading). These frontier-class models possess the vast reasoning capacity required to orchestrate complex agentic workflows flawlessly in a single pass.
