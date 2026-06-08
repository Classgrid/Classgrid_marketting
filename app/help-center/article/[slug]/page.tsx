import { parseLang } from "@/lib/locale";
import ArticlePageClient from "./ArticlePageClient";
import { fetchArticleData } from "../../actions";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const { slug } = await params;
  const lang = parseLang((await searchParams) ?? undefined);
  
  // Fetch data on the server
  const initialData = await fetchArticleData(slug);

  return <ArticlePageClient slug={slug} lang={lang} initialData={initialData} />;
}
