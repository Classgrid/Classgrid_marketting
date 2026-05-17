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
          {/* Subtitle row (version + date) */}
          <div className="flex items-center justify-center gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-px" />
            <Skeleton className="h-4 w-32" />
          </div>
          {/* Summary */}
          <Skeleton className="mx-auto h-5 w-full max-w-md" />
          {/* Share button */}
          <Skeleton className="mx-auto h-10 w-32 rounded-full" />
          {/* Module badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      </section>

      {/* Body content skeleton */}
      <section className="mx-auto w-full max-w-4xl px-6 py-16 space-y-8">
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
      </section>
    </main>
  );
}
