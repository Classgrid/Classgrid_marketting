require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function fixCategories() {
  try {
    const categories = await client.fetch(`*[_type == "helpCategory" && slug == null]`);
    
    for (const cat of categories) {
      // Create a URL-friendly slug from the title
      const newSlug = cat.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      console.log(`Fixing category "${cat.title}" -> slug: "${newSlug}"`);
      
      await client.patch(cat._id).set({
        slug: { _type: 'slug', current: newSlug },
        categoryType: cat.categoryType || 'articles'
      }).commit();
    }
    
    console.log("Successfully fixed missing slugs!");
  } catch (err) {
    console.error(err);
  }
}

fixCategories();
