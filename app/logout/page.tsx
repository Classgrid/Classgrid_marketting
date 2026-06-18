"use client";

import { useEffect, useState, Suspense } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

function LogoutContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    // Add a small 1.5 second delay so the user actually sees the smooth logging out animation!
    const timer = setTimeout(() => {
      signOut({ callbackUrl });
    }, 1500);
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
