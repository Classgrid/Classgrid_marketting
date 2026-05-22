import { MongoClient } from "mongodb";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

// Load .env.local manually
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
envContent.split("\n").forEach(line => {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
});

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not found in .env.local");

const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db();
const result = await db.collection("airatelimits").deleteMany({});
console.log(`✅ Deleted ${result.deletedCount} rate limit records.`);
await client.close();
process.exit(0);
