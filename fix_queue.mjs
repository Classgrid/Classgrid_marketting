import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixQueue() {
  // Check the queue
  const { data, error } = await supabase.from('email_notification_queue').select('*').order('created_at', { ascending: false }).limit(5);
  console.log("Current queue items:", data);
  
  if (data && data.length > 0) {
    const failedItems = data.filter(item => item.status === 'failed' || item.status === 'exhausted');
    if (failedItems.length > 0) {
      console.log("Found failed items. Resetting them to 'pending' so the cron job can retry them!");
      for (const item of failedItems) {
        await supabase.from('email_notification_queue').update({ status: 'pending', retry_count: 0 }).eq('id', item.id);
      }
      console.log("Reset complete. The next cron job run will process them!");
    } else {
      console.log("No failed items found in the recent queue.");
    }
  }
}
fixQueue();
