import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env" });
dotenv.config({ path: "../.env.local" });

import { connectMongo } from "../lib/mongodb";
import { ModerationFlag } from "../lib/models/ModerationFlag";
import { AiRateLimit } from "../lib/models/AiRateLimit";
import { sendSafetyEmail } from "../lib/email";
import { getRedisClient } from "../lib/redis";
import { generateClassgridRagAnswer, type ChatHistoryItem } from "../lib/ai/rag-answer";
import { normalizeText, type PageContext } from "../lib/ai/rag-content";
import { saveMessageToSession, getSessionHistory } from "../lib/ai/chat-memory";

// @ts-ignore
import leoProfanity from "leo-profanity";

// ── Profanity filter setup (identical to route.ts) ───────────────────────────
leoProfanity.loadDictionary();

const customBadWords = [
  // English custom
  "kiss", "nude", "boobs", "sex", "porn", "kissing",

  // Hindi / Hinglish
  "bhenchod", "madarchod", "chutiya", "gandu", "bhosdike", "bhosadike",
  "bhosada", "randi", "harami", "kamine", "laude", "lawde", "loda", "lund",
  "chut", "gaand", "mutthal", "suar", "chod",

  // Marathi
  "zavadya", "zavnya", "aai zavadya", "chinal", "gandmarya", "bhosadichya",
  "bulli", "bocha", "bhadve", "yedzavya",

  // Devanagari Script (Hindi & Marathi)
  "बहनचोद", "मादरचोद", "चूतिया", "भोसड़ी", "रांडी", "गांड", "लौड़े",
  "लंड", "झवाड्या", "आईझवाड्या", "भडव्या", "चुतिया"
];

leoProfanity.add(customBadWords);

