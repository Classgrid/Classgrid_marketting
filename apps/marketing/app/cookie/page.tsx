import { PortableText } from "@portabletext/react";

import { cookiePolicy, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getPolicyPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.cookie);

export default async function Page() {
  const cms = await getPolicyPage("cookie");
  const title = cms?.headline ?? cookiePolicy.title;
  const updated = cms?.lastUpdated
    ? `Last Updated: ${new Date(cms.lastUpdated).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })}`
    : cookiePolicy.updated;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-slate-400">{updated}</p>

      {cms?.content ? (
        <section className="mt-6 rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
          <div className="text-sm leading-relaxed text-slate-300">
            <PortableText value={cms.content} />
          </div>
        </section>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">We use</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              {cookiePolicy.uses.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">We do not use</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              {cookiePolicy.doesNotUse.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
