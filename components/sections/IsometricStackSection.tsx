"use client";

import React, { useState, useRef, useEffect } from "react";
import "./isometric-stack.css";
import { LayersSvg } from "./LayersSvg";

/* ════════════════════════════════════════════
   TYPES
════════════════════════════════════════════ */
interface Phase {
  title: string;
  body: string;
  bullets: string[];
}

interface IsometricStackProps {
  kicker?: string;
  headline?: string;
  subheadline?: string;
  phases?: Phase[];
}

type StackEntryState = "collapsed" | "expanding" | "expanded";

/* ════════════════════════════════════════════
   DEFAULT DATA — 6 phases (fallback)
════════════════════════════════════════════ */
const DEFAULT_PHASES: Phase[] = [
  {
    title: "Admissions Engine.\nMerit-to-PRN in minutes.",
    body: "Automate every admission track — school divisions, junior college merit, engineering CAP rounds — with zero manual data entry.",
    bullets: [
      "School & Jr. College merit list generation",
      "Engineering CET / CAP round automation",
      "Auto PRN issuance & seat allocation",
      "DTE & SARAL export-ready reports",
    ],
  },
  {
    title: "Fee & Finance.\nReceipts to ledgers, automated.",
    body: "Collect fees online or offline, auto-generate receipts, track defaulters, and reconcile with your bank — all from one dashboard.",
    bullets: [
      "Online + counter fee collection",
      "Instant digital receipts & challans",
      "Smart fee defaulter detection",
      "Scholarship & concession management",
    ],
  },
  {
    title: "Academics Core.\nTimetable to transcripts.",
    body: "Manage timetables, attendance, internal marks, and university exam results across every department and division.",
    bullets: [
      "Drag-and-drop timetable builder",
      "Biometric & app-based attendance sync",
      "Grade book with CGPA/percentage modes",
    ],
  },
  {
    title: "HR & Payroll.\nStaff lifecycle, simplified.",
    body: "From recruitment to payslips — handle leave management, attendance, payroll processing, and compliance in one module.",
    bullets: [
      "Automated monthly payroll with TDS",
      "Leave & attendance policy engine",
      "Staff performance & appraisal tracking",
    ],
  },
  {
    title: "Role-based access.\n19 granular permission levels.",
    body: "Every user sees exactly what they need. Principal, HOD, clerk, accountant — each role is scoped with full audit trails.",
    bullets: [
      "19 distinct roles across departments",
      "Full audit logs on every transaction",
      "GDPR-compliant data handling",
    ],
  },
  {
    title: "Cloud infrastructure.\n99.9% uptime, always on.",
    body: "Enterprise-grade hosting with automatic backups, zero maintenance windows, and instant scaling during exam seasons.",
    bullets: [
      "Auto-scaling for results & admission peaks",
      "Daily encrypted backups",
      "Private cloud options for large institutions",
    ],
  },
];

