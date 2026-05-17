import { SubscribeForm } from "@/components/shared/SubscribeForm";

/**
 * Reusable full-width subscribe strip section.
 * Place at the bottom of any page: Changelog, Blog detail, etc.
 */
interface SubscribeStripProps {
  heading?: string;
  subtext?: string;
}

export function SubscribeStrip({
  heading = "Sign up for updates on our latest innovations",
  subtext = "Get the latest Classgrid product updates, blog posts and platform news. No spam. Unsubscribe anytime.",
}: SubscribeStripProps) {
  return (
    <section className="w-full border-t border-border bg-card/50">
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          {heading}
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          {subtext}
        </p>
        <div className="mx-auto mt-8 flex justify-center">
          <SubscribeForm />
        </div>
      </div>
    </section>
  );
}

