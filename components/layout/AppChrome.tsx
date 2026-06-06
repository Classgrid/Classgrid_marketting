"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { AskAiPanel } from "@/components/layout/AskAiPanel";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { RouteBreadcrumb } from "@/components/navigation/RouteBreadcrumb";
import { StructuredData } from "@/components/sections/StructuredData";
import { SmoothScrollHandler } from "@/components/layout/SmoothScrollHandler";
import { GlobalScrollProgress } from "@/components/navigation/GlobalScrollProgress";
import type { FooterStatusState } from "@/lib/footer-status";
import type { PageContext } from "@/lib/ai/rag-content";

type ChromeLink = {
  label?: string;
  href?: string;
  description?: string;
};

type ChromeSection = {
  heading?: string;
  links?: ChromeLink[];
};

type ChromeMenuItem = {
  label?: string;
  href?: string;
  sections?: ChromeSection[];
};

type ChromeColumn = {
  heading?: string;
  links?: ChromeLink[];
};

type ChromeSocialLink = {
  platform?: string;
  href?: string;
};

type ChromeContent = {
  brandName?: string;
  brandTagline?: string;
  siteUrl?: string;
  contactEmail?: string;
  logoUrl?: string;
  logoAlt?: string;
  navbarMenuItems?: ChromeMenuItem[];
  navbarSecondaryLinkLabel?: string;
  navbarSecondaryLinkHref?: string;
  navbarPrimaryCtaLabel?: string;
  navbarPrimaryCtaHref?: string;
  mobileMenuTitle?: string;
  footerColumns?: ChromeColumn[];
  footerContactHeading?: string;
  footerAddressLines?: string[];
  footerMapHref?: string;
  footerPhoneNumbers?: string[];
  footerEmailAddresses?: string[];
  footerLegalLinks?: ChromeLink[];
  footerSocialLinks?: ChromeSocialLink[];
  footerCopyrightText?: string;
  footerStatusLabel?: string;
  footerStatusState?: FooterStatusState;
  footerStatusHref?: string;
};

type AppChromeProps = {
  children: ReactNode;
  chromeContent?: ChromeContent | null;
  latestReleaseDate?: string;
};

function normalizeSlugFromPath(pathname: string) {
  const clean = pathname.split("?")[0]?.replace(/^\/+|\/+$/g, "") || "home";
  return clean.toLowerCase();
}

function cleanDocumentTitle(title: string, brandName?: string) {
  let cleaned = title.trim();
  if (brandName) {
    cleaned = cleaned.replace(new RegExp(`\\s*[|-]\\s*${brandName}\\s*$`, "i"), "");
  }
  return cleaned || brandName || "Classgrid";
}

function pagePromptForPath(pathname: string, hash?: string) {
  if (hash === "demo" || pathname === "/demo") return "Need help booking a demo?";
  if (pathname === "/pricing") return "Questions about pricing?";
  if (pathname.startsWith("/product/modules")) return "Need help understanding this module?";
  if (pathname.startsWith("/support") || pathname.startsWith("/help-center")) return "Need support on this page?";
  if (pathname.startsWith("/terms") || pathname.startsWith("/privacy") || pathname.startsWith("/cookies") || pathname.startsWith("/acceptable-use")) {
    return "Need help with this policy?";
  }
  if (pathname.includes("contact") || pathname.includes("demo")) return "Need help filling this form?";
  return "How can I help with this page?";
}

