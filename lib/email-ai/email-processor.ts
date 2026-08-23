/**
 * Email AI Processor - v2.1 (duplicate enquiry prevention)
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
import { generateGroqReply } from "../ai/groq-chat";
import { sendFailedEscalationEmail, sendTicketCreatedEscalationEmail } from "../email";

// ── Escalation regex (same as server.ts) ──────────────────────────────────────

const ESCALATE_RE = /\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?(?:\s*\|\s*DRAFT:\s*([\s\S]+))\]/;
const ESCALATE_RE_G = /\[ESCALATE:\s*(.+?)(?:\s*\|\s*SUBJECT:\s*(.+?))?(?:\s*\|\s*CATEGORY:\s*(.+?))?(?:\s*\|\s*PRIORITY:\s*(.+?))?(?:\s*\|\s*DRAFT:\s*([\s\S]+))\]/g;

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
    let threadId = email.threadId || email.messageId || `thread-${Date.now()}`;
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
        status: { $in: ["escalated", "pending_escalation"] },
      }).sort({ updatedAt: -1 });
      if (conversation) {
        console.log(`🔗 [email-ai] Found existing escalated conversation with ticket ${conversation.escalatedTicketId} for ${parsed.senderEmail} — treating new email as follow-up.`);
      }
    }

    // ── TICKET RESOLUTION CHECK ─────────────────────────────────────────────
    // If we found a conversation that was escalated to a real platform ticket,
    // we must check the actual ticket status. If the ticket was resolved or closed
    // by the admin, we should NOT append to it. We must create a brand new ticket.
    let wasTicketClosed = false;
    if (conversation && conversation.escalatedTicketId) {
      await connectMongo();
      const db = mongoose.connection.db;
      if (db && mongoose.isValidObjectId(conversation.escalatedTicketId)) {
         try {
           const ObjectId = mongoose.Types.ObjectId;
           const ticket = await db.collection("supporttickets").findOne({ _id: new ObjectId(conversation.escalatedTicketId) });
           
           // If the ticket was hard-deleted (doesn't exist) OR its status is "closed", force a new ticket.
           // We allow "resolved" tickets to receive follow-ups in case the user needs them reopened.
           if (!ticket || ticket.status === "closed") {
              console.log(`🔒 [email-ai] Existing conversation is linked to a DELETED/CLOSED ticket (${conversation.escalatedTicketId}). Forcing creation of a new ticket.`);
              conversation = null;
              wasTicketClosed = true;
              // Mutate threadId so we don't violate the {senderEmail, threadId} unique index
              threadId = `${threadId}_new_${Date.now()}`;
           }
         } catch (e) {
           console.error("[email-ai] Failed to verify ticket status:", e);
         }
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
    const alreadyEscalated = conversation.status === "escalated" || conversation.status === "pending_escalation" || !!conversation.escalatedTicketId;
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
    let aiDraft = "";

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

    // Cleanup leaked <thought> tags from Claude Thinking models
    answer = answer.replace(/<thought>[\s\S]*?<\/thought>/gi, "").trim();
    
    // Cleanup leaked "thought: ..." plaintext blocks from Claude Thinking models
    // This removes everything from the start of the string up until a greeting or escalate tag
    const thoughtPlaintextMatch = answer.match(/^(?:thought|thinking):[\s\S]*?(?=(?:Hello|Hi|Dear|Greetings|\[ESCALATE\]))/i);
    if (thoughtPlaintextMatch) {
      answer = answer.slice(thoughtPlaintextMatch[0].length).trim();
    }
    // 8.5. Catch AI Rate Limits and Crashes
    // If the LLM provider crashes or hits a 429, it outputs a fallback string.
    // We MUST NOT send this string to the user. We must throw an error so the poller retries in 2 minutes.
    if (
      answer.includes("The AI is currently receiving too many requests") ||
      answer.includes("I am processing your request") ||
      answer.includes("[RATE_LIMITED]") ||
      answer.trim().startsWith("[ERROR:") ||
      answer.trim().length < 5
    ) {
      console.error(`❌ [email-ai] Fatal error: LLM failed, outputted an error, or hit a rate limit. Throwing error to trigger Poller retry...`);
      throw new Error("LLM Error or Generation Failure. Triggering poller retry.");
    }

      console.log(`\n════════════════════ EMAIL AI RESPONSE ════════════════════`);
      console.log(answer);
      console.log(`═══════════════════════════════════════════════════════════\n`);

      // 9. Handle escalation from RAG
      console.log(`⚙️  [email-ai] State: LLM processing finished. Evaluating escalation rules...`);
      const escalateMatch = answer.match(ESCALATE_RE);

      if (wasTicketClosed && !escalateMatch) {
        isEscalation = true;
        aiSummary = "Customer replied to a closed ticket.";
        aiSubject = parsed.subject;
        rawCategory = "general";
        rawPriority = "medium";
        aiDraft = "";
      } else if (escalateMatch && !alreadyEscalated) {
        isEscalation = true;
        aiSummary = escalateMatch[1].trim();
        aiSubject = escalateMatch[2]?.trim() || `AI Email Escalation: ${parsed.subject}`;
        rawCategory = escalateMatch[3]?.trim().toLowerCase() || "general";
        rawPriority = escalateMatch[4]?.trim().toLowerCase() || "medium";
        aiDraft = escalateMatch[5]?.trim() || "";

        // Strip the [ESCALATE] tag from the customer-facing reply
        answer = answer.replace(ESCALATE_RE_G, "");
        
        // Failsafe: Strip malformed/broken escalation tags (e.g. missing the [ESCALATE: prefix)
        // If the AI outputs `some text | SUBJECT: ... | CATEGORY: ... | PRIORITY: ...]`, strip it.
        // We match exactly the broken metadata block to avoid deleting the actual email body.
        answer = answer.replace(/(?:\[ESCALATE:[\s\S]*?)?\|\s*SUBJECT:[\s\S]*?\|\s*CATEGORY:[\s\S]*?\|\s*PRIORITY:[\s\S]*?(?:\|\s*DRAFT:[\s\S]+)?\]/g, "");

        // Clean up any leftover markdown garbage at the end (like --- or ****)
        answer = answer.replace(/[\s\-*]+$/, "").trim();
        
        // Failsafe: If the AI failed to write the email and ONLY outputted the [ESCALATE] tag,
        // we throw an error to trigger the poller retry loop, rather than sending a broken or empty email.
        if (answer.length < 15) {
          console.error(`❌ [email-ai] Fatal error: AI outputted [ESCALATE] but failed to write the email body. Throwing error to trigger Poller retry...`);
          throw new Error("AI failed to generate email body alongside escalation tag. Triggering poller retry.");
        }
      } else if (alreadyEscalated) {
        // AI is following up on an existing open ticket
        if (escalateMatch) {
          console.log(`⚠️  [email-ai] AI tried to re-escalate an already-escalated conversation. Stripping [ESCALATE] tag and replying normally.`);
          answer = answer.replace(ESCALATE_RE_G, "").replace(/[\s\-*]+$/, "").trim();
        }
        
        // Strip out any leaked hallucinated thought blocks or JSON blocks
        answer = answer.replace(/^Thought[\s\S]*?SUBJECT:[\s\S]*?(?:\]|\n\n)/g, "").trim();
        answer = answer.replace(/\[internal_thought_process\][\s\S]*?(?=\n\n|\n[A-Z]|$)/g, "").trim();

        let followUpSummary = escalateMatch?.[1]?.trim();
        if (!followUpSummary && parsed.cleanBody.length > 50) {
          console.log(`🧠 [email-ai] Generating quick summary for follow-up email...`);
          const summaryRes = await generateGroqReply({
            messages: [{ role: "user", content: `Write a very brief 1-sentence summary of this follow-up email from a customer. DO NOT include any greetings or sign-offs, just the summary:\n\n${parsed.cleanBody.slice(0, 2000)}` }],
            temperature: 0.2,
            maxTokens: 100
          });
          if (summaryRes && summaryRes !== "[RATE_LIMITED]") {
            followUpSummary = summaryRes.trim();
          }
        }
        followUpSummary = followUpSummary || "Follow-up reply";
        
        // Override any AI RAG answers on follow-ups to an open ticket.
        // We don't want the AI trying to troubleshoot a P0 crash with generic documentation,
        // nor do we want to send the user "I couldn't find this in the knowledge base".
        answer = "I've added your latest notes to the support ticket. Our team is reviewing the updated information and will get back to you shortly!";
        console.log(`⚠️  [email-ai] Overriding AI RAG response with polite follow-up acknowledgment.`);
        
        // ── APPEND FOLLOW-UP TO EXISTING TICKET (Platform Users) ──────────────
        if (conversation.escalatedTicketId && isPlatformUser) {
          try {
            const backendUrl = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";
            const replyFormData = new FormData();
            replyFormData.append("email", parsed.senderEmail);
            replyFormData.append("name", parsed.senderName || "Email Support User");
            const messageParts = [`<strong>Follow-up via Email AI:</strong>`];
            if (followUpSummary !== "Follow-up reply") {
              messageParts.push(`<br/><br/><strong>AI Summary:</strong><br/>${followUpSummary}`);
            }
            messageParts.push(`<br/><br/><strong>Customer's Raw Email:</strong><br/><div style="white-space:pre-wrap; color:inherit;">${parsed.cleanBody}</div>`);
            replyFormData.append("message", messageParts.join(""));

            // ── SPLIT-SECOND RE-CHECK: Did admin close the ticket while AI was thinking? ──
            let isStillOpen = true;
            try {
              const db = mongoose.connection.db;
              if (db && mongoose.isValidObjectId(conversation.escalatedTicketId)) {
                const ObjectId = mongoose.Types.ObjectId;
                const ticket = await db.collection("supporttickets").findOne({ _id: new ObjectId(conversation.escalatedTicketId) });
                if (!ticket || ticket.status === "closed") {
                  isStillOpen = false;
                  console.log(`[email-ai] ⚠️ Ticket ${conversation.escalatedTicketId} was CLOSED while AI was thinking. Skipping reply.`);
                }
              }
            } catch (e) {}

            if (isStillOpen) {
              const replyRes = await fetch(`${backendUrl}/api/support/public/tickets/${conversation.escalatedTicketId}/reply`, {
                method: "POST",
                body: replyFormData,
                headers: {
                  "x-proxy-auth-email": parsed.senderEmail,
                  "x-proxy-auth-secret": process.env.PLATFORM_JWT_SECRET || process.env.JWT_SECRET || "",
                },
              });

              if (replyRes.ok) {
                console.log(`✅ [email-ai] Appended follow-up to platform ticket ${conversation.escalatedTicketId}`);
              } else {
                console.error("[email-ai] Ticket reply API failed:", replyRes.status, await replyRes.text());
              }
            } else {
              console.log(`[email-ai] Creating replacement ticket because original was closed during generation...`);
              const createFormData = new FormData();
              createFormData.append("email", parsed.senderEmail);
              createFormData.append("name", parsed.senderName || "Email Support User");
              createFormData.append("subject", "Follow-up to closed issue");
              createFormData.append("message", `<strong>Follow-up to a closed issue:</strong><br/>${parsed.cleanBody}`);
              createFormData.append("category", "general");
              createFormData.append("priority", "medium");
              const createRes = await fetch(`${backendUrl}/api/support/public/tickets`, {
                method: "POST",
                body: createFormData,
                headers: {
                  "x-proxy-auth-email": parsed.senderEmail,
                  "x-proxy-auth-secret": process.env.PLATFORM_JWT_SECRET || process.env.JWT_SECRET || "",
                },
              });
              if (createRes.ok) {
                const ticketResponse = await createRes.json();
                const newTicketId = ticketResponse?.ticket?._id || ticketResponse?.ticket?.id || ticketResponse?.data?._id || ticketResponse?.data?.id || ticketResponse?._id || ticketResponse?.id || null;
                conversation.escalatedTicketId = newTicketId;
                conversation.status = "escalated";
                ticketId = newTicketId;
                isEscalation = true;
                answer = `\n\n*✅ Your previous ticket was closed, so I created a new one (#${newTicketId?.slice(0, 8)}). The support team will see the updated information.*\n\n` + answer;
              }
            }

            // Dangling code removed
          } catch (e: any) {
            console.error("[email-ai] Failed to append follow-up to ticket:", e.message);
          }
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
              ${followUpSummary !== "Follow-up reply" ? `<div style="background:#f3f4f6; padding:15px; margin: 15px 0;">
                <h3 style="margin-top:0;">AI Summary of Follow-up</h3>
                <p>${followUpSummary}</p>
              </div>` : ""}
              <div style="background:inherit; padding:15px; margin: 15px 0;">
                <h3 style="margin-top:0;">Customer's Raw Follow-up Message</h3>
                <div style="white-space:pre-wrap; font-family:sans-serif; font-size:14px; line-height:1.5; color:inherit;">${parsed.cleanBody}</div>
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
        if (aiDraft) formData.append("aiDraft", aiDraft);

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

      // Save AI context into MongoDB so /api/escalation/create-enquiry can access it
      if (!conversation.sessionContext) {
        conversation.sessionContext = {};
      }
      conversation.sessionContext.aiSummary = aiSummary;
      conversation.sessionContext.aiSubject = aiSubject;
      conversation.sessionContext.aiCategory = rawCategory;
      conversation.sessionContext.aiPriority = rawPriority;
      if (aiDraft) conversation.sessionContext.aiDraft = aiDraft;

      // ── CRITICAL: Save conversation to MongoDB BEFORE sending the admin email ──
      // The "Create Enquiry" button links to /api/escalation/create-enquiry?escalationId=<conversation._id>
      // If we send the email before saving, the route returns "Escalation not found".
      await conversation.save();
      console.log(`💾 [email-ai] Conversation saved before admin email (${conversation._id})`);

      // Send the failed escalation email if ticket was not created (Non-Platform Users)
      if (!isRealTicket) {
        await sendFailedEscalationEmail(
          parsed.senderEmail,
          parsed.senderName || "Unknown",
          aiSummary,
          ticketId?.startsWith("CATCH") ? "Email AI (Error)" : "Email AI",
          parsed.cleanBody,
          conversation._id.toString()
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

    // 11. Save conversation to MongoDB (if not already saved above in the escalation block)
    if (conversation.isModified()) {
      await conversation.save();
      console.log(`💾 [email-ai] Conversation saved (${conversation.messages.length} messages total)`);
    } else {
      console.log(`💾 [email-ai] Conversation already saved in escalation block, skipping duplicate save.`);
    }

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
