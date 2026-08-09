import { createClient } from "@sanity/client";
import { config } from "dotenv";
import crypto from "crypto";
import fs from "fs";

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

async function safeAppend() {
  console.log("📝 Fetching the currently live (and restored) perfect Security Policy...");
  
  // Fetch the current perfect document that the user just restored
  const currentDoc = await client.fetch(`*[_type == "legalPage" && slug.current == "security"][0]`);
  
  if (!currentDoc || !currentDoc.sections) {
    console.error("❌ Could not find the sections array in the current document!");
    return;
  }

  console.log(`✅ Loaded ${currentDoc.sections.length} perfect sections from live Sanity.`);

  // Append our 4 new sections
  console.log("➕ Appending Sections 21, 22, 23, and 24 (with strict schema compliance)...");

  currentDoc.sections.push({
    _key: key(),
    _type: "section",
    id: "real-time-websocket-security",
    title: "21. REAL-TIME WEBSOCKET SECURITY",
    content: [
      block("normal", "The Platform relies on real-time WebSockets for chat, calling, and live meetings. These connections require stringent security controls independent of standard HTTP requests."),
      block("h3", "21.1 Connection Authentication"),
      block("normal", "All WebSocket handshakes are secured using stateless JWTs (JSON Web Tokens). Connections attempting to establish without a valid token are immediately rejected.", 1),
      block("h3", "21.2 Tenant and Room Isolation"),
      block("normal", "Once connected, WebSockets are strictly isolated by Tenant Organization IDs. A user cannot subscribe to or listen in on channels belonging to an organization they are not a member of.", 1),
      block("h3", "21.3 Resource Management"),
      block("normal", "To prevent abuse and maintain performance, WebSocket data streams are managed using Redis resource and connection safeguards, which regulate data throughput and enforce system limits.", 1)
    ]
  });

  currentDoc.sections.push({
    _key: key(),
    _type: "section",
    id: "artificial-intelligence-ai-data-security",
    title: "22. ARTIFICIAL INTELLIGENCE (AI) DATA SECURITY",
    content: [
      block("normal", "Classgrid uses the OpenAI API for selected AI-powered functionality. Data submitted through the OpenAI API is not used to train OpenAI models by default. Classgrid limits the information transmitted to AI services to the data necessary to provide the requested functionality. Where applicable, retention is governed by Classgrid's configured OpenAI API data-retention controls."),
      block("h3", "22.1 Academic Isolation"),
      block("normal", "AI queries are sandboxed via strict system prompts to ensure responses remain strictly academic and contextualized only to the provided syllabus data.", 1)
    ]
  });

  currentDoc.sections.push({
    _key: key(),
    _type: "section",
    id: "telemetry-and-usage-metering",
    title: "23. TELEMETRY AND USAGE METERING",
    content: [
      block("normal", "To ensure platform stability and facilitate transparent billing, the Platform tracks API usage metadata."),
      block("h3", "23.1 API Metering"),
      block("normal", "API requests (such as request counts and usage units) are metered per organization for Pay-As-You-Go billing calculations and rate-limit enforcement.", 1),
      block("h3", "23.2 Processing Efficiency"),
      block("normal", "Telemetry data is buffered in-memory using highly efficient middlewares to ensure that tracking usage does not impact the speed or performance of educational tasks.", 1)
    ]
  });

  currentDoc.sections.push({
    _key: key(),
    _type: "section",
    id: "fault-tolerance-and-resilience",
    title: "24. FAULT TOLERANCE AND RESILIENCE",
    content: [
      block("normal", "The Platform is designed with mechanisms to gracefully handle unexpected failures and minimize downtime."),
      block("h3", "24.1 Global Failure Handling"),
      block("normal", "Controlled shutdown and recovery mechanisms (such as unhandled exception interceptors) are in place to manage application errors gracefully and maintain overall system stability.", 1),
      block("h3", "24.2 Error Logging"),
      block("normal", "System errors and critical application faults are securely captured and logged into isolated databases. These logs assist our engineering team in identifying, troubleshooting, and resolving platform issues promptly.", 1)
    ]
  });

  // DO NOT touch effectiveDate, intro, title, or anything else!
  // Only update the sections array and summary
  currentDoc.summary = "Updated Security Policy to include previously undocumented infrastructure details: Real-Time WebSockets, AI Data Security, API Telemetry, and Fault Tolerance.";

  console.log("🚀 Uploading back to Sanity...");
  
  try {
    await client.createOrReplace(currentDoc);
    console.log(`✅ Security Policy safely updated to ${currentDoc.sections.length} SECTIONS!`);
    console.log("📌 Go to Sanity Studio -> Legal Pages -> SECURITY POLICY to review.");
  } catch (error) {
    console.error("❌ Error uploading to Sanity:", error);
  }
}

safeAppend();
