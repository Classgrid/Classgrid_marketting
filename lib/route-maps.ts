const LEGACY_EXACT_ROUTE_MAP: Record<string, string> = {
  "/modules": "/product/modules",
  "/institutions": "/solutions",
  "/use-cases": "/solutions",
  "/institutions/school": "/solutions/industries/school",
  "/institutions/college": "/solutions/industries/college",
  "/institutions/junior-college": "/solutions/industries/junior-college",
  "/institutions/jr-college": "/solutions/industries/junior-college",
  "/institutions/coaching": "/solutions/industries/coaching",
  "/institutions/engineering": "/solutions/industries/engineering",
  "/use-cases/students": "/solutions/roles/students",
  "/use-cases/teachers": "/solutions/roles/teachers",
  "/use-cases/institutes": "/solutions/roles/institutes",
  "/use-cases/school": "/solutions/industries/school",
  "/use-cases/college": "/solutions/industries/college",
  "/use-cases/junior-college": "/solutions/industries/junior-college",
  "/use-cases/coaching": "/solutions/industries/coaching",
};

export const INDUSTRY_SLUGS = [
  "school",
  "college",
  "junior-college",
  "coaching",
  "engineering",
] as const;

export const ROLE_SLUGS = ["students", "teachers", "institutes"] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];
export type RoleSlug = (typeof ROLE_SLUGS)[number];

export function getIndustrySolutionPath(slug: string) {
  return `/solutions/industries/${slug}`;
}

export function getRoleSolutionPath(slug: string) {
  return `/solutions/roles/${slug}`;
}

export function getProductModulePath(slug: string) {
  return `/product/modules/${slug}`;
}

export function normalizeAppHref(href: string) {
  const exactMatch = LEGACY_EXACT_ROUTE_MAP[href];
  if (exactMatch) {
    return exactMatch;
  }

  if (href.startsWith("/modules/")) {
    return href.replace("/modules/", "/product/modules/");
  }

  return href;
}
