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

import mongoose from "mongoose";
import { connectMongo } from "../mongodb";
import { getRedisClient } from "../redis";
import { EmailConversation, type IEmailConversation } from "../models/EmailConversation";
import { generateClassgridRagAnswer, type ChatHistoryItem } from "../ai/rag-answer";
import { getSmtpTransporter } from "../smtp-mailer";
import { parseIncomingEmail } from "./email-parser";
import { generateAIReplyEmail } from "./email-template";
import { markEmailAsRead, type ZohoEmailContent } from "./zoho-mail";
import { sendFailedEscalationEmail, sendTicketCreatedEscalationEmail } from "../email";

// ── Escalation regex (same as server.ts) ──────────────────────────────────────

const ESCALATE_RE = /\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?(?:\s*\|\s*DRAFT:\s*([\s\S]+?))?\]/;
const ESCALATE_RE_G = /\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?(?:\s*\|\s*DRAFT:\s*([\s\S]+?))?\]/g;

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

// Sentiment Pre-Filter has been removed. All emails are now routed directly through the main RAG AI.

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

    // Clean up empty subjects from Gmail
    if (!parsed.subject || parsed.subject.toLowerCase().includes("(no subject)")) {
      parsed.subject = "Classgrid Support";
    }

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
      // DUPLICATE TICKET PREVENTION: If this email address already has an escalated
      // conversation with a real ticket (from any thread/subject), reuse it so we
      // don't create multiple tickets for the same user.
      conversation = await EmailConversation.findOne({
        senderEmail: parsed.senderEmail.toLowerCase(),
        status: "escalated",
        escalatedTicketId: { $exists: true, $ne: null },
      }).sort({ updatedAt: -1 });
      if (conversation) {
        console.log(`🔗 [email-ai] Found existing escalated conversation with ticket ${conversation.escalatedTicketId} for ${parsed.senderEmail} — treating new email as follow-up.`);
      }
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
      console.log(`🔄 [email-ai] Found existing conversation (${conversation.messages.length} messages, status: ${conversation.status})`);
    }

    // ── DUPLICATE ESCALATION GUARD ──────────────────────────────────────────
    // If this conversation was already escalated (real ticket or pending),
    // do NOT re-escalate. Just reply normally or skip.
    const alreadyEscalated = conversation.status === "escalated" || conversation.status === "pending_escalation";
    if (alreadyEscalated) {
      console.log(`⚠️  [email-ai] Conversation already escalated (status: ${conversation.status}). Skipping re-escalation for ${parsed.senderEmail}.`);
    }

    // ── DUPLICATE MESSAGE GUARD ─────────────────────────────────────────────
    // If the exact same messageId was already added (poller retry), skip adding it again.
    const messageAlreadyAdded = conversation.messages.some(
      (m) => m.zohoMessageId === email.messageId || m.messageId === email.messageId
    );
    if (messageAlreadyAdded) {
      console.log(`⏭️  [email-ai] Message ${email.messageId} already in conversation — marking as read and skipping.`);
      await markEmailAsRead(email.messageId, email.folderId);
      return { success: true, action: "skipped" };
    }

    // 5. Cap the email body to 15,000 characters to prevent LLM token overflow on massive emails
    const safeBody = parsed.cleanBody.slice(0, 15000);

    // 6. Add user message to conversation
    conversation.messages.push({
      role: "user",
      content: safeBody,
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

    let answer = "";
    let isEscalation = false;
    let ticketId: string | null = null;
    let aiSummary = "";
    let aiSubject = parsed.subject;
    let rawCategory = "general";
    let rawPriority = "medium";

    // 8. Check if user is a registered platform user
    let isPlatformUser = false;
    let platformUserDetails = { role: "N/A", orgId: "N/A", orgName: "N/A", status: "N/A" };
    try {
      await connectMongo();
      const db = mongoose.connection.db;
      if (db) {
        const platformUser = await db.collection("users").findOne({
          email: { $regex: new RegExp(`^${parsed.senderEmail}$`, 'i') }
        });
        isPlatformUser = !!(platformUser && platformUser.organization_id);
        if (platformUser) {
          let orgName = "Unknown";
          if (platformUser.organization_id && platformUser.organization_id !== "platform") {
             const org = await db.collection("organizations").findOne({ organization_id: platformUser.organization_id });
             if (org && org.name) orgName = org.name;
          }
          
          platformUserDetails = {
            role: platformUser.role || "N/A",
            orgId: platformUser.organization_id || "N/A",
            orgName: orgName,
            status: platformUser.status || platformUser.accountStatus || "active"
          };
        }
      }
    } catch (e) {
      console.error("[email-ai] Failed to check platform user status", e);
    }

    // 9. Generate AI response using existing RAG pipeline
    console.log(`🧠 [email-ai] State: Generating AI response...`);
    console.log(`🧠 [email-ai] State: Passing customer message through RAG Pipeline & LLM... (isPlatformUser: ${isPlatformUser})`);

    const result = await generateClassgridRagAnswer({
      question: safeBody,
      channel: "email", // Use professional email channel rules
      userName: parsed.senderName ? parsed.senderName.split(" ")[0] : undefined,
      fullName: parsed.senderName || undefined,
      userEmail: parsed.senderEmail,
      history: history.slice(0, -1), // Exclude the current message (it's the question)
      isGuest: !isPlatformUser, 
    });

    answer = result.answer || "";

    // 8.5. Catch AI Rate Limits and Crashes
    // If the LLM provider crashes or hits a 429, it outputs a fallback string.
    // We MUST NOT send this string to the user. We must throw an error so the poller retries in 2 minutes.
    if (
      answer.includes("The AI is currently receiving too many requests") ||
      answer.includes("I am processing your request") ||
      answer.includes("[RATE_LIMITED]") ||
      answer.trim().length < 5
    ) {
      console.error(`❌ [email-ai] Fatal error: LLM failed or hit a rate limit. Throwing error to trigger Poller retry...`);
      throw new Error("LLM Rate Limit or Generation Failure. Triggering poller retry.");
    }

      console.log(`\n════════════════════ EMAIL AI RESPONSE ════════════════════`);
      console.log(answer);
      console.log(`═══════════════════════════════════════════════════════════\n`);

      // 9. Handle escalation from RAG
      console.log(`⚙️  [email-ai] State: LLM processing finished. Evaluating escalation rules...`);
      const escalateMatch = answer.match(ESCALATE_RE);

      if (escalateMatch && !alreadyEscalated) {
        isEscalation = true;
        aiSummary = escalateMatch[1].trim();
        aiSubject = escalateMatch[2]?.trim() || `AI Email Escalation: ${parsed.subject}`;
        rawCategory = escalateMatch[3]?.trim().toLowerCase() || "general";
        rawPriority = escalateMatch[4]?.trim().toLowerCase() || "medium";

        // Strip the [ESCALATE] tag from the customer-facing reply
        answer = answer.replace(ESCALATE_RE_G, "");
        
        // Failsafe: Strip malformed/broken escalation tags (e.g. missing the [ESCALATE: prefix)
        // If the AI outputs `some text | SUBJECT: ... | CATEGORY: ... | PRIORITY: ...]`, strip it.
        // We match exactly the broken metadata block to avoid deleting the actual email body.
        answer = answer.replace(/(?:\[ESCALATE:[\s\S]*?)?\|\s*SUBJECT:[\s\S]*?\|\s*CATEGORY:[\s\S]*?\|\s*PRIORITY:[\s\S]*?(?:\|\s*DRAFT:[\s\S]*?)?\]/g, "");

        // Clean up any leftover markdown garbage at the end (like --- or ****)
        answer = answer.replace(/[\s\-*]+$/, "").trim();
        
        // Failsafe: If the AI failed to write the email and ONLY outputted the [ESCALATE] tag,
        // we throw an error to trigger the poller retry loop, rather than sending a broken or empty email.
        if (answer.length < 15) {
          console.error(`❌ [email-ai] Fatal error: AI outputted [ESCALATE] but failed to write the email body. Throwing error to trigger Poller retry...`);
          throw new Error("AI failed to generate email body alongside escalation tag. Triggering poller retry.");
        }
      } else if (escalateMatch && alreadyEscalated) {
        // AI wanted to escalate again but we already did — just strip the tag and reply normally.
        console.log(`⚠️  [email-ai] AI tried to re-escalate an already-escalated conversation. Stripping [ESCALATE] tag and replying normally.`);
        
        const followUpSummary = escalateMatch[1].trim();
        answer = answer.replace(ESCALATE_RE_G, "").replace(/[\s\-*]+$/, "").trim();
        
        // Failsafe: If the AI output ONLY the escalate tag, provide a generic polite response
        // instead of crashing with a Mongoose empty string validation error.
        if (answer.length < 5) {
          answer = "I've added your latest notes to the support ticket. Our team is already looking into this and will get back to you shortly!";
          console.log(`⚠️  [email-ai] Re-escalation resulted in empty email body. Using fallback polite response.`);
        }
        
        // Forward the follow-up alert to the team!
        try {
          const transporter = getSmtpTransporter();
          await transporter.sendMail({
            from: `"Classgrid AI Alerts" <support@classgrid.in>`,
            to: "team@classgrid.in",
            subject: `[FOLLOW-UP] Re: ${aiSubject}`,
            html: `
              <h2>User provided more details on an escalated ticket</h2>
              <p><strong>Customer:</strong> ${parsed.senderName || parsed.senderEmail} (${parsed.senderEmail})</p>
              ${conversation.escalatedTicketId ? `<p><strong>Platform Ticket ID:</strong> ${conversation.escalatedTicketId}</p>` : ""}
              <p><strong>Is Registered Platform User:</strong> ${isPlatformUser ? "Yes" : "No"}</p>
              ${isPlatformUser ? `<p><strong>Platform Role:</strong> ${platformUserDetails.role}</p>
              <p><strong>Account Status:</strong> <span style="text-transform:capitalize;">${platformUserDetails.status}</span></p>
              <p><strong>Institution:</strong> ${platformUserDetails.orgName} (${platformUserDetails.orgId})</p>` : ""}
              <div style="background:#f3f4f6; padding:15px; margin: 15px 0;">
                <h3 style="margin-top:0;">AI Summary of Follow-up</h3>
                <p>${followUpSummary}</p>
              </div>
              <div style="background:#f3f4f6; padding:15px; margin: 15px 0;">
                <h3 style="margin-top:0;">Customer's Raw Follow-up Message</h3>
                <pre style="white-space:pre-wrap; font-family:sans-serif;">${parsed.cleanBody}</pre>
              </div>
              <p style="color:#6b7280; font-size:12px; margin-top:20px;">Automated email from Classgrid Admin System.</p>
            `
          });
          console.log(`✅ [email-ai] Sent follow-up alert to team@classgrid.in`);
        } catch(e) {
          console.error(`❌ [email-ai] Failed to send follow-up alert to team:`, e);
        }
      }

    if (isEscalation) {
      if (isPlatformUser) {
        // Create support ticket via Platform API for registered users only
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
        ].join("<br/>"));
        formData.append("category", rawCategory);
        formData.append("priority", rawPriority);

        const backendUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";
        const ticketRes = await fetch(`${backendUrl}/api/support/public/tickets`, {
          method: "POST",
          body: formData,
          headers: {
            "x-proxy-auth-email": parsed.senderEmail,
            "x-proxy-auth-secret": process.env.PLATFORM_JWT_SECRET || process.env.JWT_SECRET || "",
          },
        });

        if (ticketRes.ok) {
          const ticketResponse = await ticketRes.json();
          ticketId = ticketResponse?.ticket?._id || ticketResponse?.ticket?.id
            || ticketResponse?.data?._id || ticketResponse?.data?.id
            || ticketResponse?._id || ticketResponse?.id || null;
          console.log(`✅ [email-ai] Support ticket created: ${ticketId}`);
        } else {
          const errorText = await ticketRes.text();
          console.error("[email-ai] Ticket creation failed:", ticketRes.status, errorText);
          ticketId = `ERROR: ${ticketRes.status} ${errorText.substring(0, 100)}`;
        }
      } catch (e: any) {
        console.error("[email-ai] Failed to create ticket:", e.message);
        ticketId = `CATCH_ERROR: ${e.message}`;
      }
    }

    // Check if we actually got a real ticket ID from the backend, not an error string
    const isRealTicket = ticketId && !ticketId.startsWith("ERROR") && !ticketId.startsWith("CATCH");

      // Update conversation status
      conversation.status = isRealTicket ? "escalated" : "pending_escalation";
      if (isRealTicket) {
        conversation.escalatedTicketId = ticketId;
      }

      let escalationId = "";
      // Log escalation to Sanity
      try {
        const { createClient } = require("next-sanity");
        const writeClient = createClient({
          projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
          apiVersion: "2024-01-01",
          token: process.env.SANITY_API_WRITE_TOKEN,
          useCdn: false,
        });

        const newDoc = await writeClient.create({
          _type: "aiEscalation",
          userEmail: parsed.senderEmail,
          userName: parsed.senderName || "",
          ipAddress: "email-inbound",
          deviceInfo: "Email Client",
          status: isRealTicket ? "handled" : "pending",
          ticketCreated: !!isRealTicket,
          aiSummary,
          subject: aiSubject,
          ticketId: ticketId || "",
          chatTranscript: [
            { _key: `user-${Date.now()}`, role: "user", content: parsed.cleanBody, timestamp: new Date().toISOString() },
            { _key: `ai-${Date.now() + 1}`, role: "assistant", content: answer, timestamp: new Date().toISOString() },
          ],
        });
        escalationId = newDoc._id;
        console.log(`📋 [email-ai] Escalation logged to Sanity (${escalationId})`);
      } catch (e) {
        console.error("[email-ai] Failed to log escalation to Sanity:", e);
      }

      // Send the failed escalation email if ticket was not created
      if (!isRealTicket) {
        await sendFailedEscalationEmail(
          parsed.senderEmail,
          parsed.senderName || "Unknown",
          aiSummary,
          ticketId?.startsWith("CATCH") ? "Email AI (Error)" : "Email AI",
          parsed.cleanBody,
          escalationId
        );
      } else {
        // Send success escalation email for platform users
        await sendTicketCreatedEscalationEmail(
          parsed.senderEmail,
          parsed.senderName || "Unknown",
          aiSummary,
          "Email AI",
          parsed.cleanBody,
          ticketId
        );
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
      recipientName: parsed.senderName || "",
      recipientEmail: parsed.senderEmail,
      subject: parsed.subject,
      aiResponse: answer,
      isEscalation,
      ticketId: (isEscalation && ticketId && !ticketId.startsWith("ERROR") && !ticketId.startsWith("CATCH")) ? ticketId : undefined,
      originalMessage: parsed.textBody || parsed.cleanBody,
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
