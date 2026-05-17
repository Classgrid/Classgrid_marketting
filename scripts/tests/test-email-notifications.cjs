/**
 * End-to-End Test: Queue + Cron Email System
 * 
 * 1. Simulates a webhook (inserts into queue via webhook route)
 * 2. Triggers the cron endpoint to process the queue
 * 3. Verifies emails were sent
 */
const crypto = require("crypto");
require("dotenv").config({ path: ".env.local" });

const BASE_URL = "http://localhost:3001";
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET;
const CRON_SECRET = process.env.CRON_SECRET;
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!WEBHOOK_SECRET || !CRON_SECRET || !SANITY_PROJECT_ID) {
  console.error("❌ Missing env vars. Need: SANITY_WEBHOOK_SECRET, CRON_SECRET, NEXT_PUBLIC_SANITY_PROJECT_ID");
  process.exit(1);
}

function signBody(body, secret) {
  return crypto.createHmac("sha256", secret).update(body).digest("hex");
}

async function sanityFetch(query) {
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2026-03-30/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  const json = await res.json();
  return json.result;
}

async function main() {
  console.log("🚀 End-to-End Queue + Cron Test\n");

  // ── Step 1: Fetch real blog + changelog from Sanity ──────────────────
  console.log("1️⃣  Fetching real documents from Sanity...");
  
  const blog = await sanityFetch(`*[_type == "post"] | order(publishedAt desc)[0]{ _id, _type, title, "slug": slug.current }`);
  const changelog = await sanityFetch(`*[_type == "changelogEntry"] | order(releaseDate desc)[0]{ _id, _type, title, "slug": slug.current, updateType, releaseDate, versionLabel }`);

  if (!blog) { console.error("   ❌ No blog posts found"); return; }
  if (!changelog) { console.error("   ❌ No changelog entries found"); return; }

  console.log(`   ✅ Blog: "${typeof blog.title === 'object' ? blog.title.en : blog.title}" (${blog.slug})`);
  const clTitle = typeof changelog.title === 'object' ? changelog.title.en : changelog.title;
  console.log(`   ✅ Changelog: "${clTitle}" (${changelog.slug})`);

  // ── Step 2: Send webhook for Blog (should go into queue) ─────────────
  console.log("\n2️⃣  Sending Blog webhook (should insert into queue)...");
  
  const blogPayload = JSON.stringify({
    _id: blog._id,
    _type: "post",
    title: blog.title,
    slug: { current: blog.slug },
  });

  const blogRes = await fetch(`${BASE_URL}/api/blog/webhook/sanity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sanity-webhook-signature": signBody(blogPayload, WEBHOOK_SECRET),
    },
    body: blogPayload,
  });
  const blogData = await blogRes.json();
  console.log(`   Status: ${blogRes.status}`);
  console.log(`   Response:`, blogData);

  // ── Step 3: Send webhook for Changelog (should go into queue) ────────
  console.log("\n3️⃣  Sending Changelog webhook (should insert into queue)...");
  
  const clPayload = JSON.stringify({
    _id: changelog._id,
    _type: "changelogEntry",
    title: changelog.title,
    slug: { current: changelog.slug },
    updateType: changelog.updateType,
    releaseDate: changelog.releaseDate,
    versionLabel: changelog.versionLabel,
  });

  const clRes = await fetch(`${BASE_URL}/api/blog/webhook/sanity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "sanity-webhook-signature": signBody(clPayload, WEBHOOK_SECRET),
    },
    body: clPayload,
  });
  const clData = await clRes.json();
  console.log(`   Status: ${clRes.status}`);
  console.log(`   Response:`, clData);

  // ── Step 4: Wait a moment, then trigger Cron ─────────────────────────
  console.log("\n4️⃣  Waiting 3 seconds, then triggering cron...");
  await new Promise((r) => setTimeout(r, 3000));

  console.log("   🔄 Calling GET /api/cron/send-notifications?type=all ...");
  
  const cronRes = await fetch(`${BASE_URL}/api/cron/send-notifications?type=all`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${CRON_SECRET}`,
    },
  });
  const cronData = await cronRes.json();
  console.log(`   Status: ${cronRes.status}`);
  console.log(`   Response:`, JSON.stringify(cronData, null, 2));

  // ── Summary ──────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════");
  console.log("📋 SUMMARY");
  console.log("═══════════════════════════════════════");
  
  if (cronData.results) {
    for (const r of cronData.results) {
      const emoji = r.status === "sent" ? "✅" : "❌";
      console.log(`${emoji} ${r.documentType} (${r.slug}): ${r.status} — sent: ${r.sent || 0}, failed: ${r.failed || 0}`);
    }
  }
  
  console.log("\nCheck the configured test inbox for the emails.");
}

main().catch(console.error);
