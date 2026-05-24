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

const supabase = createClient(process.env.BLOG_SUPABASE_URL, process.env.BLOG_SUPABASE_SERVICE_ROLE_KEY);

const { data, error } = await supabase
  .from('blog_subscribers')
  .select('*')
  .order('subscribed_at', { ascending: true });

if (error) { console.error(error); process.exit(1); }

console.log(`\n📧 ALL SUBSCRIBERS (${data.length} total):\n`);
data.forEach((sub, i) => {
  const dateField = sub.subscribed_at || sub.created_at;
  const date = dateField ? new Date(dateField).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Unknown';
  console.log(`  ${i + 1}. ${sub.email} | ${sub.is_active ? '✅ Active' : '❌ Inactive'} | Joined: ${date}`);
});
console.log();
