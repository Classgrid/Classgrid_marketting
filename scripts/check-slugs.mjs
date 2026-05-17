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
      process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
}
loadEnv();
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-04-20",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
const mods = await client.fetch(`*[_type == "module"]{ title, "slug": slug.current } | order(title asc)`);
for (const m of mods) console.log(`/product/modules/${m.slug}  →  ${m.title}`);
