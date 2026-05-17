export type CompareHubContent = {
  seoTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  ogImage?: string;
};

export type ComparisonPageContent = {
  seoTitle: string;
  metaDescription: string;
  ogImage?: string;
  competitorName: string;
  slug: string;
  ratingBadges: Array<{
    platform: string;
    score: number;
    badgeLabel?: string;
  }>;
  usps: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  featureMatrix: Array<{
    category: string;
    featureName: string;
    ourStatus: string;
    ourIcon: "check" | "warning" | "cross";
    competitorStatus: string;
    competitorIcon: "check" | "warning" | "cross";
  }>;
  migrationTestimonial?: {
    quoteText: string;
    authorName: string;
    authorRole: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export const compareHubFallback: CompareHubContent = {
  seoTitle: "Classgrid vs vmedulife and legacy ERP software",
  metaDescription:
    "Compare Classgrid against legacy school ERP software and see how our automated NAAC compliance and real-time architecture outpaces the competition.",
  heroHeadline: "Compare Classgrid with the platforms institutions are trying to replace",
  heroSubheadline:
    "Audit our NAAC compliance engine, biometric integrations, and real-time architecture against legacy systems before your next rollout.",
  ogImage: "/logo.png",
};

export const comparisonFallbacks: ComparisonPageContent[] = [
  {
    seoTitle: "Classgrid vs vmedulife",
    metaDescription:
      "A practical comparison between Classgrid and vmedulife across NAAC compliance, real-time chat, biometrics, and modern deployment readiness.",
    ogImage: "/logo.png",
    competitorName: "vmedulife",
    slug: "vmedulife",
    ratingBadges: [
      { platform: "Automation Readiness", score: 4.9, badgeLabel: "NAAC Auto-Sync" },
      { platform: "Operational Scale", score: 4.8, badgeLabel: "Redis Chat Engine" },
    ],
    usps: [
      {
        icon: "workflow",
        title: "Automated NAAC/NBA Compliance Engine",
        description:
          "Instead of forcing faculty to manually type data for inspections, Classgrid automatically pulls attendance, pass percentages, and fee collections directly into printable NAAC reports.",
      },
      {
        icon: "sparkles",
        title: "Enterprise Biometric SDK",
        description:
          "Classgrid offers an Enterprise Developer API that securely syncs physical campus turnstiles directly to our backend for instant HR and payroll tracking.",
      },
      {
        icon: "shield",
        title: "Redis-Backed Real-Time Chat",
        description:
          "While legacy ERPs crash during mass announcements, our Redis Streams + ACK architecture guarantees zero message loss even when 5,000 students chat simultaneously.",
      },
    ],
    featureMatrix: [
      {
        category: "Compliance",
        featureName: "NAAC/NBA Report Auto-Generation",
        ourStatus: "Auto-pulls data from ERP modules",
        ourIcon: "check",
        competitorStatus: "Manual data entry required",
        competitorIcon: "warning",
      },
      {
        category: "Academics",
        featureName: "Advanced Quiz Engine (JEE/NEET)",
        ourStatus: "Native +4/-1 negative marking & percentiles",
        ourIcon: "check",
        competitorStatus: "Basic MCQ support only",
        competitorIcon: "warning",
      },
      {
        category: "HR & Operations",
        featureName: "Hardware Biometric Sync",
        ourStatus: "Direct API SDK for turnstiles & dynamic half-days",
        ourIcon: "check",
        competitorStatus: "CSV manual upload",
        competitorIcon: "cross",
      },
      {
        category: "Communication",
        featureName: "High-Concurrency Campus Chat",
        ourStatus: "Redis Streams + MongoDB (Zero loss)",
        ourIcon: "check",
        competitorStatus: "Basic queues prone to crashing",
        competitorIcon: "warning",
      },
      {
        category: "Platform Architecture",
        featureName: "Database Tenant Isolation",
        ourStatus: "Row-Level Tenancy with Subdomain Routing",
        ourIcon: "check",
        competitorStatus: "Shared databases with higher leakage risk",
        competitorIcon: "warning",
      },
      {
        category: "Mobile",
        featureName: "Native OS Integrations",
        ourStatus: "Kotlin Wrapper with Biometrics & FCM Push",
        ourIcon: "check",
        competitorStatus: "Basic WebView or heavy cross-platform app",
        competitorIcon: "warning",
      },
    ],
    migrationTestimonial: {
      quoteText:
        "The decision was easy. Classgrid's ability to automatically generate our NAAC reports by pulling existing attendance and exam data saved us literally hundreds of hours of manual labor.",
      authorName: "Principal",
      authorRole: "Engineering Institute",
    },
    faqs: [
      {
        question: "How does the NAAC compliance engine actually save time?",
        answer:
          "It acts as a background worker that quietly skims the Attendance, Fees, and Results tables all year. When you need a report, it generates the PDFs and JSON summaries instantly, without staff typing a single number.",
      },
      {
        question: "Can we connect our existing biometric hardware?",
        answer:
          "Yes. We provide an Enterprise Developer API with IP whitelisting. Your physical biometric scanners can push data directly to Classgrid, automatically calculating lates and half-days.",
      },
      {
        question: "Is the platform isolated per institution?",
        answer:
          "Absolutely. We use strict Row-Level Tenancy. Your data is isolated under your specific org_id and accessed via your own branded subdomain (e.g., yourcollege.classgrid.in).",
      },
      {
        question: "Where should users go after this comparison?",
        answer:
          "The strongest next step is the Product Tour for workflow depth, then Pricing for rollout planning.",
      },
    ],
  },
];

export const comparisonFallbackBySlug = Object.fromEntries(
  comparisonFallbacks.map((entry) => [entry.slug, entry])
) as Record<string, ComparisonPageContent>;
