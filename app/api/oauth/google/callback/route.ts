import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return new NextResponse(`
      <script>
        window.opener.postMessage({ type: 'oauth_error', error: '${error || "No code provided"}' }, '*');
        window.close();
      </script>
    `, { headers: { "Content-Type": "text/html" } });
  }

  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/oauth/google/callback`;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error("Failed to obtain access token");
    }

    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    
    const userData = await userRes.json();

    return new NextResponse(`
      <script>
        window.opener.postMessage({ 
          type: 'google_oauth_success', 
          profile: {
            firstName: '${userData.given_name || ""}',
            lastName: '${userData.family_name || ""}',
            email: '${userData.email || ""}'
          }
        }, '*');
        window.close();
      </script>
    `, { headers: { "Content-Type": "text/html" } });

  } catch (err: any) {
    return new NextResponse(`
      <script>
        window.opener.postMessage({ type: 'oauth_error', error: '${err.message}' }, '*');
        window.close();
      </script>
    `, { headers: { "Content-Type": "text/html" } });
  }
}
