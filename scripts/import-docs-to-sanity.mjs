/**
 * import-docs-to-sanity.mjs
 * 
 * Reads all MD files from /docs/ that Codex generated and imports them into Sanity.
 * Run AFTER Codex creates the MD files:  node scripts/import-docs-to-sanity.mjs
 */

import { createClient } from "@sanity/client";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname, basename } from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-01",
});

// ── Parse frontmatter from MD files ──────────────────────────────────────────
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatterText = match[1];
  const body = match[2].trim();
  const frontmatter = {};

  for (const line of frontmatterText.split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();

    // Parse arrays like [home, help-center]
    if (value.startsWith("[") && value.endsWith("]")) {
      value = value.slice(1, -1).split(",").map((v) => v.trim().replace(/"/g, ""));
    }
    // Remove surrounding quotes
    else if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }

    frontmatter[key] = value;
  }

  return { frontmatter, body };
}

// ── Convert MD body to Sanity Portable Text blocks (simplified) ───────────────
function mdToPortableText(md) {
  const lines = md.split("\n");
  const blocks = [];
  let currentParagraph = [];

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "normal",
        children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: currentParagraph.join(" ") }],
        markDefs: [],
      });
      currentParagraph = [];
    }
  }

  for (const line of lines) {
    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "h2",
        children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: line.slice(3) }],
        markDefs: [],
      });
    } else if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "h3",
        children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: line.slice(4) }],
        markDefs: [],
      });
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "normal",
        listItem: "bullet",
        level: 1,
        children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: line.slice(2) }],
        markDefs: [],
      });
    } else if (line.startsWith("> ")) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _key: Math.random().toString(36).slice(2),
        style: "blockquote",
        children: [{ _type: "span", _key: Math.random().toString(36).slice(2), text: line.slice(2) }],
        markDefs: [],
      });
    } else if (line.trim() === "" || line === "---") {
      flushParagraph();
    } else if (!line.startsWith("```")) {
      currentParagraph.push(line.trim());
    }
  }

  flushParagraph();
  return blocks;
}

// ── Collect all MD files from a directory recursively ─────────────────────────
function collectMdFiles(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir)) {
      const fullPath = join(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        files.push(...collectMdFiles(fullPath));
      } else if ((extname(entry) === ".md" || extname(entry) === ".mdx") && entry !== "CODEX_FORMAT_SPEC.md") {
        files.push(fullPath);
      }
    }
  } catch {}
  return files;
}

// ── Get or create helpCategory by title ──────────────────────────────────────
const categoryCache = {};
async function getOrCreateCategory(title) {
  if (categoryCache[title]) return categoryCache[title];

  const existing = await sanityClient.fetch(
    `*[_type == "helpCategory" && title == $title][0]._id`,
    { title }
  );

  if (existing) {
    categoryCache[title] = existing;
    return existing;
  }

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const doc = await sanityClient.create({
    _type: "helpCategory",
    title,
    slug: { _type: "slug", current: slug },
    categoryType: "articles",
    order: 99,
  });

  categoryCache[title] = doc._id;
  return doc._id;
}

// ── Import a single helpArticle MD file ───────────────────────────────────────
async function importHelpArticle(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(content);

  if (!frontmatter.slug || !frontmatter.title) {
    console.log(`  ⚠️  Skipping ${basename(filePath)} — missing slug or title`);
    return;
  }

  const categoryId = frontmatter.category
    ? await getOrCreateCategory(frontmatter.category)
    : null;

  const portableText = mdToPortableText(body);

  // Clean markdown: strip "Related Articles" section
  const cleanedMarkdown = body.split("\n").reduce((acc, line) => {
    if (line.trim() === "## Related Articles") acc.skip = true;
    if (!acc.skip) acc.lines.push(line);
    return acc;
  }, { lines: [], skip: false }).lines.join("\n").trim();

  const doc = {
    _type: "helpArticle",
    title: { _type: "localeString", en: frontmatter.title },
    slug: { _type: "slug", current: frontmatter.slug },
    summary: frontmatter.summary
      ? { _type: "localeText", en: frontmatter.summary }
      : undefined,
    content: { en: portableText },
    markdownBody: cleanedMarkdown,
    ...(categoryId ? { category: { _type: "reference", _ref: categoryId } } : {}),
  };

  // Check if article already exists
  const existing = await sanityClient.fetch(
    `*[_type == "helpArticle" && slug.current == $slug][0]._id`,
    { slug: frontmatter.slug }
  );

  if (existing) {
    await sanityClient.patch(existing).set(doc).commit();
    console.log(`  ✏️  Updated: ${frontmatter.title}`);
  } else {
    await sanityClient.create(doc);
    console.log(`  ✅ Created: ${frontmatter.title}`);
  }
}

// ── Import FAQ MD files ───────────────────────────────────────────────────────
async function importFaqFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(content);

  // Split on --- separators to get individual FAQ pairs
  const pairs = body.split(/\n---\n/).map((s) => s.trim()).filter(Boolean);

  for (const pair of pairs) {
    const qMatch = pair.match(/^### (.+)\n/);
    if (!qMatch) continue;

    const question = qMatch[1].trim();
    const answer = pair.slice(qMatch[0].length).trim();
    if (!question || !answer) continue;

    const slug = question.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
    const displayPages = Array.isArray(frontmatter.displayPages)
      ? frontmatter.displayPages
      : ["help-center"];

    const doc = {
      _type: "faqItem",
      question: { _type: "localeString", en: question },
      answer: { _type: "localeText", en: answer },
      category: frontmatter.category || "General",
      displayPages,
    };

    const existing = await sanityClient.fetch(
      `*[_type == "faqItem" && question.en == $q][0]._id`,
      { q: question }
    );

    if (existing) {
      await sanityClient.patch(existing).set(doc).commit();
      console.log(`  ✏️  FAQ updated: ${question.slice(0, 60)}...`);
    } else {
      await sanityClient.create(doc);
      console.log(`  ✅ FAQ created: ${question.slice(0, 60)}...`);
    }
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  console.log("📚 Importing Codex-generated docs into Sanity...\n");

  // Allow overriding via env var: DOCS_SOURCE_DIR=path/to/docs node scripts/import-docs-to-sanity.mjs
  const docsDir = process.env.DOCS_SOURCE_DIR || join(process.cwd(), "docs");
  const allFiles = collectMdFiles(docsDir);

  if (allFiles.length === 0) {
    console.log("❌ No MD files found in /docs/ — make sure Codex has generated them first.");
    return;
  }

  console.log(`Found ${allFiles.length} MD files to process.\n`);

  let articleCount = 0;
  let faqCount = 0;
  let skipped = 0;

  for (const filePath of allFiles) {
    const content = readFileSync(filePath, "utf-8");
    const { frontmatter } = parseFrontmatter(content);
    const fileDir = filePath.replace(/\\/g, "/");

    console.log(`Processing: ${basename(filePath)}`);

    if (frontmatter.type === "faqItem" || fileDir.includes("/faq/")) {
      await importFaqFile(filePath);
      faqCount++;
    } else if (frontmatter.type === "helpArticle" || fileDir.includes("/guides/") || fileDir.includes("/api/")) {
      await importHelpArticle(filePath);
      articleCount++;
    } else {
      console.log(`  ⚠️  Skipping — no type detected`);
      skipped++;
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Import complete!`);
  console.log(`   Help articles imported: ${articleCount}`);
  console.log(`   FAQ items imported:     ${faqCount}`);
  console.log(`   Skipped:                ${skipped}`);
  console.log(`${"=".repeat(50)}`);
}

run().catch(console.error);
