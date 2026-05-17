import Link from "next/link";
import { buildPageMetadata } from "@/lib/metadata";
import {
  BadgeCheck,
  BookOpen,
  BrainCircuit,
  Building2,
  CalendarClock,
  CircleDollarSign,
  ClipboardCheck,
  GraduationCap,
  MessagesSquare,
  ShieldCheck,
} from "lucide-react";

import { DemoRequestForm } from "@/components/sections/DemoRequestForm";
import { Reveal } from "@/components/sections/Reveal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IntegrationHero from "@/components/ui/integration-hero";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";
import IntroAnimation from "@/components/ui/scroll-morph-hero";
import {
  homeCopy,
  homeFinalCta,
  homeMachine,
  homeModuleHighlights,
  homeModuleGrid,
  homePillars,
  homeSocialProof,
  homeStats,
  pageMeta,
} from "@/content/siteContent";
import { getHomePage } from "@/sanity/lib/marketing";

const moduleIcons = [
  ClipboardCheck,
  GraduationCap,
  Building2,
  CircleDollarSign,
  BookOpen,
  MessagesSquare,
  BrainCircuit,
  ShieldCheck,
  CalendarClock,
  BadgeCheck,
];

const chaosStack = [
  "Tally",
  "WhatsApp Groups",
  "Excel Sheets",
  "Biometric Devices",
  "Google Forms",
  "Zoom / Meet",
  "Standalone SMS",
];

const orgSolutions = [
  {
    title: "Schools (K-12)",
    body:
      "Parent notifications, PTA scheduling, bus tracking, and automated fee reminders in one loop.",
  },
  {
    title: "Degree Colleges",
    body:
      "Semester routing, university roll numbers, NAAC/NBA compliance, and complex results at scale.",
  },
  {
    title: "Junior Colleges",
    body:
      "Board eligibility monitoring, science vs commerce splits, CET/JEE/NEET mock engines.",
  },
  {
    title: "Coaching Institutes",
    body:
      "Batch automation, lead-capture CRM, and high-stakes exams with instant scoring.",
  },
];

const homeTimelineData = [
  {
    id: 1,
    title: "Admissions Live",
    date: "Week 01",
    content: "College Admin launches digital admissions, seat matrix, and merit lists.",
    category: "Admissions",
    icon: ClipboardCheck,
    relatedIds: [2, 4],
    status: "completed",
    energy: 88,
  },
  {
    id: 2,
    title: "Attendance Sync",
    date: "Week 02",
    content: "School Principal sees live attendance across classes and transport routes.",
    category: "Operations",
    icon: CalendarClock,
    relatedIds: [1, 5],
    status: "in-progress",
    energy: 74,
  },
  {
    id: 3,
    title: "Exam & Results Engine",
    date: "Week 03",
    content: "Exam cell schedules exams, hall tickets, and instant result publishing.",
    category: "Academics",
    icon: BookOpen,
    relatedIds: [2, 6],
    status: "in-progress",
    energy: 79,
  },
  {
    id: 4,
    title: "Fee Collection Split",
    date: "Week 04",
    content: "Accounts team reconciles Razorpay splits and auto-updates ledgers.",
    category: "Finance",
    icon: CircleDollarSign,
    relatedIds: [1, 7],
    status: "completed",
    energy: 90,
  },
  {
    id: 5,
    title: "Parent & Student Messaging",
    date: "Week 05",
    content: "Class teachers broadcast WhatsApp, SMS, and in-app alerts instantly.",
    category: "Communication",
    icon: MessagesSquare,
    relatedIds: [2, 6],
    status: "in-progress",
    energy: 70,
  },
  {
    id: 6,
    title: "Performance Analytics",
    date: "Week 06",
    content: "Coaching Owner tracks batch performance and student conversion trends.",
    category: "Analytics",
    icon: BrainCircuit,
    relatedIds: [3, 5, 8],
    status: "pending",
    energy: 62,
  },
  {
    id: 7,
    title: "Security & Compliance",
    date: "Week 07",
    content: "IT Admin audits access logs, backups, and compliance checkpoints.",
    category: "Security",
    icon: ShieldCheck,
    relatedIds: [4, 8],
    status: "completed",
    energy: 83,
  },
  {
    id: 8,
    title: "Campus Ops Dashboard",
    date: "Week 08",
    content: "Trustees monitor KPIs across admissions, finance, and outcomes.",
    category: "Leadership",
    icon: Building2,
    relatedIds: [6, 7],
    status: "pending",
    energy: 58,
  },
];

export const metadata = buildPageMetadata(pageMeta.home);

