"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 1500);
    return () => clearTimeout(timer);
  }, []);

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
    </main>
  );
}
