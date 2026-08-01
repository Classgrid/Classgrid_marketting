require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function toPortableText(text) {
  return [
    {
      _key: Math.random().toString(36).substring(7),
      _type: 'block',
      children: [
        {
          _key: Math.random().toString(36).substring(7),
          _type: 'span',
          marks: [],
          text: text,
        },
      ],
      markDefs: [],
      style: 'normal',
    },
  ];
}

const updates = [
  {
    id: 'siRSXrVH2rEfWhbz4DI9Ih', // What happens after an institution starts using Classgrid?
    answer: "When an institution is onboarded, our guided 8-step setup covers branding, academic structure, and fee configuration. An intuitive dashboard tracks progress in real-time to help you go live quickly."
  },
  {
    id: '3rpjI1abmKeJaJDXiRz40g', // Can Classgrid adapt to different institution types?
    answer: "Absolutely. Classgrid automatically adapts forms, workflows, and reporting for Engineering, Junior Colleges, Schools, Coaching, and Diploma institutes."
  },
  {
    id: '3rpjI1abmKeJaJDXiRz4eM', // How does the online admissions workflow work for candidates?
    answer: "Candidates experience a seamless journey: they register via OTP, fill out customized forms, upload documents, and pay fees securely. They can track their live status until officially enrolled."
  },
  {
    id: 'siRSXrVH2rEfWhbz4DIB1O', // Does Classgrid support CET, CAP, and government-reporting workflows?
    answer: "Yes, government workflows are deeply integrated. Institutions can import allotment data (like CET) and instantly generate compliance-ready export reports for state and national bodies."
  },
  {
    id: '3rpjI1abmKeJaJDXiRz5VG', // How do parents follow an admission application?
    answer: "Parents stay informed through automatic SMS, email, and push notifications at every major step. They can also log into a secure portal to check live application status and fee receipts."
  },
  {
    id: 'siRSXrVH2rEfWhbz4DIBT3', // What do admins see in the dashboard?
    answer: "Organization Admins get a comprehensive view of campus operations. They can manage all students and staff, control billing, and oversee the entire admission pipeline from a single dashboard."
  },
  {
    id: '3rpjI1abmKeJaJDXiRz6JW', // How does pricing and billing work?
    answer: "Classgrid ensures complete financial separation. Student fees flow directly into your institution's integrated payment gateway, while platform subscriptions are managed separately."
  },
  {
    id: 'siRSXrVH2rEfWhbz4DICMN', // Which integrations are already wired into Classgrid?
    answer: "Classgrid ships with out-of-the-box integrations for critical campus needs, including payment gateways, SMS/email providers, virtual meeting platforms like Zoom, and social logins."
  },
  {
    id: 'Lr2L4V22G1FLjwXKIDniJZ', // How does Classgrid handle security and privacy?
    answer: "Security is layered throughout the platform. We employ strict role-based access controls, automated session timeouts, and immutable audit trails to keep your institution's data safe."
  },
  {
    id: 'Lr2L4V22G1FLjwXKIDniYl', // Is Classgrid designed for heavy admission periods?
    answer: "Yes. The platform is engineered to handle massive spikes in traffic during admission seasons, featuring real-time vacancy tracking and instantaneous seat allocation updates."
  },
  {
    id: '3rpjI1abmKeJaJDXiRz7o6', // What do students and faculty use after logging in?
    answer: "Students access a modern dashboard to view timetables, submit assignments, and check results. Faculty use their portal to host live classes, grade assignments, and track attendance."
  },
  {
    id: 'Lr2L4V22G1FLjwXKIDnivY', // What support tools and helpdesk features are built into the platform?
    answer: "Classgrid includes a built-in Support Ticketing System for administrators to get direct help. Conversations are bidirectional with the Classgrid Team to ensure rapid issue resolution."
  }
];

async function main() {
  if (!process.env.SANITY_API_WRITE_TOKEN && !process.env.SANITY_API_TOKEN) {
    console.error("Missing SANITY_API_WRITE_TOKEN in .env.local");
    process.exit(1);
  }

  console.log("Starting FAQ update...");
  let count = 0;

  for (const update of updates) {
    try {
      await client
        .patch(update.id)
        .set({ answer: toPortableText(update.answer) })
        .commit();
      console.log(`✅ Updated FAQ: ${update.id}`);
      count++;
    } catch (err) {
      console.error(`❌ Failed to update FAQ: ${update.id}`, err.message);
    }
  }

  console.log(`\n🎉 Completed! Successfully updated ${count}/${updates.length} FAQs.`);
}

main();
