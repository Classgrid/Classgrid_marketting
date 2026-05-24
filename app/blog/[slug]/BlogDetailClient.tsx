"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { formatDate } from "date-fns";
import { Facebook, Instagram, Youtube, Link2, Clock, Eye, ExternalLink, MessageCircle, ChevronLeft, ChevronRight, ArrowRight, Twitter, Linkedin } from "lucide-react";

import { urlFor } from "@/sanity/lib/image";
import { PortableTextBlock } from "@/components/PortableTextBlock";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DocumentHero } from "@/components/ui/DocumentHero";
import { ContentCoverImage } from "@/components/ui/ContentCoverImage";
import { BlogFloatingSocialBar } from "@/components/blog/BlogFloatingSocialBar";
import { SubscribeStrip } from "@/components/shared/SubscribeStrip";
import { FeedbackWidget } from "@/components/shared/FeedbackWidget";
import { buildLangHref, extractLocaleString, type SupportedLang } from "@/lib/locale";
import { BlueprintBox, BlueprintSection } from "@/components/ui/BlueprintBox";

const MotionDiv = motion.div as any;
const MotionHr = motion.hr as any;

// ── Reading-time utility ──────────────────────────────────────────────────────
function extractPortableTextWords(blocks: any[]): number {
  if (!Array.isArray(blocks)) return 0;
  return blocks.reduce((total, block) => {
    if (block?._type !== 'block' || !Array.isArray(block.children)) return total;
    const text = block.children
      .map((child: any) => (typeof child?.text === 'string' ? child.text : ''))
      .join(' ');
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
}

function getReadingTime(post: any, lang: string): string {
  if (typeof post?.readingTimeOverride === 'number' && post.readingTimeOverride >= 1) {
    return `${post.readingTimeOverride} min read`;
  }
  let wordCount = 0;
  const body = post?.body;
  if (body) {
    const localeBody = body[lang] ?? body['en'] ?? (Array.isArray(body) ? body : null);
    wordCount += extractPortableTextWords(localeBody);
  }
  if (Array.isArray(post?.contentSections)) {
    for (const section of post.contentSections) {
      const headingWords = typeof section?.heading === 'string' ? section.heading.split(/\s+/).filter(Boolean).length : 0;
      const textWords = typeof section?.text === 'string' ? section.text.split(/\s+/).filter(Boolean).length : 0;
      wordCount += headingWords + textWords;
    }
  }
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} min read`;
}
// ─────────────────────────────────────────────────────────────────────────────

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

// Light fade-up for mobile — no horizontal movement
const mobileSlide = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Directional slide animation — matches case study storyblock feel (desktop only)
const fadeSlide = (fromLeft: boolean) => ({
  hidden: { opacity: 0, x: fromLeft ? -40 : 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
});

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
  const [isMobile, setIsMobile] = useState(false);
  const RELATED_PAGE_SIZE = 3;

  // 1. Reading Progress Bar Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    setCurrentUrl(window.location.href);

    // Detect mobile for lighter animations
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const slugId = post?.slug?.current || post?.slug;
    if (!slugId) return;

    fetch(`/api/blog/views?slug=${encodeURIComponent(slugId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === "number") setViewCount(data.count);
      })
      .catch(console.error);

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
    };
    return () => window.removeEventListener('resize', checkMobile);
  }, [post]);

  const pubDate = post?.publishedAt ? formatDate(new Date(post.publishedAt), "MMM dd, yyyy") : "Mar 15, 2024";
  const authorName = post?.author || "ClassGrid Team";
  const categoryName = extractLocaleString(post?.category, lang) || "Insight";
  const canonicalUrl = currentUrl || "https://classgrid.in/blog";
  
  const getSlug = (slugData: any) => {
    if (typeof slugData === 'object' && slugData?.current) return slugData.current;
    return typeof slugData === 'string' ? slugData : "";
  };

  return (
    <>
      {/* Progress Reading Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100]"
        style={{ scaleX }}
      />
      
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

      {/* Blueprint-framed article body */}
      <BlueprintBox maxWidth="max-w-4xl" className="pt-2 pb-16">
        <article className="mt-0 w-full px-4 sm:px-8 md:px-12">
          {/* Hero */}
          <div className="mb-8 mt-8">
            <DocumentHero
              badgeLabel={categoryName}
              title={post.title}
              lang={lang}
              showAccentBar={false}
            >
              <div className="flex flex-wrap items-center justify-center text-sm text-muted-foreground gap-4 md:gap-6 w-full">
                <div className="flex flex-wrap items-center justify-center gap-x-4 md:gap-x-5 gap-y-2 text-xs md:text-sm">
                  <div className="flex items-center" title="Approximate Views">
                    <Eye className="w-4 h-4 mr-1.5 text-emerald-500 shrink-0" />
                    <span>{viewCount.toLocaleString()} views</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1.5 text-emerald-500 shrink-0" />
                    <span>{getReadingTime(post, lang)}</span>
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
          <div className="my-8">
            <PortableTextBlock value={post.body} showAccentBars={false} />
          </div>
        </article>

        {/* ── VISUAL CONTENT SECTIONS (inside BlueprintBox) ── */}
        {post.contentSections && post.contentSections.length > 0 && (
          <div className="py-12 px-4 sm:px-6 space-y-16 md:space-y-20">
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
                    <h3 className="text-2xl font-semibold mb-4 text-foreground leading-snug">{(section.heading || "").replace(/\.\s*$/, "")}</h3>
                  )}
                  {section.text && (
                    <p className="text-base text-muted-foreground leading-7 antialiased">{section.text}</p>
                  )}
                </div>
              );

              if (layout === 'center') {
                return (
                  <MotionDiv key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideUp} className="space-y-6">
                    {imageElement}
                    <div className="text-center max-w-2xl mx-auto">
                      {section.heading && <h3 className="text-2xl font-semibold mb-4 text-foreground leading-snug">{(section.heading || "").replace(/\.\s*$/, "")}</h3>}
                      {section.text && <p className="text-base text-muted-foreground leading-7 antialiased">{section.text}</p>}
                    </div>
                  </MotionDiv>
                );
              }

              return (
                <MotionDiv key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className={`flex flex-col ${imageFirst ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12 items-center`}>
                  <MotionDiv variants={isMobile ? mobileSlide : fadeSlide(imageFirst)} className="w-full md:w-[55%]">
                    {imageElement || (
                      <div className="w-full aspect-[4/3] rounded-xl bg-card border border-border flex items-center justify-center">
                        <p className="text-zinc-500">No image</p>
                      </div>
                    )}
                  </MotionDiv>
                  <MotionDiv variants={isMobile ? mobileSlide : fadeSlide(!imageFirst)} className="w-full md:w-[45%] flex flex-col">
                    {textElement}
                  </MotionDiv>
                </MotionDiv>
              );
            })}
          </div>
        )}
      </BlueprintBox>

      {/* Back to narrow column for references & author */}
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 relative">
        <article className="w-full">
          {/* ---------------- 4. REFERENCES ---------------- */}
          {post.references && post.references.length > 0 && (
            <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="mt-10 rounded-xl border border-border bg-card/50 overflow-hidden">
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
                  const isTwitter = /twitter\.com|x\.com/i.test(url);
                  const isLinkedIn = /linkedin\.com/i.test(url);
                  const isGitHub = /github\.com/i.test(url);

                  let IconComponent = ExternalLink;
                  let platformLabel = 'Visit Website';
                  let platformColor = 'text-emerald-500';

                  if (isYouTube) { IconComponent = Youtube; platformLabel = 'Watch on YouTube'; platformColor = 'text-red-400'; }
                  else if (isInstagram) { IconComponent = Instagram; platformLabel = 'View on Instagram'; platformColor = 'text-pink-400'; }
                  else if (isFacebook) { IconComponent = Facebook; platformLabel = 'View on Facebook'; platformColor = 'text-blue-400'; }
                  else if (isTwitter) { IconComponent = Twitter; platformLabel = 'View on X'; platformColor = 'text-slate-300'; }
                  else if (isWhatsApp) { IconComponent = MessageCircle; platformLabel = 'Open in WhatsApp'; platformColor = 'text-green-400'; }
                  else if (isLinkedIn) { IconComponent = ExternalLink; platformLabel = 'View on LinkedIn'; platformColor = 'text-sky-400'; }
                  else if (isGitHub) { IconComponent = ExternalLink; platformLabel = 'View on GitHub'; platformColor = 'text-neutral-300'; }

                  return (
                    <a key={idx} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-6 py-4 hover:bg-emerald-500/5 transition-colors group">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-muted flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors`}>
                        <IconComponent className={`w-5 h-5 ${platformColor}`} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-emerald-500 transition-colors">{ref.title || platformLabel}</p>
                        <p className={`text-xs ${platformColor}`}>{platformLabel}</p>
                        {ref.description && <p className="text-xs text-muted-foreground/70 mt-0.5 line-clamp-1">{ref.description}</p>}
                      </div>
                      <ExternalLink className="w-4 h-4 text-muted-foreground/50 flex-shrink-0 group-hover:text-emerald-500 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </MotionDiv>
          )}

          {/* ---------------- 6. TAGS ---------------- */}
          {post.tags && post.tags.length > 0 && (
            <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="mt-12 flex flex-wrap gap-2">
              {post.tags.map((tag: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold tracking-wide text-emerald-500 hover:bg-emerald-500/20 transition-colors cursor-default">
                  #{tag}
                </span>
              ))}
            </MotionDiv>
          )}

          {/* Feedback Widget */}
          <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="mt-12 border-t border-border pt-8">
            <FeedbackWidget pageTitle={extractLocaleString(post.title, lang)} pageType="blog" />
          </MotionDiv>

          {/* Share Buttons */}
          <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="mt-12 flex flex-wrap items-center justify-center gap-4 border-t border-border pt-8">
            <span className="text-sm font-semibold text-muted-foreground mr-2">Share this post:</span>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(extractLocaleString(post.title, lang) || "Check out this post")}&url=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 px-4 py-2 text-sm font-medium transition-colors text-slate-300">
              <Twitter className="w-4 h-4" /> Twitter/X
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-sky-600/30 bg-sky-600/10 hover:bg-sky-600/20 px-4 py-2 text-sm font-medium transition-colors text-sky-500">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          </MotionDiv>

          {/* ---------------- 7. AUTHOR FOOTER ---------------- */}
          {(() => {
            // Build authors list: prefer new multi-author array, fallback to legacy single author
            const authorsList = (post.authors && post.authors.length > 0)
              ? post.authors.slice(0, 3)
              : [{
                  name: post.author || 'ClassGrid Team',
                  image: post.authorImage,
                  profileLink: post.authorProfileLink,
                  bio: post.authorBio,
                }];

            return (
              <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="mt-12 border-t border-border pt-10 pb-6">
                {authorsList.map((authorItem: any, idx: number) => {
                  const aName = authorItem.name || 'ClassGrid Team';
                  const aImage = authorItem.image;
                  const aLink = authorItem.profileLink;
                  const aBio = authorItem.bio || (idx === 0 ? "Exploring how modern technology integrates directly into global education. Dedicated to bringing scalable solutions to administration through ClassGrid." : undefined);

                  const avatarEl = (
                    <Avatar className="h-20 w-20 ring-2 ring-emerald-500/20 hover:ring-emerald-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                      {aImage && <AvatarImage src={urlFor(aImage).url()} alt={aName} className="object-cover" />}
                      <AvatarFallback className="bg-emerald-500/10 text-emerald-500 text-2xl font-bold">{aName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  );

                  return (
                    <div key={idx}>
                      {idx > 0 && <div className="my-8 border-t border-border/50" />}
                      <div className={`flex flex-col md:flex-row items-center md:items-start gap-6 ${idx > 0 ? '' : ''}`}>
                        {aLink ? <a href={aLink} target="_blank" rel="noreferrer" title={`Visit ${aName}'s profile`}>{avatarEl}</a> : avatarEl}
                        <div className="text-center md:text-left">
                          <h3 className="text-xl font-bold text-foreground flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                            {aName}
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full w-fit">Content Writer</span>
                          </h3>
                          {aBio && (
                            <p className="text-base text-muted-foreground mt-2 max-w-lg leading-relaxed">
                              {aBio}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </MotionDiv>
            );
          })()}

          {/* ---------------- PREV / NEXT NAVIGATION ---------------- */}
          {(post.prevPost || post.nextPost) && (
            <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-border pt-8 pb-4">
              <div className="w-full sm:w-1/2 flex justify-start">
                {post.prevPost && (
                  <Link href={buildLangHref(`/blog/${getSlug(post.prevPost.slug)}`, lang)} className="group flex flex-col items-start text-left">
                    <span className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider flex items-center"><ChevronLeft className="w-3 h-3 mr-1 transition-transform group-hover:-translate-x-1" /> Previous Post</span>
                    <span className="text-base font-semibold text-foreground group-hover:text-emerald-500 transition-colors line-clamp-2">{extractLocaleString(post.prevPost.title, lang) || "Previous"}</span>
                  </Link>
                )}
              </div>
              <div className="w-full sm:w-1/2 flex justify-end text-right">
                {post.nextPost && (
                  <Link href={buildLangHref(`/blog/${getSlug(post.nextPost.slug)}`, lang)} className="group flex flex-col items-end text-right">
                    <span className="text-xs text-muted-foreground mb-1 uppercase font-semibold tracking-wider flex items-center">Next Post <ChevronRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" /></span>
                    <span className="text-base font-semibold text-foreground group-hover:text-emerald-500 transition-colors line-clamp-2">{extractLocaleString(post.nextPost.title, lang) || "Next"}</span>
                  </Link>
                )}
              </div>
            </MotionDiv>
          )}
        </article>
      </div>

      {/* ── SUBSCRIBE STRIP ── */}
      <SubscribeStrip heading="Enjoyed this blog? Get more like it" />

      {/* ---------------- 8. RELATED BLOGS ---------------- */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="border-t border-border bg-background pt-20 pb-24 mt-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-foreground">Related Blogs</h2>
                <p className="text-muted-foreground">Keep exploring education and tech</p>
              </div>
              <div className="flex items-center gap-3">
                {relatedPosts.length > RELATED_PAGE_SIZE && (
                  <div className="flex items-center gap-2 mr-2">
                    <Button variant="outline" size="icon" onClick={() => setRelatedPage(p => Math.max(0, p - 1))} disabled={relatedPage === 0} className="rounded-full h-10 w-10 border-border"><ChevronLeft className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => setRelatedPage(p => Math.min(Math.ceil(relatedPosts.length / RELATED_PAGE_SIZE) - 1, p + 1))} disabled={relatedPage >= Math.ceil(relatedPosts.length / RELATED_PAGE_SIZE) - 1} className="rounded-full h-10 w-10 border-border"><ChevronRight className="w-4 h-4" /></Button>
                  </div>
                )}
                <Link href={buildLangHref("/blog", lang)}>
                  <Button variant="outline" className="hidden md:flex rounded-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">View All Blogs</Button>
                </Link>
              </div>
            </MotionDiv>

            <MotionHr initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="border-t border-surface-container-low mb-12 origin-left" />

            <MotionDiv className="overflow-hidden relative min-h-[400px] py-4 -mx-4 px-4">
              <AnimatePresence mode="wait">
                <MotionDiv key={relatedPage} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
                  {relatedPosts.slice(relatedPage * RELATED_PAGE_SIZE, (relatedPage + 1) * RELATED_PAGE_SIZE).map((relatedPost: any, i: number) => (
                    <Link key={relatedPost._id || i} href={buildLangHref(`/blog/${getSlug(relatedPost.slug)}`, lang)}>
                      <MotionDiv variants={slideUp} whileHover={{ scale: 1.02, y: -4 }} className="group h-full rounded-2xl bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-surface-container-low hover:border-emerald-500/30 flex flex-col">
                        <div className="w-full h-56 bg-surface-container-lowest relative overflow-hidden">
                          {relatedPost.coverImage ? (
                            <Image src={urlFor(relatedPost.coverImage).url()} alt={extractLocaleString(relatedPost.title, lang)} fill className="object-contain p-1" />
                          ) : (
                            <div className="w-full h-full bg-emerald-500/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors duration-500"><span className="text-emerald-500/30 text-3xl font-bold">BLOG</span></div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-grow">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-semibold tracking-wider text-emerald-500 uppercase">{extractLocaleString(relatedPost.category, lang) || "Insight"}</span>
                            <span className="text-xs text-muted-foreground">{relatedPost.publishedAt ? formatDate(new Date(relatedPost.publishedAt), "MMM dd, yyyy") : "Mar 2024"}</span>
                          </div>
                          <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-emerald-500 transition-colors line-clamp-2">{(extractLocaleString(relatedPost.title, lang) || "").replace(/\.\s*$/, "")}</h3>
                          {relatedPost.excerpt && <p className="text-muted-foreground text-base line-clamp-2 mb-6 flex-grow">{extractLocaleString(relatedPost.excerpt, lang)}</p>}
                          <div className="flex items-center text-sm font-medium text-emerald-500 group-hover:translate-x-1 transition-transform mt-auto">Read <ArrowRight className="w-4 h-4 ml-1.5" /></div>
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
