"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, FileText, ArrowRight, Command, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchResult = {
  slug: string;
  title: string;
  category: string;
  snippet: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  "platform-guides": "Platform Guides",
  "api-reference": "API Reference",
  "admin-setup": "Administrator Setup",
};

export function DocsSearchPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setActiveIndex(0);
      // Small delay to ensure the modal is rendered
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  // Escape key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        e.preventDefault();
        onOpenChange(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  // Debounced search
  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/docs/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
      setActiveIndex(0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => doSearch(query), 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      navigateTo(results[activeIndex].slug);
    }
  }

  function navigateTo(slug: string) {
    onOpenChange(false);
    router.push(`/docs/${slug}`);
  }

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  // Highlight matching text in results
  function highlightMatch(text: string, q: string) {
    if (!q.trim()) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-emerald-500/25 text-emerald-300 rounded-sm px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Command Palette */}
          <motion.div
            key="search-palette"
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-[12vh] z-[101] mx-auto w-[min(92vw,580px)]"
          >
            <div className="overflow-hidden rounded-xl border border-white/[0.12] bg-[#0a0a0a]/95 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3">
                <Search className="h-5 w-5 shrink-0 text-white/40" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search documentation..."
                  className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/35 outline-none"
                  autoComplete="off"
                  spellCheck={false}
                />
                {loading && (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-white/30" />
                )}
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-[11px] font-medium text-white/40">
                  Esc
                </kbd>
              </div>

              {/* Results */}
              <div ref={listRef} className="max-h-[60vh] overflow-y-auto overscroll-contain">
                {/* Empty state when no query */}
                {!query.trim() && (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <div className="flex items-center gap-2 text-white/25">
                      <Command className="h-4 w-4" />
                      <span className="text-[13px]">Type to search across all documentation</span>
                    </div>
                  </div>
                )}

                {/* No results */}
                {query.trim().length >= 2 && !loading && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                    <Search className="h-6 w-6 text-white/15" />
                    <p className="text-[13px] text-white/40">
                      No documentation found for &ldquo;{query}&rdquo;
                    </p>
                  </div>
                )}

                {/* Results list */}
                {results.length > 0 && (
                  <div className="p-1.5">
                    {results.map((result, index) => (
                      <button
                        key={result.slug}
                        data-index={index}
                        onClick={() => navigateTo(result.slug)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={cn(
                          "group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-100 cursor-pointer",
                          activeIndex === index
                            ? "bg-white/[0.07]"
                            : "hover:bg-white/[0.04]"
                        )}
                      >
                        <FileText className={cn(
                          "mt-0.5 h-4 w-4 shrink-0 transition-colors",
                          activeIndex === index ? "text-emerald-400" : "text-white/30"
                        )} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "text-[14px] font-medium truncate transition-colors",
                              activeIndex === index ? "text-white" : "text-white/80"
                            )}>
                              {highlightMatch(result.title, query)}
                            </span>
                            {result.category && (
                              <span className="shrink-0 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/40 uppercase tracking-wider">
                                {CATEGORY_LABELS[result.category] || result.category}
                              </span>
                            )}
                          </div>
                          {result.snippet && (
                            <p className="mt-0.5 text-[12px] leading-relaxed text-white/35 line-clamp-2">
                              {highlightMatch(result.snippet, query)}
                            </p>
                          )}
                        </div>
                        <ArrowRight className={cn(
                          "mt-1 h-3.5 w-3.5 shrink-0 transition-all",
                          activeIndex === index
                            ? "text-emerald-400 translate-x-0 opacity-100"
                            : "text-white/20 -translate-x-1 opacity-0"
                        )} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {results.length > 0 && (
                <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2">
                  <div className="flex items-center gap-3 text-[11px] text-white/30">
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1 py-0.5 text-[10px]">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1 py-0.5 text-[10px]">↵</kbd>
                      Open
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="rounded border border-white/[0.1] bg-white/[0.04] px-1 py-0.5 text-[10px]">Esc</kbd>
                      Close
                    </span>
                  </div>
                  <span className="text-[11px] text-white/25">{results.length} result{results.length !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
