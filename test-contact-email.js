const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env.local" });

function escapeHtml(s) { return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function nl2br(s) { return escapeHtml(s).replace(/\n/g,"<br/>"); }

async function main() {
  const t = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: 587, secure: false, requireTLS: true,
    auth: { user: process.env.BREVO_SMTP_USER, pass: process.env.BREVO_SMTP_PASS }
  });

  const n = "Nikhil Shinde";
  const e = "nikhilsubsun321@gmail.com";
  const p = "8623947038";
  const m = `Hello Classgrid Team,

I am the Principal of ABC International School, Pune. We have approximately 2,500 students and are currently looking to digitize our entire academic and administrative workflow.

Could you please share details about your ERP modules, pricing plans, and implementation timeline?

Looking forward to hearing from you.

Best regards,
Nikhil Shinde
Principal, ABC International School`;

  await t.sendMail({
    from: '"Classgrid" <support@classgrid.in>',
    to: "nikhilsubsun321@gmail.com",
    subject: `📬 New Contact Form Submission from ${n}`,
    html: `<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Inter',sans-serif;background:#0f0f0f;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;"><img src="https://classgrid.in/Classgrid.png" alt="Classgrid" style="height:40px;"/></div>
  <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;padding:32px;">
    <h2 style="color:#fff;margin:0 0 24px;font-size:20px;">New Contact Form Submission</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;width:100px;">Name</td><td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;font-weight:600;">${escapeHtml(n)}</td></tr>
      <tr><td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;">Email</td><td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;"><a href="mailto:${escapeHtml(e)}" style="color:#10b981;text-decoration:none;">${escapeHtml(e)}</a></td></tr>
      <tr><td style="padding:12px 0;color:#888;font-size:13px;border-bottom:1px solid #2a2a2a;">Phone</td><td style="padding:12px 0;color:#fff;font-size:14px;border-bottom:1px solid #2a2a2a;">+91 ${escapeHtml(p)}</td></tr>
    </table>
    <div style="margin-top:24px;padding:20px;background:#111;border:1px solid #2a2a2a;border-radius:12px;">
      <p style="color:#888;font-size:12px;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">Message</p>
      <div style="color:#e0e0e0;font-size:14px;line-height:1.8;word-wrap:break-word;word-break:break-word;">${nl2br(m)}</div>
    </div>
  </div>
  <div style="text-align:center;margin-top:32px;padding-top:20px;border-top:1px solid #1a1a1a;">
    <p style="color:#555;font-size:11px;margin:0;">Submitted via <a href="https://classgrid.in/contact" style="color:#10b981;text-decoration:none;">classgrid.in/contact</a></p>
  </div>
</div></body></html>`
  });
  console.log("✅ Email sent to nikhilsubsun321@gmail.com!");
}
main().catch(e => { console.error("❌", e.message); process.exit(1); });
