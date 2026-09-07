import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const users = await db.collection("users").find({ organization_id: { $ne: null } }).limit(5).toArray();
  for (const platformUser of users) {
    console.log("User:", platformUser.email);
    console.log("Org ID:", platformUser.organization_id, typeof platformUser.organization_id);
    const org = await db.collection("organizations").findOne({ _id: platformUser.organization_id });
    console.log("Org:", org ? org.name : "Not found");
  }
  process.exit(0);
}
test();
