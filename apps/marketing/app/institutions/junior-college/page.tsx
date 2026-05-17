import { adaptiveHeroProfiles, pageMeta, type InstitutionType } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getInstitutionPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.institutionsJuniorCollege);

const institutionType: InstitutionType = "junior-college";

export default async function Page() {
  const cms = await getInstitutionPage(institutionType);
  const profile = adaptiveHeroProfiles[institutionType];
  const label = cms?.label ?? profile.label;
  const headline = cms?.headline ?? profile.headline;
  const subline = cms?.subline ?? profile.subline;
  const capabilities = cms?.capabilities?.length ? cms.capabilities : profile.capabilities;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs tracking-[0.14em] text-blue-200 uppercase">{label} Profile</p>
      <h1 className="text-heading mt-2 text-3xl font-bold text-white md:text-4xl">{headline}</h1>
      <p className="mt-4 text-slate-300">{subline}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {capabilities.map((item) => (
          <div key={item} className="rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-slate-200">
            • {item}
          </div>
        ))}
      </div>
    </div>
  );
}
