import { promises as fs } from "fs";
import path from "path";

import { footerLinkGroups, headerNav } from "@/content/pageCopy";
import { pageMeta } from "@/content/pageMeta";
import { embedText, RAG_EMBEDDING_DIMENSIONS, RAG_EMBEDDING_MODEL } from "@/lib/ai/embedding";
import {
  chunkRagDocument,
  normalizePageSlug,
  normalizeText,
  type ExtractedRagDocument,
  type ExtractedRagSection,
} from "@/lib/ai/rag-content";
import {
  PLATFORM_RESOURCES,
  formatPlatformResourceDirectory,
  toAbsoluteResourceUrl,
} from "@/lib/ai/platform-resources";
import { connectMongo } from "@/lib/mongodb";
import { RagChunk } from "@/lib/models/RagChunk";

type PlatformKnowledgeResult = {
  ok: boolean;
  action: "synced" | "ignored";
  documentId: string;
  documentType: string;
  chunks?: number;
  reason?: string;
};

const ROOT_DIR = process.cwd();
const APP_DIR = path.join(ROOT_DIR, "app");
const CONTENT_DIR = path.join(ROOT_DIR, "content");
const DOCS_DIR = path.join(ROOT_DIR, "docs");
const STATIC_SOURCE_FILES = [path.join(ROOT_DIR, "lib", "route-maps.ts")];

const PAGE_META_BY_PATH = new Map(
  Object.values(pageMeta).map((meta) => [normalizeHrefPath(meta.path), meta])
);

