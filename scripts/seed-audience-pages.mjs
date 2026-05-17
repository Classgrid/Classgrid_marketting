import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@sanity/client";

function loadEnv() {
  for (const f of [".env.local", ".env"]) {
    const fp = path.join(process.cwd(), f);
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

const uuid = () => crypto.randomUUID();

function block(text, style = "normal") {
  return {
    _key: uuid(), _type: "block", style,
    children: [{ _key: uuid(), _type: "span", text: text.replace(/\*\*/g, "").replace(/`/g, ""), marks: [] }],
    markDefs: []
  };
}

function boldBlock(text) {
  return {
    _key: uuid(), _type: "block", style: "normal",
    children: [{ _key: uuid(), _type: "span", text: text.replace(/\*\*/g, "").replace(/`/g, ""), marks: ["strong"] }],
    markDefs: []
  };
}

function parseTableFromLines(lines) {
  const rows = [];
  for (const line of lines) {
    if (!line.trim().startsWith("|")) break;
    if (line.includes("---")) continue;
    const cells = line.split("|").slice(1, -1).map(c => c.trim().replace(/\*\*/g, "").replace(/`/g, ""));
    if (cells.length > 0 && cells.some(c => c)) {
      rows.push({ _key: uuid(), cells });
    }
  }
  return rows.length >= 2 ? { _key: uuid(), _type: "table", rows } : null;
}

// Parse MD into structured Sanity doc fields
function parsePage(content) {
  const lines = content.split("\n");

  // --- Extract headline from SECTION 1 HERO ---
  let headline = "";
  let subtitle = "";
  // Look for `> **"..."**` pattern in SECTION 1
  const heroSection = content.match(/## SECTION 1[^\n]*\n([\s\S]*?)(?=\n## SECTION)/);
  if (heroSection) {
    const heroText = heroSection[1];
    const h = heroText.match(/>\s*\*\*"?(.+?)"?\*\*/);
    if (h) headline = h[1].trim().replace(/^"|"$/g, "");
    // Sub-headline: the paragraph text after ### Sub-headline
    const sub = heroText.match(/### Sub-headline\n([\s\S]*?)(?=\n###|\n---|\n##|$)/);
    if (sub) subtitle = sub[1].replace(/\n/g, " ").trim();
  }
  // Fallback: H1 title
  if (!headline) {
    const h1 = content.match(/^#\s+(.+)/m);
    if (h1) headline = h1[1].replace(/[🏫🎓🎯⚙️👨‍🎓👩‍🎓🏢]/g, "").trim();
  }

  // --- Extract PAGE METADATA ---
  let metaTitle = "";
  let metaDesc = "";
  const metaSection = content.match(/## PAGE METADATA\n([\s\S]*?)(?=\n---)/);
  if (metaSection) {
    const mt = metaSection[1].match(/\*\*Page Title:\*\*\s*(.+)/);
    if (mt) metaTitle = mt[1].trim();
    const md = metaSection[1].match(/\*\*Meta Description:\*\*\s*([\s\S]*?)(?=\n-|\n\*\*|$)/);
    if (md) metaDesc = md[1].replace(/\n/g, " ").trim();
  }

  // --- Extract Trust badges from SECTION 1 ---
  const trustBadges = [];
  if (heroSection) {
    const badgeMatches = [...heroSection[1].matchAll(/[-*]\s*✅\s*(.+)/g)];
    for (const m of badgeMatches) trustBadges.push(m[1].trim());
  }

  // --- Extract Capabilities from SECTION 3 / Module cards ---
  const capabilities = [];

  // Look for ### 3.X or ### X.X headings = module names
  const modPattern = /###\s+[\d.]+\s+[^\n]*\n[\s\S]*?(?=###\s+[\d.]|## SECTION|$)/g;
  let modMatch;
  while ((modMatch = modPattern.exec(content)) !== null) {
    const block = modMatch[0];
    const titleM = block.match(/###\s+[\d.]+\s+[^\n]*\n/);
    if (!titleM) continue;
    const featureTitle = titleM[0].replace(/###\s+[\d.]+\s+/, "").replace(/[^\w\s]/g, "").trim();
    // First bullet point as description
    const bullets = [...block.matchAll(/^-\s+\*\*(.+?)\*\*[:\s]*(.+)/gm)];
    if (bullets.length > 0) {
      const desc = bullets.slice(0, 2).map(b => `${b[1]}: ${b[2].replace(/\*\*/g, "")}`).join(". ");
      capabilities.push({ _key: uuid(), feature: featureTitle, description: desc.slice(0, 200) });
    } else {
      // simple paragraph
      const paras = block.replace(titleM[0], "").split("\n").filter(l => l.trim() && !l.startsWith("#") && !l.startsWith("|")).slice(0, 1);
      if (paras.length) {
        capabilities.push({ _key: uuid(), feature: featureTitle, description: paras[0].replace(/\*\*/g, "").replace(/`/g, "").trim().slice(0, 200) });
      }
    }
  }

  // SECTION 9 copy snippets as capabilities if above is sparse
  const section9 = content.match(/## SECTION 9[^\n]*\n([\s\S]*?)(?=\n## SECTION|$)/);
  if (section9 && capabilities.length < 3) {
    const snippets = [...section9[1].matchAll(/\*\*(.+?)\*\*\n-\s*Title:\s*"?(.+?)"?\n-\s*Body:\s*([\s\S]*?)(?=\n\*\*|\n---|\n##|$)/g)];
    for (const s of snippets) {
      capabilities.push({ _key: uuid(), feature: s[2].trim(), description: s[3].trim().replace(/\n/g, " ").slice(0, 250) });
    }
  }

  // --- Extract Problem/Solution table from SECTION 2 ---
  const probSolPairs = [];
  const sec2 = content.match(/## SECTION 2[^\n]*\n([\s\S]*?)(?=\n## SECTION)/);
  if (sec2) {
    const tableLines = sec2[1].split("\n").filter(l => l.trim().startsWith("|"));
    for (const line of tableLines) {
      if (line.includes("---") || line.includes("Old Way")) continue;
      const cells = line.split("|").slice(1, -1).map(c => c.trim().replace(/[❌✅]/g, "").replace(/\*\*/g, "").trim());
      if (cells.length >= 2 && cells[0] && cells[1]) {
        probSolPairs.push({ problem: cells[0], solution: cells[1] });
      }
    }
  }

  // --- Build body PortableText: Introduction + key sections ---
  const bodyBlocks = [];

  // Hero subtitle as intro paragraph
  if (subtitle) bodyBlocks.push(block(subtitle));

  // SECTION 3 heading
  bodyBlocks.push(block("Core Platform Capabilities", "h2"));
  for (const cap of capabilities.slice(0, 6)) {
    bodyBlocks.push(block(cap.feature, "h3"));
    if (cap.description) bodyBlocks.push(block(cap.description));
  }

  // Plans table if exists
  const plansSection = content.match(/## SECTION 4[^\n]*\n([\s\S]*?)(?=\n## SECTION)/);
  if (plansSection) {
    const tableLines = plansSection[1].split("\n").filter(l => l.trim().startsWith("|"));
    if (tableLines.length >= 3) {
      bodyBlocks.push(block("Subscription Plans", "h2"));
      const tableRows = [];
      for (const line of tableLines) {
        if (line.includes("---")) continue;
        const cells = line.split("|").slice(1, -1).map(c => c.trim().replace(/\*\*/g, ""));
        if (cells.some(c => c)) tableRows.push({ _key: uuid(), cells });
      }
      if (tableRows.length >= 2) bodyBlocks.push({ _key: uuid(), _type: "table", rows: tableRows });
    }
  }

  // Security section
  const sec7 = content.match(/## SECTION 7[^\n]*\n([\s\S]*?)(?=\n## SECTION)/);
  if (sec7) {
    bodyBlocks.push(block("Security & Multi-Tenancy", "h2"));
    const bullets = [...sec7[1].matchAll(/^-\s+\*\*(.+?)\*\*:\s*(.+)/gm)];
    for (const b of bullets.slice(0, 4)) {
      bodyBlocks.push(block(`${b[1]}: ${b[2].replace(/\*\*/g, "").replace(/`/g, "")}`, "normal"));
    }
  }

  // --- Extract FAQs ---
  const faqs = [];
  const faqSection = content.match(/## SECTION 10[^\n]*\n([\s\S]*?)(?=\n---\n\*End|$)/);
  const faqText = faqSection ? faqSection[1] : content;
  // Pattern: **Q: ...** \nA: ...
  const faqRe = /\*\*Q:\s*(.*?)\*\*\n+A:\s*([\s\S]*?)(?=\n\*\*Q:|\n---|\n##|$)/g;
  let fm;
  while ((fm = faqRe.exec(faqText)) !== null) {
    faqs.push({ _key: uuid(), question: fm[1].trim(), answer: fm[2].trim().replace(/\n/g, " ").replace(/\*\*/g, "").replace(/`/g, "") });
  }

  // --- Extract Role Experiences ---
  const roleExperiences = [
    { _key: uuid(), roleName: "Administrator / Principal", description: "Full operational visibility across attendance, fees, results, and all department workflows from a single unified dashboard." },
    { _key: uuid(), roleName: "Faculty / Teachers", description: "Manage attendance sessions, assignments, timetables, and student communication without switching between tools." },
    { _key: uuid(), roleName: "Students", description: "Access results, assignments, timetables, library, and real-time notifications from the Classgrid mobile app." },
    { _key: uuid(), roleName: "Parents", description: "Receive push notifications and emails for attendance, fees, results, and school events in real-time." },
  ];

  // --- Marketing block ---
  const marketing = {
    headline: headline || "The Complete Platform for Your Institution",
    body: subtitle || "One unified platform for all your institutional workflows.",
    highlights: trustBadges.length ? trustBadges.slice(0, 5) : capabilities.slice(0, 4).map(c => c.feature),
  };

  return { headline, subtitle, metaTitle, metaDesc, capabilities, probSolPairs, bodyBlocks, faqs, roleExperiences, marketing };
}

const MD_DIR = "C:\\Users\\nikhi\\OneDrive\\Documents\\Classgrid_platfrom\\classgrid_platform\\marketing_content";

const INDUSTRY_FILES = [
  { file: "01_SCHOOLS_PAGE.md",     institutionType: "school",         label: "For Schools" },
  { file: "02_COLLEGES_PAGE.md",    institutionType: "college",        label: "For Colleges" },
  { file: "03_JR_COLLEGES_PAGE.md", institutionType: "junior-college", label: "For Jr Colleges" },
  { file: "04_COACHING_PAGE.md",    institutionType: "coaching",       label: "For Coaching" },
  { file: "05_ENGINEERING_PAGE.md", institutionType: "engineering",    label: "For Engineering" },
];

const ROLE_FILES = [
  { file: "06_STUDENTS_PAGE.md",   audience: "students",   label: "For Students" },
  { file: "07_TEACHERS_PAGE.md",   audience: "teachers",   label: "For Teachers" },
  { file: "08_INSTITUTES_PAGE.md", audience: "institutes", label: "For Institutes" },
];

async function run() {
  loadEnv();
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a4wk6kp5";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!token) throw new Error("Missing SANITY_API_WRITE_TOKEN");

  const client = createClient({ projectId, dataset, apiVersion: "2026-04-20", token, useCdn: false });

  for (const { file, institutionType, label } of INDUSTRY_FILES) {
    const fp = path.join(MD_DIR, file);
    if (!fs.existsSync(fp)) { console.warn(`SKIP: ${file}`); continue; }
    const content = fs.readFileSync(fp, "utf8");
    const { headline, subtitle, metaTitle, metaDesc, capabilities, bodyBlocks, faqs, roleExperiences, marketing } = parsePage(content);

    const doc = {
      _id: `institutionPage-${institutionType}`,
      _type: "institutionPage",
      institutionType,
      label,
      headline: headline || label,
      subtitle: subtitle || `The complete ERP platform built for ${label.replace("For ", "")}.`,
      subline: subtitle,
      body: bodyBlocks,
      capabilities: capabilities.slice(0, 9),
      roleExperiences,
      marketing,
      faqs: faqs.length ? faqs : [
        { _key: uuid(), question: `Is Classgrid suitable for ${label.replace("For ", "")}?`, answer: "Yes — Classgrid is built specifically for this institution type with purpose-built workflows." },
        { _key: uuid(), question: "How long does onboarding take?", answer: "Most institutions go live within 2–4 weeks with dedicated support." },
        { _key: uuid(), question: "Can we migrate existing data?", answer: "Yes, structured data migration from Excel and legacy systems is fully supported." },
      ],
      seo: {
        metaTitle: metaTitle || `${headline || label} | Classgrid`,
        metaDescription: metaDesc || subtitle || `Classgrid ERP for ${label.replace("For ", "")}.`,
      },
    };

    console.log(`[industry] → ${label}`);
    await client.createOrReplace(doc);
    console.log(`[industry] ✅ ${label} — ${capabilities.length} capabilities, ${faqs.length} FAQs`);
  }

  for (const { file, audience, label } of ROLE_FILES) {
    const fp = path.join(MD_DIR, file);
    if (!fs.existsSync(fp)) { console.warn(`SKIP: ${file}`); continue; }
    const content = fs.readFileSync(fp, "utf8");
    const { headline, subtitle, metaTitle, metaDesc, capabilities, bodyBlocks, faqs, roleExperiences, marketing } = parsePage(content);

    const doc = {
      _id: `useCasePage-${audience}`,
      _type: "useCasePage",
      audience,
      headline: headline || label,
      subtitle: subtitle,
      subheadline: subtitle,
      cta: "See How It Works",
      body: bodyBlocks,
      capabilities: capabilities.slice(0, 9),
      roleExperiences,
      marketing,
      faqs: faqs.length ? faqs : [
        { _key: uuid(), question: `How does Classgrid help ${label.replace("For ", "")}?`, answer: "Classgrid unifies all your workflows into a single, easy-to-use platform built for your role." },
        { _key: uuid(), question: "Is it available on mobile?", answer: "Yes — Classgrid is fully mobile-first with native Android and iOS support." },
      ],
      seo: {
        metaTitle: metaTitle || `${headline || label} | Classgrid`,
        metaDescription: metaDesc || subtitle || `Classgrid ${label}.`,
      },
    };

    console.log(`[role] → ${label}`);
    await client.createOrReplace(doc);
    console.log(`[role] ✅ ${label} — ${capabilities.length} capabilities, ${faqs.length} FAQs`);
  }

  console.log("\n🎉 All 8 pages seeded with full structured content!");
}

run().catch(console.error);
