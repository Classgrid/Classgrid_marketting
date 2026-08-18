/**
 * AI Email Reply Template
 *
 * Uses the existing Classgrid baseTemplate from email-templates.ts
 * to ensure consistent branding across all emails.
 */


// ── Markdown to HTML (for AI responses) ───────────────────────────────────────

function markdownToHtml(markdown: string): string {
  return markdown
    // Bold: **text** or __text__
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    // Italic: *text* or _text_
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #111111; text-decoration: underline;">$1</a>')
    // Numbered lists
    .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
    // Bullet points
    .replace(/^[-•]\s+(.+)$/gm, "<li>$1</li>")
    // Wrap consecutive <li> elements in <ul>
    .replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul style="padding-left: 20px; margin: 0 0 20px; color: #374151; font-size: 14px; line-height: 1.7;">$1</ul>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3 style="color: #111111; margin-top: 0; margin-bottom: 16px;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color: #111111; margin-top: 0; margin-bottom: 16px;">$1</h2>')
    // Paragraphs (double newline)
    .replace(/\n\n/g, "</p><p>")
    // Single newlines to <br>
    .replace(/\n/g, "<br/>");
}

// ── Template ──────────────────────────────────────────────────────────────────

export type EmailTemplateParams = {
  recipientName: string;
  recipientEmail: string;
  subject: string;
  aiResponse: string;
  isEscalation?: boolean;
  ticketId?: string;
  originalMessage?: string; // The user's original email body
};

/**
 * Generate a branded AI reply email using a minimal, plain-text style layout.
 */
export function generateAIReplyEmail(params: EmailTemplateParams): string {
  const { recipientName, recipientEmail, aiResponse, isEscalation, ticketId, originalMessage } = params;
  const responseHtml = markdownToHtml(aiResponse);

  const escalationBlock = isEscalation && ticketId
    ? `
    <p style="margin-top: 24px; padding-top: 24px; border-top: 1px dashed #e5e7eb; color: #374151;">
      Your support request (Ticket ID: <strong>#${ticketId.slice(0, 8)}</strong>) has been received, and our team is actively reviewing it to assist you at the earliest. 
      You can track your ticket status anytime <a href="https://classgrid.in/support/requests/${ticketId}?email=${encodeURIComponent(recipientEmail)}" style="color: #2563eb; text-decoration: underline;">here</a>.
    </p>`
    : "";

  const originalMessageBlock = originalMessage
    ? `
    <div style="margin-top: 40px; color: #6b7280; font-size: 13px;">
      <p style="margin-bottom: 8px;">On ${new Date().toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at ${new Date().toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}, ${recipientName || recipientEmail} wrote:</p>
      <blockquote style="margin: 0; padding-left: 16px; border-left: 2px solid #d1d5db; white-space: pre-wrap; font-family: inherit;">${originalMessage}</blockquote>
    </div>`
    : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #111111;
            margin: 0;
            padding: 16px;
          }
          a {
            color: #2563eb;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        ${responseHtml}
        ${escalationBlock}
        ${originalMessageBlock}
      </body>
    </html>
  `;
}
