#!/usr/bin/env node

/**
 * Classgrid Sanity Markdown Uploader
 *
 * Usage examples:
 *   node sanity_uploader.js --dir "C:\\path\\to\\docs" --schema legalPage
 *   node sanity_uploader.js --dir "./docs" --schema policyPage --dry-run
 *   node sanity_uploader.js --dir "./content/marketing-md" --schema marketingPageType
 */

const fs = require("fs");
const path = require("path");
const { createClient } = require("@sanity/client");

const DEFAULT_PROJECT_ID = "a4wk6kp5";
const DEFAULT_DATASET = "production";
const DEFAULT_DOCS_DIR =
  "C:\\Users\\nikhi\\OneDrive\\Documents\\Classgrid_platfrom\\classgrid_platform\\docs";
const KNOWN_LEGAL_SLUGS = new Set(["privacy", "terms", "security", "cookies", "disclaimer"]);
const KNOWN_POLICY_TYPES = new Set(["privacy", "terms", "security", "cookie"]);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const part = argv[i];
    if (!part.startsWith("--")) continue;
    const key = part.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

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

function normalizeNewlines(value) {
  return value.replace(/\r\n/g, "\n").replace(/\uFEFF/g, "");
}

function sanitizeText(value) {
  return value
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
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

function stripMarkdown(value) {
  return value
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .trim();
}

function parseDateToISO(raw) {
  if (!raw) return new Date().toISOString();

  const cleaned = raw
    .replace(/\*/g, "")
    .replace(/^last\s+updated\s*:/i, "")
    .replace(/^effective\s+date\s*:/i, "")
    .trim();

  // dd-mm-yyyy or dd/mm/yyyy
  const dmy = cleaned.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) {
    const day = dmy[1].padStart(2, "0");
    const month = dmy[2].padStart(2, "0");
    const year = dmy[3];
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
  }

  const parsed = new Date(cleaned);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return new Date().toISOString();
}

function findLastUpdated(lines) {
  for (const line of lines) {
    const normalized = sanitizeText(line);
    if (/last\s+updated\s*:/i.test(normalized)) {
      return parseDateToISO(normalized);
    }
  }
  return new Date().toISOString();
}

