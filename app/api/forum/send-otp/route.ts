import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/mongodb";
import ForumOTP from "@/lib/models/ForumOTP";
import { checkRateLimit } from "@/lib/rate-limit";
import { getForumOtpEmailHtml } from "@/lib/email-templates";
import { getNoReplyAddress, getSupportEmail, getSmtpConfig, getSmtpTransporter, sanitizeMailerError } from "@/lib/smtp-mailer";

const OTP_TTL_SECONDS = 60;

export async function POST(req: Request) {
  let normalizedEmail: string | null = null;
  const startedAt = Date.now();

  try {
    let body: { email?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
    }

    normalizedEmail = String(body?.email || "").trim().toLowerCase();

    if (!normalizedEmail || !/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Rate limiting: 5 requests per hour per email
    const isAllowed = checkRateLimit(`otp_${normalizedEmail}`, 5, 60 * 60 * 1000);
    if (!isAllowed) {
      return NextResponse.json({ error: "Too many OTP requests. Please try again later." }, { status: 429 });
    }

    const smtpConfig = getSmtpConfig();
    const mongoStartedAt = Date.now();
    await connectMongo();

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Keep the code valid for the same window shown in the login UI and email.
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + OTP_TTL_SECONDS);

    // Upsert the OTP record
    await ForumOTP.findOneAndUpdate(
      { email: normalizedEmail },
      { otp, expiresAt, attempts: 0 },
      { upsert: true, returnDocument: "after" }
    );
    const mongoMs = Date.now() - mongoStartedAt;

    const htmlContent = getForumOtpEmailHtml(otp);
    const transporter = getSmtpTransporter();
    const smtpStartedAt = Date.now();

    const result = await transporter.sendMail({
      from: getNoReplyAddress(),
      replyTo: getSupportEmail(),
      to: normalizedEmail,
      subject: "Your Classgrid Login Code",
      text: `Your Classgrid login code is ${otp}. It expires in 60 seconds.`,
      html: htmlContent,
    });
    const smtpMs = Date.now() - smtpStartedAt;

    console.info("Forum OTP email accepted by SMTP", {
      to: normalizedEmail,
      messageId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      pending: result.pending,
      response: result.response,
      mongoMs,
      smtpMs,
      totalMs: Date.now() - startedAt,
    });

    if (result.rejected?.length) {
      await ForumOTP.deleteOne({ email: normalizedEmail });
      return NextResponse.json(
        { error: "Email provider rejected this address. Please try another email or contact support." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    if (normalizedEmail) {
      await ForumOTP.deleteOne({ email: normalizedEmail }).catch(() => undefined);
    }

    console.error("Error sending OTP:", sanitizeMailerError(error));
    return NextResponse.json(
      { error: "Failed to send OTP. Please try again or contact support." },
      { status: 500 }
    );
  }
}
