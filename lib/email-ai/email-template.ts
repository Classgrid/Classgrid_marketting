/**
 * AI Email Reply Template
 *
 * Uses the existing Classgrid baseTemplate from email-templates.ts
 * to ensure consistent branding across all emails.
 */

import { baseTemplate } from "../email-templates";

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
};

/**
 * Generate a branded AI reply email using the existing baseTemplate.
 */
export function generateAIReplyEmail(params: EmailTemplateParams): string {
  const { recipientName, recipientEmail, subject, aiResponse, isEscalation, ticketId } = params;
  const firstName = recipientName ? recipientName.split(" ")[0] : "there";
  const responseHtml = markdownToHtml(aiResponse);

  const escalationBlock = isEscalation
    ? `
    <div style="margin-top: 24px; padding: 20px; background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px;">
      <div class="meta" style="color: #92400e;">Support Ticket Created</div>
      <p style="margin: 0 0 8px; color: #78350f;">
        Your issue has been escalated to our human support team.
        ${ticketId ? `Your Ticket ID is <strong>#${ticketId.slice(0, 8)}</strong>.` : ""}
        Our team will review your request and respond as soon as possible.
      </p>
      ${ticketId ? `<a href="https://classgrid.in/support/requests/${ticketId}?email=${encodeURIComponent(recipientEmail)}" class="btn" style="margin-top: 12px;">Track Your Ticket</a>` : ""}
    </div>`
    : "";

  // The AI response already includes a natural greeting (per the professional email rulebook).
  // We do not hardcode any greeting here to avoid duplication.
  const content = `
    <p>${responseHtml}</p>

    ${escalationBlock}
  `;

  return baseTemplate({
    content,
    title: subject,
    ignoreText: "This is an automated email from the Classgrid system.",
    hideSupportLink: true,
  });
}
