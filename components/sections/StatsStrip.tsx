"use client";

import { motion } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";

type Stat = { label: string; value?: number; suffix?: string; textValue?: string };

const containerVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.33, 1, 0.68, 1],
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.33, 1, 0.68, 1] },
  },
};

export function StatsStrip({ stats }: { stats: Stat[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto mt-6 mb-14 max-w-[1200px] overflow-visible rounded-2xl bg-emerald-50 px-4 py-12 shadow-2xl dark:bg-[#022c22]"
    >
      <div className={`grid gap-3 md:gap-5 ${
        stats.length <= 2
          ? "grid-cols-1 sm:grid-cols-2 max-w-[700px] mx-auto"
          : stats.length === 3
          ? "grid-cols-2 md:grid-cols-3"
          : "grid-cols-2 md:grid-cols-4"
      }`}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex flex-col items-center text-center"
          >
            {/* White bordered box */}
            <div
              className="flex min-h-[140px] w-full cursor-default select-none items-center justify-center border-4 border-emerald-200 px-1 dark:border-white sm:px-4 transition-all duration-300 ease-out hover:scale-[1.08] hover:-translate-y-2 hover:border-emerald-400 hover:dark:border-emerald-400 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_24px_rgba(52,211,153,0.35)]"
            >
              {stat.textValue ? (
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl md:text-4xl text-center px-2 leading-tight">
                  {stat.textValue}
                </span>
              ) : (
                <span className="whitespace-nowrap text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl md:text-5xl">
                  <NumberTicker value={stat.value ?? 0} />
                  {stat.suffix}
                </span>
              )}
            </div>
            {/* Label below */}
            <span className="mt-4 text-base font-bold uppercase tracking-widest text-slate-600 dark:text-white">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