export function AppChrome({ children, chromeContent, latestReleaseDate }: AppChromeProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname.startsWith("/studio");
  const isAuthRoute = pathname === "/login" || pathname === "/profile";
  const [askAiOpen, setAskAiOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState(chromeContent?.brandName || "Classgrid");
  const [showPromptBubble, setShowPromptBubble] = useState(false);
  const [promptStorageKey, setPromptStorageKey] = useState("");
  const [currentHash, setCurrentHash] = useState("");

  useEffect(() => {
    setPageTitle(cleanDocumentTitle(document.title, chromeContent?.brandName));

    const routeSlug = normalizeSlugFromPath(pathname);
    const nextPromptStorageKey = `classgrid:ask-ai-prompt-seen:v1:${routeSlug}`;
    setPromptStorageKey(nextPromptStorageKey);

    // Delay prompt bubble appearance to prevent visual flash during hydration.
    // The 600ms wait ensures the page has fully painted before the glow appears.
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      if (sessionStorage.getItem(nextPromptStorageKey) !== "true") {
        timer = setTimeout(() => setShowPromptBubble(true), 600);
      } else {
        setShowPromptBubble(false);
      }
    } catch {
      timer = setTimeout(() => setShowPromptBubble(true), 600);
    }

    return () => { if (timer) clearTimeout(timer); };
  }, [pathname, chromeContent?.brandName]);

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash.replace(/^#/, "").trim().toLowerCase());
    };

    updateHash();
    window.addEventListener("hashchange", updateHash);
    return () => window.removeEventListener("hashchange", updateHash);
  }, []);

  useEffect(() => {
    if (!showPromptBubble) return;

    const markSeenTimer = window.setTimeout(() => {
      if (!promptStorageKey) return;
      try {
        sessionStorage.setItem(promptStorageKey, "true");
      } catch {
        // Ignore unavailable storage; the prompt will still auto-hide.
      }
    }, 100);

    const timer = window.setTimeout(() => {
      setShowPromptBubble(false);
    }, 4500);

    return () => {
      window.clearTimeout(markSeenTimer);
      window.clearTimeout(timer);
    };
  }, [showPromptBubble, promptStorageKey]);

  useEffect(() => {
    if (askAiOpen) {
      if (promptStorageKey) {
        try {
          sessionStorage.setItem(promptStorageKey, "true");
        } catch {
          // Ignore unavailable storage.
        }
      }
      setShowPromptBubble(false);
    }
  }, [askAiOpen, promptStorageKey]);

  // Signal to other components (e.g. scroll-to-top button) that AI panel is open
  useEffect(() => {
    document.body.dataset.askAiOpen = askAiOpen ? "true" : "false";
    return () => {
      document.body.dataset.askAiOpen = "false";
    };
  }, [askAiOpen]);

  const pageContext = useMemo<PageContext>(
    () => ({
      path: pathname,
      slug: normalizeSlugFromPath(pathname),
      title: pageTitle,
      hash: currentHash,
      section: currentHash || (pathname === "/demo" ? "demo" : undefined),
    }),
    [pathname, pageTitle, currentHash]
  );

  const pagePrompt = useMemo(() => pagePromptForPath(pathname, currentHash), [pathname, currentHash]);

  if (isStudioRoute || isAuthRoute) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <>
      <StructuredData
        siteName={chromeContent?.brandName}
        siteUrl={chromeContent?.siteUrl}
        contactEmail={chromeContent?.contactEmail}
        socialLinks={chromeContent?.footerSocialLinks}
      />
      <div className="relative flex min-h-screen flex-col">
        <GlobalScrollProgress />
        <Navbar
          brandName={chromeContent?.brandName}
          logoUrl={chromeContent?.logoUrl}
          logoAlt={chromeContent?.logoAlt}
          menuItems={chromeContent?.navbarMenuItems}
          secondaryLinkLabel={chromeContent?.navbarSecondaryLinkLabel}
          secondaryLinkHref={chromeContent?.navbarSecondaryLinkHref}
          primaryCtaLabel={chromeContent?.navbarPrimaryCtaLabel}
          primaryCtaHref={chromeContent?.navbarPrimaryCtaHref}
          mobileMenuTitle={chromeContent?.mobileMenuTitle}
          latestReleaseDate={latestReleaseDate}
          onAskAiClick={() => setAskAiOpen(true)}
          askAiPrompt={pagePrompt}
          showAskAiPrompt={showPromptBubble && !askAiOpen}
        />
        {pathname !== "/blog/unsubscribed" && <RouteBreadcrumb />}
        <SmoothScrollHandler />
        <main className="flex-1 overflow-x-clip">{children}</main>
        <Footer
          brandName={chromeContent?.brandName}
          brandTagline={chromeContent?.brandTagline}
          logoUrl={chromeContent?.logoUrl}
          logoAlt={chromeContent?.logoAlt}
          columns={chromeContent?.footerColumns}
          contactHeading={chromeContent?.footerContactHeading}
          addressLines={chromeContent?.footerAddressLines}
          mapHref={chromeContent?.footerMapHref}
          phoneNumbers={chromeContent?.footerPhoneNumbers}
          emailAddresses={chromeContent?.footerEmailAddresses}
          legalLinks={chromeContent?.footerLegalLinks}
          socialLinks={chromeContent?.footerSocialLinks}
          copyrightText={chromeContent?.footerCopyrightText}
          statusLabel={chromeContent?.footerStatusLabel}
          statusState={chromeContent?.footerStatusState}
          statusHref={chromeContent?.footerStatusHref}
        />
        <AskAiPanel open={askAiOpen} onOpenChange={setAskAiOpen} pageContext={pageContext} />
      </div>
    </>
  );
}
