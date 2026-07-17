require('dotenv').config({ path: 'C:/classgrid_marketting/Classgrid_marketting/.env.local' });
const { createClient } = require('@sanity/client');
const { privacyPolicy, termsOfService, securityPolicy, disclaimerPolicy } = require('../../content/legal');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// Helper to convert the block array back to markdown
function blocksToMarkdown(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';
  return blocks.map(block => {
    if (block._type === 'block') {
      let text = block.children.map(c => c.text).join('');
      if (block.style === 'h1') return `# ${text}\n\n`;
      if (block.style === 'h2') return `## ${text}\n\n`;
      if (block.style === 'h3') return `### ${text}\n\n`;
      if (block.listItem === 'bullet') return `- ${text}\n`;
      if (block.listItem === 'number') return `1. ${text}\n`;
      return `${text}\n\n`;
    }
    return '';
  }).join('');
}

function processPolicy(policyObj, slug) {
  let markdown = `# ${policyObj.title}\n\n**Last Updated:** July 17, 2026\n\n`;
  
  for (const section of policyObj.sections) {
    markdown += `## ${section.heading}\n\n`;
    markdown += blocksToMarkdown(section.content);
  }

  // Remove the incorrect terms
  markdown = markdown.replace(/Super Admin/gi, 'Platform Administrator');
  markdown = markdown.replace(/SuperAdmin/gi, 'Platform Administrator');
  markdown = markdown.replace(/Platform owner/gi, 'Platform Administrator');
  markdown = markdown.replace(/superadmin dashboard/gi, 'administrative dashboard');
  markdown = markdown.replace(/Super Admin Dashboard/gi, 'Administrative Dashboard');

  return markdown;
}

async function uploadDoc(title, slug, markdown) {
  const newDoc = {
    _id: `doc-${slug}-policy`,
    _type: 'legalDoc',
    _createdAt: '2026-07-17T00:00:00.000Z',
    lastUpdated: '2026-07-17T00:00:00.000Z',
    effectiveDate: '2026-07-17T00:00:00.000Z',
    title: title,
    slug: {
      _type: 'slug',
      current: slug
    },
    content: markdown
  };

  try {
    const result = await client.createOrReplace(newDoc);
    console.log(`✅ Uploaded ${title} to Sanity! (Slug: ${result.slug.current})`);
  } catch (error) {
    console.error(`❌ Failed to upload ${title}:`, error.message);
  }
}

async function main() {
  const docsToUpload = [
    { title: 'Privacy Policy', slug: 'privacy', obj: privacyPolicy },
    { title: 'Terms of Service', slug: 'terms', obj: termsOfService },
    { title: 'Security Policy', slug: 'security', obj: securityPolicy },
    { title: 'Disclaimer', slug: 'disclaimer', obj: disclaimerPolicy }
  ];

  for (const doc of docsToUpload) {
    const markdown = processPolicy(doc.obj, doc.slug);
    await uploadDoc(doc.title, doc.slug, markdown);
  }
}

main();
