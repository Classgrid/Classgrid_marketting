"use client";

import Image from "next/image";
import { PortableText, type PortableTextComponents, type PortableTextBlock as PortableTextBlockType } from "@portabletext/react";
import { motion } from "framer-motion";
import { HeroVideoSlider } from "@/components/sections/HeroVideoSlider";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { urlFor } from "@/sanity/lib/image";
import { Check, Link as LinkIcon } from "lucide-react";

// Subtle animation
const blockAnim = {
  initial: { opacity: 0, y: 10 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-20px" },
  transition: { duration: 0.5, ease: "easeOut" }
};

// Helper to generate IDs for headings identical to getTocItems logic
function getHeadingId(value: any) {
  const text = (value?.children ?? []).map((c: any) => c.text ?? "").join("");
  return text.trim() ? text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : undefined;
}

// Vercel-inspired components
function createPortableTextComponents(showAccentBars: boolean): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => (
        <p className="mt-5 mx-auto max-w-[750px] text-base leading-7 text-muted-foreground antialiased font-normal">
          {children}
        </p>
      ),
      h2: ({ children, value }) => (
        <>
          {showAccentBars ? <SectionAccentBar align="left" className="mt-14 mb-4 mx-auto max-w-[750px]" /> : null}
          <h2 id={getHeadingId(value)} className={`group ${showAccentBars ? "" : "mt-14"} mb-5 flex mx-auto max-w-[750px] items-center text-2xl font-bold tracking-tight text-foreground antialiased`}>
            {children}
          </h2>
        </>
      ),
      h3: ({ children, value }) => (
        <h3 id={getHeadingId(value)} className="group mt-10 mb-4 flex mx-auto max-w-[750px] items-center text-xl font-semibold tracking-tight text-foreground antialiased">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="mt-8 mb-3 mx-auto max-w-[750px] text-base font-semibold tracking-tight text-foreground antialiased">
          {children}
        </h4>
      ),
      blockquote: ({ children }) => (
        <blockquote className="my-8 mx-auto max-w-[750px] rounded-r-xl border-l-2 border-emerald-500 bg-emerald-500/10 py-4 pl-5 pr-4 text-base leading-7 text-muted-foreground antialiased">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => (
        <ul className="mt-5 mb-8 mx-auto max-w-[750px] list-none space-y-3 antialiased">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="mt-5 mb-8 mx-auto max-w-[750px] list-decimal space-y-3 pl-5 text-base text-muted-foreground antialiased marker:text-muted-foreground/50">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="relative pl-6 text-base leading-7 text-muted-foreground">
          <span className="absolute left-0 top-[0.6em] h-2 w-2 rounded-full bg-emerald-500 block" />
          {children}
        </li>
      ),
      number: ({ children }) => (
        <li className="pl-2 text-base leading-7 text-muted-foreground">
          {children}
        </li>
      ),
    },
    marks: {
      strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
      em: ({ children }) => <em className="italic text-muted-foreground">{children}</em>,
      code: ({ children }) => (
        <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[13px] font-medium text-emerald-600 dark:text-emerald-300">
          {children}
        </code>
      ),
      link: ({ children, value }) => {
        const href = value?.href ?? "";
        const isExternal = href.startsWith("http") || href.startsWith("//");
        return (
          <a
            className="font-medium text-emerald-600 dark:text-emerald-400 underline decoration-emerald-500/30 underline-offset-4 hover:decoration-emerald-500/80 transition-colors"
            href={href}
            {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }) => {
        if (!value?.asset?._ref) return null;
        return (
          <figure className="my-10 mx-auto max-w-[750px]">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl ring-1 ring-white/10">
              <Image
                src={urlFor(value).url()}
                alt={value.alt || 'Blog image'}
                fill
                className="object-contain hover:scale-105 transition-transform duration-700"
                sizes="750px"
              />
            </div>
            {value.caption && (
              <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      inlineImage: ({ value }) => {
        if (!value?.asset?._ref && !value?.asset) return null;
        const imgSrc = value.asset?._ref ? urlFor(value).url() : (value.asset?.url || '');
        if (!imgSrc) return null;
        const layout = value.layout || 'center';

        if (layout === 'center') {
          return (
            <figure className="my-10 mx-auto max-w-[750px]">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-muted shadow-2xl ring-1 ring-white/10">
                <Image src={imgSrc} alt={value.caption || 'Image'} fill className="object-contain hover:scale-105 transition-transform duration-700" sizes="750px" />
              </div>
              {value.caption && <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">{value.caption}</figcaption>}
            </figure>
          );
        }

        // Left or Right layout
        return (
          <div className={`my-10 mx-auto max-w-[900px] flex flex-col ${layout === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
            <div className="w-full md:w-[55%]">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-muted shadow-2xl ring-1 ring-white/10">
                <Image src={imgSrc} alt={value.caption || 'Image'} fill className="object-cover hover:scale-105 transition-transform duration-700" sizes="500px" />
              </div>
            </div>
            {value.caption && (
              <div className="w-full md:w-[45%]">
                <p className="text-base text-muted-foreground italic leading-relaxed">{value.caption}</p>
              </div>
            )}
          </div>
        );
      },
      video: ({ value }) => {
        const videoSrc = value?.videoUrl || value?.url;
        if (!videoSrc) {
          return <div className="p-4 border-2 border-red-500 text-red-500 bg-red-100 rounded-md my-4">Error: Video block found but no URL or file attached.</div>;
        }
        const layout = value.layout || 'center';

        const videoElement = (
          <HeroVideoSlider
            compact
            videos={[{
              url: videoSrc,
              subtitle: value.caption,
              name: value.speakerName,
              role: value.speakerRole,
              avatarUrl: value.speakerImage ? urlFor(value.speakerImage).url() : undefined
            }]}
          />
        );

        if (layout === 'center') {
          return <div className="my-10 mx-auto max-w-[750px]">{videoElement}</div>;
        }

        // Left or Right layout
        return (
          <div className={`my-10 mx-auto max-w-[900px] flex flex-col ${layout === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}>
            <div className="w-full md:w-[60%]">{videoElement}</div>
            {value.caption && (
              <div className="w-full md:w-[40%]">
                <p className="text-base text-muted-foreground italic leading-relaxed">{value.caption}</p>
              </div>
            )}
          </div>
        );
      },
      table: ({ value }) => {
        if (!value?.rows?.length) return null;
        return (
          <div className="my-10 mx-auto max-w-[750px] overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b-2 border-emerald-500/40 bg-emerald-500/10">
                <tr>
                  {value.rows[0].cells.map((cell: any, i: number) => (
                    <th key={i} className="px-5 py-3 font-semibold text-emerald-400 antialiased border-r border-border last:border-r-0">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {value.rows.slice(1).map((row: any, i: number) => (
                  <tr key={i} className="transition-colors hover:bg-emerald-500/5">
                    {row.cells.map((cell: any, j: number) => (
                      <td key={j} className="px-5 py-3.5 text-muted-foreground antialiased leading-relaxed border-r border-border/40 last:border-r-0">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
      richTable: ({ value }) => {
        if (!value?.headers?.length && !value?.rows?.length) return null;
        return (
          <div className="my-10 mx-auto max-w-[750px] overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              {value.headers?.length > 0 && (
                <thead className="border-b-2 border-emerald-500/40 bg-emerald-500/10">
                  <tr>
                    {value.headers.map((header: string, i: number) => (
                      <th key={i} className="px-5 py-3 font-semibold text-emerald-400 antialiased border-r border-border last:border-r-0">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody className="divide-y divide-border/60">
                {(value.rows || []).map((row: any, i: number) => (
                  <tr key={i} className="transition-colors hover:bg-emerald-500/5">
                    {(row.cells || []).map((cell: string, j: number) => (
                      <td key={j} className="px-5 py-3.5 text-muted-foreground antialiased leading-relaxed border-r border-border/40 last:border-r-0">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }
  };
}

// Data Sanitization Pre-processor
function sanitizeBlocks(blocks: any[]): any[] {
  if (!Array.isArray(blocks)) return blocks;

  // 1. Emoji Regex (strips most common emojis)
  const emojiRegex = /[\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E6}-\u{1F1FF}\u{1F200}-\u{1F251}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{1F004}\u{1F0CF}\u{1F18E}]/gu;

  // 2. Patterns to drop entirely
  const dropPatterns = [
    /^PAGE METADATA/i,
    /^URL Slug:/i,
    /^Page Title:/i,
    /^Meta Description:/i,
    /^Target Personas:/i,
    /^---/,
    /^SECTION \d+/i,
  ];

  return blocks.filter((block) => {
    if (block._type !== "block" || !block.children) return true; // keep images, tables

    const textContent = block.children.map((c: any) => c.text || "").join("");

    // Check if block should be completely removed (metadata noise)
    if (dropPatterns.some(pattern => pattern.test(textContent.trim()))) {
      return false;
    }

    return true;
  }).map((block) => {
    // If it's a text block, strip emojis from its children
    if (block._type === "block" && block.children) {
      const newChildren = block.children.map((child: any) => {
        if (child.text) {
          // Remove emojis, then clean up any weird double spaces or leading spaces left behind
          let cleanedText = child.text.replace(emojiRegex, "");

          // If it was a heading that started with an emoji (e.g., " 3.1 Admission"), trim it
          if (block.style === 'h2' || block.style === 'h3') {
            cleanedText = cleanedText.trimStart();
          }

          return { ...child, text: cleanedText };
        }
        return child;
      });
      return { ...block, children: newChildren };
    }

    // If it's a table, clean emojis from cells
    if ((block._type === "table" || block._type === "richTable") && block.rows) {
      const newRows = block.rows.map((row: any) => ({
        ...row,
        cells: row.cells.map((cell: string) => cell ? cell.replace(emojiRegex, "").trim() : cell)
      }));
      return { ...block, rows: newRows };
    }

    return block;
  });
}

type PortableTextBlockProps = {
  value: unknown;
  showAccentBars?: boolean;
};

export function PortableTextBlock({ value, showAccentBars = true }: PortableTextBlockProps) {
  if (!value) return null;

  // Sanitize data before rendering
  const cleanValue = sanitizeBlocks(value as any[]);
  const components = createPortableTextComponents(showAccentBars);

  return (
    <motion.div
      {...blockAnim}
      className="w-full font-sans"
    >
      <PortableText value={cleanValue} components={components} />
    </motion.div>
  );
}
