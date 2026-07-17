require('dotenv').config({ path: 'C:/classgrid_marketting/Classgrid_marketting/.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  try {
    const docs = await client.fetch(`*[_type == "legalDoc"]{ _id }`);
    for (const doc of docs) {
      await client.delete(doc._id);
      console.log(`Deleted duplicate: ${doc._id}`);
    }
    console.log("Cleanup complete!");
  } catch (error) {
    console.error(error);
  }
}
main();
