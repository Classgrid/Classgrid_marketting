import type { Metadata } from "next";
import { PortableText } from "@portabletext/react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { compareCopy, compareRows } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getComparisonBySlug } from "@/sanity/lib/marketing";

type ComparePageProps = {
	params: Promise<{ competitor: string }>;
};

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
	const { competitor } = await params;
	const cms = await getComparisonBySlug(competitor);
	const readable = cms?.competitorName ?? competitor.replace(/-/g, " ");

	return buildPageMetadata({
		title: cms?.headline ?? `Compare ${readable}`,
		description: `Classgrid capability comparison against ${readable}.`,
		path: `/compare/${competitor}`,
	});
}

export default async function Page({ params }: ComparePageProps) {
	const { competitor } = await params;
	const cms = await getComparisonBySlug(competitor);
	const readable = cms?.competitorName ?? competitor.replace(/-/g, " ");
	const headline = cms?.headline ?? `Classgrid vs ${readable}`;
	const tableRows = cms?.comparisonTable?.length ? cms.comparisonTable : compareRows;

	return (
		<div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
			<h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{headline}</h1>
			<p className="mt-3 text-slate-300">{compareCopy.dynamicSubtitle}</p>
			{cms?.intro ? (
				<div className="mt-4 text-sm text-slate-300">
					<PortableText value={cms.intro} />
				</div>
			) : null}

			<div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-4">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Capability</TableHead>
							<TableHead>Classgrid</TableHead>
							<TableHead>{readable}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tableRows.map((row: any) => (
							<TableRow key={row.capability ?? row.feature}>
								<TableCell className="font-medium text-white">{row.capability ?? row.feature}</TableCell>
								<TableCell className="text-slate-200">{row.classgrid}</TableCell>
								<TableCell className="text-slate-300">{row.legacyErp ?? row.competitor}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
