import type { MetadataRoute } from "next";

import { siteMeta } from "@/content/siteMeta";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteMeta.domain}/sitemap.xml`,
    host: siteMeta.domain,
  };
}

