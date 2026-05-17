import { createClient } from "@sanity/client";
import { v2 } from "@google-cloud/translate";
import dotenv from "dotenv";

dotenv.config();

// Sanity Config
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-01",
});

// Google Config (v2 supports API Keys)
const translate = new v2.Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY,
});

async function translateText(text, targetLanguage) {
  if (!text || text.trim() === "") return "";
  
  console.log(`Translating to ${targetLanguage}: "${text.substring(0, 30)}..."`);
  
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error(`Translation Error (${targetLanguage}):`, error.message);
    return null;
  }
}

async function run() {
  console.log("🚀 Starting Homepage Translation (v2)...");

  // 1. Fetch Homepage
  const homePage = await sanityClient.fetch('*[_type == "homePage"][0]');
  if (!homePage) {
    console.error("❌ Could not find homePage document in Sanity.");
    return;
  }

  const fieldsToTranslate = [
    "headline",
    "subheadline",
    "brandTagline",
    "showcaseTitle",
    "showcaseKicker",
    "showcaseSubtitle",
    "platformKicker",
    "platformTitle",
    "platformBody",
    "modulesSectionHeading",
    "modulesSectionSubtext",
    "stakeholderSectionHeading"
  ];

  let hasChanges = false;
  const patches = {};

  for (const fieldName of fieldsToTranslate) {
    let field = homePage[fieldName];
    let enText = "";
    let isUpgrade = false;

    // Handle existing plain strings (Upgrade path)
    if (typeof field === "string" && field.trim() !== "") {
      enText = field;
      field = { _type: fieldName.includes("headline") || fieldName.includes("Subtitle") || fieldName.includes("Body") || fieldName.includes("Tagline") ? "localeText" : "localeString", en: enText };
      isUpgrade = true;
    } 
    // Handle existing localized objects
    else if (field && typeof field === "object" && field.en) {
      enText = field.en;
    }

    if (enText) {
      let fieldChanged = false;

      // Translate to Hindi if missing or empty
      if (!field.hi || field.hi === "") {
        const hiText = await translateText(enText, "hi");
        if (hiText) {
          field.hi = hiText;
          fieldChanged = true;
        }
      }

      // Translate to Marathi if missing or empty
      if (!field.mr || field.mr === "") {
        const mrText = await translateText(enText, "mr");
        if (mrText) {
          field.mr = mrText;
          fieldChanged = true;
        }
      }

      if (fieldChanged || isUpgrade) {
        patches[fieldName] = field;
        hasChanges = true;
      }
    }
  }

  if (hasChanges) {
    console.log("💾 Saving translations to Sanity...");
    await sanityClient.patch(homePage._id).set(patches).commit();
    console.log("✅ Translation complete!");
  } else {
    console.log("ℹ️ No new translations needed.");
  }
}

run().catch(console.error);
