"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, ArrowRight, Link as LinkIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { FAQSection } from "@/components/ui/faqsection";
import { TrackedCtaButton } from "@/components/compare/TrackedCtaButton";
import { VercelTable } from "@/components/ui/vercel-table";
import { FeedbackWidget } from "@/components/shared/FeedbackWidget";
import { PortableTextBlock } from "@/components/PortableTextBlock";

type ComparisonDetailClientProps = {
  comparison: {
    competitorName: string;
    slug: string;
    competitorLogoUrl?: string | null;
    websiteLink?: string | null;
    seoTitle?: string;
    metaDescription?: string;
    lastUpdated?: string | null;
    lastUpdatedDate?: string | null;
    _updatedAt?: string | null;
    readTime?: number | null;
    body?: unknown[] | null;
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
  };
};

const Crosshair = ({ className }: { className?: string }) => (
  <svg
    className={cn("absolute w-[17px] h-[17px] text-slate-300 dark:text-white/20", className)}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8.5 0V17M0 8.5H17" stroke="currentColor" strokeWidth="1" />
  </svg>
);

const getTocData = (comparison: ComparisonDetailClientProps["comparison"]) => {
  const bodyBlocks = comparison.body as Array<{ _type?: string; style?: string; children?: Array<{ text?: string }> }> | null | undefined;
  const hasBody = Array.isArray(bodyBlocks) && bodyBlocks.length > 0;

  if (hasBody) {
    const mainItems: { id: string; label: string }[] = []; // H2s only — for inline body TOC
    const fullItems: { id: string; label: string }[] = []; // H2+H3 — for right-side TOC + scroll spy

    bodyBlocks.forEach((block) => {
      if (block._type === "block" && (block.style === "h2" || block.style === "h3")) {
        const text = (block.children ?? []).map((c) => c.text ?? "").join("");
        if (text.trim()) {
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
          fullItems.push({ id, label: text });
          if (block.style === "h2") {
            mainItems.push({ id, label: text });
          }
        }
      }
    });

    // Append hardcoded sections that render after the body
    const extraItems: { id: string; label: string }[] = [];
    if ((comparison.featureMatrix ?? []).length > 0) {
      extraItems.push({ id: "competitor-comparison", label: `${comparison.competitorName} comparison` });
    }
    if ((comparison.ratingBadges ?? []).length > 0) {
      extraItems.push({ id: "expert-ratings", label: "Expert ratings" });
    }
    if (comparison.migrationTestimonial?.quoteText) {
      extraItems.push({ id: "migration", label: "Migration perspective" });
    }
    if ((comparison.faqs ?? []).length > 0) {
      extraItems.push({ id: "faqs", label: "FAQ" });
    }

    return { mainItems, fullItems: [...fullItems, ...extraItems] };
  }

  // Fallback: hardcoded TOC for pages without Sanity body
  const items = [
    { id: "intro", label: "Introduction" },
    { id: "strengths", label: "Strengths of each platform" },
    { id: "when-to-choose", label: "When to choose Classgrid" },
  ];

  if ((comparison.featureMatrix ?? []).length > 0) {
    items.push({ id: "competitor-comparison", label: `${comparison.competitorName} comparison` });
  }

  if ((comparison.ratingBadges ?? []).length > 0) {
    items.push({ id: "expert-ratings", label: "Expert ratings" });
  }

  items.push({ id: "ai-tools", label: "AI-powered tools" });

  if (comparison.migrationTestimonial?.quoteText) {
    items.push({ id: "migration", label: "Migration perspective" });
  }

  if ((comparison.faqs ?? []).length > 0) {
    items.push({ id: "faqs", label: "FAQ" });
  }

  return { mainItems: items, fullItems: items };
};

