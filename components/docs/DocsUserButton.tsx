"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { LogIn, LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ssoReady, setSsoReady] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        <LogIn className="h-4 w-4 text-white/60" />
        Login
      </button>
    );
  }

  // --- LOGGED IN ---
  // Determine profile photo source with default fallback
  const profilePhoto = isPlatformUser
    ? user.platformPhoto || user.image || DEFAULT_AVATAR_URL
    : user.image || DEFAULT_AVATAR_URL;

  const userName = user.name || user.email?.split("@")[0] || "User";

  return (
    <div className="hidden md:flex items-center gap-2" ref={dropdownRef}>
      {/* Dashboard button (platform users) OR Name (non-platform users) */}
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

      {/* Profile photo with dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-1 rounded-full transition-all duration-200 hover:ring-2 hover:ring-white/20 cursor-pointer"
        >
          <img
            src={profilePhoto}
            alt={userName}
            className="h-8 w-8 rounded-full object-cover border border-white/[0.12]"
            referrerPolicy="no-referrer"
          />
          <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/[0.1] bg-[#0c0c0c]/95 p-1.5 shadow-[0_16px_46px_rgba(0,0,0,0.5)] backdrop-blur-xl z-50">
            <div className="flex items-center gap-3 rounded-lg px-3 py-3">
              <img
                src={profilePhoto}
                alt={userName}
                className="h-10 w-10 rounded-full object-cover border border-white/[0.12]"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-white truncate">{userName}</span>
                {isPlatformUser && user.platformRole && (
                  <span className="text-xs text-emerald-400/80 truncate">
                    {getRoleLabel(user.platformRole)}
                    {user.orgName ? ` · ${user.orgName}` : ""}
                  </span>
                )}
                {!isPlatformUser && (
                  <span className="text-xs text-white/40 truncate">Community Member</span>
                )}
              </div>
            </div>

            <div className="mx-2 my-1 h-px bg-white/[0.08]" />

            {/* Dashboard link (platform users only) */}
            {isPlatformUser && dashboardUrl && (
              <a
                href={dashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.06] hover:text-white"
              >
                <LayoutDashboard className="h-4 w-4 text-emerald-400/70" />
                Go to Dashboard
              </a>
            )}

            {/* Sign out */}
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                signOut({ callbackUrl: pathname });
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 transition-colors hover:bg-white/[0.06] hover:text-red-400 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
