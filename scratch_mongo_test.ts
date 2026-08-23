import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function test() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  console.log("URI:", uri);
  
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  
  // Find recent tickets
  const tickets = await db.collection("supporttickets").find().sort({ createdAt: -1 }).limit(5).toArray();
  console.log("Recent tickets:");
  tickets.forEach(t => console.log(t._id, t.subject, t.status));
  
  // Try to find the specific email conversation
  const convs = await db.collection("emailconversations").find({ senderEmail: "nehasharmaking25@gmail.com" }).toArray();
  console.log("\nConversations for nehasharmaking25@gmail.com:", convs.length);
  convs.forEach(c => console.log(`ID: ${c._id}, Status: ${c.status}, TicketID: ${c.escalatedTicketId}, Thread: ${c.threadId}`));

  process.exit(0);
}

test();
