

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
    { label: "Full Stack Engineer", value: "fullstack_eng" },
    { label: "Backend Engineer", value: "backend_eng" },
    { label: "Frontend Engineer", value: "frontend_eng" },
    { label: "Mobile Engineer", value: "mobile_eng" },
    { label: "AI / ML Engineer", value: "ai_eng" },
    { label: "Real-Time Engineer", value: "realtime_eng" },
    { label: "Database Engineer", value: "db_eng" },
    { label: "DevOps & Cloud Engineer", value: "devops_eng" },
    { label: "QA & Testing Engineer", value: "qa_eng" },
    // ── Marketing & Growth ──
    { label: "SEO & Content Specialist", value: "seo" },
    { label: "Growth & Marketing Lead", value: "growth_lead" },
    { label: "Product Analytics", value: "analytics" },
    { label: "Technical Content Writer", value: "tech_writer" },
    { label: "Sales Executive", value: "sales" },
    // ── Design ──
    { label: "UI/UX Designer", value: "designer" },
    // ── Internships ──
    { label: "Internship — Engineering", value: "intern_eng" },
    { label: "Internship — Design", value: "intern_design" },
    { label: "Internship — Marketing & Growth", value: "intern_mktg" },
  ];

  const techStackGroups: Record<string, string[]> = {
    "Languages": [
      "JavaScript", "TypeScript", "Python", "Java", "C++", "C", "C#", "Go", "Rust",
      "Ruby", "PHP", "Swift", "Kotlin", "Dart", "R", "Scala", "Perl", "Lua",
      "Shell / Bash", "SQL", "HTML", "CSS", "Zig", "Elixir", "Haskell", "MATLAB"
    ],
    "Frontend": [
      "React", "Next.js", "Vue.js", "Nuxt.js", "Angular", "Svelte", "SvelteKit",
      "Astro", "Remix", "Qwik", "SolidJS", "Gatsby", "jQuery", "HTMX", "Alpine.js",
      "Tailwind CSS", "Bootstrap", "Material UI", "Chakra UI", "shadcn/ui",
      "Sass / SCSS", "Framer Motion", "GSAP", "Three.js", "D3.js",
      "Vite", "Webpack", "Turbopack", "Parcel", "esbuild"
    ],
    "State Management": [
      "Zustand", "Redux / Redux Toolkit", "React Query / TanStack Query",
      "Jotai", "Recoil", "MobX", "Pinia (Vue)", "XState", "React Context API"
    ],
    "Backend": [
      "Node.js", "Bun", "Deno", "Express.js", "Fastify", "Hono", "NestJS", "Elysia",
      "Django", "Flask", "FastAPI", "Spring Boot", "Ruby on Rails", "Laravel",
      "ASP.NET", "Gin (Go)", "Fiber (Go)", "Phoenix (Elixir)",
      "GraphQL", "REST API", "gRPC", "WebSockets", "Socket.IO", "tRPC"
    ],
    "Databases": [
      "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Upstash",
      "Supabase", "Neon", "Turso", "Firebase / Firestore", "DynamoDB",
      "Cassandra", "Neo4j", "Elasticsearch", "CockroachDB", "PlanetScale",
      "Xata", "Convex", "Prisma", "Drizzle ORM", "Mongoose",
      "MariaDB", "Oracle DB", "SQL Server"
    ],
    "Vector & AI DBs": [
      "Pinecone", "Qdrant", "Chroma DB", "Weaviate", "Milvus",
      "Supabase pgvector", "Neon pgvector", "LanceDB"
    ],
    "Auth & Security": [
      "Clerk", "NextAuth / Auth.js", "Firebase Auth", "Supabase Auth",
      "Auth0", "Passport.js", "JWT", "OAuth 2.0", "Lucia", "Better Auth"
    ],
    "Cloud & DevOps": [
      "AWS", "Google Cloud (GCP)", "Microsoft Azure", "Vercel", "Netlify",
      "Railway", "Render", "Fly.io", "DigitalOcean", "Heroku", "Cloudflare",
      "Docker", "Kubernetes", "Nginx", "Apache", "PM2",
      "Terraform", "Ansible", "GitHub Actions", "GitLab CI/CD", "Jenkins",
      "Linux Administration", "Turborepo", "Nx (Monorepo)"
    ],
    "Mobile": [
      "React Native", "Expo", "Flutter", "Swift (iOS)", "Kotlin (Android)",
      "Ionic", "Capacitor", "Xamarin", "PWA"
    ],
    "AI / ML": [
      "OpenAI API", "Google Gemini", "Groq", "Anthropic Claude API",
      "Vercel AI SDK", "LangChain", "LangGraph", "LlamaIndex",
      "Hugging Face", "TensorFlow", "PyTorch", "scikit-learn",
      "RAG (Retrieval Augmented Gen)", "Computer Vision", "NLP",
      "Stable Diffusion", "Ollama", "Replicate"
    ],
    "Backend-as-a-Service": [
      "Appwrite", "PocketBase", "Convex", "Supabase BaaS",
      "Firebase BaaS", "Directus", "Strapi"
    ],
    "Design & CMS": [
      "Figma", "Adobe XD", "Photoshop", "Illustrator", "Canva", "Blender",
      "Sanity CMS", "WordPress", "Contentful", "Ghost", "Payload CMS"
    ],
    "Testing & QA": [
      "Jest", "Vitest", "Cypress", "Playwright", "Selenium", "Mocha / Chai",
      "Testing Library", "Supertest", "Postman", "JUnit", "PyTest", "Storybook"
    ],
    "Other Tools": [
      "Git / GitHub", "Jira", "Linear", "Notion", "Slack", "PostHog", "Mixpanel",
      "Razorpay", "Stripe", "Agora", "Twilio", "SendGrid / Brevo",
      "Cloudinary", "Uploadthing", "RabbitMQ", "Kafka",
      "Sentry", "Datadog", "Grafana", "Prometheus", "Zod", "Yup"
    ]
  };
  

  
  return (
    <div className="bg-background text-foreground">
      <section className="min-h-screen border-b border-slate-200 px-4 py-16 dark:border-white/10 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl mt-6">
              {title}
              <span className="block text-slate-500 dark:text-zinc-400 mt-2">{titleAccent}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 dark:text-zinc-300 sm:text-lg">
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
