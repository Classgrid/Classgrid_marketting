import { createClient } from "@sanity/client";
import { v2 } from "@google-cloud/translate";
import dotenv from "dotenv";

dotenv.config();

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: "2024-03-01",
});

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

async function processField(field, targetLang, fieldType = "localeString") {
  if (typeof field === "string") {
    const translated = await translateText(field, targetLang);
    return { _type: fieldType, en: field, [targetLang]: translated };
  }
  if (field && typeof field === "object" && field.en) {
    if (!field[targetLang]) {
      const translated = await translateText(field.en, targetLang);
      if (translated) field[targetLang] = translated;
    }
    return field;
  }
  return field;
}

async function run() {
  console.log("🚀 Starting Bulk Solutions Translation...");

  const pages = await sanityClient.fetch('*[_type == "solutionPage"]');
  console.log(`Found ${pages.length} pages to process.`);

  for (const page of pages) {
    console.log(`\n📄 Processing Page: ${page.slug?.current || page._id}`);
    const patches = {};
    let hasChanges = false;

    // Simple fields
    const simpleFields = ["label", "headline", "subtitle"];
    for (const f of simpleFields) {
      const oldVal = page[f];
      const newVal = await processField(oldVal, "hi", f === "subtitle" ? "localeText" : "localeString");
      const finalVal = await processField(newVal, "mr", f === "subtitle" ? "localeText" : "localeString");
      if (JSON.stringify(oldVal) !== JSON.stringify(finalVal)) {
        patches[f] = finalVal;
        hasChanges = true;
      }
    }

    // Arrays: capabilities, roleExperiences, faqs
    const arrayFields = [
      { name: "capabilities", subFields: ["feature", "description"] },
      { name: "roleExperiences", subFields: ["roleName", "description"] },
      { name: "faqs", subFields: ["question", "answer"] }
    ];

    for (const af of arrayFields) {
      if (Array.isArray(page[af.name])) {
        const newArray = [];
        let arrayChanged = false;
        for (const item of page[af.name]) {
          const newItem = { ...item };
          for (const sub of af.subFields) {
            const oldSub = newItem[sub];
            const type = sub.includes("description") || sub.includes("answer") ? "localeText" : "localeString";
            const processed = await processField(oldSub, "hi", type);
            const finalSub = await processField(processed, "mr", type);
            if (JSON.stringify(oldSub) !== JSON.stringify(finalSub)) {
              newItem[sub] = finalSub;
              arrayChanged = true;
            }
          }
          newArray.push(newItem);
        }
        if (arrayChanged) {
          patches[af.name] = newArray;
          hasChanges = true;
        }
      }
    }

    // SEO
    if (page.seo) {
      const newSeo = { ...page.seo };
      let seoChanged = false;
      if (newSeo.metaTitle) {
        newSeo.metaTitle = await processField(newSeo.metaTitle, "hi", "localeString");
        newSeo.metaTitle = await processField(newSeo.metaTitle, "mr", "localeString");
        seoChanged = true;
      }
      if (newSeo.metaDescription) {
        newSeo.metaDescription = await processField(newSeo.metaDescription, "hi", "localeText");
        newSeo.metaDescription = await processField(newSeo.metaDescription, "mr", "localeText");
        seoChanged = true;
      }
      if (seoChanged) {
        patches.seo = newSeo;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      console.log(`💾 Saving patches for ${page.slug?.current}...`);
      await sanityClient.patch(page._id).set(patches).commit();
    }
  }

  console.log("\n✅ Bulk Translation Complete!");
}

run().catch(console.error);
