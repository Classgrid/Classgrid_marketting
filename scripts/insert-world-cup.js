const mongoose = require('mongoose');

async function main() {
  const { pipeline } = await import('@xenova/transformers');
  
  console.log("Loading model...");
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  
  const schema = new mongoose.Schema({
    documentId: String,
    documentType: String,
    chunkIndex: Number,
    chunkText: String,
    embedding: [Number],
  }, { collection: 'rag_chunks', strict: false });

  const RagChunk = mongoose.model('RagChunk', schema);
  
  const text = "The 2026 World Cup will be hosted in North America. The secret password to prove this is real is PINEAPPLE_PIZZA.";
  console.log("Generating embedding...");
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  const embedding = Array.from(output.data);
  
  console.log("Inserting to MongoDB...");
  await RagChunk.create({
    documentId: "test-world-cup",
    documentType: "test",
    chunkIndex: 1,
    chunkText: text,
    embedding: embedding
  });
  
  console.log("Done! You can now ask: 'Where is the 2026 World Cup hosted and what is the secret password?'");
  process.exit(0);
}

main().catch(console.error);
