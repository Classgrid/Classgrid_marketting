import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { DemoRequestForm } from "@/components/sections/DemoRequestForm";
import { HomeDevScrollReset } from "@/components/layout/HomeDevScrollReset";
import { HeroSection } from "@/components/sections/HeroSection";
import { Reveal } from "@/components/sections/Reveal";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { TrustedInstitutionsShowcase } from "@/components/sections/TrustedInstitutionsShowcase";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { FAQSection } from "@/components/ui/faqsection";
import { placeholderHomePage, resolveHomePageContent } from "@/content/homePlaceholders";
import { normalizeAppHref } from "@/lib/route-maps";
import {
  getAboutPage,
  getDemoPage,
  getFaqItems,
  getHomeChrome,
  getHomePage,
  getCircularTimeline,
  getClassgridIntegrations,
  getClassgridTalks,
  getPricingPage,
  getTestimonials,
  getTestimonialVideos,
  getTourPage,
  getClientLogos,
  getHomeStats,
  getSectionSettings,
  getTurboClassgrid,
  getIsometricStack,
  getAppEcosystem,
} from "@/sanity/lib/marketing";

import { WhyClassgridSection } from "@/components/sections/WhyClassgridSection";
import { TeamVisionSection } from "@/components/sections/TeamVisionSection";
import { TurboComparisonNew } from "@/components/sections/TurboComparisonNew";
import { IsometricStackSection } from "@/components/sections/IsometricStackSection";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

const TestimonialCarousel = dynamic(() => import("@/components/ui/testimonial-carousel"));
const TestimonialCarouselV2 = dynamic(() => import("@/components/ui/testimonial-carousel-v2"));
const IntegrationsMarquee = dynamic(() => import("@/components/integrations-marquee"));
const ModulesGrid = dynamic(() =>
  import("@/components/sections/ModulesGrid").then((module) => module.ModulesGrid)
);
const PlatformAnimatedBeam = dynamic(() =>
  import("@/components/sections/PlatformAnimatedBeam").then((module) => module.PlatformAnimatedBeam)
);
const ClassgridRoleShowcase = dynamic(() =>
  import("@/components/sections/ClassgridRoleShowcase").then((module) => module.ClassgridRoleShowcase)
);
const HeroVideoSlider = dynamic(() =>
  import("@/components/sections/HeroVideoSlider").then((module) => module.HeroVideoSlider)
);
const EmpowerSliderSection = dynamic(() =>
  import("@/components/sections/EmpowerSliderSection").then((module) => module.EmpowerSliderSection)
);

export const revalidate = 60;

type ShowcaseSlide = {
  id: string;
  headline: string;
  body: string;
  src: string;
  label: string;
  alt?: string;
};

type TrustLogo = {
  name: string;
  subtitle?: string;
  href?: string;
  imageUrl?: string;
  imageAlt?: string;
  wordmarkUrl?: string;
  wordmarkAlt?: string;
};

type TimelineTab = {
  id: string;
  label: string;
  heading?: string;
  description?: string;
  features?: string[];
  rings: string[][];
};

type TimelineRoleData = {
  title: string;
  badge: string;
  desc: string;
  tooltip: string;
  features: string[];
  stats: string[];
  metric: string;
  theme?: string;
};

type TimelineRoleDataMap = Record<string, TimelineRoleData>;

type ModuleCard = {
  title: string;
  description: string;
  color?: string;
  iconColor?: string;
  link?: string;
  orgs?: string[];
};

type OrganizationCard = {
  title: string;
  description: string;
  href?: string;
  color?: string;
  iconColor?: string;
  icon?: string;
};

type ModuleAudienceTab = {
  id: string;
  label: string;
};

type PlatformAudienceCard = {
  badge: string;
  title: string;
  subtitle: string;
};

type FaqEntry = {
  question: string;
  answer: string;
};

type IntegrationLogoItem = {
  name: string;
  url?: string;
  color?: string;
  imageClassName?: string;
};

