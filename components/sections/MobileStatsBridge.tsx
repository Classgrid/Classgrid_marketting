"use client";

import React, { useState, useEffect } from "react";

export function MobileStatsBridge() {
  const [count, setCount] = useState(10482910);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 5) + 1);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sm:hidden w-full relative z-10 -mt-6">
      {/* Divider line 1 */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Stats bridge — transparent so it blends with the page */}
      <div className="w-full relative flex flex-col items-center py-6 overflow-hidden bg-transparent">
        {/* Ambient green glow — top left */}
        <div
          className="absolute top-[-20px] left-[-30px] w-[180px] h-[180px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(0,223,216,0.18) 0%, transparent 70%)",
            animation: "glowGreen 3s ease-in-out infinite alternate",
          }}
        />
        {/* Ambient pink glow — bottom right */}
        <div
          className="absolute bottom-[-20px] right-[-30px] w-[180px] h-[180px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(255,0,128,0.18) 0%, transparent 70%)",
            animation: "glowPink 3s ease-in-out infinite alternate",
          }}
        />

        {/* Stats pill with spinning conic-gradient border */}
        <div className="relative inline-flex items-center justify-center rounded-full p-[1.5px] overflow-hidden shadow-[0_0_30px_rgba(0,223,216,0.1),0_0_30px_rgba(255,0,128,0.1)]">
          {/* Animated gradient ring */}
          <div className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,rgba(0,0,0,0)_0%,rgba(0,0,0,0)_45%,#00dfd8_65%,#ff0080_85%,rgba(0,0,0,0)_100%)] opacity-100" />
          
          {/* Inner dark pill */}
          <div className="relative flex flex-col items-center px-8 py-3.5 rounded-full bg-[#050505]/90 backdrop-blur-xl z-10">
            <span className="font-mono text-[26px] font-bold tracking-widest text-white">
              {count.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Label */}
        <p className="mt-4 text-center text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Attendance Records Processed Monthly
        </p>
      </div>

      {/* Divider line 2 */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <style>{`
        @keyframes glowGreen {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0.3; transform: scale(0.85); }
        }
        @keyframes glowPink {
          0%   { opacity: 0.3; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
