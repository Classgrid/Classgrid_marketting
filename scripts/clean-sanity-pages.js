const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-04-20",
  useCdn: false,
  token: "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
});

async function run() {
  console.log("Fetching solution pages to clean...");
  const pages = await client.fetch(`*[_type == "solutionPage"]`);
  
  console.log(`Found ${pages.length} solution pages.`);

  let clearedCount = 0;
  for (const page of pages) {
    console.log(`Clearing content for "${page.slug?.current}"...`);
    
    // Unset both the old markdownBody and the new markdownSections
    await client.patch(page._id)
      .unset(['markdownBody', 'markdownSections'])
      .commit();
      
    clearedCount++;
  }

  console.log(`\n✅ Cleaned ${clearedCount} pages! Ready for new MDX content.`);
}

run().catch(console.error);
