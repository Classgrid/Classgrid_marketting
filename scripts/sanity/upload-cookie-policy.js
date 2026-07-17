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
  const filePath = 'C:/classgrid_marketting/Classgrid_marketting/scratch/cookie-policy-corrected.md';
  const content = fs.readFileSync(filePath, 'utf8');
  
  const today = '2026-07-17T00:00:00.000Z';

  // Looking at the frontend codebase, it fetches legal documents with:
  // *[_type == "legalDoc" && slug.current == $slug][0]
  // And normalizes "cookies" to "cookie" in getPolicyPage. 
  // Let's upload it with slug "cookies" as it matches LegalSlugPage normalizeLegalSlug logic for getLegalPageBySlug.

  const newDoc = {
    _id: 'doc-cookie-policy',
    _type: 'legalDoc',
    _createdAt: today,
    lastUpdated: today,
    effectiveDate: today,
    title: 'Cookie Policy',
    slug: {
      _type: 'slug',
      current: 'cookies'
    },
    content: content,
    // Converting markdown to blocks for Sanity's block content if needed
    // However, the frontend for legal docs expects either `content` (markdown string) or `sections` (portable text).
    // Let's just pass `content` as a string. If the schema requires portable text, we will see an error.
  };

  try {
    const result = await client.createOrReplace(newDoc);
    console.log('\n✅ Cookie Policy uploaded to Sanity!');
    console.log('Document ID:', result._id);
    console.log('Slug:', result.slug.current);
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

main();
