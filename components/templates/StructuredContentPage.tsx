"use client";

import DOMPurify from "isomorphic-dompurify";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { extractLocaleString } from "@/lib/locale";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
  Building2,
  GraduationCap,
  School,
  Target,
  BookOpen,
  Cpu,
  Users,
  Presentation,
  ShieldCheck,
  Menu,
  X,
  FileText,
  PanelLeft,
} from "lucide-react";
import { PortableTextBlock } from "@/components/PortableTextBlock";
import { VercelTable } from "@/components/ui/vercel-table";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import { cn } from "@/lib/utils";
import { DocumentHero } from "@/components/ui/DocumentHero";
import { PageMetadataBox } from "@/components/ui/PageMetadataBox";
import { FeedbackWidget } from "@/components/shared/FeedbackWidget";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────


type Capability = {
  feature?: string;
  description?: string;
  icon?: string;
};

type RoleExperience = {
  roleName?: string;
  description?: string;
};

type FaqItem = {
  question?: string;
  answer?: string;
};

type TrustBadge = {
  label: string;
  value: string;
};

type ClientLogo = {
  name: string;
  imageUrl?: string;
};

type ImpactMetric = {
  value: string;
  label: string;
  suffix?: string;
};

type Testimonial = {
  quote: string;
  author: string;
  role?: string;
};

type ProblemSolutionItem = {
  problem: string;
  solution: string;
};

type ModuleNavItem = {
  title: string;
  slug: string;
  category?: string;
};

type StructuredContentPageProps = {
  mode: "module" | "solution";
  eyebrow?: string;
  title: string;
  subtitle?: string;
  heroImageUrl?: string | null;
  heroImageAlt?: string;
  body?: any;
  markdownBody?: string;
  markdownSections?: Array<{ heading: string; content: string }>;
  structuredSections?: Array<{
    heading: string;
    content: any;
    sectionImageUrl?: string;
    sectionImageAlt?: string;
    imageCaption?: string;
    suggestedImageNote?: string;
  }>;
  capabilities?: Array<{ feature: string; description: string; icon?: string }>;
  roleExperiences?: RoleExperience[];
  faqs?: FaqItem[];
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  trustBadges?: TrustBadge[];
  clientLogos?: ClientLogo[];
  impactMetrics?: ImpactMetric[];
  testimonials?: Testimonial[];
  problemSolution?: ProblemSolutionItem[];
  marketing?: unknown;
  updatedAt?: string;
  // Module-specific
  allModules?: ModuleNavItem[];
  currentSlug?: string;
  isEmptyState?: boolean;
  relatedHelpArticles?: Array<{ articleTitle?: string; articleSlug?: string; articleSummary?: string }>;
  relatedChangelogs?: Array<{ changeTitle?: string; changeDate?: string; changeSummary?: string; changeType?: string }>;
};

// ─────────────────────────────────────────────
// Left sidebar navigation data
// ─────────────────────────────────────────────
const LEFT_NAV = [
  {
    section: "By Industry",
    items: [
      { label: "School", href: "/solutions/for-schools", icon: School },
      { label: "College", href: "/solutions/for-colleges", icon: GraduationCap },
      { label: "Junior College", href: "/solutions/for-jr-colleges", icon: BookOpen },
      { label: "Coaching", href: "/solutions/for-coaching", icon: Target },
      { label: "Engineering", href: "/solutions/for-engineering", icon: Cpu },
    ],
  },
  {
    section: "By Role",
    items: [
      { label: "For Students", href: "/solutions/for-students", icon: Users },
      { label: "For Teachers", href: "/solutions/for-teachers", icon: Presentation },
      { label: "For Admins", href: "/solutions/for-admins", icon: ShieldCheck },
    ],
  },
];

// ─────────────────────────────────────────────
// Hook: scroll-spy active section
// ─────────────────────────────────────────────
function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return;
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids]);

  return active;
}

