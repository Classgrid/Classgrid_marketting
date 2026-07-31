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

  const clientId = process.env.GITHUB_CAREERS_CLIENT_ID || process.env.GITHUB_CLIENT_ID!;
  const clientSecret = process.env.GITHUB_CAREERS_CLIENT_SECRET || process.env.GITHUB_CLIENT_SECRET!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || "https://classgrid.in"}/api/oauth/github/callback`;

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

    const graphqlQuery = `
      query {
        viewer {
          repositoriesContributedTo(first: 50, contributionTypes: [COMMIT, PULL_REQUEST, REPOSITORY]) {
            nodes {
              id
              name
              nameWithOwner
              url
              description
              primaryLanguage { name }
              stargazerCount
            }
          }
          repositories(first: 50, ownerAffiliations: [OWNER, COLLABORATOR, ORGANIZATION_MEMBER], orderBy: {field: PUSHED_AT, direction: DESC}) {
            nodes {
              id
              name
              nameWithOwner
              url
              description
              primaryLanguage { name }
              stargazerCount
            }
          }
        }
      }
    `;

    const reposRes = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
        "User-Agent": "Classgrid-Careers-App"
      },
      body: JSON.stringify({ query: graphqlQuery })
    });
    
    if (!reposRes.ok) {
       throw new Error("Failed to fetch repositories via GraphQL");
    }

    const reposData = await reposRes.json();
    
    const contributedNodes = reposData.data?.viewer?.repositoriesContributedTo?.nodes || [];
    const ownedNodes = reposData.data?.viewer?.repositories?.nodes || [];
    
    const allNodes = [...ownedNodes, ...contributedNodes];
    
    // Deduplicate by id
    const uniqueReposMap = new Map();
    allNodes.forEach((node: any) => {
      if (node && !uniqueReposMap.has(node.id)) {
        uniqueReposMap.set(node.id, {
          id: node.id,
          name: node.nameWithOwner,
          fullName: node.nameWithOwner,
          url: node.url,
          description: node.description,
          language: node.primaryLanguage?.name || null,
          stars: node.stargazerCount
        });
      }
    });

    const repos = Array.from(uniqueReposMap.values());

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Classgrid-Careers-App"
      },
    });

    if (!userRes.ok) {
       throw new Error("Failed to fetch user profile");
    }

    const userData = await userRes.json();
    const githubUsername = userData.login;
    const githubProfileUrl = userData.html_url;

    return new NextResponse(`
      <script>
        const repos = ${JSON.stringify(repos)};
        window.opener.postMessage({ 
          type: 'github_oauth_success', 
          repos, 
          username: '${githubUsername}', 
          profileUrl: '${githubProfileUrl}' 
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
