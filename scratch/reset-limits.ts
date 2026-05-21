import { connectMongo } from "../lib/mongodb";
import { AiRateLimit } from "../lib/models/AiRateLimit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function resetLimits() {
  try {
    await connectMongo();
    const result = await AiRateLimit.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} rate limit records.`);
    process.exit(0);
  } catch (err) {
    console.error("Error resetting limits:", err);
    process.exit(1);
  }
}

resetLimits();
