import type { Metadata } from "next";
import Link from "next/link";

import { campaignCards, campaignsCopy } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getCampaignBySlug } from "@/sanity/lib/marketing";

type CampaignPageProps = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CampaignPageProps): Promise<Metadata> {
	const { id } = await params;
	const cmsCampaign = await getCampaignBySlug(id);
	const campaign = cmsCampaign ?? campaignCards.find((item) => item.slug === id);
	const title = campaign ? campaign.title : "Campaign";
	const description = campaign ? campaign.body ?? campaign.subheadline : "Classgrid conversion campaign page.";

	return buildPageMetadata({
		title,
		description,
		path: `/campaigns/${id}`,
	});
}

export default async function Page({ params }: CampaignPageProps) {
	const { id } = await params;
	const cmsCampaign = await getCampaignBySlug(id);
	const campaign = cmsCampaign ?? campaignCards.find((item) => item.slug === id);

	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
			<h1 className="text-heading text-3xl font-bold text-white md:text-5xl">
				{campaign?.title ?? campaign?.headline ?? campaignsCopy.fallbackTitle}
			</h1>
			<p className="mt-3 text-slate-300">
				{campaign?.body ?? campaign?.subheadline ?? campaignsCopy.fallbackBody}
			</p>

			<div className="mt-6 rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
				<p className="text-sm text-slate-200">{campaignsCopy.detailBody}</p>

				<div className="mt-4 flex flex-wrap gap-3">
					<Link
						href="/demo"
						className="inline-flex rounded-md bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] px-4 py-2 text-sm font-semibold text-white"
					>
						{campaignsCopy.primaryCta}
					</Link>
					<Link
						href="/campaigns"
						className="inline-flex rounded-md border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
					>
						{campaignsCopy.secondaryCta}
					</Link>
				</div>
			</div>
		</div>
	);
}
