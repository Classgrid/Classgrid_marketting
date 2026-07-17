require('dotenv').config({ path: 'C:/classgrid_marketting/Classgrid_marketting/.env.local' });
const { createClient } = require('@sanity/client');
const { privacyPolicy, termsOfService, securityPolicy, disclaimerPolicy } = require('../../content/legal');
const fs = require('fs');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

function cleanContent(contentArray) {
  if (!contentArray) return contentArray;
  return contentArray.map(block => {
    if (block._type === 'block' && block.children) {
      block.children = block.children.map(child => {
        if (child._type === 'span' && child.text) {
          let newText = child.text;
          newText = newText.replace(/Super Admin Dashboard/gi, 'Administrative Dashboard');
          newText = newText.replace(/superadmin dashboard/gi, 'administrative dashboard');
          newText = newText.replace(/Super Admin/gi, 'Platform Administrator');
          newText = newText.replace(/SuperAdmin/gi, 'Platform Administrator');
          newText = newText.replace(/Platform owner/gi, 'Platform Administrator');
          return { ...child, text: newText };
        }
        return child;
      });
    }
    return block;
  });
}

function cleanSections(sections) {
  return sections.map((sec, i) => {
    return {
      _key: `sec-${i}`,
      id: sec.id || `section-${i}`,
      title: sec.heading || sec.title,
      content: cleanContent(sec.content)
    };
  });
}

async function patchDoc(docId, obj, title) {
  try {
    const updatedSections = cleanSections(obj.sections);
    await client.patch(docId).set({ sections: updatedSections, lastUpdated: new Date().toISOString() }).commit();
    console.log(`✅ Patched ${title} in Sanity!`);
  } catch (error) {
    console.error(`❌ Failed to patch ${title}:`, error.message);
  }
}

async function patchCookies() {
  try {
    // We already generated the correct markdown for cookies, but legalPage expects portable text sections.
    // Instead of generating portable text from scratch, we'll just fall back to the siteContent fallback logic for cookies
    // Or we can construct simple portable text sections for the Cookie Policy manually here.
    
    // Read the corrected cookie policy we made
    const markdown = fs.readFileSync('C:/classgrid_marketting/Classgrid_marketting/scratch/cookie-policy-corrected.md', 'utf8');
    
    // We can just put the whole markdown into one section for the cookie policy since it's short.
    const cookieSections = [
      {
        _key: 'sec-1',
        id: 'cookie-policy',
        title: 'Cookie Policy',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Please refer to the updated Cookie Policy on our website. We use Local Storage keys like `token`, `parent_token`, `rescue_token`, `draft-[id]`, and `org_title` instead of standard cookies.'
              }
            ]
          }
        ]
      }
    ];

    // Wait, the easiest way to give the live site the accurate cookies is to patch the real local storage keys into the portable text of the cookies document!
    
    console.log("Cookie patching handled differently if needed.");
  } catch(e) {
    console.error(e);
  }
}

async function main() {
  await patchDoc('legal-privacy', privacyPolicy, 'Privacy Policy');
  await patchDoc('legal-terms', termsOfService, 'Terms of Service');
  await patchDoc('legal-security', securityPolicy, 'Security Policy');
  await patchDoc('legal-disclaimer', disclaimerPolicy, 'Disclaimer');
}

main();
