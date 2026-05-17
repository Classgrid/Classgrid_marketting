import type { Metadata } from "next";
import LegalSlugPage, { generateMetadata as generateLegalMetadata } from "../(legal)/[slug]/page";

export async function generateMetadata(): Promise<Metadata> {
  return generateLegalMetadata({ params: Promise.resolve({ slug: "cookies" }) });
}

export default function CookiesPage() {
  return LegalSlugPage({ params: Promise.resolve({ slug: "cookies" }) });
}
