/**
 * Email AI Processor
 *
 * Core logic for processing incoming emails through the AI pipeline:
 * 1. Parse the email content
 * 2. Look up or create conversation in MongoDB
 * 3. Retrieve RAG context
 * 4. Generate AI response via LLM
 * 5. Handle escalation if [ESCALATE] tag detected
 * 6. Send reply via SES SMTP
 * 7. Mark email as read in Zoho
 *
 * This module reuses the existing RAG pipeline from rag-answer.ts
 * and the escalation logic from server.ts.
 */

import { connectMongo } from "../mongodb";
import { getRedisClient } from "../redis";
import { EmailConversation, type IEmailConversation } from "../models/EmailConversation";
import { generateClassgridRagAnswer, type ChatHistoryItem } from "../ai/rag-answer";
import { getSmtpTransporter } from "../smtp-mailer";
import { parseIncomingEmail } from "./email-parser";
import { generateAIReplyEmail } from "./email-template";
import { markEmailAsRead, type ZohoEmailContent } from "./zoho-mail";

// ── Escalation regex (same as server.ts) ──────────────────────────────────────

const ESCALATE_RE = /\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/;
const ESCALATE_RE_G = /\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?\]/g;

// ── Sender filter: skip internal/automated emails ─────────────────────────────

const SKIP_SENDERS = [
  "support@classgrid.in",
  "noreply@classgrid.in",
  "no-reply@classgrid.in",
  "alerts@classgrid.in",
  "notifications@classgrid.in",
  "billing@classgrid.in",
  "help@classgrid.in",
  "mailer-daemon@",
  "postmaster@",
  "noreply@",
  "no-reply@",
];

const SKIP_SUBJECT_PATTERNS = [
  /^(re:\s*)?out of office/i,
  /^(re:\s*)?automatic reply/i,
  /^(re:\s*)?auto-reply/i,
  /^delivery (status|failure)/i,
  /^undeliverable/i,
  /^returned mail/i,
  /^mail delivery (failed|subsystem)/i,
];

/**
 * Check if an email should be skipped (internal, automated, bounce, etc.)
 */
export function shouldSkipEmail(senderEmail: string, subject: string): boolean {
  const senderLower = senderEmail.toLowerCase();

  // 🛑 TEMPORARY HOTFIX: Only allow emails from @gmail.com and @classgrid.in
  // This prevents the AI from trying to reply to automated bots (Razorpay, MongoDB, etc)
  if (!senderLower.endsWith("@gmail.com") && !senderLower.endsWith("@classgrid.in")) {
    return true;
  }

  // Skip known internal/system senders
  for (const skip of SKIP_SENDERS) {
    if (senderLower.includes(skip)) return true;
  }

  // Skip @classgrid.in senders entirely (internal team)
  // if (senderLower.endsWith("@classgrid.in")) return true; // Disabled temporarily to allow internal testing

  // Skip automated/bounce subjects
  for (const pattern of SKIP_SUBJECT_PATTERNS) {
    if (pattern.test(subject)) return true;
  }

  return false;
}

// ── Generate unique Message-ID for replies ────────────────────────────────────

function generateMessageId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 10);
  return `<ai-${timestamp}-${random}@classgrid.in>`;
}

// ── Main Processing Function ──────────────────────────────────────────────────

export type ProcessEmailResult = {
  success: boolean;
  action: "replied" | "escalated" | "skipped" | "error";
  error?: string;
  conversationId?: string;
};

/**
 * Process a single incoming email through the AI pipeline.
 */
