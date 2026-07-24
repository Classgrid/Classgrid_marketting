"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Reveal } from "@/components/sections/Reveal";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { BlueprintBox } from "@/components/ui/BlueprintBox";
import { cn } from "@/lib/utils";

interface TeamVisionQuote {
  name?: string;
  role?: string;
  text?: string;
  quote?: string;
  avatarUrl?: string;
}

interface TeamVisionSectionProps {
  label?: string;
  title?: string;
  description?: string;
  quotes?: TeamVisionQuote[];
}

const DEFAULT_QUOTES: TeamVisionQuote[] = [
  {
    text: "We built Classgrid because every institution — whether a 50-student coaching centre or a 5,000-student university — deserves the same infrastructure-grade tools.",
    name: "Nikhil Shinde",
    role: "Founder & CEO",
  },
  {
    text: "Every feature we ship is obsessively designed around one question: does this make someone's job easier today?",
    name: "Classgrid Team",
    role: "Engineering & Design",
  },
  {
    text: "Our mission is simple — eliminate the friction between teaching and learning so educators can focus on what truly matters.",
    name: "Classgrid Team",
    role: "Product Vision",
  },
];

const AUTOPLAY_INTERVAL = 12000;

export function TeamVisionSection({
  label = "From Our Team",
  title = "Our Vision",
  description = "The people behind Classgrid — why we built it, what drives us, and where we're taking education next.",
  quotes: propQuotes,
}: TeamVisionSectionProps) {
  const quotes = propQuotes && propQuotes.length > 0 ? propQuotes : DEFAULT_QUOTES;
  const total = quotes.length;

  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
  }, []);

  // Auto-play: slide every 12 seconds, never pauses
  useEffect(() => {
    if (total <= 1) return;
    timerRef.current = setInterval(goNext, AUTOPLAY_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, goNext]);

  return (
    <section className="relative py-20" style={{ overflowX: 'clip' }}>
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            title={title}
            badge={label}
            description={description}
          />
        </Reveal>

        {/* BlueprintBox is FIXED — only content inside slides */}
        <BlueprintBox maxWidth="max-w-[1200px]" className="mt-12 py-4 px-2 md:px-8 bg-slate-200 dark:bg-emerald-950/25 border-slate-300">
          {/* Overflow hidden clips the sliding text track */}
          <div className="overflow-hidden w-full" style={{ contain: 'layout' }}>
            {/* Spring track — same pattern as testimonial-carousel-v2 */}
            <motion.div
              className="flex"
              style={{ width: `${total * 100}%` }}
              animate={{ x: `-${current * (100 / total)}%` }}
              transition={{ type: "spring", stiffness: 280, damping: 20, mass: 1 }}
            >
              {quotes.map((quote, idx) => {
                const text = (quote.text || quote.quote || "").trim();
                return (
                  <div
                    key={idx}
                    className="shrink-0 flex flex-col items-center text-center py-1 px-4"
                    style={{ width: `${100 / total}%` }}
                  >
                    {/* Quote SVG at top — fixed position inside card */}
                    <div className="mb-4">
                      <Quote
                        className="h-14 w-14 rotate-180 text-emerald-500/30 dark:text-emerald-400/20"
                        fill="currentColor"
                      />
                    </div>

                    {/* The quote text */}
                    <p className="font-serif text-xl leading-[1.6] italic text-slate-800 md:text-2xl lg:text-3xl dark:text-slate-200 max-w-3xl">
                      "{text.replace(/^["'"]+|["'"]+$/g, '')}"
                    </p>

                    {/* Author section */}
                    <div className="mt-6 flex flex-col items-center gap-2">
                      {/* Always show avatar — photo from Sanity or initials fallback */}
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-emerald-500/30 bg-emerald-950/60">
                        {quote.avatarUrl ? (
                          <img
                            src={quote.avatarUrl}
                            alt={quote.name || "Avatar"}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-lg font-bold text-emerald-400">
                            {quote.name ? quote.name.charAt(0).toUpperCase() : "C"}
                          </div>
                        )}
                      </div>
                      {/* Green line divider */}
                      <div className="h-[2px] w-10 rounded-full bg-emerald-500" />
                      <div>
                        <h4 className="text-base font-bold text-foreground">
                          {quote.name}
                        </h4>
                        <p className="text-sm text-emerald-500 dark:text-emerald-400 font-medium">
                          {quote.role}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </BlueprintBox>

        {/* Dots — outside and below the BlueprintBox */}
        {total > 1 && (
          <div className="flex justify-center mt-8 gap-2.5">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={cn(
                  "rounded-full transition-all duration-300",
                  i === current
                    ? "h-2.5 w-8 bg-emerald-500"
                    : "h-2.5 w-2.5 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500"
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
