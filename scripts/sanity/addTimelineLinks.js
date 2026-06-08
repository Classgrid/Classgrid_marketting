require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Map of timeline title -> link URL
const TIMELINE_LINKS = {
  'Foundation': 'https://v1.classgrid.in',
  'Classgrid V2': 'https://v2.classgrid.in',
};

async function main() {
  try {
    // Fetch the aboutPage document
    const query = '*[_type == "aboutPage"][0]{ _id, timeline, futureTimelineItem }';
    const doc = await client.fetch(query);

    if (!doc) {
      console.log('No aboutPage document found!');
      return;
    }

    console.log(`Found aboutPage with ID: ${doc._id}`);
    console.log(`Timeline items: ${doc.timeline?.length || 0}`);

    // Update timeline items with links
    if (doc.timeline && doc.timeline.length > 0) {
      const updatedTimeline = doc.timeline.map((item) => {
        const link = TIMELINE_LINKS[item.title];
        if (link) {
          console.log(`  ✅ Adding link to "${item.title}" → ${link}`);
          return { ...item, link };
        }
        console.log(`  ⏭️  No link for "${item.title}" (keeping as-is)`);
        return item;
      });

      await client
        .patch(doc._id)
        .set({ timeline: updatedTimeline })
        .commit();

      console.log('\n✅ Successfully updated timeline links in Sanity!');
    } else {
      console.log('No timeline items found in the document.');
    }
  } catch (error) {
    console.error('Error updating Sanity:', error.message);
  }
}

main();
