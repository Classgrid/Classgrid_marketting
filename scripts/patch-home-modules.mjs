/**
 * patch-home-modules.mjs  — v2 (correct coaching orgs)
 * Run: node scripts/patch-home-modules.mjs
 */
import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    const fp = path.join(process.cwd(), f);
    if (!fs.existsSync(fp)) continue;
    for (const line of fs.readFileSync(fp, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq <= 0) continue;
      const k = t.slice(0, eq).trim();
      const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!(k in process.env)) process.env[k] = v;
    }
  }
}
loadEnv();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a4wk6kp5",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-04-20",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

// Shorthand org combos
const ALL   = ["school","junior-college","engineering","coaching"];
const NO_CO = ["school","junior-college","engineering"];           // no coaching
const JE    = ["junior-college","engineering"];                    // JC + Eng only
const CO    = ["coaching"];                                        // coaching only
const SCO   = ["school","junior-college","coaching"];              // no engineering

const MODULES = [
  // ── ACADEMIC ──────────────────────────────────────────────────────────────
  { title:"Attendance System",            category:"Academic",   color:"from-emerald-500/20", iconColor:"#10b981", href:"/product/modules/smart-attendance",                       orgs:ALL,   description:"Multi-modal student attendance tracking with biometric and GPS support." },
  { title:"Digital Classroom Management", category:"Academic",   color:"from-blue-500/20",    iconColor:"#3b82f6", href:"/product/modules/classroom-hub",                          orgs:ALL,   description:"Centralized virtual classroom platform with class activity streams." },
  { title:"Automated Timetable",          category:"Academic",   color:"from-violet-500/20",  iconColor:"#8b5cf6", href:"/product/modules/automated-timetable",                    orgs:ALL,   description:"Collision-free schedule generation and management for all classes." },
  { title:"Academic Planning Tools",      category:"Academic",   color:"from-cyan-500/20",    iconColor:"#0891b2", href:"/product/modules/academic-planning-tools",                orgs:ALL,   description:"Define organizational curriculum, lesson plans, and academic calendars." },
  { title:"Homework & Assignment",        category:"Academic",   color:"from-indigo-500/20",  iconColor:"#4f46e5", href:"/product/modules/homework-management",                    orgs:ALL,   description:"Complete workflow for distributing, tracking, and grading student assignments." },
  { title:"Student Notes Sharing",        category:"Academic",   color:"from-orange-400/20",  iconColor:"#fb923c", href:"/product/modules/student-notes-sharing",                  orgs:ALL,   description:"Cross-class note sharing and digital study material platform." },
  { title:"Teacher Planner",              category:"Academic",   color:"from-purple-500/20",  iconColor:"#9333ea", href:"/product/modules/teacher-planner",                        orgs:ALL,   description:"Lesson planning, syllabus tracking, and faculty workload management." },
  { title:"Subject Management",           category:"Academic",   color:"from-teal-400/20",    iconColor:"#2dd4bf", href:"/product/modules/subject-management",                     orgs:SCO,   description:"Define, organise, and map subjects to departments, classes, and faculty." },
  { title:"Course Management",            category:"Academic",   color:"from-teal-600/20",    iconColor:"#0d9488", href:"/product/modules/course-management",                      orgs:["engineering"], description:"Engineering curriculum, credit structure, and elective management." },

  // ── ASSESSMENT ─────────────────────────────────────────────────────────────
  { title:"Online Exam Platform",         category:"Assessment", color:"from-red-500/20",     iconColor:"#dc2626", href:"/product/modules/online-exam-proctoring-engine",          orgs:NO_CO, description:"Secure digital examination system with anti-cheat proctoring." },
  { title:"Examination Management",       category:"Assessment", color:"from-rose-500/20",    iconColor:"#e11d48", href:"/product/modules/examination-management",                 orgs:NO_CO, description:"Hall ticket generation, seating arrangements, and exam scheduling." },
  { title:"Interactive Quiz Systems",     category:"Assessment", color:"from-fuchsia-500/20", iconColor:"#c026d3", href:"/product/modules/interactive-quiz-systems",               orgs:["junior-college","engineering","coaching"], description:"Create and publish interactive quizzes, polls, and short-burst assessments." },
  { title:"Grade Entry & Results",        category:"Assessment", color:"from-blue-600/20",    iconColor:"#2563eb", href:"/product/modules/marks-results-sgpa-engine",              orgs:ALL,   description:"Result processing, SGPA/CGPA calculation, and report card generation." },
  { title:"Internal Assessment Tools",   category:"Assessment", color:"from-pink-500/20",    iconColor:"#db2777", href:"/product/modules/internal-assessment-tools",              orgs:["junior-college","engineering","coaching"], description:"Manage internal, weekly, or topic-based recurring assessments." },
  { title:"CET/JEE/NEET Exam Conduction",category:"Assessment", color:"from-orange-500/20",  iconColor:"#ea580c", href:"/product/modules/cet-jee-neet-exam-conduction",           orgs:CO,    description:"Conduct authentic CET, JEE, and NEET pattern examinations with instant scoring." },
  { title:"Past Paper & Mock Tests",      category:"Assessment", color:"from-amber-500/20",   iconColor:"#d97706", href:"/product/modules/past-paper-mock-tests",                  orgs:CO,    description:"AI-powered mock test generation from past papers with rank prediction analytics." },

  // ── MANAGEMENT ─────────────────────────────────────────────────────────────
  { title:"Admission Management",         category:"Management", color:"from-teal-600/20",    iconColor:"#0d9488", href:"/product/modules/enterprise-admission-engine",            orgs:ALL,   description:"End-to-end digital application intake, shortlisting, and enrollment workflow." },
  { title:"Fee Collection System",        category:"Management", color:"from-emerald-600/20", iconColor:"#059669", href:"/product/modules/fee-payments-engine",                    orgs:ALL,   description:"Payment structures, staggered ledgers, payment gateways, and automated remittances." },
  { title:"Staff Leave & Payroll",        category:"Management", color:"from-indigo-400/20",  iconColor:"#818cf8", href:"/product/modules/leave-application-payroll-management",   orgs:ALL,   description:"Staff directories, salary distribution, biometric logging, and leave approval chains." },
  { title:"Canteen Management",           category:"Management", color:"from-red-500/20",     iconColor:"#ef4444", href:"/product/modules/canteen-campus-logistics",               orgs:NO_CO, description:"Cashless meal ordering, daily digital ledgers, and canteen inventory tracking." },
  { title:"Digital Library Management",   category:"Management", color:"from-teal-500/20",    iconColor:"#0f766e", href:"/product/modules/smart-library-volume-management",        orgs:JE,    description:"Book catalogs, digital records, issue tracking, and overdue fine calculations." },
  { title:"Alumni Network",               category:"Management", color:"from-amber-600/20",   iconColor:"#d97706", href:"/product/modules/alumni-network",                         orgs:JE,    description:"Alumni engagement platform, placement tracking, and post-graduation networking." },

  // ── ADVANCED ────────────────────────────────────────────────────────────────
  { title:"AI Assistant",                 category:"Advanced",   color:"from-purple-400/20",  iconColor:"#a855f7", href:"/product/modules/ai-assistant",                          orgs:ALL,   description:"Unified AI module providing study assistance, analytics, and instant query context." },
  { title:"Advanced Analytics",           category:"Advanced",   color:"from-indigo-600/20",  iconColor:"#4f46e5", href:"/product/modules/super-analytics-audit-trails",           orgs:ALL,   description:"Organization-level performance data tracking and reporting across all modules." },
  { title:"Compliance Audit Trails",      category:"Advanced",   color:"from-rose-600/20",    iconColor:"#e11d48", href:"/product/modules/naac-nba-audit-capture-engine",          orgs:JE,    description:"NAAC/NBA accreditation compliance tracking and auto-formatted government audit reports." },
  { title:"Institution Website",          category:"Advanced",   color:"from-sky-600/20",     iconColor:"#0284c7", href:"/product/modules/multi-tenant-website-builder",           orgs:ALL,   description:"Official institution website builder with dynamic pages and admission landing pages." },
  { title:"Digital Certificates",         category:"Advanced",   color:"from-sky-500/20",     iconColor:"#38bdf8", href:"/product/modules/automated-certificate-document-verifier",orgs:ALL,   description:"Secure digital certificate generation, storage, and QR-verified authenticity." },
  { title:"Holiday Management",           category:"Advanced",   color:"from-yellow-500/20",  iconColor:"#eab308", href:"/product/modules/holiday-management",                     orgs:ALL,   description:"Centralized academic calendar and institutional holiday tracking." },
  { title:"Digital ID Cards",             category:"Advanced",   color:"from-lime-500/20",    iconColor:"#65a30d", href:"/product/modules/digital-id-card-campus-identity",        orgs:NO_CO, description:"Scannable QR/Barcode student ID cards for campus entry, library, and exam verification." },
  { title:"Events Management",            category:"Advanced",   color:"from-pink-500/20",    iconColor:"#db2777", href:"/product/modules/events-seminar-booking",                 orgs:NO_CO, description:"Centralized hub for posting, registering, and organizing campus events and seminars." },
  { title:"Feedback System",              category:"Advanced",   color:"from-blue-400/20",    iconColor:"#3b82f6", href:"/product/modules/feedback-system",                        orgs:NO_CO, description:"Scalable student/faculty evaluation forms and anonymous institutional reporting." },
];

async function run() {
  console.log("🔍 Fetching homePage from Sanity...");
  const home = await client.fetch(`*[_type == "homePage"][0]{ _id }`);
  if (!home) { console.error("❌ No homePage found"); process.exit(1); }

  await client.patch(home._id).set({ modules: MODULES }).commit();

  console.log(`✅ Patched ${MODULES.length} modules into Sanity homePage.`);

  // Print per-org count for verification
  const orgs = ["school","junior-college","engineering","coaching"];
  for (const org of orgs) {
    const count = MODULES.filter(m => m.orgs.includes(org)).length;
    console.log(`   ${org}: ${count} modules`);
  }
}
run().catch(console.error);
