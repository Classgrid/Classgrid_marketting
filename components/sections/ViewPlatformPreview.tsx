"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Expand,
  Monitor,
  LogIn,
  Copy,
  Check,
  Shrink
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

/* ── CDN base URL for the CDS demo org ── */
const BASE = "https://cds.classgrid.in";

/* ── Desktop admin roles — each role has its own login portal ── */
const adminRoles = [
  { id: "org_admin",   label: "Org Admin",          email: "admin@cds.classgrid.in",      pass: "cdspass@123", loginUrl: `${BASE}/org/login` },
  { id: "admission",   label: "Admissions",         email: "admission@cds.classgrid.in",  pass: "cdspass@123", loginUrl: `${BASE}/dept/admissions/login` },
  { id: "fees",        label: "Fees",               email: "fees@cds.classgrid.in",       pass: "cdspass@123", loginUrl: `${BASE}/dept/fees/login` },
  { id: "examination", label: "Examination",        email: "exam@cds.classgrid.in",       pass: "cdspass@123", loginUrl: `${BASE}/dept/exams/login` },
  { id: "library",     label: "Library",            email: "library@cds.classgrid.in",    pass: "cdspass@123", loginUrl: `${BASE}/dept/library/login` },
  { id: "attendance",  label: "Attendance",         email: "attendance@cds.classgrid.in", pass: "cdspass@123", loginUrl: `${BASE}/dept/attendance/login` },
  { id: "hr",          label: "HR & Payroll",       email: "hr@cds.classgrid.in",         pass: "cdspass@123", loginUrl: `${BASE}/dept/hr/login` },
  { id: "hostel",      label: "Hostel & Transport", email: "hostel@cds.classgrid.in",     pass: "cdspass@123", loginUrl: `${BASE}/dept/hostel/login` },
  { id: "student",     label: "Student",            email: "student@cds.classgrid.in",    pass: "cdspass@123", loginUrl: `${BASE}/student/login` },
  { id: "faculty",     label: "Faculty",            email: "faculty@cds.classgrid.in",    pass: "cdspass@123", loginUrl: `${BASE}/faculty/login` },
] as const;

