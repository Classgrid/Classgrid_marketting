"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { adaptiveHeroProfiles, headerNav, type InstitutionType } from "@/content/siteContent";

const institutionLinks = [
  { key: "college" as const, href: "/institutions/college" },
  { key: "junior-college" as const, href: "/institutions/junior-college" },
  { key: "coaching" as const, href: "/institutions/coaching" },
  { key: "school" as const, href: "/institutions/school" },
];

const modulesColumns = headerNav.modulesColumns;
const platformLinks = headerNav.platformLinks;

export function Navbar() {
  const pathname = usePathname();
  const [selectedInstitution, setSelectedInstitution] = useState<InstitutionType>("college");

  const institutionPanelData = useMemo(
    () => adaptiveHeroProfiles[selectedInstitution],
    [selectedInstitution]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-lg font-bold tracking-tight text-heading md:text-xl">
          Classgrid
        </Link>

          <NavigationMenu align="start" className="hidden xl:flex">
            <NavigationMenuList className="gap-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-slate-300 hover:bg-white/10 hover:text-white data-open:bg-white/10 data-open:text-white data-popup-open:bg-white/10 data-popup-open:text-white">
                  Modules
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[min(92vw,860px)] p-0">
                  <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#0A0A0A]/95 p-4 md:grid-cols-3">
                    {modulesColumns.map((column) => (
                      <div key={column.heading} className="rounded-xl border border-white/10 bg-black/60 p-3">
                        <p className="text-xs tracking-[0.14em] text-blue-200 uppercase">{column.heading}</p>
                        <ul className="mt-2 space-y-1.5 text-sm text-slate-200">
                          {column.items.map((item) => (
                            <li key={item}>
                              <Link
                                href="/features"
                                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-slate-200 transition hover:bg-white/10"
                              >
                                <ChevronRight className="size-3 text-blue-200" />
                                <span>{item}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-slate-300 hover:bg-white/10 hover:text-white data-open:bg-white/10 data-open:text-white data-popup-open:bg-white/10 data-popup-open:text-white">
                  Institutions
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[min(92vw,920px)] p-0">
                  <div className="grid gap-4 rounded-2xl border border-white/10 bg-[#0A0A0A]/95 p-4 md:grid-cols-[0.45fr_0.55fr]">
                    <div className="space-y-2">
                      {institutionLinks.map((item) => {
                        const profile = adaptiveHeroProfiles[item.key];
                        const active = selectedInstitution === item.key;

                        return (
                          <button
                            key={item.key}
                            type="button"
                            onMouseEnter={() => setSelectedInstitution(item.key)}
                            onFocus={() => setSelectedInstitution(item.key)}
                            onClick={() => setSelectedInstitution(item.key)}
                            className={cn(
                              "w-full rounded-xl border p-3 text-left transition",
                              active
                                ? "border-blue-300/40 bg-blue-500/15 text-white"
                                : "border-white/10 bg-black/60 text-slate-300 hover:border-white/25 hover:text-white"
                            )}
                          >
                            <p className="text-sm font-semibold">{profile.label}</p>
                            <p className="mt-1 text-xs text-slate-300">Adaptive capability profile</p>
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                      <p className="text-xs tracking-[0.14em] text-blue-200 uppercase">
                        {institutionPanelData.label} System View
                      </p>
                      <h4 className="text-heading mt-2 text-lg text-white">{institutionPanelData.headline}</h4>
                      <ul className="mt-3 space-y-2 text-sm text-slate-200">
                        {institutionPanelData.capabilities.map((capability) => (
                          <li key={capability} className="flex items-start gap-2">
                            <span className="mt-1 size-1.5 rounded-full bg-blue-300" />
                            <span>{capability}</span>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={institutionLinks.find((item) => item.key === selectedInstitution)?.href ?? "/features"}
                        className="mt-4 inline-flex rounded-md border border-white/20 px-3 py-1.5 text-xs text-slate-200 transition hover:bg-white/10"
                      >
                        Open Institution Page
                      </Link>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent text-slate-300 hover:bg-white/10 hover:text-white data-open:bg-white/10 data-open:text-white data-popup-open:bg-white/10 data-popup-open:text-white">
                  Platform
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-[min(92vw,760px)] p-0">
                  <div className="grid gap-2 rounded-2xl border border-white/10 bg-[#0A0A0A]/95 p-4 md:grid-cols-2">
                    {platformLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "rounded-xl border border-white/10 bg-black/60 px-3 py-2 text-sm text-slate-200 transition hover:border-white/25 hover:bg-white/5",
                          pathname === item.href && "border-blue-300/40 text-white"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

        <div className="hidden items-center gap-2 xl:flex">
          <Link
            href="https://app.classgrid.in/login"
            className="rounded-md border border-white/15 px-3 py-2 text-sm text-slate-300 transition hover:border-white/30 hover:text-white"
          >
            Login
          </Link>
          <Link
            href="/#demo"
            className="rounded-md bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Book a Demo
          </Link>
        </div>

        <div className="xl:hidden">
          <Sheet>
            <SheetTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-muted text-foreground">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] border-l border-border bg-card p-0">
              <div className="border-b border-border p-4">
                <p className="text-lg font-semibold text-heading">Classgrid</p>
                <p className="text-sm text-muted-foreground">The Operating System for Modern Education</p>
              </div>

              <nav className="space-y-1 p-4">
                {headerNav.mobileLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="border-t border-border p-4">
                <Link
                  href="https://app.classgrid.in/login"
                  className="block rounded-md border border-white/15 px-3 py-2 text-center text-sm text-slate-200 transition hover:border-white/30 hover:text-white"
                >
                  Login
                </Link>
                <Link
                  href="/#demo"
                  className="mt-2 block rounded-md bg-[linear-gradient(135deg,#4a90f5,#8b6fff)] px-3 py-2 text-center text-sm font-semibold text-white"
                >
                  Book a Demo
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
