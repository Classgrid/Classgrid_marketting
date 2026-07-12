import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Generating 75 fake subscribers...');
  
  const fakes = [];
  
  for (let i = 1; i <= 75; i++) {
    // Spread subscriptions mostly evenly over the last 15 days
    const daysAgo = Math.floor(Math.random() * 15);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    // About 20% of users will be unsubscribed (is_active = false)
    const isActive = Math.random() > 0.2;
    
    let updatedAt = null;
    if (!isActive) {
        // If unsubscribed, set updated_at to some time between their subscribe date and today
        const maxDaysAfter = Math.max(0, daysAgo - 1);
        const unsubsDaysAgo = Math.floor(Math.random() * (maxDaysAfter + 1));
        const uDate = new Date();
        uDate.setDate(uDate.getDate() - unsubsDaysAgo);
        updatedAt = uDate.toISOString();
    }
    
    fakes.push({
        email: `fake_user_${i}_${Date.now()}@example.com`,
        is_active: isActive,
        created_at: date.toISOString(),
        updated_at: updatedAt
    });
  }

  console.log('Inserting into Supabase...');
  
  const { data, error } = await supabase
    .from('blog_subscribers')
    .insert(fakes);

  if (error) {
    console.error('Failed to insert fake data:', error);
  } else {
    console.log('Successfully inserted 75 fake subscribers!');
  }
}

main().catch(console.error);
