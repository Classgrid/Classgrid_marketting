"use client"
import React from "react"
import Marquee from "react-fast-marquee"

const logos = ["Google Meet", "Zoom", "Razorpay", "Google Drive", "Excel", "Firebase"]

export default function MarqueeLogos() {
  return (
    <div className="py-3" aria-hidden>
      <Marquee gradient={false} speed={40} pauseOnHover>
        {logos.map((name) => (
          <div
            className="mx-3 flex h-16 min-w-40 items-center justify-center rounded-xl border border-border bg-card px-4 text-sm font-semibold text-card-foreground shadow-sm"
            key={name}
          >
            {name}
          </div>
        ))}
      </Marquee>
    </div>
  )
}
