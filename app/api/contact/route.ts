import { NextRequest, NextResponse } from "next/server";
import { getSmtpTransporter, getNoReplyAddress, sanitizeMailerError } from "@/lib/smtp-mailer";
import { baseTemplate } from "@/lib/email-templates";

/**
 * POST /api/contact — Handle Contact Us form submissions.
 * Sends form data directly to team@classgrid.in via Brevo SMTP.
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

    const content = `
      <p>You have received a new contact form submission.</p>
      <p><strong>Name:</strong> ${sanitizedName}</p>
      <p><strong>Email:</strong> <a href="mailto:${sanitizedEmail}" style="color: #10b981; text-decoration: none;">${sanitizedEmail}</a></p>
      <p><strong>Phone:</strong> +91 ${sanitizedPhone}</p>
      <br/>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #10b981; padding-left: 16px; margin-left: 0; color: #4b5563;">
        ${formattedMessage}
      </blockquote>
      <br/>
      <p>Submitted via <a href="https://classgrid.in/contact" style="color: #10b981; text-decoration: none; font-weight: bold;">classgrid.in/contact</a></p>
    `;

    const html = baseTemplate({
      content,
      title: 'New Contact Form Submission 📬',
      ignoreText: 'Internal team notification for contact form submissions.',
      hideSupportLink: true,
    });

    await transporter.sendMail({
      from: getNoReplyAddress(),
      to: "Classgrid Team <team@classgrid.in>",
      replyTo: sanitizedEmail,
      subject: `📬 New Contact Form Submission from ${sanitizedName}`,
      text: `New Contact Form:\nName: ${sanitizedName}\nEmail: ${sanitizedEmail}\nPhone: +91 ${sanitizedPhone}\nMessage:\n${(message || "").trim()}`,
      html,
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
