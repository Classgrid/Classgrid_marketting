import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { headers } from "next/headers";

import { AppChrome } from "@/components/layout/AppChrome";
import { changelogFallbackEntries } from "@/content/changelog";
import { resolveChromeContent } from "@/content/homePlaceholders";
import { getHomeChrome, getLatestChangelogEntry } from "@/sanity/lib/marketing";
import { resolveTenantSiteData } from "@/lib/tenant-site";
import { NextAuthProvider } from "@/app/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-tenant-body",
  weight: ["400", "500", "600", "700"],
});

function isTenantWebsitePath(pathname: string): boolean {
  const clean = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return (
    clean === "/collge_webiste" ||
    clean.startsWith("/collge_webiste/") ||
    clean === "/collge_website" ||
    clean.startsWith("/collge_website/") ||
    clean === "/college_website" ||
    clean.startsWith("/college_website/")
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const tenantSlug = requestHeaders.get("x-tenant-slug");

  if (tenantSlug) {
    const tenantSite = await resolveTenantSiteData(tenantSlug);
    const tenantTitle = tenantSite.institution.name;
    const tenantDescription = tenantSite.hero.description;

    return {
      title: {
        default: tenantTitle,
        template: `%s | ${tenantTitle}`,
      },
      description: tenantDescription,
      openGraph: {
        title: tenantTitle,
        description: tenantDescription,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: tenantTitle,
        description: tenantDescription,
      },
    };
  }

  const homeChrome = resolveChromeContent((await getHomeChrome()) as any);
  const siteUrl = typeof homeChrome?.siteUrl === "string" ? homeChrome.siteUrl : undefined;
  const siteName = typeof homeChrome?.brandName === "string" ? homeChrome.brandName : undefined;
  const description =
    typeof homeChrome?.seo?.metaDescription === "string"
      ? homeChrome.seo.metaDescription
      : undefined;
  const defaultTitle =
    typeof homeChrome?.seo?.metaTitle === "string" && homeChrome.seo.metaTitle.trim()
      ? homeChrome.seo.metaTitle
      : siteName;

  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: siteName
      ? {
          default: defaultTitle,
          template: `%s | ${siteName}`,
        }
      : defaultTitle,
    description,
    openGraph: siteName || description || siteUrl
      ? {
          title: defaultTitle,
          description,
          url: siteUrl,
          siteName,
          type: "website",
        }
      : undefined,
    twitter: defaultTitle || description
      ? {
          card: "summary_large_image",
          title: defaultTitle,
          description,
        }
      : undefined,
  };
}

export const revalidate = 300;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const tenantSlug = requestHeaders.get("x-tenant-slug");
  const requestPath = requestHeaders.get("x-tenant-path") || "";
  const isTenantSitePage =
    requestHeaders.get("x-tenant-site-page") === "1" || isTenantWebsitePath(requestPath);
  const forcedTheme = tenantSlug || isTenantSitePage ? "light" : undefined;
  const homeChrome = resolveChromeContent((await getHomeChrome()) as any);
  const latestChangelogEntry = (await getLatestChangelogEntry()) as { releaseDate?: string } | null;
  const latestReleaseDate =
    latestChangelogEntry?.releaseDate ?? changelogFallbackEntries[0]?.releaseDate;
  // We now pass latestReleaseDate to AppChrome to handle client-side 10-day NEW badge logic

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmSans.variable} ${outfit.variable} min-h-screen bg-background text-foreground antialiased`}
      >

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme={forcedTheme ?? "dark"}
          themes={["light", "dark"]}
          disableTransitionOnChange
        >
          <NextAuthProvider>
            {isTenantSitePage ? (
              <main className="min-h-screen">{children}</main>
            ) : (
              <AppChrome chromeContent={homeChrome} latestReleaseDate={latestReleaseDate}>
                {children}
              </AppChrome>
            )}
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// force reload
