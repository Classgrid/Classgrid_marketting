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
 * Usage:  fetch("/api/support-proxy/tickets?email=…")
 *    →  forwards to  NEXT_PUBLIC_PLATFORM_API_URL/api/support/public/tickets?email=…
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_PLATFORM_API_URL || "http://localhost:3000";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const subPath = path.join("/");
  const search = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL}/api/support/public/${subPath}${search ? `?${search}` : ""}`;

  try {
    const res = await fetch(url, {
      headers: {
        "ngrok-skip-browser-warning": "true",
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
    if (contentType.includes("multipart/form-data")) {
      // Forward the raw stream to preserve multipart boundaries exactly
      res = await fetch(url, {
        method: "POST",
        body: request.body as any,
        headers: {
          "Content-Type": contentType,
          "ngrok-skip-browser-warning": "true",
        },
        // @ts-ignore
        duplex: "half",
      });
    } else {
      // Forward JSON body
      const body = await request.json();
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(body),
      });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Backend unreachable" },
      { status: 502 }
    );
  }
}
