import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { IPProtectionClient } from "./IPProtectionClient";
import { client } from "@/sanity/lib/client";

const IP_PROTECTION_QUERY = `*[_type == "ipProtectionPage"]{
  language,
  content,
  sections,
  industryExamples,
  protectionMethods
}`;

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Intellectual Property Protection Policy",
    description:
      "How Classgrid protects its intellectual property through copyright, trade secrets, trademark, and MSME registration — and why SaaS products are not patented.",
    slug: "ip-protection",
  });
}

export default async function IPProtectionPage() {
  const docs = await client.fetch(IP_PROTECTION_QUERY);

  // Build a map keyed by language
  const dataByLang: Record<string, any> = {};
  for (const doc of docs) {
    dataByLang[doc.language] = doc;
  }

  return <IPProtectionClient dataByLang={dataByLang} />;
}
