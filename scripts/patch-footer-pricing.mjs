import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-01",
});

async function run() {
  console.log("Fetching homePage document from Sanity...");
  const homePages = await sanityClient.fetch('*[_type == "homePage"]');
  console.log(`Found ${homePages.length} homePage documents.`);
  if (homePages.length === 0) return;
  const homePage = homePages[0];
  console.log("homePage footerColumns:", homePage.footerColumns);

  let patchedCount = 0;
  for (const homePage of homePages) {
    if (!homePage.footerColumns) continue;

    let patched = false;
    const updatedColumns = homePage.footerColumns.map(column => {
      if (column.links) {
        column.links = column.links.map(link => {
          if (link.label === "Pricing" || link.href === "/pricing") {
            patched = true;
            return { ...link, label: "Community Forum", href: process.env.NEXT_PUBLIC_FORUM_URL || "http://localhost:4200" };
          }
          return link;
        });
      }
      return column;
    });

    if (patched) {
      console.log(`Patching footerColumns in document ${homePage._id}...`);
      await sanityClient.patch(homePage._id).set({ footerColumns: updatedColumns }).commit();
      patchedCount++;
    }
  }

  if (patchedCount === 0) {
    console.log("⚠️ No 'Pricing' link found in any homePage footer columns.");
  } else {
    console.log(`✅ Sanity footer successfully updated to 'Community Forum' in ${patchedCount} documents!`);
  }
}

run().catch(console.error);
