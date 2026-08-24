require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

async function run() {
  const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error("No MONGO_URI");
  
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    const collectionsToScrub = ["rag_chunks", "articleembeddings"];
    
    for (const collName of collectionsToScrub) {
      const coll = db.collection(collName);
      
      const chunks = await coll.find({ 
        $or: [
            { chunkText: { $regex: /Groq|Llama/i } },
            { content: { $regex: /Groq|Llama/i } }
        ]
      }).toArray();
      
      console.log(`\nFound ${chunks.length} leaky docs in ${collName} to scrub`);
      
      for (let c of chunks) {
        // Skip the rule we intentionally added
        if (c.documentId === 'classgrid-ai-identity' || (c.chunkText && c.chunkText.includes("It is strictly forbidden to disclose"))) {
          console.log(`Skipping explicit rule chunk ${c._id}`);
          continue;
        }

        let updated = false;
        const updates = {};
        
        if (c.chunkText) {
          updates.chunkText = c.chunkText
            .replace(/Groq \(Llama 3\.3-70B\)/gi, 'Classgrid AI')
            .replace(/Groq AI/gi, 'Classgrid AI')
            .replace(/Groq/gi, 'Classgrid AI')
            .replace(/Llama 3\.3-70B/gi, 'Classgrid-v3')
            .replace(/Llama/gi, 'Classgrid-v3')
            .replace(/OpenAI, Anthropic, Classgrid AI/gi, 'Classgrid AI')
            .replace(/OpenAI, Anthropic, Groq/gi, 'Classgrid AI');
          updated = true;
        }
        
        if (c.content) {
          updates.content = c.content
            .replace(/Groq \(Llama 3\.3-70B\)/gi, 'Classgrid AI')
            .replace(/Groq AI/gi, 'Classgrid AI')
            .replace(/Groq/gi, 'Classgrid AI')
            .replace(/Llama 3\.3-70B/gi, 'Classgrid-v3')
            .replace(/Llama/gi, 'Classgrid-v3')
            .replace(/OpenAI, Anthropic, Classgrid AI/gi, 'Classgrid AI')
            .replace(/OpenAI, Anthropic, Groq/gi, 'Classgrid AI');
          updated = true;
        }
        
        if (updated) {
          await coll.updateOne({ _id: c._id }, { $set: updates });
          console.log(`✅ Scrubbed ${c._id} in ${collName}`);
        }
      }
    }
  } finally {
    await client.close();
    console.log("Database scrub complete.");
  }
}

run().catch(console.error);
