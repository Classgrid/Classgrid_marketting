import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const requestDemoApiBase =
  (process.env.REQUEST_DEMO_API_BASE_URL || process.env.BACKEND_URL || "")
    .replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    // Only proxy to external backend when REQUEST_DEMO_API_BASE_URL is set
    // Without it, the local app/api/request-demo/route.ts handles demos via MongoDB directly
    if (!requestDemoApiBase) return [];
    return [
      {
        source: "/api/request-demo",
        destination: `${requestDemoApiBase}/api/public/request-demo`,
      },
      {
        source: "/api/request-demo/:id/meeting-booked",
        destination: `${requestDemoApiBase}/api/public/request-demo/:id/meeting-booked`,
      },
    ];
  },
  async redirects() {
    return [
      // Legacy comparison links
      { source: "/compare/vs-competitors", destination: "/compare", permanent: true },
      // Legacy institution → new solutions/industries
      { source: "/institutions", destination: "/solutions", permanent: true },
      { source: "/institutions/school", destination: "/solutions/industries/school", permanent: true },
      { source: "/institutions/schools", destination: "/solutions/industries/school", permanent: true },
      { source: "/institutions/college", destination: "/solutions/industries/college", permanent: true },
      { source: "/institutions/colleges", destination: "/solutions/industries/college", permanent: true },
      { source: "/institutions/junior-college", destination: "/solutions/industries/junior-college", permanent: true },
      { source: "/institutions/jr-college", destination: "/solutions/industries/junior-college", permanent: true },
      { source: "/institutions/coaching", destination: "/solutions/industries/coaching", permanent: true },
      { source: "/institutions/engineering", destination: "/solutions/industries/engineering", permanent: true },
      // Legacy use-cases → new solutions/roles or industries
      { source: "/use-cases", destination: "/solutions", permanent: true },
      { source: "/use-cases/students", destination: "/solutions/roles/students", permanent: true },
      { source: "/use-cases/student", destination: "/solutions/roles/students", permanent: true },
      { source: "/use-cases/teachers", destination: "/solutions/roles/teachers", permanent: true },
      { source: "/use-cases/teacher", destination: "/solutions/roles/teachers", permanent: true },
      { source: "/use-cases/institutes", destination: "/solutions/roles/institutes", permanent: true },
      { source: "/use-cases/institute", destination: "/solutions/roles/institutes", permanent: true },
      { source: "/use-cases/school", destination: "/solutions/industries/school", permanent: true },
      { source: "/use-cases/college", destination: "/solutions/industries/college", permanent: true },
      { source: "/use-cases/junior-college", destination: "/solutions/industries/junior-college", permanent: true },
      { source: "/use-cases/coaching", destination: "/solutions/industries/coaching", permanent: true },
      // Legacy /modules or /product → /product/modules
      { source: "/product", destination: "/product/modules", permanent: true },
      { source: "/modules", destination: "/product/modules", permanent: true },
      { source: "/modules/:slug*", destination: "/product/modules/:slug*", permanent: true },
      
      // BLOCKED TENANT ROUTES - Force redirect to home
      { source: "/college_website", destination: "/", permanent: false },
      { source: "/college_website/:path*", destination: "/", permanent: false },
      { source: "/collge_webiste", destination: "/", permanent: false },
      { source: "/collge_webiste/:path*", destination: "/", permanent: false },
      { source: "/collge_website", destination: "/", permanent: false },
      { source: "/collge_website/:path*", destination: "/", permanent: false },
    ];
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-icons",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-navigation-menu",
    ],
  },
  images: {
    minimumCacheTTL: 3600,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // OAuth provider avatars
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
    ],
  },
};

export default nextConfig;
