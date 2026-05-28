import { createClient } from 'next-sanity';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

function parseMarkdownToBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split('\n');
  let currentTable = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Handle Tables
    if (line.startsWith('|')) {
      if (!currentTable) {
        currentTable = {
          _key: `block-${Math.random().toString(36).substring(7)}`,
          _type: 'table',
          rows: []
        };
        blocks.push(currentTable);
      }
      if (line.includes('---')) continue;
      const cells = line.split('|').map(cell => cell.trim()).filter((c, idx, arr) => {
        return !(idx === 0 && c === '') && !(idx === arr.length - 1 && c === '');
      });
      currentTable.rows.push({
        _key: `row-${Math.random().toString(36).substring(7)}`,
        cells: cells
      });
      continue;
    } else {
      currentTable = null;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push({
        _key: `block-${Math.random().toString(36).substring(7)}`,
        _type: 'block', style: 'h3',
        children: [{ _type: 'span', text: line.replace('### ', ''), marks: [], _key: `span-${Math.random().toString(36).substring(7)}` }]
      });
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({
        _key: `block-${Math.random().toString(36).substring(7)}`,
        _type: 'block', style: 'h2',
        children: [{ _type: 'span', text: line.replace('## ', ''), marks: [], _key: `span-${Math.random().toString(36).substring(7)}` }]
      });
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push({
        _key: `block-${Math.random().toString(36).substring(7)}`,
        _type: 'block', style: 'h2', // Treat H1 as H2 in body
        children: [{ _type: 'span', text: line.replace('# ', ''), marks: [], _key: `span-${Math.random().toString(36).substring(7)}` }]
      });
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      blocks.push({
        _key: `block-${Math.random().toString(36).substring(7)}`,
        _type: 'block', style: 'blockquote',
        children: [{ _type: 'span', text: line.replace('> ', ''), marks: [], _key: `span-${Math.random().toString(36).substring(7)}` }]
      });
      continue;
    }

    // Bullet Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({
        _key: `block-${Math.random().toString(36).substring(7)}`,
        _type: 'block', style: 'normal', listItem: 'bullet',
        children: [{ _type: 'span', text: line.substring(2), marks: [], _key: `span-${Math.random().toString(36).substring(7)}` }]
      });
      continue;
    }
    if (line.match(/^\d+\.\s/)) {
      blocks.push({
        _key: `block-${Math.random().toString(36).substring(7)}`,
        _type: 'block', style: 'normal', listItem: 'number',
        children: [{ _type: 'span', text: line.replace(/^\d+\.\s/, ''), marks: [], _key: `span-${Math.random().toString(36).substring(7)}` }]
      });
      continue;
    }

    // Normal Paragraph
    blocks.push({
      _key: `block-${Math.random().toString(36).substring(7)}`,
      _type: 'block', style: 'normal',
      children: [{ _type: 'span', text: line, marks: [], _key: `span-${Math.random().toString(36).substring(7)}` }]
    });
  }

  return blocks;
}

async function run() {
  const mdPath = process.argv[2] || String.raw`C:\Users\nikhi\OneDrive\Documents\Classgrid_platfrom\classgrid_platform\case_study.md`;
  
  if (!fs.existsSync(mdPath)) {
    console.error(`File not found: ${mdPath}`);
    console.error(`Usage: node scripts/upload_case_study.mjs <path-to-markdown>`);
    return;
  }
  
  const content = fs.readFileSync(mdPath, 'utf8');

  // 1. Extract JSON block
  const jsonMatch = content.match(/```json([\s\S]*?)```/);
  if (!jsonMatch) { console.error("No JSON block found in the markdown file."); return; }

  let jsonData;
  try { jsonData = JSON.parse(jsonMatch[1].trim()); }
  catch (e) { console.error("Bad JSON:", e); return; }

  // 2. Extract Markdown Body (everything after the JSON block)
  const bodySplit = content.split(/```json[\s\S]*?```/);
  let rawBody = bodySplit.length > 1 ? bodySplit[1].trim() : "";
  
  // Optionally remove "## Structured Data" or similar headers if they exist
  rawBody = rawBody.replace(/^##\s*Structured Data\s*/i, '').trim();
  
  let parsedBody = [];
  if (rawBody.length > 0) {
    parsedBody = parseMarkdownToBlocks(rawBody);
  }

  // 3. Setup Slug
  const slugStr = typeof jsonData.slug === 'object' ? jsonData.slug.current : jsonData.slug;
  if (!slugStr) {
    console.error("Missing slug in JSON data!");
    return;
  }

  // 4. Build payload — caseStudy type
  const docId = `casestudy-${slugStr}`;

  const payload = {
    _id: docId,
    _type: 'caseStudy',
    title: jsonData.title,
    slug: { _type: 'slug', current: slugStr },
    clientName: jsonData.clientName,
    year: jsonData.year,
    institutionType: jsonData.institutionType,
    category: jsonData.category,
    modules: jsonData.modules || [],
    summary: jsonData.summary,
    metrics: jsonData.metrics || [],
    overview: jsonData.overview,
    conclusion: jsonData.conclusion,
    championName: jsonData.championName,
    championRole: jsonData.championRole,
    championQuote: jsonData.championQuote,
    championSocialLink: jsonData.championSocialLink,
    champions: jsonData.champions || [],
    body: parsedBody.length > 0 ? parsedBody : undefined,
  };

  // Add keys to array items
  payload.metrics?.forEach(m => { m._key = m._key || `metric-${Math.random().toString(36).substring(7)}`; });
  payload.champions?.forEach(c => { c._key = c._key || `champ-${Math.random().toString(36).substring(7)}`; });

  console.log(`Uploading case study: ${jsonData.title} as ${docId}...`);
  try {
    const result = await client.createOrReplace(payload);
    console.log(`✅ Uploaded successfully: ${result._id}`);
    console.log(`Note: Images (Hero, Champion Headshots, Gallery) must be uploaded manually in Sanity Studio!`);
  } catch (err) {
    console.error("❌ Upload error:", err.message);
  }
}

run();
