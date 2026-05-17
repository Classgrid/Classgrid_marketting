# 📋 CLASSGRID MODULE PAGE — MASTER CONTENT BLUEPRINT

> **How to use:** Every day, copy the CODEX PROMPT at the bottom of this file, paste it into Codex, and tell him which module to write. He will generate all sections and upload them to Sanity automatically.

---

## 🗂️ WHAT GOES ON EVERY MODULE PAGE (Numbered 1.0 → 9.0)

Each module page should have **up to 23 content points** structured across 9 main sections.

---

### 1.0 — OVERVIEW
> *What is this module? Why does it exist?*

- **1.1** One-paragraph plain English description of the module
- **1.2** The core problem it solves ("Before Classgrid, institutions had to...")
- **1.3** How Classgrid solves it ("With this module, you can now...")
- **1.4** Which institution types need it most and why (school vs college vs coaching etc.)

**Sanity Field:** `structuredSections` → heading: "1. Overview"

---

### 2.0 — WHY THIS MODULE EXISTS (Design Philosophy)
> *Why was this built? What gap in the market does it fill?*

- **2.1** The real-world institutional problem before digitisation
- **2.2** What manual/paper-based alternatives were failing at
- **2.3** What makes Classgrid's approach unique vs generic solutions
- **2.4** Design goals: speed, simplicity, offline-first, role-aware, etc.

**Sanity Field:** `structuredSections` → heading: "2. Why This Module Exists"

---

### 3.0 — WHO NEEDS THIS & WHY (Institution Types)
> *Which org type uses it and how their use case differs*

| Institution | Why They Need It | Key Benefit |
|---|---|---|
| School | ... | ... |
| Jr College | ... | ... |
| Engineering | ... | ... |
| Coaching | ... | ... |
| College | ... | ... |

- **3.1** School-specific use case
- **3.2** Jr College / College-specific use case
- **3.3** Engineering-specific use case
- **3.4** Coaching-specific use case

**Sanity Field:** `structuredSections` → heading: "3. Who Needs This Module"

---

### 4.0 — CORE FEATURES & CAPABILITIES
> *What the module actually does — feature by feature*

Each capability entry has:
- **Feature Name** (bold, short)
- **What it does** (1-2 sentence description)

Minimum 8–12 capabilities per module.

**Sanity Field:** `capabilities[]` → `feature` + `description` + `icon`

Examples for Attendance:
- Smart Biometric Sync
- GPS-Based Attendance
- Auto Absent SMS to Parents
- Period-wise Attendance
- Leave vs Absent Split
- Attendance Analytics Dashboard
- Bulk Attendance Import
- Real-time Teacher Mobile App

---

### 5.0 — HOW IT WORKS (Step-by-Step Flow)
> *The actual workflow — from start to finish*

- **5.1** Setup / configuration step
- **5.2** Day-to-day usage step (teacher/admin action)
- **5.3** Student/parent side experience
- **5.4** Reporting / output step
- **5.5** Admin review step

**Sanity Field:** `structuredSections` → heading: "5. How It Works"

---

### 6.0 — STAKEHOLDER EXPERIENCE (Role-by-Role)
> *What each type of user sees and does in this module*

| Role | Their Experience |
|---|---|
| Super Admin | Can configure rules, view org-wide reports... |
| Institution Admin | Can manage daily operations... |
| Teacher / Faculty | Can mark, view, report... |
| Student | Can view their own data... |
| Parent | Can receive alerts, view child's data... |

Minimum 4 roles per module.

**Sanity Field:** `roleExperiences[]` → `roleName` + `description`

---

### 7.0 — INTEGRATION & PLATFORM CONNECTIONS
> *How this module connects with other Classgrid modules*

- **7.1** Which other modules feed data INTO this one
- **7.2** Which modules receive data FROM this one
- **7.3** What happens automatically when this module is active (cross-module triggers)
- **7.4** Mobile app availability — Classgrid has a **React Native mobile app** for Students and Faculty (launching alongside the marketing site). Mention which features of this module are available on mobile.
- **7.5** API / webhook availability (for advanced setups)
- **7.6** Which of the 8 Admin Dashboards display data from this module:
  - Admission Dashboard → fed by: Admission Management
  - Fee Dashboard → fed by: Fee Collection System
  - Library Dashboard → fed by: Digital Library Management
  - Student Dashboard → fed by: Attendance + Marks + Homework + Fees
  - Faculty Dashboard → fed by: Timetable + Attendance + Syllabus + Payroll
  - Organization Dashboard → fed by: ALL modules (top-level command center)
  - Canteen Dashboard → fed by: Canteen Management
  - Leave Dashboard → fed by: Staff Leave & Payroll

