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

  const clientId = process.env.GITHUB_CLIENT_ID!;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/oauth/github/callback`;

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description || "Failed to obtain access token");
    }

    const reposRes = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    
    if (!reposRes.ok) {
       throw new Error("Failed to fetch repositories");
    }

    const reposData = await reposRes.json();
    
    const repos = reposData.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count
    }));

    return new NextResponse(`
      <script>
        const repos = ${JSON.stringify(repos)};
        window.opener.postMessage({ type: 'github_oauth_success', repos }, '*');
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
