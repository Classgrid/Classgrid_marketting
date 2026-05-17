"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";
import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import ThreeMiniScene from "@/components/ThreeMiniScene";
import {
  getFooterStatusDotClass,
  getFooterStatusLabel,
  resolveFooterCopyrightText,
  type FooterStatusState,
} from "@/lib/footer-status";

type HeroProps = {
  title: ReactNode;
  sub?: ReactNode;
};

type SecProps = {
  title?: ReactNode;
  children?: ReactNode;
};

type FooterProps = {
  copyrightText?: string;
  statusLabel?: string;
  statusState?: FooterStatusState;
  statusHref?: string;
};

const MotionDiv = motion.div as any;
const MotionP = motion.p as any;
const MotionSpan = motion.span as any;

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

type MenuLink = {
  label: string;
  href: string;
  description?: string;
  isNew?: boolean;
};

type MenuColumn = {
  heading: string;
  links: MenuLink[];
};

type MegaMenu = {
  label: string;
  columns: MenuColumn[];
};

const megaMenus: MegaMenu[] = [
  {
    label: "Platform",
    columns: [
      {
        heading: "Core Modules",
        links: [
          { label: "Admissions CRM", href: "/features", description: "Handle enquiries, applications, and onboarding." },
          { label: "Academic ERP", href: "/features", description: "Timetable, attendance, and grade workflows." },
          { label: "Finance & Fees", href: "/features", description: "Fee collection, dues tracking, and reporting." },
        ],
      },
      {
        heading: "Operations",
        links: [
          { label: "HR & Payroll", href: "/features", description: "Manage staff records and payroll cycles." },
          { label: "Transport", href: "/features", description: "Route planning and live vehicle tracking." },
          { label: "Canteen & Inventory", href: "/features", description: "Cashless canteen and stock control." },
        ],
      },
      {
        heading: "Experience",
        links: [
          { label: "Student App", href: "/features", description: "Everything students need in one place." },
          { label: "Parent App", href: "/features", description: "Transparent communication for guardians." },
          { label: "Teacher Workspace", href: "/features", description: "Daily academic operations made simple." },
        ],
      },
    ],
  },
  {
    label: "Solutions",
    columns: [
      {
        heading: "By Institution",
        links: [
          { label: "Schools", href: "/use-cases", description: "K-12 workflows with parent engagement." },
          { label: "Colleges", href: "/use-cases", description: "Department-wise governance and audits." },
          { label: "Coaching Institutes", href: "/use-cases/institutes", description: "Batch scheduling and fast communication." },
        ],
      },
      {
        heading: "By Role",
        links: [
          { label: "Management", href: "/features", description: "Executive dashboards and analytics." },
          { label: "Administrators", href: "/features", description: "Single command center for operations." },
          { label: "Teachers", href: "/features", description: "Classroom-first, low-friction tools." },
        ],
      },
      {
        heading: "By Outcome",
        links: [
          { label: "Faster Admissions", href: "/case-studies", description: "Improve conversion and onboarding speed." },
          { label: "Higher Fee Collection", href: "/case-studies", description: "Reduce leakages and payment friction." },
          { label: "Academic Visibility", href: "/case-studies", description: "Track outcomes and improve delivery." },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        heading: "Learn",
        links: [
          { label: "Blog", href: "/blog", description: "Product, technology, and growth insights." },
          { label: "Help Center", href: "/support", description: "Setup guides and implementation support." },
          { label: "FAQs", href: "/faq", description: "Quick answers for institutions and teams." },
        ],
      },
      {
        heading: "Trust",
        links: [
          { label: "Security", href: "/security", description: "Infrastructure and data protection details." },
          { label: "Privacy", href: "/privacy", description: "How student and staff data is handled." },
          { label: "Terms", href: "/terms", description: "Commercial and legal terms." },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About Classgrid", href: "/about", description: "Who we are and why we built this." },
          { label: "Case Studies", href: "/case-studies", description: "Measurable outcomes from real campuses." },
          { label: "Changelog", href: "/changelog", description: "Track product updates and releases." },
        ],
      },
    ],
  },
];

const topNavLinks: MenuLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

const utilityColumns: Array<{ heading: string; links: MenuLink[] }> = [
  { heading: "Platform", links: [{ label: "Admissions", href: "/features" }, { label: "Academics", href: "/features" }, { label: "Finance & Fees", href: "/features" }] },
  { heading: "Operations", links: [{ label: "Transport", href: "/features" }, { label: "Canteen", href: "/features" }, { label: "HR & Payroll", href: "/features" }] },
  { heading: "Institution Types", links: [{ label: "Schools", href: "/use-cases" }, { label: "Colleges", href: "/use-cases" }, { label: "Coaching Institutes", href: "/use-cases/institutes" }] },
  { heading: "Resources", links: [{ label: "Case Studies", href: "/case-studies" }, { label: "Blog", href: "/blog" }, { label: "FAQ", href: "/faq" }] },
  { heading: "Trust", links: [{ label: "Security", href: "/security" }, { label: "Privacy", href: "/privacy" }, { label: "Terms", href: "/terms" }] },
  { heading: "Support", links: [{ label: "Help Center", href: "/support" }, { label: "Book Demo", href: "/#demo" }, { label: "Contact Sales", href: "/contact" }] },
];

const directoryColumns: Array<{ heading: string; links: MenuLink[] }> = [
  {
    heading: "PRODUCT",
    links: [
      { label: "Features", href: "/features" },
      { label: "Integrations", href: "/integrations" },
      { label: "Community Forum", href: "/community" },
      { label: "Security", href: "/security" },

    ],
  },
  {
    heading: "SOLUTIONS",
    links: [
      { label: "Schools", href: "/use-cases" },
      { label: "Colleges", href: "/use-cases" },
      { label: "Coaching", href: "/use-cases/institutes" },
      { label: "Teachers", href: "/use-cases/teachers", isNew: true },
    ],
  },
  {
    heading: "RESOURCES",
    links: [
      { label: "Case Studies", href: "/case-studies" },
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Support", href: "/support" },
    ],
  },
  {
    heading: "COMPANY",
    links: [
      { label: "About", href: "/about" },
      { label: "Reviews", href: "/reviews" },
      { label: "Changelog", href: "/changelog" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
  {
    heading: "CONTACT",
    links: [
      { label: "Book a Demo", href: "/#demo" },
      { label: "Talk to Sales", href: "/contact" },
      { label: "Contact", href: "/contact" },
      { label: "Request Support", href: "/support" },
    ],
  },
];

function MegaMenuPanel({ menu }: { menu: MegaMenu }) {
  const gridClass = menu.label === "Platform" ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <NavigationMenuContent className="w-[min(92vw,960px)] p-0">
      <div className={cn("grid border border-border bg-popover text-popover-foreground", gridClass)}>
        {menu.columns.map((column) => (
          <div key={column.heading} className="border-b border-border p-5 md:border-b-0 md:border-r md:border-border last:border-r-0">
            <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground">{column.heading}</p>
            <div className="space-y-1.5">
              {column.links.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch
                  className="group block rounded-lg border border-transparent px-3 py-2 transition hover:border-border hover:bg-accent"
                >
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    {item.label}
                    {item.isNew && <Badge variant="outline" className="h-4 border-cyan-400/40 bg-cyan-500/10 px-1.5 text-[9px] tracking-wider text-cyan-300">NEW</Badge>}
                  </div>
                  {item.description && (
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground group-hover:text-foreground">{item.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {menu.label === "Platform" && (
          <div className="hidden items-center justify-center border-l border-border bg-gradient-to-b from-background to-muted/40 p-5 md:flex">
            <div className="w-full rounded-xl border border-border bg-background/70 p-4">
              <p className="mb-3 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground">PLATFORM SCALE</p>
              <ThreeMiniScene className="mx-auto h-36 w-36" />
              <p className="mt-3 text-center text-xs text-muted-foreground">Realtime orchestration for modern institutions.</p>
            </div>
          </div>
        )}
      </div>
    </NavigationMenuContent>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const routes = new Set<string>();

    for (const item of topNavLinks) routes.add(item.href);
    for (const menu of megaMenus) {
      for (const column of menu.columns) {
        for (const link of column.links) routes.add(link.href);
      }
    }

    const timeoutId = window.setTimeout(() => {
      routes.forEach((href) => router.prefetch(href));
    }, 150);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 xl:gap-8">
          <Link
            href="/"
            prefetch
            className="flex items-center gap-2 border-r border-border pr-4 text-2xl font-black tracking-tighter text-foreground xl:pr-6"
          >
            CLASSGRID.
          </Link>

          <NavigationMenu align="start" className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {megaMenus.map((menu) => (
                <NavigationMenuItem key={menu.label}>
                  <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground data-open:bg-accent data-open:text-foreground data-popup-open:bg-accent data-popup-open:text-foreground">
                    {menu.label}
                  </NavigationMenuTrigger>
                  <MegaMenuPanel menu={menu} />
                </NavigationMenuItem>
              ))}

              {topNavLinks.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <NavigationMenuItem key={item.label}>
                    <Link
                      href={item.href}
                      prefetch
                      className={cn(
                        "relative inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium transition",
                        isActive ? "text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <MotionSpan
                          layoutId="active-header-link"
                          className="absolute inset-0 -z-10 rounded-lg bg-accent"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground xl:inline-flex">
            <span className="relative inline-flex size-2 rounded-[2px] bg-primary">
              <span className="absolute inset-0 animate-ping rounded-[2px] bg-primary/70" />
            </span>
            <span className="font-medium">Trusted by schools, colleges and coaching teams</span>
          </div>

          <Button asChild className="hidden lg:inline-flex">
            <Link href="/#demo" prefetch>
              Book a Demo
            </Link>
          </Button>

          <Button asChild variant="outline" className="lg:hidden px-3">
            <Link href="/demo" prefetch>
              <MenuIcon className="size-4 mr-2" />
              Menu
            </Link>
          </Button>
        </div>
      </div>

      <div className="border-t border-border bg-background/95 px-4 py-2 lg:hidden">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto text-xs">
          {[...megaMenus.map((menu) => menu.label), ...topNavLinks.map((item) => item.label)].map((label) => (
            <span key={label} className="rounded-md border border-border px-2.5 py-1 text-muted-foreground">
              {label}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

export function Footer({ copyrightText, statusLabel, statusState, statusHref }: FooterProps) {
  const resolvedCopyrightText = resolveFooterCopyrightText(copyrightText, "Classgrid Technologies");
  const resolvedStatusLabel = getFooterStatusLabel(statusState, statusLabel);
  const resolvedStatusHref = statusHref?.trim();
  const statusDotClass = getFooterStatusDotClass(statusState);

  return (
    <footer className="relative mt-24 border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 border-b border-border pb-12 md:grid-cols-2 xl:grid-cols-6">
          {utilityColumns.map((column) => (
            <div key={column.heading}>
              <p className="mb-3 text-sm font-semibold text-foreground">{column.heading}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} prefetch className="transition hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {directoryColumns.map((column) => (
            <div key={column.heading}>
              <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground">{column.heading}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {column.links.map((link) => (
                  <li key={link.label} className="inline-flex items-center gap-2">
                    <Link href={link.href} prefetch className="transition hover:text-foreground">
                      {link.label}
                    </Link>
                    {link.isNew && (
                      <Badge variant="outline" className="h-4 border-cyan-400/40 bg-cyan-500/10 px-1.5 text-[9px] tracking-wider text-cyan-300">
                        NEW
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border bg-background/95">
        <div className="mx-auto grid max-w-7xl items-center gap-3 px-4 py-4 text-xs sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center gap-2 text-muted-foreground sm:justify-start">
            <span className={`relative inline-flex size-2 rounded-[2px] ${statusDotClass}`}>
              <span className={`absolute inset-0 animate-ping rounded-[2px] ${statusDotClass} opacity-70`} />
            </span>
            {resolvedStatusHref ? (
              <Link
                href={resolvedStatusHref}
                prefetch={false}
                target={isExternalHref(resolvedStatusHref) ? "_blank" : undefined}
                rel={isExternalHref(resolvedStatusHref) ? "noopener noreferrer" : undefined}
                className="font-medium tracking-wide transition hover:text-foreground"
              >
                {`CLASSGRID CLOUD STATUS: ${resolvedStatusLabel}`}
              </Link>
            ) : (
              <span className="font-medium tracking-wide">{`CLASSGRID CLOUD STATUS: ${resolvedStatusLabel}`}</span>
            )}
          </div>
          <div className="inline-flex items-center justify-center gap-3 text-muted-foreground">
            <span>{resolvedCopyrightText}</span>
            <span>•</span>
            <Link href="/privacy" prefetch className="transition hover:text-foreground">Privacy</Link>
            <span>•</span>
            <Link href="/terms" prefetch className="transition hover:text-foreground">Terms</Link>
          </div>
          <div className="inline-flex items-center justify-center sm:justify-end">
            <ThemeSwitcher className="border-border bg-background/90" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Hero({ title, sub }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-background py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-0 bottom-0 h-[26rem] w-[26rem] rounded-full bg-accent/35 blur-[120px]" />
        <div className="absolute inset-x-[-10%] top-20 h-[34rem] origin-top [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_85%)] [transform:perspective(1200px)_rotateX(68deg)] bg-[linear-gradient(to_right,rgba(127,127,127,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(127,127,127,0.13)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40" />
      </div>

      <MotionDiv
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          <span className="relative inline-flex size-2 rounded-[2px] bg-primary">
            <span className="absolute inset-0 animate-ping rounded-[2px] bg-primary/70" />
          </span>
          Built for schools, colleges, and coaching institutes
        </div>

        <h1 className="mb-6 bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-5xl leading-[1.05] font-black tracking-tight text-transparent md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {sub && (
          <MotionP
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-lg leading-relaxed font-medium text-muted-foreground md:text-xl"
          >
            {sub}
          </MotionP>
        )}
      </MotionDiv>
    </section>
  );
}

export function Sec({ title, children }: SecProps = {}) {
  return (
    <section className="py-16 sm:py-24 px-6 md:px-12">
      {title && (
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-12 text-center">
          {title}
        </h2>
      )}
      <div className="mx-auto max-w-7xl">{children}</div>
    </section>
  );
}
