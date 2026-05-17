import { Skeleton } from "@/components/ui/skeleton";

export default function CompareLoading() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden pt-16 pb-32">
      <div className="container relative mx-auto px-6 max-w-2xl">

        {/* Hero skeleton — matches editorial centered layout */}
        <div className="text-center mb-28 space-y-8">
          <Skeleton className="mx-auto h-[3px] w-16 rounded-full" />
          <Skeleton className="mx-auto h-6 w-full max-w-xl" />
          <Skeleton className="mx-auto h-6 w-4/5 max-w-md" />
        </div>

        {/* Directory list skeleton — matches thin divider style */}
        <div className="space-y-0">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="py-10">
              <div className="border-t border-slate-200/40 dark:border-white/[0.06] mb-10" />
              <div className="flex items-start justify-between gap-8">
                <div className="space-y-3 flex-1">
                  <Skeleton className="h-5 w-56" />
                  <Skeleton className="h-4 w-80" />
                </div>
                <Skeleton className="hidden sm:block h-4 w-20 shrink-0" />
              </div>
            </div>
          ))}
          <div className="border-t border-slate-200/40 dark:border-white/[0.06]" />
        </div>

      </div>
    </div>
  );
}
