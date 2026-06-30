import { demoOrgTypes } from "./forms";
import {
  heroContent,
  categorizedModules,
  orgTypes,
  timelineTabs,
  faqContent,
  trustContent,
  integrationsContent,
} from "./homepage";
import {
  demoCopy,
  homeCopy,
  homeModuleGrid,
  testimonials as placeholderTestimonials,
} from "./pageCopy";
import { siteMeta } from "./siteMeta";
import {
  DEFAULT_FOOTER_STATUS_STATE,
  normalizeFooterStatusState,
  type FooterStatusState,
} from "@/lib/footer-status";

type ChromeLink = {
  label?: string;
  href?: string;
  description?: string;
};

type ChromeSection = {
  heading?: string;
  links?: ChromeLink[];
};

type ChromeMenuItem = {
  label?: string;
  href?: string;
  sections?: ChromeSection[];
};

type ChromeColumn = {
  heading?: string;
  links?: ChromeLink[];
};

type ChromeSocialLink = {
  platform?: string;
  href?: string;
};

export type ChromeContent = {
  brandName?: string;
  brandTagline?: string;
  siteUrl?: string;
  contactEmail?: string;
  logoUrl?: string;
  logoAlt?: string;
  navbarMenuItems?: ChromeMenuItem[];
  navbarSecondaryLinkLabel?: string;
  navbarSecondaryLinkHref?: string;
  navbarPrimaryCtaLabel?: string;
  navbarPrimaryCtaHref?: string;
  mobileMenuTitle?: string;
  footerColumns?: ChromeColumn[];
  footerContactHeading?: string;
  footerAddressLines?: string[];
  footerMapHref?: string;
  footerPhoneNumbers?: string[];
  footerEmailAddresses?: string[];
  footerLegalLinks?: ChromeLink[];
  footerSocialLinks?: ChromeSocialLink[];
  footerCopyrightText?: string;
  footerStatusLabel?: string;
  footerStatusState?: FooterStatusState;
  footerStatusHref?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    slug?: string;
  };
};

