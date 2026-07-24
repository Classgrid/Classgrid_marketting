"use client";

import { motion } from "framer-motion";
import { IconRenderer } from "@/components/ui/icon-renderer";

type CoreValue = {
  title: string;
  description: string;
  icon?: string;
};

type AboutCoreValuesProps = {
  values?: CoreValue[];
};

const defaultValues: CoreValue[] = [
  {
    title: "Trust Before Everything",
    description: "We treat student data, institution workflows, and operational continuity with the seriousness they deserve.",
    icon: "Shield",
  },
  {
    title: "Calm Is a Feature",
    description: "Great software should reduce noise, reduce duplication, and help teams make better decisions with less effort.",
    icon: "Wind",
  },
  {
    title: "Built for Real Institutions",
    description: "We solve for the complexity educators actually live with, not a simplified demo version of their work.",
    icon: "Building",
  },
  {
    title: "Progress Over Posturing",
    description: "We care about shipping systems that genuinely improve outcomes more than chasing trends or surface-level novelty.",
    icon: "TrendingUp",
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const MotionDiv = motion.div as any;
const MotionSection = motion.section as any;

export function AboutCoreValues({ values = defaultValues }: AboutCoreValuesProps) {
  return (
    <MotionSection
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative w-full overflow-hidden bg-background py-24 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <MotionDiv variants={itemVariant}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400">
              Core Values
            </h2>
            <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              What We Stand For
            </h3>
          </MotionDiv>
        </div>

        <MotionDiv
          variants={staggerContainer}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {values.map((value, index) => (
            <MotionDiv
              key={value.title || index}
              variants={itemVariant}
              className="group relative rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-accent hover:shadow-[0_8px_30px_rgba(16,185,129,0.1)]"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors group-hover:bg-emerald-500/15">
                <IconRenderer name={value.icon || "Star"} className="h-6 w-6" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-foreground">
                {value.title}
              </h4>
              <p className="text-base leading-relaxed text-muted-foreground">
                {value.description}
              </p>
              
              {/* Top card number index styling */}
              <div className="absolute right-6 top-6 text-5xl font-extrabold text-foreground/[0.04] transition-colors group-hover:text-emerald-500/10">
                0{index + 1}
              </div>
            </MotionDiv>
          ))}
        </MotionDiv>
      </div>
    </MotionSection>
  );
}
