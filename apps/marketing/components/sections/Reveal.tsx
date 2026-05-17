"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

const MotionDiv = motion.div as any;

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <MotionDiv
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.65, 0.3, 0.9] }}
    >
      {children}
    </MotionDiv>
  );
}