export const placeholderChromeContent: ChromeContent = {
  brandName: "Classgrid",
  brandTagline: "The Operating System for Modern Education",
  siteUrl: siteMeta.domain,
  contactEmail: siteMeta.supportEmail,
  logoUrl: "/logo.png?v=2",
  logoAlt: "Classgrid logo",
  navbarMenuItems: [
    {
      label: "Solutions",
      sections: [
        {
          links: [
            { label: "For Schools", href: "/solutions/for-schools" },
            { label: "For Colleges", href: "/solutions/for-colleges" },
            { label: "For Jr Colleges", href: "/solutions/for-jr-colleges" },
            { label: "For Coaching", href: "/solutions/for-coaching" },
            { label: "For Engineering", href: "/solutions/for-engineering" },
          ],
        },
        {
          links: [
            { label: "For Students", href: "/solutions/for-students" },
            { label: "For Teachers", href: "/solutions/for-teachers" },
            { label: "For Admins", href: "/solutions/for-admins" },
          ],
        },
      ],
    },
    {
      label: "Product",
      sections: [
        {
          links: [
            { label: "View Platform", href: "/view-platform" },
            { label: "Features", href: "/features" },
            { label: "Modules", href: "/modules" },
            { label: "Integrations", href: "/#integrations" },

            { label: "Compare", href: "/compare" },
            { label: "Changelog", href: "/changelog" },
          ],
        },
      ],
    },
    { label: "Pricing", href: "/pricing" },
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
  ],
  navbarSecondaryLinkLabel: "Our Institutions",
  navbarSecondaryLinkHref: "/institutions",
  navbarPrimaryCtaLabel: "Book a Demo",
  navbarPrimaryCtaHref: "/#demo",
  mobileMenuTitle: "Explore Classgrid",
  footerColumns: [
    {
      heading: "Quick Links",
      links: [
        { label: "Contact Us", href: "/contact" },
        { label: "Integrations", href: "/integrations" },
        { label: "Community Forum", href: "https://forum.classgrid.in" },
        { label: "Security", href: "/security" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Case Studies", href: "/case-studies" },
        { label: "FAQ", href: "/#faq" },
        { label: "Support", href: "/support" },
        { label: "Help Center", href: "/help-center" },
        { label: "Book a Demo", href: "/#demo" },
        { label: "Reviews", href: "/reviews" },
      ],
    },
  ],
  footerContactHeading: "Get In Touch",
  footerAddressLines: [
    "Akurdi Railway Station Road, Sector No. 26, Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra 411044",
  ],
  footerMapHref:
    "https://maps.google.com/?q=Akurdi+Railway+Station+Road,+Sector+No.+26,+Pradhikaran,+Nigdi,+Pimpri-Chinchwad,+Maharashtra+411044",
  footerPhoneNumbers: ["+91 8623947038", "+91 8149277038"],
  footerEmailAddresses: [siteMeta.supportEmail, "nikhil.shinde@classgrid.in"],
  footerLegalLinks: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Cookies", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
    { label: "Sitemap", href: "/sitemap.xml" },
  ],
  footerSocialLinks: [
    { platform: "instagram", href: "https://instagram.com/classgrid" },
    { platform: "youtube", href: "https://youtube.com/@classgrid" },
    { platform: "facebook", href: "https://facebook.com/classgrid" },
  ],
  footerCopyrightText: `© ${new Date().getFullYear()} Classgrid. All rights reserved.`,
  footerStatusLabel: "All systems normal",
  footerStatusState: DEFAULT_FOOTER_STATUS_STATE,
  footerStatusHref: "https://classgrid1.statuspage.io",
  seo: {
    metaTitle: "Classgrid | The Operating System for Modern Education",
    metaDescription: "Manage admissions, academics, operations, communication, and analytics in one unified education platform.",
    slug: "home",
  },
};

