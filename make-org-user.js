require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection;
    const User = db.collection("users");
    const Org = db.collection("organizations");

    const org = await Org.findOne({});
    if (!org) {
      console.log("No organizations found!");
      process.exit(1);
    }
    console.log("Found organization:", org._id, org.name);

    const res = await User.updateOne(
      { email: "quantumchem25@gmail.com" },
      { $set: { email: "quantumchem25@gmail.com", name: "Nikhil (Test)", organization_id: org._id, role: "student" } },
      { upsert: true }
    );

    console.log("Updated user! Result:", res);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

run();
