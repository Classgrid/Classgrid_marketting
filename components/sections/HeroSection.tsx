"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroBackground } from "./HeroBackground";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  badge: React.ReactNode;
  headline: React.ReactNode;
  subtext: React.ReactNode;
  heroPrimaryHref: string;
  heroPrimaryLabel: string;
  heroSecondaryHref: string;
  heroSecondaryLabel: string;
}

export function HeroSection({
  badge,
  headline,
  subtext,
  heroPrimaryHref,
  heroPrimaryLabel,
  heroSecondaryHref,
  heroSecondaryLabel,
}: HeroSectionProps) {
  const heroCtas = [
    { href: heroPrimaryHref, label: heroPrimaryLabel },
    { href: heroSecondaryHref, label: heroSecondaryLabel },
  ].filter((cta) => cta.label?.trim() && cta.href?.trim());

  const hasHeroContent =
    Boolean(String(headline ?? "").trim()) ||
    Boolean(String(subtext ?? "").trim()) ||
    Boolean(heroCtas.length);

  if (!hasHeroContent) {
    return null;
  }

  return (
    <section className="relative flex sm:min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center overflow-hidden bg-transparent px-6 py-8 sm:py-12 text-center">
      <HeroBackground />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
        className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8"
      >
        {String(badge ?? "").trim() ? (
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="inline-flex max-w-[90vw] items-center rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-xs sm:text-sm text-muted-foreground backdrop-blur-md"
          >
            <span className="mr-2 flex h-2 w-2 shrink-0 rounded-full bg-[#00dfd8] animate-pulse" />
            <span className="truncate">{badge}</span>
          </motion.div>
        ) : null}

        <motion.h1
          className="text-[2.2rem] font-extrabold tracking-tight text-slate-900 drop-shadow-sm dark:text-slate-50 sm:text-5xl md:text-6xl lg:text-7xl overflow-wrap-anywhere break-words"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06, delayChildren: 0.05 },
            },
          }}
        >
          {typeof headline === "string"
            ? headline.split(" ").map((word, wordIndex) => (
                <motion.span
                  key={wordIndex}
                  variants={{
                    hidden: { opacity: 0, y: -18 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))
            : headline}
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 150 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.8, delay: 0.8, ease: "easeOut" } },
          }}
          className="relative mx-auto max-w-3xl text-[17px] font-medium leading-snug sm:leading-relaxed text-slate-700 drop-shadow-sm dark:text-slate-200 dark:drop-shadow-md sm:text-lg md:text-xl"
        >
          {subtext}
        </motion.p>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 150 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.8, delay: 1.1, ease: "easeOut" } },
          }}
          className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row"
        >
          {heroCtas
            .sort((a, b) => {
              const aIsDemo = /contact\s+sales|book\s+a?\s*demo|get\s+a?\s*demo/i.test(a.label || "");
              const bIsDemo = /contact\s+sales|book\s+a?\s*demo|get\s+a?\s*demo/i.test(b.label || "");
              if (aIsDemo && !bIsDemo) return 1;
              if (!aIsDemo && bIsDemo) return -1;
              return 0;
            })
            .map((cta, index) => {
            const isPrimary = index === 0;
            const isContactSales = /contact\s+sales|book\s+a?\s*demo|get\s+a?\s*demo/i.test(cta.label || "");

            if (isPrimary) {
              return (
                <div key={`${cta.label}-${cta.href}`} className="w-full sm:w-auto">
                  <Link href={cta.href} className="group relative inline-flex h-12 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full p-[3px] font-bold text-white transition-all duration-300 sm:hover:scale-105 sm:hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span className="hidden sm:block absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e4e4e7_0%,#e4e4e7_45%,#2563eb_65%,#db2777_85%,#e4e4e7_100%)] opacity-100 transition-opacity duration-300" />
                    <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-white text-zinc-950 px-8 py-2 text-[15px] sm:text-base font-semibold backdrop-blur-3xl transition-colors duration-300 sm:group-hover:bg-zinc-950 sm:group-hover:text-white">
                      {cta.label}
                    </span>
                  </Link>
                </div>
              );
            }

            // Removed isViewPlatform lock

            return (
              <div key={`${cta.label}-${cta.href}`} className={cn("w-full sm:w-auto", isContactSales ? "flex sm:hidden" : "")}>
                <Link
                  href={cta.href}
                  className={cn(
                    "inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-full border px-8 py-2 text-[15px] sm:text-base font-semibold transition-all duration-300",
                    isContactSales
                      ? "border-white/10 bg-zinc-950 text-white hover:bg-white/5"
                      : "border-white/10 bg-transparent text-white hover:bg-white/5"
                  )}
                >
                  {cta.label}
                </Link>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
