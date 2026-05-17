import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  apiVersion: '2026-03-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M',
  useCdn: false,
});

async function run() {
  console.log('🗑️  Deleting all caseStudy documents...');
  const docs = await client.fetch(`*[_type == "caseStudy"]{ _id, title }`);
  if (!docs.length) { console.log('✅ No case studies found — already clean.'); return; }
  for (const doc of docs) {
    await client.delete(doc._id);
    console.log(`🗑️  Deleted: ${typeof doc.title === 'string' ? doc.title : doc._id}`);
  }
  console.log('✅ All case studies deleted. Sanity is clean.');
}

run();
