import { createClient } from '@sanity/client';

const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-04-20",
  useCdn: false,
  token: "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
});

// These are the two slugs that browsers have cached from old permanent redirects.
// We need documents at BOTH the old long slug AND the new short slug.
const missingDocs = [
  {
    _id: "solutionModule-the-unified-classroom-hub",
    slug: "the-unified-classroom-hub",
    headline: "Digital Classroom Management",
    category: "Academic",
    description: "Centralized virtual classroom platform with class activity streams.",
  },
  {
    _id: "solutionModule-teacher-planner-lesson-plan-engine",
    slug: "teacher-planner-lesson-plan-engine",
    headline: "Teacher Planner",
    category: "Academic",
    description: "Lesson planning, syllabus tracking, and faculty workload management.",
  },
];

async function seedMissing() {
  for (const mod of missingDocs) {
    const doc = {
      _id: mod._id,
      _type: "solutionModule",
      slug: { _type: "slug", current: mod.slug },
      category: mod.category,
      label: mod.category,
      headline: mod.headline,
      subtitle: mod.description,
      lastUpdatedAt: new Date().toISOString(),
      structuredSections: [
        {
          _type: "object",
          _key: "intro-section",
          heading: "1. Overview",
          content: [
            {
              _type: "block",
              _key: "intro-block",
              style: "normal",
              markDefs: [],
              children: [
                {
                  _type: "span",
                  _key: "intro-text",
                  text: `Documentation and features for this module are currently being prepared. Check back soon for detailed information about ${mod.headline}.`,
                },
              ],
            },
          ],
        },
      ],
    };

    try {
      await client.createOrReplace(doc);
      console.log(`✅ Seeded: ${mod.headline} (${mod.slug})`);
    } catch (err) {
      console.error(`❌ Failed: ${mod.slug}:`, err.message);
    }
  }
  console.log("\nDone!");
}

seedMissing();
