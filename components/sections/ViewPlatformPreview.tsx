"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VercelTable } from "@/components/ui/vercel-table";

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
      className={cn("relative w-full h-full overflow-hidden rounded-[inherit] bg-background overscroll-contain", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {!isReady && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="rounded-full border border-border bg-card p-3 shadow-md flex items-center justify-center">
              <Spinner className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-xs font-medium text-muted-foreground">
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
      className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {copied ? (
        <Check className="h-3 w-3 text-emerald-500" />
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
    <main className="bg-background text-foreground pb-20 overflow-x-hidden">
      {/* ─── Hero ─── */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-16 md:py-20 lg:py-24 text-center">
          <SectionAccentBar className="mt-6" />

          <h1 className="mt-6 mx-auto max-w-4xl text-balance text-4xl font-black leading-[0.95] tracking-[-0.04em] md:text-5xl lg:text-6xl text-foreground pb-4">
            Experience Classgrid
          </h1>

          <p className="mt-5 mx-auto max-w-2xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            Select a role below to view its specific dashboard and credentials.
            Log in directly through the preview to explore real workflows.
          </p>
        </div>
      </section>

      {/* ─── Main Interactive Preview ─── */}
      <section className="relative py-12 md:py-16">
        <div className="relative z-10 mx-auto max-w-[1400px] px-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-8">
            
            {/* Dynamic Credentials */}
            <div className="w-full lg:max-w-sm shrink-0">
              <Card className="p-5 shadow-sm border-border bg-card">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 text-emerald-500" />
                    <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                      Demo Credentials
                    </span>
                  </div>
                  <Badge variant="outline" className="text-[10px] uppercase border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                    {activeAdminRoleData.label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Email</span>
                      <p className="font-mono text-sm text-foreground">{activeAdminRoleData.email}</p>
                    </div>
                    <CopyButton text={activeAdminRoleData.email} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-2.5">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Password</span>
                      <p className="font-mono text-sm text-foreground">{activeAdminRoleData.pass}</p>
                    </div>
                    <CopyButton text={activeAdminRoleData.pass} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-6 w-full items-start lg:items-end lg:w-auto">
              <div className="flex items-center gap-4">
                <ThemeSwitcher />
                <Button
                  type="button"
                  variant="outline"
                  className="hidden lg:flex rounded-full text-xs"
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
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                          : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
                  "rounded-2xl border border-border bg-background p-2 shadow-sm transition-all relative",
                  isFullscreen ? "w-full h-screen p-0 md:p-0 rounded-none border-0" : "md:p-3"
                )}
              >
                <div className={cn("flex flex-col overflow-hidden bg-card h-full", isFullscreen ? "rounded-none" : "rounded-xl border border-border")}>
                  {/* Browser chrome */}
                  <div className="flex items-center gap-4 border-b border-border bg-muted/50 px-4 py-2.5 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" />
                    </div>
                    <div className="flex flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 py-1 text-[11px] text-muted-foreground">
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
                    className="absolute bottom-6 right-6 z-50 rounded-full shadow-xl"
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
      <section className="relative py-16 md:py-20 border-t border-border">
        <div className="relative z-10 mx-auto max-w-5xl px-6 space-y-16">

          {/* Section Header */}
          <div className="text-center">
            <SectionAccentBar className="mt-6" />
            <h2 className="mt-6 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Classgrid Demo School (CDS)
            </h2>
            <p className="mt-4 mx-auto max-w-2xl text-base text-muted-foreground leading-7">
              A fully configured demo organization pre-loaded with sample data.
              Explore every module using the credentials below.
            </p>
          </div>

          {/* ── Organization Identity ── */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Monitor className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Organization Identity &amp; Configuration</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <VercelTable
                columns={[
                  { key: "setting", header: "Setting", width: "w-[250px]" },
                  { key: "value", header: "Value" },
                ]}
                rows={[
                  { setting: "Institution Name", value: "Classgrid Demo School" },
                  { setting: "Official Address", value: "Demo Campus, Virtual City" },
                  { setting: "Principal / Owner", value: "School Principal" },
                  { setting: "Owner Email", value: <span className="font-mono text-xs">admin@cds.classgrid.in</span> },
                  { setting: "Contact Number", value: "+91 9999999999" },
                  { setting: "Website URL", value: <span className="font-mono text-xs">https://cds.classgrid.in</span> },
                  { setting: "Designation", value: "Principal" },
                  { setting: "University / Board", value: "Classgrid Demo Board" },
                  { setting: "Subdomain", value: "cds → cds.classgrid.in" },
                  { setting: "Org Type", value: "School" },
                  { setting: "Structure Type", value: "School with Divisions" },
                ]}
              />
            </CardContent>
          </Card>

          {/* ── Academic Hierarchy ── */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Academic Hierarchy</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <VercelTable
                columns={[
                  { key: "level", header: "Level", width: "w-[250px]" },
                  { key: "example", header: "Example" },
                ]}
                rows={[
                  { level: "Standard", example: <span className="text-muted-foreground">Class 1 through Class 10</span> },
                  { level: "Division (Section)", example: <span className="text-muted-foreground">Section A / Section B</span> },
                ]}
              />
              <div className="p-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground italic">Note: Schools do not use Departments, Semesters, or Sub Batches.</p>
              </div>
            </CardContent>
          </Card>

          {/* ── Platform Terminology ── */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  <Monitor className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Platform Terminology (School Mode)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <VercelTable
                columns={[
                  { key: "concept", header: "Concept", width: "w-[250px]" },
                  { key: "label", header: "UI Label" },
                ]}
                rows={[
                  { concept: "Org Label", label: <span className="text-muted-foreground">School</span> },
                  { concept: "Top Level", label: <span className="text-muted-foreground">Standard</span> },
                  { concept: "Course", label: <span className="text-muted-foreground">Class</span> },
                  { concept: "Year", label: <span className="text-muted-foreground">Class</span> },
                  { concept: "Period", label: <span className="text-muted-foreground">Term</span> },
                  { concept: "Division", label: <span className="text-muted-foreground">Section</span> },
                  { concept: "Sub Batch", label: <span className="text-muted-foreground">Not applicable</span> },
                  { concept: "Student ID", label: <span className="text-muted-foreground">Roll No</span> },
                  { concept: "Teacher", label: <span className="text-muted-foreground">Teacher</span> },
                  { concept: "Assignment", label: <span className="text-muted-foreground">Homework</span> },
                  { concept: "Exam", label: <span className="text-muted-foreground">Test</span> },
                ]}
              />
            </CardContent>
          </Card>

          {/* ── Branding & Theme ── */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Monitor className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Branding &amp; Theme</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <VercelTable
                columns={[
                  { key: "setting", header: "Setting", width: "w-[250px]" },
                  { key: "value", header: "Value" },
                ]}
                rows={[
                  { setting: "Primary Color", value: <div className="flex items-center gap-2 text-muted-foreground"><span className="inline-block h-3 w-3 rounded-full bg-indigo-500" />#6366f1 (Indigo)</div> },
                  { setting: "Secondary Color", value: <div className="flex items-center gap-2 text-muted-foreground"><span className="inline-block h-3 w-3 rounded-full bg-indigo-600" />#4f46e5 (Dark Indigo)</div> },
                  { setting: "Accent Color", value: <div className="flex items-center gap-2 text-muted-foreground"><span className="inline-block h-3 w-3 rounded-full bg-rose-500" />#f43f5e (Rose)</div> },
                  { setting: "Font Preference", value: <span className="text-muted-foreground">Inter</span> },
                  { setting: "Tagline", value: <span className="text-muted-foreground">Empowering Education</span> },
                ]}
              />
            </CardContent>
          </Card>

          {/* ── Role Login URLs ── */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <LogIn className="h-4 w-4" />
                </div>
                <CardTitle className="text-lg">Role Login URLs</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <VercelTable
                columns={[
                  { key: "role", header: "Role", width: "w-[250px]" },
                  { key: "url", header: "Login URL", accent: true },
                  { key: "device", header: "Device" },
                ]}
                rows={[
                  { role: "Org Admin", url: "cds.classgrid.in/org/login", device: <span className="text-muted-foreground text-xs">Desktop</span> },
                  { role: "Admission Dept", url: "cds.classgrid.in/dept/admissions/login", device: <span className="text-muted-foreground text-xs">Desktop</span> },
                  { role: "Fees Dept", url: "cds.classgrid.in/dept/fees/login", device: <span className="text-muted-foreground text-xs">Desktop</span> },
                  { role: "Exam Dept", url: "cds.classgrid.in/dept/exams/login", device: <span className="text-muted-foreground text-xs">Desktop</span> },
                  { role: "Library Dept", url: "cds.classgrid.in/dept/library/login", device: <span className="text-muted-foreground text-xs">Desktop</span> },
                  { role: "Attendance Dept", url: "cds.classgrid.in/dept/attendance/login", device: <span className="text-muted-foreground text-xs">Desktop</span> },
                  { role: "HR & Payroll", url: "cds.classgrid.in/dept/hr/login", device: <span className="text-muted-foreground text-xs">Desktop</span> },
                  { role: "Hostel & Transport", url: "cds.classgrid.in/dept/hostel/login", device: <span className="text-muted-foreground text-xs">Desktop</span> },
                  { role: "Faculty / Teachers", url: "cds.classgrid.in/faculty/login", device: <span className="text-muted-foreground text-xs">Desktop & Mobile</span> },
                  { role: "Students", url: "cds.classgrid.in/student/login", device: <span className="text-muted-foreground text-xs">Desktop & Mobile</span> },
                ]}
              />
            </CardContent>
          </Card>

          {/* ── Demo Accounts & Credentials ── */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <LogIn className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg">Demo Accounts &amp; Credentials</CardTitle>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-2">
                  <span className="text-xs text-muted-foreground">Shared Password:</span>
                  <code className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">cdspass@123</code>
                  <CopyButton text="cdspass@123" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <VercelTable
                columns={[
                  { key: "role", header: "Role", width: "w-[200px]" },
                  { key: "email", header: "Email" },
                  { key: "scope", header: "Access Scope" },
                ]}
                rows={[
                  { 
                    role: "Org Admin", 
                    email: <div className="flex items-center gap-2"><span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">admin@cds.classgrid.in</span><CopyButton text="admin@cds.classgrid.in" /></div>, 
                    scope: <span className="text-muted-foreground text-xs">Full access to CDS configuration, modules, and user management.</span> 
                  },
                  { 
                    role: "Admission Head", 
                    email: <div className="flex items-center gap-2"><span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">admission@cds.classgrid.in</span><CopyButton text="admission@cds.classgrid.in" /></div>, 
                    scope: <span className="text-muted-foreground text-xs">Admission portal, fee tracking for new admits, and application review.</span> 
                  },
                  { 
                    role: "Fee Manager", 
                    email: <div className="flex items-center gap-2"><span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">fees@cds.classgrid.in</span><CopyButton text="fees@cds.classgrid.in" /></div>, 
                    scope: <span className="text-muted-foreground text-xs">Fee collection, ledgers, invoice generation, and refunds.</span> 
                  },
                  { 
                    role: "Exam Controller", 
                    email: <div className="flex items-center gap-2"><span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">exam@cds.classgrid.in</span><CopyButton text="exam@cds.classgrid.in" /></div>, 
                    scope: <span className="text-muted-foreground text-xs">Exam scheduling, marksheets, and result generation.</span> 
                  },
                  { 
                    role: "Library Manager", 
                    email: <div className="flex items-center gap-2"><span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">library@cds.classgrid.in</span><CopyButton text="library@cds.classgrid.in" /></div>, 
                    scope: <span className="text-muted-foreground text-xs">Book inventory, issuance, and fines.</span> 
                  },
                  { 
                    role: "Attendance Manager", 
                    email: <div className="flex items-center gap-2"><span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">attendance@cds.classgrid.in</span><CopyButton text="attendance@cds.classgrid.in" /></div>, 
                    scope: <span className="text-muted-foreground text-xs">Organization-wide attendance tracking and reports.</span> 
                  },
                  { 
                    role: "HR & Payroll", 
                    email: <div className="flex items-center gap-2"><span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">hr@cds.classgrid.in</span><CopyButton text="hr@cds.classgrid.in" /></div>, 
                    scope: <span className="text-muted-foreground text-xs">Faculty/staff payroll, biometric logs, and leave approvals.</span> 
                  },
                  { 
                    role: "Hostel & Transport", 
                    email: <div className="flex items-center gap-2"><span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">hostel@cds.classgrid.in</span><CopyButton text="hostel@cds.classgrid.in" /></div>, 
                    scope: <span className="text-muted-foreground text-xs">Room allocation, bus routes, and related fees.</span> 
                  },
                  { 
                    role: "Faculty (Teacher)", 
                    email: <div className="flex items-center gap-2"><span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">faculty@cds.classgrid.in</span><CopyButton text="faculty@cds.classgrid.in" /></div>, 
                    scope: <span className="text-muted-foreground text-xs">Teacher dashboard, student grading, attendance marking, and course content.</span> 
                  },
                  { 
                    role: "Student", 
                    email: <div className="flex items-center gap-2"><span className="font-mono text-xs text-cyan-600 dark:text-cyan-400">student@cds.classgrid.in</span><CopyButton text="student@cds.classgrid.in" /></div>, 
                    scope: <span className="text-muted-foreground text-xs">Student dashboard, fee payment, homework, tests, and attendance view.</span> 
                  },
                ]}
              />
            </CardContent>
          </Card>

        </div>
      </section>
    </main>
  );
}
