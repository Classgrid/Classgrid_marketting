import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { compareHubPageQuery, comparisonPagesQuery } from "@/sanity/lib/queries";
import { ComparisonHubClient } from "@/components/compare/ComparisonHubClient";

// Disable caching for this route so it's always up to date with CMS
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const hubData = await client.fetch(compareHubPageQuery);
  
  return {
    title: hubData?.seoTitle || "Compare Classgrid",
    description: hubData?.metaDescription || "Compare Classgrid against other platforms.",
  };
}

export default async function CompareHubPage() {
  const hubData = await client.fetch(compareHubPageQuery);
  const comparisons = await client.fetch(comparisonPagesQuery);

  // Hardcode the neutral headline as the main text
  const heroHeadline = "Every institution works differently. Compare workflows, usability, architecture, and operational experience across platforms";
  const heroSubheadline = "";

  // If Sanity has no comparisons yet, provide a mock one so the layout looks great
  const finalComparisons = comparisons && comparisons.length > 0 ? comparisons : [
    {
      _id: "mock-compare-vmedulife",
      competitorName: "vmedulife",
      slug: "vmedulife",
      metaDescription: "In-depth technical comparison between vmedulife and Classgrid architecture.",
    }
  ];

  return (
    <ComparisonHubClient 
      hubData={{
        heroHeadline,
        heroSubheadline,
      }} 
      comparisons={finalComparisons} 
    />
  );
}
