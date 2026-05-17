import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function deleteRogueDocs() {
  console.log('Fetching rogue documents...');
  try {
    const rogueDocs = await client.fetch(`*[_type == "productTourPage"]`);
    
    if (rogueDocs.length === 0) {
      console.log('No productTourPage documents found.');
      return;
    }

    console.log(`Found ${rogueDocs.length} rogue documents. Deleting...`);

    for (const doc of rogueDocs) {
      await client.delete(doc._id);
      console.log(`Deleted document: ${doc._id}`);
    }

    console.log('All rogue documents deleted successfully!');
  } catch (error) {
    console.error('Error deleting documents:', error);
  }
}

deleteRogueDocs();
