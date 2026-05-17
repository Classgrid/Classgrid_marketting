import { buildPageMetadata } from "@/lib/metadata";
import { pageMeta } from "@/content/pageMeta";
import { aboutPageFallback } from "@/content/about";
import { getAboutPage } from "@/sanity/lib/marketing";
import AboutPageClient from "./AboutPageClient";

type AboutPageCms = {
  seoTitle?: string;
  metaDescription?: string;
  storyTitle?: string;
  originQuote?: string;
  originStory?: string[];
  missionTitle?: string;
  missionBody?: string;
  visionTitle?: string;
  visionBody?: string;
  whatIsClassgrid?: any[];
  whatWeDo?: any[];
  whyChooseClassgrid?: any[];
  values?: any[];
  timeline?: any[];
  futureTimelineItem?: any;
};

function cleanString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function cleanStoryParagraphs(value: unknown) {
  if (!Array.isArray(value)) return undefined;

  const paragraphs = value
    .map((paragraph) => cleanString(paragraph))
    .filter((paragraph): paragraph is string => Boolean(paragraph));

  return paragraphs.length > 0 ? paragraphs : undefined;
}

export async function generateMetadata() {
  const cms = (await getAboutPage()) as AboutPageCms | null;

  return buildPageMetadata({
    title: cleanString(cms?.seoTitle) ?? aboutPageFallback.seoTitle,
    description: cleanString(cms?.metaDescription) ?? aboutPageFallback.metaDescription,
    path: pageMeta.about.path,
    canonical: "/about",
  });
}

export default async function AboutPage() {
  const cms = (await getAboutPage()) as AboutPageCms | null;

  return (
    <AboutPageClient
      storyTitle={cleanString(cms?.storyTitle) ?? aboutPageFallback.storyTitle}
      originQuote={cleanString(cms?.originQuote) ?? aboutPageFallback.originQuote}
      storyParagraphs={cleanStoryParagraphs(cms?.originStory) ?? aboutPageFallback.originStory}
      missionTitle={cleanString(cms?.missionTitle)}
      missionBody={cleanString(cms?.missionBody)}
      visionTitle={cleanString(cms?.visionTitle)}
      visionBody={cleanString(cms?.visionBody)}
      whatIsClassgrid={cms?.whatIsClassgrid}
      whatWeDo={cms?.whatWeDo}
      whyChooseClassgrid={cms?.whyChooseClassgrid}
      values={cms?.values}
      timeline={[...(cms?.timeline || []), cms?.futureTimelineItem].filter(Boolean)}
    />
  );
}
