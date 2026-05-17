import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@sanity/client";

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

const uuid = () => crypto.randomUUID();

function block(text, style = "normal") {
  return {
    _key: uuid(),
    _type: "block",
    style,
    children: [{ _key: uuid(), _type: "span", text, marks: [] }],
    markDefs: [],
  };
}

async function run() {
  loadEnv();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a4wk6kp5";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN in .env.local");

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-04-20",
    token,
    useCdn: false,
  });

  const modules = [
    {
      _id: "module-student-attendance",
      _type: "module",
      title: "Student Attendance",
      slug: { _type: "slug", current: "student-attendance" },
      subtitle: "Automate attendance tracking with biometrics, RFID, and mobile apps.",
      category: "Academics",
      basicTier: ["School", "College", "Coaching", "Engineering"],
      premiumTier: ["School", "College", "Coaching", "Engineering"],
      institutionTypes: ["School", "College", "Coaching", "Engineering"],
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fingerprint"><path d="M12 12h.01"/><path d="M22 12A10 10 0 0 0 12 2a10 10 0 0 0-10 10"/><path d="M12 6a6 6 0 0 0-6 6"/><path d="M17 17v-5a5 5 0 0 0-10 0v5"/><path d="M14.5 17A2.5 2.5 0 0 0 12 14.5a2.5 2.5 0 0 0-2.5 2.5"/><path d="M2 17a10 10 0 0 0 20 0"/></svg>`,
      headline: "Never lose a minute tracking attendance.",
      body: [
        block("Tracking student attendance manually takes up valuable teaching time and leaves room for errors. Classgrid’s Student Attendance module automates the entire process, whether you use biometrics, RFID cards, or our dedicated mobile app.", "normal"),
        block("Key Benefits", "h3"),
        block("• Save up to 15 minutes of teaching time per class.", "normal"),
        block("• Keep parents informed instantly when students are marked absent.", "normal"),
        block("• Generate 100% accurate compliance reports for university or board submissions.", "normal")
      ],
      capabilities: [
        { _key: uuid(), feature: "Biometric & RFID Integration", description: "Seamlessly integrate with hardware devices for touchless, instant attendance at the gate or classroom." },
        { _key: uuid(), feature: "Instant Parent Alerts", description: "Trigger automated SMS, WhatsApp, or push notifications to parents the moment a student is marked absent." },
        { _key: uuid(), feature: "Subject-wise Tracking", description: "Track attendance for specific lectures, labs, and electives, perfect for higher education." },
        { _key: uuid(), feature: "Defaulter Reports", description: "Automatically generate lists of students falling below required attendance thresholds." }
      ],
      roleExperiences: [
        { _key: uuid(), roleName: "Teachers", description: "Mark attendance in under 10 seconds using the mobile app. No paper registers needed." },
        { _key: uuid(), roleName: "Parents", description: "Get peace of mind with instant entry/exit notifications." },
        { _key: uuid(), roleName: "Administrators", description: "View campus-wide attendance trends and identify chronic absenteeism early." }
      ],
      marketing: {
        headline: "The smartest way to manage student attendance.",
        body: "Eliminate manual roll calls and improve campus security with Classgrid's automated attendance module.",
        highlights: ["Hardware Integration", "Real-time Sync", "Parent Notifications"]
      },
      faqs: [
        { _key: uuid(), question: "Does this work without internet?", description: "Yes, the mobile app supports offline attendance marking and syncs automatically when connected." },
        { _key: uuid(), question: "Which biometric devices are supported?", description: "We support all major Essl, Matrix, and Mantra devices." }
      ]
    },
    {
      _id: "module-fee-management",
      _type: "module",
      title: "Fee Management",
      slug: { _type: "slug", current: "fee-management" },
      subtitle: "Streamline collections, automate receipts, and eliminate overdue balances.",
      category: "Management",
      basicTier: ["School", "College", "Coaching"],
      premiumTier: ["School", "College", "Coaching", "Engineering"],
      institutionTypes: ["School", "College", "Coaching", "Engineering"],
      iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-banknote"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`,
      headline: "Make fee collection 10x faster and 100% transparent.",
      body: [
        block("Collecting fees is often the most stressful operational task for any institution. Our Fee Management module removes the friction by allowing online payments, auto-generating receipts, and sending automated reminders to defaulters.", "normal"),
        block("Key Benefits", "h3"),
        block("• Increase on-time collections by up to 40% with automated reminders.", "normal"),
        block("• Reduce administrative overhead—no more manual ledger entries.", "normal"),
        block("• Provide a smooth, transparent payment experience for parents via Razorpay/UPI.", "normal")
      ],
      capabilities: [
        { _key: uuid(), feature: "Online Payment Gateway", description: "Integrated with Razorpay to accept UPI, Credit/Debit cards, and Net Banking." },
        { _key: uuid(), feature: "Automated Reminders", description: "Send automated SMS and WhatsApp reminders 7 days, 3 days, and 1 day before the due date." },
        { _key: uuid(), feature: "Dynamic Fee Structures", description: "Create complex fee structures with varying installments, late fees, and transport zones." },
        { _key: uuid(), feature: "Scholarship & Concession Mapping", description: "Easily apply category-based or merit-based fee concessions at the time of admission." }
      ],
      roleExperiences: [
        { _key: uuid(), roleName: "Accounts Team", description: "Reconcile daily collections across cash, cheque, and online modes instantly." },
        { _key: uuid(), roleName: "Parents", description: "Pay fees securely from their phone and instantly download PDF receipts." },
        { _key: uuid(), roleName: "Management", description: "Get a real-time dashboard of collected vs. projected revenue." }
      ],
      marketing: {
        headline: "End-to-end financial control.",
        body: "Simplify your institution's finances with automated fee collection, instant receipts, and powerful reporting.",
        highlights: ["UPI/Razorpay Ready", "Auto Reminders", "Detailed Ledgers"]
      },
      faqs: [
        { _key: uuid(), question: "Can we collect fees in installments?", description: "Yes, you can configure flexible installment plans per course or standard." },
        { _key: uuid(), question: "Are receipts generated automatically?", description: "Yes, PDF receipts are generated and emailed instantly upon payment." }
      ]
    }
  ];

  console.log("[modules] Uploading 2 Modules...");
  for (const module of modules) {
    await client.createOrReplace(module);
    console.log(`✅ Uploaded: ${module.title}`);
  }
  console.log("🎉 Successfully seeded modules!");
}

run().catch(console.error);
