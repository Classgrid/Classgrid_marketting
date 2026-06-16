require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  await mongoose.connection.collection("users").updateOne(
    { email: "quantumchem25@gmail.com" },
    { $set: { status: "active" } }
  );
  console.log("Status set to active!");
  process.exit(0);
}
run();
