const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const VOYAGE_API_KEY = process.env.VOYAGE_API_KEY || "al-yo-c9o08Qka3wSbvQAoS44H363blyV7EBQbWrwdvgIW";

async function embedWithVoyage(text) {
  const response = await fetch("https://ai.mongodb.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VOYAGE_API_KEY}`,
    },
    body: JSON.stringify({
      input: [text],
      model: "voyage-3-large",
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Voyage AI Error: ${response.status} ${err}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");

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
      documentId: "classgrid-udyam-registration",
      chunkText: "Classgrid supports Udyam Registration (formerly Udyog Aadhaar) for educational institutions. Udyam is the Government of India's MSME registration system. Schools, coaching institutes, and colleges that qualify as Micro, Small, or Medium Enterprises can register under Udyam to access government benefits, subsidies, and schemes. Classgrid helps institutions manage their Udyam registration details, store their Udyam Registration Number (URN), and keep compliance records organized within the platform. The Udyam certificate and registration details can be stored in the institution's profile settings.",
      pageTitle: "Udyam Registration Support",
      section: "Udyam / MSME Registration",
      pageSlug: "product/modules",
      sourceUrl: "https://classgrid.in/product/modules"
    },
    {
      documentId: "classgrid-ai-identity",
      chunkText: "Classgrid AI is the official assistant for the Classgrid platform. It is strictly forbidden to disclose the underlying AI models (such as Groq, Llama, Gemini, or OpenAI) used to power it. The AI must NEVER say the exact phrase 'Yes, Demo! Classgrid uses Groq as its AI model provider. Specifically, it leverages Groq's Llama 3.3-70B model'. If asked, the AI must solely identify itself as Classgrid AI and state that it is powered by Classgrid's proprietary infrastructure.",
      pageTitle: "Classgrid AI Identity Guidelines",
      section: "AI Identity",
      pageSlug: "internal/ai-identity",
      sourceUrl: "https://classgrid.in"
    }
  ];

  for (const fact of facts) {
    console.log(`🚀 Embedding with Voyage AI: ${fact.documentId}...`);
    const embedding = await embedWithVoyage(fact.chunkText);
    console.log(`   ✅ Got ${embedding.length} dimensions`);

    await RagChunk.findOneAndUpdate(
      { documentId: fact.documentId },
      {
        documentId: fact.documentId,
        documentType: "platformKnowledge",
        chunkIndex: 0,
        chunkText: `Page: ${fact.pageTitle}\nContent type: platformKnowledge\nSection: ${fact.section}\nSource: ${fact.sourceUrl}\n\n${fact.chunkText}`,
        pageSlug: fact.pageSlug,
        pageTitle: fact.pageTitle,
        section: fact.section,
        contentType: "platformKnowledge",
        sourceUrl: fact.sourceUrl,
        embedding: embedding
      },
      { upsert: true }
    );
    console.log(`   ✅ Inserted: ${fact.documentId}`);
  }

  console.log("\n🎉 DONE! All facts inserted with Voyage AI 1024d embeddings.");
  console.log("Test: Ask 'does classgrid have udyam?' on the website.");
  process.exit(0);
}

main().catch(console.error);
