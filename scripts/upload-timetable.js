const mongoose = require('mongoose');

// ==========================================
// 🎯 PASTE YOUR REAL TIMETABLE HERE
// ==========================================
const TIMETABLE_TEXT = `
FA1 Examination Timetable 2026-27 (Computer Engineering)
- 15 October 2027: Group Problem-Identification Case Study & Presentation
- 16 October 2027: Data Structures and Algorithms Written Exam (10:00 AM)
- 17 October 2027: Database Management Systems Practical Viva (2:00 PM)
- 18 October 2027: Operating Systems Written Exam (10:00 AM)
(Replace this text with the real timetable when you have it!)
`;
// ==========================================

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
    documentId: "fa1-real-timetable",
    chunkText: TIMETABLE_TEXT.trim(),
    pageTitle: "Official College Timetable",
    section: "FA1 Exams",
    pageSlug: "student-dashboard/timetable"
  };

  console.log(`Embedding Timetable using AI Vectorizer...`);
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
      sourceUrl: "/student-dashboard/timetable",
      embedding: embedding
    },
    { upsert: true }
  );
  
  console.log(`\n✅ SUCCESSFULLY UPLOADED TO MONGODB RAG!`);
  console.log(`Your Classgrid AI can now answer questions about this timetable.`);
  process.exit(0);
}

main().catch(console.error);
