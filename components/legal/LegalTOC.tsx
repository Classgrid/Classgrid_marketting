"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LegalSection } from "@/components/legal/types";

type LegalTOCProps = {
  sections: LegalSection[];
};

export function LegalTOC({ sections }: LegalTOCProps) {
  const [mounted, setMounted] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id ?? "");
  const [progress, setProgress] = useState(0);
  const isProgrammaticScrollRef = useRef(false);
  const targetSectionRef = useRef<string | null>(null);
  const programmaticScrollTimeoutRef = useRef<number | null>(null);

  const sectionIds = useMemo(() => sections.map((section) => section.id), [sections]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const updateScrollState = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      setProgress(nextProgress);

      if (isProgrammaticScrollRef.current && targetSectionRef.current) {
        const targetElement = document.getElementById(targetSectionRef.current);
        if (targetElement) {
          const targetTopDistance = Math.abs(targetElement.getBoundingClientRect().top - 96);
          if (targetTopDistance > 28) return;
        }
      }

      let currentId = sectionIds[0];
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (scrollTop >= element.offsetTop - 180) currentId = id;
      }
      setActiveSectionId(currentId);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateScrollState);
      if (programmaticScrollTimeoutRef.current) {
        window.clearTimeout(programmaticScrollTimeoutRef.current);
      }
    };
  }, [sectionIds]);

  const handleTocClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const element = document.getElementById(sectionId);
    if (!element) return;

    isProgrammaticScrollRef.current = true;
    targetSectionRef.current = sectionId;
    if (programmaticScrollTimeoutRef.current) {
      window.clearTimeout(programmaticScrollTimeoutRef.current);
    }

    const yOffset = 96;
    const targetTop = element.getBoundingClientRect().top + window.scrollY - yOffset;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });

    programmaticScrollTimeoutRef.current = window.setTimeout(() => {
      isProgrammaticScrollRef.current = false;
      targetSectionRef.current = null;
    }, 700);

    window.history.replaceState(null, "", `#${sectionId}`);
    setActiveSectionId(sectionId);
  };

  const formatSectionTitle = (title: string) => title.replace(/^\s*\d+[.)]\s*/, "");

  if (!mounted) return null;

  return (
    <>
      {/* Sticky sidebar — stops at footer naturally (no overlap) */}
      <aside className="hidden lg:block w-[260px] shrink-0">
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-border bg-background [scrollbar-width:thin]">
          <motion.div
            className="p-5"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <motion.h3
              className="mb-4 text-2xl font-bold text-foreground"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.06 }}
            >
              Legal Cover
            </motion.h3>
            <div className="space-y-3">
              {sections.map((section, index) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={(event) => handleTocClick(event, section.id)}
                  className={cn(
                    "relative block overflow-hidden rounded-md bg-transparent px-2 py-2 text-sm leading-7 transition-colors duration-200",
                    activeSectionId === section.id
                      ? "text-emerald-500 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {activeSectionId === section.id ? (
                    <span className="pointer-events-none absolute inset-0 rounded-md border-l-2 border-emerald-500 bg-emerald-500/6" />
                  ) : null}
                  <span className="relative inline-block w-8 text-sm font-semibold">{String(index + 1).padStart(2, "0")}</span>
                  <span className="relative inline text-sm">{formatSectionTitle(section.title)}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </aside>
    </>
  );
}
