import { createClient } from '@sanity/client';

const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-04-20",
  useCdn: false,
  token: "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
});

const sharedModules = [
  { title: "Attendance System",             description: "Multi-modal student attendance tracking with biometric and GPS support.",                     category: "Academic",   link: "/product/modules/smart-attendance",                      orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Digital Classroom Management",  description: "Centralized virtual classroom platform with class activity streams.",                          category: "Academic",   link: "/product/modules/classroom-hub",                         orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Automated Timetable",           description: "Collision-free schedule generation and management for all classes.",                           category: "Academic",   link: "/product/modules/automated-timetable",                   orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Academic Planning Tools",       description: "Define organizational curriculum, lesson plans, and academic calendars.",                      category: "Academic",   link: "/product/modules/academic-planning-tools",               orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Homework & Assignment",         description: "Complete workflow for distributing, tracking, and grading student assignments.",               category: "Academic",   link: "/product/modules/homework-management",                   orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Student Notes Sharing",         description: "Cross-class note sharing and digital study material platform.",                               category: "Academic",   link: "/product/modules/student-notes-sharing",                 orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Teacher Planner",               description: "Lesson planning, syllabus tracking, and faculty workload management.",                        category: "Academic",   link: "/product/modules/teacher-planner",                       orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Subject Management",            description: "Define, organise, and map subjects to departments, classes, and faculty.",                    category: "Academic",   link: "/product/modules/subject-management",                    orgs: ["school","junior-college","coaching"] },
  { title: "Course Management",             description: "Engineering curriculum, credit structure, and elective management.",                          category: "Academic",   link: "/product/modules/course-management",                     orgs: ["engineering"] },
  
  { title: "Online Exam Platform",          description: "Secure digital examination system with anti-cheat proctoring.",                              category: "Assessment", link: "/product/modules/online-exam-proctoring-engine",         orgs: ["school","junior-college","engineering"] },
  { title: "Examination Management",        description: "Hall ticket generation, seating arrangements, and exam scheduling.",                         category: "Assessment", link: "/product/modules/examination-management",                orgs: ["school","junior-college","engineering"] },
  { title: "Interactive Quiz Systems",      description: "Create and publish interactive quizzes, polls, and short-burst assessments.",                category: "Assessment", link: "/product/modules/interactive-quiz-systems",              orgs: ["junior-college","engineering","coaching"] },
  { title: "Grade Entry & Results",         description: "Result processing, SGPA/CGPA calculation, and report card generation.",                      category: "Assessment", link: "/product/modules/marks-results-sgpa-engine",             orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Internal Assessment Tools",    description: "Manage internal, weekly, or topic-based recurring assessments.",                              category: "Assessment", link: "/product/modules/internal-assessment-tools",             orgs: ["junior-college","engineering","coaching"] },
  { title: "CET/JEE/NEET Exam Conduction", description: "Conduct authentic CET, JEE, and NEET pattern examinations with instant scoring.",             category: "Assessment", link: "/product/modules/cet-jee-neet-exam-conduction",          orgs: ["coaching"] },
  { title: "Past Paper & Mock Tests",       description: "AI-powered mock test generation from past papers with rank prediction analytics.",            category: "Assessment", link: "/product/modules/past-paper-mock-tests",                 orgs: ["coaching"] },
  { title: "AI-Powered Viva",               description: "Automated oral assessments using voice AI to evaluate student understanding.",                category: "Assessment", link: "/product/modules/ai-powered-viva",                       orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Test Series Management",        description: "End-to-end configuration, scheduling, and ranking for large-scale test series.",              category: "Assessment", link: "/product/modules/test-series-management",                orgs: ["school","junior-college","engineering","coaching"] },

  { title: "Admission Management",          description: "End-to-end digital application intake, shortlisting, and enrollment workflow.",               category: "Management", link: "/product/modules/enterprise-admission-engine",           orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Fee Collection System",         description: "Payment structures, staggered ledgers, payment gateways, and automated remittances.",        category: "Management", link: "/product/modules/fee-payments-engine",                   orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Staff Leave & Payroll",         description: "Staff directories, salary distribution, biometric logging, and leave approval chains.",       category: "Management", link: "/product/modules/leave-application-payroll-management",  orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Canteen Management",            description: "Cashless meal ordering, daily digital ledgers, and canteen inventory tracking.",              category: "Management", link: "/product/modules/canteen-campus-logistics",              orgs: ["school","junior-college","engineering"] },
  { title: "Digital Library Management",    description: "Book catalogs, digital records, issue tracking, and automated overdue fine calculations.",   category: "Management", link: "/product/modules/smart-library-volume-management",       orgs: ["junior-college","engineering"] },
  { title: "Alumni Network",                description: "Alumni engagement platform, placement tracking, and post-graduation networking.",             category: "Management", link: "/product/modules/alumni-network",                        orgs: ["junior-college","engineering"] },
  
  { title: "AI Assistant",                  description: "Unified AI module providing study assistance, analytics, and instant query context.",         category: "Advanced",   link: "/product/modules/ai-assistant",                         orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Advanced Analytics",            description: "Organization-level performance data tracking and reporting across all modules.",              category: "Advanced",   link: "/product/modules/super-analytics-audit-trails",          orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Compliance Audit Trails",       description: "NAAC/NBA accreditation compliance tracking and auto-formatted government audit reports.",     category: "Advanced",   link: "/product/modules/naac-nba-audit-capture-engine",         orgs: ["junior-college","engineering"] },
  { title: "Digital Certificates",          description: "Secure digital certificate generation, storage, and QR-verified authenticity.",               category: "Advanced",   link: "/product/modules/automated-certificate-document-verifier", orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Holiday Management",            description: "Centralized academic calendar and institutional holiday tracking.",                           category: "Advanced",   link: "/product/modules/holiday-management",                    orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Digital ID Cards",              description: "Scannable QR/Barcode student ID cards for campus entry, library, and exam verification.",    category: "Advanced",   link: "/product/modules/digital-id-card-campus-identity",       orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Events Management",             description: "Centralized hub for posting, registering, and organizing campus events and seminars.",        category: "Advanced",   link: "/product/modules/events-seminar-booking",                orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Feedback System",               description: "Scalable student/faculty evaluation forms and anonymous institutional reporting.",             category: "Advanced",   link: "/product/modules/feedback-system",                       orgs: ["school","junior-college","engineering","coaching"] },
];

const dashboards = [
  { title: "Admission Management Dashboard",  description: "Real-time metrics for applications, conversions, and enrollment stages.",          category: "Dashboards", link: "/product/modules/admission-dashboard",     orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Fee Management Dashboard",        description: "Financial overview of collections, pending dues, and real-time ledger status.",    category: "Dashboards", link: "/product/modules/fee-dashboard",           orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Library Management Dashboard",    description: "Insights into catalog circulation, overdue books, and fine collections.",          category: "Dashboards", link: "/product/modules/library-dashboard",       orgs: ["junior-college","engineering"] },
  { title: "Student Management Dashboard",    description: "Holistic view of student attendance, performance, and behavioral trends.",         category: "Dashboards", link: "/product/modules/student-dashboard",       orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Faculty Management Dashboard",    description: "Overview of teacher workload, syllabus completion, and attendance metrics.",       category: "Dashboards", link: "/product/modules/faculty-dashboard",       orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Organization Management Dashboard",description: "Command center for high-level institutional health and cross-branch analytics.",  category: "Dashboards", link: "/product/modules/organization-dashboard",  orgs: ["school","junior-college","engineering","coaching"] },
  { title: "Canteen Management Dashboard",    description: "Live tracking of food orders, inventory usage, and daily canteen revenue.",        category: "Dashboards", link: "/product/modules/canteen-dashboard",       orgs: ["school","junior-college","engineering"] },
  { title: "Leave Management Dashboard",      description: "Centralized approval queue and analytics for staff leave and attendance trends.",  category: "Dashboards", link: "/product/modules/leave-dashboard",         orgs: ["school","junior-college","engineering","coaching"] },
];

const institutionWebsite = { 
  title: "Institution Website", 
  description: "Official institution website builder with dynamic pages and admission landing pages.", 
  category: "Advanced", 
  link: "/product/modules/multi-tenant-website-builder", 
  orgs: ["school","junior-college","engineering","coaching"] 
};

const allModules = [...sharedModules, institutionWebsite, ...dashboards];

async function seedModules() {
  console.log(`Starting seed of ${allModules.length} modules...`);
  
  for (const mod of allModules) {
    const slug = mod.link.split("/").pop();
    
    // We will create the document ID directly from the slug
    // We create them as 'drafts.' first so they don't break the live site immediately,
    // or we can create them live since it's an empty shell anyway. Let's create live.
    const docId = `solutionModule-${slug}`;
    
    const doc = {
      _id: docId,
      _type: 'solutionModule',
      slug: { _type: 'slug', current: slug },
      category: mod.category,
      label: mod.category, // Eyebrow
      headline: mod.title,
      subtitle: mod.description,
      availableFor: mod.orgs,
      lastUpdatedAt: new Date().toISOString(),
      structuredSections: [
        {
          _type: 'object',
          _key: 'intro-section',
          heading: "1. Overview",
          content: [
            {
              _type: 'block',
              _key: 'intro-block',
              style: 'normal',
              children: [
                { _type: 'span', text: "Documentation and features for this module are currently being prepared. Check back soon for detailed information about " + mod.title + ".", _key: 'intro-text' }
              ]
            }
          ]
        }
      ]
    };
    
    try {
      await client.createOrReplace(doc);
      console.log(`✅ Uploaded: ${mod.title} (${slug})`);
    } catch (err) {
      console.error(`❌ Failed to upload ${mod.title}:`, err.message);
    }
  }
  
  console.log("\nDone! All modules seeded to Sanity.");
}

seedModules();
