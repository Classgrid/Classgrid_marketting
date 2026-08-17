import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { codeToHtml } from "shiki";
import "@/app/docs/docs.css";
import {
  ArrowRight, Bug, Rocket, WandSparkles, Megaphone, Zap, Shield, Trash2,
  LayoutDashboard, Server, RefreshCw, FileText, Palette, Scale, Gavel,
  Handshake, Flame, RotateCcw, ArrowLeftRight, Wrench, Package, Code2,
  Database, Accessibility, Languages, TestTube, FlaskConical, Sparkles,
  Eye, PartyPopper, XCircle, Settings, SwatchBook, BarChart3, Search,
  TrendingUp, UserPlus, CreditCard, Tag, HeadphonesIcon, Users, Webhook,
  Puzzle, Smartphone, Monitor, Cpu, CircuitBoard, GitBranch, Heart, HardHat
} from "lucide-react";
import { format } from "date-fns";

import { ChangelogSidebar } from "@/components/changelog/ChangelogSidebar";
import { PortableTextBlock } from "@/components/PortableTextBlock";
import { Badge } from "@/components/ui/badge";
import { CmsFallback } from "@/components/ui/CmsErrorBoundary";
import { ContentCoverImage } from "@/components/ui/ContentCoverImage";
import { DocumentHero } from "@/components/ui/DocumentHero";
import { changelogFallbackBySlug, changelogFallbackEntries } from "@/content/changelog";
import { siteMeta } from "@/content/siteMeta";
import { buildLangHref, extractLocaleString, extractLocaleValue, parseLang } from "@/lib/locale";
import { buildPageMetadata } from "@/lib/metadata";
import { urlFor } from "@/sanity/lib/image";
import { getChangelogEntries, getChangelogEntryBySlug } from "@/sanity/lib/marketing";

type ChangelogDetailPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const UPDATE_LABELS: Record<string, { label: string; icon: any }> = {
  feature: { label: "New Feature", icon: Rocket },
  improvement: { label: "Improvement", icon: WandSparkles },
  bugfix: { label: "Bug Fix", icon: Bug },
  announcement: { label: "Announcement", icon: Megaphone },
  performance: { label: "Performance", icon: Zap },
  security: { label: "Security", icon: Shield },
  deprecation: { label: "Deprecation", icon: Trash2 },
  removal: { label: "Removal", icon: XCircle },
  architecture: { label: "Architecture", icon: LayoutDashboard },
  infrastructure: { label: "Infrastructure", icon: Server },
  refactor: { label: "Refactor", icon: RefreshCw },
  documentation: { label: "Documentation", icon: FileText },
  "ui-ux": { label: "UI/UX", icon: Palette },
  compliance: { label: "Compliance", icon: Scale },
  legal: { label: "Legal", icon: Gavel },
  partnership: { label: "Partnership", icon: Handshake },
  hotfix: { label: "Hotfix", icon: Flame },
  rollback: { label: "Rollback", icon: RotateCcw },
  migration: { label: "Migration", icon: ArrowLeftRight },
  maintenance: { label: "Maintenance", icon: Wrench },
  dependencies: { label: "Dependencies", icon: Package },
  "api-change": { label: "API Change", icon: Code2 },
  "data-model": { label: "Data Model", icon: Database },
  accessibility: { label: "Accessibility", icon: Accessibility },
  localization: { label: "Localization", icon: Languages },
  testing: { label: "Testing", icon: TestTube },
  experiment: { label: "Experiment", icon: FlaskConical },
  beta: { label: "Beta Release", icon: Sparkles },
  "early-access": { label: "Early Access", icon: Eye },
  ga: { label: "General Availability", icon: PartyPopper },
  eol: { label: "End of Life", icon: XCircle },
  configuration: { label: "Configuration", icon: Settings },
  "design-system": { label: "Design System", icon: SwatchBook },
  analytics: { label: "Analytics", icon: BarChart3 },
  seo: { label: "SEO", icon: Search },
  marketing: { label: "Marketing", icon: TrendingUp },
  onboarding: { label: "Onboarding", icon: UserPlus },
  billing: { label: "Billing & Subscriptions", icon: CreditCard },
  pricing: { label: "Pricing", icon: Tag },
  support: { label: "Support", icon: HeadphonesIcon },
  community: { label: "Community", icon: Users },
  webhooks: { label: "Webhooks", icon: Webhook },
  integrations: { label: "Integrations", icon: Puzzle },
  mobile: { label: "Mobile App", icon: Smartphone },
  desktop: { label: "Desktop App", icon: Monitor },
  hardware: { label: "Hardware", icon: Cpu },
  firmware: { label: "Firmware", icon: CircuitBoard },
  "open-source": { label: "Open Source", icon: GitBranch },
  qol: { label: "Quality of Life", icon: Heart },
  "internal-tooling": { label: "Internal Tooling", icon: HardHat },
};

