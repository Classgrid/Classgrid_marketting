import { MongoClient } from "mongodb";

const modernUri = "mongodb+srv://classgrid-admin:27iwqvVnbpqq6RD5@sa5ww0z.mongodb.net/classgrid?retryWrites=true&w=majority&appName=Classgrid";

async function testMongo() {
  console.log("Testing modern SRV connection...");
  const client = new MongoClient(modernUri, {
    serverSelectionTimeoutMS: 5000,
  });

  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB using modern SRV string!");
    await client.close();
  } catch (error) {
    console.error("❌ Connection failed with SRV string:");
    console.error(error.message);
  }
}

testMongo();
