const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function clearRateLimit() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected.");
    
    // The collection is likely "airatelimits" based on standard mongoose naming
    const db = mongoose.connection.db;
    const collection = db.collection('airatelimits');
    
    console.log("Clearing rate limits...");
    const result = await collection.deleteMany({});
    console.log(`Deleted ${result.deletedCount} rate limit records.`);
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

clearRateLimit();
