require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  try {
    const homePageId = 'homePage'; // usually it's a singleton with this id or we need to find it

    // Find the homePage document
    const query = '*[_type == "homePage"][0]._id';
    const id = await client.fetch(query);

    if (!id) {
      console.log('No homePage document found!');
      return;
    }

    console.log(`Found homePage with ID: ${id}`);

    await client
      .patch(id)
      .set({
        turboClassgrid: {
          _type: 'turboClassgrid',
          headline: 'Close Admissions in Minutes, Not Days',
          subheadline: 'Classgrid verifies documents, builds merit lists, issues PRNs, links fee ledgers, and syncs every dashboard automatically.',
        },
      })
      .commit();

    console.log('Successfully updated Sanity homePage with TurboClassgrid content!');
  } catch (error) {
    console.error('Error updating Sanity:', error);
  }
}

main();
