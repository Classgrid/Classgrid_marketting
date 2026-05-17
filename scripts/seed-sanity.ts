import { createClient } from "next-sanity";
import { moduleCatalog } from "../content/modules.ts";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function main() {
  console.log("Starting migration to Sanity...");
  try {
    for (const mod of moduleCatalog) {
      const isBasic = ["academics", "communication", "operations"].includes(mod.category);
      
      const sanityDoc = {
        _type: "module",
        title: mod.title,
        category: mod.category,
        summary: mod.summary,
        details: mod.details,
        basicTier: isBasic,
        premiumTier: true,
        institutionTypes: ["school", "college", "coaching"],
      };

      const result = await client.createIfNotExists({
        _id: `module-${mod.id}`,
        ...sanityDoc
      });
      
      console.log(`✅ Migrated: ${mod.title}`);
    }
    console.log("🎉 All modules migrated successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

main();
