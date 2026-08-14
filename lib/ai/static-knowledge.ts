/**
 * Static Classgrid Knowledge Base
 *
 * This file provides comprehensive platform knowledge that is injected directly
 * into the AI system prompt when RAG (MongoDB vector search) is unavailable.
 *
 * On Vercel Hobby tier, the @xenova/transformers embedding model cannot load
 * within the 10-second function timeout, so RAG is disabled. This static
 * knowledge base ensures the AI still has full platform awareness.
 *
 * This is auto-derived from the content/ directory and platform metadata.
 * Keep this in sync when major content changes happen.
 */

export const STATIC_CLASSGRID_KNOWLEDGE = `
=== CLASSGRID PLATFORM KNOWLEDGE BASE ===

ABOUT CLASSGRID:
Classgrid is the operating system for modern education — one stack for academics, operations, finance, admissions, communication, and AI. It is designed for schools, coaching institutes, junior colleges, engineering colleges, and all types of educational institutions in India.

Classgrid was developed by the expert Classgrid team. It is not a white-label product; it is a purpose-built education platform.

INSTITUTION TYPES SUPPORTED:
Classgrid supports 5 institution types with dedicated workflows:

1. **College** — Complete Digital System for Colleges
   - CAP round admission workflows, Placement and alumni readiness pipelines, NAAC/NBA accreditation reporting

2. **Junior College (XI-XII)** — Unified Operations for XI-XII Programs
   - Subject-group and stream setup, Board exam readiness tracking, Parent and student communication hub

3. **Coaching Institute** — Run Your Institute Like a Platform
   - Course-batch hierarchy automation, Test series and rank intelligence, Rapid fee and parent communication loops

4. **School** — Unified Infrastructure for Modern Schools
   - Class-section academic control, Parent and student communication hub, Attendance and calendar continuity

5. **Engineering** — Purpose-Built Platform for Engineering Institutions
   - Department and semester architecture controls, Lab, internal assessment, and backlog tracking, NBA/NAAC-aligned compliance reporting

ACADEMIC HIERARCHY:
Classgrid supports 13 structure types including engineering (degree-branch-year-semester-division), school (standard-section), coaching (course-batch), junior college (stream-division), and custom models. The hierarchy dynamically enforces structure correctness per institution type.

DEGREE PROGRAMS SUPPORTED:
Classgrid supports degree programs for engineering institutions including B.E., B.Tech, M.E., M.Tech, Diploma, and more through its flexible academic hierarchy system. The degree-branch-year-semester-division structure accommodates all types of degree programs. Exact program types are configured by each institution during setup.

MODULES (30+ ACTIVE):
Classgrid offers 30+ active modules across 8 categories. Key modules include:

**Academics (7 modules):**
1. Classroom and Course Management — Create, govern, and scale classroom workflows
2. Academic Hierarchy and Planning — 13 structure types for all institution models
3. Attendance System — Rapid attendance with GPS, device fingerprint, appeals, analytics
4. Assignment System — Deadline-aware digital assignments with submission tracking
5. Timetable and Scheduling — Drag-and-drop with clash prevention
6. Library and Digital Learning Vault — Role-restricted materials, PDFs, playlists
7. Teacher Planning Tools — Daily/weekly teaching plans with topic tracking
8. Notes Marketplace — Student-generated notes with AI summaries

**Assessments (4 modules):**
9. Result and Examination Engine — CSV-to-results for SGPA, CGPA, ranks, marksheets
10. Online Examination Engine — NTA-style online exams with proctoring
11. Quiz and Assessment System — Timed MCQs, auto-evaluation, leaderboards
12. AI Viva Examination System — Practice, Exam, and Rapid Fire oral workflows

**Communication (5 modules):**
13. Real-Time Chat — Role-isolated channels, message persistence, moderation
14. Live Meetings and Video — Agora, Zoom, scheduling, recording
15. Notification and Push System — In-app, push, email, SMS, digest
16. Voice Messages — Voice notes with AI transcription
17. Organization Announcements — Broadcast messaging by role and department

**Finance (2 modules):**
19. Fee Management and Razorpay Integration — Fee structures, ledgers, split settlements
20. Subscription and Plan Management — Plan lifecycle, feature toggles, upgrades

**Admissions (1 module):**
21. Admission Engine — Spot, Merit, and CET pathways with parent tracking

**Operations (14 modules):**
22. Authentication and Identity System — OTP, Google OAuth, biometric login
23. Organization Management Engine — White-label branding, org lifecycle control
24. Institution Website Builder — Fully managed, white-labeled public websites for schools, colleges, and coaching
25. Leave Management — Digital leave requests, approvals, attendance linkage
25. Feedback and Review System — Custom forms with anonymous option
26. Alumni Management — Batch-linked directories, communication channels
27. Student Analytics and Performance — Composite health scoring, trend analytics
28. Certificate Generation — Branded certificates with QR verification
29. Events Management — Institution events with RSVP workflows
30. Holiday Management — Academic calendars for scheduling alignment
31. HR and Biometric Payroll — Punch logs, geofence, payroll computation
32. NAAC and NBA Audit Compliance — Automated compliance reporting
33. Demo and Provisioning System — Rapid sandbox provisioning
34. Pending Actions Workflow Engine — Central approval queue
35. Student Profile Management — 13-step structured onboarding
36. Virtual ID and Tools — Digital identity cards with QR
37. API Metrics and Monitoring — Endpoint telemetry
38. Cron Jobs and Scheduled Tasks — Automated maintenance

**AI (2 modules):**
39. AI Assistant and RAG Engine — Data-informed AI tutor with growth planning
40. AI Viva Examination System — Oral assessment at scale

**Integration (2 modules):**
41. Webhook and External Integrations — Payment, device, and external system integrations
42. Google Integration Suite — Google Classroom, Drive, Forms connectivity

MODULE AVAILABILITY BY INSTITUTION TYPE:
- **Basic modules** (included for all): Classroom Hub, Homework & Assignments, Attendance Engine, Exams & Results, Course & Subject Mapping, Student & Parent Communication, Study Notes & Materials, Online Meetings, Digital ID Cards, Student Management, Faculty Management, Leave Management, Events & Notice Management, Academic Hierarchy Builder, Organization Control, Feedback & Survey Dashboard
- **PRO modules** (premium): AI Quiz Maker, AI Tutor, Digital Certificates, Admission Management, Fee Management, Institution Website Builder (for schools, colleges, coaching), Library Management (engineering only), Alumni Management (engineering only), Canteen QR-Ordering, Transport & Bus Tracking, Hostel Management (engineering only)
- **MASTER modules**: NAAC/NBA Accreditation Management (engineering only)
- Availability depends on the organization's pricing plan

PRICING:
- Pricing is module-based across school, coaching, and college/engineering workflows
- Basic modules are included in all plans
- PRO and MASTER modules unlock advanced workflows like AI tooling, admissions automation, and accreditation management
- Premium pricing is quoted based on institution size, scope, and rollout timeline
- There are Core, Premium, and Enterprise plans
- For exact pricing, institutions should Book a Demo or Contact Sales for a personalized quote
- Pricing page: /pricing

ONBOARDING PROCESS (Book a Demo Flow):
1. Visit the homepage and fill out the "Book a Demo" form
2. Email Verification via OTP
3. User MUST schedule their meeting/demo directly on the screen using the calendar
4. Classgrid Talk for immediate questions
5. Live demonstration/walkthrough with the Classgrid team
6. Guided onboarding process
- There is NO self-serve signup. Users must book a demo first.
- The CTA is always "Book a Demo", never "Sign Up"

CONTACT INFORMATION:
- Phone: +91 8623947038 and +91 8149277038
- Email: support@classgrid.in
- Headquarters: Akurdi Railway Station Road, Sector No. 26, Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra 411044, India
- Contact page: /contact

WEBSITE PAGES AND RESOURCES:
- Home: / — The operating system for modern education
- About: /about — Classgrid journey and mission
- Blog: /blog — Insights on education operations and AI workflows
- Case Studies: /case-studies — Operational transformation stories
- Changelog: /changelog — Release notes and product evolution
- Compare: /compare — Classgrid vs legacy ERP comparison
- Contact: /contact — Sales and support pathways
- Careers: /careers — Apply for open roles and internships
- Demo: /demo — Request 30-day demo with guided onboarding
- FAQ: /faq — Migration, security, pricing, and workflow questions
- Documentation: /docs — Official technical documentation, platform guides, and API references
- Product Modules: /product/modules — Full module directory (NOTE: There is NO /features page. Always link to /product/modules instead.)
- View Platform: /view-platform — Guided product preview across roles
- Integrations: /integrations — Payment, communication, cloud, AI services
- Institutions: /institutions — Choose institution profile
- Institutions/College: /institutions/college
- Institutions/Junior College: /institutions/junior-college
- Institutions/Coaching: /institutions/coaching
- Institutions/School: /institutions/school
- Institutions/Engineering: /institutions/engineering
- Pricing: /pricing — Plans and module tiers
- Privacy: /privacy — Data processing and student privacy
- Reviews: /reviews — Institution testimonials
- Security: /security — Infrastructure and data isolation
- Support: /support — Help center and support pathways
- Submit a Ticket: /support/ticket — For verified institution users only
- Speak with Classgrid: /support/inquiry — Pre-sales and general inquiries
- Terms: /terms — Terms of service, licensing, and Acceptable Use Policy (Section 7)
- Cookie Policy: /cookies
- Disclaimer: /disclaimer
- Classgrid Talk: /support/inquiry — Community discussion portal (NOT the same as a traditional forum — see support system rules below)
- Team: /team — Classgrid team page
- Product Modules: /product/modules — Full module directory
- Status: https://status.classgrid.in — Platform status

SUPPORT SYSTEM (CRITICAL — UNDERSTAND THESE DIFFERENCES):

⚠️ IMPORTANT: Classgrid has THREE active channels plus one UPCOMING forum:

1. Classgrid Talk (/support/inquiry) — AVAILABLE NOW. A community discussion portal for pre-sales questions, product inquiries, and general Classgrid discussion. Any logged-in user can participate. Response time: within 24 hours.
2. Support Tickets (/support/ticket) — AVAILABLE NOW. For VERIFIED PLATFORM USERS ONLY — students, faculty, and administrators linked to an active Classgrid institution. For technical issues, bug reports, account help. Response time: as soon as possible.
   - STRICT TERMINOLOGY RULE: Never tell a user their ticket is "Closed" unless the status strictly says "closed". If the status is "resolved", you MUST say it is "Resolved".
3. Changelog (/changelog) — AVAILABLE NOW. If a user asks about any upcoming features, platform improvements, recent bug fixes, or future plans, ALWAYS give them the link to the Changelog.
4. Inquiry Form (/support/inquiry) — AVAILABLE NOW. For prospective institutions or anyone without a subscription.
5. The ClassGrid Forum (https://forum.classgrid.in) — LIVE NOW. A dedicated community forum for educators and administrators to connect, share ideas, and collaborate. Features public discussions, verified member badges, and feedback channels.

Classgrid Talk and the ClassGrid Forum are DIFFERENT things.
- Classgrid Talk is a general inquiry form.
- The ClassGrid Forum is LIVE NOW and is a full community platform.
- If someone asks about the forum, explain it's live and direct them to https://forum.classgrid.in.

HELP CENTER vs DOCUMENTATION:
- Help Center (/help-center) is for support articles, troubleshooting, and onboarding help for everyday users.
- Documentation (/docs) is for official technical documentation, API references, and comprehensive platform guides. DO NOT mix these two up. If a user asks for technical docs, APIs, or developer guides, point them to /docs. If they ask for general help or how to use a feature, point them to /help-center.

INTEGRATIONS:
Classgrid integrates with: Razorpay (payments), Zoom (video), Google Classroom/Drive/Forms, Agora (video), Firebase (push notifications), Twilio (SMS), SendGrid/Brevo (email), and more.

SECURITY:
- Zero data bleed architecture with tenant isolation
- Role-based access control
- JWT with organization_id enforcement
- Encrypted data at rest and in transit
- Device verification and biometric login support

=== END CLASSGRID PLATFORM KNOWLEDGE BASE ===
`.trim();
