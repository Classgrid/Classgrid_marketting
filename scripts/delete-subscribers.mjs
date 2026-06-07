import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const url = process.env.BLOG_SUPABASE_URL;
const key = process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing BLOG_SUPABASE_URL or BLOG_SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabaseAdmin = createClient(url, key, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function clearSubscribers() {
  console.log("Clearing all subscribers from blog_subscribers...");
  
  // In Supabase, to bulk delete all rows, you must provide a filter that matches all rows.
  // Using .neq('email', 'impossible_email@example.com') is a common workaround.
  const { data, error } = await supabaseAdmin
    .from("blog_subscribers")
    .delete()
    .neq("email", "impossible_email@example.com");
  
  if (error) {
    console.error("Error deleting subscribers:", error.message);
  } else {
    console.log("Successfully cleared all subscribers.");
  }
}

clearSubscribers();
