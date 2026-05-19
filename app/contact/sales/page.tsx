import { Badge } from "@/components/ui/badge";
import { SectionAccentBar } from "@/components/ui/section-accent-bar";

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
  const kicker = (cms as any)?.kicker ?? (salesContactCopy as any).kicker;
  const title = (cms as any)?.title ?? (salesContactCopy as any).title;
  const titleAccent = (cms as any)?.titleAccent ?? (salesContactCopy as any).titleAccent;
  const body = (cms as any)?.body ?? (salesContactCopy as any).body;
  const metrics: SalesMetric[] = (cms as any)?.metrics?.length ? (cms as any).metrics : (salesContactCopy as any).metrics;
  const formTitle = (cms as any)?.form?.title ?? (salesContactCopy as any).form.title;
  const formSubtitle = (cms as any)?.form?.subtitle ?? (salesContactCopy as any).form.subtitle;
  const submitLabel = (cms as any)?.form?.submitLabel ?? (salesContactCopy as any).form.submitLabel;
  const fieldEmail = (cms as any)?.form?.fields?.email ?? (salesContactCopy as any).form.fields.email;
  const fieldInstitution = (cms as any)?.form?.fields?.institution ?? (salesContactCopy as any).form.fields.institution;
  const fieldRole = (cms as any)?.form?.fields?.role ?? (salesContactCopy as any).form.fields.role;
  const rolePlaceholder = (cms as any)?.form?.fields?.rolePlaceholder ?? (salesContactCopy as any).form.fields.rolePlaceholder;
  const roles: SalesRole[] = (cms as any)?.form?.fields?.roles?.length
    ? (cms as any).form.fields.roles
    : (salesContactCopy as any).form.fields.roles;
  const socialProofKicker = (cms as any)?.socialProof?.kicker ?? (salesContactCopy as any).socialProof.kicker;
  const socialProofNames = (cms as any)?.socialProof?.names?.length
    ? (cms as any).socialProof.names
    : (salesContactCopy as any).socialProof.names;
  return (
    <div className="bg-background text-foreground">
      <section className="border-b border-slate-200 px-4 py-16 dark:border-white/10 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <Badge
              variant="outline"
              className="border-cyan-400/35 bg-cyan-500/10 px-2.5 py-1 text-[10px] tracking-[0.18em] text-cyan-300"
            >
              {kicker}
            </Badge>
            <SectionAccentBar align="left" className="mt-6" />
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              {title}
              <span className="block text-slate-500 dark:text-zinc-400">{titleAccent}</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 dark:text-zinc-300 sm:text-lg">
              {body}
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {(metrics as any).map((metric) => (
                <div key={metric.label} className="rounded-xl border border-border bg-card p-4">
                  <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-zinc-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
            <SectionAccentBar align="left" className="mb-4" />
            <h2 className="text-xl font-semibold">{formTitle}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400">{formSubtitle}</p>

            <form className="mt-6 space-y-4" action="#" method="post">
              <label className="block text-sm">
                <span className="mb-2 block text-slate-700 dark:text-zinc-300">{fieldEmail}</span>
                <input
                  type="email"
                  name="email"
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-slate-700 dark:text-zinc-300">{fieldInstitution}</span>
                <input
                  type="text"
                  name="institution"
                  required
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                />
              </label>

              <label className="block text-sm">
                <span className="mb-2 block text-slate-700 dark:text-zinc-300">{fieldRole}</span>
                <select
                  name="role"
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 dark:border-zinc-700 dark:bg-[#0A0A0A] dark:text-white dark:focus:border-white"
                  defaultValue=""
                >
                  <option value="" disabled>
                    {rolePlaceholder}
                  </option>
                  {(roles as any).map((role) => (
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

      <section className="border-b border-slate-200 px-4 py-8 dark:border-white/10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">
          <span className="text-xs font-medium tracking-[0.16em] text-slate-500 dark:text-zinc-500">
            {socialProofKicker}
          </span>
          <div className="flex flex-wrap gap-2">
            {(socialProofNames as any).map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-md border border-slate-200 px-3 py-1 text-sm text-slate-700 dark:border-white/10 dark:text-zinc-300"
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
