import Link from "next/link";

import { adaptiveHeroProfiles, institutionsCopy, pageMeta, type InstitutionType } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getInstitutionPages, getPageSettings } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.institutions);

type InstitutionCard = {
  institutionType: InstitutionType | string;
  label?: string;
  headline?: string;
  subline?: string;
};

const links = [
  { key: "college", href: "/institutions/college" },
  { key: "junior-college", href: "/institutions/junior-college" },
  { key: "coaching", href: "/institutions/coaching" },
  { key: "school", href: "/institutions/school" },
] as const;

export default async function Page() {
  const [cmsSettings, cmsInstitutions] = await Promise.all([
    getPageSettings("institutions"),
    getInstitutionPages(),
  ]);
  const title = cmsSettings?.title ?? institutionsCopy.title;
  const subtitle = cmsSettings?.subtitle ?? institutionsCopy.subtitle;
  const items: InstitutionCard[] = cmsInstitutions?.length
    ? cmsInstitutions.map((item) => ({
        institutionType: item.institutionType,
        label: item.label,
        headline: item.headline,
        subline: item.subline,
      }))
    : links.map((item) => ({
        institutionType: item.key,
        label: adaptiveHeroProfiles[item.key].label,
        headline: adaptiveHeroProfiles[item.key].headline,
        subline: adaptiveHeroProfiles[item.key].subline,
      }));
  const fallbackProfile = adaptiveHeroProfiles.college;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-heading text-3xl font-bold text-white md:text-4xl">{title}</h1>
      <p className="mt-3 text-slate-300">{subtitle}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const key = item.institutionType as InstitutionType;
          const profile = adaptiveHeroProfiles[key] ?? fallbackProfile;
          const href = `/institutions/${item.institutionType}`;

          return (
            <Link
              key={item.institutionType}
              href={href}
              className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-5 transition hover:-translate-y-1 hover:border-blue-300/40"
            >
              <p className="text-xs tracking-[0.14em] text-blue-200 uppercase">{item.label ?? profile.label}</p>
              <h2 className="text-heading mt-2 text-xl font-semibold text-white">{item.headline ?? profile.headline}</h2>
              <p className="mt-3 text-sm text-slate-300">{item.subline ?? profile.subline}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
