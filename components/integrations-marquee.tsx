"use client";

import React from "react";

import { Marquee } from "@/components/ui/marquee";
import { Chip } from "@/components/ui/chip";

type IntegrationLogo = {
  name: string;
  url?: string;
  color?: string;
  renderIcon?: React.ReactNode;
  imageClassName?: string;
};

type IntegrationsMarqueeProps = {
  kicker?: string;
  title?: string;
  subtitle?: string;
  logos?: IntegrationLogo[];
  useFallbackContent?: boolean;
};

function getMonogram(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function IntegrationsMarquee({
  kicker,
  title,
  subtitle,
  logos,
}: IntegrationsMarqueeProps) {
  const logosToUse = Array.isArray(logos) ? logos.filter((logo) => logo?.name?.trim()) : [];

  if (!logosToUse.length && !kicker?.trim() && !title?.trim() && !subtitle?.trim()) {
    return null;
  }

  return (
    <section className="relative z-10 block overflow-hidden border-t border-foreground/10 bg-transparent py-32">
      {(kicker?.trim() || title?.trim() || subtitle?.trim()) ? (
        <div className="relative z-20 mx-auto mb-16 max-w-7xl px-6 text-center">
          {kicker?.trim() ? (
            <Chip variant="emerald" dot interactive className="mb-4 text-sm tracking-wider">
              {kicker}
            </Chip>
          ) : null}
          <div className="mx-auto mb-6 h-1.5 w-24 rounded-full bg-orange-500" />
          {title?.trim() ? (
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              {title}
            </h2>
          ) : null}
          {subtitle?.trim() ? (
            <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      ) : null}

      {logosToUse.length > 0 ? (
        <div className="relative w-full overflow-hidden bg-transparent">
          <Marquee pauseOnHover repeat={4} className="[--duration:15s] [--gap:3rem]">
            {logosToUse.map((logo, idx) => (
              <div
                key={`${logo.name}-${idx}`}
                className="group mx-6 flex flex-col items-center justify-center gap-4 opacity-80 transition-all duration-300 hover:opacity-100"
              >
                <div
                  className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white/90 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#00d084] group-hover:shadow-[0_0_20px_rgba(0,208,132,0.15)] dark:border-[#00d084]/30 dark:bg-[#0f0f0f] dark:shadow-[0_0_15px_rgba(0,208,132,0.05)] dark:group-hover:border-[#00d084] dark:group-hover:shadow-[0_0_25px_rgba(0,208,132,0.25)] md:h-28 md:w-28"
                >
                  <div className="absolute inset-[6px] rounded-[16px] border border-slate-200/90 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(248,250,252,0.96)_55%,rgba(226,232,240,0.92))] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] dark:border-white/10 dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(248,250,252,0.97)_62%,rgba(226,232,240,0.94))]" />
                  <div className="relative z-10 flex h-full w-full items-center justify-center p-[7px] md:p-[8px]">
                    {logo.renderIcon ? (
                      logo.renderIcon
                    ) : logo.url ? (
                      <img
                        src={logo.url}
                        alt={logo.name}
                        className={`h-full w-full object-contain drop-shadow-[0_1px_10px_rgba(15,23,42,0.12)] transition-all duration-300 dark:drop-shadow-[0_1px_12px_rgba(15,23,42,0.16)] ${
                          logo.imageClassName || ""
                        }`}
                      />
                    ) : (
                      <span className="text-lg font-extrabold tracking-wide text-gray-900 dark:text-white">
                        {getMonogram(logo.name)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="whitespace-nowrap text-center text-sm font-semibold text-gray-600 dark:text-white/80 group-hover:text-[#00d084] dark:group-hover:text-[#00d084] transition-colors">
                  {logo.name}
                </span>
              </div>
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-1/6 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-1/6 bg-gradient-to-l from-background to-transparent" />
        </div>
      ) : null}
    </section>
  );
}
