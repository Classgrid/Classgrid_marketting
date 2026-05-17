import { changelogCopy, changelogEntries, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getChangelogEntries, getPageSettings } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.changelog);

export default async function Page() {
  const [cmsSettings, cmsEntries] = await Promise.all([
    getPageSettings("changelog"),
    getChangelogEntries(),
  ]);
  const title = cmsSettings?.title ?? changelogCopy.title;
  const subtitle = cmsSettings?.subtitle ?? changelogCopy.subtitle;
  const entries = cmsEntries?.length ? cmsEntries : changelogEntries;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
      <p className="mt-3 text-slate-300">{subtitle}</p>

      <div className="mt-6 space-y-4">
        {entries.map((entry: any) => (
          <article key={entry.version ?? entry._id} className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
            <p className="text-xs tracking-[0.14em] text-blue-200 uppercase">{entry.version ?? "Release"}</p>
            <h2 className="text-heading mt-1 text-xl font-semibold text-white">{entry.title}</h2>
            {entry.items ? (
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                {entry.items.map((item: string) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-300">{entry.summary}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
