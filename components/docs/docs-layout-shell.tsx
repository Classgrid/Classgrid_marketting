'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeft, ChevronRight, Menu, FileText, Search } from 'lucide-react';
import { DocsSidebar, SIDEBAR_SECTIONS } from '@/components/docs/docs-sidebar';
import { DocsToc } from '@/components/docs/docs-toc';
import { FeedbackWidget } from '@/components/shared/FeedbackWidget';

// Map slugs to breadcrumb info — keep in sync with docs-sidebar.tsx
const SLUG_TO_BREADCRUMB: Record<string, { category: string; title: string }> = {
  'introduction': { category: 'Getting Started', title: 'Introduction' },
  'quickstart': { category: 'Getting Started', title: 'Quickstart' },
  'api/authentication': { category: 'API Reference', title: 'Authentication' },
  'api/users': { category: 'API Reference', title: 'Users' },
};

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function DocsLayoutShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const pathname = usePathname();

  // Extract breadcrumb from current path
  const currentSlug = pathname?.replace(/^\/docs\/?/, '') || 'introduction';
  const breadcrumb = SLUG_TO_BREADCRUMB[currentSlug];

  useEffect(() => {
    // Close mobile menus on route change
    setMobileMenuOpen(false);
    setMobileTocOpen(false);

    // Fetch headings for mobile TOC
    const timeoutId = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('.docs-content h2, .docs-content h3'));
      const items = elements.map((elem) => ({
        id: elem.id,
        text: elem.textContent || '',
        level: Number(elem.tagName.charAt(1)),
      }));
      setHeadings(items);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── MOBILE NAV BAR (Vercel Style) ── */}
      <div className="lg:hidden sticky top-16 z-40 bg-[#0a0a0a] border-b border-white/10 flex items-center justify-between -mx-4 px-4 sm:-mx-6 sm:px-6 h-12">
        <button 
          onClick={() => { setMobileMenuOpen(!mobileMenuOpen); setMobileTocOpen(false); }} 
          className="flex items-center gap-2 text-[13px] font-medium text-zinc-300 hover:text-white transition-colors"
        >
          <Menu className="w-4 h-4" />
          Menu
        </button>
        
        <button 
          onClick={() => { setMobileTocOpen(!mobileTocOpen); setMobileMenuOpen(false); }} 
          className="flex items-center gap-2 text-[13px] font-medium text-zinc-300 hover:text-white transition-colors"
        >
          On this page
          <FileText className="w-4 h-4" />
        </button>

        {/* ── MOBILE DROPDOWNS ── */}
        
        {/* Backdrop overlay (Vercel style) */}
        <AnimatePresence>
          {(mobileMenuOpen || mobileTocOpen) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => { setMobileMenuOpen(false); setMobileTocOpen(false); }}
              className={`fixed inset-0 z-[60] ${mobileMenuOpen ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'}`}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 left-0 right-0 bg-[#0a0a0a] border-b border-white/10 shadow-xl overflow-y-auto max-h-[calc(100vh-7rem)] px-4 py-4 z-[70]"
            >
              <div className="flex items-center gap-2 mb-2 mt-2 px-2" />
              <div 
                className="flex flex-col mt-2"
                onClick={(e) => {
                  // Auto-close menu when a link is clicked
                  if ((e.target as HTMLElement).closest('a')) {
                    setMobileMenuOpen(false);
                  }
                }}
              >
                <DocsSidebar className="w-full" />
              </div>
            </motion.div>
          )}

          {/* Mobile TOC Dropdown */}
          {mobileTocOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-12 right-4 w-64 bg-[#111111] border border-white/10 rounded-lg shadow-2xl overflow-y-auto max-h-[60vh] py-2 z-[70]"
            >
              <div className="px-4 py-2 mb-1 border-b border-white/5">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">On this page</span>
              </div>
              <div className="flex flex-col mt-2">
                {headings.length > 0 ? headings.map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileTocOpen(false);
                      // Allow state to update and menu to disappear before scrolling
                      setTimeout(() => {
                        const target = document.getElementById(heading.id);
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth' });
                          window.history.pushState(null, '', `#${heading.id}`);
                        }
                      }, 50);
                    }}
                    className={`block px-4 py-1.5 text-[13px] text-zinc-400 hover:text-emerald-400 transition-colors ${heading.level === 3 ? 'pl-8' : ''}`}
                  >
                    {heading.text}
                  </a>
                )) : (
                  <div className="px-4 py-2 text-[13px] text-zinc-500">No headings found</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-8 lg:gap-10 relative items-stretch">

        {/* Collapsible Sidebar (Desktop) */}
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
              className="overflow-hidden shrink-0 hidden lg:block sticky top-16 h-[calc(100vh-4rem)]"
              style={{ minWidth: 0 }}
            >
              <DocsSidebar />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content + Toggle */}
        <main className="flex-1 min-w-0 docs-content pt-4 pb-8">
          {/* Toggle + Breadcrumb row — Vercel style (Desktop) */}
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

          {/* Feedback Widget (Mobile Only) */}
          <div className="xl:hidden mt-16 pt-8 border-t border-white/10 flex justify-center pb-12">
            <FeedbackWidget 
              pageTitle={breadcrumb?.title || 'Documentation'} 
            />
          </div>
        </main>

        {/* Desktop TOC */}
        <DocsToc />
      </div>
    </div>
  );
}
