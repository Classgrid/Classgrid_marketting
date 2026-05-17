import { createClient } from '@sanity/client';

const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-04-20",
  useCdn: false,
  token: "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
});

async function cleanLegacyModules() {
  console.log("Fetching legacy 'module' documents to delete...");
  const legacyDocs = await client.fetch(`*[_type == "module"]{_id, title}`);
  
  if (legacyDocs.length === 0) {
    console.log("No legacy modules found. Everything is clean!");
    return;
  }
  
  console.log(`Found ${legacyDocs.length} legacy modules. Deleting them...`);
  
  for (const doc of legacyDocs) {
    try {
      await client.delete(doc._id);
      console.log(`🗑️ Deleted legacy module: ${doc.title || doc._id}`);
    } catch (err) {
      console.error(`❌ Failed to delete ${doc._id}:`, err.message);
    }
  }
  
  console.log("\nCleanup complete! Only the clean, empty solutionModules remain.");
}

cleanLegacyModules();