function normalizeHrefPath(href: string) {
  const value = normalizeText(href);
  if (!value) return "/";
  if (/^https?:\/\//i.test(value)) return value.replace(/\/+$/g, "");

  const withoutHash = value.split("#")[0] || "/";
  const withSlash = withoutHash.startsWith("/") ? withoutHash : `/${withoutHash}`;
  return withSlash === "/" ? "/" : withSlash.replace(/\/+$/g, "");
}

function safeId(value: string) {
  return (
    normalizeText(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120) || "home"
  );
}

function humanizeRoute(routePath: string) {
  if (routePath === "/") return "Home";
  return routePath
    .replace(/^\/+/, "")
    .replace(/[:*[\]]/g, "")
    .split("/")
    .filter(Boolean)
    .map((part) =>
      part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(" ");
}

function sourceUrlFromHref(href: string) {
  const normalized = normalizeText(href);
  if (!normalized) return "";
  if (/^https?:\/\//i.test(normalized)) return normalized;
  return toAbsoluteResourceUrl(normalized);
}

function publicHrefFromRoutePattern(routePath: string) {
  if (routePath === "/") return "/";

  const staticSegments: string[] = [];
  for (const segment of routePath.split("/").filter(Boolean)) {
    if (segment.startsWith(":")) break;
    staticSegments.push(segment);
  }

  return staticSegments.length ? `/${staticSegments.join("/")}` : "/";
}

function routePatternFromPageFile(filePath: string) {
  const relative = path.relative(APP_DIR, filePath).replace(/\\/g, "/");
  const withoutPage = relative.replace(/\/?page\.tsx$/, "");
  const segments = withoutPage.split("/").filter(Boolean);
  const routeSegments: string[] = [];

  for (const segment of segments) {
    if (segment.startsWith("(") && segment.endsWith(")")) continue;

    const optionalCatchAll = segment.match(/^\[\[\.\.\.(.+)\]\]$/);
    if (optionalCatchAll) {
      routeSegments.push(`:${optionalCatchAll[1]}*`);
      continue;
    }

    const catchAll = segment.match(/^\[\.\.\.(.+)\]$/);
    if (catchAll) {
      routeSegments.push(`:${catchAll[1]}*`);
      continue;
    }

    const dynamic = segment.match(/^\[(.+)\]$/);
    if (dynamic) {
      routeSegments.push(`:${dynamic[1]}`);
      continue;
    }

    routeSegments.push(segment);
  }

  return routeSegments.length ? `/${routeSegments.join("/")}` : "/";
}

async function listFiles(rootDir: string, predicate: (filePath: string) => boolean): Promise<string[]> {
  try {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const childPath = path.join(rootDir, entry.name);
      if (entry.isDirectory()) {
        if ([".git", ".next", "node_modules", "dist", "coverage"].includes(entry.name)) continue;
        files.push(...(await listFiles(childPath, predicate)));
        continue;
      }

      if (entry.isFile() && predicate(childPath)) {
        files.push(childPath);
      }
    }

    return files;
  } catch {
    return [];
  }
}

function section(sectionTitle: string, text: string): ExtractedRagSection | null {
  const normalized = text.replace(/\r/g, "").replace(/[ \t]+$/gm, "").trim();
  if (normalized.length < 24) return null;
  return { sectionTitle, text: normalized };
}

function makeDocument(params: {
  documentId: string;
  documentType: string;
  pageTitle: string;
  pageSlug: string;
  sourceUrl?: string;
  contentType: string;
  pagePurpose?: string;
  sourceUpdatedAt?: string;
  sections: Array<ExtractedRagSection | null>;
}): ExtractedRagDocument | null {
  const sections = params.sections.filter(Boolean) as ExtractedRagSection[];
  if (!sections.length) return null;

  return {
    documentId: params.documentId,
    documentType: params.documentType,
    pageTitle: params.pageTitle,
    pageSlug: normalizePageSlug(params.pageSlug) || safeId(params.pageSlug),
    sourceUrl: params.sourceUrl || "",
    contentType: params.contentType,
    pagePurpose: params.pagePurpose,
    sourceUpdatedAt: params.sourceUpdatedAt,
    sections,
  };
}

function buildResourceDirectoryDocument() {
  const rows = PLATFORM_RESOURCES.map((resource) => {
    const url = toAbsoluteResourceUrl(resource.href);
    return [
      `Resource: ${resource.label}`,
      `Category: ${resource.category}`,
      `Path: ${resource.href}`,
      `URL: ${url}`,
      `Description: ${resource.description}`,
      `Keywords: ${resource.keywords.join(", ")}`,
    ].join("\n");
  }).join("\n\n");

  return makeDocument({
    documentId: "platform::resources::directory",
    documentType: "platformResourceDirectory",
    pageTitle: "Classgrid Resource Directory",
    pageSlug: "platform/resources",
    sourceUrl: toAbsoluteResourceUrl("/"),
    contentType: "platformResource",
    pagePurpose: "Clickable Classgrid resource directory for support, sales, legal, product, and community links.",
    sections: [
      section(
        "Public resources and links",
        [
          "When the AI mentions one of these resources, it should include the direct link.",
          "",
          rows,
        ].join("\n")
      ),
    ],
  });
}

function formatHeaderNavigation() {
  const parts: string[] = [];

  parts.push(`Header nav groups: ${headerNav.groups.map((group) => group.label).join(", ")}`);
  parts.push(
    `Header module columns:\n${headerNav.modulesColumns
      .map((column) => `- ${column.heading}: ${column.items.join(", ")}`)
      .join("\n")}`
  );
  parts.push(
    `Header platform links:\n${headerNav.platformLinks
      .map((link) => `- ${link.label}: ${link.href}`)
      .join("\n")}`
  );
  parts.push(
    `Header mobile links:\n${headerNav.mobileLinks
      .map((link) => `- ${link.label}: ${link.href}`)
      .join("\n")}`
  );
  parts.push(
    `Footer link groups:\n${footerLinkGroups
      .map(
        (group) =>
          `- ${group.heading}: ${group.links.map((link) => `${link.label} (${link.href})`).join(", ")}`
      )
      .join("\n")}`
  );

  return parts.join("\n\n");
}

function buildNavigationDocument() {
  return makeDocument({
    documentId: "platform::navigation::hierarchy",
    documentType: "platformNavigation",
    pageTitle: "Classgrid Navigation Hierarchy",
    pageSlug: "platform/navigation",
    sourceUrl: toAbsoluteResourceUrl("/"),
    contentType: "platformNavigation",
    pagePurpose: "Header, mobile, and footer navigation structure for Classgrid.",
    sections: [section("Navigation hierarchy", formatHeaderNavigation())],
  });
}

function buildPageMetaDocuments() {
  return Object.entries(pageMeta)
    .map(([key, meta]) => {
      const pathValue = normalizeHrefPath(meta.path);
      const isExternal = /^https?:\/\//i.test(pathValue);
      const sourceUrl = isExternal ? pathValue : sourceUrlFromHref(pathValue);

      return makeDocument({
        documentId: `platform::page-meta::${safeId(key)}`,
        documentType: "platformPageMetadata",
        pageTitle: meta.title,
        pageSlug: isExternal ? safeId(meta.title) : pathValue,
        sourceUrl,
        contentType: "platformPage",
        pagePurpose: meta.description,
        sections: [
          section(
            "Page metadata",
            [
              `Page key: ${key}`,
              `Title: ${meta.title}`,
              `Path: ${meta.path}`,
              `URL: ${sourceUrl}`,
              `Description: ${meta.description}`,
            ].join("\n")
          ),
        ],
      });
    })
    .filter(Boolean) as ExtractedRagDocument[];
}

async function buildRouteDocuments() {
  const pageFiles = await listFiles(APP_DIR, (filePath) => path.basename(filePath) === "page.tsx");

  return pageFiles
    .sort((a, b) => a.localeCompare(b))
    .map((filePath) => {
      const routePath = routePatternFromPageFile(filePath);
      const publicHref = publicHrefFromRoutePattern(routePath);
      const meta = PAGE_META_BY_PATH.get(normalizeHrefPath(publicHref));
      const sourceFile = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
      const title = meta?.title || humanizeRoute(routePath) || "Classgrid page";
      const routeType = routePath.includes(":") ? "dynamic" : "static";

      return makeDocument({
        documentId: `platform::route::${safeId(routePath)}::${safeId(sourceFile)}`,
        documentType: "platformRoute",
        pageTitle: `${title} Route`,
        pageSlug: routePath,
        sourceUrl: sourceUrlFromHref(publicHref),
        contentType: "platformRoute",
        pagePurpose: meta?.description || `Classgrid ${routeType} App Router page.`,
        sections: [
          section(
            "App Router page",
            [
              `Route pattern: ${routePath}`,
              `Public entry link: ${publicHref}`,
              `Source file: ${sourceFile}`,
              `Route type: ${routeType}`,
              meta ? `Page title: ${meta.title}` : "",
              meta ? `Page description: ${meta.description}` : "",
              routeType === "dynamic"
                ? "This route renders individual pages or records using the dynamic segment in the URL."
                : "This route renders a direct public page.",
            ]
              .filter(Boolean)
              .join("\n")
          ),
        ],
      });
    })
    .filter(Boolean) as ExtractedRagDocument[];
}

function markdownTitle(markdown: string, fallback: string) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return normalizeText(match?.[1]) || fallback;
}

function markdownSections(markdown: string) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const sections: ExtractedRagSection[] = [];
  let currentTitle = "Overview";
  let currentLines: string[] = [];

  const flush = () => {
    const item = section(currentTitle, currentLines.join("\n"));
    if (item) sections.push(item);
    currentLines = [];
  };

  for (const line of lines) {
    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flush();
      currentTitle = normalizeText(heading[2]) || "Section";
      continue;
    }

    currentLines.push(line);
  }

  flush();
  return sections;
}

