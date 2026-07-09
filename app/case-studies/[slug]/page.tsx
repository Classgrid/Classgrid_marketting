import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { caseStudyBySlugQuery } from "@/sanity/lib/queries";
import { CaseStudyDetailClient } from "@/components/case-studies/CaseStudyDetailClient";
import { buildPageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";

export const revalidate = 60; // ISR revalidation

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await client.fetch(caseStudyBySlugQuery, { slug });
  
  if (!caseStudy) {
    return { title: "Case Study | ClassGrid" };
  }

  return buildPageMetadata({
    title: `${caseStudy.title} | ClassGrid Case Study`,
    description: caseStudy.summary || `Read how ${caseStudy.clientName} achieved success with Classgrid.`,
    path: `/case-studies/${slug}`,
    ogImage: caseStudy.heroImageUrl,
  });
}

export default async function CaseStudyDetailPage({ params }: Props) {
  const { slug } = await params;
  const caseStudy = await client.fetch(caseStudyBySlugQuery, {
    slug,
  });

  const data = caseStudy || (slug === "pccoe-fee-recovery" ? MOCK_DETAIL_DATA : null);

  if (!data) {
    notFound();
  }

  const jsonLdData = {
    "@type": "Article",
    "@id": `https://classgrid.in/case-studies/${slug}/#article`,
    "headline": data.title,
    "description": data.summary || data.title,
    "image": data.heroImageUrl,
    "publisher": { "@id": "https://classgrid.in/#organization" }
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <CaseStudyDetailClient data={data as any} />
    </>
  );
}

const MOCK_DETAIL_DATA = {
  title: "₹12L recovered in one semester with zero manual follow-ups",
  slug: "pccoe-fee-recovery",
  clientName: "PCCOE, Pune",
  year: "2024",
  institutionType: "engineering",
  category: "fee-recovery",
  modules: ["finance", "reports", "attendance"],
  heroImageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=1600&q=80",
  metrics: [
    { _key: "m1", value: "12", suffix: "L", label: "Recovered" },
    { _key: "m2", value: "100", suffix: "%", label: "On-Time" },
    { _key: "m3", value: "45", suffix: " Days", label: "Deployed" },
  ],
  championName: "Rahul Sharma",
  championRole: "HOD Finance",
  championQuote: "Classgrid didn't just give us a tool; it gave us our time back. We haven't sent a single manual follow-up email this year, yet our recovery rate is at an all-time high.",
  championHeadshotUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  body: [
    { _key: "b1", _type: "block", children: [{ _key: "c1", _type: "span", text: "The Challenge", marks: ["strong"] }], style: "h2" },
    { _key: "b2", _type: "block", children: [{ _key: "c2", _type: "span", text: "Before Classgrid, the finance department was drowning in manual spreadsheets. Tracking which students had paid and who was overdue took weeks of manual reconciliation. Follow-ups were inconsistent, leading to a mounting backlog of uncollected fees that affected the college's operational budget." }], style: "normal" },
    { _key: "b3", _type: "image", asset: { _ref: "mock-img-1" }, url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80" },
    { _key: "b4", _type: "block", children: [{ _key: "c3", _type: "span", text: "The Solution", marks: ["strong"] }], style: "h2" },
    { _key: "b5", _type: "block", children: [{ _key: "c4", _type: "span", text: "We implemented the Classgrid Finance module with automated payment gateways and real-time ledger sync. The system now automatically triggers reminders based on fee deadlines, and reconciliation happens instantly as soon as a student pays via the portal." }], style: "normal" },
    { _key: "b6", _type: "image", asset: { _ref: "mock-img-2" }, url: "https://images.unsplash.com/photo-1454165833767-0274b27f28a0?w=800&q=80" },
    { _key: "b7", _type: "block", children: [{ _key: "c5", _type: "span", text: "The Outcome", marks: ["strong"] }], style: "h2" },
    { _key: "b8", _type: "block", children: [{ _key: "c6", _type: "span", text: "Within just one semester, PCCOE saw ₹12 Lakhs in previously stalled fees recovered. The administrative burden has dropped by 90%, and the college now has a 100% on-time payment record for the current batch." }], style: "normal" },
    { _key: "b9", _type: "image", asset: { _ref: "mock-img-3" }, url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" },
  ],
  galleryImageUrls: [
    "https://images.unsplash.com/photo-1523050335191-01f448c90214?w=800&q=80",
    "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    "https://images.unsplash.com/photo-1525921429624-479b6a29d84c?w=800&q=80",
    "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
    "https://images.unsplash.com/photo-1491309055486-24ae511c15c7?w=800&q=80",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
  ],
};
