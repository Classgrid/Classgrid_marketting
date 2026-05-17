import { Metadata } from "next";

import { CmsFallback } from "@/components/ui/CmsErrorBoundary";
import { buildLangHref, extractLocaleString, extractLocaleValue, parseLang } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/metadata";
import { client } from "@/sanity/lib/client";
import { getPosts } from "@/sanity/lib/marketing";
import { postBySlugQuery } from "@/sanity/lib/queries";

import { BlogDetailClient } from "./BlogDetailClient";

export const revalidate = 60;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
  searchParams,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lang = parseLang((await searchParams) ?? undefined);
  const post = await client.fetch(postBySlugQuery, { slug });

  if (!post) {
    return { title: "Blog Post | ClassGrid" };
  }

  const title = extractLocaleString(post.title, lang, "Blog Post");
  const description =
    extractLocaleString(post.excerpt, lang) || `Read ${title} on the ClassGrid Blog.`;

  return buildPageMetadata({
    title: `${title} | ClassGrid Blog`,
    description,
    path: buildLangHref(`/blog/${slug}`, lang),
    ogImage: post.ogImageUrl,
  });
}

export default async function BlogPostPage({ params, searchParams }: BlogPostPageProps) {
  const { slug } = await params;
  const lang = parseLang((await searchParams) ?? undefined);

  const [post, allPosts] = await Promise.all([
    client.fetch(postBySlugQuery, { slug }),
    getPosts(),
  ]);

  if (!post) {
    return (
      <CmsFallback
        type="blog post"
        backHref={buildLangHref("/blog", lang)}
        backLabel="Back to Blog"
      />
    );
  }

  const localizedPost = {
    ...post,
    body: extractLocaleValue(post.body, lang, []),
  };

  const filteredPosts = (Array.isArray(allPosts) ? allPosts : []).filter((item: any) => item.slug !== slug);
  const sameCategoryPosts = filteredPosts.filter(
    (item: any) => item.category?.toLowerCase() === post.category?.toLowerCase()
  );
  const relatedPosts = [...sameCategoryPosts, ...filteredPosts]
    .filter((value, index, array) => array.findIndex((candidate) => candidate._id === value._id) === index)
    .slice(0, 9);

  return (
    <div className="relative bg-background pb-12">
      <BlogDetailClient post={localizedPost} relatedPosts={relatedPosts} lang={lang} />
    </div>
  );
}
