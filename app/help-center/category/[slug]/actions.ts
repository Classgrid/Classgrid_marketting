"use server";

import { client } from "@/sanity/lib/client";

export async function getCategoryArticles(slug: string) {
  const [category, articles] = await Promise.all([
    client.fetch(
      `*[_type == "helpCategory" && slug.current == $slug][0]{
        "title": coalesce(title.en, title.hi, title.mr, title),
        "description": coalesce(description.en, description.hi, description.mr, description),
        icon,
        "slug": slug.current
      }`,
      { slug }
    ),
    client.fetch(
      `*[_type == "helpArticle" && category->slug.current == $slug] | order(coalesce(order, 99) asc, _createdAt asc) {
        title,
        "slug": slug.current,
        "subCategory": coalesce(subCategory, "General")
      }`,
      { slug }
    ),
  ]);

  return { category, articles };
}
