import Link from "next/link";

import { ThemeModeSwitcher } from "@/components/layout/ThemeModeSwitcher";

const productLinks = [
  { label: "Features", href: "/features" },
  { label: "Pricing", href: "/pricing" },
  { label: "Integrations", href: "/integrations" },
  { label: "Changelog", href: "/changelog" },
];

const useCaseLinks = [
  { label: "For Schools", href: "/#use-cases" },
  { label: "For Degree Colleges", href: "/#use-cases" },
  { label: "For Junior Colleges", href: "/#use-cases" },
  { label: "For Coaching", href: "/#use-cases" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact / Support", href: "/contact" },
  { label: "Partner with Us", href: "/contact" },
];

const legalLinks = [
  { label: "Security / Trust Center", href: "/security" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookie" },
  { label: "LinkedIn", href: "https://www.linkedin.com", external: true },
  { label: "YouTube", href: "https://www.youtube.com", external: true },
  { label: "X", href: "https://x.com", external: true },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-heading text-xl font-bold text-white">Classgrid</p>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            The all-in-one educational operating system for admissions, academics, finance, communication, and
            analytics.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-slate-100 uppercase">Product</p>
            <ul className="space-y-2 text-sm text-slate-300">
              {productLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-slate-100 uppercase">Use Cases</p>
            <ul className="space-y-2 text-sm text-slate-300">
              {useCaseLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-slate-100 uppercase">Company</p>
            <ul className="space-y-2 text-sm text-slate-300">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.12em] text-slate-100 uppercase">Legal & Social</p>
            <ul className="space-y-2 text-sm text-slate-300">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="transition hover:text-white"
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="inline-flex size-2.5 rounded-sm bg-emerald-300 shadow-[0_0_8px_rgba(110,231,183,0.7)]" />
            ALL SYSTEMS NORMAL.
          </div>
          <ThemeModeSwitcher />
        </div>
      </div>
    </footer>
  );
}
