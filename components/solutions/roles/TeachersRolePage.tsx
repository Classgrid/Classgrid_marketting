import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2, Presentation, Calendar,
  FileText, ClipboardCheck, Library, ShieldCheck,
  BrainCircuit, CalendarClock, MessageSquare, GraduationCap,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

const MODULES = [
  { name: "Attendance", icon: Calendar },
  { name: "Assignments", icon: FileText },
  { name: "Quizzes", icon: ClipboardCheck },
  { name: "Marks", icon: GraduationCap },
  { name: "Study Material", icon: Library },
  { name: "Lesson Planner", icon: Presentation },
  { name: "AI Viva", icon: BrainCircuit },
  { name: "Leave", icon: CalendarClock },
  { name: "Feedback", icon: MessageSquare },
  { name: "Classroom Chat", icon: MessageSquare },
];

const DEEP_DIVES = [
  {
    title: "Mark 60 Students Present in Under 2 Minutes",
    eyebrow: "Attendance",
    body: "Open Quick Mark, select your classroom, tap 'Mark All Present', flip the absentees. Done. GPS + device fingerprint blocks proxy attendance automatically.",
  },
  {
    title: "AI Writes Your Question Paper. You Approve It.",
    eyebrow: "AI Quiz",
    body: "Enter topic + difficulty + count. Groq AI generates a full question set in 15 seconds. Edit anything, then publish to your students.",
  },
  {
    title: "Already Using Google Forms? No Re-entry Needed.",
    eyebrow: "Google Sheets Sync",
    body: "Link your response sheet. After the test, click 'Sync.' All student scores are imported and matched by email automatically.",
  },
  {
    title: "Assign an AI Viva to Your Entire Batch",
    eyebrow: "AI Viva",
    body: "Pick a topic, choose exam mode, assign to your class. Students complete it independently. You get transcripts + 4-parameter scores for every student.",
  },
  {
    title: "Leave Application in 30 Seconds",
    eyebrow: "Leave",
    body: "Submit type, dates, reason. Admin approves from their dashboard. Your leave balance updates automatically. No paper forms, no office visits.",
  }
];

export function TeachersRolePage() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-emerald-500/30">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border pt-28 pb-16 dark:bg-[#0d0d0d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_65%)] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <Badge variant="outline" className="mb-6 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            For Faculty & Teachers
          </Badge>
          <SectionAccentBar />
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground md:text-5xl lg:text-[3.5rem] leading-[1.1] mb-6">
            Less Admin Work. <br /> More Time to Actually Teach.
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed mb-10">
            Classgrid handles your attendance sessions, assignment grading, quiz management, and mark entry — with AI assistance for question generation, viva scoring, and library categorization. Everything in one dashboard, not 7 different tools.
          </p>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="border-b border-border bg-card/30 py-6 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-medium text-muted-foreground text-center">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> One-Click Attendance</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> AI Question Papers</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> Bulk Grade Assignments</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500"/> Google Sheets Sync</span>
          </div>
        </div>
      </section>

      {/* ── MODULE GRID ── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <SectionAccentBar />
            <h2 className="text-3xl font-bold tracking-tight mb-4">Everything You Need. In One Place</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From daily attendance to complex evaluations, access all your teaching tools from a single, unified faculty dashboard.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {MODULES.map((mod) => (
              <div key={mod.name} className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border bg-card hover:border-emerald-500/30 transition-colors">
                <mod.icon className="h-8 w-8 text-emerald-500 mb-3" />
                <span className="text-sm font-semibold text-center">{mod.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEEP DIVES ── */}
      <section className="py-24 bg-card/20">
        <div className="mx-auto max-w-5xl px-6 space-y-24">
          {DEEP_DIVES.map((dive, i) => (
            <div key={dive.title} className={`flex flex-col gap-10 lg:gap-16 items-center ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
              <div className="flex-1 space-y-5">
                <span className="text-emerald-500 font-bold tracking-wider text-sm uppercase">{dive.eyebrow}</span>
                <h3 className="text-3xl font-extrabold tracking-tight">{dive.title}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">{dive.body}</p>
              </div>
              <div className="flex-1 w-full aspect-video bg-muted/40 rounded-2xl border border-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
                <ShieldCheck className="h-16 w-16 text-emerald-500/20" />
                <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground/40">Classgrid Native</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA / TRUST ── */}
      <section className="pt-24 pb-12 border-t border-border bg-slate-50 text-center dark:bg-[#0a0a0a]">
        <div className="mx-auto max-w-3xl px-6">
          <ShieldCheck className="h-12 w-12 text-emerald-500 mx-auto mb-6" />
          <SectionAccentBar />
          <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Privacy-first. Institution-scoped</h2>
          <p className="mb-10 text-lg text-muted-foreground">Your students' data is secure and strictly scoped to your institution. Your institution's Classgrid account is waiting.</p>
          <div className="flex items-center justify-center gap-4">
             <Link
                href="/support/ticket"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-8 text-sm font-semibold text-foreground transition-colors hover:border-emerald-500/40 hover:text-emerald-500"
              >
                Ask Your Admin
              </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
