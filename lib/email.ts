import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.AWS_SES_SMTP_HOST || "email-smtp.eu-north-1.amazonaws.com",
  port: parseInt(process.env.AWS_SES_SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.AWS_SES_SMTP_USER,
    pass: process.env.AWS_SES_SMTP_PASS,
  },
});

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
