import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-30",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  console.log("🔍 Fetching GridX changelog...");
  const docs = await client.fetch(`*[_type=="changelogEntry" && slug.current=="introducing-gridx-ui-library"]`);
  if (!docs.length) {
    console.log("Not found.");
    return;
  }
  
  const doc = docs[0];
  console.log(`Updating document ID: ${doc._id}`);

  // Find the DocsImage block inside content.en
  let updated = false;
  const newContent = doc.content.en.map(block => {
    if (block._type === 'docsImage') {
      block.src = "https://cdn.classgrid.in/classgrid/Screenshot_2026-08-17_220924.png";
      updated = true;
      console.log("Updated DocsImage block in content.");
    }
    return block;
  });

  if (updated) {
    await client.patch(doc._id)
      .set({ 'content.en': newContent })
      .commit();
    console.log("✅ Successfully updated the image in Sanity.");
  } else {
    console.log("Could not find docsImage block.");
  }
}

main().catch(console.error);
