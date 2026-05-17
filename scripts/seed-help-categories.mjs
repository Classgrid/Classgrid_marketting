import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-01",
});

// New Help Center categories to add
const newCategories = [
  {
    _type: "helpCategory",
    title: "Getting Started",
    slug: { _type: "slug", current: "getting-started" },
    description: "Set up your institution on Classgrid, onboard your team, and go live fast.",
    icon: "Zap",
    categoryType: "articles",
    order: 1,
  },
  {
    _type: "helpCategory",
    title: "Guides",
    slug: { _type: "slug", current: "guides" },
    description: "Step-by-step walkthroughs for every Classgrid module and feature.",
    icon: "BookOpen",
    categoryType: "articles",
    order: 2,
  },
  {
    _type: "helpCategory",
    title: "FAQ",
    slug: { _type: "slug", current: "faq" },
    description: "Answers to the most common questions about Classgrid pricing, features, and setup.",
    icon: "HelpCircle",
    categoryType: "link",
    externalHref: "/#faq",
    order: 5,
  },
  {
    _type: "helpCategory",
    title: "API Reference",
    slug: { _type: "slug", current: "api-reference" },
    description: "Full REST API documentation for integrating Classgrid with your systems.",
    icon: "Code2",
    categoryType: "link",
    externalHref: "https://docs.classgrid.in",   // update when docs site is live
    order: 6,
  },
  {
    _type: "helpCategory",
    title: "Release Notes",
    slug: { _type: "slug", current: "release-notes" },
    description: "See what's new — feature updates, improvements, and bug fixes across every version.",
    icon: "Scroll",
    categoryType: "link",
    externalHref: "/changelog",
    order: 7,
  },
];

// Update order on existing user-role categories so they appear after the new ones
const existingUpdates = [
  { slug: "i-am-an-admin", order: 3 },
  { slug: "i-am-a-teacher", order: 4 },
  { slug: "i-am-a-student", order: 5 },
];

async function run() {
  console.log("🌱 Seeding Help Center categories...");

  // 1. Add new categories (skip if already exists)
  for (const cat of newCategories) {
    const existing = await sanityClient.fetch(
      `*[_type == "helpCategory" && slug.current == $slug][0]._id`,
      { slug: cat.slug.current }
    );
    if (existing) {
      // Update existing
      await sanityClient.patch(existing).set({
        description: cat.description,
        icon: cat.icon,
        categoryType: cat.categoryType,
        externalHref: cat.externalHref,
        order: cat.order,
      }).commit();
      console.log(`✏️  Updated: ${cat.title}`);
    } else {
      await sanityClient.create(cat);
      console.log(`✅ Created: ${cat.title}`);
    }
  }

  // 2. Update order on existing user-role categories
  for (const update of existingUpdates) {
    const id = await sanityClient.fetch(
      `*[_type == "helpCategory" && slug.current == $slug][0]._id`,
      { slug: update.slug }
    );
    if (id) {
      await sanityClient.patch(id).set({ order: update.order }).commit();
      console.log(`🔄 Reordered: ${update.slug} → order ${update.order}`);
    }
  }

  console.log("\n✅ Help Center categories seeded successfully!");
  console.log("Now go to Sanity Studio to add articles under 'Getting Started' and 'Guides'.");
}

run().catch(console.error);
