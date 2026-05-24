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

async function manuallyQueueBlog() {
  console.log('📬 Manually inserting blog post into email notification queue...\n');

  const { error } = await supabase
    .from('email_notification_queue')
    .upsert(
      {
        document_type: 'post',
        document_id: 'post-maharashtra-education-digital-infrastructure-2025',
        slug: 'maharashtra-education-digital-infrastructure-2025',
        title: "Why Maharashtra's Schools, Colleges & Coaching Institutes Can No Longer Ignore Digital Infrastructure",
        status: 'pending',
        retry_count: 0,
        error_message: null,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'document_id' }
    );

  if (error) {
    console.error('❌ Failed to insert:', error.message);
  } else {
    console.log('✅ Blog post queued for email notification!');
    console.log('   Next step: trigger the cron to send the emails.');
  }
}

manuallyQueueBlog();
