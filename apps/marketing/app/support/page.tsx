import Link from "next/link";

import { pageMeta, supportCopy, supportSections } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getPageSettings, getSupportPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.support);

type SupportSection = {
	title: string;
	items: string[];
};

export default async function Page() {
	const [cmsSettings, cms] = await Promise.all([
		getPageSettings("support"),
		getSupportPage(),
	]);
	const title = cms?.headline ?? cmsSettings?.title ?? supportCopy.title;
	const subtitle = cms?.subheadline ?? cmsSettings?.subtitle ?? supportCopy.subtitle;
	const sections: SupportSection[] = cms?.supportChannels?.length
		? cms.supportChannels.map((channel) => ({
				title: channel.title ?? "Support",
				items: [channel.description, channel.link].filter(Boolean) as string[],
		  }))
		: supportSections;
	const faqCtaLabel = cmsSettings?.secondaryCtaLabel ?? supportCopy.faqCta;
	const faqCtaHref = cmsSettings?.secondaryCtaHref ?? "/faq";
	const emailCtaLabel = cmsSettings?.primaryCtaLabel ?? supportCopy.emailCta;
	const emailCtaHref = cmsSettings?.primaryCtaHref ?? "mailto:support@classgrid.in";

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
			<h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
			<p className="mt-3 text-slate-300">{subtitle}</p>

			<div className="mt-6 grid gap-4 md:grid-cols-3">
				{sections.map((section) => (
					<article key={section.title} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
						<h2 className="text-heading text-lg font-semibold text-white">{section.title}</h2>
						<ul className="mt-3 space-y-2 text-sm text-slate-300">
							{section.items.map((item) => (
								<li key={item}>• {item}</li>
							))}
						</ul>
					</article>
				))}
			</div>

			<div className="mt-6 flex flex-wrap gap-3">
				<Link
					href={faqCtaHref}
					className="inline-flex rounded-md border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
				>
					{faqCtaLabel}
				</Link>
				<a
					href={emailCtaHref}
					className="inline-flex rounded-md bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] px-4 py-2 text-sm font-semibold text-white"
				>
					{emailCtaLabel}
				</a>
			</div>
		</div>
	);
}
