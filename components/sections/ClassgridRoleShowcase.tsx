"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckSquare,
  ClipboardList,
  BookOpen,
  Calendar,
  FileQuestion,
  CalendarX,
  UploadCloud,
  ClipboardCheck,
  MonitorCheck,
  Trophy,
  CreditCard,
  Route,
  Phone,
  UserCheck,
  FileCheck2,
  Download,
  GraduationCap,
  User,
  Users,
  ImageIcon,
} from "lucide-react";
import { IPhone15Pro } from "@/components/ui/iphone-15-pro";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────
type LucideIconType = React.ComponentType<{ className?: string }>;

type Feature = {
  id: string;
  label: string;
  Icon: LucideIconType;
  /** Real screenshot URL from Sanity — if null, shows placeholder */
  imageUrl: string | null;
  imageAlt?: string;
};

type Role = {
  id: string;
  label: string;
  TabIcon: LucideIconType;
  features: Feature[];
};

// ── Static feature definitions (no fallback images — Sanity only) ────
const STATIC_ROLES: Role[] = [
  {
    id: "faculty",
    label: "Faculty",
    TabIcon: GraduationCap,
    features: [
      { id: "attendance", label: "Attendance", Icon: CheckSquare, imageUrl: null },
      { id: "assignments", label: "Assignments", Icon: ClipboardList, imageUrl: null },
      { id: "planning", label: "Academic Planning", Icon: BookOpen, imageUrl: null },
      { id: "timetable", label: "My Time Table", Icon: Calendar, imageUrl: null },
      { id: "exam", label: "Online Exam Builder", Icon: FileQuestion, imageUrl: null },
      { id: "leave", label: "Manage Leaves", Icon: CalendarX, imageUrl: null },
    ],
  },
  {
    id: "student",
    label: "Student",
    TabIcon: User,
    features: [
      { id: "assignments", label: "Assignments", Icon: UploadCloud, imageUrl: null },
      { id: "attendance", label: "Attendance", Icon: ClipboardCheck, imageUrl: null },
      { id: "timetable", label: "My Time Table", Icon: Calendar, imageUrl: null },
      { id: "examination", label: "Examination", Icon: MonitorCheck, imageUrl: null },
      { id: "result", label: "Result", Icon: Trophy, imageUrl: null },
      { id: "fees", label: "Fees", Icon: CreditCard, imageUrl: null },
    ],
  },
  {
    id: "parent",
    label: "Parent",
    TabIcon: Users,
    features: [
      { id: "track", label: "Track Application", Icon: Route, imageUrl: null },
      { id: "phone", label: "Phone Verification", Icon: Phone, imageUrl: null },
      { id: "status", label: "Student Status Card", Icon: UserCheck, imageUrl: null },
      { id: "document", label: "Document Status", Icon: FileCheck2, imageUrl: null },
      { id: "fee-alert", label: "Fee Payment Alert", Icon: CreditCard, imageUrl: null },
      { id: "receipt", label: "Admission Letter", Icon: Download, imageUrl: null },
    ],
  },
];

// ── Sanity override types ────────────────────────────────────────────
export type SanityEcosystemFeature = {
  label?: string;
  imageUrl?: string | null;
  imageAlt?: string;
};

export type SanityAppEcosystem = {
  faculty?: SanityEcosystemFeature[];
  student?: SanityEcosystemFeature[];
  parent?: SanityEcosystemFeature[];
};

// ── Merge helper — Sanity images override static nulls ──────────────
function mergeWithSanityObject(
  staticRoles: Role[],
  sanity: SanityAppEcosystem | null | undefined
): Role[] {
  if (!sanity) return staticRoles;
  return staticRoles.map((role) => {
    const sanityFeatures = sanity[role.id as keyof SanityAppEcosystem];
    if (!sanityFeatures || !sanityFeatures.length) return role;
    return {
      ...role,
      features: role.features.map((feat, i) => {
        const sf = sanityFeatures[i];
        return {
          ...feat,
          label: sf?.label ?? feat.label,
          imageUrl: sf?.imageUrl ?? feat.imageUrl,
          imageAlt: sf?.imageAlt ?? feat.imageAlt,
        };
      }),
    };
  });
}

