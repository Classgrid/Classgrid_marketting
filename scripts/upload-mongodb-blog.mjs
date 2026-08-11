#!/usr/bin/env node
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return;
  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    val = val.replace(/^["']|["']$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnv(path.join(rootDir, '.env.local'));
loadEnv(path.join(rootDir, '.env'));

const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
if (!TOKEN) { console.error('❌ Missing SANITY_API_WRITE_TOKEN'); process.exit(1); }

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'a4wk6kp5',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-01',
  token: TOKEN,
  useCdn: false,
});

let keyCounter = 0;
function nextKey(prefix = 'k') { return `${prefix}-${++keyCounter}`; }
function span(text, marks = []) { return { _key: nextKey('s'), _type: 'span', text, marks }; }
function block(style, children, extra = {}) { return { _key: nextKey('b'), _type: 'block', style, markDefs: [], children: Array.isArray(children) ? children : [span(children)], ...extra }; }
function heading(level, text) { return block(`h${level}`, [span(text)]); }
function paragraph(text) { return block('normal', [span(text)]); }
function boldParagraph(boldText, normalText) { return { _key: nextKey('b'), _type: 'block', style: 'normal', markDefs: [], children: [span(boldText, ['strong']), span(normalText)] }; }
function bullet(text) { return block('normal', [span(text)], { listItem: 'bullet', level: 1 }); }

const blogBody = [
  paragraph('Every piece of data that flows through Classgrid — student records, attendance, fees, exams, chat, notifications — lives in MongoDB Atlas. It is the single most important piece of technology in our stack.'),

  paragraph('We applied to the MongoDB for Startups program in early July 2026, hoping to get official support from the company behind our database. We followed up three to four times. No reply. After a month of silence, we assumed it was a no.'),

  paragraph('Then tonight, this landed in our inbox:'),

  boldParagraph('Official Email from the MongoDB for Startups Team:', ''),

  block('blockquote', [span("Welcome to the MongoDB for Startups\n\nprogram\n\nHi Nikhil,\n\nCongratulations! We're excited to welcome you into the MongoDB for Startups community.\n\nWe're excited to have you join our community of passionate startups. We are here to support you and ensure you make the most out of MongoDB.")]),

  paragraph('We are in.'),

  heading(3, 'What MongoDB for Startups Gives Us'),

  paragraph('The program is built around a tiered system (Inspire, Grow, Innovate, Scale) that supports startups from prototype to production. Companies already in the program represent over $200 billion in combined valuation. Here is what we now have access to:'),

  heading(4, '🍃 MongoDB Atlas Credits'),
  paragraph('Credits to cover our cloud database hosting on Atlas, reducing our infrastructure spend as we scale to more institutions.'),

  heading(4, '🧑‍💻 1:1 Technical Advisors'),
  paragraph('Direct sessions with MongoDB engineers for guidance on architecture, query optimization, and scaling our data layer across multiple institution types.'),

  heading(4, '🎓 MongoDB University'),
  paragraph('Access to 150+ hands-on labs covering aggregation pipelines, Atlas Search, indexing strategies, and more.'),

  heading(4, '🛟 24/7 Developer Support'),
  paragraph("Priority support with faster response times — essential when your database powers an entire school's daily operations."),

  heading(4, '🤖 Voyage AI & Partner Credits'),
  paragraph('The program now includes tokens for Voyage AI (advanced embedding and reranking models), plus matched credits from technology partners like Fireworks AI and Temporal.'),

  heading(4, '🤝 Go-to-Market Opportunities'),
  paragraph("Co-marketing and visibility through MongoDB's global network of startups and developers."),

  heading(3, 'What This Means'),

  paragraph('MongoDB is the third major infrastructure company — after AWS and Cloudflare — to officially back Classgrid. The company that stores every single byte of our data now stands behind what we are building.'),

  paragraph('We did not expect this acceptance. But it arrived exactly when we needed it most.'),

  paragraph('Thank you, MongoDB. We will put every credit and every resource to work.'),
];

const blogDocument = {
  _id: 'post-mongodb-for-startups-2026',
  _type: 'post',
  title: {
    en: "MongoDB for Startups: Classgrid Is Now Officially Backed by Our Database Partner",
  },
  slug: { _type: 'slug', current: 'mongodb-for-startups-2026' },
  excerpt: {
    en: "Classgrid has been accepted into the MongoDB for Startups program — unlocking Atlas credits, technical advisors, MongoDB University, and developer support for the database that runs our entire platform.",
  },
  publishedAt: new Date().toISOString(),
  category: 'Milestone',
  tags: ['MongoDB', 'Startups', 'Database', 'EdTech', 'Classgrid'],
  readingTimeOverride: 3,
  sendSubscriberNotification: false,
  authors: [
    {
      _key: 'author-1',
      name: 'Nikhil Shinde',
      bio: 'Founder of ClassGrid — building the next-generation operating system for educational institutions across India.',
    },
  ],
  body: { en: blogBody },
};

async function main() {
  console.log('⏳ Downloading image from CDN...');
  try {
    const imgRes = await fetch('https://cdn.classgrid.in/svg__logo_collection/Screenshot_2026-08-10_235744.png');
    const buffer = await imgRes.arrayBuffer();

    console.log('⏳ Uploading image to Sanity...');
    const asset = await client.assets.upload('image', Buffer.from(buffer), {
      filename: 'mongodb-credits-screenshot.png'
    });
    console.log('✅ Image uploaded! Asset ID:', asset._id);

    // Replace the placeholder in the document
    const docString = JSON.stringify(blogDocument).replace('<REPLACE_ME_ASSET_ID>', asset._id);
    const finalDocument = JSON.parse(docString);

    console.log('⏳ Publishing MongoDB blog to Sanity (notification OFF)...');
    const result = await client.createOrReplace(finalDocument);
    console.log('✅ Published successfully!');
    console.log(`   Document ID: ${result._id}`);
  } catch (err) {
    console.error('❌ Failed:', err.message);
    process.exit(1);
  }
}

main();
