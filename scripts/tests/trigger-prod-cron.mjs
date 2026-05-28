import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/cron/send-notifications?type=all`;
  console.log(`Hitting ${url} ...`);
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET}`
    }
  });
  
  const text = await res.text();
  console.log('Status:', res.status);
  try {
    console.log('Response:', JSON.stringify(JSON.parse(text), null, 2));
  } catch(e) {
    console.log('Response:', text);
  }
}

main().catch(console.error);
