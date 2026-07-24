"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bell, Bug, Rocket, WandSparkles, LayoutGrid, Gem } from "lucide-react";
import { format } from "date-fns";
import { PortableTextBlock } from "@/components/PortableTextBlock";

import Globe from "@/components/ui/Globe";
import { AboutMissionVision } from "@/components/about/AboutMissionVision";
import { AboutCoreValues } from "@/components/about/AboutCoreValues";
import { AboutTimeline } from "@/components/about/AboutTimeline";
import { AboutMadeInIndia } from "@/components/about/AboutMadeInIndia";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChangelogSubscribeForm } from "@/components/changelog/ChangelogSubscribeForm";

type ChangelogEntry = {
  title: string;
  slug: string;
  releaseDate: string;
  updateType: "feature" | "improvement" | "bugfix";
  versionLabel?: string;
  modules: string[];
  summary: string;
};

type AboutPageClientProps = {
  storyTitle: string;
  originQuote: string;
  storyParagraphs: string[];
  missionTitle?: string;
  missionBody?: string;
  visionTitle?: string;
  visionBody?: string;
  whatIsClassgrid?: any[];
  whatWeDo?: any[];
  whyChooseClassgrid?: any[];
  values?: any[];
  timeline?: any[];
  recentEntries?: ChangelogEntry[];
};

const UPDATE_TYPE_META = {
  feature: { label: "New Feature", icon: Rocket },
  improvement: { label: "Improvement", icon: WandSparkles },
  bugfix: { label: "Bug Fix", icon: Bug },
} as const;

