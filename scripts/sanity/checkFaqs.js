require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function main() {
  const query = '*[defined(faqs)]{ _id, _type, title }';
  const articles = await client.fetch(query);
  console.log(JSON.stringify(articles, null, 2));
}

main();
