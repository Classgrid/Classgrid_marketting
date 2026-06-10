"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

import { AppBreadcrumb } from "@/components/navigation/AppBreadcrumb";

type BreadcrumbEntry = {
  label: string;
  href?: string;
};

const segmentLabelMap: Record<string, string> = {
  "use-cases": "Use Cases",
  "case-studies": "Case Studies",
  "jr-college": "Jr College",
  "junior-college": "Junior College",
  faq: "FAQ",
  ai: "AI",
  erp: "ERP",
  lms: "LMS",
};

function capitalizeWord(word: string): string {
  if (!word) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatSegmentLabel(segment: string): string {
  const decoded = decodeURIComponent(segment || "");
  const normalized = decoded.toLowerCase();

  if (segmentLabelMap[normalized]) {
    return segmentLabelMap[normalized];
  }

  // Check if the segment is a MongoDB ObjectId (24-character hex string)
  if (/^[a-f0-9]{24}$/.test(normalized)) {
    return `Ticket #${normalized.slice(0, 8)}`;
  }

  return normalized
    .split(/[-_]+/)
    .map((word) => segmentLabelMap[word] ?? capitalizeWord(word))
    .join(" ");
}

export function RouteBreadcrumb() {
  const pathname = usePathname();
  const [articleCategory, setArticleCategory] = useState<{ label: string; slug: string } | null>(null);

  // Watch for article category data attributes set by ArticlePageClient
  useEffect(() => {
    const checkCategory = () => {
      const cat = document.documentElement.dataset.articleCategory;
      const catSlug = document.documentElement.dataset.articleCategorySlug;
      if (cat && catSlug) {
        setArticleCategory({ label: cat, slug: catSlug });
      } else {
        setArticleCategory(null);
      }
    };

    checkCategory();

    const observer = new MutationObserver(checkCategory);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-article-category", "data-article-category-slug"] });

    return () => {
      observer.disconnect();
      // Clean up data attributes when leaving
      delete document.documentElement.dataset.articleCategory;
      delete document.documentElement.dataset.articleCategorySlug;
    };
  }, [pathname]);

  const items = useMemo<BreadcrumbEntry[]>(() => {
    const segments = pathname.split("/").filter(Boolean);
    // Segments that are just routing folders, not real pages
    const skipSegments = new Set(["category", "article"]);
    let hrefAccumulator = "";
    const entries: BreadcrumbEntry[] = [];
    segments.forEach((segment, index) => {
      hrefAccumulator += `/${segment}`;
      if (skipSegments.has(segment)) return; // skip routing-only folders
      const isLast = index === segments.length - 1;
      entries.push({
        label: formatSegmentLabel(segment),
        href: isLast ? undefined : hrefAccumulator,
      });
    });

    // For article pages: inject the category between "Help Center" and the article title
    const isArticlePage = segments.includes("article") && articleCategory;
    if (isArticlePage && entries.length >= 2) {
      entries.splice(1, 0, {
        label: articleCategory.label,
        href: `/help-center/category/${articleCategory.slug}`,
      });
    }

    return entries;
  }, [pathname, articleCategory]);

  // Hide breadcrumb on top-level pages where it's redundant (just shows the page name)
  // Keep it for nested routes like /solutions/for-schools, /changelog/slug, /case-studies/slug
  const topLevelHidden = ["/team", "/acknowledgement", "/community", "/about", "/pricing", "/blog", "/changelog", "/contact", "/case-studies"];
  const isHidden = topLevelHidden.includes(pathname) || pathname.startsWith("/compare") || pathname.startsWith("/docs");

  if (isHidden || items.length === 0) return null;

  return (
    <div className="bg-background/80">
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <AppBreadcrumb items={items} />
      </div>
    </div>
  );
}
