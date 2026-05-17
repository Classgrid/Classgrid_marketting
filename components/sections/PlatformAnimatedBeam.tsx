"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import { BookOpen, CircleDollarSign, Users, School, GraduationCap } from "lucide-react";

import { AnimatedBeam } from "@/components/ui/animated-beam";
import { Chip } from "@/components/ui/chip";
import { fadeInLeft, fadeInRight, viewportOnce } from "@/lib/animations";
import { cn } from "@/lib/utils";

type PlatformAnimatedBeamProps = {
  kicker?: string;
  title?: string;
  body?: string;
  connectionHint?: string;
  systemLabel?: string;
  inputLabels?: string[];
  audienceCards?: Array<{
    badge?: string;
    title?: string;
    subtitle?: string;
  }>;
  useFallbackContent?: boolean;
};

export function PlatformAnimatedBeam({
  kicker,
  title,
  body,
  connectionHint,
  systemLabel,
  inputLabels,
  audienceCards,
}: PlatformAnimatedBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);

  const cyan = "#00dfd8";
  const magenta = "#ff0080";
  const inputIcons = [BookOpen, CircleDollarSign, Users];
  const inputRefs = [div1Ref, div2Ref, div3Ref];
  const audienceRefs = [div4Ref, div5Ref, div6Ref];
  const audienceIcons = [School, GraduationCap, Users];
  const displayInputLabels = Array.isArray(inputLabels)
    ? inputLabels.filter((label) => label?.trim())
    : [];
  const displayAudienceCards = Array.isArray(audienceCards)
    ? audienceCards.filter(
        (card) => card?.badge?.trim() || card?.title?.trim() || card?.subtitle?.trim()
      )
    : [];
  const badgeStyles = [
    "bg-[#ff0080]/10 text-[#ff0080] shadow-[0_0_15px_rgba(255,0,128,0.3)]",
    "bg-[#ff0080]/10 text-[#ff0080] shadow-[0_0_15px_rgba(255,0,128,0.3)]",
    "bg-[#ff0080]/10 text-[#ff0080] shadow-[0_0_15px_rgba(255,0,128,0.3)]",
  ];

  const hasRenderableContent =
    Boolean(kicker?.trim()) ||
    Boolean(title?.trim()) ||
    Boolean(body?.trim()) ||
    Boolean(connectionHint?.trim()) ||
    Boolean(systemLabel?.trim()) ||
    displayInputLabels.length > 0 ||
    displayAudienceCards.length > 0;

  if (!hasRenderableContent) {
    return null;
  }

  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden bg-background py-10 xl:py-14">
      <div className="pointer-events-none absolute left-[-10%] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#00dfd8]/40 blur-[100px]" />
      <div className="pointer-events-none absolute right-[-10%] top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#ff0080]/40 blur-[100px]" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-12 xl:flex-row xl:items-start xl:gap-16">
          <motion.div
            className="relative flex h-[400px] w-full max-w-[520px] items-center justify-center overflow-visible xl:h-[420px] xl:w-[52%] xl:max-w-none"
            ref={containerRef}
            initial={false}
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeInLeft}
          >
            <div className="z-10 flex h-full w-full flex-row items-center justify-between gap-5 xl:gap-8">
              <div className="flex w-[48%] min-w-[210px] max-w-[250px] flex-col rounded-2xl border border-gray-200 bg-[#fafafa] p-4 shadow-2xl backdrop-blur-md dark:border-[#222] dark:bg-[#0f0f0f]">
                {(systemLabel?.trim() || displayInputLabels.length > 0) ? (
                  <div className="mb-4 flex items-center gap-3 border-b border-gray-100 px-2 pb-4 dark:border-[#222]">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1a1a1a]">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-600 dark:text-gray-300"
                      >
                        <path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" />
                      </svg>
                    </div>
                    {systemLabel?.trim() ? (
                      <span className="text-base font-semibold tracking-tight text-foreground">
                        {systemLabel}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className="relative flex flex-col gap-4">
                  {displayInputLabels.slice(0, 3).map((label, index) => {
                    const Icon = inputIcons[index];
                    return (
                      <div
                        key={`${label}-${index}`}
                        className="relative flex min-h-[92px] items-center gap-3 rounded-xl border-2 border-[#00dfd8]/80 bg-[#00dfd8]/10 px-3 py-3 shadow-[0_0_25px_-5px_rgba(0,223,216,0.6)] transition-colors"
                      >
                        <Icon className="h-5 w-5 text-[#00dfd8]" />
                        <span className="text-base font-semibold leading-snug text-foreground">{label}</span>
                        <div
                          ref={inputRefs[index]}
                          className="absolute -right-[6px] top-1/2 z-20 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-[2px] border-[#00dfd8] bg-[#00dfd8] shadow-[0_0_10px_#00dfd8]"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="relative ml-4 flex w-[46%] min-w-[230px] max-w-[340px] flex-col justify-center gap-8 xl:ml-8">
                {displayAudienceCards.slice(0, 3).map((card, index) => (
                  <div
                    key={`${card.title}-${index}`}
                    className="relative flex min-h-[124px] items-center gap-4 rounded-2xl border-2 border-[#ff0080]/80 bg-[#fafafa] p-4 shadow-[0_0_30px_-5px_rgba(255,0,128,0.7)] dark:bg-[#0f0f0f]"
                  >
                    <div
                      ref={audienceRefs[index]}
                      className="absolute -left-[6px] top-1/2 z-20 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-[2px] border-[#ff0080] bg-[#ff0080] shadow-[0_0_10px_#ff0080]"
                    />
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ff0080]/20",
                        badgeStyles[index]
                      )}
                    >
                      {(() => {
                        const Icon = audienceIcons[index] || Users;
                        return <Icon className="h-5 w-5" strokeWidth={2} />;
                      })()}
                    </div>
                    <div className="flex flex-col">
                      {card.badge?.trim() ? (
                        <Chip variant="rose" className="mb-1.5 self-start">
                          {card.badge}
                        </Chip>
                      ) : null}
                      {card.title?.trim() ? (
                        <span className="mb-1 text-base font-bold leading-tight text-foreground">
                          {card.title}
                        </span>
                      ) : null}
                      {card.subtitle?.trim() ? (
                        <span className="text-sm font-medium leading-snug text-gray-500">
                          {card.subtitle}
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {displayInputLabels[0] && displayAudienceCards[0] ? (
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={div1Ref}
                toRef={div4Ref}
                curvature={-50}
                pathWidth={3}
                pathOpacity={0.4}
                pathColor="rgba(255, 0, 128, 0.6)"
                gradientStartColor={cyan}
                gradientStopColor={magenta}
              />
            ) : null}
            {displayInputLabels[1] && displayAudienceCards[1] ? (
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={div2Ref}
                toRef={div5Ref}
                curvature={0}
                pathWidth={3}
                pathOpacity={0.4}
                pathColor="rgba(255, 0, 128, 0.6)"
                gradientStartColor={cyan}
                gradientStopColor={magenta}
              />
            ) : null}
            {displayInputLabels[2] && displayAudienceCards[2] ? (
              <AnimatedBeam
                containerRef={containerRef}
                fromRef={div3Ref}
                toRef={div6Ref}
                curvature={50}
                pathWidth={3}
                pathOpacity={0.4}
                pathColor="rgba(255, 0, 128, 0.6)"
                gradientStartColor={cyan}
                gradientStopColor={magenta}
              />
            ) : null}
          </motion.div>

          {(title?.trim() || body?.trim()) ? (
            <motion.div
              className="flex w-full max-w-[640px] flex-col justify-center text-left xl:w-[48%] xl:max-w-none"
              initial={false}
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeInRight}
            >
              {kicker?.trim() ? (
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-400">
                  {kicker}
                </p>
              ) : null}
              <div className="mb-6 h-1.5 w-24 rounded-full bg-orange-500" />
              {title?.trim() ? (
                <h2 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground lg:text-5xl">
                  {title}
                </h2>
              ) : null}
              {body?.trim() ? (
                <p className="max-w-lg text-lg font-medium leading-relaxed text-muted-foreground lg:text-xl">
                  {body}
                </p>
              ) : null}
              {connectionHint?.trim() ? (
                <p className="mt-5 max-w-lg text-sm font-medium text-muted-foreground/90">
                  {connectionHint}
                </p>
              ) : null}
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
