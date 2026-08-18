/**
 * AI Email Reply Template
 *
 * Uses the existing Classgrid baseTemplate from email-templates.ts
 * to ensure consistent branding across all emails.
 */


export type EmailTemplateParams = {
  recipientName: string;
  recipientEmail: string;
  subject: string;
  aiResponse: string;
  isEscalation?: boolean;
  ticketId?: string;
  originalMessage?: string; // The user's original email body
};

function markdownToHtml(markdown: string): string {
  return markdown
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: underline;">$1</a>')
    .replace(/(?<!href="|src="|>)(https?:\/\/[^\s<]+)/g, '<a href="$1" style="color: #2563eb; text-decoration: underline;">$1</a>')
    .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
    .replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul style="padding-left: 20px; margin: 0 0 20px;">$1</ul>')
    .replace(/^#{1,6}\s+(.+)$/gm, '<strong style="display: block; margin-top: 16px; margin-bottom: 8px;">$1</strong>')
    .replace(/^---$/gm, '<hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />')
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>");
}

/**
 * Generate a clean, minimalistic AI reply email.
 */
export function generateAIReplyEmail(params: EmailTemplateParams): string {
  const { recipientName, recipientEmail, subject, aiResponse, isEscalation, ticketId, originalMessage } = params;
  const responseHtml = markdownToHtml(aiResponse);

  const escalationBlock = isEscalation && ticketId
    ? `
    <div style="margin-top: 24px; padding-top: 24px; border-top: 1px dashed #e5e7eb;">
      <p>
        Your support request (Ticket ID: <strong>#${ticketId.slice(0, 8)}</strong>) has been received, and our team is actively reviewing it to assist you at the earliest. 
        You can track your ticket status anytime <a href="https://classgrid.in/support/requests/${ticketId}?email=${encodeURIComponent(recipientEmail)}">here</a>.
      </p>
    </div>`
    : "";

  const cleanOriginalMessage = originalMessage ? originalMessage.trim().replace(/\n{3,}/g, '\n\n') : "";
  const originalMessageBlock = cleanOriginalMessage
    ? `
    <div class="gmail_quote" style="margin-top: 40px; font-size: 13px; color: #6b7280;">
      <p style="margin-bottom: 8px;">On ${new Date().toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at ${new Date().toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}, ${recipientName || recipientEmail} wrote:</p>
      <blockquote class="gmail_quote" style="margin: 0; padding-left: 16px; border-left: 2px solid #d1d5db; white-space: pre-wrap; word-break: break-word; overflow-wrap: break-word; font-family: inherit;">${cleanOriginalMessage}</blockquote>
    </div>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #111111; line-height: 1.6; font-size: 14px; max-width: 600px; margin: 0 auto; padding: 20px; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    p { margin: 0 0 16px 0; }
  </style>
</head>
<body>
  <div style="margin-bottom: 24px;">
    <img src="https://classgrid.in/logo.png" alt="Classgrid" style="height: 32px;" />
  </div>
  
  <div style="margin-bottom: 32px;">
    ${responseHtml}
    ${escalationBlock}
  </div>

  ${originalMessageBlock}

  <div style="border-top: 1px solid #e5e7eb; margin-top: 40px; padding-top: 24px; color: #6b7280; font-size: 12px; text-align: center;">
    <p style="margin-bottom: 8px;">This is an automated email from the Classgrid system.</p>
    <p>&copy; ${new Date().getFullYear()} Classgrid. All rights reserved.</p>
  </div>
</body>
</html>`;
}