async function buildDocsDocuments() {
  const files = await listFiles(DOCS_DIR, (filePath) => filePath.endsWith(".md"));
  const docs: ExtractedRagDocument[] = [];

  for (const filePath of files.sort((a, b) => a.localeCompare(b))) {
    const raw = await fs.readFile(filePath, "utf8");
    const relative = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
    const title = markdownTitle(raw, humanizeRoute(relative.replace(/\.md$/i, "")));
    const stats = await fs.stat(filePath).catch(() => null);

    const doc = makeDocument({
      documentId: `platform::docs::${safeId(relative)}`,
      documentType: "platformDocs",
      pageTitle: `Internal doc: ${title}`,
      pageSlug: `internal/${relative.replace(/\.md$/i, "")}`,
      sourceUrl: "",
      contentType: "platformDocs",
      pagePurpose: `Internal Classgrid documentation from ${relative}.`,
      sourceUpdatedAt: stats?.mtime ? stats.mtime.toISOString() : undefined,
      sections: [
        section("Document location", `Internal documentation file: ${relative}`),
        ...markdownSections(raw),
      ],
    });

    if (doc) docs.push(doc);
  }

  return docs;
}

function publicHrefForSourceFile(relative: string) {
  const fileName = path.basename(relative, ".ts");
  const map: Record<string, string> = {
    about: "/about",
    campusCommunity: "/support/inquiry",
    changelog: "/changelog",
    compare: "/compare",
    forms: "/demo",
    homepage: "/",
    homePlaceholders: "/",
    institutions: "/institutions",
    integrations: "/integrations",
    legal: "/terms",
    modules: "/product/modules",
    pageCopy: "/",
    pageMeta: "/",
    pricing: "/pricing",
    routeMaps: "/",
    siteContent: "/",
    siteMeta: "/",
  };

  return map[fileName] || "/";
}