/* ── Reusable live iframe ── */
function LiveIframe({
  src,
  title,
  className,
  hideScrollbar = false,
}: {
  src: string;
  title: string;
  className?: string;
  hideScrollbar?: boolean;
}) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (iframeLoaded && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "theme-sync", theme: resolvedTheme }, "*");
    }
  }, [resolvedTheme, iframeLoaded]);

  const isReady = iframeLoaded && minTimePassed;

  // Hide the global website header when the user is interacting with the preview to maximize space
  const handleMouseEnter = () => {
    const header = document.querySelector('header');
    if (header) {
      header.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
      header.style.transform = 'translateY(-100%)';
      header.style.opacity = '0';
      header.style.pointerEvents = 'none';
    }
  };

  const handleMouseLeave = () => {
    const header = document.querySelector('header');
    if (header) {
      header.style.transform = 'translateY(0)';
      header.style.opacity = '1';
      header.style.pointerEvents = 'auto';
    }
  };

  return (
    <div
      className={cn("relative w-full h-full overflow-hidden rounded-[inherit] bg-[#fafafa] overscroll-contain", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full border border-slate-200 bg-[#fafafa] p-3 shadow-md flex items-center justify-center">
              <Spinner className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-xs font-medium text-slate-500">
              Loading live platform…
            </p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        loading="lazy"
        allowFullScreen
        scrolling="yes"
        referrerPolicy="strict-origin-when-cross-origin"
        onLoad={() => setIframeLoaded(true)}
        className={cn(
          "h-full border-0 transition-opacity duration-1000 overscroll-contain max-w-none",
          hideScrollbar ? "w-[calc(100%+24px)]" : "w-full",
          isReady ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

/* ── Copy button ── */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/8 px-2 py-1 text-xs text-white/60 transition-colors hover:bg-white/14 hover:text-white"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-400" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

/* ── Main component ── */
export function ViewPlatformPreview() {
  const desktopRef = useRef<HTMLDivElement>(null);
  const [activeAdminRole, setActiveAdminRole] = useState<string>(adminRoles[0].id);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const activeAdminRoleData = adminRoles.find((r) => r.id === activeAdminRole) || adminRoles[0];

  async function handleFullscreen() {
    const el = desktopRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await el.requestFullscreen?.();
    }
  }

  return (
    <main className="marketing-shell overflow-x-hidden bg-[#030712] text-white">
      {/* ─── Hero ─── */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="marketing-mesh absolute inset-0 opacity-80" />
        <div className="marketing-grid absolute inset-0 opacity-35" />
        <div className="marketing-noise absolute inset-0 opacity-35" />
        <div className="absolute -left-16 top-12 h-72 w-72 rounded-full bg-cyan-500/16 blur-3xl" />
        <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-emerald-500/16 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20 lg:py-24 text-center">
          <Badge className="rounded-full border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-100">
            <span className="relative mr-2 inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/80" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            Live Platform
          </Badge>
          <SectionAccentBar className="mt-6" />

          <h1 className="mt-6 mx-auto max-w-4xl text-balance text-4xl font-black leading-[0.95] tracking-[-0.04em] md:text-5xl lg:text-6xl bg-linear-to-r from-emerald-300 via-cyan-300 to-emerald-400 bg-clip-text text-transparent pb-4">
            Experience Classgrid
          </h1>

          <p className="mt-5 mx-auto max-w-2xl text-base leading-7 text-white/55 md:text-lg md:leading-8">
            Select a role below to view its specific dashboard and credentials.
            Log in directly through the preview to explore real workflows.
          </p>
        </div>
      </section>

      {/* ─── Main Interactive Preview ─── */}
      <section className="relative py-12 md:py-16">
        <div className="marketing-divider absolute inset-x-0 top-0" />
        <div className="marketing-grid absolute inset-0 opacity-20" />
        <div className="marketing-noise absolute inset-0 opacity-30" />
        <div className="absolute inset-x-[12%] top-0 h-72 bg-gradient-to-b from-emerald-400/20 via-emerald-400/8 to-transparent blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-8">
            
            {/* Dynamic Credentials */}
            <div className="w-full lg:max-w-sm shrink-0">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-white/70">
                      Demo Credentials
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase border-emerald-400/20 text-emerald-200 bg-emerald-400/10">
                    {activeAdminRoleData.label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.03] px-4 py-2.5">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">Email</span>
                      <p className="font-mono text-sm text-white/90">{activeAdminRoleData.email}</p>
                    </div>
                    <CopyButton text={activeAdminRoleData.email} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-white/8 bg-white/[0.03] px-4 py-2.5">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-white/40">Password</span>
                      <p className="font-mono text-sm text-white/90">{activeAdminRoleData.pass}</p>
                    </div>
                    <CopyButton text={activeAdminRoleData.pass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-6 w-full items-start lg:items-end lg:w-auto">
              <div className="flex items-center gap-4">
                <ThemeSwitcher />
                <Button
                  type="button"
                  variant="outline"
                  className="hidden lg:flex rounded-full border-white/12 bg-white/6 text-xs text-white hover:bg-white/10 hover:text-white"
                  onClick={handleFullscreen}
                >
                  <Expand className="mr-1.5 h-3.5 w-3.5" />
                  Fullscreen
                </Button>
              </div>

              {/* Role Switcher */}
              <div className="flex flex-wrap gap-2 justify-start lg:justify-end max-w-2xl animate-in fade-in slide-in-from-top-2">
                {adminRoles.map((role) => {
                  const active = activeAdminRole === role.id;
                  return (
                    <button
                      key={role.id}
                      onClick={() => setActiveAdminRole(role.id)}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-semibold transition-all border",
                        active
                          ? "bg-emerald-400 text-slate-950 border-emerald-400 shadow-lg"
                          : "border-white/10 bg-white/6 text-white/68 hover:bg-white/12 hover:text-white"
                      )}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div className="mt-4 outline-none">
            <div className="mx-auto w-full max-w-5xl">
              <div
                ref={desktopRef}
                className={cn(
                  "rounded-2xl border border-white/8 bg-[#030712] p-2 shadow-[0_8px_40px_rgba(0,0,0,0.5)] transition-all relative",
                  isFullscreen ? "w-full h-screen p-0 md:p-0 rounded-none border-0" : "md:p-3"
                )}
              >
                <div className={cn("flex flex-col overflow-hidden bg-slate-900 h-full", isFullscreen ? "rounded-none" : "rounded-xl border border-white/6")}>
                  {/* Browser chrome */}
                  <div className="flex items-center gap-4 border-b border-white/8 bg-slate-900/80 px-4 py-2.5 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="flex flex-1 items-center gap-2 rounded-md border border-white/8 bg-white/5 px-3 py-1 text-[11px] text-white/50">
                      <span className="truncate">{activeAdminRoleData.loginUrl.replace('https://', '')}</span>
                    </div>
                  </div>
                  {/* Iframe */}
                  <div className={cn("w-full transition-all relative", isFullscreen ? "flex-1 min-h-0" : "aspect-video")}>
                    <LiveIframe
                      src={activeAdminRoleData.loginUrl}
                      title={`Classgrid ${activeAdminRoleData.label} — Live Platform`}
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                </div>

                {isFullscreen && (
                  <Button
                    variant="outline"
                    onClick={handleFullscreen}
                    className="absolute bottom-6 right-6 z-50 rounded-full bg-slate-900/80 text-white hover:bg-slate-800 border-white/10 shadow-xl"
                  >
                    <Shrink className="mr-2 w-4 h-4" />
                    Exit Fullscreen
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CDS Organization Details ─── */}
      <section className="relative py-16 md:py-20">
        <div className="marketing-divider absolute inset-x-0 top-0" />
        <div className="marketing-grid absolute inset-0 opacity-20" />
        <div className="marketing-noise absolute inset-0 opacity-30" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 space-y-16">

          {/* Section Header */}
          <div className="text-center">
            <Badge className="rounded-full border-cyan-400/20 bg-cyan-400/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
              Demo Organization
            </Badge>
            <SectionAccentBar className="mt-6" />
            <h2 className="mt-6 text-3xl font-black tracking-tight text-white md:text-4xl">
              Classgrid Demo School (CDS)
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-base text-white/55 leading-7">
              A fully configured demo organization pre-loaded with sample data.
              Explore every module using the credentials below.
            </p>
          </div>

          {/* ── Organization Identity ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                <Monitor className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Organization Identity &amp; Configuration</h3>
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.04]">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Setting</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {[
                    ["Institution Name", "Classgrid Demo School"],
                    ["Official Address", "Demo Campus, Virtual City"],
                    ["Principal / Owner", "School Principal"],
                    ["Owner Email", "admin@cds.classgrid.in"],
                    ["Contact Number", "+91 9999999999"],
                    ["Website URL", "https://cds.classgrid.in"],
                    ["Designation", "Principal"],
                    ["University / Board", "Classgrid Demo Board"],
                    ["Subdomain", "cds → cds.classgrid.in"],
                    ["Org Type", "School"],
                    ["Structure Type", "School with Divisions"],
                  ].map(([setting, value]) => (
                    <tr key={setting} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-medium text-white/80">{setting}</td>
                      <td className="px-5 py-3 font-mono text-white/60 text-xs">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Academic Hierarchy ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                <ArrowUpRight className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Academic Hierarchy</h3>
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.04]">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Level</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium text-white/80">Standard</td>
                    <td className="px-5 py-3 text-white/60">Class 1 through Class 10</td>
                  </tr>
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-medium text-white/80">Division (Section)</td>
                    <td className="px-5 py-3 text-white/60">Section A / Section B</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-white/40 italic">Note: Schools do not use Departments, Semesters, or Sub Batches.</p>
          </div>

          {/* ── Platform Terminology ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-400/10 text-violet-400">
                <Monitor className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Platform Terminology (School Mode)</h3>
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.04]">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Concept</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">UI Label</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {[
                    ["Org Label", "School"],
                    ["Top Level", "Standard"],
                    ["Course", "Class"],
                    ["Year", "Class"],
                    ["Period", "Term"],
                    ["Division", "Section"],
                    ["Sub Batch", "Not applicable"],
                    ["Student ID", "Roll No"],
                    ["Teacher", "Teacher"],
                    ["Assignment", "Homework"],
                    ["Exam", "Test"],
                  ].map(([concept, label]) => (
                    <tr key={concept} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-medium text-white/80">{concept}</td>
                      <td className="px-5 py-3 text-white/60">{label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Branding & Theme ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-400/10 text-rose-400">
                <Monitor className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Branding &amp; Theme</h3>
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.04]">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Setting</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {[
                    ["Primary Color", "#6366f1 (Indigo)"],
                    ["Secondary Color", "#4f46e5 (Dark Indigo)"],
                    ["Accent Color", "#f43f5e (Rose)"],
                    ["Font Preference", "Inter"],
                    ["Tagline", "Empowering Education"],
                  ].map(([setting, value]) => (
                    <tr key={setting} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-medium text-white/80">{setting}</td>
                      <td className="px-5 py-3 text-white/60 flex items-center gap-2">
                        {setting === "Primary Color" && <span className="inline-block h-3 w-3 rounded-full bg-indigo-500" />}
                        {setting === "Secondary Color" && <span className="inline-block h-3 w-3 rounded-full bg-indigo-600" />}
                        {setting === "Accent Color" && <span className="inline-block h-3 w-3 rounded-full bg-rose-500" />}
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Role Login URLs ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                <LogIn className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Role Login URLs</h3>
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.04]">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Role</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Login URL</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {[
                    ["Org Admin", "cds.classgrid.in/org/login", "Desktop"],
                    ["Admission Dept", "cds.classgrid.in/dept/admissions/login", "Desktop"],
                    ["Fees Dept", "cds.classgrid.in/dept/fees/login", "Desktop"],
                    ["Exam Dept", "cds.classgrid.in/dept/exams/login", "Desktop"],
                    ["Library Dept", "cds.classgrid.in/dept/library/login", "Desktop"],
                    ["Attendance Dept", "cds.classgrid.in/dept/attendance/login", "Desktop"],
                    ["HR & Payroll", "cds.classgrid.in/dept/hr/login", "Desktop"],
                    ["Hostel & Transport", "cds.classgrid.in/dept/hostel/login", "Desktop"],
                    ["Faculty / Teachers", "cds.classgrid.in/faculty/login", "Desktop & Mobile"],
                    ["Students", "cds.classgrid.in/student/login", "Desktop & Mobile"],
                  ].map(([role, url, device]) => (
                    <tr key={role} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-medium text-white/80">{role}</td>
                      <td className="px-5 py-3 font-mono text-xs text-emerald-400/80">{url}</td>
                      <td className="px-5 py-3 text-white/50 text-xs">{device}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Demo Accounts & Credentials ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                <LogIn className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Demo Accounts &amp; Credentials</h3>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/[0.03] px-4 py-3">
              <span className="text-xs text-white/50">Shared Password for all accounts:</span>
              <code className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 font-mono text-sm font-bold text-emerald-300">cdspass@123</code>
              <CopyButton text="cdspass@123" />
            </div>
            <div className="overflow-x-auto rounded-xl border border-white/8 bg-white/[0.03] backdrop-blur-sm">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.04]">
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Role</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Email</th>
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Access Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/6">
                  {[
                    ["Org Admin", "admin@cds.classgrid.in", "Full access to CDS configuration, modules, and user management."],
                    ["Admission Head", "admission@cds.classgrid.in", "Admission portal, fee tracking for new admits, and application review."],
                    ["Fee Manager", "fees@cds.classgrid.in", "Fee collection, ledgers, invoice generation, and refunds."],
                    ["Exam Controller", "exam@cds.classgrid.in", "Exam scheduling, marksheets, and result generation."],
                    ["Library Manager", "library@cds.classgrid.in", "Book inventory, issuance, and fines."],
                    ["Attendance Manager", "attendance@cds.classgrid.in", "Organization-wide attendance tracking and reports."],
                    ["HR & Payroll", "hr@cds.classgrid.in", "Faculty/staff payroll, biometric logs, and leave approvals."],
                    ["Hostel & Transport", "hostel@cds.classgrid.in", "Room allocation, bus routes, and related fees."],
                    ["Faculty (Teacher)", "faculty@cds.classgrid.in", "Teacher dashboard, student grading, attendance marking, and course content."],
                    ["Student", "student@cds.classgrid.in", "Student dashboard, fee payment, homework, tests, and attendance view."],
                  ].map(([role, email, scope]) => (
                    <tr key={role} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 font-medium text-white/80 whitespace-nowrap">{role}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-cyan-300/80">{email}</span>
                          <CopyButton text={email as string} />
                        </div>
                      </td>
                      <td className="px-5 py-3 text-white/50 text-xs max-w-xs">{scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
