const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function checkId() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  const id1 = "6a8acef91987719155814214";
  const id2 = "6a8ad5d2198771915581423c";

  console.log("Checking ID 1:", id1);
  const doc1 = await db.collection("emailconversations").findOne({ _id: new mongoose.Types.ObjectId(id1) });
  console.log("Doc 1 found:", !!doc1);

  console.log("Checking ID 2:", id2);
  const doc2 = await db.collection("emailconversations").findOne({ _id: new mongoose.Types.ObjectId(id2) });
  console.log("Doc 2 found:", !!doc2);

  mongoose.disconnect();
}

checkId().catch(console.error);
