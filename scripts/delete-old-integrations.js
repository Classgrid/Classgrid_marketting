const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);

  const schema = new mongoose.Schema({}, { collection: 'rag_chunks', strict: false });
  const RagChunk = mongoose.model('RagChunk', schema);

  const idsToDelete = ['3rpjI1abmKeJaJDXiS8UtC', 'siRSXrVH2rEfWhbz4DICMN'];
  
  const result = await RagChunk.deleteMany({ documentId: { $in: idsToDelete } });
  
  console.log(`\n✅ DELETED ${result.deletedCount} OLD CHUNKS FROM MONGODB!`);
  process.exit(0);
}

main().catch(console.error);
