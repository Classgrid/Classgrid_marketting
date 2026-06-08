import { parseLang } from "@/lib/locale";

import { getInitialSupportData } from "./actions";
import HelpCenterClient from "./HelpCenterClient";

type HelpCenterPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HelpCenterPage({ searchParams }: HelpCenterPageProps) {
  const lang = parseLang((await searchParams) ?? undefined);
  const initialData = await getInitialSupportData();
  
  return <HelpCenterClient lang={lang} initialData={initialData} />;
}
