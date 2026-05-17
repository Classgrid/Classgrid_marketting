import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-30",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(7)}`;

async function uploadSaasPages() {
  console.log("Starting Sanity upload for SaaS Marketing Pages...");

  try {


    // 2. Upload Compare Hub & Competitor Pages
    console.log("Uploading Compare Hub...");
    await client.createOrReplace({
      _id: "compareHubPage",
      _type: "compareHubPage",
      seoTitle: "Classgrid vs vmedulife and legacy ERP software",
      metaDescription: "Compare Classgrid against legacy school ERP software.",
      heroHeadline: "Compare Classgrid with the platforms institutions are trying to replace",
      heroSubheadline: "Audit our NAAC compliance engine, biometric integrations, and real-time architecture against legacy systems before your next rollout.",
    });

    console.log("Uploading Competitor Page (vmedulife)...");
    await client.createOrReplace({
      _id: "comparison_vmedulife",
      _type: "comparison",
      competitorName: "vmedulife",
      slug: { current: "vmedulife" },
      websiteLink: "https://www.vmedulife.com",
      seoTitle: "Classgrid vs vmedulife",
      metaDescription: "A practical comparison between Classgrid and vmedulife across NAAC compliance, real-time chat, biometrics, and modern deployment readiness.",
      ratingBadges: [
        { _key: generateId("badge"), platform: "Automation Readiness", score: 4.9, badgeLabel: "NAAC Auto-Sync" },
        { _key: generateId("badge"), platform: "Operational Scale", score: 4.8, badgeLabel: "Redis Chat Engine" },
      ],
      usps: [
        {
          _key: generateId("usp"),
          icon: "workflow",
          title: "Automated NAAC/NBA Compliance Engine",
          description: "Instead of forcing faculty to manually type data for inspections, Classgrid automatically pulls attendance, pass percentages, and fee collections directly into printable NAAC reports.",
        },
        {
          _key: generateId("usp"),
          icon: "sparkles",
          title: "Enterprise Biometric SDK",
          description: "Classgrid offers an Enterprise Developer API that securely syncs physical campus turnstiles directly to our backend for instant HR and payroll tracking.",
        },
        {
          _key: generateId("usp"),
          icon: "shield",
          title: "Redis-Backed Real-Time Chat",
          description: "While legacy ERPs crash during mass announcements, our Redis Streams + ACK architecture guarantees zero message loss even when 5,000 students chat simultaneously.",
        },
      ],
      featureMatrix: [
        { _key: generateId("feat"), category: "Compliance", featureName: "NAAC/NBA Report Auto-Generation", ourStatus: "Auto-pulls data from ERP modules", ourIcon: "check", competitorStatus: "Manual data entry required", competitorIcon: "warning" },
        { _key: generateId("feat"), category: "Academics", featureName: "Advanced Quiz Engine (JEE/NEET)", ourStatus: "Native +4/-1 negative marking & percentiles", ourIcon: "check", competitorStatus: "Basic MCQ support only", competitorIcon: "warning" },
        { _key: generateId("feat"), category: "HR & Operations", featureName: "Hardware Biometric Sync", ourStatus: "Direct API SDK for turnstiles", ourIcon: "check", competitorStatus: "CSV manual upload", competitorIcon: "cross" },
        { _key: generateId("feat"), category: "Communication", featureName: "High-Concurrency Campus Chat", ourStatus: "Redis Streams + MongoDB", ourIcon: "check", competitorStatus: "Basic queues prone to crashing", competitorIcon: "warning" },
      ],
      migrationTestimonial: {
        quoteText: "The decision was easy. Classgrid's ability to automatically generate our NAAC reports by pulling existing attendance and exam data saved us literally hundreds of hours of manual labor.",
        authorName: "Principal",
        authorRole: "Engineering Institute",
      },
      faqs: [
        { _key: generateId("faq"), question: "How does the NAAC compliance engine actually save time?", answer: "It acts as a background worker that quietly skims the Attendance, Fees, and Results tables all year." },
        { _key: generateId("faq"), question: "Can we connect our existing biometric hardware?", answer: "Yes. We provide an Enterprise Developer API with IP whitelisting." },
      ]
    });
    console.log("✅ Compare pages uploaded.");

    // 3. Upload Changelog Settings & Entries
    console.log("Uploading Changelog Settings...");
    await client.createOrReplace({
      _id: "changelogSettings",
      _type: "changelogSettings",
      seoTitle: "Classgrid Changelog",
      metaDescription: "Track new features, improvements, and bug fixes shipped across the Classgrid platform.",
      heroHeadline: "Classgrid changelog",
      heroSubheadline: "A public log of product improvements, new releases, and operational fixes across the platform.",
    });

    console.log("Uploading Changelog Entries...");
    await client.createOrReplace({
      _id: "changelog_naac",
      _type: "changelogEntry",
      title: "NAAC/NBA Automated Compliance Engine Launched",
      slug: { current: "naac-nba-automated-compliance-engine" },
      seoTitle: "NAAC/NBA Automated Compliance Engine Launched",
      metaDescription: "Classgrid shipped the NAAC/NBA compliance engine, automatically pulling attendance, pass rates, and fee data into printable reports.",
      releaseDate: "2026-04-27", // Fixed Date
      updateType: "feature",
      versionLabel: "v3.0",
      modules: ["compliance", "academics", "finance"],
      summary: "The new compliance engine eliminates manual data entry for NAAC/NBA inspections by auto-syncing metrics directly from the ERP.",
      relatedTourLabel: "See the Compliance Tour",
      relatedTourHref: "/features",
      content: [
        { _key: generateId("block"), _type: "block", style: "normal", children: [{ _key: generateId("span"), _type: "span", text: "We are thrilled to launch our 'Secret Weapon' for engineering colleges and universities: the automated NAAC/NBA Compliance Engine.", marks: [] }] },
        { _key: generateId("block2"), _type: "block", style: "h2", children: [{ _key: generateId("span"), _type: "span", text: "The Problem with Manual Compliance", marks: [] }] },
        { _key: generateId("block3"), _type: "block", style: "normal", children: [{ _key: generateId("span"), _type: "span", text: "For years, engineering colleges have suffered through NAAC and NBA inspections by forcing faculty to manually compile thousands of spreadsheets covering student attendance, examination pass percentages, fee collection metrics, and faculty records.", marks: [] }] },
        { _key: generateId("block4"), _type: "block", style: "h2", children: [{ _key: generateId("span"), _type: "span", text: "The Classgrid Solution", marks: [] }] },
        { _key: generateId("block5"), _type: "block", style: "normal", children: [{ _key: generateId("span"), _type: "span", text: "Our new automated engine sits natively inside your multi-tenant Classgrid deployment. Because Classgrid already handles your daily operations, the compliance engine acts as a background worker that quietly skims the Attendance, Fees, and Results tables all year round.", marks: [] }] },
        { _key: generateId("block6"), _type: "block", style: "normal", listItem: "bullet", children: [{ _key: generateId("span"), _type: "span", text: "Student Attendance is automatically pulled from the attendance module.", marks: [] }] },
        { _key: generateId("block7"), _type: "block", style: "normal", listItem: "bullet", children: [{ _key: generateId("span"), _type: "span", text: "Pass Percentages are pulled natively from the exam engine.", marks: [] }] },
        { _key: generateId("block8"), _type: "block", style: "normal", listItem: "bullet", children: [{ _key: generateId("span"), _type: "span", text: "Fee Records are synced directly from the finance ledger.", marks: [] }] },
        { _key: generateId("block9"), _type: "block", style: "normal", children: [{ _key: generateId("span"), _type: "span", text: "When the inspection team arrives, your administrators can instantly generate PDF reports powered by Puppeteer/PDFKit, complete with criteria-wise data, beautiful pie charts, and summary scores—without typing a single manual entry.", marks: [] }] },
      ]
    });

    await client.createOrReplace({
      _id: "changelog_redis",
      _type: "changelogEntry",
      title: "Redis Streams Chat Architecture for Massive Scale",
      slug: { current: "redis-streams-chat-architecture" },
      seoTitle: "Redis Streams Chat Architecture for Massive Scale",
      metaDescription: "Classgrid upgraded its real-time chat infrastructure to Redis Streams with ACK, guaranteeing zero message loss.",
      releaseDate: "2026-03-28",
      updateType: "improvement",
      versionLabel: "v2.8",
      modules: ["communication", "platform"],
      summary: "We completely rebuilt our chat queueing system to handle 5,000+ concurrent students without crashing or dropping messages.",
      relatedTourLabel: "Explore communication flows",
      relatedTourHref: "/tour",
      content: [
        { _key: generateId("block"), _type: "block", style: "normal", children: [{ _key: generateId("span"), _type: "span", text: "To solve the 'Noisy Neighbor Problem' where one large college's announcements could lag another's, we implemented isolated Redis Streams per tenant.", marks: [] }] },
        { _key: generateId("block2"), _type: "block", style: "h2", children: [{ _key: generateId("span"), _type: "span", text: "Zero Message Loss Architecture", marks: [] }] },
        { _key: generateId("block3"), _type: "block", style: "normal", children: [{ _key: generateId("span"), _type: "span", text: "Basic chat queues often result in data loss if the background worker crashes before transferring data to MongoDB. We have completely replaced this with Redis Streams (XADD). Messages now stay in the stream even if a Node.js worker crashes, guaranteeing delivery.", marks: [] }] },
        { _key: generateId("block4"), _type: "block", style: "normal", listItem: "bullet", children: [{ _key: generateId("span"), _type: "span", text: "Guaranteed message delivery with Acknowledgment (ACK) systems. We only clear the Redis cache once MongoDB confirms the save.", marks: [] }] },
        { _key: generateId("block5"), _type: "block", style: "normal", listItem: "bullet", children: [{ _key: generateId("span"), _type: "span", text: "Adaptive background workers now flush to MongoDB dynamically based on queue size, rather than using rigid interval timers.", marks: [] }] },
        { _key: generateId("block6"), _type: "block", style: "normal", listItem: "bullet", children: [{ _key: generateId("span"), _type: "span", text: "Optimistic UI updates ensure the chat feels instant on the client side, even under extreme database load.", marks: [] }] },
      ]
    });

    await client.createOrReplace({
      _id: "changelog_biometric",
      _type: "changelogEntry",
      title: "Enterprise Biometric SDK Fixes & Deduplication",
      slug: { current: "enterprise-biometric-sdk-fixes" },
      seoTitle: "Enterprise Biometric SDK Fixes & Deduplication",
      metaDescription: "Improved hardware sync for physical turnstiles, fixing duplicate scans and refining dynamic half-day boundary logic.",
      releaseDate: "2026-02-16",
      updateType: "bugfix",
      versionLabel: "v2.7",
      modules: ["hr", "operations"],
      summary: "We fixed edge cases in the Biometric API Bridge to perfectly align physical turnstile scans with internal payroll multipliers.",
      relatedTourLabel: "View HR operations",
      relatedTourHref: "/tour",
      content: [
        { _key: generateId("block"), _type: "block", style: "normal", children: [{ _key: generateId("span"), _type: "span", text: "Syncing physical hardware like turnstiles to cloud ERPs is notoriously tricky. This patch refines our API bridge to handle edge cases effortlessly.", marks: [] }] },
        { _key: generateId("block2"), _type: "block", style: "h2", children: [{ _key: generateId("span"), _type: "span", text: "What we fixed", marks: [] }] },
        { _key: generateId("block3"), _type: "block", style: "normal", children: [{ _key: generateId("span"), _type: "span", text: "When physical hardware pushes timestamps to the Classgrid API, network retries or anxious staff members double-swiping can corrupt attendance ledgers. We've introduced strict deduplication rules.", marks: [] }] },
        { _key: generateId("block4"), _type: "block", style: "normal", listItem: "bullet", children: [{ _key: generateId("span"), _type: "span", text: "Advanced deduplication: If a teacher scans twice in 5 minutes, the system now correctly ignores the duplicate instead of corrupting the ledger.", marks: [] }] },
        { _key: generateId("block5"), _type: "block", style: "normal", listItem: "bullet", children: [{ _key: generateId("span"), _type: "span", text: "Dynamic time boundaries: Admins can now reliably set custom 'Late' and 'Half-day' cutoff times per department.", marks: [] }] },
        { _key: generateId("block6"), _type: "block", style: "normal", listItem: "bullet", children: [{ _key: generateId("span"), _type: "span", text: "Strict IP whitelisting reinforcement to prevent API brute-forcing, ensuring the hardware integration remains secure.", marks: [] }] },
      ]
    });
    console.log("✅ Changelog entries uploaded.");
    
    console.log("🎉 All SaaS pages successfully synced to Sanity Studio!");
    
  } catch (error) {
    console.error("Error uploading to Sanity:", error);
  }
}

uploadSaasPages();
