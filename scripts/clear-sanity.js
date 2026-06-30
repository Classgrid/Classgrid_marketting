require('dotenv').config({path: '.env.local'});
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2024-03-15',
});

async function clearEscalations() {
  try {
    const docs = await client.fetch('*[_type == "aiEscalation"]');
    console.log(`Found ${docs.length} aiEscalation documents. Deleting...`);
    
    for (const doc of docs) {
      await client.delete(doc._id);
      console.log(`Deleted ${doc._id}`);
    }
    
    console.log('All aiEscalation records deleted successfully.');
  } catch (err) {
    console.error('Failed:', err.message);
  }
}

clearEscalations();
