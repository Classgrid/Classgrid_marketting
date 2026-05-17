import { Metadata } from "next";
import { getCaseStudies, getCaseStudySettings } from "@/sanity/lib/marketing";
import { CaseStudiesClient, CaseStudy } from "@/components/case-studies/CaseStudiesClient";

export const metadata: Metadata = {
  title: "Case Studies | Classgrid",
  description: "See how institutions across India are transforming campus operations with Classgrid.",
};

export const revalidate = 60;

function extractString(val: unknown): string {
  if (typeof val === "string") return val;
  if (val && typeof val === "object") {
    const loc = val as Record<string, unknown>;
    return (loc.en ?? loc.hi ?? loc.mr ?? "") as string;
  }
  return "";
}

export default async function CaseStudiesPage() {
  const [raw, settings] = await Promise.all([
    getCaseStudies() as Promise<any[]>,
    getCaseStudySettings() as Promise<{ heroSubtitle?: string } | null>,
  ]);

  const caseStudies: CaseStudy[] = (raw || [])
    .map((doc: any) => ({
      ...doc,
      title: extractString(doc.title),
      summary: extractString(doc.summary),
      clientName: extractString(doc.clientName) || doc.client || "",
    }))
    .filter((doc: any) => typeof doc.title === "string" && doc.title.trim() !== "");

  return (
    <CaseStudiesClient
      caseStudies={caseStudies}
      heroSubtitle={settings?.heroSubtitle ?? null}
    />
  );
}
