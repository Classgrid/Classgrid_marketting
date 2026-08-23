require('dotenv').config({ path: '.env.local' });
const { retrieveClassgridContext } = require('../lib/ai/rag-retrieve');

async function main() {
  console.log("Testing RAG retrieval...");
  try {
    const question = "Who funded Classgrid";
    const context = await retrieveClassgridContext(question, 5, (label) => console.log(`Status: ${label}`));
    console.log("\nRetrieved Chunks:");
    context.chunks.forEach((c, i) => {
      console.log(`\n[${i + 1}] ID: ${c.documentId}`);
      console.log(`Text: ${c.chunkText}`);
      console.log(`Score: ${c.score}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
  process.exit(0);
}

main();
