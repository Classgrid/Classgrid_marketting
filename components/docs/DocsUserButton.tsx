"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { getDashboardUrl, getRoleLabel } from "@/lib/platform-dashboard";

const DEFAULT_AVATAR_URL =
  "https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/LOGO%20AND%20%20SVG/Nikhil/ChatGPT_Image_Jul_2__2026__11_11_47_AM-removebg-preview.png";

/**
 * DocsUserButton — shows Login/Profile/Dashboard in the docs navbar.
 *
 * States:
 * - Not logged in: [Login] button
 * - Platform user logged in: [Dashboard] button + [Profile Photo]
 * - Non-platform user logged in: [Name (non-clickable)] + [Profile Photo/Initials]
 *
 * Desktop only.
 */
export function DocsUserButton() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [ssoReady, setSsoReady] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);

  const user = session?.user as any;
  const isPlatformUser = !!user?.isPlatformUser;
  const isLoggedIn = status === "authenticated" && !!user;

  // Trigger SSO token minting when a platform user logs in
  useEffect(() => {
    if (!isPlatformUser || ssoReady) return;

    const mintSsoToken = async () => {
      try {
        const res = await fetch("/api/auth/platform-sso");
        if (res.ok) {
          const data = await res.json();
          setDashboardUrl(data.dashboardUrl);
          setSsoReady(true);
        }
      } catch (err) {
        console.error("[DocsUserButton] SSO mint failed:", err);
        // Fallback: build URL client-side without SSO
        const url = getDashboardUrl({
          role: user?.platformRole,
          orgSubdomain: user?.orgSubdomain,
          orgCustomDomain: user?.orgCustomDomain,
          isCustomDomainEnabled: user?.isCustomDomainEnabled,
        });
        setDashboardUrl(url);
      }
    };

    mintSsoToken();
  }, [isPlatformUser, ssoReady, user]);

  // Build dashboard URL for non-SSO scenarios
  useEffect(() => {
    if (isPlatformUser && !dashboardUrl) {
      const url = getDashboardUrl({
        role: user?.platformRole,
        orgSubdomain: user?.orgSubdomain,
        orgCustomDomain: user?.orgCustomDomain,
        isCustomDomainEnabled: user?.isCustomDomainEnabled,
      });
      setDashboardUrl(url);
    }
  }, [isPlatformUser, dashboardUrl, user]);



  // Loading state
  if (status === "loading") {
    return (
      <div className="hidden md:flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-white/[0.06] animate-pulse" />
      </div>
    );
  }

  // --- NOT LOGGED IN ---
  if (!isLoggedIn) {
    return (
      <button
        type="button"
        onClick={() => signIn(undefined, { callbackUrl: pathname })}
        className="hidden md:inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 text-sm font-medium tracking-tight text-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.2] hover:text-white cursor-pointer"
      >
        Sign up
      </button>
    );
  }

  // --- LOGGED IN ---
  // If platform user, use strictly their platform photo or default. No Google photo!
  const profilePhoto = isPlatformUser
    ? user.platformPhoto || DEFAULT_AVATAR_URL
    : user.image || DEFAULT_AVATAR_URL;

  const userName = user.name || user.email?.split("@")[0] || "User";

  return (
    <div className="hidden md:flex items-center gap-2">
      {/* Dashboard button OR Name */}
      {isPlatformUser ? (
        <a
          href={dashboardUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.08] px-3 text-sm font-medium tracking-tight text-emerald-400 transition-all duration-200 hover:bg-emerald-500/[0.14] hover:border-emerald-500/30 hover:text-emerald-300 cursor-pointer"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Dashboard</span>
        </a>
      ) : (
        <span className="inline-flex h-9 items-center px-3 text-sm font-medium tracking-tight text-white/70 select-none">
          {userName}
        </span>
      )}

      {/* Simple, non-clickable profile photo */}
      <img
        src={profilePhoto}
        alt={userName}
        className="h-9 w-9 rounded-full object-cover border border-white/[0.12] ml-1"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