function containsProfanity(text: string): boolean {
  const hasCustomWord = customBadWords.some(word => {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(^|[^\\p{L}\\p{N}])${escapedWord}([^\\p{L}\\p{N}]|$)`, "iu");
    return regex.test(text);
  });
  return leoProfanity.check(text) || hasCustomWord;
}

// ── Types ─────────────────────────────────────────────────────────────────────
type AskAiRequestBody = {
  question?: string;
  userName?: string;
  userEmail?: string;
  userRole?: string;
  userContext?: Record<string, any>;
  history?: ChatHistoryItem[];
  sessionId?: string;
  pageContext?: PageContext;
  attachments?: { url: string; name: string; mimeType: string }[];
};

const DEFAULT_ERROR_MESSAGE = "Unable to answer right now. Please try again.";

// ── ESCALATE regex ────────────────────────────────────────────────────────────
const ESCALATE_RE = /\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/;
const ESCALATE_RE_G = /\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/g;

// ── Page context normalizer (identical to route.ts) ───────────────────────────
function normalizePageContext(input: unknown): PageContext | undefined {
  if (!input || typeof input !== "object") return undefined;
  const raw = input as Record<string, unknown>;
  const pageContext: PageContext = {
    path: normalizeText(raw.path),
    slug: normalizeText(raw.slug),
    title: normalizeText(raw.title),
    pageId: normalizeText(raw.pageId),
    locale: normalizeText(raw.locale),
    summary: normalizeText(raw.summary),
    hash: normalizeText(raw.hash),
    section: normalizeText(raw.section),
    previousPath: normalizeText(raw.previousPath),
    previousTitle: normalizeText(raw.previousTitle),
    pageHistory: Array.isArray(raw.pageHistory)
      ? raw.pageHistory.map((p: any) => ({
          path: normalizeText(p.path),
          title: normalizeText(p.title),
        }))
      : undefined,
  };
  return Object.values(pageContext).some(Boolean) ? pageContext : undefined;
}

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

// ── Health / root ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "OK", service: "classgrid-ai-backend" });
});

app.get("/", (_req, res) => {
  res.json({ name: "classgrid Ai", version: "5.0.0", status: "online", env: "production" });
});

// ── Main AI chat endpoint ─────────────────────────────────────────────────────
const aiChatHandler = async (req: express.Request, res: express.Response) => {
  try {
    const body = req.body as AskAiRequestBody;
    const question = normalizeText(body?.question);

    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    // Get IP for moderation
    const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
    const userEmail = body?.userEmail && body.userEmail !== "anonymous@classgrid.in" ? body.userEmail : undefined;

    // Connect to MongoDB
    await connectMongo();

    // ── 0. BAN CHECK ──────────────────────────────────────────────────────────
    let bannedUntil: Date | null = null;

    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    const queryConditions: any[] = [{ ipAddress: ip }];
    if (userEmail) queryConditions.push({ userEmail });

    const previousStrike = await ModerationFlag.findOne({
      $or: queryConditions,
      createdAt: { $gte: threeMinutesAgo },
    } as any);

    if (previousStrike) {
      bannedUntil = new Date(new Date(previousStrike.createdAt).getTime() + 3 * 60 * 1000);
    }

    // Cookie-based ban
    const cookieHeader = req.headers["cookie"] || "";
    const cookieMatch = cookieHeader.match(/ai_chat_restricted=([^;]+)/);
    const cookieValue = cookieMatch ? cookieMatch[1] : null;
    if (cookieValue && !bannedUntil) {
      const parsedTime = parseInt(cookieValue, 10);
      if (!isNaN(parsedTime) && parsedTime > Date.now()) {
        bannedUntil = new Date(parsedTime);
      } else if (cookieValue === "true") {
        bannedUntil = new Date(Date.now() + 3 * 60 * 1000);
      }
    }

    if (bannedUntil) {
      const banTimeStr = bannedUntil.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      return res.status(403).json({
        error: `Your access has been restricted due to safety policy violations. Access resumes at ${banTimeStr} IST.`,
        bannedUntil: bannedUntil.toISOString(),
      });
    }

    // Lightweight ban-check from frontend
    if (question === "__ban_check__") {
      return res.status(200).json({ status: "ok" });
    }

    // ── 1. PROFANITY / MODERATION CHECK ───────────────────────────────────────
    if (containsProfanity(question)) {
      try {
        const { createClient } = require("next-sanity");
        const writeClient = createClient({
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
          apiVersion: "2024-01-01",
          token: process.env.SANITY_API_WRITE_TOKEN,
          useCdn: false,
        });

        const identifier = userEmail || ip;
        const query = `*[_type == "safetyIncident" && (userEmail == $identifier || ipAddress == $identifier)][0]`;
        const existingIncident = await writeClient.fetch(query, { identifier });

        const newFlaggedMessage = {
          _key: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          message: question,
          timestamp: new Date().toISOString(),
        };

        if (existingIncident) {
          await writeClient
            .patch(existingIncident._id)
            .setIfMissing({ flaggedMessages: [] })
            .append("flaggedMessages", [newFlaggedMessage])
            .commit();
          console.log(`[Safety] Appended violation to existing Sanity incident for ${identifier}`);
          if (userEmail) {
            const strikeCount = (existingIncident.flaggedMessages?.length || 0) + 1;
            const flaggedMsgs = [...(existingIncident.flaggedMessages || []), newFlaggedMessage];
            await sendSafetyEmail(userEmail, body?.userName || "", strikeCount, flaggedMsgs);
          }
        } else {
          await writeClient.create({
            _type: "safetyIncident",
            userEmail: userEmail || "",
            userName: body?.userName || "",
            ipAddress: ip,
            device: req.headers["user-agent"] || "Unknown Device",
            status: "pending",
            flaggedMessages: [newFlaggedMessage],
          });
          console.log(`[Safety] Created new Sanity safety incident for ${identifier}`);
          if (userEmail) {
            await sendSafetyEmail(userEmail, body?.userName || "", 1, [newFlaggedMessage]);
          }
        }
      } catch (err) {
        console.error("[Safety] Failed to log incident to Sanity:", err);
      }
    }
    // ── END PROFANITY CHECK ───────────────────────────────────────────────────

    // ── 2. RATE LIMITING ──────────────────────────────────────────────────────
    const identifier = userEmail || ip;
    const MAX_MESSAGES = 35;
    const ONE_HOUR_MS = 60 * 60 * 1000;

    const rateLimitRecord = await AiRateLimit.findOne({ identifier });

    if (rateLimitRecord) {
      if (rateLimitRecord.count >= MAX_MESSAGES) {
        const resetAt = new Date(rateLimitRecord.expireAt);
        const minutesLeft = Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / 60000));
        const resetTimeStr = resetAt.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });
        return res.status(429).json({
          error: `You have reached your message limit. Your limit resets at ${resetTimeStr} (in ~${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}).`,
          resetAt: resetAt.toISOString(),
          minutesLeft,
        });
      }
      rateLimitRecord.count += 1;
      await rateLimitRecord.save();
    } else {
      await AiRateLimit.create({
        identifier,
        count: 1,
        expireAt: new Date(Date.now() + ONE_HOUR_MS),
      });
    }
    // ── END RATE LIMITING ─────────────────────────────────────────────────────

    // ── 3. REDIS SESSION MEMORY ───────────────────────────────────────────────
    const sessionId = body?.sessionId || `${identifier}-${Date.now()}`;
    const redisHistory = await getSessionHistory(sessionId);
    const mergedHistory = redisHistory.length > 0 ? redisHistory : body?.history || [];
    await saveMessageToSession(sessionId, { role: "user", content: question });
    // ── END REDIS MEMORY ──────────────────────────────────────────────────────

    // ── 4. SSE STREAMING RESPONSE ─────────────────────────────────────────────
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const sendEvent = (data: Record<string, unknown>) => {
      try { res.write(`data: ${JSON.stringify(data)}\n\n`); } catch (_) { }
    };

    try {
      sendEvent({ type: "status", label: "thinking" });

      const rawUserName = normalizeText(body?.userName);
      const firstName = rawUserName ? rawUserName.split(" ")[0] : undefined;
      const isGuest = !userEmail;

      const result = await generateClassgridRagAnswer({
        question,
        channel: "web",
        userName: firstName,
        fullName: rawUserName,
        userEmail,
        userRole: normalizeText(body?.userRole),
        userContext: body?.userContext,
        orgName: normalizeText(body?.orgName),
        history: mergedHistory,
        pageContext: normalizePageContext(body?.pageContext),
        attachments: body?.attachments,
        isGuest,
        onStatus: (label: string) => sendEvent({ type: "status", label }),
        onThought: (thought: string) => sendEvent({ type: "thought", content: thought }),
      });

      let answer = result.answer || DEFAULT_ERROR_MESSAGE;

      // ── ADDED BY AI: PRINT THE RAW LLM TEXT TO SERVER LOGS ──────────
      console.log(`\n════════════════════ RAW LLM OUTPUT ════════════════════`);
      console.log(answer);
      console.log(`════════════════════════════════════════════════════════\n`);

      // ── 5. ESCALATE TAG PROCESSING (full identical logic from route.ts) ───────
      let escalateMatch = answer.match(ESCALATE_RE);

      // HARD PROGRAMMATIC FAILSAFE: Prevent AI from auto-escalating prematurely
      if (escalateMatch) {
        const tempSummary = escalateMatch[1].toLowerCase();
        const questionLower = question.toLowerCase();

        // Check 1: AI summary itself indicates no real context
        const summaryLacksContext =
          tempSummary.includes("did not specify") ||
          tempSummary.includes("unspecified") ||
          tempSummary.includes("not yet described") ||
          tempSummary.includes("no specific");

        // Check 2: Very short message with no history
        const tooShortNoHistory = question.trim().length < 15 && (!body?.history || body.history.length === 0);

        // Check 3: Generic "contact team" with no specific details
        const genericContactPhrases = [
          /\b(i\s+have\s+a?\s*probl|help\s+me|tell\s+(your|the)\s+team|contact\s+(your|the)\s+team|message\s+(your|the)\s+team|send\s+(a\s+)?message|talk\s+to\s+(your|the)\s+team|reach\s+(your|the)\s+team|escalate|forward\s+(this|my))\b/i,
        ];
        const isGenericRequest = genericContactPhrases.some(p => p.test(questionLower));
        const hasSpecificDetails = /(\d{3,}|error|crash|bug|fail|wrong|missing|delete|lost|lock|ban|block|charg|paid|pay|fee|₹|rs\.|rupee|exam|mark|grade|result|attendance|login|password|otp)/i.test(questionLower);
        const vagueEscalation = isGenericRequest && !hasSpecificDetails;

        // Check 4: AI is asking for more details (contradicts escalating)
        const answerLower = answer.toLowerCase();
        const aiAskingForDetails = /what\s+(is|are)\s+(the|your)\s+(issue|problem|concern)|elaborate|more\s+details|tell\s+me\s+(more|what)|describe\s+(your|the)\s+(issue|problem)/i.test(answerLower);

        const isNoContext = summaryLacksContext || tooShortNoHistory || vagueEscalation || aiAskingForDetails;

        if (isNoContext) {
          answer = answer.replace(ESCALATE_RE_G, "").trim();
          const falseEscalationClaim = /\b(let me escalate|i('ll| will) (escalate|forward|send|share|summarize)|i('ve| have) (escalated|forwarded|sent|shared)|escalat(ed|ing) (this|your|it)|support team can prioritize)\b/i.test(answer);
          if (!answer || answer.length < 10 || falseEscalationClaim) {
            answer = "I completely understand your frustration, and I want to make sure we get this resolved for you. 🙏 Could you please describe the specific problem you are facing? Once I know the details, I'll escalate it to the support team right away.";
          }
          escalateMatch = null;
        }
      }

      // Prevent double escalation
      const escalationRedis = getRedisClient();
      const escalationKey = `ai:escalated:${sessionId}`;
      let alreadyEscalated = null;
      try {
        alreadyEscalated = escalationRedis ? await escalationRedis.get(escalationKey) : null;
      } catch (err) {
        console.error("[ask-ai:redis] Failed to check escalation key:", err);
      }

      if (escalateMatch && !alreadyEscalated) {
        const aiSummary = escalateMatch[1].trim();
        const aiSubject = escalateMatch[2]?.trim() || `AI Escalation: ${aiSummary.slice(0, 80)}`;
        const rawCategory = escalateMatch[3]?.trim().toLowerCase() || "general";
        const rawPriority = escalateMatch[4]?.trim().toLowerCase() || "medium";
        const aiCategory = rawCategory;
        const VALID_PRIORITIES: Record<string, string> = { low: "low", medium: "medium", high: "high", urgent: "high", critical: "high" };
        const aiPriority = VALID_PRIORITIES[rawPriority] || "medium";

        answer = answer.replace(ESCALATE_RE_G, "").trim();
        if (!answer || answer.length < 15) {
          answer = "I understand this is frustrating, especially with a deadline approaching. I've flagged this issue to our support team so they can look into it right away! 🙏";
        }

        const email = userEmail || body?.userEmail;
        let ticketCreated = false;
        let ticketId: string | null = null;

        if (email) {
          try {
            const formData = new FormData();
            formData.append("name", body?.userName || "AI Escalated User");
            formData.append("email", email);
            formData.append("subject", aiSubject);
            formData.append("message", `Auto-escalated from AI Chat.<br/><br/><strong>Original AI Categorization:</strong><br/>Category: ${rawCategory} | Priority: ${rawPriority}<br/><br/><strong>Problem Summary:</strong><br/>${aiSummary}<br/><br/><strong>Last User Message:</strong><br/>${question}`);
            formData.append("category", aiCategory);
            formData.append("priority", aiPriority);

            const backendUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";
            const ticketRes = await fetch(`${backendUrl}/api/support/public/tickets`, { method: "POST", body: formData });

            if (ticketRes.ok) {
              ticketCreated = true;
              try {
                const ticketResponse = await ticketRes.json();
                ticketId = ticketResponse?.ticket?._id || ticketResponse?.ticket?.id
                  || ticketResponse?.data?._id || ticketResponse?.data?.id
                  || ticketResponse?._id || ticketResponse?.id || null;
              } catch (_) { }
            } else {
              const errorText = await ticketRes.text();
              console.error("Ticket API failed with status", ticketRes.status, "body:", errorText);
              ticketId = `ERROR: ${ticketRes.status} ${errorText.substring(0, 100)}`;
            }
          } catch (e: any) {
            console.error("Failed to auto-create ticket:", e);
            ticketId = `CATCH_ERROR: ${e.message}`;
          }
        }

        // Log escalation to Sanity
        if (!isGuest) {
          try {
            const { createClient } = require("next-sanity");
            const writeClient = createClient({
              projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
              dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
              apiVersion: "2024-01-01",
              token: process.env.SANITY_API_WRITE_TOKEN,
              useCdn: false,
            });
            const deviceLog = req.headers["user-agent"] || "Unknown Device";
            await writeClient.create({
              _type: "aiEscalation",
              userEmail: email || "",
              userName: body?.userName || "",
              ipAddress: ip,
              deviceInfo: deviceLog,
              status: ticketCreated ? "handled" : "pending",
              ticketCreated,
              aiSummary,
              subject: aiSubject,
              ticketId: ticketId || "",
              chatTranscript: [
                { _key: `user-${Date.now()}`, role: "user", content: question, timestamp: new Date().toISOString() },
                { _key: `assistant-${Date.now() + 1}`, role: "assistant", content: answer, timestamp: new Date().toISOString() },
              ],
            });
          } catch (e) {
            console.error("Failed to log escalation to Sanity:", e);
          }
        }

        if (ticketCreated) {
          const ticketLink = ticketId
            ? `\n\n*✅ Support Ticket created! Your Ticket ID is **${ticketId}**. Track it here: [Support Requests](/support/requests/${ticketId}?email=${encodeURIComponent(email || "")})*`
            : "\n\n*✅ Support Ticket created! Track your request at [Support Requests](/support/requests).*";
          answer += ticketLink;
          if (escalationRedis) {
            try {
              await escalationRedis.set(escalationKey, JSON.stringify({ summary: aiSummary, subject: aiSubject, ticketId }), "EX", 3600);
            } catch (err) {
              console.error("[ask-ai:redis] Failed to set escalation key:", err);
            }
          }
        } else {
          if (email && email !== "anonymous@classgrid.in") {
            answer += "\n\n*Your request has been securely forwarded to the Classgrid team! They will review it shortly.* 🙏";
            if (escalationRedis) {
              try {
                await escalationRedis.set(escalationKey, JSON.stringify({ summary: aiSummary, subject: aiSubject, ticketId }), "EX", 3600);
              } catch (err) {
                console.error("[ask-ai:redis] Failed to set escalation key:", err);
              }
            }
          } else {
            answer = "Since you are not logged in, I cannot automatically create a support ticket. For a quick or instant message to our team, please use the **[Contact Page](/contact)**. For a more detailed conversation, please log in and use **[Classgrid Talk](/support/inquiry)**. 😊";
          }
        }

      } else if (escalateMatch && alreadyEscalated) {
        // AI tried to escalate again — ADD new context to existing ticket as a reply
        const newContext = escalateMatch[1]?.trim() || question;
        answer = answer.replace(ESCALATE_RE_G, "").trim();

        let updatedTicket = false;
        let savedTicketId: string | null = null;
        try {
          const savedEscalation = escalationRedis ? await escalationRedis.get(escalationKey) : null;
          if (savedEscalation && savedEscalation !== "true") {
            const parsed = JSON.parse(savedEscalation);
            savedTicketId = parsed.ticketId || null;
          }
        } catch (_) { }

        if (savedTicketId) {
          const email = userEmail || body?.userEmail;
          if (email) {
            try {
              const backendUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";
              const replyFormData = new FormData();
              replyFormData.append("email", email);
              replyFormData.append("name", body?.userName || "User");
              replyFormData.append("message", `<strong>Additional Context (via AI Chat):</strong><br/>${newContext}<br/><br/><strong>User's Message:</strong><br/>${question}`);

              const replyRes = await fetch(`${backendUrl}/api/support/public/tickets/${savedTicketId}/reply`, {
                method: "POST",
                body: replyFormData,
              });

              if (replyRes.ok) {
                updatedTicket = true;
              } else {
                console.error("[AI Update Ticket] Reply API failed:", replyRes.status, await replyRes.text());
              }
            } catch (e: any) {
              console.error("[AI Update Ticket] Failed to update ticket:", e.message);
            }
          }
        }

        if (updatedTicket) {
          if (!answer || answer.length < 15) {
            answer = "I've added your additional details to the existing support ticket. The team now has the full context of your issue! 🙏";
          } else {
            answer += `\n\n*✅ Your additional details have been added to your existing ticket (#${savedTicketId?.slice(0, 8)}). The support team will see the updated information.*`;
          }
        } else {
          if (!answer || answer.length < 15) {
            let escalationContext = "";
            try {
              const savedEscalation = escalationRedis ? await escalationRedis.get(escalationKey) : null;
              if (savedEscalation && savedEscalation !== "true") {
                const parsed = JSON.parse(savedEscalation);
                escalationContext = parsed.summary ? ` The problem I reported was: **${parsed.summary}**` : "";
              }
            } catch (_) { }
            answer = `Your issue has already been escalated to our support team! They are reviewing it now.${escalationContext} Is there anything else I can help you with? 😊`;
          }
        }
      }
      // ── END ESCALATE PROCESSING ───────────────────────────────────────────────

      // Save AI response to Redis session memory
      await saveMessageToSession(sessionId, { role: "assistant", content: answer });

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
};

