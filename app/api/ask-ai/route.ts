import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongo } from "@/lib/mongodb";
import { ModerationFlag } from "@/lib/models/ModerationFlag";
import { AiRateLimit } from "../../../lib/models/AiRateLimit";
import { sendSafetyEmail } from "@/lib/email";
import { getRedisClient } from "@/lib/redis";

import {
  generateClassgridRagAnswer,
  type ChatHistoryItem,
} from "@/lib/ai/rag-answer";
import { normalizeText, type PageContext } from "@/lib/ai/rag-content";
import {
  saveMessageToSession,
  getSessionHistory,
} from "@/lib/ai/chat-memory";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s to prevent Vercel 10s timeouts

// @ts-ignore
import leoProfanity from "leo-profanity";

// Initialize a comprehensive, built-in vulgarity filter
leoProfanity.loadDictionary();

// Add any extra custom words you want to explicitly ban (including Hindi & Marathi)
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
  // leoProfanity.check() is great for English. We also do a regex match 
  // with Unicode-aware word boundaries to prevent false positives (like 'claude' matching 'laude').
  const hasCustomWord = customBadWords.some(word => {
    // Escape special regex characters in the custom word
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // (^|[^\p{L}\p{N}]) matches start of string or a non-letter/non-number
    // ([^\p{L}\p{N}]|$) matches a non-letter/non-number or end of string
    const regex = new RegExp(`(^|[^\\p{L}\\p{N}])${escapedWord}([^\\p{L}\\p{N}]|$)`, 'iu');
    return regex.test(text);
  });

  return leoProfanity.check(text) || hasCustomWord;
}

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
        title: normalizeText(p.title)
      }))
      : undefined,
  };

  return Object.values(pageContext).some(Boolean) ? pageContext : undefined;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AskAiRequestBody;
    const question = normalizeText(body?.question);

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    // Get user session and IP for moderation checks
    const session = await getServerSession(authOptions);
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userEmail = session?.user?.email;

    // Connect to MongoDB
    await connectMongo();

    // --- 0. CHECK IF USER IS ALREADY BANNED (VIA COOKIE OR EMAIL) ---
    const cookieHeader = req.headers.get("cookie") || "";
    let bannedUntil: Date | null = null;

    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000);
    const queryConditions: any[] = [{ ipAddress: ip }];
    if (userEmail) queryConditions.push({ userEmail: userEmail });

    const previousStrike = await ModerationFlag.findOne({
      $or: queryConditions,
      createdAt: { $gte: threeMinutesAgo }
    } as any);

    if (previousStrike) {
      bannedUntil = new Date(new Date(previousStrike.createdAt).getTime() + 3 * 60 * 1000);
    }

    // Check if cookie contains a valid timestamp
    const cookieMatch = cookieHeader.match(/ai_chat_restricted=([^;]+)/);
    const cookieValue = cookieMatch ? cookieMatch[1] : null;

    if (cookieValue && !bannedUntil) {
      // Parse the timestamp from the cookie
      const parsedTime = parseInt(cookieValue, 10);
      if (!isNaN(parsedTime) && parsedTime > Date.now()) {
        bannedUntil = new Date(parsedTime);
      } else if (cookieValue === "true") {
        // Fallback for old cookie format
        bannedUntil = new Date(Date.now() + 3 * 60 * 1000);
      }
    }

    /*
    if (bannedUntil) {
      const banTimeStr = bannedUntil.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      return NextResponse.json({
        error: `Your access has been restricted due to safety policy violations. Access resumes at ${banTimeStr} IST.`,
        bannedUntil: bannedUntil.toISOString()
      }, { status: 403 });
    }
    */

    // Lightweight ban-check from frontend — no need to call Groq
    if (question === "__ban_check__") {
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    // --- 1. MODERATION / PROFANITY CHECK FOR NEW MESSAGES ---
    if (containsProfanity(question)) {
      const now = new Date();

      try {
        const { createClient } = require('next-sanity');
        const writeClient = createClient({
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
          apiVersion: "2024-01-01",
          token: process.env.SANITY_API_WRITE_TOKEN,
          useCdn: false,
        });

        // Unique identifier for the user: email or IP
        const identifier = userEmail || ip;

        // Check if an incident already exists for this identifier
        const query = `*[_type == "safetyIncident" && (userEmail == $identifier || ipAddress == $identifier)][0]`;
        const existingIncident = await writeClient.fetch(query, { identifier });

        const newFlaggedMessage = {
          _key: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          message: question,
          timestamp: now.toISOString(),
        };

        if (existingIncident) {
          // Append to existing flagged messages array
          await writeClient
            .patch(existingIncident._id)
            .setIfMissing({ flaggedMessages: [] })
            .append('flaggedMessages', [newFlaggedMessage])
            .commit();
          console.log(`[Safety] Appended violation to existing incident in Sanity for ${identifier}`);
          
          if (userEmail) {
            const strikeCount = (existingIncident.flaggedMessages?.length || 0) + 1;
            const flaggedMsgs = [...(existingIncident.flaggedMessages || []), newFlaggedMessage];
            await sendSafetyEmail(userEmail, body?.userName || "", strikeCount, flaggedMsgs);
          }
        } else {
          // Create new incident
          await writeClient.create({
            _type: "safetyIncident",
            userEmail: userEmail || "",
            userName: body?.userName || "",
            ipAddress: ip,
            device: req.headers.get("user-agent") || "Unknown Device",
            status: "pending",
            flaggedMessages: [newFlaggedMessage],
          });
          console.log(`[Safety] Created new safety incident in Sanity for ${identifier}`);
          
          if (userEmail) {
            await sendSafetyEmail(userEmail, body?.userName || "", 1, [newFlaggedMessage]);
          }
        }
      } catch (err) {
        console.error("[Safety] Failed to log incident to Sanity:", err);
      }
    }
    // --- END MODERATION CHECK ---

    // --- 2. RATE LIMITING (Preventing Token Spam) ---
    const identifier = userEmail || ip;
    const MAX_MESSAGES = 16; // Allow 16 messages per hour
    const ONE_HOUR_MS = 60 * 60 * 1000;

    const rateLimitRecord = await AiRateLimit.findOne({ identifier });

    if (rateLimitRecord) {
      if (rateLimitRecord.count >= MAX_MESSAGES) {
        // Calculate exact reset time
        const resetAt = new Date(rateLimitRecord.expireAt);
        const minutesLeft = Math.max(1, Math.ceil((resetAt.getTime() - Date.now()) / 60000));
        const resetTimeStr = resetAt.toLocaleTimeString("en-IN", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });

        return NextResponse.json({
          error: `You have reached your message limit. Your limit resets at ${resetTimeStr} (in ~${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}).`,
          resetAt: resetAt.toISOString(),
          minutesLeft,
        }, { status: 429 }); // 429 Too Many Requests
      }

      // They are under the limit, so increment their message count
      rateLimitRecord.count += 1;
      await rateLimitRecord.save();
    } else {
      // First time chatting, create a tracker that expires in 1 hour
      await AiRateLimit.create({
        identifier,
        count: 1,
        expireAt: new Date(Date.now() + ONE_HOUR_MS)
      });
    }
    // --- END RATE LIMITING ---

    // --- 3. REDIS SESSION MEMORY ---
    // Generate or reuse session ID for chat memory
    const sessionId = body?.sessionId || `${identifier}-${Date.now()}`;

    // Load full conversation history from Redis
    const redisHistory = await getSessionHistory(sessionId);

    // Merge: Redis has the authoritative full history, frontend history is fallback
    const mergedHistory = redisHistory.length > 0 ? redisHistory : (body?.history || []);

    // Save the user's current question to Redis
    await saveMessageToSession(sessionId, { role: "user", content: question });
    // --- END REDIS SESSION MEMORY ---

    // --- 4. SSE STREAMING RESPONSE ---
    // Stream real-time status updates (thinking → searching → analyzing → answer)
    // This keeps the Vercel connection alive and gives accurate UI feedback.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (data: Record<string, unknown>) => {
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
          } catch (_) {
            // Controller may already be closed
          }
        };

        try {
          sendEvent({ type: "status", label: "thinking" });



          const rawUserName = normalizeText(body?.userName);
          const firstName = rawUserName ? rawUserName.split(" ")[0] : undefined;

          const result = await generateClassgridRagAnswer({
            question,
            channel: "web",
            userName: firstName,
            userRole: normalizeText(body?.userRole),
            history: mergedHistory,
            pageContext: normalizePageContext(body?.pageContext),
            onStatus: (label: string) => sendEvent({ type: "status", label }),
          });

          let answer = result.answer || DEFAULT_ERROR_MESSAGE;

          const escalateMatch = answer.match(/\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/);
          // Prevent double escalation: check if this session already created a ticket
          const escalationRedis = getRedisClient();
          const escalationKey = `ai:escalated:${sessionId}`;
          const alreadyEscalated = escalationRedis ? await escalationRedis.get(escalationKey) : null;

          if (escalateMatch && !alreadyEscalated) {
            const aiSummary = escalateMatch[1].trim();
            const aiSubject = escalateMatch[2]?.trim() || `AI Escalation: ${aiSummary.slice(0, 80)}`;
            const aiCategory = escalateMatch[3]?.trim().toLowerCase() || "technical";
            const aiPriority = escalateMatch[4]?.trim().toLowerCase() || "medium";
            
            answer = answer.replace(/\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/g, "").trim();

            // Backend safeguard: if AI only output the code with no polite text, add a fallback
            if (!answer || answer.length < 15) {
              answer = "I understand this is frustrating, especially with a deadline approaching. I've flagged this issue to our support team so they can look into it right away! 🙏";
            }
            
            const email = userEmail || body?.userEmail;
            let ticketCreated = false;
            let ticketId: string | null = null;

            if (email) {
              try {
                const formData = new FormData();
                formData.append("name", body.userName || "AI Escalated User");
                formData.append("email", email);
                formData.append("subject", aiSubject);
                formData.append("message", "Auto-escalated from AI Chat.<br/><br/><strong>Problem Summary:</strong><br/>" + aiSummary + "<br/><br/><strong>Original Request:</strong><br/>" + question);
                formData.append("category", aiCategory);
                formData.append("priority", aiPriority);

                const backendUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";
                const res = await fetch(`${backendUrl}/api/support/public/tickets`, {
                  method: "POST",
                  body: formData,
                });

                if (res.ok) {
                  ticketCreated = true;
                  try {
                    const ticketResponse = await res.json();
                    // Try common response shapes: { ticket: { _id } }, { data: { _id } }, { _id }, { id }
                    ticketId = ticketResponse?.ticket?._id || ticketResponse?.ticket?.id
                      || ticketResponse?.data?._id || ticketResponse?.data?.id
                      || ticketResponse?._id || ticketResponse?.id
                      || null;
                  } catch (_) {
                    // Response wasn't JSON — ticket was still created, just no ID to show
                  }
                }
              } catch (e) {
                console.error("Failed to auto-create ticket:", e);
              }
            }

            try {
              const { createClient } = require('next-sanity');
              const writeClient = createClient({
                projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
                dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
                apiVersion: "2024-01-01",
                token: process.env.SANITY_API_WRITE_TOKEN,
                useCdn: false,
              });

              const deviceLog = req.headers.get("user-agent") || "Unknown Device";
              await writeClient.create({
                _type: "aiEscalation",
                userEmail: email || "",
                userName: body?.userName || "",
                ipAddress: ip,
                deviceInfo: deviceLog,
                status: "pending",
                ticketCreated: ticketCreated,
                aiSummary: aiSummary,
                subject: aiSubject,
                ticketId: ticketId || "",
                chatTranscript: [
                  { _key: `user-${Date.now()}`, role: "user", content: question, timestamp: new Date().toISOString() },
                  { _key: `assistant-${Date.now()}`, role: "assistant", content: answer, timestamp: new Date().toISOString() }
                ]
              });
            } catch (e) {
              console.error("Failed to log escalation to Sanity:", e);
            }

            if (ticketCreated) {
              const ticketLink = ticketId
                ? `\n\n*✅ Support Ticket created! Your Ticket ID is **${ticketId}**. Track it here: [Support Requests](/support/requests/${ticketId}?email=${encodeURIComponent(email || "")})*`
                : "\n\n*✅ Support Ticket created! Track your request at [Support Requests](/support/requests).*";
              answer += ticketLink;
              // Mark this session as escalated so we don't create duplicate tickets
              if (escalationRedis) {
                await escalationRedis.set(escalationKey, "true", "EX", 3600);
              }
            } else {
              answer += "\n\n*Note: I attempted to automatically create a Support Ticket for you, but there was an issue communicating with the database. Please visit [Submit a Ticket](/support/ticket) to submit it manually.*";
            }
          } else if (escalateMatch && alreadyEscalated) {
            // AI tried to escalate again but we already have a ticket — just strip the code silently
            answer = answer.replace(/\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/g, "").trim();
            if (!answer || answer.length < 15) {
              answer = "Your issue has already been escalated to our support team! They are reviewing it now. Is there anything else I can help you with? 😊";
            }
          }

          // Save the AI response to Redis session memory
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
          controller.close();
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ask-ai]", message);
    return NextResponse.json({ answer: DEFAULT_ERROR_MESSAGE }, { status: 200 });
  }
}
