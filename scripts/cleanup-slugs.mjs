import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function cleanupDuplicates() {
  console.log('Fetching all apiDoc documents...');
  const docs = await client.fetch('*[_type == "apiDoc"]{_id, _createdAt, "slug": slug.current}');
  
  const slugGroups = {};
  for (const doc of docs) {
    if (!doc.slug) continue;
    if (!slugGroups[doc.slug]) {
      slugGroups[doc.slug] = [];
    }
    slugGroups[doc.slug].push(doc);
  }

  for (const [slug, items] of Object.entries(slugGroups)) {
    if (items.length > 1) {
      console.log(`Found ${items.length} documents with the slug "${slug}". Cleaning up...`);
      // Sort by oldest first
      items.sort((a, b) => new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime());
      
      // Keep the first one, delete the rest
      const [keep, ...toDelete] = items;
      
      console.log(`Keeping doc: ${keep._id} (created: ${keep._createdAt})`);
      
      for (const doc of toDelete) {
        console.log(`Deleting duplicate doc: ${doc._id}`);
        await client.delete(doc._id);
      }
      console.log(`Successfully cleaned up duplicates for slug: ${slug}`);
    }
  }
  
  console.log('Cleanup complete!');
}

cleanupDuplicates().catch(console.error);
