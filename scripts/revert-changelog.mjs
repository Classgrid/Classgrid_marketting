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

async function revertToDraft() {
  console.log("Fetching the published document...");
  const publishedDoc = await client.getDocument("changelog_ai_support_agent");
  
  if (publishedDoc) {
    console.log("Found published doc. Converting to draft...");
    
    // Create draft version
    const draftDoc = {
      ...publishedDoc,
      _id: "drafts.changelog_ai_support_agent"
    };
    
    // Save the draft
    await client.createOrReplace(draftDoc);
    console.log("✅ Created draft successfully.");
    
    // Delete the published version
    await client.delete("changelog_ai_support_agent");
    console.log("🗑️ Deleted the live published version.");
    
    console.log("Done! It is now safely a draft in Sanity Studio waiting for you to click Publish.");
  } else {
    console.log("Could not find the published document.");
  }
}

revertToDraft().catch(console.error);
