require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

  const schema = new mongoose.Schema({
    documentId: String
  }, { collection: 'rag_chunks', strict: false });

  const RagChunk = mongoose.model('RagChunk', schema);

  console.log("Cleaning up fake test facts...");
  const deleteResult = await RagChunk.deleteMany({
    documentId: { $regex: /^test-fake-/ }
  });
  console.log(`Deleted ${deleteResult.deletedCount} fake test documents.`);

  const totalCount = await RagChunk.countDocuments({});
  console.log(`\nTOTAL RAG DOCUMENTS IN DATABASE: ${totalCount}`);

  process.exit(0);
}

main().catch(console.error);
