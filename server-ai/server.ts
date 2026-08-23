import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env" });
dotenv.config({ path: "../.env.local" });

import { connectMongo } from "../lib/mongodb";
import { ModerationFlag } from "../lib/models/ModerationFlag";
import { AiRateLimit } from "../lib/models/AiRateLimit";
import { sendSafetyEmail, sendFailedEscalationEmail, sendTicketCreatedEscalationEmail, sendFollowUpAlertEmail } from "../lib/email";
import mongoose from "mongoose";
import { getRedisClient } from "../lib/redis";
import { generateClassgridRagAnswer, type ChatHistoryItem } from "../lib/ai/rag-answer";
import { normalizeText, type PageContext } from "../lib/ai/rag-content";
import { saveMessageToSession, getSessionHistory } from "../lib/ai/chat-memory";

// @ts-ignore
import leoProfanity from "leo-profanity";
import cron from "node-cron";
import nodemailer from "nodemailer";
import { WhatsAppUsage } from "../lib/models/WhatsAppUsage";
import { getWhatsAppDailyTrackerEmailHtml } from "../lib/email-templates";

import { startEmailPoller, getEmailPollerStatus } from "../lib/email-ai/email-poller";

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
// Uses negative lookahead so the summary group stops at | SUBJECT: / | CATEGORY: / | PRIORITY: / | DRAFT:
// This prevents ] inside AI summary (e.g. "[number]") from breaking the match.
const ESCALATE_SUMMARY_GROUP = `((?:(?!\\s*\\|\\s*(?:SUBJECT|CATEGORY|PRIORITY|DRAFT):)[\\s\\S])+?)`;
const ESCALATE_RE = new RegExp(
  `\\[ESCALATE:\\s*${ESCALATE_SUMMARY_GROUP}(?:\\s*\\|\\s*SUBJECT:\\s*([\\s\\S]+?))?(?:\\s*\\|\\s*CATEGORY:\\s*([\\s\\S]+?))?(?:\\s*\\|\\s*PRIORITY:\\s*([\\s\\S]+?))?(?:\\s*\\|\\s*DRAFT:\\s*([\\s\\S]+?))?\\]`
);
const ESCALATE_RE_G = new RegExp(
  `\\[ESCALATE:\\s*${ESCALATE_SUMMARY_GROUP}(?:\\s*\\|\\s*SUBJECT:\\s*([\\s\\S]+?))?(?:\\s*\\|\\s*CATEGORY:\\s*([\\s\\S]+?))?(?:\\s*\\|\\s*PRIORITY:\\s*([\\s\\S]+?))?(?:\\s*\\|\\s*DRAFT:\\s*([\\s\\S]+?))?\\]`,
  "g"
);

