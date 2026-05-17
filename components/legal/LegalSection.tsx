import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type LegalSectionProps = {
  id: string;
  number: string;
  title: string;
  meta?: string[];
  children: ReactNode;
  className?: string;
};

export function LegalSection({
  id,
  number,
  title,
  meta,
  children,
  className,
}: LegalSectionProps) {
  return (
    <article id={id} className={cn("scroll-mt-28", className)}>
      <Card className="mb-8 rounded-xl border border-border bg-transparent transition-colors duration-200 hover:bg-muted/20">
        <CardContent className="px-6 py-6 sm:px-8 sm:py-7">
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-emerald-500">{number}</p>
            <h2 className="mt-2 text-[1.25rem] font-semibold tracking-tight text-foreground">{title}</h2>
            {meta && meta.length > 0 ? (
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {meta.map((entry) => (
                  <span key={`${id}-${entry}`}>{entry}</span>
                ))}
              </div>
            ) : null}
            <div className="my-4 border-t border-border" />
          </div>
          <div className="space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground">{children}</div>
        </CardContent>
      </Card>
    </article>
  );
}
