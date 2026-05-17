// @ts-nocheck
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code2, Database, BarChart3, GraduationCap } from "lucide-react";

/**
 * Scroll Morph Hero - Fixed Version
 * 
 * Issues Fixed:
 * - No scroll hijacking (allows page scroll)
 * - Proper container height (no image clipping)
 * - Real dashboard mockup cards instead of placeholders
 * - Proper light/dark theme support
 */

export default function IntroAnimation() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const dashboardCards = [
    {
      title: "Academics",
      icon: GraduationCap,
      description: "Real-time attendance, grades, and class management",
      color: "from-emerald-400/20 to-emerald-500/20",
      darkColor: "dark:from-emerald-400/30 dark:to-emerald-500/30"
    },
    {
      title: "Analytics",
      icon: BarChart3,
      description: "AI-powered insights and predictive analytics",
      color: "from-purple-500/20 to-purple-600/20",
      darkColor: "dark:from-purple-500/30 dark:to-purple-600/30"
    },
    {
      title: "Data",
      icon: Database,
      description: "Secure, scalable database with real-time sync",
      color: "from-emerald-400/20 to-emerald-500/20",
      darkColor: "dark:from-emerald-400/30 dark:to-emerald-500/30"
    },
    {
      title: "Operations",
      icon: Code2,
      description: "Unified API and system automation",
      color: "from-orange-500/20 to-orange-600/20",
      darkColor: "dark:from-orange-500/30 dark:to-orange-600/30"
    }
  ];

  return (
    <div className="w-full h-full relative bg-gradient-to-b from-background via-background/50 to-background flex items-center justify-center px-4 py-12">
      {/* Subtle background grid effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          {/* @ts-ignore */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            // @ts-ignore
            className="text-3xl md:text-4xl font-bold text-foreground mb-3"
          >
            Unified on Every Campus
          </motion.h2>
          {/* @ts-ignore */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg max-w-2xl mx-auto"
          >
            All core modules visualized in one dashboard. From admissions to analytics, manage everything with precision.
          </motion.p>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {dashboardCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              // @ts-ignore
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.15 * idx }}
                whileHover={{ y: -4 }}
                className={`group relative h-48 rounded-2xl border border-foreground/10 overflow-hidden cursor-pointer transition-all duration-300 hover:border-emerald-400/50`}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} ${card.darkColor} transition-all duration-300 group-hover:opacity-100 opacity-60`}
                />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between z-10 backdrop-blur-[2px] group-hover:backdrop-blur-sm transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 group-hover:text-emerald-400 transition-colors duration-300">
                        {card.title}
                      </h3>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Icon + Arrow */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="w-10 h-10 rounded-lg bg-foreground/5 group-hover:bg-emerald-400/20 flex items-center justify-center transition-all duration-300">
                      <Icon className="w-5 h-5 text-foreground/60 group-hover:text-emerald-400 transition-colors duration-300" />
                    </div>
                    {/* @ts-ignore */}
                    <motion.div
                      className="text-foreground/40 group-hover:text-emerald-400 transition-colors duration-300 text-2xl"
                      whileHover={{ x: 4 }}
                    >
                      →
                    </motion.div>
                  </div>
                </div>

                {/* Border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(52, 211, 153), 0.2), transparent)",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Feature Highlight */}
        {/* @ts-ignore */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="p-6 rounded-xl border border-foreground/10 bg-foreground/[0.02] backdrop-blur-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <span className="text-sm font-semibold text-emerald-400">All Integrated</span>
          </div>
          <p className="text-foreground/80">
            41 modules. One unified interface. Real-time data sync across all systems — no disconnects, no delays, no chaos.
          </p>
        </motion.div>
      </div>

      <style>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </div>
  );
}
