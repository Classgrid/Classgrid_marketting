import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@sanity/client';

// Sanity read client
const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-01-01',
  useCdn: false,
});

// AWS SES SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.AWS_SES_SMTP_HOST,
  port: Number(process.env.AWS_SES_SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.AWS_SES_SMTP_USER,
    pass: process.env.AWS_SES_SMTP_PASS,
  },
});

function buildEmailHtml(name: string, adminReply: string | null): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://classgrid.in';
  const reviewsUrl = `${siteUrl}/reviews`;

  const adminReplySection = adminReply
    ? `
      <tr>
        <td style="padding: 0 40px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0fdf4;border-left:4px solid #10b981;border-radius:0 12px 12px 0;padding:20px 24px;">
            <tr>
              <td>
                <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#059669;letter-spacing:0.12em;text-transform:uppercase;">A note from me personally</p>
                <p style="margin:0;font-size:15px;color:#374151;line-height:1.7;">${adminReply}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Classgrid Review is Live!</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669 0%,#0d9488 100%);padding:40px;text-align:center;">
              <img src="https://classgrid.in/logo.png" alt="Classgrid" width="44" height="44" style="margin-bottom:16px;border-radius:10px;"/>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">Your review is live! 🎉</h1>
              <p style="margin:10px 0 0;font-size:15px;color:rgba(255,255,255,0.85);">Thank you for being part of the Classgrid community.</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 8px;">
              <p style="margin:0 0 20px;font-size:16px;color:#111827;font-weight:600;">Hi ${name},</p>
              <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.8;">
                I personally wanted to reach out and say <strong>thank you so much</strong> for sharing your experience with Classgrid. It genuinely made our day when our team read your review.
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#374151;line-height:1.8;">
                Feedback like yours is exactly what keeps us motivated to build something truly meaningful for educational institutions across India. We're incredibly grateful to have you as part of the Classgrid community.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:0 40px 32px;text-align:center;">
              <p style="margin:0 0 16px;font-size:14px;color:#6b7280;">Your review is now live on our community page:</p>
              <a href="${reviewsUrl}" style="display:inline-block;background:linear-gradient(135deg,#059669,#0d9488);color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 32px;border-radius:50px;letter-spacing:0.3px;">
                👉 View Your Published Review →
              </a>
              <p style="margin:12px 0 0;font-size:13px;color:#9ca3af;">
                <a href="${reviewsUrl}" style="color:#059669;text-decoration:none;">classgrid.in/reviews</a>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px 32px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;"/>
            </td>
          </tr>

          <!-- Admin Reply (conditional) -->
          ${adminReplySection}

          <!-- Closing -->
          <tr>
            <td style="padding:0 40px 40px;">
              <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.8;">
                If you ever have more feedback, suggestions, or simply want to talk, feel free to reply directly to this email. <strong>I read every message personally.</strong>
              </p>
              <p style="margin:0;font-size:15px;color:#374151;">With gratitude,</p>
              <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#111827;">Nikhil Shinde</p>
              <p style="margin:2px 0 0;font-size:13px;color:#6b7280;">CEO &amp; Founder, Classgrid</p>
              <p style="margin:4px 0 0;font-size:13px;">
                <a href="mailto:nikhil.shinde@classgrid.in" style="color:#059669;text-decoration:none;">nikhil.shinde@classgrid.in</a>
                &nbsp;|&nbsp;
                <a href="https://classgrid.in" style="color:#059669;text-decoration:none;">classgrid.in</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                © ${new Date().getFullYear()} Classgrid Technologies. All rights reserved.<br/>
                This email was sent because you submitted a review on classgrid.in.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(req: Request) {
  try {
    const { reviewId } = await req.json();

    if (!reviewId) {
      return NextResponse.json({ message: 'Missing reviewId' }, { status: 400 });
    }

    // Fetch review from Sanity
    const review = await sanityClient.fetch(
      `*[_type == "communityReview" && _id == $id][0]{
        name, email, institution, adminReply, status
      }`,
      { id: reviewId }
    );

    if (!review) {
      return NextResponse.json({ message: 'Review not found in Sanity' }, { status: 404 });
    }

    if (!review.email) {
      return NextResponse.json({ message: 'This review has no email address on file. Cannot send.' }, { status: 400 });
    }

    const html = buildEmailHtml(review.name, review.adminReply || null);

    await transporter.sendMail({
      from: `"Nikhil Shinde | Classgrid" <nikhil.shinde@classgrid.in>`,
      to: review.email,
      subject: `Thank you for sharing your Classgrid experience ❤️`,
      html,
    });

    return NextResponse.json({ message: `Thank you email sent to ${review.email}` }, { status: 200 });
  } catch (error: any) {
    console.error('Error sending thank you email:', error);
    return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500 });
  }
}
