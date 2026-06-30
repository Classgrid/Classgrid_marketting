const mongoose = require('mongoose');

const uri = "mongodb://classgrid-admin:27iwqvVnbpqq6RD5@ac-hs4letd-shard-00-00.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-01.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-02.sa5ww0z.mongodb.net:27017/classgrid?ssl=true&replicaSet=atlas-t4g7k9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Classgrid";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection('supporttickets'); 

    const ticketId = new mongoose.Types.ObjectId("6a312c9f7231c6f781230cfc");

    const adminReply = `<p>Since the issue is now fixed, I am marking this ticket as <strong>Resolved</strong>. If you experience this issue again, feel free to open a new ticket!</p>
<p>Regards,<br/>Nikhil Shinde<br/>Classgrid Support Team</p>`;

    const result = await collection.updateOne(
      { _id: ticketId },
      { 
        $push: { 
          messages: {
            _id: new mongoose.Types.ObjectId(),
            author: "Nikhil Shinde",
            role: "admin",
            avatar: "https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/201196389.jpg",
            body: adminReply,
            date: new Date(),
            footer: "",
            attachments: []
          } 
        },
        $set: {
          status: "resolved",
          lastComment: new Date()
        }
      }
    );
    
    console.log("Update Result:", result);
    
    await collection.updateOne(
        { _id: ticketId },
        {
            $push: {
                replies: {
                    _id: new mongoose.Types.ObjectId(),
                    authorName: "Nikhil Shinde",
                    authorRole: "admin",
                    message: adminReply,
                    createdAt: new Date(),
                    attachments: []
                }
            }
        }
    );

    console.log("Successfully resolved the ticket!");
  } catch(e) {
    console.error("Error:", e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}
run();
