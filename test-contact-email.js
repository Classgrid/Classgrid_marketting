const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env.local" });

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

  const sanitizedName = "Rahul Sharma";
  const sanitizedEmail = "rahul.sharma@example.com";
  const sanitizedPhone = "9876543210";
  const sanitizedMessage = "Hello Classgrid Team,\n\nI am the Principal of ABC International School, Pune. We have approximately 2,500 students and are currently looking to digitize our entire academic and administrative workflow.\n\nCould you please share details about your ERP modules, pricing plans, and implementation timeline?\n\nLooking forward to hearing from you.\n\nBest regards,\nRahul Sharma\nPrincipal, ABC International School";

  await transporter.sendMail({
    from: `"Classgrid" <${process.env.BREVO_SENDER_EMAIL || "support@classgrid.in"}>`,
    to: "nikhilsubsun123@gmail.com",
    subject: `📬 New Contact Form Submission from ${sanitizedName}`,
    text: `New Contact Form:\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nPhone: +91 ${sanitizedPhone}\nMessage: ${sanitizedMessage}`,
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
        <td style="padding:10px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;width:120px;">Name</td>
        <td style="padding:10px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;font-weight:600;">${sanitizedName}</td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;">Email</td>
        <td style="padding:10px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;"><a href="mailto:${sanitizedEmail}" style="color:#10b981;text-decoration:none;">${sanitizedEmail}</a></td>
      </tr>
      <tr>
        <td style="padding:10px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;">Phone</td>
        <td style="padding:10px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">+91 ${sanitizedPhone}</td>
      </tr>
    </table>
    <div style="margin-top:24px;padding:20px;background:#111;border:1px solid #2a2a2a;border-radius:12px;">
      <p style="color:#888;font-size:12px;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
      <p style="color:#e0e0e0;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${sanitizedMessage}</p>
    </div>
  </div>
  <p style="text-align:center;color:#555;font-size:11px;margin-top:24px;">Submitted via classgrid.in/contact</p>
</div>
</body></html>`,
  });

  console.log("✅ Test contact form email sent to nikhilsubsun123@gmail.com!");
}

sendTestContactEmail().catch((err) => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});
