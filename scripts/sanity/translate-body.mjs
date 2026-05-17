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
  if (!text || text.trim() === "") return text;
  try {
    const [translation] = await translate.translate(text, targetLanguage);
    return translation;
  } catch (error) {
    console.error(`Translation Error:`, error.message);
    return text;
  }
}

async function translateBlocks(blocks, targetLang) {
  if (!Array.isArray(blocks)) return blocks;
  
  const newBlocks = [];
  for (const block of blocks) {
    const newBlock = { ...block };
    
    if (block._type === "block" && Array.isArray(block.children)) {
      const fullText = block.children.map(c => c.text || "").join("");
      if (fullText.trim().length > 0) {
        const transText = await translateText(fullText, targetLang);
        newBlock.children = [{
          _key: block.children[0]._key,
          _type: "span",
          marks: [],
          text: transText
        }];
      }
    }
    
    newBlocks.push(newBlock);
  }
  return newBlocks;
}

async function run() {
  console.log("Fetching students page...");
  const page = await sanityClient.fetch('*[_type == "solutionPage" && slug.current == "students"][0]');
  
  if (!page || !page.body) {
    console.log("No body found!");
    return;
  }

  let enBody = page.body.en;
  if (Array.isArray(page.body)) {
    enBody = page.body;
  }

  if (!enBody) {
    console.log("No english body found!");
    return;
  }

  console.log("Translating body to Hindi...");
  const bodyHi = await translateBlocks(enBody, "hi");
  
  console.log("Translating body to Marathi...");
  const bodyMr = await translateBlocks(enBody, "mr");

  console.log("Saving to Sanity...");
  await sanityClient.patch(page._id).set({
    body: {
      _type: 'localeRichBody',
      en: enBody,
      hi: bodyHi,
      mr: bodyMr
    }
  }).commit();
  
  console.log("Done!");
}

run().catch(console.error);
