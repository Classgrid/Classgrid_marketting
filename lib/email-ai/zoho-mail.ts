/**
 * Zoho Mail REST API Client
 *
 * Handles OAuth 2.0 token refresh and provides methods to:
 * - Fetch unread emails from the support@classgrid.in inbox
 * - Read individual email content
 * - Mark emails as read after processing
 *
 * Zoho Data Center: zoho.in (India)
 * Base URL: https://mail.zoho.in/api
 */

// ── Configuration ─────────────────────────────────────────────────────────────

const ZOHO_ACCOUNTS_URL = "https://accounts.zoho.in/oauth/v2/token";
const ZOHO_MAIL_BASE = "https://mail.zoho.in/api";

function getZohoConfig() {
  const clientId = process.env.ZOHO_MAIL_CLIENT_ID;
  const clientSecret = process.env.ZOHO_MAIL_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_MAIL_REFRESH_TOKEN;
  const accountId = process.env.ZOHO_MAIL_ACCOUNT_ID;

  if (!clientId || !clientSecret || !refreshToken || !accountId) {
    throw new Error(
      "Missing Zoho Mail env vars: ZOHO_MAIL_CLIENT_ID, ZOHO_MAIL_CLIENT_SECRET, ZOHO_MAIL_REFRESH_TOKEN, ZOHO_MAIL_ACCOUNT_ID"
    );
  }

  return { clientId, clientSecret, refreshToken, accountId };
}

// ── Token Management ──────────────────────────────────────────────────────────

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Get a valid Zoho access token. Automatically refreshes when expired.
 * Zoho access tokens last ~1 hour.
 */
