const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clean() {
  await supabase
    .from('email_notification_queue')
    .update({ status: 'pending', retry_count: 0 })
    .eq('status', 'processing');
  console.log("Reset queue items to pending");
}

clean();
