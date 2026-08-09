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

function assignKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => {
      const parsed = assignKeys(item);
      if (parsed && typeof parsed === "object" && !parsed._key) {
        parsed._key = key();
      }
      return parsed;
    });
  } else if (obj !== null && typeof obj === "object") {
    const newObj = {};
    for (const k in obj) {
      newObj[k] = assignKeys(obj[k]);
    }
    if (newObj._type === "block" || newObj._type === "span") {
      newObj._key = key();
    }
    return newObj;
  }
  return obj;
}

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

async function reUploadSecurityPolicy() {
  console.log("📝 Importing pure 20-Section Security Policy...");
  const { securityPolicy } = await import("../content/legal.mjs");
  
  // 1. EXACT REVERT OF SECTIONS 1 TO 20 (NO EDITS WHATSOEVER)
  let formattedSections = securityPolicy.sections
    .filter(s => s.heading !== "Introduction") // ONLY filter out Introduction (TOC)
    .map(section => {
      const titleParts = section.heading.split(". ");
      const idStr = titleParts.length > 1 ? titleParts[1].toLowerCase().replace(/\s+/g, '-') : section.heading.toLowerCase().replace(/\s+/g, '-');
      return {
        _key: key(),
        _type: "section",
        id: idStr,
        title: section.heading,
        content: assignKeys(section.content)
      };
    });

  console.log(`✅ Loaded ${formattedSections.length} original sections flawlessly without edits.`);

  console.log("⚙️ Formatting to Sanity legalPage schema...");

  const doc = {
    _id: "drafts.legal_security_policy", 
    _type: "legalPage",
    title: "SECURITY POLICY",
    slug: { _type: "slug", current: "security" },
    lastUpdated: new Date().toISOString(),
    effectiveDate: "2026-08-09T00:00:00.000Z",
    sendSubscriberNotification: false,
    summary: "Updated Security Policy to include previously undocumented infrastructure details: Real-Time WebSockets, AI Data Security, API Telemetry, and Fault Tolerance.",
    
    intro: {
      introductionHeading: "Overview",
      introductionBody: "Infrastructure and application security controls powering tenant-safe operations.",
      scopeHeading: "Scope",
      scopeBody: "This policy applies to all infrastructure, applications, and processes managed by Classgrid Technologies."
    },
    sections: formattedSections
  };

  try {
    console.log("🚀 Uploading to Sanity...");
    const result = await client.createOrReplace(doc);
    console.log(`✅ Security Policy uploaded successfully with ${formattedSections.length} SECTIONS!`);
    console.log("📌 Go to Sanity Studio -> Legal Pages -> SECURITY POLICY to review and publish.");
  } catch (error) {
    console.error("❌ Error uploading to Sanity:", error);
  }
}

reUploadSecurityPolicy();
