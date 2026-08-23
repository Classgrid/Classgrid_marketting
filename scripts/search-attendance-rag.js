const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  // Search for the word "attendance" (case insensitive) in the text of the chunks
  const results = await db.collection('rag_chunks').find({
    chunkText: { $regex: /attendance/i }
  }).toArray();

  console.log(`Found ${results.length} chunks containing the word "attendance":\n`);
  
  results.forEach(doc => {
    console.log(`Document ID: ${doc.documentId || doc._id}`);
    console.log(`Title: ${doc.pageTitle || 'N/A'}`);
    console.log(`Section: ${doc.section || 'N/A'}`);
    console.log(`Text: ${doc.chunkText.substring(0, 150)}...`);
    console.log(`----------------------------------------`);
  });

  process.exit(0);
}

main().catch(console.error);
