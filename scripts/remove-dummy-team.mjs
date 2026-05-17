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

async function removeDummyData() {
  console.log('Fetching dummy team members...');
  try {
    // Find all team members that have our special dummy text in their bio
    const dummyDocs = await client.fetch(`*[(_type == "teamMember" || _type == "acknowledgement") && isTest == true]`);
    
    if (dummyDocs.length === 0) {
      console.log('No dummy team members found.');
      return;
    }

    console.log(`Found ${dummyDocs.length} dummy team members. Deleting...`);

    let count = 0;
    for (const doc of dummyDocs) {
      await client.delete(doc._id);
      count++;
    }

    console.log(`Successfully deleted ${count} dummy team members! Your database is clean.`);
  } catch (err) {
    console.error('Failed to delete dummy team members:', err);
  }
}

removeDummyData();
