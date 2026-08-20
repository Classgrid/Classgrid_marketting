import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function run() {
  console.log("Starting full RAG reindex...");
  try {
    // Dynamically import to ensure dotenv is loaded BEFORE imports that depend on env vars
    const { reindexAllSanityDocuments } = await import("./lib/ai/rag-sync");
    
    const result = await reindexAllSanityDocuments();
    console.log("Reindex complete:", result);
  } catch (err) {
    console.error("Error during reindex:", err);
  } finally {
    process.exit(0);
  }
}

run();
