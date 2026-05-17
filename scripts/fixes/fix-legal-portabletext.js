const fs = require("fs");
const path = require("path");

const DOCS_DIR =
  "C:\\Users\\nikhi\\OneDrive\\Documents\\Classgrid_platfrom\\classgrid_platform\\docs";
const OUTPUT_FILE = path.join(process.cwd(), "content", "legal.ts");

const SOURCES = [
  {
    exportName: "privacyPolicy",
    fileName: "CLASSGRID_PRIVACY_POLICY.md",
    fallbackTitle: "Privacy Policy",
  },
  {
    exportName: "termsOfService",
    fileName: "CLASSGRID_TERMS_OF_SERVICE.md",
    fallbackTitle: "Terms of Service",
  },
  {
    exportName: "securityPolicy",
    fileName: "CLASSGRID_SECURITY_POLICY.md",
    fallbackTitle: "Security Policy",
  },
  {
    exportName: "cookiePolicy",
    fileName: "CLASSGRID_COOKIE_POLICY.md",
    fallbackTitle: "Cookie Policy",
  },
  {
    exportName: "disclaimerPolicy",
    fileName: "CLASSGRID_DISCLAIMER.md",
    fallbackTitle: "Disclaimer",
  },
];

function normalizeNewlines(value) {
  return value.replace(/\r\n/g, "\n").replace(/\uFEFF/g, "");
}

function normalizeCharacters(value) {
  if (!value) return value;

  return value
    .replace(/Ã‚Â©/g, "(c)")
    .replace(/Ã¢â‚¬â€|Ã¢â‚¬â€œ/g, " - ")
    .replace(/â€”|â€“/g, " - ")
    .replace(/Ã¢â‚¬Ëœ|Ã¢â‚¬â„¢/g, "'")
    .replace(/â€˜|â€™/g, "'")
    .replace(/Ã¢â‚¬Å“|Ã¢â‚¬Â/g, '"')
    .replace(/â€œ|â€�/g, '"')
    .replace(/Ã¢â‚¬Â¦/g, "...")
    .replace(/â€¦/g, "...")
    .replace(/Ã¢â€ â€™/g, "->");
}

function normalizeLegalIdentity(value) {
  if (!value) return value;

  return value
    .replace(/nikhil\s+patil/gi, "Nikhil Shinde")
    .replace(/nikhil\.shidne@classgrid\.in/gi, "nikhil.shinde@classgrid.in")
    .replace(/grievance@classgrid\.in/gi, "nikhil.shinde@classgrid.in")
    .replace(/support@classgird\.imn/gi, "support@classgrid.in")
    .replace(/privacy@classgrid\.in/gi, "support@classgrid.in")
    .replace(/sales@classgrid\.in/gi, "support@classgrid.in")
    .replace(/billing@classgrid\.in/gi, "support@classgrid.in")
    .replace(/security@classgrid\.in/gi, "support@classgrid.in");
}

function sanitizeLine(value) {
  return normalizeLegalIdentity(normalizeCharacters(value))
    .replace(/\t/g, " ")
    .replace(/\u00A0/g, " ")
    .trim();
}

function createKeyFactory() {
  let i = 0;
  return (prefix) => `${prefix}-${++i}`;
}

function stripWrappedTermQuotes(text) {
  const withoutQuotedBoldTerms = text.replace(/\*\*([^*]+)\*\*/g, (full, inner) => {
    const cleanedInner = inner.replace(/"([^"]+)"/g, "$1");
    return `**${cleanedInner}**`;
  });

  return withoutQuotedBoldTerms.replace(/(^|\s)"([^"]+)"(?=\s*[-:])/g, "$1$2");
}

function transformOutsideMarkdownLinks(text, transformFn) {
  const markdownLinkRegex = /\[[^\]]+\]\([^)]+\)/g;
  let result = "";
  let cursor = 0;
  let match;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    result += transformFn(text.slice(cursor, match.index));
    result += match[0];
    cursor = match.index + match[0].length;
  }

  result += transformFn(text.slice(cursor));
  return result;
}

function autoLinkUrlsAndEmails(text) {
  return transformOutsideMarkdownLinks(text, (segment) =>
    segment
      .replace(/\bhttps?:\/\/[^\s)]+/g, (url) => `[${url}](${url})`)
      .replace(
        /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
        (email) => `[${email}](mailto:${email})`
      )
  );
}

