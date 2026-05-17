import { DemoRequestForm } from "@/components/sections/DemoRequestForm";
import { Reveal } from "@/components/sections/Reveal";
import { demoCopy, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getDemoPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.demo);

export default async function Page() {
  const cms = await getDemoPage();
  const headline = cms?.headline ?? demoCopy.title;
  const body = cms?.subheadline ?? demoCopy.body;
  const highlights = cms?.benefits ?? demoCopy.highlights;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Reveal>
          <section className="glass h-full rounded-2xl border border-white/10 p-7">
            <p className="text-xs tracking-[0.16em] text-blue-200 uppercase">{demoCopy.kicker}</p>
            <h1 className="text-heading mt-3 text-balance text-3xl font-bold text-white md:text-4xl">
              {headline}
            </h1>
            <p className="mt-4 text-slate-300">{body}</p>

            <div className="mt-6 grid gap-3">
              {highlights.map((item: string) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-slate-200"
                >
                  • {item}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-emerald-300/25 bg-emerald-900/20 px-4 py-3 text-sm text-emerald-100">
              {demoCopy.nextStep}
            </div>
          </section>
        </Reveal>

        <Reveal delay={0.06}>
          <section className="h-full">
            <DemoRequestForm
              title={cms?.headline}
              subtitle={cms?.subheadline}
              submitLabel={cms?.ctaButton}
              successTitle={cms?.successMessage}
            />
          </section>
        </Reveal>
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] px-3 py-3">
        <div className="animate-marquee flex min-w-max gap-3">
          {[...demoCopy.proofLogos, ...demoCopy.proofLogos].map((logo, index) => (
            <span
              key={`${logo}-${index}`}
              className="rounded-md border border-white/10 bg-black px-3 py-1 text-xs tracking-wide text-slate-300 uppercase"
            >
              {logo}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
