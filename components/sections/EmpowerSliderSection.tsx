"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Slide {
  id: string;
  label: string;
  headline: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
}

interface EmpowerSliderSectionProps {
  sectionHeadline?: string;
  slides: Slide[];
}

const textFadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const imageFade = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.3 },
  },
};

function splitParagraph(text: string): string[] {
  // Split on double newline first
  const parts = text.split(/\n\n+/).filter(Boolean);
  if (parts.length >= 2) return parts;

  // Split by sentences to create the line-by-line structure
  return text.split(/(?<=[.!?])\s+/).filter(Boolean);
}

export function EmpowerSliderSection({ sectionHeadline, slides }: EmpowerSliderSectionProps) {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(
    () => setCurrent((prev) => (prev + 1) % slides.length),
    [slides.length]
  );
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  // Auto-advance every 7 seconds, resets on manual interaction
  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide, current, slides]);

  if (!slides || slides.length === 0) {
    return null;
  }

  const active = slides[current];
  const paragraphs = splitParagraph(active.body);

  return (
    <section className="relative z-20 -mt-px w-full overflow-hidden bg-transparent pt-6 pb-6 md:pt-8 md:pb-8">
      <div className="mx-auto max-w-[1200px] px-4 md:px-8">

        {/* ── Section Headline ── */}
        {sectionHeadline && (
          <motion.div
            className="mb-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mx-auto mb-5 h-1.5 w-24 rounded-full bg-orange-500" />
            <h2 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-foreground md:text-4xl lg:text-5xl">
              {sectionHeadline}
            </h2>
          </motion.div>
        )}

        {/* ── Slide Content ── */}
        <div className="min-h-[850px] md:min-h-[600px] lg:min-h-[450px] w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16"
            >
            {/* ── Image Side ── */}
            <motion.div
              className="group/slider w-full lg:w-[55%] relative"
              variants={imageFade}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="relative aspect-square md:aspect-[16/10] w-full overflow-hidden rounded-[24px] border border-slate-200 dark:border-white/[0.06] shadow-lg dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)] bg-slate-50 dark:bg-background flex items-center justify-center">
                {active.imageUrl ? (
                  <Image
                    src={active.imageUrl}
                    alt={active.imageAlt || active.headline}
                    fill
                    className="object-contain md:object-cover"
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <ChevronRight className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-white/30">
                      Upload image in Sanity Studio
                    </p>
                  </div>
                )}
              </div>

              {/* ── Sidebar Navigation Arrows ── */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 md:-left-6 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 dark:bg-white/5 text-slate-600 dark:text-white/70 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:scale-110 active:scale-95 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 md:-right-6 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 dark:bg-white/5 text-slate-600 dark:text-white/70 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-lg transition-all duration-200 hover:bg-white dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:scale-110 active:scale-95 opacity-100 md:opacity-0 md:group-hover/slider:opacity-100"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </motion.div>

            {/* ── Text Side ── */}
            <div className="w-full lg:w-[45%]">
              <div className="flex flex-col justify-center text-left lg:pt-2">

                {/* Small Label / Kicker */}
                <motion.p
                  custom={0}
                  variants={textFadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400"
                >
                  {active.label || "All-in-One Platform"}
                </motion.p>

                {/* Per-slide headline */}
                <motion.h3
                  custom={1}
                  variants={textFadeUp}
                  initial="hidden"
                  animate="visible"
                  className="mb-5 text-2xl font-extrabold leading-[1.2] tracking-tight text-slate-900 dark:text-white md:text-3xl"
                >
                  {active.headline}
                </motion.h3>

                {/* Split paragraphs for breathing room */}
                <div className="mb-6 w-full space-y-4">
                  {paragraphs.map((para, idx) => (
                    <motion.p
                      key={idx}
                      custom={idx + 2}
                      variants={textFadeUp}
                      initial="hidden"
                      animate="visible"
                      className="text-[15px] leading-[1.6] text-slate-600 dark:text-[#B0B7C3] md:text-base border-l-2 border-emerald-500/30 pl-3 md:border-none md:pl-0 block"
                    >
                      {para}
                    </motion.p>
                  ))}
                </div>




                {/* ── Dot Pagination ── */}
                {slides.length > 1 && (
                  <motion.div
                    custom={5}
                    variants={textFadeUp}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center gap-2 pt-8"
                  >
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          idx === current
                            ? "bg-emerald-500 w-7 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                            : "bg-slate-300 dark:bg-white/15 w-2 hover:bg-slate-400 dark:hover:bg-white/30"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}

                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
