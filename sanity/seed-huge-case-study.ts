import { createClient } from "@sanity/client";

// This script will be run via:
// npx sanity exec sanity/seed-huge-case-study.ts --with-user-token

async function seed() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  const existingImageIds = [
    "image-db34fe0813c2f0c824fe050db8800761f0e438c5-800x600-jpg"
  ];

  const createImageRef = (id: string) => ({
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: id
    }
  });

  const galleryImages = [];
  for (let i = 0; i < 17; i++) {
    galleryImages.push(createImageRef(existingImageIds[i % existingImageIds.length]));
  }

  const heroImage = createImageRef(existingImageIds[0]);
  const championHeadshot = createImageRef("image-da87c20e500bafc711a447df031c5b3e40594a28-200x300-jpg");

  const bodyImages = [];
  for (let i = 0; i < 6; i++) {
    bodyImages.push(createImageRef(existingImageIds[(i + 5) % existingImageIds.length]));
  }

  const paragraphs = [
    "When managing an educational network of unprecedented scale, the operational complexities grow exponentially. Before implementing a unified system, our 25 campuses were operating in isolation. Each institution had its own idiosyncratic processes for fee collection, attendance tracking, and parent communication. This fragmentation resulted in data silos that made network-wide reporting virtually impossible. Administrators spent countless hours reconciling spreadsheets, dealing with data entry errors, and managing disparate software solutions that refused to integrate. The administrative burden was not only costly but was fundamentally detracting from our core mission of providing high-quality education. We realized that a paradigm shift was necessary—we needed a centralized, robust ERP solution that could handle massive data volumes while remaining flexible enough to accommodate the unique needs of each campus.",
    "The search for the right partner was exhaustive. We evaluated numerous legacy systems and modern startups, but few could demonstrate the capability to deploy across 25 distinct locations simultaneously without causing massive operational disruption. ClassGrid stood out because of its modern architecture, mobile-first approach, and a deep understanding of the Indian educational landscape. We decided on a phased rollout, beginning with the finance module. Fee collection had always been a massive pain point, characterized by long queues during admission season, manual receipt generation, and a high rate of delayed payments. By integrating ClassGrid's automated fee collection system with our existing payment gateways, we fundamentally transformed this process.",
    "The results in the finance department were immediate and staggering. Within the first semester of deployment, we saw a 40% reduction in late fee payments and a complete elimination of cash-handling errors. Automated reminders via SMS and WhatsApp ensured that parents were always informed about upcoming deadlines, while the real-time dashboard provided our central management team with instantaneous visibility into the financial health of each campus. The reconciliation process, which used to take a team of five accountants two weeks to complete, is now fully automated and instantaneous. This alone saved us thousands of man-hours and significantly improved our cash flow.",
    "Following the success of the finance module, we rapidly deployed the attendance and communication modules. The traditional method of taking attendance on paper and manually updating it in a system at the end of the day was slow and prone to errors. With ClassGrid, faculty members now use a dedicated mobile app to mark attendance in seconds. This data is instantly synced to the cloud, allowing administrators to monitor absentee trends in real-time. Moreover, if a student is marked absent, an automated alert is immediately sent to their parents. This proactive approach has not only improved student attendance rates by 15% across the network but has also fostered a stronger sense of trust and transparency with parents.",
    "Beyond the operational improvements, the most profound impact of the ClassGrid deployment has been the democratization of data. For the first time in our institution's history, we have a unified, real-time view of our entire network. Our central management can now drill down into granular data—from the financial performance of a specific campus to the attendance record of an individual student—with just a few clicks. These insights are driving strategic decision-making, allowing us to allocate resources more effectively, identify at-risk students earlier, and optimize our academic programs. The transition was not without its challenges; training thousands of staff members required a concerted effort, but the intuitive nature of the ClassGrid platform made the learning curve surprisingly shallow.",
    "Looking ahead, we view ClassGrid not just as a software vendor, but as a strategic partner in our ongoing digital transformation. The platform has provided us with a rock-solid foundation upon which we can build future innovations. We are currently exploring the integration of advanced learning management tools and AI-driven analytics to further personalize the educational experience for our students. The scale of this deployment—25 campuses, tens of thousands of students, and millions of data points—serves as a definitive proof of concept for the power of a truly unified educational ecosystem. It has proven that with the right technology, even the most complex and sprawling networks can achieve unprecedented levels of efficiency, transparency, and excellence."
  ];

  const doc = {
    _type: 'caseStudy',
    title: 'Transforming Education at Scale with 25 Campuses',
    slug: { _type: 'slug', current: 'transforming-education-at-scale-massive' },
    clientName: 'Global Education Trust',
    year: '2025',
    institutionType: 'college',
    category: 'automation',
    modules: ['finance', 'attendance', 'communication', 'reports'],
    summary: 'A massive deployment across 25 campuses resulting in unprecedented automation and efficiency. This case study explores the depth of the integration, highlighting significant improvements in fee recovery, attendance tracking, and centralized reporting.',
    heroImage: heroImage,
    metrics: [
      { _key: '1', value: '25', suffix: '+', label: 'Campuses' },
      { _key: '2', value: '100', suffix: '%', label: 'Automated' },
      { _key: '3', value: '10', suffix: 'x', label: 'ROI' },
    ],
    championName: 'Dr. Robert Jenkins',
    championRole: 'Chief Technology Officer',
    championHeadshot: championHeadshot,
    championQuote: 'ClassGrid has fundamentally changed how we operate our institutions. The scale of automation is staggering, and the depth of data insights has allowed us to make strategic decisions that were previously impossible. It is, without a doubt, the most significant technological upgrade in our history.',
    body: [
      {
        _type: 'block',
        _key: 'b1',
        style: 'h2',
        children: [{ _type: 'span', _key: 's1', text: 'The Challenge of Unprecedented Scale' }]
      },
      {
        _type: 'block',
        _key: 'b2',
        style: 'normal',
        children: [{ _type: 'span', _key: 's2', text: paragraphs[0] }]
      },
      bodyImages[0],
      {
        _type: 'block',
        _key: 'b3',
        style: 'h3',
        children: [{ _type: 'span', _key: 's3', text: 'Evaluating and Selecting the Right Partner' }]
      },
      {
        _type: 'block',
        _key: 'b4',
        style: 'normal',
        children: [{ _type: 'span', _key: 's4', text: paragraphs[1] }]
      },
      bodyImages[1],
      {
        _type: 'block',
        _key: 'b5',
        style: 'h2',
        children: [{ _type: 'span', _key: 's5', text: 'Transforming Financial Operations' }]
      },
      {
        _type: 'block',
        _key: 'b6',
        style: 'normal',
        children: [{ _type: 'span', _key: 's6', text: paragraphs[2] }]
      },
      bodyImages[2],
      {
        _type: 'block',
        _key: 'b7',
        style: 'h2',
        children: [{ _type: 'span', _key: 's7', text: 'Streamlining Attendance and Communication' }]
      },
      {
        _type: 'block',
        _key: 'b8',
        style: 'normal',
        children: [{ _type: 'span', _key: 's8', text: paragraphs[3] }]
      },
      bodyImages[3],
      {
        _type: 'block',
        _key: 'b9',
        style: 'h2',
        children: [{ _type: 'span', _key: 's9', text: 'The Power of Democratized Data' }]
      },
      {
        _type: 'block',
        _key: 'b10',
        style: 'normal',
        children: [{ _type: 'span', _key: 's10', text: paragraphs[4] }]
      },
      bodyImages[4],
      {
        _type: 'block',
        _key: 'b11',
        style: 'h2',
        children: [{ _type: 'span', _key: 's11', text: 'Looking to the Future' }]
      },
      {
        _type: 'block',
        _key: 'b12',
        style: 'normal',
        children: [{ _type: 'span', _key: 's12', text: paragraphs[5] }]
      },
      bodyImages[5]
    ].filter(Boolean),
    galleryImages: galleryImages
  };

  console.log("Creating document in Sanity...");
  try {
    const res = await client.create(doc);
    console.log("Successfully created massive case study!", res._id);
  } catch (error) {
    console.error("Failed to create document:", error);
  }
}

seed().catch(console.error);
