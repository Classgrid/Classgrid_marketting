// Script to patch home page module href links to match seeded module slugs
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

loadEnv();
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a4wk6kp5",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-04-20",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  // Fetch all seeded modules and build a title→slug map
  const modules = await client.fetch(`*[_type == "module"]{ title, "slug": slug.current, headline }`);
  console.log(`Found ${modules.length} seeded modules`);
  
  // Build lookup: normalized title -> slug
  const slugMap = {};
  for (const mod of modules) {
    const key = (mod.title || mod.headline || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    slugMap[key] = mod.slug;
  }
  
  // Fetch home page
  const home = await client.fetch(`*[_type == "homePage"][0]{ _id, modules[]{ title, href, description, color, iconColor, orgs } }`);
  if (!home) { console.error("No homePage found"); process.exit(1); }
  
  const updatedModules = (home.modules || []).map((mod) => {
    const key = (mod.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    
    // Try exact match first
    let matched = slugMap[key];
    
    // Try partial match if no exact
    if (!matched) {
      for (const [mapKey, slug] of Object.entries(slugMap)) {
        if (mapKey.includes(key) || key.includes(mapKey.slice(0, 6))) {
          matched = slug;
          break;
        }
      }
    }
    
    if (matched) {
      const newHref = `/product/modules/${matched}`;
      console.log(`  ${mod.title} → ${newHref}`);
      return { ...mod, href: newHref };
    } else {
      console.warn(`  No match for: "${mod.title}"`);
      return mod;
    }
  });
  
  await client.patch(home._id).set({ modules: updatedModules }).commit();
  console.log("\n✅ Home page module hrefs updated!");
}

run().catch(console.error);
