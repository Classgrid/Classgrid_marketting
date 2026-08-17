import { Skeleton } from "@/components/ui/skeleton";

export default function ChangelogDetailLoading() {
  return (
    <main className="bg-background text-foreground">

      {/* Hero section skeleton — matches DocumentHero centered layout */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto w-full max-w-4xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 text-center space-y-5">
          {/* Badge */}
          <Skeleton className="mx-auto h-7 w-44 rounded-full" />
          {/* Title */}
          <Skeleton className="mx-auto h-10 w-full max-w-xl" />
          {/* Author row */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex -space-x-2">
              <Skeleton className="h-6 w-6 rounded-full border border-background relative z-30" />
              <Skeleton className="h-6 w-6 rounded-full border border-background relative z-20" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          {/* Subtitle row (version + date) */}
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-px" />
            <Skeleton className="h-4 w-32" />
          </div>
          {/* Summary */}
          <Skeleton className="mx-auto h-5 w-full max-w-md" />
          {/* Module badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </section>

      {/* Body content skeleton */}
      <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0 max-w-4xl space-y-8">
            {/* Cover image placeholder */}
            <Skeleton className="h-72 w-full rounded-2xl" />

            {/* Text content blocks */}
            <div className="space-y-4">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-5/6" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </div>

            {/* CTA card skeleton */}
            <Skeleton className="h-48 w-full rounded-2xl mt-12" />
          </div>

          {/* Sidebar Skeleton */}
          <aside className="w-[200px] hidden xl:block sticky top-[5rem] h-fit pt-2 pl-6 shrink-0">
            <div className="flex flex-col gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
