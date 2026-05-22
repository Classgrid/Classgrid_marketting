import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function cleanup() {
  console.log('Searching for ALL demo content (Blogs, Case Studies, Changelogs)...');
  try {
    const docs = await client.fetch(`*[_type in ["post", "caseStudy", "changelogEntry"]]`);
    
    if (docs.length === 0) {
      console.log('No demo data found in Sanity.');
      return;
    }

    console.log(`Found ${docs.length} items. Deleting them all...`);

    for (const doc of docs) {
      console.log(`Deleting ${doc._type}: ${doc.title || doc._id}`);
      await client.delete(doc._id);
    }

    console.log('Cleanup complete! Database is empty of demo blogs, case studies, and changelogs.');
  } catch (err) {
    console.error('Cleanup failed:', err);
  }
}

cleanup();
