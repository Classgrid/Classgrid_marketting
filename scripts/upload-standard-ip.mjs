import { createClient } from "next-sanity";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
const envPath = path.resolve(__dirname, "../.env.local");
dotenv.config({ path: envPath });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error("Missing required Sanity environment variables");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
});

async function uploadStandardLegalPage() {
  try {
    const enFile = fs.readFileSync(path.resolve(__dirname, "../cms-drafts/blogs/Intellectual_Property_Protection_Policy.md"), "utf8");
    const hiFile = fs.readFileSync(path.resolve(__dirname, "../cms-drafts/blogs/Intellectual_Property_Protection_Policy_HI.md"), "utf8");
    const mrFile = fs.readFileSync(path.resolve(__dirname, "../cms-drafts/blogs/Intellectual_Property_Protection_Policy_MR.md"), "utf8");

    // Convert MD to Portable Text chunks for standard legal page body
    // For simplicity we'll just put the raw text inside a portable text block
    const toPortableText = (text) => {
      return text.split('\n\n').map(paragraph => ({
        _type: "block",
        _key: Math.random().toString(36).substring(7),
        style: "normal",
        children: [{ _type: "span", _key: Math.random().toString(36).substring(7), text: paragraph, marks: [] }]
      }));
    };

    const enDoc = {
      _type: "legalPage",
      title: "Intellectual Property Protection Policy (English)",
      slug: { _type: "slug", current: "ip-protection" },
      lastUpdated: new Date().toISOString(),
      body: toPortableText(enFile),
    };

    const hiDoc = {
      _type: "legalPage",
      title: "Intellectual Property Protection Policy (Hindi)",
      slug: { _type: "slug", current: "ip-protection-hi" },
      lastUpdated: new Date().toISOString(),
      body: toPortableText(hiFile),
    };

    const mrDoc = {
      _type: "legalPage",
      title: "Intellectual Property Protection Policy (Marathi)",
      slug: { _type: "slug", current: "ip-protection-mr" },
      lastUpdated: new Date().toISOString(),
      body: toPortableText(mrFile),
    };

    await client.create(enDoc);
    await client.create(hiDoc);
    await client.create(mrDoc);

    console.log("Successfully uploaded standard legal pages!");
  } catch (error) {
    console.error("Upload failed:", error);
  }
}

uploadStandardLegalPage();
