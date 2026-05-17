import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { pageMeta, moduleMatrix, premiumSection, pricingHeader } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getPricingPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.pricing);

export default async function Page() {
  const cms = await getPricingPage();
  const headline = cms?.headline ?? pricingHeader.title;
  const modules = cms?.moduleMatrix?.length ? cms.moduleMatrix : moduleMatrix;
  const premium = cms?.premiumSection ?? premiumSection;
  const callout = cms?.contactSales ?? pricingHeader.callout;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="mb-8">
        <p className="text-xs tracking-[0.16em] text-blue-200 uppercase">{pricingHeader.kicker}</p>
        <h1 className="text-heading mt-2 text-balance text-3xl font-bold text-white md:text-5xl">
          {headline}
        </h1>
        {cms?.subheadline ? <p className="mt-3 text-slate-300">{cms.subheadline}</p> : null}
      </div>

      <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>School</TableHead>
              <TableHead>Coaching</TableHead>
              <TableHead>College (Engineering/Diploma)</TableHead>
              <TableHead>Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((row: any) => (
              <TableRow key={row.id ?? row.name}>
                <TableCell className="font-medium text-white">{row.name}</TableCell>
                <TableCell className="text-slate-300">{row.school ? "Yes" : "No"}</TableCell>
                <TableCell className="text-slate-300">{row.coaching ? "Yes" : "No"}</TableCell>
                <TableCell className="text-slate-300">{row.engineering ? "Yes" : "No"}</TableCell>
                <TableCell className="text-slate-300">{row.level}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <p className="mt-5 rounded-xl border border-blue-300/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-100">
        {callout}
      </p>

      <section className="mt-6 rounded-2xl border border-white/10 bg-[#0A0A0A] p-5">
        <h2 className="text-heading text-lg font-semibold text-white">{premium.title}</h2>
        <p className="mt-2 text-sm text-slate-300">{premium.description}</p>
        <ul className="mt-4 grid gap-2 text-sm text-slate-200 md:grid-cols-2">
          {premium.items?.map((item: string) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-slate-300">{premium.pricingNote}</p>
        {premium.ctaHref && premium.ctaLabel ? (
          <Link
            href={premium.ctaHref}
            className="mt-4 inline-flex rounded-md border border-white/20 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/10"
          >
            {premium.ctaLabel}
          </Link>
        ) : null}
      </section>
    </div>
  );
}
