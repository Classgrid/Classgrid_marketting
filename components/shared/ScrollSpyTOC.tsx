"use client";

import { cn } from "@/lib/utils";

export interface TOCItem {
  id: string;
  label: string;
}

interface ScrollSpyTOCProps {
  tocItems: TOCItem[];
  activeSection: string;
}

/**
 * Right-side minimalist scroll-spy Table of Contents.
 * Renders a fixed-position "On this page" label + tick marks on desktop (xl+).
 * Shared between ComparisonDetailClient and BlogDetailClient.
 */
export function ScrollSpyTOC({ tocItems, activeSection }: ScrollSpyTOCProps) {
  return (
    <div className="hidden xl:block absolute right-8 top-24 bottom-24 w-40 z-40 pointer-events-none">
      <div className="sticky top-1/2 -translate-y-1/2 pointer-events-auto flex flex-col items-end w-full">

        {/* "On this page" dropdown label */}
        <div className="group relative inline-flex items-center gap-2 mb-4 text-[13px] font-medium text-muted-foreground cursor-pointer">
          On this page
          <div className="absolute top-full right-0 mt-2 w-56 max-h-[300px] overflow-y-auto overscroll-contain rounded-md border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[999] p-2 text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-2 px-2 pt-1">Table of Contents</div>
            {tocItems.map(item => (
              <a key={`dropdown-${item.id}`} href={`#${item.id}`} className={cn(
                "block px-2 py-1.5 text-[13px] rounded hover:bg-slate-100 dark:hover:bg-white/5",
                activeSection === item.id ? "text-emerald-500 font-medium" : "text-muted-foreground"
              )}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Scroll spy ticks */}
        <div className="flex flex-col gap-1 items-end w-full">
          {tocItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={`tick-${item.id}`}
                href={`#${item.id}`}
                className="group relative flex justify-end items-center h-2 w-full"
                aria-label={`Scroll to ${item.label}`}
                aria-current={isActive ? "true" : undefined}
              >
                <div
                  className={cn(
                    "h-[1px] transition-all duration-300 ease-in-out",
                    isActive
                      ? "w-10 bg-emerald-500 dark:bg-emerald-400"
                      : "w-5 bg-slate-400 dark:bg-white/40 group-hover:w-7 group-hover:bg-slate-500 dark:group-hover:bg-white/60"
                  )}
                />
                {/* Hover Tooltip */}
                <span className="absolute right-full mr-3 px-2 py-1 bg-slate-800 dark:bg-white text-white dark:text-black text-[11px] font-medium rounded opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap shadow-lg z-[999]">
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
