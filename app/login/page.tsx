"use client";

import { useState, Suspense, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";

const OTP_TTL_SECONDS = 60;

/** Map NextAuth URL error codes to user-friendly messages */
const OAUTH_ERROR_MAP: Record<string, string> = {
  OAuthCallback: "Sign-in was interrupted. Please try again.",
  OAuthAccountNotLinked: "This email is already linked to another sign-in method.",
  OAuthSignin: "Could not start the sign-in flow. Please try again.",
  OAuthCreateAccount: "Could not create your account. Please try again.",
  Callback: "Something went wrong during sign-in. Please try again.",
  AccessDenied: "Access denied. You may not have permission to sign in.",
  default: "An unexpected error occurred. Please try again.",
};

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // If Discourse sent SSO params (sso + sig), complete the handshake after login
  const sso = searchParams.get("sso");
  const sig = searchParams.get("sig");

  const ssoReturnTo = (sso && sig)
    ? `/onboarding?sso=${encodeURIComponent(sso)}&sig=${encodeURIComponent(sig)}`
    : null;
  const explicitNext = searchParams.get("next");

  // After OAuth → /api/auth/post-login checks role and redirects to support/ticket or support/inquiry
  const oauthCallbackUrl = ssoReturnTo || explicitNext || "/api/auth/post-login";
  const otpSuccessUrl = ssoReturnTo || explicitNext || "/api/auth/post-login";

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isRedirecting = useRef(false);

  const handleGoogle = () => {
    signIn("google", { callbackUrl: oauthCallbackUrl });
  };

  const handleGithub = () => {
    signIn("github", { callbackUrl: oauthCallbackUrl });
  };

  // ── Redirect already-logged-in users ──
  useEffect(() => {
    if (status !== "authenticated" || !session?.user || isRedirecting.current) return;

    const user = session.user as any;

    // If there's an explicit "next" param or SSO, honour it
    if (ssoReturnTo) {
      isRedirecting.current = true;
      window.location.href = ssoReturnTo;
      return;
    }
    if (explicitNext) {
      isRedirecting.current = true;
      window.location.href = explicitNext;
      return;
    }

    // Platform users (student / faculty / admin) → raise ticket page
    if (user.isPlatformUser) {
      router.replace("/support/ticket");
    } else {
      // Non-platform (community) users → Classgrid Talk
      router.replace("/support/inquiry");
    }
  }, [status, session, router, ssoReturnTo, explicitNext]);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Show friendly error from URL params (e.g. ?error=OAuthCallback) ──
  const urlError = searchParams.get("error");
  const friendlyUrlError = urlError
    ? OAUTH_ERROR_MAP[urlError] || OAUTH_ERROR_MAP.default
    : "";

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [otpExpired, setOtpExpired] = useState(false);

  const startCountdown = () => {
    setCountdown(OTP_TTL_SECONDS);
    setOtpExpired(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email) {
      setError("Please enter your email");
      return;
    }

    if (mode === "signup" && (!firstName || !lastName)) {
      setError("Please enter your first and last name");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/forum/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      setStep("otp");
      startCountdown();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        otp,
        name: mode === "signup" ? `${firstName} ${lastName}`.trim() : undefined,
      });

      if (!res) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (res.error) {
        if (res.error === "Account does not exist. Please sign up instead.") {
          // Gracefully handle new users who tried to "Log In" instead of "Sign Up"
          setMode("signup");
          setStep("email");
          setError("Account not found. Please enter your name to create an account.");
          setLoading(false);
          return;
        }

        // Map NextAuth error codes to human-readable messages
        const errorMap: Record<string, string> = {
          "OTP has expired": "Your code has expired. Please resend.",
          "Invalid OTP": "Incorrect code. Please try again.",
          "Too many attempts. Please request a new OTP.": "Too many wrong attempts. Please resend.",
          "Invalid or expired OTP": "Code not found. Please resend.",
        };
        setError(errorMap[res.error] || res.error);
        setLoading(false);
        return;
      }

      // Success — navigate (go to /login so role-based redirect kicks in)
      isRedirecting.current = true;
      window.location.href = otpSuccessUrl;
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  // While checking session or redirecting, show spinner
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Spinner className="w-6 h-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative font-sans">
      
      {/* Top Left Logo - matching Cursor */}
      <Link href="/" className="absolute top-6 left-8 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <img src="/logo.png" alt="Classgrid Logo" className="w-6 h-6 object-contain" />
        <span className="font-bold text-lg tracking-wide uppercase">CLASSGRID</span>
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        
        <div className="w-full max-w-[400px]">
          
          <div className="mb-8 text-center space-y-1">
            <h1 className="text-3xl font-medium tracking-tight text-slate-900 dark:text-[#f1f1f1]">Welcome to Classgrid</h1>
            <p className="text-[15px] text-slate-500 dark:text-[#888888]">Unified ERP infrastructure for modern institutions</p>
          </div>

          {/* Show OAuth error from URL (e.g. OAuthCallback) */}
          {friendlyUrlError && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
              {friendlyUrlError}
            </div>
          )}

          <div className="flex flex-col gap-3 mb-8">
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 rounded-md border border-border bg-card py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted active:scale-[0.98]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleGithub}
              className="w-full flex items-center justify-center gap-3 rounded-md border border-border bg-card py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-muted active:scale-[0.98]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {step === "email" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className="text-[13px] font-medium text-slate-500 dark:text-[#888888]">First name</label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Your first name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:border-[#2a2a2a] dark:bg-[#161616] dark:text-[#f1f1f1] dark:placeholder:text-[#555] dark:focus:border-[#444] dark:focus:ring-[#444]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className="text-[13px] font-medium text-slate-500 dark:text-[#888888]">Last name</label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Your last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:border-[#2a2a2a] dark:bg-[#161616] dark:text-[#f1f1f1] dark:placeholder:text-[#555] dark:focus:border-[#444] dark:focus:ring-[#444]"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-[13px] font-medium text-slate-500 dark:text-[#888888]">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-300 dark:border-[#2a2a2a] dark:bg-[#161616] dark:text-[#f1f1f1] dark:placeholder:text-[#555] dark:focus:border-[#444] dark:focus:ring-[#444]"
                />
              </div>

              {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center rounded-md bg-slate-900 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 dark:bg-[#2a2a2a] dark:text-[#f1f1f1] dark:hover:bg-[#333]"
              >
                {loading ? <><Spinner className="w-4 h-4 text-inherit mr-2" /> Continue</> : "Continue"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="flex flex-col items-center gap-3">
                <label className="text-center text-[13px] font-medium text-slate-500 dark:text-[#888888]">
                  Enter the 6-digit code sent to <span className="text-slate-900 dark:text-[#f1f1f1]">{email}</span>
                </label>
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                  disabled={otpExpired}
                >
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} className="h-12 w-10 rounded-md border-slate-200 bg-white text-lg font-medium text-slate-900 dark:border-[#2a2a2a] dark:bg-[#161616] dark:text-[#f1f1f1]" />
                    <InputOTPSlot index={1} className="h-12 w-10 rounded-md border-slate-200 bg-white text-lg font-medium text-slate-900 dark:border-[#2a2a2a] dark:bg-[#161616] dark:text-[#f1f1f1]" />
                    <InputOTPSlot index={2} className="h-12 w-10 rounded-md border-slate-200 bg-white text-lg font-medium text-slate-900 dark:border-[#2a2a2a] dark:bg-[#161616] dark:text-[#f1f1f1]" />
                    <InputOTPSlot index={3} className="h-12 w-10 rounded-md border-slate-200 bg-white text-lg font-medium text-slate-900 dark:border-[#2a2a2a] dark:bg-[#161616] dark:text-[#f1f1f1]" />
                    <InputOTPSlot index={4} className="h-12 w-10 rounded-md border-slate-200 bg-white text-lg font-medium text-slate-900 dark:border-[#2a2a2a] dark:bg-[#161616] dark:text-[#f1f1f1]" />
                    <InputOTPSlot index={5} className="h-12 w-10 rounded-md border-slate-200 bg-white text-lg font-medium text-slate-900 dark:border-[#2a2a2a] dark:bg-[#161616] dark:text-[#f1f1f1]" />
                  </InputOTPGroup>
                </InputOTP>

                {/* Timer / Resend */}
                <div className="text-[13px] text-center">
                  {otpExpired ? (
                    <span className="text-red-400">Code expired. </span>
                  ) : countdown > 0 ? (
                    <span className="text-slate-500 dark:text-[#888888]">
                      Code expires in{" "}
                      <span className={`font-mono font-semibold tabular-nums ${
                        countdown <= 10 ? "text-red-400" : "text-slate-900 dark:text-[#f1f1f1]"
                      }`}>
                        {formatCountdown(countdown)}
                      </span>
                    </span>
                  ) : null}
                  {" "}
                  <button
                    type="button"
                    onClick={async () => {
                      setError("");
                      setOtp("");
                      setLoading(true);
                      try {
                        const res = await fetch("/api/forum/send-otp", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ email, mode }),
                        });
                        const data = await res.json();
                        if (!res.ok) throw new Error(data.error || "Failed to resend");
                        startCountdown();
                      } catch (err: any) {
                        setError(err.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || (countdown > 0 && !otpExpired)}
                    className="text-slate-900 underline underline-offset-2 transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-30 dark:text-[#f1f1f1]"
                  >
                    Resend code
                  </button>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm font-medium text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading || otp.length !== 6 || otpExpired}
                className="flex w-full items-center justify-center rounded-md bg-slate-900 py-3 text-sm font-medium text-white transition-all duration-200 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 dark:bg-[#2a2a2a] dark:text-[#f1f1f1] dark:hover:bg-[#333]"
              >
                {loading ? <><Spinner className="w-4 h-4 text-inherit mr-2" /> Sign In</> : "Sign In"}
              </button>
              
              <button
                type="button"
                onClick={() => { setStep("email"); if (timerRef.current) clearInterval(timerRef.current); }}
                className="w-full text-sm text-slate-500 transition-colors hover:text-slate-900 dark:text-[#888888] dark:hover:text-[#f1f1f1]"
              >
                Back to email
              </button>
            </form>
          )}

          {step === "email" && searchParams.get("next") !== "/support/ticket" && (
            <div className="mt-8 text-center text-[13px]">
              {mode === "signin" ? (
                <span className="text-slate-500 dark:text-[#888888]">
                  Don't have an account?{" "}
                  <button onClick={() => setMode("signup")} className="font-medium text-slate-900 transition-colors hover:underline dark:text-[#f1f1f1]">
                    Sign up
                  </button>
                </span>
              ) : (
                <span className="text-slate-500 dark:text-[#888888]">
                  Already have an account?{" "}
                  <button onClick={() => setMode("signin")} className="font-medium text-slate-900 transition-colors hover:underline dark:text-[#f1f1f1]">
                    Sign in
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

      </div>

      <div className="absolute bottom-6 w-full text-center">
        <p className="text-[13px] text-slate-400 dark:text-[#666666]">
          <Link href="/terms" className="underline underline-offset-4 decoration-slate-300 transition-colors hover:text-slate-900 dark:decoration-[#444] dark:hover:text-[#f1f1f1]">Terms of Service</Link>
          {" "}and{" "}
          <Link href="/privacy" className="underline underline-offset-4 decoration-slate-300 transition-colors hover:text-slate-900 dark:decoration-[#444] dark:hover:text-[#f1f1f1]">Privacy Policy</Link>
        </p>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><Spinner className="w-6 h-6 text-muted-foreground" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
