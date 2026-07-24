"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { formatDate } from "date-fns";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import GoogleOneTap from "@/components/auth/GoogleOneTap";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { urlFor } from "@/sanity/lib/image";
import { buildLangHref, extractLocaleString, type SupportedLang } from "@/lib/locale";

const MotionSpan = motion.span as any;
const MotionDiv = motion.div as any;
const MotionSection = motion.section as any;

interface Post {
  _id?: string;
  title: unknown;
  slug: string | { current?: string } | null;
  excerpt?: unknown;
  coverImage?: unknown;
  publishedAt?: string;
  category?: unknown;
  author?: string;
  authorImage?: any;
  authors?: { name?: string; image?: any; profileLink?: string; bio?: string }[];
}

interface PostMetric {
  likes: number;
  views: number;
  score: number;
}

const MONTH_MAP: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const GRID_PAGE_SIZE = 6;

const formatPubDate = (date?: string) =>
  date ? formatDate(new Date(date), "MMM dd, yyyy") : "Mar 15, 2024";

type PaginationToken = number | "ellipsis-left" | "ellipsis-right";

function buildPaginationTokens(currentPage: number, totalPages: number): PaginationToken[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const tokens: PaginationToken[] = [1];
  const windowStart = Math.max(2, currentPage - 1);
  const windowEnd = Math.min(totalPages - 1, currentPage + 1);

  if (windowStart > 2) {
    tokens.push("ellipsis-left");
  }

  for (let page = windowStart; page <= windowEnd; page += 1) {
    tokens.push(page);
  }

  if (windowEnd < totalPages - 1) {
    tokens.push("ellipsis-right");
  }

  tokens.push(totalPages);
  return tokens;
}

const getSlug = (slugData: Post["slug"]): string => {
  if (typeof slugData === "string") return slugData;
  if (slugData && typeof slugData === "object" && slugData.current) return slugData.current;
  return "";
};

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.trunc(value);
  }
  return 0;
};

