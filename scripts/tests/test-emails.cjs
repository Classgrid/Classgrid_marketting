// Test script to send both email templates to verify design
const nodemailer = require("nodemailer");
require("dotenv").config({ path: ".env.local" });
const crypto = require("crypto");

const BREVO_SMTP_HOST = process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com";
const BREVO_SMTP_PORT = Number(process.env.BREVO_SMTP_PORT || 587);
const BREVO_SMTP_USER = process.env.BREVO_SMTP_USER;
const BREVO_SMTP_PASS = process.env.BREVO_SMTP_PASS;
const SENDER_NAME = process.env.BREVO_SENDER_NAME || "Classgrid";
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || "support@classgrid.in";
const TEST_EMAIL = process.env.TEST_EMAIL || "you@example.com";
const PLATFORM_LOGO_URL = process.env.PLATFORM_LOGO_URL || "https://classgrid.in/Classgrid.png";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://classgrid.in";
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET || "replace-me";

if (!BREVO_SMTP_USER || !BREVO_SMTP_PASS || TEST_EMAIL === "you@example.com") {
  console.error("Set BREVO_SMTP_USER, BREVO_SMTP_PASS, and TEST_EMAIL in .env.local before running this test.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: BREVO_SMTP_HOST,
  port: BREVO_SMTP_PORT,
  secure: BREVO_SMTP_PORT === 465,
  auth: { user: BREVO_SMTP_USER, pass: BREVO_SMTP_PASS },
});

function generateHash(email) {
  return crypto.createHmac("sha256", WEBHOOK_SECRET).update(email).digest("hex").slice(0, 32);
}

const currentYear = new Date().getFullYear();
const unsubHash = generateHash(TEST_EMAIL);
const unsubscribeUrl = `${SITE_URL}/api/blog/unsubscribe?email=${encodeURIComponent(TEST_EMAIL)}&token=${unsubHash}`;

// ========== EMAIL 1: WELCOME / SUBSCRIBE ==========
const welcomeHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Classgrid Updates</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body, html { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0f0f0f; -webkit-font-smoothing: antialiased; }
  </style>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#0f0f0f;width:100%;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;margin:0 auto;max-width:600px;width:100%;">
<tr>
<td style="padding:30px;border-bottom:1px solid #2a2a2a;text-align:center;">
<img src="${PLATFORM_LOGO_URL}" alt="Classgrid" width="48" height="48" style="display:block;margin:0 auto 16px;border-radius:6px;">
<h1 style="color:#ffffff;margin:0;font-size:22px;">Welcome to Classgrid Updates</h1>
<p style="color:#34d399;margin-top:8px;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Subscription Confirmed</p>
</td>
</tr>
<tr>
<td style="padding:30px;color:#cccccc;font-size:14px;line-height:1.7;">
<p style="margin:0 0 20px;color:#cccccc;">Hi there,</p>
<p style="margin:0 0 20px;color:#cccccc;">Thanks for subscribing to the <strong style="color:#fff;">Classgrid Engineering & Education Blog</strong>. You will now receive our latest articles covering SaaS scaling, education tech updates, and development insights straight into your inbox.</p>
<p style="margin:0 0 20px;color:#cccccc;">Here's what you can expect from us:</p>
<ul style="padding-left:20px;margin:0 0 20px;color:#cccccc;font-size:14px;line-height:1.7;">
  <li style="margin-bottom:6px;">Architectural Deep Dives</li>
  <li style="margin-bottom:6px;">Education Strategy Guides</li>
  <li style="margin-bottom:6px;">Engineering Updates from the Classgrid Team</li>
</ul>
<div style="text-align:center;margin:30px 0;">
<a href="https://classgrid.in/blog" style="background:#34d399;color:#000;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:bold;display:inline-block;">Read the Latest Post</a>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #2a2a2a;text-align:center;">
  <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 16px;">Follow us for more updates</p>
  <div>
    <a href="https://www.instagram.com/classgridedu/" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" width="24" height="24" style="opacity:0.8;"></a>
    <a href="https://www.facebook.com/profile.php?id=61588646851017" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" width="24" height="24" style="opacity:0.8;"></a>
    <a href="https://www.youtube.com/channel/UC3ayKBJSpgxEhQQD1Ux6SaA" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;"><img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" width="24" height="24" style="opacity:0.8;"></a>
  </div>
