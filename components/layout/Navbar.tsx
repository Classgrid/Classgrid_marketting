"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { getDictionary } from "@/lib/i18n-dictionary";
import { 
  Menu, X, ArrowRight, Bot, Target, Code2, 
  School, Building2, GraduationCap, BookOpen, Cpu, User, UserCog, Building,
  ArrowRightLeft, ShieldCheck,
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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { normalizeAppHref } from "@/lib/route-maps";
import { cn } from "@/lib/utils";

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

/** Runtime label renames — catches stale Sanity / cached placeholder data */
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
  mobileMenuTitle,
  latestReleaseDate,
  onAskAiClick,
  askAiPrompt,
  showAskAiPrompt,
}: NavbarProps) {
  const [showNewBadge, setShowNewBadge] = React.useState(false);
  const [menuValue, setMenuValue] = React.useState("");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang");
  const dict = getDictionary(lang);

  React.useEffect(() => {
    setMenuValue("");
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
  const megaMenuPanelClass =
    "grid w-[680px] min-h-[340px] grid-cols-2 gap-6 rounded-xl border border-border bg-popover p-6 shadow-2xl";

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-[#eef0f3]/80 dark:bg-black/70 backdrop-blur-md transition-colors duration-300">
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
                <span className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:opacity-80">
                  {brandName}
                </span>
              ) : null}
            </Link>
          )}

          {navItems.length > 0 ? (
            <div className="hidden md:flex items-center">
              <NavigationMenu value={menuValue} onValueChange={setMenuValue}>
                <NavigationMenuList>
                  {navItems.map((item, idx) => {
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
                          <NavigationMenuTrigger className="bg-transparent text-sm font-normal text-muted-foreground/80 transition-colors hover:bg-accent hover:text-foreground focus:bg-transparent data-[state=open]:bg-transparent">
                            {item.label}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className={megaMenuPanelClass}>
                              {shouldSplitSingleSection ? (
                                <div className="col-span-2">
                                  {sections[0]?.heading?.trim() ? (
                                    <h4 className="text-[13px] font-medium text-muted-foreground">
                                      {sections[0].heading}
                                    </h4>
                                  ) : null}

                                  <div className={cn("grid grid-cols-2 gap-x-12 gap-y-6", sections[0]?.heading?.trim() ? "mt-4" : "")}>
                                    {splitColumns.map((columnLinks, c_idx) => (
                                      <ul key={`${item.label}-split-col-${c_idx}`} className="grid gap-2 content-start">
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
                                  <div key={section.heading ? `${section.heading}-${s_idx}` : `${item.label}-${s_idx}`} className="flex flex-col space-y-4">
                                    {section.heading?.trim() ? (
                                      <h4 className="text-[13px] font-medium text-muted-foreground">
                                        {section.heading}
                                      </h4>
                                    ) : null}
                                    <ul className="grid gap-2">
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
                            "bg-transparent text-sm font-normal text-muted-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
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
                className="group relative hidden md:inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-normal text-muted-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
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

        <div className="flex items-center gap-4">

          {typeof onAskAiClick === "function" ? (
            <div className="relative hidden md:inline-flex">
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "relative h-9 border-border bg-card px-3 text-sm font-medium text-foreground rounded-md",
                  showAskAiPrompt ? "border-emerald-500/35 shadow-[0_0_18px_rgba(16,185,129,0.14)]" : ""
                )}
                onClick={onAskAiClick}
              >
                <Bot className="mr-2 h-4 w-4 text-emerald-500" />
                {dict.askAi}
                {showAskAiPrompt ? (
                  <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                  </span>
                ) : null}
              </Button>
              {showAskAiPrompt && askAiPrompt ? (
                <span className="pointer-events-none absolute right-full top-1/2 mr-2 hidden max-w-[190px] -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-background px-2.5 py-1.5 text-[11px] font-medium text-foreground shadow-lg dark:bg-zinc-950 lg:inline-flex">
                  {askAiPrompt}
                </span>
              ) : null}
            </div>
          ) : null}

          {secondaryLinkLabel?.trim() && secondaryLinkHref?.trim() ? (
            <Button asChild variant="outline" className="hidden h-9 border-border bg-muted/50 px-4 text-[13px] font-medium text-foreground hover:bg-muted lg:inline-flex rounded-md transition-colors shadow-sm">
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
            <Button asChild className="h-9 px-4 text-xs font-medium rounded-md">
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

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger
                id="mobile-nav-sheet-trigger"
                suppressHydrationWarning
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">{dict.toggleMenu}</span>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background border-border">
                <SheetHeader>
                  <SheetTitle className="text-left">{mobileMenuTitle}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-6 py-6 overflow-y-auto max-h-[85vh]">
                  {typeof onAskAiClick === "function" ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-9 justify-start border-border bg-card text-foreground"
                      onClick={onAskAiClick}
                    >
                      <Bot className="mr-2 h-4 w-4 text-emerald-500" />
                      {dict.askAi}
                    </Button>
                  ) : null}
                  <Link
                    href="/changelog"
                    onClick={handleChangelogClick}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-emerald-500 transition-colors"
                  >
                    {dict.changelog}
                    {showNewBadge ? (
                      <span className="flex h-[18px] items-center rounded-full bg-emerald-500/10 px-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500 ring-1 ring-inset ring-emerald-500/20 animate-pulse">
                        {dict.newBadge}
                      </span>
                    ) : null}
                  </Link>
                  {navItems.map((item, idx) => (
                    <div key={`mobile-${item.label}-${idx}`} className="flex flex-col gap-2">
                      {item.href ? (
                        <Link
                          href={rewriteHref(item.href)}
                          target={isExternalHref(item.href) ? "_blank" : undefined}
                          rel={isExternalHref(item.href) ? "noopener noreferrer" : undefined}
                          className="font-medium text-foreground hover:text-emerald-500 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <div className="font-medium text-foreground">{item.label}</div>
                      )}

                      {item.sections?.map(sec =>
                        sec.links?.map((link, l_idx) => (
                          <Link
                            key={`mobile-link-${link.label}-${l_idx}`}
                            href={rewriteHref(link.href!)}
                            target={isExternalHref(link.href ?? "") ? "_blank" : undefined}
                            rel={isExternalHref(link.href ?? "") ? "noopener noreferrer" : undefined}
                            className="text-sm text-muted-foreground hover:text-emerald-400 py-1 pl-4 transition-colors"
                          >
                            {link.label}
                          </Link>
                        ))
                      )}
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
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
            "group block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-foreground focus:bg-accent focus:text-foreground",
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
          <div className="flex items-start gap-3.5">
            {Icon && (
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border border-border/50 bg-transparent text-muted-foreground/80 transition-colors group-hover:border-border group-hover:text-foreground">
                <Icon size={16} strokeWidth={1.5} />
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <div className="text-sm font-medium leading-none text-foreground transition-colors">
                {title}
              </div>
              {children ? (
                <p className="line-clamp-2 text-[13px] leading-snug text-muted-foreground">
                  {children}
                </p>
              ) : null}
            </div>
          </div>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = "ListItem";
