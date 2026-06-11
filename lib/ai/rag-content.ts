export type PageContext = {
  path?: string;
  slug?: string;
  title?: string;
  pageId?: string;
  locale?: string;
  summary?: string;
  hash?: string;
  section?: string;
  previousPath?: string;
  previousTitle?: string;
  pageHistory?: { path: string; title: string }[];
};

export type ExtractedRagSection = {
  sectionTitle: string;
  text: string;
};

export type ExtractedRagDocument = {
  documentId: string;
  documentType: string;
  pageTitle: string;
  pageSlug: string;
  sourceUrl: string;
  contentType: string;
  pagePurpose?: string;
  sourceUpdatedAt?: string;
  sections: ExtractedRagSection[];
};

export type PreparedRagChunk = {
  documentId: string;
  documentType: string;
  chunkIndex: number;
  chunkText: string;
  pageSlug: string;
  pageTitle: string;
  section: string;
  contentType: string;
  sourceUrl: string;
  sourceUpdatedAt?: Date;
  metadata: Record<string, unknown>;
};

export const INDEXABLE_SANITY_TYPES = [
  "homePage",
  "pricingPage",
  "aboutPage",
  "demoPage",
  "supportPage",
  "contactPage",
  "salesContactPage",
  "legalPage",
  "helpArticle",
  "helpCategory",
  "post",
  "faqItem",
  "useCasesLandingPage",
  "useCasePage",
  "institutionPage",
  "solutionPage",
  "solutionModule",
  "module",
  "comparison",
  "compareHubPage",
  "caseStudy",
  "campaignPage",
  "changelogEntry",
  "changelogSettings",
  "pageSettings",
  "classgridIntegration",
  "classgrid_talk",
  "testimonial",
  "testimonialVideo",
  "clientLogo",
  "communityReview",
  "acknowledgement",
  "teamMember",
  "homeStats",
  "sectionSettings",
  "isometricStack",
  "turboClassgrid",
] as const;

const INDEXABLE_TYPE_SET = new Set<string>(INDEXABLE_SANITY_TYPES);
const LOCALE_KEYS = ["en", "hi", "mr"] as const;
const MAX_RECURSION_DEPTH = 12;
const TARGET_CHUNK_WORDS = Number(process.env.RAG_CHUNK_WORDS || 700);
const CHUNK_OVERLAP_WORDS = Number(process.env.RAG_CHUNK_OVERLAP_WORDS || 140);
const MIN_SECTION_CHARS = 24;
const MAX_FIELD_TEXT_CHARS = 5000;

const EXCLUDED_KEYS = new Set([
  "_createdAt",
  "_id",
  "_key",
  "_rev",
  "_type",
  "_updatedAt",
  "accentColor",
  "asset",
  "avatar",
  "brandLogo",
  "color",
  "coverImage",
  "heroImage",
  "icon",
  "iconColor",
  "iconSvg",
  "image",
  "institutionLogo",
  "logo",
  "ogImage",
  "photo",
  "posterImage",
  "wordmark",
]);

const URL_LIKE_KEYS = new Set([
  "href",
  "imageUrl",
  "logoUrl",
  "posterUrl",
  "url",
  "videoUrl",
  "websiteLink",
]);

function humanizeKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function normalizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeMultiLineText(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function getLocalizedText(value: unknown): string {
  if (typeof value === "string") return normalizeText(value);
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";

  const obj = value as Record<string, unknown>;
  const values: string[] = [];

  for (const key of LOCALE_KEYS) {
    const localized = normalizeText(obj[key]);
    if (localized && !values.includes(localized)) values.push(localized);
  }

  return values.join("\n");
}

function hasLocaleShape(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const obj = value as Record<string, unknown>;
  return LOCALE_KEYS.some((key) => typeof obj[key] === "string" || Array.isArray(obj[key]));
}

function resolveSlugValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const obj = value as Record<string, unknown>;
    if (typeof obj.current === "string") return obj.current;
  }
  return "";
}

export function normalizePageSlug(value: unknown): string {
  const raw = resolveSlugValue(value);
  return raw
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+|\/+$/g, "")
    .trim()
    .toLowerCase();
}

function siteBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "https://classgrid.in"
  ).replace(/\/+$/g, "");
}

