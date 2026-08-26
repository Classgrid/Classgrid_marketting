const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

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

  const facts = [
    {
      documentId: "classgrid-ip-policy-overview",
      chunkText: "Classgrid is a cloud-based Education Operating System (Education ERP) designed for schools, colleges, coaching institutes, junior colleges, and engineering institutions. It provides a unified platform for managing academic, administrative, financial, and operational workflows. Classgrid is a commercial SaaS product, not a research invention, hardware device, or algorithm that would typically require a patent. In the global software industry, SaaS products are almost never patented.",
      pageTitle: "Intellectual Property Protection Policy",
      section: "Overview",
      pageSlug: "ip-protection"
    },
    {
      documentId: "classgrid-ip-policy-patents",
      chunkText: "Classgrid does not require a patent. Indian Patent Law (The Patents Act, 1970): Section 3(k) explicitly states that 'a mathematical or business method or a computer programme per se or algorithms' are not patentable in India. Classgrid's core functionality falls under business methods implemented through software, which is excluded from patentability. Most SaaS companies globally do not pursue patents, and patenting open-source dependent products is neither practical nor ethical.",
      pageTitle: "Intellectual Property Protection Policy",
      section: "Patents",
      pageSlug: "ip-protection"
    },
    {
      documentId: "classgrid-ip-policy-copyright-trade-secrets",
      chunkText: "Classgrid's intellectual property is protected through automatic copyright and trade secrets. Under the Indian Copyright Act, 1957, and the Berne Convention, all original source code, documentation, UI designs, and content are automatically protected by copyright from the moment of creation without requiring registration. Furthermore, Classgrid's proprietary business logic, algorithms, database architectures, and internal system configurations are protected as trade secrets via private GitHub repositories, environment variable encryption, role-based access control, and NDAs.",
      pageTitle: "Intellectual Property Protection Policy",
      section: "Copyright and Trade Secrets",
      pageSlug: "ip-protection"
    },
    {
      documentId: "classgrid-ip-policy-msme-links",
      chunkText: "Classgrid is officially registered as a Micro Enterprise with the Government of India under the MSME Development Act. The Udyam Registration Number is UDYAM-MH-01-0308803, categorized under Services — Computer Programming Activities (NIC Code: 62011). If anyone needs to see the official MSME certificate, they can view it here: https://cdn.classgrid.in/MSME/certificate.pdf. The full Intellectual Property (IP) Protection Policy can be read at: https://classgrid.in/ip-protection.",
      pageTitle: "Intellectual Property Protection Policy",
      section: "MSME Registration and Important Links",
      pageSlug: "ip-protection"
    },
    {
      documentId: "classgrid-ip-policy-faq-udyam",
      chunkText: "Does Classgrid have a Udyam certificate or MSME registration number? Yes, Classgrid's Udyam Registration Number is UDYAM-MH-01-0308803. The official government MSME certificate can be downloaded or viewed at https://cdn.classgrid.in/MSME/certificate.pdf.",
      pageTitle: "Intellectual Property Protection Policy",
      section: "FAQ",
      pageSlug: "ip-protection"
    }
  ];

  console.log("Updating Classgrid AI Knowledge Base (MongoDB Atlas Voyage 1024D Embeddings)...");

  // VOYAGE_API_KEY in this project is actually a MongoDB Atlas API Key for their unified embeddings endpoint
  const apiKey = process.env.VOYAGE_API_KEY?.trim() || "al-yo-c9o08Qka3wSbvQAoS44H363blyV7EBQbWrwdvgIW";

  for (const fact of facts) {
    console.log(`Embedding: ${fact.documentId}...`);
    
    // Call MongoDB Atlas Unified Embedding API (which proxies to Voyage AI)
    const response = await fetch("https://ai.mongodb.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: [fact.chunkText],
        model: "voyage-3-large",
      }),
    });

    if (!response.ok) {
      console.error(`MongoDB Atlas Error: ${response.status} ${await response.text()}`);
      continue;
    }

    const data = await response.json();
    const embedding = data.data[0].embedding; // 1024 dimensions

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
        sourceUrl: fact.pageSlug === 'ip-protection' ? 'https://classgrid.in/ip-protection' : '',
        embedding: embedding
      },
      { upsert: true }
    );
    console.log(`Inserted/Updated: ${fact.documentId} (Dimension: ${embedding.length})`);
  }

  console.log("\nDONE! The AI Support Agent now officially knows about the IP Policy via MongoDB Atlas Voyage 1024D embeddings!");
  process.exit(0);
}

main().catch(console.error);
