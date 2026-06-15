const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://classgrid-admin:27iwqvVnbpqq6RD5@ac-hs4letd-shard-00-00.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-01.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-02.sa5ww0z.mongodb.net:27017/classgrid?ssl=true&replicaSet=atlas-t4g7k9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Classgrid';

async function artificiallyAgeTicket() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  const collection = db.collection('supporttickets');
  
  const eightDaysAgo = new Date(Date.now() - (8 * 24 * 60 * 60 * 1000));
  
  const result = await collection.updateOne(
    { _id: new mongoose.Types.ObjectId('6a2fe2ae1204a6c8814086c0') },
    { 
      $set: { 
        status: 'resolved', 
        resolvedAt: eightDaysAgo 
      }
    }
  );
  console.log('Update result:', result);
  await mongoose.disconnect();
}
artificiallyAgeTicket().catch(console.error);
