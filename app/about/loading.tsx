import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      {/* 1. Hero skeleton */}
      <section className="relative overflow-hidden px-4 pb-6 pt-12 sm:px-6 lg:px-8 text-center flex flex-col items-center space-y-6">
        <Skeleton className="h-1 w-14 rounded-full bg-white/10" />
        <Skeleton className="h-14 w-80 bg-white/5" />
        <Skeleton className="h-6 w-96 bg-white/5" />
      </section>

      {/* 2. Globe + Story skeleton */}
      <section className="relative w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Globe placeholder */}
          <Skeleton className="w-full aspect-square max-w-[580px] mx-auto lg:mx-0 rounded-full bg-white/5" />
          {/* Story text placeholder */}
          <div className="max-w-2xl space-y-6">
            <Skeleton className="h-8 w-40 bg-white/5" />
            <Skeleton className="h-5 w-full bg-white/5" />
            <Skeleton className="h-5 w-full bg-white/5" />
            <Skeleton className="h-5 w-5/6 bg-white/5" />
            <Skeleton className="h-5 w-full bg-white/5" />
            <Skeleton className="h-5 w-4/6 bg-white/5" />
          </div>
        </div>
      </section>

      {/* 3. Mission & Vision skeleton */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-56 rounded-2xl bg-white/5" />
          <Skeleton className="h-56 rounded-2xl bg-white/5" />
        </div>
      </section>

      {/* 4. Values skeleton */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl bg-white/5" />
          ))}
        </div>
      </section>

      {/* 5. Timeline skeleton */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-6 items-start">
              <Skeleton className="h-4 w-4 rounded-full bg-white/10 shrink-0 mt-1" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-32 bg-white/5" />
                <Skeleton className="h-4 w-full bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
