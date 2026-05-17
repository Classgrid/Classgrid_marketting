import { parseLang } from "@/lib/locale";

import ArticlePageClient from "./ArticlePageClient";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params;
  const lang = parseLang((await searchParams) ?? undefined);

  return <ArticlePageClient slug={slug} lang={lang} />;
}
