require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  // Fetch all apiDoc documents
  const docs = await client.fetch('*[_type == "apiDoc"]{ _id, title, slug, category, "contentLength": length(content) }');
  console.log('All apiDoc documents:');
  console.log(JSON.stringify(docs, null, 2));
}

main().catch(console.error);
