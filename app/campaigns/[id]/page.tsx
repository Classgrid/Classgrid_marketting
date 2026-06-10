import type { Metadata } from "next";
import Link from "next/link";

import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { campaignCards, campaignsCopy } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getCampaignBySlug } from "@/sanity/lib/marketing";

type CampaignPageProps = {
	params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: CampaignPageProps): Promise<Metadata> {
	const { id } = await params;
	const cmsCampaign = await getCampaignBySlug(id);
	const campaign = (cmsCampaign as any) ?? (campaignCards as any).find((item) => item.slug === id);
	const title = (campaign as any)?.title ?? "Campaign";
	const description = (campaign as any)?.body ?? (campaign as any)?.subheadline ?? "Classgrid conversion campaign page.";

	return buildPageMetadata({
		title,
		description,
		path: `/campaigns/${id}`,
	});
}

export default async function Page({ params }: CampaignPageProps) {
	const { id } = await params;
	const cmsCampaign = await getCampaignBySlug(id);
	const campaign = (cmsCampaign as any) ?? (campaignCards as any).find((item) => item.slug === id);

	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
			<SectionAccentBar align="left" />
			<h1 className="text-heading text-3xl font-bold text-slate-900 dark:text-white md:text-5xl">
				{(campaign as any)?.title ?? (campaign as any)?.headline ?? (campaignsCopy as any).fallbackTitle}
			</h1>
			<p className="mt-3 text-muted-foreground">
				{(campaign as any)?.body ?? (campaign as any)?.subheadline ?? (campaignsCopy as any).fallbackBody}
			</p>

			<div className="mt-6 rounded-2xl border border-border bg-card p-6">
				<p className="text-sm text-slate-700 dark:text-slate-200">{campaignsCopy.detailBody}</p>

				<div className="mt-4 flex flex-wrap gap-3">
					<Link
						href="/demo"
						className="inline-flex rounded-md bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] px-4 py-2 text-sm font-semibold text-white"
					>
						{campaignsCopy.primaryCta}
					</Link>
					<Link
						href="/campaigns"
						className="inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-white/20 dark:text-slate-200 dark:hover:bg-white/10"
					>
						{campaignsCopy.secondaryCta}
					</Link>
				</div>
			</div>
		</div>
	);
}
