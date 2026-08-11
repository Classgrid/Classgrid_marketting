import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const url = process.env.REDIS_URL;
if (!url) {
  console.error("REDIS_URL not set in .env.local");
  process.exit(1);
}

const redis = new Redis(url, { connectTimeout: 5000 });

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

async function pullChatSessions() {
  console.log("🔍 Scanning Redis for AI chat sessions...\n");

  const keys = await redis.keys("ai:chat:session:*");

  if (keys.length === 0) {
    console.log("No active chat sessions found in Redis.");
    await redis.quit();
    return;
  }

  console.log(`Found ${keys.length} chat session(s):\n`);

  for (const key of keys) {
    const sessionId = key.replace("ai:chat:session:", "");
    const ttl = await redis.ttl(key);
    const messages = await redis.lrange(key, 0, -1);

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📌 Session: ${sessionId}`);
    console.log(`⏱️  TTL: ${ttl > 0 ? `${Math.floor(ttl / 60)}m ${ttl % 60}s remaining` : "expired/no TTL"}`);
    console.log(`💬 Messages: ${messages.length}`);
    console.log(`──────────────────────────────────────────`);

    for (const raw of messages) {
      try {
        const msg = JSON.parse(raw);
        const role = msg.role === "user" ? "👤 You" : "🤖 AI";
        const preview = msg.content.length > 150 ? msg.content.slice(0, 150) + "..." : msg.content;
        console.log(`  ${role}: ${preview}`);
      } catch {
        console.log(`  [unparseable]: ${raw.slice(0, 100)}`);
      }
    }
    console.log();
  }

  await redis.quit();
}

pullChatSessions();
