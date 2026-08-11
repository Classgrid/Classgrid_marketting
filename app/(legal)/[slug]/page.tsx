import type { Metadata } from "next";
import { CmsFallback } from "@/components/ui/CmsErrorBoundary";
import { LegalLayout } from "@/components/legal/LegalLayout";
import type { LegalIntroContent, LegalSection } from "@/components/legal/types";
import { buildPageMetadata } from "@/lib/metadata";
import { cookiePolicy, disclaimerPolicy, pageMeta, privacyPolicy, securityPolicy, termsOfService } from "@/content/siteContent";
import { getLegalPageBySlug, getPolicyPage } from "@/sanity/lib/marketing";
import { JsonLd } from "@/components/seo/JsonLd";

const LEGAL_DESCRIPTIONS: Record<string, string> = {
  privacy: "How Classgrid collects, processes, and protects user and student data.",
  terms: "Legal terms for platform usage, billing, licensing, and account responsibility.",
  security: "Infrastructure and application security controls powering tenant-safe operations.",
  cookies: "Cookie and local-storage usage policy with strict privacy safeguards.",
  disclaimer: "Legal disclaimer covering liability boundaries, service limitations, and usage responsibility.",
  "ip-protection": "How Classgrid protects its intellectual property through copyright, trade secrets, trademark, and MSME registration.",
};

const LEGAL_HEADLINES: Record<string, string> = {
  privacy: "Privacy Policy",
  terms: "Terms of Service",
  security: "Security Policy",
  cookies: "Cookie Policy",
  disclaimer: "Disclaimer",
  "ip-protection": "Intellectual Property Protection Policy",
};

const LEGAL_LABELS: Record<string, string> = {
  privacy: "Privacy",
  terms: "Terms",
  security: "Security",
  cookies: "Cookies",
  disclaimer: "Disclaimer",
  "ip-protection": "IP Protection",
};

const DEFAULT_LEGAL_INTRO: LegalIntroContent = {
  introductionHeading: "Introduction",
  introductionParagraphs: [],
  scopeHeading: "Scope",
  scopeParagraphs: [],
};

function normalizeLegalSlug(slug: string) {
  return slug === "cookie" ? "cookies" : slug;
}

function isValidLegalSlug(slug: string) {
  return slug === "privacy" || slug === "terms" || slug === "security" || slug === "cookies" || slug === "disclaimer" || slug === "ip-protection";
}

function toSectionId(input: string, fallbackIndex: number) {
  const normalized = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || `section-${fallbackIndex + 1}`;
}

function shouldHideLegalSection(section: LegalSection) {
  const normalizedTitle = section.title.toLowerCase().trim();
  return (
    normalizedTitle === "grievance officer" ||
    normalizedTitle.endsWith(". grievance officer") ||
    normalizedTitle === "contact us" ||
    normalizedTitle === "contact information" ||
    normalizedTitle.endsWith(". contact us") ||
    normalizedTitle.endsWith(". contact information")
  );
}

function formatUpdatedDate(input: string | Date): string {
  const parsed = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(parsed.getTime())) return "Last Updated: April 20, 2026";
  return `Last Updated: ${parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}`;
}

function formatEffectiveDate(input: string | Date): string {
  const parsed = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(parsed.getTime())) return "Effective Date: April 20, 2026";
  return `Effective Date: ${parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })}`;
}

function getFallbackSections(slug: string): { title: string; updated: string; intro: LegalIntroContent; sections: LegalSection[] } {
  if (slug === "privacy") {
    return {
      title: privacyPolicy.title,
      updated: privacyPolicy.updated,
      intro: (privacyPolicy as any).intro ?? DEFAULT_LEGAL_INTRO,
      sections: privacyPolicy.sections.map((section, index) => ({
        id: toSectionId(section.heading, index),
        title: section.heading,
        body: (section as any).body,
        content: (section as any).content,
      })),
    };
  }

  if (slug === "terms") {
    return {
      title: termsOfService.title,
      updated: termsOfService.updated,
      intro: (termsOfService as any).intro ?? DEFAULT_LEGAL_INTRO,
      sections: termsOfService.sections.map((section, index) => ({
        id: toSectionId(section.heading, index),
        title: section.heading,
        body: (section as any).body,
        content: (section as any).content,
      })),
    };
  }

  if (slug === "security") {
    return {
      title: securityPolicy.title,
      updated: securityPolicy.updated,
      intro: (securityPolicy as any).intro ?? DEFAULT_LEGAL_INTRO,
      sections: securityPolicy.sections.map((section, index) => ({
        id: toSectionId(section.heading, index),
        title: section.heading,
        body: (section as any).body,
        content: (section as any).content,
        bullets: (section as any).bullets,
      })),
    };
  }

  if (slug === "disclaimer") {
    return {
      title: disclaimerPolicy.title,
      updated: disclaimerPolicy.updated,
      intro: (disclaimerPolicy as any).intro ?? DEFAULT_LEGAL_INTRO,
      sections: disclaimerPolicy.sections.map((section, index) => ({
        id: toSectionId(section.heading, index),
        title: section.heading,
        body: (section as any).body,
        content: (section as any).content,
        bullets: (section as any).bullets,
      })),
    };
  }

  const cookieSections = (cookiePolicy as any).sections as
    | Array<{ heading: string; body?: string; content?: any; bullets?: string[] }>
    | undefined;

  if (Array.isArray(cookieSections) && cookieSections.length > 0) {
    return {
      title: cookiePolicy.title,
      updated: cookiePolicy.updated,
      intro: (cookiePolicy as any).intro ?? DEFAULT_LEGAL_INTRO,
      sections: cookieSections.map((section, index) => ({
        id: toSectionId(section.heading, index),
        title: section.heading,
        body: section.body,
        content: section.content,
        bullets: section.bullets,
      })),
    };
  }

  const legacyCookieUses = ((cookiePolicy as any).uses as string[] | undefined) ?? [];
  const legacyCookieDoesNotUse = ((cookiePolicy as any).doesNotUse as string[] | undefined) ?? [];

  return {
    title: cookiePolicy.title,
    updated: cookiePolicy.updated,
    intro: (cookiePolicy as any).intro ?? DEFAULT_LEGAL_INTRO,
    sections: [
      {
        id: "we-use",
        title: "We Use",
        bullets: legacyCookieUses,
      },
      {
        id: "we-do-not-use",
        title: "We Do Not Use",
        bullets: legacyCookieDoesNotUse,
      },
    ],
  };
}

