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
};

type TrustedInstitutionsShowcaseProps = {
  title: string;
  institutions: TrustedInstitution[];
};

export function TrustedInstitutionsShowcase({
  institutions,
}: TrustedInstitutionsShowcaseProps) {
  if (!institutions.length) {
    return null;
  }

  const looped = [
    ...institutions,
    ...institutions,
    ...institutions,
    ...institutions,
  ];

  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-emerald-900/40 bg-[linear-gradient(110deg,rgba(2,44,34,0.95),rgba(6,95,70,0.55),rgba(2,44,34,0.95))] py-12 md:py-14">
      {/* Logo contrast CSS — drop-shadow follows logo shape, no visible box */}
      <style>{`
        .logo-wrap {
          padding: 4px 6px;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          /* NO background — it was showing as a visible white rectangle on transparent PNGs */
        }
        .logo-wrap img {
          object-fit: contain;
          mix-blend-mode: normal;
          /* drop-shadow follows logo shape (not a box); subtle white halo helps dark logos pop */
          filter: brightness(1.05) contrast(1.1) drop-shadow(0 0 6px rgba(255,255,255,0.18));
        }
        .dark .logo-wrap img {
          filter: brightness(1.1) contrast(1.15) drop-shadow(0 0 8px rgba(255,255,255,0.22));
        }
        :not(.dark) .logo-wrap img {
          filter: brightness(1.05) contrast(1.1) drop-shadow(0 0 5px rgba(255,255,255,0.15));
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

            const content = (
              <div className="flex shrink-0 items-center gap-4 px-10 md:gap-5 md:px-14">
                {/* College logo (icon/crest) — wrapped for contrast */}
                {hasLogo && (
                  <div className="logo-wrap">
                    <img
                      src={inst.imageUrl}
                      alt={inst.imageAlt ?? inst.name}
                      className="h-[100px] w-[100px] shrink-0 object-contain md:h-[120px] md:w-[120px]"
                      loading="lazy"
                    />
                  </div>
                )}

                {/*
                  College name — 3 modes:
                  1. Wordmark image → wrapped for contrast
                  2. Plain text with custom brand color
                  3. Plain white text default
                */}
                {hasWordmark ? (
                  <div className="logo-wrap">
                    <img
                      src={inst.wordmarkUrl}
                      alt={inst.wordmarkAlt ?? inst.name}
                      className="h-[52px] w-auto max-w-[260px] shrink-0 object-contain md:h-[64px] md:max-w-[300px]"
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
              </div>
            );

            if (inst.href) {
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
