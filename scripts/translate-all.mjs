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

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function translateText(text, targetLang) {
  if (!text || typeof text !== "string" || text.trim() === "") return text;
  try {
    const [translation] = await translate.translate(text, { to: targetLang, format: "html" });
    return translation;
  } catch (error) {
    console.error("Translation Error [" + targetLang + "]:", error.message);
    return text;
  }
}

async function translatePortableText(blocks, targetLang) {
  if (!Array.isArray(blocks)) return blocks;
  
  const newBlocks = [];
  for (const block of blocks) {
    const newBlock = JSON.parse(JSON.stringify(block));
    
    if (block._type === "block" && Array.isArray(block.children)) {
      let htmlString = "";
      block.children.forEach((child, index) => {
        htmlString += "<span data-idx='" + index + "'>" + child.text + "</span>";
      });

      let translatedHtml = await translateText(htmlString, targetLang);
      
      const spanRegex = new RegExp("<span data-idx='(\\\\d+)'>([^<]*)</span>", "g");
      let match;
      const newChildren = [];
      let foundMatches = false;
      
      while ((match = spanRegex.exec(translatedHtml)) !== null) {
        foundMatches = true;
        const originalIndex = parseInt(match[1], 10);
        const translatedText = match[2];
        const originalChild = block.children[originalIndex];
        
        if (originalChild) {
          newChildren.push({
            ...originalChild,
            text: translatedText
          });
        }
      }

      if (foundMatches && newChildren.length > 0) {
        newBlock.children = newChildren;
      } else {
        newBlock.children = [{
          _key: block.children[0]?._key || Math.random().toString(36).substring(7),
          _type: "span",
          marks: [],
          text: await translateText(block.children.map(c => c.text).join(""), targetLang)
        }];
      }
    } else if (block._type === "legalTable") {
       if (block.header && Array.isArray(block.header)) {
          newBlock.header = await Promise.all(block.header.map(h => translateText(h, targetLang)));
       }
       if (block.rows && Array.isArray(block.rows)) {
          newBlock.rows = await Promise.all(block.rows.map(async (row) => {
             const newRow = { ...row };
             if (row.cells && Array.isArray(row.cells)) {
                newRow.cells = await Promise.all(row.cells.map(c => translateText(c, targetLang)));
             }
             return newRow;
          }));
       }
    }
    
    newBlocks.push(newBlock);
  }
  return newBlocks;
}

async function translateLocaleString(fieldValue, targetLang) {
  let enText = "";
  if (typeof fieldValue === "object" && fieldValue !== null) {
    enText = fieldValue.en || "";
    if (fieldValue[targetLang] && fieldValue[targetLang].trim() !== "") {
      return fieldValue[targetLang];
    }
  } else if (typeof fieldValue === "string") {
    enText = fieldValue;
  }
  return await translateText(enText, targetLang);
}

async function upgradeToLocaleString(fieldValue) {
  if (!fieldValue) return undefined;
  
  let enText = "";
  if (typeof fieldValue === "string") {
    enText = fieldValue;
  } else if (typeof fieldValue === "object" && fieldValue.en) {
    enText = fieldValue.en;
  }
  
  if (!enText.trim()) return fieldValue;

  const hiText = await translateText(enText, "hi");
  const mrText = await translateText(enText, "mr");

  return {
    _type: "localeString",
    en: enText,
    hi: hiText,
    mr: mrText
  };
}

async function upgradeToLocaleRichBody(fieldValue) {
  if (!fieldValue) return undefined;
  
  let enBody = [];
  if (Array.isArray(fieldValue)) {
    enBody = fieldValue;
  } else if (typeof fieldValue === "object" && fieldValue.en) {
    enBody = fieldValue.en;
  }

  if (!enBody || enBody.length === 0) return fieldValue;

  const hiBody = await translatePortableText(enBody, "hi");
  const mrBody = await translatePortableText(enBody, "mr");

  return {
    _type: "localeRichBody",
    en: enBody,
    hi: hiBody,
    mr: mrBody
  };
}

async function run() {
  console.log("Fetching all relevant documents...");
  const docs = await sanityClient.fetch('*[_type in ["homePage", "solutionPage", "useCasePage", "institutionPage", "policyPage", "legalPage"]]');
  console.log("Found " + docs.length + " documents.");

  for (const doc of docs) {
    console.log("\\nProcessing [" + doc._type + "] " + (doc.title || doc._id) + "...");
    const patches = {};

    if (doc.body) {
      console.log("  Translating rich body...");
      patches.body = await upgradeToLocaleRichBody(doc.body);
    }

    if (doc._type === "homePage") {
      const stringFields = [
        "headline", "subheadline", "platformTitle", "platformKicker", 
        "platformBody", "platformConnectionHint", "platformSystemLabel",
        "showcaseKicker", "showcaseTitle", "showcaseSubtitle",
        "timelineTitle", "timelineSubtitle", "stakeholderSectionHeading", 
        "stakeholderSectionSubtext", "modulesSectionHeading", "modulesSectionSubtext",
        "organizationSectionTitle"
      ];

      for (const field of stringFields) {
        if (doc[field]) {
          console.log("  Translating " + field + "...");
          patches[field] = await upgradeToLocaleString(doc[field]);
        }
      }

      if (doc.platformInputLabels && Array.isArray(doc.platformInputLabels)) {
        console.log("  Translating platformInputLabels...");
        patches.platformInputLabels = await Promise.all(
          doc.platformInputLabels.map(label => upgradeToLocaleString(label))
        );
      }

      if (doc.platformAudienceCards && Array.isArray(doc.platformAudienceCards)) {
        console.log("  Translating platformAudienceCards...");
        patches.platformAudienceCards = await Promise.all(
          doc.platformAudienceCards.map(async (card) => {
            return {
              ...card,
              badge: await upgradeToLocaleString(card.badge),
              title: await upgradeToLocaleString(card.title),
              subtitle: await upgradeToLocaleString(card.subtitle),
            };
          })
        );
      }

      if (doc.timelineTabs && Array.isArray(doc.timelineTabs)) {
        console.log("  Translating timelineTabs...");
        patches.timelineTabs = await Promise.all(
          doc.timelineTabs.map(async (tab) => {
            const newTab = { ...tab, label: await upgradeToLocaleString(tab.label) };
            if (tab.rings && Array.isArray(tab.rings)) {
              newTab.rings = await Promise.all(tab.rings.map(async (ring) => {
                if (Array.isArray(ring)) {
                   return await Promise.all(ring.map(r => upgradeToLocaleString(r)));
                }
                if (ring.nodes && Array.isArray(ring.nodes)) {
                   return {
                     ...ring,
                     nodes: await Promise.all(ring.nodes.map(n => upgradeToLocaleString(n)))
                   };
                }
                return ring;
              }));
            }
            return newTab;
          })
        );
      }
    }

    if (Object.keys(patches).length > 0) {
      console.log("  Committing patches for " + doc._id + "...");
      try {
        await sanityClient.patch(doc._id).set(patches).commit();
        console.log("  Success!");
      } catch (err) {
        console.error("  Failed to commit patch:", err.message);
      }
    } else {
      console.log("  No translatable fields found.");
    }
    
    await delay(1000);
  }
  
  console.log("\\nAll done!");
}

run().catch(console.error);
