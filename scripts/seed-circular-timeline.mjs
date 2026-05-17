import { createClient } from "@sanity/client";
import fs from "node:fs";
import path from "node:path";

function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const fullPath = path.join(process.cwd(), file);
    if (!fs.existsSync(fullPath)) continue;

    for (const line of fs.readFileSync(fullPath, "utf8").split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const equalsIndex = trimmed.indexOf("=");
      if (equalsIndex <= 0) continue;

      const key = trimmed.slice(0, equalsIndex).trim();
      const value = trimmed.slice(equalsIndex + 1).trim().replace(/^["']|["']$/g, "");
      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a4wk6kp5";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token =
  process.env.SANITY_API_WRITE_TOKEN ||
  process.env.SANITY_WRITE_TOKEN ||
  process.env.SANITY_TOKEN ||
  process.env.SANITY_API_TOKEN;

if (!token) {
  throw new Error("Missing SANITY_API_WRITE_TOKEN. Add a write token to .env.local before running this script.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-04-20",
  useCdn: false,
});

const tabs = [
  {
    id: "school",
    label: "School",
    heading: "For Schools",
    description:
      "Classgrid connects K-12 students, parents, teachers, office teams, finance, exams, and school leadership into one operating view.",
    features: [],
    rings: [
      ["Students", "Parents"],
      ["Teachers", "Operations Admins", "Finance & Exams"],
      ["Academic Leaders", "Trustees"],
    ],
  },
  {
    id: "college",
    label: "Junior College",
    heading: "For Junior Colleges",
    description:
      "For FYJC/SYJC junior colleges, Classgrid supports students, parents, lecturers, departments, exams, finance teams, and institutional leadership.",
    features: [],
    rings: [
      ["Students", "Parents"],
      ["Lecturers", "Department Heads", "Finance & Exams"],
      ["Academic Leaders", "Institution Admins"],
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    heading: "For Engineering",
    description:
      "For technical institutions, Classgrid connects students, faculty, departments, placements, compliance, academic leadership, and executive oversight.",
    features: [],
    rings: [
      ["Students", "Parents"],
      ["Faculty", "Department Heads", "Placements & Compliance"],
      ["Academic Leaders", "Executive Leadership"],
    ],
  },
  {
    id: "coaching",
    label: "Coaching",
    heading: "For Coaching",
    description:
      "For coaching institutes, Classgrid brings students, parents, mentors, operations, test series teams, center leadership, and owners into one system.",
    features: [],
    rings: [
      ["Students", "Parents"],
      ["Mentors", "Operations Admins", "Test Series Team"],
      ["Center Leadership", "Owners"],
    ],
  },
];

const roles = [
  {
    roleKey: "Students",
    title: "Student Workspace",
    badge: "System Connected",
    desc: "Personal academics, services, fees, exams, and updates.",
    tooltip: "View learning, fees, exams",
    features: ["Timetable, attendance, assignments", "Results, fees, certificates, ID", "Library, notes, exams, feedback"],
    stats: ["Own-record visibility", "Mobile-first academic flow", "No cross-student data exposure"],
    metric: "Result: clearer student accountability",
    theme: "blue",
  },
  {
    roleKey: "Parents",
    title: "Parent Tracker",
    badge: "System Connected",
    desc: "Child-specific visibility for admissions, attendance, fees, and updates.",
    tooltip: "Track child progress",
    features: ["Admission status and documents", "Attendance and fee alerts", "Parent-scoped child visibility"],
    stats: ["Child-only data boundary", "Fewer office follow-ups", "Clearer family communication"],
    metric: "Result: stronger parent trust",
    theme: "blue",
  },
  {
    roleKey: "Teachers",
    title: "Teacher Workspace",
    badge: "System Connected",
    desc: "Classroom delivery for teachers and class teachers without manual follow-up.",
    tooltip: "Run daily classroom work",
    features: ["Attendance, homework, assignments", "Class teacher coordination", "Student and parent communication"],
    stats: ["Assigned-class access", "Faster daily updates", "Better homework visibility"],
    metric: "Result: less manual teaching admin",
    theme: "emerald",
  },
  {
    roleKey: "Operations Admins",
    title: "Operations Admin Workspace",
    badge: "System Connected",
    desc: "A shared operating layer for admission, attendance, HR, transport, library, canteen, and support teams.",
    tooltip: "Coordinate campus operations",
    features: ["Admission officers, front office, HR", "Attendance, transport, library, canteen", "Announcements, records, follow-ups"],
    stats: ["Less department switching", "Cleaner operational handoffs", "Role-aware access control"],
    metric: "Result: smoother daily administration",
    theme: "emerald",
  },
  {
    roleKey: "Finance & Exams",
    title: "Finance & Exams Workspace",
    badge: "System Connected",
    desc: "Critical fee, payment, examination, marks, hall ticket, and result workflows in one controlled layer.",
    tooltip: "Control fees and exams",
    features: ["Accountants and fees clerks", "Exam controllers and result teams", "Receipts, hall tickets, marks, reports"],
    stats: ["Stronger collection visibility", "Cleaner result cycles", "Fewer manual spreadsheets"],
    metric: "Result: trusted finance and exam operations",
    theme: "fuchsia",
  },
  {
    roleKey: "Academic Leaders",
    title: "Academic Leadership Console",
    badge: "System Connected",
    desc: "Principals, vice principals, headmasters, deans, and senior academic leaders get decision-ready visibility.",
    tooltip: "Monitor academic health",
    features: ["Attendance and academic progress", "Faculty, syllabus, and department signals", "Admissions, results, and compliance view"],
    stats: ["Earlier intervention", "Leadership-ready reporting", "Clear academic accountability"],
    metric: "Result: sharper academic governance",
    theme: "fuchsia",
  },
  {
    roleKey: "Trustees",
    title: "Trustee Board",
    badge: "System Connected",
    desc: "High-level institution performance and investment visibility.",
    tooltip: "Review leadership metrics",
    features: ["Admissions and fees overview", "Growth and operations signals", "Institution-level dashboards"],
    stats: ["Better fiscal visibility", "Leadership-ready metrics", "Less dependency on manual reports"],
    metric: "Result: informed oversight",
    theme: "amber",
  },
  {
    roleKey: "Lecturers",
    title: "Lecturer Workspace",
    badge: "System Connected",
    desc: "Teaching, attendance, assignments, tests, notes, and student support for junior college.",
    tooltip: "Teach FYJC/SYJC classes",
    features: ["Stream and division teaching", "Internal tests and notes", "Attendance and grading"],
    stats: ["Assigned-class focus", "Board-prep support", "Clear student updates"],
    metric: "Result: structured FYJC/SYJC teaching",
    theme: "emerald",
  },
  {
    roleKey: "Department Heads",
    title: "Department Head Console",
    badge: "System Connected",
    desc: "HODs and department leads monitor academic health across teams, branches, streams, and programs.",
    tooltip: "Monitor departments",
    features: ["HOD and department oversight", "Faculty activity and syllabus progress", "Internal assessment and student risk signals"],
    stats: ["Branch-wise visibility", "Earlier intervention", "Cleaner department reporting"],
    metric: "Result: stronger department control",
    theme: "fuchsia",
  },
  {
    roleKey: "Institution Admins",
    title: "Institution Admin Command",
    badge: "System Connected",
    desc: "Org admins and senior administrators manage users, modules, hierarchy, reporting, and operating permissions.",
    tooltip: "Control tenant operations",
    features: ["Organization configuration", "User and role management", "Dashboards, exports, and audit visibility"],
    stats: ["Unified operating layer", "Tenant-level control", "Role-based governance"],
    metric: "Result: one admin surface",
    theme: "fuchsia",
  },
  {
    roleKey: "Faculty",
    title: "Faculty Console",
    badge: "System Connected",
    desc: "Academic delivery for classes, labs, assignments, attendance, and grading.",
    tooltip: "Manage academic delivery",
    features: ["Session attendance", "Assignments and internal tests", "Notes and academic planning"],
    stats: ["Assigned-work access", "Faster student feedback", "Less manual consolidation"],
    metric: "Result: more teaching time",
    theme: "emerald",
  },
  {
    roleKey: "Placements & Compliance",
    title: "Placements & Compliance Hub",
    badge: "System Connected",
    desc: "Placement officers, alumni teams, and NBA/NAAC coordinators manage career and evidence workflows.",
    tooltip: "Coordinate outcomes and evidence",
    features: ["TPO and placement activity", "Alumni and career communication", "NBA/NAAC evidence and audit trails"],
    stats: ["Placement-ready visibility", "Cleaner accreditation evidence", "Better department coordination"],
    metric: "Result: stronger outcomes and compliance",
    theme: "amber",
  },
  {
    roleKey: "Executive Leadership",
    title: "Executive Leadership Console",
    badge: "System Connected",
    desc: "Directors, deans, principals, and institutional leaders see performance across academics, finance, admissions, and operations.",
    tooltip: "Review institution health",
    features: ["Institution dashboards", "Admissions and revenue view", "Academic and compliance signals"],
    stats: ["Top-level clarity", "Cross-department trends", "Decision-ready data"],
    metric: "Result: sharper institutional control",
    theme: "amber",
  },
  {
    roleKey: "Mentors",
    title: "Mentor Workspace",
    badge: "System Connected",
    desc: "Coaching mentors, tutors, and instructors manage batches, learning support, practice, and progress.",
    tooltip: "Guide student progress",
    features: ["Batch teaching workflows", "Practice sets and doubt support", "Student progress and reminders"],
    stats: ["Better student follow-through", "Focused mentoring", "Earlier support signals"],
    metric: "Result: more guided learning",
    theme: "emerald",
  },
  {
    roleKey: "Test Series Team",
    title: "Test Series Workspace",
    badge: "System Connected",
    desc: "Mock tests, quiz calendars, attempts, scores, and exam practice cycles for coaching teams.",
    tooltip: "Run test series cycles",
    features: ["Test scheduling", "Online exam coordination", "Results and rank analytics"],
    stats: ["Frequent practice cycles", "Faster score release", "Batch-wise performance insight"],
    metric: "Result: disciplined test culture",
    theme: "fuchsia",
  },
  {
    roleKey: "Center Leadership",
    title: "Center Leadership Command",
    badge: "System Connected",
    desc: "Center heads, directors, and coordinators run branch-level admissions, batches, fees, and academics.",
    tooltip: "Run center operations",
    features: ["Center performance view", "Admissions and fee follow-up", "Mentor and batch oversight"],
    stats: ["Local operating control", "Faster issue response", "Growth clarity"],
    metric: "Result: better center execution",
    theme: "amber",
  },
  {
    roleKey: "Owners",
    title: "Owner Growth Dashboard",
    badge: "System Connected",
    desc: "Owners and org admins track institute growth, revenue, leads, students, fees, tests, and engagement.",
    tooltip: "Track institute growth",
    features: ["Lead and admission analytics", "Fee and revenue visibility", "Student engagement signals"],
    stats: ["Growth dashboard", "Collection health", "Active student trends"],
    metric: "Result: sharper owner visibility",
    theme: "amber",
  },
];

function keyFrom(value) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const document = {
  _id: "circularTimeline",
  _type: "circularTimeline",
  title: "Circular Timeline",
  subtitle: "Homepage orbital stakeholder timeline. Edit tabs, rings, role names, and popup content here.",
  tabs: tabs.map((tab) => ({
    _key: keyFrom(tab.id),
    ...tab,
    rings: tab.rings.map((nodes, index) => ({
      _key: tab.id + "-ring-" + index,
      nodes,
    })),
  })),
  roles: roles.map((role) => ({
    _key: keyFrom(role.roleKey),
    ...role,
  })),
};

const result = await client.createOrReplace(document);

console.log("[sanity] Target: project " + projectId + ", dataset " + dataset);
console.log("[sanity] Upserted " + result._id + " with " + tabs.length + " tabs and " + roles.length + " role popups.");
