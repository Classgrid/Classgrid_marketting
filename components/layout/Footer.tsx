"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

import { normalizeAppHref } from "@/lib/route-maps";
import { LanguageSelector } from "@/components/ui/language-selector";
import {
  fetchLiveStatus,
  getFooterStatusDotClass,
  getFooterStatusLabel,
  resolveFooterCopyrightText,
  type FooterStatusState,
} from "@/lib/footer-status";
import { useSearchParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n-dictionary";

// ─── Types ───────────────────────────────────────────────────────────────────
type FooterLink   = { label?: string; href?: string };
type FooterColumn = { heading?: string; links?: FooterLink[] };
type SocialLink   = { platform?: string; href?: string };

type FooterProps = {
  brandName?:      string;
  brandTagline?:   string;
  logoUrl?:        string;
  logoAlt?:        string;
  columns?:        FooterColumn[];
  contactHeading?: string;
  addressLines?:   string[];
  mapHref?:        string;
  phoneNumbers?:   string[];
  emailAddresses?: string[];
  legalLinks?:     FooterLink[];
  socialLinks?:    SocialLink[];
  copyrightText?:  string;
  statusLabel?:    string;
  statusState?:    FooterStatusState;
  statusHref?:     string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function isExternal(href: string) { return /^https?:\/\//i.test(href); }

function rewriteHref(href: string): string {
  const map: Record<string, string> = {
    "/demo": "/#demo",
    "/faq":  "/#faq",
    "/integrations": "/#integrations",
  };
  return normalizeAppHref(map[href] ?? href);
}

function resolveHref(label: string, href: string): string {
  if (/community/i.test(label) || /forum/i.test(label)) return "/community";
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
    // Fetch live status from Atlassian Statuspage (ID from your documentation)
    fetchLiveStatus("hkhhnlgjq7z6").then((res) => {
      if (res) setLiveStatus(res);
    });
  }, []);

  let footerColumns = (Array.isArray(columns) ? [...columns] : [])
    .filter((c) => c?.heading?.trim() || c?.links?.length);

  // Auto-inject new pages without breaking the grid count
  const injectedLinks = [
    { label: 'Our Team', href: '/team' },
    { label: 'Acknowledgements', href: '/acknowledgement' },
    { label: 'Compare', href: '/compare' } // Added Compare here!
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

  const legalItems = (Array.isArray(legalLinks) ? legalLinks : [])
    .filter((l) => l?.label?.trim() && l?.href?.trim());

  const socialItems = (Array.isArray(socialLinks) ? socialLinks : [])
    .filter((l) => l?.platform?.trim() && l?.href?.trim());

  const address = (Array.isArray(addressLines)   ? addressLines   : []).filter(Boolean);
  const phones  = (Array.isArray(phoneNumbers)   ? phoneNumbers   : []).filter(Boolean);
  const emails  = (Array.isArray(emailAddresses) ? emailAddresses : []).filter(Boolean);
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
                    <li key={`${column.heading}-${link.label}`}>
                      <Link
                        href={resolveHref(link.label!, link.href!)}
                        prefetch={false}
                        target={isExternal(link.href!) ? "_blank" : undefined}
                        rel={isExternal(link.href!) ? "noopener noreferrer" : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-emerald-500"
                      >
                        {link.label}
                      </Link>
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
              <div className="space-y-[10px] text-sm text-muted-foreground">
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
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                {dict.socialPresenceDesc}
              </p>
              <div className="flex items-center gap-2.5">
                {socialItems.map((link) => {
                  const p = (link.platform || "").toLowerCase();
                  const iconMap: Record<string, React.ReactNode> = {
                    linkedin:  <Linkedin  className="h-4 w-4" />,
                    facebook:  <Facebook  className="h-4 w-4" />,
                    instagram: <Instagram className="h-4 w-4" />,
                    youtube:   <Youtube   className="h-4 w-4" />,
                    x:         <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.038 9.188L24 22.847h-7.406l-5.8-7.584-6.638 7.584H.474l8.596-9.822L0 1.154h7.594l5.243 6.932zM17.607 20.644h2.039L6.486 3.24H4.298z" /></svg>,
                    twitter:   <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.038 9.188L24 22.847h-7.406l-5.8-7.584-6.638 7.584H.474l8.596-9.822L0 1.154h7.594l5.243 6.932zM17.607 20.644h2.039L6.486 3.24H4.298z" /></svg>,
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
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-emerald-500 hover:text-emerald-500 hover:scale-105"
                    >
                      {icon}
                    </a>
                  );
                })}
              </div>

              {/* ── Google Play Badge ── */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get ClassGrid on Google Play"
                className="mt-5 inline-flex items-center gap-3 rounded-xl border border-border bg-black px-4 py-2.5 transition-colors duration-200 hover:border-emerald-500/50 dark:bg-white/5"
              >
                {/* Colorful Google Play triangle */}
                <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="gp-a" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00C3FF" />
                      <stop offset="100%" stopColor="#1976D2" />
                    </linearGradient>
                    <linearGradient id="gp-b" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFD740" />
                      <stop offset="100%" stopColor="#FF8F00" />
                    </linearGradient>
                    <linearGradient id="gp-c" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F44336" />
                      <stop offset="100%" stopColor="#B71C1C" />
                    </linearGradient>
                    <linearGradient id="gp-d" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00E676" />
                      <stop offset="100%" stopColor="#00796B" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#gp-a)" d="M3.18 23.76A2 2 0 0 1 2 22V2A2 2 0 0 1 3.18.24L13.9 11 3.18 23.76z" />
                  <path fill="url(#gp-b)" d="M17.5 14.5 5.5 21.8l-.32.18 9.44-10.42L17.5 14.5z" />
                  <path fill="url(#gp-c)" d="M21.25 10.7c.5.28.75.65.75 1.3s-.25 1.02-.75 1.3L18 15l-3.38-3.56L18 8l3.25 2.7z" />
                  <path fill="url(#gp-d)" d="M5.18 2.02 17.5 9.5l-2.88 2.94L5.18 2.02z" />
                </svg>
                <div className="flex flex-col leading-none">
                  <span className="text-[9px] font-medium tracking-wide text-white/50 uppercase">Get it on</span>
                  <span className="text-[13px] font-semibold text-white">Google Play</span>
                </div>
              </a>
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
          <div className="flex flex-col items-start justify-between gap-3 text-[12px] text-muted-foreground sm:flex-row sm:items-center">

            {/* LEFT — copyright */}
            <span>{resolvedCopyrightText}</span>

            {/* RIGHT — legal links */}
            {legalItems.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {legalItems.map((link, idx) => (
                  <React.Fragment key={link.label}>
                    <Link
                      href={link.href!}
                      prefetch={false}
                      target={isExternal(link.href!) ? "_blank" : undefined}
                      rel={isExternal(link.href!) ? "noopener noreferrer" : undefined}
                      className="whitespace-nowrap transition-colors hover:text-emerald-500"
                    >
                      {link.label}
                    </Link>
                    {idx < legalItems.length - 1 && (
                      <span className="select-none text-border">|</span>
                    )}
                  </React.Fragment>
                ))}
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
            <div className="text-[12px] text-muted-foreground min-w-[200px]">
              <span className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${statusDotClass}`} />
                {!liveStatus && !statusLabel ? (
                  // Skeleton placeholder — same approximate width as the real label.
                  // Prevents layout shift when the fetch resolves.
                  <span className="inline-block h-3 w-36 animate-pulse rounded bg-muted-foreground/20" />
                ) : resolvedStatusHref ? (
                  <Link
                    href={resolvedStatusHref}
                    prefetch={false}
                    target={isExternal(resolvedStatusHref) ? "_blank" : undefined}
                    rel={isExternal(resolvedStatusHref) ? "noopener noreferrer" : undefined}
                    className="transition-colors hover:text-emerald-500"
                  >
                    {finalStatusLabel}
                  </Link>
                ) : (
                  <span>{finalStatusLabel}</span>
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
