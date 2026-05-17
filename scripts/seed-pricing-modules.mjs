import fs from "fs";
import path from "path";
import { createClient } from "@sanity/client";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.replace(/\r\n/g, "\n").split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex <= 0) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    value = value.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

const MASTER_MODULES = [
  // --- ACADEMICS ---
  { name: "Attendance System", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "Users" },
  { name: "Digital Classroom Management", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "BookOpen" },
  { name: "Automated Timetable", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "Calendar" },
  { name: "Academic Planning Tools", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "LayoutDashboard" },
  { name: "Homework / Assignment", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "ClipboardList" },
  { name: "Student Notes Sharing", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "BookOpen" },
  { name: "Teacher Planner", category: "Academics", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "BookOpen" },
  { name: "Course Management", category: "Academics", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "BookOpen" },

  // --- EXAMS & ASSESSMENT ---
  { name: "Online Exam Platform", category: "Assessment", school: "BASIC", coaching: "NONE", college: "BASIC", engineering: "BASIC", icon: "FileText" },
  { name: "Examination Management", category: "Assessment", school: "BASIC", coaching: "NONE", college: "BASIC", engineering: "BASIC", icon: "FileText" },
  { name: "Interactive Quiz Systems", category: "Assessment", school: "NONE", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "Sparkles" },
  { name: "Grade Entry & Results", category: "Assessment", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "FileText" },
  { name: "Internal Assessment Tools", category: "Assessment", school: "NONE", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "FileText" },
  { name: "CET/JEE/NEET Exam Conduction", category: "Assessment", school: "NONE", coaching: "BASIC", college: "NONE", engineering: "NONE", icon: "FileText" },
  { name: "Past Paper & Mock Tests", category: "Assessment", school: "NONE", coaching: "BASIC", college: "NONE", engineering: "NONE", icon: "FileText" },

  // --- MANAGEMENT ---
  { name: "Admission Management", category: "Management", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "Users" },
  { name: "Fee Collection System", category: "Management", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "Wallet" },
  { name: "Staff Leave & Payroll", category: "Management", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "Users" },
  { name: "Digital Library Management", category: "Management", school: "NONE", coaching: "NONE", college: "PREMIUM", engineering: "PREMIUM", icon: "BookOpen" },
  { name: "Canteen Management", category: "Management", school: "BASIC", coaching: "NONE", college: "BASIC", engineering: "BASIC", icon: "Coffee" },
  { name: "Alumni Network", category: "Management", school: "NONE", coaching: "NONE", college: "PREMIUM", engineering: "PREMIUM", icon: "GraduationCap" },

  // --- ADVANCED ---
  { name: "AI Assistant", category: "Advanced", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "Sparkles" },
  { name: "Advanced Analytics", category: "Advanced", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "LayoutDashboard" },
  { name: "Compliance Audit Trails", category: "Advanced", school: "NONE", coaching: "NONE", college: "PREMIUM", engineering: "PREMIUM", icon: "ShieldCheck" },
  { name: "Institution Website", category: "Advanced", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "Briefcase" },
  { name: "Digital Certificates", category: "Advanced", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: "GraduationCap" },
  { name: "Holiday Management", category: "Advanced", school: "BASIC", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "Calendar" },
  { name: "Digital ID Cards", category: "Advanced", school: "BASIC", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "Users" },
  { name: "Events Management", category: "Advanced", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "Calendar" },
  { name: "Feedback System", category: "Advanced", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "MessageSquare" },

  // --- DASHBOARDS ---
  { name: "Admission Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "LayoutDashboard" },
  { name: "Fee Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "Wallet" },
  { name: "Library Management Dashboard", category: "Dashboards", school: "NONE", coaching: "NONE", college: "PREMIUM", engineering: "PREMIUM", icon: "BookOpen" },
  { name: "Student Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "Users" },
  { name: "Faculty Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "Briefcase" },
  { name: "Organization Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "Building2" },
  { name: "Canteen Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "NONE", college: "PREMIUM", engineering: "PREMIUM", icon: "Coffee" },
  { name: "Leave Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: "Users" },
];

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function run() {
  loadEnvFile(path.join(process.cwd(), ".env.local"));
  loadEnvFile(path.join(process.cwd(), ".env"));

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a4wk6kp5";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN in environment.");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-04-20",
    token,
    useCdn: false,
    perspective: "published",
  });

  console.log("Seeding modules to Sanity...");

  for (const m of MASTER_MODULES) {
    const basicTier = [];
    const premiumTier = [];
    const institutionTypes = [];

    const types = ["school", "coaching", "college", "engineering"];
    
    for (const t of types) {
      const val = m[t];
      if (val !== "NONE") {
        institutionTypes.push(t.charAt(0).toUpperCase() + t.slice(1));
      }
      if (val === "BASIC") {
        basicTier.push(t.charAt(0).toUpperCase() + t.slice(1));
        premiumTier.push(t.charAt(0).toUpperCase() + t.slice(1)); // usually if it's in basic, it's also in premium. Or wait, does "PREMIUM" mean "only in premium"? Let's assume if it's in basic, it's included in premium too.
      } else if (val === "PREMIUM") {
        premiumTier.push(t.charAt(0).toUpperCase() + t.slice(1));
      }
    }

    const payload = {
      _id: `module-${slugify(m.name)}`,
      _type: "module",
      title: m.name,
      slug: { _type: "slug", current: slugify(m.name) },
      category: m.category,
      basicTier,
      premiumTier,
      institutionTypes,
      iconSvg: m.icon,
    };

    console.log(`Uploading ${m.name}...`);
    await client.createOrReplace(payload);
  }

  console.log("Done seeding modules.");
}

run().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
