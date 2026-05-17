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

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ════════════════════════════════════════════════════════════
//  3 Help Categories
// ════════════════════════════════════════════════════════════
const CATEGORIES = [
  {
    _id: "helpcat-admin",
    title: "I am an Admin",
    slug: "admin",
    description: "Setup, Billing, Configuration & Reporting.",
    icon: "Shield",
  },
  {
    _id: "helpcat-faculty",
    title: "I am a Teacher",
    slug: "faculty",
    description: "Attendance, Grading, Exams & Timetable.",
    icon: "BookOpen",
  },
  {
    _id: "helpcat-student",
    title: "I am a Student",
    slug: "student",
    description: "Fees, ID Cards, Results & Mobile App.",
    icon: "GraduationCap",
  },
];

// ════════════════════════════════════════════════════════════
//  9 Real Help Articles (3 per category)
// ════════════════════════════════════════════════════════════

// Helper: Build a Portable Text block
function textBlock(text, style = "normal") {
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style,
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2, 10), text, marks: [] }],
    markDefs: [],
  };
}

function boldTextBlock(parts) {
  // parts = [{ text: "Go to ", bold: false }, { text: "Dashboard > Settings", bold: true }, { text: " to begin.", bold: false }]
  return {
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "normal",
    children: parts.map((p) => ({
      _type: "span",
      _key: Math.random().toString(36).slice(2, 10),
      text: p.text,
      marks: p.bold ? ["strong"] : [],
    })),
    markDefs: [],
  };
}

