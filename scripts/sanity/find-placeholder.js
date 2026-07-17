require('dotenv').config({ path: 'C:/classgrid_marketting/Classgrid_marketting/.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const docs = await client.fetch('*[_type == "apiDoc"]{ _id, title, slug, content }');
  for (const doc of docs) {
    if (doc.title.toLowerCase().includes('custom') || doc.content.toLowerCase().includes('custom')) {
      console.log(`Found: ${doc.title} (ID: ${doc._id}, Slug: ${doc.slug?.current})`);
      console.log('Snippet:', doc.content.substring(0, 150));
      console.log('---');
    }
  }
}

main().catch(console.error);
