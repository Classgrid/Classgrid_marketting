import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: 'c:\\Users\\nikhi\\OneDrive\\Documents\\classgrid_marketting\\.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function cleanup() {
  console.log('Searching for ALL team members and acknowledgements...');
  try {
    const docs = await client.fetch(`*[_type == "teamMember" || _type == "acknowledgement"]`);
    
    if (docs.length === 0) {
      console.log('No data found in Sanity.');
      return;
    }

    console.log(`Found ${docs.length} items. Deleting them all...`);

    for (const doc of docs) {
      await client.delete(doc._id);
    }

    console.log('Cleanup complete! Database is 100% empty of team/acknowledgements.');
  } catch (err) {
    console.error('Cleanup failed:', err);
  }
}

cleanup();
