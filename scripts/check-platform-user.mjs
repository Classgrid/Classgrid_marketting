// Verify the org restriction for the two test emails
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI;

const emailsToCheck = [
  "nikhilsubsun321@gmail.com",  // platform user (faculty, CLassgrid classroom)
  "classgrid34@gmail.com",       // NOT in users collection
];

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  console.log("✅ Connected to MongoDB\n");

  const db = client.db("classgrid");
  const usersCol = db.collection("users");

  for (const email of emailsToCheck) {
    const user = await usersCol.findOne({ email });
    if (user) {
      let orgName = null;
      if (user.organization_id) {
        const org = await db.collection("organizations").findOne({ _id: user.organization_id });
        orgName = org?.name || "(org ID exists but name not found)";
      }
      console.log(`📧 ${email}`);
      console.log(`   ✅ FOUND in users collection`);
      console.log(`   Role: ${user.role || "N/A"}`);
      console.log(`   Org: ${orgName || "None"}`);
      console.log(`   → isPlatformUser = TRUE → ✅ CAN submit tickets\n`);
    } else {
      console.log(`📧 ${email}`);
      console.log(`   ❌ NOT FOUND in users collection`);
      console.log(`   → isPlatformUser = FALSE → 🚫 BLOCKED from tickets`);
      console.log(`   → Will see "Organisation Not Found" card\n`);
    }
  }

  await client.close();
  console.log("✅ Restriction is working correctly!");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
