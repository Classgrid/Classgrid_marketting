/**
 * Email Poller
 *
 * Polls the Zoho Mail API every 60 seconds for new unread emails
 * and processes each one through the AI pipeline.
 *
 * Runs as a background task when the AI server starts.
 * Automatically skips internal/automated emails.
 */

import { fetchUnreadEmails, fetchEmailContent, isZohoMailConfigured } from "./zoho-mail";
import { processIncomingEmail } from "./email-processor";

// ── Configuration ─────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = Number(process.env.EMAIL_POLL_INTERVAL_MS || 45_000); // Default: 45 seconds
const MAX_EMAILS_PER_POLL = Number(process.env.EMAIL_MAX_PER_POLL || 50);       // Max emails to process per cycle
const PROCESSING_LOCK_KEY = "email-ai-processing";

// ── State ─────────────────────────────────────────────────────────────────────

let pollerInterval: ReturnType<typeof setInterval> | null = null;
let isProcessing = false;
let totalProcessed = 0;
let totalErrors = 0;
let lastPollTime: Date | null = null;

// Track processed message IDs to avoid double-processing
const processedMessageIds = new Set<string>();
const MAX_PROCESSED_CACHE = 500; // Keep last 500 message IDs in memory

const retryCounts = new Map<string, number>();
const nextRetryTimes = new Map<string, number>(); // Stores the timestamp (ms) when the email is allowed to be retried
const MAX_RETRIES = 3;

function addToProcessedCache(messageId: string) {
  processedMessageIds.add(messageId);
  // Evict oldest entries if cache is too large
  if (processedMessageIds.size > MAX_PROCESSED_CACHE) {
    const iterator = processedMessageIds.values();
    processedMessageIds.delete(iterator.next().value!);
  }
}

// ── Poll Cycle ────────────────────────────────────────────────────────────────

/**
 * Single poll cycle: fetch unread emails → process each → mark as read.
 */
async function pollCycle(): Promise<void> {
  if (isProcessing) {
    console.log("[email-poller] ⏳ Previous poll still running, skipping this cycle");
    return;
  }

  isProcessing = true;
  lastPollTime = new Date();

  try {
    console.log(`\n⏳ [email-poller] Waking up to poll Zoho Mail... (${new Date().toLocaleTimeString()})`);
    console.log(`⏳ [email-poller] Connecting to Zoho API to fetch unread emails...`);
    
    // 1. Fetch unread emails from Zoho
    const unreadEmails = await fetchUnreadEmails(MAX_EMAILS_PER_POLL);

    if (unreadEmails.length === 0) {
      console.log(`📭 [email-poller] 0 unread emails found. Going back to sleep.`);
      return;
    }

    console.log(`\n📬 [email-poller] Found ${unreadEmails.length} unread email(s)`);

    // 2. Process each email
    for (const emailSummary of unreadEmails) {
      console.log(`🔍 [email-poller] Inspecting email from ${emailSummary.senderEmail}...`);
      // Skip if already processed (prevents double-processing from concurrent polls)
      if (processedMessageIds.has(emailSummary.messageId)) {
        console.log(`⏭️  [email-poller] Skipping email (already processed in memory cache)`);
        continue;
      }

      // Skip if it's currently waiting in a scheduled retry delay
      const nextRetryAt = nextRetryTimes.get(emailSummary.messageId);
      if (nextRetryAt && Date.now() < nextRetryAt) {
        const remainingMinutes = Math.ceil((nextRetryAt - Date.now()) / 60000);
        console.log(`⏳ [email-poller] Skipping email — waiting ${remainingMinutes}m for scheduled retry.`);
        continue;
      }

      try {
        // Fetch full email content
        const fullEmail = await fetchEmailContent(emailSummary.messageId, emailSummary.folderId);
        if (!fullEmail) {
          console.error(`[email-poller] Failed to fetch content for message ${emailSummary.messageId}`);
          continue;
        }

        // 🐛 FIX: Zoho's content endpoint sometimes strips the sender address for certain emails.
        // If it's missing, we fall back to the sender address we found in the unread summary!
        if (!fullEmail.senderEmail && emailSummary.senderEmail) {
          fullEmail.senderEmail = emailSummary.senderEmail;
          fullEmail.senderName = emailSummary.senderName || "";
        }

        // Process through AI pipeline
        const result = await processIncomingEmail(fullEmail);

        if (result.success) {
          // Track result to prevent double processing
          addToProcessedCache(emailSummary.messageId);
          retryCounts.delete(emailSummary.messageId);
          nextRetryTimes.delete(emailSummary.messageId);
          totalProcessed++;
          if (result.action !== "skipped") {
            console.log(`✅ [email-poller] ${result.action}: ${emailSummary.senderEmail} — "${emailSummary.subject}"`);
          }
        } else {
          totalErrors++;
          console.error(`❌ [email-poller] Error processing ${emailSummary.senderEmail}: ${result.error}`);
          
          const count = (retryCounts.get(emailSummary.messageId) || 0) + 1;
          retryCounts.set(emailSummary.messageId, count);
          
          if (count >= MAX_RETRIES) {
            console.error(`❌ [email-poller] Max retries (${MAX_RETRIES}) reached for ${emailSummary.messageId}. Marking as processed to skip permanently.`);
            addToProcessedCache(emailSummary.messageId);
            retryCounts.delete(emailSummary.messageId);
            nextRetryTimes.delete(emailSummary.messageId);
          } else {
            const delays = [5, 7, 14];
            const delayMinutes = delays[count - 1] || 5;
            nextRetryTimes.set(emailSummary.messageId, Date.now() + delayMinutes * 60 * 1000);
            console.log(`⏳ [email-poller] Scheduled retry ${count}/${MAX_RETRIES} in ${delayMinutes} minutes.`);
          }
        }
      } catch (err) {
        totalErrors++;
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`❌ [email-poller] Failed to process email ${emailSummary.messageId}:`, msg);
        
        const count = (retryCounts.get(emailSummary.messageId) || 0) + 1;
        retryCounts.set(emailSummary.messageId, count);
        
        if (count >= MAX_RETRIES) {
          addToProcessedCache(emailSummary.messageId);
          retryCounts.delete(emailSummary.messageId);
          nextRetryTimes.delete(emailSummary.messageId);
        } else {
          const delays = [5, 7, 14];
          const delayMinutes = delays[count - 1] || 5;
          nextRetryTimes.set(emailSummary.messageId, Date.now() + delayMinutes * 60 * 1000);
          console.log(`⏳ [email-poller] Scheduled retry ${count}/${MAX_RETRIES} in ${delayMinutes} minutes.`);
        }
      }

      // Small delay between emails to avoid rate limiting (SES allows 14/sec)
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`❌ [email-poller] Poll cycle failed:`, msg);
  } finally {
    isProcessing = false;
  }
}

