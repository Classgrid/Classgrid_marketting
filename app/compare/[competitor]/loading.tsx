import { Skeleton } from "@/components/ui/skeleton";

export default function ComparisonDetailLoading() {
  return (
    <main className="min-h-screen bg-background text-foreground pt-24 pb-16 relative">
      <div className="relative mx-auto w-full max-w-[900px]">
        <div className="relative border-l border-r border-slate-200 dark:border-white/10">

          {/* Header skeleton — matches centered intro layout */}
          <div className="px-6 md:px-12 pt-16 pb-20 flex flex-col items-center text-center space-y-6">
            <div className="w-full border-t border-slate-200 dark:border-white/10 absolute top-0 left-0" />
            <Skeleton className="h-12 w-full max-w-lg" />
            <Skeleton className="h-6 w-full max-w-md" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-px" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-px" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          {/* Body content skeleton — matches editorial text sections */}
          <div className="px-6 md:px-12 py-16 space-y-14">
            <div className="w-full border-t border-dashed border-slate-200 dark:border-white/10 absolute left-0" style={{ marginTop: '-4rem' }} />

            {/* Table of contents skeleton */}
            <div className="space-y-3">
              <Skeleton className="h-6 w-40" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-48" />
              ))}
            </div>

            {/* Intro paragraph */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>

            {/* Section heading + paragraph */}
            <div className="space-y-4">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Table skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-10 w-full rounded-lg" />
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>

            {/* Another section */}
            <div className="space-y-4">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
