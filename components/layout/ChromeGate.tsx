"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppChrome } from "@/components/layout/AppChrome";

type ChromeGateProps = {
  children: ReactNode;
  chromeContent?: any;
};

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

export function ChromeGate({ children, chromeContent }: ChromeGateProps) {
  const pathname = usePathname() || "/";
  const isStudioRoute = pathname.startsWith("/studio");
  const isTenantSiteRoute = isTenantWebsitePath(pathname);

  if (isStudioRoute || isTenantSiteRoute) {
    return <>{children}</>;
  }

  return <AppChrome chromeContent={chromeContent}>{children}</AppChrome>;
}
