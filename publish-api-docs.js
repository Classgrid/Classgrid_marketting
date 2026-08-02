const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2023-01-01',
  useCdn: false,
});

const docsDir = path.join(__dirname, 'documentation');

const docsToPublish = [
  // API Reference
  { file: 'auth-api-doc.md',          title: 'Authentication API',              slug: 'authentication-api',       category: 'api-reference' },
  { file: 'org-api-doc.md',           title: 'Organization API',               slug: 'organization-api',         category: 'api-reference' },
  { file: 'billing-api-doc.md',       title: 'Billing API',                    slug: 'billing-api',              category: 'api-reference' },
  { file: 'api-students-faculty-doc.md', title: 'Students & Faculty API',      slug: 'students-faculty-api',     category: 'api-reference' },
  { file: 'api-attendance-doc.md',    title: 'Attendance API',                 slug: 'attendance-api',           category: 'api-reference' },
  { file: 'api-fees-billing-doc.md',  title: 'Fees & Billing API',             slug: 'fees-billing-api',         category: 'api-reference' },
  { file: 'api-exams-marks-doc.md',   title: 'Exams & Marks API',              slug: 'exams-marks-api',          category: 'api-reference' },
  { file: 'api-academics-doc.md',     title: 'Academics API',                  slug: 'academics-api',            category: 'api-reference' },
  { file: 'api-communication-doc.md', title: 'Communication API',              slug: 'communication-api',        category: 'api-reference' },
  { file: 'api-library-doc.md',       title: 'Library API',                    slug: 'library-api',              category: 'api-reference' },
  { file: 'api-organization-doc.md',  title: 'Organization Management API',    slug: 'organization-management-api', category: 'api-reference' },
  // Platform Guides
  { file: 'guide-attendance-doc.md',     title: 'Attendance System',           slug: 'attendance-system',        category: 'platform-guides' },
  { file: 'guide-fees-doc.md',           title: 'Fees & Payment Management',   slug: 'fees-payment-management',  category: 'platform-guides' },
  { file: 'guide-examinations-doc.md',   title: 'Examinations & Results',      slug: 'examinations-results',     category: 'platform-guides' },
  { file: 'guide-admissions-doc.md',     title: 'Admissions & Enrollment',     slug: 'admissions-enrollment',    category: 'platform-guides' },
  { file: 'guide-academics-doc.md',      title: 'Academics & Classrooms',      slug: 'academics-classrooms',     category: 'platform-guides' },
  { file: 'guide-communication-doc.md',  title: 'Communication & Messaging',   slug: 'communication-messaging',  category: 'platform-guides' },
  { file: 'guide-library-doc.md',        title: 'Library Management',          slug: 'library-management',       category: 'platform-guides' },
  { file: 'guide-assignments-doc.md',    title: 'Assignments, Notes & Quizzes',slug: 'assignments-notes-quizzes', category: 'platform-guides' },
  { file: 'guide-leave-holidays-doc.md', title: 'Leave & Holiday Management',  slug: 'leave-holiday-management', category: 'platform-guides' },
  { file: 'guide-support-doc.md',        title: 'Support & Help Desk',         slug: 'support-help-desk',        category: 'platform-guides' },
];

async function publish() {
  let published = 0, skipped = 0, failed = 0;
  
  for (const doc of docsToPublish) {
    const filePath = path.join(docsDir, doc.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`SKIP: ${doc.file} not found`);
      skipped++;
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const docId = `apiDoc-${doc.slug}`;

    try {
      await client.createOrReplace({
        _id: docId,
        _type: 'apiDoc',
        title: doc.title,
        slug: { _type: 'slug', current: doc.slug },
        category: doc.category,
        content: content,
        publishedAt: new Date().toISOString(),
        helpfulCount: 0,
        notHelpfulCount: 0,
      });
      console.log(`✅ ${doc.category} | ${doc.title} → /docs/${doc.slug}`);
      published++;
    } catch (err) {
      console.error(`❌ ${doc.title} — ${err.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Published: ${published} | Skipped: ${skipped} | Failed: ${failed}`);
}

publish();
