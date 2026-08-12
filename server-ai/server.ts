import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables from the parent Next.js .env file if available
dotenv.config({ path: "../.env" });
dotenv.config({ path: "../.env.local" });

import { generateClassgridRagAnswer, type ChatHistoryItem } from "../lib/ai/rag-answer";
import { normalizeText, type PageContext } from "../lib/ai/rag-content";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "classgrid-ai-backend" });
});

app.get("/", (req, res) => {
  res.json({
    name: "classgrid Ai",
    version: "3.0.0",
    status: "online",
    env: "production"
  });
});

type AskAiRequestBody = {
  question?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  history?: ChatHistoryItem[];
  sessionId?: string;
  pageContext?: PageContext;
};

const DEFAULT_ERROR_MESSAGE = "Unable to answer right now. Please try again.";

app.post("/api/ai/chat", async (req, res) => {
  try {
    const body = req.body as AskAiRequestBody;
    const question = normalizeText(body?.question);

    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const sendEvent = (data: Record<string, unknown>) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    try {
      sendEvent({ type: "status", label: "thinking" });

      const rawUserName = normalizeText(body?.userName);
      const firstName = rawUserName ? rawUserName.split(" ")[0] : undefined;
      const userEmail = body?.userEmail;
      const isGuest = !userEmail || userEmail === "anonymous@classgrid.in";
      const sessionId = body?.sessionId || `${userEmail || "guest"}-${Date.now()}`;

      const result = await generateClassgridRagAnswer({
        question,
        channel: "web",
        userName: firstName,
        userRole: normalizeText(body?.userRole),
        history: body?.history || [],
        pageContext: body?.pageContext,
        isGuest,
        onStatus: (label: string) => sendEvent({ type: "status", label }),
      });

      const answer = result.answer || DEFAULT_ERROR_MESSAGE;

      sendEvent({
        type: "answer",
        answer,
        sessionId,
        sources: result.sources.map((source) => ({
          documentId: source.documentId,
          documentType: source.documentType,
          pageTitle: source.pageTitle,
          pageSlug: source.pageSlug,
          section: source.section,
          sourceUrl: source.sourceUrl,
          score: source.score,
        })),
        retrieval: {
          chunks: result.sources.length,
          usedFallbackSearch: result.retrieval.usedFallbackSearch,
        },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[ask-ai:stream]", msg);
      sendEvent({ type: "error", error: DEFAULT_ERROR_MESSAGE });
    } finally {
      res.end();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ask-ai]", message);
    if (!res.headersSent) {
      res.status(500).json({ answer: DEFAULT_ERROR_MESSAGE });
    }
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Classgrid AI Server running on http://localhost:${PORT}`);
  console.log("----------------------------------------");
  console.log("✅ Groq API Key: " + (process.env.GROQ_API_KEY ? "Connected" : "Missing"));
  console.log("✅ OpenAI API Key: " + (process.env.OPENAI_API_KEY ? "Connected" : "Missing"));
  console.log("✅ Anthropic API Key: " + (process.env.ANTHROPIC_API_KEY ? "Connected" : "Missing"));
  console.log("✅ Mistral API Key: " + (process.env.MISTRAL_API_KEY ? "Connected" : "Missing"));
  console.log("✅ Gemini API Key: " + (process.env.GEMINI_API_KEY ? "Connected" : "Missing"));
  console.log("✅ RAG Engine: " + (process.env.RAG_ENABLED === "true" ? "Online" : "Offline"));
  console.log("----------------------------------------");

  // INITIATING PM2 SELF-DESTRUCT
  setTimeout(() => {
    console.error("💥 INITIATING PM2 SELF-DESTRUCT: STOPPING SERVER 💥");
    const { exec } = require("child_process");
    exec("pm2 stop classgrid-ai");
  }, 2000);
});
