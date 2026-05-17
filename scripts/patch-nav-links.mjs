// Patch all navbar links and homepage org card links to point to correct solution URLs
import { createClient } from "@sanity/client";
import fs from "fs";
import path from "path";

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

// Complete URL normalization map — covers every possible old path
const URL_FIX_MAP = {
  // Industry pages
  "/institutions/school":                 "/solutions/for-schools",
  "/institutions/schools":                "/solutions/for-schools",
  "/use-cases/school":                    "/solutions/for-schools",
  "/use-cases/schools":                   "/solutions/for-schools",
  "/solutions/industries/school":         "/solutions/for-schools",
  "/institutions/college":                "/solutions/for-colleges",
  "/institutions/colleges":               "/solutions/for-colleges",
  "/use-cases/college":                   "/solutions/for-colleges",
  "/use-cases/colleges":                  "/solutions/for-colleges",
  "/solutions/industries/college":        "/solutions/for-colleges",
  "/institutions/junior-college":         "/solutions/for-jr-colleges",
  "/institutions/jr-college":             "/solutions/for-jr-colleges",
  "/use-cases/junior-college":            "/solutions/for-jr-colleges",
  "/use-cases/jr-college":                "/solutions/for-jr-colleges",
  "/solutions/industries/junior-college": "/solutions/for-jr-colleges",
  "/solutions/industries/jr-college":     "/solutions/for-jr-colleges",
  "/institutions/coaching":               "/solutions/for-coaching",
  "/use-cases/coaching":                  "/solutions/for-coaching",
  "/solutions/industries/coaching":       "/solutions/for-coaching",
  "/institutions/engineering":            "/solutions/for-engineering",
  "/use-cases/engineering":               "/solutions/for-engineering",
  "/solutions/industries/engineering":    "/solutions/for-engineering",
  // Role pages
  "/use-cases/students":                  "/solutions/for-students",
  "/use-cases/student":                   "/solutions/for-students",
  "/solutions/roles/students":            "/solutions/for-students",
  "/use-cases/teachers":                  "/solutions/for-teachers",
  "/use-cases/teacher":                   "/solutions/for-teachers",
  "/solutions/roles/teachers":            "/solutions/for-teachers",
  "/use-cases/institutes":                "/solutions/for-admins",
  "/use-cases/institute":                 "/solutions/for-admins",
  "/solutions/roles/institutes":          "/solutions/for-admins",
  // Modules
  "/modules":                     "/product/modules",
  "/product":                     "/product/modules",
  "/features":                    "/product/modules",
  "/institutions":                "/solutions",
  "/use-cases":                   "/solutions",
};

function fixUrl(href) {
  if (!href) return href;
  // Exact match
  if (URL_FIX_MAP[href]) return URL_FIX_MAP[href];
  // Prefix match for /modules/xxx
  if (href.startsWith("/modules/")) return href.replace("/modules/", "/product/modules/");
  return href;
}

function fixLinks(links) {
  if (!Array.isArray(links)) return links;
  return links.map((link) => ({
    ...link,
    href: fixUrl(link.href),
    links: link.links ? fixLinks(link.links) : undefined,
    sections: Array.isArray(link.sections)
      ? link.sections.map((s) => ({ ...s, links: fixLinks(s.links) }))
      : link.sections,
  }));
}

loadEnv();
const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-04-20",
  token: "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
  useCdn: false,
});

async function run() {
  const home = await client.fetch(`*[_type == "homePage"][0]{
    _id,
    navbarMenuItems[]{ label, href, sections[]{ heading, links[]{ label, href, description } } },
    organizationCards[]{ title, description, href, icon, color, iconColor }
  }`);

  if (!home) { console.error("No homePage found"); process.exit(1); }

  // Fix navbar
  const fixedNavbar = fixLinks(home.navbarMenuItems || []);

  // Fix organization cards (the "Explore Use Case" section on homepage)
  const fixedOrgCards = (home.organizationCards || []).map((card) => {
    const fixed = fixUrl(card.href);
    if (fixed !== card.href) console.log(`  OrgCard "${card.title}": ${card.href} → ${fixed}`);
    return { ...card, href: fixed };
  });

  // Log navbar changes
  for (const item of fixedNavbar) {
    for (const section of item.sections || []) {
      for (const link of section.links || []) {
        const orig = (home.navbarMenuItems || [])
          .flatMap(i => (i.sections || []))
          .flatMap(s => (s.links || []))
          .find(l => l.label === link.label)?.href;
        if (orig !== link.href) console.log(`  Nav "${link.label}": ${orig} → ${link.href}`);
      }
    }
  }

  await client.patch(home._id).set({
    navbarMenuItems: fixedNavbar,
    organizationCards: fixedOrgCards,
  }).commit();

  console.log("\n✅ All navbar and org card links fixed!");
}

run().catch(console.error);
