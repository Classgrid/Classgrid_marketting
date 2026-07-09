import { buildPageMetadata } from "@/lib/metadata";
import { pageMeta } from "@/content/siteContent";
import ContactClient from "@/components/contact/ContactClient";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = buildPageMetadata(pageMeta.contact);

export default function ContactPage() {
  const jsonLdData = [
    {
      "@type": "ContactPage",
      "@id": "https://classgrid.in/contact/#webpage",
      "name": "Contact Classgrid",
      "url": "https://classgrid.in/contact",
      "about": { "@id": "https://classgrid.in/#organization" }
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://classgrid.in/" },
        { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://classgrid.in/contact" }
      ]
    }
  ];

  return (
    <>
      <JsonLd data={jsonLdData} />
      <ContactClient />
    </>
  );
}
