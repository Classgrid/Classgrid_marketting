"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { RoleDataMap } from "@/components/ui/radial-orbital-timeline";
import RadialOrbitalTimelineWrapper from "@/components/ui/radial-orbital-timeline-wrapper";

type TimelineTab = {
  id: string;
  label: string;
  heading?: string;
  description?: string;
  features?: string[];
  rings: string[][];
};

type TimelineSectionProps = {
  title: string;
  subtitle: string;
  tabs: TimelineTab[];
  defaultTab: string;
  roleDataMap?: RoleDataMap;
};

export function TimelineSection({ title, subtitle, tabs, defaultTab, roleDataMap }: TimelineSectionProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const activeTabData = tabs.find((t) => t.id === activeTab) ?? tabs[0];

  return (
    <section className="mx-auto w-full max-w-7xl overflow-visible border-t border-foreground/10 px-4 pt-10 pb-16">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500" />
        <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
          {title}
        </h2>
        <p className="text-lg font-medium text-muted-foreground">{subtitle}</p>
      </div>

      {/* ── Segmented pill tabs — matches "Overview / Automation" sliding style ── */}
      <div className="mb-12 flex justify-center">
        <div className="relative flex flex-wrap items-center justify-center gap-1 rounded-full border border-border bg-muted/80 p-1.5 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative z-10 px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 outline-none",
                activeTab === tab.id
                  ? "text-slate-900 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-200/50 hover:text-zinc-900 dark:text-white/60 dark:hover:bg-white/5 dark:hover:text-white"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="timeline-active-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTabData && (activeTabData.heading || activeTabData.description) ? (
        <div className="mx-auto mb-8 max-w-3xl text-center">
          {activeTabData.heading ? (
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {activeTabData.heading}
            </h3>
          ) : null}
          {activeTabData.description ? (
            <p className="text-sm font-medium leading-6 text-muted-foreground md:text-base">
              {activeTabData.description}
            </p>
          ) : null}
        </div>
      ) : null}

      {/* Active tab content */}
      {activeTabData && (
        <RadialOrbitalTimelineWrapper
          key={activeTabData.id}
          rings={activeTabData.rings}
          activeTab={activeTabData.id}
          roleDataMap={roleDataMap}
        />
      )}
    </section>
  );
}
