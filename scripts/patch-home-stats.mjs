/**
 * patch-home-stats.mjs
 * Run: node scripts/patch-home-stats.mjs
 */
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
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function run() {
  try {
    const newStats = [
      { _key: "stat1", label: "Institutions", value: "50+" },
      { _key: "stat2", label: "Students", value: "100,000+" },
      { _key: "stat3", label: "Modules", value: "25+" },
      { _key: "stat4", label: "Uptime", value: "99%+" }
    ];

    console.log("Patching home page stats in Sanity...");
    
    await client
      .patch("homePage")
      .set({ stats: newStats })
      .commit();

    console.log("Successfully patched stats!");
  } catch (error) {
    console.error("Error patching stats:", error);
  }
}

run();
