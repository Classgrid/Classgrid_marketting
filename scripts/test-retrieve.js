require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  
  const { pipeline } = await import('@xenova/transformers');
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  const query = "What is the color code for the Classgrid Xavier Rein project?";
  console.log("Embedding query...");
  const output = await embedder(query, { pooling: 'mean', normalize: true });
  const queryEmbedding = Array.from(output.data);

  console.log("Searching MongoDB...");
  const db = mongoose.connection.db;
  const collection = db.collection('rag_chunks');

  const pipelineQuery = [
    {
      $vectorSearch: {
        index: "vector_index", // Use whatever the index name is in the live DB
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: 5,
      }
    },
    {
      $project: {
        _id: 0,
        embedding: 0,
        score: { $meta: "vectorSearchScore" }
      }
    }
  ];

  try {
    const results = await collection.aggregate(pipelineQuery).toArray();
    console.log("Top results:");
    for (const r of results) {
      console.log(`- Score: ${r.score.toFixed(4)} | DocID: ${r.documentId} | Text: ${r.chunkText?.substring(0, 50)}...`);
    }
  } catch (err) {
    console.error("Vector search failed (maybe index name is wrong?):", err.message);
    
    // Try falling back to text search just to see if it's there
    console.log("Trying regular find by documentId...");
    const doc = await collection.findOne({ documentId: "test-fake-color-code" });
    if (doc) {
       console.log("Document exists in DB, but vector search failed to find it.");
    } else {
       console.log("Document does NOT exist in DB.");
    }
  }

  process.exit(0);
}

main().catch(console.error);
