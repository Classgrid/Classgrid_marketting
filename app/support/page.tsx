import { parseLang } from "@/lib/locale";
import SupportPageClient from "./SupportPageClient";

export const metadata = {
  title: "Support | Classgrid",
  description: "Technical assistance and operational support for institutions on Classgrid.",
};

type SupportPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SupportPage({ searchParams }: SupportPageProps) {
  const lang = parseLang((await searchParams) ?? undefined);
  return <SupportPageClient lang={lang} />;
}
