import { PortableText } from "@portabletext/react";

import { aboutContent, aboutCopy, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getAboutPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.about);

export default async function Page() {
  const cms = await getAboutPage();
  const headline = cms?.headline ?? aboutContent.headline;
  const values = cms?.values ?? aboutContent.values;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs tracking-[0.14em] text-blue-200 uppercase">{aboutCopy.kicker}</p>
      <h1 className="text-heading mt-2 text-3xl font-bold text-white md:text-5xl">{headline}</h1>

      <div className="mt-6 space-y-4 text-slate-300">
        {cms?.body ? (
          <PortableText value={cms.body} />
        ) : (
          aboutContent.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
        )}
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {values.map((value) => (
          <article key={value.title} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
            <h2 className="text-heading text-lg font-semibold text-white">{value.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{value.body}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
