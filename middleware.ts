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
  /*  NextAuth protected routes (existing logic)                         */
  /* ------------------------------------------------------------------ */
  if (pathname === "/api/sso/discourse") {
    const token = await getToken({ req: request });
    if (!token) {
      return NextResponse.redirect(new URL("/api/auth/signin", request.url));
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
