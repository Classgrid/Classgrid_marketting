"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Lightbulb, Calendar, Settings, BarChart, Trophy,
  Rocket, Star, Zap, Layers, Globe, ChevronLeft, ChevronRight,
} from "lucide-react";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

type AboutTimelineProps = {
  timeline?: TimelineItem[];
};

const defaultTimeline: TimelineItem[] = [
  {
    year: "Dec 2025",
    title: "Foundation",
    description: "Classgrid launched as an online classroom portal connecting students and teachers through a secure login system.",
  },
  {
    year: "Feb 2026",
    title: "Classgrid V2",
    description: "RBAC-based administration, multi-role access, and improved management features evolved the platform beyond a classroom portal.",
  },
  {
    year: "Jul 2026",
    title: "Classgrid V3",
    description: "41 integrated modules, Play Store launch, and dedicated dashboards for students, faculty, fees, and departments.",
  },
  {
    year: "Today & Beyond",
    title: "The Future",
    description: "Smarter AI-powered systems and advanced institutional tools for the fully digital future of education.",
  },
];

// Cycle through icons — add more as your timeline grows
const icons = [Lightbulb, Calendar, Settings, BarChart, Trophy, Rocket, Star, Zap, Layers, Globe];

// Items ≤ this count → inline grid. More → horizontal scroll mode.
const SCROLL_THRESHOLD = 6;

const itemVariant = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const MotionDiv = motion.div as any;
const MotionSection = motion.section as any;

export function AboutTimeline({ timeline = defaultTimeline }: AboutTimelineProps) {
  // Use CMS items if provided and non-empty, otherwise fall back to defaults
  const items: TimelineItem[] = timeline.length > 0 ? timeline : defaultTimeline;

  const isScrollMode = items.length > SCROLL_THRESHOLD;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(isScrollMode);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  };

  return (
    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-full overflow-hidden bg-background py-16 pb-24"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">

        {/* Heading row + scroll buttons */}
        <div className="mb-16 flex items-center justify-between">
          <MotionDiv variants={itemVariant} className="flex-1 flex flex-col items-center text-center">
            <SectionAccentBar align="center" />
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl mt-2">
              Our Journey
            </h2>
          </MotionDiv>

          {/* Scroll control buttons — only rendered in scroll mode */}
          {isScrollMode && (
            <div className="flex shrink-0 gap-2 ml-4">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll timeline left"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/30 text-emerald-400 transition-all hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll timeline right"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/30 text-emerald-400 transition-all hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* ── SCROLL WRAPPER (only active when scroll mode) ── */}
        <div
          ref={isScrollMode ? scrollRef : undefined}
          onScroll={isScrollMode ? handleScroll : undefined}
          className={isScrollMode ? "overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" : undefined}
        >
          <MotionDiv
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.15, delayChildren: 0.3 }}
            className="relative"
            // For scroll mode: set explicit min-width so items don't squish
            style={isScrollMode ? { minWidth: `${items.length * 240}px` } : undefined}
          >
            {/* ── ANIMATED HORIZONTAL BASELINE ── */}
            <MotionDiv
              initial={{ width: 0 }}
              whileInView={{ width: "calc(100% + 24px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute bottom-[8px] left-0 hidden md:block overflow-visible"
              style={{ borderTop: "2px dashed rgba(16,185,129,0.42)" }}
            >
              <svg
                className="absolute -right-3 top-[1px] h-6 w-6 -translate-y-1/2"
                viewBox="0 0 24 24"
                fill="var(--background)"
                stroke="rgba(16,185,129,0.42)"
                strokeWidth="2"
                strokeLinejoin="round"
              >
                <polygon points="2,2 22,12 2,22" />
              </svg>
            </MotionDiv>

            {/* ── ITEMS GRID (dynamic columns via inline style) ── */}
            <div
              className="hidden md:grid md:gap-0"
              style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
            >
              {items.map((item, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <MotionDiv
                    key={index}
                    variants={itemVariant}
                    className="group relative flex flex-col items-center text-center md:px-4"
                  >
                    {/* Right vertical divider */}
                    <MotionDiv
                      initial={{ height: 0 }}
                      whileInView={{ height: "calc(100% - 7px)" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, ease: "easeInOut", delay: index * 0.15 }}
                      className="absolute top-0 right-0"
                      style={{ borderRight: "2px dashed rgba(16,185,129,0.42)" }}
                    />
                    {/* Left vertical divider (first item only) */}
                    {index === 0 && (
                      <MotionDiv
                        initial={{ height: 0 }}
                        whileInView={{ height: "calc(100% - 7px)" }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute top-0 left-0"
                        style={{ borderLeft: "2px dashed rgba(16,185,129,0.42)" }}
                      />
                    )}

                    <div className="flex h-full flex-col items-center">
                      {/* Icon */}
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/5 text-emerald-400 transition-colors group-hover:bg-emerald-500/15">
                        <Icon className="h-5 w-5" strokeWidth={1.5} />
                      </div>

                      {/* Top connecting line */}
                      <MotionDiv
                        initial={{ height: 0 }}
                        whileInView={{ height: 20 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.15 + 0.4 }}
                        className="mb-3 w-px"
                        style={{ borderLeft: "2px dashed rgba(16,185,129,0.42)" }}
                      />

                      {/* Year */}
                      <div className="mb-2 text-sm font-bold tracking-widest text-emerald-500">
                        {item.year}
                      </div>

                      {/* Content */}
                      <div className="mb-6 px-2">
                        <h3 className="mb-2 text-base font-semibold text-foreground">
                          {item.title}
                        </h3>
                        <p className="mx-auto max-w-[190px] text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom connecting line */}
                      <MotionDiv
                        initial={{ height: 0 }}
                        whileInView={{ height: 38 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.15 + 0.6 }}
                        className="mt-auto w-px"
                        style={{ borderLeft: "2px dashed rgba(16,185,129,0.42)" }}
                      />

                      {/* Dot */}
                      <MotionDiv
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.15 + 0.8 }}
                        className="relative z-10 flex h-4 w-4 items-center justify-center -mt-2"
                      >
                        <div className="absolute inset-0 rounded-full bg-emerald-500 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" />
                        <div className="relative z-10 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                      </MotionDiv>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>

            {/* ── MOBILE STACK (always flex column on small screens) ── */}
            <div className="flex flex-col gap-0 md:hidden">
              {items.map((item, index) => {
                const Icon = icons[index % icons.length];
                return (
                  <div key={index} className="group flex flex-col items-center text-center py-4">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/5 text-emerald-400">
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div className="mb-1 text-sm font-bold tracking-widest text-emerald-500">{item.year}</div>
                    <h3 className="mb-1 text-base font-semibold text-foreground">{item.title}</h3>
                    <p className="mx-auto max-w-[260px] text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    {index < items.length - 1 && (
                      <div className="mt-4 h-10 w-px border-l border-dotted border-emerald-500/30" />
                    )}
                  </div>
                );
              })}
            </div>

          </MotionDiv>
        </div>

        {/* Item count indicator (scroll mode only) */}
        {isScrollMode && (
          <p className="mt-4 text-center text-xs text-muted-foreground/50">
            {items.length} milestones · scroll to explore
          </p>
        )}

      </div>
    </MotionSection>
  );
}
