import { createClient } from '@sanity/client';
const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-04-20",
  useCdn: false
});
client.fetch(`*[_type == "solutionPage" && slug.current in ["for-students","for-teachers","for-admins","for-schools","for-colleges","for-engineering","for-coaching","for-jr-colleges"]]{
  "slug": slug.current,
  "lastUpdatedAt": coalesce(lastUpdatedAt, "EMPTY"),
  "_updatedAt": _updatedAt
} | order(slug asc)`).then(results => {
  console.log("\n📅 Last Updated Date for all 8 Solution Pages:\n");
  console.table(results);
});
