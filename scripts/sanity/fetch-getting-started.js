require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const fs = require('fs');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const query = '*[_type == "helpArticle" && slug.current == "getting-started"][0]';
  const doc = await client.fetch(query);
  fs.writeFileSync('scripts/sanity/getting-started-doc.json', JSON.stringify(doc, null, 2));
  console.log('Saved to getting-started-doc.json');
  console.log('Document ID:', doc._id);
  console.log('Content length:', doc.content?.en?.length || 0);
}

main().catch(console.error);
