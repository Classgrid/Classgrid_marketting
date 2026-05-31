"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";
import { ImageGallery } from "@/components/shared/ImageGallery";
import { FeedbackWidget } from "@/components/shared/FeedbackWidget";

type Metric = {
  _key: string;
  value: string;
  suffix?: string;
  label: string;
};

type CaseStudyData = {
  title: string;
  slug: string;
  clientName: string;
  clientLogoUrl?: string;
  year: string;
  institutionType: string;
  category: string;
  modules: string[];
  summary: string;
  overview?: string;
  overviewDivider?: boolean;
  heroImageUrl: string;
  metrics: Metric[];
  championName?: string;
  championRole?: string;
  championHeadshotUrl?: string;
  championQuote?: string;
  championSocialLink?: string;
  champions?: { name: string; role?: string; headshotUrl?: string; socialLink?: string }[];
  overview?: string;
  conclusion?: string;
  body?: any[];
  galleryImageUrls?: string[];
  nextCaseStudy?: {
    title: string;
    slug: string;
    clientName: string;
    category: string;
    thumbnailUrl: string;
  };
};

export function CaseStudyDetailClient({ data }: { data: CaseStudyData }) {

  return (
    <article className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30">


      {/* 2. HERO */}
      <section className="relative w-full h-[72vh] min-h-[520px] max-h-[860px] bg-zinc-950 overflow-hidden">
        {data.heroImageUrl && (
          <>
            {/* Blurred ambient backdrop — fills empty space for portrait photos */}
            <Image
              src={data.heroImageUrl}
              alt=""
              fill
              className="object-cover object-center scale-110 blur-2xl opacity-40 saturate-50"
              aria-hidden="true"
              priority
            />
            {/* Sharp image — object-contain so portrait photos are NEVER cropped */}
            <Image
              src={data.heroImageUrl}
              alt={data.title}
              fill
              className="object-contain object-center"
              priority
            />
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl"
            >
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                  {data.institutionType}
                </span>
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">·</span>
                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                  {data.category.replace(/-/g, ' ')}
                </span>
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">·</span>
                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
                  {data.year}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                {data.title}
              </h1>
              <p className="text-lg md:text-xl text-zinc-300 font-medium">
                {data.clientName}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUICK FACTS STRIP */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-5 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Client</span>
              <span className="text-foreground font-semibold">{data.clientName}</span>
            </div>
            <span className="hidden sm:block w-px h-4 bg-border"></span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Date</span>
              <span className="text-foreground font-semibold">{data.year}</span>
            </div>
            <span className="hidden sm:block w-px h-4 bg-border"></span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Type</span>
              <span className="text-foreground font-semibold capitalize">{data.institutionType}</span>
            </div>
            {data.modules && data.modules.length > 0 && (
              <>
                <span className="hidden sm:block w-px h-4 bg-border"></span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-muted-foreground font-medium uppercase tracking-widest text-xs">Modules</span>
                  <div className="flex flex-wrap gap-1.5">
                    {data.modules.map(m => (
                      <span key={m} className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium capitalize border border-emerald-500/20">
                        {m.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      {data.overview && (
        <section className="pt-20 pb-4">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-1 bg-emerald-500 mb-8"></div>
              <p className="text-xl md:text-2xl text-zinc-300 leading-9 font-light antialiased">
                {data.overview}
              </p>
            </motion.div>

            {data.overviewDivider && (
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="mt-16 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"
              />
            )}
          </div>
        </section>
      )}

      {/* STORYBLOCKS */}
      {data.body && data.body.length > 0 && (() => {
        // parseStoryBlocks — treats image and video as "media" for the visual side
        const blocks: { media: any; textBlocks: any[] }[] = [];
        let currentBlock = { media: null as any, textBlocks: [] as any[] };
        data.body!.forEach((item) => {
          // Every H2 heading forces a new layout block to prevent accidental bundling
          if (item._type === "block" && item.style === "h2") {
            if (currentBlock.textBlocks.length > 0 || currentBlock.media) {
              blocks.push({ ...currentBlock });
              currentBlock = { media: null, textBlocks: [] };
            }
            currentBlock.textBlocks.push(item);
          }
          else if (item._type === "image" || item._type === "video") {
            if (!currentBlock.media && currentBlock.textBlocks.length > 0) {
              currentBlock.media = item;
              blocks.push({ ...currentBlock });
              currentBlock = { media: null, textBlocks: [] };
            } else if (!currentBlock.media) {
              currentBlock.media = item;
            } else {
              blocks.push({ ...currentBlock });
              currentBlock = { media: item, textBlocks: [] };
            }
          } else {
            // Tables, paragraphs, lists, quotes
            currentBlock.textBlocks.push(item);
          }
        });
        if (currentBlock.textBlocks.length > 0 || currentBlock.media) {
          blocks.push(currentBlock);
        }

        const fadeSlide = (fromLeft: boolean) => ({
          hidden: { opacity: 0, x: fromLeft ? -40 : 40 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
        });

        // Helper to extract YouTube embed URL
        const getYouTubeEmbedUrl = (url: string) => {
          const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
          return match ? `https://www.youtube.com/embed/${match[1]}` : null;
        };

        // Shared marks and types for both modes
        const sharedMarks = {
          strong: ({ children }: any) => <strong className="font-semibold text-white">{children}</strong>,
          em: ({ children }: any) => <em className="italic text-zinc-200">{children}</em>,
          code: ({ children }: any) => (
            <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[14px] font-medium text-emerald-400">
              {children}
            </code>
          ),
          link: ({ children, value }: any) => (
            <a className="font-medium text-emerald-400 underline-offset-4 hover:underline transition-colors" href={value?.href} target="_blank" rel="noreferrer">
              {children}
            </a>
          ),
        };

        const sharedTypes = {
          table: ({ value }: any) => {
            if (!value?.rows?.length) return null;
            return (
              <div className="my-8 w-full overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="border-b-2 border-emerald-500/40 bg-emerald-500/10">
                    <tr>
                      {value.rows[0].cells.map((cell: any, i: number) => (
                        <th key={i} className="px-5 py-3.5 font-semibold text-emerald-400 border-r border-border last:border-r-0">{cell}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {value.rows.slice(1).map((row: any, i: number) => (
                      <tr key={i} className="transition-colors hover:bg-emerald-500/5">
                        {row.cells.map((cell: any, j: number) => (
                          <td key={j} className="px-5 py-3.5 text-zinc-300 leading-relaxed border-r border-border/40 last:border-r-0">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          },
          divider: ({ value }: any) => {
            const style = value?.style || 'Solid';
            if (style === 'Dashed') {
              return <hr className="my-12 border-t-2 border-dashed border-border/60" />;
            } else if (style === 'Faded') {
              return <div className="my-12 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />;
            }
            return <hr className="my-12 border-t border-border/80" />;
          },
        };

        // COMPACT — for text paired with image/video (restrained, short)
        const ptCompact = {
          block: {
            h2: ({ children }: any) => <h2 className="text-2xl font-semibold mb-4 text-white leading-snug first:mt-0">{children}</h2>,
            h3: ({ children }: any) => <h3 className="text-xl font-semibold mb-3 text-white first:mt-0">{children}</h3>,
            h4: ({ children }: any) => <h4 className="text-lg font-medium mb-2 text-white first:mt-0">{children}</h4>,
            normal: ({ children }: any) => <p className="text-base text-zinc-300 mb-5 leading-7 antialiased">{children}</p>,
            blockquote: ({ children }: any) => (
              <blockquote className="my-6 border-l-2 border-emerald-500 pl-4 text-base leading-7 text-zinc-200 italic">{children}</blockquote>
            ),
          },
          marks: sharedMarks,
          list: {
            bullet: ({ children }: any) => <ul className="mt-3 mb-5 list-none space-y-2">{children}</ul>,
            number: ({ children }: any) => <ol className="mt-3 mb-5 list-decimal space-y-2 pl-5 text-zinc-300">{children}</ol>,
          },
          listItem: {
            bullet: ({ children }: any) => (
              <li className="relative pl-5 text-base leading-7 text-zinc-300">
                <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-emerald-500 block" />
                {children}
              </li>
            ),
            number: ({ children }: any) => <li className="pl-1 text-base leading-7 text-zinc-300">{children}</li>,
          },
          types: sharedTypes,
        };

        // FULL — for standalone text blocks (spacious, editorial)
        const ptFull = {
          block: {
            h2: ({ children }: any) => <h2 className="text-3xl md:text-4xl font-serif font-bold mt-12 mb-6 text-white leading-tight first:mt-0">{children}</h2>,
            h3: ({ children }: any) => <h3 className="text-2xl md:text-3xl font-serif font-semibold mt-10 mb-5 text-white leading-snug first:mt-0">{children}</h3>,
            h4: ({ children }: any) => <h4 className="text-xl font-semibold mt-8 mb-4 text-white first:mt-0">{children}</h4>,
            normal: ({ children }: any) => <p className="text-base md:text-lg text-zinc-300 mb-5 leading-7 md:leading-9 antialiased">{children}</p>,
            blockquote: ({ children }: any) => (
              <blockquote className="my-10 rounded-r-xl border-l-2 border-emerald-500 bg-emerald-500/5 py-5 pl-6 pr-5 text-lg leading-8 text-zinc-200 italic">{children}</blockquote>
            ),
          },
          marks: sharedMarks,
          list: {
            bullet: ({ children }: any) => <ul className="mt-5 mb-8 list-none space-y-4">{children}</ul>,
            number: ({ children }: any) => <ol className="mt-5 mb-8 list-decimal space-y-4 pl-6 text-zinc-300">{children}</ol>,
          },
          listItem: {
            bullet: ({ children }: any) => (
              <li className="relative pl-7 text-lg leading-8 text-zinc-300">
                <span className="absolute left-0 top-[0.65em] h-2 w-2 rounded-full bg-emerald-500 block" />
                {children}
              </li>
            ),
            number: ({ children }: any) => <li className="pl-2 text-lg leading-8 text-zinc-300">{children}</li>,
          },
          types: sharedTypes,
        };

        return (
          <section className="pt-8 pb-24">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
              {blocks.map((block, i) => {
                const layoutPref = block.media?.layout || 'left';
                const isCenterSplit = layoutPref === 'center' && block.media && block.textBlocks.length >= 2;
                const imageFirst = layoutPref === 'left' || (layoutPref === 'center' && !isCenterSplit);
                let mediaElement = null;

                if (block.media) {
                  if (block.media._type === "video") {
                    const videoSrc = block.media.videoUrl || block.media.url;
                    const youtubeEmbed = videoSrc ? getYouTubeEmbedUrl(videoSrc) : null;

                    if (youtubeEmbed) {
                      mediaElement = (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                          <iframe
                            src={youtubeEmbed}
                            title={block.media.caption || "Video"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      );
                    } else if (videoSrc) {
                      mediaElement = (
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
                          <video
                            src={videoSrc}
                            controls
                            className="absolute inset-0 w-full h-full object-contain"
                            playsInline
                          />
                        </div>
                      );
                    }
                  } else {
                    let imgUrl = null;
                    if (block.media.url) {
                      imgUrl = block.media.url;
                    } else if (block.media.asset?._ref?.startsWith("image-")) {
                      try { imgUrl = urlFor(block.media).url(); } catch (e) { /* skip */ }
                    }
                    if (imgUrl) {
                      mediaElement = (
                        <div className="relative rounded-xl overflow-hidden bg-muted shadow-2xl ring-1 ring-white/10">
                          <Image
                            src={imgUrl}
                            alt={block.media.caption || "Case study section image"}
                            width={1200}
                            height={800}
                            className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, 55vw"
                          />
                        </div>
                      );
                    }
                  }
                }

                // Text-only block — centered, max-width constrained
                if (!mediaElement && block.textBlocks.length > 0) {
                  return (
                    <motion.div
                      key={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
                      className="max-w-2xl mx-auto"
                    >
                      <PortableText value={block.textBlocks} components={ptFull} />
                    </motion.div>
                  );
                }

                // ─── CENTER-SPLIT LAYOUT (OpenAI style) ───
                if (isCenterSplit && mediaElement) {
                  const midpoint = Math.ceil(block.textBlocks.length / 2);
                  const leftText = block.textBlocks.slice(0, midpoint);
                  const rightText = block.textBlocks.slice(midpoint);

                  return (
                    <motion.div
                      key={i}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr_1fr] gap-6 md:gap-10 items-center"
                    >
                      {/* Left Text */}
                      <motion.div
                        variants={fadeSlide(true)}
                        className="flex flex-col justify-center md:text-right"
                      >
                        <PortableText value={leftText} components={ptCompact} />
                      </motion.div>

                      {/* Center Media */}
                      <motion.div
                        variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
                      >
                        {mediaElement}
                      </motion.div>

                      {/* Right Text */}
                      <motion.div
                        variants={fadeSlide(false)}
                        className="flex flex-col justify-center"
                      >
                        <PortableText value={rightText} components={ptCompact} />
                      </motion.div>
                    </motion.div>
                  );
                }

                // ─── STANDARD ALTERNATING LAYOUT ───
                return (
                  <motion.div
                    key={i}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className={`flex flex-col ${imageFirst ? "md:flex-row" : "md:flex-row-reverse"} gap-10 md:gap-16 items-center`}
                  >
                    {/* Media Side — dominant (60%) */}
                    <motion.div
                      variants={fadeSlide(imageFirst)}
                      className="w-full md:w-[60%]"
                    >
                      {mediaElement || (
                        <div className="w-full aspect-[4/3] rounded-xl bg-card border border-border flex items-center justify-center">
                          <p className="text-zinc-500">No image</p>
                        </div>
                      )}
                    </motion.div>

                    {/* Text Side — restrained (40%), narrow */}
                    <motion.div
                      variants={fadeSlide(!imageFirst)}
                      className="w-full md:w-[40%] flex flex-col max-w-sm"
                    >
                      <PortableText value={block.textBlocks} components={ptCompact} />
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        );
      })()}

      {/* CONCLUSION */}
      {data.conclusion && (
        <section className="py-20 border-t border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-8">Conclusion</h2>
              <p className="text-xl text-zinc-300 leading-9 font-light antialiased">
                {data.conclusion}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* TEAM MEMBERS CREDITS */}
      {data.champions && data.champions.length > 0 && (
        <section className="py-20 border-t border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <p className="text-emerald-500 font-semibold uppercase tracking-widest text-sm mb-3">Team</p>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Case Study Done By</h2>
            </motion.div>
            <div className={`grid gap-8 justify-items-center ${data.champions.length <= 3 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'}`}>
              {data.champions.slice(0, 5).map((member, idx) => {
                const headshot = member.headshotUrl ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-emerald-500/20 hover:ring-emerald-500 transition-all duration-300 hover:scale-105 mx-auto mb-3">
                    <Image src={member.headshotUrl} alt={member.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-2xl font-bold text-emerald-500 ring-2 ring-emerald-500/20 mx-auto mb-3">
                    {member.name.charAt(0)}
                  </div>
                );

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="text-center"
                  >
                    {member.socialLink ? (
                      <a href={member.socialLink} target="_blank" rel="noopener noreferrer" className="block cursor-pointer">
                        {headshot}
                      </a>
                    ) : headshot}
                    <p className="text-foreground font-semibold text-sm">{member.name}</p>
                    {member.role && <p className="text-muted-foreground text-xs mt-0.5">{member.role}</p>}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CHAMPION QUOTE */}
      {data.championQuote && (
        <section className="py-32 border-y border-border relative overflow-hidden bg-emerald-950/20 dark:bg-emerald-950/25">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900 via-transparent to-transparent"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <svg className="w-12 h-12 text-emerald-500/30 mx-auto mb-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif italic text-foreground leading-tight mb-12">
              &quot;{data.championQuote}&quot;
            </h2>
            <div className="flex flex-col items-center">
              {data.championHeadshotUrl && (
                data.championSocialLink ? (
                  <a href={data.championSocialLink} target="_blank" rel="noopener noreferrer" className="relative w-24 h-24 rounded-full overflow-hidden mb-4 ring-2 ring-emerald-500/20 hover:ring-emerald-500 transition-all duration-300 hover:scale-105 block cursor-pointer">
                    <Image src={data.championHeadshotUrl} alt={data.championName || "Champion"} fill className="object-cover" />
                  </a>
                ) : (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 ring-2 ring-emerald-500/20">
                    <Image src={data.championHeadshotUrl} alt={data.championName || "Champion"} fill className="object-cover" />
                  </div>
                )
              )}
              <p className="text-foreground font-semibold text-lg">{data.championName}</p>
              <p className="text-muted-foreground text-sm uppercase tracking-wider mt-1">{data.championRole} · {data.clientName}</p>
            </div>
          </div>
        </section>
      )}

      {/* PROOF GALLERY */}
      {data.galleryImageUrls && data.galleryImageUrls.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Gallery</h2>
          </div>
          <ImageGallery images={data.galleryImageUrls.map((url, i) => ({
            id: `gallery-${i}`,
            src: url,
            alt: `Campus proof ${i + 1}`
          }))} />
        </section>
      )}

      {/* Feedback Widget */}
      <section className="py-12 border-t border-border">
        <FeedbackWidget pageTitle={`Case Study: ${data.title}`} pageType="case-study" />
      </section>

      {/* MODULES STRIP */}
      {data.modules && data.modules.length > 0 && (
        <section className="py-16 border-t border-border bg-card/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8">Modules Deployed in this Solution</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {data.modules.map(m => (
                <div key={m} className="px-6 py-3 rounded-full border border-border bg-background text-sm font-medium tracking-wide uppercase">
                  {m.replace(/-/g, ' ')}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* NEXT CASE STUDY */}
      {data.nextCaseStudy && (
        <section className="border-t border-border bg-card">
          <Link href={`/case-studies/${data.nextCaseStudy.slug}`} className="block group">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <p className="text-emerald-500 font-semibold uppercase tracking-widest text-sm mb-4">Next Case Study</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground group-hover:text-emerald-500 transition-colors mb-2">
                  {data.nextCaseStudy.title}
                </h2>
                <p className="text-muted-foreground">{data.nextCaseStudy.clientName} · <span className="capitalize">{data.nextCaseStudy.category.replace(/-/g, ' ')}</span></p>
              </div>

              <div className="flex items-center gap-8 flex-shrink-0">
                {data.nextCaseStudy.thumbnailUrl && (
                  <div className="relative w-32 h-32 md:w-48 md:h-32 rounded-xl overflow-hidden shadow-lg border border-white/10 hidden md:block group-hover:scale-105 transition-transform duration-500">
                    <Image src={data.nextCaseStudy.thumbnailUrl} alt="Thumbnail" fill className="object-cover" />
                  </div>
                )}
                <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-black transition-all">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}
    </article>
  );
}
