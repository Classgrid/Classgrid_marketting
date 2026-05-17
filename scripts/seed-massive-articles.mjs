import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

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
  alt: "Classgrid Professional Interface"
});

// Helper to generate rich steps from an array of step titles
function generateRichSteps(intro, stepTitles, imageUrl) {
  const content = [
    { _type: "block", style: "normal", children: [{ _type: "span", text: intro }] }
  ];

  stepTitles.forEach((title, index) => {
    const stepNum = index + 1;
    content.push({ _type: "block", style: "h2", children: [{ _type: "span", text: `Step ${stepNum}: ${title}` }] });
    content.push({ 
      _type: "block", 
      style: "normal", 
      children: [{ 
        _type: "span", 
        text: `To complete this action, navigate to the relevant section in your Classgrid workspace. Ensure you verify the configuration parameters for '${title.toLowerCase()}'. Double-check your inputs against the institutional policies before saving the changes to the database. This guarantees accurate data synchronization across all modules.` 
      }] 
    });
    
    // Insert images after steps 3, 7, 11, and 14
    if ([3, 7, 11, 14].includes(stepNum)) {
      content.push(createExternalImageBlock(imageUrl));
    }
  });

  return content;
}

const ARTICLE_DATA = [
  // --- ADMIN ---
  {
    title: "How to Set Up Fee Collection for Your Institution",
    category: "category-admin",
    summary: "Learn how to configure payment gateways, structure fee components, and track collections in real-time.",
    intro: "Managing institution finances requires precision. Follow this 15-step guide to set up a robust, automated fee collection engine.",
    image: IMAGE_URLS.admin,
    steps: [
      "Access the Financial Dashboard", "Configure the Payment Gateway Webhooks", "Set Up Stripe/Razorpay API Keys",
      "Define General Ledger Categories", "Create Tuition Fee Structures", "Configure Transport & Lab Fees",
      "Set Up Late Fee Penalty Rules", "Map Fee Structures to Academic Batches", "Configure Installment Plans",
      "Review Tax and GST Profiles", "Generate Custom Invoice Templates", "Set Up Automated Email Receipts",
      "Enable Mobile App Payment Links", "Review the Defaulters List Protocol", "Publish the Final Fee Structure"
    ]
  },
  {
    title: "How to Onboard New Staff Members",
    category: "category-admin",
    summary: "A complete guide to adding new teachers and administrators to the Classgrid platform.",
    intro: "Proper staff onboarding ensures secure data access. This guide walks you through identity verification, role assignment, and access provisioning.",
    image: IMAGE_URLS.admin,
    steps: [
      "Open the HR & Directory Module", "Select 'Add New Employee'", "Input Basic Identity Information",
      "Upload Government ID Verification", "Assign the Role (Teacher/Admin)", "Configure Module Access Permissions",
      "Set Up Single Sign-On (SSO) Credentials", "Define Department Hierarchies", "Assign to Specific Classrooms",
      "Input Payroll and Bank Details", "Generate the Digital Staff ID", "Configure RFID/Biometric Sync",
      "Set Up Institutional Email Address", "Review the Onboarding Checklist", "Send the Automated Welcome Email"
    ]
  },
  {
    title: "How to Generate and Export Institutional Reports",
    category: "category-admin",
    summary: "Learn how to use the analytics dashboard to generate insights on attendance, fees, and academic performance.",
    intro: "Data-driven decisions require comprehensive reporting. Learn how to extract, filter, and visualize your institutional data.",
    image: IMAGE_URLS.admin,
    steps: [
      "Navigate to Analytics & Reports", "Select the Data Domain (Academic/Financial)", "Choose the Report Template",
      "Set the Date Range Filters", "Select Specific Batches or Departments", "Configure the Data Columns",
      "Apply Custom Aggregate Functions", "Generate the Interactive Chart View", "Drill Down into Specific Data Points",
      "Save the Custom Report Template", "Schedule Automated Weekly Delivery", "Export the Dataset to CSV",
      "Download the Formatted PDF Report", "Share the Dashboard via Secure Link", "Review the Analytics Audit Log"
    ]
  },

  // --- TEACHER ---
  {
    title: "How to Mark Student Attendance",
    category: "category-teacher",
    summary: "A quick guide to marking daily attendance via the web portal or mobile app.",
    intro: "Tracking attendance securely and swiftly is vital. This guide covers manual entry, biometric syncing, and proxy marking.",
    image: IMAGE_URLS.teacher,
    steps: [
      "Open the Teacher Dashboard", "Navigate to 'My Classes'", "Select the Current Academic Period",
      "Review the Synchronized Biometric Data", "Toggle the 'Mark All Present' Option", "Manually Flag Absent Students",
      "Update Late Arrivals with Timestamps", "Review Approved Leave Requests", "Attach Medical Notes to Records",
      "Submit the Final Register", "Trigger Automated Parent SMS Alerts", "Review the Weekly Attendance Trend",
      "Handle Proxy Attendance for Colleagues", "Lock the Daily Attendance Record", "Generate the Monthly Register PDF"
    ]
  },
  {
    title: "How to Enter Grades and Publish Results",
    category: "category-teacher",
    summary: "Learn how to record assignment scores and publish term results.",
    intro: "The Gradebook module handles complex curves and formulas. Learn how to map rubrics, enter scores, and lock final grades.",
    image: IMAGE_URLS.teacher,
    steps: [
      "Access the Gradebook Module", "Select the Exam Term (Mid-Term/Final)", "Choose the Subject and Batch",
      "Review the Assessment Rubric", "Import Scores via Excel Template", "Manually Enter Individual Marks",
      "Add Qualitative Teacher Remarks", "Apply the Grading Curve (If Applicable)", "Verify the Calculated GPA/Percentage",
      "Identify Failing Students for Support", "Submit Scores for Admin Approval", "Resolve Any Marking Disputes",
      "Lock the Subject Gradebook", "Generate the Draft Report Cards", "Publish Results to the Student Portal"
    ]
  },
  {
    title: "How to View and Manage Your Timetable",
    category: "category-teacher",
    summary: "Keep track of your classes, free periods, and substitution duties.",
    intro: "Your schedule is dynamically linked to the institution's master timetable. Here is how to manage periods, room changes, and substitutions.",
    image: IMAGE_URLS.teacher,
    steps: [
      "Navigate to 'My Schedule'", "View the Weekly Calendar Grid", "Check for Real-Time Room Changes",
      "Review Assigned Substitution Periods", "Accept or Decline Proxy Requests", "Sync Timetable with Google Calendar",
      "View the Integrated Lesson Plan Log", "Check Laboratory Availability", "Request a Room Swap",
      "Notify Students of Class Rescheduling", "View Upcoming Institutional Holidays", "Log Completed Syllabus Topics",
      "Schedule Extra Remedial Classes", "Book the Audio-Visual Room", "Print the Daily Schedule Summary"
    ]
  },

  // --- STUDENT ---
  {
    title: "How to Pay Your Tuition Fees Online",
    category: "category-student",
    summary: "A quick guide to viewing your fee statement and making online payments securely.",
    intro: "The Student Portal allows you to handle your finances transparently. Follow these steps to clear your dues online.",
    image: IMAGE_URLS.student,
    steps: [
      "Log into the Student Portal", "Click on the 'Finances' Tab", "View the Current Fee Statement",
      "Check for Applicable Scholarships", "Review Late Fee Penalties", "Select the 'Pay Now' Option",
      "Choose to Pay Full or Installment", "Select Your Payment Method (Card/UPI)", "Enter Your Billing Details Securely",
      "Complete the OTP Verification", "Wait for the Transaction Success Page", "Download the Digital Fee Receipt",
      "Check the Updated Ledger Balance", "Submit a Transaction Dispute (If Failed)", "Set Up Auto-Pay Reminders"
    ]
  },
  {
    title: "How to Download Your Digital ID Card",
    category: "category-student",
    summary: "Learn how to access and download your official institutional ID.",
    intro: "Your Digital ID is required for library and campus access. Learn how to generate, verify, and save your secure ID.",
    image: IMAGE_URLS.student,
    steps: [
      "Access Your Student Profile", "Navigate to 'Identity & Documents'", "Review Your Encrypted Details",
      "Upload a New Passport Photo", "Submit Photo for Admin Approval", "Wait for Verification Notification",
      "Click 'Generate Digital ID'", "Review the Embedded QR Code", "Check the Expiry Date Validity",
      "Download the High-Res Image", "Add the ID to Apple Wallet", "Add the ID to Google Wallet",
      "Use the ID at Campus Scanners", "Report a Lost or Stolen ID", "Request a Physical Card Print"
    ]
  },
  {
    title: "How to View Your Exam Results and Report Card",
    category: "category-student",
    summary: "A step-by-step guide to checking your grades and downloading official reports.",
    intro: "Once published by the faculty, your academic results are instantly available. Here is how to analyze your performance.",
    image: IMAGE_URLS.student,
    steps: [
      "Navigate to 'Academics'", "Select the 'My Results' Tab", "Choose the Academic Year and Term",
      "View the Subject-Wise Grade Breakdown", "Check Your Overall GPA/Percentage", "Review Teacher Qualitative Feedback",
      "Analyze the Class Average Comparison Chart", "Check the Minimum Passing Thresholds", "View Your Attendance Correlation",
      "Request a Re-evaluation (If Needed)", "Pay the Re-evaluation Fee", "Click 'Download Official Report Card'",
      "Verify the Digital Signature", "Share the PDF with Parents/Guardians", "Review the Academic Probation Policy"
    ]
  }
];