function sourceTextForIndexing(raw: string) {
  const withoutImports = raw
    .replace(/\r/g, "")
    .replace(/^import\s+.+$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "");

  const strings: string[] = [];
  const seen = new Set<string>();
  const literalPattern = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;
  let match: RegExpExecArray | null;

  while ((match = literalPattern.exec(withoutImports)) !== null) {
    const value = match[2]
      .replace(/\\n/g, " ")
      .replace(/\\r/g, " ")
      .replace(/\\t/g, " ")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/`/g, "")
      .trim();

    if (!isReadableIndexString(value)) continue;
    const normalized = normalizeText(value);
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    strings.push(normalized);
  }

  if (strings.length >= 4) {
    return strings.join("\n");
  }

  return withoutImports
    .replace(/^export\s+/gm, "")
    .replace(/[{}[\]();]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function isReadableIndexString(value: string) {
  const text = normalizeText(value);
  if (text.length < 3 || text.length > 800) return false;
  if (!/[a-zA-Z]/.test(text)) return false;
  if (/^\$?\{/.test(text)) return false;
  if (/^[a-z0-9_./:[\]-]+$/i.test(text) && !text.includes("http") && text.length < 20) {
    return false;
  }

  const tokens = text.split(/\s+/).filter(Boolean);
  const utilityTokens = tokens.filter((token) =>
    /^(?:sm:|md:|lg:|xl:|2xl:|dark:|hover:|focus:|active:|group-|bg-|text-|border-|rounded|shadow|flex|grid|items-|justify-|gap-|p[trblxy]?-\d|m[trblxy]?-\d|h-|w-|max-w-|min-h-|z-|absolute|relative|inset-|translate-|opacity-|duration-|transition|overflow-|object-|font-|leading-|tracking-|from-|via-|to-)/.test(
      token
    )
  );

  if (tokens.length >= 3 && utilityTokens.length / tokens.length > 0.55) return false;
  if (/^(true|false|null|undefined|use client)$/i.test(text)) return false;

  return true;
}

async function buildContentSourceDocuments() {
  const contentFiles = await listFiles(CONTENT_DIR, (filePath) => filePath.endsWith(".ts"));
  const files = [...contentFiles, ...STATIC_SOURCE_FILES];
  const docs: ExtractedRagDocument[] = [];

  for (const filePath of files.sort((a, b) => a.localeCompare(b))) {
    const raw = await fs.readFile(filePath, "utf8");
    const relative = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
    const stats = await fs.stat(filePath).catch(() => null);
    const publicHref = publicHrefForSourceFile(relative);
    const title = humanizeRoute(relative.replace(/\.[^.]+$/g, ""));

    const doc = makeDocument({
      documentId: `platform::source::${safeId(relative)}`,
      documentType: "codebaseContent",
      pageTitle: `Codebase content: ${title}`,
      pageSlug: `internal/${relative.replace(/\.[^.]+$/g, "")}`,
      sourceUrl: sourceUrlFromHref(publicHref),
      contentType: "codebaseContent",
      pagePurpose:
        "Codebase-defined Classgrid website/platform content, route metadata, forms, copy, module data, or navigation data.",
      sourceUpdatedAt: stats?.mtime ? stats.mtime.toISOString() : undefined,
      sections: [
        section("Source file", `Source file: ${relative}\nPublic context link: ${publicHref}`),
        section("Codebase-defined platform content", sourceTextForIndexing(raw)),
      ],
    });

    if (doc) docs.push(doc);
  }

  return docs;
}

async function buildAppPageSourceDocuments() {
  const pageFiles = await listFiles(APP_DIR, (filePath) => path.basename(filePath) === "page.tsx");
  const docs: ExtractedRagDocument[] = [];

  for (const filePath of pageFiles.sort((a, b) => a.localeCompare(b))) {
    const raw = await fs.readFile(filePath, "utf8");
    const relative = path.relative(ROOT_DIR, filePath).replace(/\\/g, "/");
    const routePath = routePatternFromPageFile(filePath);
    const publicHref = publicHrefFromRoutePattern(routePath);
    const title = humanizeRoute(routePath);
    const stats = await fs.stat(filePath).catch(() => null);

    const doc = makeDocument({
      documentId: `platform::page-source::${safeId(relative)}`,
      documentType: "appPageSourceContent",
      pageTitle: `App page content: ${title}`,
      pageSlug: routePath,
      sourceUrl: sourceUrlFromHref(publicHref),
      contentType: "appPageSourceContent",
      pagePurpose:
        "Codebase-defined public App Router page content, labels, CTAs, local module matrices, and route-specific UI copy.",
      sourceUpdatedAt: stats?.mtime ? stats.mtime.toISOString() : undefined,
      sections: [
        section(
          "App page source",
          `Source file: ${relative}\nRoute pattern: ${routePath}\nPublic context link: ${publicHref}`
        ),
        section("Codebase-defined page text and data", sourceTextForIndexing(raw)),
      ],
    });

    if (doc) docs.push(doc);
  }

  return docs;
}

export async function collectPlatformKnowledgeDocuments() {
  const groups = await Promise.all([
    Promise.resolve([
      buildResourceDirectoryDocument(),
      buildNavigationDocument(),
    ].filter(Boolean) as ExtractedRagDocument[]),
    Promise.resolve(buildPageMetaDocuments()),
    buildRouteDocuments(),
    buildDocsDocuments(),
    buildContentSourceDocuments(),
    buildAppPageSourceDocuments(),
  ]);

  return groups.flat();
}

async function syncPlatformDocumentToRag(doc: ExtractedRagDocument): Promise<PlatformKnowledgeResult> {
  const chunks = chunkRagDocument(doc);
  if (!chunks.length) {
    return {
      ok: true,
      action: "ignored",
      documentId: doc.documentId,
      documentType: doc.documentType,
      reason: "No chunks generated.",
    };
  }

  await RagChunk.deleteMany({ documentId: doc.documentId });

  const rows = [];
  for (const chunk of chunks) {
    const embedding = await embedText(chunk.chunkText);
    rows.push({
      ...chunk,
      embedding,
      source: "static",
      metadata: {
        ...chunk.metadata,
        platformKnowledge: true,
        embeddingModel: RAG_EMBEDDING_MODEL,
        embeddingDimensions: RAG_EMBEDDING_DIMENSIONS,
      },
    });
  }

  await RagChunk.insertMany(rows, { ordered: false });

  return {
    ok: true,
    action: "synced",
    documentId: doc.documentId,
    documentType: doc.documentType,
    chunks: rows.length,
  };
}

export async function reindexPlatformKnowledge(): Promise<{
  ok: true;
  totalDocuments: number;
  synced: number;
  ignored: number;
  chunks: number;
  results: PlatformKnowledgeResult[];
}> {
  const docs = await collectPlatformKnowledgeDocuments();
  await connectMongo();
  await RagChunk.deleteMany({ documentId: /^(platform::|static::)/ });

  const results: PlatformKnowledgeResult[] = [];
  let synced = 0;
  let ignored = 0;
  let chunks = 0;

  for (const doc of docs) {
    const result = await syncPlatformDocumentToRag(doc);
    results.push(result);

    if (result.action === "synced") {
      synced += 1;
      chunks += result.chunks ?? 0;
    } else {
      ignored += 1;
    }
  }

  return {
    ok: true,
    totalDocuments: docs.length,
    synced,
    ignored,
    chunks,
    results,
  };
}

export function platformResourceDirectoryForPrompt(channel: "web" | "whatsapp") {
  return formatPlatformResourceDirectory(channel);
}
