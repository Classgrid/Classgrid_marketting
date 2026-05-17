"use client";

import React from "react";
import { Reveal } from "@/components/sections/Reveal";
import { Quote } from "lucide-react";

interface TeamVisionQuote {
  name?: string;
  role?: string;
  quote?: string;
  avatarUrl?: string;
}

interface TeamVisionSectionProps {
  title?: string;
  quotes?: TeamVisionQuote[];
}

export function TeamVisionSection({
  title = "Our Vision",
  quotes = [],
}: TeamVisionSectionProps) {
  if (!quotes || quotes.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 md:py-24">
      <Reveal>
        <div className="mb-12 text-center md:mb-16">
          <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500"></div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-5xl">
            {title}
          </h2>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {quotes.map((quote, index) => {
          const safeName = quote.name?.trim() || "";
          
          return (
            <Reveal key={index} delay={index * 0.1}>
              <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-[#f0fdf4] to-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:flex-row dark:border-white/[0.05] dark:from-[#0a2418] dark:to-[#05130d] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
                {/* Left side – avatar */}
                <div className="relative flex h-[280px] w-full shrink-0 bg-emerald-100 md:h-auto md:w-[35%] dark:bg-emerald-950/50">
                  {quote.avatarUrl ? (
                    <img
                      src={quote.avatarUrl}
                      alt={safeName}
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 text-5xl font-bold text-white dark:from-emerald-800 dark:to-emerald-950">
                      {safeName ? safeName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>

                {/* Right side – content */}
                <div className="flex w-full flex-col justify-between p-7 md:w-[65%] md:p-10">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start justify-end">
                      <Quote
                        className="h-10 w-10 shrink-0 rotate-180 text-emerald-500/30 md:h-12 md:w-12 dark:text-emerald-400/20"
                        fill="currentColor"
                      />
                    </div>

                    {/* Quote body */}
                    {quote.quote ? (
                      <div className="text-[15px] leading-relaxed text-slate-600 md:text-lg dark:text-slate-300">
                        <p>{quote.quote.trim()}</p>
                      </div>
                    ) : null}
                  </div>

                  {/* Footer: name & role */}
                  <div className="mt-8 flex flex-col gap-1">
                    {safeName ? (
                      <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                        - {safeName}
                      </p>
                    ) : null}
                    {quote.role ? (
                      <div className="mt-1 text-base font-medium text-slate-700 dark:text-slate-300">
                        <p>{quote.role}</p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
