import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2026-04-20",
  useCdn: false,
  token: "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
});

const SLUGS_TO_UPLOAD = process.argv.slice(2);
if (SLUGS_TO_UPLOAD.length === 0) {
  console.error("Usage: node upload-solution-pages.mjs for-schools for-admins ...");
  process.exit(1);
}

const MDX_DIR = path.join(process.cwd(), 'solutions');

/**
 * Parse FAQ lines formatted as:
 * - **Question?** Answer text here
 */
function parseFaqs(faqText) {
  const faqs = [];
  const lines = faqText.split('\n');
  let currentQuestion = null;
  let currentAnswer = [];

  for (const line of lines) {
    const boldQMatch = line.match(/^-\s+\*\*(.+?)\*\*\s*(.*)/);
    if (boldQMatch) {
      // Save previous
      if (currentQuestion) {
        faqs.push({ question: currentQuestion, answer: currentAnswer.join(' ').trim() });
      }
      currentQuestion = boldQMatch[1].trim();
      currentAnswer = boldQMatch[2] ? [boldQMatch[2].trim()] : [];
    } else if (currentQuestion && line.trim()) {
      currentAnswer.push(line.trim());
    }
  }
  // Save last
  if (currentQuestion) {
    faqs.push({ question: currentQuestion, answer: currentAnswer.join(' ').trim() });
  }

  return faqs;
}

/**
 * Convert simple HTML tables to Markdown tables so remarkGfm can parse them
 */
function convertHtmlTablesToMarkdown(content) {
  return content.replace(/<table>([\s\S]*?)<\/table>/gi, (match, tableContent) => {
    let rows = [];
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let trMatch;
    while ((trMatch = trRegex.exec(tableContent)) !== null) {
      let rowContent = trMatch[1];
      let cells = [];
      const cellRegex = /<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi;
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
        // Strip any inner tags just in case
        let cellText = cellMatch[1].replace(/<[^>]+>/g, '').trim().replace(/\n/g, ' ');
        cells.push(cellText);
      }
      if (cells.length > 0) {
        rows.push(cells);
      }
    }
    
    if (rows.length === 0) return match;
    
    let mdTable = '\n\n';
    // Headers
    mdTable += '| ' + rows[0].join(' | ') + ' |\n';
    // Separator
    mdTable += '| ' + rows[0].map(() => '---').join(' | ') + ' |\n';
    // Body
    for (let i = 1; i < rows.length; i++) {
      mdTable += '| ' + rows[i].join(' | ') + ' |\n';
    }
    return mdTable + '\n\n';
  });
}

/**
 * Parse MDX into sections and FAQs.
 * - Strips frontmatter
 * - Converts HTML tables to Markdown tables
 * - Only strips JSX component tags (capitalized)
 * - Extracts ### FAQs section separately
 */
function parseMdxToSections(mdxContent) {
  // Strip frontmatter
  let content = mdxContent.replace(/^---[\s\S]*?---\r?\n/, '');

  // Convert tables to markdown first
  content = convertHtmlTablesToMarkdown(content);

  // Strip JSX component tags (capitalized) and expressions only
  content = content
    .replace(/<[A-Z][A-Za-z]*[^>]*\/>/g, '')
    .replace(/<[A-Z][A-Za-z]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z]*>/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/export\s+(?:default\s+)?(?:const|function|class)\s+\w+[\s\S]*?(?=\n##|\n---|\n$)/g, '');

  // Split out the ### FAQs section at the end
  let faqText = '';
  const faqSplit = content.split(/\n###\s+FAQs?\s*\r?\n/i);
  if (faqSplit.length > 1) {
    content = faqSplit[0];
    faqText = faqSplit[1];
  }

  const faqs = faqText ? parseFaqs(faqText) : [];

  // Split into sections by ## headings
  const lines = content.split('\n');
  const sections = [];
  let currentHeading = null;
  let currentLines = [];

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentHeading !== null) {
        const sectionContent = currentLines.join('\n').trim();
        if (sectionContent) sections.push({ heading: currentHeading, content: sectionContent });
      }
      currentHeading = line.replace(/^## /, '').trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  // Save last section
  if (currentHeading !== null) {
    const sectionContent = currentLines.join('\n').trim();
    if (sectionContent) sections.push({ heading: currentHeading, content: sectionContent });
  }

  return { sections, faqs };
}

async function uploadSlug(slug) {
  const mdxPath = path.join(MDX_DIR, `${slug}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    console.error(`❌ MDX file not found: ${mdxPath}`);
    return;
  }

  const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
  const { sections, faqs } = parseMdxToSections(mdxContent);

  console.log(`📄 "${slug}" → ${sections.length} sections, ${faqs.length} FAQs`);

  const doc = await client.fetch(
    `*[_type == "solutionPage" && slug.current == $slug][0]{ _id }`,
    { slug }
  );

  if (!doc?._id) {
    console.error(`❌ No solutionPage found in Sanity for slug: ${slug}`);
    return;
  }

  const patch = client.patch(doc._id).unset(['markdownSections', 'faqs', 'structuredSections', 'markdownBody', 'body']);
  patch.set({ markdownSections: sections });
  if (faqs.length > 0) {
    patch.set({ faqs });
  }
  await patch.commit();

  console.log(`✅ Uploaded "${slug}" — ${sections.length} sections, ${faqs.length} FAQs`);
}

async function run() {
  console.log(`\n🚀 Uploading: ${SLUGS_TO_UPLOAD.join(', ')}\n`);
  for (const slug of SLUGS_TO_UPLOAD) {
    await uploadSlug(slug);
  }
  console.log('\n✅ All done!');
}

run().catch(console.error);
