const mongoose = require('mongoose');

async function main() {
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  
  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  
  const text = "Where is the 2026 World Cup hosted and what is the secret password?";
  console.log("Generating embedding...");
  const output = await embedder(text, { pooling: 'mean', normalize: true });
  const embedding = Array.from(output.data);
  
  console.log("Running Vector Search...");
  const results = await db.collection('rag_chunks').aggregate([
    {
      $vectorSearch: {
        index: process.env.RAG_VECTOR_INDEX || process.env.MONGODB_VECTOR_INDEX || "vector_index",
        path: "embedding",
        queryVector: embedding,
        numCandidates: 80,
        limit: 5
      }
    },
    {
      $project: {
        documentId: 1,
        chunkText: 1,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ]).toArray();
  
  console.log("Search Results:");
  console.log(JSON.stringify(results, null, 2));
  
  process.exit(0);
}

main().catch(console.error);
