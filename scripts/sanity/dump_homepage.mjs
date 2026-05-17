import { createClient } from "next-sanity";
import "dotenv/config";
import fs from "fs";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: "2024-01-01",
});

async function run() {
  const data = await sanityClient.fetch('*[_id == "homePage"][0]');
  fs.writeFileSync('full_homepage.json', JSON.stringify(data, null, 2));
  console.log("Dumped to full_homepage.json");
}

run().catch(console.error);
