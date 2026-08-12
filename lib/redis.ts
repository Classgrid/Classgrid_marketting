/**
 * Redis Client Singleton
 *
 * Provides a shared Redis connection for chat session memory.
 * Connection URL should be set via REDIS_URL environment variable.
 */
import Redis from "ioredis";

let redisClient: Redis | null = null;

export function getRedisClient(): Redis | null {
  const url = process.env.REDIS_URL?.trim();
  if (!url) {
    console.warn("[redis] REDIS_URL is not configured. Chat memory disabled.");
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis(url, {
      maxRetriesPerRequest: 2,
      connectTimeout: 5000,
      lazyConnect: true,
      retryStrategy(times) {
        // Keep retrying indefinitely with a capped delay
        return Math.min(times * 500, 5000);
      },
    });

    redisClient.on("error", (err) => {
      console.error("[redis] Connection error:", err.message);
    });

    redisClient.on("connect", () => {
      console.log("[redis] Connected successfully.");
    });
  }

  return redisClient;
}
