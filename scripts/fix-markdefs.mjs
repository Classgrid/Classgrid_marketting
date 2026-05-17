import { createClient } from '@sanity/client';

const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-04-20",
  useCdn: false,
  token: "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
});

async function fixMarkDefs() {
  console.log("Fetching all solutionModules...");
  const docs = await client.fetch(`*[_type == "solutionModule"]{_id, structuredSections}`);
  
  for (const doc of docs) {
    if (doc.structuredSections && doc.structuredSections.length > 0) {
      const fixedSections = doc.structuredSections.map(sec => {
        if (sec.content) {
          sec.content = sec.content.map(block => {
            if (block._type === 'block' && !block.markDefs) {
              return { ...block, markDefs: [] };
            }
            return block;
          });
        }
        return sec;
      });
      
      await client.patch(doc._id).set({ structuredSections: fixedSections }).commit();
      console.log(`✅ Fixed markDefs for ${doc._id}`);
    }
  }
  console.log("Done fixing markDefs!");
}

fixMarkDefs();
