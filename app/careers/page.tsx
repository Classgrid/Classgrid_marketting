

import { buildPageMetadata } from "@/lib/metadata";
// trigger rebuild
import { CareersForm } from "@/components/careers/CareersForm";

export const metadata = buildPageMetadata({ title: "Careers | Classgrid", description: "Join the Classgrid team. Apply for internships and full-time roles." });

type SalesMetric = {
  label: string;
  value: string;
};

type SalesRole = {
  label: string;
  value: string;
};

export default async function Page() {
  const title = "Join the Team";
  const titleAccent = "Building Classgrid";
  const body = "We are on a mission to build the best operating system for education in India. If you are passionate about coding, design, or marketing, we would love to have you on board! Apply for our open roles and internships below.";
  
  const metrics: SalesMetric[] = [
    { label: "WORKPLACE", value: "Remote & Flexible" },
    { label: "ENVIRONMENT", value: "Learn & Grow" },
  ];
  
  const formTitle = "Apply to Classgrid";
  const formSubtitle = "We'll review your application and get back to you.";
  const submitLabel = "Submit Application";
  
  const fieldName = "Full Name";
  const fieldEmail = "Email Address";
  const fieldInstitution = "LinkedIn / Portfolio URL";
  const fieldRole = "Interested Role";
  const rolePlaceholder = "Select a role";
  
  const roles: SalesRole[] = [
    { label: "Software Engineer (Full Stack)", value: "swe" },
    { label: "Mobile Developer (React Native/Expo)", value: "mobile_dev" },
    { label: "Database Engineer", value: "db_eng" },
    { label: "Cloud & DevOps Engineer (AWS)", value: "devops" },
    { label: "System Designer / Architect", value: "design" },
    { label: "Product Analytics (PostHog)", value: "analytics" },
    { label: "SEO Specialist", value: "seo" },
    { label: "Marketing & Growth", value: "marketing" },
    { label: "Open Source Maintainer", value: "os_maintainer" },
    { label: "Sales Executive", value: "sales" },
    { label: "Internship (Engineering)", value: "intern_eng" },
    { label: "Internship (Marketing)", value: "intern_mktg" },
  ];
  

  
  return (
    <div className="bg-background text-foreground">
      <section className="border-b border-slate-200 px-4 py-16 dark:border-white/10 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl mt-6">
              {title}
              <span className="block text-slate-500 dark:text-zinc-400 mt-2">{titleAccent}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 dark:text-zinc-300 sm:text-lg">
              {body}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto mt-8">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-border bg-card p-4 text-left">
                  <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-zinc-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-lg">
            <CareersForm
              formTitle={formTitle}
              formSubtitle={formSubtitle}
              submitLabel={submitLabel}
              fieldName={fieldName}
              fieldEmail={fieldEmail}
              fieldInstitution={fieldInstitution}
              fieldRole={fieldRole}
              rolePlaceholder={rolePlaceholder}
              roles={roles}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