</div>
<div style="margin-top:30px;text-align:center;">
<p style="color:#9ca3af;font-size:13px;margin:0;">Need help? Contact <a href="mailto:support@classgrid.in" style="color:#ffffff;text-decoration:none;">support@classgrid.in</a></p>
</div>
</td>
</tr>
<tr>
<td style="padding:20px;text-align:center;border-top:1px solid #2a2a2a;color:#7a7a7a;font-size:12px;">
<p style="margin:0 0 8px;color:#7a7a7a;font-size:12px;">You received this because you opted into Classgrid Updates.</p>
<p style="margin:0 0 12px;"><a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;font-size:11px;">Unsubscribe from these emails</a></p>
&copy; ${currentYear} Classgrid. All rights reserved.
</td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`;

// ========== EMAIL 2: NEW BLOG POST ==========
const newBlogHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New from Classgrid</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body, html { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #0f0f0f; -webkit-font-smoothing: antialiased; }
  </style>
</head>
<body style="margin:0;padding:0;background:#0f0f0f;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#0f0f0f;width:100%;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#161616;border:1px solid #2a2a2a;border-radius:12px;overflow:hidden;margin:0 auto;max-width:600px;width:100%;">
<tr>
<td style="padding:30px;border-bottom:1px solid #2a2a2a;text-align:center;">
<img src="${PLATFORM_LOGO_URL}" alt="Classgrid" width="48" height="48" style="display:block;margin:0 auto 16px;border-radius:6px;">
<h1 style="color:#ffffff;margin:0;font-size:22px;">New from Classgrid 🟢</h1>
<p style="color:#9ca3af;margin-top:8px;font-size:13px;">A fresh article just dropped on our blog</p>
</td>
</tr>
<tr>
<td style="padding:30px;color:#cccccc;font-size:14px;line-height:1.7;">
<img src="https://cdn.sanity.io/images/a4wk6kp5/production/sample-cover.jpg" alt="Blog Cover" width="600" style="width:100%;max-width:600px;border-radius:8px;display:block;margin:0 auto 20px;background:#222;min-height:200px;">
<h2 style="color:#ffffff;font-size:20px;margin:0 0 8px;line-height:1.3;">How ClassGrid is Revolutionizing Academic Management with AI-Powered Insights</h2>
<p style="color:#9ca3af;font-size:12px;margin:0 0 20px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">By Classgrid Team · April 18, 2026</p>
<p style="color:#cccccc;font-size:14px;line-height:1.7;margin:0 0 25px;">Discover how ClassGrid leverages artificial intelligence to transform classroom administration, attendance tracking, and performance analytics for educational institutions across the globe.</p>
<div style="text-align:center;margin:30px 0;">
<a href="https://classgrid.in/blog/how-classgrid-revolutionizing-academic-management" style="background:#34d399;color:#000;padding:14px 32px;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;display:inline-block;">Read Full Article</a>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #2a2a2a;text-align:center;">
  <p style="color:#ffffff;font-size:14px;font-weight:600;margin:0 0 16px;">Follow us for more updates</p>
  <div>
    <a href="https://www.instagram.com/classgridedu/" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;"><img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" width="24" height="24" style="opacity:0.8;"></a>
    <a href="https://www.facebook.com/profile.php?id=61588646851017" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;"><img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" width="24" height="24" style="opacity:0.8;"></a>
    <a href="https://www.youtube.com/channel/UC3ayKBJSpgxEhQQD1Ux6SaA" target="_blank" style="display:inline-block;margin:0 10px;text-decoration:none;"><img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="YouTube" width="24" height="24" style="opacity:0.8;"></a>
  </div>
</div>
<div style="margin-top:30px;text-align:center;">
<p style="color:#9ca3af;font-size:13px;margin:0;">Need help? Contact <a href="mailto:support@classgrid.in" style="color:#ffffff;text-decoration:none;">support@classgrid.in</a></p>
</div>
</td>
</tr>
<tr>
<td style="padding:20px;text-align:center;border-top:1px solid #2a2a2a;color:#7a7a7a;font-size:12px;">
<p style="margin:0 0 8px;color:#7a7a7a;font-size:12px;">You received this because you subscribed to Classgrid Updates.</p>
<p style="margin:0 0 12px;"><a href="${unsubscribeUrl}" style="color:#9ca3af;text-decoration:underline;font-size:11px;">Unsubscribe from these emails</a></p>
&copy; ${currentYear} Classgrid. All rights reserved.
</td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`;

async function sendBoth() {
  console.log("📧 Sending Email 1: Welcome / Subscribe...");
  try {
    await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
      replyTo: SENDER_EMAIL,
      to: TEST_EMAIL,
      subject: "Welcome to Classgrid Updates 🟢",
      text: "Thanks for subscribing!",
      html: welcomeHtml,
    });
    console.log("✅ Email 1 SENT successfully!");
  } catch (e) {
    console.error("❌ Email 1 FAILED:", e.message);
  }

  console.log("\n📧 Sending Email 2: New Blog Post...");
  try {
    await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SENDER_EMAIL}>`,
      replyTo: SENDER_EMAIL,
      to: TEST_EMAIL,
      subject: "New Post: How ClassGrid is Revolutionizing Academic Management 🟢",
      text: "New blog post from Classgrid.",
      html: newBlogHtml,
    });
    console.log("✅ Email 2 SENT successfully!");
  } catch (e) {
    console.error("❌ Email 2 FAILED:", e.message);
  }

  console.log(`\nDone. Check ${TEST_EMAIL} inbox (or spam folder).`);
}

sendBoth();