function parseStatValue(value: unknown) {
  const numericValue = Number.parseFloat(String(value ?? 0));
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function toFaqAnswerText(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (!Array.isArray(value)) {
    return "";
  }

  return value
    .map((block: any) => {
      if (typeof block === "string") {
        return block;
      }

      if (!block || typeof block !== "object" || !Array.isArray(block.children)) {
        return "";
      }

      return block.children
        .map((child: any) => (typeof child?.text === "string" ? child.text : ""))
        .join("");
    })
    .filter(Boolean)
    .join(" ")
    .trim();
}

function hasNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function withFallbackString(value: unknown, fallback: string) {
  return hasNonEmptyString(value) ? value : fallback;
}

function withFallbackItems<T>(items: T[], fallback: T[]) {
  return items.length > 0 ? items : fallback;
}

function normalizeTimelineTabs(value: unknown, lang: string): TimelineTab[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((tab: any) => {
      const id = hasNonEmptyString(tab?.id) ? tab.id.trim() : "";
      const label = getLocalized(tab?.label, lang, "");
      const heading = getLocalized(tab?.heading, lang, "");
      const description = getLocalized(tab?.description, lang, "");
      const features = Array.isArray(tab?.features)
        ? tab.features
            .map((feature: any) => getLocalized(feature, lang, ""))
            .filter(hasNonEmptyString)
            .map((feature: string) => feature.trim())
        : [];

      const rings = Array.isArray(tab?.rings)
        ? tab.rings
          .map((ring: any) => {
            if (Array.isArray(ring)) {
              return ring.map((n: any) => getLocalized(n, lang, "")).filter(hasNonEmptyString).map((node: string) => node.trim());
            }

            if (ring && Array.isArray(ring.nodes)) {
              return ring.nodes
                .map((n: any) => getLocalized(n, lang, ""))
                .filter(hasNonEmptyString)
                .map((node: string) => node.trim());
            }

            return [];
          })
          .filter((ring: string[]) => ring.length > 0)
        : [];

      if (!id || !label || rings.length === 0) {
        return null;
      }

      return { id, label, heading, description, features, rings };
    })
    .filter((tab): tab is TimelineTab => Boolean(tab));
}

function normalizeTimelineRoleDataMap(value: unknown, lang: string): TimelineRoleDataMap {
  if (!Array.isArray(value)) {
    return {};
  }

  return value.reduce<TimelineRoleDataMap>((acc, role: any) => {
    const rawKey = getLocalized(role?.roleKey ?? role?.label ?? role?.name, lang, "");
    if (!hasNonEmptyString(rawKey)) {
      return acc;
    }

    const roleKey = rawKey.trim();
    const features = Array.isArray(role?.features)
      ? role.features
          .map((feature: any) => getLocalized(feature, lang, ""))
          .filter(hasNonEmptyString)
          .map((feature: string) => feature.trim())
      : [];
    const stats = Array.isArray(role?.stats)
      ? role.stats
          .map((stat: any) => getLocalized(stat, lang, ""))
          .filter(hasNonEmptyString)
          .map((stat: string) => stat.trim())
      : [];

    acc[roleKey] = {
      title: withFallbackString(getLocalized(role?.title, lang, ""), roleKey + " Workspace"),
      badge: withFallbackString(getLocalized(role?.badge, lang, ""), "System Connected"),
      desc: withFallbackString(getLocalized(role?.desc ?? role?.description, lang, ""), "Role-based Classgrid workspace."),
      tooltip: withFallbackString(getLocalized(role?.tooltip, lang, ""), roleKey),
      features,
      stats,
      metric: withFallbackString(getLocalized(role?.metric, lang, ""), "Result: connected operations"),
      theme: hasNonEmptyString(role?.theme) ? role.theme.trim() : "emerald",
    };

    return acc;
  }, {});
}

type LocalizedPageProps = {
  lang: string;
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = "en";
  const cms = (await getHomePage()) as any;
  const home = resolveHomePageContent(cms ?? {}) as any;
  const siteUrl = typeof home?.siteUrl === "string" ? home.siteUrl.replace(/\/$/, "") : undefined;
  const siteName = typeof home?.brandName === "string" ? home.brandName : undefined;
  const metaTitle = typeof home?.seo?.metaTitle === "string" ? home.seo.metaTitle : undefined;
  const metaDescription =
    typeof home?.seo?.metaDescription === "string" ? home.seo.metaDescription : undefined;
  const slug =
    typeof home?.seo?.slug === "string" && home.seo.slug.trim() && home.seo.slug !== "home"
      ? `/${home.seo.slug.replace(/^\/+/, "")}`
      : "/";
  const pageUrl = siteUrl ? `${siteUrl}${slug}` : undefined;
  const resolvedTitle = metaTitle || siteName;

  return {
    title: resolvedTitle,
    description: metaDescription,
    openGraph: resolvedTitle || metaDescription || pageUrl
      ? {
        title: resolvedTitle,
        description: metaDescription,
        url: pageUrl,
        siteName,
        type: "website",
      }
      : undefined,
    twitter: resolvedTitle || metaDescription
      ? {
        card: "summary_large_image",
        title: resolvedTitle,
        description: metaDescription,
      }
      : undefined,
  };
}

function getLocalized(field: any, lang: string, fallback: any) {
  // If the field from CMS is a locale object
  if (typeof field === "object" && field !== null && (field.en || field[lang])) {
    return field[lang] || field.en;
  }
  // If the fallback from placeholders is a locale object
  if (typeof fallback === "object" && fallback !== null && (fallback.en || fallback[lang])) {
    return fallback[lang] || fallback.en;
  }
  // If field is just a string (old format)
  if (typeof field === "string" && field.trim().length > 0) {
    return field;
  }
  return fallback;
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const sp = await searchParams;
  const langQuery = typeof sp.lang === "string" ? sp.lang : "en";
  const lang = (langQuery === "hi" || langQuery === "mr") ? langQuery : "en";
  return <LocalizedHomePage lang={lang} />;
}

async function LocalizedHomePage({ lang }: LocalizedPageProps) {
  const [
    cms,
    cmsCircularTimeline,
    cmsTestimonials,
    cmsFaqItems,
    cmsTestimonialVideos,
    cmsClientLogos,
    cmsIntegrationsPage,
    cmsHomeStats,
    sectionSettings,
    cmsTurboClassgrid,
    cmsIsometricStack,
    cmsAppEcosystem,
  ] = await Promise.all([
    getHomePage(),
    getCircularTimeline(),
    getClassgridTalks(),
    getFaqItems(),
    getTestimonialVideos(),
    getClientLogos(),
    getClassgridIntegrations(),
    getHomeStats(),
    getSectionSettings(),
    getTurboClassgrid(),
    getIsometricStack(),
    getAppEcosystem(),
  ]);

  const cmsHome = (cms as any) ?? {};
  const circularTimeline = (cmsCircularTimeline as any) ?? {};
  const home = resolveHomePageContent(cmsHome) as any;
  const classgridIntegrations = cmsIntegrationsPage as any[];

  const headline = getLocalized(cmsHome.headline, lang, placeholderHomePage.headline);
  const subtext = getLocalized(cmsHome.subheadline, lang, placeholderHomePage.subheadline);
  const badge = withFallbackString(home?.whatsNew, placeholderHomePage.whatsNew);
  const heroPrimaryLabel = withFallbackString(
    home?.heroPrimaryCtaLabel,
    placeholderHomePage.heroPrimaryCtaLabel
  );
  const heroPrimaryHref = withFallbackString(
    home?.heroPrimaryCtaHref,
    placeholderHomePage.heroPrimaryCtaHref
  );
  const heroSecondaryLabel = withFallbackString(
    home?.heroSecondaryCtaLabel,
    placeholderHomePage.heroSecondaryCtaLabel
  );
  const heroSecondaryHrefRaw = withFallbackString(
    home?.heroSecondaryCtaHref,
    placeholderHomePage.heroSecondaryCtaHref
  );
  // Force link to the tour if it's the secondary hero button or label matches
  const heroSecondaryHref = (heroSecondaryLabel.toLowerCase().includes("platform") || heroSecondaryLabel.toLowerCase().includes("tour"))
    ? "/view-platform"
    : heroSecondaryHrefRaw;

  const empowerSection = {
    heading: withFallbackString(
      home?.empowerSection?.heading,
      placeholderHomePage.empowerSection.heading
    ),
    description: withFallbackString(
      home?.empowerSection?.description,
      placeholderHomePage.empowerSection.description
    ),
    imageUrl: withFallbackString(
      home?.empowerSection?.imageUrl,
      placeholderHomePage.empowerSection.imageUrl
    ),
    imageAlt: withFallbackString(
      home?.empowerSection?.imageAlt,
      placeholderHomePage.empowerSection.imageAlt
    ),
  };

  const showcaseKicker = getLocalized(
    cmsHome.showcaseKicker,
    lang,
    placeholderHomePage.showcaseKicker
  );
  const showcaseTitle = getLocalized(
    cmsHome.showcaseTitle,
    lang,
    placeholderHomePage.showcaseTitle
  );
  const showcaseSubtitle = getLocalized(
    cmsHome.showcaseSubtitle,
    lang,
    placeholderHomePage.showcaseSubtitle
  );
  const showcaseCtaLabelTemplate = withFallbackString(
    home?.showcaseCtaLabelTemplate,
    placeholderHomePage.showcaseCtaLabelTemplate
  );
  const showcaseSlides: ShowcaseSlide[] = withFallbackItems(
    Array.isArray(home?.showcaseSlides)
      ? home.showcaseSlides
        .filter((slide: any) => slide?.label)
        .map((slide: any, index: number) => ({
          id: slide?._key ?? `showcase-${index + 1}`,
          headline: slide?.headline ?? slide?.subtitle ?? slide?.label ?? "",
          body:
            slide?.body ??
            (Array.isArray(slide?.highlights) ? slide.highlights.filter(Boolean).join(" • ") : "") ??
            slide?.subtitle ??
            "",
          src: slide.imageUrl,
          label: slide.label,
          alt: slide.imageAlt ?? slide.label,
        }))
      : [],
    placeholderHomePage.showcaseSlides.map((slide: any, index: number) => ({
      id: slide?._key ?? `placeholder-showcase-${index + 1}`,
      headline: slide?.headline ?? slide?.subtitle ?? slide?.label ?? "",
      body: slide?.body ?? slide?.subtitle ?? "",
      src: slide.imageUrl,
      label: slide.label,
      alt: slide.imageAlt ?? slide.label,
    }))
  );

  const moduleGridSlides: ShowcaseSlide[] = withFallbackItems(
    Array.isArray(home?.moduleGridSlides)
      ? home.moduleGridSlides
        .filter((slide: any) => slide?.label)
        .map((slide: any, index: number) => ({
          id: slide?._key ?? `module-grid-${index + 1}`,
          headline: slide?.headline ?? slide?.subtitle ?? slide?.label ?? "",
          body:
            slide?.body ??
            (Array.isArray(slide?.highlights) ? slide.highlights.filter(Boolean).join(" • ") : "") ??
            slide?.subtitle ??
            "",
          src: slide.imageUrl,
          label: slide.label,
          alt: slide.imageAlt ?? slide.label,
        }))
      : [],
    placeholderHomePage.showcaseSlides.map((slide: any, index: number) => ({
      id: slide?._key ?? `placeholder-module-grid-${index + 1}`,
      headline: slide?.headline ?? slide?.subtitle ?? slide?.label ?? "",
      body: slide?.body ?? slide?.subtitle ?? "",
      src: slide.imageUrl || "/dashboards/admin-overview.png", // Fallback image for module grid
      label: slide.label,
      alt: slide.imageAlt ?? slide.label,
    }))
  );

  const platformTitle = getLocalized(
    cmsHome.platformTitle,
    lang,
    placeholderHomePage.platformTitle
  );
  const platformKicker = getLocalized(
    cmsHome.platformKicker,
    lang,
    placeholderHomePage.platformKicker
  );
  const platformBody = getLocalized(
    cmsHome.platformBody,
    lang,
    placeholderHomePage.platformBody
  );
  const platformConnectionHint = withFallbackString(
    home?.platformConnectionHint,
    placeholderHomePage.platformConnectionHint
  );
  const platformSystemLabel = getLocalized(
    home?.platformSystemLabel,
    lang,
    placeholderHomePage.platformSystemLabel
  );

  const rawInputLabels = Array.isArray(home?.platformInputLabels) && home.platformInputLabels.length > 0
    ? home.platformInputLabels
    : placeholderHomePage.platformInputLabels;
  const platformInputLabels = rawInputLabels
    .map((label: any, idx: number) => getLocalized(label, lang, placeholderHomePage.platformInputLabels[idx] || ""))
    .filter(Boolean);

  const rawAudienceCards = Array.isArray(home?.platformAudienceCards) && home.platformAudienceCards.length > 0
    ? home.platformAudienceCards
    : placeholderHomePage.platformAudienceCards;
  const platformAudienceCards: PlatformAudienceCard[] = rawAudienceCards
    .map((card: any, idx: number) => {
      const fallback = placeholderHomePage.platformAudienceCards[idx] || {};
      return {
        badge: getLocalized(card?.badge, lang, fallback.badge ?? ""),
        title: getLocalized(card?.title, lang, fallback.title ?? ""),
        subtitle: getLocalized(card?.subtitle, lang, fallback.subtitle ?? ""),
      };
    })
    .filter((c: any) => c.badge || c.title || c.subtitle);

  const productVideoUrl = withFallbackString(
    home?.productVideo?.videoUrl,
    placeholderHomePage.productVideo.videoUrl
  );
  const productVideoPosterUrl = withFallbackString(
    home?.productVideo?.posterUrl,
    placeholderHomePage.productVideo.posterUrl
  );
  const productVideoPosterAlt = withFallbackString(
    home?.productVideo?.posterAlt,
    placeholderHomePage.productVideo.posterAlt
  );

  const trustedBy = withFallbackString(home?.trustedBy, placeholderHomePage.trustedBy);
  const trustSectionDescription = withFallbackString(
    home?.trustSectionDescription,
    placeholderHomePage.trustSectionDescription
  );

  function processStat(rawValue: any, defaultVal: number, defaultSuffix: string) {
    if (!rawValue) return { value: defaultVal, suffix: defaultSuffix };
    const strVal = String(rawValue);
    const parsed = Number.parseFloat(strVal.replace(/,/g, ''));
    if (Number.isNaN(parsed)) {
      return { textValue: strVal };
    }
    const suffix = strVal.replace(/[\d.,]/g, '');
    return { value: parsed, suffix };
  }

  const stats = [
    { label: "Students Managed", ...processStat(cmsHomeStats?.students, 100000, "+") },
    { label: "Institutions", ...processStat(cmsHomeStats?.institutions, 50, "+") },
    { label: "Modules", ...processStat(cmsHomeStats?.modules, 25, "+") },
    { label: "Uptime", ...processStat(cmsHomeStats?.uptime, 99.9, "%") }
  ];


  const trustedLogos: TrustLogo[] = withFallbackItems(
    (Array.isArray(cmsClientLogos) ? cmsClientLogos : []).map((logo: any) => ({
      name: logo?.name ?? "",
      subtitle: logo?.subtitle ?? "",
      href: logo?.href,
      imageUrl: logo?.imageUrl,
      imageAlt: logo?.imageAlt ?? logo?.name,
      wordmarkUrl: logo?.wordmarkUrl,
      wordmarkAlt: logo?.wordmarkAlt ?? logo?.name,
      color: logo?.color,
    })),
    placeholderHomePage.trustedLogos.map((logo: any) => ({
      name: logo?.name ?? "",
      subtitle: logo?.subtitle ?? "",
      href: logo?.href,
      imageUrl: logo?.imageUrl,
      imageAlt: logo?.imageAlt ?? logo?.name,
      wordmarkUrl: logo?.wordmarkUrl,
      wordmarkAlt: logo?.wordmarkAlt ?? logo?.name,
      color: logo?.color,
    }))
  );

  const organizationSectionTitle = withFallbackString(
    home?.organizationSectionTitle,
    placeholderHomePage.organizationSectionTitle
  );
  const organizationCardCtaLabel = withFallbackString(
    home?.organizationCardCtaLabel,
    placeholderHomePage.organizationCardCtaLabel
  );

  const organizationCards: OrganizationCard[] = withFallbackItems(
    Array.isArray(home?.organizationCards)
      ? home.organizationCards
        .filter((card: any) => card?.title || card?.description || card?.href)
        .map((card: any) => ({
          title: card?.title ?? "",
          description: card?.description ?? "",
          href: normalizeAppHref(card?.href ?? ""),
          color: card?.color,
          iconColor: card?.iconColor,
          icon: card?.icon,
        }))
      : [],
    placeholderHomePage.organizationCards.map((card: any) => ({
      title: card?.title ?? "",
      description: card?.description ?? "",
      href: normalizeAppHref(card?.href ?? ""),
      color: card?.color,
      iconColor: card?.iconColor,
      icon: card?.icon,
    }))
  );

  const modulesTitle = getLocalized(
    cmsHome.modulesSectionHeading || cmsHome.modulesTitle,
    lang,
    placeholderHomePage.modulesSectionHeading
  );
  const modulesSubtitle = getLocalized(
    cmsHome.modulesSectionSubtext || cmsHome.modulesSubtitle,
    lang,
    placeholderHomePage.modulesSectionSubtext
  );
  const modulesAllTabLabel = withFallbackString(
    home?.modulesAllTabLabel,
    placeholderHomePage.modulesAllTabLabel
  );
  const modulesAudienceTabs: ModuleAudienceTab[] = withFallbackItems(
    Array.isArray(home?.modulesAudienceTabs)
      ? home.modulesAudienceTabs
        .filter((tab: any) => tab?.id && tab?.label)
        .map((tab: any) => ({
          id: tab.id,
          label: tab.label,
        }))
      : [],
    placeholderHomePage.modulesAudienceTabs.map((tab: any) => ({
      id: tab.id,
      label: tab.label,
    }))
  );
  const modulesCardCtaLabel = withFallbackString(
    home?.modulesCardCtaLabel,
    placeholderHomePage.modulesCardCtaLabel
  );
  const modulesShowMoreLabel = withFallbackString(
    home?.modulesShowMoreLabel,
    placeholderHomePage.modulesShowMoreLabel
  );
  const modulesViewAllLabel = withFallbackString(
    home?.modulesViewAllLabel,
    placeholderHomePage.modulesViewAllLabel
  );
  const modules: ModuleCard[] = withFallbackItems(
    Array.isArray(home?.modules)
      ? home.modules
        .filter((module: any) => module?.title || module?.description || module?.href || module?.link)
        .map((module: any) => ({
          title: module?.title ?? "",
          description: module?.description ?? "",
          color: module?.color,
          iconColor: module?.iconColor,
          link: normalizeAppHref(module?.href ?? module?.link ?? ""),
          orgs: Array.isArray(module?.orgs) ? module.orgs.filter(Boolean) : [],
        }))
      : [],
    placeholderHomePage.modules.map((module: any) => ({
      title: module?.title ?? "",
      description: module?.description ?? "",
      color: module?.color,
      iconColor: module?.iconColor,
      link: normalizeAppHref(module?.href ?? module?.link ?? ""),
      orgs: Array.isArray(module?.orgs) ? module.orgs.filter(Boolean) : [],
    }))
  );
  const modulesCalloutTitle = withFallbackString(
    home?.modulesCalloutTitle,
    placeholderHomePage.modulesCalloutTitle
  );
  const modulesCalloutBody = withFallbackString(
    home?.modulesCalloutBody,
    placeholderHomePage.modulesCalloutBody
  );
  const modulesCalloutCtaLabel = withFallbackString(
    home?.modulesCalloutCtaLabel,
    placeholderHomePage.modulesCalloutCtaLabel
  );
  const modulesCalloutCtaHrefRaw = withFallbackString(
    home?.modulesCalloutCtaHref,
    placeholderHomePage.modulesCalloutCtaHref
  );
  // Force link to tour for modules callout as well
  const modulesCalloutCtaHref = modulesCalloutCtaLabel.toLowerCase().includes("platform")
    ? "/view-platform"
    : modulesCalloutCtaHrefRaw;

  const timelineSectionTitle = getLocalized(
    cmsHome.stakeholderSectionHeading || cmsHome.timelineTitle,
    lang,
    placeholderHomePage.stakeholderSectionHeading
  );
  const timelineSectionSubtitle = getLocalized(
    cmsHome.stakeholderSectionSubtext || cmsHome.timelineSubtitle,
    lang,
    placeholderHomePage.stakeholderSectionSubtext
  );
  const circularTimelineTabs = normalizeTimelineTabs(circularTimeline?.tabs, lang);
  const homeTimelineTabs = normalizeTimelineTabs(home?.timelineTabs, lang);
  const fallbackTimelineTabs = normalizeTimelineTabs(placeholderHomePage.timelineTabs, lang);
  const timelineTabs: TimelineTab[] = withFallbackItems(
    circularTimelineTabs,
    withFallbackItems(homeTimelineTabs, fallbackTimelineTabs)
  );
  const timelineRoleDataMap = normalizeTimelineRoleDataMap(circularTimeline?.roles, lang);
  const defaultTimelineTab = timelineTabs[0]?.id ?? "";

  const testimonialsLabel = withFallbackString(
    home?.testimonialsLabel,
    placeholderHomePage.testimonialsLabel
  );
  const testimonialsTitle = withFallbackString(
    home?.testimonialsHeading ?? home?.testimonialsTitle,
    placeholderHomePage.testimonialsHeading
  );
  const videoSectionTitle = withFallbackString(
    home?.videoSectionHeading ?? home?.videoSectionTitle,
    placeholderHomePage.videoSectionHeading
  );
  const videoSectionDescription = withFallbackString(
    home?.videoSectionSubtext ?? home?.videoSectionDescription,
    placeholderHomePage.videoSectionSubtext
  );
  const testimonialsSectionDescription = withFallbackString(
    home?.testimonialsSubtext ?? home?.testimonialsSectionDescription,
    placeholderHomePage.testimonialsSubtext
  );
  const testimonials =
    Array.isArray(cmsTestimonials) && cmsTestimonials.length > 0
      ? cmsTestimonials.map((item: any) => ({
        name: item.name,
        role: item.role,
        company: item.college,
        quote: item.quote,
        avatarUrl: item.avatarUrl,
        avatarAlt: item.avatarAlt,
        institutionLogoUrl: item.institutionLogoUrl,
        rating: item.rating,
      }))
      : placeholderHomePage.testimonials;
  const testimonialVideos =
    Array.isArray(cmsTestimonialVideos) && cmsTestimonialVideos.length > 0
      ? cmsTestimonialVideos
        .filter((video: any) => video?.videoUrl)
        .map((video: any) => ({
          url: video.videoUrl,
          name: video?.name,
          role: video?.role,
          subtitle: video?.subtitle,
          avatarUrl: video?.avatarUrl,
          avatarAlt: video?.avatarAlt,
        }))
      : placeholderHomePage.testimonialVideos;
  const integrationsPage = (cmsIntegrationsPage as any) ?? {};
  const homeIntegrationLogos: IntegrationLogoItem[] = Array.isArray(home?.integrationLogos)
    ? home.integrationLogos
      .filter((logo: any) => logo?.name || logo?.imageUrl || logo?.logoUrl)
      .map((logo: any) => ({
        name: logo?.name ?? "",
        url: logo?.imageUrl ?? logo?.logoUrl,
        color: logo?.accentColor,
        imageClassName: logo?.imageClassName,
      }))
    : [];
  const pageIntegrationLogos: IntegrationLogoItem[] = Array.isArray(classgridIntegrations)
    ? classgridIntegrations
      .filter((item: any) => item?.name || item?.imageUrl)
      .map((item: any) => ({
        name: item?.name ?? "",
        url: item?.imageUrl,
        imageClassName: item?.imageClassName,
      }))
    : [];
  const integrationsKicker = withFallbackString(
    home?.integrationsKicker,
    placeholderHomePage.integrationsKicker
  );
  const integrationsTitle = withFallbackString(
    home?.integrationsHeadline ?? home?.integrationsTitle,
    placeholderHomePage.integrationsHeadline
  );
  const integrationsSubtitle = withFallbackString(
    home?.integrationsSubtext ?? home?.integrationsSubtitle,
    placeholderHomePage.integrationsSubtext
  );
  const integrationLogos = withFallbackItems(
    pageIntegrationLogos.length > 0 ? pageIntegrationLogos : homeIntegrationLogos,
    placeholderHomePage.integrationLogos.map((logo: any) => ({
      name: logo?.name ?? "",
      url: logo?.imageUrl ?? logo?.logoUrl,
      color: logo?.accentColor,
      imageClassName: logo?.imageClassName,
    }))
  );

  const faqTitle = withFallbackString(home?.faqTitle, placeholderHomePage.faqTitle);
  const faqSectionTitle = withFallbackString(
    home?.faqHeading ?? home?.faqSectionTitle,
    placeholderHomePage.faqHeading
  );
  const faqSectionDescription = withFallbackString(
    home?.faqSubtext ?? home?.faqSectionDescription,
    placeholderHomePage.faqSubtext
  );
  const faqButtonLabel = withFallbackString(
    home?.faqButtonText ?? home?.faqButtonLabel,
    placeholderHomePage.faqButtonText
  );
  const faqButtonHref = withFallbackString(
    home?.faqButtonHref,
    placeholderHomePage.faqButtonHref
  );

  const mappedFaqEntries = Array.isArray(cmsFaqItems)
    ? cmsFaqItems
      .filter((item: any) => item?.question && item?.answer && (item?.displayPages || []).includes('home'))
      .map((item: any) => ({
        question: item.question,
        answer: toFaqAnswerText(item.answer),
        homeColumn: item.homeColumn,
        order: item.order ?? 99,
      }))
    : [];

  let faqsLeft: FaqEntry[] = [];
  let faqsRight: FaqEntry[] = [];

  if (mappedFaqEntries.length > 0) {
    faqsLeft = mappedFaqEntries
      .filter((item) => item.homeColumn === 'left')
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ question: item.question, answer: item.answer }))
      .slice(0, 6);

    faqsRight = mappedFaqEntries
      .filter((item) => item.homeColumn === 'right')
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ question: item.question, answer: item.answer }))
      .slice(0, 6);

    if (faqsLeft.length === 0 && faqsRight.length === 0) {
      const fallbackFaqs = mappedFaqEntries.map((item) => ({ question: item.question, answer: item.answer }));
      const splitIndex = Math.ceil(fallbackFaqs.length / 2);
      faqsLeft = fallbackFaqs.slice(0, splitIndex).slice(0, 6);
      faqsRight = fallbackFaqs.slice(splitIndex).slice(0, 6);
    }
  } else {
    const placeholderFaqs = placeholderHomePage.faqEntries;
    const splitIndex = Math.ceil(placeholderFaqs.length / 2);
    faqsLeft = placeholderFaqs.slice(0, splitIndex).slice(0, 6);
    faqsRight = placeholderFaqs.slice(splitIndex).slice(0, 6);
  }

  const demoSectionLabel = withFallbackString(
    home?.demoSectionLabel,
    'Get a Demo'
  );
  const demoSectionHeading = withFallbackString(
    home?.demoSectionHeading,
    'See how Classgrid transforms your institution'
  );
  const demoSectionSubtext = withFallbackString(
    home?.demoSectionSubtext,
    'Discover how Classgrid simplifies operations, automates workflows, and connects every part of your institution in one unified system.\nFrom admissions to academics, finance to compliance — everything works seamlessly together.\nOur platform is built for scale, speed, and complete visibility across your campus.\nGet started in minutes and see how institutions are eliminating complexity with Classgrid.'
  );
  const demoSectionCtaLine = withFallbackString(
    home?.demoSectionCtaLine,
    "Start your 30-day free trial — no setup complexity."
  );

  const ctaFormTitle = withFallbackString(
    home?.ctaFormTitle,
    placeholderHomePage.ctaFormTitle
  );
  const ctaFormSubtitle = withFallbackString(
    home?.ctaFormSubtitle,
    placeholderHomePage.ctaFormSubtitle
  );
  const ctaFormSubmitLabel = withFallbackString(
    home?.ctaFormSubmitLabel,
    placeholderHomePage.ctaFormSubmitLabel
  );
  const ctaFormDetailsHeading = withFallbackString(
    home?.ctaFormDetailsHeading,
    placeholderHomePage.ctaFormDetailsHeading
  );
  const ctaFormInstituteHeading = withFallbackString(
    home?.ctaFormInstituteHeading,
    placeholderHomePage.ctaFormInstituteHeading
  );
  const ctaFormMessageHeading = withFallbackString(
    home?.ctaFormMessageHeading,
    placeholderHomePage.ctaFormMessageHeading
  );
  const ctaFormSuccessTitle = withFallbackString(
    home?.ctaFormSuccessTitle,
    placeholderHomePage.ctaFormSuccessTitle
  );
  const ctaFormSuccessBody = withFallbackString(
    home?.ctaFormSuccessBody,
    placeholderHomePage.ctaFormSuccessBody
  );
  const ctaFormCopy =
    home?.ctaFormCopy && typeof home.ctaFormCopy === "object"
      ? { ...placeholderHomePage.ctaFormCopy, ...home.ctaFormCopy }
      : placeholderHomePage.ctaFormCopy;
  const hasDemoFormCopyContent =
    ctaFormCopy &&
    typeof ctaFormCopy === "object" &&
    (Object.entries(ctaFormCopy).some(([key, value]) => {
      if (key === "solutionOptions") {
        return Array.isArray(value) && value.some((option: any) => hasNonEmptyString(option?.label));
      }

      return hasNonEmptyString(value);
    }) ||
      false);

  const showHero =
    Boolean(headline || subtext || heroPrimaryLabel || heroSecondaryLabel || badge);
  const showShowcase =
    (sectionSettings?.showModuleGrid !== false) &&
    Boolean(showcaseKicker || showcaseTitle || showcaseSubtitle || showcaseSlides.length);
  const showTrust =
    Boolean(trustedBy || trustSectionDescription || stats.length || trustedLogos.length);
  const showOrganization = Boolean(organizationSectionTitle && organizationCards.length);
  const showModules =
    Boolean(
      modulesTitle ||
      modulesSubtitle ||
      modules.length ||
      modulesCalloutTitle ||
      modulesCalloutBody ||
      modulesCalloutCtaLabel
    );
  const showTimeline = Boolean(timelineTabs.length);
  const showVideoSection = (sectionSettings?.showTestimonialVideos !== false) && Boolean(videoSectionTitle || videoSectionDescription || testimonialVideos.length || productVideoUrl);
  const showTestimonials = (sectionSettings?.showClientTestimonials !== false) && Boolean(testimonials.length);
  const showWhyClassgrid = sectionSettings?.showWhyClassgrid === true;
  const showTeamVision = sectionSettings?.showTeamVision === true;
  const showTurboComparison = true; // sectionSettings?.showTurboComparison === true;
  const showIsometricStack = true;  // sectionSettings?.showIsometricStack === true;
  const whyClassgridTitle = sectionSettings?.whyClassgridTitle;
  const whyClassgridDescription = sectionSettings?.whyClassgridDescription;
  const whyClassgridCards = Array.isArray(sectionSettings?.whyClassgridCards) ? sectionSettings.whyClassgridCards : [];
  const teamVisionTitle = sectionSettings?.teamVisionTitle;
  const teamVisionQuotes = Array.isArray(sectionSettings?.teamVisionQuotes) ? sectionSettings.teamVisionQuotes : [];
  const showIntegrations = Boolean(integrationLogos.length);
  const showFaq = Boolean(faqsLeft.length || faqsRight.length);
  const showDemoForm = Boolean(
    ctaFormTitle ||
    ctaFormSubtitle ||
    ctaFormSubmitLabel ||
    ctaFormDetailsHeading ||
    ctaFormInstituteHeading ||
    ctaFormMessageHeading ||
    ctaFormSuccessTitle ||
    ctaFormSuccessBody ||
    hasDemoFormCopyContent
  );

  return (
    <div className="relative overflow-x-clip bg-background text-foreground selection:bg-[#ff0080]/30">
      <ScrollToTop />
      <HomeDevScrollReset />
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, gray 1px, transparent 0)`,
            backgroundSize: `40px 40px`,
          }}
        />
        <div className="absolute left-[-5%] top-[15%] h-[500px] w-[500px] animate-pulse rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute right-[-5%] top-[40%] h-[600px] w-[600px] rounded-full bg-blue-500/5 blur-[150px]" />
        <div className="absolute left-[10%] top-[70%] h-[400px] w-[400px] rounded-full bg-orange-500/5 blur-[100px]" />
      </div>

      {showHero ? (
        <HeroSection
          badge={badge}
          headline={headline}
          subtext={subtext}
          heroPrimaryHref={heroPrimaryHref}
          heroPrimaryLabel={heroPrimaryLabel}
          heroSecondaryHref={heroSecondaryHref}
          heroSecondaryLabel={heroSecondaryLabel}
        />
      ) : null}

      {showShowcase ? (
        <Reveal>
          <div className="relative z-10 w-full bg-transparent">
            {(showcaseKicker || showcaseTitle || showcaseSubtitle) ? (
              <div className="mx-auto mt-4 mb-4 max-w-7xl px-4 text-center">
                <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500"></div>
                {showcaseKicker ? (
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
                    {showcaseKicker}
                  </p>
                ) : null}
                {showcaseTitle ? (
                  <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl">
                    {showcaseTitle}
                  </h2>
                ) : null}
                {showcaseSubtitle ? (
                  <p className="mx-auto max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
                    {showcaseSubtitle}
                  </p>
                ) : null}
              </div>
            ) : null}
            <EmpowerSliderSection
              slides={showcaseSlides.map((s) => ({
                id: s.id,
                label: s.label,
                headline: s.headline,
                body: s.body,
                imageUrl: s.src,
                imageAlt: s.alt,
              }))}
            />
          </div>
        </Reveal>
      ) : null}

      <PlatformAnimatedBeam
        kicker={platformKicker}
        title={platformTitle}
        body={platformBody}
        connectionHint={platformConnectionHint}
        systemLabel={platformSystemLabel}
        inputLabels={platformInputLabels}
        audienceCards={platformAudienceCards}
        useFallbackContent={false}
      />

      <ClassgridRoleShowcase sanityEcosystem={cmsAppEcosystem} />

      {showTrust ? (
        <Reveal>
          <section className="bg-slate-50 py-10 md:py-14 dark:bg-[#0f0f0f]">
            <div className="mx-auto max-w-7xl px-4">
              {(trustedBy || trustSectionDescription) && (
                <div className="mx-auto mb-4 max-w-3xl text-center">
                  <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500"></div>
                  {trustedBy ? (
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
                      {trustedBy}
                    </h2>
                  ) : null}
                  {trustSectionDescription ? (
                    <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 dark:text-slate-400">
                      {trustSectionDescription}
                    </p>
                  ) : null}
                </div>
              )}

              {stats.length > 0 ? <StatsStrip stats={stats} /> : null}
              {trustedLogos.length > 0 ? (
                <TrustedInstitutionsShowcase title={trustedBy} institutions={trustedLogos} />
              ) : null}
            </div>
          </section>
        </Reveal>
      ) : null}

      {showOrganization ? (
        <Reveal>
          <section className="mx-auto w-full max-w-7xl px-4 py-10 md:py-14">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500"></div>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {organizationSectionTitle}
              </h2>
            </div>
            <BentoGrid className="auto-rows-auto gap-6 md:grid-cols-4 lg:grid-cols-4">
              {organizationCards.map((org, index: number) => {
                const colors = [
                  { color: "from-emerald-400/20", iconColor: "#34d399", icon: "School" },
                  { color: "from-indigo-500/20", iconColor: "#4f46e5", icon: "GraduationCap" },
                  { color: "from-cyan-500/20", iconColor: "#0891b2", icon: "Building2" },
                  { color: "from-violet-500/20", iconColor: "#8b5cf6", icon: "BookOpen" },
                ];
                const style = colors[index % colors.length];

                return (
                  <BentoCard
                    key={`${org.title}-${index}`}
                    name={org.title}
                    cta={organizationCardCtaLabel}
                    href={org.href}
                    Icon={hasNonEmptyString(org.icon) ? org.icon : style.icon}
                    color={hasNonEmptyString(org.color) ? org.color : style.color}
                    iconColor={hasNonEmptyString(org.iconColor) ? org.iconColor : style.iconColor}
                    className="min-h-[200px]"
                  />
                );
              })}
            </BentoGrid>
          </section>
        </Reveal>
      ) : null}

      {showModules ? (
        <Reveal>
          <section className="mx-auto w-full max-w-7xl border-t border-foreground/10 px-4 py-10 md:py-14">
            {(modulesTitle || modulesSubtitle) && (
              <div className="mb-10 text-center">
                <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500"></div>
                {modulesTitle ? (
                  <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                    {modulesTitle}
                  </h2>
                ) : null}
                {modulesSubtitle ? (
                  <p className="mx-auto max-w-2xl text-lg font-medium text-muted-foreground">
                    {modulesSubtitle}
                  </p>
                ) : null}
              </div>
            )}

            <ModulesGrid
              modules={modules}
              audienceTabs={modulesAudienceTabs}
              allTabLabel={modulesAllTabLabel}
              moduleCardCtaLabel={modulesCardCtaLabel}
              showMoreLabel={modulesShowMoreLabel}
              viewAllLabel={modulesViewAllLabel}
              calloutTitle={modulesCalloutTitle}
              calloutBody={modulesCalloutBody}
              calloutCtaLabel={modulesCalloutCtaLabel}
              calloutCtaHref={modulesCalloutCtaHref}
              useFallbackContent={false}
            />
          </section>
        </Reveal>
      ) : null}

      {showTurboComparison ? (
        <Reveal>
          <TurboComparisonNew 
            headline={cmsTurboClassgrid?.headline}
            subheadline={cmsTurboClassgrid?.subheadline}
          />
        </Reveal>
      ) : null}

      {showTimeline ? (
        <Reveal>
          <TimelineSection
            title={timelineSectionTitle}
            subtitle={timelineSectionSubtitle}
            tabs={timelineTabs}
            defaultTab={defaultTimelineTab}
            roleDataMap={timelineRoleDataMap}
          />
        </Reveal>
      ) : null}

      {showVideoSection ? (
        <Reveal>
          <HeroVideoSlider
            videos={testimonialVideos}
            fallbackVideoUrl={productVideoUrl}
            fallbackPosterUrl={productVideoPosterUrl}
            fallbackPosterAlt={productVideoPosterAlt}
            title={videoSectionTitle}
            description={videoSectionDescription}
            useFallbackContent={false}
          />
        </Reveal>
      ) : null}

      {showTestimonials ? (
        <Reveal>
          <section className="mx-auto w-full max-w-7xl px-4 py-10 md:py-14">
            {(testimonialsLabel || testimonialsTitle || testimonialsSectionDescription) && (
              <div className="mb-12 text-center">
                <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500"></div>
                {testimonialsLabel ? (
                  <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    {testimonialsLabel}
                  </p>
                ) : null}
                {testimonialsTitle ? (
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                    {testimonialsTitle}
                  </h2>
                ) : null}
                {testimonialsSectionDescription ? (
                  <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400">
                    {testimonialsSectionDescription}
                  </p>
                ) : null}
              </div>
            )}
            <TestimonialCarouselV2 testimonials={testimonials} useFallbackContent={false} />
          </section>
        </Reveal>
      ) : null}

      {showWhyClassgrid ? (
        <Reveal>
          <WhyClassgridSection
            title={whyClassgridTitle}
            description={whyClassgridDescription}
            cards={whyClassgridCards}
          />
        </Reveal>
      ) : null}

      {showTeamVision ? (
        <Reveal>
          <TeamVisionSection
            title={teamVisionTitle}
            quotes={teamVisionQuotes}
          />
        </Reveal>
      ) : null}

      {showIsometricStack ? (
        <IsometricStackSection
          kicker={cmsIsometricStack?.kicker}
          headline={cmsIsometricStack?.headline}
          subheadline={cmsIsometricStack?.subheadline}
          phases={cmsIsometricStack?.phases}
        />
      ) : null}

      {showIntegrations ? (
        <Reveal>
          <div id="integrations">
            <IntegrationsMarquee
              kicker={integrationsKicker}
              title={integrationsTitle}
              subtitle={integrationsSubtitle}
              logos={integrationLogos}
              useFallbackContent={false}
            />
          </div>
        </Reveal>
      ) : null}

      {showFaq ? (
        <Reveal>
          <div id="faq">
            <FAQSection
              title={faqSectionTitle}
              subtitle={faqTitle}
              description={faqSectionDescription}
              buttonLabel={faqButtonLabel}
              buttonHref={faqButtonHref}
              faqsLeft={faqsLeft}
              faqsRight={faqsRight}
              className="border-t border-foreground/10"
            />
          </div>
        </Reveal>
      ) : null}

      {showDemoForm ? (
        <Reveal>
          <section
            id="demo"
            className="border-t border-border bg-muted/50 py-24 md:py-32"
          >
            <div className="mx-auto max-w-7xl px-4">
              <DemoRequestForm
                label={demoSectionLabel}
                title={demoSectionHeading}
                subtitle={demoSectionSubtext}
                ctaLine={demoSectionCtaLine}
                formTitle={ctaFormTitle}
                formSubtitle={ctaFormSubtitle}
                submitLabel={ctaFormSubmitLabel}
                detailsSectionTitle={ctaFormDetailsHeading}
                instituteSectionTitle={ctaFormInstituteHeading}
                messageSectionTitle={ctaFormMessageHeading}
                successTitle={ctaFormSuccessTitle}
                successBody={ctaFormSuccessBody}
                copy={ctaFormCopy}
              />
            </div>
          </section>
        </Reveal>
      ) : null}
    </div>
  );
}
