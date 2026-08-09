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

async function fixDuplicate() {
  console.log("🗑️ Deleting the rogue duplicate document I created earlier...");
  
  try {
    // Delete the duplicate documents
    await client.delete("legal_security_policy");
    await client.delete("drafts.legal_security_policy");
    console.log("✅ Deleted duplicates successfully.");
  } catch (err) {
    console.log("Note: Duplicates might already be gone, ignoring delete error.");
  }
}

fixDuplicate();