// ── Poller Lifecycle ──────────────────────────────────────────────────────────

/**
 * Start the email poller. Runs continuously in the background.
 */
export function startEmailPoller(): void {
  if (!isZohoMailConfigured()) {
    console.log("📧 [email-poller] Zoho Mail API not configured — email AI is disabled");
    console.log("📧 [email-poller] Set ZOHO_MAIL_CLIENT_ID, ZOHO_MAIL_CLIENT_SECRET, ZOHO_MAIL_REFRESH_TOKEN, ZOHO_MAIL_ACCOUNT_ID to enable");
    return;
  }

  if (pollerInterval) {
    console.log("[email-poller] Already running");
    return;
  }

  console.log(`\n🚀 ════════════════════════════════════════════════════`);
  console.log(`📧 [email-poller] Starting AI Email Support System`);
  console.log(`📧 [email-poller] Polling Zoho inbox every ${POLL_INTERVAL_MS / 1000}s`);
  console.log(`📧 [email-poller] Max emails per poll: ${MAX_EMAILS_PER_POLL}`);
  console.log(`🚀 ════════════════════════════════════════════════════\n`);

  // Run first poll immediately
  pollCycle().catch((err) => console.error("[email-poller] Initial poll failed:", err));

  // Then poll on interval
  pollerInterval = setInterval(() => {
    pollCycle().catch((err) => console.error("[email-poller] Poll cycle failed:", err));
  }, POLL_INTERVAL_MS);
}

/**
 * Stop the email poller.
 */
export function stopEmailPoller(): void {
  if (pollerInterval) {
    clearInterval(pollerInterval);
    pollerInterval = null;
    console.log("[email-poller] ⏹️  Stopped");
  }
}

/**
 * Get the current poller status (for health checks).
 */
export function getEmailPollerStatus() {
  return {
    running: pollerInterval !== null,
    isProcessing,
    totalProcessed,
    totalErrors,
    lastPollTime: lastPollTime?.toISOString() || null,
    pollIntervalMs: POLL_INTERVAL_MS,
    configured: isZohoMailConfigured(),
  };
}
