"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const MotionDiv = motion.div as any;
const MotionH1 = motion.h1 as any;
const MotionP = motion.p as any;

export function ProfessionalHero() {
  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-24 sm:pt-32 sm:pb-32">
      {/* Background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 -z-10 transform-gpu blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-foreground/5 to-foreground/10 opacity-20 dark:opacity-10" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <MotionDiv
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Badge */}
          <MotionDiv
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 inline-block"
          >
            <span className="inline-flex items-center rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground ring-1 ring-inset ring-border">
              ✨ Now with AI-powered features
            </span>
          </MotionDiv>

          {/* Main heading */}
          <MotionH1
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            The Future of Learning Management
          </MotionH1>

          {/* Subheading */}
          <MotionP
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-xl leading-8 text-muted-foreground max-w-2xl mx-auto"
          >
            Classgrid helps teachers and institutions manage learning with powerful, intuitive tools. Built for the modern classroom.
          </MotionP>

          {/* CTA Buttons */}
          <MotionDiv
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="/#demo" className="px-8 py-4 bg-foreground text-background rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2 group">
              Book a Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="/view-platform" className="px-8 py-4 border border-border text-foreground rounded-lg font-semibold hover:bg-secondary transition-colors">
              Explore Platform
            </a>
          </MotionDiv>
        </MotionDiv>
      </div>
    </section>
  );
}
