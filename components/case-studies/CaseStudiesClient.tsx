"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

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
import { cn } from "@/lib/utils";

const CATEGORY_META: Record<string, { label: string; badgeColor: string }> = {
  // Colors taken directly from globals.css design system
  "fee-recovery": { label: "Fee Recovery",  badgeColor: "bg-[#34d399] text-[#022c22]" },   // --primary green
  compliance:     { label: "Compliance",     badgeColor: "bg-[#4a90f5] text-white" },        // --ring / plyr blue
  automation:     { label: "Automation",     badgeColor: "bg-[#f43f5e] text-white" },        // --destructive pink
  attendance:     { label: "Attendance",     badgeColor: "bg-[#a855f7] text-white" },        // chart-4 purple
  results:        { label: "Results",        badgeColor: "bg-[#ff0080] text-white" },        // grid neon pink
  all:            { label: "All",            badgeColor: "bg-zinc-600 text-white" },
};

function prettyLabel(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type Metric = {
  _key: string;
  value: string;
  suffix?: string;
  label: string;
};

export type CaseStudy = {
  _id: string;
  title: string;
  slug: string;
  clientName: string;
  clientLogoUrl?: string;
  year: string;
  institutionType?: string;
  category?: string;
  modules?: string[];
  summary: string;
  heroImageUrl?: string;
  metrics: Metric[];
};

type CaseStudiesClientProps = {
  caseStudies: CaseStudy[];
  heroSubtitle?: string | null;
};

const PAGE_SIZE = 6;


const MOCK_CASE_STUDIES: CaseStudy[] = [
  {
    _id: "mock-1",
    title: "₹12L recovered in one semester with zero manual follow-ups",
    slug: "pccoe-fee-recovery",
    clientName: "PCCOE, Pune",
    year: "2024",
    institutionType: "engineering",
    category: "fee-recovery",
    modules: ["finance", "reports", "attendance"],
    summary: "How one of Pune's leading engineering colleges automated their fee collection and eliminated the need for manual debt chasing.",
    heroImageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80",
    metrics: [
      { _key: "m1", value: "12", suffix: "L", label: "Recovered" },
      { _key: "m2", value: "100", suffix: "%", label: "On-Time" },
      { _key: "m3", value: "45", suffix: " Days", label: "Deployed" },
    ],
  },
];

export function CaseStudiesClient({ caseStudies: initialCaseStudies, heroSubtitle }: CaseStudiesClientProps) {
  const [mounted, setMounted] = useState(false);
  const caseStudies = initialCaseStudies.length > 0 ? initialCaseStudies : MOCK_CASE_STUDIES;
  
  const [yearFilter,        setYearFilter]        = useState("all");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [categoryFilter,    setCategoryFilter]    = useState("all");
  const [moduleFilter,      setModuleFilter]      = useState("all");
  const [currentPage,       setCurrentPage]       = useState(1);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Derive options from actual data
  const yearOptions = useMemo(() => {
    if (!mounted) return [];
    const set = new Set(caseStudies.map((c) => c.year).filter(Boolean));
    return [{ id: "all", label: "All Years" }, ...Array.from(set).sort((a, b) => b.localeCompare(a)).map((y) => ({ id: y, label: y }))];
  }, [caseStudies, mounted]);

  const institutionOptions = useMemo(() => {
    if (!mounted) return [];
    const set = new Set(caseStudies.map((c) => c.institutionType).filter(Boolean) as string[]);
    return [{ id: "all", label: "All Types" }, ...Array.from(set).map((v) => ({ id: v, label: prettyLabel(v) }))];
  }, [caseStudies, mounted]);

  const categoryOptions = useMemo(() => {
    if (!mounted) return [];
    const set = new Set(caseStudies.map((c) => c.category).filter(Boolean) as string[]);
    return [{ id: "all", label: "All Categories" }, ...Array.from(set).map((v) => ({ id: v, label: prettyLabel(v) }))];
  }, [caseStudies, mounted]);

  const moduleOptions = useMemo(() => {
    if (!mounted) return [];
    const set = new Set(caseStudies.flatMap((c) => c.modules ?? []).filter(Boolean));
    return [{ id: "all", label: "All Modules" }, ...Array.from(set).map((v) => ({ id: v, label: prettyLabel(v) }))];
  }, [caseStudies, mounted]);

  // Filter logic
  const filtered = useMemo(() => {
    return caseStudies.filter((c) => {
      if (yearFilter        !== "all" && c.year            !== yearFilter)        return false;
      if (institutionFilter !== "all" && c.institutionType !== institutionFilter) return false;
      if (categoryFilter    !== "all" && c.category        !== categoryFilter)    return false;
      if (moduleFilter      !== "all" && !c.modules?.includes(moduleFilter))      return false;
      return true;
    });
  }, [caseStudies, yearFilter, institutionFilter, categoryFilter, moduleFilter]);

  // ── Pagination ────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart  = (activePage - 1) * PAGE_SIZE;
  const visible    = filtered.slice(pageStart, pageStart + PAGE_SIZE);

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

  return (
    <main className="bg-background text-foreground pb-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ── HERO ── */}
        <section className="pt-16 pb-12 text-center flex flex-col items-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500 mb-4">
            Case Study
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] max-w-3xl mb-6">
            Classgrid <em className="not-italic text-emerald-400">Impact</em>
          </h1>
          {heroSubtitle && (
            <p className="max-w-lg text-base text-muted-foreground leading-relaxed">
              {heroSubtitle}
            </p>
          )}
        </section>


        {/* ── FILTER BAR — 4 dropdowns, all from Sanity data ── */}
        <section className="flex flex-nowrap sm:flex-wrap items-center gap-3 py-8 border-b border-border mb-12 overflow-x-auto scrollbar-hide">
          <Select value={yearFilter} onValueChange={(v) => { setYearFilter(v); setCurrentPage(1); }}>
            <SelectTrigger aria-label="Year" className="h-11 w-[130px] rounded-xl border border-border bg-card shadow-sm">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card">
              {yearOptions.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={institutionFilter} onValueChange={(v) => { setInstitutionFilter(v); setCurrentPage(1); }}>
            <SelectTrigger aria-label="Institution Type" className="h-11 w-[160px] rounded-xl border border-border bg-card shadow-sm">
              <SelectValue placeholder="Institution Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card">
              {institutionOptions.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
            <SelectTrigger aria-label="Case Study Type" className="h-11 w-[170px] rounded-xl border border-border bg-card shadow-sm">
              <SelectValue placeholder="Case Study Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card">
              {categoryOptions.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={moduleFilter} onValueChange={(v) => { setModuleFilter(v); setCurrentPage(1); }}>
            <SelectTrigger aria-label="Module" className="h-11 w-[150px] rounded-xl border border-border bg-card shadow-sm">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card">
              {moduleOptions.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </section>


        {/* ── CARD GRID ── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <Bell className="h-9 w-9 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No case studies yet</h3>
            <p className="text-muted-foreground max-w-sm">Case studies will appear here once published in Sanity Studio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-[auto]">
            {visible.map((study, idx) => {
              const catMeta = CATEGORY_META[study.category ?? ""] || { label: prettyLabel(study.category || ""), badgeColor: "bg-zinc-500 text-white" };



              return (
                <motion.div
                  key={study._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  {/* group on Link — CSS group-hover works on first render, no hydration delay */}
                  <Link href={`/case-studies/${study.slug}`} className="block h-full group">
                    <article
                      className="flex flex-col h-full bg-card rounded-sm overflow-hidden cursor-pointer
                                 shadow-[0_0_0_1px_rgba(255,255,255,0.08),_0_2px_8px_rgba(0,0,0,0.3)]
                                 transition-all duration-[350ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                                 group-hover:-translate-y-1.5
                                 group-hover:shadow-[0_0_0_2px_#10b981,_0_16px_48px_rgba(16,185,129,0.18)]"
                    >
                      {/* Image */}
                      <div className="relative h-[220px] w-full bg-muted overflow-hidden shrink-0">
                        {study.heroImageUrl ? (
                          <div className="absolute inset-0">
                            <Image
                              src={study.heroImageUrl}
                              alt={study.clientName}
                              fill
                              className="object-cover object-top
                                         transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]
                                         group-hover:scale-[1.08]"
                              style={{ filter: "brightness(0.82) saturate(0.9)" }}
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-neutral-900 transition-transform duration-[600ms] group-hover:scale-[1.08]" />
                        )}
                        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />
                        {/* Tag Badge */}
                        <div className={cn("absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", catMeta.badgeColor)}>
                          {catMeta.label || prettyLabel(study.category || "")}
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 flex flex-col grow">
                        <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-muted-foreground mb-3">
                          <span>{study.clientName}</span>
                          <span className="w-[3px] h-[3px] rounded-full bg-neutral-600" />
                          <span>{study.year}</span>
                        </div>

                        <h2 className="text-xl font-serif font-normal leading-snug text-foreground mb-3 line-clamp-3">
                          {study.title}
                        </h2>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                          {study.summary}
                        </p>

                        {/* 3-Stat Row */}
                        <div className="mt-auto pt-4 border-t border-border grid grid-cols-3 gap-4">
                          {study.metrics?.slice(0, 3).map((metric, i) => (
                            <div key={metric._key || i} className="flex flex-col gap-0.5">
                              <span className="text-xl font-serif text-emerald-400">
                                {metric.value}<span className="text-emerald-500/70">{metric.suffix}</span>
                              </span>
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {metric.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="px-6 py-4 border-t border-border flex items-center justify-between shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {study.clientName} · {catMeta.label || prettyLabel(study.category || "")}
                        </span>
                        <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                          Read Case Study
                          <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>

                    </article>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {totalPages > 1 && (
          <div className="mt-16">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.max(1, p - 1)); }}
                    aria-disabled={activePage === 1}
                    className={activePage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {pageTokens.map((token, i) => (
                  <PaginationItem key={i}>
                    {token === "ellipsis-left" || token === "ellipsis-right" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(token); }}
                        isActive={token === activePage}
                      >
                        {token}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); setCurrentPage((p) => Math.min(totalPages, p + 1)); }}
                    aria-disabled={activePage === totalPages}
                    className={activePage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

      </div>
    </main>
  );
}
