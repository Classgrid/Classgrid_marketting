import type { MetadataRoute } from "next";

import { siteMeta } from "@/content/siteMeta";
import { getChangelogEntries, getComparisonPages, getCaseStudies, getAllSolutionModules } from "@/sanity/lib/marketing";

const staticRoutes = [
  "/",
  "/about",
  "/blog",
  "/case-studies",
  "/changelog",
  "/compare",
  "/contact",
  "/contact/sales",
  "/view-platform",
  "/pricing",
  "/reviews",
  "/support",
  "/help-center",
  "/team",
  "/community",
  "/solutions",
  "/solutions/for-schools",
  "/solutions/for-colleges",
  "/solutions/for-jr-colleges",
  "/solutions/for-coaching",
  "/solutions/for-engineering",
  "/solutions/for-students",
  "/solutions/for-teachers",
  "/solutions/for-admins",
  "/privacy",
  "/terms",
  "/security",
  "/cookies",
  "/disclaimer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cmsComparisons = ((await getComparisonPages()) as Array<{ slug?: string }> | null) ?? [];
  const cmsChangelogEntries = ((await getChangelogEntries()) as Array<{ slug?: string }> | null) ?? [];
  const cmsCaseStudies = ((await getCaseStudies()) as Array<{ slug?: { current?: string } }> | null) ?? [];
  const cmsModules = ((await getAllSolutionModules()) as Array<{ slug?: { current?: string } }> | null) ?? [];

  const dynamicCompareSlugs = Array.from(
    new Set([
      ...cmsComparisons.map((entry) => entry.slug).filter((value): value is string => Boolean(value)),
    ])
  );
  const dynamicChangelogSlugs = Array.from(
    new Set([
      ...cmsChangelogEntries.map((entry) => entry.slug).filter((value): value is string => Boolean(value)),
    ])
  );
  
  const dynamicCaseStudySlugs = Array.from(
    new Set([
      ...cmsCaseStudies.map((entry) => entry.slug?.current).filter((value): value is string => Boolean(value)),
    ])
  );

  const dynamicModuleSlugs = Array.from(
    new Set([
      ...cmsModules.map((entry) => entry.slug?.current).filter((value): value is string => Boolean(value)),
    ])
  );

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteMeta.domain}${route}`,
      changeFrequency: (route === "/compare" || route === "/changelog" ? "weekly" : "monthly") as
        | "weekly"
        | "monthly",
      priority: route === "/" ? 1 : route === "/compare" ? 0.9 : 0.7,
    })),
    ...dynamicCompareSlugs.map((slug) => ({
      url: `${siteMeta.domain}/compare/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...dynamicChangelogSlugs.map((slug) => ({
      url: `${siteMeta.domain}/changelog/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...dynamicCaseStudySlugs.map((slug) => ({
      url: `${siteMeta.domain}/case-studies/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...dynamicModuleSlugs.map((slug) => ({
      url: `${siteMeta.domain}/product/modules/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