export default async function Page() {
  const cms = await getHomePage();
  const pillars = cms?.pillars ?? homePillars;
  const stats = cms?.stats ?? homeStats;
  const moduleHighlights = cms?.moduleHighlights ?? homeModuleHighlights;
  const trustedBy = cms?.trustedBy ?? homeCopy.trustedBy;
  const machineShowcase = cms?.machineShowcase ?? homeCopy.machineShowcase;
  const footerCta = cms?.footerCta ?? homeCopy.footerCta;
  const whatsNew = cms?.whatsNew ?? homeCopy.whatsNew;

  return (
    <div className="relative overflow-hidden pb-24">
      <section className="relative min-h-[80vh]">
        <IntroAnimation />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs tracking-[0.3em] text-blue-200 uppercase">All-in-One Educational OS</p>
            <h1 className="text-heading mt-4 text-3xl font-bold text-white md:text-5xl">
              ERP + LMS unified into one real-time campus command center.
            </h1>
            <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
              Replace 10 to 15 fragmented tools with a single platform spanning admissions, attendance, finance,
              academics, and communication. Classgrid ships 41 native modules that sync instantly across web and
              mobile.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="h-11 bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] px-5 text-white">
                <Link href="/demo">Book a 15-min demo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 border-white/20 bg-white/5 px-5 text-slate-100 hover:bg-white/10"
              >
                <Link href="/features">Explore 41 modules</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Real-time data sync</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                White-labeled subdomains
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                Built for Indian institutions
              </span>
            </div>
          </div>
          <DemoRequestForm
            title="Are you looking for smart solutions to automate your campus?"
            subtitle="Get a live demo environment provisioned in minutes. No credit card required."
            submitLabel="Book a 15-min demo"
          />
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm tracking-wide text-slate-300">{trustedBy}</p>
          <div className="mt-5 overflow-hidden">
          <div className="animate-marquee flex min-w-max gap-3">
            {[...homeSocialProof, ...homeSocialProof].map((name, index) => (
              <span
                key={`${name}-${index}`}
                className="rounded-md border border-white/15 bg-white/5 px-3 py-1 text-sm text-slate-200"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass rounded-2xl p-6 md:p-8">
            <p className="text-xs tracking-[0.3em] text-blue-200 uppercase">Fragmented Stack</p>
            <h2 className="text-heading mt-3 text-2xl font-bold text-white md:text-3xl">
              Replace 10+ disconnected tools with one campus platform.
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
              Most institutions juggle multiple vendors for every workflow. Classgrid consolidates data, automation,
              and reporting across admissions, academics, finance, and communication.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {chaosStack.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-slate-200"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section id="use-cases" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-xs tracking-[0.3em] text-blue-200 uppercase">Who We Serve</p>
          <h2 className="text-heading mt-2 text-2xl font-bold text-white md:text-3xl">
            Built for every education organization type.
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {orgSolutions.map((solution, index) => (
            <Reveal key={solution.title} delay={0.03 * index}>
              <Card className="glass h-full border-white/10 py-0">
                <CardHeader className="pt-5">
                  <CardTitle className="text-heading text-base text-white">{solution.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-5 text-sm text-slate-300">{solution.body}</CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <IntegrationHero />

      <RadialOrbitalTimeline timelineData={homeTimelineData} />

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass rounded-2xl p-6 md:p-8">
            <h2 className="text-heading text-2xl font-bold text-slate-100 md:text-3xl">{homeMachine.title}</h2>
            <p className="mt-3 max-w-3xl text-slate-300">{machineShowcase}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {homeMachine.cards.map((card, index) => (
                <div
                  key={card.label}
                  className={[
                    "rounded-xl border bg-slate-900/60 p-5",
                    index % 2 === 0 ? "border-blue-300/20" : "border-indigo-300/20",
                  ].join(" ")}
                >
                  <p className="text-xs tracking-[0.14em] text-blue-200 uppercase">{card.label}</p>
                  <p className="mt-2 text-sm text-slate-300">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal key={pillar.title} delay={0.04 * index}>
              <Card className="glass border-white/10 py-0">
                <CardHeader className="pt-5">
                  <CardTitle className="text-heading text-lg text-slate-100">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-5 text-slate-300">{pillar.body}</CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="glass overflow-hidden rounded-2xl p-2">
          <div className="animate-marquee flex min-w-max gap-2">
            {[...stats, ...stats].map((stat, index) => (
              <div
                key={`${stat.label}-${index}`}
                className="min-w-[240px] rounded-xl border border-white/10 bg-slate-900/50 px-5 py-4"
              >
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.16em] text-blue-200 uppercase">{homeModuleGrid.kicker}</p>
            <h2 className="text-heading mt-2 text-2xl font-bold text-white md:text-3xl">
              {homeModuleGrid.title}
            </h2>
          </div>
          <Button asChild variant="outline" className="border-white/20 bg-white/5 text-slate-100 hover:bg-white/10">
            <Link href="/features">{homeModuleGrid.cta}</Link>
          </Button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {moduleHighlights.map((module, index) => {
            const Icon = moduleIcons[index % moduleIcons.length];
            return (
              <Reveal key={module.title} delay={0.03 * index}>
                <Link href={module.href} className="block h-full">
                  <Card className="glass h-full border-white/10 py-0 transition hover:-translate-y-1 hover:border-blue-300/35">
                    <CardHeader className="pt-5">
                      <div className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-200">
                        <Icon className="size-4" />
                      </div>
                      <CardTitle className="text-heading text-base text-white">{module.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-5 text-sm text-slate-300">{module.description}</CardContent>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="glass rounded-2xl border border-blue-300/20 p-7 text-center">
            <p className="text-sm tracking-[0.14em] text-blue-200 uppercase">{homeFinalCta.kicker}</p>
            <h2 className="text-heading mt-2 text-3xl font-bold text-white">{footerCta}</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button asChild className="h-10 bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] px-5 text-white">
                <Link href="/demo">{homeFinalCta.primaryLabel}</Link>
              </Button>
              <Button asChild variant="outline" className="h-10 border-white/20 bg-white/5 px-5 text-slate-100 hover:bg-white/10">
                <Link href="/contact">{homeFinalCta.secondaryLabel}</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <div className="fixed right-4 bottom-4 z-40 max-w-sm rounded-full border border-orange-300/25 bg-[#f59e0b]/20 px-4 py-2 text-xs text-orange-100 shadow-xl backdrop-blur-xl sm:text-sm">
        {whatsNew}
      </div>
    </div>
  );
}
