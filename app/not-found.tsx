import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="text-8xl font-black text-emerald-500/20">404</h1>
      <SectionAccentBar className="mt-4 mb-0" />
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Page Not Found</h2>
      <p className="mt-4 text-muted-foreground">We couldn't find the page you were looking for.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" /> Go back home
      </Link>
    </main>
  );
}
