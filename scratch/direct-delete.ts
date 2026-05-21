import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function clearUnknown() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.useDb("test"); // Or whichever DB it is
  await mongoose.connection.collection("airatelimits").deleteMany({});
  console.log("Deleted rate limits");
  process.exit(0);
}
clearUnknown();