const ARTICLES = [
  // ─────────────── ADMIN ARTICLES ───────────────
  {
    _id: "helpart-admin-fee-setup",
    title: "How to Set Up Fee Collection for Your Institution",
    slug: "how-to-set-up-fee-collection",
    category: { _type: "reference", _ref: "helpcat-admin" },
    summary:
      "Learn how to configure fee categories, assign fee structures to classes, enable online payment gateways, and generate fee receipts — all from the Admin dashboard.",
    content: [
      textBlock("Step 1: Navigate to Fee Management", "h2"),
      boldTextBlock([
        { text: "Log in to your Admin dashboard and go to ", bold: false },
        { text: "Modules > Fee Management", bold: true },
        { text: ". This is where all fee-related configuration lives.", bold: false },
      ]),

      textBlock("Step 2: Create Fee Categories", "h2"),
      textBlock(
        "Fee categories define the types of fees your institution charges. Common examples include Tuition Fee, Lab Fee, Library Fee, Transport Fee, and Hostel Fee."
      ),
      boldTextBlock([
        { text: "Click ", bold: false },
        { text: "Add Category", bold: true },
        { text: ", enter the category name, set the amount, and choose whether it is a one-time or recurring fee.", bold: false },
      ]),

      textBlock("Step 3: Assign Fee Structures to Classes", "h2"),
      textBlock(
        "Once your categories are created, assign them to specific classes or departments. For example, Lab Fee may only apply to Science students while Tuition Fee applies to everyone."
      ),
      boldTextBlock([
        { text: "Go to ", bold: false },
        { text: "Fee Structures > Assign", bold: true },
        { text: ", select the class/department, tick the applicable fee categories, and hit ", bold: false },
        { text: "Save", bold: true },
        { text: ".", bold: false },
      ]),

      textBlock("Step 4: Enable Online Payments", "h2"),
      textBlock(
        "Classgrid supports Razorpay integration for online fee payments. Once enabled, parents and students can pay fees directly from their mobile app or student portal."
      ),
      boldTextBlock([
        { text: "Navigate to ", bold: false },
        { text: "Settings > Payment Gateway", bold: true },
        { text: ", enter your Razorpay API Key and Secret, and toggle the gateway to ", bold: false },
        { text: "Active", bold: true },
        { text: ".", bold: false },
      ]),
    ],
  },
  {
    _id: "helpart-admin-staff-onboarding",
    title: "How to Onboard New Staff Members",
    slug: "how-to-onboard-new-staff-members",
    category: { _type: "reference", _ref: "helpcat-admin" },
    summary:
      "A complete guide to adding faculty and non-teaching staff to Classgrid, assigning roles, and setting up their login credentials.",
    content: [
      textBlock("Step 1: Add a New Staff Member", "h2"),
      boldTextBlock([
        { text: "Go to ", bold: false },
        { text: "Staff Management > Add Staff", bold: true },
        { text: ". Fill in the employee's full name, email address, phone number, department, and designation.", bold: false },
      ]),

      textBlock("Step 2: Assign a Role", "h2"),
      textBlock(
        "Roles determine what a staff member can see and do inside the platform. Classgrid supports roles like Super Admin, Org Admin, Department Head, Faculty, Accountant, Librarian, and more."
      ),
      boldTextBlock([
        { text: "In the ", bold: false },
        { text: "Role Assignment", bold: true },
        { text: " dropdown, select the appropriate role. You can assign multiple roles if a single person handles more than one responsibility.", bold: false },
      ]),

      textBlock("Step 3: Send Login Credentials", "h2"),
      textBlock(
        "Once saved, the system will auto-generate a temporary password. You can either share it manually or click 'Send Invite Email' to have the system email the credentials directly."
      ),
      boldTextBlock([
        { text: "Click ", bold: false },
        { text: "Send Invite", bold: true },
        { text: ". The staff member will receive an email with their login URL, username, and a link to set their own password.", bold: false },
      ]),
    ],
  },
  {
    _id: "helpart-admin-reports",
    title: "How to Generate and Export Institutional Reports",
    slug: "how-to-generate-export-reports",
    category: { _type: "reference", _ref: "helpcat-admin" },
    summary:
      "Understand how to use the Reports module to generate attendance summaries, fee collection reports, exam analytics, and export them as PDF or Excel.",
    content: [
      textBlock("Step 1: Open the Reports Module", "h2"),
      boldTextBlock([
        { text: "From your Admin dashboard, click on ", bold: false },
        { text: "Reports", bold: true },
        { text: " in the sidebar. You will see report categories: Attendance, Fees, Exams, and Custom.", bold: false },
      ]),

      textBlock("Step 2: Select a Report Type", "h2"),
      textBlock(
        "Choose the type of report you need. For example, selecting 'Fee Collection Summary' will show you total fees collected, pending amounts, and defaulters list filtered by class, date range, or payment mode."
      ),

      textBlock("Step 3: Apply Filters", "h2"),
      textBlock(
        "Every report supports date range filters, class/section filters, and department filters. Apply the relevant filters to narrow down your data before generating the report."
      ),

      textBlock("Step 4: Export Your Report", "h2"),
      boldTextBlock([
        { text: "Once the report is generated, click ", bold: false },
        { text: "Export as PDF", bold: true },
        { text: " or ", bold: false },
        { text: "Export as Excel", bold: true },
        { text: ". The file will be downloaded to your device instantly.", bold: false },
      ]),
    ],
  },

  // ─────────────── FACULTY ARTICLES ───────────────
  {
    _id: "helpart-faculty-attendance",
    title: "How to Mark Student Attendance",
    slug: "how-to-mark-student-attendance",
    category: { _type: "reference", _ref: "helpcat-faculty" },
    summary:
      "Step-by-step instructions for marking daily attendance, viewing attendance history, and understanding the color-coded attendance calendar.",
    content: [
      textBlock("Step 1: Open the Attendance Module", "h2"),
      boldTextBlock([
        { text: "From your Faculty dashboard, click ", bold: false },
        { text: "Attendance", bold: true },
        { text: " in the sidebar. Select the class and section you want to mark attendance for.", bold: false },
      ]),

      textBlock("Step 2: Mark Present or Absent", "h2"),
      textBlock(
        "You will see a list of all students in the selected class. By default, all students are marked as Present (green). Tap on a student's name to toggle them to Absent (red) or Late (yellow)."
      ),

      textBlock("Step 3: Submit Attendance", "h2"),
      boldTextBlock([
        { text: "Once you have reviewed the list, click ", bold: false },
        { text: "Submit Attendance", bold: true },
        { text: ". A confirmation popup will appear. Click ", bold: false },
        { text: "Confirm", bold: true },
        { text: " to save. Parents will automatically receive a notification if their child is marked absent.", bold: false },
      ]),

      textBlock("Step 4: View Attendance History", "h2"),
      textBlock(
        "To view past attendance records, click on the Calendar icon at the top right. Green days indicate full attendance, red days indicate absences, and gray days are holidays. You can also export the monthly report from this view."
      ),
    ],
  },
  {
    _id: "helpart-faculty-grading",
    title: "How to Enter Grades and Publish Results",
    slug: "how-to-enter-grades-publish-results",
    category: { _type: "reference", _ref: "helpcat-faculty" },
    summary:
      "Learn how to enter marks for exams, configure grading scales, and publish results so students and parents can view them instantly.",
    content: [
      textBlock("Step 1: Navigate to Exam Results", "h2"),
      boldTextBlock([
        { text: "Go to ", bold: false },
        { text: "Exams > Enter Results", bold: true },
        { text: ". Select the exam (e.g., Mid-Term, Final Exam) and the subject you teach.", bold: false },
      ]),

      textBlock("Step 2: Enter Marks", "h2"),
      textBlock(
        "A spreadsheet-style grid will appear with student names on the left and mark fields on the right. Enter the obtained marks for each student. The system will automatically calculate percentages and grades based on the grading scale configured by your Admin."
      ),

      textBlock("Step 3: Review and Save", "h2"),
      boldTextBlock([
        { text: "After entering all marks, click ", bold: false },
        { text: "Save as Draft", bold: true },
        { text: " if you want to review later, or click ", bold: false },
        { text: "Submit for Review", bold: true },
        { text: " to send it to the department head for approval.", bold: false },
      ]),

      textBlock("Step 4: Publish Results", "h2"),
      textBlock(
        "Once the department head or Admin approves the results, they will be published automatically. Students and parents will receive a notification and can view the results on their dashboard or mobile app."
      ),
    ],
  },
  {
    _id: "helpart-faculty-timetable",
    title: "How to View and Manage Your Timetable",
    slug: "how-to-view-manage-timetable",
    category: { _type: "reference", _ref: "helpcat-faculty" },
    summary:
      "Understand how to access your weekly timetable, check for substitution requests, and sync your schedule with Google Calendar.",
    content: [
      textBlock("Step 1: Access Your Timetable", "h2"),
      boldTextBlock([
        { text: "From your Faculty dashboard, click ", bold: false },
        { text: "My Timetable", bold: true },
        { text: " in the sidebar. You will see your weekly schedule with color-coded subject blocks.", bold: false },
      ]),

      textBlock("Step 2: Check Substitutions", "h2"),
      textBlock(
        "If another faculty member is absent, you may receive a substitution request. These appear as orange-highlighted blocks on your timetable. Click on the block to see the class details, subject, and time slot."
      ),
      boldTextBlock([
        { text: "Click ", bold: false },
        { text: "Accept", bold: true },
        { text: " to confirm the substitution, or ", bold: false },
        { text: "Decline", bold: true },
        { text: " with a reason if you are unavailable.", bold: false },
      ]),

      textBlock("Step 3: Sync with Google Calendar", "h2"),
      boldTextBlock([
        { text: "To sync your Classgrid timetable with Google Calendar, go to ", bold: false },
        { text: "Settings > Calendar Sync", bold: true },
        { text: " and click ", bold: false },
        { text: "Connect Google Account", bold: true },
        { text: ". Once linked, all your classes will appear in your Google Calendar automatically.", bold: false },
      ]),
    ],
  },

  // ─────────────── STUDENT ARTICLES ───────────────
  {
    _id: "helpart-student-fees",
    title: "How to Pay Your Tuition Fees Online",
    slug: "how-to-pay-tuition-fees-online",
    category: { _type: "reference", _ref: "helpcat-student" },
    summary:
      "A quick guide to viewing your fee statement, making online payments via UPI, card, or net banking, and downloading payment receipts.",
    content: [
      textBlock("Step 1: View Your Fee Statement", "h2"),
      boldTextBlock([
        { text: "Log in to your Student portal and go to ", bold: false },
        { text: "Fees > My Fees", bold: true },
        { text: ". You will see a breakdown of all applicable fees: Tuition, Lab, Library, Transport, etc.", bold: false },
      ]),

      textBlock("Step 2: Make a Payment", "h2"),
      boldTextBlock([
        { text: "Click ", bold: false },
        { text: "Pay Now", bold: true },
        { text: " next to the fee you want to pay. You can pay the full amount or a partial amount if installments are enabled by your institution.", bold: false },
      ]),
      textBlock(
        "Choose your payment method: UPI (GPay, PhonePe, Paytm), Debit/Credit Card, or Net Banking. Complete the payment on the secure Razorpay checkout page."
      ),

      textBlock("Step 3: Download Your Receipt", "h2"),
      textBlock(
        "After successful payment, you will see a green confirmation message. A PDF receipt will be generated automatically. You can download it immediately or find it later under Fees > Payment History."
      ),
    ],
  },
  {
    _id: "helpart-student-idcard",
    title: "How to Download Your Digital ID Card",
    slug: "how-to-download-digital-id-card",
    category: { _type: "reference", _ref: "helpcat-student" },
    summary:
      "Access and download your official Classgrid digital identity card with your photo, enrollment number, and institution branding.",
    content: [
      textBlock("Step 1: Go to Your Profile", "h2"),
      boldTextBlock([
        { text: "From your Student dashboard, click on your ", bold: false },
        { text: "Profile", bold: true },
        { text: " icon at the top right, then select ", bold: false },
        { text: "My ID Card", bold: true },
        { text: ".", bold: false },
      ]),

      textBlock("Step 2: Verify Your Details", "h2"),
      textBlock(
        "Your ID card will show your full name, enrollment number, class/department, blood group, and your profile photo. If any detail is incorrect, contact your institution's Admin to update it."
      ),

      textBlock("Step 3: Download or Share", "h2"),
      boldTextBlock([
        { text: "Click ", bold: false },
        { text: "Download as PDF", bold: true },
        { text: " to save it to your device. You can also click ", bold: false },
        { text: "Share", bold: true },
        { text: " to send it via WhatsApp or email. The ID card includes a QR code that institution staff can scan to verify your identity.", bold: false },
      ]),
    ],
  },
  {
    _id: "helpart-student-results",
    title: "How to View Your Exam Results and Report Card",
    slug: "how-to-view-exam-results-report-card",
    category: { _type: "reference", _ref: "helpcat-student" },
    summary:
      "Check your exam scores, view subject-wise performance analytics, and download your official report card as a PDF.",
    content: [
      textBlock("Step 1: Open the Results Section", "h2"),
      boldTextBlock([
        { text: "From your Student dashboard, go to ", bold: false },
        { text: "Exams > My Results", bold: true },
        { text: ". You will see a list of all published exams (Mid-Term, Final, Unit Tests, etc.).", bold: false },
      ]),

      textBlock("Step 2: View Subject-wise Scores", "h2"),
      textBlock(
        "Click on any exam to see your subject-wise marks, grades, and rank. A visual chart will show your performance compared to the class average, helping you identify strong and weak subjects."
      ),

      textBlock("Step 3: Download Your Report Card", "h2"),
      boldTextBlock([
        { text: "To download your official report card, click ", bold: false },
        { text: "Download Report Card", bold: true },
        { text: " at the bottom of the results page. The PDF will include your institution's letterhead, your photo, all subject marks, attendance percentage, and teacher remarks.", bold: false },
      ]),
    ],
  },
];

// ════════════════════════════════════════════════════════════
//  Runner
// ════════════════════════════════════════════════════════════
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

  // 1. Seed Categories
  console.log("\n📂 Creating Help Categories...\n");
  for (const cat of CATEGORIES) {
    const payload = {
      _id: cat._id,
      _type: "helpCategory",
      title: cat.title,
      slug: { _type: "slug", current: cat.slug },
      description: cat.description,
      icon: cat.icon,
    };
    console.log(`  ✅ ${cat.title}`);
    await client.createOrReplace(payload);
  }

  // 2. Seed Articles
  console.log("\n📝 Creating Help Articles...\n");
  for (const art of ARTICLES) {
    const payload = {
      _id: art._id,
      _type: "helpArticle",
      title: art.title,
      slug: { _type: "slug", current: art.slug },
      category: art.category,
      summary: art.summary,
      content: art.content,
    };
    console.log(`  ✅ ${art.title}`);
    await client.createOrReplace(payload);
  }

  console.log("\n🎉 Done! 3 categories + 9 articles published to Sanity.\n");
  console.log("Go to http://localhost:3000/support to see them live!\n");
}

run().catch((error) => {
  console.error("Failed:", error);
  process.exit(1);
});
