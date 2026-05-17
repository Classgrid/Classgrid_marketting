import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="px-6 pt-6 sm:px-8 sm:pt-8">
        <Skeleton className="h-7 w-36 rounded-md bg-card" />
      </div>

      <div className="flex min-h-[calc(100vh-72px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-[460px] rounded-2xl border border-border bg-card p-8 shadow-[0_30px_100px_rgba(0,0,0,0.32)] sm:p-10">
          <Skeleton className="mb-3 h-4 w-36 rounded-full bg-secondary/70" />
          <Skeleton className="mb-3 h-10 w-64 rounded-lg bg-secondary/70" />
          <Skeleton className="mb-8 h-5 w-80 rounded-lg bg-secondary/50" />

          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl bg-secondary/60" />
            <Skeleton className="h-12 w-full rounded-xl bg-secondary/60" />
            <Skeleton className="h-12 w-full rounded-xl bg-secondary/60" />
          </div>

          <div className="my-7 flex items-center gap-3">
            <Skeleton className="h-px flex-1 bg-border" />
            <Skeleton className="h-3 w-8 rounded bg-secondary/60" />
            <Skeleton className="h-px flex-1 bg-border" />
          </div>

          <Skeleton className="mb-2 h-4 w-10 rounded bg-secondary/60" />
          <Skeleton className="mb-6 h-12 w-full rounded-xl bg-secondary/60" />
          <Skeleton className="h-12 w-full rounded-xl bg-primary/40" />
        </div>
      </div>
    </main>
  );
}
