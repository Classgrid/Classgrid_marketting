import type { Metadata } from "next";
import { headers } from "next/headers";
import { resolveTenantSiteData } from "@/lib/tenant-site";
import { TenantWebsiteHomeClient } from "@/components/tenant/TenantWebsiteHomeClient";

export const metadata: Metadata = {
  title: "Institution Website",
  description:
    "Public institution website experience for schools, junior colleges, and coaching organizations.",
};

type CollgeWebsitePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CollgeWebsitePage({ searchParams }: CollgeWebsitePageProps) {
  const requestHeaders = await headers();
  const params = (await searchParams) ?? {};
  const tenantFromHeader = requestHeaders.get("x-tenant-slug");
  const tenantFromQueryRaw = Array.isArray(params.tenant) ? params.tenant[0] : params.tenant;
  const tenantFromQuery = typeof tenantFromQueryRaw === "string" ? tenantFromQueryRaw : "";
  const tenantSlug = (tenantFromHeader || tenantFromQuery || "").trim().toLowerCase();
  const data = await resolveTenantSiteData(tenantSlug);

  return <TenantWebsiteHomeClient data={data} tenantSlug={tenantSlug} segments={[]} />;
}
