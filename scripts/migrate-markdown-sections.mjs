import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    const targetDir = path.resolve(process.argv[1] ? path.dirname(process.argv[1]) : process.cwd(), "..");
    const fp = path.join(targetDir, f);
    if (!fs.existsSync(fp)) continue;
    for (const line of fs.readFileSync(fp, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq <= 0) continue;
      const k = t.slice(0, eq).trim();
      const v = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!(k in process.env)) process.env[k] = v;
    }
  }
}

loadEnv();
const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-04-20",
  useCdn: false,
  token: "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
});

function parseMarkdownToSections(markdown) {
  if (!markdown) return [];
  
  // Regex to match "## Heading" and everything up to the next "## Heading"
  const h2Regex = /(?:^|\n)##\s+(.*?)\n([\s\S]*?)(?=(?:\n##\s+)|$)/g;
  
  const sections = [];
  let match;
  
  // If there's text BEFORE the first ## heading, we should capture it
  const firstHeadingIndex = markdown.indexOf("## ");
  if (firstHeadingIndex > 0) {
    const introContent = markdown.slice(0, firstHeadingIndex).trim();
    if (introContent) {
      sections.push({
        _key: Math.random().toString(36).substring(2, 9),
        heading: "Overview",
        content: introContent
      });
    }
  } else if (firstHeadingIndex === -1 && markdown.trim()) {
    // No headings at all
    sections.push({
      _key: Math.random().toString(36).substring(2, 9),
      heading: "Overview",
      content: markdown.trim()
    });
    return sections;
  }

  while ((match = h2Regex.exec(markdown)) !== null) {
    // Clean up heading (remove bolding)
    let heading = match[1].trim();
    heading = heading.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');
    
    const content = match[2].trim();
    
    sections.push({
      _key: Math.random().toString(36).substring(2, 9),
      heading,
      content
    });
  }
  
  return sections;
}

async function run() {
  console.log("Fetching solution pages...");
  const pages = await client.fetch(`*[_type == "solutionPage"]`);
  
  console.log(`Found ${pages.length} solution pages.`);

  let patchedCount = 0;
  for (const page of pages) {
    // If it already has sections, skip it (unless we want to overwrite, but let's be safe)
    if (page.markdownSections && page.markdownSections.length > 0) {
      console.log(`Skipping "${page.slug?.current}" (already has markdownSections)`);
      continue;
    }

    const sections = parseMarkdownToSections(page.markdownBody);
    
    if (sections.length > 0) {
      console.log(`Migrating "${page.slug?.current}"... (Found ${sections.length} sections)`);
      
      await client.patch(page._id)
        .set({ markdownSections: sections })
        // We will NOT unset markdownBody just yet, as a safe fallback
        .commit();
        
      patchedCount++;
    } else {
      console.log(`Skipping "${page.slug?.current}" (No headings found)`);
    }
  }

  console.log(`\n✅ Migration complete! Patched ${patchedCount} pages.`);
}

run().catch(console.error);
