import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ComparisonDetailClient } from "@/components/compare/ComparisonDetailClient";
import { comparisonFallbackBySlug, comparisonFallbacks } from "@/content/compare";
import { buildPageMetadata } from "@/lib/metadata";
import { getComparisonBySlug, getComparisonPages } from "@/sanity/lib/marketing";
import { urlFor } from "@/sanity/lib/image";
import { CmsFallback } from "@/components/ui/CmsErrorBoundary";

type ComparePageProps = {
	params: Promise<{ competitor: string }>;
};

function buildSanityImageUrl(image: unknown, width: number) {
  if (!image) return null;
  const base = urlFor(image).width(width).fit("max").quality(80).format("webp").url();
  return `${base}&auto=format,compress`;
}

export async function generateStaticParams() {
  const cmsComparisons =
    ((await getComparisonPages()) as Array<{ slug?: string }> | null)?.filter((entry) => entry.slug) ?? [];
  const slugs = Array.from(
    new Set([
      ...cmsComparisons.map((entry) => entry.slug as string),
      ...comparisonFallbacks.map((entry) => entry.slug),
    ])
  );

  return slugs.map((competitor) => ({ competitor }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
	const { competitor } = await params;
	const cms = (await getComparisonBySlug(competitor)) as
		| {
				competitorName?: string;
				seoTitle?: string;
				metaDescription?: string;
				ogImage?: unknown;
		  }
		| null;
	const fallback = comparisonFallbackBySlug[competitor];
	const readable = cms?.competitorName ?? fallback?.competitorName ?? competitor.replace(/-/g, " ");
	const ogImage = buildSanityImageUrl(cms?.ogImage, 1200) ?? fallback?.ogImage;

	return buildPageMetadata({
		title: cms?.seoTitle ?? fallback?.seoTitle ?? `Classgrid vs ${readable}`,
		description:
			cms?.metaDescription ??
			fallback?.metaDescription ??
			`Classgrid capability comparison against ${readable}.`,
		path: `/compare/${competitor}`,
		canonical: `/compare/${competitor}`,
		ogImage: ogImage ?? undefined,
	});
}

export default async function Page({ params }: ComparePageProps) {
	const { competitor } = await params;
	const cms = (await getComparisonBySlug(competitor)) as
		| {
				_updatedAt?: string;
				competitorName?: string;
				slug?: string;
				competitorLogo?: unknown;
				websiteLink?: string;
				body?: unknown[];
				ratingBadges?: Array<{
					platform?: string;
					score?: number;
					badgeLabel?: string;
				}>;
				usps?: Array<{
					icon?: string;
					title?: string;
					description?: string;
				}>;
				featureMatrix?: Array<{
					category?: string;
					featureName?: string;
					ourStatus?: string;
					ourIcon?: "check" | "warning" | "cross";
					competitorStatus?: string;
					competitorIcon?: "check" | "warning" | "cross";
				}>;
				migrationTestimonial?: {
					quoteText?: string;
					authorName?: string;
					authorRole?: string;
				};
				faqs?: Array<{
					question?: string;
					answer?: string;
				}>;
		  }
		| null;
	const fallback = comparisonFallbackBySlug[competitor];

	if (!cms && !fallback) {
		return <CmsFallback type="comparison" backHref="/compare" backLabel="Back to Compare" />;
	}

	const comparison: Parameters<typeof ComparisonDetailClient>[0]["comparison"] = cms
		? {
				competitorName: cms.competitorName ?? fallback?.competitorName ?? competitor.replace(/-/g, " "),
				slug: cms.slug ?? competitor,
				competitorLogoUrl: buildSanityImageUrl(cms.competitorLogo, 240),
				websiteLink: cms.websiteLink ?? null,
				lastUpdated: cms._updatedAt ?? null,
				body: cms.body ?? null,
				ratingBadges: cms.ratingBadges ?? fallback?.ratingBadges ?? [],
				usps: cms.usps ?? fallback?.usps ?? [],
				featureMatrix: cms.featureMatrix ?? fallback?.featureMatrix ?? [],
				migrationTestimonial: cms.migrationTestimonial ?? fallback?.migrationTestimonial,
				faqs: cms.faqs ?? fallback?.faqs ?? [],
		  }
		: {
				competitorName: fallback.competitorName,
				slug: fallback.slug,
				competitorLogoUrl: null,
				websiteLink: null,
				lastUpdated: null,
				body: null,
				ratingBadges: fallback.ratingBadges,
				usps: fallback.usps,
				featureMatrix: fallback.featureMatrix,
				migrationTestimonial: fallback.migrationTestimonial,
				faqs: fallback.faqs,
		  };

	return <ComparisonDetailClient comparison={comparison} />;
}
