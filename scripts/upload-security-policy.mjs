import { createClient } from "@sanity/client";
import { config } from "dotenv";
import crypto from "crypto";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-30",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const key = () => crypto.randomBytes(12).toString("base64url");

const block = (style, text, level) => {
  const b = {
    _key: key(),
    _type: "block",
    style,
    children: [{ _key: key(), _type: "span", text }],
  };
  if (level) {
    b.listItem = "bullet";
    b.level = level;
  }
  return b;
};

const table = (headers, rows) => {
  return {
    _key: key(),
    _type: "legalTable",
    headers,
    rows: rows.map(r => ({ _key: key(), _type: "tableRow", cells: r }))
  };
};

async function uploadSecurityPolicy() {
  console.log("📝 Uploading verified Security Policy to Sanity...");

  const doc = {
    _id: "drafts.legal_security_policy", // uploading as draft first so you can review!
    _type: "legalPage",
    title: "SECURITY POLICY",
    slug: { _type: "slug", current: "security" },
    lastUpdated: new Date().toISOString(),
    effectiveDate: "2026-08-09T00:00:00.000Z",
    sendSubscriberNotification: false,
    summary: "Updated Security Policy to reflect our latest infrastructure changes, including Redis caching, Background workers, and updated authentication protocols.",
    
    intro: {
      introductionHeading: "OUR SECURITY COMMITMENT",
      introductionBody: "We are committed to protecting the confidentiality, integrity, and availability (CIA) of all data entrusted to Us. Given that Our Platform handles sensitive educational data — including data of minor students — We apply security measures that meet or exceed industry standards for EdTech platforms.\n\nSecurity Principles:\n- Defense in Depth — Multiple layers of security controls at every level\n- Least Privilege — Users and systems are granted only the minimum access required\n- Zero Trust — Every request is authenticated and authorized, regardless of origin\n- Data Minimization — We collect and retain only the data necessary for Platform functionality\n- Transparency — This document openly describes Our security practices",
      scopeHeading: "Scope",
      scopeBody: "This policy applies to all infrastructure, applications, and processes managed by Classgrid Technologies."
    },

    sections: [
      {
        _key: key(),
        id: "infrastructure-security",
        title: "INFRASTRUCTURE SECURITY",
        content: [
          block("h3", "Cloud Infrastructure"),
          block("normal", "The Platform is hosted on enterprise-grade cloud infrastructure:"),
          table(
            ["Component", "Provider", "Security Certifications"],
            [
              ["Frontend & ERP Hosting", "Vercel", "SOC 2 Type II, ISO 27001"],
              ["API & Auth Management", "Google Cloud Platform & Render", "SOC 1/2/3, ISO 27001"],
              ["Primary Database", "MongoDB Atlas", "SOC 2 Type II, ISO 27001, HIPAA"],
              ["Queue & Caching (New)", "Upstash Redis", "SOC 2 Type II"],
              ["File & Media Storage", "AWS (via Supabase)", "SOC 2 Type II, ISO 27001"],
              ["Email Delivery (New)", "Resend", "SOC 2 Type II"],
              ["Google Authentication", "Google Identity", "SOC 2, ISO 27001"],
              ["Push Notifications", "Firebase (Google)", "SOC 1/2/3, ISO 27001"],
              ["Payment Processing", "Razorpay", "PCI DSS Level 1"]
            ]
          ),
          block("h3", "Environment Isolation"),
          block("normal", "Production, Staging, and Development environments are strictly isolated.", 1),
          block("normal", "Production credentials and API keys are never used in non-production environments.", 1)
        ]
      },
      {
        _key: key(),
        id: "application-security",
        title: "APPLICATION SECURITY & COMMUNICATION",
        content: [
          block("normal", "All web responses include strict security headers. We follow the OWASP Top 10 guidelines for web application security."),
          block("normal", "We use modern encryption for all data in transit and at rest."),
          block("h3", "Marketing & Transactional Security"),
          block("normal", "Unsubscribe links for marketing emails are cryptographically signed using SHA-256 hashes to prevent unauthorized preference tampering without requiring a login.", 1),
          block("normal", "Background workers (BullMQ/Redis) are isolated from public web traffic and execute in private subnets.", 1)
        ]
      },
      {
        _key: key(),
        id: "authentication",
        title: "AUTHENTICATION AND ACCESS CONTROL",
        content: [
          block("normal", "User passwords are hashed using bcrypt. We also support Google Sign-In via OAuth 2.0."),
          block("normal", "All API endpoints require a valid stateless JWT token (Access Tokens)."),
          block("normal", "The Platform enforces strict Role-Based Access Control (RBAC) at both the API and UI levels (Org Admin, Faculty, Student, Parent).", 1)
        ]
      }
    ]
  };

  try {
    const result = await client.createOrReplace(doc);
    console.log("✅ Security Policy uploaded successfully as DRAFT!");
    console.log("📌 Go to Sanity Studio -> Legal Pages -> SECURITY POLICY.");
    console.log("📌 Review my changes, toggle 'Send Email Notification' ON, and hit Publish!");
  } catch (error) {
    console.error("❌ Error uploading to Sanity:", error);
  }
}

uploadSecurityPolicy();
