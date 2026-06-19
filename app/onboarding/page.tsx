"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";

function OnboardingContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  
  // Status states for the live checker
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Debounce ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Helper: redirect away from onboarding (user already has a username)
  const redirectAway = () => {
    const sso = searchParams.get("sso");
    const sig = searchParams.get("sig");
    const nextUrl = searchParams.get("next");

    if (sso && sig) {
      window.location.replace(`/api/sso/discourse?sso=${encodeURIComponent(sso)}&sig=${encodeURIComponent(sig)}`);
    } else if (nextUrl) {
      window.location.replace(nextUrl);
    } else {
      router.replace("/support/inquiry");
    }
  };

  // Load profile to check if they already completed onboarding
  useEffect(() => {
    if (status !== "authenticated") return;

    // FAST PATH: If the JWT already has a username, skip instantly (no API call)
    if ((session?.user as any)?.forumUsername) {
      redirectAway();
      return;
    }

    // SLOW PATH: JWT doesn't have username yet (first-time sign-in or token not refreshed)
    const checkProfile = async () => {
      try {
        const res = await fetch("/api/get-profile", { cache: "no-store" });
        const data = await res.json();
        
        // Prefill name if available
        if (data.name && !name) {
          setName(data.name);
        } else if (session?.user?.name && !name) {
          setName(session.user.name);
        }

        // If they already have a username, they don't need onboarding!
        if (data.hasProfile) {
          redirectAway();
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
        if (session?.user?.name && !name) setName(session.user.name);
      }
    };
    
    checkProfile();
  }, [status, session]);

  // The Live Checking Logic (Debouncer)
  const usernameRegex = /^[a-zA-Z0-9_]{5,20}$/;

  useEffect(() => {
    // If empty, hide the error completely (pristine state)
    if (username.length === 0) {
      setIsChecking(false);
      setIsAvailable(null);
      setMessage("");
      return;
    }

    // If they started typing but it's too short
    if (username.length > 0 && username.length < 5) {
      setIsChecking(false);
      setIsAvailable(null);
      setMessage("Username must be at least 5 characters.");
      return;
    }

    // Client-side format check — catch bad chars before hitting the API
    if (!usernameRegex.test(username)) {
      setIsChecking(false);
      setIsAvailable(false);
      setMessage("Only letters, numbers, and underscores allowed (max 20 chars).");
      return;
    }

    // Clear previous timeout
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Abort any in-flight request from a previous keystroke
    const controller = new AbortController();

    setIsChecking(true);
    setIsAvailable(null);
    setMessage("");

    // Set new timeout to wait 400ms after they stop typing
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/check-username?username=${encodeURIComponent(username)}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        
        setIsChecking(false);
        setIsAvailable(data.available ?? false);
        setMessage(data.message || "");
      } catch (err: unknown) {
        // Don't update state if we intentionally aborted
        if (err instanceof Error && err.name === "AbortError") return;
        setIsChecking(false);
        setIsAvailable(false);
        setMessage("Could not check username. Please try again.");
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      controller.abort(); // Cancel in-flight request on cleanup
    };
  }, [username]);

  // Show a loading screen while NextAuth loads the session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  // If not logged in, boot them to login
  if (status === "unauthenticated") {
    router.replace("/login");
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAvailable) return;
    if (!name.trim()) {
      setMessage("Please enter your Full Name.");
      return;
    }

    setIsSaving(true);
    try {
      // We will build this API next!
      const res = await fetch("/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name }),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      // Where do we go next? Check if there was an SSO redirect waiting
      const sso = searchParams.get("sso");
      const sig = searchParams.get("sig");
      const next = searchParams.get("next");

      if (sso && sig) {
        window.location.href = `/api/sso/discourse?sso=${encodeURIComponent(sso)}&sig=${encodeURIComponent(sig)}`;
      } else if (next) {
        window.location.href = next;
      } else {
        router.push("/support/inquiry"); // Default fallback
      }
    } catch (err) {
      console.error(err);
      setIsSaving(false);
      setMessage("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative font-sans">
      {/* Top Left Logo */}
      <Link href="/" className="absolute top-6 left-8 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="Classgrid Logo" className="w-6 h-6 object-contain" />
        <span className="font-bold text-lg tracking-wide uppercase">CLASSGRID</span>
      </Link>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-card p-8 shadow-sm dark:border-[#2a2a2a] dark:bg-[#111111]"
        >
          <div className="mb-8 text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-[#f1f1f1]">Complete your profile</h1>
            <p className="text-[14px] text-slate-500 dark:text-[#888888]">
              Welcome to the Classgrid Community
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Email Field (Locked) */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-500 dark:text-[#888888]">Email (Verified)</label>
              <div className="flex w-full items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 dark:border-[#2a2a2a] dark:bg-[#161616]/50 dark:text-[#f1f1f1]">
                {session?.user?.email || "email@example.com"}
              </div>
            </div>

            {/* Name Field (Locked) */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-slate-500 dark:text-[#888888]">Full Name</label>
              <div className="flex w-full items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 dark:border-[#2a2a2a] dark:bg-[#161616]/50 dark:text-[#f1f1f1]">
                {name || session?.user?.name || "Your Name"}
              </div>
            </div>

            {/* Username Field with Live Checking */}
            <div className="space-y-1.5">
              <label htmlFor="username" className="text-[13px] font-medium text-slate-500 dark:text-[#888888]">Choose a Username</label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  placeholder="e.g. nikhil_dev"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
                  className={`w-full rounded-md border bg-white px-3 py-2.5 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none focus:ring-1 dark:bg-[#161616] dark:text-[#f1f1f1] dark:placeholder:text-[#555] ${
                    isAvailable === true
                      ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                      : isAvailable === false
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-slate-400 focus:ring-slate-300 dark:border-[#2a2a2a] dark:focus:border-[#444] dark:focus:ring-[#444]"
                  }`}
                />
                
                {/* Status Icon Wrapper */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <AnimatePresence mode="wait">
                    {isChecking && (
                      <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Spinner className="w-4 h-4 text-slate-400" />
                      </motion.div>
                    )}
                    {!isChecking && isAvailable === true && (
                      <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </motion.div>
                    )}
                    {!isChecking && isAvailable === false && username.length >= 5 && (
                      <motion.div key="error" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
                        <XCircle className="w-5 h-5 text-red-500" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Premium Status Message UI */}
              <AnimatePresence>
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`mt-2 flex items-center gap-2 rounded-md px-3 py-2.5 text-[13px] font-medium border ${
                      isAvailable 
                        ? "bg-green-500/10 text-green-500 border-green-500/20" 
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {isAvailable ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 shrink-0" />
                      )}
                      {message}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              type="submit"
              disabled={!isAvailable || isSaving}
              showGlow={true}
              className="w-full mt-4"
            >
              {isSaving ? <><Spinner className="w-4 h-4 mr-2" /> Saving...</> : "Continue to Forum"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Spinner className="w-6 h-6 text-muted-foreground" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
