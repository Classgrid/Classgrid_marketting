import { createClient } from "@supabase/supabase-js";

// We use the service role key to securely bypass RLS on the server side
// This client MUST ONLY be imported and used within /api routes or Server Components.
export const supabaseAdmin = createClient(
  process.env.BLOG_SUPABASE_URL || "https://placeholder.supabase.co",
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY || "placeholder_key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
