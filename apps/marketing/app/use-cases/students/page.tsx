import { pageMeta, useCaseCopy } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getUseCasePage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.useCasesStudents);

export default async function Page() {
	const cms = await getUseCasePage("students");
	const headline = cms?.headline ?? useCaseCopy.students.headline;
	const body = cms?.subheadline ?? useCaseCopy.students.body;

	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
			<h1 className="text-heading text-3xl font-bold text-white md:text-4xl">
				{headline}
			</h1>
			<p className="mt-4 text-slate-300">{body}</p>
		</div>
	);
}