export const placeholderHomePage = {
  headline: {
    en: homeCopy.headline,
    hi: "आधुनिक शिक्षा के लिए ऑपरेटिंग सिस्टम।",
    mr: "आधुनिक शिक्षणासाठी ऑपरेटिंग सिस्टम।"
  },
  subheadline: {
    en: homeCopy.subheadline,
    hi: "क्लासिग्रिड के साथ अपने संस्थान का प्रबंधन करें। प्रवेश से लेकर शिक्षा तक सब कुछ एक जगह।",
    mr: "क्लासिग्रिडसह तुमच्या संस्थेचे व्यवस्थापन करा. प्रवेशापासून शिक्षणापर्यंत सर्व काही एकाच ठिकाणी।"
  },
  whatsNew: homeCopy.whatsNew,
  heroPrimaryCtaLabel: heroContent.primaryCta,
  heroPrimaryCtaHref: "/#demo",
  heroSecondaryCtaLabel: "View Platform Tour",
  heroSecondaryCtaHref: "/view-platform",
  empowerSection: {
    heading: "All-in-One ERP for Schools, Colleges & Coaching Institutes",
    description:
      "ClassGrid is a comprehensive education management platform designed to simplify and streamline the operations of schools, colleges, and coaching institutes. From admissions and student lifecycle management to fee collection, attendance tracking, academic planning, and communication, ClassGrid brings every critical function into a single unified system.",
    imageUrl: "/dashboards/admin-overview.png",
    imageAlt: "Classgrid admin overview dashboard",
  },
  platformKicker: "Unified Education Stack",
  platformTitle: "Built for every institution, on one education platform",
  platformBody:
    "ClassGrid unifies academic workflows, operations, and communication in a single platform built for schools, colleges, and coaching institutes. No disconnected tools for fees, exams, admissions, CRM, or parent updates.",
  platformConnectionHint:
    "Primary use cases shown. Every module supports every institution type.",
  platformSystemLabel: "classgrid/os",
  platformInputLabels: [
    "Academic Management",
    "Institutional Operations",
    "Communication & Engagement",
  ],
  platformAudienceCards: [
    {
      badge: "K12",
      title: "Schools",
      subtitle: "Fees, attendance, exams, and parent communication in one system.",
    },
    {
      badge: "DEG",
      title: "Colleges",
      subtitle: "Department workflows, accreditation, exams, and campus administration.",
    },
    {
      badge: "CO",
      title: "Coaching Institutes",
      subtitle: "Batches, test series, enquiries, and student follow-up.",
    },
  ],
  showcaseKicker: homeModuleGrid.kicker,
  showcaseTitle: homeModuleGrid.title,
  showcaseSubtitle:
    "Admissions, academics, fees, exams, and communication work from one calm, connected system.",
  showcaseCtaLabelTemplate: "Explore {label}",
  showcaseSlides: [
    {
      label: "Overview",
      headline: "All-in-One ERP for Schools, Colleges & Coaching Institutes",
      body: "ClassGrid is a comprehensive education management platform designed to simplify and streamline the operations of schools, colleges, and coaching institutes. From admissions and student lifecycle management to fee collection, attendance tracking, academic planning, and communication, ClassGrid brings every critical function into a single unified system.\n\nOur platform helps institutions eliminate manual processes, reduce operational errors, and improve overall efficiency through automation and real-time insights. With a user-friendly interface and scalable architecture, ClassGrid adapts to the unique needs of institutions of all sizes, ensuring seamless coordination between administrators, teachers, students, and parents. By integrating academics, finance, and communication into one intelligent platform, ClassGrid empowers institutions to focus more on education and less on administrative complexity, driving better outcomes and smarter growth.",
    },
    {
      label: "Automation",
      headline: "Automation & Efficiency",
      body: "ClassGrid transforms the way educational institutions handle daily operations by automating repetitive tasks and centralizing critical workflows. From managing admissions and generating reports to tracking attendance and processing fee payments, every function is streamlined into a single platform.\n\nThis reduces administrative burden, minimizes human errors, and allows staff to focus more on delivering quality education instead of handling manual processes.",
    },
    {
      label: "Analytics",
      headline: "Powerful Analytics & Real-Time Reporting",
      body: "With powerful analytics and real-time reporting, ClassGrid gives institutions complete visibility into their operations. Administrators can monitor financial performance, track student progress, and analyze key metrics from a unified dashboard.\n\nThese insights enable faster, data-driven decision-making, helping institutions improve performance, identify gaps, and plan more effectively for the future.",
    },
    {
      label: "Communication",
      headline: "Communication & Collaboration",
      body: "Effective communication is at the core of every successful institution, and ClassGrid ensures seamless interaction between administrators, teachers, students, and parents.\n\nThrough integrated messaging, notifications, and updates, everyone stays informed and connected. This improves transparency, strengthens engagement, and creates a more collaborative educational environment.",
    },
    {
      label: "Scalability",
      headline: "Scalability & Flexibility",
      body: "Designed to grow with your institution, ClassGrid offers a flexible and scalable architecture that adapts to your evolving needs. Whether you are managing a small coaching institute or a large multi-campus university, the platform provides the tools and customization required to support your operations.\n\nIts modern design and intuitive interface ensure quick adoption and a smooth user experience across all users.",
    },
  ],
  trustedBy: homeCopy.trustedBy,
  trustSectionDescription:
    homeCopy.machineShowcase,
  stats: trustContent.stats.map((stat) => ({
    label: stat.label,
    value: String(stat.value),
    suffix: stat.suffix ?? "",
  })),
  trustedLogos: [
    { name: "Vishwakarma University, Pune", imageUrl: "https://placehold.co/120x120/022c22/34d399?text=VU" },
    { name: "Deccan Education Society (DESPU)", imageUrl: "https://placehold.co/120x120/022c22/34d399?text=DES" },
    { name: "Pimpri Chinchwad College of Engineering", imageUrl: "https://placehold.co/120x120/022c22/34d399?text=PCCOE" },
    { name: "Vishwakarma Institute of Technology, Pune", imageUrl: "https://placehold.co/120x120/022c22/34d399?text=VIT" },
  ],
  organizationSectionTitle: "Built for every type of institution",
  organizationCardCtaLabel: "Explore Use Case",
  organizationCards: orgTypes,
  modulesSectionHeading: "Every campus workflow, connected",
  modulesSectionSubtext:
    "Admissions, academics, fees, exams, and communication work from one calm, connected system.",
  modulesTitle: "Every campus workflow, connected",
  modulesSubtitle:
    "Admissions, academics, fees, exams, and communication work from one calm, connected system.",
  modulesAudienceTabs: [
    { id: "school", label: "School" },
    { id: "junior-college", label: "Junior College" },
    { id: "engineering", label: "Engineering" },
    { id: "coaching", label: "Coaching" },
  ],
  modulesAllTabLabel: "All Ecosystem",
  modulesCardCtaLabel: "Explore Module",
  modulesShowMoreLabel: "Show More Modules",
  modulesViewAllLabel: "View All {count}",
  modules: categorizedModules,
  modulesCalloutTitle: "Experience the platform yourself",
  modulesCalloutBody:
    "Step inside Classgrid. Take an interactive tour through our real dashboards and see exactly how our 30+ modules work together.",
  modulesCalloutCtaLabel: "View Platform Tour",
  modulesCalloutCtaHref: "/view-platform",
  stakeholderSectionHeading: "One system for every stakeholder",
  stakeholderSectionSubtext:
    "Classgrid connects students, staff, leadership, and compliance into one unified system.",
  timelineTitle: "One system for every stakeholder",
  timelineSubtitle:
    "Classgrid connects students, staff, leadership, and compliance into one unified system.",
  timelineTabs,
  testimonialsLabel: "Testimonials",
  testimonialsHeading: "Trusted by educators and institutions",
  testimonialsSubtext:
    "Hear directly from educators and leaders about how Classgrid transformed their operations.",
  testimonialsTitle: "Trusted by educators and institutions",
  testimonialsSectionDescription:
    "Hear directly from educators and leaders about how Classgrid transformed their operations.",
  testimonials: placeholderTestimonials,
  videoSectionHeading: "See Classgrid in action",
  videoSectionSubtext:
    "Watch how Classgrid simplifies operations across your institution.",
  videoSectionTitle: "See Classgrid in action",
  videoSectionDescription:
    "Watch how Classgrid simplifies operations across your institution.",
  testimonialVideos: [
    {
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      name: "Dr. Sharma",
      role: "Principal, Vishwakarma Institute of Technology",
      subtitle:
        "Classgrid completely eliminated our administrative chaos. Managing 3,000 students across 40 divisions now runs on total autopilot.",
    },
    {
      url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      name: "Anita Kulkarni",
      role: "Director, Deccan Junior College",
      subtitle:
        "We replaced 6 scattered tools with one platform. Student and parent adoption went up immediately because everything became predictable.",
    },
  ],
  productVideo: {
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    posterUrl: "/dashboards/admin-overview.png",
    posterAlt: "Classgrid product video poster",
  },
  integrationsKicker: "Integrations",
  integrationsHeadline: "Classgrid integrates with the tools you rely on",
  integrationsSubtext:
    "Classgrid is integrated with leading tools like AWS, Google, and more.",
  integrationsTitle: "Classgrid integrates with the tools you rely on",
  integrationsSubtitle:
    "Classgrid is integrated with leading tools like AWS, Google, and more.",
  integrationLogos: [
    ...integrationsContent.row1,
    ...integrationsContent.row2,
  ].map((name) => {
    const iconMap: Record<string, { imageUrl?: string; accentColor: string }> = {
      AWS: {
        imageUrl: "/integrations/aws.svg",
        accentColor: "from-orange-500/20",
      },
      Razorpay: {
        imageUrl: "https://cdn.simpleicons.org/razorpay/0C2451",
        accentColor: "from-indigo-500/20",
      },
      Zoom: {
        imageUrl: "https://cdn.simpleicons.org/zoom/0B5CFF",
        accentColor: "from-blue-500/20",
      },
      "Google Meet": {
        imageUrl: "https://cdn.simpleicons.org/googlemeet/00897B",
        accentColor: "from-teal-500/20",
      },
      Agora: {
        accentColor: "from-sky-500/20",
      },
      MongoDB: {
        imageUrl: "https://cdn.simpleicons.org/mongodb/47A248",
        accentColor: "from-green-500/20",
      },
      Supabase: {
        imageUrl: "https://cdn.simpleicons.org/supabase/3ECF8E",
        accentColor: "from-emerald-500/20",
      },
      Firebase: {
        imageUrl: "https://cdn.simpleicons.org/firebase/DD2C00",
        accentColor: "from-amber-500/20",
      },
      Redis: {
        imageUrl: "https://cdn.simpleicons.org/redis/DC382D",
        accentColor: "from-red-500/20",
      },
      Brevo: {
        imageUrl: "https://cdn.simpleicons.org/brevo/0B996E",
        accentColor: "from-emerald-600/20",
      },
      OpenAI: {
        imageUrl: "/integrations/openai.svg",
        accentColor: "from-slate-500/20",
      },
      HuggingFace: {
        imageUrl: "https://cdn.simpleicons.org/huggingface/FFD21E",
        accentColor: "from-yellow-500/20",
      },
      "Google Sheets": {
        imageUrl: "https://cdn.simpleicons.org/googlesheets/34A853",
        accentColor: "from-lime-500/20",
      },
    };

    return {
      name,
      ...(iconMap[name] ?? { accentColor: "from-emerald-500/20" }),
    };
  }),
  faqTitle: "Frequently Asked Questions",
  faqHeading: "Everything you need to know",
  faqSubtext:
    "Find answers to common questions about Classgrid, features, and setup.",
  faqSectionTitle: "Everything you need to know",
  faqSectionDescription:
    "Find answers to common questions about Classgrid, features, and setup.",
  faqButtonText: "Explore Help Center",
  faqButtonLabel: "Explore Help Center",
  faqButtonHref: "/help-center",
  faqEntries: faqContent,
  ctaFormTitle: demoCopy.title,
  ctaFormSubtitle: demoCopy.body,
  ctaFormSubmitLabel: "Submit Demo Request",
  ctaFormDetailsHeading: "Your Details",
  ctaFormInstituteHeading: "Institute Details",
  ctaFormMessageHeading: "Message",
  ctaFormSuccessTitle: "Demo request received",
  ctaFormSuccessBody:
    "The Classgrid team will review your request and connect with you to schedule the demo discussion.",
  ctaFormCopy: {
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    emailLabel: "Work Email",
    emailPlaceholder: "you@institution.edu",
    phoneLabel: "Phone Number",
    phonePlaceholder: "Enter your phone number",
    instituteNameLabel: "Institute Name",
    instituteNamePlaceholder: "Enter institution name",
    stateLabel: "State",
    statePlaceholder: "Enter state",
    cityLabel: "City",
    cityPlaceholder: "Enter city",
    solutionLabel: "Institution Type",
    messageLabel: "Message",
    messagePlaceholder: "Tell us about your institution and what you want to see in the demo",
    captchaPlaceholder: "Enter captcha",
    captchaMismatchMessage: "Captcha did not match. Please try again.",
    securityCheckRequiredMessage: "Please complete the security check.",
    submitLoadingLabel: "Submitting...",
    genericErrorMessage: "Something went wrong. Please try again.",
    validationInstitutionNameRequired: "Institute name is required.",
    validationOrgTypeRequired: "Please select an institution type.",
    validationFullNameRequired: "Full name is required.",
    validationEmailInvalid: "Please enter a valid email address.",
    validationPhoneInvalid: "Please enter a valid phone number.",
    validationStateRequired: "State is required.",
    validationCityRequired: "City is required.",
    solutionOptions: [
      { value: demoOrgTypes[0], label: "Engineering College" },
      { value: demoOrgTypes[1], label: "School" },
      { value: demoOrgTypes[2], label: "Junior College" },
      { value: demoOrgTypes[3], label: "Coaching Institute" },
      { value: demoOrgTypes[4], label: "Diploma Institute" },
      { value: demoOrgTypes[5], label: "Private Tutor" },
      { value: demoOrgTypes[6], label: "Other" },
    ],
  },
  seo: placeholderChromeContent.seo,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeWithPlaceholders<T>(fallback: T, value: unknown): T {
  if (Array.isArray(fallback)) {
    return (Array.isArray(value) && value.length > 0 ? value : fallback) as T;
  }

  if (typeof fallback === "string") {
    return (typeof value === "string" && value.trim().length > 0 ? value : fallback) as T;
  }

  if (isPlainObject(fallback)) {
    const result: Record<string, unknown> = { ...fallback };
    const source = isPlainObject(value) ? value : {};

    for (const key of Object.keys(source)) {
      result[key] = mergeWithPlaceholders(
        (fallback as Record<string, unknown>)[key],
        source[key]
      );
    }

    return result as T;
  }

  return (value ?? fallback) as T;
}

export function resolveHomePageContent(input?: Record<string, unknown> | null) {
  return mergeWithPlaceholders(placeholderHomePage, input ?? {});
}

const BLOG_NAV_LINK: ChromeMenuItem = { label: "Blog", href: "/blog" };

function normalizeValue(value?: string) {
  return value?.trim().toLowerCase() ?? "";
}

function ensureCorrectViewPlatformLink(menuItems?: ChromeMenuItem[]): ChromeMenuItem[] {
  if (!Array.isArray(menuItems)) return [];
  return menuItems.map(item => {
    if (item.sections) {
      return {
        ...item,
        sections: item.sections.map(section => ({
          ...section,
          links: section.links?.map(link => {
            if (link.label?.toLowerCase().includes("view platform")) {
              return { ...link, href: "/view-platform" };
            }
            return link;
          })
        }))
      };
    }
    if (item.label?.toLowerCase().includes("view platform")) {
      return { ...item, href: "/view-platform" };
    }
    return item;
  });
}

function ensureBlogInNavbar(menuItems?: ChromeMenuItem[]): ChromeMenuItem[] {
  const safeItems = Array.isArray(menuItems) ? menuItems.filter(Boolean) : [];
  const hasBlogItem = safeItems.some(
    (item) =>
      normalizeValue(item?.href) === "/blog" || normalizeValue(item?.label) === "blog"
  );

  if (hasBlogItem) {
    return safeItems;
  }

  const pricingIndex = safeItems.findIndex(
    (item) => normalizeValue(item?.label) === "pricing"
  );

  if (pricingIndex >= 0) {
    const withBlog = [...safeItems];
    withBlog.splice(pricingIndex + 1, 0, BLOG_NAV_LINK);
    return withBlog;
  }

  return [...safeItems, BLOG_NAV_LINK];
}

function removeBlogFromFooter(columns?: ChromeColumn[]): ChromeColumn[] {
  if (!Array.isArray(columns)) return [];

  return columns
    .map((column) => {
      const safeLinks = Array.isArray(column?.links)
        ? column.links.filter(
          (link) =>
            normalizeValue(link?.label) !== "blog"
            && normalizeValue(link?.href) !== "/blog"
        )
        : [];

      return {
        ...column,
        links: safeLinks,
      };
    })
    .filter((column) => (column.links?.length ?? 0) > 0);
}

function fixCompareLinksInFooter(columns?: ChromeColumn[]): ChromeColumn[] {
  if (!Array.isArray(columns)) return [];

  return columns.map((column) => ({
    ...column,
    links: Array.isArray(column.links)
      ? column.links.map((link) => {
          if (normalizeValue(link?.href) === "/compare/vs-competitors") {
            return { ...link, href: "/compare" };
          }
          return link;
        })
      : [],
  }));
}

export function resolveChromeContent(input?: ChromeContent | null): ChromeContent {
  const chrome = mergeWithPlaceholders(placeholderChromeContent, input ?? {}) as ChromeContent;
  const hasNavbarItems = Array.isArray(chrome.navbarMenuItems)
    && chrome.navbarMenuItems.some(
      (item) =>
        item?.label?.trim()
        && (
          item?.href?.trim()
          || (
            Array.isArray(item?.sections)
            && item.sections.some(
              (section) =>
                Array.isArray(section?.links)
                && section.links.some((link) => link?.label?.trim() && link?.href?.trim())
            )
          )
        )
    );
  const hasFooterColumns = Array.isArray(chrome.footerColumns)
    && chrome.footerColumns.some(
      (column) =>
        column?.heading?.trim()
        || (
          Array.isArray(column?.links)
          && column.links.some((link) => link?.label?.trim() && link?.href?.trim())
        )
    );
  const hasSocialLinks = Array.isArray(chrome.footerSocialLinks)
    && chrome.footerSocialLinks.some((link) => link?.platform?.trim() && link?.href?.trim());
  const hasLegalLinks = Array.isArray(chrome.footerLegalLinks)
    && chrome.footerLegalLinks.some((link) => link?.label?.trim() && link?.href?.trim());
  const hasAddressLines = Array.isArray(chrome.footerAddressLines)
    && chrome.footerAddressLines.some((line) => typeof line === "string" && line.trim().length > 0);
  const hasPhones = Array.isArray(chrome.footerPhoneNumbers)
    && chrome.footerPhoneNumbers.some((line) => typeof line === "string" && line.trim().length > 0);
  const hasEmails = Array.isArray(chrome.footerEmailAddresses)
    && chrome.footerEmailAddresses.some((line) => typeof line === "string" && line.trim().length > 0);
  const normalizeFooterEmails = (emails?: string[]) => {
    const allowed = new Set(["support@classgrid.in", "nikhil.shinde@classgrid.in", "contact@classgrid.in"]);
    const normalized = Array.isArray(emails)
      ? emails
        .filter((line) => typeof line === "string")
        .map((line) => line.trim().toLowerCase())
        .filter((line) => allowed.has(line))
      : [];
    return Array.from(new Set(normalized));
  };

  return {
    ...chrome,
    navbarMenuItems: ensureCorrectViewPlatformLink(ensureBlogInNavbar(
      hasNavbarItems
        ? chrome.navbarMenuItems
        : placeholderChromeContent.navbarMenuItems
    )),
    footerColumns: fixCompareLinksInFooter(removeBlogFromFooter(
      hasFooterColumns
        ? chrome.footerColumns
        : placeholderChromeContent.footerColumns
    )),
    footerSocialLinks: hasSocialLinks
      ? chrome.footerSocialLinks
      : placeholderChromeContent.footerSocialLinks,
    footerLegalLinks: hasLegalLinks
      ? chrome.footerLegalLinks
      : placeholderChromeContent.footerLegalLinks,
    footerAddressLines: hasAddressLines
      ? chrome.footerAddressLines
      : placeholderChromeContent.footerAddressLines,
    footerPhoneNumbers: hasPhones
      ? chrome.footerPhoneNumbers
      : placeholderChromeContent.footerPhoneNumbers,
    footerEmailAddresses: hasEmails
      ? normalizeFooterEmails(chrome.footerEmailAddresses)
      : normalizeFooterEmails(placeholderChromeContent.footerEmailAddresses),
    footerStatusState: normalizeFooterStatusState(chrome.footerStatusState),
  };
}
