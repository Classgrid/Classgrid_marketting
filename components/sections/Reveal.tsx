"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 36,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const dirMap = {
    up:    { y: distance, x: 0 },
    down:  { y: -distance, x: 0 },
    left:  { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    none:  { x: 0, y: 0 },
  };

  const variants = {
    hidden: { opacity: 0, ...dirMap[direction] },
    visible: { opacity: 1, x: 0, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
