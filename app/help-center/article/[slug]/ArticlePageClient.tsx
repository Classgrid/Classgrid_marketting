"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, Copy, Eye, PanelLeft, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Spinner } from "@/components/ui/spinner";
import { PortableText } from "@portabletext/react";
import urlBuilder from "@sanity/image-url";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CmsFallback } from "@/components/ui/CmsErrorBoundary";
import { FeedbackWidget } from "@/components/shared/FeedbackWidget";
import { cn } from "@/lib/utils";
import { buildLangHref, extractLocaleString, extractLocaleValue, type SupportedLang } from "@/lib/locale";
import { client } from "@/sanity/lib/client";

import { fetchArticleData } from "../../actions";

const builder = urlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

function toHeadingId(text: string, fallback: string) {
  const normalized = text
    .toLowerCase()
    .trim()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || fallback;
}

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div className="w-full aspect-video relative my-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Article Image"}
            fill
            className="object-cover"
          />
        </div>
      );
    },
    externalImage: ({ value }: any) => {
      if (!value?.url) return null;
      return (
        <div className="w-full aspect-video relative my-8 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <img
            src={value.url}
            alt={value.alt || "Article Image"}
            className="w-full h-full object-cover"
          />
        </div>
      );
    },
  },
  block: {
    h2: ({ children, value }: any) => {
      const headingText = value.children?.map((child: any) => child.text || "").join("").trim() || "";
      const id = toHeadingId(headingText, `section-${value._key || "heading"}`);
      return (
        <h2 id={id} className="text-3xl font-bold text-zinc-900 dark:text-white mt-16 mb-8 scroll-mt-24">
          {children}
        </h2>
      );
    },
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-12 mb-6">{children}</h3>
    ),
    normal: ({ children }: any) => (
      <p className="mb-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-6 mb-6 space-y-2 text-zinc-600 dark:text-zinc-400">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-6 mb-6 space-y-4 text-zinc-600 dark:text-zinc-400 marker:text-emerald-600 dark:marker:text-emerald-500 marker:font-bold">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong className="font-semibold text-zinc-900 dark:text-white">{children}</strong>
    ),
  },
};

