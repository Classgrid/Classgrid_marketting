"use client";

import React from "react";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

export default function IntegrationHero() {
  return (
    <section className="relative overflow-hidden bg-transparent py-32 flex flex-col items-center justify-center">
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-center z-20">
        <span className="inline-block mb-4 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-sm font-semibold tracking-wider text-emerald-500 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/50 dark:text-emerald-400">
          INTEGRATIONS
        </span>
        <SectionAccentBar />
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-5xl">
          Technology That Drives Us
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Deeply integrated with your campus ecosystem.
        </p>
      </div>

      {/* Concentric rings */}
      <div className="relative w-full max-w-5xl mx-auto py-24 flex items-center justify-center min-h-[600px] overflow-visible mt-8 z-10">
        
        {/* Ring 1 - Inner */}
        <div className="absolute w-[280px] h-[280px] rounded-full border border-slate-200 dark:border-white/10 animate-[spin_60s_linear_infinite]">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,153,0,0.2)] animate-[spin_60s_linear_reverse_infinite]">
            <img src="/integrations/aws.svg" alt="AWS" className="w-8 h-8" />
          </div>
        </div>

        {/* Ring 2 - Middle */}
        <div className="absolute w-[440px] h-[440px] rounded-full border border-slate-200 dark:border-white/10 animate-[spin_80s_linear_reverse_infinite]">
          <div className="absolute top-[15%] left-[5%] w-16 h-16 rounded-full bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(71,162,72,0.2)] animate-[spin_80s_linear_infinite]">
            <img src="https://cdn.simpleicons.org/mongodb/47A248" alt="MongoDB" className="w-9 h-9" />
          </div>
          <div className="absolute bottom-[15%] right-[5%] w-16 h-16 rounded-full bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(62,207,142,0.2)] animate-[spin_80s_linear_infinite]">
            <img src="https://cdn.simpleicons.org/supabase/3ECF8E" alt="Supabase" className="w-9 h-9" />
          </div>
        </div>

        {/* Ring 3 - Outer */}
        <div className="absolute w-[600px] h-[600px] rounded-full border border-slate-200 dark:border-white/10 animate-[spin_100s_linear_infinite]">
          <div className="absolute -top-8 left-[30%] -translate-x-1/2 w-16 h-16 rounded-full bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,68,56,0.2)] animate-[spin_100s_linear_reverse_infinite]">
            <img src="https://cdn.simpleicons.org/redis/FF4438" alt="Redis" className="w-9 h-9" />
          </div>
          <div className="absolute bottom-[5%] left-[30%] -translate-x-1/2 w-16 h-16 rounded-full bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(45,140,255,0.2)] animate-[spin_100s_linear_reverse_infinite]">
            <img src="https://cdn.simpleicons.org/zoom/2D8CFF" alt="Zoom" className="w-9 h-9" />
          </div>
          <div className="absolute top-[40%] right-[-32px] -translate-y-1/2 w-16 h-16 rounded-full bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(2,4,43,0.2)] animate-[spin_100s_linear_reverse_infinite]">
            <img src="https://cdn.simpleicons.org/razorpay/FFFFFF" alt="Razorpay" className="w-9 h-9" />
          </div>
        </div>

        {/* Center Logo */}
        <div className="absolute z-20 w-32 h-32 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-2xl shadow-[0_0_80px_-10px_rgba(16, 185, 129)),1)] backdrop-blur-xl border border-white/20">
          Classgrid
        </div>
      </div>
    </section>
  );
}
