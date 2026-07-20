"use client";

import { useSession } from "next-auth/react";
import type { ReactNode } from "react";

interface PlatformUserGateProps {
  children: ReactNode;
  /** Content to show for platform users instead of children. Defaults to null (hidden). */
  fallback?: ReactNode;
}

/**
 * Hides its children when the current user is a logged-in platform user.
 * Use this to wrap marketing/sales CTAs (e.g. "Book a Demo") that should
 * not be shown to students, faculty, or admins who already use Classgrid.
 *
 * For guests and unauthenticated visitors, children render normally.
 */
export function PlatformUserGate({ children, fallback = null }: PlatformUserGateProps) {
  const { data: session } = useSession();
  const isPlatformUser = !!(session?.user as any)?.isPlatformUser;

  if (isPlatformUser) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
