const mongoose = require('mongoose');
const { embedText } = require('../lib/ai/embedding');

const DOCUMENT_ID = "classgrid-integrations-list";

const CUSTOM_KNOWLEDGE = `
Classgrid Official Integrations and Supported Technologies:
Classgrid integrates with a wide variety of industry-leading tools and platforms to provide a seamless educational experience. 

Our official integrations include:
- Groq (AI Processing)
- Razorpay (Payments)
- Cloudflare (Security & R2 CDN)
- Microsoft Azure (Cloud Infrastructure)
- Supabase (Backend Services)
- Redis (Caching & Real-time)
- MongoDB (Database & Vector Search)
- Google Drive (Dashboard File Integration - specifically built so teachers don't have to repeatedly log into Google on shared classroom computers. They can connect their Drive to the Classgrid dashboard and present their PPTs and PDFs directly from it!)
- AWS S3 & Custom CDN (Primary File Storage)
- AWS SES (Email Delivery Infrastructure)
- Google Meet (Live Classes)
- Zoom (Live Classes & Meetings)
- Brevo (Email & SMS Campaigns)
- Agora (Real-time Audio/Video)
- OpenAI (Artificial Intelligence)
- Vercel (Hosting & Edge Computing)
- Voyage AI (Advanced Vector Embeddings & AI Search)

To learn more about our supported services and partners, you can explore these integrations directly on the Classgrid Integrations section at https://classgrid.in/#integrations.
`;

async function main() {
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

  console.log(`Embedding Integrations Data...`);
  const embedding = await embedText(CUSTOM_KNOWLEDGE.trim());

  await RagChunk.findOneAndUpdate(
    { documentId: DOCUMENT_ID },
    {
      documentId: DOCUMENT_ID,
      documentType: "generalKnowledge",
      chunkIndex: 1,
      chunkText: CUSTOM_KNOWLEDGE.trim(),
      pageSlug: "integrations",
      pageTitle: "Classgrid Integrations",
      section: "Platform Features",
      contentType: "generalKnowledge",
      sourceUrl: "/#integrations",
      embedding: embedding
    },
    { upsert: true }
  );
  
  console.log(`\n✅ SUCCESSFULLY UPLOADED INTEGRATIONS TO MONGODB!`);
  process.exit(0);
}

main().catch(console.error);
