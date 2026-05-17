"use client"
import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type FeatureCardProps = {
  title: React.ReactNode
  desc: React.ReactNode
  icon?: React.ReactNode
  className?: string
}

const MotionDiv = motion.div as any

export default function FeatureCard({ title, desc, icon, className }: FeatureCardProps) {
  return (
    <MotionDiv
      className={cn(
        "rounded-xl border border-border bg-card p-5 shadow-sm",
        "transition-colors hover:bg-accent/40",
        className
      )}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      {icon ? <div className="mb-2 text-2xl leading-none">{icon}</div> : null}
      <h4 className="my-2 text-lg font-semibold text-card-foreground">{title}</h4>
      <p className="m-0 text-sm leading-relaxed text-muted-foreground">{desc}</p>
    </MotionDiv>
  )
}
