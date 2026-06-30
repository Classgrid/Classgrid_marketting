require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const { createClient } = require("@sanity/client");
const { Redis } = require("ioredis");
const { createClient: createSupabaseClient } = require("@supabase/supabase-js");

async function run() {
  console.log("Starting Master Cleanup...");

  // 1. Flush Redis
  try {
    const redis = new Redis(process.env.REDIS_URL);
    await redis.flushdb();
    console.log("✅ Redis: Flushed (chat history + escalation flags).");
    redis.disconnect();
  } catch (err) { console.error("❌ Redis:", err.message); }

  // 2. Clear Sanity
  try {
    const sanity = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
      useCdn: false, apiVersion: "2024-01-01",
      token: process.env.SANITY_API_WRITE_TOKEN,
    });
    const docs = await sanity.fetch('*[_type == "aiEscalation"]');
    for (const d of docs) await sanity.delete(d._id);
    console.log(`✅ Sanity: Deleted ${docs.length} AI Escalations.`);
  } catch (err) { console.error("❌ Sanity:", err.message); }

  // 3. Clear MongoDB
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection;
    const r1 = await db.collection("airatelimits").deleteMany({});
    const r2 = await db.collection("supporttickets").deleteMany({ submitterEmail: "quantumchem25@gmail.com" });
    console.log(`✅ MongoDB: ${r1.deletedCount} rate limits, ${r2.deletedCount} test tickets deleted.`);
    await mongoose.disconnect();
  } catch (err) { console.error("❌ MongoDB:", err.message); }

  // 4. Clear Supabase
  try {
    const supabase = createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY);
    const { data: files } = await supabase.storage.from("support-attachments").list("");
    const paths = (files || []).map(f => f.name).filter(n => n !== ".emptyFolderPlaceholder");
    if (paths.length > 0) {
      await supabase.storage.from("support-attachments").remove(paths);
      console.log(`✅ Supabase: Deleted ${paths.length} attachments.`);
    } else { console.log("✅ Supabase: Already empty."); }
  } catch (err) { console.error("❌ Supabase:", err.message); }

  console.log("\n🎉 Master Cleanup Complete!");
  process.exit(0);
}
run();
