import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseAdmin = createClient(
  process.env.BLOG_SUPABASE_URL!,
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

async function clearSubscribers() {
  console.log("Fetching current subscribers...");
  
  // We need to pass a valid filter to delete, delete by ID is easiest or just delete not eq to a dummy ID
  const { data, error } = await supabaseAdmin
    .from("blog_subscribers")
    .select("id");

  if (error) {
    console.error("Failed to fetch subscribers:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("No subscribers found. Already empty!");
    return;
  }

  console.log(`Found ${data.length} subscribers. Deleting...`);
  
  // Supabase delete requires a filter. We can filter where id is in the list of all ids.
  const ids = data.map(sub => sub.id);
  
  const { error: deleteError } = await supabaseAdmin
    .from("blog_subscribers")
    .delete()
    .in("id", ids);

  if (deleteError) {
    console.error("Failed to delete subscribers:", deleteError);
  } else {
    console.log("All clear! Deleted all blog and changelog subscribers.");
  }
}

clearSubscribers().catch(console.error);
