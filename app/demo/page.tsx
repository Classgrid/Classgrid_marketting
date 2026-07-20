import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function DemoRedirectPage() {
  const session = await getServerSession(authOptions);
  const isPlatformUser = !!(session?.user as any)?.isPlatformUser;

  // Platform users don't need the demo form — send them home
  if (isPlatformUser) {
    redirect("/");
  }

  redirect("/#demo");
}
