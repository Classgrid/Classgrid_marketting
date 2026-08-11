import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-30",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const doc = {
  _type: "legalPage",
  _id: "legalPage-ip-protection",
  title: "Intellectual Property Protection Policy",
  slug: { _type: "slug", current: "ip-protection" },
  lastUpdated: new Date().toISOString(),
  sendSubscriberNotification: false,
  summary: "How Classgrid protects its intellectual property through copyright, trade secrets, trademark, and MSME registration — and why SaaS products are not patented under Indian law.",
  intro: {
    introductionHeading: "Introduction",
    introductionBody: "This document explains how Classgrid protects its intellectual property (IP) and why Classgrid, as a Software-as-a-Service (SaaS) platform, does not require a patent. This policy is intended for students, faculty, partners, investors, and anyone who wishes to understand how Classgrid's IP is safeguarded.\n\nClassgrid is a cloud-based Education Operating System (Education ERP) designed for schools, colleges, coaching institutes, junior colleges, and engineering institutions. It provides a unified platform for managing academic, administrative, financial, and operational workflows. Classgrid is a commercial SaaS product — not a research invention, hardware device, or algorithm that would typically require a patent.",
    scopeHeading: "Scope",
    scopeBody: "This policy applies to all intellectual property created by Classgrid, including but not limited to: source code, database schemas, API designs, UI/UX designs, documentation, blog content, email templates, marketing materials, the Classgrid brand name, logo, and all associated digital assets.",
  },
  sections: [
    {
      _key: "section-1",
      _type: "section",
      id: "why-no-patent",
      title: "Why Classgrid Does Not Require a Patent",
      content: [
        {
          _type: "block",
          _key: "b1",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s1",
              text: "In the global software industry, Software-as-a-Service (SaaS) products are almost never patented. This is the industry standard followed by some of the world's most successful technology companies including Google Workspace, Slack, Zoho, Tally (India), Razorpay (YC W15), Notion, and Canva — none of which have patented their core product.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "b2",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s2",
              text: "Section 3(k) of The Patents Act, 1970 (India) explicitly states that \"a mathematical or business method or a computer programme per se or algorithms\" are not patentable in India. Classgrid's core functionality — managing attendance, fees, exams, communication — falls under business methods implemented through software, which is excluded from patentability under Indian law.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "b3",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s3",
              text: "Even in the United States, the 2014 Supreme Court ruling in Alice Corp. v. CLS Bank significantly restricted software patents. Most SaaS companies globally do not pursue patents. Like every modern software product, Classgrid is built using open-source technologies (Node.js, React, MongoDB, Redis, etc.). Patenting a product built on open-source components is neither practical nor ethical.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: "section-2",
      _type: "section",
      id: "copyright-protection",
      title: "Copyright Protection (Automatic)",
      content: [
        {
          _type: "block",
          _key: "b4",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s4",
              text: "Under the Indian Copyright Act, 1957, and the Berne Convention (international), all original source code, documentation, UI designs, and content created by Classgrid are automatically protected by copyright from the moment of creation. No registration is required, though registration can be pursued for additional legal enforcement.",
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: "b5",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s5",
              text: "What is protected: All source code, database schemas, API designs, UI/UX designs, documentation, blog content, email templates, and marketing materials. Duration: Lifetime of the author + 60 years (India) / 70 years (international).",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: "section-3",
      _type: "section",
      id: "trade-secrets",
      title: "Trade Secrets",
      content: [
        {
          _type: "block",
          _key: "b6",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s6",
              text: "Classgrid's proprietary business logic, algorithms, database architectures, multi-tenant design patterns, and internal system configurations are protected as trade secrets. These are never publicly disclosed and are safeguarded through: Private GitHub repositories (not open-source), environment variable encryption for all API keys and credentials, role-based access control within the development team, and non-disclosure agreements (NDAs) with any future employees or contractors.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: "section-4",
      _type: "section",
      id: "trademark-protection",
      title: "Trademark Protection",
      content: [
        {
          _type: "block",
          _key: "b7",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s7",
              text: "The name \"Classgrid\", the Classgrid logo, and associated brand assets are protected under trademark law. Formal trademark registration (™ → ®) can be pursued through the Indian Trademark Registry at any time.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: "section-5",
      _type: "section",
      id: "msme-registration",
      title: "MSME Registration",
      content: [
        {
          _type: "block",
          _key: "b8",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s8",
              text: "Classgrid is registered as a Micro Enterprise with the Government of India under the MSME Development Act. Udyam Registration Number: UDYAM-MH-01-0308803. Classification: Micro Enterprise. Activity: Services — Computer Programming Activities. NIC Code: 62011. This registration provides official government recognition of Classgrid as a legitimate business entity.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: "section-6",
      _type: "section",
      id: "legal-agreements",
      title: "Terms of Service and Legal Agreements",
      content: [
        {
          _type: "block",
          _key: "b9",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s9",
              text: "Classgrid's published legal documents protect both the company and its users: Terms of Service (governs platform usage), Privacy Policy (governs data handling and GDPR/IT Act compliance), Acceptable Use Policy (defines permitted and prohibited usage), Cookie Policy (governs cookie and tracking behavior), and Security Policy (defines security practices and data protection measures). All legal documents are publicly available at classgrid.in.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: "section-7",
      _type: "section",
      id: "summary-for-students",
      title: "Summary for Students and Faculty",
      content: [
        {
          _type: "block",
          _key: "b10",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s10",
              text: "If you are a student or faculty member and someone asks \"Is Classgrid patented?\", here is the simple answer: Classgrid is a SaaS (Software-as-a-Service) product, similar to Google Workspace, Zoho, or Tally. SaaS products are not patented — this is the global industry standard. Classgrid's intellectual property is protected through copyright law (automatic), trade secrets (private codebase), trademark law (brand protection), and government MSME registration. Indian Patent Law (Section 3(k) of The Patents Act, 1970) explicitly excludes computer programs and business methods from patentability.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: "section-8",
      _type: "section",
      id: "summary-for-investors",
      title: "Summary for Investors and Partners",
      content: [
        {
          _type: "block",
          _key: "b11",
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: "s11",
              text: "Classgrid's IP protection strategy is aligned with global SaaS industry best practices. Copyright: ✅ Automatic (Indian Copyright Act, 1957 + Berne Convention). Trade Secrets: ✅ Active (Private repositories, encrypted credentials, NDAs). Trademark: ✅ In use (™), formal registration planned (Indian Trademarks Act, 1999). MSME Registration: ✅ Registered (UDYAM-MH-01-0308803). Patent: ❌ Not applicable (Section 3(k), The Patents Act, 1970). Terms of Service: ✅ Published (classgrid.in/terms). Privacy Policy: ✅ Published (classgrid.in/privacy).",
              marks: [],
            },
          ],
        },
      ],
    },
  ],
};

async function publish() {
  console.log("📤 Publishing IP Protection Policy to Sanity...\n");

  try {
    const result = await client.createOrReplace(doc);
    console.log("✅ Published successfully!");
    console.log(`   Document ID: ${result._id}`);
    console.log(`   Type: ${result._type}`);
    console.log(`   Slug: ip-protection`);
    console.log(`\n🌐 It will be available at: https://classgrid.in/ip-protection`);
  } catch (err) {
    console.error("❌ Failed to publish:", err.message);
  }
}

publish();
