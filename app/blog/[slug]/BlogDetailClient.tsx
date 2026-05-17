"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { formatDate } from "date-fns";
import { Facebook, Instagram, Youtube, Link2, Clock, Eye, ExternalLink, MessageCircle, ChevronLeft, ChevronRight, ArrowRight, Twitter } from "lucide-react";

import { urlFor } from "@/sanity/lib/image";
import { PortableTextBlock } from "@/components/PortableTextBlock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DocumentHero } from "@/components/ui/DocumentHero";
import { ContentCoverImage } from "@/components/ui/ContentCoverImage";
import { BlogFloatingSocialBar } from "@/components/blog/BlogFloatingSocialBar";
import { SubscribeStrip } from "@/components/shared/SubscribeStrip";
import { buildLangHref, extractLocaleString, type SupportedLang } from "@/lib/locale";

const MotionDiv = motion.div as any;
const MotionHr = motion.hr as any;

// Vercel-style stagger logic for SECTIONS
const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

interface BlogDetailClientProps {
  post: any;
  relatedPosts: any[];
  lang: SupportedLang;
}

export function BlogDetailClient({ post, relatedPosts, lang }: BlogDetailClientProps) {
  const [currentUrl, setCurrentUrl] = useState("");

  const [viewCount, setViewCount] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  
  const [relatedPage, setRelatedPage] = useState(0);
  const RELATED_PAGE_SIZE = 3;

  useEffect(() => {
    setCurrentUrl(window.location.href);
    
    // Safety check for slug
    const slugId = post?.slug?.current || post?.slug;
    if (!slugId) return;

    // 1. Always hydrate views
    fetch(`/api/blog/views?slug=${encodeURIComponent(slugId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === "number") setViewCount(data.count);
      })
      .catch(console.error);

    // 2. Increment once per browser session
    const viewKey = `viewed_${slugId}`;
    if (!sessionStorage.getItem(viewKey)) {
      fetch("/api/blog/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.count === "number") setViewCount(data.count);
          sessionStorage.setItem(viewKey, "true");
        })
        .catch(console.error);
    }

  }, [post]);


  // Derive initial/fallback fields
  const pubDate = post?.publishedAt ? formatDate(new Date(post.publishedAt), "MMM dd, yyyy") : "Mar 15, 2024";
  const authorName = post?.author || "ClassGrid Team";
  const categoryName = extractLocaleString(post?.category, lang) || "Insight";
  const canonicalUrl = currentUrl || "https://classgrid.in/blog";
  
  // Safe extraction for Related Slugs
  const getSlug = (slugData: any) => {
    if (typeof slugData === 'object' && slugData?.current) return slugData.current;
    return typeof slugData === 'string' ? slugData : "";
  };

  return (
    <>
      <BlogFloatingSocialBar shareUrl={canonicalUrl} />

      {/* ── FULL-WIDTH COVER IMAGE HERO ── */}
      {post.coverImage && (
        <section className="relative w-full bg-background overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="relative w-full aspect-video max-h-[480px] rounded-2xl overflow-hidden border border-border/30 bg-zinc-900 flex items-center justify-center">
              <Image
                src={urlFor(post.coverImage).url()}
                alt={post.title || 'Blog cover image'}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        </section>
      )}
      
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 relative">
          
          {/* Main Content Column */}
          <article className="mt-0 w-full">
          {/* Hero — replaced with DocumentHero */}
          <div className="mb-8 mt-0">
            <DocumentHero
              badgeLabel={categoryName}
              title={post.title}
              lang={lang}
              showAccentBar={false}
            >
              <div className="flex flex-wrap items-center justify-center text-sm text-muted-foreground gap-4 md:gap-6 w-full">
                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-5 gap-y-2 text-xs md:text-sm">
                  <div className="flex items-center" title="Approximate Views">
                    <Eye className="w-4 h-4 mr-1.5 text-emerald-500 shrink-0" />
                    <span>{viewCount.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-emerald-500 shrink-0" />
                    <span>4 min read</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">{pubDate}</span>
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(canonicalUrl); setIsCopied(true); }}
                    className={`flex items-center transition-colors ${isCopied ? 'text-emerald-500' : 'hover:text-emerald-500'}`}
                  >
                    <Link2 className="w-4 h-4 mr-1.5 shrink-0" />
                    <span className="w-[65px] text-left block">{isCopied ? "Copied" : "Copy Link"}</span>
                  </button>
                </div>
              </div>
            </DocumentHero>
            
            {post.excerpt && (
              <div className="mt-10">
                <div className="relative px-6 py-5 sm:px-8 sm:py-6 bg-card/40 dark:bg-white/[0.02] border border-border dark:border-white/[0.05] rounded-3xl shadow-sm backdrop-blur-md text-left">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-emerald-400/0 via-emerald-500 to-emerald-400/0 rounded-full" />
                  <p className="text-[1.05rem] sm:text-[1.1rem] leading-relaxed text-foreground/80 font-medium">
                    {extractLocaleString(post.excerpt, lang)}
                  </p>
                </div>
              </div>
            )}
          </div>






            {/* ---------------- 3. BLOG CONTENT ---------------- */}
            {/* The individual sections inside PortableTextBlock animate themselves on scroll */}
            <div className="my-8">
              <PortableTextBlock value={post.body} showAccentBars={false} />
            </div>

          </article>
      </div>

      {/* ── VISUAL CONTENT SECTIONS (Case-Study Style Alternating Layouts) ── */}
      {post.contentSections && post.contentSections.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
            {post.contentSections.map((section: any, i: number) => {
              const layout = section.layout || 'left';
              const imageFirst = layout === 'left';

              const imageElement = section.imageUrl ? (
                <div className={`relative ${layout === 'center' ? 'aspect-video' : 'aspect-[4/3]'} rounded-xl overflow-hidden bg-muted shadow-2xl ring-1 ring-white/10`}>
                  <Image
                    src={section.imageUrl}
                    alt={section.imageAlt || section.heading || 'Blog section image'}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 55vw"
                  />
                </div>
              ) : null;

              const textElement = (
                <div>
                  {section.heading && (
                    <h3 className="text-2xl font-semibold mb-4 text-white leading-snug">{(section.heading || "").replace(/\.\s*$/, "")}</h3>
                  )}
                  {section.text && (
                    <p className="text-base text-zinc-300 leading-7 antialiased">{section.text}</p>
                  )}
                </div>
              );

              // Center layout — full width image with text below
              if (layout === 'center') {
                return (
                  <MotionDiv
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={slideUp}
                    className="max-w-4xl mx-auto space-y-6"
                  >
                    {imageElement}
                    <div className="text-center max-w-2xl mx-auto">
                      {section.heading && (
                        <h3 className="text-2xl font-semibold mb-4 text-white leading-snug">{(section.heading || "").replace(/\.\s*$/, "")}</h3>
                      )}
                      {section.text && (
                        <p className="text-base text-zinc-300 leading-7 antialiased">{section.text}</p>
                      )}
                    </div>
                  </MotionDiv>
                );
              }

              // Left/Right alternating layout
              return (
                <MotionDiv
                  key={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={slideUp}
                  className={`flex flex-col ${imageFirst ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-16 items-center`}
                >
                  {/* Image Side — 60% */}
                  <div className="w-full md:w-[60%]">
                    {imageElement || (
                      <div className="w-full aspect-[4/3] rounded-xl bg-card border border-border flex items-center justify-center">
                        <p className="text-zinc-500">No image</p>
                      </div>
                    )}
                  </div>
                  {/* Text Side — 40% */}
                  <div className="w-full md:w-[40%] flex flex-col max-w-sm">
                    {textElement}
                  </div>
                </MotionDiv>
              );
            })}
          </div>
        </section>
      )}

      {/* Back to narrow column for references & author */}
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 relative">
          <article className="w-full">
            {/* ---------------- 4. QUOTES & 5. REFERENCES ---------------- */}
            {post.references && post.references.length > 0 && (
              <MotionDiv 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={slideUp}
                className="mt-10 rounded-xl border border-border bg-card/50 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-surface-container-low">
                  <h3 className="text-base font-semibold text-foreground flex items-center">
                    <Link2 className="w-4 h-4 mr-2 text-emerald-500" /> References & Sources
                  </h3>
                </div>
                <div className="divide-y divide-surface-container-low">
                  {post.references.map((ref: any, idx: number) => {
                    const url = ref.url || '';
                    const isYouTube = /youtube\.com|youtu\.be/i.test(url);
                    const isInstagram = /instagram\.com/i.test(url);
                    const isFacebook = /facebook\.com|fb\.com/i.test(url);
                    const isWhatsApp = /whatsapp\.com|wa\.me/i.test(url);
                    
                    let IconComponent = ExternalLink;
                    let platformLabel = 'Visit Link';
                    let platformColor = 'text-emerald-500';
                    
                    try {
                      platformLabel = new URL(url).hostname.replace('www.', '');
                    } catch {}
                    
                    if (isYouTube) { IconComponent = Youtube; platformLabel = 'Watch on YouTube'; platformColor = 'text-red-400'; }
                    else if (isInstagram) { IconComponent = Instagram; platformLabel = 'View on Instagram'; platformColor = 'text-pink-400'; }
                    else if (isFacebook) { IconComponent = Facebook; platformLabel = 'View on Facebook'; platformColor = 'text-blue-400'; }
                    else if (isWhatsApp) { IconComponent = MessageCircle; platformLabel = 'Open in WhatsApp'; platformColor = 'text-green-400'; }
                    
                    return (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-4 px-6 py-4 hover:bg-emerald-500/5 transition-colors group"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                          <IconComponent className={`w-5 h-5 ${platformColor}`} />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-emerald-500 transition-colors">
                            {ref.title || platformLabel}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">{platformLabel}</p>
                        </div>
                        <ExternalLink className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 group-hover:text-emerald-500 transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </MotionDiv>
            )}



            {/* ---------------- 7. AUTHOR FOOTER ---------------- */}
            <MotionDiv 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              className="mt-12 border-t border-border pt-10 pb-6 flex flex-col md:flex-row items-center md:items-start gap-6"
            >
              {/* Author image — clickable, links to primary social */}
              {(() => {
                const primaryUrl = post.authorProfileLink;
                const avatarEl = (
                  <Avatar className="h-20 w-20 ring-2 ring-emerald-500/20 hover:ring-emerald-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                    {post.authorImage && <AvatarImage src={urlFor(post.authorImage).url()} alt={authorName} className="object-cover" />}
                    <AvatarFallback className="bg-emerald-500/10 text-emerald-500 text-2xl font-bold">{authorName.charAt(0)}</AvatarFallback>
                  </Avatar>
                );
                return primaryUrl ? (
                  <a href={primaryUrl} target="_blank" rel="noreferrer" title={`Visit ${authorName}'s profile`}>
                    {avatarEl}
                  </a>
                ) : avatarEl;
              })()}
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-foreground flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                  {authorName}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full w-fit">Content Writer</span>
                </h3>
                <p className="text-base text-muted-foreground mt-2 max-w-lg leading-relaxed">
                  {post.authorBio || "Exploring how modern technology integrates directly into global education. Dedicated to bringing scalable solutions to administration through ClassGrid."}
                </p>
              </div>
            </MotionDiv>
          </article>
      </div>

      {/* ── SUBSCRIBE STRIP — after article, before Related Blogs (best position: reader just finished) */}
      <SubscribeStrip heading="Enjoyed this blog? Get more like it" />

      {/* ---------------- 8. RELATED BLOGS ---------------- */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="border-t border-border bg-background pt-20 pb-24 mt-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionDiv 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              className="flex justify-between items-end mb-10"
            >
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-foreground">
                  Related Blogs
                </h2>
                <p className="text-muted-foreground">Keep exploring education and tech</p>
              </div>
              <div className="flex items-center gap-3">
                {relatedPosts.length > RELATED_PAGE_SIZE && (
                  <div className="flex items-center gap-2 mr-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setRelatedPage(p => Math.max(0, p - 1))}
                      disabled={relatedPage === 0}
                      className="rounded-full h-10 w-10 border-border"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setRelatedPage(p => Math.min(Math.ceil(relatedPosts.length / RELATED_PAGE_SIZE) - 1, p + 1))}
                      disabled={relatedPage >= Math.ceil(relatedPosts.length / RELATED_PAGE_SIZE) - 1}
                      className="rounded-full h-10 w-10 border-border"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
                <Link href={buildLangHref("/blog", lang)}>
                  <Button variant="outline" className="hidden md:flex rounded-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">
                    View All Blogs
                  </Button>
                </Link>
              </div>
            </MotionDiv>

            <MotionHr 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-t border-surface-container-low mb-12 origin-left"
            />

            <MotionDiv className="overflow-hidden relative min-h-[400px] py-4 -mx-4 px-4">
              <AnimatePresence mode="wait">
                <MotionDiv
                  key={relatedPage}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full"
                >
                  {relatedPosts.slice(relatedPage * RELATED_PAGE_SIZE, (relatedPage + 1) * RELATED_PAGE_SIZE).map((relatedPost: any, i: number) => (
                    <Link
                      key={relatedPost._id || i}
                      href={buildLangHref(`/blog/${getSlug(relatedPost.slug)}`, lang)}
                    >
                      <MotionDiv
                        variants={slideUp}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="group h-full rounded-2xl bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-surface-container-low hover:border-emerald-500/30 flex flex-col"
                      >
                        <div className="w-full h-56 bg-surface-container-lowest relative overflow-hidden">
                          {relatedPost.coverImage ? (
                            <Image
                              src={urlFor(relatedPost.coverImage).url()}
                              alt={extractLocaleString(relatedPost.title, lang)}
                              fill
                              className="object-contain p-1"
                            />
                          ) : (
                            <div className="w-full h-full bg-emerald-500/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors duration-500">
                              <span className="text-emerald-500/30 text-3xl font-bold">BLOG</span>
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-semibold tracking-wider text-emerald-500 uppercase">
                              {extractLocaleString(relatedPost.category, lang) || "Insight"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {relatedPost.publishedAt ? formatDate(new Date(relatedPost.publishedAt), "MMM dd, yyyy") : "Mar 2024"}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-emerald-500 transition-colors line-clamp-2">
                            {(extractLocaleString(relatedPost.title, lang) || "").replace(/\.\s*$/, "")}
                          </h3>
                          {relatedPost.excerpt && (
                            <p className="text-muted-foreground text-base line-clamp-2 mb-6 flex-grow">
                              {extractLocaleString(relatedPost.excerpt, lang)}
                            </p>
                          )}
                          <div className="flex items-center text-sm font-medium text-emerald-500 group-hover:translate-x-1 transition-transform mt-auto">
                            Read More <ArrowRight className="w-4 h-4 ml-1.5" />
                          </div>
                        </div>
                      </MotionDiv>
                    </Link>
                  ))}
                </MotionDiv>
              </AnimatePresence>
            </MotionDiv>
          </div>
        </section>
      )}
    </>
  );
}
