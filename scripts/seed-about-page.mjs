import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  apiVersion: '2026-03-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M',
  useCdn: false,
});

async function run() {
  console.log('🚀 Splitting "Today & Beyond" out of normal timeline into Future item...');
  try {
    const result = await client
      .patch('aboutPage')
      .set({
        // Normal timeline stops at Jul 2026
        timeline: [
          {
            _key: 'tl-dec-2025',
            year: 'Dec 2025',
            title: 'Foundation',
            description:
              'Classgrid started on December 25 with a simple vision — creating a digital connection between students and teachers through a secure online classroom portal.',
          },
          {
            _key: 'tl-feb-2026',
            year: 'Feb 2026',
            title: 'Classgrid V2',
            description:
              'Introduced RBAC-based administration, multi-role access systems, and improved management features — evolving beyond a classroom portal into a smarter institutional system.',
          },
          {
            _key: 'tl-jul-2026',
            year: 'Jul 2026',
            title: 'Classgrid V3',
            description:
              '41 integrated modules and the Play Store mobile app launched. Dedicated dashboards for students, faculty, fees, attendance, and department management created a complete ERP ecosystem.',
          },
        ],
        // The Future item is now a separate editable field that ALWAYS renders last
        futureTimelineItem: {
          year: 'Today & Beyond',
          title: 'The Future',
          description:
            'New features, smarter AI-powered systems, and advanced institutional tools are continuously being developed to help every institution move toward a fully digital future.',
        }
      })
      .commit();

    console.log('✅ Updated Sanity document!');
    console.log('   Document ID:', result._id);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

run();
