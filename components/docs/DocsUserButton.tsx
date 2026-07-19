"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { LogIn, LayoutDashboard, LogOut, Settings, LifeBuoy } from "lucide-react";
import { getDashboardUrl, getRoleLabel, getSettingsUrl } from "@/lib/platform-dashboard";

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
  const userEmail = user.email || "";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="hidden md:flex items-center gap-2">
      {/* Dashboard button OR Name */}
      {isPlatformUser ? (
        <a
          href={dashboardUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 text-sm font-medium tracking-tight text-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-200 hover:bg-white/[0.08] hover:border-white/[0.2] hover:text-white cursor-pointer"
        >
          <span>Dashboard</span>
        </a>
      ) : (
        <span className="inline-flex h-9 items-center px-3 text-sm font-medium tracking-tight text-white/70 select-none">
          {userName}
        </span>
      )}

      {/* Profile photo with dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/20 cursor-pointer"
          aria-label="Open user menu"
        >
          <img
            src={profilePhoto}
            alt={userName}
            className="block h-9 w-9 rounded-full object-cover border border-white/[0.12] transition-opacity hover:opacity-80"
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-white/[0.08] bg-[#111] shadow-2xl shadow-black/60 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Name & Email */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-xs text-white/50 truncate mt-0.5">{userEmail}</p>
            </div>

            {/* Organization & Role */}
            {isPlatformUser && (
              <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-2.5">
                {user?.orgLogo ? (
                  <img
                    src={user.orgLogo}
                    alt={user?.orgName || "Organization"}
                    className="h-8 w-8 rounded-md object-contain bg-white p-1 flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-md bg-white/[0.06] flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-white/40">
                      {(user?.orgName || "CG").slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white/80 truncate">
                    {user?.orgName || "Classgrid"}
                  </p>
                  <p className="text-[10px] text-white/40 truncate">
                    {getRoleLabel(user?.platformRole)}
                  </p>
                </div>
              </div>
            )}

            {/* Settings */}
            {isPlatformUser && (() => {
              const settingsUrl = getSettingsUrl({
                role: user?.platformRole,
                orgSubdomain: user?.orgSubdomain,
                orgCustomDomain: user?.orgCustomDomain,
                isCustomDomainEnabled: user?.isCustomDomainEnabled,
              });
              return settingsUrl ? (
                <div className="p-1.5 border-b border-white/[0.06]">
                  <a
                    href={settingsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </a>
                </div>
              ) : null;
            })()}

            {/* Support */}
            <div className="p-1.5 border-b border-white/[0.06]">
              <a
                href="https://classgrid.in/support/ticket"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <LifeBuoy className="h-4 w-4" />
                Support
              </a>
            </div>

            {/* Logout */}
            <div className="p-1.5">
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
