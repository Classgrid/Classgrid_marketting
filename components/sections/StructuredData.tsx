"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SocialLink = {
  platform?: string;
  href?: string;
};

type StructuredDataProps = {
  siteName?: string;
  siteUrl?: string;
  contactEmail?: string;
  socialLinks?: SocialLink[];
};

export function StructuredData({
  siteName,
  siteUrl,
  contactEmail,
  socialLinks,
}: StructuredDataProps) {
  const pathname = usePathname();
  const normalizedSiteUrl = siteUrl?.replace(/\/$/, "");
  const pageUrl = normalizedSiteUrl ? `${normalizedSiteUrl}${pathname}` : undefined;
  const [pageTitle, setPageTitle] = useState(siteName || "");
  const [pageDescription, setPageDescription] = useState("");

  useEffect(() => {
    const title = document.title || siteName || "";
    const description = document
      .querySelector('meta[name="description"]')
      ?.getAttribute("content")
      ?.trim();

    setPageTitle(title);
    setPageDescription(description ?? "");
  }, [pathname, siteName]);

  const sameAs = Array.isArray(socialLinks)
    ? socialLinks.map((link) => link?.href).filter(Boolean)
    : [];

  if (!siteName?.trim() || !normalizedSiteUrl) {
    return null;
  }

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: normalizedSiteUrl,
    email: contactEmail,
    sameAs,
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: normalizedSiteUrl,
  };

  const webpage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
    isPartOf: normalizedSiteUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webpage) }} />
    </>
  );
}
