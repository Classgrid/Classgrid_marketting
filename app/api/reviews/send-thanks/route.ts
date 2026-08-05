import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createClient } from '@sanity/client';
import { baseTemplate } from '@/lib/email-templates';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Sanity read client (lazy to avoid reading env at build time)
const getSanityClient = () => createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
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

function buildReviewThankYouContent(name: string, adminReply: string | null, customBody: string | null): string {
  if (customBody) {
    // Convert plain text newlines to HTML line breaks so it looks exactly as they typed it in the box
    return `<div style="white-space: pre-wrap; font-family: inherit; font-size: 15px; color: #374151; line-height: 1.6;">${customBody}</div>`;
  }

  const reviewsUrl = 'https://classgrid.in/reviews';

  const cleanReply = adminReply ? adminReply.replace(/^Hi\s+[^!\.,\n]+[!,\.]?\s*/i, '') : '';

  const adminReplyBlock = cleanReply
    ? `
      <p style="margin-top: 24px; color: #111111;"><strong>A note from me personally:</strong></p>
      <p style="margin-top: 8px; color: #374151; font-style: italic;">"${cleanReply}"</p>
    ` : '';

  return `
    <p>Hi <strong>${name}</strong>,</p>

    <p>I personally wanted to reach out and say — thank you so much for sharing your honest experience with Classgrid. It genuinely made our day at the team when we read your review.</p>

    <p>Feedback like yours is exactly what keeps us motivated to build something truly great for institutions across India. We are so glad to have you as part of the Classgrid community!</p>

    <p>Your review is now live on our community page for everyone to see:</p>

    <div style="text-align:center;margin:30px 0;">
      <a href="${reviewsUrl}" class="btn">👉 View Your Published Review →</a>
      <div style="margin-top: 8px;">
        <a href="${reviewsUrl}" style="color: #6b7280; font-size: 13px;">classgrid.in/reviews</a>
      </div>
    </div>

    ${adminReplyBlock}

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
}

export async function POST(req: Request) {
  try {
    const { reviewId } = await req.json();

    if (!reviewId) {
      return NextResponse.json({ message: 'Missing reviewId' }, { status: 400, headers: corsHeaders });
    }

    // Fetch review from Sanity
    const sanityClient = getSanityClient();
    const review = await sanityClient.fetch(
      `*[_type == "communityReview" && _id == $id][0]{
        name, email, institution, adminReply, status, customEmailSubject, customEmailBody
      }`,
      { id: reviewId }
    );

    if (!review) {
      return NextResponse.json({ message: 'Review not found in Sanity' }, { status: 404, headers: corsHeaders });
    }

    if (!review.email) {
      return NextResponse.json({ message: 'This review has no email address on file. Cannot send.' }, { status: 400, headers: corsHeaders });
    }

    const content = buildReviewThankYouContent(review.name, review.adminReply || null, review.customEmailBody || null);
    const html = baseTemplate({
      content,
      title: review.customEmailSubject || 'Thank you for sharing your Classgrid experience ❤️',
      ignoreText: 'You are receiving this because you submitted a review on classgrid.in.',
      hideSupportLink: true,
    });

    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"Nikhil Shinde | Classgrid" <nikhil.shinde@classgrid.in>`,
      to: review.email,
      subject: review.customEmailSubject || `Thank you for sharing your Classgrid experience ❤️`,
      html,
    });

    return NextResponse.json({ message: `Thank you email sent to ${review.email}` }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error('Error sending thank you email:', error);
    return NextResponse.json({ message: 'Failed to send email', error: error.message }, { status: 500, headers: corsHeaders });
  }
}
