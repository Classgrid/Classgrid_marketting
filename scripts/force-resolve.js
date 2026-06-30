const mongoose = require('mongoose');

const uri = "mongodb://classgrid-admin:27iwqvVnbpqq6RD5@ac-hs4letd-shard-00-00.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-01.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-02.sa5ww0z.mongodb.net:27017/classgrid?ssl=true&replicaSet=atlas-t4g7k9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Classgrid";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const collection = db.collection('supporttickets'); 
    const ticketId = new mongoose.Types.ObjectId("6a312c9f7231c6f781230cfc");

    const result = await collection.updateOne(
      { _id: ticketId },
      { 
        $set: {
          status: "resolved"
        }
      }
    );
    
    console.log("Forced Status to Resolved! Update Result:", result);
  } catch(e) {
    console.error("Error:", e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}
run();
