import Link from "next/link";

type TrustedInstitution = {
  name: string;
  subtitle?: string;
  href?: string;
  imageUrl?: string;
  imageAlt?: string;
  wordmarkUrl?: string;
  wordmarkAlt?: string;
  color?: string;
  hideName?: boolean;
};

type TrustedInstitutionsShowcaseProps = {
  title: string;
  institutions: TrustedInstitution[];
};

export function TrustedInstitutionsShowcase({
  institutions,
}: TrustedInstitutionsShowcaseProps) {
  if (!institutions.length) {
    return (
      <div className="relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 py-10 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.5)] dark:bg-[#022c22] dark:from-transparent dark:to-transparent dark:shadow-2xl md:py-14">
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
            background: linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.05) 100%);
            background-size: 400px 100%;
            animation: cs-shimmer 2.4s ease-in-out infinite;
          }
          .dark .cs-shimmer-bar {
            background: linear-gradient(90deg, rgba(52,211,153,0.05) 0%, rgba(52,211,153,0.18) 50%, rgba(52,211,153,0.05) 100%);
            background-size: 400px 100%;
          }
          .cs-dot { animation: cs-pulse-ring 2s ease-in-out infinite; }
          .cs-dot:nth-child(2) { animation-delay: 0.3s; }
          .cs-dot:nth-child(3) { animation-delay: 0.6s; }
        `}</style>

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-48 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-[80px] dark:bg-emerald-500/10" />
        </div>

        <div className="relative flex flex-col items-center gap-5 px-6 text-center">
          {/* Animated dots */}
          <div className="flex items-center gap-2">
            <span className="cs-dot h-2 w-2 rounded-full bg-white/50 dark:bg-emerald-400/60" />
            <span className="cs-dot h-2 w-2 rounded-full bg-white/50 dark:bg-emerald-400/60" />
            <span className="cs-dot h-2 w-2 rounded-full bg-white/50 dark:bg-emerald-400/60" />
          </div>

          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Institutions · Coming Soon
          </span>

          {/* Headline */}
          <p className="max-w-lg text-base font-medium leading-relaxed text-white/80 dark:text-white/70 md:text-lg">
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
    <div className="relative mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 py-8 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.5)] dark:bg-[#022c22] dark:from-transparent dark:to-transparent dark:shadow-2xl md:py-14">
      {/* Logo contrast CSS — drop-shadow follows logo shape, no visible box */}
      <style>{`
        .logo-wrap {
          padding: 4px 6px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .logo-wrap img {
          object-fit: contain;
          mix-blend-mode: normal;
          image-rendering: auto;
          filter: brightness(1.05) contrast(1.1) drop-shadow(0 0 6px rgba(255,255,255,0.18));
        }
        .dark .logo-wrap img {
          filter: brightness(1.1) contrast(1.15) drop-shadow(0 0 8px rgba(255,255,255,0.22));
        }
      `}</style>

      <div
        className="group"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)",
        }}
      >
        <div className="flex w-max items-center [transform:translate3d(0,0,0)] will-change-transform animate-[institution-marquee_30s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {looped.map((inst, i) => {
            const hasLogo = inst.imageUrl && inst.imageUrl.trim() !== "";
            const hasWordmark = inst.wordmarkUrl && inst.wordmarkUrl.trim() !== "";
            const showName = !inst.hideName;

            const content = (
              <div className="flex shrink-0 items-center gap-3 px-8 md:gap-5 md:px-14">
                {/* College logo (icon/crest) — rendered large, upscales small images */}
                {hasLogo && (
                  <div className="logo-wrap">
                    <img
                      src={inst.imageUrl}
                      alt={inst.imageAlt ?? inst.name}
                      className="h-[100px] w-[100px] shrink-0 object-contain md:h-[140px] md:w-[140px]"
                      loading="lazy"
                    />
                  </div>
                )}

                {/*
                  College name — 3 modes:
                  1. Wordmark image → wrapped for contrast (only if showName)
                  2. Plain text with custom brand color (only if showName)
                  3. Hidden if hideName is true
                */}
                {showName && (
                  <>
                    {hasWordmark ? (
                      <div className="logo-wrap">
                        <img
                          src={inst.wordmarkUrl}
                          alt={inst.wordmarkAlt ?? inst.name}
                          className="h-[40px] w-auto max-w-[200px] shrink-0 object-contain md:h-[64px] md:max-w-[300px]"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <span
                        className="max-w-[220px] text-lg font-semibold leading-snug md:max-w-[260px] md:text-xl"
                        style={{ color: inst.color || "#ffffff" }}
                      >
                        {inst.name}
                      </span>
                    )}
                  </>
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
                    className="shrink-0 outline-none transition-opacity hover:opacity-80 focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                  >
                    {content}
                  </a>
                );
              }
              return (
                <Link
                  key={`${inst.name}-${i}`}
                  href={inst.href}
                  className="shrink-0 outline-none transition-opacity hover:opacity-80 focus-visible:rounded-lg focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div key={`${inst.name}-${i}`} className="shrink-0">
                {content}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
