# Future Architecture: Live Native Reasoning Streaming (Option B)

This document outlines the architectural plan for implementing **Live Reasoning Streaming** (similar to PostHog's Max AI assistant, which streams thoughts live even better than ChatGPT) in the Classgrid AI pipeline. 

This plan was explicitly designed for when the platform upgrades to a highly capable reasoning model (e.g., Claude 4 Sonnet, DeepSeek R1, or future native reasoning models) that supports clean, native reasoning streams without relying on fragile JSON tool calls.

---

## 1. The Core Philosophy (Why we abandoned JSON streaming)
Streaming JSON tool calls chunk-by-chunk is notoriously unstable. If a model forgets a single escape character (`\`) while streaming arguments like `{"thought": "The user...`, the stream crashes. 

Instead of a "Regex Stream Interceptor," this future architecture relies strictly on **Native SSE Stream Fields**. We will only parse standardized SSE chunks provided by the AI provider (e.g., `delta.reasoning_content` or Anthropic's `content_block_delta` with `type: "thought"`).

## 2. Required Backend Changes (`lib/ai/groq-chat.ts`)

Currently, `groq-chat.ts` uses a blocking `fetch` request. We must switch this to a streaming reader.

1. **Enable Streaming:** Add `"stream": true` to the provider API payload.
2. **Implement Stream Reader:** Use `response.body.getReader()` to process chunks as they arrive.
3. **Parse SSE Lines:** Split the chunks by `\n\n` and parse the `data: {...}` lines.
4. **Detect Reasoning Deltas:** 
   - Look for the provider-specific reasoning field in the delta.
   - For OpenAI/DeepSeek format: `if (delta.reasoning_content)`
   - For Anthropic format: `if (block.type === 'thought_delta')`
5. **Emit Live Chunks:** Call the `onThoughtChunk(deltaText)` callback instantly whenever a reasoning chunk is detected.
6. **Emit Final Answer:** Call `onAnswerChunk(deltaText)` for the standard text response.

## 3. Required API Route Changes (`app/api/ask-ai/route.ts`)

The SSE endpoint must be updated to bridge the backend reader to the frontend client.

1. Update the `generateClassgridRagAnswer` call to accept the new `onThoughtChunk` callback.
2. Inside `onThoughtChunk`, immediately enqueue the chunk to the client:
   ```typescript
   onThoughtChunk: (chunk: string) => {
     sendEvent({ type: "thought_chunk", text: chunk });
   }
   ```
3. Ensure that the Vercel/Next.js edge runtime does not buffer the stream. The headers `X-Accel-Buffering: no` and `Cache-Control: no-cache` are already in place but must be strictly enforced.

## 4. Required Frontend Changes (`components/layout/AskAiPanel.tsx`)

The frontend must seamlessly accept the rapidly incoming chunks and append them to the UI without flickering.

1. **State Update:**
   When `event.type === "thought_chunk"` is received, append it directly to the existing thought:
   ```typescript
   setMessages((prev) => {
     const lastMsg = prev[prev.length - 1];
     if (!lastMsg || lastMsg.role !== "assistant") return prev;
     return [
       ...prev.slice(0, -1),
       { ...lastMsg, thought: (lastMsg.thought || "") + event.text } // Append directly, no extra newlines
     ];
   });
   ```
2. **Framer Motion Optimization:**
   The `AccordionContent` height will animate dynamically as text flows in. Ensure that the `max-h-[400px] overflow-y-auto` container auto-scrolls to the bottom if the user has the accordion open while it generates.
3. **Closed by Default:**
   To prevent visual chaos, the Accordion should remain closed by default. Users who want to watch the AI "think" live can simply click it open while the message is streaming.

## 5. Security & Fallbacks
- **Graceful Degradation:** If the model selected does not support native reasoning streams, the system should gracefully fall back to the blocking method or standard text generation.
- **Sanity Logging:** Ensure that the fully concatenated thought is still saved to the `aiEscalation` logs in Sanity CMS for audit purposes, even if it was streamed to the client in chunks.
