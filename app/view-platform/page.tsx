import { ViewPlatformPreview } from "@/components/sections/ViewPlatformPreview";
import { pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata(pageMeta.viewPlatform);

export default function ViewPlatformPage() {
  return <ViewPlatformPreview />;
}