async function seed() {
  console.log("🚀 Starting MASSIVE Help Center Seed (15 Rich Steps + 4 Images per Article)...\n");

  console.log("🧹 Cleaning up old help articles and categories...");
  await client.delete({ query: '*[_type in ["helpArticle", "helpCategory"]]' });

  const categories = [
    { _id: "category-admin", title: "I am an Admin", description: "Setup, Billing, Config & Reporting.", icon: "Building2" },
    { _id: "category-teacher", title: "I am a Teacher", description: "Attendance, Grading, Exams & Timetable.", icon: "BookOpen" },
    { _id: "category-student", title: "I am a Student", description: "Fees, Quizzes, ID Cards & Materials.", icon: "GraduationCap" }
  ];

  for (const cat of categories) {
    await client.createIfNotExists({ _type: "helpCategory", ...cat });
  }

  console.log("\n📝 Creating 9 Massive Articles...");
  for (const article of ARTICLE_DATA) {
    const slug = article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    await client.create({
      _type: "helpArticle",
      title: article.title,
      slug: { _type: "slug", current: slug },
      category: { _type: "reference", _ref: article.category },
      summary: article.summary,
      content: generateRichSteps(article.intro, article.steps, article.image)
    });
    console.log(`  ✅ ${article.title} (15 Steps, 4 Images)`);
  }

  console.log("\n🎉 Done! Professional massive seeding complete.");
  console.log("Go to http://localhost:3000/support to see the huge articles live!");
}

seed().catch(console.error);
