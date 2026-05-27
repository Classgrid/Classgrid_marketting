const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env.local" });

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(str) {
  return escapeHtml(str).replace(/\n/g, "<br/>");
}

async function sendTestContactEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT || 587),
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  const sanitizedName = escapeHtml("Nikhil Shinde");
  const sanitizedEmail = escapeHtml("rhaulpen@gmail.com");
  const sanitizedPhone = escapeHtml("9373697038");
  const rawMessage = `Privacy is the fundamental right of an individual or group to seclude themselves or their personal information from the public, and to determine when, how, and to what extent this information is communicated to others. It spans personal space, physical seclusion, and—most commonly today—digital data.

Privacy is broadly categorized into a few key areas:

1. Data Privacy
Also known as information privacy, this involves your digital footprint and the ability to control how organizations, tech companies, and governments collect, store, and share your personal data (such as financial information, location data, and browsing habits).

2. Internet Privacy
A subset of data privacy, this focuses specifically on the security and visibility of your information while you are online. It involves protecting Personally Identifiable Information (PII) from mass surveillance, malicious hackers, or unauthorized data brokers. Many users utilize private browsing modes (like Incognito) or VPNs to enhance their web anonymity.

3. Physical & Personal Privacy
This is the traditional, real-world concept of privacy. It protects an individual's space, seclusion, and personal affairs from unwarranted intrusions.

Why It Matters
Experts and human rights advocates note that privacy is considered a fundamental human right. It protects personal autonomy, safeguards individuals from abuses of power, and prevents identity theft and targeted manipulation.`;

  const formattedMessage = nl2br(rawMessage);

  await transporter.sendMail({
    from: `"Classgrid" <${process.env.BREVO_SENDER_EMAIL || "support@classgrid.in"}>`,
    to: "nikhilsubsun123@gmail.com",
    subject: `📬 New Contact Form Submission from ${sanitizedName}`,
    html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f0f0f;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="https://classgrid.in/Classgrid.png" alt="Classgrid" style="height:40px;" />
  </div>
  <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;padding:32px;">
    <h2 style="color:#ffffff;margin:0 0 24px;font-size:20px;">New Contact Form Submission</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;width:100px;vertical-align:top;">Name</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;font-weight:600;">${sanitizedName}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Email</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;"><a href="mailto:${sanitizedEmail}" style="color:#10b981;text-decoration:none;">${sanitizedEmail}</a></td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;vertical-align:top;">Phone</td>
        <td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">+91 ${sanitizedPhone}</td>
      </tr>
    </table>
    <div style="margin-top:24px;padding:20px;background:#111;border:1px solid #2a2a2a;border-radius:12px;">
      <p style="color:#888;font-size:12px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Message</p>
      <div style="color:#e0e0e0;font-size:14px;line-height:1.8;margin:0;word-wrap:break-word;word-break:break-word;overflow-wrap:break-word;">${formattedMessage}</div>
    </div>
  </div>
  <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #1a1a1a;">
    <p style="color:#555;font-size:11px;margin:0;">Submitted via <a href="https://classgrid.in/contact" style="color:#10b981;text-decoration:none;">classgrid.in/contact</a></p>
  </div>
</div>
</body></html>`,
  });

  console.log("✅ Improved test email sent to nikhilsubsun123@gmail.com!");
}

sendTestContactEmail().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
