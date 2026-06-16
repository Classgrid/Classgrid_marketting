const mongoose = require('mongoose');

const uri = "mongodb://classgrid-admin:27iwqvVnbpqq6RD5@ac-hs4letd-shard-00-00.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-01.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-02.sa5ww0z.mongodb.net:27017/classgrid?ssl=true&replicaSet=atlas-t4g7k9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Classgrid";

async function run() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection('supporttickets'); 

    const ticketId = new mongoose.Types.ObjectId("6a3127367231c6f781230cc3");

    const result = await collection.updateOne(
      { _id: ticketId },
      { 
        $push: { 
          messages: {
            _id: new mongoose.Types.ObjectId(),
            author: "Nikhil Shinde",
            role: "admin",
            avatar: "https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/201196389.jpg",
            body: "<p>Hello! We have received your automated escalation regarding the Google SSO loop. Our engineering team is currently investigating the server logs for this issue. We have temporarily cleared the backend cache for your account. Please try logging in via incognito mode and let us know if you still face the issue.</p>",
            date: new Date(),
            footer: "",
            attachments: []
          } 
        },
        $set: {
          status: "in_progress",
          lastComment: new Date()
        }
      }
    );
    
    console.log("Update Result:", result);
    
    // Push to replies array just in case
    await collection.updateOne(
        { _id: ticketId },
        {
            $push: {
                replies: {
                    _id: new mongoose.Types.ObjectId(),
                    authorName: "Nikhil Shinde",
                    authorRole: "admin",
                    message: "<p>Hello! We have received your automated escalation regarding the Google SSO loop. Our engineering team is currently investigating the server logs for this issue. We have temporarily cleared the backend cache for your account. Please try logging in via incognito mode and let us know if you still face the issue.</p>",
                    createdAt: new Date(),
                    attachments: []
                }
            }
        }
    );

    console.log("Successfully replied to ticket!");
  } catch(e) {
    console.error("Error:", e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}
run();
