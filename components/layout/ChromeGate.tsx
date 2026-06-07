"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppChrome } from "@/components/layout/AppChrome";

type ChromeGateProps = {
  children: ReactNode;
  chromeContent?: any;
};

export function ChromeGate({ children, chromeContent }: ChromeGateProps) {
  const pathname = usePathname() || "/";
  const isStudioRoute = pathname.startsWith("/studio");

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return <AppChrome chromeContent={chromeContent}>{children}</AppChrome>;
}
