import { createClient } from "next-sanity";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  console.log("Fetching homePage document...");
  const home = await client.getDocument("homePage");
  if (!home) {
    console.log("No homePage document found.");
    return;
  }

  let modified = false;

  // Clean navSections
  if (Array.isArray(home.navSections)) {
    home.navSections.forEach(section => {
      if (Array.isArray(section.links)) {
        const lenBefore = section.links.length;
        section.links = section.links.filter(l => !l.label?.toLowerCase().includes("tour"));
        if (section.links.length !== lenBefore) modified = true;
      }
      if (Array.isArray(section.sections)) {
        section.sections.forEach(sub => {
          if (Array.isArray(sub.links)) {
            const lenBefore = sub.links.length;
            sub.links = sub.links.filter(l => !l.label?.toLowerCase().includes("tour"));
            if (sub.links.length !== lenBefore) modified = true;
          }
        });
      }
    });
  }

  // Clean footerColumns
  if (Array.isArray(home.footerColumns)) {
    home.footerColumns.forEach(col => {
      if (Array.isArray(col.links)) {
        const lenBefore = col.links.length;
        col.links = col.links.filter(l => !l.label?.toLowerCase().includes("tour"));
        if (col.links.length !== lenBefore) modified = true;
      }
    });
  }

  if (modified) {
    console.log("Found /tour links. Updating document...");
    await client.patch("homePage").set({
      navSections: home.navSections,
      footerColumns: home.footerColumns
    }).commit();
    console.log("✅ Removed Tour links from Sanity homePage!");
  } else {
    console.log("No /tour links found in Sanity homePage.");
  }
}

run().catch(console.error);
