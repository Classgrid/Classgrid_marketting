"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

import { normalizeAppHref } from "@/lib/route-maps";
import { LanguageSelector } from "@/components/ui/language-selector";
import {
  fetchLiveStatus,
  getFooterStatusDotClass,
  getFooterStatusTextClass,
  getFooterStatusLabel,
  resolveFooterCopyrightText,
  type FooterStatusState,
} from "@/lib/footer-status";
import { useSearchParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n-dictionary";

// ─── Types ───────────────────────────────────────────────────────────────────
type FooterLink = { label?: string; href?: string; isNew?: boolean };
type FooterColumn = { heading?: string; links?: FooterLink[] };
type SocialLink = { platform?: string; href?: string };

type FooterProps = {
  brandName?: string;
  brandTagline?: string;
  logoUrl?: string;
  logoAlt?: string;
  columns?: FooterColumn[];
  contactHeading?: string;
  addressLines?: string[];
  mapHref?: string;
  phoneNumbers?: string[];
  emailAddresses?: string[];
  legalLinks?: FooterLink[];
  socialLinks?: SocialLink[];
  copyrightText?: string;
  statusLabel?: string;
  statusState?: FooterStatusState;
  statusHref?: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isExternal(href: string) { return /^https?:\/\//i.test(href); }

function rewriteHref(href: string): string {
  const map: Record<string, string> = {
    "/demo": "/#demo",
    "/faq": "/#faq",
    "/integrations": "/#integrations",
  };
  return normalizeAppHref(map[href] ?? href);
}

function resolveHref(label: string, href: string): string {
  return /book\s+a?\s*demo/i.test(label) ? "/#demo" : rewriteHref(href);
}

// ─── Component ───────────────────────────────────────────────────────────────
export function Footer({
  brandName,
  // logoUrl / logoAlt / brandTagline are intentionally ignored
  columns,
  contactHeading,
  addressLines,
  mapHref,
  phoneNumbers,
  emailAddresses,
  legalLinks,
  socialLinks,
  copyrightText,
  statusLabel,
  statusState,
  statusHref,
}: FooterProps) {
  const [mounted, setMounted] = useState(false);
  const [liveStatus, setLiveStatus] = useState<{ state: FooterStatusState; label: string } | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch live status from custom domain (Incident.io / Statuspage compatible)
    fetchLiveStatus("status.classgrid.in").then((res) => {
      if (res) setLiveStatus(res);
    });
  }, []);

  let footerColumns = (Array.isArray(columns) ? [...columns] : [])
    .filter((c) => c?.heading?.trim() || c?.links?.length);

  // Auto-inject new pages without breaking the grid count
  const injectedLinks = [
    { label: 'Our Team', href: '/team' },
    { label: 'Acknowledgements', href: '/acknowledgement' },
    { label: 'Compare', href: '/compare' },
    { label: 'Careers', href: '/careers' }
  ];

  // Try to find a "Company" or "About" column, or just use the first column
  const targetColIndex = footerColumns.findIndex(c =>
    c?.heading?.toLowerCase().includes('company') ||
    c?.heading?.toLowerCase().includes('about')
  );

  if (targetColIndex !== -1) {
    footerColumns[targetColIndex] = {
      ...footerColumns[targetColIndex],
      links: [
        ...(footerColumns[targetColIndex].links || []).filter(l => l.label?.toLowerCase() !== 'security'), // Remove Security duplicate
        ...injectedLinks
      ]
    };
  } else if (footerColumns.length > 0) {
    footerColumns[0] = {
      ...footerColumns[0],
      links: [
        ...(footerColumns[0].links || []).filter(l => l.label?.toLowerCase() !== 'security'), // Remove Security duplicate
        ...injectedLinks
      ]
    };
  }

  // Inject Documentation link into Resources column
  const resourcesColIndex = footerColumns.findIndex(c =>
    c?.heading?.toLowerCase().includes('resources') ||
    c?.heading?.toLowerCase().includes('resource')
  );

  if (resourcesColIndex !== -1) {
    const hasDocs = footerColumns[resourcesColIndex].links?.some(l => l.href === '/docs');
    if (!hasDocs) {
      footerColumns[resourcesColIndex] = {
        ...footerColumns[resourcesColIndex],
        links: [
          ...(footerColumns[resourcesColIndex].links || []),
          { label: 'Docs', href: '/docs', isNew: true }
        ]
      };
    }
  }

  // Force 'NEW' badge on Community/Forum links since Discourse just launched
  footerColumns.forEach(col => {
    if (col.links) {
      col.links.forEach(l => {
        if (l.label && (/community/i.test(l.label) || /forum/i.test(l.label))) {
          l.isNew = true;
        }
      });
    }
  });

  const legalItems = (Array.isArray(legalLinks) ? legalLinks : [])
    .filter((l) => l?.label?.trim() && l?.href?.trim());

  const socialItems = (Array.isArray(socialLinks) ? socialLinks : [])
    .filter((l) => l?.platform?.trim() && l?.href?.trim());

  const address = (Array.isArray(addressLines) ? addressLines : []).filter(Boolean);
  const phones = (Array.isArray(phoneNumbers) ? phoneNumbers : []).filter(Boolean);
  const emails = (Array.isArray(emailAddresses) ? emailAddresses : []).filter(Boolean);
  const hasContact = contactHeading?.trim() || address.length > 0 || phones.length > 0 || emails.length > 0;

  const resolvedCopyrightText = resolveFooterCopyrightText(copyrightText, brandName);
  const resolvedStatusHref = statusHref?.trim();

  // "Automatic" Logic:
  // 1. If state is "automatic", always use liveStatus if available.
  // 2. If state is NOT "automatic", use liveStatus only if Sanity label is empty.
  // 3. If Sanity label has text, it acts as a manual override.
  const isAutomatic = statusState === 'automatic';
  const hasManualLabel = !!statusLabel?.trim();

  const finalStatusState = (isAutomatic || !hasManualLabel)
    ? (liveStatus?.state ?? (isAutomatic ? 'operational' : statusState))
    : statusState;

  const finalStatusLabel = (isAutomatic || !hasManualLabel)
    ? (liveStatus?.label ?? getFooterStatusLabel(statusState, statusLabel))
    : statusLabel;

  const statusDotClass = getFooterStatusDotClass(finalStatusState);
  const statusTextClass = getFooterStatusTextClass(finalStatusState);

  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const dict = getDictionary(lang);

  return (
    <footer className="w-full border-t border-border/40 bg-[#eef0f3] dark:bg-black">

      {/* ══════════════════════════════════════
          SECTION 1 — 3-Column Link Grid
          grid-cols-3  gap-12  py-16
      ══════════════════════════════════════ */}
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">

          {/* CMS columns (Quick Links, Resources…) */}
          {footerColumns.map((column) => {
            const links = (Array.isArray(column.links) ? column.links : [])
              .filter((l) => l?.label?.trim() && l?.href?.trim());
            if (!column.heading?.trim() && !links.length) return null;
            return (
              <div key={column.heading || links.map((l) => l.label).join("-")}>
                {column.heading?.trim() && (
                  <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
                    {column.heading}
                  </h4>
                )}
                <ul className="space-y-[10px]">
                  {links.map((link) => (
                    <li key={`${column.heading}-${link.label}`} className="flex items-center gap-2">
                      <Link
                        href={resolveHref(link.label!, link.href!)}
                        prefetch={false}
                        target={isExternal(link.href!) ? "_blank" : undefined}
                        rel={isExternal(link.href!) ? "noopener noreferrer" : undefined}
                        className="text-sm text-slate-500 dark:text-zinc-400 transition-colors hover:text-emerald-500 dark:hover:text-emerald-500"
                      >
                        {link.label}
                      </Link>
                      {link.isNew && (
                        <span className="rounded-md border border-emerald-400/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-500">
                          NEW
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Get in Touch column */}
          {hasContact && (
            <div>
              {contactHeading?.trim() && (
                <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
                  {contactHeading}
                </h4>
              )}
              <div className="space-y-[10px] text-sm text-slate-500 dark:text-zinc-400">
                {address.length > 0 && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-50" />
                    {mapHref?.trim() ? (
                      <a href={mapHref} target="_blank" rel="noopener noreferrer"
                        className="leading-relaxed transition-colors hover:text-emerald-500">
                        {address.map((line) => (
                          <React.Fragment key={line}>{line}<br /></React.Fragment>
                        ))}
                      </a>
                    ) : (
                      <div className="leading-relaxed">
                        {address.map((line) => <div key={line}>{line}</div>)}
                      </div>
                    )}
                  </div>
                )}
                {phones.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-2 transition-colors hover:text-emerald-500">
                    <Phone className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    <span>{phone}</span>
                  </a>
                ))}
                {emails.map((email) => (
                  <a key={email} href={`mailto:${email}`}
                    className="flex items-center gap-2 transition-colors hover:text-emerald-500">
                    <Mail className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    <span>{email}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Social Presence Column ── */}
          {socialItems.length > 0 && (
            <div>
              <h4 className="mb-5 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
                {dict.socialPresence}
              </h4>
              <p className="mb-4 text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                {dict.socialPresenceDesc}
              </p>
              <div className="flex items-center gap-2.5">
                {socialItems.map((link) => {
                  const p = (link.platform || "").toLowerCase();
                  const iconMap: Record<string, React.ReactNode> = {
                    linkedin: <Linkedin className="h-4 w-4" />,
                    facebook: <Facebook className="h-4 w-4" />,
                    instagram: <Instagram className="h-4 w-4" />,
                    youtube: <Youtube className="h-4 w-4" />,
                    x: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.038 9.188L24 22.847h-7.406l-5.8-7.584-6.638 7.584H.474l8.596-9.822L0 1.154h7.594l5.243 6.932zM17.607 20.644h2.039L6.486 3.24H4.298z" /></svg>,
                    twitter: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.038 9.188L24 22.847h-7.406l-5.8-7.584-6.638 7.584H.474l8.596-9.822L0 1.154h7.594l5.243 6.932zM17.607 20.644h2.039L6.486 3.24H4.298z" /></svg>,
                  };
                  const icon = iconMap[p];
                  if (!icon) return null;
                  return (
                    <a
                      key={`${link.platform}-${link.href}`}
                      href={link.href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-slate-500 dark:text-zinc-400 transition-all duration-200 hover:border-emerald-500 hover:text-emerald-500 dark:hover:text-emerald-500 dark:hover:border-emerald-500 hover:scale-105"
                    >
                      {icon}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 2 — Row 1: Copyright + Legal
          LEFT: © …   RIGHT: Privacy | Terms …
      ══════════════════════════════════════ */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 md:px-10">
          <div className="flex flex-col items-start justify-between gap-3 text-[12px] text-slate-500 dark:text-zinc-400 sm:flex-row sm:items-center">

            {/* LEFT — copyright */}
            <span>{resolvedCopyrightText}</span>

            {/* RIGHT — legal links */}
            {legalItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {legalItems.map((link, idx) => {
                  const isSitemap = link.label?.toLowerCase() === 'sitemap';
                  return (
                    <React.Fragment key={link.label}>
                      <Link
                        href={link.href!}
                        prefetch={false}
                        target={isExternal(link.href!) ? "_blank" : undefined}
                        rel={isExternal(link.href!) ? "nofollow noopener noreferrer" : (isSitemap ? undefined : "nofollow")}
                        className={`whitespace-nowrap transition-colors hover:text-emerald-500 ${isSitemap ? "hidden sm:inline" : ""}`}
                      >
                        {link.label}
                      </Link>
                      {idx < legalItems.length - 1 && (
                        <span className={`select-none text-border ${isSitemap ? "hidden sm:inline" : ""}`}>|</span>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SECTION 3 — Row 2: Status + Controls
          LEFT: ● All systems normal
          RIGHT: 🌐 Language   ☀️🌙💻 Theme
      ══════════════════════════════════════ */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 md:px-10">
          <div className="flex items-center justify-between gap-4">

            {/* LEFT — status */}
            <div className={`text-[13px] min-w-[200px] font-medium tracking-wide ${statusTextClass}`}>
              <span className="flex items-center gap-2">
                <span className={`h-2 w-2 animate-pulse rounded-full ${statusDotClass}`} />
                {!liveStatus && !statusLabel ? (
                  // Skeleton placeholder — same approximate width as the real label.
                  // Prevents layout shift when the fetch resolves.
                  <span className={`inline-block h-3.5 w-40 animate-pulse rounded ${statusDotClass} opacity-20`} />
                ) : resolvedStatusHref ? (
                  <Link
                    href={resolvedStatusHref}
                    prefetch={false}
                    target={isExternal(resolvedStatusHref) ? "_blank" : undefined}
                    rel={isExternal(resolvedStatusHref) ? "noopener noreferrer" : undefined}
                    className="transition-opacity hover:opacity-80 capitalize"
                  >
                    {finalStatusLabel.toLowerCase()}
                  </Link>
                ) : (
                  <span className="capitalize">{finalStatusLabel.toLowerCase()}</span>
                )}
              </span>
            </div>

            {/* RIGHT — language only (dark mode only site) */}
            {mounted ? (
              <div className="flex items-center gap-2.5">
                <LanguageSelector />
              </div>
            ) : <div />}

          </div>
        </div>
      </div>

    </footer>
  );
}
