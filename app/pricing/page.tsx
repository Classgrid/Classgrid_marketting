"use client";

import React, { useState } from "react";
import { animate, motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Check, ShieldCheck, ArrowRight, CheckCircle2,
  BookOpen, LayoutDashboard, MessageSquare, Briefcase, Sparkles, Building2,
  Users, Calendar, GraduationCap, ClipboardList, Wallet, FileText, Coffee,
  School, Target, Landmark, Cog
} from "lucide-react";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { JsonLd } from "@/components/seo/JsonLd";

const MotionSpan = motion.span as any;
const MotionTr = motion.tr as any;

const INSTITUTION_TYPES = ["School", "Coaching", "College", "Engineering"] as const;
type InstitutionType = typeof INSTITUTION_TYPES[number];

// Proper labels — avoids "Coachings", "Engineerings" etc.
const INSTITUTION_LABELS: Record<InstitutionType, string> = {
  School:      "Schools",
  Coaching:    "Coaching Centers",
  College:     "Colleges",
  Engineering: "Engineering Colleges",
};

// Master Module List from User
// THE DEFINITIVE MODULE LIST (Synchronized with institution_modules_matrix.md)
const MASTER_MODULES = [
  // --- ACADEMICS ---
  { name: "Attendance System", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: Users, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
  { name: "Digital Classroom Management", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: BookOpen, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/10" },
  { name: "Automated Timetable", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: Calendar, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-500/10" },
  { name: "Academic Planning Tools", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: LayoutDashboard, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-500/10" },
  { name: "Homework / Assignment", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: ClipboardList, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/10" },
  { name: "Student Notes Sharing", category: "Academics", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: BookOpen, color: "text-fuchsia-600 dark:text-fuchsia-400", bg: "bg-fuchsia-100 dark:bg-fuchsia-500/10" },
  { name: "Teacher Planner", category: "Academics", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: BookOpen, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/10" },
  { name: "Course Management", category: "Academics", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: BookOpen, color: "text-fuchsia-600 dark:text-fuchsia-400", bg: "bg-fuchsia-100 dark:bg-fuchsia-500/10" },

  // --- EXAMS & ASSESSMENT ---
  { name: "Online Exam Platform", category: "Assessment", school: "BASIC", coaching: "NONE", college: "BASIC", engineering: "BASIC", icon: FileText, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
  { name: "Examination Management", category: "Assessment", school: "BASIC", coaching: "NONE", college: "BASIC", engineering: "BASIC", icon: FileText, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-500/10" },
  { name: "Interactive Quiz Systems", category: "Assessment", school: "NONE", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: Sparkles, color: "text-fuchsia-600 dark:text-fuchsia-400", bg: "bg-fuchsia-100 dark:bg-fuchsia-500/10" },
  { name: "Grade Entry & Results", category: "Assessment", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: FileText, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-500/10" },
  { name: "Internal Assessment Tools", category: "Assessment", school: "NONE", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: FileText, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
  { name: "CET/JEE/NEET Exam Conduction", category: "Assessment", school: "NONE", coaching: "BASIC", college: "NONE", engineering: "NONE", icon: FileText, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/10" },
  { name: "Past Paper & Mock Tests", category: "Assessment", school: "NONE", coaching: "BASIC", college: "NONE", engineering: "NONE", icon: FileText, color: "text-muted-foreground", bg: "bg-slate-100 dark:bg-slate-500/10" },

  // --- MANAGEMENT ---
  { name: "Admission Management", category: "Management", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/10" },
  { name: "Fee Collection System", category: "Management", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: Wallet, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
  { name: "Staff Leave & Payroll", category: "Management", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/10" },
  { name: "Digital Library Management", category: "Management", school: "NONE", coaching: "NONE", college: "PREMIUM", engineering: "PREMIUM", icon: BookOpen, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
  { name: "Canteen Management", category: "Management", school: "BASIC", coaching: "NONE", college: "BASIC", engineering: "BASIC", icon: Coffee, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-500/10" },
  { name: "Alumni Network", category: "Management", school: "NONE", coaching: "NONE", college: "PREMIUM", engineering: "PREMIUM", icon: GraduationCap, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-500/10" },

  // --- ADVANCED ---
  { name: "AI Assistant", category: "Advanced", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: Sparkles, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-100 dark:bg-cyan-500/10" },
  { name: "Advanced Analytics", category: "Advanced", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: LayoutDashboard, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
  { name: "Compliance Audit Trails", category: "Advanced", school: "NONE", coaching: "NONE", college: "PREMIUM", engineering: "PREMIUM", icon: ShieldCheck, color: "text-muted-foreground", bg: "bg-slate-100 dark:bg-slate-500/10" },
  { name: "Institution Website", category: "Advanced", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: Briefcase, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/10" },
  { name: "Digital Certificates", category: "Advanced", school: "BASIC", coaching: "BASIC", college: "BASIC", engineering: "BASIC", icon: GraduationCap, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
  { name: "Holiday Management", category: "Advanced", school: "BASIC", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: Calendar, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-500/10" },
  { name: "Digital ID Cards", category: "Advanced", school: "BASIC", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: Users, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-100 dark:bg-rose-500/10" },
  { name: "Events Management", category: "Advanced", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: Calendar, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
  { name: "Feedback System", category: "Advanced", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: MessageSquare, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/10" },

  // --- DASHBOARDS ---
  { name: "Admission Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: LayoutDashboard, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-500/10" },
  { name: "Fee Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: Wallet, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
  { name: "Library Management Dashboard", category: "Dashboards", school: "NONE", coaching: "NONE", college: "PREMIUM", engineering: "PREMIUM", icon: BookOpen, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-500/10" },
  { name: "Student Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: Users, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-100 dark:bg-violet-500/10" },
  { name: "Faculty Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: Briefcase, color: "text-muted-foreground", bg: "bg-slate-100 dark:bg-slate-500/10" },
  { name: "Organization Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: Building2, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/10" },
  { name: "Canteen Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "NONE", college: "PREMIUM", engineering: "PREMIUM", icon: Coffee, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-100 dark:bg-orange-500/10" },
  { name: "Leave Management Dashboard", category: "Dashboards", school: "PREMIUM", coaching: "PREMIUM", college: "PREMIUM", engineering: "PREMIUM", icon: Users, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-500/10" },
];

const CATEGORIES = ["Academics", "Assessment", "Management", "Advanced", "Dashboards"];

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<InstitutionType>("School");

  const filteredModules = MASTER_MODULES.filter((m) => {
    const level = m[activeTab.toLowerCase() as keyof typeof m];
    return level && level !== "NONE";
  });

  const getDisplayName = (moduleName: string) => {
    if (moduleName === "Course Management" && activeTab !== "Engineering") {
      return "Subject Management";
    }
    if (moduleName === "Homework / Assignment" && activeTab === "School") {
      return "Homework (Assignment)";
    }
    return moduleName;
  };

  const scrollToMatrix = () => {
    window.requestAnimationFrame(() => {
      const matrix = document.getElementById("pricing-module-matrix");
      if (!matrix) return;

      const headerOffset = 88;
      const targetPosition = matrix.getBoundingClientRect().top + window.scrollY - headerOffset;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;

      animate(0, 1, {
        duration: 1,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (progress) => {
          window.scrollTo(0, startPosition + distance * progress);
        },
      });
    });
  };

  return (
    <>
      <JsonLd data={[
        {
          "@type": "WebPage",
          "@id": "https://classgrid.in/pricing/#webpage",
          "name": "Classgrid Pricing",
          "url": "https://classgrid.in/pricing",
          "about": {
            "@id": "https://classgrid.in/#software"
          }
        },
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://classgrid.in/" },
            { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://classgrid.in/pricing" }
          ]
        }
      ]} />
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative flex min-h-[60vh] items-center overflow-hidden overflow-x-clip bg-emerald-50/30 px-4 py-[76px] dark:bg-[#021E16] md:py-[88px]">
        {/* 1. Base Deep Gradient Layer */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/40 via-emerald-50/40 to-white/80 dark:from-[#021E16] dark:via-[#063D2E] dark:to-[#021E16]" />
        <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(115deg,rgba(255,255,255,0.5)_0%,rgba(209,250,229,0.2)_38%,rgba(240,253,250,0.5)_100%)] dark:bg-[linear-gradient(115deg,rgba(2,30,22,0.96)_0%,rgba(6,61,46,0.42)_38%,rgba(2,30,22,0.9)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 z-0 h-48 pointer-events-none bg-gradient-to-t from-background to-transparent dark:bg-[linear-gradient(to_top,rgba(2,3,3,1)_0%,rgba(2,30,22,0.62)_45%,transparent_100%)]" />
        
        {/* 2. Platform Photo Underlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-15 mix-blend-multiply dark:opacity-40 dark:mix-blend-overlay">
          <img 
            src="https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/classroom-files/modules%20logo/ChatGPT%20Image%20Apr%2026,%202026,%2005_03_01%20PM.png" 
            alt="Classgrid Platform" 
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </div>

        {/* 3. Radial Glow behind heading */}
        <div
          className="absolute left-1/2 top-[45%] z-0 h-[520px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(10,163,108,0.25) 0%, rgba(10,163,108,0.16) 34%, transparent 72%)" }}
        />
        <div
          className="absolute left-[18%] top-[18%] z-0 h-72 w-72 rounded-full blur-[95px] pointer-events-none"
          style={{ background: "rgba(11, 116, 86, 0.2)" }}
        />

        {/* 4. Pattern Layer */}
        <div className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none" 
             style={{ backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.18) 1px, transparent 0)", backgroundSize: "30px 30px" }} />

        {/* 5. Subtle Accent Diagonal Streak */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute left-[-35%] top-[-70%] h-[210%] w-[165%] rotate-[32deg] bg-gradient-to-r from-transparent via-emerald-300/20 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[920px] text-center">
          <Chip variant="emerald" icon={<Sparkles />} className="mb-4 border-emerald-200 bg-white/80 text-emerald-700 dark:border-white/10 dark:bg-white/10 dark:text-emerald-100">
            Flexible ERP Pricing
          </Chip>

          <SectionAccentBar />
          <h1 className="mx-auto w-full max-w-[900px] text-2xl sm:text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.2] tracking-tight text-slate-900 dark:text-white whitespace-normal">
            One operating system for every kind of institution
          </h1>

          <p className="mx-auto mt-4 max-w-[760px] text-base leading-7 text-slate-600 dark:text-emerald-50/75 md:text-lg">
            Choose your institution type to see the modules included in Basic and Premium tiers.
          </p>

          <div className="mt-8 flex w-full flex-nowrap overflow-x-auto pb-4 pr-4 sm:pr-0 sm:flex-wrap justify-start sm:justify-center gap-2.5 scrollbar-hide">
            {INSTITUTION_TYPES.map((type) => {
              const Icon =
                type === "School"
                  ? School
                  : type === "Coaching"
                    ? Target
                    : type === "College"
                      ? Landmark
                      : Cog;
              const isActive = activeTab === type;

              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setActiveTab(type);
                    scrollToMatrix();
                  }}
                  className={`relative shrink-0 overflow-hidden rounded-full border px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "border-emerald-300 bg-white text-emerald-950 shadow-lg shadow-emerald-950/20"
                      : "border-slate-300 bg-slate-100 text-slate-700 hover:border-slate-400 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:border-white/30 dark:hover:bg-white/15"
                  }`}
                >
                  {isActive ? (
                    <MotionSpan
                      layoutId="pricing-tab-active"
                      className="absolute inset-0 z-0 bg-white rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
                    />
                  ) : null}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="h-4 w-4 shrink-0" />
                    {type}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        </section>

        {/* --- ONE PLAN + ADD-ONS SECTION --- */}
        <section className="relative z-10 px-4 pb-24">
          <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* THE PREMIUM PLAN (Spans 2 columns) */}
            <div className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-xl shadow-slate-950/5 dark:shadow-2xl dark:shadow-black/30 md:col-span-2 md:p-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row gap-8 justify-between items-start mb-8 relative z-10">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <Chip variant="emerald" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">The Core OS</Chip>
                  </div>
                  <h3 className="text-3xl font-bold text-slate-950 dark:text-white mb-2">Classgrid Premium</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    One unified platform containing everything you need to run daily academic and administrative operations smoothly.
                  </p>
                </div>
                
                <div className="shrink-0 text-left md:text-right">
                  <div className="mb-2">
                    <span className="text-4xl font-extrabold text-slate-950 dark:text-white">Let's Talk</span>
                  </div>
                  <Button size="lg" asChild>
                    <Link href="#pricing-module-matrix">See Module Matrix</Link>
                  </Button>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-white/10 relative z-10">
                <p className="text-sm font-semibold text-slate-950 dark:text-white mb-4">What's included by default:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Complete Classroom Hub</li>
                    <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Student & Faculty Dashboards</li>
                    <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Attendance & Exam Engines</li>
                  </ul>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Timetable & Scheduling</li>
                    <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Digital ID & Communication</li>
                    <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0"/> Standard Customer Support</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ADD-ONS (Spans 1 column) */}
            <div className="md:col-span-1 rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-white to-emerald-50/40 p-8 shadow-xl shadow-slate-950/5 dark:border-white/[0.08] dark:bg-gradient-to-br dark:from-white/[0.05] dark:via-white/[0.03] dark:to-emerald-950/10 dark:shadow-2xl dark:shadow-black/25 flex flex-col relative">
              <h3 className="text-xl font-bold text-emerald-700 dark:text-emerald-300 mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Optional Upgrades
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Scale your ERP with powerful add-on modules as your institution grows.
              </p>
              
              <div className="space-y-3 flex-1">
                {/* Beautiful Mini Card 1 */}
                <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)] cursor-pointer">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-500/10 shrink-0">
                    <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white mb-0.5">Fee Management</h4>
                    <p className="text-xs text-muted-foreground">Automate collections, receipts & tracking.</p>
                  </div>
                </div>

                {/* Beautiful Mini Card 2 */}
                <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-[0_8px_30px_rgba(99,102,241,0.12)] cursor-pointer">
                  <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 shrink-0">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white mb-0.5">Admissions CRM</h4>
                    <p className="text-xs text-muted-foreground">Lead tracking, forms & counseling pipeline.</p>
                  </div>
                </div>

                {/* Beautiful Mini Card 3 */}
                <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-fuchsia-500/40 hover:shadow-[0_8px_30px_rgba(217,70,239,0.12)] cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full">New</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-fuchsia-100 dark:bg-fuchsia-500/10 shrink-0">
                    <Sparkles className="w-5 h-5 text-fuchsia-600 dark:text-fuchsia-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white mb-0.5">Classgrid AI</h4>
                    <p className="text-xs text-muted-foreground">AI sidekick & quiz generation tools.</p>
                  </div>
                </div>

                {/* Beautiful Mini Card 4 */}
                <div className="p-4 rounded-2xl bg-card border border-border flex items-start gap-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)] cursor-pointer">
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-950 dark:text-white mb-0.5">Accreditation (NAAC)</h4>
                    <p className="text-xs text-muted-foreground">Automated reports for NBA & NAAC compliance.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* --- MATRIX --- */}
        <section id="pricing-module-matrix" className="scroll-mt-24 px-4 pb-32">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <SectionAccentBar />
              <h2 className="text-3xl font-bold text-slate-950 dark:text-white mb-4">Detailed Module Matrix</h2>
              <p className="text-muted-foreground">Compare all modules available for {INSTITUTION_LABELS[activeTab]}.</p>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl shadow-slate-950/5 dark:shadow-2xl dark:shadow-black/30">
              <div className="w-full overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 dark:bg-white/[0.04] dark:border-white/[0.08]">
                      <th className="p-4 md:p-6 text-sm font-semibold text-muted-foreground w-2/4">Module</th>
                      <th className="p-4 md:p-6 text-sm font-bold text-slate-950 dark:text-white text-center w-1/4 border-l border-slate-200 dark:border-white/[0.08]">Basic Tier</th>
                      <th className="p-4 md:p-6 text-sm font-bold text-emerald-600 dark:text-emerald-300 text-center w-1/4 border-l border-slate-200 dark:border-white/[0.08] bg-emerald-50 dark:bg-emerald-500/[0.04]">Premium Tier</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="wait">
                      <MotionTr
                        key={activeTab} // animate when tab changes
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="contents"
                      >
                        <td colSpan={4} className="p-0">
                          <table className="w-full">
                            <tbody>
                              {CATEGORIES.map(category => {
                                const categoryModules = filteredModules.filter(m => m.category === category);
                                if (categoryModules.length === 0) return null;
                                
                                return (
                                  <React.Fragment key={category}>
                                  <tr>
                                    <td colSpan={4} className="bg-slate-50 px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 border-y border-slate-200 dark:bg-white/[0.035] dark:border-white/[0.06]">
                                      {category}
                                    </td>
                                  </tr>
                                  {categoryModules.map((module) => {
                                    const Icon = module.icon;
                                    return (
                                    <tr key={module.name} className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-white/[0.05] dark:hover:bg-white/[0.035]">
                                      <td className="p-4 md:p-6 text-sm font-medium text-muted-foreground w-2/4">
                                        <div className="flex items-center gap-3">
                                          <div className={`p-2 rounded-lg ${module.bg}`}>
                                            <Icon className={`w-4 h-4 ${module.color}`} />
                                          </div>
                                          {getDisplayName(module.name)}
                                        </div>
                                      </td>
                                      
                                      <td className="p-4 text-center w-1/4 border-l border-slate-100 dark:border-white/[0.05]">
                                        {module[activeTab.toLowerCase()] === "BASIC" ? (
                                          <Check className="w-5 h-5 mx-auto text-emerald-500" />
                                        ) : (
                                          <span className="text-slate-300 dark:text-slate-700">-</span>
                                        )}
                                      </td>
                                      
                                      <td className="p-4 text-center w-1/4 border-l border-slate-100 bg-emerald-50 dark:border-white/[0.05] dark:bg-emerald-500/[0.035]">
                                        {module[activeTab.toLowerCase()] === "BASIC" || module[activeTab.toLowerCase()] === "PREMIUM" ? (
                                          <Check className="w-5 h-5 mx-auto text-emerald-500 dark:text-emerald-400" />
                                        ) : (
                                          <span className="text-slate-300 dark:text-slate-700">Not Available</span>
                                        )}
                                      </td>
                                    </tr>
                                  )})}
                                </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </td>
                      </MotionTr>
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* --- ENTERPRISE BANNER --- */}
        <section className="px-4 pb-32">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl p-8 md:p-12 border border-slate-200 bg-gradient-to-br from-white via-white to-emerald-50/40 dark:border-white/[0.08] dark:bg-gradient-to-br dark:from-white/[0.05] dark:via-white/[0.03] dark:to-emerald-950/10 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-slate-950/5 dark:shadow-2xl dark:shadow-black/30">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <Chip variant="emerald" icon={<ShieldCheck />} className="mb-4">Enterprise Custom</Chip>
                <SectionAccentBar align="left" className="mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-950 dark:text-white mb-3">Running a Group of Institutions?</h2>
                <p className="text-muted-foreground max-w-xl">
                  Get volume discounts, dedicated success managers, custom integrations, and centralized reporting for multiple campuses.
                </p>
              </div>
              <div className="relative z-10 shrink-0">
                <Button size="lg" asChild>
                  <Link href="/contact" className="flex items-center gap-2">
                    Contact Sales <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
