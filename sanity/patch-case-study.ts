import { createClient } from "@sanity/client";

async function patch() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  const heroImageId = "image-0a00bf46df4fdb7caacdc5389b42e42313bdbd9e-853x1280-jpg"; // One of the valid jpgs

  console.log("Patching the document to add heroImage...");
  
  try {
    const res = await client
      .patch("F7UTJs143qSd27cb9VDPdZ") // The ID from my last run
      .set({
        heroImage: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: heroImageId
          }
        }
      })
      .commit();
    console.log("Successfully patched!", res._id);
  } catch (error) {
    console.error("Failed to patch:", error);
  }
}

patch().catch(console.error);
