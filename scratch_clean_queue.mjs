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

async function cleanQueue() {
  console.log('🗑️ Cleaning old test posts from Supabase queue...');
  
  const { error } = await supabase
    .from('email_notification_queue')
    .update({ status: 'pending', retry_count: 0 })
    .eq('status', 'processing');
    
  if (error) {
    console.error('❌ Failed to delete:', error.message);
  } else {
    console.log('✅ Successfully removed old test items from the queue database!');
  }
}

cleanQueue();
