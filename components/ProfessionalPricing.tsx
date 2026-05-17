"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { moduleMatrix, premiumSection, pricingHeader } from "@/content/siteContent";

const MotionDiv = motion.div as any;

export function ProfessionalPricing() {
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
            {pricingHeader.title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            {pricingHeader.callout}
          </p>
        </MotionDiv>

        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Module</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Coaching</TableHead>
                <TableHead>College (Engineering/Diploma)</TableHead>
                <TableHead>Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moduleMatrix.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                  <TableCell className="text-muted-foreground">{row.school ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-muted-foreground">{row.coaching ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-muted-foreground">{row.engineering ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-muted-foreground">{row.level}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-xl font-semibold text-foreground">{premiumSection.title}</h3>
          <p className="mt-2 text-muted-foreground">{premiumSection.description}</p>
          <ul className="mt-4 grid gap-2 text-sm text-foreground md:grid-cols-2">
            {premiumSection.items.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">{premiumSection.pricingNote}</p>
          <Link
            href={premiumSection.ctaHref}
            className="mt-4 inline-flex rounded-md border border-border px-4 py-2 text-sm text-foreground transition hover:bg-secondary"
          >
            {premiumSection.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
