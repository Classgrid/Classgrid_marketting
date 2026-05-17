import { buildPageMetadata } from "@/lib/metadata";
import { pageMeta } from "@/content/siteContent";
import ContactClient from "@/components/contact/ContactClient";

export const metadata = buildPageMetadata(pageMeta.contact);

export default function ContactPage() {
  return <ContactClient />;
}
