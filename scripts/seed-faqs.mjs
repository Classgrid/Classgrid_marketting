/**
 * seed-faqs.mjs
 * Seeds all 32 FAQs from CLASSGRID_FAQ_SYSTEM.md into Sanity.
 * - 12 homepage FAQs (6 left, 6 right columns) → displayPages: ["home", "help-center"]
 * - 20 help center FAQs → displayPages: ["help-center"]
 * 
 * Run: node scripts/seed-faqs.mjs
 */

import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-01",
});

// Helper: convert plain text to a single Portable Text block
function toBlock(text) {
  return [
    {
      _type: "block",
      _key: Math.random().toString(36).slice(2, 10),
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: Math.random().toString(36).slice(2, 10),
          text,
          marks: [],
        },
      ],
    },
  ];
}

// ── 12 HOMEPAGE FAQs ─────────────────────────────────────────────────────────
// First 6 → LEFT column, next 6 → RIGHT column
// displayPages: ["home", "help-center"]

const homeFaqs = [
  // ── LEFT COLUMN (order 1-6) ──
  {
    question: "What happens after an institution starts using Classgrid?",
    answer: "Classgrid is set up around an organization workspace. A super admin provisions the institution, configures its plan and quotas, and connects it to a role-based dashboard. From there, institution admins manage users, departments, admissions, and daily academic operations from their own protected workspace.",
    category: "General",
    homeColumn: "left",
    order: 1,
  },
  {
    question: "Can Classgrid adapt to different institution types?",
    answer: "Yes. The admissions engine includes strategy presets for schools, coaching centers, junior colleges, diploma institutes, and engineering colleges. Each strategy can use different form fields, required documents, authentication methods, ranking rules, seat types, and workflow variants.",
    category: "General",
    homeColumn: "left",
    order: 2,
  },
  {
    question: "How does the online admissions workflow work for candidates?",
    answer: "Candidates open the institution's application link, verify their identity, complete a dynamic admission form, upload required documents, pay the configured registration fee when applicable, and track their application status. The portal updates the journey across stages: draft, applied, under verification, selected, fee pending, confirmed, and enrolled.",
    category: "Admissions",
    homeColumn: "left",
    order: 3,
  },
  {
    question: "Does Classgrid support CET, CAP, and government-reporting workflows?",
    answer: "For engineering and diploma-style admissions, Classgrid includes CET enrollment validation, CET OTP flows, CAP round handling, merit generation, RLA/NOC and upgrade workflows, PRN generation, division allotment, and export routes for reporting formats such as DTE, AICTE, SARAL, and State Board outputs where configured.",
    category: "Admissions",
    homeColumn: "left",
    order: 4,
  },
  {
    question: "How do parents follow an admission application?",
    answer: "The parent tracker lets a parent sign in with the registered phone number and view the student's application progress, document status, waitlist or fee-pending alerts, and final admission details once available. The tracker is separate from the staff dashboard, so families see only the status information intended for them.",
    category: "Admissions",
    homeColumn: "left",
    order: 5,
  },
  {
    question: "What do admins see in the dashboard?",
    answer: "Admins see role-specific dashboards. Organization admins see institution totals, enrollment trends, role distribution, branch distribution, and activity. Admission teams see funnel metrics, category distribution, document status, fee collection, merit rounds, seat matrix data, recent applications, and CET-specific indicators when enabled. Department dashboards exist for fees, exams, library, attendance, HR, hostel, and transport workflows.",
    category: "Dashboard",
    homeColumn: "left",
    order: 6,
  },

  // ── RIGHT COLUMN (order 1-6) ──
  {
    question: "How does pricing and billing work?",
    answer: "Classgrid uses configurable organization billing rather than a fixed public price table. A super admin can manage plan status, expiry, maximum students, maximum faculty, storage limits, base monthly pricing, per-student pricing, and per-GB storage pricing. Razorpay checkout and payment verification are wired for platform subscription payments.",
    category: "Billing",
    homeColumn: "right",
    order: 1,
  },
  {
    question: "Which integrations are already wired into Classgrid?",
    answer: "Classgrid includes integration points for Razorpay payments, Firebase phone authentication and push notifications, Google OAuth and Google APIs, Zoom routes and webhooks, Agora real-time media, Redis and Socket.io real-time events, email providers such as Brevo, Nodemailer, and Resend, MongoDB, Supabase, and AI provider services used by learning and automation features.",
    category: "Integrations",
    homeColumn: "right",
    order: 2,
  },
  {
    question: "How does Classgrid handle security and privacy?",
    answer: "Classgrid uses role-based route protection, organization-scoped access, JWT authentication with httpOnly cookies, trusted-device verification, password reset tokens, user and organization status checks, maintenance and global-lock safeguards, Helmet security headers, CORS rules for configured domains, and super admin areas for GDPR/privacy, audit, activity, and backup operations.",
    category: "Security",
    homeColumn: "right",
    order: 3,
  },
  {
    question: "Is Classgrid designed for heavy admission periods?",
    answer: "The admissions API includes server-side search and pagination, route-specific rate limits, cached live merit endpoints, OTP rate limiting, metrics middleware, background workers, and real-time infrastructure through Redis and Socket.io. Candidate document uploads are constrained by type and size, which helps keep admission processing predictable during peak periods.",
    category: "Performance",
    homeColumn: "right",
    order: 4,
  },
  {
    question: "What do students and faculty use after logging in?",
    answer: "Students and faculty receive role-specific workspaces with launchers for academic and campus modules including class work, assignments, internal tests, attendance, curriculum, certificates, leave, events, results, feedback, timetables, examinations, quizzes, Classgrid AI, library, fees, hostel, canteen, notes marketplace, alumni, profile, live classes, and analytics — depending on role and configuration.",
    category: "Dashboard",
    homeColumn: "right",
    order: 5,
  },
  {
    question: "What support tools are built into the platform?",
    answer: "Classgrid includes support ticket routes, a super admin ticket queue, helpdesk thread APIs, platform feedback and reviews areas, announcements, changelog pages, notifications, and operational tools for super admins. Institutions can use these surfaces to report issues, track status, and keep users informed.",
    category: "Support",
    homeColumn: "right",
    order: 6,
  },
];

