import dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import { connectMongo } from "./lib/mongodb";
import { createClient } from "next-sanity";

async function clearData() {
  console.log("Connecting to MongoDB...");
  await connectMongo();
  const db = mongoose.connection.db;

  if (db) {
    console.log("Clearing MongoDB collections...");
    try { await db.collection("supporttickets").deleteMany({}); console.log("- supporttickets cleared"); } catch (e) { console.log("error clearing supporttickets", e.message) }
    try { await db.collection("emailconversations").deleteMany({}); console.log("- emailconversations cleared"); } catch (e) { console.log("error clearing emailconversations", e.message) }
    try { await db.collection("moderationflags").deleteMany({}); console.log("- moderationflags cleared"); } catch (e) { console.log("error clearing moderationflags", e.message) }
    try { await db.collection("airatelimits").deleteMany({}); console.log("- airatelimits cleared"); } catch (e) { console.log("error clearing airatelimits", e.message) }
  }

  console.log("Clearing Sanity AI Escalations & Safety Incidents...");
  try {
    const writeClient = createClient({
      projectId: process.env.SANITY_PROJECT_ID,
      dataset: process.env.SANITY_DATASET || "production",
      apiVersion: "2024-01-01",
      token: process.env.SANITY_API_WRITE_TOKEN,
      useCdn: false,
    });

    const escalations = await writeClient.fetch(`*[_type == "aiEscalation"]{ _id }`);
    for (const doc of escalations) {
      await writeClient.delete(doc._id);
    }
    console.log(`- ${escalations.length} Sanity AI Escalations cleared`);

    const safety = await writeClient.fetch(`*[_type == "safetyIncident"]{ _id }`);
    for (const doc of safety) {
      await writeClient.delete(doc._id);
    }
    console.log(`- ${safety.length} Sanity Safety Incidents cleared`);
  } catch (e) {
    console.log("Error clearing Sanity:", e.message);
  }

  console.log("✅ All test data cleared successfully!");
  process.exit(0);
}

clearData().catch((e) => {
  console.error(e);
  process.exit(1);
});
