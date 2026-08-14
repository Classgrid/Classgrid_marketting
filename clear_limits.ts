import { config } from "dotenv";
config({ path: ".env.local" });
import { connectMongo } from "./lib/mongodb";
import { AiRateLimit } from "./lib/models/AiRateLimit";

async function clearLimits() {
  try {
    await connectMongo();
    const result = await AiRateLimit.deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} rate limit records from MongoDB.`);
    process.exit(0);
  } catch (error) {
    console.error("Error clearing rate limits:", error);
    process.exit(1);
  }
}

clearLimits();
