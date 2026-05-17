export type ChangelogSettingsContent = {
  seoTitle: string;
  metaDescription: string;
  ogImage?: string;
  heroHeadline: string;
  heroSubheadline: string;
};

export type ChangelogEntryContent = {
  title: string;
  slug: string;
  seoTitle: string;
  metaDescription: string;
  ogImage?: string;
  releaseDate: string;
  updateType: "feature" | "improvement" | "bugfix";
  versionLabel?: string;
  modules: string[];
  summary: string;
  content: Array<Record<string, unknown>>;
  relatedTourLabel?: string;
  relatedTourHref?: string;
};

export const changelogSettingsFallback: ChangelogSettingsContent = {
  seoTitle: "Classgrid Changelog",
  metaDescription:
    "Track new features, improvements, and bug fixes shipped across the Classgrid platform.",
  ogImage: "/logo.png",
  heroHeadline: "Classgrid changelog",
  heroSubheadline:
    "A public log of product improvements, new releases, and operational fixes across the platform.",
};

export const changelogFallbackEntries: ChangelogEntryContent[] = [
  {
    title: "NAAC/NBA Automated Compliance Engine Launched",
    slug: "naac-nba-automated-compliance-engine",
    seoTitle: "NAAC/NBA Automated Compliance Engine Launched",
    metaDescription:
      "Classgrid shipped the NAAC/NBA compliance engine, automatically pulling attendance, pass rates, and fee data into printable reports.",
    ogImage: "/logo.png",
    releaseDate: "2026-04-20",
    updateType: "feature",
    versionLabel: "v3.0",
    modules: ["compliance", "academics", "finance"],
    summary:
      "The new compliance engine eliminates manual data entry for NAAC/NBA inspections by auto-syncing metrics directly from the ERP.",
    relatedTourLabel: "See the Compliance Tour",
    relatedTourHref: "/tour",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "We are thrilled to launch our 'Secret Weapon' for engineering colleges and universities: the automated NAAC/NBA Compliance Engine.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "How it works", marks: [] }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Instead of forcing staff to manually compile spreadsheets, the engine quietly skims Attendance, Fees, and Results tables all year. When inspectors arrive, you can instantly generate PDFs with criteria-wise data, beautiful pie charts, and summary scores.",
            marks: [],
          },
        ],
      },
    ],
  },
  {
    title: "Redis Streams Chat Architecture for Massive Scale",
    slug: "redis-streams-chat-architecture",
    seoTitle: "Redis Streams Chat Architecture for Massive Scale",
    metaDescription:
      "Classgrid upgraded its real-time chat infrastructure to Redis Streams with ACK, guaranteeing zero message loss during high-traffic events.",
    ogImage: "/logo.png",
    releaseDate: "2026-03-28",
    updateType: "improvement",
    versionLabel: "v2.8",
    modules: ["communication", "platform"],
    summary:
      "We completely rebuilt our chat queueing system to handle 5,000+ concurrent students without crashing or dropping messages.",
    relatedTourLabel: "Explore communication flows",
    relatedTourHref: "/tour",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "To solve the 'Noisy Neighbor Problem' where one large college's announcements could lag another's, we implemented isolated Redis Streams per tenant.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [{ _type: "span", text: "Guaranteed message delivery with Acknowledgment (ACK) systems.", marks: [] }],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [{ _type: "span", text: "Adaptive background workers that flush to MongoDB dynamically based on queue size.", marks: [] }],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [{ _type: "span", text: "Optimistic UI updates for instant perceived performance.", marks: [] }],
      },
    ],
  },
  {
    title: "Enterprise Biometric SDK Fixes & Deduplication",
    slug: "enterprise-biometric-sdk-fixes",
    seoTitle: "Enterprise Biometric SDK Fixes & Deduplication",
    metaDescription:
      "Improved hardware sync for physical turnstiles, fixing duplicate scans and refining dynamic half-day boundary logic.",
    ogImage: "/logo.png",
    releaseDate: "2026-02-16",
    updateType: "bugfix",
    versionLabel: "v2.7",
    modules: ["hr", "operations"],
    summary:
      "We fixed edge cases in the Biometric API Bridge to perfectly align physical turnstile scans with internal payroll multipliers.",
    relatedTourLabel: "View HR operations",
    relatedTourHref: "/tour",
    content: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Syncing physical hardware like turnstiles to cloud ERPs is notoriously tricky. This patch refines our API bridge to handle edge cases effortlessly.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Fixes included", marks: [] }],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [{ _type: "span", text: "Advanced deduplication: If a teacher scans twice in 5 minutes, the system now correctly ignores the duplicate instead of corrupting the ledger.", marks: [] }],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [{ _type: "span", text: "Dynamic time boundaries: Admins can now reliably set custom 'Late' and 'Half-day' cutoff times per department.", marks: [] }],
      },
      {
        _type: "block",
        style: "normal",
        listItem: "bullet",
        children: [{ _type: "span", text: "Strict IP whitelisting reinforcement to prevent API brute-forcing.", marks: [] }],
      },
    ],
  },
];

export const changelogFallbackBySlug = Object.fromEntries(
  changelogFallbackEntries.map((entry) => [entry.slug, entry])
) as Record<string, ChangelogEntryContent>;
