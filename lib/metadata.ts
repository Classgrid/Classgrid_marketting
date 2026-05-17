import type { Metadata } from "next";

import { siteMeta } from "@/content/siteContent";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
  canonical,
  ogImage,
  noIndex = false,
}: MetadataInput): Metadata {
  const url = `${siteMeta.domain}${path}`;
  const fullTitle = `${title} | ${siteMeta.siteName}`;
  const imageUrl = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : `${siteMeta.domain}${ogImage}`
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonical ?? path,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteMeta.siteName,
      type,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
