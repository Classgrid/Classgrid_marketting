import { parseLang } from "@/lib/locale";

import { getInitialSupportData } from "./actions";
import HelpCenterClient from "./HelpCenterClient";
import { JsonLd } from "@/components/seo/JsonLd";

type HelpCenterPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HelpCenterPage({ searchParams }: HelpCenterPageProps) {
  const lang = parseLang((await searchParams) ?? undefined);
  const initialData = await getInitialSupportData();
  
  const jsonLdData = [
    {
      "@type": "CollectionPage",
      "@id": "https://classgrid.in/help-center/#webpage",
      "name": "Classgrid Help Center",
      "url": "https://classgrid.in/help-center",
      "about": { "@id": "https://classgrid.in/#software" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://classgrid.in/" },
        { "@type": "ListItem", "position": 2, "name": "Help Center", "item": "https://classgrid.in/help-center" }
      ]
    }
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />
      <HelpCenterClient lang={lang} initialData={initialData} />
    </>
  );
}
