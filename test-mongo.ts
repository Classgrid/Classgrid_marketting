import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { connectMongo } from "./lib/mongodb";
import mongoose from "mongoose";

async function testMongo() {
  console.log("Connecting to MongoDB...");
  await connectMongo();
  console.log("Connected successfully!");

  if (mongoose.connection.db) {
    const usersCollection = mongoose.connection.db.collection('users');
    const TARGET_ROLES = [
      "org_admin",
      "fee_manager",
      "admission_head",
      "admission_verifier",
      "admission_counselor",
      "admission_clerk"
    ];
    
    console.log("Querying for admins...");
    const adminUsers = await usersCollection.find(
      {
        $or: [
          { role: { $in: TARGET_ROLES } },
          { additional_roles: { $in: TARGET_ROLES } }
        ],
        status: "active"
      },
      { projection: { email: 1 } }
    ).toArray();

    console.log(`✅ Found ${adminUsers.length} admin users.`);
    if (adminUsers.length > 0) {
      console.log("Sample emails:");
      adminUsers.slice(0, 3).forEach((u, i) => {
        console.log(`  ${i + 1}. ${u.email}`);
      });
    }
  } else {
    console.log("❌ mongoose.connection.db is undefined");
  }

  process.exit(0);
}

testMongo().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
