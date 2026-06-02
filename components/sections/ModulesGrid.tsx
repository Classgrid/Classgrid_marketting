"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Award,
  BadgeCheck,
  BarChart3,
  BookMarked,
  BookOpen,
  Boxes,
  BrainCircuit,
  Briefcase,
  Building2,
  Bus,
  CalendarClock,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  FileText,
  Fingerprint,
  Globe,
  GraduationCap,
  HeartHandshake,
  Home,
  IdCard,
  LayoutDashboard,
  Library,
  MessagesSquare,
  Mic2,
  MonitorPlay,
  NotebookPen,
  Presentation,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { PillTabs } from "@/components/ui/pill-tabs";
import { normalizeAppHref } from "@/lib/route-maps";

const ICON_MAP: Record<string, any> = {
  // ── Legacy keys (kept for backward compat) ──
  "Classroom Hub": LayoutDashboard,
  "Online Examination": ClipboardCheck,
  "Attendance Analytics": Fingerprint,
  "Quiz Manager": BrainCircuit,
  "Academic Planning": CalendarClock,
  "Result Engine": FileText,
  "My Time Table": BookMarked,
  Assignments: BookOpen,
  "Internal Tests": Presentation,
  "Fee Management": CreditCard,
  "HRMS & Payroll": Users,
  "Library System": Library,
  "Canteen Wallet": Utensils,
  "Hostel Management": Home,
  "Certificate Gen": Award,
  "Inventory System": Settings,
  "Visitor Mgmt": Search,
  "Scholarship Mgmt": CircleDollarSign,
  "Franchise Dashboard": Building2,
  "Transport/Bus": Bus,
  "AI Quiz Maker": BrainCircuit,
  "AI Proctoring": ShieldCheck,
  "Voice Engine": Mic2,
  "Past Paper AI": BrainCircuit,
  "Timetable AI": Zap,
  "NAAC/NBA Engine": BadgeCheck,
  "Document Vault": ShieldCheck,
  "Exam Analytics": BarChart3,
  "Classgrid AI": BrainCircuit,
  "Lead CRM": TrendingUp,
  "Admission Engine": UserPlus,
  "Chat System": MessagesSquare,
  "Announcement Engine": Globe,
  "Alumni Network": GraduationCap,
  "Feedback Engine": HeartHandshake,
  "Events Manager": CalendarClock,
  "Notes Marketplace": Boxes,
  "Parent Dash 2.0": Users,
  "Student Portfolio": GraduationCap,
  "Digital Lesson Plan": BookOpen,
  "Lab Assistant": MonitorPlay,
  "Fee Ledger": Wallet,
  Placements: Briefcase,

  // ── Current canonical module titles (from content/homepage.ts) ──

  // Academic
  "Attendance System":             Fingerprint,
  "Digital Classroom Management":  LayoutDashboard,
  "Automated Timetable":           CalendarClock,
  "Academic Planning Tools":       BookMarked,
  "Homework & Assignment":         NotebookPen,
  "Student Notes Sharing":         Boxes,
  "Teacher Planner":               Presentation,
  "Subject Management":            BookOpen,
  "Course Management":             GraduationCap,

  // Assessment
  "Online Exam Platform":          ClipboardCheck,
  "Examination Management":        FileText,
  "Interactive Quiz Systems":      BrainCircuit,
  "Grade Entry & Results":         BarChart3,
  "Internal Assessment Tools":     Presentation,
  "CET/JEE/NEET Exam Conduction": ShieldCheck,
  "Past Paper & Mock Tests":       BrainCircuit,
  "AI-Powered Viva":               Mic2,
  "Test Series Management":        ClipboardCheck,

  // Management
  "Admission Management":          UserPlus,
  "Fee Collection System":         CreditCard,
  "Staff Leave & Payroll":         Users,
  "Canteen Management":            Utensils,
  "Digital Library Management":    Library,

  // Advanced
  "AI Assistant":                  BrainCircuit,
  "Advanced Analytics":            BarChart3,
  "Compliance Audit Trails":       BadgeCheck,
  "Digital Certificates":          Award,
  "Holiday Management":            CalendarClock,
  "Digital ID Cards":              IdCard,
  "Events Management":             Globe,
  "Feedback System":               HeartHandshake,
  "Institution Website":           Building2,

  // Dashboards
  "Admission Management Dashboard":      TrendingUp,
  "Fee Management Dashboard":            Wallet,
  "Library Management Dashboard":        Library,
  "Student Management Dashboard":        Users,
  "Faculty Management Dashboard":        Presentation,
  "Organization Management Dashboard":   Building2,
  "Canteen Management Dashboard":        Utensils,
  "Leave Management Dashboard":          CalendarClock,
};

type ModuleCard = {
  title: string;
  description: string;
  color?: string;
  iconColor?: string;
  link?: string;
  orgs?: string[];
};

type AudienceTab = {
  id: string;
  label: string;
};

type ModulesGridProps = {
  modules?: ModuleCard[];
  audienceTabs?: AudienceTab[];
  allTabLabel?: string;
  moduleCardCtaLabel?: string;
  showMoreLabel?: string;
  viewAllLabel?: string;
  calloutTitle?: string;
  calloutBody?: string;
  calloutCtaLabel?: string;
  calloutCtaHref?: string;
  useFallbackContent?: boolean;
};

