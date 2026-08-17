import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.BLOG_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Service Role Key in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  console.log("Fetching subscribers without a short_code...");
  
  const { data: subscribers, error } = await supabaseAdmin
    .from("blog_subscribers")
    .select("email, short_code");

  if (error) {
    console.error("Error fetching subscribers:", error);
    process.exit(1);
  }

  const needsUpdate = subscribers.filter(sub => !sub.short_code);
  console.log(`Found ${needsUpdate.length} subscribers needing a short_code.`);

  if (needsUpdate.length === 0) {
    console.log("Nothing to do.");
    process.exit(0);
  }

  const updates = needsUpdate.map(sub => ({
    ...sub, // include existing fields (we just have email)
    short_code: crypto.randomBytes(6).toString("base64url").slice(0, 8)
  }));

  console.log("Upserting new short_codes...");
  const { error: upsertError } = await supabaseAdmin
    .from("blog_subscribers")
    .upsert(updates, { onConflict: "email" });

  if (upsertError) {
    console.error("Error upserting short_codes:", upsertError);
    process.exit(1);
  }

  console.log("✅ Successfully backfilled short_codes!");
}

main();
