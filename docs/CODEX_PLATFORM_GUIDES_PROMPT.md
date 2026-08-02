# Master Prompt for Codex: Platform Guidelines

**ROLE & CONTEXT**
You are a Senior Technical Writer and Solutions Architect for Classgrid. Your task is to write the `platform-guides.mdx` documentation page from scratch. This document will serve as the master manual explaining the core operational modules of the Classgrid platform. 

**CRITICAL RULES**
1. **Accurate Architecture:** You must base the descriptions strictly on the actual backend route structure provided below. Do not hallucinate features.
2. **Audience:** This is for IT Admins, Principals, and HODs learning how the platform works. Keep the tone professional but accessible (avoid deep code jargon, focus on workflow and data).
3. **Format:** Output as a valid `.mdx` file. Use standard Markdown (`<h2>`, `<ul>`, `<table>`). Include YAML frontmatter.

**BACKEND MODULE REFERENCE (Use these to construct the guide)**
The platform is powered by a monolithic Express.js backend with over 90 distinct route controllers. Group the guide into the following logical sections based on the real backend capabilities:

1. **Academic Core:**
   - `classroom.routes.js`, `academic-plan.routes.js`, `timetable.routes.js`: Explain how subjects, batches, and daily schedules are mapped.
   - `attendance.routes.js`, `leave.routes.js`: Explain the strict daily tracking and faculty leave workflows.

2. **Examination & Assessment:**
   - `online-exam.routes.js`, `advanced_quiz.routes.js`, `viva.routes.js`: Explain the NTA-style online exam engine and the AI-driven Viva assessments.
   - `marks.routes.js`, `result.routes.js`: Explain how internal tests and final semester marks are aggregated into compliance reports.

3. **Financial Operations:**
   - `fees.routes.js`, `fee-records.routes.js`, `billing-checkout.routes.js`: Explain the automated fee collection system and installment tracking.
   - `razorpay-webhook.routes.js`: Emphasize real-time T+2 settlement and automated receipt generation via Razorpay.
   - `payroll.routes.js`: Explain staff salary generation.

4. **Communication & Collaboration:**
   - `chat.routes.js`, `group_chat.routes.js`, `thread_chat.routes.js`: Explain the internal secure messaging system.
   - `meet.routes.js`, `zoom.routes.js`: Explain live lecture integrations.
   - `push.routes.js`, `messaging.routes.js`: Explain automated SMS/WhatsApp alerts for parents.

5. **Campus Operations:**
   - `library.routes.js`, `canteen.routes.js`, `events.routes.js`, `holidays.routes.js`: Explain the digitization of physical campus resources.

**SPECIFIC INSTRUCTIONS FOR THIS RUN**
1. **Headline:** `# Classgrid Platform Guidelines`
2. **Introduction:** Briefly introduce the modular nature of Classgrid.
3. **Module Breakdowns:** Create a section for each of the 5 groups listed above. Explain the *workflow* (e.g., "How the Online Exam Engine works from Teacher creation to Student submission").
4. **Data Flow Table:** Include a pure HTML `<table>` that shows how data moves from a standard module (like Attendance) up to the Super Admin analytics dashboard (`analytics.routes.js`).
