import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN || process.env.SANITY_API_WRITE_TOKEN,
});

async function fetchLegalPages() {
  console.log("Fetching legal pages from Sanity...");
  const pages = await client.fetch(`*[_type == "legalPage"]{
    title,
    "slug": slug.current,
    "introHeading": intro.introductionHeading,
    "introBody": intro.introductionBody,
    "scopeHeading": intro.scopeHeading,
    "scopeBody": intro.scopeBody,
    "sectionTitles": sections[].title,
    sendSubscriberNotification,
    summary,
    lastUpdated,
    effectiveDate
  }`);
  
  console.log(`Found ${pages.length} legal pages.\n`);
  
  pages.forEach((page: any) => {
    console.log(`=========================================`);
    console.log(`TITLE: ${page.title}`);
    console.log(`SLUG: /${page.slug}`);
    console.log(`INTRO HEADING: ${page.introHeading}`);
    console.log(`INTRO BODY: ${page.introBody?.substring(0, 200)}...`);
    console.log(`SCOPE BODY: ${page.scopeBody?.substring(0, 100)}...`);
    console.log(`SECTION TITLES: \n - ${page.sectionTitles?.join("\n - ")}`);
    console.log(`=========================================\n`);
  });

  process.exit(0);
}

fetchLegalPages().catch(console.error);
