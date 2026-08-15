# Guide: Agentic Status UI (Tool Calling Progress)

When you use tools like Vercel v0, Cloudflare, PostHog, or Antigravity IDE, you will notice that before the AI gives you the final answer, it shows a UI block that says something like `[Thinking...]`, `[Searching Web...]`, or `[Generating Code...]` for a few seconds.

This is **not** the AI outputting text. This is a UI pattern called **Agentic Status Streaming** (or Tool Calling Progress UI).

Here is exactly how these companies build it, and how your Classgrid AI server is already set up to do it!

---

## 1. How the Architecture Works

When the user sends a message, the server doesn't just wait 10 seconds and send back the whole text. Instead, it opens a **Server-Sent Events (SSE)** connection.

While the AI is "talking to itself" (deciding to call a tool, scraping a URL, or searching Google), the server sends **Status Events** down the stream. 

The React frontend listens to the stream. If it sees a `status` event, it renders a spinner or a loading pill. If it sees an `answer` event, it renders the chat bubble.

### Example SSE Stream:
```json
data: { "type": "status", "label": "thinking" }
// (Frontend shows a spinning brain: "Thinking...")

data: { "type": "status", "label": "searching web" }
// (Frontend changes spinner to a globe: "Searching the web...")

data: { "type": "status", "label": "analyzing" }
// (Frontend changes spinner to a magnifying glass: "Analyzing results...")

data: { "type": "answer", "text": "Hello! I found the answer..." }
// (Frontend hides the spinner and types out the actual message)
```

---

## 2. How Your Classgrid Server Does This Today

Your server is **already doing this!** 

If you look inside `server-ai/server.ts`, the very first thing it does when a request comes in is send a `thinking` status to the frontend:
```typescript
sendEvent({ type: "status", label: "thinking" });
```

If the AI decides it needs to search the internet, look inside `lib/ai/groq-chat.ts`. You will see these lines:
```typescript
console.log(`🌐 Searching Web for: "${args.query}"`);
onStatus?.("searching"); // This sends the status to the frontend!

// ... after search finishes ...
onStatus?.("analyzing"); 
```

---

## 3. How to Build the UI in React (AskAI Panel)

To make your Classgrid frontend look like Vercel v0 or Antigravity IDE, your React component (`AskAiPanel.tsx`) just needs to listen for those status events and show a UI element.

If you want to build this, you can copy and paste this exact prompt to ChatGPT or Claude:

> **Copy & Paste this to ChatGPT / Claude:**
> *"I have a Node.js SSE backend that streams AI responses. Before the final answer arrives, the backend streams status events like `data: {"type": "status", "label": "searching"}` or `{"type": "status", "label": "thinking"}`.*
> 
> *I want to build a React UI similar to Vercel v0 or Antigravity IDE. When the frontend receives a status event, it should show a temporary, animated loading pill (e.g., 'Thinking...' with a spinner). If the status changes to 'searching', the pill text should update. When the final `{"type": "answer", "text": "..."}` arrives, the status pill should disappear and the markdown text should render.*
> 
> *Can you provide the React/Tailwind code for this streaming message loop and the animated status pill?"*
