'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SidebarItem = {
  href: string;
  label: string;
};

type SidebarSection = {
  title: string;
  items: SidebarItem[];
};

export const SIDEBAR_SECTIONS: SidebarSection[] = [
  {
    title: 'Getting Started',
    items: [
      { href: '/docs/introduction', label: 'Introduction' },
      { href: '/docs/quickstart', label: 'Quickstart' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { href: '/docs/api/authentication', label: 'Authentication' },
      { href: '/docs/api/users', label: 'Users' },
    ],
  },
  {
    title: 'Advanced Guides',
    items: [
      { href: '#', label: 'Data Migration' },
      { href: '#', label: 'Webhooks' },
      { href: '#', label: 'Custom Domains' },
    ],
  },
  {
    title: 'Integrations',
    items: [
      { href: '#', label: 'Slack App' },
      { href: '#', label: 'Google Workspace' },
      { href: '#', label: 'Microsoft Teams' },
    ],
  },
  {
    title: 'Security',
    items: [
      { href: '#', label: 'Compliance' },
      { href: '#', label: 'SSO Setup' },
      { href: '#', label: 'Audit Logs' },
    ],
  },
  {
    title: 'Billing',
    items: [
      { href: '#', label: 'Invoices' },
      { href: '#', label: 'Usage Metrics' },
      { href: '#', label: 'Upgrading' },
    ],
  },
];

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-1.5 text-[13px] transition-all duration-150 ${
        isActive
          ? 'bg-emerald-500/[0.1] text-emerald-400 font-medium border-l-2 border-emerald-400'
          : 'text-zinc-400 hover:bg-white/[0.04] hover:text-white/80'
      }`}
    >
      {children}
    </Link>
  );
}

function CollapsibleSection({ section }: { section: SidebarSection }) {
  const pathname = usePathname();
  // Auto-expand if any child is active
  const hasActiveChild = section.items.some((item) => pathname === item.href);
  const [isOpen, setIsOpen] = useState(hasActiveChild || true);

  return (
    <div className="py-3 first:pt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-[12px] font-semibold uppercase tracking-wider text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white"
      >
        <span>{section.title}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-white/30 transition-transform duration-200 ${
            isOpen ? 'rotate-0' : '-rotate-90'
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
              opacity: { duration: 0.2, delay: isOpen ? 0.05 : 0 },
            }}
            className="mt-1 space-y-0.5 overflow-hidden"
          >
            {section.items.map((item, i) => (
              <motion.li
                key={item.href + item.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
              >
                <SidebarLink href={item.href}>{item.label}</SidebarLink>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DocsSidebar({ className }: { className?: string }) {
  return (
    <aside className={className ?? "w-[260px] hidden lg:block h-full pb-8 overflow-y-auto border-r border-white/10 pr-2 custom-scrollbar"}>
      <div className="flex flex-col divide-y divide-white/[0.06] pt-2">
        {SIDEBAR_SECTIONS.map((section) => (
          <CollapsibleSection key={section.title} section={section} />
        ))}
      </div>
    </aside>
  );
}
