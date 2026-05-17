import { parseLang } from "@/lib/locale";

import HelpCenterClient from "./HelpCenterClient";

type HelpCenterPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HelpCenterPage({ searchParams }: HelpCenterPageProps) {
  const lang = parseLang((await searchParams) ?? undefined);
  return <HelpCenterClient lang={lang} />;
}
