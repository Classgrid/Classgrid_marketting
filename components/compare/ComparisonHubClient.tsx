"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ComparisonItem = {
  _id: string;
  competitorName: string;
  slug: string;
  seoTitle?: string;
  metaDescription?: string;
  competitorLogo?: any;
  readTime?: number;
};

type ComparisonHubClientProps = {
  hubData: {
    heroHeadline: string;
    heroSubheadline?: string;
  };
  comparisons: ComparisonItem[];
};

export function ComparisonHubClient({ hubData, comparisons }: ComparisonHubClientProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden pt-16 pb-32">
      {/* Background Grid — nearly invisible atmosphere only */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.025] pointer-events-none" 
        style={{ backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)`, backgroundSize: '48px 48px' }} 
      />
      {/* Soft radial fade to suppress grid at edges */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, var(--background) 75%)' }}
      />

      <div className="container relative mx-auto px-6 max-w-2xl">
        
        {/* Hero Section — calm, editorial, typography-led */}
        <div className="text-center mb-28 space-y-8">
          {/* Accent bar — thinner, quieter */}
          <div className="mx-auto mb-4 h-[3px] w-16 rounded-full bg-orange-500/70" />
          
          {/* Headline — no italic, reduced weight, tighter measure */}
          <h1 className="text-xl md:text-2xl lg:text-[1.7rem] font-medium tracking-tight text-slate-800 dark:text-white/90 leading-[1.55] max-w-xl mx-auto">
            Every institution works differently. Compare workflows, usability, architecture, and operational experience across platforms.
          </h1>
          
          {hubData.heroSubheadline && (
            <p className="text-base text-slate-500 dark:text-neutral-500 leading-relaxed max-w-md mx-auto font-normal">
              {hubData.heroSubheadline}
            </p>
          )}
        </div>

        {/* Directory List — editorial divider style, no boxed feel */}
        <div className="relative z-10">
          {comparisons.length > 0 ? (
            comparisons.map((item, index) => (
              <Link 
                key={item._id}
                href={`/compare/${item.slug}`}
                className="group block py-10 transition-all duration-300"
              >
                {/* Top divider — very thin, nearly invisible */}
                <div className="border-t border-slate-200/40 dark:border-white/[0.15] mb-10" />
                
                <div className="flex items-start justify-between gap-8">
                  <div className="space-y-3">
                    {/* Title — medium weight, not bold, calm */}
                    <h2 className="text-lg md:text-xl font-medium tracking-tight text-slate-700 dark:text-white/80 group-hover:text-slate-900 dark:group-hover:text-white/95 transition-colors duration-300">
                      Classgrid & {item.competitorName}
                    </h2>
                    {item.metaDescription && (
                      <p className="text-sm text-slate-400 dark:text-neutral-500 max-w-md leading-relaxed font-normal">
                        {item.metaDescription}
                      </p>
                    )}
                  </div>
                  
                  {/* CTA — small, muted, subtle */}
                  <div className="hidden sm:flex items-center gap-1.5 text-base font-normal text-slate-400 dark:text-neutral-500 group-hover:text-emerald-500/80 dark:group-hover:text-emerald-400/70 transition-all duration-300 mt-1 shrink-0">
                    <span className="tracking-wide">View Audit</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Bottom divider for last item */}
                {index === comparisons.length - 1 && (
                  <div className="border-t border-slate-200/40 dark:border-white/[0.15] mt-10" />
                )}
              </Link>
            ))
          ) : (
            <div className="py-24 text-center">
              <div className="border-t border-slate-200/40 dark:border-white/[0.06] mb-10" />
              <p className="text-sm text-slate-400 dark:text-neutral-600">No comparisons available yet.</p>
              <div className="border-t border-slate-200/40 dark:border-white/[0.06] mt-10" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
