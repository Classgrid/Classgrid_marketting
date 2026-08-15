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
  attachments?: { url: string; name: string; mimeType: string }[];
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
    const MAX_MESSAGES = 35; // Allow 35 messages per hour
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

          const isGuest = !userEmail && (!body?.userEmail || body.userEmail === "anonymous@classgrid.in");

          const result = await generateClassgridRagAnswer({
            question,
            channel: "web",
            userName: firstName,
            fullName: rawUserName,
            userEmail,
            userRole: normalizeText(body?.userRole),
            history: mergedHistory,
            pageContext: normalizePageContext(body?.pageContext),
            attachments: body?.attachments,
            isGuest,
            onStatus: (label: string) => sendEvent({ type: "status", label }),
            onThought: (thought: string) => sendEvent({ type: "thought", thought }),
          });

          let answer = result.answer || DEFAULT_ERROR_MESSAGE;

          let escalateMatch = answer.match(/\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/);

          // HARD PROGRAMMATIC FAILSAFE: Prevent AI from auto-escalating prematurely
          if (escalateMatch) {
            const tempSummary = escalateMatch[1].toLowerCase();
            const questionLower = question.toLowerCase();

            // Check 1: AI summary itself indicates no real context
            const summaryLacksContext = tempSummary.includes("did not specify") || tempSummary.includes("unspecified") || tempSummary.includes("not yet described") || tempSummary.includes("no specific");

            // Check 2: Very short message with no history (original check)
            const tooShortNoHistory = question.trim().length < 15 && (!body?.history || body.history.length === 0);

            // Check 3: User's message is a generic "contact team" request with no actual problem details
            // These are vague requests that mention wanting to reach the team but don't describe any specific issue
            const genericContactPhrases = [
              /\b(i\s+have\s+a?\s*probl|help\s+me|tell\s+(your|the)\s+team|contact\s+(your|the)\s+team|message\s+(your|the)\s+team|send\s+(a\s+)?message|talk\s+to\s+(your|the)\s+team|reach\s+(your|the)\s+team|escalate|forward\s+(this|my))\b/i,
            ];
            const isGenericRequest = genericContactPhrases.some(p => p.test(questionLower));
            // Check if the message has any SPECIFIC problem indicators (error codes, module names, account details, etc.)
            const hasSpecificDetails = /(\d{3,}|error|crash|bug|fail|wrong|missing|delete|lost|lock|ban|block|charg|paid|pay|fee|₹|rs\.|rupee|exam|mark|grade|result|attendance|login|password|otp)/i.test(questionLower);
            const vagueEscalation = isGenericRequest && !hasSpecificDetails;

            // Check 4: AI's own response is asking for more details — contradicts escalating
            const answerLower = answer.toLowerCase();
            const aiAskingForDetails = /what\s+(is|are)\s+(the|your)\s+(issue|problem|concern)|elaborate|more\s+details|tell\s+me\s+(more|what)|describe\s+(your|the)\s+(issue|problem)/i.test(answerLower);

            const isNoContext = summaryLacksContext || tooShortNoHistory || vagueEscalation || aiAskingForDetails;

            if (isNoContext) {
              // The AI jumped the gun despite prompt instructions. Strip the code and cancel escalation.
              answer = answer.replace(/\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/g, "").trim();

              // Check if the remaining text falsely claims an escalation happened
              // (e.g., "Let me escalate this", "I'll forward this to the team", "I've sent this to support")
              const falseEscalationClaim = /\b(let me escalate|i('ll| will) (escalate|forward|send|share|summarize)|i('ve| have) (escalated|forwarded|sent|shared)|escalat(ed|ing) (this|your|it)|support team can prioritize)\b/i.test(answer);

              if (!answer || answer.length < 10 || falseEscalationClaim) {
                answer = "I completely understand your frustration, and I want to make sure we get this resolved for you. 🙏 Could you please describe the specific problem you are facing? Once I know the details, I'll escalate it to the support team right away.";
              }
              escalateMatch = null; // Kill the escalation process completely
            }
          }
          // Prevent double escalation: check if this session already created a ticket
          const escalationRedis = getRedisClient();
          const escalationKey = `ai:escalated:${sessionId}`;
          const alreadyEscalated = escalationRedis ? await escalationRedis.get(escalationKey) : null;

          if (escalateMatch && !alreadyEscalated) {
            const aiSummary = escalateMatch[1].trim();
            const aiSubject = escalateMatch[2]?.trim() || `AI Escalation: ${aiSummary.slice(0, 80)}`;
            const rawCategory = escalateMatch[3]?.trim().toLowerCase() || "general";
            const rawPriority = escalateMatch[4]?.trim().toLowerCase() || "medium";

            // Map AI-generated categories to valid platform API enum values.
            // The platform API ONLY accepts these 4 category enums:
            // 'technical', 'billing', 'general', 'other'
            const aiCategory = rawCategory;
            const VALID_PRIORITIES: Record<string, string> = {
              "low": "low",
              "medium": "medium",
              "high": "high",
              "urgent": "high",
              "critical": "high",
            };
            const aiPriority = VALID_PRIORITIES[rawPriority] || "medium";

            answer = answer.replace(/\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/g, "").trim();

            // Backend safeguard: if AI only output the code with no polite text, add a fallback
            if (!answer || answer.length < 15) {
              answer = "Your request has been forwarded to the Classgrid support team! They will review it and get back to you shortly.";
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

                formData.append("message", `Auto-escalated from AI Chat.<br/><br/><strong>Original AI Categorization:</strong><br/>Category: ${rawCategory} | Priority: ${rawPriority}<br/><br/><strong>Problem Summary:</strong><br/>${aiSummary}<br/><br/><strong>Last User Message:</strong><br/>${question}`);
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
                    ticketId = ticketResponse?.ticket?._id || ticketResponse?.ticket?.id
                      || ticketResponse?.data?._id || ticketResponse?.data?.id
                      || ticketResponse?._id || ticketResponse?.id
                      || null;
                  } catch (_) { }
                } else {
                  const errorText = await res.text();
                  console.error("Ticket API failed with status", res.status, "body:", errorText);
                  ticketId = `ERROR: ${res.status} ${errorText.substring(0, 100)}`;
                }
              } catch (e) {
                console.error("Failed to auto-create ticket:", e);
                ticketId = `CATCH_ERROR: ${e.message}`;
              }
            }

            if (!isGuest) {
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
                  status: ticketCreated ? "handled" : "pending",
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
            }

            if (ticketCreated) {
              const ticketLink = ticketId
                ? `\n\n*✅ Support Ticket created! Your Ticket ID is **${ticketId}**. Track it here: [Support Requests](/support/requests/${ticketId}?email=${encodeURIComponent(email || "")})*`
                : "\n\n*✅ Support Ticket created! Track your request at [Support Requests](/support/requests).*";
              answer += ticketLink;
              // Mark this session as escalated so we don't create duplicate tickets
              if (escalationRedis) {
                await escalationRedis.set(escalationKey, JSON.stringify({ summary: aiSummary, subject: aiSubject, ticketId }), "EX", 3600);
              }
            } else {
              // If platform API ticket failed (often because the logged-in user isn't linked to an institution/org),
              // it is still logged in Sanity. Preserve the AI's original empathetic answer and append a forwarding note.
              if (email && email !== "anonymous@classgrid.in") {
                answer += "\n\n*Your request has been securely forwarded to the Classgrid team! They will review it shortly.* 🙏";
                // Still mark as escalated since Sanity has the record
                if (escalationRedis) {
                  await escalationRedis.set(escalationKey, JSON.stringify({ summary: aiSummary, subject: aiSubject, ticketId }), "EX", 3600);
                }
              } else {
                answer = "Since you are not logged in, I cannot automatically create a support ticket. For a quick or instant message to our team, please use the **[Contact Page](/contact)**. For a more detailed conversation, please log in and use **[Classgrid Talk](/support/inquiry)**. 😊";
              }
            }
          } else if (escalateMatch && alreadyEscalated) {
            // AI tried to escalate again — instead of blocking, ADD the new context to the existing ticket
            const newContext = escalateMatch[1]?.trim() || question;
            answer = answer.replace(/\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/g, "").trim();

            // Try to add the new context as a reply to the existing ticket
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
                  replyFormData.append("name", body.userName || "User");
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