// ── 20 HELP CENTER FAQs ───────────────────────────────────────────────────────
// displayPages: ["help-center"] only

const helpCenterFaqs = [
  // Getting Started
  {
    question: "How do I onboard a new institution in Classgrid?",
    answer: "Start from the super admin organization area. Create or open the organization record, confirm the institution details, plan status, student and faculty limits, storage quota, billing configuration, and organization admin access. After the admin account is active, the institution admin can enter the dashboard and begin configuring departments, admissions, users, and daily modules.",
    category: "Getting Started",
  },
  {
    question: "What should be configured before opening the admission portal?",
    answer: "Before publishing the admission portal, configure the admission strategy, portal status, application cutoff date, registration fee, document verification requirement, PRN generation, credential dispatch, seat matrix policy, merit list settings, waitlist behavior, fee deadline, and applicant instructions. Engineering and diploma strategies should also confirm CET imports, CAP round settings, ranking behavior, RLA/NOC rules, and government export requirements.",
    category: "Getting Started",
  },
  // Account and Authentication
  {
    question: "Which login page should each user use?",
    answer: "Students and faculty use the role-aware institution login flow. Institution admins use the admin login. Platform operators use the super admin login. The frontend also supports forgot-password and reset-password pages, and protected routes redirect users to the correct dashboard based on their role and organization context.",
    category: "Account & Authentication",
  },
  {
    question: "Why am I being asked to verify a new device?",
    answer: "Classgrid can challenge new or untrusted devices with an email OTP. This protects accounts when login activity comes from a device the platform has not seen before. Check the registered email inbox, enter the OTP, and continue. Internal sandbox accounts and trusted devices may bypass this check depending on configuration.",
    category: "Account & Authentication",
  },
  {
    question: "What should I do if password reset does not work?",
    answer: "Use the forgot-password flow from the correct login page and open the latest reset email. Reset tokens are time-limited, so request a fresh email if the link has expired. The new password must pass the platform's strength rules. If an institution admin is activating an account for the first time, use the activation link or activation code flow instead of the normal reset flow.",
    category: "Account & Authentication",
  },
  // Admissions and Candidate Portal
  {
    question: "Why is the candidate portal closed or unavailable?",
    answer: "The portal may be closed because the institution disabled admissions, the cutoff date has passed, the admission configuration is incomplete, or the organization is inactive, suspended, or under maintenance. Institution admins should check portal status, cutoff date, active configuration, and organization plan/status before asking candidates to apply.",
    category: "Admissions",
  },
  {
    question: "Why can a CET candidate not continue after entering an enrollment number?",
    answer: "CET-based flows validate the enrollment number before continuing. If validation fails, check that the CET data import is complete, the enrollment number is entered exactly as issued, the candidate belongs to the configured admission cycle, and the portal strategy is set to the correct engineering or diploma workflow. After validation, the candidate may still need email OTP verification.",
    category: "Admissions",
  },
  {
    question: "What happens when an uploaded document is rejected?",
    answer: "A rejected document remains visible with the rejection reason. The candidate can upload a corrected file if reupload is allowed for that document. Staff should review documents from the verification queue, approve valid files, reject unclear or incorrect files with a useful reason, and only mark the application verified once all required documents are complete.",
    category: "Admissions",
  },
  {
    question: "Can staff enter walk-in applications from the office desk?",
    answer: "The backend includes desk enrollment and admin enrollment routes for staff-assisted admission workflows. Staff can use these flows when a candidate applies in person or when the institution needs to complete an application on behalf of a student, subject to the admission configuration and role permissions.",
    category: "Admissions",
  },
  {
    question: "How do merit lists, waitlists, and fee deadlines work?",
    answer: "Admission teams can generate merit lists, manage rounds, advance admission stages, promote waitlisted candidates, apply fee deadlines, and monitor live seat or merit data where enabled. A candidate may move from applied to verified, selected, fee pending, confirmed, or enrolled depending on document verification, merit rules, seat allocation, and payment status.",
    category: "Admissions",
  },
  {
    question: "How can parents track an application without staff access?",
    answer: "Parents use the parent tracker route and authenticate with the registered phone number. The tracker displays a simplified timeline, document status, and action alerts such as waitlist or fee pending messages. It does not expose staff-only tools such as verification actions, bulk updates, exports, or dashboard analytics.",
    category: "Admissions",
  },
  // Dashboards and Daily Modules
  {
    question: "How do admission staff find a specific application?",
    answer: "Use the All Applications page to search by applicant name, enrollment number, phone number, or email. Staff can also filter by status, browse division or hierarchy views where available, and use server-side pagination for large application sets. Document teams should use the verification queue when the goal is specifically to approve or reject documents.",
    category: "Dashboard Usage",
  },
  {
    question: "What do the fees dashboard numbers mean?",
    answer: "The fees dashboard summarizes total collected, total payable, pending amount, overdue balances, paid/partial/unpaid counts, collection rate, payment mode distribution, daily collection trends, recent transactions, and top defaulters. Stale or missing numbers usually indicate missing fee data, no recent payments, or an API/configuration issue.",
    category: "Dashboard Usage",
  },
  {
    question: "Which department dashboards are available and what do they show?",
    answer: "Exams surfaces upcoming exams, pending results, hall tickets, paper creation, question bank stats, recent exams, and trends. Library shows books, availability, issued/returned/overdue counts, fines, transactions, most-issued books, and defaulters. Attendance, HR, hostel, and transport pages provide dashboards for attendance, leave, payroll, residents, rooms, complaints, and routes.",
    category: "Dashboard Usage",
  },
  // Billing and Payments
  {
    question: "How do I configure subscription rates and quotas for an institution?",
    answer: "Open the organization detail or billing area as a super admin. Configure the plan type, active/demo state, expiry date, maximum students, maximum faculty, storage limit, base monthly price, per-student price, and per-GB storage price. The organization detail page calculates the monthly bill from these values and can launch Razorpay checkout for subscription payment.",
    category: "Payments & Billing",
  },
  {
    question: "What should I check if a Razorpay payment fails?",
    answer: "First confirm that Razorpay keys are configured for the environment and that the organization or admission fee configuration has a valid payable amount. For subscription payments, retry from the organization billing area and verify that the payment verification endpoint receives the Razorpay payment response. For admission payments, confirm the candidate application is in a fee-eligible state and that the fee structure is active.",
    category: "Payments & Billing",
  },
  // Integrations and Notifications
  {
    question: "Which notifications can users receive?",
    answer: "The platform includes notification surfaces in the web app and push notification handling in the Android wrapper. Firebase messaging recognizes types such as assignments, grades, live classes, chat, fees, canteen, exams, and announcements, each with deep links into the relevant area. Email infrastructure is also present for OTPs, password resets, digests, and other transactional messages.",
    category: "Integrations",
  },
  {
    question: "What APIs and webhooks are important for integrations?",
    answer: "Key integration points include Razorpay payment verification, Zoom OAuth and webhook routes, Google OAuth/API integrations, Firebase authentication and push services, Socket.io real-time events, admission public endpoints, support ticket endpoints, and department analytics APIs. If an integration stops working, check environment variables, provider credentials, callback URLs, webhook secrets, and whether the organization is active.",
    category: "API/Webhooks",
  },
  // Security and Troubleshooting
  {
    question: "How is access separated between organizations and roles?",
    answer: "Authenticated users carry role and organization context. Protected routes validate the user's token, status, role, and organization state before allowing access. Client routes and sidebar items are role-aware, so students, faculty, department users, organization admins, and super admins land in different areas and see different navigation options. The platform also includes privacy, GDPR/privacy, backups, audit logs, and content moderation surfaces for operational control.",
    category: "Roles & Permissions",
  },
  {
    question: "What should I check before raising a support request?",
    answer: "For empty or stale dashboards, check whether the user has the correct role, the organization is active, the API endpoint is returning data, and the selected module has live records for the period. If the issue remains, create a support ticket and include the organization name, affected role, module, screenshot, approximate time, and recent action. Super admins can filter tickets by status and priority, inspect replies, and mark tickets resolved.",
    category: "Troubleshooting",
  },
];

