import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

async function testMongo() {
  console.log("Testing connection to: " + mongoUri.split("@")[1]);
  // Trying with updated driver options for Node 18+ / 24+ TLS issues
  const client = new MongoClient(mongoUri, {
    serverSelectionTimeoutMS: 5000,
    tls: true,
  });

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");
    await client.close();
  } catch (error) {
    console.error("❌ Connection failed:");
    console.error(error.message);
  }
}

testMongo();
