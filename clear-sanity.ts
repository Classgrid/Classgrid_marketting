import { createClient } from "next-sanity";

// We can just run this with npx tsx
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "x5f9q33v",
  dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function clearSanityMemory() {
  try {
    console.log("Fetching all aiEscalation documents...");
    const docs = await client.fetch(`*[_type == "aiEscalation"]{_id}`);
    
    if (docs.length === 0) {
      console.log("No AI Memory found in Sanity.");
      process.exit(0);
    }
    
    console.log(`Found ${docs.length} documents. Deleting...`);
    
    // Delete one by one for safety
    for (const doc of docs) {
      await client.delete(doc._id);
      console.log(`✅ Deleted ${doc._id}`);
    }
    
    console.log("Successfully wiped all Email AI Memory from Sanity!");
    process.exit(0);
  } catch (error) {
    console.error("Failed to delete Sanity documents:", error);
    process.exit(1);
  }
}

clearSanityMemory();
