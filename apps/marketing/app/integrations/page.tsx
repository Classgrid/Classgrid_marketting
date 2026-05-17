import { integrations, integrationsCopy, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getIntegrationsPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.integrations);

export default async function Page() {
	const cms = await getIntegrationsPage();
	const headline = cms?.headline ?? integrationsCopy.title;
	const subtitle = cms?.subheadline ?? integrationsCopy.subtitle;
	const items = cms?.integrations?.length ? cms.integrations : integrations;

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
			<h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{headline}</h1>
			<p className="mt-3 text-slate-300">{subtitle}</p>

			<div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{items.map((integration: any) => (
					<article key={integration.title ?? integration.name} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
						<h2 className="text-heading text-lg font-semibold text-white">{integration.title ?? integration.name}</h2>
						<p className="mt-2 text-sm text-slate-300">{integration.description}</p>
					</article>
				))}
			</div>
		</div>
	);
}
