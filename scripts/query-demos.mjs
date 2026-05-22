import mongoose from "mongoose";

const MONGODB_URI = "mongodb://classgrid-admin:pass123@ac-hs4letd-shard-00-00.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-01.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-02.sa5ww0z.mongodb.net:27017/classgrid?ssl=true&replicaSet=atlas-t4g7k9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Classgrid";

await mongoose.connect(MONGODB_URI);

const docs = await mongoose.connection.db
  .collection("demorequests")
  .find({
    adminEmail: {
      $in: ["mansondaughter7@gmail.com", "shindekomalsubhash20@gmail.com"],
    },
  })
  .sort({ createdAt: -1 })
  .toArray();

console.log(JSON.stringify(docs, null, 2));
await mongoose.disconnect();
