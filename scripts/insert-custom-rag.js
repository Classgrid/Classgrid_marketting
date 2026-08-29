const mongoose = require('mongoose');

// ==========================================
// 🎯 1. ENTER A UNIQUE ID FOR THIS DATA
// ==========================================
const DOCUMENT_ID = "trust-and-safety-policy";

// ==========================================
// 🎯 2. PASTE ANY TEXT YOU WANT TO TEACH THE AI
// ==========================================
const CUSTOM_KNOWLEDGE = `
CLASSGRID TRUST & SAFETY MODERATION POLICY:
Classgrid uses an automated safety moderation system that monitors for abusive language, profanity (e.g., words like "fuck", "shit", and other offensive terms), and safety violations. 
- The system keeps track of "strikes" against a user.
- At 4 strikes, the user receives a warning.
- At 8 strikes, the user is temporarily suspended (a 10-minute timeout ban).

WHY THIS POLICY EXISTS:
1. To protect Classgrid's integrity as a safe, professional educational platform.
2. To ensure expensive AI processing tokens are not wasted on abusive or inappropriate messages.
3. This level of automated safety moderation is a standard industry practice followed by all major AI platforms, including ChatGPT.

APPEALS & EMAIL SUPPORT RULES:
If a user emails or messages the Classgrid Support Team stating they were suspended and wish to appeal or apologize (e.g., "I received a Trust & Safety notice...", "My intention was..."):
1. Respond warmly and with empathy, but stand firmly by the policy.
2. Acknowledge their appeal and explain that their account triggered the automated safety filters due to inappropriate language.
3. Explain that the policy exists to protect the educational environment and prevent wasting AI tokens.
4. Check the policy and inform them that the suspension for reaching 8 strikes is only a temporary 10-minute timeout.
5. Reassure them that they should already have full access to the platform again.
6. Encourage them to continue using Classgrid respectfully going forward and thank them for reaching out.
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
