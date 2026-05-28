import { createClient } from 'next-sanity';
import fs from 'fs';
import dotenv from 'dotenv';
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
        _type: 'block', style: 'h2',
        children: [{ _type: 'span', text: line.replace('# ', ''), marks: [], _key: `span-${Math.random().toString(36).substring(7)}` }]
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
  const mdPath = String.raw`C:\Users\nikhi\OneDrive\Documents\Classgrid_platfrom\classgrid_platform\classgrid_vs_legacy_platforms_technical_comparison.md`;
  const content = fs.readFileSync(mdPath, 'utf8');

  // 1. Extract JSON block
  const jsonMatch = content.match(/```json([\s\S]*?)```/);
  if (!jsonMatch) { console.error("No JSON block found."); return; }

  let jsonData;
  try { jsonData = JSON.parse(jsonMatch[1].trim()); }
  catch (e) { console.error("Bad JSON:", e); return; }

  // 2. Extract Markdown Body (everything before "## Structured Data")
  const bodyMatch = content.split('## Structured Data');
  if (bodyMatch.length < 2) { console.error("No '## Structured Data' delimiter."); return; }
  const parsedBody = parseMarkdownToBlocks(bodyMatch[0].trim());

  // 3. Slug as proper Sanity slug object (queries use slug.current)
  const slugStr = typeof jsonData.slug === 'object' ? jsonData.slug.current : jsonData.slug;

  // 4. Build payload — comparisonPage type
  const docId = `comparisonpage-${slugStr}`;

  const payload = {
    _id: docId,
    _type: 'comparisonPage',
    competitorName: jsonData.competitorName,
    slug: { _type: 'slug', current: slugStr },  // slug object!
    seoTitle: jsonData.seoTitle,
    metaDescription: jsonData.metaDescription,
    body: parsedBody,
    ratingBadges: jsonData.ratingBadges,
    usps: jsonData.usps,
    featureMatrix: jsonData.featureMatrix,
    migrationTestimonial: jsonData.migrationTestimonial,
    faqs: jsonData.faqs,
  };

  // Add _key to array members
  payload.ratingBadges?.forEach(b => { b._key = b._key || `badge-${Math.random().toString(36).substring(7)}`; });
  payload.usps?.forEach(u => { u._key = u._key || `usp-${Math.random().toString(36).substring(7)}`; });
  payload.featureMatrix?.forEach(fm => { fm._key = fm._key || `fm-${Math.random().toString(36).substring(7)}`; });
  payload.faqs?.forEach(faq => { faq._key = faq._key || `faq-${Math.random().toString(36).substring(7)}`; });

  console.log("1. Uploading comparison as comparisonPage...");
  try {
    const result = await client.createOrReplace(payload);
    console.log(`   ✅ Uploaded: ${result._id}`);
  } catch (err) {
    console.error("   ❌ Upload error:", err.message);
  }

  // 5. Delete old duplicate comparison type doc
  console.log("2. Deleting old comparison_vmedulife doc (comparison type)...");
  try {
    await client.delete('comparison_vmedulife');
    console.log("   ✅ Deleted comparison_vmedulife");
  } catch (err) {
    console.log("   ⚠️ Could not delete (may not exist):", err.message);
  }

  console.log("\nDone! Visit: classgrid.in/compare/legacy-platforms");
}

run();
