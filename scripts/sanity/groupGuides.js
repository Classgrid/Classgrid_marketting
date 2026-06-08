require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  try {
    // Fetch all articles under the "Guides" category
    const query = `*[_type == "helpArticle" && category->slug.current == "guides"]{ _id, title }`;
    const articles = await client.fetch(query);

    console.log(`Found ${articles.length} articles in the "Guides" category.`);

    if (articles.length === 0) {
      return;
    }

    const gettingStartedTitles = [
      "Dashboard Overview",
      "User Management",
      "Roles and Permissions",
      "Admission Workflow"
    ];

    console.log(`\nSetting articles to their new groups...`);
    for (const article of articles) {
      const title = article.title?.en || "";
      const groupName = gettingStartedTitles.includes(title) ? "Getting Started" : "Advanced Features";
      
      await client.patch(article._id).set({ subCategory: groupName }).commit();
      console.log(`  ✅ ${title} -> ${groupName}`);
    }

    console.log('\n✅ Successfully divided the articles into two groups!');
  } catch (error) {
    console.error('Error updating Sanity:', error.message);
  }
}

main();
