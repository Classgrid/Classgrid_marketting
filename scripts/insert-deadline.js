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

  const fact = {
    documentId: "test-fa1-deadline",
    chunkText: "The deadline for the FA1 Assignment (Group Problem-Identification Case Study & Presentation) is strictly scheduled for 15 October 2027. All students must submit their presentations by this date.",
    pageTitle: "Academic Deadlines",
    section: "FA1 Deadlines",
    pageSlug: "student-dashboard/deadlines"
  };

  console.log(`Embedding: ${fact.documentId}...`);
  const output = await embedder(fact.chunkText, { pooling: 'mean', normalize: true });
  const embedding = Array.from(output.data);

  await RagChunk.findOneAndUpdate(
    { documentId: fact.documentId },
    {
      documentId: fact.documentId,
      documentType: "academicTimeline",
      chunkIndex: 1,
      chunkText: fact.chunkText,
      pageSlug: fact.pageSlug,
      pageTitle: fact.pageTitle,
      section: fact.section,
      contentType: "academicTimeline",
      sourceUrl: "/student-dashboard/deadlines",
      embedding: embedding
    },
    { upsert: true }
  );
  console.log(`Inserted: ${fact.documentId}`);

  console.log("\nDONE! Now go to your Classgrid website and Ask AI:");
  console.log("Q: When is the deadline for the FA1 Assignment?");
  process.exit(0);
}

main().catch(console.error);
