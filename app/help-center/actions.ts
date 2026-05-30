"use server";

import { client } from "@/sanity/lib/client";

export async function getInitialSupportData() {
  const [fetchedArticles, fetchedCategories] = await Promise.all([
    client.fetch(`
      *[_type == "helpArticle" && category->title != "FAQ"] | order(_createdAt desc) {
        title,
        "slug": slug.current,
        summary,
        "category": category->title,
        "categorySlug": category->slug.current
      }
    `),
    client.fetch(`
      *[_type == "helpCategory" && title != "FAQ"] | order(coalesce(order, 99) asc, title asc) {
        "title": coalesce(title.en, title.hi, title.mr, title),
        "description": coalesce(description.en, description.hi, description.mr, description),
        icon,
        "slug": slug.current,
        categoryType,
        externalHref,
        order,
        "articleCount": count(*[_type == "helpArticle" && references(^._id)])
      }
    `),
  ]);
  return { fetchedArticles, fetchedCategories };
}

export async function searchSupportArticles(query: string) {
  return await client.fetch(
    `*[_type == "helpArticle" && category->title != "FAQ" && (
      title match $q ||
      title.en match $q ||
      title.hi match $q ||
      title.mr match $q ||
      summary match $q ||
      summary.en match $q ||
      summary.hi match $q ||
      summary.mr match $q
    )] | order(_createdAt desc)[0...5] {
      title,
      "slug": slug.current,
      "category": category->title
    }`,
    { q: `${query}*` }
  );
}

export async function fetchArticleData(slug: string) {
  return await client.fetch(
    `*[_type == "helpArticle" && slug.current == $slug][0]{
      title,
      "category": category->title,
      summary,
      content,
      markdownBody,
      publishedAt,
      lastUpdatedAt,
      showDates
    }`,
    { slug }
  );
}