export function ComparisonDetailClient({ comparison }: ComparisonDetailClientProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedPage, setCopiedPage] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("intro");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const { mainItems: mainTocItems, fullItems: tocItems } = useMemo(() => getTocData(comparison), [comparison]);

  // Scroll Spy Logic — polls until all heading elements exist in the DOM
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-10% 0px -35% 0px" }
    );

    let attempts = 0;
    let retryTimer: ReturnType<typeof setTimeout>;

    const tryObserve = () => {
      let found = 0;
      tocItems.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) { observer.observe(el); found++; }
      });
      attempts++;
      // Retry every 200ms until all items found or 4 seconds elapsed
      if (found < tocItems.length && attempts < 20) {
        retryTimer = setTimeout(tryObserve, 200);
      }
    };

    retryTimer = setTimeout(tryObserve, 300);

    return () => {
      clearTimeout(retryTimer);
      observer.disconnect();
    };
  }, [tocItems]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleCopyPage = async () => {
    try {
      const mainContent = document.querySelector('main')?.innerText ?? document.body.innerText;
      await navigator.clipboard.writeText(mainContent);
      setCopiedPage(true);
      setTimeout(() => setCopiedPage(false), 2000);
    } catch {
      setCopiedPage(true);
      setTimeout(() => setCopiedPage(false), 2000);
    }
  };

  const faqPairs = (comparison.faqs ?? [])
    .filter((item) => item.question?.trim() && item.answer?.trim())
    .map((item) => ({
      question: item.question as string,
      answer: item.answer as string,
    }));
  const midpoint = Math.ceil(faqPairs.length / 2);
  const faqsLeft = faqPairs.slice(0, midpoint);
  const faqsRight = faqPairs.slice(midpoint);

  // Determine the date to show: 
  // 1. Manual date from Sanity
  // 2. Automatic Sanity _updatedAt timestamp
  // 3. Fallback mock data date
  // 4. Today's date
  const lastUpdatedFormatted = comparison.lastUpdatedDate
    ? new Date(comparison.lastUpdatedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : comparison._updatedAt
      ? new Date(comparison._updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : comparison.lastUpdated
        ? new Date(comparison.lastUpdated).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const featureMatrix = comparison.featureMatrix ?? [];

  return (
    <main className="min-h-screen bg-background text-foreground pt-24 pb-16 relative">
      
      {/* 
        The "Blueprint Box" Container
        max-w-[900px] centers it as a wide rectangle, while border-l and border-r create the vertical box shape.
      */}
      <div className="relative mx-4 sm:mx-auto max-w-[900px] mb-24">
        
        {/* Right-Side Minimalist Table of Contents (Sticky) */}
        <div className="hidden xl:block absolute left-full top-32 ml-8 w-40 h-full z-50">
          <div className="sticky top-32 pointer-events-auto">
            {/* The dropdown label */}
            <div className="group relative inline-flex items-center gap-2 mb-6 text-[13px] font-medium text-slate-500 dark:text-neutral-400 cursor-pointer">
              On this page
              {/* Dropdown opens to the LEFT so it never goes off-screen */}
              <div className="absolute top-full right-0 mt-2 w-56 max-h-[300px] overflow-y-auto overscroll-contain rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[999] p-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-2 px-2 pt-1">Table of Contents</div>
                {tocItems.map(item => (
                  <a key={`dropdown-${item.id}`} href={`#${item.id}`} className={cn(
                    "block px-2 py-1.5 text-[13px] rounded hover:bg-slate-100 dark:hover:bg-white/5",
                    activeSection === item.id ? "text-emerald-500 font-medium" : "text-slate-600 dark:text-neutral-300"
                  )}>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            
            {/* The scroll spy ticks */}
            <div className="flex flex-col gap-2.5">
              {tocItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={`tick-${item.id}`}
                    href={`#${item.id}`}
                    className="group relative flex items-center h-4 w-full"
                    aria-label={`Scroll to ${item.label}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <div
                      className={cn(
                        "h-[1px] transition-all duration-300 ease-in-out",
                        isActive 
                          ? "w-6 bg-emerald-500 dark:bg-emerald-400" 
                          : "w-3 bg-slate-300 dark:bg-white/20 group-hover:w-4 group-hover:bg-slate-400 dark:group-hover:bg-white/40"
                      )}
                    />
                    {/* Hover Tooltip for Ticks — positioned LEFT to overlap the table instead of getting cut off off-screen */}
                    <span className="absolute right-full mr-3 px-2 py-1 bg-slate-800 dark:bg-white text-white dark:text-black text-[11px] font-medium rounded opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-lg z-[999]">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Box Area with borders */}
        <div className="relative border-l border-r border-slate-200 dark:border-white/10">
          
          {/* Header Section */}
          <section id="intro" className="relative px-4 md:px-12 pt-16 pb-20 text-center">
            {/* Top Border Line for Header */}
            <div className="absolute top-0 left-0 w-full border-t border-slate-200 dark:border-white/10" />
            <Crosshair className="-top-[8px] -left-[8px]" />
            <Crosshair className="-top-[8px] -right-[8px]" />

            <h1 className="mb-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Classgrid vs {comparison.competitorName}
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-neutral-400">
              {comparison.metaDescription || `A detailed guide to Classgrid vs ${comparison.competitorName}: compute architecture, AI infrastructure, security, and when to choose each platform for your institution.`}
            </p>

            {/* Author / Competitor Badge */}
            <div className="flex flex-col items-center justify-center gap-2 mb-10">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
                <Image src="/logo.png" alt="Classgrid" width={16} height={16} className="object-contain" />
                <span className="text-[13px] font-medium tracking-tight text-slate-900 dark:text-white">Classgrid</span>
              </div>
            </div>

            {/* Utility links */}
            <div className="mb-6 flex flex-wrap items-center justify-center gap-5 text-slate-500 dark:text-neutral-500">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <LinkIcon className="w-3.5 h-3.5 pointer-events-none" />}
                {copiedUrl ? "Copied!" : "Copy URL"}
              </button>
              <span className="sr-only" aria-live="polite">{copiedUrl ? "Copied!" : ""}</span>
              <div className="h-3.5 w-px bg-slate-200 dark:bg-white/10" />
              <button
                type="button"
                onClick={handleCopyPage}
                className="flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:text-slate-900 dark:hover:text-white"
              >
                {copiedPage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedPage ? "Copied!" : "Copy page"}
              </button>
              <span className="sr-only" aria-live="polite">{copiedPage ? "Copied!" : ""}</span>
            </div>

            <div className="flex items-center justify-center gap-4 text-[14px] text-slate-500 dark:text-neutral-500">
              <span>{comparison.readTime || 11} min read</span>
              <div className="h-3.5 w-px bg-slate-200 dark:bg-white/10" />
              <span>Last updated {lastUpdatedFormatted}</span>
            </div>
          </section>

          {/* Body Content Sections */}
          <div className="relative px-4 md:px-12 py-16 [&_a:not(.toc-link)]:text-emerald-600 [&_a:not(.toc-link)]:dark:text-emerald-400 [&_a:not(.toc-link)]:underline [&_a:not(.toc-link)]:underline-offset-4 [&_a:not(.toc-link)]:decoration-emerald-500/40 [&_a:not(.toc-link)]:hover:decoration-emerald-500">
            {/* Top Border Line for Content */}
            <div className="absolute top-0 left-0 w-full border-t border-dashed border-slate-200 dark:border-white/10" />
            <Crosshair className="-top-[8px] -left-[8px]" />
            <Crosshair className="-top-[8px] -right-[8px]" />

            <div className="space-y-16">

              {/* Table of Contents — Emerald Green */}
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-5">Table of contents</h2>
                <ul className="space-y-2.5">
                  {mainTocItems.map((item) => (
                    <li key={`toc-body-${item.id}`}>
                      <a
                        href={`#${item.id}`}
                        className="text-[15px] font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors hover:underline underline-offset-4"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              

              {/* === CMS Body (replaces hardcoded sections when available) === */}
              {Array.isArray(comparison.body) && comparison.body.length > 0 ? (
                <section id="cms-body" className="space-y-2 pt-4">
                  <PortableTextBlock value={comparison.body} showAccentBars={false} />
                </section>
              ) : (
                /* === Hardcoded fallback (for pages without Sanity body) === */
                <>
                  {/* Strengths */}
                  <section id="strengths" className="space-y-6 pt-4">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Strengths of each platform</h2>
                    <p className="text-[15px] leading-relaxed text-slate-600 dark:text-neutral-400">
                      Each platform has distinct strengths depending on your institutional requirements and architecture patterns.
                    </p>
                  </section>

                  {/* When to choose Classgrid */}
                  <section id="when-to-choose" className="space-y-6 pt-4">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">When to choose Classgrid</h3>
                    <p className="text-[15px] leading-relaxed text-slate-600 dark:text-neutral-400">
                  Classgrid excels at institutional-wide automation, AI-driven workflows, and performance-critical operations. The platform provides native ERP integration, real-time analytics, and infrastructure designed for modern education with global edge distribution.
                    </p>
                    <VercelTable
                      columns={[
                        { key: "module", header: "Module", accent: true, width: "w-[200px]" },
                        { key: "capabilities", header: "Capabilities" },
                      ]}
                      rows={[
                    { module: "Attendance", capabilities: "Biometric sync, GPS geofencing, real-time dashboards, automated defaulter alerts" },
                    { module: "Fee Management", capabilities: "Multi-gateway collection, auto-reconciliation, late-fee engine, parent SMS receipts" },
                    { module: "Examination", capabilities: "Seating plan generation, hall ticket automation, result processing with grace marks" },
                        { module: "NAAC/NBA", capabilities: "Auto-generated compliance reports, criterion-wise data aggregation, audit trails" },
                      ]}
                    />
                  </section>

                  {/* AI Tools */}
                  <section id="ai-tools" className="space-y-6 pt-4">
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">AI-powered institutional tools</h3>
                    <p className="text-[15px] leading-relaxed text-slate-600 dark:text-neutral-400">
                      <span className="font-medium text-slate-900 dark:text-white">Classgrid AI</span> accelerates institutional workflows with AI assistance.
                    </p>
                    <div className="space-y-4">
                      <h4 className="text-base font-semibold text-slate-900 dark:text-white">Smart Analytics</h4>
                      <ul className="ml-4 space-y-2 text-[15px] text-slate-600 dark:text-neutral-400">
                    <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300 dark:bg-neutral-600" />Predicts student dropout risk from attendance and grade patterns</li>
                        <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300 dark:bg-neutral-600" />Generates compliance-ready reports automatically</li>
                        <li className="flex items-start gap-3"><span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300 dark:bg-neutral-600" />One-click NAAC/NBA data aggregation</li>
                      </ul>
                    </div>
                  </section>
                </>
              )}


              {/* Competitor Comparison (always from Sanity data) */}
              {featureMatrix.length > 0 && (
                <section id="competitor-comparison" className="space-y-6 pt-4">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{comparison.competitorName} comparison</h3>
                  <p className="text-[15px] leading-relaxed text-slate-600 dark:text-neutral-400">
                    <span className="font-medium text-slate-900 dark:text-white">{comparison.competitorName}</span> provides foundational campus management features but may differ in automation depth, real-time capabilities, and deployment architecture.
                  </p>
                  <VercelTable
                    columns={[
                      { key: "feature", header: "Feature", width: "w-[200px]" },
                      { key: "classgrid", header: "Classgrid", accent: true },
                      { key: "competitor", header: comparison.competitorName },
                    ]}
                    rows={featureMatrix.map((row) => ({
                      feature: row.featureName ?? "",
                      classgrid: row.ourStatus ?? "",
                      competitor: row.competitorStatus ?? "",
                    }))}
                  />
                </section>
              )}

              {/* Expert Ratings (always from Sanity data) */}
              {(comparison.ratingBadges ?? []).length > 0 && (
                <section id="expert-ratings" className="space-y-6 pt-4">
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Expert ratings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(comparison.ratingBadges ?? []).map((badge, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-5 dark:border-white/10 dark:bg-white/[0.02]">
                        <div className="flex flex-col">
                          <span className="mb-1 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500">{badge.platform}</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{badge.badgeLabel || "Expert Rating"}</span>
                        </div>
                        <div className="text-2xl font-semibold text-slate-900 dark:text-white">{badge.score?.toFixed(1)}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Migration Testimonial */}
              {comparison.migrationTestimonial?.quoteText && (
                <section id="migration" className="space-y-6 pt-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-white/10 dark:bg-white/[0.02]">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-neutral-500 mb-6">Migration perspective</p>
                    <blockquote className="text-xl font-medium leading-relaxed text-slate-900 dark:text-white mb-6">
                      &ldquo;{comparison.migrationTestimonial.quoteText}&rdquo;
                    </blockquote>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-semibold text-slate-900 dark:text-white">{comparison.migrationTestimonial.authorName}</span>
                      <span className="text-[13px] text-slate-500 dark:text-neutral-500">
                        {comparison.migrationTestimonial.authorRole}
                      </span>
                    </div>
                  </div>
                </section>
              )}

              {/* FAQ */}
              {(comparison.faqs ?? []).length > 0 && (
                <section id="faqs" className="pt-4">
                  <FAQSection
                    title=""
                    subtitle="Questions teams ask"
                    description=""
                    faqsLeft={faqsLeft}
                    faqsRight={faqsRight}
                    className="px-0 py-0"
                  />
                </section>
              )}
            </div>
          </div>



          {/* "Was this helpful?" Footer (Inside the box) */}
          <div className="relative border-t border-slate-200 dark:border-white/10 flex items-center justify-center py-8">
            <Crosshair className="-top-[8px] -left-[8px]" />
            <Crosshair className="-top-[8px] -right-[8px]" />
            
            <FeedbackWidget pageTitle={`Classgrid vs ${comparison.competitorName}`} pageType="compare" />
          </div>

          {/* Legal Disclaimer */}
          <div className="px-6 md:px-12 pb-12 pt-8 text-center">
            <p className="text-[11px] text-slate-400 dark:text-neutral-500 max-w-3xl mx-auto leading-relaxed">
              {comparison.slug === "legacy-platforms" 
                ? `This comparison uses “${comparison.competitorName}” as a category label for similar institutional ERP, LMS, and campus-management products. It does not refer to any single vendor, and Classgrid is not affiliated with any third-party platform represented by this category.`
                : `${comparison.competitorName} is a trademark of its respective owners. Classgrid is not affiliated with them.`}
            </p>
          </div>

          {/* Bottom Border Closing Crosshairs */}
          <div className="absolute bottom-0 left-0 w-full border-t border-slate-200 dark:border-white/10" />
          <Crosshair className="-bottom-[8px] -left-[8px]" />
          <Crosshair className="-bottom-[8px] -right-[8px]" />

        </div>
      </div>
      {/* ── MOBILE STICKY TOC BUTTON — visible below xl only ── */}
      <div className="xl:hidden">
        {/* Backdrop */}
        {mobileTocOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileTocOpen(false)}
          />
        )}

        {/* Slide-up TOC panel — only mounted when open to avoid GPU layer conflicts */}
        {mobileTocOpen && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-white/10 rounded-t-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span className="text-[13px] font-semibold text-white tracking-wide">On this page</span>
              <button
                onClick={() => setMobileTocOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Close table of contents"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
              {tocItems.map((item) => (
                <a
                  key={`mobile-toc-${item.id}`}
                  href={`#${item.id}`}
                  onClick={() => setMobileTocOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-[14px] transition-colors",
                    activeSection === item.id
                      ? "bg-emerald-500/15 text-emerald-400 font-medium"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="pb-6" />
          </div>
        )}

        {/* Floating pill trigger button */}
        <button
          onClick={() => setMobileTocOpen((v) => !v)}
          className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full bg-[#111] border border-white/15 px-4 py-2.5 text-[13px] font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all hover:border-emerald-500/40 hover:bg-[#1a1a1a] active:scale-95"
          aria-label="Open table of contents"
        >
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
          </svg>
          On this page
        </button>
      </div>

    </main>
  );
}
