/**
 * Email Parser
 *
 * Cleans up incoming email content for AI processing:
 * - Strips quoted replies ("> On Monday..." blocks)
 * - Strips common email signatures ("--", "Sent from my iPhone", etc.)
 * - Converts HTML to plain text
 * - Extracts the actual new message from a reply chain
 */

// ── HTML to Plain Text ────────────────────────────────────────────────────────

/**
 * Convert HTML email content to clean plain text.
 * Strips all HTML tags, decodes entities, and normalizes whitespace.
 */
export function htmlToPlainText(html: string): string {
  if (!html) return "";

  let text = html
    // Remove style and script blocks
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    // Convert line breaks and block elements to newlines
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(p|div|h[1-6]|ul|ol|li|tr|td|th|table|blockquote|pre|hr)[^>]*>/gi, "\n")
    // Remove all remaining HTML tags
    .replace(/<[^>]+>/g, "")
    // Decode common HTML entities
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&rsquo;/gi, "'")
    .replace(/&lsquo;/gi, "'")
    .replace(/&rdquo;/gi, '"')
    .replace(/&ldquo;/gi, '"')
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&#\d+;/g, "")
    // Normalize whitespace
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return text;
}

// ── Strip Quoted Replies ──────────────────────────────────────────────────────

/**
 * Common patterns that indicate the start of a quoted reply.
 * Everything after these markers is considered quoted text and should be removed.
 */
const QUOTE_MARKERS = [
  // Gmail style: "On Mon, Aug 18, 2026 at 1:30 PM Classgrid <support@classgrid.in> wrote:"
  /^On\s+.+?\s+wrote:\s*$/im,
  // Outlook style: "From: ... Sent: ... To: ... Subject: ..."
  /^-+\s*Original Message\s*-+/im,
  /^From:\s+.+$/im,
  // Yahoo/generic
  /^-{2,}\s*Forwarded message\s*-{2,}/im,
  // Zoho style
  /^---- On .+ wrote ----$/im,
  // Generic quote marker
  /^>{1,}\s+On\s+/m,
  // Date-based markers
  /^On\s+\d{1,2}\/\d{1,2}\/\d{2,4}/im,
];

/**
 * Remove quoted reply content from an email body.
 * Keeps only the new message the customer wrote.
 */
export function stripQuotedReplies(text: string): string {
  if (!text) return "";

  // Split into lines for analysis
  const lines = text.split("\n");
  let cutoffIndex = lines.length;

  // Find the first line that matches a quote marker
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check against known quote patterns
    for (const pattern of QUOTE_MARKERS) {
      if (pattern.test(line)) {
        cutoffIndex = i;
        break;
      }
    }

    if (cutoffIndex < lines.length) break;

    // Also check for consecutive ">" quoted lines (3+ in a row = quoted section)
    if (line.startsWith(">")) {
      let quoteCount = 1;
      for (let j = i + 1; j < lines.length && j < i + 5; j++) {
        if (lines[j].trim().startsWith(">")) quoteCount++;
      }
      if (quoteCount >= 3) {
        cutoffIndex = i;
        break;
      }
    }
  }

  return lines.slice(0, cutoffIndex).join("\n").trim();
}

// ── Strip Email Signatures ────────────────────────────────────────────────────

/**
 * Common signature delimiters and patterns.
 */
const SIGNATURE_MARKERS = [
  /^--\s*$/m,                                    // Standard "-- " signature delimiter
  /^—\s*$/m,                                     // Em dash variant
  /^_{5,}$/m,                                    // Underscores
  /^-{5,}$/m,                                    // Dashes
  /^Sent from my (iPhone|iPad|Galaxy|Android|Pixel|Samsung)/im,
  /^Sent from Mail for Windows/im,
  /^Sent from Outlook/im,
  /^Sent via Zoho Mail/im,
  /^Get Outlook for (iOS|Android)/im,
  /^Regards,?\s*$/im,
  /^Best regards,?\s*$/im,
  /^Kind regards,?\s*$/im,
  /^Warm regards,?\s*$/im,
  /^Thanks\s*(and|&)\s*regards,?\s*$/im,
  /^Thanks,?\s*$/im,
  /^Thank you,?\s*$/im,
  /^Cheers,?\s*$/im,
  /^Best,?\s*$/im,
];

/**
 * Strip email signatures from the bottom of the message.
 */
export function stripSignature(text: string): string {
  if (!text) return "";

  const lines = text.split("\n");
  let cutoffIndex = lines.length;

  // Search from bottom up for signature markers (only check last 15 lines)
  const searchStart = Math.max(0, lines.length - 15);
  for (let i = searchStart; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of SIGNATURE_MARKERS) {
      if (pattern.test(line)) {
        cutoffIndex = i;
        break;
      }
    }
    if (cutoffIndex < lines.length) break;
  }

  return lines.slice(0, cutoffIndex).join("\n").trim();
}

// ── Main Parser ───────────────────────────────────────────────────────────────

export type ParsedEmail = {
  cleanBody: string;      // The actual new message (stripped of quotes + signatures)
  fullBody: string;       // Full raw text (for logging)
  senderEmail: string;
  senderName: string;
  subject: string;
};

/**
 * Parse and clean an incoming email for AI processing.
 * Takes the raw email content and extracts just the new message.
 */
export function parseIncomingEmail(params: {
  htmlContent?: string;
  textContent?: string;
  senderEmail: string;
  senderName: string;
  subject: string;
}): ParsedEmail {
  // Prefer plain text, fall back to HTML conversion
  let body = params.textContent?.trim() || "";
  if (!body && params.htmlContent) {
    body = htmlToPlainText(params.htmlContent);
  }

  const fullBody = body;

  // Strip quoted replies first, then signatures
  let cleanBody = stripQuotedReplies(body);
  cleanBody = stripSignature(cleanBody);

  // Final cleanup
  cleanBody = cleanBody
    .replace(/\n{3,}/g, "\n\n") // Max 2 consecutive newlines
    .trim();

  // If we stripped everything (edge case), use original body truncated
  if (!cleanBody && fullBody) {
    cleanBody = fullBody.slice(0, 2000);
  }

  return {
    cleanBody,
    fullBody,
    senderEmail: params.senderEmail,
    senderName: params.senderName,
    subject: params.subject,
  };
}
