/**
 * AI Chat Session Memory (Redis-backed)
 *
 * Stores full chat history per session in Redis with auto-expiring TTL.
 * When a user starts chatting, messages accumulate in Redis.
 * When the session ends (TTL expires), memory is automatically cleaned up.
 *
 * This gives the AI "memory" of the entire conversation, not just the last message.
 */
import { getRedisClient } from "@/lib/redis";
import type { ChatHistoryItem } from "@/lib/ai/rag-answer";

// Session TTL: 30 minutes of inactivity = session cleanup
const SESSION_TTL_SECONDS = 30 * 60; // 30 minutes

// Max messages to store per session (prevents unbounded token growth that crashes Groq/Mistral)
const MAX_SESSION_MESSAGES = 12;

function getSessionKey(sessionId: string): string {
  return `ai:chat:session:${sessionId}`;
}

/**
 * Save a new message to the session's chat memory.
 * Resets the TTL on every new message (sliding window).
 */
export async function saveMessageToSession(
  sessionId: string,
  message: ChatHistoryItem
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    const key = getSessionKey(sessionId);

    // Push the message as JSON
    await redis.rpush(key, JSON.stringify(message));

    // Trim to max messages (keep only the latest N)
    await redis.ltrim(key, -MAX_SESSION_MESSAGES, -1);

    // Reset TTL (sliding window — keeps alive while user is active)
    await redis.expire(key, SESSION_TTL_SECONDS);
  } catch (err) {
    console.error("[chat-memory] Failed to save message:", err);
  }
}

/**
 * Retrieve the full chat history for a session.
 * Returns an empty array if Redis is unavailable or session doesn't exist.
 */
export async function getSessionHistory(
  sessionId: string
): Promise<ChatHistoryItem[]> {
  const redis = getRedisClient();
  if (!redis) return [];

  try {
    const key = getSessionKey(sessionId);
    const rawMessages = await redis.lrange(key, 0, -1);

    return rawMessages
      .map((raw) => {
        try {
          return JSON.parse(raw) as ChatHistoryItem;
        } catch {
          return null;
        }
      })
      .filter((msg): msg is ChatHistoryItem => msg !== null);
  } catch (err) {
    console.error("[chat-memory] Failed to retrieve history:", err);
    return [];
  }
}

/**
 * Clear a session's chat memory (e.g., when user clicks "New Chat").
 */
export async function clearSessionHistory(
  sessionId: string
): Promise<void> {
  const redis = getRedisClient();
  if (!redis) return;

  try {
    await redis.del(getSessionKey(sessionId));
  } catch (err) {
    console.error("[chat-memory] Failed to clear session:", err);
  }
}

/**
 * Get the remaining TTL for a session (in seconds).
 * Returns -1 if session doesn't exist or Redis is unavailable.
 */
export async function getSessionTTL(sessionId: string): Promise<number> {
  const redis = getRedisClient();
  if (!redis) return -1;

  try {
    return await redis.ttl(getSessionKey(sessionId));
  } catch {
    return -1;
  }
}
