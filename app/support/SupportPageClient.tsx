"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Headphones,
  Terminal,
  Database,
  CreditCard,
  Fingerprint,
  ClipboardList,
  ShieldCheck,
  Plug,
  Bot,
  MessageSquare,
  Ticket,
  Clock,
  CheckCircle2,
  ExternalLink,
  Users,
  CalendarDays,
  Library,
  Briefcase
} from "lucide-react";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";
import { buildLangHref, type SupportedLang } from "@/lib/locale";

const CATEGORIES = [
  {
    title: "Technical Support",
    description: "Troubleshoot software errors and platform bugs.",
    icon: Terminal,
    delay: 0.1,
  },
  {
    title: "ERP Assistance",
    description: "Help with admission, fee, and student data modules.",
    icon: Database,
    delay: 0.2,
  },
  {
    title: "Billing & Subscription",
    description: "Manage your invoices, plans, and payments.",
    icon: CreditCard,
    delay: 0.3,
  },
  {
    title: "Attendance & Biometric",
    description: "Hardware integration and sync issues.",
    icon: Fingerprint,
    delay: 0.4,
  },
  {
    title: "Examination Systems",
    description: "Admit cards, marksheets, and grading setups.",
    icon: ClipboardList,
    delay: 0.5,
  },
  {
    title: "Compliance & NAAC/NBA",
    description: "Report generation and data formatting.",
    icon: ShieldCheck,
    delay: 0.6,
  },
  {
    title: "API & Integrations",
    description: "Webhooks, custom endpoints, and 3rd party sync.",
    icon: Plug,
    delay: 0.7,
  },
  {
    title: "AI Assistant Issues",
    description: "Queries regarding the intelligent platform assistant.",
    icon: Bot,
    delay: 0.8,
  },
  {
    title: "Admissions & CRM",
    description: "Lead tracking, applications, and enrollment queries.",
    icon: Users,
    delay: 0.9,
  },
  {
    title: "Timetable & Scheduling",
    description: "Class scheduling, faculty allocation, and conflicts.",
    icon: CalendarDays,
    delay: 1.0,
  },
  {
    title: "Library & Resources",
    description: "Book inventory, issue/return, and digital assets.",
    icon: Library,
    delay: 1.1,
  },
  {
    title: "HR & Payroll",
    description: "Staff attendance, salary slips, and leave management.",
    icon: Briefcase,
    delay: 1.2,
  },
];

