import { Badge } from "@/components/ui/badge";

import { pageMeta, salesContactCopy } from "@/content/siteContent";
import { buildPageMetadata } from "@/lib/metadata";
import { getSalesContactPage } from "@/sanity/lib/marketing";

export const metadata = buildPageMetadata(pageMeta.contactSales);

type SalesMetric = {
  label: string;
  value: string;
};

type SalesRole = {
  label: string;
  value: string;
};

export default async function Page() {
  const cms = await getSalesContactPage();
  const kicker = cms?.kicker ?? salesContactCopy.kicker;
  const title = cms?.title ?? salesContactCopy.title;
  const titleAccent = cms?.titleAccent ?? salesContactCopy.titleAccent;
  const body = cms?.body ?? salesContactCopy.body;
  const metrics: SalesMetric[] = cms?.metrics?.length ? cms.metrics : salesContactCopy.metrics;
  const formTitle = cms?.form?.title ?? salesContactCopy.form.title;
  const formSubtitle = cms?.form?.subtitle ?? salesContactCopy.form.subtitle;
  const submitLabel = cms?.form?.submitLabel ?? salesContactCopy.form.submitLabel;
  const fieldEmail = cms?.form?.fields?.email ?? salesContactCopy.form.fields.email;
  const fieldInstitution = cms?.form?.fields?.institution ?? salesContactCopy.form.fields.institution;
  const fieldRole = cms?.form?.fields?.role ?? salesContactCopy.form.fields.role;
  const rolePlaceholder = cms?.form?.fields?.rolePlaceholder ?? salesContactCopy.form.fields.rolePlaceholder;
  const roles: SalesRole[] = cms?.form?.fields?.roles?.length
    ? cms.form.fields.roles
    : salesContactCopy.form.fields.roles;
  const socialProofKicker = cms?.socialProof?.kicker ?? salesContactCopy.socialProof.kicker;
  const socialProofNames = cms?.socialProof?.names?.length
    ? cms.socialProof.names
    : salesContactCopy.socialProof.names;
  return (
    <div className="bg-black text-white">
      <section className="border-b border-white/10 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge
              variant="outline"
              className="border-cyan-400/35 bg-cyan-500/10 px-2.5 py-1 text-[10px] tracking-[0.18em] text-cyan-300"
            >
              {kicker}
            </Badge>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {title}
              <span className="block text-zinc-400">{titleAccent}</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
              {body}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-white/10 bg-zinc-950/80 p-4">
                  <p className="text-xs font-medium tracking-wide text-zinc-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-[#0A0A0A] p-6 sm:p-8">
            <h2 className="text-xl font-semibold">{formTitle}</h2>
            <p className="mt-2 text-sm text-zinc-400">{formSubtitle}</p>

            <form className="mt-6 space-y-4" action="#" method="post">
              <label className="block text-sm">
                <span className="mb-2 block text-zinc-300">{fieldEmail}</span>
                <input
                  type="email"
                  name="email"
                  required
                  className="h-11 w-full rounded-lg border border-zinc-700 bg-[#0A0A0A] px-3 text-white outline-none transition focus:border-white"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-zinc-300">{fieldInstitution}</span>
                <input
                  type="text"
                  name="institution"
                  required
                  className="h-11 w-full rounded-lg border border-zinc-700 bg-[#0A0A0A] px-3 text-white outline-none transition focus:border-white"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-zinc-300">{fieldRole}</span>
                <select
                  name="role"
                  className="h-11 w-full rounded-lg border border-zinc-700 bg-[#0A0A0A] px-3 text-white outline-none transition focus:border-white"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {rolePlaceholder}
                  </option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-white bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                {submitLabel}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
          <span className="text-xs font-medium tracking-[0.16em] text-zinc-500">
            {socialProofKicker}
          </span>
          <div className="flex flex-wrap gap-2">
            {socialProofNames.map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-md border border-white/10 px-3 py-1 text-sm text-zinc-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
