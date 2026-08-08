import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const { pathname } = request.nextUrl;

  /* ------------------------------------------------------------------ */
  /*  studio.classgrid.in → rewrite to /studio routes                    */
  /* ------------------------------------------------------------------ */
  const isStudioSubdomain =
    hostname === "studio.classgrid.in" ||
    hostname.startsWith("studio.classgrid.in:");

  if (isStudioSubdomain) {
    // Do not rewrite API routes so NextAuth and webhooks continue to work natively
    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // studio.classgrid.in/         → /studio
    // studio.classgrid.in/vision   → /studio/vision
    const studioPath = pathname === "/" ? "/studio" : `/studio${pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = studioPath;
    return NextResponse.rewrite(url);
  }

  /* ------------------------------------------------------------------ */
  /*  Redirect classgrid.in/studio → studio.classgrid.in                 */
  /* ------------------------------------------------------------------ */
  if (pathname.startsWith("/studio")) {
    const subPath = pathname.replace(/^\/studio\/?/, "");
    const redirectUrl = new URL(
      `https://studio.classgrid.in${subPath ? `/${subPath}` : ""}`
    );
    redirectUrl.search = request.nextUrl.search;
    return NextResponse.redirect(redirectUrl, 301);
  }


  /* ------------------------------------------------------------------ */
  /*  /onboarding — skip instantly if user already has a username         */
  /* ------------------------------------------------------------------ */
  if (pathname === "/onboarding") {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (token?.forumUsername) {
      // User already has a username — no need for onboarding
      const sso = request.nextUrl.searchParams.get("sso");
      const sig = request.nextUrl.searchParams.get("sig");
      const nextUrl = request.nextUrl.searchParams.get("next");

      if (sso && sig) {
        // Discourse SSO flow — go straight to the SSO handshake
        const url = new URL("/api/sso/discourse", request.url);
        url.searchParams.set("sso", sso);
        url.searchParams.set("sig", sig);
        return NextResponse.redirect(url);
      } else if (nextUrl) {
        return NextResponse.redirect(new URL(nextUrl, request.url));
      } else {
        return NextResponse.redirect(new URL("/support/inquiry", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // NextAuth SSO route
    "/api/sso/discourse",
    // Studio path redirect
    "/studio",
    "/studio/:path*",
    // Catch-all for subdomain detection (exclude static/api assets)
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
