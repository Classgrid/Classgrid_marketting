import { headers } from "next/headers";
import { resolveTenantSiteData } from "@/lib/tenant-site";
import { TenantWebsiteHomeClient } from "@/components/tenant/TenantWebsiteHomeClient";

type CollgeWebsiteNestedPageProps = {
  params: Promise<{ slug?: string[] }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CollgeWebsiteNestedPage({
  params,
  searchParams,
}: CollgeWebsiteNestedPageProps) {
  const requestHeaders = await headers();
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const tenantFromHeader = requestHeaders.get("x-tenant-slug");
  const tenantFromQueryRaw = Array.isArray(resolvedSearchParams.tenant)
    ? resolvedSearchParams.tenant[0]
    : resolvedSearchParams.tenant;
  const tenantFromQuery = typeof tenantFromQueryRaw === "string" ? tenantFromQueryRaw : "";
  const tenantSlug = (tenantFromHeader || tenantFromQuery || "").trim().toLowerCase();
  const data = await resolveTenantSiteData(tenantSlug);

  return (
    <TenantWebsiteHomeClient
      data={data}
      tenantSlug={tenantSlug}
      segments={resolvedParams.slug || []}
    />
  );
}
