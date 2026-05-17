import { redirect } from "next/navigation";

import { pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageMeta.institutionsCollege);

export default function Page() {
  redirect("/institutions/college");
}
