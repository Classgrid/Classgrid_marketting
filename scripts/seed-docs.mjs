import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

const docsToCreate = [
  {
    _id: 'doc-introduction',
    _type: 'apiDoc',
    title: 'Introduction',
    slug: { current: 'introduction' },
    category: 'getting-started',
    content: `
Welcome to your brand new **Classgrid Documentation** platform!

Because we are using MDX, you can write regular markdown, but you can also include code blocks and eventually custom React components! 

> **Pro Tip:** This entire layout is powered by Sanity CMS and Next.js, meaning you can edit this directly from your dashboard and see it update instantly!

## What can you build?

With the Classgrid API, you can easily integrate our powerful infrastructure into any platform:
- **Student Portals** — Sync grades, attendance, and coursework in real-time.
- **Faculty Dashboards** — Manage permissions and assignment distribution instantly.
- **Automated Billing** — Handle invoices and \`Stripe\` webhooks automatically.

## Getting Started

To get started, you will need an API key from your Classgrid dashboard. This key must be included in the header of all your API requests. Our API follows standard REST principles and returns JSON-encoded responses.

1. Navigate to the **Developers** tab in your dashboard.
2. Click on [Generate New API Key](#).
3. Copy the key and store it securely. *Never share your master key!*

## Authentication Protocol

Authentication is handled via \`Bearer tokens\`. You should generate a short-lived access token using your master API key. The token must be passed in the \`Authorization\` header.

\`\`\`json
{
  "Authorization": "Bearer cg_prod_abc123def456ghi789",
  "Content-Type": "application/json"
}
\`\`\`

## Core Concepts

Classgrid relies on a few core concepts that you must understand before making complex queries:

- **Modules**: Represent the different features available (e.g., *Attendance*, *Grades*, *Billing*).
- **Users**: The individuals accessing the platform. They can have different roles assigned to them.
- **Roles**: Define the exact permissions granted to each user within the different modules.

## Supabase Database Architecture

Here is the schema overview for our core tables used in the platform:

| Table Name | Description | Access Level | Primary Key |
| :--- | :--- | :--- | :--- |
| **\`users\`** | Stores core authentication and profile data | Admin Only | \`uuid\` |
| **\`materials\`** | Contains all educational resources | Authenticated | \`id\` |
| **\`tenant_config\`** | White-label settings for schools | System | \`tenant_id\` |
| **\`support_tickets\`** | Help center tickets and resolutions | Staff | \`ticket_id\` |

*Note: All tables have Row Level Security (RLS) enabled by default.*

## Error Handling

Our API uses standard HTTP status codes to indicate the success or failure of a request.
- \`2xx\` range indicate **success**.
- \`4xx\` range indicate a **client error** (e.g., bad request, unauthorized).
- \`5xx\` range indicate a **server error**.

## Rate Limits

To ensure quality of service for all users, the Classgrid API enforces rate limits. You can make up to **1000 requests per minute** per IP address. If you exceed this limit, you will receive a \`429 Too Many Requests\` response.
`,
  },
  {
    _id: 'doc-deployment-overview',
    _type: 'apiDoc',
    title: 'Deployment Overview',
    slug: { _type: 'slug', current: 'deployment-overview' },
    category: 'platform-guides',
    content: `# Deployment Overview
    
Learn how Classgrid is deployed across EC2 and Vercel.

## AWS EC2
We self-host our core infrastructure on AWS to keep costs low and performance incredibly fast.
`,
  },
  {
    _id: 'doc-rbac-setup',
    _type: 'apiDoc',
    title: 'RBAC Setup',
    slug: { _type: 'slug', current: 'rbac-setup' },
    category: 'admin-setup',
    content: `# Administrator Setup
    
Learn how to assign roles to faculty and students using Classgrid's Role-Based Access Control (RBAC).

1. Go to your dashboard.
2. Click on "Users".
3. Assign the "Faculty" role.
`,
  },
  {
    _id: 'doc-authentication',
    _type: 'apiDoc',
    title: 'Authentication API',
    slug: { _type: 'slug', current: 'authentication' },
    category: 'api-reference',
    content: `# Authentication API
    
Classgrid uses highly secure JWT tokens for API authentication.

## Endpoint
\`POST /api/v1/auth/login\`

\`\`\`json
{
  "email": "student@college.edu",
  "password": "super_secret_password"
}
\`\`\`
`,
  }
];

const mutations = docsToCreate.map(doc => ({
  createOrReplace: doc,
}));

const mutateUrl = `https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`;

const mutateRes = await fetch(mutateUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({ mutations }),
});

const result = await mutateRes.json();

if (mutateRes.ok) {
  console.log('✅ 4 Documentation Pages created successfully in Sanity!');
} else {
  console.error('❌ Failed to create docs:', JSON.stringify(result, null, 2));
}
