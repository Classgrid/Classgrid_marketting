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

const originalTimeline = [
    {
      "_key": "tl-dec-2025",
      "description": "Classgrid started on December 25 with a simple vision — creating a digital connection between students and teachers through a secure online classroom portal.",
      "title": "Foundation",
      "year": "Dec 2025"
    },
    {
      "_key": "tl-feb-2026",
      "description": "Introduced RBAC-based administration, multi-role access systems, and improved management features — evolving beyond a classroom portal into a smarter institutional system.",
      "title": "Classgrid V2",
      "year": "Feb 2026"
    },
    {
      "_key": "tl-jul-2026",
      "description": "25+  integrated modules and the Play Store mobile app launched. Dedicated dashboards for students, faculty, fees, attendance, and department management created a complete ERP ecosystem.",
      "title": "Classgrid V3",
      "year": "Jul 2026"
    }
  ];

const originalFutureItem = {
    "_type": "aboutTimelineItem",
    "description": "New features, smarter AI-powered systems, and advanced institutional tools are continuously being developed to help every institution move toward a fully digital future.",
    "title": "The Future",
    "year": "Today & Beyond"
  };

const mutations = [
  {
    patch: {
      id: docId,
      set: {
        timeline: originalTimeline,
        futureTimelineItem: originalFutureItem,
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
  console.log('✅ Timeline reverted successfully!');
} else {
  console.error('❌ Failed to revert timeline:');
}
