"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Docs navigation order — keep in sync with docs-sidebar.tsx
const DOCS_NAV_ORDER = [
  { slug: "introduction", title: "Introduction", category: "Getting Started" },
  { slug: "quickstart", title: "Quickstart", category: "Getting Started" },
  { slug: "rbac-login", title: "Login System & RBAC", category: "Platform Guides" },
  { slug: "attendance-system", title: "Attendance System", category: "Platform Guides" },
  { slug: "fees-payment-management", title: "Fees & Payment Management", category: "Platform Guides" },
  { slug: "examinations-results", title: "Examinations & Results", category: "Platform Guides" },
  { slug: "admissions-enrollment", title: "Admissions & Enrollment", category: "Platform Guides" },
  { slug: "academics-classrooms", title: "Academics & Classrooms", category: "Platform Guides" },
  { slug: "communication-messaging", title: "Communication & Messaging", category: "Platform Guides" },
  { slug: "library-management", title: "Library Management", category: "Platform Guides" },
  { slug: "assignments-notes-quizzes", title: "Assignments, Notes & Quizzes", category: "Platform Guides" },
  { slug: "leave-holiday-management", title: "Leave & Holiday Management", category: "Platform Guides" },
  { slug: "support-help-desk", title: "Support & Help Desk", category: "Platform Guides" },
  { slug: "custom-domains", title: "Custom Domains and Subdomains", category: "Admin Setup" },
  { slug: "organization-types", title: "Organization Types, Academic Structure & Terminology", category: "Admin Setup" },
  { slug: "authentication-api", title: "Authentication API", category: "API Reference" },
  { slug: "organization-api", title: "Organization API", category: "API Reference" },
  { slug: "billing-api", title: "Billing API", category: "API Reference" },
  { slug: "students-faculty-api", title: "Students & Faculty API", category: "API Reference" },
  { slug: "attendance-api", title: "Attendance API", category: "API Reference" },
  { slug: "fees-billing-api", title: "Fees & Billing API", category: "API Reference" },
  { slug: "exams-marks-api", title: "Exams & Marks API", category: "API Reference" },
  { slug: "academics-api", title: "Academics API", category: "API Reference" },
  { slug: "communication-api", title: "Communication API", category: "API Reference" },
  { slug: "library-api", title: "Library API", category: "API Reference" },
  { slug: "organization-management-api", title: "Organization Management API", category: "API Reference" }
];

export function DocsNavigation() {
  const pathname = usePathname();
  const currentSlug = pathname?.replace(/^\/docs\/?/, "") || "introduction";

  const currentIndex = DOCS_NAV_ORDER.findIndex((item) => item.slug === currentSlug);
  if (currentIndex === -1) return null;

  const prev = currentIndex > 0 ? DOCS_NAV_ORDER[currentIndex - 1] : null;
  const next = currentIndex < DOCS_NAV_ORDER.length - 1 ? DOCS_NAV_ORDER[currentIndex + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className="mt-16 pt-8 border-t border-white/[0.08] hidden sm:block">
      <div className="flex items-center justify-between">
        {/* Previous */}
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="group flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400 transition-colors hover:text-slate-900 dark:hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-500 mb-0.5">Previous</div>
              <div className="font-medium">
                {prev.category !== DOCS_NAV_ORDER[currentIndex]?.category && (
                  <span className="text-slate-500 dark:text-zinc-500">{prev.category} / </span>
                )}
                {prev.title}
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {/* Next */}
        {next ? (
          <Link
            href={`/docs/${next.slug}`}
            className="group flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-400 transition-colors hover:text-slate-900 dark:hover:text-white text-right"
          >
            <div>
              <div className="text-[11px] text-slate-500 dark:text-zinc-500 mb-0.5">Next</div>
              <div className="font-medium">
                {next.title}
                {next.category !== DOCS_NAV_ORDER[currentIndex]?.category && (
                  <span className="text-slate-500 dark:text-zinc-500"> / {next.category}</span>
                )}
              </div>
            </div>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  );
}
