import { createClient } from "@sanity/client";
import { readFileSync, readdirSync } from "fs";
import { join, extname } from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-01",
});

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };
  const fm = {};
  for (const line of match[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1 || line.startsWith("  ")) continue;
    const key = line.slice(0, i).trim();
    let val = line.slice(i + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    fm[key] = val;
  }
  return { frontmatter: fm, body: match[2].trim() };
}

function rk() {
  return Math.random().toString(36).slice(2, 12);
}

/**
 * Strip FAQ section from body HTML to prevent duplication
 * (FAQ is extracted separately into structured faqs array)
 */
function stripFaqSection(body) {
  // Remove everything from <h2 id="faq"> onwards
  const faqIdx = body.indexOf('<h2 id="faq"');
  if (faqIdx !== -1) {
    // Also strip "best-practices" if it comes after FAQ
    return body.slice(0, faqIdx).trim();
  }
  return body;
}

/**
 * Strip metadata table and "On This Page" nav (rendered by template)
 */
function stripMetadataAndNav(body) {
  // Remove <h1> (title handled by template)
  let result = body.replace(/<h1>[\s\S]*?<\/h1>/g, "");
  // Remove metadata section
  result = result.replace(/<h2 id="metadata">[\s\S]*?(?=<h2 id=)/g, "");
  // Remove "On This Page" nav section  
  result = result.replace(/<h2 id="on-this-page">[\s\S]*?(?=<h2 id=)/g, "");
  // Remove leading <hr />
  result = result.replace(/^[\s]*<hr\s*\/?>[\s]*/g, "");
  return result.trim();
}

// Extract FAQ items from HTML
function extractFaqsFromHtml(body) {
  const faqSection = body.split('<h2 id="faq">')[1];
  if (!faqSection) return [];
  const faqs = [];
  const h3Regex = /<h3>(.*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g;
  let match;
  while ((match = h3Regex.exec(faqSection)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, "").trim();
    const answer = match[2].replace(/<[^>]+>/g, "").trim();
    if (question && answer) {
      faqs.push({
        _key: rk(),
        question: { _type: "localeString", en: question },
        answer: { _type: "localeText", en: answer },
      });
    }
  }
  return faqs;
}

// Map Codex slug → correct Sanity slug + category
const SLUG_MAP = {
  "for-schools":      { slug: "school",         category: "industry" },
  "for-colleges":     { slug: "college",         category: "industry" },
  "for-jr-colleges":  { slug: "junior-college",  category: "industry" },
  "for-coaching":     { slug: "coaching",        category: "industry" },
  "for-engineering":  { slug: "engineering",     category: "industry" },
  "for-students":     { slug: "students",        category: "role" },
  "for-teachers":     { slug: "teachers",        category: "role" },
  "for-institutes":   { slug: "institutes",      category: "role" },
};

const solutionsDir = join(
  "C:", "Users", "nikhi", "OneDrive", "Documents",
  "Classgrid_platfrom", "classgrid_platform", "solutions"
);

async function run() {
  console.log("📚 Re-importing Solutions with markdownBody (tables + no FAQ duplication)...\n");

  const files = readdirSync(solutionsDir)
    .filter(f => extname(f) === ".mdx" || extname(f) === ".md");

  console.log(`Found ${files.length} files.\n`);

  let imported = 0;
  for (const file of files) {
    const filePath = join(solutionsDir, file);
    const content = readFileSync(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);

    const codexSlug = frontmatter.slug;
    const mapping = SLUG_MAP[codexSlug];
    if (!mapping) {
      console.log(`  ⚠️ Skipping ${file} — no slug mapping`);
      continue;
    }

    const sanitySlug = mapping.slug;
    const sanityCategory = mapping.category;

    // Check if page exists
    const existing = await client.fetch(
      `*[_type == "solutionPage" && slug.current == $slug][0]._id`,
      { slug: sanitySlug }
    );

    // Clean the body: strip FAQ (to avoid duplication) + strip metadata/nav
    let cleanBody = stripFaqSection(body);
    cleanBody = stripMetadataAndNav(cleanBody);

    // Also strip "best-practices" section (it's inline text, not needed in template)
    const bpIdx = cleanBody.indexOf('<h2 id="best-practices"');
    if (bpIdx !== -1) cleanBody = cleanBody.slice(0, bpIdx).trim();

    const faqs = extractFaqsFromHtml(body);

    const doc = {
      _type: "solutionPage",
      slug: { _type: "slug", current: sanitySlug },
      category: sanityCategory,
      label: { _type: "localeString", en: frontmatter.title },
      headline: { _type: "localeString", en: frontmatter.title },
      subtitle: { _type: "localeText", en: frontmatter.description || "" },
      markdownBody: cleanBody,
      faqs: faqs,
      seo: {
        metaTitle: { _type: "localeString", en: frontmatter.seoTitle || frontmatter.title },
        metaDescription: { _type: "localeText", en: frontmatter.seoDescription || frontmatter.description },
      },
    };

    const routeType = sanityCategory === "industry" ? "industries" : "roles";

    if (existing) {
      await client.patch(existing).set(doc).commit();
      console.log(`  ✏️ Updated: ${frontmatter.title} → /solutions/${routeType}/${sanitySlug}`);
    } else {
      await client.create(doc);
      console.log(`  ✅ Created: ${frontmatter.title} → /solutions/${routeType}/${sanitySlug}`);
    }
    imported++;
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log(`✅ Imported ${imported} solution pages with full HTML tables!`);
  console.log(`   FAQ extracted separately (no duplication)`);
  console.log(`   Metadata/nav stripped (handled by template)`);
  console.log(`${"=".repeat(60)}`);
}

run().catch(console.error);
