import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CheckCircle2, Mail, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Unsubscribed | Classgrid",
  description: "You have been unsubscribed from Classgrid blog updates.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function UnsubscribedPage() {
  const cookieStore = await cookies();
  
  // TEMPORARILY DISABLED FOR DESIGN TESTING
  // if (!cookieStore.has("unsubscribed_session")) {
  //   redirect("/blog");
  // }

  return (
    <div className="relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_95%)]" />
      </div>

      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
        <div className="rounded-3xl border border-border/70 bg-background/90 p-6 shadow-[0_20px_70px_-35px_rgba(16,185,129,0.35)] backdrop-blur-md sm:p-10">
          
          <style dangerouslySetInnerHTML={{ __html: `
            .animate-spin-once {
              animation: spinOnce 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }
            @keyframes spinOnce {
              0% { transform: rotate(0deg); opacity: 1; border-width: 3px; }
              70% { transform: rotate(720deg); border-width: 3px; opacity: 1; }
              100% { transform: rotate(900deg); opacity: 0; border-width: 0px; }
            }
            .animate-pop-in {
              animation: popIn 0.55s cubic-bezier(0.34, 1.2, 0.64, 1) 0.75s forwards;
              transform: scale(0);
              opacity: 0;
            }
            @keyframes popIn {
              0% { transform: scale(0); opacity: 0; }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); opacity: 1; }
            }
            .animate-fade-up {
              animation: fadeUp 0.5s ease-out 0.2s both;
            }
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(12px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}} />

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            
            {/* LEFT SIDE: Animation and text only */}
            <div className="flex flex-col items-start space-y-6">
              
              <div className="relative flex h-24 w-24 items-center justify-center">
                {/* Spinner Ring */}
                <div className="animate-spin-once absolute inset-0 box-border rounded-full border-[3px] border-b-emerald-500/20 border-l-emerald-500/10 border-r-emerald-500 border-t-emerald-500"></div>
                
                {/* Checkmark Pop */}
                <div className="animate-pop-in absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)]">
                    <svg className="h-7 w-7 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="animate-fade-up">
                <Badge
                  variant="outline"
                  className="mb-4 inline-flex items-center gap-1.5 border-emerald-500/35 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-emerald-500"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Unsubscribed
                </Badge>
                <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
                  You&apos;re Unsubscribed
                </h1>
              </div>

            </div>

            {/* RIGHT SIDE: What Happens Next Card */}
            <aside className="rounded-2xl border border-border/70 bg-muted/30 p-5 sm:p-6 animate-fade-up">
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
            </aside>

          </div>
        </div>
      </section>
    </div>
  );
}
