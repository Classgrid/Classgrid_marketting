import type {
  InstitutionCapabilityMap,
  ModuleDefinition,
  ModuleDefinitionCategory,
} from "@/lib/contracts";

export const featureCategoryLabels: Record<ModuleDefinitionCategory, string> = {
  academics: "Academics",
  assessments: "Assessments",
  communication: "Communication",
  finance: "Finance",
  admissions: "Admissions",
  operations: "Operations",
  ai: "AI",
  integration: "Integration",
};

export type FeatureCategoryKey = ModuleDefinitionCategory;

export const moduleCatalog: ModuleDefinition[] = [
  {
    id: 1,
    title: "Authentication and Identity System",
    category: "operations",
    summary: "OTP, Google OAuth, email/password, and native biometric login with role-aware routing.",
    details:
      "Classgrid secures every role with four verified login paths: Firebase OTP, Passport.js Google OAuth, bcrypt-based credentials, and Android biometric unlock. Sessions are role-aware and device-aware, with desktop auto-redirect safeguards and mobile hard blocks between app flavors. New-device verification adds email OTP challenge before access. JWT payloads carry userId, role, organizationId, and structure_type to enforce tenant and role boundaries in every request.",
  },
  {
    id: 2,
    title: "Organization Management Engine",
    category: "operations",
    summary: "White-label branding, academic configuration, org lifecycle control, and subdomain provisioning.",
    details:
      "Each institution runs as a distinct organization profile with its own logo, slug, theme colors, terminology mapping, security codes, and module toggles. Org admins manage branding, hierarchy settings, email restrictions, SSO controls, webhook links, and subscription state from one control plane. Subdomains are auto-resolved via wildcard DNS and branding APIs, so each campus login is instantly institution-branded. Deletion paths are audited and cascading for safe lifecycle governance.",
  },
  {
    id: 3,
    title: "Classroom and Course Management",
    category: "academics",
    summary: "Create, govern, and scale classroom workflows with membership and resource control.",
    details:
      "Classroom is the operational center for attendance, assignments, chat, materials, and outcomes. Faculty create classrooms mapped to subject and hierarchy nodes, enroll students by code or bulk import, and control posting rights per role. Courses act as higher-order containers for institutional structuring. Bulk operations support high-enrollment campuses while keeping classroom boundaries clear and auditable.",
  },
  {
    id: 4,
    title: "Academic Hierarchy and Planning",
    category: "academics",
    summary:
      "Thirteen structure types supporting engineering, school, coaching, junior college, diploma, and custom models.",
    details:
      "Classgrid dynamically enforces hierarchy correctness per institution structure_type. Engineering can run degree-branch-year-semester-division chains with optional sub-batches. Schools can run standard-section patterns, and coaching setups can run course-batch without semester artifacts. Plan-aware validation blocks invalid node creation and keeps all downstream modules like timetables, attendance, and results aligned to real institutional structure.",
  },
  {
    id: 5,
    title: "Attendance System",
    category: "academics",
    summary: "Rapid attendance with GPS checks, device fingerprint controls, appeals, and analytics dashboards.",
    details:
      "Faculty can mark a full class in under a minute through optimized grid workflows. Optional geofence rules and device fingerprint checks reduce proxy attendance and suspicious patterns. High-volume periods are queue-backed for safe processing, while attendance sessions retain who-marked-what metadata for disputes and audits. Students can file appeals, and administrators gain multi-timeframe attendance intelligence from centralized dashboards.",
  },
  {
    id: 6,
    title: "Assignment System",
    category: "academics",
    summary: "Deadline-aware digital assignment workflows with submission tracking and grading.",
    details:
      "Teachers publish assignments with due dates, attachments, and grading intent. Submissions from mobile camera or file upload are time-stamped, marked late where applicable, and tracked in one faculty review panel. Auto-lock behavior keeps deadlines enforceable. Assignment outcomes feed broader student performance analytics for intervention planning.",
  },
  {
    id: 7,
    title: "Result and Examination Engine",
    category: "assessments",
    summary: "CSV-to-results pipeline for SGPA, CGPA, rank, heatmaps, and branded marksheets.",
    details:
      "Institutions upload structured marks once, then trigger standardized processing for SGPA and CGPA with credit weightage logic, backlog handling, grace policy handling, and division/class rank outputs. The engine produces analytics heatmaps for subject-level risk and supports high-fidelity PDF marksheets with branding and QR verification. Every critical mutation is tracked in audit logs.",
  },
  {
    id: 8,
    title: "Online Examination Engine",
    category: "assessments",
    summary: "NTA-style online exams with hall tickets, secure gates, proctoring, and grading flow.",
    details:
      "Faculty author section-based papers with timers and multiple question types. Students receive digital hall tickets and enter through gated exam login windows. The exam player includes palette navigation, timed control, and auto-submit handling. Proctoring signals such as tab switches and webcam anomalies are tracked, while objective responses are auto-graded and descriptive responses flow to faculty grading dashboards.",
  },
  {
    id: 9,
    title: "Quiz and Assessment System",
    category: "assessments",
    summary: "Timed MCQ assessments, auto-evaluation, leaderboards, and AI-assisted authoring.",
    details:
      "Faculty can run fast formative assessments without full exam overhead. Quizzes support timing controls, instant scoring, and gamified ranking. AI can generate question banks from topics, while Google Forms import helps institutions reuse prior content. Test-series sequencing supports competitive-prep style practice over multiple schedules.",
  },
  {
    id: 10,
    title: "AI Viva Examination System",
    category: "ai",
    summary: "Practice, Exam, and Rapid Fire oral workflows with four-parameter scoring.",
    details:
      "AI Viva introduces structured oral evaluation at scale. Practice mode supports low-risk preparation, Exam mode records assessable outcomes, and Rapid Fire mode trains recall speed. Evaluation dimensions include knowledge, clarity, confidence, and accuracy. Session progression data supports trend tracking and targeted remediation after weak exam sections.",
  },
  {
    id: 11,
    title: "Real-Time Chat and Communication",
    category: "communication",
    summary: "Role-isolated channels, message persistence safety, and moderated institutional messaging.",
    details:
      "Classgrid communication replaces unstructured external groups with institution-governed channels. Students communicate within permitted classroom contexts, while org announcements and thread-based discussions remain auditable. Redis stream buffering and worker-based persistence reduce message-loss risk during load spikes. Voice notes, media sanitization, typing signals, and receipts complete the communication stack.",
  },
  {
    id: 12,
    title: "Fee Management and Razorpay Integration",
    category: "finance",
    summary: "Configurable fee structures, student ledgers, split settlements, and receipt automation.",
    details:
      "Admins configure multi-component fee products and assign clear obligations to student ledgers. Parents pay digitally through integrated rails, while transactions can split to designated accounts through settlement routing logic. Receipts are generated and distributed with branded data and verification metadata. Overdue detection and reminder workflows improve collection discipline without manual chasing.",
  },
  {
    id: 13,
    title: "Timetable and Scheduling",
    category: "academics",
    summary: "Drag-and-drop timetable controls with clash prevention and calendar-aware scheduling.",
    details:
      "Scheduling combines convenience with hard constraints. Faculty overlap and room/time conflicts are blocked by anti-collision checks before publication. Holiday calendars and academic context are embedded into schedule validity. Hybrid sessions can carry integrated meeting links, reducing context switching for faculty and students.",
  },
  {
    id: 14,
    title: "Leave Management",
    category: "operations",
    summary: "Digital leave requests, approval workflows, balances, and attendance linkage.",
    details:
      "Students and faculty can submit leave with reason and optional documentation. Reviewers approve or reject from centralized queues with visibility across daily, weekly, and monthly absence patterns. Leave balances remain trackable by type, and approved entries can sync to attendance logic to reduce conflicting records.",
  },
  {
    id: 15,
    title: "Live Meetings and Video",
    category: "communication",
    summary: "Native classroom meeting flows with Agora, Zoom, scheduling, and recording support.",
    details:
      "Institutions can run live sessions from inside Classgrid workflows. Integrations support scheduled meeting creation, one-tap join entry, and contextual linkage from timetable/classroom views. Recording pipelines can persist session artifacts for later access. Voice and video interactions can also extend from chat contexts where configured.",
  },
  {
    id: 16,
    title: "Library and Digital Learning Vault",
    category: "academics",
    summary: "Role-restricted material library for PDFs, playlists, and learning progression.",
    details:
      "Faculty publish notes, slides, and videos mapped to classroom context. Access is scoped by hierarchy so only eligible cohorts view protected materials. Watch-progress tracking enables completion logic and continue-watching behavior. Physical library issue/return support extends the digital vault into real-world circulation workflows.",
  },
  {
    id: 17,
    title: "Notes Marketplace",
    category: "academics",
    summary: "Student-generated notes economy with AI summaries and micro-payment unlocks.",
    details:
      "Marketplace workflows allow contribution, discovery, and controlled monetization of study notes. AI can summarize and tag materials for faster discoverability. Transaction and visibility controls encourage quality while preserving institutional oversight. This module supports peer-led content enrichment alongside faculty-curated resources.",
  },
  {
    id: 18,
    title: "Feedback and Review System",
    category: "operations",
    summary: "Custom form-based faculty feedback with anonymous option and ranking analytics.",
    details:
      "Institutions can create configurable feedback instruments with rating and narrative prompts. Anonymous mode protects student confidence while preserving aggregate insight. Response analytics support teacher-level and institution-level performance reviews, helping academic leaders drive improvement with measurable indicators.",
  },
  {
    id: 19,
    title: "Notification and Push System",
    category: "communication",
    summary: "Unified dispatch across in-app, push, email, SMS, and digest channels.",
    details:
      "Event-driven notifications route to the right audience through the right medium. Android push deep links guide users directly to context screens, while transactional email and SMS support critical alerts. Queue-backed workflows and template systems support scale and consistency for institutional communication.",
  },
  {
    id: 20,
    title: "AI Assistant and RAG Engine",
    category: "ai",
    summary: "Data-informed AI tutor experience with growth planning and syllabus retrieval.",
    details:
      "The AI layer analyzes anonymized academic performance signals and produces personalized guidance. Students receive contextual insight into attendance and outcomes, plus recommended weekly improvement plans. Retrieval-backed responses can align with institutional syllabus context, and faculty can generate assessments from topic intent.",
  },
  {
    id: 21,
    title: "Admission Engine",
    category: "admissions",
    summary: "Triple-path admissions: Spot, Merit, and CET with parent status tracking.",
    details:
      "Admission operations run through configurable pathways for walk-ins, ranked merit flows, and CET/allotment imports. Parent-facing OTP trackers reduce inbound status traffic while preserving transparency. Waitlist promotion automation supports seat utilization and deadline governance. Export and compliance pathways help institutions satisfy regulatory reporting demands.",
  },
  {
    id: 22,
    title: "Teacher Planning Tools",
    category: "academics",
    summary: "Daily and weekly teaching plans with completion and topic progression tracking.",
    details:
      "Faculty can plan lectures, track completed topics, and align homework outcomes with classroom schedules. Quick widgets surface what matters now and reduce planning overhead.",
  },
  {
    id: 23,
    title: "Alumni Management",
    category: "operations",
    summary: "Batch-linked alumni directories with communication channels and outcome tracking.",
    details:
      "Institutions maintain alumni records, relationship continuity, and placement-relevant visibility by cohort.",
  },
  {
    id: 24,
    title: "Student Analytics and Performance",
    category: "operations",
    summary: "Composite health scoring and trend analytics for early intervention.",
    details:
      "Weighted performance views combine attendance, academics, assignment completion, and viva outcomes into actionable student health signals.",
  },
  {
    id: 25,
    title: "Certificate Generation",
    category: "operations",
    summary: "Branded certificate issuance with verification-enabled QR workflows.",
    details:
      "Template-driven certificate generation supports participation, completion, and merit issuance with institutional branding.",
  },
  {
    id: 26,
    title: "Events Management",
    category: "operations",
    summary: "Institution-wide events with reminders, calendars, and RSVP workflows.",
    details:
      "Admins can publish events, coordinate participation, and keep stakeholders informed through integrated reminders.",
  },
  {
    id: 27,
    title: "Holiday Management",
    category: "operations",
    summary: "Academic holiday calendars that align scheduling and attendance behavior.",
    details:
      "Holiday definitions propagate into timetable and attendance systems to prevent invalid operational actions.",
  },
  {
    id: 28,
    title: "HR and Biometric Payroll",
    category: "operations",
    summary: "Punch logs, geofence validation, and payroll computations in one workflow.",
    details:
      "HR processes can connect biometric inputs and attendance data to payroll calculations with leave-aware adjustments.",
  },
  {
    id: 29,
    title: "NAAC and NBA Audit Compliance",
    category: "operations",
    summary: "Automated compliance reporting from live module data.",
    details:
      "Audit reports can compile operational and academic metrics into regulator-aligned PDF outputs.",
  },
  {
    id: 30,
    title: "Demo and Provisioning System",
    category: "operations",
    summary: "Rapid sandbox provisioning with credential email workflows.",
    details:
      "Demo requests auto-generate institution environments with queued provisioning and credential communication.",
  },
  {
    id: 31,
    title: "Webhook and External Integrations",
    category: "integration",
    summary: "Inbound integration points for payments, devices, and external systems.",
    details:
      "Webhook infrastructure handles verified external events and routes outcomes to relevant module workflows.",
  },
  {
    id: 32,
    title: "Cron Jobs and Scheduled Tasks",
    category: "operations",
    summary: "Automated reconciliations, cleanup jobs, digests, and expiry checks.",
    details:
      "Scheduled workers execute recurring institution maintenance tasks to keep data and process health stable.",
  },
  {
    id: 33,
    title: "Forum and Discussion",
    category: "communication",
    summary: "Threaded academic discussion spaces for structured classroom discourse.",
    details:
      "Forums provide durable, searchable conversation threads for topic-level collaboration beyond transient chat.",
  },
  {
    id: 34,
    title: "Google Integration Suite",
    category: "integration",
    summary: "Google Classroom, Drive, and Forms connectivity for continuity.",
    details:
      "Institutions can import workflows from Google tools while keeping Classgrid as the operational system of record.",
  },
  {
    id: 35,
    title: "Voice Messages",
    category: "communication",
    summary: "Voice notes with AI transcription for fast mobile communication.",
    details:
      "Voice messages improve speed for field and faculty communication, with transcription support for searchable context.",
  },
  {
    id: 36,
    title: "Pending Actions Workflow Engine",
    category: "operations",
    summary: "Central queue for approvals, verification, and unresolved tasks.",
    details:
      "Operational teams gain one queue-driven surface for pending approvals and institution workflow bottlenecks.",
  },
  {
    id: 37,
    title: "Student Profile Management",
    category: "operations",
    summary: "Structured onboarding profile integrity supporting downstream academic engines.",
    details:
      "Thirteen-step onboarding captures canonical student identity and academic context with controlled edit policies.",
  },
  {
    id: 38,
    title: "Virtual ID and Tools",
    category: "operations",
    summary: "Digital identity cards and utility tools for daily campus workflows.",
    details:
      "Branded QR-enabled virtual IDs support fast verification and role-linked access in campus operations.",
  },
  {
    id: 39,
    title: "Organization Announcements",
    category: "communication",
    summary: "Broadcast messaging targeted by role and department.",
    details:
      "Org-level announcements propagate through app, email, and push pathways for reliable institutional communication.",
  },
  {
    id: 40,
    title: "API Metrics and Monitoring",
    category: "operations",
    summary: "Endpoint-level request tracking and usage visibility.",
    details:
      "Metric buckets provide route-level telemetry signals for performance awareness and capacity planning.",
  },
  {
    id: 41,
    title: "Subscription and Plan Management",
    category: "finance",
    summary: "Plan lifecycle, feature toggles, and upgrade controls.",
    details:
      "Plan-aware toggles govern module exposure across demo, free, core, premium, and enterprise subscriptions.",
  },
];

