#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

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

loadEnvFile(path.join(process.cwd(), ".env"));
loadEnvFile(path.join(process.cwd(), ".env.local"));

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity env configuration for write access.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-03-30",
  useCdn: false,
});

const patch = {
  _id: "homePage",
  _type: "homePage",
  platformKicker: "Unified Education Stack",
  platformTitle: "Built for every institution, on one education platform",
  platformBody:
    "ClassGrid unifies academic workflows, operations, and communication in a single platform built for schools, colleges, and coaching institutes. No disconnected tools for fees, exams, admissions, CRM, or parent updates.",
  platformConnectionHint:
    "Primary use cases shown. Every module supports every institution type.",
  platformSystemLabel: "classgrid/os",
  platformInputLabels: [
    "Academic Management",
    "Institutional Operations",
    "Communication & Engagement",
  ],
  platformAudienceCards: [
    {
      _key: "platform-audience-school",
      badge: "K12",
      title: "Schools",
      subtitle: "Fees, attendance, exams, and parent communication in one system.",
    },
    {
      _key: "platform-audience-college",
      badge: "DEG",
      title: "Colleges",
      subtitle: "Department workflows, accreditation, exams, and campus administration.",
    },
    {
      _key: "platform-audience-coaching",
      badge: "CO",
      title: "Coaching Institutes",
      subtitle: "Batches, test series, enquiries, and student follow-up.",
    },
  ],
};

async function run() {
  await client.createIfNotExists({ _id: "homePage", _type: "homePage" });
  await client.patch("homePage").set(patch).commit();
  console.log("Updated Sanity homePage platform section.");
}

run().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
