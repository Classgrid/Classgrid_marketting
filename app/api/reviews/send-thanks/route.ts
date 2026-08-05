import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@sanity/client';
import { baseTemplate } from '@/lib/email-templates';

// Sanity read client (lazy to avoid reading env at build time)
const getSanityClient = () => createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-01-01',
  useCdn: false,
});

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

function buildReviewThankYouContent(name: string, adminReply: string | null): string {
  const reviewsUrl = 'https://classgrid.in/reviews';

  const adminReplyBlock = adminReply
    ? `
      <div style="margin-top: 24px; padding: 20px 24px; background-color: #f0fdf4; border-left: 4px solid #10b981; border-radius: 0 8px 8px 0;">
        <div class="meta">A note from me personally</div>
        <p style="margin: 0; color: #374151; line-height: 1.7;">${adminReply}</p>
      </div>
    ` : '';

  return `
    <p>Hi <strong>${name}</strong>,</p>

    <p>I personally wanted to reach out and say <strong>thank you so much</strong> for sharing your experience with Classgrid. It genuinely made our day when our team read your review.</p>

    <p>Feedback like yours is exactly what keeps us motivated to build something truly meaningful for educational institutions across India. We're incredibly grateful to have you as part of the Classgrid community.</p>

    <p>Your review is now live on our community page:</p>

    <div style="text-align:center;margin:30px 0;">
      <a href="${reviewsUrl}" class="btn">👉 View Your Published Review →</a>
    </div>

    ${adminReplyBlock}

    <p style="margin-top: 24px;">If you ever have more feedback, suggestions, or simply want to talk, feel free to reply directly to this email. <strong>I read every message personally.</strong></p>

    <p>With gratitude,</p>
    <p style="margin-bottom: 2px;"><strong>Nikhil Shinde</strong></p>
    <p style="color: #6b7280; font-size: 13px; margin: 0;">CEO & Founder, Classgrid</p>
    <p style="font-size: 13px; margin: 4px 0 0;">
      <a href="mailto:nikhil.shinde@classgrid.in" style="color: #10b981;">nikhil.shinde@classgrid.in</a>
      &nbsp;|&nbsp;
      <a href="https://classgrid.in" style="color: #10b981;">classgrid.in</a>
    </p>
  `;
}

export async function POST(req: Request) {
  try {
    const { reviewId } = await req.json();

    if (!reviewId) {
      return NextResponse.json({ message: 'Missing reviewId' }, { status: 400 });
    }

    // Fetch review from Sanity
    const sanityClient = getSanityClient();
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

    const content = buildReviewThankYouContent(review.name, review.adminReply || null);
    const html = baseTemplate({
      content,
      title: 'Your Review is Live!',
      ignoreText: 'You are receiving this because you submitted a review on classgrid.in.',
      hideSupportLink: true,
    });

    const transporter = getTransporter();
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
