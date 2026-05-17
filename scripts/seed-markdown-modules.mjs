import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@sanity/client";

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

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toBlock(text, style = "normal") {
  return {
    _key: crypto.randomUUID(),
    _type: "block",
    style,
    children: [{ _key: crypto.randomUUID(), _type: "span", text, marks: [] }],
  };
}

async function run() {
  loadEnvFile(path.join(process.cwd(), ".env.local"));
  loadEnvFile(path.join(process.cwd(), ".env"));

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a4wk6kp5";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN in environment.");
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-04-20",
    token,
    useCdn: false,
    perspective: "published",
  });

  const mdDir = "C:\\Users\\nikhi\\OneDrive\\Documents\\Classgrid_platfrom\\classgrid_platform\\marketing_content\\modules";
  if (!fs.existsSync(mdDir)) {
    console.error("MD directory not found: ", mdDir);
    process.exit(1);
  }

  const files = fs.readdirSync(mdDir).filter(f => f.endsWith(".md"));
  console.log(`Found ${files.length} module files to process.`);

  for (const file of files) {
    const filePath = path.join(mdDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    
    // Parse Frontmatter
    let title = file.replace(".md", "");
    let subtitle = "";
    let icon = "PackageOpen";
    let category = "Advanced";
    let slugStr = "";
    
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    let bodyContent = content;
    if (fmMatch) {
      bodyContent = content.slice(fmMatch[0].length).trim();
      const fmLines = fmMatch[1].split("\n");
      for (const line of fmLines) {
        if (line.startsWith("title:")) title = line.replace("title:", "").replace(/"/g, "").trim();
        if (line.startsWith("subtitle:")) subtitle = line.replace("subtitle:", "").replace(/"/g, "").trim();
        if (line.startsWith("slug:")) slugStr = line.replace("slug:", "").replace(/"/g, "").trim();
        if (line.startsWith("icon:")) icon = line.replace("icon:", "").replace(/"/g, "").trim();
        if (line.startsWith("category:")) category = line.replace("category:", "").replace(/"/g, "").trim();
      }
    }

    // Try to extract from # Title in body first (highest priority for non-frontmatter files)
    const titleMatch = bodyContent.match(/^#\s+(.*)$/m);
    if (titleMatch && !fmMatch) {
      // Clean emoji and "MODULE:" prefix from title
      title = titleMatch[1]
        .replace(/^[^\w]*MODULE[:\s]*/i, "")
        .replace(/[^\w\s&-]/g, "")
        .trim();
    } else if (!title && titleMatch) {
      title = titleMatch[1].replace(/[^\w\s&-]/g, "").trim();
    }
    
    slugStr = slugStr || slugify(title);

    // Parse FAQS if exist (look for Q: and A:)
    const faqs = [];
    const qMatches = [...bodyContent.matchAll(/\*\*Q:\s*(.*?)\*\*\s*A:\s*(.*)/g)];
    for (const match of qMatches) {
      faqs.push({
        _key: crypto.randomUUID(),
        question: match[1].trim(),
        answer: match[2].trim()
      });
    }

    // We will dump the entire body into PortableText block array so no data is lost
    const blocks = [];
    const lines = bodyContent.split("\n");
    let inTable = false;
    let currentTableRows = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith("|") && line.endsWith("|")) {
        if (line.includes("---")) continue; // Skip separator
        const cells = line.split("|").slice(1, -1).map(c => c.trim());
        currentTableRows.push({
          _key: crypto.randomUUID(),
          cells
        });
        inTable = true;
      } else {
        if (inTable && currentTableRows.length > 0) {
          blocks.push({
            _key: crypto.randomUUID(),
            _type: "table",
            rows: currentTableRows
          });
          currentTableRows = [];
          inTable = false;
        }

        let style = "normal";
        let text = line;
        
        if (line.startsWith("### ")) { style = "h3"; text = line.substring(4); }
        else if (line.startsWith("## ")) { style = "h2"; text = line.substring(3); }
        else if (line.startsWith("# ")) { style = "h2"; text = line.substring(2); }
        else if (line.startsWith("> ")) { style = "blockquote"; text = line.substring(2); }
        else if (line.startsWith("- ") || line.startsWith("* ")) { text = line.substring(2); } // Will just dump as text to avoid nested lists complexity

        // Remove simple bold markdown for pure text if we aren't parsing marks accurately
        text = text.replace(/\*\*/g, "");

        if (!text.startsWith("Q:") && !text.startsWith("A:")) {
          blocks.push(toBlock(text, style));
        }
      }
    }

    if (inTable && currentTableRows.length > 0) {
      blocks.push({
        _key: crypto.randomUUID(),
        _type: "table",
        rows: currentTableRows
      });
    }

    const payload = {
      _id: `module-${slugStr}`,
      _type: "module",
      title: title,
      slug: { _type: "slug", current: slugStr },
      subtitle: subtitle,
      category: category,
      basicTier: ["School", "College", "Coaching", "Engineering"],
      premiumTier: ["School", "College", "Coaching", "Engineering"],
      institutionTypes: ["School", "College", "Coaching", "Engineering"],
      iconSvg: icon,
      headline: title,
      body: blocks,
      faqs: faqs.length > 0 ? faqs : undefined
    };

    console.log(`Pushing ${title} (${slugStr})...`);
    await client.createOrReplace(payload);
  }

  console.log("Successfully pushed all markdown modules to Sanity!");
}

run().catch(console.error);
