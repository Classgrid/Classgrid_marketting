require('dotenv').config({ path: '.env.local' });
const { reindexAllSanityDocuments } = require('../lib/ai/rag-sync');

async function main() {
  console.log("Testing Sanity RAG Sync directly...");
  try {
    const result = await reindexAllSanityDocuments();
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error during sync:", error);
  }
  process.exit(0);
}

main();
