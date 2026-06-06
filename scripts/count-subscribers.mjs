import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.BLOG_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Fetching subscribers from blog_subscribers...\n");
  const { data, error, count } = await supabaseAdmin
    .from("blog_subscribers")
    .select("*", { count: 'exact' });

  if (error) {
    console.error("Error fetching subscribers:", error);
    process.exit(1);
  }

  console.log(`Total count: ${count}`);
  if (data && data.length > 0) {
    console.log("\nSubscriber details:");
    console.table(data.map(sub => ({
      email: sub.email,
      is_active: sub.is_active,
      subscribed_at: new Date(sub.subscribed_at).toLocaleString()
    })));
  } else {
    console.log("No subscribers found in the database.");
  }
}

main();
