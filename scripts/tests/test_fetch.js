const { createClient } = require('@sanity/client');
require('dotenv').config();
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-03-01'
});
client.fetch('*[_type == "homePage"][0]').then(d => {
  require('fs').writeFileSync('test-doc.json', JSON.stringify(d, null, 2));
  console.log('Wrote to test-doc.json');
});