const DEFAULT_UPDATE_META = { label: "Update", icon: Rocket };

function buildSanityImageUrl(image: unknown, width: number) {
  if (!image) return null;
  const base = urlFor(image).width(width).fit("max").quality(80).format("webp").url();
  return `${base}&auto=format,compress`;
}

function prettyModule(moduleValue: string) {
  return moduleValue.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export const revalidate = 300;

export async function generateStaticParams() {
  const cmsEntries =
    ((await getChangelogEntries()) as Array<{ slug?: string }> | null)?.filter((entry) => entry.slug) ?? [];
  const slugs = Array.from(
    new Set([...cmsEntries.map((entry) => entry.slug as string), ...changelogFallbackEntries.map((entry) => entry.slug)])
  );

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: ChangelogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lang = parseLang((await searchParams) ?? undefined);
  const cms = (await getChangelogEntryBySlug(slug)) as
    | {
        title?: unknown;
        summary?: unknown;
        seoTitle?: string;
        metaDescription?: unknown;
        ogImage?: unknown;
        ogImageUrl?: string;
      }
    | null;
  const fallback = changelogFallbackBySlug[slug];
  const ogImage = buildSanityImageUrl(cms?.ogImage, 1200) ?? cms?.ogImageUrl ?? fallback?.ogImage;
  const localizedTitle = extractLocaleString(cms?.title, lang);
  const localizedSummary = extractLocaleString(cms?.summary, lang);
  const localizedMetaDescription = extractLocaleString(cms?.metaDescription, lang);
  const href = buildLangHref(`/changelog/${slug}`, lang);

  return buildPageMetadata({
    title: cms?.seoTitle ?? fallback?.seoTitle ?? localizedTitle ?? fallback?.title ?? "Changelog update",
    description:
      localizedMetaDescription ??
      fallback?.metaDescription ??
      localizedSummary ??
      "Read the latest Classgrid product update.",
    path: href,
    canonical: href,
    ogImage: ogImage ?? undefined,
    type: "article",
  });
}

export default async function ChangelogDetailPage({
  params,
  searchParams,
}: ChangelogDetailPageProps) {
  const { slug } = await params;
  const lang = parseLang((await searchParams) ?? undefined);
  const cms = (await getChangelogEntryBySlug(slug)) as any;
  const fallback = changelogFallbackBySlug[slug];

  if (!cms && !fallback) {
    notFound();
  }

  const entry = cms
    ? {
        title: extractLocaleString(cms.title, lang) || fallback?.title || "Changelog update",
        slug: cms.slug ?? slug,
        releaseDate: cms.releaseDate ?? fallback?.releaseDate ?? new Date().toISOString().slice(0, 10),
        updateType: cms.updateType ?? fallback?.updateType ?? "improvement",
        versionLabel: cms.versionLabel ?? fallback?.versionLabel,
        modules: cms.modules ?? fallback?.modules ?? [],
        summary: extractLocaleString(cms.summary, lang) || fallback?.summary || "",
        content: extractLocaleValue(cms.content, lang, fallback?.content ?? []) ?? [],
        imageUrl: buildSanityImageUrl(cms.image, 1600),
        relatedTourLabel: cms.relatedTourLabel ?? fallback?.relatedTourLabel,
        relatedTourHref: cms.relatedTourHref ?? fallback?.relatedTourHref,
        metaDescription: extractLocaleString(cms.metaDescription, lang) || fallback?.metaDescription || "",
        authors: cms.authors ?? [],
        readingTime: cms.readingTimeOverride ?? null,
      }
    : {
        title: fallback.title,
        slug: fallback.slug,
        releaseDate: fallback.releaseDate,
        updateType: fallback.updateType,
        versionLabel: fallback.versionLabel,
        modules: fallback.modules,
        summary: fallback.summary,
        content: fallback.content,
        imageUrl: null,
        relatedTourLabel: fallback.relatedTourLabel,
        relatedTourHref: fallback.relatedTourHref,
        metaDescription: fallback.metaDescription,
        authors: [],
        readingTime: null,
      };

  const sharePath = buildLangHref(`/changelog/${entry.slug}`, lang);
  const shareUrl = `${siteMeta.domain}${sharePath}`;
  const updateMeta = UPDATE_LABELS[entry.updateType] ?? DEFAULT_UPDATE_META;
  const UpdateIcon = updateMeta.icon;

  const softwareUpdateJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareUpdate",
    name: entry.title,
    description: entry.metaDescription || entry.summary,
    datePublished: entry.releaseDate,
    softwareVersion: entry.versionLabel,
    url: shareUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    isPartOf: {
      "@type": "SoftwareApplication",
      name: "Classgrid",
      url: siteMeta.domain,
    },
  };

  return (
    <main className="bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareUpdateJsonLd) }}
      />

      <section className="border-b border-border bg-background">
        <div className="mx-auto w-full max-w-4xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 text-center">
          <DocumentHero
            badgeLabel={`Update / ${updateMeta.label}`}
            badgeDotColor="bg-emerald-500"
            title={entry.title}
            authorRow={
              entry.authors && entry.authors.length > 0 ? (
                <div className="mt-5 flex items-center justify-center gap-2.5">
                  <div className="flex items-center -space-x-2">
                    {entry.authors.slice(0, 3).map((author: any, idx: number) => (
                      author.image ? (
                        <Image
                          key={idx}
                          src={urlFor(author.image).width(64).height(64).url()}
                          alt={author.name || 'Author'}
                          width={28}
                          height={28}
                          className="h-7 w-7 rounded-full object-cover ring-2 ring-background"
                          style={{ zIndex: 3 - idx }}
                        />
                      ) : (
                        <div
                          key={idx}
                          className="h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-[11px] font-bold text-emerald-500 ring-2 ring-background"
                          style={{ zIndex: 3 - idx }}
                        >
                          {(author.name || 'C').charAt(0)}
                        </div>
                      )
                    ))}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    {entry.authors.slice(0, 3).map((a: any) => a.name || 'Classgrid Team').join(', ')}
                  </span>
                </div>
              ) : undefined
            }
            subtitles={[
              entry.versionLabel ? `Version ${entry.versionLabel}` : "",
              format(new Date(entry.releaseDate), "MMMM d, yyyy"),
            ].filter(Boolean)}
            description={entry.summary}
            lang={lang}
            showAccentBar={false}
          />

          {entry.modules.length > 0 && (
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {entry.modules.map((moduleValue) => (
                <Badge key={moduleValue} variant="secondary" className="rounded-full">
                  {prettyModule(moduleValue)}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex gap-8">
        <div className="flex-1 min-w-0 max-w-4xl">
        {entry.imageUrl ? (
          <ContentCoverImage src={entry.imageUrl} alt={entry.title} className="mb-12" />
        ) : null}

        <div className="space-y-0 changelog-content">
          <PortableTextBlock 
            value={await Promise.all((entry.content || []).map(async (block: any) => {
              if (block._type === 'codeBlock' && block.code) {
                let html = '';
                try {
                  html = await codeToHtml(block.code, {
                    lang: block.language || 'javascript',
                    themes: { light: 'github-light', dark: 'github-dark' },
                    transformers: [
                      {
                        line(node, line) {
                          node.properties['data-line'] = line;
                        }
                      }
                    ]
                  });
                } catch (e) {
                  html = `<pre><code>${block.code}</code></pre>`;
                }
                return { ...block, highlightedHtml: html };
              }
              return block;
            }))} 
            showAccentBars={false} 
          />
        </div>

        <div className="mt-12 sm:mt-20 rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-500">Next step</p>
          <h3 className="mb-3 text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">See it in action</h3>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground max-w-lg">
            Book a demo to see how this update works in your institution&apos;s workflow.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
            <Link
              href={buildLangHref("/contact", lang)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-80"
            >
              Book a Demo
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href={buildLangHref("/changelog", lang)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border px-6 text-sm font-semibold text-foreground transition-colors hover:border-emerald-500/40 hover:text-emerald-500"
            >
              View All Updates
            </Link>
          </div>
        </div>
        </div>
        <ChangelogSidebar 
          readingTime={entry.readingTime}
        />
        </div>
      </section>
    </main>
  );
}
