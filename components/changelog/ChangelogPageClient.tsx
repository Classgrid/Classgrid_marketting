"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell, Bug, Rocket, WandSparkles } from "lucide-react";
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
  updateType: "feature" | "improvement" | "bugfix";
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

const UPDATE_TYPE_META = {
  all:         { label: "All",         icon: Bell,          color: "border-border bg-card text-muted-foreground" },
  feature:     { label: "New Feature", icon: Rocket,        color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" },
  improvement: { label: "Improvement", icon: WandSparkles,  color: "border-sky-500/40 bg-sky-500/10 text-sky-400" },
  bugfix:      { label: "Bug Fix",     icon: Bug,           color: "border-orange-500/40 bg-orange-500/10 text-orange-400" },
} as const;

type UpdateType = keyof typeof UPDATE_TYPE_META;

function prettyModule(m: string) {
  return m.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const MONTH_MAP: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

const PAGE_SIZE = 10;

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
  const pageStart   = (activePage - 1) * PAGE_SIZE;
  const visible     = filtered.slice(pageStart, pageStart + PAGE_SIZE);

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
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* ── HERO — identical structure to Blog hero ── */}
        <section className="mt-0 flex flex-col items-center space-y-4 pb-10 pt-16 text-center">
          <Badge
            variant="outline"
            className="border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm tracking-wide text-emerald-500"
          >
            Public Release Log
          </Badge>

          <SectionAccentBar />

          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
            {(settings.heroHeadline || "").replace(/\.\s*$/, "")}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {settings.heroSubheadline}
          </p>
        </section>

        {/* ── FILTER BAR — mirrors Blog layout exactly ──
              LEFT  : [Sort ▼] [Month ▼] [Module ▼]  (Blog has [Latest ▼] [Month ▼], changelog adds Module too)
              RIGHT : [All] [New Feature] [Improvement] [Bug Fix]  (like Blog's category pills)
        */}
        <section className="flex flex-col items-start justify-between gap-3 py-4 md:flex-row md:items-center">

          {/* LEFT — three Select dropdowns (Sort + Month + Module) */}
          <div className="flex flex-nowrap items-center gap-3 overflow-x-auto scrollbar-hide pb-1 w-full md:w-auto">
            {/* Sort order — same as Blog */}
            <div className="relative">
              <Select
                value={sortOrder}
                onValueChange={(v) => { setSortOrder(v); setCurrentPage(1); }}
              >
                <SelectTrigger
                  aria-label="Sort Order"
                  className="h-11 w-[130px] rounded-xl border border-border bg-card text-card-foreground shadow-sm"
                >
                  <SelectValue placeholder="Sort: Latest" />
                </SelectTrigger>
                <SelectContent side="bottom" position="popper" className="rounded-xl border-border bg-card text-card-foreground">
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
              <select
                value={sortOrder}
                onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute inset-0 w-full h-full opacity-0 sm:hidden z-10 appearance-none"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            {/* Month filter — same as Blog */}
            <div className="relative">
              <Select
                value={monthFilter}
                onValueChange={(v) => { setMonthFilter(v); setCurrentPage(1); }}
              >
                <SelectTrigger
                  aria-label="Month Filter"
                  className="h-11 w-[150px] rounded-xl border border-border bg-card text-card-foreground shadow-sm"
                >
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent side="bottom" position="popper" className="rounded-xl border-border bg-card text-card-foreground">
                  <SelectItem value="all">All Months</SelectItem>
                  <SelectItem value="jan">January</SelectItem>
                  <SelectItem value="feb">February</SelectItem>
                  <SelectItem value="mar">March</SelectItem>
                  <SelectItem value="apr">April</SelectItem>
                  <SelectItem value="may">May</SelectItem>
                  <SelectItem value="jun">June</SelectItem>
                  <SelectItem value="jul">July</SelectItem>
                  <SelectItem value="aug">August</SelectItem>
                  <SelectItem value="sep">September</SelectItem>
                  <SelectItem value="oct">October</SelectItem>
                  <SelectItem value="nov">November</SelectItem>
                  <SelectItem value="dec">December</SelectItem>
                </SelectContent>
              </Select>
              <select
                value={monthFilter}
                onChange={(e) => { setMonthFilter(e.target.value); setCurrentPage(1); }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute inset-0 w-full h-full opacity-0 sm:hidden z-10 appearance-none"
              >
                <option value="all">All Months</option>
                <option value="jan">January</option>
                <option value="feb">February</option>
                <option value="mar">March</option>
                <option value="apr">April</option>
                <option value="may">May</option>
                <option value="jun">June</option>
                <option value="jul">July</option>
                <option value="aug">August</option>
                <option value="sep">September</option>
                <option value="oct">October</option>
                <option value="nov">November</option>
                <option value="dec">December</option>
              </select>
            </div>

            {/* Module filter — changelog-specific */}
            <div className="relative">
              <Select
                value={activeModule}
                onValueChange={(v) => { setActiveModule(v); setCurrentPage(1); }}
              >
                <SelectTrigger
                  aria-label="Module Filter"
                  className="h-11 w-[160px] rounded-xl border border-border bg-card text-card-foreground shadow-sm"
                >
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent side="bottom" position="popper" className="rounded-xl border-border bg-card text-card-foreground">
                  {moduleOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <select
                value={activeModule}
                onChange={(e) => { setActiveModule(e.target.value); setCurrentPage(1); }}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="absolute inset-0 w-full h-full opacity-0 sm:hidden z-10 appearance-none"
              >
                {moduleOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT — Update Type pills (like Blog's category pills) */}
          <div className="scrollbar-hide flex w-full gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
            {(Object.entries(UPDATE_TYPE_META) as [UpdateType, typeof UPDATE_TYPE_META[UpdateType]][]).map(([id, meta]) => {
              const Icon = meta.icon;
              const isActive = activeType === id;
              return (
                <Button
                  key={id}
                  variant="outline"
                  onClick={() => { setActiveType(id); setCurrentPage(1); }}
                  className={`rounded-full border px-4 py-2 font-medium shadow-none transition flex items-center gap-1.5 ${
                    isActive
                      ? "border-emerald-500 bg-emerald-500 text-black hover:bg-emerald-500 hover:text-black"
                      : "border-border bg-card text-muted-foreground hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {meta.label}
                </Button>
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
                    <div className="hidden w-28 shrink-0 pt-5 text-right md:block">
                      <time
                        dateTime={entry.releaseDate}
                        className="text-xs font-medium text-muted-foreground"
                      >
                        {format(new Date(entry.releaseDate), "MMM d")}
                      </time>
                    </div>

                    {/* Timeline dot */}
                    <div className="relative hidden md:flex flex-col items-center">
                      <div className="mt-[1.35rem] h-2.5 w-2.5 rounded-full border-2 border-emerald-500 bg-background transition-all group-hover:bg-emerald-500 group-hover:scale-125" />
                    </div>

                    {/* RIGHT — content */}
                    <div className="flex-1 border-b border-border py-5 pl-0 md:pl-6">
                      {/* Mobile date */}
                      <time className="mb-2 block text-xs text-muted-foreground md:hidden">
                        {format(new Date(entry.releaseDate), "MMM d, yyyy")}
                      </time>

                      {/* Badges row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Type badge */}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${meta.color}`}
                        >
                          <Icon className="h-3 w-3" />
                          {meta.label}
                        </span>

                        {/* Version */}
                        {entry.versionLabel && (
                          <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
                            {entry.versionLabel}
                          </span>
                        )}

                        {/* Module chips */}
                        {entry.modules.map((m) => (
                          <span
                            key={m}
                            className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground"
                          >
                            {prettyModule(m)}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <Link href={href}>
                        <h3 className="mt-3 text-base font-semibold leading-snug text-foreground transition-colors hover:text-emerald-500">
                          {(entry.title || "").replace(/\.\s*$/, "")}
                        </h3>
                      </Link>

                      {/* Summary */}
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground line-clamp-2">
                        {entry.summary}
                      </p>

                      {/* Read more */}
                      <Link
                        href={href}
                        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs font-medium text-emerald-500 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/10"
                      >
                        Read full update &rarr;
                      </Link>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <Pagination className="pb-16 pt-4">
            <PaginationContent className="gap-1 rounded-xl border border-border bg-card/90 p-1 shadow-sm">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (activePage > 1) setCurrentPage(activePage - 1); }}
                  aria-disabled={activePage <= 1}
                  className={`rounded-lg text-muted-foreground transition hover:bg-accent ${activePage <= 1 ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
              {pageTokens.map((token, i) => (
                <PaginationItem key={`${token}-${i}`}>
                  {typeof token === "number" ? (
                    <PaginationLink
                      href="#"
                      isActive={token === activePage}
                      onClick={(e) => { e.preventDefault(); setCurrentPage(token); }}
                      className={`h-10 min-w-10 rounded-lg ${
                        token === activePage
                          ? "border-emerald-500 bg-emerald-500 text-black hover:bg-emerald-500"
                          : "text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {token}
                    </PaginationLink>
                  ) : (
                    <PaginationEllipsis className="text-muted-foreground" />
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => { e.preventDefault(); if (activePage < totalPages) setCurrentPage(activePage + 1); }}
                  aria-disabled={activePage >= totalPages}
                  className={`rounded-lg text-muted-foreground transition hover:bg-accent ${activePage >= totalPages ? "pointer-events-none opacity-50" : ""}`}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <SubscribeStrip />
    </main>
  );
}
