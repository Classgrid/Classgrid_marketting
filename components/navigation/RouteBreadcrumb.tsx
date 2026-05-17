"use client";

import { useMemo } from "react";
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

  // Hide breadcrumb on top-level pages where it's redundant (just shows the page name)
  // Keep it for nested routes like /solutions/for-schools, /changelog/slug, /case-studies/slug
  const topLevelHidden = ["/team", "/acknowledgement", "/community", "/about", "/pricing", "/blog", "/changelog", "/contact", "/case-studies"];
  const isHidden = topLevelHidden.includes(pathname) || pathname.startsWith("/compare");
  if (isHidden) {
    return null;
  }

  const items = useMemo<BreadcrumbEntry[]>(() => {
    const segments = pathname.split("/").filter(Boolean);
    let hrefAccumulator = "";
    return segments.map((segment, index) => {
      hrefAccumulator += `/${segment}`;
      const isLast = index === segments.length - 1;
      return {
        label: formatSegmentLabel(segment),
        href: isLast ? undefined : hrefAccumulator,
      };
    });
  }, [pathname]);

  if (items.length === 0) return null;

  return (
    <div className="border-b border-border/40 bg-background/80">
      <div className="container mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <AppBreadcrumb items={items} />
      </div>
    </div>
  );
}
