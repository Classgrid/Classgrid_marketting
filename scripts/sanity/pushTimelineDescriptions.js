require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Latest timeline data from draft_timeline.md
const UPDATED_TIMELINE = [
  {
    _type: 'aboutTimelineItem',
    _key: 'foundation',
    year: 'Dec 2025',
    title: 'Foundation',
    description: 'Classgrid launched on December 25 as an AI-powered intelligent classroom ecosystem. It started as a dedicated Learning Management System (LMS), creating a seamless digital connection between students and faculty.',
    link: 'https://v1.classgrid.in',
  },
  {
    _type: 'aboutTimelineItem',
    _key: 'v2',
    year: 'Feb 2026',
    title: 'Classgrid V2',
    description: 'Introduced RBAC-based administration, multi-role access systems, and improved management features like Smart Attendance. By launching scalable subscription tiers\u2014supporting up to 600 students on the Free plan and 7,500 on Pro\u2014Classgrid evolved beyond a classroom portal into a smarter institutional system.',
    link: 'https://v2.classgrid.in',
  },
  {
    _type: 'aboutTimelineItem',
    _key: 'v3',
    year: 'Jul 2026',
    title: 'Classgrid V3',
    description: '25+ integrated modules and the Play Store mobile app launched. Dedicated dashboards for students, faculty, fees, attendance, and department management created a complete ERP ecosystem.',
  },
];

const UPDATED_FUTURE_ITEM = {
  _type: 'aboutTimelineItem',
  _key: 'future',
  year: 'Today & Beyond',
  title: 'The Future',
  description: 'New features, smarter AI-powered systems, and advanced institutional tools are continuously being developed to help every institution move toward a fully digital future.',
};

async function main() {
  try {
    const query = '*[_type == "aboutPage"][0]._id';
    const id = await client.fetch(query);

    if (!id) {
      console.log('No aboutPage document found!');
      return;
    }

    console.log(`Found aboutPage with ID: ${id}`);
    console.log('\nUpdating timeline with draft_timeline.md content...\n');

    UPDATED_TIMELINE.forEach((item) => {
      console.log(`  📝 ${item.year}: ${item.title}`);
      console.log(`     "${item.description.substring(0, 60)}..."`);
      if (item.link) console.log(`     🔗 ${item.link}`);
    });
    console.log(`  📝 ${UPDATED_FUTURE_ITEM.year}: ${UPDATED_FUTURE_ITEM.title}`);
    console.log(`     "${UPDATED_FUTURE_ITEM.description.substring(0, 60)}..."`);

    await client
      .patch(id)
      .set({
        timeline: UPDATED_TIMELINE,
        futureTimelineItem: UPDATED_FUTURE_ITEM,
      })
      .commit();

    console.log('\n✅ Successfully updated all timeline descriptions & links in Sanity!');
  } catch (error) {
    console.error('Error updating Sanity:', error.message);
  }
}

main();
