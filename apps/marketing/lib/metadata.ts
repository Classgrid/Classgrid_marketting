import type { Metadata } from "next";

import { siteMeta } from "@/content/siteContent";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
}: MetadataInput): Metadata {
  const url = `${siteMeta.domain}${path}`;
  const fullTitle = `${title} | ${siteMeta.siteName}`;

  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteMeta.siteName,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