// Helper: strip ESCALATE blocks + any leaked fragments (e.g. "students) | SUBJECT: ...]")
function stripEscalateBlocks(text: string): string {
  // First pass: remove full ESCALATE blocks
  let cleaned = text.replace(ESCALATE_RE_G, "").trim();
  // Second pass: remove any leaked tail fragments that contain | SUBJECT: ... ]
  // This catches cases where ] inside the summary (e.g. [number]) caused a partial match
  cleaned = cleaned.replace(/[^\n\[]*\|\s*SUBJECT:[\s\S]*?\]/g, "").trim();
  return cleaned;
}

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
          projectId: process.env.SANITY_PROJECT_ID,
          dataset: process.env.SANITY_DATASET || "production",
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
          answer = stripEscalateBlocks(answer);
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

      // ── Sanity Fallback: Recover session if user cleared chat but has recent open ticket/enquiry ──
      if (!alreadyEscalated && userEmail) {
        try {
          const { createClient } = require("next-sanity");
          const readClient = createClient({
            projectId: process.env.SANITY_PROJECT_ID,
            dataset: "production",
            apiVersion: "2023-01-01",
            useCdn: false,
          });
          const recentEscalation = await readClient.fetch(
            `*[_type == "aiEscalation" && userEmail == $email && status in ["pending", "enquiry_created", "handled"]] | order(_createdAt desc)[0]`,
            { email: userEmail }
          );
          if (recentEscalation) {
            let isTicketClosed = false;

            // If it's a platform user, verify the ticket status in MongoDB
            if (recentEscalation.ticketId) {
              try {
                const db = mongoose.connection.db;
                if (db && mongoose.isValidObjectId(recentEscalation.ticketId)) {
                  const ObjectId = mongoose.Types.ObjectId;
                  const ticket = await db.collection("supporttickets").findOne({ _id: new ObjectId(recentEscalation.ticketId) });
                  if (!ticket || ticket.status === "closed") {
                    isTicketClosed = true;
                    console.log(`[ask-ai] Ticket ${recentEscalation.ticketId} is closed in MongoDB. Forcing new ticket.`);
                  }
                }
              } catch (err) {
                console.error("[ask-ai:mongo] Failed to verify ticket status:", err);
              }
            }

            if (!isTicketClosed) {
              alreadyEscalated = JSON.stringify({
                summary: recentEscalation.aiSummary || "Recent enquiry",
                subject: recentEscalation.subject || "Support Escalation",
                ticketId: recentEscalation.ticketId || null,
                escalationId: recentEscalation._id
              });
              console.log(`[ask-ai] Recovered broken session ${sessionId} to Sanity doc ${recentEscalation._id}`);
              if (escalationRedis) {
                await escalationRedis.set(escalationKey, alreadyEscalated, "EX", 3600).catch(() => {});
              }
            }
          }
        } catch (e) {
          console.error("[ask-ai:sanity] Failed to check recent escalations:", e);
        }
      }

      // ── ALWAYS verify ticket status in MongoDB (even for Redis-cached sessions) ──
      // This prevents appending to a ticket that was closed by admin while Redis still had it cached.
      if (alreadyEscalated) {
        try {
          const parsed = typeof alreadyEscalated === "string" ? JSON.parse(alreadyEscalated) : alreadyEscalated;
          if (parsed.ticketId) {
            const db = mongoose.connection.db;
            if (db && mongoose.isValidObjectId(parsed.ticketId)) {
              const ObjectId = mongoose.Types.ObjectId;
              const ticket = await db.collection("supporttickets").findOne({ _id: new ObjectId(parsed.ticketId) });
              if (!ticket || ticket.status === "closed") {
                console.log(`[ask-ai] ⚠️ Cached ticket ${parsed.ticketId} is CLOSED in MongoDB. Clearing session to force new ticket.`);
                alreadyEscalated = null;
                if (escalationRedis) {
                  await escalationRedis.del(escalationKey).catch(() => {});
                }
              }
            }
          }
        } catch (e) {
          console.error("[ask-ai:mongo] Failed to re-check ticket status:", e);
        }
      }
      // ── Check if user is a registered platform user (mirrors email-processor.ts) ──
      let isPlatformUser = false;
      if (userEmail) {
        try {
          const db = mongoose.connection.db;
          if (db) {
            const platformUserDoc = await db.collection("users").findOne({
              email: { $regex: new RegExp(`^${userEmail}$`, 'i') }
            });
            isPlatformUser = !!(platformUserDoc && platformUserDoc.organization_id);
            console.log(`[ask-ai] Platform user check for ${userEmail}: ${isPlatformUser}`);
          }
        } catch (e) {
          console.error("[ask-ai] Failed to check platform user status:", e);
        }
      }

      if (escalateMatch && !alreadyEscalated) {
        const aiSummary = escalateMatch[1].trim();
        const aiSubject = escalateMatch[2]?.trim() || `AI Escalation: ${aiSummary.slice(0, 80)}`;
        const rawCategory = escalateMatch[3]?.trim().toLowerCase() || "general";
        const rawPriority = escalateMatch[4]?.trim().toLowerCase() || "medium";
        const aiDraft = escalateMatch[5]?.trim();
        const aiCategory = rawCategory;
        const VALID_PRIORITIES: Record<string, string> = { low: "low", medium: "medium", high: "high", urgent: "high", critical: "high" };
        const aiPriority = VALID_PRIORITIES[rawPriority] || "medium";

        let usedFallback = false;
        answer = stripEscalateBlocks(answer);
        if (!answer || answer.length < 15) {
          answer = "Your request has been forwarded to the Classgrid support team! They will review it and get back to you shortly.";
          usedFallback = true;
        }

        const email = userEmail || body?.userEmail;
        let ticketCreated = false;
        let ticketId: string | null = null;

        if (email) {
          if (isPlatformUser) {
            // ── PLATFORM USER: Create Support Ticket ─────────────────────────
            try {
              const formData = new FormData();
              formData.append("name", body?.userName || "AI Escalated User");
              formData.append("email", email);
              formData.append("subject", aiSubject);
              formData.append("message", `Auto-escalated from AI Chat.<br/><br/><strong>Original AI Categorization:</strong><br/>Category: ${rawCategory} | Priority: ${rawPriority}<br/><br/><strong>Problem Summary:</strong><br/>${aiSummary}<br/><br/><strong>Last User Message:</strong><br/>${question}`);
              formData.append("category", aiCategory);
              formData.append("priority", aiPriority);
              if (aiDraft) formData.append("aiDraft", aiDraft);

              const backendUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";
              const ticketRes = await fetch(`${backendUrl}/api/support/public/tickets`, { 
                method: "POST", 
                body: formData,
                headers: {
                  "x-proxy-auth-email": email,
                  "x-proxy-auth-secret": process.env.PLATFORM_JWT_SECRET || process.env.JWT_SECRET || "",
                },
              });

              if (ticketRes.ok) {
                ticketCreated = true;
                try {
                  const ticketResponse = await ticketRes.json();
                  ticketId = ticketResponse?.ticket?._id || ticketResponse?.ticket?.id
                    || ticketResponse?.data?._id || ticketResponse?.data?.id
                    || ticketResponse?._id || ticketResponse?.id || null;
                  console.log(`[ask-ai] ✅ Support ticket created for platform user: ${ticketId}`);
                } catch (_) { }
              } else {
                const errorText = await ticketRes.text();
                console.error("[ask-ai] Ticket API failed:", ticketRes.status, errorText);
                ticketId = `ERROR: ${ticketRes.status} ${errorText.substring(0, 100)}`;
              }
            } catch (e: any) {
              console.error("[ask-ai] Failed to auto-create ticket:", e);
              ticketId = `CATCH_ERROR: ${e.message}`;
            }
          } else {
            // ── NON-PLATFORM USER: Skip ticket creation entirely ──────────────
            console.log(`[ask-ai] Non-platform user ${email} — skipping ticket creation, sending enquiry email`);
          }
          
          let escalationId = "";
          // Log escalation to Sanity first so we can include the ID in the email
          try {
            const { createClient } = require("next-sanity");
            const writeClient = createClient({
              projectId: process.env.SANITY_PROJECT_ID,
              dataset: process.env.SANITY_DATASET || "production",
              apiVersion: "2024-01-01",
              token: process.env.SANITY_API_WRITE_TOKEN,
              useCdn: false,
            });
            const deviceLog = req.headers["user-agent"] || "Unknown Device";
            const newDoc = await writeClient.create({
              _type: "aiEscalation",
              userEmail: email || "",
              userName: body?.userName || "",
              ipAddress: ip,
              deviceInfo: deviceLog,
              status: ticketCreated ? "handled" : (isPlatformUser ? "pending" : "enquiry_created"),
              ticketCreated,
              enquiryCreated: !isPlatformUser && !!email,
              aiSummary,
              subject: aiSubject,
              ticketId: ticketId || "",
              chatTranscript: [
                { _key: `user-${Date.now()}`, role: "user", content: question, timestamp: new Date().toISOString() },
                { _key: `assistant-${Date.now() + 1}`, role: "assistant", content: answer, timestamp: new Date().toISOString() },
              ],
            });
            escalationId = newDoc._id;
          } catch (e) {
            console.error("Failed to log escalation to Sanity:", e);
          }

          if (ticketCreated && ticketId && !ticketId.startsWith("ERROR") && !ticketId.startsWith("CATCH_ERROR")) {
            await sendTicketCreatedEscalationEmail(
              email || "unknown@guest.com",
              body?.userName || "Website AI User",
              aiSummary,
              "Website Chat AI (Ticket Created)",
              question,
              ticketId
            );
          } else {
            await sendFailedEscalationEmail(
              email || "unknown@guest.com",
              body?.userName || "Website AI User",
              aiSummary,
              "Website Chat AI (Ticket Failed)",
              question,
              escalationId
            );
          }
        }

        if (ticketCreated) {
          // PLATFORM USER — ticket was created
          const ticketLink = ticketId
            ? `\n\n*✅ Support Ticket created! Your Ticket ID is **${ticketId}**. Track it here: [Support Requests](/support/requests/${ticketId}?email=${encodeURIComponent(email || "")})*`
            : "\n\n*✅ Support Ticket created! Track your request at [Support Requests](/support/requests).*";
          answer += ticketLink;
          if (escalationRedis) {
            try {
              await escalationRedis.set(escalationKey, JSON.stringify({ summary: aiSummary, subject: aiSubject, ticketId, escalationId }), "EX", 3600);
            } catch (err) {
              console.error("[ask-ai:redis] Failed to set escalation key:", err);
            }
          }
        } else {
          if (email && email !== "anonymous@classgrid.in") {
            // NON-PLATFORM USER — enquiry created (not a ticket)
            if (escalationRedis) {
              try {
                // Store escalationId (Sanity doc ID) so follow-up messages can update the enquiry
                await escalationRedis.set(escalationKey, JSON.stringify({ summary: aiSummary, subject: aiSubject, ticketId: null, escalationId }), "EX", 3600);
              } catch (err) {
                console.error("[ask-ai:redis] Failed to set escalation key:", err);
              }
            }
          } else {
            answer = "Since you are not logged in, I cannot automatically create a support ticket. For a quick or instant message to our team, please use the **[Contact Page](/contact)**. For a more detailed conversation, please log in and use **[Classgrid Talk](/support/inquiry)**. 😊";
          }
        }

      } else if (escalateMatch && alreadyEscalated) {
        // AI tried to escalate again — prevent duplicate, add context instead
        const newContext = escalateMatch[1]?.trim() || question;
        answer = stripEscalateBlocks(answer);

        let updatedTicket = false;
        let savedTicketId: string | null = null;
        let savedEscalationId: string | null = null;
        try {
          const savedEscalation = escalationRedis ? await escalationRedis.get(escalationKey) : null;
          if (savedEscalation && savedEscalation !== "true") {
            const parsed = JSON.parse(savedEscalation);
            savedTicketId = parsed.ticketId || null;
            savedEscalationId = parsed.escalationId || null;
          }
        } catch (_) { }

        if (savedTicketId) {
          // PLATFORM USER follow-up: add reply to existing ticket
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
                headers: {
                  "x-proxy-auth-email": email,
                  "x-proxy-auth-secret": process.env.PLATFORM_JWT_SECRET || process.env.JWT_SECRET || "",
                },
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
        } else if (savedEscalationId) {
          // NON-PLATFORM USER follow-up: patch the Sanity enquiry document with new context
          try {
            const { createClient } = require("next-sanity");
            const writeClient = createClient({
              projectId: process.env.SANITY_PROJECT_ID,
              dataset: process.env.SANITY_DATASET || "production",
              apiVersion: "2024-01-01",
              token: process.env.SANITY_API_WRITE_TOKEN,
              useCdn: false,
            });
            await writeClient
              .patch(savedEscalationId)
              .setIfMissing({ chatTranscript: [] })
              .append("chatTranscript", [
                { _key: `followup-user-${Date.now()}`, role: "user", content: question, timestamp: new Date().toISOString() },
                { _key: `followup-ai-${Date.now() + 1}`, role: "assistant", content: answer || newContext, timestamp: new Date().toISOString() },
              ])
              .commit();
            updatedTicket = true;
            console.log(`[ask-ai] ✅ Patched Sanity enquiry ${savedEscalationId} with follow-up context`);
          } catch (e) {
            console.error("[ask-ai] Failed to patch Sanity enquiry with follow-up:", e);
          }
        }

        if (updatedTicket) {
          if (!answer || answer.length < 15) {
            answer = savedTicketId
              ? "I've added your additional details to the existing support ticket. The team now has the full context of your issue! 🙏"
              : "I've added your follow-up message to your existing enquiry. The team will see the updated information! 🙏";
          } else {
            answer += savedTicketId
              ? `\n\n*✅ Your additional details have been added to your existing ticket (#${savedTicketId?.slice(0, 8)}). The support team will see the updated information.*`
              : `\n\n*🎫 Your follow-up has been added to your existing enquiry. The team will see it shortly.*`;
          }

          // Send follow-up alert to team (for both platform and non-platform users)
          try {
            const followUpEmail = userEmail || body?.userEmail;
            if (followUpEmail) {
              const savedEscalationRaw = escalationRedis ? await escalationRedis.get(escalationKey) : null;
              let storedSummary = newContext;
              let storedSubject = "Support Escalation";
              try {
                if (savedEscalationRaw && savedEscalationRaw !== "true") {
                  const p = JSON.parse(savedEscalationRaw);
                  storedSummary = p.summary || storedSummary;
                  storedSubject = p.subject || storedSubject;
                }
              } catch (_) {}
              await sendFollowUpAlertEmail({
                customerEmail: followUpEmail,
                customerName: body?.userName || followUpEmail,
                followUpMessage: question,
                aiSummary: storedSummary,
                originalSubject: storedSubject,
                ticketId: savedTicketId,
                escalationId: savedEscalationId,
                isPlatformUser: !!savedTicketId,
              });
            }
          } catch (e) {
            console.error("[ask-ai] Failed to send follow-up alert email:", e);
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
            answer = `Your issue has already been forwarded to our support team! They are reviewing it now.${escalationContext} Is there anything else I can help you with? 😊`;
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
      console.error(`[ask-ai:stream] ❌ SERVER CRASH LOG AT: ${new Date().toISOString()}`);
      console.error("[ask-ai:stream] Error Message:", msg);
      if (err instanceof Error && err.stack) {
        console.error("[ask-ai:stream] Stack Trace:", err.stack);
      }
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


// ── WhatsApp Webhook & API ────────────────────────────────────────────────────
app.get("/api/whatsapp-webhook", (req, res) => {
  const verify_token = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log(`[WhatsApp] Webhook verified successfully!`);
      return res.status(200).send(challenge);
    } else {
      console.warn(`[WhatsApp] Webhook verification failed. Expected: ${verify_token}, Got: ${token}`);
      return res.sendStatus(403);
    }
  }
  return res.sendStatus(400);
});

app.post("/api/whatsapp-webhook", async (req, res) => {
  try {
    const body = req.body;
    console.log(`\n📱 ════════════ INCOMING WHATSAPP EVENT ════════════`);
    console.log(JSON.stringify(body, null, 2));

    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];
      const contact = value?.contacts?.[0];

      if (message && message.type === "text") {
        const fromNumber = message.from; // User's phone number
        const text = message.text.body;
        const userName = contact?.profile?.name || "WhatsApp User";
        
        console.log(`[WhatsApp] Received message from ${userName} (${fromNumber}): "${text}"`);
        
        // 1. Check Rate Limit (Anti-Spam)
        const { checkRateLimitWithCount } = require("../lib/rate-limit");
        const rateLimit = checkRateLimitWithCount(`wa_${fromNumber}`, 34, 24 * 60 * 60 * 1000); // 34 messages allowed per 24 hours
        
        if (!rateLimit.allowed) {
          if (rateLimit.count === 35) { // 35th message gets the exact error response
            console.warn(`[WhatsApp] 🚨 Rate limit hit for ${fromNumber}. Sending exact 24-hour warning message.`);
            const incomingPhoneId = value?.metadata?.phone_number_id || process.env.WHATSAPP_PHONE_ID;
            const token = process.env.WHATSAPP_ACCESS_TOKEN;
            
            const resetAt = new Date(rateLimit.resetAt);
            const resetDateStr = resetAt.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              timeZone: "Asia/Kolkata",
            }); // e.g. "23 Aug"
            const resetTimeStr = resetAt.toLocaleTimeString("en-IN", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Kolkata",
            }); // e.g. "8:30 PM"
            
            try {
              await fetch(`https://graph.facebook.com/v19.0/${incomingPhoneId}/messages`, {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  to: fromNumber,
                  type: "text",
                  text: { body: `You have reached your daily message limit. Your limit will reset on ${resetDateStr} at ${resetTimeStr}.` }
                })
              });
            } catch (err) {
              console.error("[WhatsApp] Failed to send rate limit warning:", err);
            }
          } else {
            console.warn(`[WhatsApp] 🚨 SPAM BLOCKED! Dropping message ${rateLimit.count} for ${fromNumber} silently.`);
          }
          return res.sendStatus(200); // Drop instantly without processing further
        }
        
        // 2. Check Kill Switch
        await connectMongo();
        const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
        let usage = await WhatsAppUsage.findOne({ monthYear: currentMonth });
        if (!usage) {
          usage = await WhatsAppUsage.create({ monthYear: currentMonth, messageCount: 0 });
        }

        if (usage.messageCount === 990) {
          const { sendWhatsAppKillSwitchAlert } = require("../lib/email");
          await sendWhatsAppKillSwitchAlert(usage.messageCount, currentMonth);
        }

        if (usage.messageCount >= 990) {
          console.warn(`[WhatsApp] KILL SWITCH ACTIVATED! Dropping message. Usage: ${usage.messageCount}`);
          return res.sendStatus(200); // Don't reply, don't charge
        }

        // 2. Generate RAG Answer
        res.sendStatus(200); // Instantly reply 200 OK to Meta so they don't retry

        const incomingPhoneId = value?.metadata?.phone_number_id || process.env.WHATSAPP_PHONE_ID;
        const token = process.env.WHATSAPP_ACCESS_TOKEN;

        // Send 'mark_as_read' status (Blue Ticks) and 'typing_indicator' (Typing...)
        try {
          await fetch(`https://graph.facebook.com/v19.0/${incomingPhoneId}/messages`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              status: "read",
              message_id: message.id,
              typing_indicator: {
                type: "text"
              }
            })
          });
          console.log(`[WhatsApp] Sent mark_as_read + typing_indicator for message ${message.id}`);
        } catch (err) {
          console.error(`[WhatsApp] Failed to send mark_as_read:`, err);
        }

        console.log(`[WhatsApp] Generating RAG Answer for ${fromNumber}...`);

        // --- WHATSAPP IMAGE GENERATION ---
        if (text.toLowerCase().startsWith("/image ") || text.toLowerCase().startsWith("generate image ")) {
            const prompt = text.replace(/^\/image\s+|^generate image\s+/i, "").trim();
            console.log(`[WhatsApp] 🎨 Image Generator Triggered! Prompt: "${prompt}"...`);
            
            try {
                // Call Pollinations AI (Flux)
                // We use this because this server has DNS resolution issues with api-inference.huggingface.co
                const encodedPrompt = encodeURIComponent(prompt);
                const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
                
                const imageRes = await fetch(pollinationsUrl);
                if (!imageRes.ok) throw new Error(`Image API failed: ${imageRes.status}`);
                
                const imageBuffer = await imageRes.arrayBuffer();
                const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
                
                // Upload to Meta
                const formData = new FormData();
                formData.append('messaging_product', 'whatsapp');
                formData.append('file', blob, 'generated.jpg');
                
                console.log(`[WhatsApp] Uploading generated image to Meta...`);
                const mediaRes = await fetch(`https://graph.facebook.com/v19.0/${incomingPhoneId}/media`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData as any
                });
                
                const mediaData = await mediaRes.json();
                
                if (mediaData.id) {
                    // Send Image to User
                    await fetch(`https://graph.facebook.com/v19.0/${incomingPhoneId}/messages`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            messaging_product: "whatsapp",
                            recipient_type: "individual",
                            to: fromNumber,
                            type: "image",
                            image: { id: mediaData.id }
                        })
                    });
                    console.log(`[WhatsApp] Successfully sent generated image to ${fromNumber}!`);
                    return; // Terminate execution so it doesn't trigger RAG
                } else {
                    throw new Error("No media ID returned from Meta");
                }
            } catch (err) {
                console.error("[WhatsApp] Image generation failed:", err);
                await fetch(`https://graph.facebook.com/v19.0/${incomingPhoneId}/messages`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to: fromNumber,
                        type: "text",
                        text: { body: "Sorry, I couldn't generate the image right now. Hugging Face free API might be overloaded!" }
                    })
                });
                return; // Terminate execution
            }
        }
        // ---------------------------------
        
        // Use redis session history
        const sessionId = `wa-${fromNumber}`;
        const redisHistory = await getSessionHistory(sessionId);
        await saveMessageToSession(sessionId, { role: "user", content: text });

        const result = await generateClassgridRagAnswer({
          question: text,
          channel: "whatsapp",
          userName: userName.split(" ")[0],
          fullName: userName,
          userEmail: `${fromNumber}@whatsapp.com`,
          isGuest: true,
          history: redisHistory,
          onStatus: () => {},
          onThought: () => {},
        });

        let answerText = result.answer || "I'm sorry, I cannot answer right now. Please email support@classgrid.in.";
        
        // --- WHATSAPP FORMATTING FIX ---
        // Convert Markdown Links to Text (URL)
        answerText = answerText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
          const fullUrl = url.startsWith("/") ? `https://classgrid.in${url}` : url;
          return `${text} (${fullUrl})`;
        });
        
        // Foolproof Asterisk Converter for WhatsApp
        // Converts **bold**, ***bold italic***, to WhatsApp's *bold*
        answerText = answerText.replace(/\*{2,3}(.*?)\*{2,3}/g, '*$1*');
        
        // Convert #, ##, ### Headings to *Headings*
        answerText = answerText.replace(/^#{1,6}\s+(.*)$/gm, '*$1*');
        // -------------------------------

        // BACKEND SAFETY NET: Strip any [ESCALATE] tags from WhatsApp answers.
        // WhatsApp is NOT a support channel. If the AI somehow generates an [ESCALATE] tag, silently remove it.
        answerText = answerText.replace(/\[ESCALATE:.*?\]/g, "").trim();
        // Also strip broken metadata fragments (e.g. | SUBJECT: ... | CATEGORY: ... | PRIORITY: ...])
        answerText = answerText.replace(/\|\s*SUBJECT:.*?\|\s*CATEGORY:.*?\|\s*PRIORITY:.*?\]/g, "").trim();

        if (answerText.length > 4000) {
          console.warn(`[WhatsApp] Answer too long (${answerText.length} chars). Truncating to 4000...`);
          answerText = answerText.slice(0, 4000).trimEnd();
        }
        await saveMessageToSession(sessionId, { role: "assistant", content: answerText });

        console.log(`[WhatsApp] Generated Answer. Sending back to Meta...`);
        
        const response = await fetch(`https://graph.facebook.com/v19.0/${incomingPhoneId}/messages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: fromNumber,
            type: "text",
            text: {
              preview_url: false,
              body: answerText
            }
          })
        });

        const respData = await response.json();
        if (response.ok) {
          console.log(`[WhatsApp] ✅ Message sent successfully! Msg ID: ${respData?.messages?.[0]?.id}`);
          // Increment tracking
          usage.messageCount += 1;
          await usage.save();
          console.log(`[WhatsApp Tracker] Month usage is now: ${usage.messageCount} / 1000`);
        } else {
          console.error(`[WhatsApp] ❌ Failed to send message!`, JSON.stringify(respData));
        }

      } else {
        // Just a status update (read/delivered/sent) or unsupported message type
        res.sendStatus(200);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("[WhatsApp Webhook] Fatal Error:", error);
    if (!res.headersSent) res.sendStatus(500);
  }
});

// ── Daily Usage Cron Job ──────────────────────────────────────────────────────
// Runs exactly at 8:00 PM IST (14:30 UTC) every single day
cron.schedule("30 14 * * *", async () => {
  try {
    console.log("[Cron] Running Daily WhatsApp Billing Tracker...");
    await connectMongo();
    const currentMonth = new Date().toISOString().slice(0, 7);
    const usage = await WhatsAppUsage.findOne({ monthYear: currentMonth });
    const count = usage?.messageCount || 0;

    console.log(`[Cron] Today's Usage Count: ${count} / 1000`);

    const transporter = nodemailer.createTransport({
      host: process.env.AWS_SES_SMTP_HOST || "email-smtp.ap-south-1.amazonaws.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.AWS_SES_SMTP_USER,
        pass: process.env.AWS_SES_SMTP_PASS,
      },
    });

    const mailOptions = {
      from: "Classgrid AI <support@classgrid.in>",
      to: "team@classgrid.in",
      subject: `🛡️ WhatsApp API Billing Update (${count}/1000)`,
      html: getWhatsAppDailyTrackerEmailHtml(count),
    };

    if (process.env.AWS_SES_SMTP_USER) {
      await transporter.sendMail(mailOptions);
      console.log("[Cron] Daily Usage report sent to team@classgrid.in");
    } else {
      console.warn("[Cron] Skipping email report because AWS_SES_SMTP_USER is not set.");
    }
  } catch (err) {
    console.error("[Cron] Failed to run WhatsApp usage tracker:", err);
  }
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const hasMistral = !!process.env.MISTRAL_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasTavily = !!process.env.TAVILY_API_KEY;
  const hasVoyage = !!process.env.VOYAGE_API_KEY;
  const hasRedis = !!process.env.REDIS_URL;
  const hasRag = process.env.RAG_ENABLED === "true";
  const hasMongo = !!process.env.MONGO_URI;
  const hasSanity = !!process.env.SANITY_API_WRITE_TOKEN || !!process.env.SANITY_API_TOKEN;
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

  const hasWaToken = !!process.env.WHATSAPP_ACCESS_TOKEN;
  const hasWaPhoneId = !!process.env.WHATSAPP_PHONE_ID;
  const hasWaAccountId = !!process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
  const hasWaWebhook = !!process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

  // ── DETAILED ZOHO ENV CONNECTION LOGS ──
  console.log(`\n📧 ════════════ ZOHO ENV CONNECTION LOGS ════════════`);
  console.log(`ZOHO_MAIL_CLIENT_ID:     ${process.env.ZOHO_MAIL_CLIENT_ID ? process.env.ZOHO_MAIL_CLIENT_ID.substring(0, 8) + '********' : "❌ MISSING"}`);
  console.log(`ZOHO_MAIL_CLIENT_SECRET: ${process.env.ZOHO_MAIL_CLIENT_SECRET ? "✅ CONFIGURED (Hidden for security)" : "❌ MISSING"}`);
  console.log(`ZOHO_MAIL_REFRESH_TOKEN: ${process.env.ZOHO_MAIL_REFRESH_TOKEN ? process.env.ZOHO_MAIL_REFRESH_TOKEN.substring(0, 8) + '********' : "❌ MISSING"}`);
  console.log(`ZOHO_MAIL_ACCOUNT_ID:    ${process.env.ZOHO_MAIL_ACCOUNT_ID ? process.env.ZOHO_MAIL_ACCOUNT_ID : "❌ MISSING"}`);
  console.log(`📧 ════════════════════════════════════════════════════\n`);

  // Start the Email AI Support poller
  startEmailPoller();
  const emailPollerStatus = getEmailPollerStatus();

  console.log(`🚀 Classgrid AI Server running on http://localhost:${PORT} (Connected to Voyage AI 1024d RAG)`);
  console.log("----------------------------------------");
  console.log(`✅ Voyage AI:         ${hasVoyage ? "Connected (1024d)" : "Connected (Hardcoded Fallback 1024d)"}`);
  console.log("✅ Groq API Key:      " + (process.env.GROQ_API_KEY ? "Connected" : "❌ Missing"));
  console.log("✅ OpenAI API Key:    " + (process.env.OPENAI_API_KEY ? "Connected" : "❌ Missing"));
  console.log("✅ Anthropic API Key: " + (process.env.ANTHROPIC_API_KEY ? "Connected" : "❌ Missing"));
  console.log(`✅ Mistral API:       ${hasMistral ? "Connected" : "❌ Missing"}`);
  console.log(`✅ Gemini API:        ${hasGemini ? "Connected" : "❌ Missing"}`);
  console.log(`✅ Tavily API:        ${hasTavily ? "Connected" : "❌ Missing"}`);
  console.log(`✅ Hugging Face API:  ${process.env.HF_API_TOKEN ? "Connected" : "❌ Missing"}`);
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
  console.log(`✅ Zoho Email AI:     ${emailPollerStatus.configured ? "Configured (Polling Support Inbox)" : "❌ Missing (Disabled)"}`);
  console.log("----------------------------------------");
  console.log(`🟢 WhatsApp Graph API Status:`);
  const tokenPreview = process.env.WHATSAPP_ACCESS_TOKEN 
    ? `${process.env.WHATSAPP_ACCESS_TOKEN.substring(0, 15)}...${process.env.WHATSAPP_ACCESS_TOKEN.slice(-5)}` 
    : "❌ Missing";
  console.log(`   - Access Token:    ${hasWaToken ? `✅ Connected (${tokenPreview})` : "❌ Missing"}`);
  console.log(`   - Phone ID:        ${hasWaPhoneId ? "✅ Configured" : "❌ Missing"}`);
  console.log(`   - Account ID:      ${hasWaAccountId ? "✅ Configured" : "❌ Missing"}`);
  console.log(`   - Webhook Secret:  ${hasWaWebhook ? "✅ Configured" : "❌ Missing"}`);
  console.log("----------------------------------------");
});

// Force GitHub Action Trigger Final

// Trigger AI Deploy v2
