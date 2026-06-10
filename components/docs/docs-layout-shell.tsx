'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeft, ChevronRight } from 'lucide-react';
import { DocsSidebar } from '@/components/docs/docs-sidebar';
import { DocsToc } from '@/components/docs/docs-toc';

// Map slugs to breadcrumb info — keep in sync with docs-sidebar.tsx
const SLUG_TO_BREADCRUMB: Record<string, { category: string; title: string }> = {
  'introduction': { category: 'Getting Started', title: 'Introduction' },
  'quickstart': { category: 'Getting Started', title: 'Quickstart' },
  'api/authentication': { category: 'API Reference', title: 'Authentication' },
  'api/users': { category: 'API Reference', title: 'Users' },
};

export function DocsLayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Extract breadcrumb from current path
  const currentSlug = pathname?.replace(/^\/docs\/?/, '') || 'introduction';
  const breadcrumb = SLUG_TO_BREADCRUMB[currentSlug];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex gap-8 lg:gap-10 relative items-stretch">

        {/* Collapsible Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              key="docs-sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{
                width: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                opacity: { duration: 0.2 },
              }}
              className="overflow-hidden shrink-0 sticky top-[4.5rem] h-[calc(100vh-4.5rem)]"
              style={{ minWidth: 0 }}
            >
              <DocsSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content + Toggle */}
        <main className="flex-1 min-w-0 docs-content pt-4 pb-8">
          {/* Toggle + Breadcrumb row — Vercel style */}
          <div className="mb-6 hidden lg:flex items-center gap-3">
            {/* Sidebar toggle button */}
            <motion.button
              type="button"
              onClick={() => setSidebarOpen((o) => !o)}
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.07)" }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.15 }}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/70 hover:text-white shrink-0"
              aria-label="Toggle sidebar"
            >
              <motion.span
                animate={{ rotate: sidebarOpen ? 0 : 180 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex items-center"
              >
                <PanelLeft className="h-4 w-4" />
              </motion.span>
            </motion.button>

            {/* Breadcrumb */}
            {breadcrumb && (
              <nav className="flex items-center gap-1.5 text-[13px] text-zinc-400">
                <Link
                  href="/docs"
                  className="hover:text-white transition-colors"
                >
                  {breadcrumb.category}
                </Link>
                <ChevronRight className="h-3 w-3 text-zinc-600" />
                <span className="font-medium text-white">{breadcrumb.title}</span>
              </nav>
            )}
          </div>

          {children}
        </main>

        <DocsToc />
      </div>
    </div>
  );
}
