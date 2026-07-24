"use client";

import { useState, useEffect, useMemo } from "react";
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
import { SubscribeStrip } from "@/components/shared/SubscribeStrip";
import { FeedbackWidget } from "@/components/shared/FeedbackWidget";
import { buildLangHref, extractLocaleString, type SupportedLang } from "@/lib/locale";
import { BlueprintBox, BlueprintSection } from "@/components/ui/BlueprintBox";
import { ScrollSpyTOC } from "@/components/shared/ScrollSpyTOC";
import { cn } from "@/lib/utils";
// import GoogleOneTap from "@/components/auth/GoogleOneTap";

const MotionDiv = motion.div as any;
const MotionHr = motion.hr as any;

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

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
  const [activeSection, setActiveSection] = useState<string>("blog-intro");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
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
    if (!localStorage.getItem(viewKey)) {
      fetch("/api/blog/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: slugId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (typeof data.count === "number") setViewCount(data.count);
          localStorage.setItem(viewKey, "true");
        })
        .catch(console.error);
    };
    return () => window.removeEventListener('resize', checkMobile);
  }, [post]);

  // ── Build TOC items from contentSections headings ──
  const tocItems = useMemo(() => {
    const items: { id: string; label: string }[] = [
      { id: "blog-intro", label: "Introduction" },
      { id: "blog-content", label: "Article" },
    ];
    if (Array.isArray(post?.contentSections)) {
      post.contentSections.forEach((section: any, i: number) => {
        if (section.heading) {
          const slug = `section-${i}-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
          items.push({ id: slug, label: section.heading.replace(/\.\s*$/, '') });
        }
      });
    }
    if (post?.references && post.references.length > 0) {
      items.push({ id: "blog-references", label: "References" });
    }
    items.push({ id: "blog-author", label: "Author" });
    return items;
  }, [post]);

  // ── Scroll Spy ──
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );
    tocItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [tocItems]);

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
      {/* <GoogleOneTap /> */}
      {/* Progress Reading Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* ── FULL-WIDTH COVER IMAGE HERO ── */}
      {post.coverImage && (
        <section className="relative w-full bg-background overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 py-8">
            <div className="relative w-full aspect-video max-h-[480px] rounded-2xl overflow-hidden border border-slate-300 dark:border-border/30 bg-slate-50 dark:bg-zinc-900 flex items-center justify-center shadow-md dark:shadow-none">
              <Image
                src={urlFor(post.coverImage).url()}
                alt={post.title || 'Blog cover image'}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>
          </div>
        </section>
      )}

      {/* Wrap TOC and main content in a relative div to constrain the absolute TOC */}
      <div className="relative w-full">
        <ScrollSpyTOC tocItems={tocItems} activeSection={activeSection} />

        {/* Blueprint-framed article body */}
        <div className="relative mx-auto max-w-4xl">

      <BlueprintBox maxWidth="max-w-4xl" className="pt-2 pb-16">
        <article id="blog-intro" className="mt-0 w-full px-4 sm:px-8 md:px-12">
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
                    <span>{Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(viewCount)} views</span>
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
                <div className="relative px-6 py-5 sm:px-8 sm:py-6 bg-slate-50/50 dark:bg-white/[0.02] border border-slate-300 dark:border-white/[0.05] rounded-3xl shadow-sm backdrop-blur-md text-left">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-emerald-400/0 via-emerald-500 to-emerald-400/0 rounded-full" />
                  <p className="text-[1.05rem] sm:text-[1.1rem] leading-relaxed text-foreground/80 font-medium">
                    {extractLocaleString(post.excerpt, lang)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ---------------- 3. BLOG CONTENT ---------------- */}
          <div id="blog-content" className="my-8">
            <PortableTextBlock value={post.body} showAccentBars={false} />
          </div>
        </article>

        {/* ── VISUAL CONTENT SECTIONS (inside BlueprintBox) ── */}
        {post.contentSections && post.contentSections.length > 0 && (
          <div className="py-12 px-4 sm:px-6 space-y-16 md:space-y-20">
            {post.contentSections.map((section: any, i: number) => {
              const layout = section.layout || 'left';
              const mediaType = section.mediaType || 'image';
              const imageFirst = layout === 'left';

              const mediaElement = mediaType === 'video' && section.videoUrl ? (
                <div className={`relative ${layout === 'center' ? 'aspect-video' : 'aspect-[4/3]'} rounded-xl overflow-hidden bg-slate-100 dark:bg-muted shadow-2xl ring-1 ring-slate-300 dark:ring-white/10`}>
                  <video
                    src={section.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : section.imageUrl ? (
                <div className={`relative ${layout === 'center' ? 'aspect-video' : 'aspect-[4/3]'} rounded-xl overflow-hidden bg-slate-100 dark:bg-muted shadow-2xl ring-1 ring-slate-300 dark:ring-white/10`}>
                  <Image
                    src={section.imageUrl}
                    alt={section.imageAlt || section.heading || 'Blog section media'}
                    fill
                    className={`object-cover transition-transform duration-700 ${!isMobile ? 'hover:scale-105' : ''}`}
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

              const sectionId = section.heading
                ? `section-${i}-${section.heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`
                : `section-${i}`;

              const topTextElement = section.topText ? (
                <p className="text-base text-muted-foreground leading-7 antialiased mb-4 md:mb-6">{section.topText}</p>
              ) : null;
              
              const bottomTextElement = section.bottomText ? (
                <p className="text-base text-muted-foreground leading-7 antialiased mt-4 md:mt-6">{section.bottomText}</p>
              ) : null;

              if (layout === 'center') {
                return (
                  <MotionDiv id={sectionId} key={`center-${i}-${isMobile}`} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={slideUp} className="space-y-6">
                    {topTextElement}
                    {mediaElement}
                    <div className="text-center max-w-2xl mx-auto">
                      {section.heading && <h3 className="text-2xl font-semibold mb-4 text-foreground leading-snug">{(section.heading || "").replace(/\.\s*$/, "")}</h3>}
                      {section.text && <p className="text-base text-muted-foreground leading-7 antialiased">{section.text}</p>}
                    </div>
                    {bottomTextElement}
                  </MotionDiv>
                );
              }

              return (
                <MotionDiv id={sectionId} key={`split-${i}-${isMobile}`} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="flex flex-col gap-6 md:gap-8">
                  {topTextElement}
                  <div className={`flex flex-col ${imageFirst ? 'md:flex-row' : 'md:flex-row-reverse'} gap-6 md:gap-12 items-center`}>
                    <MotionDiv variants={isMobile ? mobileSlide : fadeSlide(imageFirst)} className="w-full md:w-[55%]">
                      {mediaElement || (
                        <div className="w-full aspect-[4/3] rounded-xl bg-card border border-border flex items-center justify-center">
                          <p className="text-zinc-500">No media</p>
                        </div>
                      )}
                    </MotionDiv>
                    <MotionDiv variants={isMobile ? mobileSlide : fadeSlide(!imageFirst)} className="w-full md:w-[45%] flex flex-col">
                      {textElement}
                    </MotionDiv>
                  </div>
                  {bottomTextElement}
                </MotionDiv>
              );
            })}
          </div>
        )}
      </BlueprintBox>
        </div> {/* close max-w-4xl */}
      </div> {/* <-- CLOSE RELATIVE WRAPPER FOR STICKY TOC HERE SO IT STOPS BEFORE REFERENCES */}

      {/* Back to narrow column for references & author */}
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 relative">
        <article className="w-full">
          {/* ---------------- 4. REFERENCES ---------------- */}
          {post.references && post.references.length > 0 && (
            <MotionDiv id="blog-references" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="mt-10 rounded-xl border border-slate-300 dark:border-border bg-slate-50 dark:bg-card/50 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-300 dark:border-white/10">
                <h3 className="text-base font-semibold text-foreground flex items-center">
                  <Link2 className="w-4 h-4 mr-2 text-emerald-500" /> References & Sources
                </h3>
              </div>
              <div className="divide-y divide-slate-300 dark:divide-white/10">
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
          <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="mt-12 flex flex-col items-center justify-center gap-4 border-t border-border pt-8 sm:flex-row">
            <span className="text-sm font-semibold text-muted-foreground sm:mr-2">Share this post:</span>
            <div className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto">
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(extractLocaleString(post.title, lang) || "Check out this post")}&url=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700/50 dark:bg-slate-800/20 dark:hover:bg-slate-800/40 px-4 py-2 text-sm font-medium transition-colors text-slate-700 dark:text-slate-300 flex-1 sm:flex-auto justify-center">
                <Twitter className="w-4 h-4" /> <span className="hidden xs:inline">Twitter</span>
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-sky-300 bg-sky-50 hover:bg-sky-100 dark:border-sky-600/30 dark:bg-sky-600/10 dark:hover:bg-sky-600/20 px-4 py-2 text-sm font-medium transition-colors text-sky-700 dark:text-sky-500 flex-1 sm:flex-auto justify-center">
                <Linkedin className="w-4 h-4" /> <span className="hidden xs:inline">LinkedIn</span>
              </a>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Check out this blog post from Classgrid:\n${canonicalUrl}`)}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-600/30 dark:bg-emerald-600/10 dark:hover:bg-emerald-600/20 px-4 py-2 text-sm font-medium transition-colors text-emerald-700 dark:text-emerald-500 flex-1 sm:flex-auto justify-center">
                <WhatsappIcon className="w-4 h-4" /> <span className="hidden xs:inline">WhatsApp</span>
              </a>
            </div>
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
              <MotionDiv id="blog-author" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="mt-12 border-t border-border pt-10 pb-6">
                <div className="text-center mb-8">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">
                    {authorsList.length > 1 ? 'Content Writers' : 'Content Writer'}
                  </span>
                </div>
                <div className={`flex flex-wrap items-start justify-center ${authorsList.length > 1 ? 'gap-10 md:gap-14' : 'gap-6'}`}>
                  {authorsList.map((authorItem: any, idx: number) => {
                    const aName = authorItem.name || 'ClassGrid Team';
                    const aImage = authorItem.image;
                    const aLink = authorItem.profileLink;
                    const aBio = authorItem.bio;

                    const avatarEl = (
                      <Avatar className="h-20 w-20 ring-2 ring-emerald-500/20 hover:ring-emerald-500 hover:scale-105 transition-all duration-300 cursor-pointer">
                        {aImage && <AvatarImage src={urlFor(aImage).url()} alt={aName} className="object-cover" />}
                        <AvatarFallback className="bg-emerald-500/10 text-emerald-500 text-2xl font-bold">{aName.charAt(0)}</AvatarFallback>
                      </Avatar>
                    );

                    return (
                      <div key={idx} className="flex flex-col items-center text-center max-w-[200px]">
                        {aLink ? <a href={aLink} target="_blank" rel="noreferrer" title={`Visit ${aName}'s profile`}>{avatarEl}</a> : avatarEl}
                        <h3 className="text-base font-bold text-foreground mt-3">{aName}</h3>
                        {aBio && (
                          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-3">
                            {aBio}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </MotionDiv>
            );
          })()}

          {/* ---------------- PREV / NEXT NAVIGATION (Removed) ---------------- */}
        </article>
      </div>

      {/* ── MOBILE STICKY TOC — visible below xl only ── */}
      <div className="xl:hidden">
        {mobileTocOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileTocOpen(false)}
          />
        )}
        {mobileTocOpen && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a] border-t border-white/10 rounded-t-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span className="text-[13px] font-semibold text-white tracking-wide">On this page</span>
              <button
                onClick={() => setMobileTocOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Close table of contents"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-5 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
              {tocItems.map((item) => (
                <a
                  key={`mobile-toc-${item.id}`}
                  href={`#${item.id}`}
                  onClick={() => setMobileTocOpen(false)}
                  className={cn(
                    "block px-3 py-2.5 rounded-lg text-[14px] transition-colors",
                    activeSection === item.id
                      ? "bg-emerald-500/15 text-emerald-400 font-medium"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div className="pb-6" />
          </div>
        )}
        <button
          onClick={() => setMobileTocOpen((v) => !v)}
          className="fixed bottom-5 right-4 z-40 flex items-center gap-2 rounded-full bg-[#111] border border-white/15 px-4 py-2.5 text-[13px] font-medium text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all hover:border-emerald-500/40 hover:bg-[#1a1a1a] active:scale-95"
          aria-label="Open table of contents"
        >
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
          </svg>
          On this page
        </button>
      </div>

      {/* ── SUBSCRIBE STRIP ── */}
      <SubscribeStrip heading="Enjoyed this blog? Get more like it" />

      {/* ---------------- 8. RELATED BLOGS ---------------- */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="border-t border-slate-300 dark:border-border bg-background pt-20 pb-24 mt-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <MotionDiv initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideUp} className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-foreground">Related Blogs</h2>
                <p className="text-muted-foreground">Keep exploring education and tech</p>
              </div>
              <div className="flex items-center gap-3">
                {relatedPosts.length > RELATED_PAGE_SIZE && (
                  <div className="flex items-center gap-2 mr-2">
                    <Button variant="outline" size="icon" onClick={() => setRelatedPage(p => Math.max(0, p - 1))} disabled={relatedPage === 0} className="rounded-full h-10 w-10 border-slate-300 dark:border-border"><ChevronLeft className="w-4 h-4" /></Button>
                    <Button variant="outline" size="icon" onClick={() => setRelatedPage(p => Math.min(Math.ceil(relatedPosts.length / RELATED_PAGE_SIZE) - 1, p + 1))} disabled={relatedPage >= Math.ceil(relatedPosts.length / RELATED_PAGE_SIZE) - 1} className="rounded-full h-10 w-10 border-slate-300 dark:border-border"><ChevronRight className="w-4 h-4" /></Button>
                  </div>
                )}
                <Link href={buildLangHref("/blog", lang)}>
                  <Button variant="outline" className="hidden md:flex rounded-full border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10">View All Blogs</Button>
                </Link>
              </div>
            </MotionDiv>

            <MotionHr initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="border-t border-slate-300 dark:border-white/10 mb-12 origin-left" />

            <MotionDiv className="overflow-hidden relative min-h-[400px] py-4 -mx-4 px-4">
              <AnimatePresence mode="wait">
                <MotionDiv key={relatedPage} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full">
                  {relatedPosts.slice(relatedPage * RELATED_PAGE_SIZE, (relatedPage + 1) * RELATED_PAGE_SIZE).map((relatedPost: any, i: number) => (
                    <Link key={relatedPost._id || i} href={buildLangHref(`/blog/${getSlug(relatedPost.slug)}`, lang)}>
                      <MotionDiv variants={slideUp} whileHover={{ scale: 1.02, y: -4 }} className="group h-full rounded-2xl bg-surface-container-lowest overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-300 dark:border-white/10 hover:border-emerald-500/30 flex flex-col">
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
