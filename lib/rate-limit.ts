const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  return checkRateLimitWithCount(key, max, windowMs).allowed;
}

export function checkRateLimitWithCount(key: string, max: number, windowMs: number): { allowed: boolean; count: number; resetAt: number } {
  const now = Date.now();
  const record = store.get(key);
  
  if (!record || now > record.resetAt) {
    const newReset = now + windowMs;
    store.set(key, { count: 1, resetAt: newReset });
    return { allowed: true, count: 1, resetAt: newReset };
  }
  
  if (record.count >= max) {
    record.count++; // Keep incrementing so we know exactly how far over they are
    return { allowed: false, count: record.count, resetAt: record.resetAt };
  }
  
  record.count++;
  return { allowed: true, count: record.count, resetAt: record.resetAt };
}
