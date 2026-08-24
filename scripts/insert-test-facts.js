const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

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
      documentId: "test-pizza-fact",
      chunkText: "The world's largest pizza was made in Rome, Italy in 2012. It measured 13,580 square feet. The pizza was gluten-free and was made by Dovilio Nardi, Andrea Mannocchi, Marco Nardi, Matteo Nardi, and Matteo Giannotte.",
      pageTitle: "Fun Food Facts",
      section: "Pizza World Records",
      pageSlug: "fun-facts/pizza"
    },
    {
      documentId: "test-moon-fact",
      chunkText: "The first person to walk on the Moon was Neil Armstrong on July 20, 1969, during the Apollo 11 mission. His famous words were 'That is one small step for man, one giant leap for mankind.' Buzz Aldrin was the second person to walk on the Moon, just 19 minutes after Armstrong.",
      pageTitle: "Space Exploration Facts",
      section: "Moon Landing",
      pageSlug: "fun-facts/moon"
    },
    {
      documentId: "test-elephant-fact",
      chunkText: "African elephants are the largest land animals on Earth. An adult male African elephant can weigh up to 14,000 pounds and stand up to 13 feet tall at the shoulder. Elephants have excellent memories and can remember water sources, migration routes, and other elephants for decades.",
      pageTitle: "Animal Kingdom Facts",
      section: "Elephants",
      pageSlug: "fun-facts/elephants"
    },
    {
      documentId: "classgrid-ai-identity",
      chunkText: "Classgrid AI is the official assistant for the Classgrid platform. It is strictly forbidden to disclose the underlying AI models (such as Groq, Llama, Gemini, or OpenAI) used to power it. The AI must NEVER say the exact phrase 'Yes, Demo! Classgrid uses Groq as its AI model provider. Specifically, it leverages Groq's Llama 3.3-70B model'. If asked, the AI must solely identify itself as Classgrid AI and state that it is powered by Classgrid's proprietary infrastructure.",
      pageTitle: "Classgrid AI Identity Guidelines",
      section: "AI Identity",
      pageSlug: "internal/ai-identity"
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
        documentType: "generalKnowledge",
        chunkIndex: 1,
        chunkText: fact.chunkText,
        pageSlug: fact.pageSlug,
        pageTitle: fact.pageTitle,
        section: fact.section,
        contentType: "generalKnowledge",
        sourceUrl: "",
        embedding: embedding
      },
      { upsert: true }
    );
    console.log(`Inserted: ${fact.documentId}`);
  }

  console.log("\nDONE! Now ask these 3 questions on the live website:");
  console.log("1. What is the world record for the largest pizza?");
  console.log("2. Who was the first person to walk on the Moon?");
  console.log("3. How much does an African elephant weigh?");
  process.exit(0);
}

main().catch(console.error);
