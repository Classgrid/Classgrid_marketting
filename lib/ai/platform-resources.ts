export type PlatformResource = {
  label: string;
  href: string;
  description: string;
  category: string;
  keywords: string[];
};

export const PLATFORM_RESOURCES: PlatformResource[] = [
  {
    label: "Help Center",
    href: "/help-center",
    description: "Support articles, onboarding help, troubleshooting, and operational guidance.",
    category: "support",
    keywords: ["help", "support", "article", "guide", "documentation"],
  },
  {
    label: "Support",
    href: "/support",
    description: "Support overview for guided onboarding, training, and technical help.",
    category: "support",
    keywords: ["support", "technical help", "contact support", "issue"],
  },
  {
    label: "Submit a Ticket",
    href: "/support/ticket",
    description: "Raise a support ticket for academic queries, technical assistance, or bug reports. Requires login. Ticket goes to the Classgrid support team and you get email updates when they reply.",
    category: "support",
    keywords: ["ticket", "issue", "request", "bug", "raise ticket", "submit ticket", "report"],
  },
  {
    label: "Speak with Classgrid",
    href: "/support/inquiry",
    description: "Send an inquiry to speak directly with the Classgrid team. Requires login. Use this for pre-sales questions, consultations, or detailed support requests.",
    category: "support",
    keywords: ["inquiry", "speak", "talk", "consultation", "get in touch", "chat", "support chat", "help"],
  },
  {
    label: "Classgrid Talk",
    href: "/community",
    description: "Community discussion portal for pre-sales questions, product inquiries, and general Classgrid discussion. Not a traditional forum.",
    category: "community",
    keywords: ["community", "classgrid talk", "discussion", "inquiry"],
  },
  {
    label: "Pricing",
    href: "/pricing",
    description: "Pricing overview, plans, module tiers, and quote guidance.",
    category: "sales",
    keywords: ["pricing", "plans", "billing", "quote", "cost"],
  },
  {
    label: "Book a Demo",
    href: "/#demo",
    description: "Demo request flow for institution consultation and guided onboarding.",
    category: "sales",
    keywords: ["demo", "book demo", "trial", "onboarding"],
  },
  {
    label: "Careers",
    href: "/careers",
    description: "Apply for open roles and internships",
    category: "company",
    keywords: ["careers", "jobs", "hiring", "work"],
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Classgrid contact page for sales, support, and coordination.",
    category: "company",
    keywords: ["contact", "email", "support"],
  },
  {
    label: "Product Modules",
    href: "/product/modules",
    description: "Module directory for Classgrid platform capabilities.",
    category: "product",
    keywords: ["modules", "features", "product", "capabilities"],
  },
  {
    label: "Platform Preview",
    href: "/view-platform",
    description: "Guided preview of Classgrid platform experiences across roles.",
    category: "product",
    keywords: ["platform", "preview", "dashboard", "product tour"],
  },
  {
    label: "Solutions",
    href: "/solutions",
    description: "Institution and role-based solution pages.",
    category: "product",
    keywords: ["solutions", "institution", "role"],
  },
  {
    label: "Blog",
    href: "/blog",
    description: "Classgrid articles and insights on education operations and AI workflows.",
    category: "content",
    keywords: ["blog", "article", "insight"],
  },
  {
    label: "Changelog",
    href: "/changelog",
    description: "Product release notes and platform updates.",
    category: "content",
    keywords: ["changelog", "release", "updates"],
  },
  {
    label: "Case Studies",
    href: "/case-studies",
    description: "Institution outcome stories and operational transformation examples.",
    category: "content",
    keywords: ["case study", "customer story"],
  },
  {
    label: "Reviews",
    href: "/reviews",
    description: "Institution reviews and testimonials.",
    category: "content",
    keywords: ["reviews", "testimonials"],
  },
  {
    label: "Terms of Service",
    href: "/terms",
    description: "Classgrid legal terms for usage, billing, licensing, and responsibilities.",
    category: "legal",
    keywords: ["terms", "legal", "billing", "subscription"],
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
    description: "Data processing, student privacy, retention, and security policy.",
    category: "legal",
    keywords: ["privacy", "data", "student data"],
  },
  {
    label: "Cookie Policy",
    href: "/cookies",
    description: "Cookie and local-storage usage policy.",
    category: "legal",
    keywords: ["cookies", "local storage"],
  },

  {
    label: "Security",
    href: "/security",
    description: "Security controls, data isolation, and infrastructure posture.",
    category: "legal",
    keywords: ["security", "data isolation", "zero data bleed"],
  },
  {
    label: "Status",
    href: "https://classgrid1.statuspage.io",
    description: "Public Classgrid service status.",
    category: "operations",
    keywords: ["status", "uptime", "incident"],
  },
  {
    label: "Team",
    href: "/team",
    description: "Classgrid team page.",
    category: "company",
    keywords: ["team", "people"],
  },
  {
    label: "Acknowledgement",
    href: "/acknowledgement",
    description: "Acknowledgements and credits.",
    category: "company",
    keywords: ["acknowledgement", "credits"],
  },
];

export function getSiteBaseUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "https://classgrid.in").replace(/\/+$/g, "");
}

export function toAbsoluteResourceUrl(href: string) {
  if (/^https?:\/\//i.test(href)) return href;
  return `${getSiteBaseUrl()}${href.startsWith("/") ? href : `/${href}`}`;
}

export function formatPlatformResourceDirectory(channel: "web" | "whatsapp") {
  return PLATFORM_RESOURCES.map((resource) => {
    const url = toAbsoluteResourceUrl(resource.href);
    const link = channel === "web" ? `[${resource.label}](${resource.href})` : `${resource.label}: ${url}`;
    return `- ${link} - ${resource.description}`;
  }).join("\n");
}