function toE164(raw) {
  const cleaned = raw.trim();
  const digits = cleaned.replace(/\D/g, "");

  if (!digits) return "";
  if (cleaned.startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return `+${digits}`;
}

function enhancePhoneLine(text) {
  if (!/phone|mobile|call/i.test(text)) return text;

  const phoneMatches = text.match(/\+?\d[\d\s\-()]{7,}\d/g);
  if (!phoneMatches || phoneMatches.length === 0) return text;

  const uniquePhones = [...new Set(phoneMatches.map((value) => value.trim()))];
  const firstPhoneIndex = text.indexOf(phoneMatches[0]);
  const prefix = text.slice(0, firstPhoneIndex).trim();

  const actionChunks = uniquePhones
    .map((displayPhone) => {
      const e164 = toE164(displayPhone);
      if (!e164) return "";

      const wa = e164.replace("+", "");
      return `[Call ${displayPhone}](tel:${e164}) | [WhatsApp ${displayPhone}](https://wa.me/${wa})`;
    })
    .filter(Boolean);

  if (actionChunks.length === 0) return text;
  return `${prefix} ${actionChunks.join(" / ")}`.trim();
}

function prepareInlineText(text) {
  const normalized = stripWrappedTermQuotes(normalizeCharacters(text)).replace(
    /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g,
    "[**$1**]($2)"
  );
  const autoLinked = autoLinkUrlsAndEmails(enhancePhoneLine(normalized));
  return autoLinked.replace(/\*\*\[([^\]]+)\]\(([^)]+)\)\*\*/g, "[**$1**]($2)");
}

