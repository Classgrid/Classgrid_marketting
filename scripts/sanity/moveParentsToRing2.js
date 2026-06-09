require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function moveParentsToRing2() {
  try {
    // Fetch all circularTimeline documents
    const docs = await client.fetch(`*[_type == "circularTimeline"]`);

    if (!docs.length) {
      console.log("No circularTimeline documents found.");
      return;
    }

    for (const doc of docs) {
      if (!Array.isArray(doc.tabs)) continue;

      let changed = false;
      const updatedTabs = doc.tabs.map((tab) => {
        if (!Array.isArray(tab.rings) || tab.rings.length < 2) return tab;

        const ring0Nodes = tab.rings[0]?.nodes || [];
        const ring1Nodes = tab.rings[1]?.nodes || [];

        if (ring0Nodes.includes("Parents")) {
          // Remove "Parents" from ring 0
          const newRing0Nodes = ring0Nodes.filter((n) => n !== "Parents");
          // Add "Parents" to the beginning of ring 1
          const newRing1Nodes = ["Parents", ...ring1Nodes];

          console.log(`[${tab.id || tab.label}] Moving "Parents" from Ring 1 → Ring 2`);
          console.log(`  Ring 1: [${ring0Nodes.join(", ")}] → [${newRing0Nodes.join(", ")}]`);
          console.log(`  Ring 2: [${ring1Nodes.join(", ")}] → [${newRing1Nodes.join(", ")}]`);

          changed = true;
          return {
            ...tab,
            rings: [
              { ...tab.rings[0], nodes: newRing0Nodes },
              { ...tab.rings[1], nodes: newRing1Nodes },
              ...tab.rings.slice(2),
            ],
          };
        }

        console.log(`[${tab.id || tab.label}] No "Parents" in Ring 1 — skipping.`);
        return tab;
      });

      if (changed) {
        await client.patch(doc._id).set({ tabs: updatedTabs }).commit();
        console.log(`\n✅ Updated document: ${doc._id}`);
      } else {
        console.log(`\nNo changes needed for document: ${doc._id}`);
      }
    }

    console.log("\nDone!");
  } catch (err) {
    console.error("Error:", err.message || err);
  }
}

moveParentsToRing2();
