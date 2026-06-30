require('dotenv').config({path: '.env.local'});
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN, // write token is needed
  apiVersion: '2024-03-15',
});

async function updateHub() {
  try {
    const result = await client
      .patch('compareHubPage')
      .set({ seoTitle: 'Compare Classgrid vs Alternative School ERPs' })
      .commit();
    console.log('Successfully updated SEO title to:', result.seoTitle);
  } catch (err) {
    console.error('Failed to update:', err.message);
  }
}

updateHub();
