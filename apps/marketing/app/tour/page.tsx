import { PortableText } from "@portabletext/react";

import { pageMeta, tourCopy, tourSteps } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getTourPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.tour);

export default async function Page() {
	const cms = await getTourPage();
	const headline = cms?.headline ?? tourCopy.title;
	const steps = cms?.steps?.length ? cms.steps : tourSteps;

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
			<p className="text-xs tracking-[0.14em] text-blue-200 uppercase">{tourCopy.kicker}</p>
			<h1 className="text-heading mt-2 text-3xl font-bold text-white md:text-5xl">{headline}</h1>
			{cms?.subheadline ? <p className="mt-3 text-slate-300">{cms.subheadline}</p> : null}
			<div className="mt-6 space-y-3">
				{steps.map((step: any, index: number) => (
					<article key={step.title ?? step.body ?? index} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
						<p className="text-xs tracking-[0.14em] text-blue-200 uppercase">Phase {index + 1}</p>
						<h2 className="text-heading mt-1 text-xl font-semibold text-white">{step.title}</h2>
						{step.description ? (
							<div className="mt-2 text-sm text-slate-300">
								<PortableText value={step.description} />
							</div>
						) : (
							<p className="mt-2 text-sm text-slate-300">{step.body}</p>
						)}
					</article>
				))}
			</div>
		</div>
	);
}
