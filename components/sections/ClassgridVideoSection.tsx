"use client";

import React from "react";
import { Reveal } from "@/components/sections/Reveal";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Highlight {
  text: string;
}

interface ClassgridVideoSectionProps {
  label?: string;
  title?: string;
  description?: string;
  videoUrl?: string;
  highlights?: Highlight[];
  ctaLabel?: string;
  ctaHref?: string;
}

const getYouTubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
  return match ? match[1] : null;
};

export function ClassgridVideoSection({
  label = "See It In Action",
  title = "Built for Every Institution",
  description = "Watch how Classgrid transforms operations across your entire campus in this quick overview.",
  videoUrl,
  highlights = [],
  ctaLabel = "Book a Free Demo",
  ctaHref = "/#demo",
}: ClassgridVideoSectionProps) {
  if (!videoUrl) return null;

  const ytId = getYouTubeId(videoUrl);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:py-24">
      <Reveal>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Side: Text & Highlights */}
          <div className="flex flex-col gap-6 lg:pr-8">
            <div>
              <div className="mb-6 h-1.5 w-24 rounded-full bg-orange-500"></div>
              {label ? (
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-500">
                  {label}
                </p>
              ) : null}
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
                {title}
              </h2>
            </div>

            {description ? (
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                {description}
              </p>
            ) : null}

            {highlights && highlights.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-4">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
                    <span className="text-base font-medium text-slate-700 dark:text-slate-300">
                      {highlight.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            {ctaLabel && ctaHref ? (
              <div className="mt-6">
                <Link
                  href={ctaHref}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-emerald-500 px-8 text-base font-bold text-white transition-all hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-95"
                >
                  {ctaLabel}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            ) : null}
          </div>

          {/* Right Side: Framed Video */}
          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            {/* Glow behind video */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/30 to-blue-500/30 blur-2xl dark:from-emerald-500/20 dark:to-blue-500/20" />
            
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-2xl dark:border-white/10">
              {/* Browser-like Header */}
              <div className="flex h-10 w-full items-center gap-2 border-b border-slate-800 bg-[#1a1a1a] px-4">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
              </div>

              {/* Video Container */}
              <div className="relative aspect-video w-full bg-black">
                {ytId ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${ytId}?rel=0`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={title}
                  />
                ) : (
                  <video
                    src={videoUrl}
                    controls
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
