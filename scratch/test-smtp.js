import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
const PLATFORM_LOGO_URL = "https://classgrid.in/Classgrid.png";
function supportBaseTemplate({ content, title = "Support", ignoreText = null }) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Classgrid</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body, html {
      margin: 0; padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #0f0f0f;
      -webkit-font-smoothing: antialiased;
    }
    h1, h2, h3 { 
      color: #ffffff; 
      margin-top: 0; 
      margin-bottom: 16px;
    }
    p { 
      margin: 0 0 20px; 
      color: #cccccc; 
      font-size: 14px; 
      line-height: 1.7; 
    }
    strong { color: #ffffff; }
    a { color: #3b82f6; text-decoration: underline; }
    
    .btn {
      display: inline-block;
      background-color: #ffffff;
      color: #000000 !important;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: bold;
      margin: 10px 0;
      text-align: center;
    }
    .box {
      background-color: #161616;
      border: 1px solid #2a2a2a;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 24px;
    }
    .box p { margin-bottom: 8px; color: #cccccc; }
    .box p:last-child { margin-bottom: 0; }
    .box .meta {
      font-size: 12px;
      color: #9ca3af;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#0f0f0f;width:100%;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;margin:0 auto;max-width:600px;width:100%;">
<tr>
<td style="padding:30px;border-bottom:1px solid #2a2a2a;text-align:center;">
<img src="${PLATFORM_LOGO_URL}" alt="Classgrid" width="48" height="48" style="display:block;margin:0 auto 16px;border-radius:6px;">
<h1 style="color:#ffffff;margin:0;font-size:20px;">${title}</h1>
</td>
</tr>
<tr>
<td style="padding:30px;color:#cccccc;font-size:14px;line-height:1.7;">
${content}
<div style="margin-top:30px;">
<p style="color:#9ca3af;font-size:13px;margin:0;">
Need help? Contact <a href="mailto:support@classgrid.in" style="color:#ffffff;text-decoration:none;">support@classgrid.in</a>
</p>
</div>
</td>
</tr>
<tr>
<td style="padding:20px;text-align:center;border-top:1px solid #2a2a2a;color:#7a7a7a;font-size:12px;">
${ignoreText ? `<p style="margin-bottom:12px;color:#7a7a7a;font-size:12px;">${ignoreText}</p>` : ''}
&copy; ${new Date().getFullYear()} Classgrid. All rights reserved.
</td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
}

// ── EMAIL 3: ADMIN REPLY ──
function buildTicketReplyEmailHtml({ ticket, adminName, conversationUrl }) {
    const subject = ticket.subject || "your support request";
    const requesterName = ticket.submitterName || "there";
    const ticketId = String(ticket._id).slice(0, 8).toUpperCase();
    const now = new Date();
    const updatedDate = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

    const content = `
    <p>Hi ${escapeHtml(requesterName)},</p>
    <p>We have an update for you. A member of the Classgrid Support Team has reviewed your request and posted a detailed response to your ticket. We want to make sure you see it and that your issue gets fully resolved.</p>
    <p style="font-weight:600;font-size:15px;margin-top:20px;">Here is your ticket summary:</p>
    <div class="box" style="border-left: 3px solid #34d399;">
      <div class="meta">TICKET #${ticketId}</div>
      <p style="color:#ffffff;font-size:15px;font-weight:600;margin:8px 0 4px 0;">${escapeHtml(subject)}</p>
      <p style="color:#cccccc;font-size:13px;margin:4px 0;">System: Classgrid ERP</p>
      <span style="color:#34d399;font-size:13px;font-weight:600;">Status: Updated — Response Posted</span>
      <p class="meta" style="margin-top:8px;">Last Updated: ${updatedDate}</p>
      <p class="meta">Assigned To: Classgrid Support Team</p>
    </div>
    <p style="font-weight:600;font-size:15px;margin-top:24px;">How to Read and Respond</p>
    <p>Your full response is waiting for you on the Classgrid Support Portal. Click the button below to log in, read the complete reply from our team, and continue the conversation directly from your dashboard.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${escapeHtml(conversationUrl)}" class="btn">View Full Response on Dashboard →</a>
    </div>
    <p>For the fastest response, we recommend replying directly through your dashboard where our team can see the full conversation history and context.</p>
    <p style="font-weight:600;font-size:15px;margin-top:24px;">Is Your Issue Resolved?</p>
    <p>If the response from our team has fully resolved your issue, no further action is needed. Your ticket will be automatically marked as resolved after 5 business days of inactivity.</p>
    <p>If the issue is not yet resolved or if you have additional questions, please respond via the dashboard so our team can continue working with you. We will not close your ticket until you confirm that the matter has been fully addressed.</p>
    <p style="font-weight:600;font-size:15px;margin-top:24px;">Need More Help?</p>
    <p>If you're running into issues beyond this ticket, here are a few resources that may help:</p>
    <p style="margin:4px 0;">• <strong>Help Center:</strong> <a href="https://classgrid.in/help-center">classgrid.in/help-center</a> — step-by-step guides, FAQs, and video walkthroughs</p>
    <p style="margin:4px 0;">• <strong>Book a Support Call:</strong> If your issue requires a live walkthrough, our team can schedule a screen-share session with you. Just mention it in your dashboard reply and we'll set it up.</p>
    <p>Thank you for your patience, ${escapeHtml(requesterName)}. We're committed to making sure your experience with Classgrid is seamless.</p>
    <p style="margin-bottom:0;">Warm regards,<br><strong>Classgrid Support Team</strong><br>
    <span class="meta">support@classgrid.in | classgrid.in</span><br>
    <span class="meta">Support Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST</span><br>
    <span class="meta">For urgent issues, visit our Help Center at classgrid.in/help-center or respond via your dashboard.</span></p>
    `;

    return supportBaseTemplate({
        content,
        title: `Our team has responded to your request – Ticket #${ticketId}`,
        ignoreText: "You are receiving this because you submitted a support ticket on Classgrid."
    });
}

// ── EMAIL 1 & 2: NEW TICKET ──
function buildNewTicketEmailHtml({ ticket, conversationUrl }) {
    const subject = ticket.subject || "your support request";
    const requesterName = ticket.submitterName || "there";
    const ticketId = String(ticket._id).slice(0, 8).toUpperCase();
    const now = new Date();
    const submittedDate = now.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const isPlatform = Boolean(ticket.organization_id);

    if (isPlatform) {
        // ── EMAIL 1: PLATFORM SUPPORT ──
        const content = `
        <p>Hi ${escapeHtml(requesterName)},</p>
        <p>Thank you for reaching out to the Classgrid Support Team. We want you to know that your request has been successfully received, logged, and assigned to our support staff for review. You don't need to do anything right now — we've got it from here.</p>
        <p style="font-weight:600;font-size:15px;margin-top:20px;">Below is a full summary of your submitted ticket for your reference:</p>
        <div class="box" style="border-left: 3px solid #34d399;">
          <div class="meta">TICKET #${ticketId}</div>
          <p style="color:#ffffff;font-size:15px;font-weight:600;margin:8px 0 4px 0;">${escapeHtml(subject)}</p>
          <p style="color:#cccccc;font-size:13px;margin:4px 0;">System: Classgrid ERP</p>
          <span style="color:#34d399;font-size:13px;font-weight:600;">Status: Open</span>
          <p class="meta" style="margin-top:8px;">Priority: Standard</p>
          <p class="meta">Submitted On: ${submittedDate}</p>
          <p class="meta">Expected First Response: Within 24 business hours</p>
        </div>
        <p style="font-weight:600;font-size:15px;margin-top:24px;">What Happens Next?</p>
        <p>Our technical support team will carefully review the details of your request. Depending on the nature of the issue, we may reach out to you for additional information such as screenshots, error messages, browser details, or the steps you were taking when the issue occurred. The more context you can share, the faster we can resolve it for you.</p>
        <p>Once a team member has reviewed and responded to your ticket, you will receive an immediate email notification. All communication will be centralised in one place so nothing gets missed.</p>
        <p>You can track the real-time status of your ticket, view any responses from our team, and reply directly by visiting your support portal:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${escapeHtml(conversationUrl)}" class="btn">Track Your Request on the Support Portal →</a>
        </div>
        <p style="font-weight:600;font-size:15px;margin-top:24px;">Tips to Help Us Resolve This Faster</p>
        <p>If you haven't already, consider sharing any of the following details through your dashboard to help us resolve this faster:</p>
        <p style="margin:4px 0;">• The exact error message you are seeing on screen</p>
        <p style="margin:4px 0;">• The browser and device you are using</p>
        <p style="margin:4px 0;">• Whether this issue started recently or has been ongoing</p>
        <p style="margin:4px 0;">• Any recent changes made to your account or settings</p>
        <p>You can add this information directly through your support dashboard using the button above.</p>
        <p>We understand that access issues can be disruptive to your workflow and we treat login-related tickets with high priority. Our team is committed to getting you back on the Classgrid Dashboard as quickly as possible.</p>
        <p>Thank you for your patience, ${escapeHtml(requesterName)}. We'll be in touch very soon.</p>
        <p style="margin-bottom:0;">Warm regards,<br><strong>Classgrid Support Team</strong><br>
        <span class="meta">support@classgrid.in | classgrid.in</span><br>
        <span class="meta">Support Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST</span><br>
        <span class="meta">For urgent issues, visit our Help Center at classgrid.in/help-center or respond via your dashboard.</span></p>
        `;
        return supportBaseTemplate({ content, title: "Platform Support Request", ignoreText: "You are receiving this because you submitted a support ticket on Classgrid." });
    } else {
        // ── EMAIL 2: CLASSGRID TALK ──
        const demoUrl = "https://classgrid.in/#demo";
        const content = `
        <p>Hi ${escapeHtml(requesterName)},</p>
        <p>Thank you for reaching out through Classgrid Talk. We're glad you're here, and we want to make sure you have the best possible experience as you explore what Classgrid can do for your organisation.</p>
        <p>Your request has been received and logged with our pre-sales and community support team. A specialist will be in touch with you shortly.</p>
        <div class="box" style="border-left: 3px solid #34d399;">
          <div class="meta">TICKET #${ticketId}</div>
          <p style="color:#ffffff;font-size:15px;font-weight:600;margin:8px 0 4px 0;">${escapeHtml(subject)}</p>
          <p style="color:#cccccc;font-size:13px;margin:4px 0;">Channel: Classgrid Talk</p>
          <span style="color:#34d399;font-size:13px;font-weight:600;">Status: Open</span>
          <p class="meta" style="margin-top:8px;">Submitted On: ${submittedDate}</p>
          <p class="meta">Expected First Response: Within 24 business hours</p>
        </div>
        <p style="font-weight:600;font-size:15px;margin-top:24px;">What Is Classgrid Talk?</p>
        <p>Classgrid Talk is our dedicated community and pre-sales engagement space, built specifically for organisations and decision-makers who are exploring Classgrid's ERP platform and want to learn more before making a commitment.</p>
        <p>Whether you are evaluating our platform for the first time, comparing modules, asking about custom service packages, or simply trying to understand how Classgrid fits your organisation's needs — Classgrid Talk is the right place to have that conversation. Our product specialists, solution consultants, and existing Classgrid users are all active on Talk, so you're never just speaking to a support bot. You're speaking to people who understand your industry and your challenges.</p>
        <p style="font-weight:600;font-size:15px;margin-top:24px;">What You Can Do on Classgrid Talk</p>
        <p>Here is what Classgrid Talk is designed to help you with:</p>
        <p><strong>Learn About the Platform</strong><br>Get a clear, honest picture of what Classgrid is, how it works, and what makes it different from other ERP solutions. Ask any question — no question is too basic or too technical.</p>
        <p><strong>Explore Modules &amp; Features</strong><br>Classgrid's ERP is modular by design. You can explore individual modules such as finance, HR, inventory, procurement, operations, and more. Our team will walk you through which modules are relevant to your business size and industry.</p>
        <p><strong>Understand Custom Services</strong><br>Every organisation has unique workflows. Our team can discuss how Classgrid's custom service packages work — including implementation support, data migration, dedicated onboarding, API integrations, and ongoing managed services tailored specifically to your requirements.</p>
        <p><strong>Post, Ask &amp; Discuss</strong><br>You can post questions, start discussions, respond to threads, and engage directly with Classgrid's product and solutions team. It's a live, active space — not a static FAQ page.</p>
        <p><strong>Connect After Your Demo</strong><br>If you've already booked a demo or had a discovery call with our team, Classgrid Talk is where we encourage you to continue the conversation. It's a space where you can ask follow-up questions, revisit anything discussed during your meeting, share feedback, and stay engaged with our team between formal touchpoints.</p>
        <p style="font-weight:600;font-size:15px;margin-top:24px;">Did You Recently Book a Demo or Schedule a Meeting With Us?</p>
        <p>If our team suggested Classgrid Talk after your demo or introductory call, you're in exactly the right place. Talk is designed to keep the conversation going after that first meeting — so you can ask detailed questions, get module-specific information, understand pricing structures, and move forward with full clarity and confidence.</p>
        <p>If you haven't booked a demo yet and would like to see Classgrid in action, you can schedule a personalised walkthrough with one of our solution consultants here:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${escapeHtml(demoUrl)}" class="btn">Book a Demo →</a>
        </div>
        <p style="font-weight:600;font-size:15px;margin-top:24px;">What Happens Next With Your Ticket?</p>
        <p>A member of our support team will review your request and respond to you directly within 24 business hours. If your query requires involvement from a solutions consultant or a product specialist, we will loop them in on your behalf — you won't need to re-explain anything.</p>
        <p>You can track and manage your ticket here:</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${escapeHtml(conversationUrl)}" class="btn">View Your Ticket →</a>
        </div>
        <p>If you have anything to add to your request, you can do so directly through your dashboard. All updates will be attached to Ticket #${ticketId} so the full context is always available to our team.</p>
        <p>We're genuinely excited to show you what Classgrid can do, ${escapeHtml(requesterName)}. Whatever stage of evaluation you're at, our team is here to give you the information, clarity, and confidence you need to make the right decision for your organisation.</p>
        <p>Talk to you soon.</p>
        <p style="margin-bottom:0;">Warm regards,<br><strong>Classgrid Support Team</strong><br>
        <span class="meta">support@classgrid.in | classgrid.in</span><br>
        <span class="meta">Support Hours: Monday – Saturday, 9:00 AM – 7:00 PM IST</span></p>
        `;
        return supportBaseTemplate({ content, title: "Welcome to Classgrid Talk – Your Request Has Been Received", ignoreText: "You are receiving this because you submitted a support ticket on Classgrid." });
    }
}

async function testSMTP() {
    console.log("Sending all 3 enterprise emails...");
    
    const transporter = nodemailer.createTransport({
        host: process.env.BREVO_SMTP_HOST,
        port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
        secure: false,
        auth: {
            user: process.env.BREVO_SMTP_USER,
            pass: process.env.BREVO_SMTP_PASS,
        },
    });

    try {
        const mockPlatformTicket = {
            _id: "6a15dcc781a2c2a230fd030f",
            subject: "Cannot login to Classgrid Dashboard",
            submitterName: "Nikhil",
            submitterEmail: "classgrid26@gmail.com",
            organization_id: "fake_org_id"
        };
        
        const mockTalkTicket = {
            _id: "7b26ecc892b3d3b341ge141g",
            subject: "How do I create a new post?",
            submitterName: "Nikhil",
            submitterEmail: "classgrid26@gmail.com",
            organization_id: null
        };
        
        const conversationUrl = "https://classgrid.in/support/requests/6a15dcc781a2c2a230fd030f?email=classgrid26%40gmail.com";

        const email1 = buildNewTicketEmailHtml({ ticket: mockPlatformTicket, conversationUrl });
        const email2 = buildNewTicketEmailHtml({ ticket: mockTalkTicket, conversationUrl });
        const email3 = buildTicketReplyEmailHtml({ ticket: mockPlatformTicket, adminName: "Komal Shinde", conversationUrl });

        console.log("Sending Email 1 (Platform New Ticket)...");
        await transporter.sendMail({
            from: `"Classgrid" <${process.env.BREVO_SENDER_EMAIL}>`,
            to: "classgrid26@gmail.com",
            subject: "[OPUS-FINAL] Platform Support Request",
            html: email1,
        });

        console.log("Sending Email 2 (Talk New Ticket)...");
        await transporter.sendMail({
            from: `"Classgrid" <${process.env.BREVO_SENDER_EMAIL}>`,
            to: "classgrid26@gmail.com",
            subject: "[OPUS-FINAL] Classgrid Talk Request",
            html: email2,
        });

        console.log("Sending Email 3 (Admin Reply)...");
        await transporter.sendMail({
            from: `"Classgrid" <${process.env.BREVO_SENDER_EMAIL}>`,
            to: "classgrid26@gmail.com",
            subject: "[OPUS-FINAL] Admin Reply Notification",
            html: email3,
        });

        console.log("✅ All 3 emails handed to Brevo successfully!");
    } catch (error) {
        console.error("❌ SMTP Error:", error.message);
    }
}

testSMTP();
