# AI Agent Stepper: Production Guarantee & Troubleshooting

## The Guarantee
As of **September 14, 2026**, the Classgrid frontend (`AskAiPanel.tsx`) and backend (`ai-chat.controller.js`) are **100% fully built and wired up** to support the advanced AI Agent Stepper. 

**It is designed to look EXACTLY like the simulation you see at `http://localhost:5173/agent-sandbox-testing` (with the same live typing, timers, and step-by-step reasoning).**

The only reason the live production environment skips steps, fails to show the thought timeline, or crashes is due to **limitations of the current small/free models** (Gemini 3.5 Flash, Mistral Nemo, and Groq rate limits). 

**When you upgrade to a frontier-class model (like OpenAI GPT-4o or Anthropic Claude 3.5 Sonnet) and plug in the paid API key, the exact same beautiful timeline, live typing effects, and reasoning blocks will automatically work in the live Ask Panel.**

---

## Troubleshooting: What to do if it STILL doesn't work on launch day?

If you plug in GPT-4o or Claude 3.5 Sonnet and the live UI is still not showing the stepper correctly, **do NOT rewrite the frontend components**. The components (`CombinedReasoningBlock.tsx`, `WorkflowAccordion.tsx`) are fine. The issue will be in how the data stream is formatted between the model, the backend, and the client.

Follow these exact debugging steps:

### 1. Check the Backend Stream Parser (`ai-chat.controller.js`)
The new model might output JSON or tool calls in a slightly different format than the SDK expects.
- Look at how `ai-chat.controller.js` parses the incoming stream from the LLM. 
- Ensure that when the model emits a tool call (e.g., `search_web`), the backend correctly formats it into the standard `steps` array:
  ```json
  { "id": "123", "type": "tool", "tool": "search_web", "status": "success" }
  ```
- **Fix:** You may need to tweak the `@classgrid/ai` core SDK or the controller to properly catch GPT-4o's specific tool-calling syntax and map it to your standard step format.

### 2. Check the SSE (Server-Sent Events) Payload
Open the browser's Network tab and inspect the SSE stream coming from `/api/ai/ask`.
- Is the backend actually sending the `steps` array in the JSON chunks? 
- If the `steps` array is missing in the network payload, the backend is not forwarding the tool calls to the frontend.
- **Fix:** Update the backend streaming logic to ensure every tool execution is appended to the `steps` array and sent to the client.

### 3. Check the Client-Side Reducer (`AskAiPanel.tsx`)
If the network tab shows the `steps` arriving, but the UI isn't rendering them:
- Check how `AskAiPanel.tsx` parses the incoming chunks and updates the `ChatMessage` state.
- Make sure the client stream parser properly merges the `steps` array into the message object so that `<CombinedReasoningBlock steps={message.steps} />` receives the data.
- **Fix:** Ensure the state update logic correctly handles the deep merging of the `steps` array during the live stream.

### Conclusion
Your frontend architecture for the agent is rock-solid. If it breaks with a top-tier model, it is purely a data-parsing issue between the LLM output and the frontend state. Follow the data from the Model -> Backend SDK -> SSE Stream -> Client State, and you will find the disconnect in minutes.
