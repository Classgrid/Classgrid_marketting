import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!mongoUri) {
  console.error("Missing MONGODB_URI or MONGO_URI in .env.local");
  process.exit(1);
}

async function run() {
  console.log("Connecting to MongoDB...");
  const mongoClient = new MongoClient(mongoUri);
  await mongoClient.connect();
  const db = mongoClient.db();

  try {
    console.log("Fetching users from MongoDB...");
    const usersCollection = db.collection("users");
    const forumUsersCollection = db.collection("forumusers");

    const [users, forumUsers] = await Promise.all([
      usersCollection.find({}, { projection: { email: 1, name: 1, username: 1 } }).toArray(),
      forumUsersCollection.find({}, { projection: { email: 1, name: 1, username: 1 } }).toArray(),
    ]);

    const allMongoUsers = [...users, ...forumUsers];
    console.log(`Found ${users.length} users and ${forumUsers.length} forum users in MongoDB.`);

    // Deduplicate by email
    const uniqueEmails = new Map();
    for (const u of allMongoUsers) {
      if (u.email && typeof u.email === "string") {
        const emailLower = u.email.toLowerCase().trim();
        if (!uniqueEmails.has(emailLower)) {
          uniqueEmails.set(emailLower, {
            email: emailLower,
            name: u.name || u.username || "",
          });
        }
      }
    }

    const recordsToInsert = Array.from(uniqueEmails.values());
    console.log(`Prepared ${recordsToInsert.length} unique emails for Supabase insertion.`);

    const sqlLines = [];
    for (const record of recordsToInsert) {
      let firstName = record.name.trim().split(/\s+/)[0] || "";
      if (!firstName) {
        firstName = record.email.split("@")[0].replace(/[^a-zA-Z]/g, "");
      }
      // Escape single quotes in name
      firstName = firstName.replace(/'/g, "''");
      
      sqlLines.push(`INSERT INTO blog_subscribers (email, name, is_active) VALUES ('${record.email}', '${firstName || 'User'}', true) ON CONFLICT (email) DO NOTHING;`);
    }

    const sqlFilePath = path.resolve(__dirname, "migrate-mongo-to-supabase.sql");
    fs.writeFileSync(sqlFilePath, sqlLines.join("\n"));
    
    console.log("-----------------------------------------");
    console.log(`Generated SQL file at: ${sqlFilePath}`);
    console.log(`You can copy-paste the contents of this file into your Supabase SQL Editor.`);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoClient.close();
  }
}

run();
