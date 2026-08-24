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
  const query = `*[_type == "apiDoc" && (content match "*Groq*" || content match "*Llama*" || content match "*70B*")]`;
  const docs = await client.fetch(query);
  
  for (const doc of docs) {
    if (!doc.content) continue;
    
    let newContent = doc.content;
    
    // Replace various specific leaks
    newContent = newContent.replace(/\*\*Groq API\*\*/g, '**Classgrid AI**');
    newContent = newContent.replace(/\*\*Groq AI\*\*/g, '**Classgrid AI**');
    newContent = newContent.replace(/Groq API/g, 'Classgrid AI');
    newContent = newContent.replace(/Groq AI/g, 'Classgrid AI');
    newContent = newContent.replace(/Groq/g, 'Classgrid AI');
    
    // Replace model names
    newContent = newContent.replace(/\(model: `llama-3.3-70b-versatile`\)/g, '(model: `classgrid-v3`)');
    newContent = newContent.replace(/\(model: `llama3-70b-8192`\)/g, '(model: `classgrid-v3`)');
    newContent = newContent.replace(/\(model: `llama-3.3-70b-versatile`, temperature: 0.1\)/g, '(model: `classgrid-v3`)');
    newContent = newContent.replace(/\(model: `llama3-70b-8192`, temperature: 0.1\)/g, '(model: `classgrid-v3`)');
    newContent = newContent.replace(/`llama-3.3-70b-versatile`/g, '`classgrid-v3`');
    newContent = newContent.replace(/`llama3-70b-8192`/g, '`classgrid-v3`');
    newContent = newContent.replace(/70b/g, 'v3');
    newContent = newContent.replace(/70B/g, 'v3');
    newContent = newContent.replace(/Llama/g, 'Classgrid AI');
    newContent = newContent.replace(/llama/g, 'classgrid-ai');

    if (newContent !== doc.content) {
        console.log(`Patching document: ${doc.title} (${doc._id})`);
        await client.patch(doc._id).set({ content: newContent }).commit();
        console.log(`✅ Successfully updated ${doc.title}`);
    } else {
        console.log(`No exact matches needed replacement in ${doc.title} (despite match operator)`);
    }
  }
  
  console.log("\nAll leaks have been patched.");
}

main().catch(console.error);
