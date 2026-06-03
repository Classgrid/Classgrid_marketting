import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectMongo } from "@/lib/mongodb";
import { ModerationFlag } from "@/lib/models/ModerationFlag";
import { AiRateLimit } from "../../../lib/models/AiRateLimit";

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
  // leoProfanity.check() is great for English. We also do a quick regex match 
  // for our custom words just to be extremely strict with substrings.
  const normalized = text.toLowerCase();
  const hasCustomWord = customBadWords.some(word => normalized.includes(word.toLowerCase()));

  return leoProfanity.check(text) || hasCustomWord;
}

type AskAiRequestBody = {
  question?: string;
  userName?: string;
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

    if (userEmail) {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const previousStrike = await ModerationFlag.findOne({
        userEmail: userEmail,
        createdAt: { $gte: fifteenMinutesAgo }
      } as any);
      if (previousStrike) {
        bannedUntil = new Date(new Date(previousStrike.createdAt).getTime() + 15 * 60 * 1000);
      }
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
        bannedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }
    }

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

    // Lightweight ban-check from frontend — no need to call Groq
    if (question === "__ban_check__") {
      return NextResponse.json({ status: "ok" }, { status: 200 });
    }

    // --- 1. MODERATION / PROFANITY CHECK FOR NEW MESSAGES ---
    if (containsProfanity(question)) {
      const now = new Date();
      const banExpiry = new Date(now.getTime() + 15 * 60 * 1000);

      // Log the incident in MongoDB
      await ModerationFlag.create({
        userEmail: userEmail || undefined,
        ipAddress: ip,
        reason: "Vulgarity in AI Chat",
        message: question,
      });

      // Stop the conversation immediately and drop a 15-minute ban cookie
      const banExpiryStr = banExpiry.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
      const response = NextResponse.json({
        error: `Your message violates our safety guidelines. The conversation has been terminated. Access resumes at ${banExpiryStr} IST.`,
        bannedUntil: banExpiry.toISOString()
      }, { status: 403 });

      response.cookies.set("ai_chat_restricted", banExpiry.getTime().toString(), {
        maxAge: 15 * 60, // 15 minutes
        path: "/",
        httpOnly: true,
      });

      return response;
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
          error: `You have reached your message limit (${MAX_MESSAGES} messages/hour). Your limit resets at ${resetTimeStr} (in ~${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}).`,
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

    const result = await generateClassgridRagAnswer({
      question,
      channel: "web",
      userName: normalizeText(body?.userName),
      history: mergedHistory,
      pageContext: normalizePageContext(body?.pageContext),
    });

    const answer = result.answer || DEFAULT_ERROR_MESSAGE;

    // Save the AI response to Redis session memory
    await saveMessageToSession(sessionId, { role: "assistant", content: answer });

    return NextResponse.json(
      {
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
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[ask-ai]", message);
    return NextResponse.json({ answer: DEFAULT_ERROR_MESSAGE }, { status: 200 });
  }
}
