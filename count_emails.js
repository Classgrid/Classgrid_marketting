const mongoose = require('mongoose');
const { createClient } = require('@supabase/supabase-js');

const MONGO_URI = 'mongodb://classgrid-admin:27iwqvVnbpqq6RD5@ac-hs4letd-shard-00-00.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-01.sa5ww0z.mongodb.net:27017,ac-hs4letd-shard-00-02.sa5ww0z.mongodb.net:27017/classgrid?ssl=true&replicaSet=atlas-t4g7k9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Classgrid';

const supabase = createClient(
  'https://bumxgscngzjadyozdpce.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bXhnc2NuZ3pqYWR5b3pkcGNlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM3NDgzNSwiZXhwIjoyMDg2OTUwODM1fQ.NP6osv-1ewQ7254Lf9ikLeJ-oZTTZKDO8UIkamKr3ww'
);

async function check() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;
  
  // Actually get Users where role is 'org_admin' or 'super_admin'
  const users = await db.collection('users').find({ role: { $in: ['org_admin', 'super_admin', 'platform_admin'] }, status: 'active' }).toArray();
  const emails = new Set();
  
  users.forEach(u => {
     if (u.email) emails.add(u.email.toLowerCase().trim());
  });
  console.log('MongoDB Users Emails:', emails.size);

  const { data: subs } = await supabase.from('blog_subscribers').select('email').eq('status', 'subscribed');
  let subCount = 0;
  if (subs) {
     subs.forEach(s => {
       if (s.email && !emails.has(s.email.toLowerCase().trim())) {
         emails.add(s.email.toLowerCase().trim());
         subCount++;
       }
     });
  }
  console.log('Supabase Unique Subscribers (not in Mongo):', subCount);
  console.log('TOTAL UNIQUE EMAILS:', emails.size);
  
  // Wait before exit to avoid async handle closing error
  setTimeout(() => process.exit(0), 1000);
}
check();
