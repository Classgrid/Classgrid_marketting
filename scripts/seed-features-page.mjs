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

  // ─── Features Page Document ───────────────────────────────────────────────
  const featuresPageDoc = {
    _id: "featuresPage-singleton",
    _type: "featuresPage",

    heroHeadline: "Built for how institutions actually work.",
    heroSubheadline:
      "From attendance to examinations — every workflow is connected, automated, and purpose-built for the real demands of educational institutions across India.",

    // ── Stats Banner ────────────────────────────────────────────────────────
    stats: [
      { _key: uuid(), number: "41+", label: "Platform Modules" },
      { _key: uuid(), number: "20+", label: "Staff Roles Supported" },
      { _key: uuid(), number: "99.9%", label: "Uptime SLA" },
      { _key: uuid(), number: "< 5 min", label: "Average Setup Time" },
    ],

    // ── Feature Cards (Bento Grid) ──────────────────────────────────────────
    // These are PLATFORM CAPABILITIES — different from module listings
    featureCards: [
      {
        _key: uuid(),
        title: "Real-time Attendance Engine",
        description:
          "Biometric and QR-based auto-attendance with instant SMS and app alerts to parents. Zero manual entry, zero disputes.",
        icon: "Clock",
        accentColor: "emerald",
        size: "large",
      },
      {
        _key: uuid(),
        title: "AI-powered Analytics",
        description:
          "Ask natural language questions about student performance, fee collection trends, and department-level insights.",
        icon: "Brain",
        accentColor: "violet",
        size: "small",
      },
      {
        _key: uuid(),
        title: "Unified Fee Collection",
        description:
          "One-click fee collection via Razorpay and UPI. Installment plans, auto-receipts, and overdue tracking built in.",
        icon: "CreditCard",
        accentColor: "blue",
        size: "small",
      },
      {
        _key: uuid(),
        title: "Smart Timetable Generator",
        description:
          "Auto-generated, clash-free timetables that account for teacher availability, room capacity, and subject loads.",
        icon: "LayoutDashboard",
        accentColor: "amber",
        size: "small",
      },
      {
        _key: uuid(),
        title: "Exam & Result Management",
        description:
          "End-to-end exam lifecycle — hall tickets, seating, mark entry, merit lists, grade sheets, and GR records.",
        icon: "FileText",
        accentColor: "rose",
        size: "small",
      },
      {
        _key: uuid(),
        title: "Parent Communication Hub",
        description:
          "Deliver targeted notifications via SMS, WhatsApp, and in-app push for attendance, fees, results, and announcements.",
        icon: "MessageSquare",
        accentColor: "cyan",
        size: "large",
      },
      {
        _key: uuid(),
        title: "Granular Role-based Access",
        description:
          "20+ pre-built staff roles with department-level permission controls. Every user sees only what they need.",
        icon: "Shield",
        accentColor: "emerald",
        size: "small",
      },
      {
        _key: uuid(),
        title: "Multi-campus Management",
        description:
          "Manage multiple branches, departments, and campuses from a single admin dashboard with consolidated reporting.",
        icon: "Building2",
        accentColor: "blue",
        size: "small",
      },
    ],

    // ── Spotlights ───────────────────────────────────────────────────────────
    spotlights: [
      {
        _key: uuid(),
        eyebrow: "Attendance & Communication",
        title: "Attendance that runs itself.",
        description:
          "Students tap, swipe, or scan — the system does the rest. Classgrid automatically marks attendance, flags absentees, and notifies parents before the first period is over. No manual registers, no end-of-day reconciliation.",
        imagePosition: "right",
        highlights: [
          "Biometric, QR, and manual modes supported",
          "Parent SMS/WhatsApp alerts within seconds",
          "Daily and monthly attendance reports auto-generated",
          "Defaulter lists pushed to class teachers automatically",
        ],
      },
      {
        _key: uuid(),
        eyebrow: "Finance & Fee Management",
        title: "Fee collection, fully automated.",
        description:
          "From generating fee structures to processing Razorpay payments, issuing receipts, and chasing overdue balances — Classgrid handles the entire fee lifecycle without a single spreadsheet.",
        imagePosition: "left",
        highlights: [
          "Razorpay, UPI, and cash payment modes",
          "Auto-generated receipts and ledger entries",
          "Installment plans and scholarship management",
          "Outstanding fee reports per student, class, and campus",
        ],
      },
      {
        _key: uuid(),
        eyebrow: "Examinations & Results",
        title: "From question paper to mark sheet — in one system.",
        description:
          "Classgrid manages your entire examination cycle. Set schedules, allocate rooms, issue hall tickets, collect marks, compute grades, and publish results — all within a single, auditable workflow.",
        imagePosition: "right",
        highlights: [
          "Hall ticket generation and seating allocation",
          "Subject-wise and aggregate mark entry",
          "Customisable grading schemes and merit lists",
          "GR records and result history maintained permanently",
        ],
      },
    ],

    // ── CTA ──────────────────────────────────────────────────────────────────
    ctaHeadline: "See every feature in a live demo.",
    ctaSubtext:
      "Our team will walk you through the platform end-to-end and answer every question specific to your institution.",
    ctaButtonLabel: "Book a Free Demo",
    ctaButtonHref: "/demo",

    seo: {
      metaTitle: "Platform Features | Classgrid",
      metaDescription:
        "Explore the full capabilities of Classgrid — AI analytics, automated attendance, fee collection, smart timetables, exam management, and more. Built for Indian educational institutions.",
    },
  };

  console.log("[features] Uploading Features Page document...");
  await client.createOrReplace(featuresPageDoc);
  console.log("[features] ✅ Features Page seeded successfully!");
  console.log(`  → ${featuresPageDoc.featureCards.length} feature cards`);
  console.log(`  → ${featuresPageDoc.stats.length} stats`);
  console.log(`  → ${featuresPageDoc.spotlights.length} spotlight sections`);
}

run().catch(console.error);
