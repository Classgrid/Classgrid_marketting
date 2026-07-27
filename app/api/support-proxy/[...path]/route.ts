import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy for all /api/support/public/* requests.
 *
 * Why: The production frontend (classgrid.in) calls the platform API through
 * ngrok during development. Ngrok's free tier intercepts browser preflight
 * (OPTIONS) requests and blocks them, causing CORS errors.  By proxying
 * through a same-origin Next.js API route the browser never talks to ngrok
 * directly — the request is forwarded server-to-server where CORS does not
 * apply.
 *
 * Security: The frontend page (requests/page.tsx) already validates the
 * NextAuth session before calling this proxy. This proxy passes a shared
 * secret (PLATFORM_JWT_SECRET) to the backend so the backend trusts
 * these requests as coming from the marketing site.
 *
 * Usage:  fetch("/api/support-proxy/tickets?email=…")
 *    →  forwards to  NEXT_PUBLIC_PLATFORM_API_URL/api/support/public/tickets?email=…
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_PLATFORM_API_URL || "https://api.classgrid.in";

// The email is extracted from the query string (already validated by the frontend session)
function getEmailFromRequest(request: NextRequest): string {
  return request.nextUrl.searchParams.get("email") || "";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subPath = path.join("/");
  const search = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/api/support/public/${subPath}${search ? `?${search}` : ""}`;
  const email = getEmailFromRequest(request);

  try {
    const res = await fetch(url, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        "x-proxy-auth-email": email,
        "x-proxy-auth-secret": process.env.PLATFORM_JWT_SECRET || process.env.JWT_SECRET || "",
      },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subPath = path.join("/");
  const url = `${BACKEND_URL}/api/support/public/${subPath}`;

  try {
    const contentType = request.headers.get("content-type") || "";

    let res;
    let email = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      email = (formData.get("email") as string) || "";
      res = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "ngrok-skip-browser-warning": "true",
          "x-proxy-auth-email": email,
          "x-proxy-auth-secret": process.env.PLATFORM_JWT_SECRET || process.env.JWT_SECRET || "",
        },
      });
    } else {
      const body = await request.json();
      email = body.email || "";
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
          "x-proxy-auth-email": email,
          "x-proxy-auth-secret": process.env.PLATFORM_JWT_SECRET || process.env.JWT_SECRET || "",
        },
        body: JSON.stringify(body),
      });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[Support Proxy Error]:", err);
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}
