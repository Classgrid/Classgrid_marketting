"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Zap,
  Lock,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";

const MotionDiv = motion.div as any;

const features = [
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track student progress with detailed insights and real-time reporting.",
  },
  {
    icon: Users,
    title: "Collaboration Tools",
    description: "Connect teachers, students, and parents in one unified platform.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with instant loading and real-time updates.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "Bank-grade encryption with GDPR and SOC 2 compliance.",
  },
  {
    icon: BookOpen,
    title: "Content Library",
    description: "Access thousands of pre-made courses and learning materials.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessment Tools",
    description: "Create, manage, and grade assessments with ease.",
  },
];

export function ProfessionalFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <MotionDiv
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Powerful Features for Modern Education
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Everything you need to deliver exceptional learning experiences.
          </p>
        </MotionDiv>

        {/* Feature Grid */}
        <MotionDiv
          variants={containerVariants}
          initial={false}
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <MotionDiv
                key={idx}
                variants={itemVariants}
                className="group relative rounded-2xl bg-card p-8 border border-border hover:border-foreground hover:shadow-lg dark:hover:shadow-white/5 transition-all duration-300"
              >
                {/* Gradient on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  <div className="mb-4 inline-flex rounded-lg bg-secondary p-3">
                    <Icon className="w-6 h-6 text-foreground" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </MotionDiv>
            );
          })}
        </MotionDiv>
      </div>
    </section>
  );
}
