import { CmsFallback } from "@/components/ui/CmsErrorBoundary";
import { StructuredContentPage } from "@/components/templates/StructuredContentPage";
import { buildPageMetadata } from "@/lib/metadata";
import {
  industryProblemSolution,
  roleProblemSolution,
  solutionClientLogos,
  solutionImpactMetrics,
  solutionTestimonialsBySlug,
  solutionTrustBadges,
} from "@/lib/solution-content";
import { getSolutionPage } from "@/sanity/lib/marketing";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Slugs that are industry/institution type pages */
const INDUSTRY_SLUGS = new Set([
  "for-schools",
  "for-colleges",
  "for-jr-colleges",
  "for-coaching",
  "for-engineering",
]);

export async function generateStaticParams() {
  return [
    { slug: "for-schools" },
    { slug: "for-colleges" },
    { slug: "for-jr-colleges" },
    { slug: "for-coaching" },
    { slug: "for-engineering" },
    { slug: "for-students" },
    { slug: "for-teachers" },
    { slug: "for-admins" },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = (await getSolutionPage(slug)) as any;

  if (!page) {
    return buildPageMetadata({
      title: "Solution Not Found",
      description: "The requested solution page could not be found.",
      path: `/solutions/${slug}`,
      noIndex: true,
    });
  }

  const title =
    page?.seo?.metaTitle?.en ||
    page?.seo?.metaTitle ||
    page?.headline?.en ||
    page?.headline ||
    "Classgrid Solution";

  const description =
    page?.seo?.metaDescription?.en ||
    page?.seo?.metaDescription ||
    page?.subtitle?.en ||
    page?.subtitle ||
    "Explore how Classgrid supports this audience.";

  return buildPageMetadata({
    title,
    description,
    path: `/solutions/${slug}`,
  });
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;
  const page = (await getSolutionPage(slug)) as any;

  if (!page) {
    return (
      <CmsFallback
        type="solution page"
        backHref="/solutions"
        backLabel="Back to Solutions"
      />
    );
  }

  const heroImageUrl = page?.heroImage?.asset?.url ?? null;
  const isIndustry = INDUSTRY_SLUGS.has(slug);

  const capabilities = Array.isArray(page?.capabilities)
    ? page.capabilities
    : Array.isArray(page?.benefits)
    ? page.benefits.map((item: any) => ({
        feature: item?.title,
        description: item?.description,
      }))
    : [];

  return (
    <StructuredContentPage
      mode="solution"
      eyebrow={
        page?.label?.en || page?.label || "Solution"
      }
      title={page?.headline?.en || page?.headline || "Solution"}
      subtitle={page?.subtitle?.en || page?.subtitle}
      heroImageUrl={heroImageUrl}
      heroImageAlt={page?.headline?.en || page?.headline}
      body={page?.body}
      markdownBody={page?.markdownBody}
      markdownSections={Array.isArray(page?.markdownSections) ? page.markdownSections : []}
      structuredSections={Array.isArray(page?.structuredSections) ? page.structuredSections : []}
      updatedAt={page?.lastUpdatedAt || page?._updatedAt}
      capabilities={capabilities}
      roleExperiences={
        Array.isArray(page?.roleExperiences) ? page.roleExperiences : []
      }
      faqs={Array.isArray(page?.faqs) ? page.faqs : []}
      primaryCtaLabel="View Platform"
      primaryCtaHref="/view-platform"
      trustBadges={solutionTrustBadges}
      clientLogos={solutionClientLogos}
      impactMetrics={solutionImpactMetrics}
      testimonials={solutionTestimonialsBySlug[slug] ?? []}
      problemSolution={
        isIndustry
          ? (industryProblemSolution[slug] ?? [])
          : (roleProblemSolution[slug] ?? [])
      }
    />
  );
}
