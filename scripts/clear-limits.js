require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const { Redis } = require("ioredis");

async function run() {
  console.log("Starting quick cleanup...");

  // 1. Flush Redis (resets chat session memory)
  try {
    const redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", { maxRetriesPerRequest: 0 });
    await redis.flushdb();
    console.log("✅ Redis: Flushed (chat history + escalation flags).");
    redis.disconnect();
  } catch (err) { console.error("❌ Redis:", err.message); }

  // 2. Clear MongoDB Rate Limits
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    const db = mongoose.connection;
    const r1 = await db.collection("airatelimits").deleteMany({});
    console.log(`✅ MongoDB: ${r1.deletedCount} rate limits deleted.`);
    await mongoose.disconnect();
  } catch (err) { console.error("❌ MongoDB:", err.message); }

  console.log("\n🎉 Quick Cleanup Complete!");
  process.exit(0);
}
run();
