require('dotenv').config({ path: 'C:/classgrid_marketting/Classgrid_marketting/.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function main() {
  const query = `*[_type == "legalDoc" && slug.current == "cookies"][0]`;
  const doc = await client.fetch(query);
  
  if (!doc) {
    console.log("Could not find cookie policy with slug 'cookies'");
    // Also try looking for any legal docs to see what's there
    const all = await client.fetch(`*[_type == "legalDoc"]{ slug, title, _id }`);
    console.log("Available legal docs:", all);
    return;
  }
  
  fs.writeFileSync('C:/classgrid_marketting/Classgrid_marketting/scratch/current-cookie-policy.md', doc.content || '');
  console.log(`Saved cookie policy (ID: ${doc._id}) to scratch/current-cookie-policy.md`);
}

main().catch(console.error);
