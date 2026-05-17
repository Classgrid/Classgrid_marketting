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
      className="mx-auto mt-6 mb-14 max-w-[1100px] rounded-2xl bg-emerald-50 px-4 py-12 shadow-2xl dark:bg-[#022c22]"
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="flex flex-col items-center text-center"
          >
            {/* White bordered box */}
            <motion.div
              whileHover={{ scale: 1.04, borderColor: "rgba(52,211,153,0.7)" }}
              transition={{ duration: 0.2 }}
              className="flex min-h-[120px] w-full items-center justify-center border-[2.5px] border-emerald-200 px-1 dark:border-white sm:px-4"
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
            </motion.div>
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
