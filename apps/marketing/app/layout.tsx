import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";

import { siteMeta } from "@/content/siteContent";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StructuredData } from "@/components/sections/StructuredData";

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

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.domain),
  title: {
    default: `${siteMeta.siteName} | The Operating System for Modern Education`,
    template: `%s | ${siteMeta.siteName}`,
  },
  description:
    "Classgrid unifies academics, operations, admissions, communication, finance, and AI into one education operating system for schools, colleges, and coaching institutes.",
  keywords: [
    siteMeta.siteName,
    "education ERP",
    "school management software",
    "college ERP",
    "LMS",
    "attendance",
    "SGPA",
    "admissions",
  ],
  openGraph: {
    title: `${siteMeta.siteName} | The Operating System for Modern Education`,
    description:
      "All-in-one ERP and LMS for institutions that need speed, control, and scale.",
    url: siteMeta.domain,
    siteName: siteMeta.siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.siteName,
    description: "The operating system for modern education.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${dmSans.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          themes={["light", "dark", "system"]}
          disableTransitionOnChange
        >
          <StructuredData />
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
