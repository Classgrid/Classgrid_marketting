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
import { DocsUserButton } from "@/components/docs/DocsUserButton";

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
  /** When true in docsMode, hides Ask AI button (user is logged in) */
  docsUserLoggedIn?: boolean;
  /** When true, hides marketing CTAs (user is a platform subscriber) */
  isPlatformUser?: boolean;
  /** Session loading status from NextAuth */
  sessionStatus?: "loading" | "authenticated" | "unauthenticated";
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
  docsUserLoggedIn,
  isPlatformUser,
  onDocsSearchClick,
  sessionStatus,
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
    "grid w-[min(92vw,540px)] grid-cols-2 items-start gap-x-2 gap-y-2 rounded-xl border border-border bg-popover/95 p-2.5 shadow-[0_16px_46px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_46px_rgba(0,0,0,0.42)] backdrop-blur-xl";
  const desktopNavItemClass =
    "h-9 rounded-lg px-3 text-sm font-medium tracking-tight text-foreground/75 transition-all duration-200 hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground data-open:bg-accent data-open:text-foreground data-popup-open:bg-accent data-popup-open:text-foreground";
  const desktopNavItemActiveClass =
    "bg-accent text-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]";

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
  const normalNavItems = baseItems.some(item => item.label?.toLowerCase() === "home")
    ? baseItems
    : [{ label: "Home", href: "/" }, ...baseItems];

  const docsNavItems: NavItem[] = [
    { label: "Getting Started", href: "/docs" },
    { label: "Platform Guides", href: "/docs/platform" },
    { label: "Admin Setup", href: "/docs/admin" },
    { label: "API Reference", href: "/docs/api" }
  ];

  const navItems = docsMode ? docsNavItems : normalNavItems;

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border bg-[#F7F7F7]/90 dark:bg-[rgba(0,0,0,0.72)] shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.32)] backdrop-blur-[14px] backdrop-saturate-150 transition-colors duration-300">
      <div className="container mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          {(logoUrl || brandName) && (
            docsMode ? (
              /* ── Docs mode: "Classgrid / Docs" (Neon-style) ── */
              <div className="flex items-center gap-0">
                <Link href="/" prefetch={false} className="flex items-center gap-1.5 group shrink-0">
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={logoAlt || brandName || ""}
                      width={32}
                      height={32}
                      className="h-8 w-auto object-contain"
                    />
                  ) : null}
                  {brandName ? (
                    <span className="hidden sm:inline text-[15px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground/80">
                      {brandName}
                    </span>
                  ) : null}
                </Link>
                {/* Slash separator */}
                <span className="mx-2.5 text-[18px] font-light text-border select-none">/</span>
                <Link
                  href="/docs"
                  prefetch={false}
                  className="text-[15px] font-semibold tracking-tight text-muted-foreground hover:text-foreground transition-colors"
                >
                  Docs
                </Link>
              </div>
            ) : (
              <Link href="/" prefetch={false} className="flex items-center gap-1.5 group">
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
                  <span className="text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground/90">
                    {brandName}
                  </span>
                ) : null}
              </Link>
            )
          )}

          {docsMode ? (
            /* ── Docs nav: category links ── */
            <nav className="hidden md:flex items-center gap-0.5">
              {[
                { label: 'Getting Started', href: '/docs/introduction' },
                { label: 'Platform Guides', href: '/docs/attendance-system' },
                { label: 'API Reference',   href: '/docs/authentication-api' },
                { label: 'Changelog',       href: '/changelog' },
              ].map((item) => {
                const isActive = pathname === item.href || (item.href !== '/changelog' && pathname.startsWith('/docs') && pathname.includes(item.href.split('/docs/')[1] || '___'));
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    prefetch={false}
                    className={cn(
                      'h-9 inline-flex items-center rounded-lg px-3 text-sm font-medium tracking-tight transition-all duration-200',
                      'text-foreground/70 hover:bg-accent hover:text-foreground',
                      isActive && 'bg-accent text-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]'
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          ) : (
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
                                    <h4 className="text-[13px] font-medium tracking-tight text-muted-foreground">
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
                                      <h4 className="text-[13px] font-medium tracking-tight text-muted-foreground">
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
                  "group relative hidden h-9 items-center justify-center rounded-lg px-3.5 text-sm font-medium tracking-tight text-foreground/75 transition-all duration-200 hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground md:inline-flex",
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
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">

          {/* Hide all right-side buttons while session is loading to prevent flash */}
          {sessionStatus === "loading" ? (
            <div className="h-9 w-[120px]" /> /* invisible placeholder to prevent layout shift */
          ) : (
            <>
          {/* Ask AI button — hidden in docsMode when user is logged in */}
          {typeof onAskAiClick === "function" && !(docsMode && docsUserLoggedIn) ? (
            <div className="relative inline-flex">
              <Button
                type="button"
                variant="outline"
                className="relative h-9 rounded-lg border-border bg-accent px-2 md:px-3 text-sm font-medium tracking-tight text-foreground/90 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-accent/80 hover:border-border hover:text-foreground cursor-pointer"
                onClick={onAskAiClick}
              >
                {dict.askAi}
              </Button>
            </div>
          ) : null}

          {/* Docs mode: show search button instead of CTAs */}
          {docsMode ? (
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-lg border-border bg-accent px-2 md:px-3 text-[13px] font-medium tracking-tight text-muted-foreground shadow-sm transition-all duration-200 hover:border-border hover:bg-slate-200 dark:hover:bg-accent/80 hover:text-foreground inline-flex items-center gap-1.5 md:gap-2 cursor-pointer"
              onClick={onDocsSearchClick}
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden lg:inline">Search Documentation</span>
              <span className="inline lg:hidden">Search...</span>
              <kbd className="ml-1 hidden sm:inline-flex items-center gap-0.5 rounded-[5px] border border-border bg-accent px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground cursor-pointer">
                ⌘K
              </kbd>
            </Button>
          ) : (
            <>
              {!isPlatformUser && secondaryLinkLabel?.trim() && secondaryLinkHref?.trim() ? (
                <Button asChild variant="outline" className="hidden h-9 rounded-lg border-border bg-accent px-4 text-[13px] font-medium tracking-tight text-foreground/90 shadow-sm transition-all duration-200 hover:border-border hover:bg-accent/80 hover:text-foreground lg:inline-flex">
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

              {!isPlatformUser && primaryCtaLabel?.trim() && primaryCtaHref?.trim() ? (
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

          {/* Always show the user button if they are a platform user (on any page) OR if they are viewing the docs (where it acts as the Sign Up / Login button) */}
          {(isPlatformUser || docsMode) && <DocsUserButton />}
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground/90 transition-colors duration-200 hover:bg-accent hover:text-foreground"
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
                  className="fixed inset-x-0 top-16 z-40 flex flex-col bg-background text-foreground"
                  style={{ height: "calc(100dvh - 64px)" }}
                >
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6">
                  {docsMode ? (
                    /* ── Docs mobile menu ── */
                    <div className="flex flex-col">
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Documentation</p>
                      {[
                        { label: 'Getting Started', href: '/docs/introduction' },
                        { label: 'Platform Guides', href: '/docs/login-pages' },
                        { label: 'API Reference',   href: '/docs/api-reference' },
                        { label: 'Changelog',       href: '/changelog' },
                      ].map((item, idx, arr) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className={cn(
                            'flex items-center justify-between py-4 text-[17px] font-medium text-foreground/90 transition-colors active:text-foreground',
                            idx < arr.length - 1 && 'border-b border-border',
                            pathname === item.href && 'text-foreground'
                          )}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                  <>
                  {/* Top Action Buttons (Vercel style) */}
                  <div className="mb-8 flex flex-col gap-3">
                    {!isPlatformUser && primaryCtaLabel?.trim() && primaryCtaHref?.trim() && (
                      <Link
                        href={resolveCtaHref(primaryCtaLabel, primaryCtaHref)}
                        onClick={closeMobileMenu}
                        className="flex h-12 w-full items-center justify-center rounded-lg bg-foreground text-[15px] font-semibold text-background transition-transform active:scale-[0.98]"
                      >
                        {primaryCtaLabel}
                      </Link>
                    )}
                    {!isPlatformUser && secondaryLinkLabel?.trim() && secondaryLinkHref?.trim() && (
                      <Link
                        href={secondaryLinkHref}
                        target={isExternalHref(secondaryLinkHref) ? "_blank" : undefined}
                        rel={isExternalHref(secondaryLinkHref) ? "noopener noreferrer" : undefined}
                        onClick={closeMobileMenu}
                        className="flex h-12 w-full items-center justify-center rounded-lg bg-accent border border-border text-[15px] font-medium text-foreground transition-transform active:scale-[0.98] active:bg-accent/80"
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
                          "flex items-center justify-between py-4 text-[17px] font-medium text-foreground/90 transition-colors active:text-foreground border-b border-border",
                          isNavItemActive(pathname, navItems[0]) && "text-foreground"
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
                              "flex items-center justify-between py-4 text-[17px] font-medium text-foreground/90 transition-colors active:text-foreground",
                              !isLast && "border-b border-border",
                              active && "text-foreground"
                            )}
                          >
                            {item.label}
                          </Link>
                        );
                      }

                      if (hasSections) {
                        return (
                          <div key={`mobile-${sectionKey}-${idx}`} className={cn("flex flex-col", !isLast && "border-b border-border")}>
                            <button
                              type="button"
                              onClick={() => setOpenSections(prev => ({ ...prev, [sectionKey]: !isOpen }))}
                              className={cn(
                                "flex w-full items-center justify-between py-4 text-[17px] font-medium text-foreground/90 transition-colors active:text-foreground",
                                active && "text-foreground"
                              )}
                            >
                              <span>{item.label}</span>
                              <ChevronDown
                                className={cn(
                                  "h-5 w-5 text-muted-foreground transition-transform duration-300 ease-out",
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
                                              "group flex items-center gap-3 rounded-xl py-2 pl-6 pr-2 text-[14px] font-medium text-muted-foreground transition-all duration-200 active:bg-accent active:text-foreground",
                                              isHrefActive(pathname, link.href) && "text-foreground bg-accent"
                                            )}
                                          >
                                            {ResolvedIcon && (
                                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-muted-foreground transition-colors group-active:bg-accent/80 group-active:text-foreground border border-border">
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
                        "flex items-center justify-between py-4 text-[17px] font-medium text-foreground/90 transition-colors active:text-foreground",
                        isHrefActive(pathname, "/changelog") && "text-foreground"
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
                  </>
                  )}
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
            "group block select-none rounded-lg p-1.5 leading-none no-underline outline-none transition-colors duration-200 hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground",
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
              <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md border border-border bg-accent text-muted-foreground transition-colors group-hover:border-border group-hover:text-foreground/75">
                <Icon size={13} strokeWidth={1.6} />
              </div>
            )}
            <div className="flex min-w-0 flex-col">
              <div className="text-[13px] font-medium leading-none tracking-tight text-foreground/90 transition-colors group-hover:text-foreground">
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
