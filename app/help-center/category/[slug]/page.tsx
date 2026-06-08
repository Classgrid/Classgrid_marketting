import { parseLang } from "@/lib/locale";
import CategoryPageClient from "./CategoryPageClient";
import { getCategoryArticles } from "./actions";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const lang = parseLang((await searchParams) ?? undefined);
  
  // Fetch data on the server
  const initialData = await getCategoryArticles(slug);

  return <CategoryPageClient slug={slug} lang={lang} initialData={initialData} />;
}
