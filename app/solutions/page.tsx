import { SolutionsPortal } from "@/components/solutions/SolutionsPortal";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata = buildPageMetadata({
  title: "Solutions",
  description: "Choose your role or institution type and explore how Classgrid solves that exact workflow.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return <SolutionsPortal />;
}
