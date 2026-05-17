"use client";

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
  ].filter(
    (cta) =>
      cta.label?.trim() &&
      cta.href?.trim() &&
      !/book\s+a?\s*demo/i.test(cta.label)
  );

  const hasHeroContent =
    Boolean(String(headline ?? "").trim()) ||
    Boolean(String(subtext ?? "").trim()) ||
    Boolean(heroCtas.length);

  if (!hasHeroContent) {
    return null;
  }

  return (
    <section className="relative flex min-h-[calc(100vh-64px)] w-full flex-col items-center justify-center overflow-hidden bg-transparent px-6 py-12 text-center">
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
            className="inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-sm text-muted-foreground backdrop-blur-md"
          >
            <span className="mr-2 flex h-2 w-2 rounded-full bg-[#00dfd8] animate-pulse" />
            {badge}
          </motion.div>
        ) : null}

        <motion.h1
          className="text-5xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm dark:text-slate-50 md:text-6xl lg:text-7xl"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.03, delayChildren: 0.2 },
            },
          }}
        >
          {typeof headline === "string"
            ? headline.split(" ").map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap mr-[0.25em]">
                {word.split("").map((char, charIndex) => (
                  <span key={charIndex} className="inline-block overflow-hidden pb-2 -mb-2">
                    <motion.span
                      variants={{
                        hidden: { y: "100%", opacity: 0 },
                        visible: {
                          y: "0%",
                          opacity: 1,
                          transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      className="inline-block"
                    >
                      {char}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))
            : headline}
        </motion.h1>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 150 },
            visible: { opacity: 1, y: 0, transition: { duration: 1.8, delay: 0.8, ease: "easeOut" } },
          }}
          className="relative mx-auto max-w-3xl text-lg font-medium leading-relaxed text-slate-700 drop-shadow-sm dark:text-slate-200 dark:drop-shadow-md md:text-xl"
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
          {heroCtas.map((cta, index) => {
            const isPrimary = index === 0;
            const isContactSales = (cta.label?.toLowerCase() || "").includes("contact sales");

            if (isPrimary) {
              return (
                <div key={`${cta.label}-${cta.href}`} className="w-full sm:w-auto">
                  <Link href={cta.href} className="group relative inline-flex h-12 w-full sm:w-auto items-center justify-center overflow-hidden rounded-full p-[3px] font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#e4e4e7_0%,#e4e4e7_45%,#2563eb_65%,#db2777_85%,#e4e4e7_100%)] opacity-100 transition-opacity duration-300" />
                    <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-white text-zinc-950 px-8 py-2 text-base backdrop-blur-3xl transition-colors duration-300 group-hover:bg-zinc-950 group-hover:text-white">
                      {cta.label}
                    </span>
                  </Link>
                </div>
              );
            }

            return (
              <div key={`${cta.label}-${cta.href}`} className="w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  glowVariant="neutral"
                  className={cn(
                    "h-12 w-full px-8 text-base transition-all duration-300",
                    isContactSales
                      ? "bg-white text-zinc-950 hover:bg-white hover:text-zinc-950 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-950 dark:hover:text-white border-zinc-200 dark:border-white/10 rounded-md"
                      : "rounded-full"
                  )}
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