function prettyModule(m: string) {
  return m.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const MotionDiv = motion.div as any;

export default function AboutPageClient({
  storyTitle,
  originQuote,
  storyParagraphs,
  missionTitle,
  missionBody,
  visionTitle,
  visionBody,
  whatIsClassgrid,
  whatWeDo,
  whyChooseClassgrid,
  values,
  timeline,
  recentEntries = [],
}: AboutPageClientProps) {
  let paragraphs = storyParagraphs.filter((p) => p.trim().length > 0);
  if (paragraphs.length === 0) {
    paragraphs = [
      "Classgrid is a trusted product development and technology services company that leverages its expertise to provide educational institutes with cutting-edge solutions that lend them a competitive edge.",
      "Our platform has been associated with premium educational institutes in the country, ensuring smoother operations and better outcomes.",
    ];
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative bg-[#021E16] text-white overflow-hidden pb-12">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#021E16] via-[#063D2E] to-[#021E16]" />
        <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(115deg,rgba(2,30,22,0.96)_0%,rgba(6,61,46,0.42)_38%,rgba(2,30,22,0.9)_100%)]" />
        
        {/* 1. HERO */}
        <section className="relative z-10 px-4 pb-6 pt-16 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <SectionAccentBar align="center" />
        <MotionDiv
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            About Us
          </h1>
          <p className="mt-6 text-lg text-emerald-50/75 sm:text-xl">
            We build the infrastructure that lets educators focus on education.
          </p>
        </MotionDiv>
      </section>

      {/* 2. GLOBE + OUR STORY */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[320px] sm:max-w-[420px] mx-auto lg:max-w-[580px] lg:mx-0"
          >
            <Globe showLabel={true} />
          </MotionDiv>

          <MotionDiv
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="max-w-2xl"
          >
            <h2 className="text-2xl font-bold tracking-tight text-emerald-400 sm:text-3xl mb-6">
              {storyTitle || "Our Story"}
            </h2>
            <div className="space-y-6 text-base leading-8 text-emerald-50/75 sm:text-lg">
              {paragraphs.map((p, i) =>
                p.startsWith("—") ? (
                  <p key={i} className="mt-2 text-sm font-semibold italic text-emerald-300 tracking-wide">
                    {p}
                  </p>
                ) : (
                  <p key={i}>{p}</p>
                )
              )}
            </div>
          </MotionDiv>
        </div>
      </section>

      </div>

      {/* 2.5 PLATFORM OVERVIEW CARDS */}
      {(whatIsClassgrid || whatWeDo || whyChooseClassgrid) && (
        <section className="relative w-full bg-muted/30 px-4 py-16 sm:px-6 lg:px-8 border-y border-border">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 md:grid-cols-3">
              {whatIsClassgrid && (
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Card className="h-full border border-border bg-card/50 backdrop-blur-sm transition-colors hover:border-emerald-500/30 hover:bg-card">
                    <CardContent className="p-8">
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <LayoutGrid className="h-6 w-6" />
                      </div>
                      <h3 className="mb-4 text-2xl font-bold tracking-tight text-foreground">What is ClassGrid?</h3>
                      <div className="prose prose-sm dark:prose-invert prose-emerald text-muted-foreground leading-relaxed">
                        <PortableTextBlock value={whatIsClassgrid} showAccentBars={false} />
                      </div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              )}

              {whatWeDo && (
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                >
                  <Card className="h-full border border-border bg-card/50 backdrop-blur-sm transition-colors hover:border-blue-500/30 hover:bg-card">
                    <CardContent className="p-8">
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <Rocket className="h-6 w-6" />
                      </div>
                      <h3 className="mb-4 text-2xl font-bold tracking-tight text-foreground">What We Do</h3>
                      <div className="prose prose-sm dark:prose-invert prose-emerald text-muted-foreground leading-relaxed">
                        <PortableTextBlock value={whatWeDo} showAccentBars={false} />
                      </div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              )}

              {whyChooseClassgrid && (
                <MotionDiv
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
                >
                  <Card className="h-full border border-border bg-card/50 backdrop-blur-sm transition-colors hover:border-pink-500/30 hover:bg-card">
                    <CardContent className="p-8">
                      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
                        <Gem className="h-6 w-6" />
                      </div>
                      <h3 className="mb-4 text-2xl font-bold tracking-tight text-foreground">Why Choose Us?</h3>
                      <div className="prose prose-sm dark:prose-invert prose-emerald text-muted-foreground leading-relaxed">
                        <PortableTextBlock value={whyChooseClassgrid} showAccentBars={false} />
                      </div>
                    </CardContent>
                  </Card>
                </MotionDiv>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3. MISSION & VISION */}
      <AboutMissionVision
        missionTitle={missionTitle}
        missionBody={missionBody}
        visionTitle={visionTitle}
        visionBody={visionBody}
      />

      {/* 4. CORE VALUES */}
      <AboutCoreValues values={values} />

      {/* 5. TIMELINE */}
      <AboutTimeline timeline={timeline} />

      {/* 6. MADE IN INDIA */}
      <section className="w-full bg-background px-4 py-12 sm:px-6 lg:px-8">
        <AboutMadeInIndia className="w-full h-auto max-w-6xl mx-auto" />
      </section>

      {/* 7. LATEST UPDATES — 4 most recent changelog entries */}
      {recentEntries.length > 0 && (
        <section className="w-full border-t border-border bg-muted/50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Heading */}
            <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <SectionAccentBar align="left" />
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  Latest Updates
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Recent features, improvements and fixes from the Classgrid platform.
                </p>
              </div>
              <Link
                href="/changelog"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-emerald-500/40 hover:bg-emerald-500/8 hover:text-emerald-600 dark:hover:text-emerald-400"
              >
                View all updates
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Cards */}
            <div className="space-y-4">
              {recentEntries.map((entry) => {
                const updateMeta =
                  UPDATE_TYPE_META[entry.updateType] ?? UPDATE_TYPE_META.improvement;
                const UpdateIcon = updateMeta.icon;
                return (
                  <Card
                    key={entry.slug}
                    className="border border-border bg-card transition hover:border-emerald-500/20 hover:bg-accent"
                  >
                    <CardContent className="p-6">
                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge
                          variant="outline"
                          className="rounded-full border-emerald-500/25 bg-emerald-500/8 text-emerald-400"
                        >
                          <UpdateIcon className="mr-1.5 h-3.5 w-3.5" />
                          {updateMeta.label}
                        </Badge>
                        {entry.versionLabel && (
                          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            {entry.versionLabel}
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(entry.releaseDate), "MMMM d, yyyy")}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                        <Link
                          href={`/changelog/${entry.slug}`}
                          className="transition-colors hover:text-emerald-400"
                        >
                          {entry.title}
                        </Link>
                      </h3>

                      {/* Summary */}
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{entry.summary}</p>

                      {/* Module chips */}
                      {entry.modules.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {entry.modules.map((m) => (
                            <span
                              key={m}
                              className="rounded-full border border-border bg-muted px-3 py-0.5 text-xs text-muted-foreground"
                            >
                              {prettyModule(m)}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* CTA */}
                      <div className="mt-5">
                        <Link
                          href={`/changelog/${entry.slug}`}
                          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-emerald-600 dark:hover:text-emerald-400"
                        >
                          Read full update
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </main>
  );
}