export const classgridModuleMatrix: InstitutionCapabilityMap[] = [
  { id: 1, name: "Classroom Hub", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 2, name: "Homework and Assignments", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 3, name: "Attendance Engine", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 4, name: "Exams and Results", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 5, name: "AI Quiz Maker", school: false, coaching: true, engineering: true, level: "PRO" },
  { id: 6, name: "AI Tutor / Sidekick", school: false, coaching: true, engineering: true, level: "PRO" },
  { id: 7, name: "Course and Subject Mapping", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 8, name: "Timetable / Schedule", school: true, coaching: false, engineering: true, level: "Basic" },
  { id: 9, name: "Internal Tests", school: false, coaching: true, engineering: true, level: "Basic" },
  { id: 10, name: "Student and Parent Communication", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 11, name: "Digital Certificates", school: true, coaching: true, engineering: true, level: "PRO" },
  { id: 12, name: "Study Notes and Materials", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 13, name: "Online Meetings (Zoom / Google / Classgrid Meet)", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 14, name: "Digital ID Cards", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 15, name: "Admission Management", school: false, coaching: true, engineering: true, level: "PRO" },
  { id: 16, name: "Fee Management", school: true, coaching: true, engineering: true, level: "PRO" },
  { id: 17, name: "Library Management", school: false, coaching: false, engineering: true, level: "PRO" },
  { id: 18, name: "Student Management", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 19, name: "Faculty Management", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 20, name: "Leave Management", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 21, name: "Academic Calendar Management", school: true, coaching: false, engineering: true, level: "Basic" },
  { id: 22, name: "Events and Notice Management", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 23, name: "Academic Hierarchy Builder", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 24, name: "Organization Control Management", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 25, name: "Feedback and Survey Dashboard", school: true, coaching: true, engineering: true, level: "Basic" },
  { id: 26, name: "Alumni Relationship Management", school: false, coaching: false, engineering: true, level: "PRO" },
  { id: 27, name: "NAAC / NBA Accreditation Management", school: false, coaching: false, engineering: true, level: "MASTER" },
  { id: 28, name: "Canteen QR-Ordering Management", school: true, coaching: false, engineering: true, level: "PRO" },
  { id: 29, name: "Transport and Bus Tracking Management", school: true, coaching: false, engineering: true, level: "PRO" },
  { id: 30, name: "Hostel Management", school: false, coaching: false, engineering: true, level: "PRO" },
];
