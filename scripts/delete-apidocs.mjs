import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

const queryUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=*[_type == "apiDoc"]._id`;

const res = await fetch(queryUrl, {
  headers: { Authorization: `Bearer ${token}` }
});

const data = await res.json();
const ids = data.result || [];

if (ids.length === 0) {
  console.log('No apiDoc documents found to delete.');
  process.exit(0);
}

const mutations = ids.map(id => ({
  delete: { id }
}));

const mutateUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;

const mutateRes = await fetch(mutateUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ mutations }),
});

if (mutateRes.ok) {
  console.log(`✅ Deleted ${ids.length} old apiDoc documents.`);
} else {
  console.error('Failed to delete docs');
}
