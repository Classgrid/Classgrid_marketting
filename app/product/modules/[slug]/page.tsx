import { getModuleBySlug } from "@/sanity/lib/marketing";
import { buildPageMetadata } from "@/lib/metadata";
import { StructuredContentPage } from "@/components/templates/StructuredContentPage";
import { allPlatformModules } from "@/content/homepage";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Humanise a slug into a display title as last resort
function slugToTitle(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const mod = (await getModuleBySlug(slug)) as any;
  const allModules = allPlatformModules.map((m) => ({
    title: m.title,
    slug: m.link.split("/").pop() || "",
    category: m.category,
    subtitle: m.description,
  }));
  const basic = allModules.find((m) => m.slug === slug);
  const title = mod?.headline || mod?.title || basic?.title || slugToTitle(slug);

  return buildPageMetadata({
    title: mod?.seo?.metaTitle || title,
    description:
      mod?.seo?.metaDescription ||
      mod?.subtitle ||
      basic?.subtitle ||
      `Explore the ${title} module on Classgrid.`,
    path: `/product/modules/${slug}`,
  });
}

export default async function ProductModuleDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch full detail from Sanity
  const mod = (await getModuleBySlug(slug)) as any;

  // Use the canonical public list from homepage.ts for the sidebar
  const allModules = allPlatformModules.map((m) => ({
    title: m.title,
    slug: m.link.split("/").pop() || "",
    category: m.category,
  }));

  // If full detail exists in Sanity — render it
  if (mod) {
    const heroImageUrl = mod?.heroImage?.asset?.url ?? null;
    return (
      <StructuredContentPage
        mode="module"
        eyebrow={mod?.label || mod?.category || "Product Module"}
        title={mod?.headline || mod?.title || slugToTitle(slug)}
        subtitle={mod?.subtitle}
        heroImageUrl={heroImageUrl}
        heroImageAlt={mod?.headline}
        body={mod?.body}
        structuredSections={Array.isArray(mod?.structuredSections) ? mod.structuredSections : []}
        updatedAt={mod?.lastUpdatedAt || mod?._updatedAt}
        capabilities={Array.isArray(mod?.capabilities) ? mod.capabilities : []}
        roleExperiences={Array.isArray(mod?.roleExperiences) ? mod.roleExperiences : []}
        faqs={Array.isArray(mod?.faqs) ? mod.faqs : []}
        relatedHelpArticles={Array.isArray(mod?.relatedHelpArticles) ? mod.relatedHelpArticles : []}
        relatedChangelogs={Array.isArray(mod?.relatedChangelogs) ? mod.relatedChangelogs : []}
        primaryCtaLabel="View Platform"
        primaryCtaHref="/view-platform"
        allModules={allModules}
        currentSlug={slug}
      />
    );
  }

  // No Sanity detail yet — find basic info from the modules list
  const basic = allModules.find((m) => m.slug === slug);
  const displayTitle = basic?.title || slugToTitle(slug);
  const displayCategory = basic?.category || "Product Module";

  // Render layout with empty-state body
  return (
    <StructuredContentPage
      mode="module"
      eyebrow={displayCategory}
      title={displayTitle}
      subtitle="Detailed documentation for this module is being prepared. Check back soon."
      body={null}
      capabilities={[]}
      roleExperiences={[]}
      faqs={[]}
      primaryCtaLabel="Book a Demo"
      primaryCtaHref="/#demo"
      allModules={allModules}
      currentSlug={slug}
      isEmptyState
    />
  );
}