export async function getZohoAccessToken(): Promise<string> {
  // Return cached token if still valid (with 5-minute buffer)
  if (cachedAccessToken && Date.now() < tokenExpiresAt - 5 * 60 * 1000) {
    return cachedAccessToken;
  }

  const config = getZohoConfig();

  console.log("[zoho-mail] Refreshing access token...");

  const params = new URLSearchParams({
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "refresh_token",
  });

  const response = await fetch(ZOHO_ACCOUNTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[zoho-mail] Token refresh failed:", response.status, errorBody);
    throw new Error(`Zoho token refresh failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    console.error("[zoho-mail] No access_token in response:", data);
    throw new Error("Zoho token refresh returned no access_token");
  }

  cachedAccessToken = data.access_token;
  // Zoho tokens typically expire in 3600 seconds (1 hour)
  tokenExpiresAt = Date.now() + (data.expires_in || 3600) * 1000;

  console.log("[zoho-mail] ✅ Access token refreshed successfully");
  return cachedAccessToken!;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type ZohoEmailSummary = {
  messageId: string;        // Zoho's internal message ID
  folderId: string;         // Folder ID (inbox)
  subject: string;
  sender: string;           // "Name <email@example.com>"
  senderEmail: string;      // Extracted email address
  senderName: string;       // Extracted display name
  receivedTime: number;     // Unix timestamp (ms)
  isRead: boolean;
  hasAttachment: boolean;
  threadId?: string;        // Zoho thread/conversation ID
  messageIdHeader?: string; // RFC Message-ID header
  inReplyTo?: string;       // In-Reply-To header
};

export type ZohoEmailContent = {
  messageId: string;
  subject: string;
  sender: string;
  senderEmail: string;
  senderName: string;
  textContent: string;      // Plain text body
  htmlContent: string;       // HTML body
  receivedTime: number;
  headers: Record<string, string>;
  threadId?: string;
  folderId: string;
};

// ── Helper: Extract email and name from "Name <email>" format ─────────────────

function parseSender(sender: string): { email: string; name: string } {
  const match = sender.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return { name: match[1].trim().replace(/^"|"$/g, ""), email: match[2].trim() };
  }
  // If no angle brackets, assume it's just an email
  return { name: "", email: sender.trim() };
}

// ── API Methods ───────────────────────────────────────────────────────────────

/**
 * Get the Inbox folder ID. Zoho requires folder IDs for most operations.
 * Caches the result after first call.
 */
let cachedInboxFolderId: string | null = null;

export async function getInboxFolderId(): Promise<string> {
  if (cachedInboxFolderId) return cachedInboxFolderId;

  const config = getZohoConfig();
  const token = await getZohoAccessToken();

  const response = await fetch(
    `${ZOHO_MAIL_BASE}/accounts/${config.accountId}/folders`,
    {
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Zoho folders API failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  const folders = data.data || [];

  const inbox = folders.find(
    (f: any) => f.folderName?.toLowerCase() === "inbox" || f.folderType?.toLowerCase() === "inbox"
  );

  if (!inbox) {
    console.error("[zoho-mail] Available folders:", folders.map((f: any) => f.folderName));
    throw new Error("Could not find Inbox folder in Zoho Mail");
  }

  cachedInboxFolderId = inbox.folderId;
  console.log(`[zoho-mail] ✅ Inbox folder ID: ${cachedInboxFolderId}`);
  return cachedInboxFolderId!;
}

/**
 * Fetch unread emails from the Inbox.
 * Returns a list of email summaries (not full content).
 */
export async function fetchUnreadEmails(limit: number = 20): Promise<ZohoEmailSummary[]> {
  const config = getZohoConfig();
  const token = await getZohoAccessToken();
  const folderId = await getInboxFolderId();

  const url = `${ZOHO_MAIL_BASE}/accounts/${config.accountId}/messages/view?folderId=${folderId}&limit=${limit}&status=unread`;

  const response = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("[zoho-mail] Fetch unread failed:", response.status, body);
    return [];
  }

  const data = await response.json();
  const messages = data.data || [];

  return messages.map((msg: any) => {
    const parsed = parseSender(msg.sender || "");
    const email = msg.fromAddress || parsed.email;
    const name = parsed.name || (!msg.fromAddress ? "" : msg.sender);
    
    return {
      messageId: msg.messageId,
      folderId: msg.folderId || folderId,
      subject: msg.subject || "(No Subject)",
      sender: msg.sender || msg.fromAddress || "",
      senderEmail: email,
      senderName: name,
      receivedTime: msg.receivedTime || msg.sentDateInGMT || Date.now(),
      isRead: msg.status === "1" || msg.isRead === true,
      hasAttachment: msg.hasAttachment === "1" || msg.hasAttachment === true,
      threadId: msg.threadId || msg.conversationId,
      messageIdHeader: msg.messageId,
    };
  });
}

/**
 * Fetch the full content of a specific email.
 */
export async function fetchEmailContent(
  messageId: string,
  folderId: string
): Promise<ZohoEmailContent | null> {
  const config = getZohoConfig();
  const token = await getZohoAccessToken();

  const url = `${ZOHO_MAIL_BASE}/accounts/${config.accountId}/folders/${folderId}/messages/${messageId}/content`;

  const response = await fetch(url, {
    headers: { Authorization: `Zoho-oauthtoken ${token}` },
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`[zoho-mail] Fetch content for ${messageId} failed:`, response.status, body);
    return null;
  }

  const data = await response.json();
  const content = data.data || {};

  const parsed = parseSender(content.sender || "");
  const email = content.fromAddress || parsed.email;
  const name = parsed.name || (!content.fromAddress ? "" : content.sender);

  // Extract headers if available
  const headers: Record<string, string> = {};
  if (content.headers) {
    for (const [key, value] of Object.entries(content.headers)) {
      headers[key.toLowerCase()] = String(value);
    }
  }

  return {
    messageId,
    subject: content.subject || "(No Subject)",
    sender: content.sender || content.fromAddress || "",
    senderEmail: email,
    senderName: name,
    textContent: content.content || "",
    htmlContent: content.htmlContent || content.content || "",
    receivedTime: content.receivedTime || Date.now(),
    headers,
    threadId: content.threadId || content.conversationId,
    folderId,
  };
}

/**
 * Mark an email as read in Zoho.
 */
export async function markEmailAsRead(messageId: string, folderId: string): Promise<boolean> {
  const config = getZohoConfig();
  const token = await getZohoAccessToken();

  const url = `${ZOHO_MAIL_BASE}/accounts/${config.accountId}/updatemessage`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode: "markAsRead",
      messageId: [messageId],
      folderId,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`[zoho-mail] Mark as read failed for ${messageId}:`, response.status, body);
    return false;
  }

  return true;
}

/**
 * Check if Zoho Mail API credentials are configured.
 */
export function isZohoMailConfigured(): boolean {
  return !!(
    process.env.ZOHO_MAIL_CLIENT_ID &&
    process.env.ZOHO_MAIL_CLIENT_SECRET &&
    process.env.ZOHO_MAIL_REFRESH_TOKEN &&
    process.env.ZOHO_MAIL_ACCOUNT_ID
  );
}
