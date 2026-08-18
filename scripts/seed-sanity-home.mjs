import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-01",
});

const homeCopy = {
  headline: "The Operating System for Educational Institutions",
  subheadline: "One platform to manage academics, operations, and growth—ClassGrid helps institutions run smarter, faster, and without the chaos of disconnected systems.",
  brandTagline: "The Operating System for Educational Institutions.",
  whatsNew: "⚡ Built for modern, scalable education systems"
};

const homeModuleGrid = {
  title: "Core modules powering daily campus operations",
};

async function run() {
  console.log("🌱 Seeding Sanity with English Homepage text...");

  const homePage = await sanityClient.fetch('*[_type == "homePage"][0]');
  if (!homePage) {
    console.error("❌ Could not find homePage document.");
    return;
  }

  const updates = {
    headline: { _type: "localeString", en: homeCopy.headline },
    subheadline: { _type: "localeText", en: homeCopy.subheadline },
    brandTagline: { _type: "localeText", en: homeCopy.brandTagline },
    showcaseTitle: { _type: "localeString", en: "Core modules powering daily campus operations" },
    showcaseKicker: { _type: "localeString", en: "Module Grid" },
    showcaseSubtitle: { _type: "localeText", en: "Everything you need to manage your institution in one place." },
    platformKicker: { _type: "localeString", en: "Platform Power Identity" },
    platformTitle: { _type: "localeString", en: "See Classgrid in Action" },
    platformBody: { _type: "localeText", en: "Provision fast, automate deeply, and scale confidently with one operational stack." },
    modulesSectionHeading: { _type: "localeString", en: "One platform. One operating system." },
    modulesSectionSubtext: { _type: "localeText", en: "Manage academics, operations, and workflows in one unified platform." },
    stakeholderSectionHeading: { _type: "localeString", en: "One system for every stakeholder" }
  };

  await sanityClient.patch(homePage._id).set(updates).commit();
  console.log("✅ Sanity updated with English text! Now run the translation script.");
}

run().catch(console.error);
