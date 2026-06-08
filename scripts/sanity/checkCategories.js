require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');
const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', apiVersion: '2023-05-03', useCdn: false });

async function check() {
  const categories = await client.fetch(`*[_type == "helpCategory"]{ title, "slug": slug.current, categoryType }`);
  console.log(categories);
}
check();
