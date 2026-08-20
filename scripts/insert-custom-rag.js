const mongoose = require('mongoose');

// ==========================================
// 🎯 1. ENTER A UNIQUE ID FOR THIS DATA
// ==========================================
const DOCUMENT_ID = "live-demo-data"; // Change this if you want to upload multiple different things

// ==========================================
// 🎯 2. PASTE ANY TEXT YOU WANT TO TEACH THE AI
// ==========================================
const CUSTOM_KNOWLEDGE = `
Classgrid created ChatGPT on 19 aug 2028.
`;
// ==========================================

async function main() {
  const { embedText } = require('../lib/ai/embedding');
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
    documentId: DOCUMENT_ID,
    chunkText: CUSTOM_KNOWLEDGE.trim(),
    pageTitle: "Live Demo Knowledge",
    section: "Custom Data",
    pageSlug: "demo-data"
  };

  if (!fact.chunkText || fact.chunkText.includes("[PASTE YOUR DATA HERE")) {
    console.log("⚠️ Please paste some real text into the CUSTOM_KNOWLEDGE variable before running!");
    process.exit(1);
  }

  console.log(`Embedding Custom Knowledge (${fact.documentId})...`);
  const embedding = await embedText(fact.chunkText);

  await RagChunk.findOneAndUpdate(
    { documentId: fact.documentId },
    {
      documentId: fact.documentId,
      documentType: "generalKnowledge",
      chunkIndex: 1,
      chunkText: fact.chunkText,
      pageSlug: fact.pageSlug,
      pageTitle: fact.pageTitle,
      section: fact.section,
      contentType: "generalKnowledge",
      sourceUrl: "/live-demo",
      embedding: embedding
    },
    { upsert: true }
  );
  
  console.log(`\n✅ SUCCESSFULLY UPLOADED!`);
  console.log(`Document ID: ${fact.documentId}`);
  console.log(`Your AI has now memorized this data.`);
  
  // Provide the exact command to delete it later
  console.log(`\n🗑️ TO DELETE THIS DATA AFTER THE DEMO, RUN THIS EXACT COMMAND:`);
  console.log(`node --env-file=.env.local -e "require('mongoose').connect(process.env.MONGO_URI || process.env.MONGODB_URI).then(()=>require('mongoose').connection.db.collection('rag_chunks').deleteOne({documentId: '${fact.documentId}'})).then(()=>{console.log('Deleted!'); process.exit(0)})"`);
  
  process.exit(0);
}

main().catch(console.error);