**Sanity Field:** `structuredSections` → heading: "7. Platform Integrations"

---

### 8.0 — FREQUENTLY ASKED QUESTIONS
> *Real questions admins/teachers ask before buying*

Minimum 6 FAQs per module. Cover:
- **8.1** "Does this work offline?"
- **8.2** "How does data sync across branches?"
- **8.3** "Is there a mobile app for this?"
- **8.4** "Can we customise the settings per class/department?"
- **8.5** "Is the data private and secure?"
- **8.6** "How long does setup/onboarding take?"
- **8.7** Module-specific question 1
- **8.8** Module-specific question 2

**Sanity Field:** `faqs[]` → `question` + `answer`

---

### 9.0 — SEO METADATA
> *For search engines — not shown on page directly*

- **9.1** Meta Title (max 60 chars) — include module name + "Classgrid"
- **9.2** Meta Description (max 160 chars) — benefit-driven summary

**Sanity Field:** `seo.metaTitle` + `seo.metaDescription`

---

---

## 📊 SPECIAL TEMPLATE — DASHBOARD MODULE PAGES (Modules 34–41)

> The 8 dashboard modules are **different** from functional modules. Use this alternate section structure for them. Dashboards are read-only analytics views — they don't have workflows, they show data.

### Dashboard Section Map:

| Section | Heading | Content |
|---|---|---|
| 1.0 | Overview | What this dashboard shows, who uses it, why it exists |
| 2.0 | What It Tracks | All KPIs, metrics, charts, and graphs on this dashboard |
| 3.0 | Who Can Access It | Super Admin / Institution Admin / Branch Head — role-based visibility |
| 4.0 | Connected Modules | Which functional modules feed data into this dashboard (see map below) |
| 5.0 | Real-Time vs Scheduled | Is data live or refreshed daily/hourly? Export options (PDF, Excel)? |
| 6.0 | Stakeholder Experience | Who sees what — Super Admin vs Branch Admin vs Department Head |
| 7.0 | Mobile Access | Available on the Classgrid React Native student/faculty app? |
| 8.0 | FAQs | 6-8 questions about data accuracy, access, customisation, exports |
| 9.0 | SEO | Meta title + description |

### Dashboard → Module Connection Map (Tell Codex to include this):

```
Admission Dashboard     ← Admission Management module
Fee Dashboard           ← Fee Collection System module  
Library Dashboard       ← Digital Library Management module
Student Dashboard       ← Attendance + Marks/Results + Homework + Fee status + Behaviour
Faculty Dashboard       ← Timetable + Attendance + Syllabus completion + Leave + Payroll
Organization Dashboard  ← ALL 33 functional modules (top-level org-wide view)
Canteen Dashboard       ← Canteen Management module
Leave Dashboard         ← Staff Leave & Payroll module
```

