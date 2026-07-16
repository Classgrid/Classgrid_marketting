import { client } from './client.js';

async function run() {
  const query = `*[_type == "helpArticle"]{ _id, title, "categoryName": category->title.en, "categorySlug": category->slug.current, "slug": slug.current, subCategory }`;
  const result = await client.fetch(query);
  console.log(JSON.stringify(result, null, 2));
}

run().catch(console.error);
