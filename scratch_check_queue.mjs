import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

function loadEnv(file) {
  if (fs.existsSync(file)) {
    fs.readFileSync(file, 'utf8').split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const eq = trimmed.indexOf('=');
      if (eq > 0) process.env[trimmed.substring(0, eq)] = trimmed.substring(eq + 1).replace(/^["']|["']$/g, '');
    });
  }
}

loadEnv('.env.local');

const supabaseUrl = process.env.BLOG_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkQueueAndSubscribers() {
  console.log('\n--- 📊 SUPABASE CHECKS ---');
  
  // 1. Check subscribers
  const { count: subCount, error: subErr } = await supabase
    .from('blog_subscribers')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);
    
  if (subErr) console.error('❌ Error fetching subscribers:', subErr.message);
  else console.log(`✅ Active Subscribers: ${subCount}`);

  // 2. Check the email queue
  const { data: queue, error: queueErr } = await supabase
    .from('email_notification_queue')
    .select('title, status, created_at');
    
  if (queueErr) {
    // If table doesn't exist or other error
    console.error('❌ Error fetching queue:', queueErr.message);
  } else {
    console.log(`\n✅ Items in Email Queue: ${queue.length}`);
    queue.forEach(item => {
      console.log(`   - "${item.title}" | Status: ${item.status}`);
    });
  }
  console.log('--------------------------\n');
}

checkQueueAndSubscribers();
