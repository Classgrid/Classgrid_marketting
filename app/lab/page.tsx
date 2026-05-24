// @ts-nocheck
"use client";

import React, { type ReactNode, useState, useCallback, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

/* ──────────────────────────────────────────────────────────────────
   LAB — Working version (background-clip approach)
   Same classNames as real bento-grid to test compatibility
   ────────────────────────────────────────────────────────────────── */

function darkenColor(hex: string, factor = 0.5): string {
  const h = hex.replace("#", "");
  const r = Math.round(parseInt(h.substring(0, 2), 16) * factor);
  const g = Math.round(parseInt(h.substring(2, 4), 16) * factor);
  const b = Math.round(parseInt(h.substring(4, 6), 16) * factor);
  return `rgb(${r}, ${g}, ${b})`;
}

function TestCard({
  name,
  description,
  icon,
  iconColor = "#34d399",
}: {
  name: string;
  description: string;
  icon: string;
  iconColor?: string;
}) {
  // ── Inner cursor glow (same as backup) ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // ── Rotating border ring ──
  const [ringHovered, setRingHovered] = useState(false);
  const [ringPhase, setRingPhase] = useState<"idle" | "flash" | "orbit">("idle");
  const ringTimer = useRef<NodeJS.Timeout | null>(null);
  const borderColorDark = darkenColor(iconColor, 0.5);

  const handleMouseEnter = useCallback(() => {
    setRingHovered(true);
    setRingPhase("flash");
    if (ringTimer.current) clearTimeout(ringTimer.current);
    ringTimer.current = setTimeout(() => setRingPhase("orbit"), 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRingHovered(false);
    setRingPhase("idle");
    if (ringTimer.current) clearTimeout(ringTimer.current);
  }, []);

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative flex flex-col justify-between rounded-xl transition-all duration-300 cursor-pointer"
      style={{ background: "#111", border: "1.5px solid rgba(255, 255, 255, 0.1)" }}
    >
      {/* ── Rotating border ring (background-clip — WORKING version) ── */}
      <div
        className="absolute rounded-xl pointer-events-none z-10"
        style={{
          inset: "0px",
          opacity: ringHovered ? 1 : 0,
          transition: "opacity 0.2s ease",
          border: "1.5px solid transparent",
          backgroundImage: `
            linear-gradient(#111, #111),
            conic-gradient(
              from var(--border-angle),
              transparent 0%,
              ${borderColorDark} 10%,
              ${iconColor} 20%,
              transparent 40%
            )
          `,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          animation:
            ringPhase === "flash"
              ? "flashBorder 0.3s linear forwards"
              : ringPhase === "orbit"
              ? "orbitBorder 4s linear infinite"
              : "none",
        }}
      />

      {/* ── Inner cursor glow - Dark mode (from backup) ── */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${springX}px ${springY}px,
              ${iconColor}22,
              transparent 80%
            )
          `,
        }}
      />

      {/* ── Card content ── */}
      <div className="p-6 relative z-20 flex flex-col h-full bg-transparent">
        <div className="flex flex-col gap-2 transition-all duration-300 group-hover:-translate-y-1">
          <div
            className="flex h-10 w-10 items-center justify-center mb-1 text-2xl"
            style={{ color: iconColor, filter: `drop-shadow(0 0 6px ${iconColor}99)` }}
          >
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">{name}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed font-medium">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

const CARDS = [
  { name: "Attendance System", description: "Biometric & smart attendance with real-time sync across all campuses.", iconColor: "#34d399", icon: "📋" },
  { name: "Online Exam Platform", description: "AI-proctored exams with auto-grading, batch processing, and result analytics.", iconColor: "#60a5fa", icon: "📝" },
  { name: "Fee Collection", description: "Automated fee management with multi-gateway payments and receipt generation.", iconColor: "#f472b6", icon: "💰" },
  { name: "AI Assistant", description: "Intelligent campus assistant powered by GPT for students, faculty, and admins.", iconColor: "#e08a1e", icon: "🤖" },
  { name: "Result Engine", description: "Smart result processing with custom grading schemes and analytics.", iconColor: "#a78bfa", icon: "📊" },
];

export default function LabPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-12">
      <style>{`
        @property --border-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes flashBorder {
          0% { --border-angle: 0deg; }
          100% { --border-angle: 360deg; }
        }
        @keyframes orbitBorder {
          0% { --border-angle: 0deg; }
          100% { --border-angle: 360deg; }
        }
      `}</style>

      <h1 className="text-white text-2xl font-bold mb-8 text-center">
        Working version — border ring + inner glow
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[220px]">
        {CARDS.map((card) => (
          <TestCard key={card.name} {...card} />
        ))}
      </div>
    </div>
  );
}
