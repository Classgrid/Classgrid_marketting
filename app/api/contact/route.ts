import { NextRequest, NextResponse } from "next/server";
import { getSmtpTransporter, getNoReplyAddress, sanitizeMailerError } from "@/lib/smtp-mailer";

/**
 * POST /api/contact — Handle Contact Us form submissions.
 * Sends form data directly to support@classgrid.in via Brevo SMTP.
 * No third-party (Formspree) dependency.
 */

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(str: string) {
  return escapeHtml(str).replace(/\n/g, "<br/>");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, phoneNumber, message } = body;

    if (!email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, message: "Email and message are required." },
        { status: 400 }
      );
    }

    // Validate email format — must have a proper domain with TLD (e.g. .com, .in, .edu)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const sanitizedName = escapeHtml((fullName || "").trim() || "Anonymous");
    const sanitizedEmail = escapeHtml(email.trim().toLowerCase());
    const sanitizedPhone = escapeHtml((phoneNumber || "").trim() || "Not provided");
    const formattedMessage = nl2br((message || "").trim());

    const transporter = getSmtpTransporter();

    await transporter.sendMail({
      from: getNoReplyAddress(),
      to: "support@classgrid.in",
      replyTo: sanitizedEmail,
      subject: `📬 New Contact Form Submission from ${sanitizedName}`,
      text: `New Contact Form:\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nPhone: +91 ${sanitizedPhone}\nMessage:\n${(message || "").trim()}`,
      html: `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0f0f0f;">
<div style="max-width:600px;margin:0 auto;padding:40px 24px;">
  <div style="text-align:center;margin-bottom:32px;">
    <img src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/android-chrome-512x512.png" alt="Classgrid" style="height:40px;" />
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

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully.",
    });
  } catch (err: unknown) {
    const sanitized = sanitizeMailerError(err);
    console.error("[Contact] Form submission error:", sanitized.message);
    return NextResponse.json(
      { success: false, message: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