export async function processIncomingEmail(
  email: ZohoEmailContent
): Promise<ProcessEmailResult> {
  const startTime = Date.now();

  try {
    // 1. Parse the email
    const parsed = parseIncomingEmail({
      htmlContent: email.htmlContent,
      textContent: email.textContent,
      senderEmail: email.senderEmail,
      senderName: email.senderName,
      subject: email.subject,
    });

    console.log(`\n📧 ════════════════════════════════════════════════════`);
    console.log(`📧 [email-ai] New email from: ${parsed.senderEmail}`);
    console.log(`📧 [email-ai] Subject: ${parsed.subject}`);
    console.log(`📧 [email-ai] Body (cleaned): ${parsed.cleanBody.slice(0, 200)}...`);
    console.log(`📧 ════════════════════════════════════════════════════\n`);

    // 2. Check if we should skip this email
    if (!parsed.senderEmail || shouldSkipEmail(parsed.senderEmail, parsed.subject)) {
      console.log(`⏭️  [email-ai] Skipping email from ${parsed.senderEmail || "unknown"} (internal/automated/empty sender)`);
      await markEmailAsRead(email.messageId, email.folderId);
      return { success: true, action: "skipped" };
    }

    // 3. Skip empty emails
    if (!parsed.cleanBody || parsed.cleanBody.trim().length < 3) {
      console.log(`⏭️  [email-ai] Skipping empty email from ${parsed.senderEmail}`);
      await markEmailAsRead(email.messageId, email.folderId);
      return { success: true, action: "skipped" };
    }

    // 4. Connect to MongoDB
    console.log(`🔌 [email-ai] State: Connecting to MongoDB database...`);
    await connectMongo();

    // 5. Look up or create conversation
    console.log(`🔍 [email-ai] State: Searching for existing conversation thread for ${parsed.senderEmail}...`);
    const threadId = email.threadId || email.messageId || `thread-${Date.now()}`;
    let conversation = await EmailConversation.findOne({
      senderEmail: parsed.senderEmail.toLowerCase(),
      threadId,
    });

    if (!conversation) {
      // Also try to find by email + subject (in case thread IDs differ)
      conversation = await EmailConversation.findOne({
        senderEmail: parsed.senderEmail.toLowerCase(),
        subject: parsed.subject,
        status: { $in: ["active", "escalated"] },
      });
    }

    if (!conversation) {
      conversation = new EmailConversation({
        senderEmail: parsed.senderEmail.toLowerCase(),
        senderName: parsed.senderName,
        threadId,
        subject: parsed.subject,
        messages: [],
        status: "active",
      });
      console.log(`🆕 [email-ai] Created new conversation for ${parsed.senderEmail}`);
    } else {
      console.log(`🔄 [email-ai] Found existing conversation (${conversation.messages.length} messages)`);
    }

    // 6. Add user message to conversation
    conversation.messages.push({
      role: "user",
      content: parsed.cleanBody,
      messageId: email.messageId,
      zohoMessageId: email.messageId,
      createdAt: new Date(),
    });
    conversation.lastMessageAt = new Date();

    // 7. Build chat history for the LLM
    const history: ChatHistoryItem[] = conversation.messages
      .slice(-16) // Last 16 messages (8 exchanges)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    // 8. Generate AI response using existing RAG pipeline
    console.log(`🧠 [email-ai] State: Generating AI response...`);
    console.log(`🧠 [email-ai] State: Passing customer message through RAG Pipeline & LLM...`);

    const result = await generateClassgridRagAnswer({
      question: parsed.cleanBody,
      channel: "web", // Use web channel rules (closest to email)
      userName: parsed.senderName ? parsed.senderName.split(" ")[0] : undefined,
      fullName: parsed.senderName || undefined,
      userEmail: parsed.senderEmail,
      history: history.slice(0, -1), // Exclude the current message (it's the question)
      isGuest: false, // Email senders are treated as authenticated for escalation purposes
    });

    let answer = result.answer || "Thank you for reaching out. Our team will review your message and respond soon.";

    console.log(`\n════════════════════ EMAIL AI RESPONSE ════════════════════`);
    console.log(answer);
    console.log(`═══════════════════════════════════════════════════════════\n`);

    // 9. Handle escalation
    console.log(`⚙️  [email-ai] State: LLM processing finished. Evaluating escalation rules...`);
    let isEscalation = false;
    let ticketId: string | null = null;
    const escalateMatch = answer.match(ESCALATE_RE);

    if (escalateMatch) {
      isEscalation = true;
      const aiSummary = escalateMatch[1].trim();
      const aiSubject = escalateMatch[2]?.trim() || `AI Email Escalation: ${parsed.subject}`;
      const rawCategory = escalateMatch[3]?.trim().toLowerCase() || "general";
      const rawPriority = escalateMatch[4]?.trim().toLowerCase() || "medium";

      // Strip the [ESCALATE] tag from the customer-facing reply
      answer = answer.replace(ESCALATE_RE_G, "").trim();
      if (!answer || answer.length < 15) {
        answer = "Your request has been forwarded to our support team. They will review your email and respond as soon as possible.";
      }

      // Create support ticket via Platform API
      try {
        const formData = new FormData();
        formData.append("name", parsed.senderName || "Email Support User");
        formData.append("email", parsed.senderEmail);
        formData.append("subject", aiSubject);
        formData.append("message", [
          "Auto-escalated from AI Email Support.",
          "",
          `<strong>Original AI Categorization:</strong>`,
          `Category: ${rawCategory} | Priority: ${rawPriority}`,
          "",
          `<strong>Problem Summary:</strong>`,
          aiSummary,
          "",
          `<strong>Original Email Subject:</strong>`,
          parsed.subject,
          "",
          `<strong>Customer's Email:</strong>`,
          parsed.cleanBody,
        ].join("<br/>"));
        formData.append("category", rawCategory);
        formData.append("priority", rawPriority);

        const backendUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";
        const ticketRes = await fetch(`${backendUrl}/api/support/public/tickets`, {
          method: "POST",
          body: formData,
        });

        if (ticketRes.ok) {
          const ticketResponse = await ticketRes.json();
          ticketId = ticketResponse?.ticket?._id || ticketResponse?.ticket?.id
            || ticketResponse?.data?._id || ticketResponse?.data?.id
            || ticketResponse?._id || ticketResponse?.id || null;
          console.log(`✅ [email-ai] Support ticket created: ${ticketId}`);
        } else {
          console.error("[email-ai] Ticket creation failed:", ticketRes.status, await ticketRes.text());
        }
      } catch (e: any) {
        console.error("[email-ai] Failed to create ticket:", e.message);
      }

      // Update conversation status
      conversation.status = "escalated";
      if (ticketId) conversation.escalatedTicketId = ticketId;

      // Log escalation to Sanity
      try {
        const { createClient } = require("next-sanity");
        const writeClient = createClient({
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
          apiVersion: "2024-01-01",
          token: process.env.SANITY_API_WRITE_TOKEN,
          useCdn: false,
        });

        await writeClient.create({
          _type: "aiEscalation",
          userEmail: parsed.senderEmail,
          userName: parsed.senderName || "",
          ipAddress: "email-inbound",
          deviceInfo: "Email Client",
          status: ticketId ? "handled" : "pending",
          ticketCreated: !!ticketId,
          aiSummary,
          subject: aiSubject,
          ticketId: ticketId || "",
          chatTranscript: [
            { _key: `user-${Date.now()}`, role: "user", content: parsed.cleanBody, timestamp: new Date().toISOString() },
            { _key: `ai-${Date.now() + 1}`, role: "assistant", content: answer, timestamp: new Date().toISOString() },
          ],
        });
        console.log(`📋 [email-ai] Escalation logged to Sanity`);
      } catch (e) {
        console.error("[email-ai] Failed to log escalation to Sanity:", e);
      }
    }

    // 10. Add AI response to conversation
    const replyMessageId = generateMessageId();
    conversation.messages.push({
      role: "assistant",
      content: answer,
      messageId: replyMessageId,
      createdAt: new Date(),
    });

    // 11. Save conversation to MongoDB
    await conversation.save();
    console.log(`💾 [email-ai] Conversation saved (${conversation.messages.length} messages total)`);

    // 12. Generate branded HTML email
    const htmlEmail = generateAIReplyEmail({
      recipientName: parsed.senderName || parsed.senderEmail,
      recipientEmail: parsed.senderEmail,
      subject: parsed.subject,
      aiResponse: answer,
      isEscalation,
      ticketId: ticketId || undefined,
    });

    console.log(`\n📤 ════════════ SES EMAIL DISPATCH ════════════`);
    console.log(`📤 [email-ai] Connecting to AWS SES SMTP...`);
    
    const replySubject = parsed.subject.startsWith("Re:") ? parsed.subject : `Re: ${parsed.subject}`;

    // 13. Send reply via SES SMTP
    const transporter = getSmtpTransporter();
    await transporter.sendMail({
      from: `"Classgrid Support" <support@classgrid.in>`,
      to: parsed.senderEmail,
      subject: replySubject,
      html: htmlEmail,
      messageId: replyMessageId.replace(/[<>]/g, ""),
      inReplyTo: email.messageId,
      references: email.messageId,
      headers: {
        "X-Classgrid-AI": "true",
        "X-Classgrid-Conversation": conversation._id?.toString() || "",
      },
    });

    console.log(`✅ [email-ai] ---------------------------------------------`);
    console.log(`✅ [email-ai] STATUS:  SUCCESS - EMAIL SENT`);
    console.log(`✅ [email-ai] TO:      ${parsed.senderEmail}`);
    console.log(`✅ [email-ai] SUBJECT: ${replySubject}`);
    console.log(`✅ [email-ai] ---------------------------------------------`);
    console.log(`📤 ════════════════════════════════════════════════════\n`);

    // 14. Mark original email as read in Zoho
    await markEmailAsRead(email.messageId, email.folderId);
    console.log(`✅ [email-ai] Email marked as read in Zoho`);

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`⏱️  [email-ai] Total processing time: ${duration}s`);
    console.log(`📧 ════════════════════════════════════════════════════\n`);

    return {
      success: true,
      action: isEscalation ? "escalated" : "replied",
      conversationId: conversation._id?.toString(),
    };

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`❌ [email-ai] Error processing email:`, message);
    return { success: false, action: "error", error: message };
  }
}
