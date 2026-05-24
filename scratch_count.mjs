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
loadEnv('.env');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { count, error } = await supabase.from('blog_subscribers').select('*', { count: 'exact', head: true }).eq('is_active', true);
  if (error) console.error(error);
  else console.log('SUBSCRIBERS_COUNT:', count);
}

run();
