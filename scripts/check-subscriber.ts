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

async function checkSubscriber() {
  const emailToCheck = "quantumchem25@gmail.com";
  console.log(`Looking up subscriber: ${emailToCheck}`);
  
  const { data, error } = await supabaseAdmin
    .from("blog_subscribers")
    .select("*")
    .eq("email", emailToCheck)
    .maybeSingle();

  if (error) {
    console.error("Error querying Supabase:", error);
    return;
  }

  if (!data) {
    console.log("❌ No subscriber found with that email.");
  } else {
    console.log("✅ Subscriber found:");
    console.log(JSON.stringify(data, null, 2));
  }
}

checkSubscriber().catch(console.error);
