import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client'; // Adjust path if needed
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

// Note: Ensure you have a write-enabled token in your environment variables.
// You might need to use a dedicated client instance with the token if the default
// client only has read permissions.
// const writeClient = client.withConfig({ token: process.env.SANITY_API_WRITE_TOKEN });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, institution, reviewText, rating, suggestion, moduleName } = body;

    // Basic Validation
    if (!name || !institution || !reviewText || !rating) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare Sanity Document
    const reviewDoc = {
      _type: 'communityReview',
      name,
      email,
      institution,
      reviewText,
      rating: Number(rating),
      suggestion: suggestion || '',
      moduleName: moduleName || 'Overall',
      status: 'pending', // Always default to pending for moderation
    };

    // Use a client configured with a write token
    // If your default client doesn't have a token, you must import createClient
    // and initialize it with process.env.SANITY_API_WRITE_TOKEN
    const writeClient = client.withConfig({
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false, // Must be false for mutations
    });

    const result = await writeClient.create(reviewDoc);

    // --- Send Internal Team Notification Email ---
    try {
      const transporter = getTransporter();
      const content = `
        <p>A new review has just been submitted on classgrid.in/reviews.</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Institution:</strong> ${institution}</p>
        <p><strong>Module:</strong> ${moduleName || 'Overall'}</p>
        <p><strong>Rating:</strong> ${rating} Stars</p>
        <br/>
        <p><strong>Review:</strong></p>
        <blockquote style="border-left: 4px solid #10b981; padding-left: 16px; margin-left: 0; color: #4b5563;">
          ${reviewText}
        </blockquote>
        ${suggestion ? `<br/><p><strong>Suggestion:</strong></p><p>${suggestion}</p>` : ''}
        <br/>
        <p><a href="https://studio.classgrid.in/studio/structure/communityReview;${result._id}" style="color: #10b981; font-weight: bold;">👉 Review and Publish in Sanity Studio</a></p>
      `;

      const html = baseTemplate({
        content,
        title: 'New Classgrid Review Submitted ⭐',
        ignoreText: 'Automated email from Classgrid Admin System.',
        hideSupportLink: true,
      });

      await transporter.sendMail({
        from: '"Classgrid Notifications" <nikhil.shinde@classgrid.in>',
        to: 'team@classgrid.in',
        subject: `New ${rating}★ Review from ${name} (${institution})`,
        html,
      });
    } catch (emailErr) {
      console.error('Failed to send team notification email:', emailErr);
      // We do not return a 500 error here, because the review was successfully saved to Sanity.
    }

    return NextResponse.json(
      { message: 'Review submitted successfully', id: result._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error submitting review to Sanity:', error);
    return NextResponse.json(
      { message: 'Failed to submit review', error: error.message },
      { status: 500 }
    );
  }
}
