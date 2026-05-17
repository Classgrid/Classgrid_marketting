// Simple in-memory rate limiter using a Map.
// Resets on server restart (suitable for edge/serverless with short lifetimes).

type RateLimitStore = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitStore>();

type RateLimitOptions = {
  key: string;
  max: number;
  windowMs: number;
};

type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

/**
 * Simple in-memory rate limiter.
 * Returns `{ allowed: true }` if the request is within limits,
 * or `{ allowed: false, retryAfterSeconds }` if it has been exceeded.
 */
export function rateLimit({ key, max, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now >= entry.resetAt) {
    // Start a fresh window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= max) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

/**
 * Extracts the real client IP from standard proxy headers,
 * falling back to a placeholder when running locally.
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;

  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}
