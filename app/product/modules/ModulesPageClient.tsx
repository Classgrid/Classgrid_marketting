"use client";

import Link from "next/link";
import { ArrowRight, Zap, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

type Module = {
  _id: string;
  title?: string;
  headline?: string;
  slug: string | null;
  subtitle?: string;
  category?: string;
  label?: string;
  availableFor?: string[];
  institutionTypes?: string[];
};

const CATEGORY_ACCENT: Record<string, { dot: string; badge: string; border: string }> = {
  Academics:    { dot: "bg-emerald-400", badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", border: "hover:border-emerald-400/40" },
  Assessment:   { dot: "bg-blue-400",    badge: "text-blue-400 bg-blue-400/10 border-blue-400/20",         border: "hover:border-blue-400/40" },
  Management:   { dot: "bg-violet-400",  badge: "text-violet-400 bg-violet-400/10 border-violet-400/20",   border: "hover:border-violet-400/40" },
  Advanced:     { dot: "bg-amber-400",   badge: "text-amber-400 bg-amber-400/10 border-amber-400/20",      border: "hover:border-amber-400/40" },
  Dashboards:   { dot: "bg-rose-400",    badge: "text-rose-400 bg-rose-400/10 border-rose-400/20",         border: "hover:border-rose-400/40" },
};
const DEFAULT_ACCENT = { dot: "bg-emerald-400", badge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", border: "hover:border-emerald-400/40" };

function cleanTitle(t: string) {
  return t
    .replace(/^(THE|AN?)\s+/i, "")
    .replace(/\s+ENGINE$/i, " Engine")
    .replace(/\s+SYSTEM$/i, " System")
    .replace(/\s+MANAGEMENT$/i, " Management")
    .replace(/&/g, "&")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function ModulesPageClient({ modules }: { modules: Module[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = ["All", ...Array.from(new Set(modules.map((m) => m.category || "Advanced")))];
    return cats;
  }, [modules]);

  const filtered = useMemo(() => {
    return modules.filter((m) => {
      const q = search.toLowerCase();
      const displayTitle = m.headline || m.title || "";
      const matchSearch = !q || displayTitle.toLowerCase().includes(q) || (m.subtitle || "").toLowerCase().includes(q);
      const cat = m.category || "Advanced";
      const matchCat = activeCategory === "All" || cat === activeCategory;
      return matchSearch && matchCat;
    });
  }, [modules, search, activeCategory]);

  const grouped = useMemo(() => {
    const g: Record<string, Module[]> = {};
    for (const m of filtered) {
      const cat = m.category || "Advanced";
      if (!g[cat]) g[cat] = [];
      g[cat].push(m);
    }
    return g;
  }, [filtered]);

  const sortedCats = Object.keys(grouped).sort();

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border px-4 pb-20 pt-32">
        {/* Grid bg */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "28px 28px" }} />
        {/* Green glow */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-400 uppercase">
            <Zap className="h-3 w-3" /> Platform Modules
          </div>
          <SectionAccentBar />
          <h1 className="text-5xl font-black tracking-tight text-foreground md:text-7xl">
            {modules.length} Modules.{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              One Platform.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Every workflow your institution needs — GPS attendance, AI viva, fee management, NAAC audits, live lectures — unified in one system.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="#modules-library"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-lg shadow-emerald-500/25 transition hover:opacity-90">
              Browse Modules <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/pricing"
              className="inline-flex h-12 items-center rounded-full border border-border px-7 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEARCH + FILTER BAR ── */}
      <div className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules..."
              className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
            />
          </div>
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const accent = CATEGORY_ACCENT[cat] || DEFAULT_ACCENT;
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    isActive
                      ? `${accent.badge} ${accent.border} border`
                      : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MODULE GRID ── */}
      <section id="modules-library" className="mx-auto max-w-7xl px-4 py-14">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            <p>No modules match your search.</p>
          </div>
        ) : (
          sortedCats.map((cat) => {
            const accent = CATEGORY_ACCENT[cat] || DEFAULT_ACCENT;
            return (
              <div key={cat} className="mb-14 last:mb-0">
                {/* Category header */}
                <div className="mb-6 flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${accent.badge}`}>
                    {cat}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">{grouped[cat].length}</span>
                </div>

                {/* Cards */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {grouped[cat].map((mod, i) => {
                    const display = cleanTitle(mod.title || mod.headline);
                    return (
                      <motion.div
                        key={mod._id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.3, ease: "easeOut" }}
                      >
                        <div className={`group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition duration-200 ${accent.border} hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20`}>
                          {/* Accent dot */}
                          <div className={`mb-3 h-1.5 w-6 rounded-full ${accent.dot}`} />

                          {/* Title */}
                          <h3 className="flex-1 text-sm font-bold leading-snug text-foreground">
                            {display}
                          </h3>

                          {/* Subtitle */}
                          {mod.subtitle && (
                            <p className="mt-2 text-xs leading-5 text-muted-foreground line-clamp-2">
                              {mod.subtitle}
                            </p>
                          )}

                          {/* Read More */}
                          {mod.slug ? (
                            <Link
                              href={`/product/modules/${mod.slug}`}
                              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition group-hover:gap-2"
                            >
                              Read More <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                          ) : null}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </section>

    </main>
  );
}
