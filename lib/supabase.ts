import { createClient } from "@supabase/supabase-js";

if (!process.env.BLOG_SUPABASE_URL) {
  throw new Error("Missing env.BLOG_SUPABASE_URL");
}
if (!process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing env.BLOG_SUPABASE_SERVICE_ROLE_KEY");
}

// We use the service role key to securely bypass RLS on the server side
// This client MUST ONLY be imported and used within /api routes or Server Components.
export const supabaseAdmin = createClient(
  process.env.BLOG_SUPABASE_URL,
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
