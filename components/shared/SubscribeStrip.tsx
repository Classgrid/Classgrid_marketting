import { SubscribeForm } from "@/components/shared/SubscribeForm";

/**
 * Reusable full-width subscribe strip section.
 * Blog and Changelog are separate subscription lists — always pass
 * the correct `type` and page-specific `heading`/`subtext` props.
 * Defaults are blog-specific (type="blog" is the default).
 */
interface SubscribeStripProps {
  heading?: string;
  subtext?: string;
  type?: "blog" | "changelog";
}

export function SubscribeStrip({
  heading = "Stay in the loop with Classgrid",
  subtext = "Get the latest Classgrid blog posts, insights and product stories delivered to your inbox. No spam. Unsubscribe anytime.",
  type = "blog",
}: SubscribeStripProps) {
  return (
    <section className="w-full border-t border-slate-300 dark:border-border bg-slate-50 dark:bg-card/50">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {heading}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          {subtext}
        </p>
        <div className="mx-auto mt-8 flex justify-center">
          <SubscribeForm type={type} />
        </div>
      </div>
    </section>
  );
}

