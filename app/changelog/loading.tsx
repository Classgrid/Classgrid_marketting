import { Skeleton } from "@/components/ui/skeleton";

export default function ChangelogLoading() {
  return (
    <main className="bg-background text-foreground pb-10">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Hero skeleton — matches centered badge + accent bar + h1 + subtitle */}
        <section className="mt-0 flex flex-col items-center space-y-4 pb-10 pt-16 text-center">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-1 w-14 rounded-full" />
          <Skeleton className="h-12 w-full max-w-lg" />
          <Skeleton className="h-5 w-full max-w-sm" />
        </section>

        {/* Filter bar skeleton — matches left dropdowns + right pills */}
        <section className="flex flex-col items-start justify-between gap-4 py-4 md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-3">
            <Skeleton className="h-11 w-[130px] rounded-xl" />
            <Skeleton className="h-11 w-[150px] rounded-xl" />
            <Skeleton className="h-11 w-[160px] rounded-xl" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-28 rounded-full" />
            ))}
          </div>
        </section>

        {/* Timeline entries skeleton — matches date | dot | content layout */}
        <div className="relative mt-4 pb-12">
          <div className="absolute left-[7.5rem] top-0 hidden h-full w-px bg-border md:block" />
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="group relative flex gap-0 md:gap-8">
                {/* Date column */}
                <div className="hidden w-28 shrink-0 pt-5 text-right md:block">
                  <Skeleton className="ml-auto h-4 w-16" />
                </div>
                {/* Timeline dot */}
                <div className="relative hidden md:flex flex-col items-center">
                  <Skeleton className="mt-[1.35rem] h-2.5 w-2.5 rounded-full" />
                </div>
                {/* Content */}
                <div className="flex-1 border-b border-border py-5 pl-0 md:pl-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-5 w-72" />
                  <Skeleton className="h-4 w-full max-w-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
