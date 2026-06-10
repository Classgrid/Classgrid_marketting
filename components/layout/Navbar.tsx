"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n-dictionary";
import { 
  Menu, X, ArrowRight, Bot, ChevronDown, Search,
  School, Building2, GraduationCap, BookOpen, Cpu, User, UserCog,
  ShieldCheck, Sun, Moon, Laptop,
  type LucideIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { normalizeAppHref } from "@/lib/route-maps";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type NavLink = {
  label?: string;
  href?: string;
  description?: string;
  icon?: any;
};

type NavSection = {
  heading?: string;
  links?: NavLink[];
};

type NavItem = {
  label?: string;
  href?: string;
  sections?: NavSection[];
};

type NavbarProps = {
  brandName?: string;
  logoUrl?: string;
  logoAlt?: string;
  menuItems?: NavItem[];
  secondaryLinkLabel?: string;
  secondaryLinkHref?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  mobileMenuTitle?: string;
  latestReleaseDate?: string;
  onAskAiClick?: () => void;
  askAiPrompt?: string;
  showAskAiPrompt?: boolean;
  /** When true, hides CTAs and shows "Search Documentation" button */
  docsMode?: boolean;
  onDocsSearchClick?: () => void;
};

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

/** Rewrite known standalone routes to active destination pages */
function rewriteHref(href?: string | null): string {
  if (!href) return "/";
  const map: Record<string, string> = {
    "/demo": "/#demo",
    "/faq": "/#faq",
    "/integrations": "/#integrations",
  };
  return normalizeAppHref(map[href] ?? href);
}

function resolveCtaHref(label: string, href: string): string {
  return /book\s+a?\s*demo/i.test(label) ? "/#demo" : rewriteHref(href);
}

function comparablePath(href?: string | null): string {
  if (!href) return "";
  const rewrittenHref = rewriteHref(href);
  if (isExternalHref(rewrittenHref)) return "";
  const cleanPath = rewrittenHref.split("#")[0]?.split("?")[0] || "/";
  return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
}

function isHrefActive(pathname: string, href?: string | null): boolean {
  const path = comparablePath(href);
  if (!path) return false;
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (isHrefActive(pathname, item.href)) return true;
  return item.sections?.some((section) =>
    section.links?.some((link) => isHrefActive(pathname, link.href))
  ) ?? false;
}

const ICON_MAP: Record<string, any> = {
  "For Schools": School,
  "For Colleges": Building2,
  "For Jr Colleges": GraduationCap,
  "For Coaching": BookOpen,
  "For Engineering": Cpu,
  "For Students": User,
  "For Teachers": UserCog,
  "For Admins": ShieldCheck,
  "For Institutes": ShieldCheck,  // fallback alias
};

/** Runtime label renames - catches stale Sanity / cached placeholder data */
const LABEL_RENAME: Record<string, { label: string; href: string }> = {
  "For Institutes": { label: "For Admins", href: "/solutions/for-admins" },
};

function normalizeNavItems(items: NavItem[]): NavItem[] {
  return items.map((item) => ({
    ...item,
    sections: item.sections?.map((section) => ({
      ...section,
      links: section.links?.map((link) => {
        const rename = LABEL_RENAME[link.label as string];
        if (rename) return { ...link, label: rename.label, href: rename.href };
        return link;
      }),
    })),
  }));
}

export function Navbar({
  brandName,
  logoUrl,
  logoAlt,
  menuItems,
  secondaryLinkLabel,
  secondaryLinkHref,
  primaryCtaLabel,
  primaryCtaHref,
  latestReleaseDate,
  onAskAiClick,
  askAiPrompt,
  showAskAiPrompt,
  docsMode,
  onDocsSearchClick,
}: NavbarProps) {
  const [showNewBadge, setShowNewBadge] = React.useState(false);
  const [menuValue, setMenuValue] = React.useState("");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});
  const { theme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = React.useState(false);
  React.useEffect(() => { setThemeMounted(true); }, []);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const dict = getDictionary(lang);

  React.useEffect(() => {
    setMenuValue("");
    setMobileOpen(false);
    setOpenSections({});
  }, [pathname]);

  React.useEffect(() => {
    if (!latestReleaseDate) return;

    const lastSeenStr = localStorage.getItem("changelog_last_seen");
    const lastSeenDate = lastSeenStr ? new Date(lastSeenStr).getTime() : 0;
    const releaseTime = new Date(latestReleaseDate).getTime();

    const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
    const isRecent = Date.now() - releaseTime <= tenDaysInMs;
    const isNew = releaseTime > lastSeenDate;

    if (isRecent && isNew) {
      setShowNewBadge(true);
    }
  }, [latestReleaseDate]);

  const handleChangelogClick = () => {
    if (latestReleaseDate) {
      localStorage.setItem("changelog_last_seen", latestReleaseDate);
    }
    setShowNewBadge(false);
  };
  const closeMobileMenu = () => {
    setMobileOpen(false);
    setOpenSections({});
  };
  const megaMenuPanelClass =
    "grid w-[min(92vw,540px)] grid-cols-2 items-start gap-x-2 gap-y-2 rounded-xl border border-white/[0.08] bg-[#080808]/95 p-2.5 shadow-[0_16px_46px_rgba(0,0,0,0.42)] backdrop-blur-xl";
  const desktopNavItemClass =
    "h-9 rounded-lg px-3 text-sm font-medium tracking-tight text-white/85 transition-all duration-200 hover:bg-white/[0.08] hover:text-white focus:bg-white/[0.08] focus:text-white data-open:bg-white/[0.1] data-open:text-white data-popup-open:bg-white/[0.1] data-popup-open:text-white";
  const desktopNavItemActiveClass =
    "bg-white/[0.1] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]";

  const DEFAULT_NAV_ITEMS: NavItem[] = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Solutions",
      sections: [
        {
          heading: "By Institution",
          links: [
            { label: "For Schools",      href: "/solutions/for-schools",      description: "K-12 ERP and LMS combined",            icon: School       },
            { label: "For Colleges",     href: "/solutions/for-colleges",     description: "Scale your campus digitally",           icon: Building2    },
            { label: "For Jr Colleges",  href: "/solutions/for-jr-colleges",  description: "Specialized workflows for juniors",     icon: GraduationCap },
            { label: "For Coaching",     href: "/solutions/for-coaching",     description: "Batch and lead management",             icon: BookOpen     },
            { label: "For Engineering",  href: "/solutions/for-engineering",  description: "Complex curriculum tracking",           icon: Cpu          },
          ],
        },
        {
          heading: "By Role",
          links: [
            { label: "For Students", href: "/solutions/for-students", description: "Learn better and faster",          icon: User    },
            { label: "For Teachers", href: "/solutions/for-teachers", description: "Automate grading & attendance",    icon: UserCog },
            { label: "For Admins",   href: "/solutions/for-admins",   description: "Complete operational oversight",  icon: ShieldCheck },
          ],
        },
      ],
    },

    {
      label: "Pricing",
      href: "/pricing",
    },
  ];

  const parsedItems = Array.isArray(menuItems)
    ? menuItems.filter((item) => {
        const lbl = item?.label?.trim().toLowerCase() ?? "";
        const isProduct = lbl === "product" || lbl === "products";
        return item?.label?.trim() && (item?.href?.trim() || item?.sections?.length) && !isProduct;
      })
    : [];

  const baseItems = normalizeNavItems(parsedItems.length > 0 ? parsedItems : DEFAULT_NAV_ITEMS);

  // Force "Home" to be the very first item if it's missing from the data
  const navItems = baseItems.some(item => item.label?.toLowerCase() === "home")
    ? baseItems
    : [{ label: "Home", href: "/" }, ...baseItems];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.18] bg-[rgba(0,0,0,0.72)] shadow-[0_12px_32px_rgba(0,0,0,0.32)] backdrop-blur-[14px] backdrop-saturate-150 transition-colors duration-300">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {(logoUrl || brandName) && (
            <Link href="/" prefetch={false} className="flex items-center gap-3 group">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoAlt || brandName || ""}
                  width={40}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              ) : null}
              {brandName ? (
                <span className={cn(
                  "text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-white/90",
                  docsMode && "hidden sm:inline"
                )}>
                  {brandName}
                </span>
              ) : null}
            </Link>
          )}

          {navItems.length > 0 ? (
            <div className="hidden md:flex items-center">
              <NavigationMenu value={menuValue} onValueChange={setMenuValue}>
                <NavigationMenuList className="gap-1.5">
                  {navItems.map((item, idx) => {
                    const active = isNavItemActive(pathname, item);
                    const sections = Array.isArray(item.sections)
                      ? item.sections.filter((section) => section?.heading?.trim() || section?.links?.length)
                      : [];
                    const firstSectionLinks = Array.isArray(sections[0]?.links)
                      ? sections[0].links.filter((link) => link?.label?.trim() && link?.href?.trim())
                      : [];
                    const shouldSplitSingleSection = sections.length === 1 && firstSectionLinks.length >= 2;
                    const splitPoint = Math.ceil(firstSectionLinks.length / 2);
                    const splitColumns = shouldSplitSingleSection
                      ? [firstSectionLinks.slice(0, splitPoint), firstSectionLinks.slice(splitPoint)]
                      : [];

                    if (sections.length > 0) {
                      return (
                        <NavigationMenuItem key={`${item.label}-${idx}`}>
                          <NavigationMenuTrigger
                            className={cn(
                              "bg-transparent",
                              desktopNavItemClass,
                              active && desktopNavItemActiveClass
                            )}
                          >
                            {item.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className={megaMenuPanelClass}>
                              {shouldSplitSingleSection ? (
                                <div className="col-span-2">
                                  {sections[0]?.heading?.trim() ? (
                                    <h4 className="text-[13px] font-medium tracking-tight text-white/55">
                                      {sections[0].heading}
                                    </h4>
                                  ) : null}

                                  <div className={cn("grid grid-cols-2 gap-x-2 gap-y-1.5", sections[0]?.heading?.trim() ? "mt-1.5" : "")}>
                                    {splitColumns.map((columnLinks, c_idx) => (
                                      <ul key={`${item.label}-split-col-${c_idx}`} className="grid content-start gap-0.5">
                                        {columnLinks.map((link) => {
                                          const ResolvedIcon = link.icon || ICON_MAP[link.label as string];
                                          return (
                                            <ListItem
                                              key={`${item.label}-split-${link.label}`}
                                              href={link.href as string}
                                              title={link.label as string}
                                              icon={ResolvedIcon}
                                            >
                                              {link.description}
                                            </ListItem>
                                          );
                                        })}
                                      </ul>
                                    ))}
                                  </div>
                                </div>
                              ) : sections.map((section, s_idx) => {
                                const links = Array.isArray(section.links)
                                  ? section.links.filter((link) => link?.label?.trim() && link?.href?.trim())
                                  : [];

                                if (!links.length) return null;

                                return (
                                  <div key={section.heading ? `${section.heading}-${s_idx}` : `${item.label}-${s_idx}`} className="flex flex-col gap-1.5">
                                    {section.heading?.trim() ? (
                                      <h4 className="text-[13px] font-medium tracking-tight text-white/55">
                                        {section.heading}
                                      </h4>
                                    ) : null}
                                    <ul className="grid gap-0.5">
                                      {links.map((link) => {
                                        const ResolvedIcon = link.icon || ICON_MAP[link.label as string];
                                        return (
                                          <ListItem
                                            key={`${item.label}-${section.heading}-${link.label}`}
                                            href={link.href as string}
                                            title={link.label as string}
                                            icon={ResolvedIcon}
                                          >
                                            {link.description}
                                          </ListItem>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                );
                              })}
                            </div>
                          </NavigationMenuContent>
                        </NavigationMenuItem>
                      );
                    }

                    if (!item.href?.trim()) return null;

                    return (
                      <NavigationMenuItem key={`${item.label}-${idx}`}>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent",
                            desktopNavItemClass,
                            active && desktopNavItemActiveClass
                          )}
                          render={
                            <Link
                              href={rewriteHref(item.href)}
                              prefetch={false}
                              target={isExternalHref(item.href) ? "_blank" : undefined}
                              rel={isExternalHref(item.href) ? "noopener noreferrer" : undefined}
                            />
                          }
                        >
                          {item.label}
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    );
                  })}
                </NavigationMenuList>
              </NavigationMenu>

              <Link
                href="/changelog"
                prefetch={false}
                onClick={handleChangelogClick}
                className={cn(
                  "group relative hidden h-9 items-center justify-center rounded-lg px-3.5 text-sm font-medium tracking-tight text-white/85 transition-all duration-200 hover:bg-white/[0.08] hover:text-white focus:bg-white/[0.08] focus:text-white md:inline-flex",
                  isHrefActive(pathname, "/changelog") && desktopNavItemActiveClass
                )}
                aria-label={dict.changelog}
              >
                {dict.changelog}
                {showNewBadge && (
                  <span className="ml-2 flex h-[18px] items-center rounded-full bg-emerald-500/10 px-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 ring-1 ring-inset ring-emerald-500/20 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                    {dict.newBadge}
                  </span>
                )}
              </Link>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2 md:gap-4">

          {typeof onAskAiClick === "function" ? (
            <div className="relative inline-flex">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "relative h-9 rounded-lg border-white/[0.1] bg-white/[0.04] px-2 md:px-3 text-sm font-medium tracking-tight text-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.2] hover:text-white cursor-pointer",
                  showAskAiPrompt ? "border-white/[0.2] shadow-[0_0_14px_rgba(255,255,255,0.06)]" : ""
                )}
                onClick={onAskAiClick}
              >
                <Bot className="mr-2 h-4 w-4 text-white/60" />
                {dict.askAi}
                {showAskAiPrompt ? (
                  <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/50 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white/80 ring-2 ring-black" />
                  </span>
                ) : null}
              </Button>
              {showAskAiPrompt && askAiPrompt ? (
                <span className="pointer-events-none absolute right-full top-1/2 mr-2 hidden max-w-[190px] -translate-y-1/2 whitespace-nowrap rounded-md border border-white/[0.08] bg-black/90 px-2.5 py-1.5 text-[11px] font-medium text-white/85 shadow-lg backdrop-blur-xl lg:inline-flex">
                  {askAiPrompt}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Docs mode: show search button instead of CTAs */}
          {docsMode ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-lg border-white/[0.1] bg-white/[0.04] px-2 md:px-3 text-[13px] font-medium tracking-tight text-white/70 shadow-sm transition-all duration-200 hover:border-white/[0.18] hover:bg-white/[0.08] hover:text-white inline-flex items-center gap-1.5 md:gap-2 cursor-pointer"
              onClick={onDocsSearchClick}
            >
              <Search className="h-3.5 w-3.5 text-white/50" />
              <span className="hidden lg:inline">Search Documentation</span>
              <span className="inline lg:hidden">Search...</span>
              <kbd className="ml-1 hidden sm:inline-flex items-center gap-0.5 rounded-[5px] border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/35 cursor-pointer">
                ⌘K
              </kbd>
            </Button>
          ) : (
            <>
              {secondaryLinkLabel?.trim() && secondaryLinkHref?.trim() ? (
                <Button asChild variant="outline" className="hidden h-9 rounded-lg border-white/[0.12] bg-white/[0.04] px-4 text-[13px] font-medium tracking-tight text-white/90 shadow-sm transition-all duration-200 hover:border-white/[0.2] hover:bg-white/[0.08] hover:text-white lg:inline-flex">
                  <Link
                    href={secondaryLinkHref}
                    prefetch={false}
                    target={isExternalHref(secondaryLinkHref) ? "_blank" : undefined}
                    rel={isExternalHref(secondaryLinkHref) ? "noopener noreferrer" : undefined}
                  >
                    {secondaryLinkLabel}
                  </Link>
                </Button>
              ) : null}

              {primaryCtaLabel?.trim() && primaryCtaHref?.trim() ? (
                <Button asChild className="hidden h-9 rounded-lg px-4 text-xs font-semibold tracking-tight shadow-[0_8px_22px_rgba(16,185,129,0.18)] transition-all duration-200 hover:brightness-110 md:inline-flex">
                  <Link
                    href={resolveCtaHref(primaryCtaLabel, primaryCtaHref)}
                    prefetch={false}
                    target={isExternalHref(primaryCtaHref) ? "_blank" : undefined}
                    rel={isExternalHref(primaryCtaHref) ? "noopener noreferrer" : undefined}
                    onClick={(e) => {
                      const resolvedHref = resolveCtaHref(primaryCtaLabel, primaryCtaHref);
                      if (resolvedHref.startsWith("/#") && window.location.pathname !== "/") {
                        e.preventDefault();
                        window.sessionStorage.setItem("classgrid-scroll-target", resolvedHref.split("#")[1]);
                        window.location.assign("/");
                      }
                    }}
                  >
                    {primaryCtaLabel}
                  </Link>
                </Button>
              ) : null}
            </>
          )}

          <div className="md:hidden">
            {/* Mobile hamburger / close toggle */}
            <button
              id="mobile-nav-toggle"
              type="button"
              suppressHydrationWarning
              aria-label={mobileOpen ? "Close menu" : dict.toggleMenu}
              onClick={() => {
                setMobileOpen((prev) => {
                  if (prev) setOpenSections({});
                  return !prev;
                });
              }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/90 transition-colors duration-200 hover:bg-white/[0.08] hover:text-white"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">{mobileOpen ? "Close menu" : dict.toggleMenu}</span>
            </button>

            {/* Full-screen dropdown overlay — starts below the 64px sticky header */}
            <AnimatePresence>
              {mobileOpen ? (
                <motion.div
                  key="mobile-nav-overlay"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed inset-x-0 top-16 z-40 flex flex-col bg-[#080808] text-white"
                  style={{ height: "calc(100dvh - 64px)" }}
                >


                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
                  {/* Top Action Buttons (Vercel style) */}
                  <div className="mb-8 flex flex-col gap-3">
                    {primaryCtaLabel?.trim() && primaryCtaHref?.trim() && (
                      <Link
                        href={resolveCtaHref(primaryCtaLabel, primaryCtaHref)}
                        onClick={closeMobileMenu}
                        className="flex h-12 w-full items-center justify-center rounded-lg bg-white text-[15px] font-semibold text-black transition-transform active:scale-[0.98]"
                      >
                        {primaryCtaLabel}
                      </Link>
                    )}
                    {secondaryLinkLabel?.trim() && secondaryLinkHref?.trim() && (
                      <Link
                        href={secondaryLinkHref}
                        target={isExternalHref(secondaryLinkHref) ? "_blank" : undefined}
                        rel={isExternalHref(secondaryLinkHref) ? "noopener noreferrer" : undefined}
                        onClick={closeMobileMenu}
                        className="flex h-12 w-full items-center justify-center rounded-lg bg-[#111] border border-white/10 text-[15px] font-medium text-white transition-transform active:scale-[0.98] active:bg-white/5"
                      >
                        {secondaryLinkLabel}
                      </Link>
                    )}
                  </div>

                  <div className="flex flex-col">
                    {/* Explicitly render Home first if it exists */}
                    {navItems.length > 0 && navItems[0].label?.toLowerCase() === "home" && (
                      <Link
                        href={rewriteHref(navItems[0].href)}
                        target={isExternalHref(navItems[0].href || "") ? "_blank" : undefined}
                        rel={isExternalHref(navItems[0].href || "") ? "noopener noreferrer" : undefined}
                        onClick={closeMobileMenu}
                        className={cn(
                          "flex items-center justify-between py-4 text-[17px] font-medium text-white/90 transition-colors active:text-white border-b border-white/10",
                          isNavItemActive(pathname, navItems[0]) && "text-white"
                        )}
                      >
                        {navItems[0].label}
                      </Link>
                    )}

                    {navItems.map((item, idx) => {
                      // Skip Home as it's rendered above
                      if (item.label?.toLowerCase() === "home") return null;

                      const hasSections = (item.sections?.length ?? 0) > 0;
                      const sectionKey = item.label ?? `item-${idx}`;
                      const isOpen = openSections[sectionKey] ?? false;
                      const active = isNavItemActive(pathname, item);
                      const isLast = idx === navItems.length - 1;

                      if (item.href && !hasSections) {
                        return (
                          <Link
                            key={`mobile-${sectionKey}-${idx}`}
                            href={rewriteHref(item.href)}
                            target={isExternalHref(item.href) ? "_blank" : undefined}
                            rel={isExternalHref(item.href) ? "noopener noreferrer" : undefined}
                            onClick={closeMobileMenu}
                            className={cn(
                              "flex items-center justify-between py-4 text-[17px] font-medium text-white/90 transition-colors active:text-white",
                              !isLast && "border-b border-white/10",
                              active && "text-white"
                            )}
                          >
                            {item.label}
                          </Link>
                        );
                      }

                      if (hasSections) {
                        return (
                          <div key={`mobile-${sectionKey}-${idx}`} className={cn("flex flex-col", !isLast && "border-b border-white/10")}>
                            <button
                              type="button"
                              onClick={() => setOpenSections(prev => ({ ...prev, [sectionKey]: !isOpen }))}
                              className={cn(
                                "flex w-full items-center justify-between py-4 text-[17px] font-medium text-white/90 transition-colors active:text-white",
                                active && "text-white"
                              )}
                            >
                              <span>{item.label}</span>
                              <ChevronDown
                                className={cn(
                                  "h-5 w-5 text-white/40 transition-transform duration-300 ease-out",
                                  isOpen && "rotate-180"
                                )}
                              />
                            </button>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden"
                                >
                                  <div className="flex flex-col pb-4 pt-1">
                                    {item.sections?.map(sec =>
                                      sec.links?.map((link, l_idx) => {
                                        const ResolvedIcon = link.icon || ICON_MAP[link.label as string];
                                        return (
                                          <Link
                                            key={`mobile-link-${link.label}-${l_idx}`}
                                            href={rewriteHref(link.href!)}
                                            target={isExternalHref(link.href ?? "") ? "_blank" : undefined}
                                            rel={isExternalHref(link.href ?? "") ? "noopener noreferrer" : undefined}
                                            onClick={closeMobileMenu}
                                            className={cn(
                                              "group flex items-center gap-3 rounded-xl py-2 pl-6 pr-2 text-[14px] font-medium text-white/70 transition-all duration-200 active:bg-white/5 active:text-white",
                                              isHrefActive(pathname, link.href) && "text-white bg-white/5"
                                            )}
                                          >
                                            {ResolvedIcon && (
                                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/60 transition-colors group-active:bg-white/10 group-active:text-white border border-white/5">
                                                <ResolvedIcon className="h-3.5 w-3.5" strokeWidth={2} />
                                              </div>
                                            )}
                                            {link.label}
                                          </Link>
                                        );
                                      })
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                        return null;
                    })}

                    {/* Changelog at the very end to match desktop order */}
                    <Link
                      href="/changelog"
                      onClick={() => {
                        handleChangelogClick();
                        closeMobileMenu();
                      }}
                      className={cn(
                        "flex items-center justify-between py-4 text-[17px] font-medium text-white/90 transition-colors active:text-white",
                        isHrefActive(pathname, "/changelog") && "text-white"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {dict.changelog}
                        {showNewBadge && (
                          <span className="flex h-[18px] items-center rounded-full bg-emerald-500/10 px-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 ring-1 ring-inset ring-emerald-500/20 animate-pulse">
                            {dict.newBadge}
                          </span>
                        )}
                      </div>
                    </Link>
                  </div>
                </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

type ListItemProps = Omit<
  React.ComponentPropsWithoutRef<typeof NavigationMenuLink>,
  "children" | "href" | "render"
> & {
  children?: React.ReactNode;
  href: React.ComponentProps<typeof Link>["href"];
  title: string;
  icon?: LucideIcon;
};

const ListItem = React.forwardRef<React.ElementRef<"a">, ListItemProps>(
  ({ className, title, children, href, icon: Icon, ...props }, ref) => {
    const resolvedHref = typeof href === "string" ? rewriteHref(href) : href;
    const external = typeof resolvedHref === "string" && isExternalHref(resolvedHref);

    return (
      <li>
        <NavigationMenuLink
          ref={ref}
          className={cn(
            "group block select-none rounded-lg p-1.5 leading-none no-underline outline-none transition-colors duration-200 hover:bg-white/[0.04] hover:text-white focus:bg-white/[0.04] focus:text-white",
            className
          )}
          render={
            <Link
              href={resolvedHref}
              prefetch={false}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              onClick={() => {
                // If there's an onClick passed down, trigger it
                if (props.onClick) props.onClick({} as any);
                // Also dispatch a custom event to force Shadcn menu closure if value state isn't enough
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
              }}
            />
          }
          {...props}
        >
          <div className="flex min-h-7 items-center gap-2">
            {Icon && (
              <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border border-white/[0.07] bg-white/[0.025] text-white/50 transition-colors group-hover:border-white/[0.14] group-hover:text-white/75">
                <Icon size={13} strokeWidth={1.6} />
              </div>
            )}
            <div className="flex min-w-0 flex-col">
              <div className="text-[13px] font-medium leading-none tracking-tight text-white/90 transition-colors group-hover:text-white">
                {title}
              </div>
            </div>
          </div>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = "ListItem";
