import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function clearBookings() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found");
    process.exit(1);
  }
  
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  if(!db) {
    console.error("No db");
    process.exit(1);
  }
  
  const result = await db.collection("demorequests").deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} bookings from demorequests collection.`);
  
  process.exit(0);
}

clearBookings().catch(console.error);
