require('dotenv').config({path: '.env.local'});
const { createClient } = require('@sanity/client');
const Redis = require('ioredis');
const mongoose = require('mongoose');

async function wipeAllData() {
  console.log("Starting data wipe...");

  // 1. Wipe Redis
  try {
    const redis = new Redis(process.env.REDIS_URL);
    const chatKeys = await redis.keys('ai:chat:session:*');
    const escalationKeys = await redis.keys('ai:escalated:*');
    const allKeys = [...chatKeys, ...escalationKeys];
    
    if (allKeys.length > 0) {
      await redis.del(...allKeys);
      console.log(`✅ Redis: Deleted ${allKeys.length} keys (chats and escalation trackers).`);
    } else {
      console.log(`✅ Redis: Already empty.`);
    }
    redis.disconnect();
  } catch (e) {
    console.error("❌ Redis Wipe Failed:", e.message);
  }

  // 2. Wipe MongoDB Rate Limits
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.DATABASE_URL);
    // The collection name for AiRateLimit is likely 'airatelimits' or similar. We can just wipe it if the model exists.
    // Instead of importing the model, we can just drop the collection if we know its name, or use the mongoose model.
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const rateLimitCol = collections.find(c => c.name.toLowerCase().includes('airatelimit'));
    
    if (rateLimitCol) {
      await db.collection(rateLimitCol.name).deleteMany({});
      console.log(`✅ MongoDB: Deleted all records in ${rateLimitCol.name}.`);
    } else {
      console.log(`✅ MongoDB: Rate limit collection not found (already empty).`);
    }
    await mongoose.disconnect();
  } catch (e) {
    console.error("❌ MongoDB Wipe Failed:", e.message);
  }

  // 3. Wipe Sanity
  try {
    const sanityClient = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
      useCdn: false,
      token: process.env.SANITY_API_WRITE_TOKEN,
      apiVersion: '2024-03-15',
    });

    const docs = await sanityClient.fetch('*[_type == "aiEscalation"]');
    if (docs.length > 0) {
      for (const doc of docs) {
        await sanityClient.delete(doc._id);
      }
      console.log(`✅ Sanity: Deleted ${docs.length} aiEscalation records.`);
    } else {
      console.log(`✅ Sanity: Already empty.`);
    }
  } catch (e) {
    console.error("❌ Sanity Wipe Failed:", e.message);
  }

  console.log("Wipe complete! You can start testing.");
  process.exit(0);
}

wipeAllData();
