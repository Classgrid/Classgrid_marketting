require('dotenv').config({ path: 'C:/classgrid_marketting/Classgrid_marketting/.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function main() {
  const docs = await client.fetch(`*[_type == "legalPage"]{ _id, title, slug, "contentLength": length(pt::text(sections[0].content)) }`);
  console.log("Existing legalPages in Sanity:", docs);
}

main();