export default function ArticlePageClient({
  slug,
  lang,
}: {
  slug: string;
  lang: SupportedLang;
}) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("");
  const [headings, setHeadings] = useState<{ id: string; title: string }[]>([]);
  const [viewCount, setViewCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      if (!slug) return;
      const data = await fetchArticleData(slug);
      const localizedContent = extractLocaleValue<any[]>(data?.content, lang, []) ?? [];
      const localizedArticle = data
        ? {
            ...data,
            content: localizedContent,
          }
        : null;

      setArticle(localizedArticle);
      setLoading(false);

      // Extract headings from markdown or Portable Text
      if (data?.markdownBody) {
        const mdHeadings = (data.markdownBody as string)
          .split("\n")
          .filter((line: string) => line.startsWith("## ") && !line.startsWith("### "))
          .map((line: string, index: number) => {
            const text = line.slice(3).trim();
            const id = toHeadingId(text, `section-${index + 1}`);
            return { id, title: text };
          });
        setHeadings(mdHeadings);
        if (mdHeadings.length > 0) setActiveSection(mdHeadings[0].id);
      } else if (localizedContent.length > 0) {
        const extracted = localizedContent
          .filter((block: any) => block._type === "block" && block.style === "h2")
          .map((block: any, index: number) => {
            const text = block.children?.map((child: any) => child.text || "").join("").trim() || "section";
            const id = toHeadingId(text, `section-${block._key || index + 1}`);
            return { id, title: text };
          });
        setHeadings(extracted);
        if (extracted.length > 0) setActiveSection(extracted[0].id);
      }
    }

    loadArticle();
  }, [lang, slug]);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/help/views?slug=${encodeURIComponent(slug)}`)
      .then((response) => response.json())
      .then((payload) => {
        if (typeof payload.count === "number") setViewCount(payload.count);
      })
      .catch(console.error);

    const viewKey = `help_viewed_${slug}`;
    if (!sessionStorage.getItem(viewKey)) {
      fetch("/api/help/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
        .then((response) => response.json())
        .then((payload) => {
          if (typeof payload.count === "number") setViewCount(payload.count);
          sessionStorage.setItem(viewKey, "true");
        })
        .catch(console.error);
    }

  }, [slug]);

  useEffect(() => {
    if (headings.length === 0) return;
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      for (let index = headings.length - 1; index >= 0; index -= 1) {
        const element = document.getElementById(headings[index].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(headings[index].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  if (loading) {
    return (
      <main className="min-h-[80vh] bg-background flex flex-col justify-center items-center pt-32 pb-24">
        <Spinner className="w-8 h-8 text-emerald-500 mb-4" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">Loading article...</p>
      </main>
    );
  }

  if (!article) {
    return (
      <CmsFallback
        type="article"
        backHref={buildLangHref("/help-center", lang)}
        backLabel="Back to Help Center"
      />
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 selection:bg-emerald-500/30">
      {/* ── Mobile Nav Bar (only visible below lg) ── */}
      <div className="sticky top-16 z-40 flex w-full items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/80 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
      </div>

      {/* ── Mobile Left Sidebar Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex h-full w-[280px] flex-col bg-[#080808] shadow-2xl lg:hidden"
            >
              <div className="flex h-14 items-center justify-between border-b border-border/60 px-4">
                <span className="text-sm font-semibold text-white">In this article</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/70 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 [scrollbar-width:thin]">
                {headings.map((heading) => {
                  const isActive = activeSection === heading.id;
                  return (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block rounded-md px-3 py-2.5 text-[13px] leading-snug transition-colors",
                        isActive
                          ? "bg-emerald-500/10 font-semibold text-emerald-500"
                          : "text-muted-foreground hover:bg-white/[0.05] hover:text-white"
                      )}
                    >
                      <span className="line-clamp-2">{heading.title}</span>
                    </a>
                  );
                })}
              </div>
              <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 p-4">
                <Link
                  href={buildLangHref("/support/ticket", lang)}
                  className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-lg">🙋</span> Have a question?
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 pt-6 flex flex-col lg:flex-row gap-12 relative">
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-28 flex flex-col max-h-[calc(100vh-8rem)]">
            <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-4 shrink-0">
              In this article
            </h4>
            <nav className="space-y-1 relative overflow-y-auto flex-1 pr-4 -mr-4 pb-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800" style={{ scrollbarWidth: "thin" }}>
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-zinc-100 dark:bg-zinc-800" />

              {headings.map((heading) => {
                const isActive = activeSection === heading.id;
                return (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={`block pl-4 py-2 text-sm transition-colors relative ${
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-500 rounded-r" />
                    )}
                    {heading.title}
                  </a>
                );
              })}
            </nav>

            <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 pb-4">
              <Link
                href={buildLangHref("/support/ticket", lang)}
                className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              >
                <span className="text-lg">🙋</span> Have a question?
              </Link>
            </div>
          </div>
        </aside>

        {/* TODO: Add a persistent search bar on article pages (like Claude Help Center) */}
        <article className="flex-1 max-w-[800px]">
          <div className="mb-2">
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
              {article.category || "General"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-6 tracking-tight leading-tight">
            {extractLocaleString(article.title, lang)}
          </h1>

          <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-500" />
              <span>{viewCount.toLocaleString()} views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-500" />
              <span>3 min read</span>
            </div>
            {article.showDates !== false && article.publishedAt && (
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-emerald-500" />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            )}
            {article.showDates !== false && article.lastUpdatedAt && (
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-400">
                  Updated {new Date(article.lastUpdatedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              </div>
            )}
          </div>

          {article.summary && (
            <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed mb-10 font-medium border-l-4 border-emerald-500/30 pl-4">
              {extractLocaleString(article.summary, lang)}
            </p>
          )}

          <div className="prose prose-zinc dark:prose-invert max-w-none">
            {article.markdownBody ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => {
                    const text = typeof children === "string" ? children : (Array.isArray(children) ? children.join("") : String(children || ""));
                    const id = toHeadingId(text, "section");
                    return <h2 id={id} className="text-2xl font-bold text-zinc-900 dark:text-white mt-14 mb-6 scroll-mt-24 border-b border-zinc-200 dark:border-zinc-800 pb-3">{children}</h2>;
                  },
                  h3: ({ children }) => <h3 className="text-xl font-bold text-zinc-900 dark:text-white mt-10 mb-4">{children}</h3>,
                  p: ({ children }) => <p className="mb-5 text-zinc-600 dark:text-zinc-400 leading-relaxed">{children}</p>,
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-8 rounded-xl border border-zinc-200 dark:border-zinc-800">
                      <table className="min-w-full text-sm">{children}</table>
                    </div>
                  ),
                  thead: ({ children }) => <thead className="bg-zinc-100 dark:bg-zinc-800/60">{children}</thead>,
                  th: ({ children }) => <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-700">{children}</th>,
                  td: ({ children }) => <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 font-mono text-[13px]">{children}</td>,
                  tr: ({ children }) => <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">{children}</tr>,
                  code: ({ className, children, ...props }) => {
                    const isBlock = className?.includes("language-");
                    const lang = className?.replace("language-", "") || "";
                    if (isBlock) {
                      return (
                        <div className="relative group my-6">
                          <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 dark:bg-zinc-950 rounded-t-xl border border-b-0 border-zinc-700">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">{lang || "code"}</span>
                            <button
                              onClick={() => { navigator.clipboard.writeText(String(children).replace(/\n$/, "")); }}
                              className="text-zinc-500 hover:text-zinc-300 transition-colors"
                              title="Copy"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <pre className="!mt-0 !rounded-t-none rounded-b-xl bg-zinc-950 border border-t-0 border-zinc-700 overflow-x-auto p-4">
                            <code className="text-[13px] leading-6 text-emerald-300 font-mono">{children}</code>
                          </pre>
                        </div>
                      );
                    }
                    return <code className="px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 text-[13px] font-mono font-medium border border-zinc-200 dark:border-zinc-700" {...props}>{children}</code>;
                  },
                  pre: ({ children }) => <>{children}</>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-5 space-y-2 text-zinc-600 dark:text-zinc-400">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-5 space-y-3 text-zinc-600 dark:text-zinc-400 marker:text-emerald-600 dark:marker:text-emerald-500 marker:font-bold">{children}</ol>,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-emerald-500/40 pl-4 py-1 my-6 text-zinc-600 dark:text-zinc-400 italic bg-emerald-500/5 rounded-r-lg pr-4">{children}</blockquote>,
                  strong: ({ children }) => <strong className="font-semibold text-zinc-900 dark:text-white">{children}</strong>,
                  hr: () => <hr className="my-10 border-zinc-200 dark:border-zinc-800" />,
                  a: ({ href, children }) => <a href={href} className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium" target={href?.startsWith("http") ? "_blank" : undefined}>{children}</a>,
                }}
              >
                {article.markdownBody}
              </ReactMarkdown>
            ) : article.content ? (
              <PortableText value={article.content} components={ptComponents} />
            ) : (
              <p className="text-zinc-500">No content available.</p>
            )}
          </div>

          <div className="mt-20 border-t border-zinc-200 dark:border-zinc-800">
            <FeedbackWidget
              pageTitle={extractLocaleString(article.title, lang)}
              pageType="help-article"
            />
          </div>
        </article>
      </div>
    </main>
  );
}
