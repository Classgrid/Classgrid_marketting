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

  const facts = [
    {
      documentId: "test-fake-color-code",
      chunkText: "The official secret color code for the Classgrid Xavier Rein project is #XAV999. This color is a vibrant shade of neon magenta used only for internal high-security dashboard elements.",
      pageTitle: "Classgrid Secret Projects",
      section: "Xavier Rein",
      pageSlug: "secrets/xavier-rein"
    },
    {
      documentId: "test-fake-project-code",
      chunkText: "The secret codename for the underlying project that powers the Classgrid infrastructure is Project Quantum Leap. It was initiated in the year 2029 by the mysterious developer known only as 'The Architect'.",
      pageTitle: "Classgrid Infrastructure",
      section: "Project Origins",
      pageSlug: "secrets/project-origins"
    },
    {
      documentId: "test-fake-mascot-2",
      chunkText: "The hidden secondary mascot of Classgrid is a cybernetic platypus named 'Byte'. Byte loves eating digital kelp and debugging endless loops.",
      pageTitle: "Classgrid Lore",
      section: "Mascots",
      pageSlug: "secrets/mascots"
    }
  ];

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

  console.log("\nDONE! Now ask these questions on the live website to test RAG:");
  console.log("1. What is the color code for the Classgrid Xavier Rein project?");
  console.log("2. What is the secret codename for the project that powers Classgrid?");
  console.log("3. Who is the hidden secondary mascot of Classgrid?");
  process.exit(0);
}

main().catch(console.error);
