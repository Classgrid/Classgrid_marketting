import { pageMeta, statusCopy } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getStatusPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.status);

export default async function Page() {
  const cms = await getStatusPage();
  const kicker = cms?.kicker ?? statusCopy.kicker;
  const title = cms?.headline ?? statusCopy.title;
  const subtitle = cms?.subheadline ?? statusCopy.subtitle;
  const systems = cms?.systems?.length ? cms.systems : statusCopy.systems;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-emerald-300/25 bg-emerald-900/20 p-6">
        <p className="text-xs tracking-[0.16em] text-emerald-200 uppercase">{kicker}</p>
        <h1 className="text-heading mt-2 text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-emerald-100">{subtitle}</p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A]">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10">
            <tr className="text-left text-slate-300">
              <th className="px-4 py-3">System</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Latency</th>
            </tr>
          </thead>
          <tbody>
            {systems.map((system: any) => (
              <tr key={system.name} className="border-b border-white/5 last:border-b-0">
                <td className="px-4 py-3 text-white">{system.name}</td>
                <td className="px-4 py-3 text-emerald-200">{system.status}</td>
                <td className="px-4 py-3 text-slate-300">{system.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
