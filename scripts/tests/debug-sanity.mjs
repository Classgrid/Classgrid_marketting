import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  apiVersion: "2024-03-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const TARGET_TYPES = [
  { type: "post", fields: "title, excerpt, body, slug" },
  { type: "caseStudy", fields: "title, summary, body, slug" },
  { type: "changelogEntry", fields: "title, summary, content, slug" },
  { type: "helpArticle", fields: "title, summary, content, slug" },
];

function describeField(value) {
  if (Array.isArray(value)) return `array(${value.length})`;
  if (!value) return String(value);
  if (typeof value === "object") {
    const keys = Object.keys(value).sort();
    return `object{${keys.join(",")}}`;
  }
  return typeof value;
}

async function logSample(type, fields) {
  const sample = await client.fetch(`*[_type == "${type}"][0]{${fields}}`);
  if (!sample) {
    console.log(`\n[${type}] no documents found`);
    return;
  }

  console.log(`\n[${type}]`);
  console.log("slug.current:", sample.slug?.current ?? null);
  console.log("title:", describeField(sample.title));

  if ("excerpt" in sample) console.log("excerpt:", describeField(sample.excerpt));
  if ("summary" in sample) console.log("summary:", describeField(sample.summary));
  if ("body" in sample) console.log("body:", describeField(sample.body));
  if ("content" in sample) console.log("content:", describeField(sample.content));

  if (sample.slug && typeof sample.slug.current !== "string") {
    console.warn(`WARN: ${type} slug.current is not a plain string`);
  }
}

async function verifySlugLookup() {
  const samplePost = await client.fetch(`*[_type == "post"][0]{slug}`);
  const slug = samplePost?.slug?.current;

  if (!slug) {
    console.log("\n[slug lookup] skipped: no post slug found");
    return;
  }

  const result = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{_id, title, "slug": slug.current}`,
    { slug }
  );

  console.log(`\n[slug lookup] slug.current == "${slug}"`);
  console.log(JSON.stringify(result, null, 2));
}

async function run() {
  console.log("=== SANITY LOCALE DEBUG ===");
  console.log("Project:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
  console.log("Dataset:", process.env.NEXT_PUBLIC_SANITY_DATASET || "production");

  for (const entry of TARGET_TYPES) {
    await logSample(entry.type, entry.fields);
  }

  await verifySlugLookup();
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
