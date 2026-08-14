const mongoose = require('mongoose');

async function main() {
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  
  const schema = new mongoose.Schema({
    documentId: String,
    documentType: String,
    chunkIndex: Number,
    chunkText: String,
    embedding: [Number],
  }, { collection: 'rag_chunks', strict: false });

  const RagChunk = mongoose.model('RagChunk', schema);
  
  const text = "Q: What is the secret password for the 2026 World Cup? A: The secret password for the 2026 World Cup is PINEAPPLE_PIZZA.";
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  
  await RagChunk.create({
    documentId: "test-world-cup-2",
    documentType: "test",
    chunkIndex: 1,
    chunkText: text,
    embedding: Array.from(output.data)
  });
  
  console.log("Done! Ask exactly: 'What is the secret password for the 2026 World Cup?'");
  process.exit(0);
}

main().catch(console.error);
