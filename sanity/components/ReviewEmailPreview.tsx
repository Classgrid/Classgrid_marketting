import React, { useEffect, useState } from 'react';
import { Box, Card, Text, Flex, Spinner } from '@sanity/ui';

export function ReviewEmailPreview(props: any) {
  const { displayed } = props.document;
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    // Generate the exact HTML used in the email
    const name = displayed.name || '[Reviewer Name]';
    const adminReply = displayed.adminReply || '[Admin Reply will appear here]';
    const reviewsUrl = 'https://classgrid.in/reviews';
    const customSubject = displayed.customEmailSubject;
    const customBody = displayed.customEmailBody;

    // Use custom subject or default
    const subject = customSubject || 'Thank you for sharing your Classgrid experience ❤️';

    // We strip "Hi [Name]" if they typed it by accident
    const cleanReply = adminReply.replace(/^Hi\s+[^!\.,\n]+[!,\.]?\s*/i, '');

    const generatedBody = `
      <div class="content">
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

        <p style="margin-top: 24px; color: #111111;"><strong>A note from me personally:</strong></p>
        <p style="margin-top: 8px; color: #374151; font-style: italic;">"${cleanReply}"</p>

        <p style="margin-top: 24px;">If you ever have more feedback, suggestions, or just want to talk — feel free to reply to this email directly. I read every single one.</p>

        <p style="margin-bottom: 2px;">With gratitude,</p>
        <p style="margin-bottom: 2px;"><strong>Nikhil Shinde</strong></p>
        <p style="color: #6b7280; font-size: 13px; margin: 0;">CEO & Founder, Classgrid</p>
        <p style="font-size: 13px; margin: 16px 0 0;">
          <a href="mailto:nikhil.shinde@classgrid.in" style="color: #10b981; text-decoration: none;">nikhil.shinde@classgrid.in</a>
          &nbsp;|&nbsp;
          <a href="https://classgrid.in" style="color: #10b981; text-decoration: none;">classgrid.in</a>
        </p>
      </div>
    `;

    const finalBody = customBody 
      ? `<div class="content" style="white-space: pre-wrap; font-family: inherit; font-size: 15px; color: #374151; line-height: 1.6;">${customBody}</div>` 
      : generatedBody;

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <style>
          body { margin: 0; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #eaeaea; overflow: hidden; }
          .subject-bar { background: #fdfdfd; padding: 15px 30px; font-size: 14px; font-weight: 600; color: #111; border-bottom: 1px solid #eaeaea; }
          .header { text-align: center; padding: 30px; border-bottom: 1px solid #eaeaea; }
          .header img { height: 42px; }
          .content { padding: 30px; color: #374151; font-size: 14px; line-height: 1.7; }
          .content h1 { color: #111111; margin-top: 0; }
          .content p { margin: 0 0 20px; }
          .btn { display: inline-block; background: #000000; color: #ffffff !important; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; }
          .footer { padding: 20px; text-align: center; background: #f9f9f9; color: #6b7280; font-size: 12px; border-top: 1px solid #eaeaea; }
        </style>
      </head>
      <body>
        <div style="max-width: 600px; margin: 0 auto 20px; font-size: 12px; color: #888;">
          Note: This is a preview. Subject and body will be sent exactly as shown below.
        </div>
        <div class="container">
          <div class="subject-bar">Subject: ${subject}</div>
          <div class="header">
            <img src="https://classgrid.in/logo.png" alt="Classgrid" />
          </div>
          ${finalBody}
          <div class="footer">
            <p style="margin: 0;">© ${new Date().getFullYear()} Classgrid. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    setHtml(emailHtml);
  }, [displayed]);

  if (!html) {
    return (
      <Flex align="center" justify="center" height="fill">
        <Spinner />
      </Flex>
    );
  }

  return (
    <Card height="fill" display="flex" flex={1}>
      <iframe
        title="Email Preview"
        srcDoc={html}
        style={{ width: '100%', height: '100%', border: 'none' }}
      />
    </Card>
  );
}
