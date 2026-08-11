import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-03-30",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function run() {
  const query = `*[_type == "homeChrome"][0]`;
  const chrome = await client.fetch(query);
  if (!chrome) {
    console.log("No homeChrome document found in Sanity. The app is likely using placeholders.");
    return;
  }
  
  const existingLinks = chrome.footerLegalLinks || [];
  const hasIp = existingLinks.some(link => link.href === "/ip-protection");
  
  if (hasIp) {
    console.log("IP Protection link already exists in Sanity!");
    return;
  }
  
  const newLinks = [
    ...existingLinks,
    { _key: Math.random().toString(36).substring(7), label: "IP Protection", href: "/ip-protection" }
  ];
  
  await client.patch(chrome._id).set({ footerLegalLinks: newLinks }).commit();
  console.log("Added IP Protection link to Sanity footer.");
}

run().catch(console.error);
