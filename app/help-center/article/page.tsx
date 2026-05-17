import { redirect } from "next/navigation";

import { buildLangHref, parseLang } from "@/lib/locale";

type ArticleIndexProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ArticleIndex({ searchParams }: ArticleIndexProps) {
  const lang = parseLang((await searchParams) ?? undefined);
  redirect(buildLangHref("/support", lang));
}
