import type { Metadata } from "next";

import { ChangelogPageClient } from "@/components/changelog/ChangelogPageClient";
import { changelogFallbackEntries, changelogSettingsFallback } from "@/content/changelog";
import { siteMeta } from "@/content/siteMeta";
import { buildLangHref, extractLocaleString, parseLang } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/metadata";
import { getChangelogEntries, getChangelogSettings } from "@/sanity/lib/marketing";
import { urlFor } from "@/sanity/lib/image";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 300;

type ChangelogPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function buildSanityImageUrl(image: unknown, width: number) {
  if (!image) return null;
  const base = urlFor(image).width(width).fit("max").quality(80).format("webp").url();
  return `${base}&auto=format,compress`;
}

export async function generateMetadata({ searchParams }: ChangelogPageProps): Promise<Metadata> {
  const lang = parseLang((await searchParams) ?? undefined);
  const cms = (await getChangelogSettings()) as
    | {
        seoTitle?: string;
        metaDescription?: string;
        ogImage?: unknown;
      }
    | null;
  const ogImage = buildSanityImageUrl(cms?.ogImage, 1200) ?? changelogSettingsFallback.ogImage;

  return buildPageMetadata({
    title: cms?.seoTitle ?? changelogSettingsFallback.seoTitle,
    description: cms?.metaDescription ?? changelogSettingsFallback.metaDescription,
    path: buildLangHref("/changelog", lang),
    canonical: buildLangHref("/changelog", lang),
    ogImage: ogImage ?? undefined,
  });
}

export default async function ChangelogPage({ searchParams }: ChangelogPageProps) {
  const lang = parseLang((await searchParams) ?? undefined);
  const [cmsSettings, cmsEntries] = await Promise.all([getChangelogSettings(), getChangelogEntries()]);

  const settings = {
    heroHeadline: extractLocaleString(
      (cmsSettings as { heroHeadline?: unknown } | null)?.heroHeadline,
      lang,
      changelogSettingsFallback.heroHeadline
    ),
    heroSubheadline: extractLocaleString(
      (cmsSettings as { heroSubheadline?: unknown } | null)?.heroSubheadline,
      lang,
      changelogSettingsFallback.heroSubheadline
    ),
  };

  const cmsMappedEntries =
    (((cmsEntries as Array<{
      title?: unknown;
      slug?: string;
      releaseDate?: string;
      updateType?: string;
      versionLabel?: string;
      modules?: string[];
      summary?: unknown;
      image?: unknown;
      relatedTourLabel?: string;
      relatedTourHref?: string;
    }> | null) ?? [])
      .map((entry) => ({
        title: extractLocaleString(entry.title, lang) || "Update",
        slug: entry.slug ?? "",
        releaseDate: entry.releaseDate ?? new Date().toISOString().slice(0, 10),
        updateType: entry.updateType ?? "improvement",
        versionLabel: entry.versionLabel,
        modules: entry.modules ?? [],
        summary: extractLocaleString(entry.summary, lang),
        imageUrl: buildSanityImageUrl(entry.image, 720),
        relatedTourLabel: entry.relatedTourLabel,
        relatedTourHref: entry.relatedTourHref,
      }))
      .filter((entry) => entry.slug)) ?? [];

  const entries =
    cmsMappedEntries.length > 0
      ? cmsMappedEntries
      : changelogFallbackEntries.map((entry) => ({
          title: entry.title,
          slug: entry.slug,
          releaseDate: entry.releaseDate,
          updateType: entry.updateType,
          versionLabel: entry.versionLabel,
          modules: entry.modules,
          summary: entry.summary,
          imageUrl: null,
          relatedTourLabel: entry.relatedTourLabel,
          relatedTourHref: entry.relatedTourHref,
        }));

  const changelogListJsonLd = {
    "@type": "CollectionPage",
    "@id": `${siteMeta.domain}${buildLangHref("/changelog", lang)}/#webpage`,
    name: settings.heroHeadline,
    description: settings.heroSubheadline,
    url: `${siteMeta.domain}${buildLangHref("/changelog", lang)}`,
    about: { "@id": "https://classgrid.in/#software" },
    hasPart: entries.map((entry) => ({
      "@type": "SoftwareUpdate",
      name: entry.title,
      datePublished: entry.releaseDate,
      url: `${siteMeta.domain}${buildLangHref(`/changelog/${entry.slug}`, lang)}`,
    })),
  };

  return (
    <>
      <JsonLd data={changelogListJsonLd} />
      <ChangelogPageClient settings={settings} entries={entries} siteUrl={siteMeta.domain} lang={lang} />
    </>
  );
}
