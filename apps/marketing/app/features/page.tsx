import { FeaturesExperience } from "@/components/sections/FeaturesExperience";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { classgridModuleMatrix, featuresCopy, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getFeaturesPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.features);

export default async function Page() {
  const cms = await getFeaturesPage();
  const headline = cms?.headline ?? featuresCopy.title;
  const intro = cms?.subheadline ?? featuresCopy.intro;

	return (
		<div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
			<div className="mb-8">
				<p className="text-xs tracking-[0.16em] text-blue-200 uppercase">{featuresCopy.kicker}</p>
				<h1 className="text-heading mt-2 text-balance text-3xl font-bold text-white md:text-5xl">
					{headline}
				</h1>
				<p className="mt-4 max-w-3xl text-pretty text-slate-300">{intro}</p>
			</div>

			<FeaturesExperience />

			<section className="mt-10 rounded-2xl border border-white/10 bg-[#0A0A0A] p-4">
				<div className="mb-4">
					<p className="text-xs tracking-[0.14em] text-blue-200 uppercase">{featuresCopy.matrixKicker}</p>
					<h2 className="text-heading mt-1 text-2xl font-bold text-white">{featuresCopy.matrixTitle}</h2>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>Module</TableHead>
							<TableHead>School</TableHead>
							<TableHead>Coaching</TableHead>
							<TableHead>Engineering</TableHead>
							<TableHead>Level</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{classgridModuleMatrix.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.id}</TableCell>
								<TableCell className="font-medium text-white">{item.name}</TableCell>
								<TableCell>{item.school ? "Yes" : "No"}</TableCell>
								<TableCell>{item.coaching ? "Yes" : "No"}</TableCell>
								<TableCell>{item.engineering ? "Yes" : "No"}</TableCell>
								<TableCell>{item.level}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</section>
		</div>
	);
}
