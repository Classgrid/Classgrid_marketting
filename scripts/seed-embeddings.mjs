/**
 * seed-embeddings.mjs
 * ─────────────────────────────────────────────────────────────
 * One-shot bulk seed: fetches all supportArticle + post docs
 * from Sanity, then POSTs each one to /api/sync-embeddings
 * so they get embedded and stored in MongoDB Atlas.
 *
 * Usage:
 *   node scripts/seed-embeddings.mjs
 *
 * Requirements:
 *   - npm run dev must be running (or localtunnel URL)
 *   - SANITY_PROJECT_ID, SANITY_DATASET in .env.local
 *   - MongoDB Atlas Vector Index "vector_index" already created
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// ── Load .env.local manually ─────────────────────────────────
function loadEnv() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.warn("⚠️  Could not load .env.local — make sure env vars are set.");
  }
}

loadEnv();

// ── Config ────────────────────────────────────────────────────
const SYNC_URL = process.env.SEED_SYNC_URL || "http://localhost:3000/api/sync-embeddings";
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET   = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const TOKEN     = process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_TOKEN;

if (!PROJECT_ID) {
  console.error("❌ NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local");
  process.exit(1);
}

const sanity = createClient({
  projectId: PROJECT_ID,
  dataset:   DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: TOKEN,
});

// ── Fetch all embeddable docs from Sanity ─────────────────────
async function fetchAllDocs() {
  console.log("📡 Fetching articles from Sanity...");

  // Original: supportArticle + post
  const cmsQuery = `*[_type in ["supportArticle", "post"]] {
    _id,
    _type,
    title,
    body
  }`;

  // Help Center articles (with markdown body for better RAG)
  const helpQuery = `*[_type == "helpArticle"] {
    _id,
    _type,
    "title": title.en,
    "body": coalesce(markdownBody, ""),
    "summary": summary.en
  }`;

  // Solution pages
  const solutionQuery = `*[_type == "solutionPage"] {
    _id,
    _type,
    "title": headline.en,
    "body": subtitle.en,
    category,
    "slug": slug.current
  }`;

  // FAQ items
  const faqQuery = `*[_type == "faqItem"] {
    _id,
    _type,
    "title": question.en,
    "body": answer.en
  }`;

  // Legal pages (privacy, terms, etc.)
  const legalQuery = `*[_type == "legalPage"] {
    _id,
    _type,
    "title": title.en,
    "body": title.en
  }`;

  // Changelog entries
  const changelogQuery = `*[_type == "changelogEntry"] {
    _id,
    _type,
    title,
    summary,
    updateType,
    versionLabel
  }`;

  // Case studies
  const caseStudyQuery = `*[_type == "caseStudy"] {
    _id,
    _type,
    "title": title.en,
    "body": coalesce(subtitle.en, "")
  }`;

  const [cmsDocs, helpDocs, solutionDocs, faqDocs, legalDocs, changelogDocs, caseStudyDocs] = await Promise.all([
    sanity.fetch(cmsQuery),
    sanity.fetch(helpQuery),
    sanity.fetch(solutionQuery),
    sanity.fetch(faqQuery),
    sanity.fetch(legalQuery),
    sanity.fetch(changelogQuery),
    sanity.fetch(caseStudyQuery),
  ]);

  // For help articles, convert markdownBody to title+body format
  const processedHelp = helpDocs.map(doc => ({
    ...doc,
    title: doc.title || "Help Article",
    body: doc.body || doc.summary || "",
  }));

  // For solution pages, combine fields into body
  const processedSolutions = solutionDocs.map(doc => ({
    ...doc,
    title: doc.title || "Solution Page",
    body: `${doc.title || ""}\n\n${doc.body || ""}\n\nCategory: ${doc.category || ""}\nSlug: ${doc.slug || ""}`,
  }));

  // For changelog, combine fields
  const processedChangelog = changelogDocs.map(doc => ({
    ...doc,
    title: doc.title || "Changelog",
    body: `${doc.title || ""}\n\n${doc.summary || ""}\n\nType: ${doc.updateType || ""}\nVersion: ${doc.versionLabel || ""}`,
  }));

  // Static site pages for RAG context
  const staticPages = [
    {
      _id: "static_contact",
      _type: "staticPage",
      title: "Contact Us - Classgrid",
      body: "Contact Classgrid at: Akurdi Railway Station Road, Sector No. 26, Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra 411044. Phone: +91 8623947038, +91 8149277038. Email: support@classgrid.in, nikhil.shinde@classgrid.in. Book a demo at classgrid.in. Support hours: Monday to Saturday.",
    },
    {
      _id: "static_pricing",
      _type: "staticPage",
      title: "Pricing - Classgrid",
      body: "Classgrid offers flexible pricing for schools, colleges, junior colleges, coaching institutes, and engineering colleges. Contact sales for custom enterprise pricing. Free demo available. Visit classgrid.in/pricing for current plans.",
    },
    {
      _id: "static_about",
      _type: "staticPage",
      title: "About Classgrid",
      body: "Classgrid is the Operating System for Educational Institutions. It manages admissions, academics, operations, communication, and analytics in one unified education platform. Built for schools, colleges, junior colleges, coaching institutes, and engineering colleges across India.",
    },
  ];

  const allDocs = [
    ...cmsDocs,
    ...processedHelp,
    ...processedSolutions,
    ...faqDocs,
    ...legalDocs,
    ...processedChangelog,
    ...caseStudyDocs,
    ...staticPages,
  ];
  console.log(`✅ Found ${allDocs.length} document(s) to embed.`);
  console.log(`   📄 ${cmsDocs.length} CMS articles/posts`);
  console.log(`   📚 ${helpDocs.length} help articles`);
  console.log(`   🏫 ${solutionDocs.length} solution pages`);
  console.log(`   ❓ ${faqDocs.length} FAQ items`);
  console.log(`   ⚖️  ${legalDocs.length} legal pages`);
  console.log(`   📋 ${changelogDocs.length} changelog entries`);
  console.log(`   📊 ${caseStudyDocs.length} case studies`);
  console.log(`   🏠 ${staticPages.length} static pages (contact, pricing, about)\n`);
  return allDocs;
}

// ── POST one doc to the sync endpoint ────────────────────────
async function syncDoc(doc, index, total) {
  const label = `[${index + 1}/${total}] "${doc.title || doc._id}"`;
  try {
    const syncSecret = process.env.RAG_SYNC_SECRET || process.env.SANITY_WEBHOOK_SECRET || "";
    const res = await fetch(SYNC_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(syncSecret ? { "x-classgrid-rag-secret": syncSecret } : {})
      },
      body: JSON.stringify({
        _id:   doc._id,
        _type: doc._type,
        title: doc.title,
        body:  doc.body,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`  ❌ ${label} — HTTP ${res.status}: ${text}`);
      return false;
    }

    const json = await res.json().catch(() => ({}));
    const chunks = json.chunks ?? "?";
    console.log(`  ✅ ${label} — ${chunks} chunk(s) embedded`);
    return true;
  } catch (err) {
    console.error(`  ❌ ${label} — ${err.message}`);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  console.log("╔════════════════════════════════════════╗");
  console.log("║   ClassGrid — Embedding Bulk Seeder    ║");
  console.log("╚════════════════════════════════════════╝\n");
  console.log(`🔗 Sync endpoint : ${SYNC_URL}`);
  console.log(`🗄️  Sanity project: ${PROJECT_ID} / ${DATASET}\n`);

  let docs;
  try {
    docs = await fetchAllDocs();
  } catch (err) {
    console.error("❌ Failed to fetch from Sanity:", err.message);
    process.exit(1);
  }

  if (docs.length === 0) {
    console.log("ℹ️  No documents found. Nothing to seed.");
    return;
  }

  let success = 0;
  let failed  = 0;

  for (let i = 0; i < docs.length; i++) {
    const ok = await syncDoc(docs[i], i, docs.length);
    if (ok) success++; else failed++;
    // Small delay to avoid hammering the local server
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n════════════════════════════════════`);
  console.log(`✅ Done! ${success} succeeded, ${failed} failed.`);
  if (failed > 0) {
    console.log(`⚠️  Check that 'npm run dev' is running and MongoDB URI is set.`);
  }
}

main();
