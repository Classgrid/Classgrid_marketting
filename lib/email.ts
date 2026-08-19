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
  originalMessage: string
) {
  const subject = `⚠️ AI Escalation Failed (Unregistered User): ${customerEmail}`;
  const content = `
    <p>An unregistered user tried to escalate an issue to support. Because they are not registered on the platform, a support ticket was <strong>not</strong> created.</p>
    
    <div style="background-color: #fff7ed; border-left: 4px solid #ea580c; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
      <p style="margin: 0 0 10px 0;"><strong>Customer Name:</strong> ${customerName}</p>
      <p style="margin: 0 0 10px 0;"><strong>Customer Email:</strong> <a href="mailto:${customerEmail}" style="color: #ea580c; text-decoration: none;">${customerEmail}</a></p>
      <p style="margin: 0 0 10px 0;"><strong>Source:</strong> ${channel}</p>
    </div>

    <h3 style="margin-top: 25px; color: #4b5563;">AI Summary</h3>
    <div style="background-color: #f3f4f6; padding: 12px; border-radius: 4px; color: #1f2937;">
      ${aiSummary}
    </div>

    <h3 style="margin-top: 25px; color: #4b5563;">Original Message</h3>
    <div style="background-color: #f3f4f6; padding: 12px; border-radius: 4px; color: #1f2937; white-space: pre-wrap;">
      ${originalMessage}
    </div>

    <p style="margin-top: 30px; font-size: 14px; color: #6b7280;">
      This incident was also logged to Sanity Studio under "AI Escalations".
    </p>
  `;

  const html = baseTemplate({
    content,
    title: 'New Lead / Unregistered Escalation ⚠️',
    ignoreText: 'Internal team notification for failed AI escalations.',
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
