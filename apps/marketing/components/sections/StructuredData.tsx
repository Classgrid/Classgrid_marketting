"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { siteMeta } from "@/content/siteContent";

export function StructuredData() {
  const pathname = usePathname();
  const pageUrl = `${siteMeta.domain}${pathname}`;
  const [pageTitle, setPageTitle] = useState(siteMeta.siteName);
  const [pageDescription, setPageDescription] = useState("");

  useEffect(() => {
    const title = document.title || siteMeta.siteName;
    const description = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content")
      ?.trim();

    setPageTitle(title);
    setPageDescription(description ?? "");
  }, [pathname]);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteMeta.siteName,
    url: siteMeta.domain,
    email: siteMeta.helloEmail,
    sameAs: [
      "https://twitter.com/classgrid",
      "https://www.linkedin.com/company/classgrid",
      "https://www.instagram.com/classgrid",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMeta.siteName,
    url: siteMeta.domain,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteMeta.domain}/blog?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
    isPartOf: siteMeta.domain,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }} />
    </>
  );
}
