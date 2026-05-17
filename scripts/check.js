const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex <= 0) continue;
    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();
    value = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}
loadEnvFile(path.join(process.cwd(), '.env.local'));
loadEnvFile(path.join(process.cwd(), '.env'));

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a4wk6kp5',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-04-20',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function check() {
  const docs = await client.fetch('*[_type == "module"]{_id, title, "slug": slug.current, body}');
  console.log('Total modules:', docs.length);
  const withBody = docs.filter(d => d.body && d.body.length > 0);
  console.log('Modules with body content:', withBody.length);
  if (withBody.length > 0) {
     console.log('Example module with body:', withBody[0].title);
  }
}
check().catch(console.error);
