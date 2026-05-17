import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { compareCopy, compareRows, pageMeta } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getComparisonPages, getPageSettings } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.compare);

export default async function Page() {
  const [cmsSettings, cmsComparisons] = await Promise.all([
    getPageSettings("compare"),
    getComparisonPages(),
  ]);
  const title = cmsSettings?.title ?? compareCopy.title;
  const subtitle = cmsSettings?.subtitle ?? compareCopy.subtitle;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-heading text-3xl font-bold text-white md:text-5xl">{title}</h1>
      <p className="mt-3 text-slate-300">{subtitle}</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Capability</TableHead>
              <TableHead>Classgrid</TableHead>
              <TableHead>Legacy ERP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compareRows.map((row) => (
              <TableRow key={row.capability}>
                <TableCell className="font-medium text-white">{row.capability}</TableCell>
                <TableCell className="text-slate-200">{row.classgrid}</TableCell>
                <TableCell className="text-slate-300">{row.legacyErp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {cmsComparisons?.length ? (
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {cmsComparisons.map((item: any) => (
            <a
              key={item.slug ?? item._id}
              href={`/compare/${item.slug}`}
              className="rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-slate-200 transition hover:border-blue-300/40 hover:text-white"
            >
              {item.headline ?? `Classgrid vs ${item.competitorName}`}
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
