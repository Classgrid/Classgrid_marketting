import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-01",
});

async function run() {
  const homePage = await sanityClient.fetch('*[_type == "homePage"][0]');
  console.log("HOMEPAGE DATA:", JSON.stringify(homePage, null, 2));
}

run().catch(console.error);
