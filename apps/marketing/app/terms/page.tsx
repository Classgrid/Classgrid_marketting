import { PortableText } from "@portabletext/react";

import { pageMeta, termsOfService } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getPolicyPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.terms);

export default async function Page() {
	const cms = await getPolicyPage("terms");
	const title = cms?.headline ?? termsOfService.title;
	const updated = cms?.lastUpdated
		? `Last Updated: ${new Date(cms.lastUpdated).toLocaleDateString("en-US", {
			month: "long",
			year: "numeric",
		})}`
		: termsOfService.updated;

	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
			<h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
			<p className="mt-3 text-sm text-slate-400">{updated}</p>

			<div className="mt-6 space-y-4">
				{cms?.content ? (
					<section className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
						<div className="text-sm leading-relaxed text-slate-300">
							<PortableText value={cms.content} />
						</div>
					</section>
				) : (
					termsOfService.sections.map((section) => (
						<section key={section.heading} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
							<h2 className="text-base font-semibold text-white">{section.heading}</h2>
							<p className="mt-2 text-sm leading-relaxed text-slate-300">{section.body}</p>
						</section>
					))
				)}
			</div>
		</div>
	);
}
