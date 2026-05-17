"use client";
import React from "react";
import { motion } from "framer-motion";

const MotionDiv = motion.div as any;

const FEATURES = [
  { title: "Real-time Chat", desc: "Chat with students and staff instantly.", emoji: "💬" },
  { title: "Timetable", desc: "Auto-generated, conflict-free timetables.", emoji: "📅" },
  { title: "Exams Engine", desc: "Create, schedule and grade exams.", emoji: "📝" },
  { title: "Fee Automation", desc: "Automate invoices and reconciliations.", emoji: "💳" },
  { title: "Reports & Analytics", desc: "Actionable insights for leadership.", emoji: "📊" },
  { title: "Integrations", desc: "Works with Google, Zoom, Razorpay, and more.", emoji: "🔗" },
];

export default function FeatureCards() {
  return (
    <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {FEATURES.map((f, i) => (
        <MotionDiv
          key={f.title}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: i * 0.08 }}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <div className="text-2xl leading-none">{f.emoji}</div>
          <div>
            <strong className="mb-1 block text-card-foreground">{f.title}</strong>
            <div className="text-sm text-muted-foreground">{f.desc}</div>
          </div>
        </MotionDiv>
      ))}
    </div>
  );
}
