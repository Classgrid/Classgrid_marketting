import { createClient } from "@sanity/client";
import { config } from "dotenv";
config({ path: ".env.local" });

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-30",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Check working changelog
const working = await c.fetch('*[_type=="changelogEntry" && _id=="changelog_naac"][0]{title, summary, content[0]}');
console.log("=== WORKING (naac) ===");
console.log(JSON.stringify(working, null, 2));

// Check our broken one
const broken = await c.fetch('*[_type=="changelogEntry" && _id=="changelog_granular_email_preferences"][0]{title, summary, content}');
console.log("\n=== OURS (granular) ===");
console.log(JSON.stringify(broken, null, 2));
