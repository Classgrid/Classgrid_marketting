"use client";

import { FormEvent, useState, useRef } from "react";
import { CheckCircle2, AlertCircle, Send } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Turnstile, TurnstileInstance } from "@marsidev/react-turnstile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Shared reusable email subscribe form (pill style).
 * Connects to /api/blog/subscribe (Brevo SMTP + Supabase).
 * Used on: Changelog page, Blog detail page, and any future pages.
 */
export function SubscribeForm({ type = "blog" }: { type?: "blog" | "changelog" } = {}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState(""); // Honeypot field
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const turnstileRef = useRef<TurnstileInstance>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    if (!turnstileToken) {
      setError("Please complete the security check.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/blog/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          name: name.trim(), 
          type,
          "cf-turnstile-response": turnstileToken,
          website_url: websiteUrl
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        // Already subscribed — friendly confirmation, not an error
        setMessage(data?.message ?? "You're already subscribed to Classgrid updates!");
        setEmail("");
        return;
      }

      if (!response.ok) {
        setError(data?.message ?? data?.error ?? "Could not subscribe right now.");
        return;
      }

      setMessage(data?.message ?? "Subscribed! You'll receive the latest updates in your inbox.");
      setEmail("");
      setName("");
      setWebsiteUrl("");
    } catch {
      setError("Could not subscribe right now. Please try again.");
    } finally {
      setLoading(false);
      // Always reset Turnstile token so a new one is generated for retries
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  return (
    <div className="w-full space-y-3">
      {/* Two-field layout: Name + Email + Button */}
      <form
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full max-w-2xl"
        onSubmit={handleSubmit}
      >
        {/* Honeypot field - visually hidden from actual users */}
        <input 
          type="text" 
          name="website_url" 
          tabIndex={-1} 
          autoComplete="off" 
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          style={{ display: "none" }} 
          aria-hidden="true" 
        />

        <Input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="rounded-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/40 h-11 px-5 sm:w-44 shrink-0 transition-all"
        />
        <div className="relative flex items-center flex-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-300 dark:border-white/10 p-1.5 focus-within:ring-2 focus-within:ring-emerald-500/50 focus-within:border-emerald-500/50 transition-all">
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-white/40 h-10 px-4"
          />
          <Button
            type="submit"
            className="rounded-full bg-slate-900 text-white dark:bg-white dark:text-black hover:bg-slate-800 dark:hover:bg-white/90 h-10 px-6 font-medium shrink-0 gap-2"
            disabled={loading}
          >
            {loading ? (
              <Spinner className="h-4 w-4 text-inherit" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </div>
      </form>

      {/* Success banner */}
      {message && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 max-w-2xl">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
          <p className="text-sm text-emerald-300 leading-5">{message}</p>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 max-w-2xl">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <p className="text-sm text-rose-300 leading-5">{error}</p>
        </div>
      )}

      {/* Cloudflare Turnstile */}
      <div className="pt-2" data-action="turnstile-spin-v2">
        <Turnstile
          ref={turnstileRef}
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "0x4AAAAAAELIHhXQqcev5Im7"}
          onSuccess={(token) => setTurnstileToken(token)}
          onError={() => setError("Security check failed. Please refresh and try again.")}
          onExpire={() => setTurnstileToken(null)}
          options={{
             theme: 'auto',
          }}
        />
      </div>
    </div>
  );
}