export default function SupportPageClient({ lang }: { lang: SupportedLang }) {
  const { status } = useSession();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const ticketUrl = buildLangHref("/support/ticket", lang);

  return (
    <main className="relative min-h-screen bg-background text-foreground pt-24 pb-32 overflow-hidden selection:bg-emerald-500/30 transition-colors duration-300 font-sans">
      {/* Premium Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[800px] overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100vw] h-[60vw] rounded-full bg-emerald-600/10 blur-[120px] opacity-70" />
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-teal-600/10 blur-[100px] opacity-50" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
        {/* Subtle grid pattern for light and dark */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Hero Section */}
      <section className="px-6 max-w-5xl mx-auto text-center mb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center"
        >
          <SectionAccentBar />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-foreground">
            Dedicated Support <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-400">Zero Friction</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl font-light leading-relaxed">
            Whether you&apos;re an existing institution needing technical assistance or a prospective partner with questions, we&apos;re here to help.
          </p>
        </motion.div>
      </section>

      {/* Two Main Tracks (Split Section) */}
      <section className="px-6 max-w-5xl mx-auto mb-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Users Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            onMouseEnter={() => setHoveredCard('ticket')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative p-[1px] rounded-3xl overflow-hidden transition-all duration-500 bg-border hover:bg-gradient-to-br hover:from-emerald-500/50 hover:to-transparent"
          >
            <div className="relative h-full bg-card border-none rounded-[23px] p-8 md:p-10 flex flex-col backdrop-blur-xl transition-colors z-10 overflow-hidden shadow-xl">
              {/* Internal Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-emerald-500/15 transition-colors duration-500" />
              
              <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-8">
                <Ticket className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              
              <SectionAccentBar align="left" className="mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-foreground">Raise a Ticket</h2>
              <p className="text-muted-foreground leading-relaxed mb-10 flex-1 text-lg font-light">
                For academic queries, technical assistance, or bug reports. Our support team responds directly to students, faculty, and administrators.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-background/50 border border-border">
                  <Clock className="w-5 h-5 text-amber-500 dark:text-amber-400/80" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Dedicated Support</div>
                    <div className="text-xs text-muted-foreground">For all active platform users</div>
                  </div>
                </div>

                <Link href={ticketUrl} className="block w-full">
                  <Button
                    className="w-full h-14 rounded-xl text-base font-bold shadow-md transition-all duration-300"
                  >
                    Submit a Ticket
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Prospective Users Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            onMouseEnter={() => setHoveredCard('contact')}
            onMouseLeave={() => setHoveredCard(null)}
            className="group relative p-[1px] rounded-3xl overflow-hidden transition-all duration-500 bg-border hover:bg-gradient-to-br hover:from-teal-500/50 hover:to-transparent"
          >
            <div className="relative h-full bg-card border-none rounded-[23px] p-8 md:p-10 flex flex-col backdrop-blur-xl transition-colors z-10 overflow-hidden shadow-xl">
               {/* Internal Glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-teal-500/15 transition-colors duration-500" />
              
              <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center mb-8">
                <MessageSquare className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              
              <SectionAccentBar align="left" className="mb-4" />
              <h2 className="text-3xl font-bold mb-4 text-foreground">Speak with Classgrid</h2>
              <p className="text-muted-foreground leading-relaxed mb-10 flex-1 text-lg font-light">
                Have questions before your demo? Want to understand if Classgrid fits your institution&apos;s unique operational needs? Let&apos;s talk.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3 py-3 px-4 rounded-xl bg-background/50 border border-border">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400/80" />
                  <div>
                    <div className="text-sm font-medium text-foreground">Expert Consultation</div>
                    <div className="text-xs text-muted-foreground">Connect with a product specialist</div>
                  </div>
                </div>

                <Link href={buildLangHref("/support/inquiry", lang)} className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full h-14 rounded-xl border-border bg-transparent hover:bg-accent text-foreground text-base font-bold transition-all duration-300"
                  >
                    Get in Touch
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-teal-600 dark:text-teal-400" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Categories Grid */}
      <section className="px-6 max-w-6xl mx-auto mb-32 relative z-10">
        <div className="text-center mb-16">
          <SectionAccentBar />
          <h3 className="text-2xl font-bold text-foreground mb-4">Select a Category</h3>
          <p className="text-muted-foreground">Quickly route your ticket to the correct department.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((category) => {
            const IconComp = category.icon;
            return (
              <Link key={category.title} href={ticketUrl}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: category.delay }}
                  className="group relative flex flex-col items-start p-6 rounded-2xl bg-card border border-border hover:border-emerald-500/50 hover:shadow-lg transition-all duration-300 text-left overflow-hidden h-full"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-300 shadow-sm">
                    <IconComp className="w-5 h-5 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h4 className="text-base font-bold text-foreground mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {category.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Help Center Nudge */}
      <section className="px-6 max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link href={buildLangHref("/help-center", lang)} className="block group">
            <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-emerald-500/50 shadow-xl transition-colors duration-500">
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-2xl font-bold text-foreground mb-2">Prefer to figure it out yourself?</h3>
                <p className="text-muted-foreground">Browse our comprehensive Help Center for step-by-step guides, API documentation, and FAQs.</p>
              </div>

              <div className="relative z-10 shrink-0">
                <div className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-medium group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  Visit Help Center <ExternalLink className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
