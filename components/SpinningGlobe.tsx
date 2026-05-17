"use client"
import React from "react"

export default function SpinningGlobe() {
  return (
    <div
      className="relative size-full animate-spin overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_20%,#22c1c3_0%,#0369a1_45%,#0f172a_100%)] shadow-[0_18px_40px_rgba(2,6,23,0.25),inset_0_8px_20px_rgba(255,255,255,0.03)] [animation-duration:12s]"
      role="img"
      aria-label="Spinning globe"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.03),transparent_25%),repeating-linear-gradient(0deg,rgba(255,255,255,0.03)_0_1px,transparent_1px_8px)] mix-blend-overlay opacity-90" />
    </div>
  )
}
