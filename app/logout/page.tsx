"use client";

import { useEffect, useState, Suspense } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

function LogoutContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    const doLogout = async () => {
      // 1. Clear the Platform session cookie
      try {
        const BACKEND_URL = process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";
        await fetch(`${BACKEND_URL}/api/auth/logout`, { 
          method: "POST",
          credentials: "include" 
        });
      } catch (err) {
        console.error("Failed to clear platform session", err);
      }

      // 2. Clear NextAuth session & redirect
      const timer = setTimeout(() => {
        signOut({ callbackUrl });
      }, 3000);
    };

    doLogout();
  }, [callbackUrl]);

  return null; // The visual UI is handled by the parent
}

export default function LogoutPage() {
  return (
    <div className="min-h-[80vh] bg-background text-foreground flex flex-col font-sans items-center justify-center">
      
      <Suspense fallback={null}>
        <LogoutContent />
      </Suspense>

      {/* Top Left Logo - matching Classgrid's exact login page design */}
      <Link href="/" className="absolute top-6 left-8 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="Classgrid Logo" className="w-6 h-6 object-contain" />
        <span className="font-bold text-lg tracking-wide uppercase">CLASSGRID</span>
      </Link>

      <div className="flex flex-col items-center justify-center p-4 text-center space-y-4">
        <Spinner className="w-8 h-8 text-slate-500 dark:text-[#888888]" />
        <h1 className="text-xl font-medium tracking-tight text-slate-900 dark:text-[#f1f1f1]">
          Signing you out of Classgrid...
        </h1>
        <p className="text-[14px] text-slate-500 dark:text-[#888888]">
          Please wait a moment while we securely end your session.
        </p>
      </div>

    </div>
  );
}
