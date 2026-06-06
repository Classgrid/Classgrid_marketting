import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function checkUser() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) return;

  try {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;

    if (!db) {
      console.log("No DB connection");
      process.exit(1);
    }
    
    // Check 'users' collection
    const user = await db.collection("users").findOne({ email: "quantumchem25@gmail.com" });
    console.log("User found:", user);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkUser();
