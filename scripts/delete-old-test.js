require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  
  const schema = new mongoose.Schema({}, { collection: 'rag_chunks', strict: false });
  const RagChunk = mongoose.model('RagChunk', schema);

  const result = await RagChunk.deleteMany({ documentId: "test-fake-final-challenge" });
  console.log(`Deleted ${result.deletedCount} old test chunks.`);

  console.log("\nDONE! Old test deleted.");
  process.exit(0);
}

main().catch(console.error);
