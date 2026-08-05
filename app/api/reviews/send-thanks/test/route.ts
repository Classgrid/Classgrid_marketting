import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { baseTemplate } from '@/lib/email-templates';

// AWS SES SMTP transporter (lazy to avoid reading env at build time)
const getTransporter = () => nodemailer.createTransport({
  host: process.env.AWS_SES_SMTP_HOST,
  port: Number(process.env.AWS_SES_SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.AWS_SES_SMTP_USER,
    pass: process.env.AWS_SES_SMTP_PASS,
  },
});

// GET /api/reviews/send-thanks/test — sends a test email to nikhil.shinde@classgrid.in
export async function GET() {
  try {
    const reviewsUrl = 'https://classgrid.in/reviews';
    const adminReply = "Hi Nikhil! We're so happy to hear that Classgrid has made a real difference at PCCOE. Thank you for taking the time to share your experience with us. Your feedback means a lot to our entire team and helps us continue building Classgrid better.";

    const content = `
      <p>Hi <strong>Nikhil (Test)</strong>,</p>

      <p>I personally wanted to reach out and say — thank you so much for sharing your honest experience with Classgrid. It genuinely made our day at the team when we read your review.</p>

      <p>Feedback like yours is exactly what keeps us motivated to build something truly great for institutions across India. We are so glad to have you as part of the Classgrid community!</p>

      <p>Your review is now live on our community page for everyone to see:</p>

      <div style="text-align:center;margin:30px 0;">
        <a href="${reviewsUrl}" class="btn">👉 View Your Published Review →</a>
        <div style="margin-top: 8px;">
          <a href="${reviewsUrl}" style="color: #6b7280; font-size: 13px;">classgrid.in/reviews</a>
        </div>
      </div>

      <p style="margin-top: 24px; color: #111111;"><strong>A note from me personally:</strong></p>
      <p style="margin-top: 8px; color: #374151; font-style: italic;">"${adminReply}"</p>

      <p style="margin-top: 24px;">If you ever have more feedback, suggestions, or just want to talk — feel free to reply to this email directly. I read every single one.</p>

      <p style="margin-bottom: 2px;">With gratitude,</p>
      <p style="margin-bottom: 2px;"><strong>Nikhil Shinde</strong></p>
      <p style="color: #6b7280; font-size: 13px; margin: 0;">CEO & Founder, Classgrid</p>
      <p style="font-size: 13px; margin: 16px 0 0;">
        <a href="mailto:nikhil.shinde@classgrid.in" style="color: #10b981;">nikhil.shinde@classgrid.in</a>
        &nbsp;|&nbsp;
        <a href="https://classgrid.in" style="color: #10b981;">classgrid.in</a>
      </p>
    `;

    const html = baseTemplate({
      content,
      title: 'Your Review is Live!',
      ignoreText: '⚠️ This is a TEST email sent from localhost. Do not reply.',
      hideSupportLink: true,
    });

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Nikhil Shinde | Classgrid" <nikhil.shinde@classgrid.in>`,
      to: 'nikhil.shinde@classgrid.in',
      subject: `[TEST] Thank you for sharing your Classgrid experience ❤️`,
      html,
    });

    return NextResponse.json({ message: 'Test email sent to nikhil.shinde@classgrid.in ✅' }, { status: 200 });
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json({ message: 'Failed to send test email', error: error.message }, { status: 500 });
  }
}
