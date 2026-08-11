"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Copyright,
  Lock,
  Landmark,
  BookOpen,
  FileText,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Printer,
  Globe,
  LucideIcon,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ThemeModeSwitcher } from "@/components/layout/ThemeModeSwitcher";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Language = "en" | "hi" | "mr";

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Shield,
  FileText,
  Lock,
  Landmark,
  Copyright,
  ExternalLink,
  XCircle,
};

interface IPProtectionClientProps {
  dataByLang: Record<string, {
    language: string;
    content: Record<string, any>;
    sections: Array<{ id: string; title: string; iconName: string }>;
    industryExamples: Array<{ company: string; type: string; patented: boolean }>;
    protectionMethods: Array<{ method: string; status: string; basis: string; description: string; iconName: string }>;
  }>;
}

export function IPProtectionClient({ dataByLang }: IPProtectionClientProps) {
  const [activeSection, setActiveSection] = useState("purpose");
  const [lang, setLang] = useState<Language>("en");

  const pdfLinks: Record<Language, string> = {
    en: "https://cdn.classgrid.in/our_ip_policy/Classgrid-IP-Protection-Policy-EN.pdf",
    hi: "https://cdn.classgrid.in/our_ip_policy/Classgrid-IP-Protection-Policy-HI.pdf",
    mr: "https://cdn.classgrid.in/our_ip_policy/Classgrid-IP-Protection-Policy-MR.pdf",
  };

  const currentDoc = dataByLang[lang];
  if (!currentDoc) return null;

  const s = currentDoc.content;
  const sections = currentDoc.sections.map((sec) => ({
    ...sec,
    icon: ICON_MAP[sec.iconName] || BookOpen,
  }));
  const industryExamples = currentDoc.industryExamples;
  const protectionMethods = currentDoc.protectionMethods.map((pm) => ({
    ...pm,
    icon: ICON_MAP[pm.iconName] || Shield,
  }));

  function scrollToSection(id: string) {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    function onScroll() {
      const sectionIds = sections.map((s) => s.id);
      if (sectionIds.length === 0) return;

      // Check if we're at the very bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isAtBottom) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
        return;
      }

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.4) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // Run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 dark:bg-[#0a0a0b] dark:text-slate-200">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-white/5 dark:bg-[#111113]/80 print:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{s.back}</span>
            </Link>
            <span className="hidden text-slate-300 dark:text-slate-600 sm:inline">|</span>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                IP Protection Policy
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={lang}
              onValueChange={(value) => setLang(value as Language)}
            >
              <SelectTrigger className="h-8 w-fit gap-2 rounded-lg bg-white px-3 py-1.5 font-medium dark:bg-white/5">
                <Globe className="h-4 w-4 text-slate-400" />
                <SelectValue>
                  {lang === "en" ? "English" : lang === "hi" ? "हिंदी" : "मराठी"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="mr">मराठी</SelectItem>
              </SelectContent>
            </Select>
            <div className="hidden sm:block">
              <ThemeModeSwitcher />
            </div>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:flex items-center gap-1.5"
            >
              <a href={pdfLinks[lang]} target="_blank" rel="noopener noreferrer">
                <Printer className="h-3.5 w-3.5" />
                {s.print}
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* ── Mobile Nav Bar (only visible below lg) ── */}
      <div className="sticky top-14 z-40 flex items-center justify-end border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur-sm dark:border-white/5 dark:bg-[#111113]/95 lg:hidden print:hidden">
        {/* Right: On this page button */}
        {sections.length > 0 && (
          <button
            type="button"
            onClick={() => setMobileTocOpen((o) => !o)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
            aria-label="On this page"
          >
            <FileText className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Mobile TOC Drawer (On this page) ── */}
      <AnimatePresence>
        {mobileTocOpen && sections.length > 0 && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-toc-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden print:hidden"
              onClick={() => setMobileTocOpen(false)}
            />
            {/* Drawer panel */}
            <motion.div
              key="mobile-toc-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 right-0 z-50 flex h-full w-[280px] flex-col bg-white border-l border-slate-200 shadow-2xl dark:bg-[#0a0a0b] dark:border-white/5 lg:hidden print:hidden"
            >
              {/* Drawer header */}
              <div className="flex h-14 items-center justify-between border-b border-slate-200/80 px-4 dark:border-white/5">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">On this page</span>
                <button
                  type="button"
                  onClick={() => setMobileTocOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 transition-colors dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-3 py-4 [scrollbar-width:thin]">
                <ul className="space-y-0.5">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        onClick={() => setMobileTocOpen(false)}
                        className={cn(
                          "block rounded-md px-3 py-2.5 text-[13px] leading-snug transition-colors",
                          activeSection === section.id
                            ? "bg-emerald-500/10 font-semibold text-emerald-600 dark:text-emerald-400"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                        )}
                      >
                        <span className="line-clamp-2">{section.title}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
        {/* Sidebar Table of Contents */}
        <nav className="sticky top-20 hidden h-fit w-56 shrink-0 lg:block print:hidden">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {s.onThisPage}
          </p>
          <ul className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <li key={section.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all ${
                      isActive
                        ? "bg-emerald-50 font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {section.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Main Content */}
        <main className="min-w-0 flex-1">
          {/* Hero */}
          <div className="mb-12 rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-8 dark:border-white/5 dark:from-emerald-500/5 dark:via-[#111113] dark:to-teal-500/5 sm:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                  {s.title}
                </h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {s.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300 print:hidden">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/5">
                    {s.effective}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 dark:border-white/10 dark:bg-white/5">
                    {s.updated}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Purpose */}
          <section id="purpose" className="mb-12 scroll-mt-24">
            <SectionHeading icon={BookOpen} title={sections[0]?.title ?? ""} />
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p1}
            </p>
          </section>

          {/* Section 2: What Is Classgrid */}
          <section id="what-is-classgrid" className="mb-12 scroll-mt-24">
            <SectionHeading icon={Shield} title={sections[1]?.title ?? ""} />
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p2}
            </p>
            <div className="mt-4 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-500/10 dark:bg-emerald-500/5">
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                <strong>{s.p2_highlight}</strong>
              </p>
            </div>
          </section>

          {/* Section 3: Why No Patent */}
          <section id="why-no-patent" className="mb-12 scroll-mt-24">
            <SectionHeading icon={FileText} title={sections[2]?.title ?? ""} />

            <h3 className="mb-3 mt-6 text-base font-semibold text-slate-800 dark:text-white">
              {s.p3_1}
            </h3>
            <p className="mb-4 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p3_1_desc}
            </p>
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-white/5 dark:bg-transparent">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-white/[0.02] dark:hover:bg-white/[0.02]">
                    <TableHead className="w-[40%] font-semibold text-slate-700 dark:text-slate-300">
                      {s.tableCompany}
                    </TableHead>
                    <TableHead className="w-[30%] font-semibold text-slate-700 dark:text-slate-300">
                      {s.tableType}
                    </TableHead>
                    <TableHead className="w-[30%] text-center font-semibold text-slate-700 dark:text-slate-300">
                      {s.tablePatented}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {industryExamples.map((item) => (
                    <TableRow key={item.company} className="dark:border-white/5">
                      <TableCell className="font-medium text-slate-800 dark:text-white">
                        {item.company}
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">
                        {item.type}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-50 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10">
                          <XCircle className="mr-1 h-3 w-3" /> {s.statusNo}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <h3 className="mb-3 mt-8 text-base font-semibold text-slate-800 dark:text-white">
              {s.p3_2}
            </h3>
            <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-4 dark:border-amber-500/10 dark:bg-amber-500/5">
              <p className="whitespace-pre-line text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                {s.p3_2_desc}
              </p>
            </div>

            <h3 className="mb-3 mt-8 text-base font-semibold text-slate-800 dark:text-white">
              {s.p3_3}
            </h3>
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p3_3_desc}
            </p>

            <h3 className="mb-3 mt-8 text-base font-semibold text-slate-800 dark:text-white">
              {s.p3_4}
            </h3>
            <p className="mb-3 text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p3_4_desc}
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1.5 text-[15px] text-slate-700 dark:text-slate-200">
              {(s.executionList ?? []).map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.p3_4_outro}
            </p>
          </section>

          {/* Section 4: How Protected */}
          <section id="how-protected" className="mb-12 scroll-mt-24">
            <SectionHeading icon={Lock} title={sections[3]?.title ?? ""} />
            <div className="mt-2 space-y-4">
              {protectionMethods.map((item) => {
                const Icon = item.icon;
                const isNA = item.status === "not-applicable";
                return (
                  <Card
                    key={item.method}
                    className={`border transition-all ${
                      isNA
                        ? "border-red-200/60 bg-red-50/30 dark:border-red-500/10 dark:bg-red-500/5"
                        : "border-slate-200/80 bg-white dark:border-white/5 dark:bg-white/[0.02]"
                    }`}
                  >
                    <CardContent className="flex items-start gap-3 p-5">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isNA
                            ? "bg-red-100 dark:bg-red-500/10"
                            : "bg-emerald-100 dark:bg-emerald-500/10"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            isNA
                              ? "text-red-500 dark:text-red-400"
                              : "text-emerald-600 dark:text-emerald-400"
                          }`}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-slate-800 dark:text-white">
                            {item.method}
                          </h4>
                          {isNA ? (
                            <Badge variant="destructive" className="bg-red-100 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10">
                              <XCircle className="mr-1 h-3 w-3" /> {s.statusNA}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> {s.statusActive}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {s.legalBasis} {item.basis}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                          {item.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Section 5: For Students & Faculty */}
          <section id="summary-students" className="mb-12 scroll-mt-24">
            <SectionHeading
              icon={Landmark}
              title={sections[4]?.title ?? ""}
            />
            <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50 p-6 dark:border-emerald-500/10 dark:from-emerald-500/5 dark:to-teal-500/5">
              <p className="text-sm font-medium leading-relaxed text-emerald-900 dark:text-emerald-100">
                {s.p5_desc}
              </p>
              <blockquote className="mt-4 border-l-4 border-emerald-400 pl-4 text-[15px] leading-relaxed text-slate-700 dark:border-emerald-500 dark:text-slate-200">
                &ldquo;{s.p5_quote}&rdquo;
              </blockquote>
            </div>
          </section>

          {/* Section 6: For Investors & Partners */}
          <section id="summary-investors" className="mb-12 scroll-mt-24">
            <SectionHeading icon={Copyright} title={sections[5]?.title ?? ""} />
            <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white dark:border-white/5 dark:bg-transparent">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-white/[0.02] dark:hover:bg-white/[0.02]">
                    <TableHead className="w-[30%] font-semibold text-slate-700 dark:text-slate-300">
                      {s.tableMethod}
                    </TableHead>
                    <TableHead className="w-[20%] text-center font-semibold text-slate-700 dark:text-slate-300">
                      {s.tableStatus}
                    </TableHead>
                    <TableHead className="w-[50%] font-semibold text-slate-700 dark:text-slate-300">
                      {s.legalBasis}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {protectionMethods.map((row) => {
                    const isNA = row.status === "not-applicable";
                    return (
                      <TableRow key={row.method} className="dark:border-white/5">
                        <TableCell className="font-medium text-slate-800 dark:text-white">
                          {row.method}
                        </TableCell>
                        <TableCell className="text-center text-slate-700 dark:text-slate-200">
                          {isNA ? (
                            <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-50 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10">
                              <XCircle className="mr-1 h-3 w-3" /> {s.statusNo}
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/10">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> {s.statusActive}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-600 dark:text-slate-300">
                          {row.basis}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Section 7: Contact */}
          <section id="contact" className="mb-16 scroll-mt-24">
            <SectionHeading icon={ExternalLink} title={sections[6]?.title ?? ""} />
            <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-200">
              {s.footerContact}
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <a 
                href="mailto:support@classgrid.in"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                <ExternalLink className="h-4 w-4" />
                support@classgrid.in
              </a>
              <Link 
                href="/"
                className="inline-flex w-fit items-center gap-2 text-sm font-medium text-emerald-600 hover:underline dark:text-emerald-400"
              >
                <Globe className="h-4 w-4" />
                classgrid.in
              </Link>
            </div>
          </section>

          {/* Footer Note */}
          <div className="border-t border-slate-200/80 pt-6 dark:border-white/5">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {s.footerNote1}
              <Link href="/ip-protection" className="text-emerald-500 hover:underline">
                classgrid.in/ip-protection
              </Link>
              .
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {s.footerNote2}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-500/10">
        <Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
    </div>
  );
}
