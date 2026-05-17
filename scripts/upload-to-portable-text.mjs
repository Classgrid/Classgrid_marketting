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
  console.error("Usage: node upload-to-portable-text.mjs for-schools for-admins ...");
  process.exit(1);
}

const MDX_DIR = path.join(process.cwd(), 'solutions');

function parseTextToChildren(text) {
  const children = [];
  const parts = text.split(/(\*\*.*?\*\*)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith('**') && part.endsWith('**')) {
      children.push({
        _type: 'span',
        marks: ['strong'],
        text: part.slice(2, -2)
      });
    } else {
      children.push({
        _type: 'span',
        marks: [],
        text: part
      });
    }
  }
  return children;
}

function parseHtmlTableToRichTable(tableHtml) {
  const headers = [];
  const rows = [];
  
  const thRegex = /<th[^>]*>([\s\S]*?)<\/th>/gi;
  let match;
  while ((match = thRegex.exec(tableHtml)) !== null) {
    headers.push(match[1].replace(/<[^>]+>/g, '').trim());
  }
  
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  while ((match = trRegex.exec(tableHtml)) !== null) {
    const trContent = match[1];
    if (trContent.includes('<th')) continue;
    
    const cells = [];
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;
    let tdMatch;
    while ((tdMatch = tdRegex.exec(trContent)) !== null) {
      cells.push(tdMatch[1].replace(/<[^>]+>/g, '').trim().replace(/\n/g, ' '));
    }
    if (cells.length > 0) {
      rows.push({
        _type: 'tableRow',
        cells
      });
    }
  }
  
  return {
    _type: 'richTable',
    headers,
    rows
  };
}

function convertSectionToPortableText(markdownString) {
  let cleanContent = markdownString
    .replace(/<[A-Z][A-Za-z]*[^>]*\/>/g, '')
    .replace(/<[A-Z][A-Za-z]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z]*>/g, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/export\s+(?:default\s+)?(?:const|function|class)\s+\w+[\s\S]*?(?=\n##|\n---|\n$)/g, '');

  const blocks = [];
  const parts = cleanContent.split(/(<table>[\s\S]*?<\/table>)/gi);
  
  let keyCounter = 1;
  const getBlockKey = () => `block_${Date.now()}_${keyCounter++}`;

  for (const part of parts) {
    if (!part.trim()) continue;
    
    if (part.toLowerCase().startsWith('<table')) {
      const richTable = parseHtmlTableToRichTable(part);
      richTable._key = getBlockKey();
      blocks.push(richTable);
    } else {
      const textBlocks = part.split(/\n\n+/);
      for (const tb of textBlocks) {
        const trimmed = tb.trim();
        if (!trimmed) continue;
        
        if (trimmed.startsWith('- ')) {
          const listItems = trimmed.split('\n');
          for (const item of listItems) {
            if (!item.trim()) continue;
            const textContent = item.replace(/^- /, '').trim();
            blocks.push({
              _type: 'block',
              _key: getBlockKey(),
              style: 'normal',
              listItem: 'bullet',
              level: 1,
              children: parseTextToChildren(textContent).map((c, i) => ({ ...c, _key: `span_${i}` }))
            });
          }
        } else {
          blocks.push({
            _type: 'block',
            _key: getBlockKey(),
            style: 'normal',
            children: parseTextToChildren(trimmed).map((c, i) => ({ ...c, _key: `span_${i}` }))
          });
        }
      }
    }
  }
  return blocks;
}

function parseFaqs(faqText) {
  const faqs = [];
  const lines = faqText.split('\n');
  let currentQuestion = null;
  let currentAnswer = [];

  for (const line of lines) {
    const boldQMatch = line.match(/^-\s+\*\*(.+?)\*\*\s*(.*)/);
    if (boldQMatch) {
      if (currentQuestion) {
        faqs.push({ question: { en: currentQuestion }, answer: { en: currentAnswer.join(' ').trim() } });
      }
      currentQuestion = boldQMatch[1].trim();
      currentAnswer = boldQMatch[2] ? [boldQMatch[2].trim()] : [];
    } else if (currentQuestion && line.trim()) {
      currentAnswer.push(line.trim());
    }
  }
  if (currentQuestion) {
    faqs.push({ question: { en: currentQuestion }, answer: { en: currentAnswer.join(' ').trim() } });
  }
  return faqs;
}

function parseMdxToStructuredSections(mdxContent) {
  let content = mdxContent.replace(/^---[\s\S]*?---\r?\n/, '');

  let faqText = '';
  const faqSplit = content.split(/\n###\s+FAQs?\s*\r?\n/i);
  if (faqSplit.length > 1) {
    content = faqSplit[0];
    faqText = faqSplit[1];
  }

  const faqs = faqText ? parseFaqs(faqText) : [];

  const lines = content.split('\n');
  const sections = [];
  let currentHeading = null;
  let currentLines = [];
  let sectionKeyCounter = 1;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentHeading !== null) {
        const sectionContent = currentLines.join('\n').trim();
        if (sectionContent) {
          sections.push({ 
            _key: `section_${Date.now()}_${sectionKeyCounter++}`,
            _type: 'object',
            heading: currentHeading, 
            content: convertSectionToPortableText(sectionContent) 
          });
        }
      }
      currentHeading = line.replace(/^## /, '').trim();
      currentLines = [];
    } else {
      currentLines.push(line);
    }
  }
  if (currentHeading !== null) {
    const sectionContent = currentLines.join('\n').trim();
    if (sectionContent) {
      sections.push({ 
        _key: `section_${Date.now()}_${sectionKeyCounter++}`,
        _type: 'object',
        heading: currentHeading, 
        content: convertSectionToPortableText(sectionContent) 
      });
    }
  }

  return { structuredSections: sections, faqs };
}

async function uploadSlug(slug) {
  const mdxPath = path.join(MDX_DIR, `${slug}.mdx`);
  if (!fs.existsSync(mdxPath)) {
    console.error(`❌ MDX file not found: ${mdxPath}`);
    return;
  }

  const mdxContent = fs.readFileSync(mdxPath, 'utf-8');
  const { structuredSections, faqs } = parseMdxToStructuredSections(mdxContent);

  console.log(`📄 "${slug}" → ${structuredSections.length} structured sections, ${faqs.length} FAQs`);

  const doc = await client.fetch(
    `*[_type == "solutionPage" && slug.current == $slug][0]{ _id }`,
    { slug }
  );

  if (!doc?._id) {
    console.error(`❌ No solutionPage found in Sanity for slug: ${slug}`);
    return;
  }

  const patch = client.patch(doc._id).unset(['markdownSections', 'markdownBody', 'body']);
  patch.set({ structuredSections });
  if (faqs.length > 0) {
    faqs.forEach((f, i) => f._key = `faq_${i}`);
    patch.set({ faqs });
  }
  await patch.commit();

  console.log(`✅ Uploaded "${slug}" to structuredSections successfully.`);
}

async function run() {
  console.log(`\n🚀 Uploading to Portable Text: ${SLUGS_TO_UPLOAD.join(', ')}\n`);
  for (const slug of SLUGS_TO_UPLOAD) {
    await uploadSlug(slug);
  }
  console.log('\n✅ All done!');
}

run().catch(console.error);
