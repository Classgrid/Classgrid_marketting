"use client";

import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, School, Target, UserRound, Users, Waypoints } from "lucide-react";
import { getIndustrySolutionPath, getRoleSolutionPath } from "@/lib/route-maps";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

const industryCards = [
  {
    title: "Schools",
    description: "Attendance, parent communication, timetable, fee collection, and classroom continuity.",
    href: "/solutions/for-schools",
    exploreHref: "/solutions/for-schools",
    icon: School,
    color: "from-emerald-500/10",
    glow: "hover:shadow-emerald-500/10",
  },
  {
    title: "Colleges",
    description: "Semester workflows, admissions, results, compliance, and campus operations.",
    href: "/solutions/for-colleges",
    exploreHref: "/solutions/for-colleges",
    icon: GraduationCap,
    color: "from-sky-500/10",
    glow: "hover:shadow-sky-500/10",
  },
  {
    title: "Engineering",
    description: "Complex academic structures, accreditation, exam control, and departmental oversight.",
    href: "/solutions/for-engineering",
    exploreHref: "/solutions/for-engineering",
    icon: Building2,
    color: "from-violet-500/10",
    glow: "hover:shadow-violet-500/10",
  },
  {
    title: "Coaching",
    description: "Batches, mock tests, CET/JEE/NEET prep, fee recovery, and rapid communication.",
    href: "/solutions/for-coaching",
    exploreHref: "/solutions/for-coaching",
    icon: Target,
    color: "from-orange-500/10",
    glow: "hover:shadow-orange-500/10",
  },
];

const roleCards = [
  {
    title: "Students",
    description: "Assignments, ID card, alerts, notes, AI guidance, and exam access in one flow.",
    href: "/solutions/for-students",
    exploreHref: "/solutions/for-students",
    icon: UserRound,
    color: "from-emerald-500/10",
    glow: "hover:shadow-emerald-500/10",
    highlight: true,
  },
  {
    title: "Teachers",
    description: "Attendance, grading, planner tools, reports, classroom control, and time-saving automation.",
    href: "/solutions/for-teachers",
    exploreHref: "/solutions/for-teachers",
    icon: Users,
    color: "from-blue-500/10",
    glow: "hover:shadow-blue-500/10",
  },
  {
    title: "Admins",
    description: "Operations visibility, finance, admissions, analytics, and leadership-level reporting.",
    href: "/solutions/for-admins",
    exploreHref: "/solutions/for-admins",
    icon: Waypoints,
    color: "from-purple-500/10",
    glow: "hover:shadow-purple-500/10",
  },
];

export function SolutionsPortal() {
  return (
    <main className="relative min-h-screen bg-background px-4 pb-20 pt-28 text-foreground md:pt-36 overflow-hidden">
      {/* Faint dot grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #6ee7b7 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <section className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <SectionAccentBar className="mb-4" />
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-500">
            Solutions
          </p>
          <h1 className="mt-4 text-balance text-4xl font-black tracking-tight text-foreground md:text-6xl">
            Solutions for every role and workflow
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
            Choose the path that best matches your responsibilities and explore the tools, workflows, and capabilities designed for your needs.
          </p>
        </div>

        {/* Two panels */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">

          {/* ── For Institutions ── */}
          <section className="group/panel relative overflow-hidden rounded-[28px] border border-border/60 bg-card p-8 shadow-sm ring-1 ring-white/5 transition hover:border-border">
            {/* Panel label */}
            <div className="mb-6 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                For Institutions
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {industryCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-background/60 p-5 transition-all duration-300
                      hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/8 ${card.glow}`}
                  >
                    {/* Hover glow gradient */}
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.color} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl`} />

                    {/* Icon */}
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5" />
                    </div>

                    {/* Text */}
                    <h2 className="relative mt-4 text-[19px] font-bold tracking-tight text-foreground">
                      {card.title}
                    </h2>
                    <p className="relative mt-2 flex-1 text-[13px] leading-6 text-muted-foreground">
                      {card.description}
                    </p>

                    {/* Explore link */}
                    <div className="relative mt-4 flex items-center gap-1 text-[12px] font-semibold text-emerald-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
                      Explore <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* ── For Users ── */}
          <section className="group/panel relative overflow-hidden rounded-[28px] border border-border/60 bg-card p-8 shadow-sm ring-1 ring-white/5 transition hover:border-border">
            {/* Panel label */}
            <div className="mb-6 flex items-center gap-2">
              <UserRound className="h-4 w-4 text-emerald-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500">
                For Users
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 auto-rows-fr">
              {roleCards.map((card, idx) => {
                const Icon = card.icon;
                // Make Students span full width on sm+ since it's the primary user
                const isWide = idx === 0;
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-background/60 p-5 transition-all duration-300
                      hover:-translate-y-1.5 hover:shadow-xl ${card.glow}
                      ${isWide ? "sm:col-span-2 border-emerald-500/30" : "border-border hover:border-emerald-500/40"}`}
                  >
                    {/* Hover glow gradient */}
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.color} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl`} />

                    {/* Active glow for Students (primary) */}
                    {isWide && (
                      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-transparent" />
                    )}

                    <div className="relative flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-[19px] font-bold tracking-tight text-foreground">
                          {card.title}
                        </h2>
                        <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Explore link */}
                    <div className="relative mt-4 flex items-center gap-1 text-[12px] font-semibold text-emerald-500 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5">
                      Explore <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        {/* Bottom CTA — Explore 25+ modules */}
        <div className="mt-12 text-center">
          <Link
            href="/product/modules/smart-attendance"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-emerald-500/50 bg-transparent px-8 py-3.5 text-sm font-semibold text-emerald-400 transition-all duration-300 hover:border-emerald-500 hover:bg-emerald-500/8 hover:text-emerald-300 hover:shadow-lg hover:shadow-emerald-500/15"
          >
            {/* Shimmer sweep */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Explore 25+ modules</span>
            <ArrowRight className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