app.post("/api/ai/chat", aiChatHandler);
app.post("/api/ask-ai", aiChatHandler);


// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const hasMistral = !!process.env.MISTRAL_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasTavily = !!process.env.TAVILY_API_KEY;
  const hasRedis = !!process.env.REDIS_URL;
  const hasRag = process.env.RAG_ENABLED === "true";
  const hasMongo = !!process.env.MONGO_URI;
  const hasSanity = !!process.env.SANITY_API_TOKEN;
  const hasAwsS3 = !!process.env.AWS_S3_BUCKET_NAME && !!process.env.AWS_REGION;
  const hasAwsSes = !!process.env.AWS_SES_SMTP_USER && !!process.env.AWS_SES_SMTP_PASS;
  const hasCloudflareR2 = !!process.env.NEW_R2_ACCESS_KEY_ID && !!process.env.NEW_R2_SECRET_ACCESS_KEY;
  const hasFirebase = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const hasSupabase = !!process.env.SUPABASE_CHAT_URL;
  const hasAgora = !!process.env.AGORA_APP_ID;
  const hasRazorpay = !!process.env.RAZORPAY_KEY_ID;
  const hasZoom = !!process.env.ZOOM_CLIENT_ID;

  const hasRecaptcha = !!process.env.RECAPTCHA_SECRET;
  const hasResend = !!process.env.RESEND_API_KEY;
  const hasBrevo = !!process.env.BREVO_SMTP_HOST;
  const hasGoogleOAuth = !!process.env.GOOGLE_CLIENT_ID;
  const hasGithubOAuth = !!process.env.GITHUB_CLIENT_ID;

  console.log(`🚀 Classgrid AI Server running on http://localhost:${PORT}`);
  console.log("----------------------------------------");
  console.log("✅ Groq API Key:      " + (process.env.GROQ_API_KEY ? "Connected" : "❌ Missing"));
  console.log("✅ OpenAI API Key:    " + (process.env.OPENAI_API_KEY ? "Connected" : "❌ Missing"));
  console.log("✅ Anthropic API Key: " + (process.env.ANTHROPIC_API_KEY ? "Connected" : "❌ Missing"));
  console.log(`✅ Mistral API:       ${hasMistral ? "Connected" : "❌ Missing"}`);
  console.log(`✅ Gemini API:        ${hasGemini ? "Connected" : "❌ Missing"}`);
  console.log(`✅ Tavily API:        ${hasTavily ? "Connected" : "❌ Missing"}`);
  console.log(`✅ Redis:             ${hasRedis ? "Configured" : "❌ Missing"}`);
  console.log(`✅ RAG Engine:        ${hasRag ? "Online" : "Offline"}`);
  console.log(`✅ MongoDB:           ${hasMongo ? "Configured" : "❌ Missing"}`);
  console.log(`✅ Sanity CMS:        ${hasSanity ? "Connected" : "❌ Missing"}`);
  console.log(`✅ AWS S3:            ${hasAwsS3 ? "Configured" : "❌ Missing"}`);
  console.log(`✅ AWS SES:           ${hasAwsSes ? "Configured" : "❌ Missing"}`);
  console.log(`✅ Cloudflare R2:     ${hasCloudflareR2 ? "Configured" : "❌ Missing"}`);
  console.log(`✅ Firebase Admin:    ${hasFirebase ? "Configured" : "❌ Missing"}`);
  console.log(`✅ Supabase:          ${hasSupabase ? "Connected" : "❌ Missing"}`);
  console.log(`✅ Brevo Email:       ${hasBrevo ? "Configured" : "❌ Missing"}`);
  console.log(`✅ Agora Video:       ${hasAgora ? "Configured" : "❌ Missing"}`);
  console.log(`✅ Razorpay:          ${hasRazorpay ? "Connected" : "❌ Missing"}`);
  console.log(`✅ Zoom API:          ${hasZoom ? "Configured" : "❌ Missing"}`);

  console.log(`✅ ReCAPTCHA:         ${hasRecaptcha ? "Configured" : "❌ Missing"}`);
  console.log(`✅ Resend Email:      ${hasResend ? "Configured" : "❌ Missing"}`);
  console.log(`✅ Google OAuth:      ${hasGoogleOAuth ? "Configured" : "❌ Missing"}`);
  console.log(`✅ GitHub OAuth:      ${hasGithubOAuth ? "Configured" : "❌ Missing"}`);
  console.log("----------------------------------------");
});
