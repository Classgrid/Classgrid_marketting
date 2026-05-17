import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing Sanity credentials in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  useCdn: false,
  token,
  apiVersion: "2024-03-20",
});

const IMAGE_URLS = {
  admin: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
  teacher: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2064&auto=format&fit=crop",
  student: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop"
};

const createExternalImageBlock = (url) => ({
  _type: "externalImage",
  url: url,
  alt: "Professional Interface View"
});

// Helper to generate 15 steps with 4 images scattered
function generateSteps(title, typeImageUrl) {
  const content = [
    { _type: "block", style: "normal", children: [{ _type: "span", text: `Comprehensive guide for: ${title}. Follow these 15 steps to complete the process securely and efficiently.` }] }
  ];

  for (let i = 1; i <= 15; i++) {
    content.push({ _type: "block", style: "h2", children: [{ _type: "span", text: `Step ${i}: Action Phase ${i}` }] });
    content.push({ _type: "block", style: "normal", children: [{ _type: "span", text: `In this step, navigate to the relevant dashboard section. Ensure all data fields are populated correctly before proceeding to step ${i + 1}. This requires appropriate permissions.` }] });
    
    // Insert images after steps 3, 7, 11, and 15
    if ([3, 7, 11, 15].includes(i)) {
      content.push(createExternalImageBlock(typeImageUrl));
    }
  }

  return content;
}

async function seed() {
  console.log("🚀 Starting Massive Help Center Seed (15 Steps + 4 Images per Article)...\n");

  console.log("🧹 Cleaning up old help articles...");
  await client.delete({ query: '*[_type == "helpArticle"]' });

  const categories = [
    { _id: "category-admin", title: "I am an Admin", description: "Setup, Billing, Config & Reporting.", icon: "Building2" },
    { _id: "category-teacher", title: "I am a Teacher", description: "Attendance, Grading, Exams & Timetable.", icon: "BookOpen" },
    { _id: "category-student", title: "I am a Student", description: "Fees, Quizzes, ID Cards & Materials.", icon: "GraduationCap" }
  ];

  for (const cat of categories) {
    await client.createIfNotExists({ _type: "helpCategory", ...cat });
  }

  const articles = [
    // --- ADMIN ---
    {
      title: "How to Set Up Fee Collection for Your Institution",
      category: { _type: "reference", _ref: "category-admin" },
      summary: "Learn how to configure payment gateways, structure fee components, and track collections in real-time.",
      content: generateSteps("Setting Up Fee Collection", IMAGE_URLS.admin)
    },
    {
      title: "How to Onboard New Staff Members",
      category: { _type: "reference", _ref: "category-admin" },
      summary: "A complete guide to adding new teachers and administrators to the Classgrid platform.",
      content: generateSteps("Onboarding New Staff", IMAGE_URLS.admin)
    },
    {
      title: "How to Generate and Export Institutional Reports",
      category: { _type: "reference", _ref: "category-admin" },
      summary: "Learn how to use the analytics dashboard to generate insights on attendance, fees, and academic performance.",
      content: generateSteps("Generating Institutional Reports", IMAGE_URLS.admin)
    },

    // --- TEACHER ---
    {
      title: "How to Mark Student Attendance",
      category: { _type: "reference", _ref: "category-teacher" },
      summary: "A quick guide to marking daily attendance via the web portal or mobile app.",
      content: generateSteps("Marking Student Attendance", IMAGE_URLS.teacher)
    },
    {
      title: "How to Enter Grades and Publish Results",
      category: { _type: "reference", _ref: "category-teacher" },
      summary: "Learn how to record assignment scores and publish term results.",
      content: generateSteps("Entering Grades and Publishing", IMAGE_URLS.teacher)
    },
    {
      title: "How to View and Manage Your Timetable",
      category: { _type: "reference", _ref: "category-teacher" },
      summary: "Keep track of your classes, free periods, and substitution duties.",
      content: generateSteps("Managing Your Timetable", IMAGE_URLS.teacher)
    },

    // --- STUDENT ---
    {
      title: "How to Pay Your Tuition Fees Online",
      category: { _type: "reference", _ref: "category-student" },
      summary: "A quick guide to viewing your fee statement and making online payments securely.",
      content: generateSteps("Paying Tuition Fees Online", IMAGE_URLS.student)
    },
    {
      title: "How to Download Your Digital ID Card",
      category: { _type: "reference", _ref: "category-student" },
      summary: "Learn how to access and download your official institutional ID.",
      content: generateSteps("Downloading Your Digital ID", IMAGE_URLS.student)
    },
    {
      title: "How to View Your Exam Results and Report Card",
      category: { _type: "reference", _ref: "category-student" },
      summary: "A step-by-step guide to checking your grades and downloading official reports.",
      content: generateSteps("Viewing Exam Results", IMAGE_URLS.student)
    }
  ];

  console.log("\n📝 Creating 9 Massive Articles...");
  for (const article of articles) {
    const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    await client.create({
      _type: "helpArticle",
      title: article.title,
      slug: { _type: "slug", current: slug },
      category: article.category,
      summary: article.summary,
      content: article.content
    });
    console.log(`  ✅ ${article.title}`);
  }

  console.log("\n🎉 Done! Massive image seeding complete.");
  console.log("Go to http://localhost:3000/support to see them live!");
}

seed().catch(console.error);