/* ════════════════════════════════════════════
   MAIN COMPONENT — Step A (Wheel Interception)
════════════════════════════════════════════ */
export function IsometricStackSection({ kicker, headline, subheadline, phases }: IsometricStackProps) {
  const PHASES = phases && phases.length > 0 ? phases : DEFAULT_PHASES;
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [stackEntryState, setStackEntryState] = useState<StackEntryState>("collapsed");
  // visualIndex drives the SVG stretch visual; text always uses activeIndex
  const visualIndex = hoveredIndex ?? activeIndex;
  const sectionRef = useRef<HTMLElement>(null);
  const lastWheelTime = useRef(0);
  const activeIndexRef = useRef(0); // keeps the wheel handler always in sync
  const stackEntryTriggeredRef = useRef(false);
  const stackEntrySettleTimerRef = useRef<number | null>(null);

  // Keep the ref in sync with state
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Trigger the one-shot stack entry animation when the section reaches the viewport top.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let frameId: number | null = null;

    const triggerStackExpansion = () => {
      if (stackEntryTriggeredRef.current) return;

      stackEntryTriggeredRef.current = true;
      setStackEntryState("expanding");

      stackEntrySettleTimerRef.current = window.setTimeout(() => {
        setStackEntryState("expanded");
        stackEntrySettleTimerRef.current = null;
      }, 2450);
    };

    const checkSectionPosition = () => {
      frameId = null;

      if (stackEntryTriggeredRef.current) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const triggerOffset = Math.min(24, viewportHeight * 0.04);
      const sectionIsAtViewportTop = rect.top <= triggerOffset;
      const sectionStillFillsViewport = rect.bottom >= viewportHeight * 0.72;

      if (sectionIsAtViewportTop && sectionStillFillsViewport) {
        triggerStackExpansion();
      }
    };

    const requestPositionCheck = () => {
      if (frameId !== null || stackEntryTriggeredRef.current) return;
      frameId = window.requestAnimationFrame(checkSectionPosition);
    };

    // Delay listener attachment so browser scroll-restoration on reload doesn't trigger the animation
    const setupTimer = window.setTimeout(() => {
      requestPositionCheck();
      window.addEventListener("scroll", requestPositionCheck, { passive: true });
      window.addEventListener("resize", requestPositionCheck);
    }, 600);

    return () => {
      window.clearTimeout(setupTimer);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      if (stackEntrySettleTimerRef.current !== null) {
        window.clearTimeout(stackEntrySettleTimerRef.current);
        stackEntrySettleTimerRef.current = null;
      }

      window.removeEventListener("scroll", requestPositionCheck);
      window.removeEventListener("resize", requestPositionCheck);
    };
  }, []);

  // 2. Intercept the scroll wheel — variable stuckness per card
  // Registered ONCE (no [activeIndex] dep) — reads from ref so it never has a gap
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      const idx = activeIndexRef.current;

      // Variable cooldown: lite on edges, full in the middle
      const LITE_COOLDOWN = 200;   // cards 0 and 5 — quick transitions
      const FULL_COOLDOWN = 500;   // cards 1–4 — maximum stuckness

      // SCROLLING DOWN
      if (e.deltaY > 0) {
        if (idx < PHASES.length - 1) {
          e.preventDefault();
          const cooldown = (idx >= 1 && idx <= 4) ? FULL_COOLDOWN : LITE_COOLDOWN;
          if (now - lastWheelTime.current > cooldown) {
            setActiveIndex((prev) => prev + 1);
            lastWheelTime.current = now;
          }
        }
        // idx === 5 (last card) → don't preventDefault → page scrolls freely
      } 
      // SCROLLING UP
      else if (e.deltaY < 0) {
        if (idx > 0) {
          e.preventDefault();
          const cooldown = (idx >= 2 && idx <= 5) ? FULL_COOLDOWN : LITE_COOLDOWN;
          if (now - lastWheelTime.current > cooldown) {
            setActiveIndex((prev) => prev - 1);
            lastWheelTime.current = now;
          }
        }
        // idx === 0 (first card) → don't preventDefault → page scrolls freely
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []); // ← registered ONCE, never re-registers

  return (
    <section 
      className="cg-iso-wrapper" 
      ref={sectionRef}
      data-stack-entry={stackEntryState}
    >
      {/* ── flex-column wrapper so header sits above the two-column inner ── */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', width: '100%', position: 'relative', zIndex: 2 }}>

        {/* ═══ SECTION HEADER — above the two columns ═══ */}
        {(headline || subheadline) && (
          <div style={{ maxWidth: 760, margin: '0 auto 52px', textAlign: 'center', width: '100%' }}>
            <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500" />
            {headline && (
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.15, color: '#e2e8f0', marginBottom: 14 }}>
                {headline}
              </h2>
            )}
            {subheadline && (
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#94a3b8', maxWidth: 640, margin: '0 auto' }}>
                {subheadline}
              </p>
            )}
          </div>
        )}

        {/* ═══ TWO-COLUMN INNER ═══ */}
        <div className="cg-iso-inner">

        {/* ═══ LEFT: TEXT CAROUSEL ═══ */}
        <div className="cg-iso-text">
          <div className="cg-iso-kicker">
            <span>{kicker || "THE CLASSGRID ERP STACK"}</span>
          </div>

          <div className="cg-iso-carousel">
            {PHASES.map((phase, idx) => (
              <div
                key={idx}
                className={`cg-iso-slide ${activeIndex === idx ? "active" : ""}`}
              >
                <h2>
                  {phase.title.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < phase.title.split("\n").length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
                <p>{phase.body}</p>
                <ul className="cg-iso-bullets">
                  {phase.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="cg-iso-indicators">
            {PHASES.map((_, idx) => (
              <span
                key={idx}
                className={activeIndex === idx ? "active" : ""}
                onClick={() => setActiveIndex(idx)}
              />
            ))}
          </div>
        </div>

        {/* ═══ RIGHT: ISO STACK ═══ */}
        <div className="cg-iso-stack-panel">
          <div className="cg-iso-stack" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayersSvg
              activeIndex={activeIndex}
              visualIndex={visualIndex}
              setActiveIndex={setActiveIndex}
              setHoveredIndex={setHoveredIndex}
            />
          </div>
        </div>

        </div>
      </div>
    </section>
  );
}
