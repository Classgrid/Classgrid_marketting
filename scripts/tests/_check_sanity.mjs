import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'a4wk6kp5', // From previous checks
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false // bypass CDN cache
});

async function run() {
  const query = `*[_type == "classgrid_talk"]{ name, college, "institutionLogoUrl": institutionLogo.asset->url }`;
  const data = await client.fetch(query);
  console.log("SANITY DB DUMP:");
  console.log(JSON.stringify(data, null, 2));
}

run();
