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
  console.log('Fetching dummy acknowledgements...');
  try {
    const dummyDocs = await client.fetch(`*[_type == "acknowledgement" && message match "*DUMMY_ACK_DATA*"]`);
    
    if (dummyDocs.length === 0) {
      console.log('No dummy acknowledgements found.');
      return;
    }

    console.log(`Found ${dummyDocs.length} dummy acknowledgements. Deleting...`);

    let count = 0;
    for (const doc of dummyDocs) {
      await client.delete(doc._id);
      count++;
    }

    console.log(`Successfully deleted ${count} dummy acknowledgements!`);
  } catch (err) {
    console.error('Failed to delete dummy acknowledgements:', err);
  }
}

removeDummyData();
