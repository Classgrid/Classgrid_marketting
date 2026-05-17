import { PortableText } from "@portabletext/react";

import { faqCopy, faqItems, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getFaqItems, getPageSettings } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.faq);

type FaqItem = {
  q: string;
  a: string | Array<unknown>;
};

export default async function Page() {
  const [cmsSettings, cmsFaqItems] = await Promise.all([
    getPageSettings("faq"),
    getFaqItems(),
  ]);
  const title = cmsSettings?.title ?? faqCopy.title;
  const subtitle = cmsSettings?.subtitle ?? faqCopy.subtitle;
  const items: FaqItem[] = cmsFaqItems?.length
    ? cmsFaqItems.map((item) => ({ q: item.question, a: item.answer }))
    : faqItems;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
      <p className="mt-3 text-slate-300">{subtitle}</p>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <details key={item.q} className="group rounded-xl border border-white/10 bg-[#0A0A0A] p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-white">
              {item.q}
            </summary>
            <div className="mt-2 text-sm text-slate-300">
              {Array.isArray(item.a) ? <PortableText value={item.a} /> : <p>{item.a}</p>}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
