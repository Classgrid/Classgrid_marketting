import Link from "next/link";
import { SectionHeader } from "./SectionHeader";

type TrustedInstitution = {
  name: string;
  subtitle?: string;
  href?: string;
  imageUrl?: string;
  imageUrlDark?: string;
  imageAlt?: string;
  wordmarkUrl?: string;
  wordmarkUrlDark?: string;
  wordmarkAlt?: string;
  color?: string;
  hideName?: boolean;
  hideInDarkMode?: boolean;
  nameColor?: string;
};

type TrustedInstitutionsShowcaseProps = {
  title: string;
  institutions: TrustedInstitution[];
};

export function TrustedInstitutionsShowcase({
  title,
  institutions,
}: TrustedInstitutionsShowcaseProps) {
  if (!institutions.length) {
    return (
      <div className="relative mt-8 overflow-hidden rounded-2xl border border-border bg-card py-10 md:py-14">
        <style>{`
          @keyframes cs-pulse-ring {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.08); }
          }
          @keyframes cs-shimmer {
            0% { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          .cs-shimmer-bar {
            background: linear-gradient(90deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.03) 100%);
            background-size: 400px 100%;
            animation: cs-shimmer 2.4s ease-in-out infinite;
          }
          .dark .cs-shimmer-bar {
            background: linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 100%);
            background-size: 400px 100%;
          }
          .cs-dot { animation: cs-pulse-ring 2s ease-in-out infinite; }
          .cs-dot:nth-child(2) { animation-delay: 0.3s; }
          .cs-dot:nth-child(3) { animation-delay: 0.6s; }
        `}</style>

        <div className="relative flex flex-col items-center gap-5 px-6 text-center">
          {/* Animated dots */}
          <div className="flex items-center gap-2">
            <span className="cs-dot h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
            <span className="cs-dot h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
            <span className="cs-dot h-2 w-2 rounded-full bg-neutral-400 dark:bg-neutral-600" />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Institutions · Coming Soon
          </span>

          {/* Headline */}
          <p className="max-w-lg text-base font-medium leading-relaxed text-muted-foreground md:text-lg">
            We&rsquo;re onboarding our partner institutions. They&rsquo;ll appear right here once they&rsquo;re live on Classgrid.
          </p>

          {/* Shimmer placeholder rows */}
          <div className="mt-2 flex w-full max-w-2xl flex-col gap-3 px-4">
            <div className="cs-shimmer-bar h-10 w-full rounded-lg" />
            <div className="cs-shimmer-bar h-10 w-4/5 self-center rounded-lg" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    );
  }

  const looped = [
    ...institutions,
    ...institutions,
    ...institutions,
    ...institutions,
  ];

  return (
    <div className="mt-8 md:mt-12">
      {title && <SectionHeader title={title} className="mb-6 md:mb-10" />}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card py-8 md:py-14">
      <div
        className="group"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
        }}
      >
        <div className="flex w-max items-start [transform:translate3d(0,0,0)] will-change-transform animate-[institution-marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {looped.map((inst, i) => {
            const hasLogo = inst.imageUrl && inst.imageUrl.trim() !== "";
            const hasWordmark = inst.wordmarkUrl && inst.wordmarkUrl.trim() !== "";
            const showName = !inst.hideName;

            const content = (
              <div className="flex w-[240px] shrink-0 flex-col items-center justify-start gap-3 px-4 text-center md:w-[320px] md:gap-4 md:px-8">
                {/* College logo (icon/crest) — Fixed height container ensures horizontal alignment */}
                <div className="flex h-[110px] w-full items-center justify-center md:h-[150px]">
                  {hasLogo && (
                    <div className="flex h-full w-auto items-center justify-center rounded-xl dark:bg-white/95 dark:px-4 dark:py-2 dark:shadow-sm">
                      <img
                        src={inst.imageUrl}
                        alt={inst.imageAlt ?? inst.name}
                        className={`h-auto max-h-[100px] w-auto max-w-[220px] shrink-0 object-contain md:max-h-[140px] md:max-w-[300px] ${inst.imageUrlDark ? "dark:hidden" : ""}`}
                        loading="lazy"
                      />
                      {inst.imageUrlDark && (
                        <img
                          src={inst.imageUrlDark}
                          alt={inst.imageAlt ?? inst.name}
                          className="hidden h-auto max-h-[100px] w-auto max-w-[220px] shrink-0 object-contain dark:block md:max-h-[140px] md:max-w-[300px]"
                          loading="lazy"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/*
                  College name — 3 modes:
                  1. Wordmark image (only if showName)
                  2. Plain text with custom brand color (only if showName)
                  3. Hidden if hideName is true
                */}
                {showName && (
                  <div className="flex w-full flex-col items-center justify-start gap-1">
                    {hasWordmark ? (
                      <div className="flex h-[60px] w-full items-center justify-center md:h-[80px]">
                        <div className="flex h-full w-auto items-center justify-center rounded-lg dark:bg-white/95 dark:px-3 dark:py-1 dark:shadow-sm">
                          <img
                            src={inst.wordmarkUrl}
                            alt={inst.wordmarkAlt ?? inst.name}
                            className={`h-[40px] w-auto max-w-[200px] shrink-0 object-contain md:h-[64px] md:max-w-[300px] ${inst.wordmarkUrlDark ? "dark:hidden" : ""}`}
                            loading="lazy"
                          />
                          {inst.wordmarkUrlDark && (
                            <img
                              src={inst.wordmarkUrlDark}
                              alt={inst.wordmarkAlt ?? inst.name}
                              className="hidden h-[40px] w-auto max-w-[200px] shrink-0 object-contain dark:block md:h-[64px] md:max-w-[300px]"
                              loading="lazy"
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex w-full flex-col items-center justify-start gap-1">
                        <span
                          className="max-w-[220px] rounded-lg px-2 py-0.5 text-lg font-semibold leading-snug text-foreground dark:bg-white/95 dark:text-slate-900 md:max-w-[260px] md:px-3 md:py-1 md:text-xl"
                          style={{ color: inst.nameColor || inst.color || undefined }}
                        >
                          {inst.name}
                        </span>
                        {inst.subtitle && (
                          <span className="text-sm font-semibold text-muted-foreground dark:text-white md:text-base">
                            {inst.subtitle}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );

            if (inst.href) {
              // External links (http/https) → open in new tab
              const isExternal = inst.href.startsWith("http");
              if (isExternal) {
                return (
                  <a
                    key={`${inst.name}-${i}`}
                    href={inst.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`shrink-0 outline-none transition-opacity hover:opacity-80 focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${inst.hideInDarkMode ? "dark:hidden" : ""}`}
                  >
                    {content}
                  </a>
                );
              }
              return (
                <Link
                  key={`${inst.name}-${i}`}
                  href={inst.href}
                  className={`shrink-0 outline-none transition-opacity hover:opacity-80 focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-400/60 ${inst.hideInDarkMode ? "dark:hidden" : ""}`}
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={`${inst.name}-${i}`} className={`shrink-0 ${inst.hideInDarkMode ? "dark:hidden" : ""}`}>
                {content}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
