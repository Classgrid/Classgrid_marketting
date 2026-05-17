export const comparisonContent = [
  { without: "15 disconnected tools", with: "1 unified platform" },
  { without: "₹2,00,000/year on separate subscriptions", with: "₹X/year all-inclusive" },
  { without: "3 days to generate reports", with: "3 seconds with AI" },
  { without: "Manual attendance registers", with: "Face-API auto-recognition" },
];

// ─────────────────────────────────────────────
// CANONICAL MODULE LISTS
// orgs: school | junior-college | engineering | coaching
// ─────────────────────────────────────────────

// Shared core modules (appear on both home page and modules page)
const sharedModules = [
  // Academic
  { title: "Attendance System", description: "Multi-modal student attendance tracking with biometric and GPS support.", category: "Academic", color: "from-emerald-500/20", iconColor: "#10b981", link: "/product/modules/smart-attendance", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Digital Classroom Management", description: "Centralized virtual classroom platform with class activity streams.", category: "Academic", color: "from-blue-500/20", iconColor: "#3b82f6", link: "/product/modules/classroom-hub", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Automated Timetable", description: "Collision-free schedule generation and management for all classes.", category: "Academic", color: "from-violet-500/20", iconColor: "#8b5cf6", link: "/product/modules/automated-timetable", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Academic Planning Tools", description: "Define organizational curriculum, lesson plans, and academic calendars.", category: "Academic", color: "from-cyan-500/20", iconColor: "#0891b2", link: "/product/modules/academic-planning-tools", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Homework & Assignment", description: "Complete workflow for distributing, tracking, and grading student assignments.", category: "Academic", color: "from-indigo-500/20", iconColor: "#4f46e5", link: "/product/modules/homework-management", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Student Notes Sharing", description: "Cross-class note sharing and digital study material platform.", category: "Academic", color: "from-orange-400/20", iconColor: "#fb923c", link: "/product/modules/student-notes-sharing", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Teacher Planner", description: "Lesson planning, syllabus tracking, and faculty workload management.", category: "Academic", color: "from-purple-500/20", iconColor: "#9333ea", link: "/product/modules/teacher-planner", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Subject Management", description: "Define, organise, and map subjects to departments, classes, and faculty.", category: "Academic", color: "from-teal-400/20", iconColor: "#2dd4bf", link: "/product/modules/subject-management", orgs: ["school", "junior-college", "coaching"] },
  { title: "Course Management", description: "Engineering curriculum, credit structure, and elective management.", category: "Academic", color: "from-teal-600/20", iconColor: "#0d9488", link: "/product/modules/course-management", orgs: ["engineering"] },

  // Assessment
  { title: "Online Exam Platform", description: "Secure digital examination system with anti-cheat proctoring.", category: "Assessment", color: "from-red-500/20", iconColor: "#dc2626", link: "/product/modules/online-exam-proctoring-engine", orgs: ["school", "junior-college", "engineering"] },
  { title: "Examination Management", description: "Hall ticket generation, seating arrangements, and exam scheduling.", category: "Assessment", color: "from-rose-500/20", iconColor: "#e11d48", link: "/product/modules/examination-management", orgs: ["school", "junior-college", "engineering"] },
  { title: "Interactive Quiz Systems", description: "Create and publish interactive quizzes, polls, and short-burst assessments.", category: "Assessment", color: "from-fuchsia-500/20", iconColor: "#c026d3", link: "/product/modules/interactive-quiz-systems", orgs: ["junior-college", "engineering", "coaching"] },
  { title: "Grade Entry & Results", description: "Result processing, SGPA/CGPA calculation, and report card generation.", category: "Assessment", color: "from-blue-600/20", iconColor: "#2563eb", link: "/product/modules/marks-results-sgpa-engine", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Internal Assessment Tools", description: "Manage internal, weekly, or topic-based recurring assessments.", category: "Assessment", color: "from-pink-500/20", iconColor: "#db2777", link: "/product/modules/internal-assessment-tools", orgs: ["junior-college", "engineering", "coaching"] },
  { title: "CET/JEE/NEET Exam Conduction", description: "Conduct authentic CET, JEE, and NEET pattern examinations with instant scoring.", category: "Assessment", color: "from-orange-500/20", iconColor: "#ea580c", link: "/product/modules/cet-jee-neet-exam-conduction", orgs: ["coaching"] },
  { title: "Past Paper & Mock Tests", description: "AI-powered mock test generation from past papers with rank prediction analytics.", category: "Assessment", color: "from-amber-500/20", iconColor: "#d97706", link: "/product/modules/past-paper-mock-tests", orgs: ["coaching"] },
  { title: "AI-Powered Viva", description: "Automated oral assessments using voice AI to evaluate student understanding.", category: "Assessment", color: "from-purple-600/20", iconColor: "#9333ea", link: "/product/modules/ai-powered-viva", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Test Series Management", description: "End-to-end configuration, scheduling, and ranking for large-scale test series.", category: "Assessment", color: "from-rose-600/20", iconColor: "#e11d48", link: "/product/modules/test-series-management", orgs: ["school", "junior-college", "engineering", "coaching"] },

  // Management
  { title: "Admission Management", description: "End-to-end digital application intake, shortlisting, and enrollment workflow.", category: "Management", color: "from-teal-600/20", iconColor: "#0d9488", link: "/product/modules/enterprise-admission-engine", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Fee Collection System", description: "Payment structures, staggered ledgers, payment gateways, and automated remittances.", category: "Management", color: "from-emerald-600/20", iconColor: "#059669", link: "/product/modules/fee-payments-engine", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Staff Leave & Payroll", description: "Staff directories, salary distribution, biometric logging, and leave approval chains.", category: "Management", color: "from-indigo-400/20", iconColor: "#818cf8", link: "/product/modules/leave-application-payroll-management", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Canteen Management", description: "Cashless meal ordering, daily digital ledgers, and canteen inventory tracking.", category: "Management", color: "from-red-500/20", iconColor: "#ef4444", link: "/product/modules/canteen-campus-logistics", orgs: ["school", "junior-college", "engineering"] },
  { title: "Digital Library Management", description: "Book catalogs, digital records, issue tracking, and automated overdue fine calculations.", category: "Management", color: "from-teal-500/20", iconColor: "#0f766e", link: "/product/modules/smart-library-volume-management", orgs: ["junior-college", "engineering"] },
  { title: "Alumni Network", description: "Alumni engagement platform, placement tracking, and post-graduation networking.", category: "Management", color: "from-amber-600/20", iconColor: "#d97706", link: "/product/modules/alumni-network", orgs: ["junior-college", "engineering"] },

  // Advanced
  { title: "AI Assistant", description: "Unified AI module providing study assistance, analytics, and instant query context.", category: "Advanced", color: "from-purple-400/20", iconColor: "#a855f7", link: "/product/modules/ai-assistant", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Advanced Analytics", description: "Organization-level performance data tracking and reporting across all modules.", category: "Advanced", color: "from-indigo-600/20", iconColor: "#4f46e5", link: "/product/modules/super-analytics-audit-trails", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Compliance Audit Trails", description: "NAAC/NBA accreditation compliance tracking and auto-formatted government audit reports.", category: "Advanced", color: "from-rose-600/20", iconColor: "#e11d48", link: "/product/modules/naac-nba-audit-capture-engine", orgs: ["junior-college", "engineering"] },
  { title: "Digital Certificates", description: "Secure digital certificate generation, storage, and QR-verified authenticity.", category: "Advanced", color: "from-sky-500/20", iconColor: "#38bdf8", link: "/product/modules/automated-certificate-document-verifier", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Holiday Management", description: "Centralized academic calendar and institutional holiday tracking.", category: "Advanced", color: "from-yellow-500/20", iconColor: "#eab308", link: "/product/modules/holiday-management", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Digital ID Cards", description: "Scannable QR/Barcode student ID cards for campus entry, library, and exam verification.", category: "Advanced", color: "from-lime-500/20", iconColor: "#65a30d", link: "/product/modules/digital-id-card-campus-identity", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Events Management", description: "Centralized hub for posting, registering, and organizing campus events and seminars.", category: "Advanced", color: "from-pink-500/20", iconColor: "#db2777", link: "/product/modules/events-seminar-booking", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Feedback System", description: "Scalable student/faculty evaluation forms and anonymous institutional reporting.", category: "Advanced", color: "from-blue-400/20", iconColor: "#3b82f6", link: "/product/modules/feedback-system", orgs: ["school", "junior-college", "engineering", "coaching"] },
];

const dashboards = [
  { title: "Admission Management Dashboard", description: "Real-time metrics for applications, conversions, and enrollment stages.", category: "Dashboards", color: "from-slate-500/20", iconColor: "#64748b", link: "/product/modules/admission-dashboard", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Fee Management Dashboard", description: "Financial overview of collections, pending dues, and real-time ledger status.", category: "Dashboards", color: "from-slate-500/20", iconColor: "#64748b", link: "/product/modules/fee-dashboard", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Library Management Dashboard", description: "Insights into catalog circulation, overdue books, and fine collections.", category: "Dashboards", color: "from-slate-500/20", iconColor: "#64748b", link: "/product/modules/library-dashboard", orgs: ["junior-college", "engineering"] },
  { title: "Student Management Dashboard", description: "Holistic view of student attendance, performance, and behavioral trends.", category: "Dashboards", color: "from-slate-500/20", iconColor: "#64748b", link: "/product/modules/student-dashboard", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Faculty Management Dashboard", description: "Overview of teacher workload, syllabus completion, and attendance metrics.", category: "Dashboards", color: "from-slate-500/20", iconColor: "#64748b", link: "/product/modules/faculty-dashboard", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Organization Management Dashboard", description: "Command center for high-level institutional health and cross-branch analytics.", category: "Dashboards", color: "from-slate-500/20", iconColor: "#64748b", link: "/product/modules/organization-dashboard", orgs: ["school", "junior-college", "engineering", "coaching"] },
  { title: "Canteen Management Dashboard", description: "Live tracking of food orders, inventory usage, and daily canteen revenue.", category: "Dashboards", color: "from-slate-500/20", iconColor: "#64748b", link: "/product/modules/canteen-dashboard", orgs: ["school", "junior-college", "engineering"] },
  { title: "Leave Management Dashboard", description: "Centralized approval queue and analytics for staff leave and attendance trends.", category: "Dashboards", color: "from-slate-500/20", iconColor: "#64748b", link: "/product/modules/leave-dashboard", orgs: ["school", "junior-college", "engineering", "coaching"] },
];

const institutionWebsite = {
  title: "Institution Website",
  description: "Official institution website builder with dynamic pages and admission landing pages.",
  category: "Advanced",
  color: "from-sky-600/20",
  iconColor: "#0284c7",
  link: "/product/modules/multi-tenant-website-builder",
  orgs: ["school", "junior-college", "engineering", "coaching"]
};

// Home page excludes Institution Website and Dashboards
export const categorizedModules = [...sharedModules];

// Module Pages / Sidebars include EVERYTHING
export const allPlatformModules = [...sharedModules, institutionWebsite, ...dashboards];

export const coreModules = categorizedModules.slice(0, 9);
export const additionalModules = categorizedModules.slice(9).map(m => m.title);

export const heroContent = { primaryCta: "Book a Demo" };

export const orgTypes = [
  { title: "Schools", subtitle: "K-12", badge: "K12", description: "Comprehensive management for K-12 education.", href: "/solutions/for-schools" },
  { title: "Junior Colleges", subtitle: "FYJC / SYJC", badge: "JRC", description: "Focused workflows for junior colleges.", href: "/solutions/for-jr-colleges" },
  { title: "Engineering", subtitle: "Technical", badge: "ENG", description: "Specialized tools for technical institutes.", href: "/solutions/for-engineering" },
  { title: "Coaching", subtitle: "Test Prep", badge: "COA", description: "Batch and test series management.", href: "/solutions/for-coaching" },
];

export const timelineTabs = [
  {
    id: "school",
    label: "School",
    heading: "For Schools",
    description: "Classgrid connects K-12 students, parents, teachers, office teams, finance, exams, and school leadership into one operating view.",
    features: [],
    rings: [
      ["Students", "Parents"],
      ["Teachers", "Operations Admins", "Finance & Exams"],
      ["Academic Leaders", "Trustees"]
    ]
  },
  {
    id: "college",
    label: "Junior College",
    heading: "For Junior Colleges",
    description: "For FYJC/SYJC junior colleges, Classgrid supports students, parents, lecturers, departments, exams, finance teams, and institutional leadership.",
    features: [],
    rings: [
      ["Students", "Parents"],
      ["Lecturers", "Department Heads", "Finance & Exams"],
      ["Academic Leaders", "Institution Admins"]
    ]
  },
  {
    id: "engineering",
    label: "Engineering",
    heading: "For Engineering",
    description: "For technical institutions, Classgrid connects students, faculty, departments, placements, compliance, academic leadership, and executive oversight.",
    features: [],
    rings: [
      ["Students", "Parents"],
      ["Faculty", "Department Heads", "Placements & Compliance"],
      ["Academic Leaders", "Executive Leadership"]
    ]
  },
  {
    id: "coaching",
    label: "Coaching",
    heading: "For Coaching",
    description: "For coaching institutes, Classgrid brings students, parents, mentors, operations, test series teams, center leadership, and owners into one system.",
    features: [],
    rings: [
      ["Students", "Parents"],
      ["Mentors", "Operations Admins", "Test Series Team"],
      ["Center Leadership", "Owners"]
    ]
  },
];
export const faqContent = [
  { question: { en: "What is Classgrid?" }, answer: { en: "Classgrid is an OS for education." } }
];

export const trustContent = {
  stats: [
    { label: "Institutions", value: 50, suffix: "+" },
    { label: "Students", value: 100000, suffix: "+" },
    { label: "Cities", value: 15, suffix: "+" },
    { label: "Uptime", value: 99, suffix: "%" }
  ]
};

export const integrationsContent = {
  row1: ["AWS", "Google Meet"],
  row2: ["Zoom"]
};
