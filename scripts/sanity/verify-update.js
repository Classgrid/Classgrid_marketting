require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const doc = await client.fetch('*[_id == "3rpjI1abmKeJaJDXiS4TYs"][0]');
  const body = doc.markdownBody;

  // Extract Step 5 section
  const step5Start = body.indexOf('### Step 5');
  const step5End = body.indexOf('### Step 6');
  console.log('===== STEP 5 (CURRENT IN SANITY) =====');
  console.log(body.substring(step5Start, step5End));

  // Extract Step 6 section
  const step6End = body.indexOf('---', step5End);
  console.log('===== STEP 6 (CURRENT IN SANITY) =====');
  console.log(body.substring(step5End, step6End));

  // Check for Zoom
  console.log('\n===== VERIFICATION =====');
  console.log('Contains "Zoom" in Step 5:', body.substring(step5Start, step5End).includes('Zoom'));
  console.log('Contains "Zoom" in Step 6:', body.substring(step5End, step6End).includes('Zoom'));
  console.log('lastUpdatedAt:', doc.lastUpdatedAt);
}

main().catch(console.error);