export function ModulesGrid({
  modules,
  audienceTabs,
  allTabLabel,
  moduleCardCtaLabel,
  showMoreLabel,
  viewAllLabel,
  calloutTitle,
  calloutBody,
  calloutCtaLabel,
  calloutCtaHref,
}: ModulesGridProps) {
  const sanitizedTabs = Array.isArray(audienceTabs)
    ? audienceTabs
        .filter((tab) => tab?.id?.trim() && tab?.label?.trim())
        .map((tab) => ({
          id: tab.id.trim().toLowerCase(),
          label: tab.label.trim(),
        }))
    : [];

  const tabsToUse = sanitizedTabs.length
    ? sanitizedTabs.some((tab) => tab.id === "all")
      ? sanitizedTabs
      : allTabLabel?.trim()
        ? [{ id: "all", label: allTabLabel.trim() }, ...sanitizedTabs]
        : sanitizedTabs
    : [];

  const sourceModules = Array.isArray(modules)
    ? modules.filter((module) => module?.title?.trim() || module?.description?.trim())
    : [];

  const INITIAL_COUNT = 9;
  const LOAD_STEP = 22;

  const defaultTab = tabsToUse.find((tab) => tab.id === "all")?.id ?? tabsToUse[0]?.id ?? "all";
  const [activeOrg, setActiveOrg] = useState(defaultTab);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const filteredModules = useMemo(() => {
    if (!sourceModules.length) {
      return [];
    }

    if (activeOrg === "all") {
      return sourceModules;
    }

    return sourceModules.filter((module) => Array.isArray(module.orgs) && module.orgs.includes(activeOrg));
  }, [activeOrg, sourceModules]);

  const displayedModules = filteredModules.slice(0, visibleCount);
  const remaining = filteredModules.length - visibleCount;
  const showCallout = Boolean(
    calloutTitle?.trim() || calloutBody?.trim() || (calloutCtaLabel?.trim() && calloutCtaHref?.trim())
  );

  if (!filteredModules.length && !showCallout) {
    return null;
  }

  return (
    <div className="min-h-[400px] space-y-10">
      {tabsToUse.length > 0 ? (
        <div className="mb-8 flex flex-col items-center gap-4">
          <PillTabs
            tabs={tabsToUse}
            activeId={activeOrg}
            layoutId="modules-pill-tab"
            onChange={(value) => {
              setActiveOrg(value);
              setVisibleCount(INITIAL_COUNT);
            }}
          />
        </div>
      ) : null}

      {filteredModules.length > 0 ? (
        <div className="relative">
          <BentoGrid className="gap-4 lg:auto-rows-[200px]">
            <AnimatePresence mode="popLayout">
              {displayedModules.map((feature, index) => (
                <motion.div
                  key={`${activeOrg}-${feature.title}`}
                  layout
                  initial={{ opacity: 0, y: 28, filter: "blur(8px)", scale: 0.96 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 420,
                      damping: 28,
                      delay: index * 0.05,
                      filter: { duration: 0.3, delay: index * 0.05 },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: -16,
                    filter: "blur(6px)",
                    scale: 0.97,
                    transition: { duration: 0.18, ease: "easeIn" },
                  }}
                  className="h-full"
                >
                  <BentoCard
                    name={feature.title}
                    description={feature.description}
                    href={feature.link ? normalizeAppHref(feature.link) : feature.link}
                    cta={moduleCardCtaLabel}
                    Icon={ICON_MAP[feature.title] || Settings}
                    color={feature.color}
                    iconColor={feature.iconColor}
                    className="h-full"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </BentoGrid>

          {remaining > 0 ? (
            <div className="mt-8 flex justify-center">
              <Button asChild>
                <button
                  onClick={() => setVisibleCount((c) => c + LOAD_STEP)}
                  className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full font-bold px-8 shadow-lg !p-0"
                  style={{ width: "220px" }}
                >
                  <span className="relative z-10 flex h-full w-full items-center justify-center transition-transform group-hover:-translate-y-full">
                    Load {Math.min(LOAD_STEP, remaining)} More
                  </span>
                  <div className="absolute inset-0 flex h-full w-full translate-y-full items-center justify-center bg-emerald-500 text-white transition-transform group-hover:translate-y-0">
                    {remaining} remaining
                  </div>
                </button>
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {showCallout ? (
        <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-10 text-center shadow-xl backdrop-blur-sm dark:bg-emerald-950/40">
          {calloutTitle?.trim() ? (
            <h3 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">{calloutTitle}</h3>
          ) : null}
          {calloutBody?.trim() ? (
            <p className="mx-auto mb-8 max-w-2xl text-slate-600 dark:text-emerald-100/70">{calloutBody}</p>
          ) : null}
          {calloutCtaLabel?.trim() && calloutCtaHref?.trim() ? (
            /* ── TO RE-ENABLE: Remove the isViewPlatform block below and keep only the Button+Link version ── */
            calloutCtaHref === "/view-platform" ? (
              <Button size="lg" className="h-14 rounded-full px-10 text-base font-bold cursor-not-allowed opacity-60">
                {calloutCtaLabel}
              </Button>
            ) : (
              <Button asChild size="lg" className="h-14 rounded-full px-10 text-base font-bold">
                <Link href={calloutCtaHref}>
                  {calloutCtaLabel}
                </Link>
              </Button>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
