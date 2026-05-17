// Delete all module documents with null slugs or MODULE_XX prefix slugs, keeping only the clean ones
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

const mods = await client.fetch(`*[_type == "module"]{ _id, title, "slug": slug.current }`);
console.log(`Total modules: ${mods.length}`);

// Delete if: slug is null, slug starts with "module0", slug starts with "module1", slug starts with "module2", slug starts with "module3", slug starts with "module4"
const toDelete = mods.filter(m => {
  if (!m.slug || m.slug === "null") return true;
  if (/^module\d+/.test(m.slug)) return true; // ugly module09... slugs
  return false;
});

console.log(`Deleting ${toDelete.length} bad/duplicate modules...`);
for (const m of toDelete) {
  console.log(`  DEL: ${m.slug || "null"} → "${m.title}"`);
  await client.delete(m._id);
}
console.log(`\n✅ Cleaned up! ${mods.length - toDelete.length} good modules remain.`);
