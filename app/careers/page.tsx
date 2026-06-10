

import { buildPageMetadata } from "@/lib/metadata";
// trigger rebuild
import { CareersForm } from "@/components/careers/CareersForm";

export const metadata = buildPageMetadata({ title: "Careers | Classgrid", description: "Join the Classgrid team. Apply for internships and full-time roles." });

type SalesMetric = {
  label: string;
  value: string;
};

type SalesRole = {
  label: string;
  value: string;
};

export default async function Page() {
  const title = "Join the Team";
  const titleAccent = "Building Classgrid";
  const body = "We are on a mission to build the best operating system for education in India. If you are passionate about coding, design, or marketing, we would love to have you on board! Apply for our open roles and internships below.";
  
  const metrics: SalesMetric[] = [
    { label: "WORKPLACE", value: "Remote & Flexible" },
    { label: "ENVIRONMENT", value: "Learn & Grow" },
  ];
  
  const formTitle = "Apply to Classgrid";
  const formSubtitle = "We'll review your application and get back to you.";
  const submitLabel = "Submit Application";
  
  const fieldName = "Full Name";
  const fieldEmail = "Email Address";
  const fieldInstitution = "LinkedIn / Portfolio URL";
  const fieldRole = "Interested Role";
  const rolePlaceholder = "Select a role";
  
  const roles: SalesRole[] = [
    // ── Engineering ──
    { label: "Full Stack Web Developer", value: "fullstack_web" },
    { label: "Frontend Web Developer", value: "frontend_web" },
    { label: "Backend Web Developer", value: "backend_web" },
    { label: "Software Engineer", value: "software_eng" },
    { label: "Mobile App Developer", value: "mobile_eng" },
    { label: "AI / Machine Learning Engineer", value: "ai_eng" },
    { label: "Data Scientist", value: "data_scientist" },
    { label: "Database Administrator", value: "db_admin" },
    { label: "DevOps & Cloud Engineer", value: "devops_eng" },
    { label: "QA & Testing Engineer", value: "qa_eng" },
    // ── Product & Design ──
    { label: "Product Manager", value: "pm" },
    { label: "UI/UX Designer", value: "designer" },
    { label: "Graphic Designer", value: "graphic_designer" },
    // ── Marketing & Sales ──
    { label: "Growth & Marketing Lead", value: "growth_lead" },
    { label: "SEO & Content Specialist", value: "seo" },
    { label: "Technical Content Writer", value: "tech_writer" },
    { label: "Sales Executive", value: "sales" },
    { label: "Customer Success Manager", value: "customer_success" },
    // ── Internships ──
    { label: "Internship — Full Stack Development", value: "intern_fullstack" },
    { label: "Internship — Frontend Development", value: "intern_frontend" },
    { label: "Internship — Backend Development", value: "intern_backend" },
    { label: "Internship — UI/UX Design", value: "intern_design" },
    { label: "Internship — Marketing & Growth", value: "intern_mktg" },
  ];

  const techStackGroups: Record<string, string[]> = {
    "Languages": [
      "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C++", "C", "C#",
      "Ruby", "PHP", "Swift", "Kotlin", "Dart", "Zig", "Elixir", "Haskell",
      "Scala", "Clojure", "Solidity", "Shell / Bash", "SQL", "HTML", "CSS"
    ],
    "Frontend & UI Styling": [
      "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "SvelteKit",
      "Astro", "Remix", "SolidJS", "Qwik", "HTMX", "Alpine.js", "Tailwind CSS",
      "shadcn/ui", "Material UI (MUI)", "Chakra UI", "Radix UI", "Headless UI",
      "Sass / SCSS", "CSS Modules", "Styled Components", "Emotion", "Vanilla Extract",
      "Framer Motion", "GSAP", "Three.js", "Vite", "Webpack", "esbuild"
    ],
    "State Management & Fetching": [
      "Zustand", "Redux Toolkit", "React Query / TanStack Query", "SWR",
      "Jotai", "Recoil", "MobX", "React Context API", "Apollo Client", "URQL"
    ],
    "Backend & API Protocols": [
      "Node.js", "Bun", "Deno", "Express.js", "Fastify", "NestJS", "Hono", "Elysia",
      "Django", "Flask", "FastAPI", "Laravel", "Spring Boot", "Ruby on Rails",
      "GraphQL", "REST API", "gRPC", "WebSockets", "Socket.IO", "tRPC", "WebRTC"
    ],
    "Databases & Caching": [
      "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Upstash", "Neon",
      "Turso", "Firebase Firestore", "DynamoDB", "Cassandra", "Neo4j",
      "Elasticsearch", "ClickHouse", "Snowflake", "Prisma ORM", "Drizzle ORM",
      "Mongoose", "MariaDB", "Oracle DB", "SQL Server"
    ],
    "Vector & AI Databases": [
      "Pinecone", "Qdrant", "Chroma DB", "Weaviate", "Milvus", "LanceDB",
      "Supabase pgvector", "Neon pgvector", "Faiss"
    ],
    "Auth & Security Identity": [
      "Clerk", "NextAuth / Auth.js", "Firebase Auth", "Supabase Auth", "Kinde",
      "Auth0", "Better Auth", "Lucia Auth", "Passport.js", "JWT / OAuth 2.0"
    ],
    "Cloud & Serverless Computing": [
      "AWS (EC2, S3, RDS)", "Google Cloud (GCP)", "Microsoft Azure", "Vercel",
      "Netlify", "Railway", "Render", "Fly.io", "Cloudflare Workers / Pages",
      "DigitalOcean", "Heroku", "AWS Lambda", "Google Cloud Run", "SST"
    ],
    "DevOps, CI/CD & Monorepos": [
      "Docker", "Kubernetes", "Nginx", "Apache", "PM2", "GitHub Actions",
      "GitLab CI/CD", "CircleCI", "Terraform", "Ansible", "Helm", "Prometheus",
      "Grafana", "Turborepo", "Nx (Monorepo)", "Linux Administration"
    ],
    "Mobile & Game Development": [
      "React Native", "Expo", "Flutter", "Swift (iOS)", "Kotlin (Android)",
      "SwiftUI", "Jetpack Compose", "Unity", "Unreal Engine", "PWA"
    ],
    "AI, ML & Data Science": [
      "OpenAI API", "Google Gemini API", "Anthropic Claude API", "Groq",
      "Vercel AI SDK", "LangChain", "LangGraph", "LlamaIndex", "Hugging Face",
      "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "Polars",
      "Ollama", "Replicate", "RAG (Retrieval-Augmented Generation)", "NLP", "Computer Vision"
    ],
    "CMS & E-Commerce": [
      "Sanity CMS", "WordPress", "Shopify", "Webflow", "Payload CMS", "Strapi",
      "Contentful", "Ghost", "KeystoneJS", "Hugo", "Docusaurus"
    ],
    "Web3 & Blockchain": [
      "Solidity", "Web3.js", "Ethers.js", "Hardhat", "Foundry", "Rust (Solana)",
      "IPFS", "Arweave"
    ],
    "Testing & Quality Assurance": [
      "Jest", "Vitest", "Cypress", "Playwright", "Selenium", "Mocha / Chai",
      "Testing Library", "MSW (Mock Service Worker)", "Puppeteer", "Postman",
      "JUnit", "PyTest", "Storybook"
    ],
    "Other SaaS & Payment APIs": [
      "Git / GitHub", "Jira", "Linear", "Notion", "Slack", "Stripe", "Razorpay",
      "Lemon Squeezy", "PayPal", "Twilio", "Agora (Video/Voice)", "SendGrid",
      "Brevo", "Cloudinary", "Uploadthing", "PostHog", "Mixpanel", "Sentry"
    ]
  };
  

  
  return (
    <div className="bg-background text-foreground">
      <section className="min-h-screen border-b border-slate-200 px-4 py-16 dark:border-white/10 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl mt-6">
              {title}
              <span className="block text-muted-foreground mt-2">{titleAccent}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {body}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto mt-8">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-border bg-card p-4 text-left">
                  <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-zinc-500">{metric.label}</p>
                  <p className="mt-2 text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-lg">
            <CareersForm
              formTitle={formTitle}
              formSubtitle={formSubtitle}
              submitLabel={submitLabel}
              fieldName={fieldName}
              fieldEmail={fieldEmail}
              fieldInstitution={fieldInstitution}
              fieldRole={fieldRole}
              rolePlaceholder={rolePlaceholder}
              roles={roles}
              techStackGroups={techStackGroups}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
