"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { animate, motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { TenantSiteData } from "@/lib/tenant-site";
import {
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Facebook,
  FlaskConical,
  GraduationCap,
  Instagram,
  Landmark,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
  Star,
  Trophy,
  Users,
  Users2,
  X,
  Youtube,
} from "lucide-react";

type TenantWebsiteHomeClientProps = {
  data: TenantSiteData;
  tenantSlug?: string;
  segments?: string[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: 0.1,
      staggerChildren: 0.15,
    },
  },
};

const iconMap = {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CalendarDays,
  FlaskConical,
  GraduationCap,
  Landmark,
  Trophy,
  Users,
  Users2,
} as const;

function getIcon(iconName: string) {
  return (iconMap as Record<string, (typeof Award)>)[iconName] || Award;
}

function normalizeOrgType(value: string) {
  const lowered = String(value || "").toLowerCase();
  if (lowered === "school") return "school";
  if (lowered === "junior-college" || lowered === "junior") return "junior-college";
  if (lowered === "coaching") return "coaching";
  return "school";
}

function resolveProgramLabel(orgType: string) {
  if (orgType === "school") return "Classes";
  if (orgType === "junior-college") return "Streams";
  return "Batches";
}

function resolveFacultyLabel(orgType: string) {
  if (orgType === "school") return "Teachers";
  if (orgType === "junior-college") return "Faculty Members";
  return "Expert Mentors";
}

function parseCounterValue(rawValue: string) {
  const match = rawValue.match(/(\d+(?:\.\d+)?)/);
  if (!match) {
    return { prefix: "", target: 0, suffix: rawValue };
  }
  const found = match[0];
  const start = match.index || 0;
  const end = start + found.length;
  return {
    prefix: rawValue.slice(0, start),
    target: Number(found),
    suffix: rawValue.slice(end),
  };
}

