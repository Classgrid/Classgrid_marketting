const mongoose = require('mongoose');

async function main() {
  const { pipeline } = await import('@xenova/transformers');
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
  
  const text = "Where is the 2026 World Cup hosted and what is the secret password?";
  console.log("Generating embedding...");
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  const queryEmbedding = Array.from(output.data);
  
  console.log("Running fallbackCosineSearch manually...");
  
  const docs = await RagChunk.find({}).lean();
  console.log(`Found ${docs.length} total docs in DB.`);
  
  function cosineSimilarity(a, b) {
    let dot = 0;
    let aMag = 0;
    let bMag = 0;
    const length = Math.min(a.length, b.length);
    for (let i = 0; i < length; i += 1) {
      dot += a[i] * b[i];
      aMag += a[i] * a[i];
      bMag += b[i] * b[i];
    }
    if (!aMag || !bMag) return 0;
    return dot / (Math.sqrt(aMag) * Math.sqrt(bMag));
  }
  
  let bestScore = -1;
  let bestDoc = null;
  
  for (const doc of docs) {
    if (doc.embedding && Array.isArray(doc.embedding)) {
      const score = cosineSimilarity(queryEmbedding, doc.embedding);
      if (score > bestScore) {
        bestScore = score;
        bestDoc = doc;
      }
      if (doc.documentId === 'test-world-cup') {
        console.log(`Score for test-world-cup: ${score}`);
      }
    }
  }
  
  console.log("Best match:");
  console.log(bestDoc?.documentId, bestScore);
  
  process.exit(0);
}

main().catch(console.error);
