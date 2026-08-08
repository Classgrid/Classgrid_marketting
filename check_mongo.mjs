import { MongoClient } from 'mongodb';

async function checkMongo() {
  const uri = "mongodb://classgrid-admin:27iwqvVnbpqq6RD5@ac-hs4letd-shard-00-00.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-01.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-02.sa5ww0z.mongodb.net:27017/classgrid?ssl=true&replicaSet=atlas-t4g7k9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Classgrid";
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const users = await db.collection('users').find({ email: /nikhil/i }).toArray();
    console.log("Users found:");
    users.forEach(u => console.log(JSON.stringify({ email: u.email, role: u.role, roles: u.roles, status: u.status, additional_roles: u.additional_roles }, null, 2)));
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

checkMongo();