function formatDate(dateInput: string) {
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return dateInput;
  return parsed.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function buildTenantHref(path: string, tenantSlug?: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (tenantSlug) {
    return normalized;
  }
  if (normalized === "/") {
    return "/collge_webiste";
  }
  return `/collge_webiste${normalized}`;
}

function decodeRouteSegment(value: string | undefined) {
  if (!value) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function sanitizeYouTubeVideoId(value: string | null | undefined) {
  if (!value) return null;
  const cleaned = value.trim();
  return /^[a-zA-Z0-9_-]{11}$/.test(cleaned) ? cleaned : null;
}

function sanitizeYouTubePlaylistId(value: string | null | undefined) {
  if (!value) return null;
  const cleaned = value.trim();
  return /^[a-zA-Z0-9_-]{8,}$/.test(cleaned) ? cleaned : null;
}

function extractYouTubeEmbedData(input: string) {
  const asDirectId = sanitizeYouTubeVideoId(input);
  if (asDirectId) return { videoId: asDirectId, playlistId: null as string | null };

  try {
    const parsed = new URL(input);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const listParam = sanitizeYouTubePlaylistId(parsed.searchParams.get("list"));

    if ((host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") && parsed.pathname === "/playlist") {
      if (listParam) {
        return { videoId: null as string | null, playlistId: listParam };
      }
      return null;
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      const videoId = sanitizeYouTubeVideoId(id);
      if (!videoId) return null;
      return { videoId, playlistId: listParam };
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      if (parsed.pathname === "/watch") {
        const videoId = sanitizeYouTubeVideoId(parsed.searchParams.get("v"));
        if (!videoId && listParam) {
          return { videoId: null as string | null, playlistId: listParam };
        }
        if (!videoId) return null;
        return { videoId, playlistId: listParam };
      }

      if (
        parsed.pathname.startsWith("/embed/") ||
        parsed.pathname.startsWith("/shorts/") ||
        parsed.pathname.startsWith("/live/")
      ) {
        const id = parsed.pathname.split("/").filter(Boolean)[1];
        const videoId = sanitizeYouTubeVideoId(id);
        if (!videoId) return null;
        return { videoId, playlistId: listParam };
      }
    }
  } catch {
    return null;
  }

  return null;
}

function buildYouTubeEmbedUrl(embedData: { videoId: string | null; playlistId: string | null }) {
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    loop: "1",
    iv_load_policy: "3",
    disablekb: "1",
  });

  if (embedData.playlistId && !embedData.videoId) {
    params.set("list", embedData.playlistId);
    return `https://www.youtube.com/embed/videoseries?${params.toString()}`;
  }

  if (embedData.videoId) {
    if (embedData.playlistId) {
      params.set("listType", "playlist");
      params.set("list", embedData.playlistId);
    } else {
      params.set("playlist", embedData.videoId);
    }
    return `https://www.youtube.com/embed/${embedData.videoId}?${params.toString()}`;
  }

  return "";
}

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.65 });
  const [display, setDisplay] = useState(0);
  const { prefix, target, suffix } = parseCounterValue(value);

  useEffect(() => {
    if (!inView || target <= 0) return;
    const controls = animate(0, target, {
      duration: 1.3,
      ease: "easeOut",
      onUpdate: (latest) => {
        const next = Number.isInteger(target) ? Math.round(latest) : Number(latest.toFixed(1));
        setDisplay(next);
      },
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {target > 0 ? display : value}
      {target > 0 ? suffix : ""}
    </span>
  );
}

function useCountdown(dateValue: string) {
  const target = useMemo(() => {
    const parsed = new Date(dateValue);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [dateValue]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) return;
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, [target]);

  if (!target) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return { days, hours, minutes };
}

function TopAndMainNav({
  data,
  tenantSlug,
  orgType,
  isScrolled,
  isHome,
  fontScale,
  onFontScaleChange,
  highContrast,
  onToggleHighContrast,
}: {
  data: TenantSiteData;
  tenantSlug?: string;
  orgType: string;
  isScrolled: boolean;
  isHome: boolean;
  fontScale: number;
  onFontScaleChange: (value: number) => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const navTextIsLight = isHome && !isScrolled;
  const primary = data.theme.primary;
  const lightText = navTextIsLight ? "text-white" : "text-slate-900";
  const subText = navTextIsLight ? "text-white/80" : "text-slate-600";

  const onSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchValue.trim();
    const targetPath = trimmed ? `/search/${encodeURIComponent(trimmed)}` : "/search";
    router.push(buildTenantHref(targetPath, tenantSlug));
    setMobileOpen(false);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[60] border-b border-white/15 px-4 py-2 text-xs text-white sm:px-6 lg:px-8" style={{ backgroundColor: primary }}>
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Phone className="h-3.5 w-3.5" />
            <span>{data.institution.phone}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-3.5 w-3.5" />
            <span>{data.institution.email}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <MapPin className="h-3.5 w-3.5" />
              <span>{data.institution.location}</span>
            </div>
            <div className="hidden items-center gap-1 md:flex">
              <button
                onClick={() => onFontScaleChange(Math.max(90, fontScale - 5))}
                className="rounded border border-white/40 px-1.5 py-0.5 text-[11px] font-semibold hover:bg-white/10"
                aria-label="Decrease font size"
              >
                A-
              </button>
              <button
                onClick={() => onFontScaleChange(100)}
                className="rounded border border-white/40 px-1.5 py-0.5 text-[11px] font-semibold hover:bg-white/10"
                aria-label="Reset font size"
              >
                A
              </button>
              <button
                onClick={() => onFontScaleChange(Math.min(120, fontScale + 5))}
                className="rounded border border-white/40 px-1.5 py-0.5 text-[11px] font-semibold hover:bg-white/10"
                aria-label="Increase font size"
              >
                A+
              </button>
              <button
                onClick={onToggleHighContrast}
                className={`rounded border px-2 py-0.5 text-[11px] font-semibold ${
                  highContrast ? "border-white bg-white/20 text-white" : "border-white/40 hover:bg-white/10"
                }`}
                aria-label="Toggle high contrast mode"
              >
                Contrast
              </button>
            </div>
          </div>
        </div>
      </div>

      <header
        className={`fixed inset-x-0 z-50 transition-all duration-300 ${isScrolled || !isHome ? "top-9 border-b border-slate-200/80 bg-white/90 shadow-lg backdrop-blur-xl" : "top-9 border-transparent bg-transparent"}`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href={buildTenantHref("/", tenantSlug)} className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${navTextIsLight ? "border-white/40 bg-white/10" : "border-slate-200 bg-white"} font-bold`}>
              {data.institution.shortName}
            </div>
            <div>
              <p className={`text-sm font-semibold uppercase tracking-wider ${subText}`}>{data.institution.logoText}</p>
              <p className={`text-base font-bold leading-none ${lightText}`}>{data.institution.name}</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 xl:flex">
            {data.navLinks.map((item) => (
              <Link
                key={item.href}
                href={buildTenantHref(item.href, tenantSlug)}
                className={`relative text-sm font-medium transition after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:transition-all hover:after:w-full ${navTextIsLight ? "text-white/85 after:bg-white hover:text-white" : "text-slate-700 after:bg-slate-900 hover:text-slate-950"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <form
              onSubmit={onSearchSubmit}
              className={`hidden h-9 items-center rounded-full border pl-3 pr-1 lg:flex ${
                navTextIsLight ? "border-white/35 bg-white/10" : "border-slate-300 bg-white"
              }`}
              role="search"
              aria-label="Global site search"
            >
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search site"
                className={`w-32 bg-transparent text-xs outline-none ${
                  navTextIsLight ? "placeholder:text-white/75 text-white" : "placeholder:text-slate-500 text-slate-800"
                }`}
              />
              <button
                type="submit"
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                  navTextIsLight ? "bg-white/15 text-white hover:bg-white/25" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                aria-label="Submit search"
              >
                <Search className="h-3.5 w-3.5" />
              </button>
            </form>
            <span className={`hidden rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] md:inline-flex ${navTextIsLight ? "border-white/30 text-white/85" : "border-slate-300 text-slate-500"}`}>
              Powered by Classgrid
            </span>
            <Button asChild size="icon" variant="outline" className="hidden h-9 w-9 border-slate-300 text-slate-700 hover:bg-slate-100 lg:inline-flex">
              <Link href={buildTenantHref("/search", tenantSlug)} aria-label="Open search">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="hidden border-slate-300 text-slate-700 hover:bg-slate-100 md:inline-flex"
            >
              <Link href={buildTenantHref("/apply", tenantSlug)}>Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="animate-[pulse_3.2s_ease-in-out_infinite] text-white shadow-md hover:scale-105"
              style={{ backgroundColor: data.theme.primary }}
            >
              <Link href={buildTenantHref("/apply", tenantSlug)}>{data.hero.primaryCta.label}</Link>
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setMobileOpen((value) => !value)}
              className={`xl:hidden ${navTextIsLight ? "text-white hover:bg-white/10 hover:text-white" : "text-slate-800 hover:bg-slate-100"}`}
              aria-label="Open mobile menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="fixed inset-0 z-[70] bg-slate-950/95 p-6 text-white xl:hidden"
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">{data.institution.name}</p>
            <Button size="icon" variant="ghost" onClick={() => setMobileOpen(false)} className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-8 grid gap-2">
            <form onSubmit={onSearchSubmit} className="mb-4 flex items-center rounded-lg border border-white/20 bg-white/10 px-3">
              <Search className="h-4 w-4 text-white/80" />
              <input
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Search notices, events, blogs..."
                className="h-11 w-full bg-transparent px-3 text-sm text-white placeholder:text-white/70 outline-none"
              />
            </form>
            {data.navLinks.map((item) => (
              <Link
                key={item.href}
                href={buildTenantHref(item.href, tenantSlug)}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg border border-white/10 px-4 py-3 text-base font-medium hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      ) : null}
    </>
  );
}

function FloatingRails({ data, tenantSlug }: { data: TenantSiteData; tenantSlug?: string }) {
  const socialIconByPlatform = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    whatsapp: MessageCircle,
  } as const;

  return (
    <>
      <div className="fixed right-3 top-1/3 z-40 hidden -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg lg:flex">
        {data.socialLinks.map((item) => {
          const Icon = socialIconByPlatform[item.platform as keyof typeof socialIconByPlatform];
          if (!Icon) return null;
          return (
            <Link
              key={item.platform}
              href={item.href}
              className="group flex items-center gap-2 border-b border-slate-100 px-3 py-2 text-slate-600 transition last:border-b-0 hover:bg-slate-900 hover:text-white"
              aria-label={item.label}
            >
              <Icon className="h-4 w-4" />
              <span className="w-0 overflow-hidden whitespace-nowrap text-xs transition-all duration-200 group-hover:w-20">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>

      <div className="fixed bottom-5 right-5 z-40 lg:bottom-6">
        <Button
          asChild
          className="h-12 rounded-full px-6 text-sm font-semibold text-white shadow-xl transition hover:scale-105"
          style={{ backgroundColor: data.theme.primary }}
        >
          <Link href={buildTenantHref("/apply", tenantSlug)}>
            Apply Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </>
  );
}

function Footer({ data, tenantSlug }: { data: TenantSiteData; tenantSlug?: string }) {
  const year = new Date().getFullYear();
  const socialIconByPlatform = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    youtube: Youtube,
    whatsapp: MessageCircle,
  } as const;

  return (
    <>
      <section className="w-full border-t border-slate-200 bg-white">
        <iframe
          title="Institution map"
          src={data.contactPage.mapEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[350px] w-full border-0"
        />
      </section>

      <footer className="bg-slate-950 text-slate-100">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={staggerChildren}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
          >
            <motion.div variants={fadeUp} className="space-y-2">
              <p className="text-lg font-bold">{data.institution.name}</p>
              <p className="text-sm text-slate-300">{data.institution.address}</p>
              <p className="text-sm text-slate-300">{data.institution.phone}</p>
              <p className="text-sm text-slate-300">{data.institution.email}</p>
              <Link
                href={`https://wa.me/${data.institution.whatsapp.replace(/[^0-9]/g, "")}`}
                className="inline-flex items-center gap-2 pt-2 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp Us
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-2 text-sm">
              <p className="text-base font-semibold">Academics</p>
              {data.footer.academicsLinks.map((item) => (
                <Link key={item.label} href={buildTenantHref(item.href, tenantSlug)} className="block text-slate-300 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-2 text-sm">
              <p className="text-base font-semibold">Quick Links</p>
              {data.footer.quickLinks.map((item) => (
                <Link key={item.label} href={buildTenantHref(item.href, tenantSlug)} className="block text-slate-300 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-3 text-sm">
              <p className="text-base font-semibold">Connect</p>
              <div className="flex flex-wrap gap-2">
                {data.socialLinks.map((item) => {
                  const Icon = socialIconByPlatform[item.platform as keyof typeof socialIconByPlatform];
                  if (!Icon) return null;
                  return (
                    <Link
                      key={item.platform}
                      href={item.href}
                      aria-label={item.label}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 transition hover:scale-110 hover:border-white hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  );
                })}
              </div>
              <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900">
                {data.footer.newsletterCta}
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="border-t border-slate-800 py-4">
          <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 text-xs text-slate-400 sm:px-6 lg:px-8">
            <p>
              Copyright {year} {data.institution.name}
            </p>
            <p>Powered by Classgrid</p>
            <div className="flex items-center gap-4">
              {data.footer.legalLinks.map((item) => (
                <Link key={item.label} href={buildTenantHref(item.href, tenantSlug)} className="hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function HomePage({
  data,
  tenantSlug,
  orgType,
  programLabel,
  facultyLabel,
}: {
  data: TenantSiteData;
  tenantSlug?: string;
  orgType: string;
  programLabel: string;
  facultyLabel: string;
}) {
  const showQuickEnquiry = data.home.showQuickEnquiryFor.includes(orgType);
  const youtubeEmbedData = extractYouTubeEmbedData(data.hero.videoUrl || "");
  const youtubeEmbedUrl = youtubeEmbedData ? buildYouTubeEmbedUrl(youtubeEmbedData) : "";
  const heroImages = useMemo(() => {
    const fallbackImages = Array.isArray((data.hero as { fallbackImages?: string[] }).fallbackImages)
      ? ((data.hero as { fallbackImages?: string[] }).fallbackImages || []).filter(Boolean)
      : [];
    if (fallbackImages.length > 0) return fallbackImages;
    return data.hero.fallbackImage ? [data.hero.fallbackImage] : [];
  }, [data.hero]);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setHeroImageIndex((current) => (current + 1) % heroImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [heroImages]);

  const activeHeroImage = heroImages[heroImageIndex] || data.hero.fallbackImage;

  return (
    <>
      <section className="relative min-h-screen overflow-hidden">
        <div className="absolute inset-0 hidden md:block">
          {youtubeEmbedUrl ? (
            <iframe
              title="Hero video"
              src={youtubeEmbedUrl}
              className="h-full w-full object-cover"
              allow="autoplay; encrypted-media; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : data.hero.videoUrl ? (
            <video autoPlay muted loop playsInline preload="metadata" className="h-full w-full object-cover">
              <source src={data.hero.videoUrl} type="video/mp4" />
            </video>
          ) : activeHeroImage ? (
            <Image key={activeHeroImage} src={activeHeroImage} alt="Campus" fill className="object-cover" priority />
          ) : (
            <div className="h-full w-full bg-slate-900" />
          )}
        </div>
        <div className="absolute inset-0 md:hidden">
          {activeHeroImage ? (
            <Image key={activeHeroImage} src={activeHeroImage} alt="Campus" fill className="object-cover" priority />
          ) : (
            <div className="h-full w-full bg-slate-900" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/60 to-slate-950/80" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 pb-32 pt-32 text-white sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn}>
            <Badge className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-white">{data.hero.badge}</Badge>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} className="mt-5 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl">
            {data.hero.headline}
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.3, duration: 0.6 }} className="mt-3 max-w-2xl text-xl font-medium text-white/90">
            {data.institution.tagline}
          </motion.p>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.45, duration: 0.6 }} className="mt-4 max-w-2xl text-base text-white/80">
            {data.hero.description}
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ delay: 0.6, duration: 0.6 }} className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="h-11 rounded-full px-6 text-white" style={{ backgroundColor: data.theme.primary }}>
              <Link href={buildTenantHref(data.hero.primaryCta.href, tenantSlug)}>
                {data.hero.primaryCta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full border-white/50 bg-white/10 px-6 text-white hover:bg-white/20">
              <Link href={buildTenantHref(data.hero.secondaryCta.href, tenantSlug)}>{data.hero.secondaryCta.label}</Link>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6 }}
          className="absolute bottom-4 left-1/2 z-10 w-[calc(100%-2rem)] -translate-x-1/2 rounded-2xl border border-white/20 bg-slate-900/70 p-4 backdrop-blur md:bottom-8 md:w-[calc(100%-4rem)] md:p-5"
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {data.hero.stats.map((stat) => {
              const Icon = getIcon(stat.icon);
              const label = stat.labels[orgType as "school" | "junior-college" | "coaching"];
              return (
                <div key={stat.key} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="mb-1 flex items-center gap-2 text-white/90">
                    <Icon className="h-4 w-4" />
                    <p className="text-xl font-bold">
                      <AnimatedCounter value={stat.value} />
                    </p>
                  </div>
                  <p className="text-xs text-white/75">{label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={staggerChildren} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {data.home.highlights.map((item) => {
              const Icon = getIcon(item.icon);
              return (
                <motion.div key={item.label} variants={fadeUp}>
                  <Card className="h-full border-slate-200/80">
                    <CardContent className="p-5 text-center">
                      <div className="mx-auto mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-2xl font-bold text-slate-900">
                        <AnimatedCounter value={item.value} />
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-16 text-white" style={{ backgroundColor: data.theme.primary }}>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Our {programLabel}</h2>
              <p className="mt-2 text-white/80">Explore high-impact academic pathways designed for outcomes.</p>
            </div>
            <Button asChild variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10">
              <Link href={buildTenantHref("/programs", tenantSlug)}>View All</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {data.programs.slice(0, 3).map((program) => {
              const Icon = getIcon(program.icon);
              return (
                <Card key={program.id} className="group border-white/20 bg-white/10 text-white transition hover:-translate-y-1 hover:shadow-xl">
                  <CardContent className="p-5">
                    <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-lg font-semibold">{program.name}</p>
                    <p className="mt-1 text-sm text-white/75">{program.duration}</p>
                    <p className="mt-3 text-sm text-white/85">{program.description}</p>
                    <Link href={buildTenantHref("/programs", tenantSlug)} className="mt-4 inline-flex items-center text-sm font-semibold text-white">
                      Know More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14" style={{ background: `linear-gradient(115deg, ${data.theme.primary} 0%, ${data.theme.primaryDark} 100%)` }}>
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 text-white sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold">{data.admissionBanner.title}</h2>
            <p className="mt-2 text-white/85">{data.admissionBanner.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {data.admissionBanner.importantDates.map((item) => (
                <div key={item.label} className="rounded-full border border-white/25 px-4 py-1 text-white/90">
                  {item.label}: {item.date}
                </div>
              ))}
            </div>
          </div>
          <Button asChild className="h-11 rounded-full bg-white px-7 text-slate-900 hover:bg-slate-100">
            <Link href={buildTenantHref(data.admissionBanner.cta.href, tenantSlug)}>
              {data.admissionBanner.cta.label}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 lg:col-span-2">
            <div className="absolute inset-0">
              <Image src={data.aboutPage.bannerImage} alt="Notices" fill className="object-cover" />
              <div className="absolute inset-0" style={{ backgroundColor: `${data.theme.primary}cc` }} />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
              <p className="text-2xl font-semibold">{data.home.noticesHeading}</p>
              <p className="mt-2 text-sm text-white/90">Stay connected with examinations, admissions, holidays, and academic updates.</p>
              <Button asChild className="mt-4 w-fit rounded-full bg-white text-slate-900 hover:bg-slate-100">
                <Link href={buildTenantHref("/notices", tenantSlug)}>View All Notices</Link>
              </Button>
            </div>
          </div>

          <div className="group relative h-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 lg:col-span-3">
            <div className="cg-notice-scroll group-hover:[animation-play-state:paused] space-y-3 p-4">
              {[...data.notices, ...data.notices].map((notice, index) => (
                <div key={`${notice.id}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{formatDate(notice.date)}</p>
                    <p className="truncate text-sm font-semibold text-slate-800">{notice.title}</p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="shrink-0">
                    <Link href={buildTenantHref(`/notices/${notice.id}`, tenantSlug)}>
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">Meet Our {facultyLabel}</h2>
              <p className="mt-2 text-slate-600">Public faculty profiles from ERP are shown here with quick department context.</p>
            </div>
            <Button asChild variant="outline">
              <Link href={buildTenantHref("/about", tenantSlug)}>View All Faculty</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {data.faculty.slice(0, 4).map((member) => (
              <motion.div key={member.id} whileHover={{ scale: 1.03 }}>
                <Card className="overflow-hidden border-slate-200">
                  <div className="relative h-52 bg-slate-100">
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-base font-semibold text-slate-900">{member.name}</p>
                    <p className="text-sm text-slate-600">{member.designation}</p>
                    <p className="text-xs text-slate-500">{member.subject}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">{data.home.galleryHeading}</h2>
              <p className="mt-2 text-slate-600">A visual glance at classroom learning, events, and campus life.</p>
            </div>
            <Button asChild variant="outline">
              <Link href={buildTenantHref("/gallery", tenantSlug)}>View Full Gallery</Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {data.gallery.images.slice(0, 6).map((item, index) => (
              <div key={item.id} className={`group relative overflow-hidden rounded-xl border border-slate-200 ${index === 2 ? "row-span-2 md:col-span-2" : ""}`}>
                <div className="relative h-36 md:h-44">
                  <Image src={item.image} alt={item.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
                </div>
                <div className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-3xl font-semibold text-slate-900">{data.home.testimonialsHeading}</h2>
          </div>
          <div className="group overflow-hidden">
            <div className="cg-testimonial-scroll group-hover:[animation-play-state:paused] flex w-max gap-4 pb-4">
              {[...data.testimonials, ...data.testimonials].map((item, index) => (
                <Card key={`${item.id}-${index}`} className="w-[320px] overflow-hidden border-slate-200">
                  <div className="h-16" style={{ background: `linear-gradient(120deg, ${data.theme.primary}, ${data.theme.primaryDark})` }} />
                  <CardContent className="p-4">
                    <div className="-mt-10 mb-3 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-slate-100">
                      <div className="relative h-full w-full">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    </div>
                    <div className="mb-2 flex items-center gap-1 text-amber-500">
                      {Array.from({ length: item.rating }).map((_, starIndex) => (
                        <Star key={`${item.id}-star-${starIndex}`} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-base font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.batch} - {item.program}
                    </p>
                    <p className="mt-3 text-sm text-slate-600">{item.text}</p>
                    <div className="mt-3 flex gap-2 text-slate-500">
                      <Link href={item.facebook} className="rounded-full border border-slate-200 p-1.5 hover:text-slate-900">
                        <Facebook className="h-4 w-4" />
                      </Link>
                      <Link href={item.linkedin} className="rounded-full border border-slate-200 p-1.5 hover:text-slate-900">
                        <Linkedin className="h-4 w-4" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showQuickEnquiry ? (
        <section className="py-14 text-white" style={{ backgroundColor: data.theme.primary }}>
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold">{data.quickEnquiry.heading}</h2>
            <p className="mt-2 text-white/85">{data.quickEnquiry.description}</p>
            <form className="mt-6 grid gap-3 md:grid-cols-4">
              <input className="h-11 rounded-lg border border-white/40 bg-white/10 px-3 text-sm text-white placeholder:text-white/75" placeholder="Full Name" />
              <input className="h-11 rounded-lg border border-white/40 bg-white/10 px-3 text-sm text-white placeholder:text-white/75" placeholder="Phone Number" />
              <select className="h-11 rounded-lg border border-white/40 bg-white/10 px-3 text-sm text-white">
                {data.programs.map((program) => (
                  <option key={program.id} value={program.id} className="text-slate-900">
                    {program.name}
                  </option>
                ))}
              </select>
              <Button className="h-11 rounded-lg bg-white text-slate-900 hover:bg-slate-100">Submit</Button>
            </form>
          </div>
        </section>
      ) : null}
    </>
  );
}

function AboutPage({ data }: { data: TenantSiteData }) {
  const departments = useMemo(() => ["All", ...Array.from(new Set(data.faculty.map((member) => member.department)))], [data.faculty]);
  const [activeDepartment, setActiveDepartment] = useState("All");
  const filteredFaculty = data.faculty.filter((member) => activeDepartment === "All" || member.department === activeDepartment);
  const orgType = normalizeOrgType(data.institution.type);
  const typeSpecific = data.aboutPage.typeSpecific[orgType as "school" | "junior-college" | "coaching"];

  return (
    <>
      <section className="relative h-[300px] overflow-hidden">
        <Image src={data.aboutPage.bannerImage} alt="About banner" fill className="object-cover" />
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-end px-4 pb-10 text-white sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold sm:text-5xl">About Us</h1>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp} className="relative min-h-[340px] overflow-hidden rounded-2xl border border-slate-200">
          <Image src={data.aboutPage.storyImage} alt="Our story" fill className="object-cover" />
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.35 }} variants={fadeUp}>
          <h2 className="text-3xl font-semibold text-slate-900">{data.aboutPage.storyTitle}</h2>
          <p className="mt-4 text-slate-600">{data.aboutPage.story}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <p className="text-lg font-semibold text-slate-900">Vision</p>
                <p className="mt-2 text-sm text-slate-600">{data.aboutPage.vision}</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <p className="text-lg font-semibold text-slate-900">Mission</p>
                <p className="mt-2 text-sm text-slate-600">{data.aboutPage.mission}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-slate-200">
          <Image src={data.aboutPage.principal.image} alt={data.aboutPage.principal.name} fill className="object-cover" />
        </div>
        <Card className="border-slate-200">
          <CardContent className="p-6">
            <p className="text-5xl text-slate-300">"</p>
            <p className="text-sm leading-6 text-slate-600">{data.aboutPage.principal.message}</p>
            <p className="mt-4 text-lg font-semibold text-slate-900">{data.aboutPage.principal.name}</p>
            <p className="text-sm text-slate-500">{data.aboutPage.principal.designation}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap gap-3">
          {data.aboutPage.accreditations.map((label) => (
            <span key={label} className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600 transition hover:bg-white hover:text-slate-900">
              {label}
            </span>
          ))}
        </div>
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <p className="text-lg font-semibold text-slate-900">{typeSpecific.title}</p>
            <p className="mt-2 text-sm text-slate-600">{typeSpecific.text}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-slate-900">Faculty Directory</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {departments.map((department) => (
            <button
              key={department}
              onClick={() => setActiveDepartment(department)}
              className={`rounded-full px-4 py-2 text-sm font-medium ${department === activeDepartment ? "text-white" : "bg-slate-100 text-slate-700"}`}
              style={department === activeDepartment ? { backgroundColor: data.theme.primary } : undefined}
            >
              {department}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFaculty.map((member) => (
            <Card key={member.id} className="overflow-hidden border-slate-200">
              <div className="relative h-56">
                <Image src={member.image} alt={member.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <p className="font-semibold text-slate-900">{member.name}</p>
                <p className="text-sm text-slate-600">{member.designation}</p>
                <p className="text-xs text-slate-500">
                  {member.department} - {member.subject}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}

function ProgramsPage({ data, tenantSlug }: { data: TenantSiteData; tenantSlug?: string }) {
  const programLabel = resolveProgramLabel(normalizeOrgType(data.institution.type));
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Our {programLabel}</h1>
      <p className="mt-3 max-w-3xl text-slate-600">{data.programsPage.description}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {data.programs.map((program) => {
          const Icon = getIcon(program.icon);
          return (
            <Card key={program.id} className="border-slate-200">
              <CardContent className="p-5">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>
                <p className="text-xl font-semibold text-slate-900">{program.name}</p>
                <p className="mt-1 text-sm text-slate-500">{program.duration}</p>
                <p className="mt-3 text-sm text-slate-600">{program.description}</p>
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  {program.subjects.map((subject) => (
                    <li key={subject} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>{subject}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 rounded-lg bg-slate-100 p-3 text-xs text-slate-600">
                  Intake: {program.intake}
                  <br />
                  Eligibility: {program.eligibility}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {data.programsPage.eligibilitySteps.map((step, index) => (
          <Card key={step} className="border-slate-200">
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-slate-900">Step {index + 1}</p>
              <p className="mt-2 text-sm text-slate-600">{step}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 rounded-2xl p-6 text-white" style={{ background: `linear-gradient(120deg, ${data.theme.primary}, ${data.theme.primaryDark})` }}>
        <p className="text-2xl font-semibold">Ready to begin your admission journey?</p>
        <Button asChild className="mt-4 rounded-full bg-white text-slate-900 hover:bg-slate-100">
          <Link href={buildTenantHref("/apply", tenantSlug)}>
            Apply Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}

function NoticesPage({ data, tenantSlug }: { data: TenantSiteData; tenantSlug?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const categories = useMemo(() => ["All", ...Array.from(new Set(data.notices.map((notice) => notice.category)))], [data.notices]);
  const pageSize = 10;

  const filtered = data.notices
    .filter((notice) => category === "All" || notice.category === category)
    .filter((notice) => notice.title.toLowerCase().includes(query.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [query, category]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Notice Board</h1>
      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notices"
            className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm"
          />
        </div>
        {categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${category === item ? "text-white" : "bg-slate-100 text-slate-700"}`}
            style={category === item ? { backgroundColor: data.theme.primary } : undefined}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        {currentRows.map((notice, index) => (
          <div key={notice.id} className={`flex flex-wrap items-center justify-between gap-3 px-4 py-4 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{notice.category}</Badge>
              <span className="text-xs text-slate-500">{formatDate(notice.date)}</span>
            </div>
            <p className="min-w-[220px] flex-1 text-sm font-medium text-slate-800">{notice.title}</p>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={buildTenantHref(`/notices/${notice.id}`, tenantSlug)}>View</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={notice.pdfUrl}>
                  <Download className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => setPage((value) => Math.max(1, value - 1))}>
          Prev
        </Button>
        <span className="text-sm text-slate-600">
          {page} / {totalPages}
        </span>
        <Button size="sm" variant="outline" onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
          Next
        </Button>
      </div>
    </section>
  );
}

function NoticeDetailPage({ data, tenantSlug, noticeId }: { data: TenantSiteData; tenantSlug?: string; noticeId: string }) {
  const notice = data.notices.find((item) => item.id === noticeId);
  if (!notice) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Notice Not Found</h1>
        <Button asChild className="mt-4">
          <Link href={buildTenantHref("/notices", tenantSlug)}>Back to Notices</Link>
        </Button>
      </section>
    );
  }

  const related = data.notices.filter((item) => item.id !== notice.id).slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <p className="text-sm text-slate-500">
        Home &gt; Notices &gt; {notice.title}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <Badge>{notice.category}</Badge>
        <span className="text-sm text-slate-500">{formatDate(notice.date)}</span>
      </div>
      <h1 className="mt-4 text-4xl font-bold text-slate-900">{notice.title}</h1>
      <p className="mt-4 text-slate-700">{notice.body}</p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href={notice.pdfUrl}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={buildTenantHref("/notices", tenantSlug)}>Back to Notices</Link>
        </Button>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">Related Notices</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {related.map((item) => (
            <Card key={item.id} className="border-slate-200">
              <CardContent className="p-4">
                <p className="text-xs text-slate-500">{formatDate(item.date)}</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{item.title}</p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link href={buildTenantHref(`/notices/${item.id}`, tenantSlug)}>View</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function MeritPage({ data }: { data: TenantSiteData }) {
  const [activeYear, setActiveYear] = useState(data.meritPage.years[0] || "2026");

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-bold text-slate-900">Merit Lists & Results</h1>
        <select value={activeYear} onChange={(event) => setActiveYear(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm">
          {data.meritPage.years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 group overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
        <div className="cg-testimonial-scroll group-hover:[animation-play-state:paused] flex w-max gap-4">
          {[...data.toppers, ...data.toppers].map((topper, index) => (
            <Card key={`${topper.id}-${index}`} className="w-[280px] border-slate-200">
              <CardContent className="p-4">
                <div className="relative h-40 overflow-hidden rounded-lg">
                  <Image src={topper.image} alt={topper.name} fill className="object-cover" />
                </div>
                <p className="mt-3 text-lg font-semibold text-slate-900">{topper.name}</p>
                <p className="text-sm text-slate-600">{topper.program}</p>
                <p className="text-sm font-medium text-slate-800">{topper.score}</p>
                <p className="text-xs text-slate-500">{topper.batch}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
        <div className="grid grid-cols-5 bg-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
          <p>List Name</p>
          <p>Program</p>
          <p>Round</p>
          <p>Date</p>
          <p className="text-right">Actions</p>
        </div>
        {data.meritLists.map((item) => (
          <div key={item.id} className="grid grid-cols-5 items-center gap-2 border-t border-slate-200 px-4 py-4 text-sm">
            <p className="font-medium text-slate-800">{item.title}</p>
            <p className="text-slate-600">{item.program}</p>
            <p className="text-slate-600">{item.round}</p>
            <p className="text-slate-600">{formatDate(item.date)}</p>
            <div className="flex justify-end gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={item.pdfUrl}>View</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={item.pdfUrl}>Download</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.meritPage.resultStats.map((item) => (
          <Card key={item.label} className="border-slate-200">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-slate-900">
                <AnimatedCounter value={item.value} />
              </p>
              <p className="text-sm text-slate-600">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function FeesPage({ data, tenantSlug }: { data: TenantSiteData; tenantSlug?: string }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-bold text-slate-900">Fee Structure & Admission</h1>
        <Badge>{data.feesPage.academicYear}</Badge>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Program</th>
              <th className="px-4 py-3">Seats</th>
              <th className="px-4 py-3">Annual Fees</th>
              <th className="px-4 py-3">One-Time Fees</th>
              <th className="px-4 py-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.fees.map((row) => (
              <tr key={row.id} className="border-t border-slate-200 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{row.program}</td>
                <td className="px-4 py-3 text-slate-600">{row.intake}</td>
                <td className="px-4 py-3 text-slate-600">{row.annualFees}</td>
                <td className="px-4 py-3 text-slate-600">{row.oneTimeFees}</td>
                <td className="px-4 py-3 text-slate-800">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="mt-6 border-slate-200">
        <CardContent className="p-5">
          <p className="text-lg font-semibold text-slate-900">{data.feesPage.scholarshipTitle}</p>
          <p className="mt-2 text-sm text-slate-600">{data.feesPage.scholarshipText}</p>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Accordion type="single" collapsible>
          {data.feesPage.policies.map((policy) => (
            <AccordionItem key={policy.id} value={policy.id}>
              <AccordionTrigger>{policy.title}</AccordionTrigger>
              <AccordionContent>{policy.text}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Button asChild className="mt-8" style={{ backgroundColor: data.theme.primary }}>
        <Link href={buildTenantHref("/apply", tenantSlug)}>
          Apply Now
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </section>
  );
}

function GalleryPage({ data }: { data: TenantSiteData }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [visibleCount, setVisibleCount] = useState(8);
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filteredImages = data.gallery.images.filter((item) => activeCategory === "All" || item.category === activeCategory);
  const visibleImages = filteredImages.slice(0, visibleCount);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Campus Life @ {data.institution.name}</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setActiveTab("photos")} className={`rounded-full px-4 py-2 text-sm ${activeTab === "photos" ? "text-white" : "bg-slate-100 text-slate-700"}`} style={activeTab === "photos" ? { backgroundColor: data.theme.primary } : undefined}>
          Photos
        </button>
        <button onClick={() => setActiveTab("videos")} className={`rounded-full px-4 py-2 text-sm ${activeTab === "videos" ? "text-white" : "bg-slate-100 text-slate-700"}`} style={activeTab === "videos" ? { backgroundColor: data.theme.primary } : undefined}>
          Video Gallery
        </button>
      </div>

      {activeTab === "photos" ? (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {data.gallery.categories.map((category) => (
              <button key={category} onClick={() => setActiveCategory(category)} className={`rounded-full px-4 py-2 text-sm ${activeCategory === category ? "text-white" : "bg-slate-100 text-slate-700"}`} style={activeCategory === category ? { backgroundColor: data.theme.primary } : undefined}>
                {category}
              </button>
            ))}
          </div>

          <div className="mt-6 columns-1 gap-4 md:columns-2 lg:columns-3">
            {visibleImages.map((item, index) => (
              <button key={item.id} onClick={() => setLightboxIndex(index)} className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-xl border border-slate-200">
                <div className="relative h-56">
                  <Image src={item.image} alt={item.title} fill className="object-cover transition duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-slate-950/0 transition group-hover:bg-slate-950/45" />
                </div>
              </button>
            ))}
          </div>

          {visibleCount < filteredImages.length ? (
            <Button variant="outline" onClick={() => setVisibleCount((value) => value + 6)}>
              View More
            </Button>
          ) : null}
        </>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {data.gallery.videos.map((video) => (
            <Card key={video.id} className="overflow-hidden border-slate-200">
              <div className="aspect-video">
                <iframe title={video.title} src={video.youtubeUrl} className="h-full w-full border-0" allowFullScreen />
              </div>
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-slate-800">{video.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {lightboxIndex >= 0 && filteredImages[lightboxIndex] ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4">
          <button onClick={() => setLightboxIndex(-1)} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white">
            <X className="h-5 w-5" />
          </button>
          <button onClick={() => setLightboxIndex((value) => (value === 0 ? filteredImages.length - 1 : value - 1))} className="absolute left-4 rounded-full bg-white/10 p-2 text-white">
            <ArrowRight className="h-5 w-5 rotate-180" />
          </button>
          <div className="relative h-[75vh] w-full max-w-4xl">
            <Image src={filteredImages[lightboxIndex].image} alt={filteredImages[lightboxIndex].title} fill className="object-contain" />
          </div>
          <button onClick={() => setLightboxIndex((value) => (value === filteredImages.length - 1 ? 0 : value + 1))} className="absolute right-4 rounded-full bg-white/10 p-2 text-white">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      ) : null}
    </section>
  );
}

function EventsPage({ data, tenantSlug }: { data: TenantSiteData; tenantSlug?: string }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const upcomingEvents = data.events.filter((event) => event.status === "Upcoming");
  const pastEvents = data.events.filter((event) => event.status === "Past");
  const featured = upcomingEvents[0] || data.events[0];
  const countdown = useCountdown(featured?.date || "");

  const filteredUpcoming = upcomingEvents.filter((event) => activeCategory === "All" || event.category === activeCategory);
  const filteredPast = pastEvents.filter((event) => activeCategory === "All" || event.category === activeCategory);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Events & Activities</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {data.eventsPage.categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm ${activeCategory === category ? "text-white" : "bg-slate-100 text-slate-700"}`}
            style={activeCategory === category ? { backgroundColor: data.theme.primary } : undefined}
          >
            {category}
          </button>
        ))}
      </div>

      {featured ? (
        <Card className="mt-6 overflow-hidden border-slate-200">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="relative min-h-[280px]">
              <Image src={featured.image} alt={featured.title} fill className="object-cover" />
            </div>
            <CardContent className="flex flex-col justify-center p-6">
              <Badge className="w-fit">{featured.category}</Badge>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{featured.title}</p>
              <p className="mt-2 text-sm text-slate-600">{featured.summary}</p>
              <div className="mt-4 flex gap-3 text-sm text-slate-700">
                <span>{countdown.days}d</span>
                <span>{countdown.hours}h</span>
                <span>{countdown.minutes}m</span>
              </div>
              <Button asChild className="mt-5 w-fit" style={{ backgroundColor: data.theme.primary }}>
                <Link href={buildTenantHref(`/events/${featured.slug}`, tenantSlug)}>{featured.registerLabel}</Link>
              </Button>
            </CardContent>
          </div>
        </Card>
      ) : null}

      <h2 className="mt-10 text-2xl font-semibold text-slate-900">Upcoming Events</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredUpcoming.map((event) => (
          <Card key={event.slug} className="overflow-hidden border-slate-200">
            <div className="relative h-48">
              <Image src={event.image} alt={event.title} fill className="object-cover" />
              <Badge className="absolute left-3 top-3 bg-white text-slate-900">{formatDate(event.date)}</Badge>
            </div>
            <CardContent className="p-4">
              <p className="text-lg font-semibold text-slate-900">{event.title}</p>
              <p className="mt-1 text-sm text-slate-600">{event.venue}</p>
              <Button asChild size="sm" className="mt-3" style={{ backgroundColor: data.theme.primary }}>
                <Link href={buildTenantHref(`/events/${event.slug}`, tenantSlug)}>Know More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-semibold text-slate-900">Past Events</h2>
      <div className="mt-4 space-y-3">
        {filteredPast.map((event) => (
          <Card key={event.slug} className="border-slate-200">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="text-sm text-slate-500">{formatDate(event.date)}</p>
                <p className="text-base font-semibold text-slate-900">{event.title}</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={buildTenantHref("/gallery", tenantSlug)}>View Photos</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function EventDetailPage({ data, tenantSlug, eventSlug }: { data: TenantSiteData; tenantSlug?: string; eventSlug: string }) {
  const event = data.events.find((item) => item.slug === eventSlug);
  if (!event) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Event Not Found</h1>
        <Button asChild className="mt-4">
          <Link href={buildTenantHref("/events", tenantSlug)}>Back to Events</Link>
        </Button>
      </section>
    );
  }

  const related = data.events.filter((item) => item.slug !== event.slug).slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <div className="relative h-[320px] overflow-hidden rounded-2xl border border-slate-200 md:h-[420px]">
        <Image src={event.image} alt={event.title} fill className="object-cover" />
      </div>

      <h1 className="mt-6 text-4xl font-bold text-slate-900">{event.title}</h1>
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
        <span>{formatDate(event.date)}</span>
        <span>{event.time}</span>
        <span>{event.venue}</span>
      </div>
      <p className="mt-4 text-slate-700">{event.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button className="rounded-full" style={{ backgroundColor: data.theme.primary }}>
          {event.status === "Past" ? "Event Completed" : event.registerLabel}
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="#">Share on WhatsApp</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="#">Share on LinkedIn</Link>
        </Button>
      </div>

      <h2 className="mt-10 text-2xl font-semibold text-slate-900">Event Schedule</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {event.schedule.map((slot) => (
          <Card key={`${slot.time}-${slot.title}`} className="border-slate-200">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-slate-800">{slot.time}</p>
              <p className="text-sm text-slate-600">{slot.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-semibold text-slate-900">Mini Gallery</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {event.gallery.map((image, index) => (
          <div key={`${image}-${index}`} className="relative h-40 overflow-hidden rounded-xl border border-slate-200">
            <Image src={image} alt={`${event.title} ${index + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-semibold text-slate-900">Related Events</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {related.map((item) => (
          <Card key={item.slug} className="border-slate-200">
            <CardContent className="p-4">
              <p className="text-sm text-slate-500">{formatDate(item.date)}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{item.title}</p>
              <Button asChild size="sm" variant="outline" className="mt-3">
                <Link href={buildTenantHref(`/events/${item.slug}`, tenantSlug)}>Know More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function AlumniPage({ data }: { data: TenantSiteData }) {
  const [query, setQuery] = useState("");
  const [program, setProgram] = useState("All");
  const programs = ["All", ...Array.from(new Set(data.alumni.map((item) => item.program)))];
  const filtered = data.alumni.filter((item) => (program === "All" || item.program === program) && `${item.name} ${item.batchYear}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">{data.alumniPage.heading}</h1>

      <div className="mt-6 group overflow-hidden rounded-2xl border border-slate-200 p-4">
        <div className="cg-testimonial-scroll group-hover:[animation-play-state:paused] flex w-max gap-4">
          {[...data.alumni, ...data.alumni].map((alumni, index) => (
            <Card key={`${alumni.id}-${index}`} className="w-[300px] border-slate-200">
              <CardContent className="p-4">
                <div className="relative h-44 overflow-hidden rounded-xl">
                  <Image src={alumni.image} alt={alumni.name} fill className="object-cover" />
                </div>
                <p className="mt-3 text-lg font-semibold text-slate-900">{alumni.name}</p>
                <p className="text-sm text-slate-600">
                  Batch {alumni.batchYear} - {alumni.program}
                </p>
                <p className="text-sm text-slate-600">{alumni.currentOrg}</p>
                <p className="text-xs text-slate-500">{alumni.city}</p>
                <Link href={alumni.linkedin} className="mt-2 inline-flex text-xs text-slate-700 underline">
                  LinkedIn
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or batch year" className="h-10 min-w-[220px] flex-1 rounded-lg border border-slate-300 px-3 text-sm" />
        <select value={program} onChange={(event) => setProgram(event.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm">
          {programs.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((alumni) => (
          <Card key={alumni.id} className="border-slate-200">
            <CardContent className="p-4">
              <p className="text-base font-semibold text-slate-900">{alumni.name}</p>
              <p className="text-sm text-slate-600">
                {alumni.program} - {alumni.batchYear}
              </p>
              <p className="mt-2 text-sm text-slate-600">{alumni.quote}</p>
              <p className="mt-2 text-xs font-medium text-slate-700">{alumni.achievement}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 text-2xl font-semibold text-slate-900">{data.alumniPage.connectHeading}</h2>
      <form className="mt-4 grid gap-3 md:grid-cols-2">
        <input placeholder="Name" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
        <input placeholder="Email" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
        <input placeholder="Batch Year" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
        <input placeholder="Current Role" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
        <input placeholder="LinkedIn URL" className="h-11 rounded-lg border border-slate-300 px-3 text-sm md:col-span-2" />
        <Button className="w-fit" style={{ backgroundColor: data.theme.primary }}>
          Submit
        </Button>
      </form>
    </section>
  );
}

function BlogPage({ data, tenantSlug }: { data: TenantSiteData; tenantSlug?: string }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = data.blogPage.categories;
  const filtered = data.blogPosts.filter((post) => (category === "All" || post.category === category) && `${post.title} ${post.excerpt}`.toLowerCase().includes(query.toLowerCase()));
  const featured = filtered[0] || data.blogPosts[0];
  const rest = filtered.filter((post) => post.slug !== featured?.slug);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">News & Updates</h1>
      <div className="mt-4 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles" className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm" />
        </div>
        {categories.map((item) => (
          <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm ${category === item ? "text-white" : "bg-slate-100 text-slate-700"}`} style={category === item ? { backgroundColor: data.theme.primary } : undefined}>
            {item}
          </button>
        ))}
      </div>

      {featured ? (
        <Card className="mt-6 overflow-hidden border-slate-200">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="relative min-h-[280px]">
              <Image src={featured.image} alt={featured.title} fill className="object-cover" />
            </div>
            <CardContent className="p-6">
              <Badge>{featured.category}</Badge>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{featured.title}</p>
              <p className="mt-2 text-sm text-slate-600">{featured.excerpt}</p>
              <p className="mt-3 text-xs text-slate-500">
                {featured.author} - {formatDate(featured.date)}
              </p>
              <Button asChild className="mt-4" style={{ backgroundColor: data.theme.primary }}>
                <Link href={buildTenantHref(`/blog/${featured.slug}`, tenantSlug)}>Read More</Link>
              </Button>
            </CardContent>
          </div>
        </Card>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
          <Card key={post.slug} className="overflow-hidden border-slate-200">
            <div className="relative h-44">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <Badge variant="secondary">{post.category}</Badge>
              <p className="mt-2 text-lg font-semibold text-slate-900">{post.title}</p>
              <p className="mt-1 text-sm text-slate-600">{post.excerpt}</p>
              <p className="mt-2 text-xs text-slate-500">
                {post.author} - {formatDate(post.date)}
              </p>
              <Link href={buildTenantHref(`/blog/${post.slug}`, tenantSlug)} className="mt-3 inline-flex text-sm font-semibold text-slate-800">
                Read More
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function BlogDetailPage({ data, tenantSlug, blogSlug }: { data: TenantSiteData; tenantSlug?: string; blogSlug: string }) {
  const post = data.blogPosts.find((item) => item.slug === blogSlug);
  if (!post) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Article Not Found</h1>
        <Button asChild className="mt-4">
          <Link href={buildTenantHref("/blog", tenantSlug)}>Back to Blog</Link>
        </Button>
      </section>
    );
  }

  const related = data.blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <p className="text-xs text-slate-500">
        Home &gt; Blog &gt; {post.title}
      </p>
      <div className="mt-3 flex items-center gap-3 text-sm text-slate-600">
        <Badge>{post.category}</Badge>
        <span>{formatDate(post.date)}</span>
      </div>
      <h1 className="mt-4 text-4xl font-bold text-slate-900">{post.title}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[56px_1fr]">
        <div className="hidden lg:flex lg:flex-col lg:gap-2">
          <Link href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:text-slate-900">
            <MessageCircle className="h-4 w-4" />
          </Link>
          <Link href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:text-slate-900">
            <Facebook className="h-4 w-4" />
          </Link>
          <Link href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:text-slate-900">
            <Linkedin className="h-4 w-4" />
          </Link>
        </div>
        <div>
          <div className="relative h-[320px] overflow-hidden rounded-2xl border border-slate-200">
            <Image src={post.image} alt={post.title} fill className="object-cover" />
          </div>
          <Card className="mt-5 border-slate-200">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-slate-900">{post.author}</p>
              <p className="text-xs text-slate-500">{post.authorRole}</p>
            </CardContent>
          </Card>
          <div className="mt-5 space-y-4">
            {post.content.map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-slate-700">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-slate-900">Related Articles</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {related.map((item) => (
            <Card key={item.slug} className="border-slate-200">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                <Button asChild size="sm" variant="outline" className="mt-3">
                  <Link href={buildTenantHref(`/blog/${item.slug}`, tenantSlug)}>Read</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="mt-8 border-slate-200">
        <CardContent className="p-5">
          <p className="text-lg font-semibold text-slate-900">Have a question? Contact Us</p>
          <p className="mt-2 text-sm text-slate-600">Our admissions team can help with programs, fees, and eligibility.</p>
          <Button asChild className="mt-4">
            <Link href={buildTenantHref("/contact", tenantSlug)}>Contact</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function ContactPage({ data }: { data: TenantSiteData }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Contact Us</h1>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <MapPin className="h-5 w-5 text-slate-700" />
            <p className="mt-2 text-sm text-slate-700">{data.institution.address}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <Phone className="h-5 w-5 text-slate-700" />
            <p className="mt-2 text-sm text-slate-700">{data.institution.phone}</p>
            <p className="text-sm text-slate-700">{data.institution.whatsapp}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <Mail className="h-5 w-5 text-slate-700" />
            <p className="mt-2 text-sm text-slate-700">{data.institution.email}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <iframe
          title="Campus location"
          src={data.contactPage.mapEmbedUrl}
          className="h-[400px] w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <p className="text-xl font-semibold text-slate-900">Quick Inquiry</p>
            <form className="mt-4 grid gap-3">
              <input placeholder="Name" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
              <input placeholder="Phone" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
              <input placeholder="Email" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
              <input placeholder="Subject" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
              <Textarea placeholder="Message" className="min-h-[130px]" />
              <Button style={{ backgroundColor: data.theme.primary }}>Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <p className="text-xl font-semibold text-slate-900">Office Hours</p>
            <p className="mt-2 text-sm text-slate-600">{data.contactPage.officeHours}</p>
            <p className="mt-5 text-sm font-semibold text-slate-800">Social Links</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.socialLinks.map((item) => (
                <Badge key={item.platform} variant="secondary">
                  {item.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function ApplyPage({ data, orgType }: { data: TenantSiteData; orgType: string }) {
  const [step, setStep] = useState(1);
  const [submittedId, setSubmittedId] = useState("");
  const [formState, setFormState] = useState({
    fullName: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    program: data.programs[0]?.name || "",
    previousSchool: "",
    marks: "",
    streamOrClass: "",
    examScore: "",
  });

  const updateField = (field: keyof typeof formState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step < 3) {
      setStep((current) => Math.min(3, current + 1));
      return;
    }
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    const id = `${data.applyPage.confirmationPrefix}-${randomPart}`;
    setSubmittedId(id);
  };

  if (submittedId) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 pb-24 pt-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900">Application Received</h1>
        <p className="mt-4 text-lg text-slate-700">
          Application ID: <span className="font-semibold">{submittedId}</span>
        </p>
        <p className="mt-2 text-slate-600">Our admissions team will contact you within 24 hours.</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">{data.applyPage.heading}</h1>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {data.applyPage.stepTitles.map((title, index) => {
          const active = step === index + 1;
          return (
            <div key={title} className={`rounded-lg border px-4 py-3 text-sm ${active ? "text-white" : "border-slate-200 bg-slate-50 text-slate-600"}`} style={active ? { backgroundColor: data.theme.primary, borderColor: data.theme.primary } : undefined}>
              Step {index + 1}: {title}
            </div>
          );
        })}
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        {step === 1 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <input value={formState.fullName} onChange={(event) => updateField("fullName", event.target.value)} placeholder="Full Name" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" required />
            <input value={formState.dob} onChange={(event) => updateField("dob", event.target.value)} type="date" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" required />
            <input value={formState.gender} onChange={(event) => updateField("gender", event.target.value)} placeholder="Gender" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" required />
            <input value={formState.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="Phone" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" required />
            <input value={formState.email} onChange={(event) => updateField("email", event.target.value)} type="email" placeholder="Email" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" required />
            <input value={formState.address} onChange={(event) => updateField("address", event.target.value)} placeholder="Address" className="h-11 rounded-lg border border-slate-300 px-3 text-sm sm:col-span-2" required />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <select value={formState.program} onChange={(event) => updateField("program", event.target.value)} className="h-11 rounded-lg border border-slate-300 px-3 text-sm">
              {data.programs.map((program) => (
                <option key={program.id} value={program.name}>
                  {program.name}
                </option>
              ))}
            </select>
            <input value={formState.previousSchool} onChange={(event) => updateField("previousSchool", event.target.value)} placeholder="Previous School / College" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
            <input value={formState.marks} onChange={(event) => updateField("marks", event.target.value)} placeholder="Percentage / Marks" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
            {orgType === "school" ? (
              <input value={formState.streamOrClass} onChange={(event) => updateField("streamOrClass", event.target.value)} placeholder="Class Interested (1-12)" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
            ) : null}
            {orgType === "junior-college" ? (
              <input value={formState.streamOrClass} onChange={(event) => updateField("streamOrClass", event.target.value)} placeholder="Stream Preference + 10th Marks" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
            ) : null}
            {orgType === "coaching" ? (
              <input value={formState.examScore} onChange={(event) => updateField("examScore", event.target.value)} placeholder="Batch Preference + Previous JEE/NEET Score" className="h-11 rounded-lg border border-slate-300 px-3 text-sm" />
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900">Review Summary</p>
            <p>Name: {formState.fullName}</p>
            <p>Phone: {formState.phone}</p>
            <p>Email: {formState.email}</p>
            <p>Program: {formState.program}</p>
            <p>Previous School/College: {formState.previousSchool}</p>
            <p>Marks: {formState.marks}</p>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={() => setStep((current) => Math.max(1, current - 1))}>
              Previous
            </Button>
          ) : null}
          <Button type="submit" style={{ backgroundColor: data.theme.primary }}>
            {step < 3 ? "Continue" : "Submit Application"}
          </Button>
        </div>
      </form>
    </section>
  );
}

function MandatoryDisclosurePage({ data, orgType }: { data: TenantSiteData; orgType: string }) {
  if (orgType === "coaching") {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900">Mandatory Disclosure</h1>
        <Card className="mt-6 border-slate-200">
          <CardContent className="p-6">
            <p className="text-lg font-semibold text-slate-900">Not Applicable for Coaching Institutes</p>
            <p className="mt-2 text-sm text-slate-600">
              This page is mandatory for schools and junior colleges. Coaching organizations can still publish governance and policy details for transparency.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  const sections = [
    { title: "Institution Details", rows: data.mandatoryDisclosurePage.institutionDetails },
    { title: "Trust / Society Details", rows: data.mandatoryDisclosurePage.trustDetails },
    { title: "Affiliation Details", rows: data.mandatoryDisclosurePage.affiliationDetails },
    { title: "Infrastructure Details", rows: data.mandatoryDisclosurePage.infrastructureDetails },
    { title: "Staff Details", rows: data.mandatoryDisclosurePage.staffDetails },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Mandatory Disclosure</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600">
        Statutory disclosures for board compliance, institutional transparency, and parent/student reference.
      </p>

      <div className="mt-6 grid gap-4">
        {sections.map((section) => (
          <Card key={section.title} className="border-slate-200">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-slate-900">{section.title}</p>
              <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
                <table className="min-w-full text-sm">
                  <tbody>
                    {section.rows.map((row) => (
                      <tr key={row.label} className="border-t border-slate-200 first:border-t-0">
                        <td className="w-[35%] bg-slate-50 px-3 py-2 font-medium text-slate-700">{row.label}</td>
                        <td className="px-3 py-2 text-slate-600">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <p className="text-lg font-semibold text-slate-900">Committees</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              {data.mandatoryDisclosurePage.committees.map((item) => (
                <div key={item.name} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="font-medium text-slate-800">{item.name}</p>
                  {item.contact ? <p className="text-xs text-slate-500">{item.contact}</p> : null}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <p className="text-lg font-semibold text-slate-900">Disclosure Documents</p>
            <div className="mt-3 space-y-2">
              {data.mandatoryDisclosurePage.documents.map((doc) => (
                <div key={doc.title} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{doc.title}</p>
                    <p className="text-xs text-slate-500">{doc.category}</p>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link href={doc.url}>
                      <Download className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function CommitteesPage({ data, orgType }: { data: TenantSiteData; orgType: string }) {
  if (orgType === "coaching") {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-slate-900">Committees</h1>
        <p className="mt-3 text-sm text-slate-600">
          Committee publication is optional for coaching organizations. You can still list support and grievance contacts here.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Committees</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600">{data.committeesPage.description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {data.committeesPage.committees.map((committee) => (
          <Card key={committee.id} className="border-slate-200">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-slate-900">{committee.name}</p>
              <p className="mt-2 text-sm text-slate-600">{committee.purpose}</p>
              <div className="mt-4 space-y-1 text-xs text-slate-600">
                <p>
                  <span className="font-semibold text-slate-700">Chairperson:</span> {committee.chairperson}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Members:</span> {committee.members}
                </p>
                <p>
                  <span className="font-semibold text-slate-700">Contact:</span> {committee.contact}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function InfrastructurePage({ data }: { data: TenantSiteData }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Infrastructure & Facilities</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600">{data.infrastructurePage.description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.infrastructurePage.facilities.map((facility) => (
          <Card key={facility.id} className="overflow-hidden border-slate-200">
            <div className="relative h-44">
              <Image src={facility.image} alt={facility.title} fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <p className="text-lg font-semibold text-slate-900">{facility.title}</p>
              <p className="mt-2 text-sm text-slate-600">{facility.description}</p>
              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                {facility.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function AcademicCalendarPage({ data }: { data: TenantSiteData }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Academic Calendar</h1>
          <p className="mt-2 text-sm text-slate-600">
            Academic Year {data.academicCalendarPage.year} - {data.academicCalendarPage.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.academicCalendarPage.downloads.map((item) => (
            <Button key={item.label} asChild size="sm" variant="outline">
              <Link href={item.url}>
                <Download className="mr-1.5 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">End Date</th>
            </tr>
          </thead>
          <tbody>
            {data.academicCalendarPage.entries.map((entry) => (
              <tr key={entry.id} className="border-t border-slate-200">
                <td className="px-4 py-3 font-medium text-slate-800">{entry.title}</td>
                <td className="px-4 py-3 text-slate-600">{entry.category}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(entry.startDate)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(entry.endDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SyllabusPage({ data, orgType }: { data: TenantSiteData; orgType: string }) {
  const visibleGroups = data.syllabusPage.groups.filter((group) => group.orgTypes.includes(orgType));

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Syllabus & Curriculum</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600">{data.syllabusPage.description}</p>

      <div className="mt-6 space-y-4">
        {visibleGroups.map((group) => (
          <Card key={group.id} className="border-slate-200">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-slate-900">{group.title}</p>
              <div className="mt-4 grid gap-2 md:grid-cols-2">
                {group.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                    <p className="text-sm text-slate-700">{item.name}</p>
                    <Button asChild size="sm" variant="outline">
                      <Link href={item.pdfUrl}>
                        <Download className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ExaminationsPage({ data }: { data: TenantSiteData }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Examinations & Assessment</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600">{data.examinationsPage.description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {data.examinationsPage.patterns.map((pattern) => (
          <Card key={pattern.title} className="border-slate-200">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-slate-900">{pattern.title}</p>
              <p className="mt-2 text-sm text-slate-600">{pattern.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <p className="text-lg font-semibold text-slate-900">Evaluation Criteria</p>
            <div className="mt-3 space-y-2">
              {data.examinationsPage.assessments.map((assessment) => (
                <div key={assessment.title} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="text-sm text-slate-700">{assessment.title}</p>
                  <Badge variant="secondary">{assessment.weightage}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <p className="text-lg font-semibold text-slate-900">Upcoming Schedules</p>
            <div className="mt-3 space-y-2">
              {data.examinationsPage.schedules.map((schedule) => (
                <div key={`${schedule.name}-${schedule.date}`} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                  <p className="text-sm text-slate-700">{schedule.name}</p>
                  <p className="text-xs text-slate-500">{formatDate(schedule.date)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {data.examinationsPage.downloads.map((item) => (
          <Button key={item.label} asChild size="sm" variant="outline">
            <Link href={item.url}>
              <Download className="mr-1.5 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}

function StudentsCornerPage({ data, tenantSlug, orgType }: { data: TenantSiteData; tenantSlug?: string; orgType: string }) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Student Corner</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600">{data.studentsPage.description}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.studentsPage.quickLinks.map((item) => (
          <Card key={item.href} className="border-slate-200">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-slate-900">{item.label}</p>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              <Button asChild size="sm" variant="outline" className="mt-4">
                <Link href={buildTenantHref(item.href, tenantSlug)}>
                  Open
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {orgType !== "coaching" ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-slate-900">Parent Corner</p>
              <div className="mt-3 space-y-2">
                {data.studentsPage.parentCorner.map((item) => (
                  <div key={item.label} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                    <p className="text-sm font-medium text-slate-700">{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-slate-900">Rules & Policies</p>
              <ul className="mt-3 space-y-2">
                {data.studentsPage.studentPolicies.map((policy) => (
                  <li key={policy} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <span>{policy}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </section>
  );
}

function DownloadsPage({ data }: { data: TenantSiteData }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const rows = data.downloadsPage.resources
    .filter((resource) => category === "All" || resource.category === category)
    .filter((resource) => resource.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Downloads & Resources</h1>
      <p className="mt-3 max-w-3xl text-sm text-slate-600">{data.downloadsPage.description}</p>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search downloads"
            className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm"
          />
        </div>
        {data.downloadsPage.categories.map((item) => (
          <button
            key={item}
            onClick={() => setCategory(item)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${category === item ? "text-white" : "bg-slate-100 text-slate-700"}`}
            style={category === item ? { backgroundColor: data.theme.primary } : undefined}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        {rows.map((resource, index) => (
          <div key={resource.id} className={`flex flex-wrap items-center justify-between gap-3 px-4 py-4 ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}`}>
            <div>
              <p className="text-sm font-semibold text-slate-800">{resource.title}</p>
              <p className="text-xs text-slate-500">
                {resource.category} - {formatDate(resource.date)}
              </p>
            </div>
            <Button asChild size="sm">
              <Link href={resource.url}>
                <Download className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
        {rows.length === 0 ? <p className="px-4 py-8 text-center text-sm text-slate-500">No files found for this filter.</p> : null}
      </div>
    </section>
  );
}

function GlobalSearchPage({ data, tenantSlug, initialQuery }: { data: TenantSiteData; tenantSlug?: string; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery || "");
  const [typeFilter, setTypeFilter] = useState("All");

  const results = useMemo(() => {
    const rows = [
      ...data.notices.map((item) => ({
        id: `notice-${item.id}`,
        type: "Notice",
        title: item.title,
        description: item.summary,
        href: buildTenantHref(`/notices/${item.id}`, tenantSlug),
        date: item.date,
      })),
      ...data.events.map((item) => ({
        id: `event-${item.slug}`,
        type: "Event",
        title: item.title,
        description: item.summary,
        href: buildTenantHref(`/events/${item.slug}`, tenantSlug),
        date: item.date,
      })),
      ...data.blogPosts.map((item) => ({
        id: `blog-${item.slug}`,
        type: "Blog",
        title: item.title,
        description: item.excerpt,
        href: buildTenantHref(`/blog/${item.slug}`, tenantSlug),
        date: item.date,
      })),
      ...data.programs.map((item) => ({
        id: `program-${item.id}`,
        type: "Program",
        title: item.name,
        description: item.description,
        href: buildTenantHref("/programs", tenantSlug),
        date: "",
      })),
      ...data.faculty.map((item) => ({
        id: `faculty-${item.id}`,
        type: "Faculty",
        title: item.name,
        description: `${item.designation} - ${item.subject}`,
        href: buildTenantHref("/about", tenantSlug),
        date: "",
      })),
      ...data.downloadsPage.resources.map((item) => ({
        id: `download-${item.id}`,
        type: "Download",
        title: item.title,
        description: item.category,
        href: buildTenantHref("/downloads", tenantSlug),
        date: item.date,
      })),
    ];

    return rows.filter((row) => {
      const matchType = typeFilter === "All" || row.type === typeFilter;
      const term = query.trim().toLowerCase();
      const matchTerm = !term || `${row.title} ${row.description}`.toLowerCase().includes(term);
      return matchType && matchTerm;
    });
  }, [data, query, tenantSlug, typeFilter]);

  const filters = ["All", "Notice", "Event", "Blog", "Program", "Faculty", "Download"];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-14 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Global Site Search</h1>
      <div className="mt-5 flex flex-wrap gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search notices, events, blogs, programs, faculty..."
            className="h-11 w-full rounded-lg border border-slate-300 pl-10 pr-3 text-sm"
          />
        </div>
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setTypeFilter(filter)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${typeFilter === filter ? "text-white" : "bg-slate-100 text-slate-700"}`}
            style={typeFilter === filter ? { backgroundColor: data.theme.primary } : undefined}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3">
        {results.map((item) => (
          <Card key={item.id} className="border-slate-200">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <Badge variant="secondary">{item.type}</Badge>
                <p className="mt-2 text-base font-semibold text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">{item.description}</p>
                {item.date ? <p className="mt-1 text-xs text-slate-500">{formatDate(item.date)}</p> : null}
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href={item.href}>
                  Open
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {results.length === 0 ? <p className="rounded-xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500">No results found. Try broader keywords.</p> : null}
      </div>
    </section>
  );
}

function SystemMessagePage({
  title,
  description,
  tenantSlug,
}: {
  title: string;
  description: string;
  tenantSlug?: string;
}) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-700">
        <X className="h-6 w-6" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
      <p className="mt-3 text-slate-600">{description}</p>
      <div className="mt-5 flex justify-center gap-3">
        <Button asChild>
          <Link href={buildTenantHref("/", tenantSlug)}>Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={buildTenantHref("/contact", tenantSlug)}>Contact Support</Link>
        </Button>
      </div>
    </section>
  );
}

function NotFoundRoute({ tenantSlug }: { tenantSlug?: string }) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 pb-20 pt-16 text-center sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-2 text-slate-600">The requested college website page could not be found.</p>
      <Button asChild className="mt-4">
        <Link href={buildTenantHref("/", tenantSlug)}>Back to Home</Link>
      </Button>
    </section>
  );
}

export function TenantWebsiteHomeClient({ data, tenantSlug, segments = [] }: TenantWebsiteHomeClientProps) {
  const orgType = normalizeOrgType(data.institution.type);
  const programLabel = resolveProgramLabel(orgType);
  const facultyLabel = resolveFacultyLabel(orgType);
  const routeKey = segments.join("/");
  const isHome = routeKey.length === 0;
  const [isScrolled, setIsScrolled] = useState(false);
  const [fontScale, setFontScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const content = useMemo(() => {
    const primary = segments[0];
    const secondary = segments[1];
    const decodedSecondary = decodeRouteSegment(secondary);

    if (!primary) {
      return <HomePage data={data} tenantSlug={tenantSlug} orgType={orgType} programLabel={programLabel} facultyLabel={facultyLabel} />;
    }
    if (primary === "about") return <AboutPage data={data} />;
    if (primary === "programs") return <ProgramsPage data={data} tenantSlug={tenantSlug} />;
    if (primary === "notices" && secondary) return <NoticeDetailPage data={data} tenantSlug={tenantSlug} noticeId={secondary} />;
    if (primary === "notices") return <NoticesPage data={data} tenantSlug={tenantSlug} />;
    if (primary === "merit-list") return <MeritPage data={data} />;
    if (primary === "fees") return <FeesPage data={data} tenantSlug={tenantSlug} />;
    if (primary === "gallery") return <GalleryPage data={data} />;
    if (primary === "events" && secondary) return <EventDetailPage data={data} tenantSlug={tenantSlug} eventSlug={secondary} />;
    if (primary === "events") return <EventsPage data={data} tenantSlug={tenantSlug} />;
    if (primary === "alumni") return <AlumniPage data={data} />;
    if (primary === "blog" && secondary) return <BlogDetailPage data={data} tenantSlug={tenantSlug} blogSlug={secondary} />;
    if (primary === "blog") return <BlogPage data={data} tenantSlug={tenantSlug} />;
    if (primary === "contact") return <ContactPage data={data} />;
    if (primary === "apply") return <ApplyPage data={data} orgType={orgType} />;
    if (primary === "mandatory-disclosure") return <MandatoryDisclosurePage data={data} orgType={orgType} />;
    if (primary === "committees") return <CommitteesPage data={data} orgType={orgType} />;
    if (primary === "infrastructure") return <InfrastructurePage data={data} />;
    if (primary === "academic-calendar") return <AcademicCalendarPage data={data} />;
    if (primary === "syllabus") return <SyllabusPage data={data} orgType={orgType} />;
    if (primary === "examinations") return <ExaminationsPage data={data} />;
    if (primary === "students") return <StudentsCornerPage data={data} tenantSlug={tenantSlug} orgType={orgType} />;
    if (primary === "downloads") return <DownloadsPage data={data} />;
    if (primary === "search") return <GlobalSearchPage data={data} tenantSlug={tenantSlug} initialQuery={decodedSecondary} />;
    if (primary === "500") {
      return (
        <SystemMessagePage
          title="Server Error"
          description="The page encountered an internal error. Please try again in a moment."
          tenantSlug={tenantSlug}
        />
      );
    }
    if (primary === "maintenance") {
      return (
        <SystemMessagePage
          title="Scheduled Maintenance"
          description="This website section is temporarily under maintenance. Please check again shortly."
          tenantSlug={tenantSlug}
        />
      );
    }
    if (primary === "offline") {
      return (
        <SystemMessagePage
          title="Service Temporarily Unavailable"
          description="The service appears to be offline right now. Please retry or contact the institution."
          tenantSlug={tenantSlug}
        />
      );
    }
    return <NotFoundRoute tenantSlug={tenantSlug} />;
  }, [data, facultyLabel, orgType, programLabel, segments, tenantSlug]);

  return (
    <main
      className={`min-h-screen bg-white text-slate-900 ${highContrast ? "cg-high-contrast" : ""}`}
      style={{ fontFamily: "var(--font-tenant-body), sans-serif", fontSize: `${fontScale}%` }}
    >
      <a
        href="#tenant-main-content"
        className="sr-only z-[90] rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <style jsx global>{`
        @keyframes cgNoticeScroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes cgTestimonialScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 1rem));
          }
        }
        .cg-notice-scroll {
          animation: cgNoticeScroll 20s linear infinite;
        }
        .cg-testimonial-scroll {
          animation: cgTestimonialScroll 28s linear infinite;
        }
        .cg-high-contrast {
          filter: contrast(1.18);
        }
        .cg-high-contrast a {
          text-decoration-thickness: 2px;
        }
        *:focus-visible {
          outline: 2px solid #1d4ed8;
          outline-offset: 2px;
        }
      `}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: data.institution.name,
            email: data.institution.email,
            telephone: data.institution.phone,
            address: data.institution.address,
            url: tenantSlug ? `https://${tenantSlug}.classgrid.in` : "https://classgrid.in/collge_webiste",
          }),
        }}
      />

      <TopAndMainNav
        data={data}
        tenantSlug={tenantSlug}
        orgType={orgType}
        isScrolled={isScrolled}
        isHome={isHome}
        fontScale={fontScale}
        onFontScaleChange={setFontScale}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast((value) => !value)}
      />
      <div id="tenant-main-content" className={isHome ? "" : "pt-28"}>{content}</div>
      <Footer data={data} tenantSlug={tenantSlug} />
      <FloatingRails data={data} tenantSlug={tenantSlug} />
    </main>
  );
}
