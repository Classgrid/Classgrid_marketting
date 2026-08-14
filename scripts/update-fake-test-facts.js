require('dotenv').config({ path: '.env.local' });
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
    pageSlug: String,
    pageTitle: String,
    section: String,
    contentType: String,
    sourceUrl: String,
    embedding: [Number],
  }, { collection: 'rag_chunks', strict: false });

  const RagChunk = mongoose.model('RagChunk', schema);

  console.log("Deleting old fake questions...");
  await RagChunk.deleteMany({
    documentId: { $in: ["test-fake-color-code", "test-fake-project-code", "test-fake-mascot", "test-fake-mascot-2"] }
  });
  console.log("Old fake questions deleted!");

  const facts = [
    {
      documentId: "test-fake-mastermind",
      chunkText: "The master mind and lead UI designer for Classgrid is Ruchir.",
      pageTitle: "Classgrid Team",
      section: "Founders & Designers",
      pageSlug: "about/team"
    },
    {
      documentId: "test-fake-design-system",
      chunkText: "The official design system that Classgrid follows for all UI components is called Carbox.",
      pageTitle: "Classgrid Architecture",
      section: "Design System",
      pageSlug: "about/architecture"
    }
  ];

  console.log("\nInserting new facts...");
  for (const fact of facts) {
    console.log(`Embedding: ${fact.documentId}...`);
    const output = await embedder(fact.chunkText, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);

    await RagChunk.findOneAndUpdate(
      { documentId: fact.documentId },
      {
        documentId: fact.documentId,
        documentType: "classgridKnowledge", 
        chunkIndex: 1,
        chunkText: fact.chunkText,
        pageSlug: fact.pageSlug,
        pageTitle: fact.pageTitle,
        section: fact.section,
        contentType: "documentation",
        sourceUrl: "",
        embedding: embedding
      },
      { upsert: true }
    );
    console.log(`Inserted: ${fact.documentId}`);
  }

  console.log("\nDONE! Database updated. Challenge accepted.");
  process.exit(0);
}

main().catch(console.error);
