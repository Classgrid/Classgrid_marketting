import Link from "next/link";

import { contactCopy, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getContactPage, getPageSettings } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.contact);

type ContactCard = {
  kicker: string;
  address?: string | null;
  body?: string | null;
};

export default async function Page() {
	const [cmsSettings, cms] = await Promise.all([
		getPageSettings("contact"),
		getContactPage(),
	]);
	const title = cms?.headline ?? cmsSettings?.title ?? contactCopy.title;
	const subtitle = cms?.subheadline ?? cmsSettings?.subtitle ?? contactCopy.subtitle;
	const cards: ContactCard[] = cms?.contacts?.length
		? cms.contacts.map((item) => ({
				kicker: item.department ?? "Contact",
				address: item.email ?? item.phone ?? "",
				body: item.description ?? item.phone ?? "",
		  }))
		: contactCopy.cards;
	const primaryCtaLabel = cmsSettings?.primaryCtaLabel ?? contactCopy.primaryCta;
	const primaryCtaHref = cmsSettings?.primaryCtaHref ?? "/demo";
	const secondaryCtaLabel = cmsSettings?.secondaryCtaLabel ?? contactCopy.secondaryCta;
	const secondaryCtaHref = cmsSettings?.secondaryCtaHref ?? "/support";

	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
			<h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
			<p className="mt-3 text-slate-300">{subtitle}</p>

			<div className="mt-6 grid gap-4 md:grid-cols-2">
				{cards.map((card) => (
					<div key={card.kicker} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
						<p className="text-xs tracking-[0.14em] text-blue-200 uppercase">{card.kicker}</p>
						<p className="mt-2 text-sm text-slate-300">{card.address}</p>
						<p className="mt-1 text-sm text-slate-300">{card.body}</p>
					</div>
				))}
			</div>

			<div className="mt-6 flex flex-wrap gap-3">
				<Link
					href={primaryCtaHref}
					className="inline-flex rounded-md bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] px-4 py-2 text-sm font-semibold text-white"
				>
					{primaryCtaLabel}
				</Link>
				<Link
					href={secondaryCtaHref}
					className="inline-flex rounded-md border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
				>
					{secondaryCtaLabel}
				</Link>
			</div>
		</div>
	);
}
