import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BellOff, CheckCircle2, Mail, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

export const metadata: Metadata = {
  title: "Unsubscribed | Classgrid",
  description: "You have been unsubscribed from Classgrid blog updates.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnsubscribedPage() {
  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_95%)]" />
      </div>

      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-3xl border border-border/70 bg-background/90 p-6 shadow-[0_20px_70px_-35px_rgba(16,185,129,0.35)] backdrop-blur-md sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-5">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-1.5 border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-[11px] tracking-[0.15em] text-emerald-500 uppercase"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Subscription Updated
              </Badge>

              <div className="flex items-center gap-4">
                <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/35 bg-emerald-500/10 text-emerald-500">
                  <BellOff className="h-7 w-7" />
                </div>
                <div>
                  <SectionAccentBar align="left" className="mb-3" />
                  <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                    You&apos;re Unsubscribed
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                You have been removed from new blog update emails. Your preference is saved and takes effect immediately.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild className="bg-emerald-500 text-black hover:bg-emerald-400">
                  <Link href="/blog" prefetch={false}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return To Blog
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-border/70 bg-background/70">
                  <Link href="/" prefetch={false}>
                    Go To Homepage
                  </Link>
                </Button>
              </div>
            </div>

            <aside className="rounded-2xl border border-border/70 bg-muted/30 p-5 sm:p-6">
              <p className="text-sm font-semibold text-foreground">What Happens Next</p>
              <div className="mt-4 space-y-4 text-sm text-muted-foreground">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p>No more blog broadcast emails will be sent to your inbox.</p>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p>You can re-subscribe anytime from the subscription block on any blog article.</p>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                  <p>Your unsubscribe preference remains protected and respected by default.</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl border border-border/60 bg-background/80 px-4 py-3 text-xs text-muted-foreground">
                Need help? Contact us at{" "}
                <a
                  href="mailto:support@classgrid.in"
                  className="font-medium text-foreground underline decoration-border underline-offset-4 hover:text-emerald-500"
                >
                  support@classgrid.in
                </a>
                .
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
