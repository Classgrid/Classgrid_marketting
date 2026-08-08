import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.BLOG_SUPABASE_URL,
  process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY
);

async function checkQueue() {
  const { data, error } = await supabase
    .from('email_notification_queue')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching queue:", error);
  } else {
    console.log("Last 5 items in queue:");
    console.log(JSON.stringify(data, null, 2));
  }
}

checkQueue();
