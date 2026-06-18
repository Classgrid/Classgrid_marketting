"use client";

import { useEffect, useState, Suspense } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

function LogoutContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    // Add a 3 second delay so the user actually sees the smooth logging out animation!
    const timer = setTimeout(() => {
      signOut({ callbackUrl });
    }, 3000);
    return () => clearTimeout(timer);
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