function markdownToPlainText(line) {
  return line
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

function extractIntroContent(prefaceLines) {
  const paragraphs = [];
  let paragraphBuffer = [];
  let inTableOfContents = false;

  const flushParagraph = () => {
    if (!paragraphBuffer.length) return;
    const paragraph = paragraphBuffer.join(" ").replace(/\s+/g, " ").trim();
    if (paragraph) paragraphs.push(paragraph);
    paragraphBuffer = [];
  };

  for (const raw of prefaceLines) {
    const line = sanitizeLine(raw);

    if (!line || /^-{3,}$/.test(line)) {
      flushParagraph();
      continue;
    }

    if (/^##\s*table\s+of\s+contents/i.test(line)) {
      inTableOfContents = true;
      flushParagraph();
      continue;
    }

    if (inTableOfContents) {
      if (/^\d+\.\s+\[/.test(line) || /^\d+\.\s+/.test(line)) {
        continue;
      }
      if (/^##\s+/.test(line)) {
        inTableOfContents = false;
      } else {
        continue;
      }
    }

    if (/^#\s+/.test(line)) {
      continue;
    }

    if (/^\*\*effective date:/i.test(line) || /^\*\*last updated:/i.test(line)) {
      continue;
    }

    if (/^-\s+/.test(line)) {
      flushParagraph();
      const itemText = markdownToPlainText(line.replace(/^-\s+/, "").trim());
      if (itemText) paragraphs.push(itemText);
      continue;
    }

    if (/^##\s+/.test(line)) {
      flushParagraph();
      continue;
    }

    paragraphBuffer.push(markdownToPlainText(line));
  }

  flushParagraph();

  return {
    introductionHeading: "Introduction",
    introductionParagraphs: paragraphs,
    scopeHeading: "Scope",
    scopeParagraphs: [],
  };
}

function pushTextSpan(children, text, marks, nextKey) {
  if (!text) return;
  children.push({
    _key: nextKey("span"),
    _type: "span",
    text,
    marks: marks.length ? [...marks] : [],
  });
}

function parseEmphasisSegment(segment, baseMarks, children, nextKey) {
  let cursor = 0;

  while (cursor < segment.length) {
    const boldIndex = segment.indexOf("**", cursor);
    const italicIndex = segment.indexOf("*", cursor);

    const hasBold = boldIndex !== -1;
    const hasItalic = italicIndex !== -1;

    if (!hasBold && !hasItalic) {
      pushTextSpan(children, segment.slice(cursor), baseMarks, nextKey);
      break;
    }

    let target = "bold";
    let startIndex = boldIndex;

    if (!hasBold || (hasItalic && italicIndex < boldIndex)) {
      target = "italic";
      startIndex = italicIndex;
    }

    if (startIndex > cursor) {
      pushTextSpan(children, segment.slice(cursor, startIndex), baseMarks, nextKey);
    }

    if (target === "bold") {
      const closeIndex = segment.indexOf("**", startIndex + 2);
      if (closeIndex === -1) {
        pushTextSpan(children, segment.slice(startIndex), baseMarks, nextKey);
        break;
      }

      const inner = segment.slice(startIndex + 2, closeIndex);
      if (inner) parseEmphasisSegment(inner, [...baseMarks, "strong"], children, nextKey);
      cursor = closeIndex + 2;
      continue;
    }

    if (segment[startIndex + 1] === "*") {
      const closeIndex = segment.indexOf("**", startIndex + 2);
      if (closeIndex === -1) {
        pushTextSpan(children, segment.slice(startIndex), baseMarks, nextKey);
        break;
      }

      const inner = segment.slice(startIndex + 2, closeIndex);
      if (inner) parseEmphasisSegment(inner, [...baseMarks, "strong"], children, nextKey);
      cursor = closeIndex + 2;
      continue;
    }

    const closeIndex = segment.indexOf("*", startIndex + 1);
    if (closeIndex === -1) {
      pushTextSpan(children, segment.slice(startIndex), baseMarks, nextKey);
      break;
    }

    const inner = segment.slice(startIndex + 1, closeIndex);
    if (inner) parseEmphasisSegment(inner, [...baseMarks, "em"], children, nextKey);
    cursor = closeIndex + 1;
  }
}

function parseInlineMarkdown(text, nextKey) {
  const prepared = prepareInlineText(text);
  const children = [];
  const markDefs = [];
  const linkRegex = /\[([^\]]+)\]\(([^)\s]+(?:\s+"[^"]*")?)\)/g;

  let cursor = 0;
  let match;

  while ((match = linkRegex.exec(prepared)) !== null) {
    const before = prepared.slice(cursor, match.index);
    if (before) parseEmphasisSegment(before, [], children, nextKey);

    const linkText = match[1] || "";
    const hrefWithOptionalTitle = match[2] || "";
    const href = hrefWithOptionalTitle.split(/\s+"/)[0].trim();
    const linkKey = nextKey("link");

    markDefs.push({
      _key: linkKey,
      _type: "link",
      href,
    });

    parseEmphasisSegment(linkText, [linkKey], children, nextKey);
    cursor = match.index + match[0].length;
  }

  const after = prepared.slice(cursor);
  if (after) parseEmphasisSegment(after, [], children, nextKey);

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
  const { children, markDefs } = parseInlineMarkdown(text, nextKey);
  return {
    _key: nextKey("block"),
    _type: "block",
    style,
    markDefs,
    children,
    ...extra,
  };
}

function isBlockBoundary(trimmedLine) {
  return (
    !trimmedLine ||
    /^#{2,6}\s+/.test(trimmedLine) ||
    /^[-*+]\s+/.test(trimmedLine) ||
    /^\d+\.\s+/.test(trimmedLine) ||
    /^\|/.test(trimmedLine) ||
    /^-{3,}$/.test(trimmedLine)
  );
}

function parseTableRow(line) {
  const trimmed = sanitizeLine(line);
  const stripped = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return stripped.split("|").map((cell) =>
    sanitizeLine(cell)
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
  );
}

function isSeparatorRow(cells) {
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell.replace(/\s/g, "")));
}

function parseMarkdownTable(tableLines, nextKey) {
  const rows = tableLines.map(parseTableRow).filter((cells) => cells.some(Boolean));
  if (rows.length < 2) return null;

  const nonSeparatorRows = rows.filter((cells) => !isSeparatorRow(cells));
  if (nonSeparatorRows.length < 2) return null;

  const headers = nonSeparatorRows[0].map((value) => value || "-");
  const bodyRows = nonSeparatorRows.slice(1).map((cells) =>
    headers.map((_, index) => cells[index] || "")
  );

  return {
    _key: nextKey("table"),
    _type: "legalTable",
    headers,
    rows: bodyRows.map((cells) => ({
      _key: nextKey("row"),
      cells,
    })),
  };
}

function parseBlocks(lines, nextKey) {
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const raw = lines[i];
    const trimmed = sanitizeLine(raw);

    if (!trimmed || /^-{3,}$/.test(trimmed)) {
      i += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^#{3,6}\s+(.+)$/);
    if (headingMatch) {
      blocks.push(makeBlock("h3", headingMatch[1], nextKey));
      i += 1;
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
      let j = i;
      while (j < lines.length) {
        const line = sanitizeLine(lines[j]);
        if (!(/^[-*+]\s+/.test(line) || /^\d+\.\s+/.test(line))) break;

        let itemText = line.replace(/^[-*+]\s+/, "").replace(/^\d+\.\s+/, "").trim();
        let k = j + 1;

        while (k < lines.length) {
          const continuation = sanitizeLine(lines[k]);
          if (!continuation || isBlockBoundary(continuation)) break;
          itemText += ` ${continuation}`;
          k += 1;
        }

        blocks.push(
          makeBlock("normal", itemText, nextKey, {
            listItem: "bullet",
            level: 1,
          })
        );

        j = k;
      }
      i = j;
      continue;
    }

    if (/^\|/.test(trimmed)) {
      const tableLines = [];
      let j = i;
      while (j < lines.length) {
        const line = sanitizeLine(lines[j]);
        if (!line.startsWith("|")) break;
        tableLines.push(line);
        j += 1;
      }

      const table = parseMarkdownTable(tableLines, nextKey);
      if (table) {
        blocks.push(table);
      } else {
        blocks.push(makeBlock("normal", tableLines.join("\n"), nextKey));
      }

      i = j;
      continue;
    }

    const paragraphLines = [trimmed];
    let j = i + 1;
    while (j < lines.length) {
      const line = sanitizeLine(lines[j]);
      if (isBlockBoundary(line)) break;
      paragraphLines.push(line);
      j += 1;
    }

    blocks.push(makeBlock("normal", paragraphLines.join(" "), nextKey));
    i = j;
  }

  return blocks;
}

function parseMarkdownDocument(markdown, fallbackTitle) {
  const nextKey = createKeyFactory();
  const normalized = normalizeNewlines(markdown);
  const lines = normalized.split("\n");

  let title = fallbackTitle;
  let updated = "Last Updated: April 20, 2026";

  for (const raw of lines) {
    const line = sanitizeLine(raw);
    if (!line) continue;

    const titleMatch = line.match(/^#\s+(.+)$/);
    if (titleMatch) {
      title = sanitizeLine(titleMatch[1])
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
      break;
    }
  }

  for (const raw of lines) {
    const line = sanitizeLine(raw);
    const updatedMatch = line.match(/^(\*{0,2})?last\s+updated\s*:\s*([^\*]+)(\*{0,2})?$/i);
    if (updatedMatch) {
      updated = `Last Updated: ${sanitizeLine(updatedMatch[2])}`;
      break;
    }
  }

  const firstNumberedSectionIndex = lines.findIndex((raw) =>
    /^##\s*1[\.\)]?\s+/.test(sanitizeLine(raw))
  );
  const firstSectionIndex =
    firstNumberedSectionIndex >= 0
      ? firstNumberedSectionIndex
      : lines.findIndex((raw) => /^##\s+/.test(sanitizeLine(raw)));

  const prefaceLines =
    firstSectionIndex >= 0 ? lines.slice(0, firstSectionIndex) : lines.slice();
  const sectionLines =
    firstSectionIndex >= 0 ? lines.slice(firstSectionIndex) : [];

  const intro = extractIntroContent(prefaceLines);

  const sections = [];
  let currentHeading = "Introduction";
  let buffer = [];

  const flushCurrent = () => {
    const blocks = parseBlocks(buffer, nextKey);
    if (blocks.length) {
      sections.push({
        heading: currentHeading,
        content: blocks,
      });
    }
  };

  for (const raw of sectionLines) {
    const line = sanitizeLine(raw);
    if (/^#\s+/.test(line)) continue;

    const sectionMatch = line.match(/^##\s+(.+)$/);
    if (sectionMatch) {
      flushCurrent();
      currentHeading = sanitizeLine(sectionMatch[1]);
      buffer = [];
      continue;
    }

    buffer.push(raw);
  }

  flushCurrent();

  return {
    title,
    updated,
    intro,
    sections,
  };
}

function escapeForTypeScript(value) {
  return JSON.stringify(value, null, 2)
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function buildLegalTs(policiesByExportName) {
  const parts = [
    "// AUTOGENERATED FROM CLASSGRID PLATFORM DOCS. DO NOT EDIT MANUALLY.",
    "",
  ];

  for (const source of SOURCES) {
    const policy = policiesByExportName[source.exportName];
    parts.push(`export const ${source.exportName} = ${escapeForTypeScript(policy)};`);
    parts.push("");
    parts.push("");
  }

  return parts.join("\n").trimEnd() + "\n";
}

function run() {
  const policiesByExportName = {};

  for (const source of SOURCES) {
    const absolutePath = path.join(DOCS_DIR, source.fileName);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Missing markdown file: ${absolutePath}`);
    }

    const markdown = fs.readFileSync(absolutePath, "utf8");
    policiesByExportName[source.exportName] = parseMarkdownDocument(markdown, source.fallbackTitle);
  }

  const output = buildLegalTs(policiesByExportName);
  fs.writeFileSync(OUTPUT_FILE, output, "utf8");
  console.log(`Updated: ${OUTPUT_FILE}`);
}

run();

