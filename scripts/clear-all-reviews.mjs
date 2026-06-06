import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-03-30",
  token: process.env.SANITY_API_WRITE_TOKEN || "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
  useCdn: false,
});

async function clearAll() {
  console.log("Fetching all remaining community reviews...");
  const reviews = await client.fetch(`*[_type == "communityReview"]{_id}`);
  
  if (reviews.length === 0) {
    console.log("No reviews found. Already empty!");
    return;
  }

  console.log(`Found ${reviews.length} reviews. Deleting...`);
  const transaction = client.transaction();
  reviews.forEach(r => transaction.delete(r._id));
  await transaction.commit();
  console.log("All clear!");
}

clearAll().catch(console.error);