// ── Phone placeholder state ──────────────────────────────────────────
function PhonePlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 bg-muted/30 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background">
        <ImageIcon className="h-6 w-6 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
          Screenshot coming soon
        </p>
      </div>
      {/* Skeleton lines to simulate a UI */}
      <div className="mt-2 w-full space-y-2 px-2">
        {[80, 60, 90, 50].map((w, i) => (
          <div
            key={i}
            className="h-2 rounded-full bg-border animate-pulse"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Props ────────────────────────────────────────────────────────────
type ClassgridRoleShowcaseProps = {
  /** Optional Sanity data — overrides static when present */
  sanityEcosystem?: SanityAppEcosystem | null;
  kicker?: string;
  heading?: string;
  subtext?: string;
};

// ── Main component ───────────────────────────────────────────────────
export function ClassgridRoleShowcase({
  sanityEcosystem,
  kicker = "App Ecosystem",
  heading = "One app for every role",
  subtext = "Faculty, Student, and Parent apps — purpose-built for the way each role works",
}: ClassgridRoleShowcaseProps) {
  const roles = mergeWithSanityObject(STATIC_ROLES, sanityEcosystem);
  const [activeRoleId, setActiveRoleId] = useState<string>(roles[0].id);
  const [activeFeatureIdx, setActiveFeatureIdx] = useState(0);

  const activeRole = roles.find((r) => r.id === activeRoleId) ?? roles[0];
  const activeFeature = activeRole.features[activeFeatureIdx] ?? activeRole.features[0];

  function handleTabChange(roleId: string) {
    setActiveRoleId(roleId);
    setActiveFeatureIdx(0);
  }

  return (
    <section className="relative overflow-hidden bg-muted py-24 md:py-32">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-60 top-0 h-[600px] w-[600px] rounded-full bg-emerald-500/8 blur-[120px]" />
        <div className="absolute -right-60 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-500/6 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6">
        {/* ── Section header ── */}
        <div className="mb-16 text-center">
          <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500"></div>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {kicker}
          </span>
          <h2 className="mt-5 text-4xl font-black tracking-[-0.03em] text-foreground md:text-5xl lg:text-6xl">
            {heading}
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-base leading-relaxed text-muted-foreground">
            {subtext}
          </p>
        </div>

        {/* ── Role Tab Bar ── */}
        <div className="mb-16 flex justify-center">
          <div className="relative flex items-center p-1.5 rounded-full border border-border/40 bg-muted/20 backdrop-blur-md">
            {roles.map((role) => {
              const isActive = role.id === activeRoleId;
              return (
                <button
                  key={role.id}
                  onClick={() => handleTabChange(role.id)}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold transition-colors outline-none",
                    isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-role-pill"
                      className="absolute inset-0 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <role.TabIcon className="relative z-10 h-4 w-4" />
                  <span className="relative z-10">{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Main two-column layout ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoleId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_auto]"
          >
            {/* Left: 2×3 feature cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:gap-4">
              {activeRole.features.map((feature, idx) => {
                const isActiveFeature = idx === activeFeatureIdx;
                return (
                  <motion.button
                    key={feature.id}
                    onClick={() => setActiveFeatureIdx(idx)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-200 outline-none",
                      isActiveFeature
                        ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_24px_rgba(16,185,129,0.12)]"
                        : "border-border bg-card hover:border-border/80 hover:bg-muted/50"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isActiveFeature
                          ? "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground group-hover:bg-muted/80 group-hover:text-foreground"
                      )}
                    >
                      <feature.Icon className="h-4 w-4" />
                    </div>
                    {/* Label */}
                    <span
                      className={cn(
                        "text-sm font-semibold leading-snug transition-colors",
                        isActiveFeature
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {feature.label}
                    </span>
                    {/* Active indicator ring */}
                    {isActiveFeature && (
                      <motion.div
                        layoutId="feature-ring"
                        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-emerald-400/30"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Right: IPhone mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {/* Glow orb behind phone */}
                  <div className="absolute inset-0 -m-12 rounded-full bg-emerald-400/12 blur-3xl" />
                  <IPhone15Pro className="relative w-[240px] shadow-[0_30px_80px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.7)] md:w-[280px]">
                    <div className="flex h-full flex-col overflow-hidden bg-background">
                      <div
                        key={`${activeRoleId}-${activeFeatureIdx}`}
                        className="flex-1 overflow-hidden"
                      >
                        {activeFeature.imageUrl ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={activeFeature.imageUrl}
                              alt={activeFeature.imageAlt ?? activeFeature.label}
                              fill
                              className="object-cover object-top"
                              sizes="280px"
                            />
                          </div>
                        ) : (
                          <PhonePlaceholder label={activeFeature.label} />
                        )}
                      </div>
                    </div>
                  </IPhone15Pro>
                </div>

                {/* Google Play Badge */}
                {(() => {
                  const PLAY_STORE_LINKS: Record<string, string> = {
                    faculty: "#faculty-app-link-here",
                    student: "#student-app-link-here",
                    parent: "#parent-app-link-here",
                  };
                  return (
                    <motion.a
                      key={`badge-${activeRoleId}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      href={PLAY_STORE_LINKS[activeRoleId] || "#"}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 transition-opacity hover:opacity-80"
                    >
                      <img 
                        alt={`Get ${activeRole.label} App on Google Play`} 
                        src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                        className="h-[52px] w-auto"
                      />
                    </motion.a>
                  );
                })()}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