function getMetaBySlug(slug: string) {
  if (slug === "privacy") return pageMeta.privacy;
  if (slug === "terms") return pageMeta.terms;
  if (slug === "security") return pageMeta.security;
  if (slug === "disclaimer") return pageMeta.disclaimer;
  return pageMeta.cookie;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeLegalSlug(slug);

  if (!isValidLegalSlug(normalizedSlug)) {
    return buildPageMetadata(pageMeta.privacy);
  }

  return buildPageMetadata(getMetaBySlug(normalizedSlug));
}

export async function generateStaticParams() {
  return [{ slug: "privacy" }, { slug: "terms" }, { slug: "security" }, { slug: "cookies" }, { slug: "cookie" }, { slug: "disclaimer" }, { slug: "ip-protection" }];
}

import { notFound } from "next/navigation";

export default async function LegalSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = normalizeLegalSlug(slug);

  if (!isValidLegalSlug(normalizedSlug)) {
    notFound();
  }

  const [legalPage, legacyPolicy] = await Promise.all([
    getLegalPageBySlug(normalizedSlug),
    getPolicyPage(normalizedSlug === "cookies" ? "cookie" : normalizedSlug),
  ]);

  const fallback = getFallbackSections(normalizedSlug);

  const cmsSections: LegalSection[] =
    (legalPage as any)?.sections?.map((section: any, index: number) => ({
      id: section?.id || toSectionId(section?.title || "", index),
      title: section?.title || `Section ${index + 1}`,
      content: section?.content,
    })) || [];

  const sections = (cmsSections.length > 0 ? cmsSections : fallback.sections).filter(
    (section) => !shouldHideLegalSection(section)
  );
  const title = LEGAL_HEADLINES[normalizedSlug] || (legalPage as any)?.title || (legacyPolicy as any)?.headline || fallback.title;
  const pageLabel = LEGAL_LABELS[normalizedSlug] || normalizedSlug;
  const intro: LegalIntroContent = (legalPage as any)?.intro
    ? {
        introductionHeading: (legalPage as any).intro?.introductionHeading || "Introduction",
        introductionParagraphs: (legalPage as any).intro?.introductionParagraphs || [],
        scopeHeading: (legalPage as any).intro?.scopeHeading || "Scope",
        scopeParagraphs: (legalPage as any).intro?.scopeParagraphs || [],
      }
    : fallback.intro;

  const sourceUpdatedDate = (legalPage as any)?.lastUpdated || (legacyPolicy as any)?.lastUpdated || "2026-04-20";
  const sourceEffectiveDate =
    (legalPage as any)?.effectiveDate ||
    (legacyPolicy as any)?.effectiveDate ||
    sourceUpdatedDate;
  const updated = formatUpdatedDate(sourceUpdatedDate);
  const effectiveDate = formatEffectiveDate(sourceEffectiveDate);

  const jsonLdData = {
    "@type": "WebPage",
    "@id": `https://classgrid.in/${normalizedSlug}/#webpage`,
    "name": title,
    "url": `https://classgrid.in/${normalizedSlug}`,
    "about": {
      "@id": "https://classgrid.in/#software"
    }
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <LegalLayout
        title={title}
        updated={updated}
        effectiveDate={effectiveDate}
        description={LEGAL_DESCRIPTIONS[normalizedSlug] || LEGAL_DESCRIPTIONS.privacy}
        pageLabel={pageLabel}
        intro={intro}
        sections={sections}
      />
    </>
  );
}
