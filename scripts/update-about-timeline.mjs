import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

const query = encodeURIComponent('*[_type=="aboutPage"][0]{_id}');
const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;
const res = await fetch(url);
const data = await res.json();
const docId = data.result?._id;

if (!docId) {
  console.error('❌ Could not find aboutPage document');
  process.exit(1);
}

const updatedTimeline = [
  {
    _key: 'tl-dec-2025',
    _type: 'aboutTimelineItem',
    year: 'Dec 2025',
    title: 'Foundation',
    description: 'Classgrid launched on December 25 as an AI-powered intelligent classroom ecosystem. It started as a dedicated Learning Management System (LMS), creating a seamless digital connection between students and faculty.',
    link: 'https://v1.classgrid.in',
    linkLabel: 'Visit Classgrid V1',
  },
  {
    _key: 'tl-feb-2026',
    _type: 'aboutTimelineItem',
    year: 'Feb 2026',
    title: 'Classgrid V2',
    description: 'Introduced RBAC-based administration, multi-role access systems, and improved management features like Smart Attendance. By launching scalable subscription tiers—supporting up to 600 students on the Free plan and 7,500 on Pro—Classgrid evolved beyond a classroom portal into a smarter institutional system.',
    link: 'https://v2.classgrid.in',
    linkLabel: 'Visit Classgrid V2',
  },
  {
    _key: 'tl-jul-2026',
    _type: 'aboutTimelineItem',
    year: 'Jul 2026',
    title: 'Classgrid V3',
    description: '25+ integrated modules and the Play Store mobile app launched. Dedicated dashboards for students, faculty, fees, attendance, and department management created a complete ERP ecosystem.',
  },
];

const updatedFutureItem = {
  _type: 'aboutTimelineItem',
  year: 'Today & Beyond',
  title: 'The Future',
  description: 'New features, smarter AI-powered systems, and advanced institutional tools are continuously being developed to help every institution move toward a fully digital future.',
};

const mutations = [
  {
    patch: {
      id: docId,
      set: {
        timeline: updatedTimeline,
        futureTimelineItem: updatedFutureItem,
      },
    },
  },
];

const mutateUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;
const mutateRes = await fetch(mutateUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ mutations }),
});

const result = await mutateRes.json();

if (mutateRes.ok) {
  console.log('✅ Timeline updated successfully!');
} else {
  console.error('❌ Failed to update timeline:', JSON.stringify(result, null, 2));
}
