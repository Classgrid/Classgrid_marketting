import { getSmtpTransporter } from "./smtp-mailer";
import { baseTemplate } from "./email-templates";

const SENDER = {
  name: process.env.BREVO_SENDER_NAME || "Classgrid",
  address: process.env.BREVO_SENDER_EMAIL || "support@classgrid.in",
};

export async function sendSafetyEmail(
  toEmail: string,
  userName: string,
  strikeCount: number,
  flaggedMessages: { message: string; timestamp: string }[]
) {
  if (!toEmail) return;

  const name = userName ? userName.split(" ")[0] : "User";
  const isBanned = strikeCount >= 3;

  const subject = isBanned
    ? "Action Required: Your Classgrid Account has been Suspended"
    : "Important: Notice Regarding Classgrid Safety Guidelines";

  const actionText = isBanned
    ? "Your access to the Classgrid Platform and AI Chat has been <strong>permanently suspended</strong> due to repeated safety violations."
    : "Your access to the AI Chat has been <strong>temporarily paused</strong>. Repeated violations may result in a permanent ban of your account and IP address.";

  const strikeListHtml = flaggedMessages
    .map(
      (m, i) =>
        `<li><strong>Strike ${i + 1} (${new Date(m.timestamp).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        })}):</strong> "${m.message}"</li>`
    )
    .join("");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.6;">
      <h2 style="color: ${isBanned ? '#ef4444' : '#f59e0b'}; border-bottom: 2px solid ${isBanned ? '#ef4444' : '#f59e0b'}; padding-bottom: 10px;">Classgrid Trust & Safety</h2>
      <p>Hi ${name},</p>
      <p>We noticed recent messages sent from your account to our Classgrid AI that violate our community safety guidelines.</p>
      
      <div style="background-color: #f8717115; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
        <p style="margin-top: 0; font-weight: bold; color: #b91c1c;">Recorded Violations:</p>
        <ul style="margin-bottom: 0; color: #7f1d1d; padding-left: 20px;">
          ${strikeListHtml}
        </ul>
      </div>

      <p><strong>Why did I receive this?</strong><br/>
      Classgrid maintains strict safety filters to ensure a professional and safe environment for all educational institutions. Language containing profanity, harassment, or inappropriate content is strictly prohibited.</p>

      <p><strong>What happens next?</strong><br/>
      ${actionText}</p>

      <p>To understand why this action was taken, please review our policies on the Classgrid website.</p>
      
      <p>If you believe your messages were flagged by mistake, please reply directly to this email or contact us at <a href="mailto:support@classgrid.in">support@classgrid.in</a>.</p>

      <br/>
      <p style="color: #666; font-size: 14px;">Thank you for keeping Classgrid professional,<br/><strong>The Classgrid Team</strong></p>
    </div>
  `;

  try {
    const transporter = getSmtpTransporter();
    await transporter.sendMail({
      from: `"${SENDER.name}" <${SENDER.address}>`,
      to: toEmail,
      subject,
      html,
    });
    console.log(`[Safety Email] Sent ${isBanned ? 'ban' : 'warning'} email to ${toEmail}`);
  } catch (error) {
    console.error("[Safety Email] Failed to send email:", error);
  }
}

export async function sendFailedEscalationEmail(
  customerEmail: string,
  customerName: string,
  aiSummary: string,
  channel: string,
  originalMessage: string,
  escalationId: string
) {
  const now = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
  const displayName = customerName && customerName !== "Unknown" ? customerName : customerEmail;
  const isChat = channel.toLowerCase().includes("chat");
  const agentName = isChat ? "Classgrid Website Chat Support AI Agent" : "Classgrid Email AI Support Agent";
  const channelType = isChat ? "chat" : "email";

  const subject = `📬 New Customer Inquiry via ${isChat ? 'Chat' : 'Email'} — ${customerEmail}`;
  const content = `
    <p>The <strong>${agentName}</strong> handled an inbound customer ${channelType} and determined it requires human follow-up. A formal support ticket could not be automatically created for this customer — please review and create an inquiry manually.</p>
    
    <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 10px 0;"><strong>Customer:</strong> ${displayName}</p>
      <p style="margin: 0 0 10px 0;"><strong>Email:</strong> <a href="mailto:${customerEmail}" style="color: #ea580c; text-decoration: none;">${customerEmail}</a></p>
      <p style="margin: 0 0 10px 0;"><strong>Received via:</strong> ${channel}</p>
      <p style="margin: 0 0 0 0;"><strong>Date &amp; Time:</strong> ${now} (IST)</p>
    </div>

    <div style="margin: 30px 0; text-align: center;">
      <a href="${process.env.FRONTEND_URL || 'https://classgrid.in'}/api/escalation/create-enquiry?escalationId=${escalationId}" 
         style="display: inline-block; background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; border: 1px solid #4338ca;">
        🎫 Assign Me & Create Enquiry
      </a>
      <p style="margin-top: 10px; font-size: 13px; color: #6b7280;">Clicking this will create a Classgrid Talk inquiry and draft an AI response.</p>
    </div>

    <h3 style="margin-top: 25px; color: #4b5563;">AI Summary of Issue</h3>
    <div style="background-color: #f3f4f6; padding: 12px; border-radius: 4px; color: #1f2937;">
      ${aiSummary}
    </div>

    <h3 style="margin-top: 25px; color: #4b5563;">Customer's Original Message</h3>
    <div style="background-color: #f3f4f6; padding: 12px; border-radius: 4px; color: #1f2937; white-space: pre-wrap;">
      ${originalMessage}
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      This inquiry has also been logged to Sanity Studio under "AI Escalations" for your records.
    </p>
  `;

  const html = baseTemplate({
    content,
    title: `New Customer Inquiry — ${customerEmail}`,
    ignoreText: "Automated email from Classgrid Admin System.",
    hideSupportLink: true,
  });

  try {
    const transporter = getSmtpTransporter();
    await transporter.sendMail({
      from: `"Classgrid AI Alerts" <${SENDER.address}>`,
      to: "team@classgrid.in",
      subject,
      html,
    });
    console.log(`[Email Alert] Sent failed escalation alert to team@classgrid.in for ${customerEmail}`);
  } catch (error) {
    console.error("[Email Alert] Failed to send alert email:", error);
  }
}

export async function sendWhatsAppKillSwitchAlert(messageCount: number, currentMonth: string) {
  const subject = `🚨 URGENT: WhatsApp Kill Switch Activated! (${messageCount} Messages)`;
  const content = `
    <h2 style="color: #ef4444;">WhatsApp Kill Switch Activated!</h2>
    <p>This is an automated critical alert from your Classgrid AI Server.</p>
    <p>Your WhatsApp Business API usage for the month of <strong>${currentMonth}</strong> has reached <strong>${messageCount} messages</strong>.</p>
    <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 10px 0; color: #991b1b;"><strong>Status:</strong> All incoming WhatsApp messages are now being automatically dropped by the server.</p>
      <p style="margin: 0; color: #991b1b;"><strong>Why?</strong> Meta charges for conversations after the first 1000 free tier limit. The Kill Switch fired at 950 to ensure you never pay unexpected bills.</p>
    </div>
    <p><strong>Next Steps:</strong></p>
    <ul>
      <li>If you want to resume WhatsApp services, you must manually increase the Kill Switch limit in <code>server.ts</code>.</li>
      <li>If you do nothing, the bot will remain offline on WhatsApp until the 1st of next month when the counter resets to 0.</li>
    </ul>
    <p>Stay safe!</p>
  `;

  const html = baseTemplate({
    content,
    title: "WhatsApp Kill Switch Activated",
    ignoreText: "Automated email from Classgrid Admin System.",
    hideSupportLink: true,
  });

  try {
    const transporter = getSmtpTransporter();
    await transporter.sendMail({
      from: `"Classgrid AI Alerts" <${SENDER.address}>`,
      to: "nikhil.shinde@classgrid.in", // The user's main email
      subject,
      html,
    });
    console.log(`[Email Alert] Sent WhatsApp Kill Switch Alert to nikhil.shinde@classgrid.in`);
  } catch (error) {
    console.error("[Email Alert] Failed to send Kill Switch alert email:", error);
  }
}
