import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
})

async function check() {
  const data = await client.fetch(`*[_type == "websiteFeedback" && pageUrl match "*getting-started*"]{ pageTitle, pageUrl }`);
  
  console.log(`Found ${data.length} feedback entries for Getting Started.\n`);
  
  const uniqueCombos = new Set();
  data.forEach(item => {
    uniqueCombos.add(`Title: "${item.pageTitle}" | URL: "${item.pageUrl}"`);
  });

  console.log("Unique Data Combinations:");
  uniqueCombos.forEach(c => console.log(c));
}

check().catch(console.error);
