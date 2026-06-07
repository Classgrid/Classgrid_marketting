import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function clearDemoRequests() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing in .env.local");
    process.exit(1);
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected.");

    // The collection name for the DemoRequest model is usually "demorequests"
    const collectionName = "demorequests";
    console.log(`🗑️  Emptying collection: ${collectionName}...`);

    const result = await mongoose.connection.collection(collectionName).deleteMany({});

    console.log(`✅ Success! Deleted ${result.deletedCount} demo requests.`);

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error clearing demo requests:", error);
    process.exit(1);
  }
}

clearDemoRequests();