export function LoadingDots() {
  const dots = [0, 1, 2, 3, 4];

  return (
    <div className="relative flex w-full min-h-[50vh] items-center justify-center space-x-2 overflow-hidden bg-background py-10">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute left-[20%] top-[30%] h-[300px] w-[300px] rounded-[50px] border-[1px] border-emerald-500/20 mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[15%] h-[400px] w-[400px] rounded-[60px] border-[1px] border-cyan-500/20 mix-blend-screen" />
      </div>

      {dots.map((i) => (
        <MotionSpan
          key={i}
          className="h-3 w-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
          animate={{
            y: [0, -8, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function BlogClient({
  posts,
  title,
  subtitle,
  lang,
}: {
  posts: Post[];
  title: string;
  subtitle: string;
  lang: SupportedLang;
}) {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [metricsBySlug, setMetricsBySlug] = useState<Record<string, PostMetric>>({});

  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, monthFilter, yearFilter, sortOrder, posts]);

  useEffect(() => {
    const slugs = Array.from(
      new Set((posts || []).map((post) => getSlug(post.slug)).filter(Boolean))
    );
    if (slugs.length === 0) {
      setMetricsBySlug({});
      return;
    }

    const params = new URLSearchParams();
    for (const slug of slugs) {
      params.append("slug", slug);
    }

    const controller = new AbortController();
    const loadMetrics = async () => {
      try {
        const res = await fetch(`/api/blog/metrics?${params.toString()}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) return;
        const payload = await res.json();
        if (!payload?.metrics || typeof payload.metrics !== "object") return;

        const safeMetrics: Record<string, PostMetric> = {};
        for (const slug of slugs) {
          const entry = payload.metrics[slug] ?? {};
          safeMetrics[slug] = {
            likes: toNumber(entry.likes),
            views: toNumber(entry.views),
            score: toNumber(entry.score),
          };
        }
        setMetricsBySlug(safeMetrics);
      } catch (error) {
        if ((error as { name?: string })?.name === "AbortError") return;
      }
    };

    loadMetrics();
    return () => controller.abort();
  }, [posts]);

  const categories = useMemo(() => {
    const discovered = Array.from(
      new Set(
        (posts || [])
          .map((post) => extractLocaleString(post.category, lang).trim())
          .filter(Boolean)
      )
    );
    return ["All", ...discovered];
  }, [lang, posts]);

  const years = useMemo(() => {
    const discovered = Array.from(
      new Set(
        (posts || [])
          .map((post) => post.publishedAt ? new Date(post.publishedAt).getFullYear().toString() : null)
          .filter(Boolean)
      )
    ).sort((a, b) => Number(b) - Number(a));
    return ["all", ...discovered as string[]];
  }, [posts]);

  const filteredAndSortedPosts = useMemo(() => {
    if (!posts) return [];

    const filtered = posts.filter((post) => {
      const hasSlug = Boolean(getSlug(post.slug));
      const category = extractLocaleString(post.category, lang).toLowerCase();
      const matchesTab = activeTab.toLowerCase() === "all" || category === activeTab.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        extractLocaleString(post.title, lang).toLowerCase().includes(searchQuery.toLowerCase());

      let matchesMonth = true;
      let matchesYear = true;
      if (post.publishedAt) {
        const postDate = new Date(post.publishedAt);
        if (monthFilter !== "all") {
          matchesMonth = postDate.getMonth() === MONTH_MAP[monthFilter];
        }
        if (yearFilter !== "all") {
          matchesYear = postDate.getFullYear().toString() === yearFilter;
        }
      }

      return hasSlug && matchesTab && matchesSearch && matchesMonth && matchesYear;
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === "popular") {
        const scoreA = metricsBySlug[getSlug(a.slug)]?.score ?? 0;
        const scoreB = metricsBySlug[getSlug(b.slug)]?.score ?? 0;
        if (scoreA !== scoreB) {
          return scoreB - scoreA;
        }
      }

      const timeA = new Date(a.publishedAt || 0).getTime();
      const timeB = new Date(b.publishedAt || 0).getTime();
      if (sortOrder === "oldest") {
        return timeA - timeB;
      }
      return timeB - timeA;
    });
  }, [posts, activeTab, searchQuery, monthFilter, yearFilter, sortOrder, metricsBySlug, lang]);

  if (!isClientLoaded || !posts) {
    return <LoadingDots />;
  }

  const allGridPosts = filteredAndSortedPosts;
  const totalPages = Math.max(1, Math.ceil(allGridPosts.length / GRID_PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const gridStartIndex = (activePage - 1) * GRID_PAGE_SIZE;
  const gridPosts = allGridPosts.slice(gridStartIndex, gridStartIndex + GRID_PAGE_SIZE);
  const paginationTokens = buildPaginationTokens(activePage, totalPages);
  const hasAnyPost = filteredAndSortedPosts.length > 0;

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
      {/* Reusable Google One Tap Login Popup */}
      {/* <GoogleOneTap /> */}
      
      <section className="mt-0 flex flex-col items-center space-y-4 pb-10 pt-0 text-center">


        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
          {title || "Welcome to Our Blog"}
        </h1>

        <p className="max-w-2xl text-lg text-muted-foreground">
          {subtitle || "Stay updated with the latest insights, tips, and stories from the Classgrid team."}
        </p>

        <div className="flex w-full max-w-xl items-center pt-2">
          <div className="relative w-full text-left">
            <label htmlFor="search-input" className="sr-only">Search a blog</label>
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-input"
              type="text"
              placeholder="Search a blog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-xl border border-border bg-card pl-10 text-card-foreground shadow-sm placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-0"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-4 py-4 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger
                aria-label="Sort Order"
                className="h-11 w-[130px] rounded-xl border border-border bg-card text-card-foreground shadow-sm"
              >
                <SelectValue placeholder="Sort: Latest" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-card text-card-foreground">
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute inset-0 w-full h-full opacity-0 sm:hidden z-10 appearance-none"
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          <div className="relative">
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger
                aria-label="Month Filter"
                className="h-11 w-[150px] rounded-xl border border-border bg-card text-card-foreground shadow-sm"
              >
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-card text-card-foreground">
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
              onChange={(e) => setMonthFilter(e.target.value)}
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

          <div className="relative">
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger
                aria-label="Year Filter"
                className="h-11 w-[120px] rounded-xl border border-border bg-card text-card-foreground shadow-sm"
              >
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border bg-card text-card-foreground">
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year === "all" ? "All Years" : year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute inset-0 w-full h-full opacity-0 sm:hidden z-10 appearance-none"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year === "all" ? "All Years" : year}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="scrollbar-hide flex w-full gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant="outline"
              onClick={() => setActiveTab(cat)}
              className={`rounded-full border px-4 py-2 font-medium shadow-none transition ${
                activeTab === cat
                  ? "border-emerald-500 bg-emerald-500 text-black hover:bg-emerald-500 hover:text-black"
                  : "border-border bg-card text-muted-foreground hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-foreground"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </section>

      {gridPosts.length > 0 ? (
        <MotionSection
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {gridPosts.map((post, i) => {
            const slug = getSlug(post.slug);
            const metrics = metricsBySlug[slug];
            return (
              <Link key={post._id || i} href={buildLangHref(`/blog/${slug}`, lang)}>
                <MotionDiv
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                  }}
                  whileHover={{ scale: 1.02, y: -6 }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_8px_32px_rgba(16,185,129,0.12)]"
                >
                  {/* Card Image */}
                  <div className="relative h-48 w-full flex-shrink-0 overflow-hidden bg-muted">
                    {post.coverImage ? (
                      <Image
                        src={urlFor(post.coverImage).url()}
                        alt={extractLocaleString(post.title, lang)}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-emerald-500/5">
                        <span className="text-3xl font-bold text-emerald-500/30">BLOG</span>
                      </div>
                    )}
                    {/* Category pill floating on image */}
                    <span className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow">
                      {extractLocaleString(post.category, lang) || "Education"}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-grow flex-col p-5">
                    <div className="mb-2 text-xs text-muted-foreground">
                      {formatPubDate(post.publishedAt)}
                    </div>
                    <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-emerald-500">
                      {extractLocaleString(post.title, lang)}
                    </h3>
                    {post.excerpt && (
                      <p className="mb-4 line-clamp-2 flex-grow text-sm text-muted-foreground">
                        {extractLocaleString(post.excerpt, lang)}
                      </p>
                    )}

                    {/* Footer row */}
                    <div className="mt-auto flex flex-col gap-3 border-t border-border pt-4">
                      {(() => {
                        // Build authors list: prefer new multi-author array, fallback to legacy single author
                        const authorsList = (post.authors && post.authors.length > 0)
                          ? post.authors.slice(0, 3)
                          : [{ name: post.author || 'ClassGrid Team', image: post.authorImage }];

                        // Build display name string
                        const names = authorsList.map(a => a.name || 'Unknown');
                        let displayName = '';
                        if (names.length === 1) displayName = names[0];
                        else if (names.length === 2) displayName = `${names[0]} and ${names[1]}`;
                        else displayName = `${names[0]}, ${names[1]}, and ${names[2]}`;

                        return (
                          <div className="flex items-center gap-2">
                            {/* Stacked overlapping avatars */}
                            <div className="flex items-center -space-x-2">
                              {authorsList.map((a, idx) => (
                                a.image ? (
                                  <Image
                                    key={idx}
                                    src={urlFor(a.image).url()}
                                    alt={a.name || 'Author'}
                                    width={24}
                                    height={24}
                                    className="h-6 w-6 rounded-full object-cover ring-2 ring-card"
                                    style={{ zIndex: authorsList.length - idx }}
                                  />
                                ) : (
                                  <div
                                    key={idx}
                                    className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-500 ring-2 ring-card"
                                    style={{ zIndex: authorsList.length - idx }}
                                  >
                                    {(a.name || 'C').charAt(0)}
                                  </div>
                                )
                              ))}
                            </div>
                            <span className="text-xs font-medium text-foreground truncate">{displayName}</span>
                          </div>
                        );
                      })()}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {metrics && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3.5 w-3.5 text-emerald-500" />
                              {metrics.views}
                            </span>
                          )}
                        </div>
                        <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-500 transition-all group-hover:bg-emerald-500 group-hover:text-white">
                          Read →
                        </span>
                      </div>
                    </div>
                  </div>
                </MotionDiv>
              </Link>
            );
          })}
        </MotionSection>
      ) : !hasAnyPost ? (
        <section className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-low">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-2xl font-bold text-foreground">No blogs found</h3>
          <p className="text-muted-foreground">Try changing your filters or searching for something else.</p>
          <Button
            variant="outline"
            className="mt-6 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10"
            onClick={() => {
              setActiveTab("All");
              setSearchQuery("");
              setMonthFilter("all");
              setYearFilter("all");
              setSortOrder("latest");
            }}
          >
            Clear Filters
          </Button>
        </section>
      ) : null}

      {totalPages > 1 && (
        <Pagination className="pb-20 pt-8">
          <PaginationContent className="gap-1 rounded-xl border border-border bg-card/90 p-1 shadow-sm">
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (activePage <= 1) return;
                  setCurrentPage(activePage - 1);
                }}
                aria-disabled={activePage <= 1}
                className={`rounded-lg text-muted-foreground transition hover:bg-accent ${
                  activePage <= 1 ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>

            {paginationTokens.map((token, index) => (
              <PaginationItem key={`${token}-${index}`}>
                {typeof token === "number" ? (
                  <PaginationLink
                    href="#"
                    isActive={token === activePage}
                    onClick={(e) => {
                      e.preventDefault();
                      if (token === activePage) return;
                      setCurrentPage(token);
                    }}
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
                onClick={(e) => {
                  e.preventDefault();
                  if (activePage >= totalPages) return;
                  setCurrentPage(activePage + 1);
                }}
                aria-disabled={activePage >= totalPages}
                className={`rounded-lg text-muted-foreground transition hover:bg-accent ${
                  activePage >= totalPages ? "pointer-events-none opacity-50" : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