### Mobile App Note for Dashboards:
> Classgrid has a **React Native mobile app** for Students and Faculty (currently in development, launching alongside the marketing site). Dashboard data visible on mobile:
> - **Student App:** Student Dashboard data (attendance %, marks, fee status, homework)
> - **Faculty App:** Faculty Dashboard data (today's timetable, pending marks, leave status)
> - **Admin Dashboards** (Org, Admission, Fee, Library, Canteen, Leave): Web-only for now

---

## 🔌 FUTURE SECTIONS (To Add Later After All 41 Are Done)

These sections require separate Sanity schema additions — plan for Phase 2:

| Section | Description | Schema Needed |
|---|---|---|
| **Related Help Articles** | 2-3 links to Help Center articles about this module | `relatedHelpArticles[]` (reference to helpArticle) |
| **Related Blog Posts** | 2-3 blog posts that mention this module | `relatedBlogPosts[]` (reference to post) |
| **Related Changelog** | Recent changelog entries for this module | `relatedChangelogs[]` (reference to changelog) |
| **Video Demo** | Embedded YouTube/Loom walkthrough | `demoVideoUrl` (string) |
| **Testimonial / Case Study** | Quote from a real school about this module | `testimonial` (object: quote, school, role) |
| **Comparison Row** | How Classgrid's version beats competitors | `competitorComparison[]` |

---

## 🤖 CODEX MASTER PROMPT (Copy this every day)

```
You are a senior EdTech content writer and Sanity CMS developer for Classgrid — an Indian school management platform used by schools, colleges, Jr colleges, engineering institutes, and coaching centres.

YOUR TASK:
Write and upload the full module page content for: **[MODULE NAME HERE]**
Module Slug: **[SLUG HERE]**
Available For: **[school / junior-college / engineering / coaching / college — pick correct ones]**

Classgrid Platform codebase is at:
C:\Users\nikhi\OneDrive\Documents\Classgrid_platfrom\classgrid_platform

Classgrid Marketing site is at:
C:\Users\nikhi\OneDrive\Documents\classgrid_marketting

Sanity credentials:
- projectId: a4wk6kp5
- dataset: production
- token: skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M

INSTRUCTIONS:

STEP 1 — RESEARCH THE MODULE:
- Read actual platform code files related to [MODULE NAME] from the classgrid_platform repo
- Check server controllers, routes, models for this module to understand what it actually does
- Check client components/features for this module to understand the UI and user flows
- Do NOT make things up — only write about features that actually exist in the code

STEP 2 — WRITE ALL SECTIONS:
Write content for all sections as per the blueprint below:

Section 1 — Overview (structuredSections, heading: "1. Overview")
- What is this module
- The problem it solves
- How Classgrid solves it
- Which institutions need it most

Section 2 — Why This Module Exists (structuredSections, heading: "2. Why This Module Exists")
- Real-world problem before digitisation
- What manual alternatives were failing at
- Classgrid's unique approach
- Design goals of this module

Section 3 — Who Needs This (structuredSections, heading: "3. Who Needs This Module")
- For each institution type this module supports, write 2-3 sentences on their specific use case
- Use a table format where possible

Section 4 — Core Features (capabilities[])
- Minimum 10 feature/description pairs
- Feature name: short and bold
- Description: 1-2 sentences of what it actually does
- Icon: pick a relevant Lucide icon name (e.g. "ClipboardCheck", "Users", "Bell")

Section 5 — How It Works (structuredSections, heading: "5. How It Works")
- Numbered step-by-step workflow from setup → daily use → reporting
- At least 5 steps

Section 6 — Stakeholder Experience (roleExperiences[])
- Write for: Super Admin, Institution Admin, Teacher/Faculty, Student, Parent (where relevant)
- 2-3 sentences per role describing their specific experience

Section 7 — Platform Integrations (structuredSections, heading: "7. Platform Integrations")
- Which other Classgrid modules connect to this one
- What data flows in and out
- Mobile app and API availability

Section 8 — FAQs (faqs[])
- Minimum 8 question/answer pairs
- Mix of general platform questions + module-specific questions
- Answers should be 2-4 sentences each, honest and specific

Section 9 — SEO (seo.metaTitle + seo.metaDescription)
- metaTitle: max 60 chars, include module name + Classgrid
- metaDescription: max 160 chars, benefit-driven

STEP 3 — UPLOAD TO SANITY:

Sanity document type: "solutionModule"
Document ID to patch: "solutionModule-[slug]"
Use client.patch(docId).set({...}).commit() OR client.createOrReplace({...}) 

EXACT SANITY FIELD MAPPING — send each section to the correct field:

| Section | Sanity Field | Format |
|---|---|---|
| Section 1 (Overview) | structuredSections[] | { heading: "1. Overview", content: [portable text blocks] } |
| Section 2 (Why It Exists) | structuredSections[] | { heading: "2. Why This Module Exists", content: [...] } |
| Section 3 (Who Needs It) | structuredSections[] | { heading: "3. Who Needs This Module", content: [...] } |
| Section 4 (Core Features) | capabilities[] | [{ feature: "...", description: "...", icon: "..." }] |
| Section 5 (How It Works) | structuredSections[] | { heading: "5. How It Works", content: [...] } |
| Section 6 (Stakeholder) | roleExperiences[] | [{ roleName: "...", description: "..." }] |
| Section 7 (Integrations) | structuredSections[] | { heading: "7. Platform Integrations", content: [...] } |
| Section 8 (FAQs) | faqs[] | [{ question: "...", answer: "..." }] |
| Section 9 (SEO) | seo.metaTitle + seo.metaDescription | { metaTitle: "...", metaDescription: "..." } |

Upload order:
1. First patch: structuredSections (all 5 text sections together as array)
2. Second patch: capabilities[]
3. Third patch: roleExperiences[]
4. Fourth patch: faqs[]
5. Fifth patch: seo object

Confirm each patch succeeded (200 OK) before next.
At the end, print: "✅ [Module Name] fully uploaded to Sanity at solutionModule-[slug]"

IMPORTANT RULES:
- Only write about features confirmed in the actual code — check the platform repo first
- Write in confident, professional but plain English — no jargon, no buzzwords
- The audience is school principals, college admin heads, coaching directors
- Every section must feel like it was written by someone who deeply understands Indian education institutions
- Do NOT add placeholder text — every field must have real, useful content
```

---

## 📅 DAILY WORKFLOW

1. Open this file
2. Copy the CODEX MASTER PROMPT above
3. Replace `[MODULE NAME HERE]` and `[SLUG HERE]` with today's module
4. Paste into Codex
5. Codex researches the platform code and uploads all 9 sections to Sanity
6. Verify on `localhost:3000/product/modules/[slug]`
7. ✅ Done for the day — 1 module complete, 40 remaining

---

## 📋 MODULE COMPLETION TRACKER

| # | Module | Slug | Status |
|---|---|---|---|
| 1 | Attendance System | smart-attendance | ⬜ Empty |
| 2 | Digital Classroom Management | classroom-hub / the-unified-classroom-hub | ⬜ Empty |
| 3 | Automated Timetable | automated-timetable | ⬜ Empty |
| 4 | Academic Planning Tools | academic-planning-tools | ⬜ Empty |
| 5 | Homework & Assignment | homework-management | ⬜ Empty |
| 6 | Student Notes Sharing | student-notes-sharing | ⬜ Empty |
| 7 | Teacher Planner | teacher-planner / teacher-planner-lesson-plan-engine | ⬜ Empty |
| 8 | Subject Management | subject-management | ⬜ Empty |
| 9 | Course Management | course-management | ⬜ Empty |
| 10 | Online Exam Platform | online-exam-proctoring-engine | ⬜ Empty |
| 11 | Examination Management | examination-management | ⬜ Empty |
| 12 | Interactive Quiz Systems | interactive-quiz-systems | ⬜ Empty |
| 13 | Grade Entry & Results | marks-results-sgpa-engine | ⬜ Empty |
| 14 | Internal Assessment Tools | internal-assessment-tools | ⬜ Empty |
| 15 | CET/JEE/NEET Exam Conduction | cet-jee-neet-exam-conduction | ⬜ Empty |
| 16 | Past Paper & Mock Tests | past-paper-mock-tests | ⬜ Empty |
| 17 | AI-Powered Viva | ai-powered-viva | ⬜ Empty |
| 18 | Test Series Management | test-series-management | ⬜ Empty |
| 19 | Admission Management | enterprise-admission-engine | ⬜ Empty |
| 20 | Fee Collection System | fee-payments-engine | ⬜ Empty |
| 21 | Staff Leave & Payroll | leave-application-payroll-management | ⬜ Empty |
| 22 | Canteen Management | canteen-campus-logistics | ⬜ Empty |
| 23 | Digital Library Management | smart-library-volume-management | ⬜ Empty |
| 24 | Alumni Network | alumni-network | ⬜ Empty |
| 25 | AI Assistant | ai-assistant | ⬜ Empty |
| 26 | Advanced Analytics | super-analytics-audit-trails | ⬜ Empty |
| 27 | Compliance Audit Trails | naac-nba-audit-capture-engine | ⬜ Empty |
| 28 | Digital Certificates | automated-certificate-document-verifier | ⬜ Empty |
| 29 | Holiday Management | holiday-management | ⬜ Empty |
| 30 | Digital ID Cards | digital-id-card-campus-identity | ⬜ Empty |
| 31 | Events Management | events-seminar-booking | ⬜ Empty |
| 32 | Feedback System | feedback-system | ⬜ Empty |
| 33 | Institution Website | multi-tenant-website-builder | ⬜ Empty |
| 34 | Admission Dashboard | admission-dashboard | ⬜ Empty |
| 35 | Fee Dashboard | fee-dashboard | ⬜ Empty |
| 36 | Library Dashboard | library-dashboard | ⬜ Empty |
| 37 | Student Dashboard | student-dashboard | ⬜ Empty |
| 38 | Faculty Dashboard | faculty-dashboard | ⬜ Empty |
| 39 | Organization Dashboard | organization-dashboard | ⬜ Empty |
| 40 | Canteen Dashboard | canteen-dashboard | ⬜ Empty |
| 41 | Leave Dashboard | leave-dashboard | ⬜ Empty |