function withSiteBase(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteBaseUrl()}${normalized === "/home" ? "/" : normalized}`;
}

function resolveDocumentTitle(doc: Record<string, unknown>): string {
  const candidates = [
    doc.title,
    doc.headline,
    doc.heroHeadline,
    doc.seoTitle,
    (doc.seo as Record<string, unknown> | undefined)?.metaTitle,
    doc.name,
    doc.question,
    doc.competitorName,
    doc.versionLabel,
    doc.label,
    doc.brandName,
  ];

  for (const value of candidates) {
    const text = getLocalizedText(value);
    if (text) return text.split("\n")[0];
  }

  return humanizeKey(String(doc._type || "Classgrid page"));
}

function resolveDocumentSlug(doc: Record<string, unknown>, title: string): string {
  const type = String(doc._type || "");
  const directSlug =
    normalizePageSlug(doc.slug) ||
    normalizePageSlug((doc.seo as Record<string, unknown> | undefined)?.slug) ||
    normalizePageSlug(doc.campaignId) ||
    normalizePageSlug(doc.audience) ||
    normalizePageSlug(doc.institutionType) ||
    normalizePageSlug(doc.pageType);

  if (directSlug) return directSlug;

  const singletonMap: Record<string, string> = {
    aboutPage: "about",
    changelogSettings: "changelog",
    compareHubPage: "compare",
    contactPage: "contact",
    demoPage: "demo",
    homePage: "home",
    homeStats: "home",
    pricingPage: "pricing",
    salesContactPage: "contact/sales",
    sectionSettings: "home",
    supportPage: "support",
    useCasesLandingPage: "solutions",
  };

  if (singletonMap[type]) return singletonMap[type];

  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveSourcePath(type: string, slug: string): string {
  const normalizedSlug = normalizePageSlug(slug);

  const singletonMap: Record<string, string> = {
    aboutPage: "/about",
    changelogSettings: "/changelog",
    compareHubPage: "/compare",
    contactPage: "/contact",
    demoPage: "/#demo",
    homePage: "/",
    homeStats: "/",
    pricingPage: "/pricing",
    careersPage: "/careers",
    sectionSettings: "/",
    supportPage: "/support",
    useCasesLandingPage: "/solutions",
  };

  if (singletonMap[type]) return singletonMap[type];

  if (type === "post") return `/blog/${normalizedSlug}`;
  if (type === "helpArticle") return `/help-center/article/${normalizedSlug}`;
  if (type === "legalPage") return `/${normalizedSlug}`;
  if (type === "caseStudy") return `/case-studies/${normalizedSlug}`;
  if (type === "campaignPage") return `/campaigns/${normalizedSlug}`;
  if (type === "changelogEntry") return `/changelog/${normalizedSlug}`;
  if (type === "comparison") return `/compare/${normalizedSlug}`;
  if (type === "institutionPage") return `/solutions/for-${normalizedSlug}`;
  if (type === "useCasePage") return `/solutions/for-${normalizedSlug}`;
  if (type === "solutionPage") return `/solutions/${normalizedSlug}`;
  if (type === "solutionModule" || type === "module") return `/product/modules/${normalizedSlug}`;
  if (type === "classgridIntegration") return "/integrations";
  if (type === "faqItem") return "/#faq";
  if (type === "testimonial" || type === "testimonialVideo") return "/reviews";
  if (type === "teamMember") return "/team";
  if (type === "acknowledgement") return "/acknowledgement";
  if (type === "pageSettings") return `/${normalizedSlug}`;

  return normalizedSlug ? `/${normalizedSlug}` : "/";
}

function appendSection(
  sections: ExtractedRagSection[],
  sectionTitle: string,
  text: unknown
) {
  const normalized = normalizeMultiLineText(text);
  if (normalized.length < MIN_SECTION_CHARS) return;

  sections.push({
    sectionTitle: normalizeText(sectionTitle) || "Content",
    text: normalized.slice(0, MAX_FIELD_TEXT_CHARS),
  });
}

function portableBlockText(block: Record<string, unknown>): string {
  const children = Array.isArray(block.children) ? block.children : [];
  return children
    .map((child) => {
      if (!child || typeof child !== "object") return "";
      return normalizeText((child as Record<string, unknown>).text);
    })
    .filter(Boolean)
    .join(" ");
}

function extractPortableTextArray(
  value: unknown[],
  sections: ExtractedRagSection[],
  fallbackSection: string,
  depth: number
) {
  let currentTitle = fallbackSection;
  let currentParts: string[] = [];

  const flush = () => {
    if (!currentParts.length) return;
    appendSection(sections, currentTitle, currentParts.join("\n\n"));
    currentParts = [];
  };

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const block = item as Record<string, unknown>;
    const type = String(block._type || "");

    if (type === "block") {
      const text = portableBlockText(block);
      if (!text) continue;

      const style = String(block.style || "normal");
      if (/^h[1-6]$/.test(style)) {
        flush();
        currentTitle = text;
      } else {
        currentParts.push(text);
      }
      continue;
    }

    if (type === "richTable") {
      const headers = Array.isArray(block.headers) ? block.headers.map(normalizeText).filter(Boolean) : [];
      const rows = Array.isArray(block.rows)
        ? block.rows
            .map((row) => {
              if (!row || typeof row !== "object") return "";
              const cells = (row as Record<string, unknown>).cells;
              return Array.isArray(cells) ? cells.map(normalizeText).filter(Boolean).join(" | ") : "";
            })
            .filter(Boolean)
        : [];

      if (headers.length || rows.length) {
        currentParts.push([headers.join(" | "), ...rows].filter(Boolean).join("\n"));
      }
      continue;
    }

    flattenValue(block, sections, currentTitle, depth + 1);
  }

  flush();
}

function flattenArray(
  value: unknown[],
  sections: ExtractedRagSection[],
  fallbackSection: string,
  depth: number
) {
  if (value.some((item) => item && typeof item === "object" && (item as Record<string, unknown>)._type === "block")) {
    extractPortableTextArray(value, sections, fallbackSection, depth);
    return;
  }

  const primitives = value
    .filter((item) => typeof item === "string" || typeof item === "number")
    .map((item) => normalizeText(String(item)))
    .filter(Boolean);

  if (primitives.length) {
    appendSection(sections, fallbackSection, primitives.join(", "));
  }

  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const obj = item as Record<string, unknown>;
    const title =
      getLocalizedText(obj.heading) ||
      getLocalizedText(obj.title) ||
      getLocalizedText(obj.question) ||
      getLocalizedText(obj.name) ||
      getLocalizedText(obj.feature) ||
      fallbackSection;

    flattenValue(obj, sections, title, depth + 1);
  }
}

function flattenValue(
  value: unknown,
  sections: ExtractedRagSection[],
  fallbackSection: string,
  depth: number
) {
  if (depth > MAX_RECURSION_DEPTH || value == null) return;

  if (typeof value === "string" || typeof value === "number") {
    appendSection(sections, fallbackSection, String(value));
    return;
  }

  if (Array.isArray(value)) {
    flattenArray(value, sections, fallbackSection, depth + 1);
    return;
  }

  if (typeof value !== "object") return;

  if (hasLocaleShape(value)) {
    const localized = getLocalizedText(value);
    if (localized) appendSection(sections, fallbackSection, localized);
  }

  const obj = value as Record<string, unknown>;
  for (const [key, childValue] of Object.entries(obj)) {
    if (EXCLUDED_KEYS.has(key) || URL_LIKE_KEYS.has(key)) continue;
    if (key.startsWith("_")) continue;
    if (childValue == null) continue;

    if (hasLocaleShape(childValue)) {
      appendSection(sections, humanizeKey(key), getLocalizedText(childValue));
      continue;
    }

    if (typeof childValue === "string" || typeof childValue === "number") {
      appendSection(sections, humanizeKey(key), String(childValue));
      continue;
    }

    if (Array.isArray(childValue)) {
      flattenArray(childValue, sections, humanizeKey(key), depth + 1);
      continue;
    }

    if (typeof childValue === "object") {
      flattenValue(childValue, sections, humanizeKey(key), depth + 1);
    }
  }
}

function mergeSections(sections: ExtractedRagSection[]): ExtractedRagSection[] {
  const merged = new Map<string, string[]>();

  for (const section of sections) {
    const title = section.sectionTitle || "Content";
    const text = normalizeMultiLineText(section.text);
    if (!text) continue;

    const current = merged.get(title) ?? [];
    if (!current.includes(text)) current.push(text);
    merged.set(title, current);
  }

  return Array.from(merged.entries()).map(([sectionTitle, parts]) => ({
    sectionTitle,
    text: parts.join("\n\n"),
  }));
}

export function isIndexableSanityType(type: unknown): type is string {
  return typeof type === "string" && INDEXABLE_TYPE_SET.has(type);
}

export function extractRagDocument(rawDoc: unknown): ExtractedRagDocument | null {
  if (!rawDoc || typeof rawDoc !== "object") return null;

  const doc = rawDoc as Record<string, unknown>;
  const documentId = normalizeText(doc._id);
  const documentType = normalizeText(doc._type);

  if (!documentId || !isIndexableSanityType(documentType)) return null;

  const pageTitle = resolveDocumentTitle(doc);
  const pageSlug = resolveDocumentSlug(doc, pageTitle);
  const sourcePath = resolveSourcePath(documentType, pageSlug);
  const metaDescription =
    getLocalizedText(doc.metaDescription) ||
    getLocalizedText((doc.seo as Record<string, unknown> | undefined)?.metaDescription);
  const pagePurpose =
    metaDescription ||
    getLocalizedText(doc.subheadline) ||
    getLocalizedText(doc.subtitle) ||
    getLocalizedText(doc.summary) ||
    getLocalizedText(doc.description);

  const sections: ExtractedRagSection[] = [];
  appendSection(
    sections,
    "Page summary",
    [
      `Title: ${pageTitle}`,
      `Type: ${humanizeKey(documentType)}`,
      pagePurpose ? `Purpose: ${pagePurpose}` : "",
      `Source: ${sourcePath}`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  flattenValue(doc, sections, "Content", 0);

  const mergedSections = mergeSections(sections).filter((section) => section.text.length >= MIN_SECTION_CHARS);
  if (!mergedSections.length) return null;

  return {
    documentId,
    documentType,
    pageTitle,
    pageSlug,
    sourceUrl: withSiteBase(sourcePath),
    contentType: documentType,
    pagePurpose,
    sourceUpdatedAt: normalizeText(doc._updatedAt),
    sections: mergedSections,
  };
}

function splitWords(text: string): string[] {
  return normalizeMultiLineText(text).split(/\s+/).filter(Boolean);
}

function sectionChunks(section: ExtractedRagSection, targetWords: number, overlapWords: number): string[] {
  const words = splitWords(section.text);
  if (!words.length) return [];
  if (words.length <= targetWords) return [words.join(" ")];

  const chunks: string[] = [];
  const step = Math.max(1, targetWords - overlapWords);

  for (let start = 0; start < words.length; start += step) {
    const end = Math.min(words.length, start + targetWords);
    chunks.push(words.slice(start, end).join(" "));
    if (end >= words.length) break;
  }

  return chunks;
}

export function chunkRagDocument(doc: ExtractedRagDocument): PreparedRagChunk[] {
  const targetWords = Number.isFinite(TARGET_CHUNK_WORDS) ? TARGET_CHUNK_WORDS : 700;
  const overlapWords = Number.isFinite(CHUNK_OVERLAP_WORDS)
    ? Math.min(CHUNK_OVERLAP_WORDS, Math.floor(targetWords / 2))
    : 140;
  const chunks: PreparedRagChunk[] = [];

  for (const section of doc.sections) {
    for (const text of sectionChunks(section, targetWords, overlapWords)) {
      const chunkText = [
        `Page: ${doc.pageTitle}`,
        `Content type: ${doc.contentType}`,
        `Section: ${section.sectionTitle}`,
        `Source: ${doc.sourceUrl}`,
        "",
        text,
      ].join("\n");

      chunks.push({
        documentId: doc.documentId,
        documentType: doc.documentType,
        chunkIndex: chunks.length,
        chunkText,
        pageSlug: doc.pageSlug,
        pageTitle: doc.pageTitle,
        section: section.sectionTitle,
        contentType: doc.contentType,
        sourceUrl: doc.sourceUrl,
        sourceUpdatedAt: doc.sourceUpdatedAt ? new Date(doc.sourceUpdatedAt) : undefined,
        metadata: {
          pagePurpose: doc.pagePurpose,
          sourceUpdatedAt: doc.sourceUpdatedAt,
        },
      });
    }
  }

  return chunks;
}
