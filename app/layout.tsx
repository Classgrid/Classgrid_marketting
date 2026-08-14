import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { AppChrome } from "@/components/layout/AppChrome";
import { changelogFallbackEntries } from "@/content/changelog";
import { resolveChromeContent } from "@/content/homePlaceholders";
import { getHomeChrome, getLatestChangelogEntry } from "@/sanity/lib/marketing";

import { NextAuthProvider } from "@/app/providers";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-heading",
});

const interBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});



export async function generateMetadata(): Promise<Metadata> {

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
    icons: {
      icon: [
        { url: "/favicon.ico?v=2", sizes: "any" },
        { url: "/favicon-32x32.png?v=2", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png?v=2", sizes: "16x16", type: "image/png" },
      ],
      apple: [
        { url: "/android-chrome-512x512.png?v=2", sizes: "512x512", type: "image/png" },
      ],
    },
    openGraph: siteName || description || siteUrl
      ? {
          title: defaultTitle,
          description,
          url: siteUrl,
          siteName,
          type: "website",
          locale: "en_IN",
          images: [
            {
              url: "/android-chrome-512x512.png",
              width: 512,
              height: 512,
              alt: "Classgrid Logo",
            },
          ],
        }
      : undefined,
    twitter: defaultTitle || description
      ? {
          card: "summary_large_image",
          title: defaultTitle,
          description,
          images: ["/android-chrome-512x512.png"],
        }
      : undefined,
    alternates: {
      canonical: siteUrl || "https://classgrid.in",
    },
    verification: {
      google: "google-site-verification-code",
    },
  };
}

export const revalidate = 300;

export default async function RootLayout({ children }: { children: ReactNode }) {
  const homeChrome = resolveChromeContent((await getHomeChrome()) as any);
  const latestChangelogEntry = (await getLatestChangelogEntry()) as { releaseDate?: string } | null;
  const latestReleaseDate =
    latestChangelogEntry?.releaseDate ?? changelogFallbackEntries[0]?.releaseDate;
  // We now pass latestReleaseDate to AppChrome to handle client-side 10-day NEW badge logic

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* JSON-LD Structured Data for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://classgrid.in/#organization",
                  "name": "Classgrid",
                  "url": "https://classgrid.in",
                  "logo": "https://classgrid.in/android-chrome-512x512.png",
                  "description": "The Operating System for Modern Education. Manage admissions, academics, operations, communication, and analytics in one unified education platform.",
                  "sameAs": [
                    "https://linkedin.com/company/classgrid",
                    "https://www.instagram.com/classgridedu/",
                    "https://www.youtube.com/@classgrid-y7f",
                    "https://www.facebook.com/profile.php?id=61588646851017"
                  ],
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+91-8623947038",
                    "contactType": "sales",
                    "availableLanguage": ["English", "Hindi", "Marathi"]
                  },
                  "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Akurdi Railway Station Road, Sector No. 26, Pradhikaran, Nigdi",
                    "addressLocality": "Pimpri-Chinchwad",
                    "addressRegion": "Maharashtra",
                    "postalCode": "411044",
                    "addressCountry": "IN"
                  }
                },
                {
                  "@type": "WebSite",
                  "@id": "https://classgrid.in/#website",
                  "name": "Classgrid",
                  "url": "https://classgrid.in",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://classgrid.in/modules?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "SoftwareApplication",
                  "@id": "https://classgrid.in/#software",
                  "name": "Classgrid",
                  "applicationCategory": "EducationalApplication",
                  "operatingSystem": "Web",
                  "url": "https://classgrid.in/product",
                  "publisher": {
                    "@id": "https://classgrid.in/#organization"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${interBody.variable} font-sans min-h-screen bg-background text-foreground antialiased selection:bg-emerald-300/30 selection:text-emerald-900 dark:selection:bg-emerald-500/30 dark:selection:text-emerald-50`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PostHogProvider>
            <NextAuthProvider>
              <AppChrome chromeContent={homeChrome} latestReleaseDate={latestReleaseDate}>
                {children}
              </AppChrome>
            </NextAuthProvider>
          </PostHogProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

// force reload
