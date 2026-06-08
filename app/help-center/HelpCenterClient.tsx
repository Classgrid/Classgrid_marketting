"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronRight,
  Clock,
  Code2,
  ExternalLink,
  FileText,
  GraduationCap,
  HelpCircle,
  LayoutGrid,
  Search,
  Scroll,
  XCircle,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import {
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { buildLangHref, extractLocaleString, type SupportedLang } from "@/lib/locale";
import { useSession } from "next-auth/react";
import { getInitialSupportData, searchSupportArticles } from "./actions";

const ICON_MAP: Record<string, any> = {
  // Legacy
  Shield: Building2,
  // New categories
  BookOpen,
  GraduationCap,
  Code2,
  HelpCircle,
  Zap,
  FileText,
  LayoutGrid,
  Scroll,
  Building2,
  Clock,
};

const CATEGORY_ACCENT: Record<
  string,
  { border: string; ring: string; gradient: string; iconColor: string; badgeColor: string }
> = {
  // Legacy user-role categories
  "I am an Admin": {
    border: "border-purple-500",
    ring: "ring-purple-500",
    gradient: "from-purple-500/8",
    iconColor: "text-purple-400",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  "I am a Teacher": {
    border: "border-blue-500",
    ring: "ring-blue-500",
    gradient: "from-blue-500/8",
    iconColor: "text-blue-400",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "I am a Student": {
    border: "border-sky-500",
    ring: "ring-sky-500",
    gradient: "from-sky-500/8",
    iconColor: "text-sky-400",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  // New categories
  "Getting Started": {
    border: "border-emerald-500",
    ring: "ring-emerald-500",
    gradient: "from-emerald-500/8",
    iconColor: "text-emerald-400",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },

  "API Reference": {
    border: "border-indigo-500",
    ring: "ring-indigo-500",
    gradient: "from-indigo-500/8",
    iconColor: "text-indigo-400",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  "Guides": {
    border: "border-teal-500",
    ring: "ring-teal-500",
    gradient: "from-teal-500/8",
    iconColor: "text-teal-400",
    badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
  "Release Notes": {
    border: "border-rose-500",
    ring: "ring-rose-500",
    gradient: "from-rose-500/8",
    iconColor: "text-rose-400",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
};

const DEFAULT_ACCENT = {
  border: "border-emerald-500",
  ring: "ring-emerald-500",
  gradient: "from-emerald-500/8",
  iconColor: "text-emerald-400",
  badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

export default function HelpCenterClient({ lang, initialData }: { lang: SupportedLang; initialData: any }) {
  const { status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isShowingMore, setIsShowingMore] = useState(false);

  const [allArticles, setAllArticles] = useState<any[]>(initialData.fetchedArticles);
  const [categories, setCategories] = useState<any[]>(initialData.fetchedCategories);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const articleSectionRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (category: any) => {
    // Link-type categories navigate away
    if (category.categoryType === "link" && category.externalHref) {
      const isExternal = category.externalHref.startsWith("http");
      if (isExternal) {
        window.open(category.externalHref, "_blank");
      } else {
        window.location.href = category.externalHref;
      }
      return;
    }
    // Navigate to the dedicated category page
    window.location.href = buildLangHref(`/help-center/category/${category.slug}`, lang);
  };



  const handleSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearchLoading(true);
    try {
      const results = await searchSupportArticles(query);
      setSearchResults(results);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    }
    setIsSearchLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => handleSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const displayedArticles = activeCategory
    ? allArticles.filter((article) => article.category === activeCategory)
    : allArticles;

  const visibleArticles = displayedArticles.slice(0, visibleCount);

  // Sort categories: articles first, then links — respect "order" field
  const sortedCategories = [...categories].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-16 overflow-hidden selection:bg-emerald-500/30 transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[50vw] rounded-full bg-emerald-600/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      {/* Hero */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto text-center mb-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <SectionAccentBar />
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Search for answers or browse by <span className="text-emerald-500 dark:text-emerald-400">topic</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
            Everything you need — guides, API docs, and support articles.
          </p>
        </motion.div>
      </section>

      {/* Search */}
      <section className="px-6 max-w-3xl mx-auto mb-16 relative z-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-emerald-500/30 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />

          <div className="relative flex items-center bg-card border border-border rounded-2xl shadow-xl overflow-hidden focus-within:border-emerald-500/50 transition-colors">
            <Search className="w-5 h-5 text-muted-foreground ml-5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setTimeout(() => setIsSearching(false), 200)}
              placeholder="Search articles, guides..."
              className="w-full bg-transparent border-none py-5 px-4 text-base text-foreground placeholder-muted-foreground/50 focus:outline-none focus:ring-0"
            />
          </div>

          <AnimatePresence>
            {isSearching && searchQuery.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 right-0 mt-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-30"
              >
                {isSearchLoading ? (
                  <div className="p-6 text-center">
                    <Spinner className="w-5 h-5 text-emerald-500 mx-auto" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-2">
                    <div className="px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                    </div>
                    {searchResults.map((result, index) => (
                      <Link
                        key={`${result.slug}-${index}`}
                        href={buildLangHref(`/help-center/article/${result.slug}`, lang)}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-500/10 rounded-xl transition-colors flex items-center justify-between group block"
                      >
                        <div>
                          <span className="font-medium text-foreground block">
                            {extractLocaleString(result.title, lang)}
                          </span>
                          <span className="text-xs text-muted-foreground">{result.category}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* Dynamic Content */}
      {searchQuery.length >= 2 && !isSearchLoading && searchResults.length === 0 ? (
        <section className="px-6 max-w-3xl mx-auto mb-20 text-center relative z-10">
          <p className="text-lg font-medium text-muted-foreground mt-8">
            We couldn't find any articles for: <strong className="text-foreground">{searchQuery}</strong>
          </p>
        </section>
      ) : (
        <section className="px-6 max-w-6xl mx-auto mb-20 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedCategories.map((category, index) => {
            const isActive = activeCategory === category.title;
            const IconComp = ICON_MAP[category.icon] || FileText;
            const accent = CATEGORY_ACCENT[category.title] || DEFAULT_ACCENT;
            const isLink = category.categoryType === "link";
            const isExternalLink = isLink && category.externalHref?.startsWith("http");

            return (
              <motion.button
                key={category.slug || index}
                onClick={() => handleCategoryClick(category)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * index }}
                className={`group relative p-6 rounded-2xl bg-card border hover:border-emerald-500/50 transition-all text-left overflow-hidden cursor-pointer shadow-sm ${
                  isActive ? `${accent.border} ring-1 ${accent.ring}` : "border-border"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${accent.gradient} to-transparent transition-opacity ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />

                <div className="relative flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <IconComp className={`w-5 h-5 ${accent.iconColor}`} />
                  </div>
                  {isLink && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      {isExternalLink ? <ArrowUpRight className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                      {isExternalLink ? "External" : "Go to"}
                    </span>
                  )}
                </div>

                {!isLink && (
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border mb-3 text-[10px] font-bold tracking-widest uppercase ${accent.badgeColor}`}>
                    <FileText className="w-3 h-3" />
                    {category.articleCount ?? 0} {category.articleCount === 1 ? "Article" : "Articles"}
                  </div>
                )}

                {isLink && (
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border mb-3 text-[10px] font-bold tracking-widest uppercase ${accent.badgeColor}`}>
                    <ExternalLink className="w-3 h-3" />
                    Resource
                  </div>
                )}

                <h3 className="relative text-lg font-bold mb-1 text-foreground">{category.title}</h3>
                <p className="relative text-sm text-muted-foreground leading-relaxed">{category.description}</p>
              </motion.button>
            );
          })}
        </div>
      </section>
      )}

    </main>
  );
}
