import { createClient } from "next-sanity";
import "dotenv/config";

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_WRITE_TOKEN, // Needs write access
  useCdn: false,
  apiVersion: "2024-01-01",
});

async function fix() {
  console.log("Fetching case studies to fix localization mismatches...");
  const studies = await sanityClient.fetch(`*[_type == "caseStudy"] { _id, _rev, title, summary, body }`);
  console.log(`Found ${studies.length} case studies...`);

  for (const study of studies) {
    let needsUpdate = false;
    const mutations = {};

    // 1. Fix Title
    if (typeof study.title === "string") {
      mutations.title = { _type: "localeString", en: study.title, hi: "", mr: "" };
      needsUpdate = true;
    }

    // 2. Fix Summary
    if (typeof study.summary === "string") {
      mutations.summary = { _type: "localeText", en: study.summary, hi: "", mr: "" };
      needsUpdate = true;
    }

    // 3. Fix Body (Rich Text)
    if (Array.isArray(study.body) && study.body.length > 0 && typeof study.body[0] === 'object' && !study.body[0].en) {
      // It's an array of blocks, but not an object with 'en', so it's not a localeRichBody yet
      mutations.body = { _type: "localeRichBody", en: study.body, hi: [], mr: [] };
      needsUpdate = true;
    }

    if (needsUpdate) {
      console.log(`Migrating case study: ${study._id}`);
      await sanityClient.patch(study._id).set(mutations).commit();
      console.log(`✅ Successfully fixed case study: ${study._id}`);
    }
  }
  console.log("All done! Refresh your Sanity Studio.");
}

fix().catch(console.error);
