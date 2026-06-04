"use client";

import React from "react";
import { motion } from "framer-motion";


export default function RoughPage() {
  return (
    <div className="relative min-h-screen bg-[#c12929] overflow-hidden flex items-center justify-center font-sans">

      {/* CSS Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Ambient Glowing Orbs in the background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-pink-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-green-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

      {/* --- WAVY GLOWING RIBBON (SOLANA STYLE DEMO) --- */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* We use an SVG to draw smooth bezier curves that animate over time */}
        <svg
          viewBox="0 0 1000 400"
          className="w-full h-full scale-125 opacity-90"
          preserveAspectRatio="none"
        >
          <defs>
            {/* The Pink to White to Green Gradient */}
            <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#050505" />
              <stop offset="15%" stopColor="#ec4899" /> {/* Pink */}
              <stop offset="50%" stopColor="#ffffff" /> {/* White hot center */}
              <stop offset="85%" stopColor="#22c55e" /> {/* Green */}
              <stop offset="100%" stopColor="#050505" />
            </linearGradient>

            {/* SVG Glow Filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Main Thick Animated Wave */}
          <motion.path
            d="M -100 200 C 200 50, 800 350, 1100 200"
            stroke="url(#wave-grad)"
            strokeWidth="12"
            strokeLinecap="round"
            fill="transparent"
            filter="url(#glow)"
            animate={{
              d: [
                "M -100 200 C 300 -100, 700 500, 1100 200", // State 1: Curve up then down
                "M -100 200 C 400 500, 600 -100, 1100 200", // State 2: Curve down then up
                "M -100 200 C 300 -100, 700 500, 1100 200"  // Back to State 1
              ]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Secondary Thin Wave (Creates a 3D overlapping ribbon effect) */}
          <motion.path
            d="M -100 200 C 200 50, 800 350, 1100 200"
            stroke="url(#wave-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
            filter="url(#glow)"
            opacity="0.6"
            animate={{
              d: [
                "M -100 200 C 200 500, 800 -100, 1100 200",
                "M -100 200 C 500 -100, 500 500, 1100 200",
                "M -100 200 C 200 500, 800 -100, 1100 200"
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>

    </div>
  );
}
