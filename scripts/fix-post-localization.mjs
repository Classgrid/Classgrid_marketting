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
  console.log("Fetching posts to check for localization schema mismatches...");
  const posts = await sanityClient.fetch(`*[_type == "post"] { _id, _rev, title, excerpt, body }`);
  console.log(`Found ${posts.length} posts...`);

  for (const post of posts) {
    let needsUpdate = false;
    const mutations = {};

    // 1. Fix Title
    if (typeof post.title === "string") {
      mutations.title = { en: post.title, hi: "", mr: "" };
      needsUpdate = true;
    }

    // 2. Fix Excerpt
    if (typeof post.excerpt === "string") {
      mutations.excerpt = { en: post.excerpt, hi: "", mr: "" };
      needsUpdate = true;
    }

    // 3. Fix Body (Rich Text)
    if (Array.isArray(post.body)) {
      mutations.body = { en: post.body, hi: [], mr: [] };
      needsUpdate = true;
    }

    if (needsUpdate) {
      console.log(`Migrating post: ${post._id}`);
      await sanityClient.patch(post._id).set(mutations).commit();
      console.log(`✅ Successfully fixed post: ${post._id}`);
    }
  }
  console.log("All done! Refresh your Sanity Studio.");
}

fix().catch(console.error);