// ── Seed function ─────────────────────────────────────────────────────────────
async function upsertFaq(doc) {
  const existing = await sanity.fetch(
    `*[_type == "faqItem" && question == $q][0]._id`,
    { q: doc.question }
  );

  const data = {
    _type: "faqItem",
    question: doc.question,
    answer: toBlock(doc.answer),
    category: doc.category,
    displayPages: doc.displayPages,
    ...(doc.homeColumn ? { homeColumn: doc.homeColumn } : {}),
    ...(doc.order !== undefined ? { order: doc.order } : {}),
  };

  if (existing) {
    await sanity.patch(existing).set(data).commit();
    return "updated";
  } else {
    await sanity.create(data);
    return "created";
  }
}

async function run() {
  console.log("🌱 Seeding FAQs from CLASSGRID_FAQ_SYSTEM.md...\n");

  let created = 0, updated = 0;

  // Homepage FAQs
  console.log("── Homepage FAQs (12) ──");
  for (const faq of homeFaqs) {
    const result = await upsertFaq({ ...faq, displayPages: ["home", "help-center"] });
    const col = faq.homeColumn === "left" ? "L" : "R";
    console.log(`  [${col}${faq.order}] ${result === "created" ? "✅" : "✏️ "} ${faq.question.slice(0, 60)}...`);
    if (result === "created") created++; else updated++;
  }

  // Help Center FAQs
  console.log("\n── Help Center FAQs (20) ──");
  for (const faq of helpCenterFaqs) {
    const result = await upsertFaq({ ...faq, displayPages: ["help-center"] });
    console.log(`  ${result === "created" ? "✅" : "✏️ "} [${faq.category}] ${faq.question.slice(0, 55)}...`);
    if (result === "created") created++; else updated++;
  }

  console.log(`\n${"=".repeat(52)}`);
  console.log(`✅ Done! Created: ${created}  Updated: ${updated}  Total: ${created + updated}`);
  console.log("=".repeat(52));
  console.log("Homepage: 6 left + 6 right columns → displayPages: home + help-center");
  console.log("Help Center: 20 FAQs → displayPages: help-center only");
}

run().catch(console.error);
