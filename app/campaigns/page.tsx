import Link from "next/link";

import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { campaignCards, campaignsCopy, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getCampaignPages, getPageSettings } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.campaigns);

export default async function Page() {
  const [cmsSettings, cmsCampaigns] = await Promise.all([
    getPageSettings("campaigns"),
    getCampaignPages(),
  ]);
  const title = (cmsSettings as any)?.title ?? (campaignsCopy as any).title;
  const subtitle = (cmsSettings as any)?.subtitle ?? (campaignsCopy as any).subtitle;
  const campaigns = (cmsCampaigns as any)?.length ? cmsCampaigns : campaignCards;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionAccentBar align="left" />
      <h1 className="text-heading text-3xl font-bold text-foreground md:text-5xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {(campaigns as any).map((campaign: any) => (
          <article key={campaign.slug ?? (campaign as any).campaignId} className="rounded-2xl border border-border bg-card p-5">
            <h2 className="text-heading text-xl font-semibold text-foreground">{campaign.title ?? (campaign as any).headline}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{campaign.body ?? (campaign as any).subheadline}</p>
            <Link
              href={`/campaigns/${campaign.slug ?? (campaign as any).campaignId}`}
              className="mt-4 inline-flex rounded-md border border-border px-3 py-1.5 text-xs text-foreground transition hover:bg-accent hover:text-accent-foreground"
            >
              {campaignsCopy.cardCta}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
