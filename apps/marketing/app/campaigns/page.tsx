import Link from "next/link";

import { campaignCards, campaignsCopy, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getCampaignPages, getPageSettings } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.campaigns);

export default async function Page() {
  const [cmsSettings, cmsCampaigns] = await Promise.all([
    getPageSettings("campaigns"),
    getCampaignPages(),
  ]);
  const title = cmsSettings?.title ?? campaignsCopy.title;
  const subtitle = cmsSettings?.subtitle ?? campaignsCopy.subtitle;
  const campaigns = cmsCampaigns?.length ? cmsCampaigns : campaignCards;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
      <p className="mt-3 text-slate-300">{subtitle}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {campaigns.map((campaign: any) => (
          <article key={campaign.slug ?? campaign.campaignId} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
            <h2 className="text-heading text-xl font-semibold text-white">{campaign.title ?? campaign.headline}</h2>
            <p className="mt-3 text-sm text-slate-300">{campaign.body ?? campaign.subheadline}</p>
            <Link
              href={`/campaigns/${campaign.slug ?? campaign.campaignId}`}
              className="mt-4 inline-flex rounded-md border border-white/20 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
            >
              {campaignsCopy.cardCta}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
