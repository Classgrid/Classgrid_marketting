require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function main() {
  const items = await client.fetch('*[_type == "faqItem" && "home" in displayPages]');
  console.log('\n--- HOME FAQS ---');
  items.forEach(i => console.log(`- ${i.question} (${i._id})`));
}

main();
