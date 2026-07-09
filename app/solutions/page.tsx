import { SolutionsPortal } from "@/components/solutions/SolutionsPortal";
import { buildPageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildPageMetadata({
  title: "Solutions",
  description: "Choose your role or institution type and explore how Classgrid solves that exact workflow.",
  path: "/solutions",
});

export default function SolutionsPage() {
  const jsonLdData = [
    {
      "@type": "CollectionPage",
      "@id": "https://classgrid.in/solutions/#webpage",
      "name": "Solutions",
      "url": "https://classgrid.in/solutions",
      "about": { "@id": "https://classgrid.in/#software" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://classgrid.in/" },
        { "@type": "ListItem", "position": 2, "name": "Solutions", "item": "https://classgrid.in/solutions" }
      ]
    }
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />
      <SolutionsPortal />
    </>
  );
}