function getTitle(lines, fallbackName) {
  for (const line of lines) {
    const match = sanitizeText(line).match(/^#\s+(.+)$/);
    if (match) return sanitizeText(match[1]);
  }
  const plain = fallbackName.replace(/[-_]+/g, " ").replace(/\.md$/i, "");
  return plain.replace(/\b\w/g, (c) => c.toUpperCase());
}

function createKeyFactory() {
  let i = 0;
  return (prefix) => `${prefix}-${++i}`;
}

function sanitizeInlineText(value) {
  return value
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/"""/g, '"')
    .replace(/'''/g, "'")
    .trim();
}

function pushSpan(children, nextKey, text, marks = []) {
  const safeText = text.replace(/"""/g, '"').replace(/'''/g, "'");
  if (!safeText) return;
  children.push({
    _key: nextKey("span"),
    _type: "span",
    text: safeText,
    marks: marks.length ? [...marks] : [],
  });
}

function parseStrongEmphasisSegment(segment, baseMarks, children, nextKey) {
  // Robust bold regex: handles escaped stars and nested single stars inside **...**
  const strongRegex = /\*\*((?:\\\*|[^*]|\*(?!\*))*)\*\*/g;
  let cursor = 0;
  let match;

  while ((match = strongRegex.exec(segment)) !== null) {
    const before = segment.slice(cursor, match.index);
    if (before) pushSpan(children, nextKey, before, baseMarks);

    const strongText = (match[1] || "").replace(/\\\*/g, "*");
    if (strongText) pushSpan(children, nextKey, strongText, [...baseMarks, "strong"]);
    cursor = match.index + match[0].length;
  }

  const after = segment.slice(cursor);
  if (after) pushSpan(children, nextKey, after, baseMarks);
}

function parseInlineMarkdown(text, nextKey) {
  const children = [];
  const markDefs = [];
  const input = sanitizeInlineText(text);
  const linkRegex = /\[([^\]]+)\]\(([^)\s]+(?:\s+"[^"]*")?)\)/g;
  let cursor = 0;
  let match;

  while ((match = linkRegex.exec(input)) !== null) {
    const before = input.slice(cursor, match.index);
    if (before) parseStrongEmphasisSegment(before, [], children, nextKey);

    const linkText = match[1] || "";
    const href = (match[2] || "").split(/\s+"/)[0].trim();
    const linkKey = nextKey("link");
    markDefs.push({
      _key: linkKey,
      _type: "link",
      href,
    });

    parseStrongEmphasisSegment(linkText, [linkKey], children, nextKey);
    cursor = match.index + match[0].length;
  }

  const after = input.slice(cursor);
  if (after) parseStrongEmphasisSegment(after, [], children, nextKey);

  if (!children.length) {
    children.push({
      _key: nextKey("span"),
      _type: "span",
      text: "",
      marks: [],
    });
  }

  return { children, markDefs };
}

function makeBlock(style, text, nextKey, extra = {}) {
  const inline = parseInlineMarkdown(text, nextKey);
  return {
    _key: nextKey("block"),
    _type: "block",
    style,
    markDefs: inline.markDefs,
    children: inline.children,
    ...extra,
  };
}

function splitPipeRow(row) {
  let body = row.trim();
  if (body.startsWith("|")) body = body.slice(1);
  if (body.endsWith("|")) body = body.slice(0, -1);

  const cells = [];
  let current = "";
  let escaped = false;

  for (let i = 0; i < body.length; i += 1) {
    const char = body[i];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      escaped = true;
      continue;
    }

    if (char === "|") {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells.map((cell) => sanitizeInlineText(stripMarkdown(cell)));
}

function isTableDividerLine(line) {
  let body = line.trim();
  if (!body.includes("|")) return false;
  if (body.startsWith("|")) body = body.slice(1);
  if (body.endsWith("|")) body = body.slice(0, -1);

  const columns = body.split("|").map((part) => part.trim());
  if (!columns.length) return false;
  return columns.every((part) => /^:?-{3,}:?$/.test(part));
}

function parseMarkdownTable(lines, startIndex, nextKey) {
  const tableLines = [];
  let i = startIndex;

  while (i < lines.length) {
    const candidate = lines[i].trim();
    if (!candidate) break;
    if (!candidate.startsWith("|")) break;
    tableLines.push(candidate);
    i += 1;
  }

  if (tableLines.length < 2 || !isTableDividerLine(tableLines[1])) {
    return { nextIndex: startIndex, table: null };
  }

  const headers = splitPipeRow(tableLines[0]);
  const rawRows = tableLines.slice(2).map(splitPipeRow);
  const maxColumns = Math.max(headers.length, ...rawRows.map((row) => row.length));

  const normalizedHeaders = [...headers];
  while (normalizedHeaders.length < maxColumns) normalizedHeaders.push("");

  const rows = rawRows.map((cells) => {
    const normalizedCells = [...cells];
    while (normalizedCells.length < maxColumns) normalizedCells.push("");

    return {
      _key: nextKey("row"),
      cells: normalizedCells.map((cell) => cell.replace(/"""/g, '"')),
    };
  });

  return {
    nextIndex: i,
    table: {
      _key: nextKey("table"),
      _type: "legalTable",
      headers: normalizedHeaders.map((header) => header.replace(/"""/g, '"')),
      rows,
    },
  };
}

function parseMarkdownToPortableText(markdown) {
  const nextKey = createKeyFactory();
  const lines = normalizeNewlines(markdown).split("\n");
  const blocks = [];
  let paragraphLines = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    const text = sanitizeInlineText(paragraphLines.join(" "));
    if (!text) return;
    blocks.push(makeBlock("normal", text, nextKey));
    paragraphLines = [];
  };

  let i = 0;
  while (i < lines.length) {
    const raw = normalizeNewlines(lines[i]);
    const trimmed = raw.trim();

    if (!trimmed || /^---+$/.test(trimmed)) {
      flushParagraph();
      i += 1;
      continue;
    }

    if (/^#\s+/.test(trimmed)) {
      flushParagraph();
      i += 1;
      continue;
    }

    if (trimmed.startsWith("|") && i + 1 < lines.length && isTableDividerLine(lines[i + 1].trim())) {
      flushParagraph();
      const parsedTable = parseMarkdownTable(lines, i, nextKey);
      if (parsedTable.table) {
        blocks.push(parsedTable.table);
        i = parsedTable.nextIndex;
        continue;
      }
    }

    if (/^```/.test(trimmed)) {
      flushParagraph();
      const fence = trimmed.match(/^```(\w+)?/)?.[1] || "";
      const codeLines = [];
      i += 1;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length && /^```/.test(lines[i].trim())) i += 1;
      const codeText = codeLines.join("\n").replace(/"""/g, '"').replace(/'''/g, "'");
      blocks.push({
        _key: nextKey("code"),
        _type: "code",
        language: fence || "text",
        code: codeText,
      });
      continue;
    }

    const h2 = trimmed.match(/^##\s+(.+)$/);
    if (h2) {
      flushParagraph();
      blocks.push(makeBlock("h2", sanitizeInlineText(h2[1]), nextKey));
      i += 1;
      continue;
    }

    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h3) {
      flushParagraph();
      blocks.push(makeBlock("h3", sanitizeInlineText(h3[1]), nextKey));
      i += 1;
      continue;
    }

    const h4 = trimmed.match(/^####\s+(.+)$/);
    if (h4) {
      flushParagraph();
      blocks.push(makeBlock("h4", sanitizeInlineText(h4[1]), nextKey));
      i += 1;
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      flushParagraph();
      let j = i;
      while (j < lines.length) {
        const candidate = lines[j].trim();
        if (!candidate || !/^[-*+]\s+/.test(candidate)) break;
        const itemText = sanitizeInlineText(candidate.replace(/^[-*+]\s+/, ""));
        if (itemText) {
          blocks.push(
            makeBlock("normal", itemText, nextKey, {
              listItem: "bullet",
              level: 1,
            })
          );
        }
        j += 1;
      }
      i = j;
      continue;
    }

    if (/^\d+[\.\)]\s+/.test(trimmed)) {
      flushParagraph();
      let j = i;
      while (j < lines.length) {
        const candidate = lines[j].trim();
        if (!candidate || !/^\d+[\.\)]\s+/.test(candidate)) break;
        const itemText = sanitizeInlineText(candidate.replace(/^\d+[\.\)]\s+/, ""));
        if (itemText) {
          blocks.push(
            makeBlock("normal", itemText, nextKey, {
              listItem: "number",
              level: 1,
            })
          );
        }
        j += 1;
      }
      i = j;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      blocks.push(makeBlock("blockquote", sanitizeInlineText(trimmed.replace(/^>\s?/, "")), nextKey));
      i += 1;
      continue;
    }

    paragraphLines.push(trimmed.replace(/"""/g, '"').replace(/'''/g, "'"));
    i += 1;
  }

  flushParagraph();
  return blocks;
}

function parsePortableBlocks(markdown) {
  return parseMarkdownToPortableText(markdown);
}

function extractIntroAndSections(markdown) {
  const lines = normalizeNewlines(markdown).split("\n");
  const firstNumberedSection = lines.findIndex((line) =>
    /^##\s*1[\.\)]?\s+/.test(sanitizeText(line))
  );
  const firstSection = lines.findIndex((line) => /^##\s+/.test(sanitizeText(line)));
  const splitAt = firstNumberedSection >= 0 ? firstNumberedSection : firstSection;
  const prefaceLines = splitAt >= 0 ? lines.slice(0, splitAt) : lines.slice();
  const sectionLines = splitAt >= 0 ? lines.slice(splitAt) : [];

  const introParagraphs = [];
  let paragraphBuffer = [];
  const flushIntroParagraph = () => {
    if (!paragraphBuffer.length) return;
    const text = sanitizeText(paragraphBuffer.join(" "));
    if (text) introParagraphs.push(stripMarkdown(text));
    paragraphBuffer = [];
  };

  for (const rawLine of prefaceLines) {
    const line = sanitizeText(rawLine);
    if (!line || /^---+$/.test(line)) {
      flushIntroParagraph();
      continue;
    }

    if (/^#\s+/.test(line)) continue;
    if (/^##\s+/.test(line)) {
      flushIntroParagraph();
      continue;
    }
    if (/last\s+updated\s*:/i.test(line) || /effective\s+date\s*:/i.test(line)) continue;

    paragraphBuffer.push(line);
  }
  flushIntroParagraph();

  const sections = [];
  let currentTitle = "";
  let currentBody = [];

  const flushSection = () => {
    if (!currentTitle) return;
    const content = parsePortableBlocks(currentBody.join("\n"));
    sections.push({
      _key: `section-${sections.length + 1}`,
      id: slugify(currentTitle.replace(/^\d+[\.\)]?\s*/, "")) || `section-${sections.length + 1}`,
      title: currentTitle,
      content,
    });
  };

  for (const rawLine of sectionLines) {
    const line = sanitizeText(rawLine);
    const sectionMatch = line.match(/^##\s+(.+)$/);
    if (sectionMatch) {
      flushSection();
      currentTitle = sanitizeText(sectionMatch[1]);
      currentBody = [];
      continue;
    }
    currentBody.push(rawLine);
  }
  flushSection();

  return {
    introParagraphs,
    sections,
  };
}

function deriveLegalSlug(baseName, title) {
  const source = `${baseName} ${title}`.toLowerCase();
  if (source.includes("privacy")) return "privacy";
  if (source.includes("terms")) return "terms";
  if (source.includes("security")) return "security";
  if (source.includes("cookie")) return "cookies";
  if (source.includes("disclaimer")) return "disclaimer";
  return slugify(baseName);
}

function derivePolicyType(baseName, title) {
  const source = `${baseName} ${title}`.toLowerCase();
  if (source.includes("privacy")) return "privacy";
  if (source.includes("terms")) return "terms";
  if (source.includes("security")) return "security";
  if (source.includes("cookie")) return "cookie";
  return null;
}

function buildLegalDocument({ markdown, filePath }) {
  const lines = normalizeNewlines(markdown).split("\n");
  const baseName = path.basename(filePath, path.extname(filePath));
  const title = getTitle(lines, baseName);
  const slug = deriveLegalSlug(baseName, title);
  const lastUpdatedISO = findLastUpdated(lines);
  const extracted = extractIntroAndSections(markdown);

  return {
    __derivedSlug: slug,
    _id: `legal-${slug}`,
    _type: "legalPage",
    title,
    slug: { _type: "slug", current: slug },
    lastUpdated: lastUpdatedISO,
    effectiveDate: lastUpdatedISO,
    intro: {
      introductionHeading: "Introduction",
      introductionBody: extracted.introParagraphs.join("\n\n"),
      scopeHeading: "Scope",
      scopeBody: "",
    },
    sections: extracted.sections,
  };
}

function buildSolutionPageDocument({ markdown, filePath }) {
  const lines = normalizeNewlines(markdown).split("\n");
  const baseName = path.basename(filePath, path.extname(filePath));
  const meta = CONTENT_MAP[baseName];
  const slug = meta ? meta.slug : slugify(baseName);
  const headline = meta ? meta.headline : getTitle(lines, baseName);
  const label = meta ? meta.label : headline;
  const category = meta ? meta.category : "industry";
  const blocks = parsePortableBlocks(markdown);

  return {
    _id: `solutionPage-${slug}`,
    _type: "solutionPage",
    slug: { _type: "slug", current: slug },
    category: category,
    label: label,
    headline: headline,
    body: blocks,
  };
}

function buildPolicyDocument({ markdown, filePath }) {
  const lines = normalizeNewlines(markdown).split("\n");
  const baseName = path.basename(filePath, path.extname(filePath));
  const title = getTitle(lines, baseName);
  const derivedPolicyType = derivePolicyType(baseName, title);
  const pageType = derivedPolicyType || "privacy";
  const lastUpdatedISO = findLastUpdated(lines);
  const extracted = extractIntroAndSections(markdown);
  const fullContentBlocks = parsePortableBlocks(markdown);
  const toc = extracted.sections.map((section) => ({
    _key: `toc-${section.id}`,
    title: section.title,
    anchor: section.id,
  }));

  return {
    __derivedPolicyType: derivedPolicyType,
    _id: `policy-${pageType}`,
    _type: "policyPage",
    pageType,
    headline: title,
    lastUpdated: lastUpdatedISO,
    content: fullContentBlocks,
    sections: toc,
    seo: {
      metaTitle: title,
      metaDescription: stripMarkdown(extracted.introParagraphs.join(" ")).slice(0, 170),
      slug: pageType === "cookie" ? "cookies" : pageType,
    },
  };
}

function buildGenericMarketingDocument({ markdown, filePath, schemaType }) {
  const lines = normalizeNewlines(markdown).split("\n");
  const baseName = path.basename(filePath, path.extname(filePath));
  const title = getTitle(lines, baseName);
  const slug = slugify(baseName);
  const blocks = parsePortableBlocks(markdown);

  return {
    _id: `${schemaType}-${slug}`,
    _type: schemaType,
    title,
    headline: title,
    slug: { _type: "slug", current: slug },
    content: blocks,
  };
}

const CONTENT_MAP = {
  "01_SCHOOLS_PAGE": {
    slug: "school",
    label: "For Schools",
    headline: "The Operating System for Modern Schools",
    category: "industry",
  },
  "02_COLLEGES_PAGE": {
    slug: "college",
    label: "For Colleges",
    headline: "The Digital Campus for Higher Education",
    category: "industry",
  },
  "03_JR_COLLEGES_PAGE": {
    slug: "junior-college",
    label: "For Jr Colleges",
    headline: "Built Specifically for Junior Colleges",
    category: "industry",
  },
  "04_COACHING_PAGE": {
    slug: "coaching",
    label: "For Coaching",
    headline: "The Ultimate Platform for Coaching Institutes",
    category: "industry",
  },
  "05_ENGINEERING_PAGE": {
    slug: "engineering",
    label: "For Engineering",
    headline: "Built for the Complexity of Engineering Colleges",
    category: "industry",
  },
  "06_STUDENTS_PAGE": {
    slug: "students",
    label: "For Students",
    headline: "Your Entire Academic Life. One App.",
    category: "role",
  },
  "07_TEACHERS_PAGE": {
    slug: "teachers",
    label: "For Teachers",
    headline: "Less Admin Work. More Time to Actually Teach.",
    category: "role",
  },
  "08_INSTITUTES_PAGE": {
    slug: "institutes",
    label: "For Institutes",
    headline: "Enterprise Control for Your Entire Institution",
    category: "role",
  },
};


// Keep FILE_MAP as a fallback for slug-only resolution
const FILE_MAP = Object.fromEntries(
  Object.entries(CONTENT_MAP).map(([k, v]) => [k, v.slug])
);

function buildUseCaseDocument({ markdown, filePath }) {
  const lines = normalizeNewlines(markdown).split("\n");
  const baseName = path.basename(filePath, path.extname(filePath));
  const meta = CONTENT_MAP[baseName];
  const audience = meta ? meta.slug : (FILE_MAP[baseName] || baseName.toLowerCase());
  const headline = meta ? meta.headline : getTitle(lines, baseName);
  const label = meta ? meta.label : headline;
  const blocks = parsePortableBlocks(markdown);

  return {
    _id: `useCasePage-${audience}`,
    _type: "useCasePage",
    audience: audience,
    label: label,
    headline: headline,
    slug: { _type: "slug", current: audience },
    body: blocks,
  };
}

function buildInstitutionDocument({ markdown, filePath }) {
  const lines = normalizeNewlines(markdown).split("\n");
  const baseName = path.basename(filePath, path.extname(filePath));
  const meta = CONTENT_MAP[baseName];
  const instType = meta ? meta.slug : (FILE_MAP[baseName] || baseName.toLowerCase());
  const headline = meta ? meta.headline : getTitle(lines, baseName);
  const label = meta ? meta.label : headline;
  const blocks = parsePortableBlocks(markdown);

  return {
    _id: `institutionPage-${instType}`,
    _type: "institutionPage",
    institutionType: instType,
    label: label,
    headline: headline,
    slug: { _type: "slug", current: instType },
    body: blocks,
  };
}

function collectMarkdownFiles(targetDir) {
  const files = [];
  const entries = fs.readdirSync(targetDir, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectMarkdownFiles(absolutePath));
      continue;
    }
    if (/\.md$/i.test(entry.name)) files.push(absolutePath);
  }

  return files.sort((a, b) => a.localeCompare(b));
}

async function run() {
  const args = parseArgs(process.argv.slice(2));

  loadEnvFile(path.join(process.cwd(), ".env.local"));
  loadEnvFile(path.join(process.cwd(), ".env"));

  const projectId = args.projectId || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || DEFAULT_PROJECT_ID;
  const dataset = args.dataset || process.env.NEXT_PUBLIC_SANITY_DATASET || DEFAULT_DATASET;
  const schema = args.schema || "legalPage";
  const docsDir = args.dir || DEFAULT_DOCS_DIR;
  const dryRun = Boolean(args["dry-run"]);
  const allowUnknown = Boolean(args["allow-unknown"]);
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error("Missing SANITY_API_WRITE_TOKEN in environment.");
  }

  if (!fs.existsSync(docsDir)) {
    throw new Error(`Directory not found: ${docsDir}`);
  }

  const markdownFiles = collectMarkdownFiles(docsDir);
  if (!markdownFiles.length) {
    console.log(`No markdown files found in: ${docsDir}`);
    return;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-04-20",
    token,
    useCdn: false,
    perspective: "published",
  });

  console.log(`\nSanity uploader started`);
  console.log(`Project: ${projectId}`);
  console.log(`Dataset: ${dataset}`);
  console.log(`Schema: ${schema}`);
  console.log(`Files: ${markdownFiles.length}`);
  console.log(`Dry run: ${dryRun ? "yes" : "no"}\n`);

  for (const filePath of markdownFiles) {
    const markdown = fs.readFileSync(filePath, "utf8");
    let payload;

    if (schema === "legalPage") {
      payload = buildLegalDocument({ markdown, filePath });
      if (!allowUnknown && !KNOWN_LEGAL_SLUGS.has(payload.__derivedSlug)) {
        console.log(
          `[SKIPPED] ${path.basename(filePath)} (not a standard legal slug: ${payload.__derivedSlug})`
        );
        continue;
      }
      delete payload.__derivedSlug;
    } else if (schema === "policyPage") {
      payload = buildPolicyDocument({ markdown, filePath });
      if (!allowUnknown && !payload.__derivedPolicyType) {
        console.log(`[SKIPPED] ${path.basename(filePath)} (not a standard policy document)`);
        continue;
      }
      if (!allowUnknown && !KNOWN_POLICY_TYPES.has(payload.pageType)) {
        console.log(
          `[SKIPPED] ${path.basename(filePath)} (not a standard policy type: ${payload.pageType})`
        );
        continue;
      }
      delete payload.__derivedPolicyType;
    } else if (schema === "useCasePage") {
      payload = buildUseCaseDocument({ markdown, filePath });
    } else if (schema === "institutionPage") {
      payload = buildInstitutionDocument({ markdown, filePath });
    } else if (schema === "solutionPage") {
      payload = buildSolutionPageDocument({ markdown, filePath });
    } else {
      payload = buildGenericMarketingDocument({ markdown, filePath, schemaType: schema });
    }

    if (dryRun) {
      console.log(`[DRY RUN] ${path.basename(filePath)} -> ${payload._type} (${payload._id})`);
      continue;
    }

    await client.createOrReplace(payload);
    console.log(`[UPLOADED] ${path.basename(filePath)} -> ${payload._type} (${payload._id})`);
  }

  console.log("\nUpload process finished.");
}

run().catch((error) => {
  console.error("\nSanity uploader failed:");
  console.error(error?.message || error);
  process.exit(1);
});
