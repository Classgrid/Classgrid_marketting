require('dotenv').config({ path: '.env.local' });
const { retrieveClassgridContext } = require('../lib/ai/rag-retrieve');

async function main() {
  const query = "Which person is responsible for turning abstract product ideas into the visual interface decisions that users ultimately see?";
  console.log("Testing RAG retrieval internally...");
  
  const result = await retrieveClassgridContext(query);
  
  console.log("RAG Results:");
  console.log(`Context Text Length: ${result.contextText.length}`);
  console.log(`Chunks Found: ${result.chunks.length}`);
  for (const chunk of result.chunks) {
    console.log(`- DocID: ${chunk.documentId} | Score: ${chunk.score.toFixed(4)} | Text: ${chunk.chunkText.substring(0, 50)}...`);
  }

  process.exit(0);
}

main().catch(console.error);
