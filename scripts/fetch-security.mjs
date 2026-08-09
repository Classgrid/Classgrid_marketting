import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-30",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

async function main() {
  const policy = await client.fetch(`*[_type == "legalPage" && slug.current == "security"][0]`);
  import("fs").then(fs => fs.writeFileSync("fetched-policy.json", JSON.stringify(policy, null, 2)));
  console.log("✅ Fetched policy saved to fetched-policy.json");
}

main().catch(console.error);
