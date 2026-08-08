const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
});

async function main() {
  try {
    const docId = '8FwD3bqpuDdPQOMh1q8t1q'; // The ID of the Cloudflare blog
    
    console.log(`Patching document ${docId} to update category...`);
    const res = await client
      .patch(docId)
      .set({ category: 'Milestone' })
      .commit();
      
    console.log('✅ Successfully updated category to "Milestone"!');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
