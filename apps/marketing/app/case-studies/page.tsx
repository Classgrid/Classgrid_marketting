import { caseStudies, caseStudiesCopy, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getCaseStudies, getPageSettings } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.caseStudies);

export default async function Page() {
  const [cmsSettings, cmsStudies] = await Promise.all([
    getPageSettings("case-studies"),
    getCaseStudies(),
  ]);
  const title = cmsSettings?.title ?? caseStudiesCopy.title;
  const subtitle = cmsSettings?.subtitle ?? caseStudiesCopy.subtitle;
  const items = cmsStudies?.length ? cmsStudies : caseStudies;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
      <p className="mt-3 text-slate-300">{subtitle}</p>

      <div className="mt-6 space-y-4">
        {items.map((study: any) => (
          <article key={study.title ?? study._id} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6">
            <h2 className="text-heading text-2xl font-semibold text-white">{study.title}</h2>
            <p className="mt-3 text-slate-300">{study.summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
