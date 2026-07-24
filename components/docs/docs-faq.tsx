"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

/**
 * DocsFAQItem — A single collapsible FAQ accordion item for documentation pages.
 * 
 * Usage in markdown (via <details>/<summary>):
 * 
 * <details>
 * <summary>Can I change my organization type after creation?</summary>
 * No. The org_type is permanent and cannot be changed after registration.
 * </details>
 */
export function DocsFAQItem({
  children,
  open: controlledOpen,
}: {
  children: ReactNode;
  open?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(controlledOpen ?? false);

  // Extract summary and body from children
  let summaryContent: ReactNode = "Question";
  let bodyContent: ReactNode[] = [];

  const childArray = Array.isArray(children) ? children : [children];
  childArray.forEach((child: any) => {
    if (child?.type === "summary" || child?.props?.node?.tagName === "summary") {
      summaryContent = child?.props?.children ?? child;
    } else {
      bodyContent.push(child);
    }
  });

  return (
    <div className="border-b border-slate-200 dark:border-white/10">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium leading-snug text-slate-900 dark:text-white transition-colors hover:text-emerald-400 focus-visible:outline-none"
        aria-expanded={isOpen}
      >
        <span>{summaryContent}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
          className="mt-0.5 shrink-0 text-slate-500 dark:text-zinc-500"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="faq-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: [0.33, 1, 0.68, 1] },
              opacity: { duration: 0.25, ease: "easeOut" },
            }}
            style={{ overflow: "hidden" }}
          >
            <div className="pb-5 pr-4 text-sm leading-7 text-slate-600 dark:text-zinc-400">
              {bodyContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * DocsFAQSummary — Renders the <summary> text inside a DocsFAQItem.
 * This is a pass-through; the actual rendering is handled by DocsFAQItem.
 */
export function DocsFAQSummary({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