// ─────────────────────────────────────────────
// FAQ accordion item
// ─────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-emerald-500 transition-colors"
      >
        <span>{question}</span>
        <span
          className={cn(
            "ml-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
        >
          ▾
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm leading-relaxed text-muted-foreground">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
function StructuredContentPageInner({
  mode,
  eyebrow,
  title,
  subtitle,
  heroImageUrl,
  heroImageAlt,
  body,
  markdownBody,
  markdownSections = [],
  capabilities = [],
  roleExperiences = [],
  faqs = [],
  primaryCtaLabel = "Book a Demo",
  primaryCtaHref = "/#demo",
  secondaryCtaLabel,
  secondaryCtaHref,
  impactMetrics = [],
  testimonials = [],
  problemSolution = [],
  updatedAt,
  allModules = [],
  currentSlug,
  isEmptyState = false,
  structuredSections = [],
  relatedHelpArticles = [],
  relatedChangelogs = [],
}: StructuredContentPageProps) {
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const filteredModules = useMemo(() => {
    if (!sidebarSearch.trim()) return allModules;
    const q = sidebarSearch.toLowerCase();
    return allModules.filter((m) => m.title.toLowerCase().includes(q));
  }, [allModules, sidebarSearch]);

  // Group sidebar modules by category
  const groupedModules = useMemo(() => {
    const g: Record<string, ModuleNavItem[]> = {};
    for (const m of filteredModules) {
      const cat = m.category || "Module";
      if (!g[cat]) g[cat] = [];
      g[cat].push(m);
    }
    return g;
  }, [filteredModules]);
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as "en" | "hi" | "mr") || "en";

  // Build TOC sections
  const sections = (() => {
    // 0. If we have structuredSections (rich text, for modules)
    if (structuredSections && structuredSections.length > 0) {
      return structuredSections
        .filter((s) => s.heading)
        .map((s) => ({
          id: s.heading.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
          label: s.heading,
        }));
    }

    // 1. If we have the new markdownSections array, use it directly
    if (markdownSections && markdownSections.length > 0) {
      const extracted: Array<{ id: string; label: string }> = [];
      for (const section of markdownSections) {
        if (!section.heading) continue;
        const id = section.heading
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        extracted.push({ id, label: section.heading });
      }
      return extracted;
    }

    // 2. Otherwise try to extract from a raw markdownBody string
    if (markdownBody) {
      const h2Regex = /^##\s+(.*)$/gm;
      const extracted: Array<{ id: string; label: string }> = [];
      let match;
      while ((match = h2Regex.exec(markdownBody)) !== null) {
        let label = match[1].trim();
        label = label.replace(/\*\*(.*?)\*\*/g, '$1').replace(/\*(.*?)\*/g, '$1');

        // Generate a slug exactly like rehype-slug does (github-slugger algorithm)
        const id = label
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

        if (id === "metadata" || id === "on-this-page") continue;
        extracted.push({ id, label });
      }
      return extracted;
    }
    // 3. Fallback: use marketing template sections
    return [
      (body || markdownBody) ? { id: "overview", label: "Overview" } : null,
      impactMetrics.length ? { id: "impact", label: "Impact Metrics" } : null,
      capabilities.length ? { id: "capabilities", label: "Capabilities" } : null,
      problemSolution.length ? { id: "problem-solution", label: "Problem & Solution" } : null,
      roleExperiences.length ? { id: "role-experience", label: "Role Experience" } : null,
      testimonials.length ? { id: "testimonials", label: "Testimonials" } : null,
      faqs.length ? { id: "faq", label: "FAQ" } : null,
    ].filter(Boolean) as Array<{ id: string; label: string }>;
  })();

  const sectionIds = sections.map((s) => s.id);
  const activeSection = useScrollSpy(sectionIds);

  // Build capabilities table rows
  const capabilityRows = capabilities.map((cap) => ({
    feature: extractLocaleString(cap.feature, lang),
    description: extractLocaleString(cap.description, lang),
  }));

  // Build role table rows
  const roleRows = roleExperiences.map((r) => ({
    role: extractLocaleString(r.roleName, lang),
    experience: extractLocaleString(r.description, lang),
  }));

  // Breadcrumb label
  const modeLabel = mode === "module" ? "Modules" : "Solutions";

  return (
    <div className="flex w-full flex-col bg-background text-foreground antialiased">

      {/* ── Mobile Nav Bar (only visible below lg) ── */}
      <div className="sticky top-16 z-40 flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        {/* Left: Menu button */}
        <button
          type="button"
          onClick={() => { setMobileMenuOpen(true); setMobileTocOpen(false); }}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/80 hover:bg-white/[0.06] hover:text-white transition-colors"
        >
          <PanelLeft className="h-5 w-5" />
        </button>

        {/* Right: On this page button */}
        {sections.length > 0 && (
          <button
            type="button"
            onClick={() => { setMobileTocOpen((o) => !o); setMobileMenuOpen(false); }}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-foreground/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            aria-label="On this page"
          >
            <FileText className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Mobile TOC Drawer (On this page) ── */}
      <AnimatePresence>
        {mobileTocOpen && sections.length > 0 && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-toc-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileTocOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              key="mobile-toc-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-50 flex h-full w-[280px] flex-col bg-[#080808] shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
                <span className="text-sm font-semibold text-white">On this page</span>
                <button
                  type="button"
                  onClick={() => setMobileTocOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/70 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
                <ul className="space-y-0.5">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={() => setMobileTocOpen(false)}
                        className={cn(
                          "block rounded-md px-3 py-2.5 text-[13px] leading-snug transition-colors",
                          activeSection === section.id
                            ? "bg-emerald-500/10 font-semibold text-emerald-500"
                            : "text-muted-foreground hover:bg-white/[0.05] hover:text-white"
                        )}
                      >
                        <span className="line-clamp-2">{section.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Left Sidebar Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              key="mobile-menu-drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex h-full w-[280px] flex-col bg-[#080808] shadow-2xl lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
                <span className="text-sm font-semibold text-white">Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/70 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer content */}
              <div className="flex-1 overflow-y-auto px-3 py-4">
                {mode === "module" && allModules.length > 0 ? (
                  // Module mode: list all modules
                  <nav className="space-y-5 text-sm">
                    {Object.entries(groupedModules).map(([cat, mods]) => (
                      <div key={cat}>
                        <p className="mb-2 px-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
                          {cat}
                        </p>
                        <ul className="space-y-0.5">
                          {mods.map((m) => {
                            const isActive = m.slug === currentSlug;
                            return (
                              <li key={m.slug}>
                                <Link
                                  href={`/product/modules/${m.slug}`}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={cn(
                                    "block rounded-md px-2.5 py-2 text-[13px] leading-snug transition-colors",
                                    isActive
                                      ? "bg-emerald-500/10 font-semibold text-emerald-500"
                                      : "text-muted-foreground hover:bg-white/[0.05] hover:text-white"
                                  )}
                                >
                                  {m.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </nav>
                ) : (
                  // Solution mode: show LEFT_NAV groups
                  <nav className="space-y-6 text-sm">
                    {LEFT_NAV.map((group) => (
                      <div key={group.section}>
                        <p className="mb-2 px-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          {group.section}
                        </p>
                        <ul className="space-y-0.5">
                          {group.items.map(({ label, href, icon: Icon }) => (
                            <li key={href}>
                              <Link
                                href={href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="group flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.05] hover:text-white"
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 group-hover:text-emerald-500 transition-colors" />
                                {label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="mx-auto flex w-full max-w-[1400px] items-start">

        {/* ── Left Sidebar (desktop, collapsible) ── */}
        <AnimatePresence initial={false}>
          {desktopSidebarOpen && (
            <motion.aside
              key="desktop-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{
                width: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.25, ease: "easeInOut" },
              }}
              className="sticky top-16 hidden h-[calc(100vh-4rem)] shrink-0 overflow-y-auto overflow-x-hidden border-r border-border/60 lg:block"
              style={{ minWidth: 0 }}
            >
              <div className="w-60 px-4 py-6">
                {mode === "module" && allModules.length > 0 ? (
                  <>
                    {/* Search */}
                    <div className="relative mb-4">
                      <input
                        type="text"
                        value={sidebarSearch}
                        onChange={(e) => setSidebarSearch(e.target.value)}
                        placeholder="Search modules..."
                        className="h-8 w-full rounded-lg border border-border bg-muted/40 pl-3 pr-3 text-[12px] text-foreground placeholder:text-muted-foreground focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                    {/* Module list grouped by category */}
                    <nav className="space-y-5 text-sm">
                      {Object.entries(groupedModules).map(([cat, mods]) => (
                        <div key={cat}>
                          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/70">
                            {cat}
                          </p>
                          <ul className="space-y-0.5">
                            {mods.map((m) => {
                              const isActive = m.slug === currentSlug;
                              return (
                                <li key={m.slug}>
                                  <Link
                                    href={`/product/modules/${m.slug}`}
                                    className={cn(
                                      "block rounded-md px-2.5 py-1.5 text-[12px] leading-snug transition-colors",
                                      isActive
                                        ? "bg-emerald-500/10 font-semibold text-emerald-500"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                    )}
                                  >
                                    {m.title}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </nav>
                  </>
                ) : (
                  <nav className="space-y-7 text-sm">
                    {LEFT_NAV.map((group) => (
                      <div key={group.section}>
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                          {group.section}
                        </p>
                        <ul className="space-y-1">
                          {group.items.map(({ label, href, icon: Icon }) => (
                            <li key={href}>
                              <Link
                                href={href}
                                className="group flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 group-hover:text-emerald-500 transition-colors" />
                                {label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </nav>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Center Content ── */}
        <main
          className="min-w-0 flex-1 px-5 py-10 md:px-10 lg:px-14 xl:px-16 flex justify-center xl:justify-start transition-all duration-300 ease-in-out"
        >
          <div
            className={cn(
              "w-full transition-all duration-300 ease-in-out",
              desktopSidebarOpen ? "max-w-[740px]" : "max-w-[900px] xl:ml-8"
            )}
          >

            {/* Desktop sidebar toggle button — only on lg+ */}
            <motion.button
              type="button"
              onClick={() => setDesktopSidebarOpen((o) => !o)}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.07)" }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.15 }}
              className="mb-8 hidden h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/70 hover:text-white lg:flex"
              aria-label="Toggle sidebar"
            >
              <motion.span
                animate={{ rotate: desktopSidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center"
              >
                <PanelLeft className="h-4 w-4" />
              </motion.span>
            </motion.button>



            {/* Document Hero (Legal Style) */}
            <DocumentHero
              badgeLabel={eyebrow}
              title={title}
              lang={lang}
              subtitles={updatedAt ? [`Last Updated: ${new Date(updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`] : []}
              description={subtitle}
              showAccentBar={false}
            />


            {/* Hero Image */}
            {heroImageUrl && (
              <div className="mb-12 overflow-hidden rounded-xl border border-border aspect-video relative bg-muted/40">
                <Image
                  src={heroImageUrl}
                  alt={heroImageAlt ?? title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <hr className="mb-12 border-border/60" />

            <PageMetadataBox
              updatedAt={updatedAt}
              category={mode === "solution" ? "Solution Strategy" : "Platform Module"}
              availableFor={mode === "module" ? ["School", "College", "Jr College", "Coaching"] : undefined}
            />

            {/* ── Empty State Banner ── */}
            {isEmptyState && (
              <div className="mb-12 rounded-xl border border-dashed border-border bg-muted/30 px-8 py-10 text-center">
                <div className="mb-3 text-3xl">🚧</div>
                <h2 className="mb-2 text-lg font-semibold text-foreground">Content Coming Soon</h2>
                <p className="text-sm text-muted-foreground">
                  Detailed documentation for <span className="font-medium text-foreground">{title}</span> is being
                  prepared by the Classgrid team. Check back soon, or{" "}
                  <Link href="/#demo" className="text-emerald-500 hover:underline">book a demo</Link>{" "}
                  to see it live.
                </p>
              </div>
            )}

            {/* ── Structured Sections (Rich Text + Images, for Modules) ── */}
            {structuredSections && structuredSections.length > 0 && (
              <div className="mb-20">
                {structuredSections.map((section, idx) => {
                  const sectionId = section.heading
                    ? section.heading.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-")
                    : `section-${idx}`;
                  return (
                    <section key={idx} id={sectionId} className="scroll-mt-24 mb-16">
                      {section.heading && (
                        <>
                          <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                            {section.heading}
                          </h2>
                        </>
                      )}
                      {section.content && (
                        <div className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:tracking-tight prose-h2:mb-6 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-emerald-500 hover:prose-a:text-emerald-400 prose-img:rounded-xl prose-img:shadow-md">
                          <PortableTextBlock value={Array.isArray(section.content) ? section.content : []} showAccentBars={false} />
                        </div>
                      )}
                      {/* Section Image */}
                      {section.sectionImageUrl && (
                        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-muted/30">
                          <Image
                            src={section.sectionImageUrl}
                            alt={section.sectionImageAlt || section.heading || ""}
                            width={740}
                            height={420}
                            className="w-full object-cover"
                          />
                          {section.imageCaption && (
                            <p className="px-4 py-2 text-xs text-muted-foreground text-center border-t border-border">
                              {section.imageCaption}
                            </p>
                          )}
                        </div>
                      )}
                      {/* Suggested image placeholder (only if no real image yet) */}
                      {!section.sectionImageUrl && section.suggestedImageNote && (
                        <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/20 px-5 py-4 flex items-start gap-3">
                          <span className="text-lg">📸</span>
                          <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Suggested Image</p>
                            <p className="text-sm text-muted-foreground">{section.suggestedImageNote}</p>
                          </div>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}

            {/* Markdown Body Sections (New Format) */}
            {markdownSections && markdownSections.length > 0 && (
              <div className="mb-20">
                {markdownSections.map((section, idx) => {
                  const sectionId = section.heading
                    ? section.heading
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, "")
                      .replace(/\s+/g, "-")
                    : `section-${idx}`;

                  return (
                    <section key={idx} id={sectionId} className="scroll-mt-24 mb-12">
                      {section.heading && (
                        <>
                          <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                            {section.heading}
                          </h2>
                        </>
                      )}
                      <div className="solution-html-content prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:tracking-tight prose-h2:mb-6 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-emerald-500 hover:prose-a:text-emerald-400 prose-img:rounded-xl">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypeRaw]}>
                          {section.content || ""}
                        </ReactMarkdown>
                      </div>
                    </section>
                  );
                })}
              </div>
            )}

            {/* Markdown Body (Legacy Single String Format) */}
            {!markdownSections?.length && markdownBody && (
              <div className="solution-html-content prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:tracking-tight prose-h2:mb-6 prose-p:text-muted-foreground prose-p:leading-relaxed prose-a:text-emerald-500 hover:prose-a:text-emerald-400 prose-img:rounded-xl mb-20">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug, rehypeRaw]}>
                  {markdownBody}
                </ReactMarkdown>
              </div>
            )}

            {/* Rich Text Body */}
            {!markdownSections?.length && !markdownBody && body && (
              <div className="prose prose-zinc max-w-none dark:prose-invert mb-20 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-emerald-500 hover:prose-a:text-emerald-600 prose-img:rounded-xl">
                <PortableTextBlock value={body && typeof body === 'object' && !Array.isArray(body) ? ((body as any)[lang] || (body as any).en || []) : body} showAccentBars={false} />
              </div>
            )}


            {/* ── Capabilities (VercelTable) ── */}
            {capabilities.length > 0 && (
              <section id="capabilities" className="scroll-mt-24 mb-16">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                  Capabilities
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Core features included in this module for your institution.
                </p>
                <VercelTable
                  columns={[
                    { key: "feature", header: "Feature", accent: true, width: "w-[220px]" },
                    { key: "description", header: "What it does" },
                  ]}
                  rows={capabilityRows}
                  className="border-border/60 bg-card dark:bg-card"
                />
              </section>
            )}

            {/* ── Problem & Solution ── */}
            {problemSolution.length > 0 && (
              <section id="problem-solution" className="scroll-mt-24 mb-16">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                  Problems We Solve
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Common institutional challenges — and how Classgrid addresses each one.
                </p>
                <VercelTable
                  columns={[
                    { key: "problem", header: "Challenge", width: "w-[240px]" },
                    { key: "solution", header: "Classgrid Solution", accent: true },
                  ]}
                  rows={problemSolution.map((p) => ({
                    problem: p.problem,
                    solution: p.solution,
                  }))}
                  className="border-border/60 bg-card dark:bg-card"
                />
              </section>
            )}

            {/* ── Role Experience (VercelTable) ── */}
            {roleExperiences.length > 0 && (
              <section id="role-experience" className="scroll-mt-24 mb-16">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                  Role Experience
                </h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  How each stakeholder benefits from this solution.
                </p>
                <VercelTable
                  columns={[
                    { key: "role", header: "Stakeholder", accent: true, width: "w-[200px]" },
                    { key: "experience", header: "Their experience" },
                  ]}
                  rows={roleRows}
                  className="border-border/60 bg-card dark:bg-card"
                />
              </section>
            )}

            {/* ── Testimonials ── */}
            {testimonials.length > 0 && (
              <section id="testimonials" className="scroll-mt-24 mb-16">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                  What institutions say
                </h2>
                <div className="space-y-4">
                  {testimonials.map((t, i) => (
                    <blockquote
                      key={i}
                      className="rounded-xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground transition-colors hover:border-emerald-500/30"
                    >
                      <p className="mb-4 before:content-['\u201c'] after:content-['\u201d'] text-foreground font-medium">
                        {t.quote}
                      </p>
                      <footer className="text-[12px] font-semibold uppercase tracking-widest text-emerald-500">
                        {t.author}
                        {t.role && <span className="ml-2 font-normal normal-case tracking-normal text-muted-foreground">— {t.role}</span>}
                      </footer>
                    </blockquote>
                  ))}
                </div>
              </section>
            )}

            {/* ── FAQ ── */}
            {faqs.length > 0 && (
              <section id="faq" className="scroll-mt-24 mb-20">
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                  Frequently Asked Questions
                </h2>
                <div className="divide-y divide-border/60 rounded-xl border border-border bg-card overflow-hidden">
                  {faqs.map((faq, i) => {
                    const q = extractLocaleString(faq.question, lang);
                    const a = extractLocaleString(faq.answer, lang);
                    if (!q || !a) return null;
                    return (
                      <div key={i} className="px-6">
                        <FaqItem question={q} answer={a} />
                      </div>
                    );
                  })}
                </div>
              </section>
            )}



            {/* ── Related Help Articles ── */}
            {relatedHelpArticles.length > 0 && (
              <section id="related-help" className="scroll-mt-24 mb-16">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Related Help Articles</h2>
                <p className="mb-6 text-sm text-muted-foreground">Guides and tutorials from the Classgrid Help Center.</p>
                <div className="space-y-3">
                  {relatedHelpArticles.map((article, i) => (
                    <Link
                      key={i}
                      href={article.articleSlug ? `/support/articles/${article.articleSlug}` : "/support"}
                      className="flex items-start gap-3 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-emerald-500/40 hover:bg-accent group"
                    >
                      <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <div>
                        <p className="text-sm font-semibold text-foreground group-hover:text-emerald-500 transition-colors">{article.articleTitle}</p>
                        {article.articleSummary && <p className="text-xs text-muted-foreground mt-0.5">{article.articleSummary}</p>}
                      </div>
                      <ArrowRight className="ml-auto mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* ── Related Changelog ── */}
            {relatedChangelogs.length > 0 && (
              <section id="changelog" className="scroll-mt-24 mb-16">
                <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Recent Updates</h2>
                <p className="mb-6 text-sm text-muted-foreground">Changelog entries related to this module.</p>
                <div className="space-y-3">
                  {relatedChangelogs.map((entry, i) => {
                    const typeConfig: Record<string, { label: string; color: string }> = {
                      feature: { label: '✨ New Feature', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
                      bugfix: { label: '🐛 Bug Fix', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
                      improvement: { label: '⚡ Improvement', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
                      security: { label: '🔒 Security', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
                    };
                    const type = typeConfig[entry.changeType] || { label: 'Update', color: 'bg-muted text-muted-foreground border-border' };
                    return (
                      <div key={i} className="rounded-xl border border-border bg-card px-5 py-4">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${type.color}`}>
                            {type.label}
                          </span>
                          {entry.changeDate && (
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.changeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-foreground">{entry.changeTitle}</p>
                        {entry.changeSummary && <p className="text-xs text-muted-foreground mt-1">{entry.changeSummary}</p>}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Feedback Widget */}
            <div className="border-t border-border/60 pt-8 mt-12">
              <FeedbackWidget pageTitle={title} pageType={mode} />
            </div>

          </div>
        </main>

        {/* ── Right Sidebar: Table of Contents ── */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-l border-border/60 px-5 py-10 lg:block">
          {sections.length > 0 && (
            <>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-500/80">
                On this page
              </p>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={cn(
                        "block rounded-md px-2.5 py-1.5 text-[13px] transition-all duration-200",
                        activeSection === section.id
                          ? "bg-emerald-500/10 font-semibold text-emerald-500"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>

              <hr className="my-6 border-border/60" />
            </>
          )}

          {/* Related links */}
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Related
          </p>
          <ul className="space-y-2 text-[13px]">
            {[
              { label: "Compare Platforms", href: "/compare" },
              mode !== "module" ? { label: "All Modules", href: "/product/modules/smart-attendance" } : null,
              { label: "Pricing", href: "/pricing" },
              { label: "Help Center", href: "/support" },
            ].filter(Boolean).map(({ label, href }: any) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-emerald-500"
                >
                  <ArrowRight className="h-3 w-3 shrink-0" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

      </div>
    </div>
  );
}

export function StructuredContentPage(props: StructuredContentPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <StructuredContentPageInner {...props} />
    </Suspense>
  );
}
