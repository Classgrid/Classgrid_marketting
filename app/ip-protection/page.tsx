import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/metadata";
import { IPProtectionClient } from "./IPProtectionClient";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Intellectual Property Protection Policy",
    description:
      "How Classgrid protects its intellectual property through copyright, trade secrets, trademark, and MSME registration — and why SaaS products are not patented.",
    slug: "ip-protection",
  });
}

export default function IPProtectionPage() {
  return <IPProtectionClient />;
}
