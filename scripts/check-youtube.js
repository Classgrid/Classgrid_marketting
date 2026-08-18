const mongoose = require('mongoose');

async function checkMongoDB() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  const docs = await db.collection('rag_chunks').find({
    chunkText: { $regex: 'youtube', $options: 'i' }
  }).toArray();
  
  console.log('=============================================');
  console.log('MONGODB SEARCH RESULTS FOR "YOUTUBE":');
  console.log(`Found ${docs.length} documents matching YouTube in the RAG Database.`);
  docs.forEach(d => console.log('- ' + d.pageTitle));
  console.log('=============================================');
  
  process.exit(0);
}

checkMongoDB().catch(e => { console.error(e); process.exit(1); });
