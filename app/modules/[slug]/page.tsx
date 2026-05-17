import { redirect } from "next/navigation";

export default async function LegacyModuleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/product/modules/${slug}`);
}
