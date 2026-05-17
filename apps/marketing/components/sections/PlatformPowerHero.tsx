"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  adaptiveHeroProfiles,
  homeCopy,
  platformHeroCopy,
  type InstitutionType,
} from "@/content/siteContent";

const profileOrder: InstitutionType[] = ["college", "junior-college", "coaching", "school"];
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

function formatCounter(value: number, suffix?: string) {
  return `${Intl.NumberFormat("en-IN").format(value)}${suffix ?? ""}`;
}

type PlatformPowerHeroProps = {
  headline?: string;
  subheadline?: string;
};

export function PlatformPowerHero({ headline, subheadline }: PlatformPowerHeroProps) {
  const [profile, setProfile] = useState<InstitutionType>("college");
  const hero = adaptiveHeroProfiles[profile] ?? adaptiveHeroProfiles.college;
  const counters = hero?.counters ?? [];
  const capabilities = hero?.capabilities ?? [];

  const targetValues = useMemo(
    () => counters.map((counter) => counter.value),
    [counters]
  );

  const [animatedValues, setAnimatedValues] = useState<number[]>(targetValues);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = 900;
    const previous = [...animatedValues];

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues(
        targetValues.map((target, index) => {
          const from = previous[index] ?? 0;
          return Math.round(from + (target - from) * eased);
        })
      );

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0 cinema-grid" />
      <div className="pointer-events-none absolute -top-20 -left-20 size-72 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 size-80 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-4 pt-16 pb-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:pt-24 lg:pb-20">
        <div>
          <p className="inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs tracking-[0.18em] text-blue-200 uppercase">
            {platformHeroCopy.kicker}
          </p>

          <MotionH1
            key={headline ?? homeCopy.headline}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-heading mt-5 max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-white md:text-6xl"
          >
            {headline ?? homeCopy.headline}
          </MotionH1>

          <MotionP
            key={subheadline ?? homeCopy.subheadline}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-slate-300 md:text-lg"
          >
            {subheadline ?? homeCopy.subheadline}
          </MotionP>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-10 bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] px-6 text-white"
            >
              <Link href="/demo">{platformHeroCopy.cta}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 border-white/20 bg-white/5 px-6 text-slate-100 hover:bg-white/10"
            >
              <Link href="/tour">{platformHeroCopy.secondaryCta}</Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {profileOrder.map((item) => {
              const isActive = profile === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setProfile(item)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs tracking-wide uppercase transition",
                    isActive
                      ? "border-blue-300/60 bg-blue-500/20 text-blue-100"
                      : "border-white/15 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white",
                  ].join(" ")}
                >
                  {adaptiveHeroProfiles[item].label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl border border-white/10 p-5">
          <p className="text-xs tracking-[0.15em] text-blue-200 uppercase">
            {platformHeroCopy.countersLabel}
          </p>

          <div className="mt-4 space-y-3">
            {counters.map((counter, index) => (
              <div
                key={counter.label}
                className="rounded-xl border border-white/10 bg-[#0A0A0A] p-4"
              >
                <p className="text-2xl font-bold text-white">
                  {formatCounter(animatedValues[index] ?? 0, counter.suffix)}
                </p>
                <p className="text-sm text-slate-300">{counter.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
            <p className="text-xs tracking-[0.15em] text-blue-200 uppercase">
              {platformHeroCopy.capabilitiesLabel}
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {capabilities.map((capability) => (
                <li key={capability}>- {capability}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
