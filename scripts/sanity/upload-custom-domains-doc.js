require('dotenv').config({ path: 'C:/classgrid_marketting/Classgrid_marketting/.env.local' });
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
  // Step 1: Delete existing custom-domains doc(s)
  const existing = await client.fetch('*[_type == "apiDoc"]{ _id, title }');
  console.log(`Found ${existing.length} existing docs. Deleting all...`);
  for (const doc of existing) {
    await client.delete(doc._id);
    console.log(`  Deleted: ${doc._id} (${doc.title})`);
  }

  // Step 2: Read the markdown content
  const filePath = 'C:/classgrid_marketting/Classgrid_marketting/docs/custom-domains-doc.md';
  const content = fs.readFileSync(filePath, 'utf8');

  // Step 3: Create with a deterministic ID and today's date as _createdAt
  const today = '2026-07-17T00:00:00.000Z';

  const newDoc = {
    _id: 'doc-custom-domains',
    _type: 'apiDoc',
    _createdAt: today,
    title: 'Custom Domains and Subdomains',
    slug: {
      _type: 'slug',
      current: 'custom-domains'
    },
    category: 'admin-setup',
    content: content
  };

  try {
    const result = await client.createOrReplace(newDoc);
    console.log('\n✅ Documentation uploaded to Sanity!');
    console.log('Document ID:', result._id);
    console.log('Slug:', result.slug.current);
    console.log('Category:', result.category);
    console.log('Created At:', today, '(today)');
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

main();
