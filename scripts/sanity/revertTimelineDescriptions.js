require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const REVERTED_TIMELINE = [
  {
    _type: 'aboutTimelineItem',
    _key: 'foundation',
    year: 'Dec 2025',
    title: 'Foundation',
    description: 'Classgrid started on December 25 with a simple vision — creating a digital connection between students and teachers through a secure online classroom portal.',
    link: 'https://v1.classgrid.in',
  },
  {
    _type: 'aboutTimelineItem',
    _key: 'v2',
    year: 'Feb 2026',
    title: 'Classgrid V2',
    description: 'Introduced RBAC-based administration, multi-role access systems, and improved management features — evolving beyond a classroom portal into a smarter institutional system.',
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

const REVERTED_FUTURE_ITEM = {
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

    await client
      .patch(id)
      .set({
        timeline: REVERTED_TIMELINE,
        futureTimelineItem: REVERTED_FUTURE_ITEM,
      })
      .commit();

    console.log('✅ Successfully reverted timeline descriptions to the EXACT original text in Sanity!');
  } catch (error) {
    console.error('Error updating Sanity:', error.message);
  }
}

main();
