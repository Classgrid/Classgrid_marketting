import Link from "next/link";
import { ArrowLeft, Calendar, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[75vh] flex-col items-center justify-center bg-background px-4 text-center overflow-hidden py-24">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="space-y-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative">
          <h1 className="text-[10rem] md:text-[14rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-emerald-500/20 to-transparent leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-card border border-border rounded-2xl shadow-2xl flex items-center justify-center rotate-12">
              <Compass className="w-8 h-8 md:w-10 md:h-10 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-lg z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            Off the syllabus!
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved, deleted, or perhaps you just discovered a secret module we haven't built yet!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 z-10">
          <Link href="/">
            <Button variant="outline" className="h-14 px-8 rounded-full font-bold text-base bg-background/50 backdrop-blur-sm border-border hover:bg-muted/50">
              <ArrowLeft className="mr-2 w-5 h-5" /> Back to Homepage
            </Button>
          </Link>
          <Link href="/book-demo">
            <Button className="h-14 px-8 rounded-full font-bold text-base shadow-lg shadow-emerald-500/20">
              <Calendar className="mr-2 w-5 h-5" /> Book a Demo
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
