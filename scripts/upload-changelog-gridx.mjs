import { createClient } from "@sanity/client";
import { config } from "dotenv";
import crypto from "crypto";
import { codeToHtml } from "shiki";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-30",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const key = () => crypto.randomBytes(12).toString("base64url");

async function highlightCode(code, lang) {
  try {
    return await codeToHtml(code, {
      lang: lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      transformers: [
        {
          line(node, line) {
            node.properties['data-line'] = line;
          }
        }
      ]
    });
  } catch (e) {
    console.error("Shiki failed to highlight:", e);
    return `<pre><code>${code}</code></pre>`;
  }
}

async function main() {
  console.log("📝 Generating Shiki HTML...");
  
  const installCode = `npm install @classgrid/gridx`;
  const installHtml = await highlightCode(installCode, "bash");

  const usageCode = `import { Button, ImageCropperModal } from "@classgrid/gridx";

export default function ProfileUpload() {
  return (
    <div className="p-8">
      <Button variant="default">Open Cropper</Button>
      <ImageCropperModal isOpen={true} />
    </div>
  );
}`;
  const usageHtml = await highlightCode(usageCode, "tsx");

  console.log("📝 Creating new changelog entry for GridX...");
  
  const doc = {
    _id: "changelog_gridx_release",
    _type: "changelogEntry",
    title: {
      _type: "localeString",
      en: "Introducing GridX: Classgrid's Official UI Component Library"
    },
    slug: {
      _type: "slug",
      current: "introducing-gridx-ui-library"
    },
    seoTitle: "Introducing GridX: Classgrid's Official UI Component Library",
    metaDescription: "Classgrid has officially released GridX, our proprietary standalone React UI library published on NPM, featuring 100+ components and deep Tailwind CSS integration.",
    releaseDate: new Date().toISOString().split('T')[0],
    updateType: "announcement",
    versionLabel: "v0.1.5",
    modules: [],
    sendSubscriberNotification: false,
    ogImageUrl: "https://cdn.classgrid.in/classgrid/classgrid.png",
    summary: {
      _type: "localeText",
      en: "We're thrilled to announce the official release of GridX (@classgrid/gridx). Our proprietary, fully decoupled React UI library is now live on NPM, featuring 100+ beautifully designed components, micro-animations, and strict TypeScript types."
    },
    relatedTourLabel: "View on NPM",
    relatedTourHref: "https://www.npmjs.com/package/@classgrid/gridx",
    content: {
      _type: "localeRichBody",
      en: [
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "Today, we are thrilled to announce a major leap forward in our frontend engineering architecture: the official release of " }, { _key: key(), _type: "span", marks: ["strong"], text: "GridX (@classgrid/gridx)" }, { _key: key(), _type: "span", text: "." }]
        },
        {
          _key: key(),
          _type: "docsImage",
          src: "https://cdn.classgrid.in/classgrid/classgrid.png",
          alt: "Classgrid GridX Component Library",
          title: "GridX UI"
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "As our ecosystem continues to grow, maintaining a cohesive design system by manually copying and pasting component files was no longer a scalable solution. We needed a centralized, enterprise-grade architecture. So, we built one from the ground up." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "GridX is our proprietary, fully decoupled, standalone React UI library, now published directly to the NPM registry. It encapsulates our entire design language, leveraging modern Radix primitives, gorgeous micro-animations, and strict TypeScript definitions." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "h2",
          children: [{ _key: key(), _type: "span", text: "✨ What does this mean for our development speed?" }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          listItem: "bullet",
          level: 1,
          children: [
            { _key: key(), _type: "span", marks: ["strong"], text: "Instant Cross-Project Consistency:" },
            { _key: key(), _type: "span", text: " A button in one app now looks and behaves exactly like a button in another." }
          ]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          listItem: "bullet",
          level: 1,
          children: [
            { _key: key(), _type: "span", marks: ["strong"], text: "Zero Configuration:" },
            { _key: key(), _type: "span", text: " No more messy local component folders. Just install and import." }
          ]
        },
        {
          _key: key(),
          _type: "block",
          style: "h2",
          children: [{ _key: key(), _type: "span", text: "🛠️ Getting Started" }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "Using GridX is as simple as installing any standard React package. In your terminal, run:" }]
        },
        {
          _key: key(),
          _type: "codeBlock",
          language: "bash",
          code: installCode,
          highlightedHtml: installHtml
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "Because GridX is pre-compiled, your repository stays perfectly clean. You can import any of our 100+ highly-styled components directly:" }]
        },
        {
          _key: key(),
          _type: "codeBlock",
          language: "tsx",
          code: usageCode,
          highlightedHtml: usageHtml
        },
        {
          _key: key(),
          _type: "docsFaq",
          question: "How do I use GridX in my existing projects?",
          answer: [
            {
              _key: key(),
              _type: "block",
              style: "normal",
              children: [
                { _key: key(), _type: "span", text: "First, install the package via NPM. Then, make sure you add the GridX preset to your " },
                { _key: key(), _type: "span", marks: ["code"], text: "tailwind.config.ts" },
                { _key: key(), _type: "span", text: " so that Tailwind can scan the package for utility classes. See the official documentation for the exact Tailwind setup snippet." }
              ]
            }
          ]
        },
        {
          _key: key(),
          _type: "docsFaq",
          question: "Why aren't the components downloading into my src folder?",
          answer: [
            {
              _key: key(),
              _type: "block",
              style: "normal",
              children: [
                { _key: key(), _type: "span", text: "Unlike Shadcn UI which pastes raw code into your project, GridX acts like a traditional compiled library (like React or Framer Motion). The compiled JavaScript is securely stored in your " },
                { _key: key(), _type: "span", marks: ["code"], text: "node_modules" },
                { _key: key(), _type: "span", text: " folder, keeping your codebase clean!" }
              ]
            }
          ]
        }
      ]
    }
  };

  const result = await client.createOrReplace(doc);
  console.log("   Created document with ID:", result._id);
  console.log("🎉 DONE! You can now check Sanity Studio to see your changelog entry.");
}

main().catch(console.error);
