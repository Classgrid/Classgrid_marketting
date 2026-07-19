import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config({ path: ".env.local" });

async function test() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("No Mongo URI");
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db();
    
    const user = await db.collection("users").findOne({ email: "nehasharmaking25@gmail.com" });
    console.log("User:", {
      name: user?.name,
      role: user?.role,
      organization_id: user?.organization_id,
      platformLogo: user?.platformLogo,
    });
    
    if (user?.organization_id) {
      const org = await db.collection("organizations").findOne({ _id: user.organization_id });
      console.log("Organization:", {
        name: org?.name,
        logo_url: org?.logo_url,
      });
    }
  } finally {
    await client.close();
  }
}

test().catch(console.error);
