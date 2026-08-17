"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Bug, Rocket, WandSparkles, Megaphone } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

import { SubscribeStrip } from "@/components/shared/SubscribeStrip";
import { Badge } from "@/components/ui/badge";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildLangHref, type SupportedLang } from "@/lib/locale";

const MotionDiv = motion.div as any;

type ChangelogEntry = {
  title: string;
  slug: string;
  releaseDate: string;
  updateType: string;
  versionLabel?: string;
  modules: string[];
  summary: string;
  imageUrl?: string | null;
};

type ChangelogPageClientProps = {
  settings: {
    heroHeadline: string;
    heroSubheadline: string;
  };
  entries: ChangelogEntry[];
  siteUrl: string;
  lang: SupportedLang;
};

const UPDATE_TYPE_META: Record<string, { label: string; icon: any; color: string }> = {
  all:         { label: "All",         icon: Bell,          color: "border-border bg-card text-muted-foreground" },
  feature:     { label: "New Feature", icon: Rocket,        color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" },
  improvement: { label: "Improvement", icon: WandSparkles,  color: "border-sky-500/40 bg-sky-500/10 text-sky-400" },
  bugfix:      { label: "Bug Fix",     icon: Bug,           color: "border-orange-500/40 bg-orange-500/10 text-orange-400" },
  announcement:{ label: "Announcement",icon: Megaphone,     color: "border-purple-500/40 bg-purple-500/10 text-purple-400" },
};

type UpdateType = keyof typeof UPDATE_TYPE_META;

function prettyModule(m: string) {
  return m.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const PAGE_SIZE = 15;

export function ChangelogPageClient({ settings, entries, lang }: ChangelogPageClientProps) {
  // ── Filter state ──────────────────────────────────────────────────
  const [activeType, setActiveType] = useState<UpdateType>("all");
  const [activeModule, setActiveModule] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [monthFilter, setMonthFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Derive module list from entries
  const moduleOptions = useMemo(() => {
    const set = new Set(entries.flatMap((e) => e.modules).filter(Boolean));
    return [{ id: "all", label: "All Modules" }, ...Array.from(set).map((m) => ({ id: m, label: prettyModule(m) }))];
  }, [entries]);

  // ── Filtering & sorting ───────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = entries.filter((e) => {
      const typeMatch   = activeType   === "all" || e.updateType === activeType;
      const moduleMatch = activeModule === "all" || e.modules.includes(activeModule);
      let monthMatch = true;
      if (monthFilter !== "all" && e.releaseDate) {
        const entryMonth = new Date(e.releaseDate).getMonth();
        monthMatch = entryMonth === MONTH_MAP[monthFilter];
      }
      return typeMatch && moduleMatch && monthMatch;
    });
    result = [...result].sort((a, b) => {
      const ta = new Date(a.releaseDate).getTime();
      const tb = new Date(b.releaseDate).getTime();
      if (sortOrder === "oldest") return ta - tb;
      return tb - ta;
    });
    return result;
  }, [entries, activeType, activeModule, sortOrder, monthFilter]);

  // ── Pagination ────────────────────────────────────────────────────
  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const activePage  = Math.min(currentPage, totalPages);
  // For "Show more" style, we slice from 0 to (activePage * PAGE_SIZE)
  const visible     = filtered.slice(0, activePage * PAGE_SIZE);

  type PageToken = number | "ellipsis-left" | "ellipsis-right";
  const pageTokens: PageToken[] = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const tokens: PageToken[] = [1];
    const ws = Math.max(2, activePage - 1);
    const we = Math.min(totalPages - 1, activePage + 1);
    if (ws > 2) tokens.push("ellipsis-left");
    for (let p = ws; p <= we; p++) tokens.push(p);
    if (we < totalPages - 1) tokens.push("ellipsis-right");
    tokens.push(totalPages);
    return tokens;
  })();

  function resetFilters() {
    setActiveType("all");
    setActiveModule("all");
    setSortOrder("latest");
    setMonthFilter("all");
    setCurrentPage(1);
  }

  // ── Render ────────────────────────────────────────────────────────
  return (
    <main className="bg-background text-foreground pb-10">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* ── HERO — identical structure to Blog hero ── */}
        <section className="mt-0 flex flex-col items-center space-y-4 pb-10 pt-16 text-center">
          <SectionAccentBar align="center" />
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
            {(settings.heroHeadline || "").replace(/\.\s*$/, "")}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {settings.heroSubheadline}
          </p>
        </section>

        {/* ── FILTER BAR — Clean Vercel-style horizontal tabs ── */}
        <section className="mb-10 flex items-center justify-between border-b border-border pb-0">
          <div className="scrollbar-hide flex items-center gap-1 overflow-x-auto pb-2 md:pb-3">
            {(Object.entries(UPDATE_TYPE_META) as [UpdateType, typeof UPDATE_TYPE_META[UpdateType]][]).map(([id, meta]) => {
              const isActive = activeType === id;
              return (
                <button
                  key={id}
                  onClick={() => { setActiveType(id); setCurrentPage(1); }}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[14px] font-medium transition-colors ${
                    isActive
                      ? "bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white"
                      : "text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white"
                  }`}
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── TIMELINE ENTRIES — OpenAI changelog style ── */}
        {filtered.length === 0 ? (
          <section className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
              <Bell className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-2xl font-bold text-foreground">No updates found</h3>
            <p className="text-muted-foreground">Try changing your filters to see more results.</p>
            <Button
              variant="outline"
              className="mt-6 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
              onClick={resetFilters}
            >
              Clear Filters
            </Button>
          </section>
        ) : (
          <div className="relative mt-4 pb-12">
            {/* Vertical timeline line */}
            <div className="absolute left-[7.5rem] top-0 hidden h-full w-px bg-border md:block" />

            <div className="space-y-0">
              {visible.map((entry, idx) => {
                const meta = UPDATE_TYPE_META[entry.updateType] ?? UPDATE_TYPE_META.improvement;
                const Icon = meta.icon;
                const href = buildLangHref(`/changelog/${entry.slug}`, lang);

                return (
                  <MotionDiv
                    key={entry.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.05, ease: "easeOut" }}
                    className="group relative flex gap-0 md:gap-8"
                  >
                    {/* LEFT — date column */}
                    <div className="hidden w-28 shrink-0 pt-6 text-right md:block">
                      <time
                        dateTime={entry.releaseDate}
                        className="text-[14px] font-medium text-slate-500 dark:text-neutral-400"
                      >
                        {format(new Date(entry.releaseDate), "d MMMM")}
                      </time>
                    </div>

                    {/* Timeline gap */}
                    <div className="relative hidden w-8 md:block">
                      {/* Timeline dot aligned to the absolute vertical line (left-[7.5rem]) */}
                      <div className="absolute top-7 -ml-[5px] h-2.5 w-2.5 rounded-full border-2 border-emerald-500 bg-background transition-all group-hover:bg-emerald-500 group-hover:scale-125" />
                    </div>

                    {/* RIGHT — content */}
                    <div className="flex-1 border-b border-slate-200 dark:border-white/10 pb-10 pt-2 mb-10 transition-colors group-hover:border-transparent">
                      <Link href={href} className="block p-0 transition-colors duration-300 md:-ml-6 md:p-6 md:rounded-2xl hover:bg-slate-100 dark:hover:bg-white/[0.05]">
                        {/* Mobile date */}
                        <time className="mb-3 block text-sm font-medium text-slate-500 dark:text-neutral-400 md:hidden">
                          {format(new Date(entry.releaseDate), "d MMMM yyyy")}
                        </time>

                        {/* Title */}
                        <h3 className="text-2xl font-semibold tracking-tight leading-snug text-slate-900 dark:text-white transition-colors hover:text-slate-600 dark:hover:text-neutral-300">
                          {(entry.title || "").replace(/\.\s*$/, "")}
                        </h3>

                        {/* Summary */}
                        <p className="mt-3 text-[16px] leading-relaxed text-[#171717] dark:text-[#a1a1aa]">
                          {entry.summary}
                        </p>
                      </Link>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>
          </div>
        )}

        {/* ── SHOW MORE BUTTON ── */}
        {activePage < totalPages && (
          <div className="flex justify-center pb-16 pt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(activePage + 1)}
              className="rounded-full px-8 py-5 text-sm font-medium border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
            >
              Show more
            </Button>
          </div>
        )}
      </div>

      <SubscribeStrip
        type="changelog"
        heading="Never miss a product update"
        subtext="Get the latest Classgrid feature releases, improvements and bug fixes delivered to your inbox. No spam. Unsubscribe anytime."
      />
    </main>
  );
}
