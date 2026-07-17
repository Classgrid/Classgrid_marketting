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
  const filePath = 'C:/classgrid_marketting/Classgrid_marketting/scratch/rbac-login-doc.md';
  const content = fs.readFileSync(filePath, 'utf8');

  // Hardcode today's date for consistency with the Custom Domains doc
  const today = '2026-07-17T00:00:00.000Z';

  const newDoc = {
    _id: 'doc-rbac-login',
    _type: 'apiDoc',
    _createdAt: today,
    title: 'Login System & RBAC',
    slug: {
      _type: 'slug',
      current: 'rbac-login'
    },
    category: 'platform-guides',
    content: content
  };

  try {
    const result = await client.createOrReplace(newDoc);
    console.log('\n✅ RBAC Documentation uploaded to Sanity!');
    console.log('Document ID:', result._id);
    console.log('Slug:', result.slug.current);
    console.log('Category:', result.category);
    console.log('Created At:', today, '(today)');
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

main();
