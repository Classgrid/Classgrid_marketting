/**
 * In-process dedupe of successfully handled WhatsApp `messages[].id` values.
 * Stops duplicate auto-replies when Meta retries webhooks. Not shared across
 * serverless instances — for strict cross-instance idempotency, use Redis/DB later.
 */

const TTL_MS = 48 * 60 * 60 * 1000;
const MAX_ENTRIES = 8000;

const successfulAt = new Map<string, number>();

function prune(now: number): void {
  if (successfulAt.size <= MAX_ENTRIES) return;
  for (const [id, t] of successfulAt) {
    if (now - t > TTL_MS) successfulAt.delete(id);
  }
  if (successfulAt.size > MAX_ENTRIES) {
    const iter = successfulAt.keys();
    while (successfulAt.size > MAX_ENTRIES) {
      const k = iter.next().value;
      if (k === undefined) break;
      successfulAt.delete(k);
    }
  }
}

export function wasWebhookMessageAlreadyAnswered(messageId: string): boolean {
  const now = Date.now();
  prune(now);
  const t = successfulAt.get(messageId);
  return typeof t === "number" && now - t < TTL_MS;
}

export function markWebhookMessageAnswered(messageId: string): void {
  const now = Date.now();
  successfulAt.set(messageId, now);
  prune(now);
}
