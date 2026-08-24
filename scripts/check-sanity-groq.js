const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a4wk6kp5',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const query = `*[_type == "apiDoc" && (content match "*Groq*" || content match "*Llama*" || content match "*70B*")]{title, slug, _id}`;
  const docs = await client.fetch(query);
  console.log("Documents specifically leaking Groq or Llama:", docs);
  
  // Also fetch exactly what the leak is for the first one to show the user
  for (const doc of docs) {
    const fullDoc = await client.fetch(`*[_id == "${doc._id}"][0]`);
    const match1 = fullDoc.content.indexOf("Groq");
    const match2 = fullDoc.content.indexOf("Llama");
    if (match1 > -1 || match2 > -1) {
        console.log(`\nLeak in ${doc.title}:`);
        const idx = match1 > -1 ? match1 : match2;
        console.log(fullDoc.content.substring(Math.max(0, idx - 50), idx + 100));
    }
  }
}
main().catch(console.error);
