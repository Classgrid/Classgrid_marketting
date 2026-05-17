export const privacyPolicy = {
  title: "CLASSGRID PRIVACY POLICY",
  updated: "Last Updated: April 2026",
  sections: [
    {
      heading: "1. Data Controller vs. Data Processor",
      body:
        "Classgrid acts solely as a Data Processor under applicable data protection frameworks including the Indian Digital Personal Data Protection Act (DPDP Act, 2023). The Educational Institution (the Customer) acts as the Data Controller. The Customer determines the purposes and means of processing student personal data; Classgrid processes such data only on the Customer's instructions.",
    },
    {
      heading: "2. Zero Data Bleed Architecture",
      body:
        "Classgrid utilizes a Logical Row-Level Isolation model on a shared MongoDB cluster. Every document is tagged with a unique organizationId. Every API query is scoped by this identifier via mandatory middleware. It is architecturally impossible for Organization A users to query, view, or manipulate Organization B records. This isolation extends to Redis cache keys, Socket.io room namespaces, and S3 storage prefixes.",
    },
    {
      heading: "3. Student Personally Identifiable Information (PII)",
      body:
        "We do not sell, rent, license, or lease student data - including names, phone numbers, email addresses, academic records, attendance logs, or examination scores - to any third-party advertisers, data brokers, marketing agencies, or testing organizations. This is an absolute, unconditional commitment.",
    },
    {
      heading: "4. Biometric Data",
      body:
        "Classgrid Android applications may request access to device-level Biometrics (Fingerprint or FaceID) via AndroidBridge. Biometric signatures are processed exclusively within the hardware secure enclave of the user device. Biometric hashes are never transmitted over the network and never stored on Classgrid servers.",
    },
    {
      heading: "5. Encryption Standards",
      body:
        "All database volumes use AES-256 encryption at rest, API communication uses TLS 1.3 in transit, file storage uses server-side encryption, JWT tokens use RS256 signing with rotating key pairs, and passwords are hashed with bcrypt salt rounds.",
    },
    {
      heading: "6. Data Retention and Deletion",
      body:
        "Upon expiration of a demo account or termination of a paid subscription, a 7-day grace period applies with read-only access. After grace, records and files linked to organizationId are permanently purged through automated cleanup workflows with cascading deletion coverage.",
    },
    {
      heading: "7. Data Collection Scope",
      body:
        "We collect only data required for operation: institution profile, user identity details, academic records, and operational workflow data. GPS is used only where attendance geofence validation is enabled and is processed transiently.",
    },
    {
      heading: "8. Third-Party Sub-Processors",
      body:
        "MongoDB Atlas, Supabase, Amazon Web Services, Razorpay, Firebase, Brevo, Agora, and Groq/OpenAI (for anonymized academic metadata processing) are part of the delivery stack.",
    },
  ],
};

export const termsOfService = {
  title: "CLASSGRID TERMS OF SERVICE",
  updated: "Last Updated: April 2026",
  sections: [
    {
      heading: "1. License Grant",
      body:
        "By registering your organization on classgrid.in, you are granted a non-exclusive, non-transferable, revocable license to access the Classgrid multi-tenant cloud ERP platform for the duration of your active subscription.",
    },
    {
      heading: "2. Account Responsibility",
      body:
        "The Org Admin is solely responsible for managing user access within their institution. Classgrid is not liable for unauthorized internal access resulting from shared Organization Codes or Honor Codes.",
    },
    {
      heading: "3. Uptime and Service Level Agreement",
      body:
        "Classgrid targets 99.99% uptime via Vercel Edge Network frontend delivery and AWS EC2 backend operations. Scheduled maintenance windows are restricted to 2:00 AM - 4:00 AM IST. Unscheduled downtime exceeding four cumulative hours per month qualifies for pro-rata service credit.",
    },
    {
      heading: "4. Payment Terms",
      body:
        "Subscriptions are billed monthly or annually based on selected plan. Payments are processed via Razorpay. In case of chargeback, payment failure, or lapse, automated workflows may restrict org-wide account access until dues are cleared.",
    },
    {
      heading: "5. Acceptable Use Policy",
      body:
        "Organizations are prohibited from transmitting malicious code, attempting tenant boundary circumvention, using the platform for non-educational misuse, or reverse-engineering/scraping platform APIs. Violations can result in permanent account termination without refund.",
    },
    {
      heading: "6. Intellectual Property",
      body:
        "Classgrid software, interface design, and documentation remain Classgrid intellectual property. Customer data remains property of the Customer.",
    },
    {
      heading: "7. Limitation of Liability",
      body:
        "Classgrid aggregate liability is limited to total subscription fees paid by the Customer in the 12 months preceding a claim.",
    },
  ],
};

export const securityPolicy = {
  title: "CLASSGRID SECURITY ARCHITECTURE",
  updated: "Last Updated: April 2026",
  sections: [
    {
      heading: "1. Infrastructure Security",
      bullets: [
        "AWS EC2 with VPC isolation, security groups, and Elastic IP",
        "Nginx reverse proxy with SSL termination",
        "PM2 process management with auto-restart and clustering",
        "Redis with password authentication and encrypted connections",
      ],
    },
    {
      heading: "2. Application Security",
      bullets: [
        "JWT-based stateless authentication",
        "HttpOnly + Secure + SameSite cookie protections",
        "Zod input validation for API payloads",
        "Rate limiting and structured security logging",
        "AdminAuditLog and ImpersonationLog accountability paths",
      ],
    },
    {
      heading: "3. Data Isolation",
      bullets: [
        "MongoDB queries scoped by organizationId",
        "Tenant-prefixed Redis keyspaces",
        "Socket.io room namespaces per organization",
        "Storage prefix isolation in S3/Supabase",
      ],
    },
    {
      heading: "4. Compliance Readiness",
      bullets: [
        "DPDP Act 2023 aligned processing",
        "Annual penetration testing schedule",
        "SOC 2 Type II roadmap in progress",
        "NAAC/NBA audit report generation support",
      ],
    },
  ],
};

export const cookiePolicy = {
  title: "CLASSGRID COOKIE POLICY",
  updated: "Last Updated: April 2026",
  uses: [
    "Authentication cookie (HttpOnly, Secure, SameSite=Strict) for session JWT",
    "Theme preference in localStorage",
    "Device fingerprint hash in localStorage for device verification",
  ],
  doesNotUse: [
    "Third-party tracking cookies",
    "Advertising cookies",
    "Google Analytics-style cross-site analytics cookies",
    "Cross-site tracking pixels",
  ],
};
