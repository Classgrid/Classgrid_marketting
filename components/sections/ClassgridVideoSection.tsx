"use client";

import React, { useState } from "react";
import { Reveal } from "@/components/sections/Reveal";
import { SectionBodyText, SectionHeader } from "@/components/sections/SectionHeader";

interface Highlight {
  text: string;
}

interface ClassgridVideoSectionProps {
  label?: string;
  title?: string;
  description?: string;
  /** Single video URL fallback (if no playlist) */
  videoUrl?: string;
  /** Sequential playlist — plays 1→2→3→1 in loop */
  videos?: string[];
  highlights?: Highlight[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function ClassgridVideoSection({
  label = "See It In Action",
  title = "Built for Every Institution",
  description = "Watch how Classgrid transforms operations across your entire campus.",
  videoUrl,
  videos = [],
  highlights = [],
}: ClassgridVideoSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Build final playlist: prefer `videos` array, fallback to single videoUrl
  const playlist = videos.length > 0 ? videos : videoUrl ? [videoUrl] : [];

  if (playlist.length === 0) return null;

  const isSingle = playlist.length === 1;

  const handleEnded = () => {
    if (!isSingle) {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }
  };

  return (
    <section className="mx-auto w-full px-6 py-16 md:px-12 lg:px-16 lg:py-24">
      {/* ── Global Section Header ── */}
      <Reveal>
        <SectionHeader label={label} title={title} description={description} />
      </Reveal>

      <Reveal>
        {/* Centered composition container — acts as a single cinematic unit */}
        <div className="mx-auto flex max-w-[1100px] flex-col items-center justify-between gap-16 lg:flex-row lg:gap-20">

          {/* ── Left Side: Text System ── */}
          <div className="order-2 flex w-full flex-col gap-6 lg:order-1 lg:w-[45%] lg:max-w-[420px]">

            {/* Paragraph — softer opacity, elegant line height */}
            {/* Features List */}
            {highlights && highlights.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-4">
                {highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                      {index + 1}
                    </span>
                    <span className="text-base md:text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-200">
                      {highlight.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* ── Right Side: Media Block ── */}
          <div className="order-1 w-full lg:order-2 lg:w-[55%]">
            {/* Elegant, oversized rounded container with 16:9 aspect ratio */}
            <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] border border-black/5 bg-slate-900 shadow-2xl shadow-black/5 dark:border-white/10 dark:shadow-[0_0_60px_-15px_rgba(0,0,0,0.3)]">
              {/* Pure video — object-cover fills the space nicely */}
              <video
                key={currentIndex}
                src={playlist[currentIndex]}
                autoPlay
                loop={isSingle}
                muted
                playsInline
                onEnded={handleEnded}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
              />
            </div>
          </div>

        </div>
      </Reveal>
    </section>
  );
}
