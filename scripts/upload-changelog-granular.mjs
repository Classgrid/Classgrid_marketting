import { createClient } from "@sanity/client";
import { config } from "dotenv";
import crypto from "crypto";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-30",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const key = () => crypto.randomBytes(12).toString("base64url");

async function main() {
  // Step 1: Delete any existing versions (both draft and published)
  console.log("🗑️  Deleting old versions...");
  try { await client.delete("changelog_granular_email_preferences"); } catch(e) { /* ignore */ }
  try { await client.delete("drafts.changelog_granular_email_preferences"); } catch(e) { /* ignore */ }
  console.log("   Done.");

  // Step 2: Fetch a WORKING changelog to see EXACT stored format
  console.log("\n🔍 Fetching working changelog for reference...");
  const ref = await client.fetch(`*[_type=="changelogEntry" && slug.current=="introducing-light-mode"][0]`);
  if (ref) {
    console.log("   Found:", ref.title?.en);
    console.log("   Keys in doc:", Object.keys(ref).join(", "));
    console.log("   title type:", typeof ref.title, JSON.stringify(ref.title));
    console.log("   summary type:", typeof ref.summary, JSON.stringify(ref.summary));
    console.log("   content type:", typeof ref.content, "has en?", !!ref.content?.en);
    if (ref.content?.en?.[0]) {
      console.log("   content.en[0]:", JSON.stringify(ref.content.en[0]));
    }
  } else {
    console.log("   No reference changelog found, trying naac...");
    const naac = await client.fetch(`*[_type=="changelogEntry" && _id=="changelog_naac"][0]{title, summary, content}`);
    console.log("   naac format:", JSON.stringify(naac, null, 2));
  }

  // Step 3: Create the new entry matching EXACT working format
  console.log("\n📝 Creating new changelog entry...");
  
  const doc = {
    _id: "changelog_granular_email_preferences",
    _type: "changelogEntry",
    title: {
      _type: "localeString",
      en: "Introducing Granular Email Preferences"
    },
    slug: {
      _type: "slug",
      current: "granular-email-preferences"
    },
    seoTitle: "Introducing Granular Email Preferences",
    metaDescription: "Classgrid now lets you independently opt-in or opt-out of Blog Posts, Product Changelogs, and Legal Notices emails.",
    releaseDate: "2026-08-09",
    updateType: "feature",
    versionLabel: "v4.2",
    modules: ["platform"],
    sendSubscriberNotification: false,
    summary: {
      _type: "localeText",
      en: "You now have full control over which emails you receive from Classgrid. Independently opt-in or opt-out of Blog Posts, Product Changelogs, and Legal Notices."
    },
    relatedTourLabel: "Learn more",
    relatedTourHref: "/changelog",
    content: {
      _type: "localeRichBody",
      en: [
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "We understand that everyone uses Classgrid differently, and you should have full control over the emails you receive from us. Previously, subscribing to our updates was an all-or-nothing choice. Today, we are excited to introduce Granular Email Preferences." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "h2",
          children: [{ _key: key(), _type: "span", text: "Three Independent Categories" }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "You now have the power to independently opt-in or opt-out of three distinct notification categories:" }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          listItem: "bullet",
          level: 1,
          children: [{ _key: key(), _type: "span", text: "Blog Posts — Educational articles, campus administration insights, and best practices from our team." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          listItem: "bullet",
          level: 1,
          children: [{ _key: key(), _type: "span", text: "Product Changelogs — Be the first to know about new features, bug fixes, and platform improvements." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          listItem: "bullet",
          level: 1,
          children: [{ _key: key(), _type: "span", text: "Legal Notices — Important updates to our Terms of Service, Privacy Policy, and other compliance documents." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "h2",
          children: [{ _key: key(), _type: "span", text: "How to Manage Your Settings" }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "You can easily customize your preferences at any time by clicking the Manage Preferences / Unsubscribe link at the very bottom of any email you receive from us. This ensures that you only receive the information that matters most to you, keeping your inbox clean and relevant." }]
        },
      ]
    }
  };

  const result = await client.createOrReplace(doc);
  console.log("   Created:", result._id);

  // Step 4: Verify by fetching it back
  console.log("\n✅ Verifying...");
  const verify = await client.fetch(`*[_id=="changelog_granular_email_preferences"][0]{title, summary, "contentCount": count(content.en)}`);
  console.log("   title.en:", verify?.title?.en);
  console.log("   summary.en:", verify?.summary?.en?.substring(0, 50) + "...");
  console.log("   content blocks:", verify?.contentCount);
  
  console.log("\n🎉 DONE! Refresh Sanity Studio now.");
}

main().catch(console.error);
