import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
})

async function run() {
  console.log("Deleting ALL feedback entries...");
  const ids = await client.fetch(`*[_type == "websiteFeedback"]._id`);
  console.log(`Found ${ids.length} to delete.`);
  for (let i = 0; i < ids.length; i += 100) {
    const batch = ids.slice(i, i + 100);
    const tx = client.transaction();
    batch.forEach(id => tx.delete(id));
    await tx.commit();
    console.log(`Deleted ${Math.min(i + 100, ids.length)} / ${ids.length}`);
  }
  console.log("Done. Database is clean.");
}

run().catch(console.error);
