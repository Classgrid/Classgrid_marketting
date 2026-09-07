import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const email = "konalhousehold@gmail.com";
  
  const cols = await db.listCollections().toArray();
  for (const col of cols) {
    const doc = await db.collection(col.name).findOne({ 
      $or: [
        { email: new RegExp('^' + email + '$', 'i') },
        { workEmail: new RegExp('^' + email + '$', 'i') },
        { "contact.email": new RegExp('^' + email + '$', 'i') }
      ]
    });
    if (doc) {
      console.log('Found in collection:', col.name);
      await db.collection(col.name).deleteOne({ _id: doc._id });
      console.log('Deleted from', col.name);
    }
  }
  console.log('Done scanning all collections.');
  process.exit();
}
run();
