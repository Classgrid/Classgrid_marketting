import Link from "next/link";
import { pageMeta, useCasesCopy } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getUseCasesLandingPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.useCases);

export default async function Page() {
	const cms = await getUseCasesLandingPage();
	const headline = cms?.headline ?? useCasesCopy.title;
	const subtitle = cms?.subheadline ?? useCasesCopy.subtitle;
	const links = cms?.links?.length ? cms.links : useCasesCopy.links;

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
			<h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{headline}</h1>
			<p className="mt-3 text-slate-300">{subtitle}</p>

			<div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{links.map((item: any) => (
					<Link
						key={item.href ?? item.label}
						href={item.href}
						className="rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-slate-200 transition hover:border-blue-300/40 hover:text-white"
					>
						{item.label}
					</Link>
				))}
			</div>
		</div>
	);
}
