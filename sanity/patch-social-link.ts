import { createClient } from "@sanity/client";

async function patch() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  console.log("Patching the document to add championSocialLink...");
  
  try {
    const res = await client
      .patch("F7UTJs143qSd27cb9VDPdZ") // The ID from my last run
      .set({
        championSocialLink: "https://www.linkedin.com/in/robert-jenkins"
      })
      .commit();
    console.log("Successfully patched championSocialLink!", res._id);
  } catch (error) {
    console.error("Failed to patch:", error);
  }
}

patch().catch(console.error);
