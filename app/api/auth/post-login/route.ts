import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  const base = process.env.NEXTAUTH_URL || "https://classgrid.in";

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", base));
  }

  const user = session.user as any;

  if (user.isPlatformUser) {
    return NextResponse.redirect(new URL("/support/ticket", base));
  }

  return NextResponse.redirect(new URL("/support/inquiry", base));
}
