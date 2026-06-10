"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Docs navigation order — keep in sync with docs-sidebar.tsx
const DOCS_NAV_ORDER = [
  { slug: "introduction", title: "Introduction", category: "Getting Started" },
  { slug: "quickstart", title: "Quickstart", category: "Getting Started" },
  { slug: "api/authentication", title: "Authentication", category: "API Reference" },
  { slug: "api/users", title: "Users", category: "API Reference" },
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
    <nav className="mt-16 pt-8 border-t border-white/[0.08]">
      <div className="flex items-center justify-between">
        {/* Previous */}
        {prev ? (
          <Link
            href={`/docs/${prev.slug}`}
            className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <div>
              <div className="text-[11px] text-zinc-500 mb-0.5">Previous</div>
              <div className="font-medium">
                {prev.category !== DOCS_NAV_ORDER[currentIndex]?.category && (
                  <span className="text-zinc-500">{prev.category} / </span>
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
            className="group flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white text-right"
          >
            <div>
              <div className="text-[11px] text-zinc-500 mb-0.5">Next</div>
              <div className="font-medium">
                {next.title}
                {next.category !== DOCS_NAV_ORDER[currentIndex]?.category && (
                  <span className="text-zinc-500"> / {next.category}</span>
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
