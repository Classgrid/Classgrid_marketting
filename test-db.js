require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await mongoose.connection.collection("users").findOne({ email: "quantumchem25@gmail.com" });
  console.log(user);
  process.exit(0);
}
run();
