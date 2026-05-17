// One-time script to create the support-attachments bucket in Supabase
// Run: node scripts/create-supabase-bucket.mjs

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://bumxgscngzjadyozdpce.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bXhnc2NuZ3pqYWR5b3pkcGNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM3NDgzNSwiZXhwIjoyMDg2OTUwODM1fQ.NP6osv-1ewQ7254Lf9ikLeJ-oZTTZKDO8UIkamKr3ww"
);

async function main() {
  // List existing buckets
  const { data: buckets, error: listErr } = await supabase.storage.listBuckets();
  console.log("Existing buckets:", buckets?.map(b => b.name));
  
  if (listErr) {
    console.error("Error listing buckets:", listErr.message);
    return;
  }

  const exists = buckets?.some(b => b.name === "support-attachments");
  
  if (exists) {
    console.log("✅ 'support-attachments' bucket already exists!");
    return;
  }

  // Create the bucket
  const { data, error } = await supabase.storage.createBucket("support-attachments", {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB max
    allowedMimeTypes: ["image/*", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "text/csv"],
  });

  if (error) {
    console.error("Error creating bucket:", error.message);
  } else {
    console.log("✅ Created 'support-attachments' bucket!", data);
  }
}

main();
