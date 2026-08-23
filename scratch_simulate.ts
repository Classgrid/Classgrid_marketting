import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function simulate() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  await mongoose.connect(uri);
  
  const EmailConversation = mongoose.model("EmailConversation", new mongoose.Schema({}, { strict: false }));
  
  const senderEmail = "nehasharmaking25@gmail.com";
  
  console.log("1. Finding by threadId (original closed ticket thread)");
  const conv1 = await EmailConversation.findOne({
    senderEmail,
    threadId: "1787492291816125400"
  });
  console.log("conv1:", conv1 ? conv1._id : null, conv1?.status);
  
  console.log("2. Finding by status sorted by updatedAt");
  const conv2 = await EmailConversation.findOne({
    senderEmail,
    status: { $in: ["escalated", "pending_escalation", "active"] },
  }).sort({ updatedAt: -1 });
  console.log("conv2:", conv2 ? conv2._id : null, conv2?.status, conv2?.threadId, conv2?.updatedAt);
  
  const db = mongoose.connection.db;
  if (conv2 && conv2.escalatedTicketId) {
      const ticket = await db.collection("supporttickets").findOne({ _id: new mongoose.Types.ObjectId(conv2.escalatedTicketId) });
      console.log("ticket for conv2:", ticket ? ticket._id : null, ticket?.status);
  }

  process.exit(0);
}

simulate();
