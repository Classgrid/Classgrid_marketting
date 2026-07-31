import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_CAREERS_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "https://classgrid.in"}/api/oauth/github/callback`;
  const scope = "read:user repo"; 

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}`;

  return NextResponse.redirect(authUrl);
}
