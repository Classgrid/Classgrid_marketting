# 🧠 CLASSGRID PAGES — DEEP DIVE: MODULE DOCUMENTATION & PAGE COPY
**COMPANION TO: CLASSGRID_PAGES_REFERENCE.md (v3.0)**

> This file contains the exhaustive, 500+ word deep-dive for every single module in the Classgrid platform, plus the complete marketing copy for every page of the Next.js site. Feed this alongside the Reference file and the Classgrid Design System to your AI developer.

---

# ═══════════════════════════════════════════════════════════════
# SECTION A: ALL 41 MODULES — DEEP FUNCTIONAL DOCUMENTATION
# ═══════════════════════════════════════════════════════════════

---

## MODULE 1: Authentication & Identity System

### Why It Exists
Educational institutions have students, faculty, parents, and administrators — each with wildly different needs. A student should never see payroll data. A parent should never edit grades. Classgrid solves this with a 5-role, multi-method authentication system that secures every endpoint based on who is logged in and what institution they belong to.

### How It Works
The authentication system supports four login methods:
1. **Phone OTP (Firebase):** The primary method for students and admission applicants. The user enters their phone number. Firebase sends a 6-digit OTP via SMS. Once verified, the client sends the Firebase `idToken` to our Express backend. The backend verifies it, checks the user in MongoDB, and signs a **Classgrid JWT** containing the userId, role, organizationId, and structure_type. This JWT is stored in an HttpOnly secure cookie (for web) or EncryptedSharedPreferences (for Android).
2. **Google OAuth (Passport.js):** Used by faculty and admins who prefer one-click login. The frontend triggers a Google popup, receives the Google token, and sends it to the backend for verification via the Google Cloud Console project.
3. **Email + Password (Bcrypt):** The fallback method. Passwords are hashed with Bcrypt (salt rounds). Used for SuperAdmin access and institutions that prefer traditional auth.
4. **Native Biometric (Android Only):** When a user logs in on the Android app, they can opt-in to fingerprint/FaceID login. On subsequent launches, the app triggers the native Android BiometricPrompt. If the hardware enclave validates the user, it sends a cached credential hash to the React frontend, which auto-submits the login form — zero typing required.

### Smart Routing & Session Management
- Desktop browsers use 24-hour JWT sessions (or 7 days with "Remember Me"). Mobile apps use 365-day sessions because personal phones are protected by OS lock screens.
- If a faculty member accidentally opens the Student login page on desktop, the system detects their role from a prior session and auto-redirects them to the correct Faculty login.
- On mobile (inside the native APK), auto-redirect is DISABLED. Instead, the backend hard-blocks the login with a 403 error: "Unauthorized: Please download the correct app." This prevents students from using the Faculty APK.
- Every logout sends the user back to their role-specific login page (Student → `/student/login`, Faculty → `/faculty/login`). The system never crosses login contexts.

### Device Verification
When a user logs in from a new, unrecognized device, the system generates a 6-digit OTP sent to their registered email. The `DeviceVerification.js` model tracks device fingerprints (browser agent, screen resolution, timezone hash). This prevents account takeover even if credentials are stolen.

### What to Showcase on Marketing Site
On `/features` and `/security`: Highlight the multi-method login, biometric support, auto-redirect intelligence, and the device verification layer. Key selling points: "Your students log in with a fingerprint. Your faculty log in with Google. Your parents log in with OTP. Everyone is protected."

---

## MODULE 2: Organization Management Engine

### Why It Exists
Classgrid serves thousands of independent institutions simultaneously on a single shared infrastructure. Each institution needs its own identity: its own logo, its own theme colors, its own academic structure, its own set of students and faculty. The Organization Management Engine is the backbone that makes all of this possible.

### How It Works
When an Org Admin signs up (via the `/demo` page on the marketing site), the backend creates an `Organization` document in MongoDB. This document is massive — it contains:
- **Identity fields:** name, slug (for subdomain), logo URL, tagline
- **Academic config:** org_type (engineering/school/coaching/etc.), structure_type (13 variants), division_mode, allow_sub_batches
- **Branding:** primary color (OKLCH format), font choice, dark/light mode preference
- **Security:** organizationCode (12-char string for faculty joining), honorCode (for students)
- **Contact info:** admin name, email, phone, address, city, state, PIN
- **Feature toggles:** Which modules are enabled (controlled by subscription plan)
- **Domain config:** custom subdomain (e.g., pccoe.classgrid.in)

The `organization.controller.js` at 95KB is the single largest file in the entire backend. It handles:
- Creating and updating organizations
- Managing the Organization Code and Honor Code (with secure regeneration)
- Uploading and cropping logos
- Setting OKLCH theme colors that cascade to all users' dashboards
- Configuring batch/branch lists for the academic hierarchy
- Setting up email domain restrictions (e.g., only @mit.edu emails allowed)
- SSO configuration
- Webhook configuration for external integrations
- Full organization deletion (cascading purge across 59 collections via `org-delete.service.js`)

### The Subdomain System
Every org gets a subdomain: `greenwood.classgrid.in`. This is resolved via wildcard DNS (`*.classgrid.in` A record → EC2 IP). When a user visits the subdomain, React reads `window.location.hostname`, extracts the slug, and calls `GET /api/org/branding?subdomain=greenwood`. The login page instantly renders that institution's specific logo, name, and theme colors.

### What to Showcase on Marketing Site
On `/tour` and `/demo`: Show the 5-minute setup process. "Upload your logo. Set your colors. Share the code. Your campus is live." Emphasize white-labeling: "Your students never see the Classgrid brand. They see YOUR institution's identity."

---

## MODULE 3: Classroom & Course Management

### Why It Exists
The Classroom is the fundamental unit of Classgrid. Everything — attendance, assignments, marks, chat, materials — happens inside a Classroom. Without this module, nothing else works.

### How It Works
Faculty create Classrooms tied to their department and division. Each classroom has:
- A name (e.g., "Data Structures - SE Comp A")
- A subject mapping (via OrgSubject.js)
- A membership list (via ClassroomMembership.js)
- An invite system (students join via classroom code or admin bulk-adds them)

The `classroom.routes.js` at 83KB is the largest route file in the backend. It handles:
- CRUD operations for classrooms
- Student join/leave workflows
- Classroom settings (locking, archiving)
- Resource sharing (pinned posts, materials)
- Member role management (who can post, who can only view)
- Bulk operations (add 500 students at once via CSV)
- Classroom-level announcements

Courses (`course.routes.js`, 31KB) are the higher-level containers. An Org Admin creates Courses (e.g., "B.Tech Computer Engineering"), and classrooms are nested inside them.

### What to Showcase on Marketing Site
On `/features` under "Academics" tab: "Create a classroom in 30 seconds. Invite 500 students with one CSV. Every assignment, every grade, every conversation lives in one place."

---

## MODULE 4: Academic Hierarchy & Planning

### Why It Exists
A coaching center has "Courses and Batches." An engineering college has "Degrees, Departments, Years, Semesters, and Divisions." A school has "Standards and Sections." Classgrid needs to understand the physical organizational chart of every institution type to properly group students and schedule resources.

### How It Works
The `AcademicHierarchy.js` model stores the tree structure:
- For Engineering: Degree (B.Tech) → Department (Computer Eng) → Year (SE) → Semester (3) → Division (A)
- For School: Standard (10th) → Division (B)
- For Coaching: Course (JEE Advanced) → Batch (Evening 2)

The `hierarchy.controller.js` (17KB) dynamically validates hierarchy creation based on `structure_type`. If a coaching center tries to create a "Semester" node, the middleware blocks it with `400 Bad Request`. If a school tries to create a "Department," same thing.

The `academic-plan.routes.js` (14KB) manages the academic calendar: which semester is active, when exams start, when the academic year rolls over.

### The Sub-Batch System
For Engineering and Diploma institutions with large divisions (60+ students in Division A), the system supports sub-batches. Division A can be split into Lab Batch A1, A2, and A3 for practical sessions. The timetable engine respects these splits when scheduling lab periods.

### What to Showcase on Marketing Site
On `/tour` Step 2: Show a visual tree diagram. "Tell us your structure. We adapt everything — terminology, navigation, timetables, attendance — to match your real-world campus layout."

---

## MODULE 5: Attendance System

### Why It Exists
Attendance tracking is a legal requirement for most educational institutions. Universities must report attendance percentages to regulatory bodies. Students below 75% attendance can be debarred from exams. Manual attendance (paper rolls) is slow, error-prone, and easily faked. Classgrid digitizes this completely.

### How It Works
Faculty open a classroom on the app and tap "Mark Attendance." The system shows a mobile-optimized grid of all students in that division. The teacher taps green (present) or red (absent) for each student. The entire process takes under 60 seconds for a class of 60 students.

Behind the scenes, the `attendance.routes.js` (70KB — one of the largest route files) handles:
- **GPS Validation:** If the Org Admin has configured geofencing, the student's or teacher's GPS coordinates are checked against the campus center-point. If they're more than the allowed radius away, attendance is blocked.
- **Device Fingerprint:** The system records a device hash. If the same device marks attendance for two different students, it flags it as suspicious (proxy attendance detection).
- **Bulk Processing:** During peak times (9:00 AM when 100 teachers mark attendance simultaneously), the `attendance.worker.js` buffers records in a Redis queue and batch-inserts them into MongoDB to prevent database overload.
- **Appeal System:** Students can file an attendance appeal (AttendanceAppeal.js) if they believe they were incorrectly marked absent. Faculty can review and approve/reject.
- **Analytics Dashboard:** The `attendance_dashboard.routes.js` (23KB) provides comprehensive reports — daily, weekly, monthly breakdowns. Org Admins see institution-wide absence trends. Faculty see per-classroom percentages.

### The Attendance Session Model
Every time a teacher marks attendance, an `AttendanceSession` is created. This records: who marked it, when, from what device, GPS coordinates, and which classroom. Individual student records are `AttendanceRecord` entries linked to this session. This double-layer provides an audit trail — if there's ever a dispute, admins can see exactly who marked what, when, and from where.

### What to Showcase on Marketing Site
On `/features` and `/use-cases/teachers`: "Mark attendance for 60 students in under 60 seconds. GPS verification prevents proxy attendance. Real-time dashboards show you which students are at risk before it's too late."

---

## MODULE 6: Assignment System

### Why It Exists
Assignments are the daily workflow of teaching. Teachers need to assign homework, students need to submit it, and teachers need to grade it — all without paper, all traceable, all timestamped.

### How It Works
Faculty create assignments inside a classroom with:
- Title and description
- Attached reference materials (PDF, images)
- A hard deadline with auto-locking (if a student tries to submit 1 minute after the deadline, the system rejects it and shows the submission in red)
- Maximum marks and grading rubric

Students submit via the Android app by taking a photo of handwritten work or uploading a PDF. The `AssignmentSubmission.js` model tracks:
- Submission timestamp (to the second)
- File URLs (stored on S3/Supabase)
- Grade (once the teacher evaluates)
- Late flag (if submitted after deadline but within a grace period)

Faculty view all submissions in a grid, grade them individually, and the grades flow into the student's analytics dashboard.

### What to Showcase on Marketing Site
On `/features` under "Academics": "No more lost homework. Students submit from their phones. Teachers grade from anywhere. Every submission is timestamped, tracked, and automatically reflected in analytics."

---

## MODULE 7: Result & Examination Engine (SGPA/CGPA Calculator)

### Why It Exists
This is one of Classgrid's "Killer Features." Universities require SGPA and CGPA calculations on official marksheets. Doing this manually for 3,000 students with 8 subjects each, handling backlogs and grace marks, is a week-long nightmare for any academic coordinator. Classgrid does it in 12 seconds.

### How It Works
1. **Data Input:** Faculty download a CSV template from the dashboard, fill in raw marks for every student (Internal Assessment + External Exam + Lab), and upload it back. The `marks.service.js` (10KB) parses the CSV, validates every row, and bulk-inserts into `StudentMark.js`.
2. **The Calculation Engine:** Once marks are uploaded, the admin triggers "Calculate Results." The backend engine:
   - Fetches all marks for the semester
   - Applies the credit-based weightage formula: `Grade Points × Credits / Total Credits = SGPA`
   - Handles backlogs (carry-forward subjects affect CGPA but not current SGPA)
   - Applies grace marks if the institution has that policy
   - Calculates ranks (1st, 2nd, 3rd) per class and per division
   - Generates statistical analytics: min, max, average, standard deviation per subject
3. **The Academic Heatmap:** Org Admins see a visual chart showing which subjects have high failure rates across the entire institution. If 60% of students fail Mathematics III, the system flags it for early intervention.
4. **PDF Marksheet Generation:** With one click, the system generates high-fidelity, printable PDF marksheets for every student. Each marksheet features:
   - The institution's logo and branding
   - The student's PRN/Roll Number, Department, Semester
   - Subject-wise marks, grades, and credit points
   - SGPA for the current semester
   - CGPA cumulative across all semesters
   - An anti-fraud QR code that links to a verification page
5. **Audit Trail:** Every result action (mark entry, calculation, edit) is logged in `ResultAuditLog.js` for accountability.

### What to Showcase on Marketing Site
On `/features` under "Examinations": "Upload one CSV. Get SGPA, CGPA, ranks, and printable marksheets for 3,000 students in under 12 seconds. University-grade accuracy. Zero manual calculation."

---

## MODULE 8: Online Examination Engine (NTA-Style)

### Why It Exists
COVID proved that institutions need the ability to conduct exams online. But online exams face two massive challenges: cheating and scale. Classgrid's Online Exam Engine handles both with AI proctoring and a battle-tested architecture.

### How It Works
This is the most complex module in the entire system:
1. **Exam Builder (OnlineExamBuilder.jsx — 83KB, the largest frontend file):** Faculty create exams with multiple sections (Physics, Chemistry, Math), each with its own time limit. Questions can be MCQ, numerical, or descriptive. Questions can be imported via CSV or AI-generated via Groq.
2. **Hall Ticket Generation:** Once students are registered for the exam, the system generates downloadable digital Hall Tickets with the student's photo, PRN, exam date/time, and a unique exam session ID.
3. **Secure Login Gate (ExamLoginGate.jsx):** On exam day, students must enter their PRN and exam password. The system verifies their identity, checks if the exam window is open, and admits them.
4. **Timed Exam Player (ExamPlayer.jsx — 56KB):** The actual exam interface with:
   - Section-wise navigation (just like the real NTA interface)
   - Question palette showing answered/unanswered/marked-for-review
   - Countdown timer with warnings at 15 min, 5 min, and 1 min
   - Auto-submit when time expires
   - Anti-tab-switch detection (if the student switches tabs, a violation is logged)
5. **AI Webcam Proctoring:** The system captures periodic webcam snapshots and sends them to Gemini Vision for analysis. It detects: multiple faces, phone usage, looking away from screen, suspicious objects. Violations are logged to `ExamProctoringDashboard.jsx`.
6. **Auto-Grading:** MCQ and numerical answers are graded instantly. Faculty can manually grade descriptive answers via `ExamGradingDashboard.jsx` (28KB).
7. **Analytics:** Post-exam, students see topic-wise analysis (which topics they're weak in). The system even includes a CET rank prediction engine that estimates their competitive exam rank based on performance patterns.

### What to Showcase on Marketing Site
On `/features` under "Examinations": "Conduct NTA-style exams with AI proctoring, section timers, and auto-grading. Hall tickets, login gates, and webcam monitoring — all built in. No third-party exam software needed."

---

## MODULE 9: Quiz & Assessment System

### Why It Exists
Not every assessment needs to be a formal exam. Teachers need quick, low-stakes quizzes to check understanding — pop quizzes, practice tests, revision sessions. This module provides that.

### How It Works
Faculty create quizzes with:
- MCQ questions with 4 options
- Configurable timer (per quiz or per question)
- Auto-evaluation (instant results once submitted)
- Leaderboard (gamified ranking motivates students)
- AI quiz generation: Teachers provide a topic, and the `quiz-ai.service.js` uses Groq to auto-generate relevant questions
- Google Forms integration: Import existing Google Forms quizzes via `quiz-google.service.js`
- Test Series: Create a sequence of quizzes that students take over time (like a mock test series for competitive exams)

Students take quizzes on the mobile app. Results appear instantly with correct/incorrect breakdowns. The leaderboard shows top performers.

### What to Showcase on Marketing Site
On `/features` under "Assessments": "Create a quiz in 2 minutes. Let AI generate the questions. Students compete on leaderboards. Perfect for revision, practice, and competitive prep."

---

## MODULE 10: AI Viva Examination System

### Why It Exists
Oral examinations (vivas) are critical in engineering and medical education, but scheduling and conducting them is a logistical nightmare. Faculty need to test students one-by-one, which takes days. Classgrid's AI Viva system allows students to practice against an AI examiner and allows faculty to schedule formal vivas at scale.

### How It Works
The system offers three modes:
1. **🟢 Practice Mode:** Students ask the AI to quiz them on a topic. The AI generates questions of increasing difficulty. Hints are available. No grades recorded — purely for practice.
2. **🔴 Exam Mode:** Faculty schedule a formal viva for an entire class. Students sit the AI viva one by one. The AI evaluates answers on 4 parameters: Knowledge (accuracy), Clarity (communication), Confidence (hesitation detection via metadata), and Accuracy (factual correctness). Scores are recorded in `VivaRecord.js` and visible to faculty.
3. **🔵 Rapid Fire Mode:** Speed recall — students get 10-20 seconds per question. Tests quick thinking under pressure.

The system tracks thinking time pressure, speech rate metadata, and improvement trends across multiple viva sessions. An AI Learning Loop connects exam weak sections to auto-triggered viva recommendations.

### What to Showcase on Marketing Site
On `/features` under "AI": "The world's first AI Viva Examiner. Practice mode for students. Exam mode for faculty. 4-parameter scoring. No scheduling overhead."

---

## MODULE 11: Real-Time Chat & Communication

### Why It Exists
Every institution uses WhatsApp groups for communication — and it's a disaster. Messages get lost. Students message teachers at midnight. There's no privacy control. Students bully each other in group chats. Classgrid replaces all of this with a professional, role-isolated, institutionally-controlled communication system.

### How It Works
The chat system runs on Socket.io WebSockets (NOT Supabase Realtime — we use our own EC2 connection for sub-10ms latency).

**Architecture:**
1. User sends message → hits Redis Stream (`chat:stream:org_123`)
2. Socket.io broadcasts to all connected clients (message appears "gray" = sent)
3. Adaptive worker pulls from Redis stream → `mongo.insertMany(messages)` → `redis.ack()` → socket emits `message_saved` (message turns "blue" = delivered)
4. If MongoDB fails, Redis retains the messages safely buffered until retry succeeds

**Channel Types:**
- **Classroom Chat:** Automatically created per classroom. Students see only their own subject channels.
- **Group Chat:** `group_chat.routes.js` (22KB) — for project teams or study groups
- **Thread Chat:** `thread_chat.routes.js` (31KB) — threaded discussions within classrooms
- **Org Chat:** `org_chat.routes.js` (9KB) — institution-wide announcements from admins

**Privacy & Safety:**
- Students cannot message each other privately by default (prevents bullying)
- Students can only message teachers of their assigned subjects
- All messages are logged and stored on institutional servers
- Image/document sanitization before rendering (prevents malicious file distribution)
- Voice notes supported with transcription via Groq Whisper AI

### What to Showcase on Marketing Site
On `/features` under "Communication": "Replace 47 WhatsApp groups with one secure, role-isolated chat. Students only message their teachers. No bullying. No midnight messages. Complete institutional control."

---

## MODULE 12: Fee Management & Razorpay Integration

### Why It Exists
Fee collection is the single biggest pain point for educational institutions. Cash collection is messy. Tracking who paid what is harder. Splitting payments between multiple bank accounts requires an accountant. Generating receipts takes hours. Classgrid automates all of it.

### How It Works
1. **Fee Structure Builder:** The Org Admin creates "Fee Products." For example, "Engineering First Year Fee" is composed of: Tuition (₹50,000) + Development Fee (₹5,000) + Library Fee (₹2,000) + Exam Fee (₹3,000) + Gymkhana (₹1,000). These components are stored in `FeeComponent.js` and grouped under `FeeStructure.js`.
2. **Student Ledger:** Every student gets a unique ledger (`StudentFeeLedger.js`) showing exactly what they owe, what they've paid, and what's pending. Parents see this same ledger in their read-only dashboard.
3. **Razorpay Split Settlements:** This is the powerful feature. We use the Razorpay Routes API. When a student pays ₹61,000 via UPI on the Android app, the payment is automatically split at the point of transaction: ₹55,000 goes to the Tuition bank account, ₹5,000 goes to the Development Fund account, and ₹1,000 goes to the Gymkhana account. The institution doesn't need to manually reconcile.
4. **PDF Receipts:** The moment a payment succeeds (Razorpay webhook fires → our backend receives it → `FeeTransaction.js` is created), the system auto-generates a professionally designed PDF receipt with the institution's branding, the student's details, the payment breakdown, and a QR verification code. This receipt is emailed to the Parent.
5. **Overdue Detection:** The `fee-records.routes.js` includes automatic overdue detection. Students who miss their deadline get flagged, and the system sends push notifications + SMS reminders.

### What to Showcase on Marketing Site
On `/pricing` and `/features` under "Finance": "Parents pay tuition via UPI. The money splits into your bank accounts automatically. PDF receipts are emailed instantly. You never chase a payment again."

---

## MODULE 13: Timetable & Scheduling

### Why It Exists
Creating a timetable for a large institution is a constraint-satisfaction problem. Professor Sharma can't be in Class A and Class B at the same time. Lab sessions need to align with sub-batches. Breaks must be consistent. Clash-free timetables take schools weeks to create manually.

### How It Works
The timetable engine (`timetable.routes.js`, 22KB) provides:
- Drag-and-drop scheduling interface
- Anti-collision algorithm: If you try to assign Prof. Sharma to 10th-A and 10th-B at 9 AM, the system blocks it with a red warning
- Auto-embed virtual meeting links: If a class is hybrid (in-person + online), the system auto-generates a Zoom/Google Meet link for the time slot
- Calendar integration (`calendar.routes.js`, 14KB): Timetable events sync to students' calendar views
- Holiday awareness: The system knows about holidays (from `holidays.routes.js`) and blocks those slots automatically

### What to Showcase on Marketing Site
On `/features` under "Academics": "Drag-and-drop timetables with automatic clash detection. No more scheduling Excel sheets. Meeting links auto-generated for hybrid classes."

---

## MODULE 14: Leave Management System

### Why It Exists
Students get sick. Faculty have emergencies. The institution needs a trail of who's absent and why. Paper leave applications get lost. Classgrid digitizes the entire workflow.

### How It Works
- **Student Leave:** Students open the app, select dates and leave type (Medical/Personal/Family), attach a supporting document if needed, and submit. Their class teacher sees it in the "Pending Leaves" dashboard and can approve/reject with a single tap.
- **Faculty Leave:** Similar workflow, but approval goes to the HOD or Org Admin.
- **Quick Leave:** For urgent same-day absences, a simplified single-tap "Quick Leave" button.
- **Leave Balance:** Each student/faculty has tracked leave balances (Casual/Sick/Earned) with type-wise breakdown.
- **Faculty Dashboards:** Teachers see a daily absence dashboard ("Who's absent today?"), a weekly calendar view, and monthly absence pattern analysis to identify chronically absent students.
- **Auto-Integration:** Approved leaves automatically reflect in the attendance module (so teachers don't accidentally mark an absent-on-leave student as absent-unauthorized).

### What to Showcase on Marketing Site
On `/features` under "Operations": "Digital leave applications. One-tap approval. Auto-sync with attendance. Faculty see daily absence dashboards. Parents get notified instantly."

---

## MODULE 15: Live Meetings & Video Conferencing

### Why It Exists
Hybrid learning is here to stay. Faculty need to host live classes for students who are on campus AND students who are remote. Classgrid integrates with Agora (our primary video SDK) and Zoom to provide a native video experience — no external app switching.

### How It Works
- **Agora Integration:** Using the Agora RTC and RTM SDKs, faculty can start a live video class directly from the classroom dashboard. Students click "Join Live Class" and they're in — no redirect, no Zoom download needed.
- **1-on-1 & Group Calls:** Inside chat threads, users can start voice/video calls directly, powered by Agora P2P.
- **Cloud Recording:** Live sessions are automatically recorded via Agora Cloud Recording. Recordings are pushed to AWS S3 and auto-linked to the classroom's "Records" section so students can watch later.
- **Zoom Integration:** For institutions that already have Zoom licenses, the `zoom.routes.js` (16KB) provides deep integration — scheduling meetings, generating join links, and embedding them in the timetable.
- **Meeting Scheduling:** Faculty schedule meetings with reminders. Students see upcoming meetings in their dashboard with countdown timers and one-click "Join" buttons.

### What to Showcase on Marketing Site
On `/features` under "Communication" and `/integrations`: "Host live classes with zero external apps. Record automatically. Students join with one tap. Works with Agora and Zoom."

---

## MODULE 16: Library & Digital Learning Vault

### Why It Exists
Students need study materials — lecture notes, reference PDFs, tutorial videos. Sharing these over WhatsApp or email is unorganized. Classgrid provides a secure, searchable, role-restricted digital vault.

### How It Works
- **Upload & Categorize:** Faculty upload PDFs, PPTs, and videos to the library. Materials are tagged by subject, classroom, and academic year.
- **Access Control:** Materials are dynamically restricted by the student's position in the hierarchy. Only 3rd Year Computer Engineering students can access the "Computer Networks" vault. A 2nd Year Mechanical student cannot.
- **YouTube Embedding:** Faculty paste YouTube URLs. The system uses the YouTube Player API to embed videos inside the classroom. It tracks watch-time percentage — if a student watches more than 90%, the material is auto-marked as "Complete."
- **Video Playlists:** Materials are organized into course-wise playlists with "Continue Watching" tracking across sessions.
- **Physical Book Module:** The `IssueReturnPanel.jsx` handles tracking physical library books — issue, return, overdue alerts.

### What to Showcase on Marketing Site
On `/features` under "Learning": "A Netflix-style library for education. PDFs, videos, playlists — all role-restricted, all trackable. Know exactly who watched what."

---

## MODULE 17: Notes Marketplace

### Why It Exists
Students often create better study notes than textbooks. The Notes Marketplace allows students to upload their notes, set a price (e.g., ₹30), and other students can buy them. This creates a self-sustaining, crowdsourced study resource ecosystem.

### How It Works
- Students upload notes as PDFs. The `notes-ai.service.js` uses AI (Groq) to generate summaries and tag keywords.
- Other students browse the marketplace, read AI-generated summaries, and purchase notes via Razorpay micro-payment.
- The author earns a revenue share, motivating high-quality contributions.
- Faculty can verify and "stamp" high-quality notes, boosting their visibility.

### What to Showcase on Marketing Site
On `/features` under "Innovation": "A student-powered knowledge marketplace. Crowd-sourced notes with AI summaries. Students earn while they teach."

---

## MODULE 18: Feedback & Review System

### Why It Exists
Institutions need to know how their teachers are performing. Students are the best judges. But students fear retaliation for negative feedback. Classgrid solves this with configurable anonymous feedback.

### How It Works
- **Custom Form Builder:** Admins create feedback forms with rating scales, text fields, and multiple-choice questions via `FeedbackForm.js`.
- **Anonymous Toggle:** Forms can be set to anonymous or identified. When anonymous, even the admin cannot see individual student responses.
- **Teacher Performance Ranking:** `feedback.routes.js` (30KB) aggregates all feedback into a teacher performance score. Org Admins see institution-wide teacher rankings.
- **Platform Feedback:** Students can also submit feedback about the Classgrid platform itself (PlatformFeedback.jsx).

### What to Showcase on Marketing Site
On `/features` under "Operations": "Anonymous teacher feedback. Custom forms. Institution-wide performance rankings. Improve teaching quality with data, not guesswork."

---

## MODULE 19: Notification & Push System

### Why It Exists
Information must reach the right person at the right time. A student must know about a new assignment. A parent must know their child was absent. A teacher must know about a leave request. The notification system is the neural network of Classgrid.

### How It Works
The `notification.service.js` is a Unified Dispatcher:
1. **In-App Notifications:** Stored in MongoDB, visible in the bell icon dropdown
2. **Firebase Push (Android):** High-priority notifications via FCM with deep-link URIs. Tapping a notification opens the exact sub-page (e.g., the specific assignment)
3. **Email:** Transactional emails via Brevo (Sendinblue). The `email-templates.service.js` at 89KB contains dozens of professionally designed HTML email templates for every scenario
4. **SMS:** Critical alerts (fee due, exam schedule) via SMS provider
5. **Digest Emails:** `digest-email.service.js` compiles a weekly summary of everything a student missed

Notifications are triggered by almost every module: new assignment, quiz results, chat messages, attendance alerts, fee reminders, leave approvals, exam schedules, and more.

### What to Showcase on Marketing Site
On `/features` under "Communication": "Push notifications on their phone. Emails in their inbox. SMS for emergencies. Weekly digests for busy parents. No student ever misses an update."

---

## MODULE 20: AI Assistant & RAG Engine

### Why It Exists
Students have questions at 11 PM. Teachers aren't available. The AI Assistant provides instant, personalized academic support using the student's own platform data.

### How It Works
- **JSON-Only RAG:** The system queries MongoDB/Supabase for the student's attendance, marks, quiz performance, and viva scores. It sends this anonymized data (no PII) to GPT-4o-mini or Groq.
- **Student Persona Engine:** The AI generates a personalized profile: "You're strong in Data Structures but struggling in Mathematics. Your attendance dropped 12% this month."
- **7-Day Growth Plans:** The AI creates actionable 7-day improvement plans tailored to the student's weak areas.
- **Syllabus RAG:** Using Supabase pgvector, the system vectorizes study materials and allows students to ask questions about their syllabus content.
- **AI Quiz Generation:** Teachers provide a topic; the AI auto-generates quiz questions via `quiz-ai.service.js`.

### What to Showcase on Marketing Site
On `/features` under "AI": "An AI tutor that knows every student personally. Tracks their grades, attendance, and performance — then creates custom growth plans. Available 24/7."

---

## MODULE 21: Triple-Path Admission Engine

### Why It Exists
"Admission Week" at any college is chaos. Thousands of applicants, endless phone calls, lost documents, unclear status updates. The Admission Engine digitizes every step — from application to enrollment.

### How It Works
The engine offers three simultaneous pathways:
1. **Spot Admissions (Walk-in):** Admin fills a quick form for walk-in applicants. Fee ledger is generated instantly.
2. **Merit-List Generation:** Applicants submit their scores on a public portal. The `meritEngine.js` auto-ranks them based on configurable normalization formulas. The system publishes a public Merit List on the institute's subdomain (`institution.classgrid.in/admissions/merit`).
3. **CET/Management Quota:** For engineering colleges, admins import CET allotment data (PDF/Excel). The `CETAllotment.js` model stores imported data (EN Number, Name, Rank, Category, Branch, Seat Type). Students validate their admission via OTP.

**Parent Tracker:** Parents get a unique tracking URL. They enter an OTP and see real-time status: "Document Verification → Payment Pending → Seat Allotted." This eliminates thousands of "status?" phone calls.

**Waitlist Engine:** A cron job runs at midnight checking for expired seats. When a student doesn't pay within the deadline, they're auto-moved to waitlist and the next candidate is auto-promoted.

### What to Showcase on Marketing Site
On `/features` under "Admissions": "Three-path admission engine. Spot, Merit, and CET — all running simultaneously. Parents track status via OTP. Waitlist auto-promotes at midnight. Zero phone calls."

---

## MODULES 22-41: REMAINING MODULES (CONDENSED)

### MODULE 22: Teacher Planning Tools
Daily/weekly teaching plans with topic tracking. Faculty plan their lectures, set goals for covered vs. pending topics, and track homework assignments. The "What's on today?" widget gives a quick morning overview.

### MODULE 23: Alumni Management
Batch-wise alumni directory with communication channels. Track where graduates end up for placement statistics and institutional reputation.

### MODULE 24: Student Analytics & Performance
Composite Health Score (0-100) using weighted formula: Attendance 30% + Academics 30% + Assignments 20% + Viva 20%. AI-generated counselor summaries identify at-risk students before they fail. Per-classroom breakdowns show faculty which students need intervention.

### MODULE 25: Certificate Generation
Generate branded completion/participation/merit certificates with QR verification codes. Customizable templates per institution branding.

### MODULE 26: Events Management
Create institution-wide events (cultural fests, sports days, workshops) with calendar integration, RSVP tracking, and reminder notifications.

### MODULE 27: Holiday Management
Manage academic calendars with holiday marking. Auto-blocks attendance on holidays. Plans the academic year's working days.

### MODULE 28: HR & Biometric Payroll
GPS geofencing for faculty attendance. Integrates with physical thumb-print scanners via webhook. Auto-calculates monthly salary from punch logs with late-deduction logic. Leave balance affects payroll.

### MODULE 29: NAAC/NBA Audit & Compliance
Auto-pulls data from existing modules (attendance %, pass percentages, teacher workloads, fee collection) and generates government-compliant PDF reports via Puppeteer. Saves 4 months of manual paperwork for accreditation.

### MODULE 30: Demo & Provisioning System
Auto-generates subdomain slug from institution name. Provisions 30-day fully-unlocked sandbox. Sends Brevo email with login credentials. Background worker ensures zero-wait UI response.

### MODULE 31: Webhook & External Integrations
Receives Razorpay payment confirmations, biometric scanner data, and third-party system data via configurable webhooks.

### MODULE 32: Cron Jobs & Scheduled Tasks
Midnight attendance reconciliation. Expired demo purging (7-day grace then cascade delete). Weekly digest emails. Waitlist auto-promotion. Subscription expiry enforcement.

### MODULE 33: Forum & Discussion
Classroom discussion forums with threaded comments. Students discuss topics, ask questions, and share resources in an organized, searchable format (not a chaotic group chat).

### MODULE 34: Google Integration Suite
Import Google Classroom data. Attach Google Drive files to materials. Import Google Forms quizzes directly into the quiz engine.

### MODULE 35: Voice Messages
Record and send voice notes in chat. Groq Whisper AI auto-transcribes voice to text. "Walkie-Talkie" mode for quick faculty-to-faculty communication.

### MODULE 36: Pending Actions & Workflow Engine
Centralized dashboard showing everything that needs attention: pending join requests, pending leave approvals, pending fee verifications, pending document checks. One screen to manage the entire institution's workflow.

### MODULE 37: Student Profile Management
The 13-step onboarding wizard captures PRN, department, SSC/HSC history, profile photo, emergency contacts. PRN is locked after first entry — only Org Admin can modify. Ensures data integrity for the Result Engine.

### MODULE 38: Virtual ID & Tools
Digital student/faculty ID cards with institutional branding and QR codes. Security staff scan QR to verify identity at campus gates. The Tools page provides productivity utilities.

### MODULE 39: Organization Announcements
One-way broadcast messages from Org Admin to entire institution. Can target by role (only students) or department (only Computer Eng). Push notification + in-app notification + email.

### MODULE 40: API Metrics & Monitoring
Tracks API request counts per endpoint in `ApiMetricBucket.js`. Monitors performance degradation. Alerts SuperAdmin when specific routes are under heavy load.

### MODULE 41: Subscription & Plan Management
Manages plan tiers (demo/free/core/premium/enterprise). `module-toggle.service.js` dynamically enables/disables features per plan. Razorpay checkout integration for upgrades.

---

# ═══════════════════════════════════════════════════════════════
# SECTION B: ALL 20 MARKETING PAGES — FULL COPY & SPECS
# ═══════════════════════════════════════════════════════════════

---

## PAGE 1: HOME (`/`)

### Hero Section
**Headline:** The Operating System for Modern Education
**Sub-headline:** Stop juggling ten different apps. Classgrid is the ultimate all-in-one ERP and Learning Management System designed for colleges, schools, and coaching centers to scale effortlessly.
**CTA Buttons:** [Book a Demo] (primary, links to /#demo) | [Watch Product Tour] (secondary, links to /tour)

### Trusted By Section
A horizontally scrolling marquee of institution logos with text: "Trusted by 1,000+ forward-thinking institutions across India"

### The "Machine" Showcase
Large hero image/video showing: the Web Dashboard on a laptop screen, the Android App floating beside it on a phone mockup. Both showing the same classroom data — demonstrating cross-platform sync.

### Three Pillars Section
Three columned cards:
1. **Engineered for Colleges:** "From SGPA calculations to admission CAP round tracking, we speak your language."
2. **Optimized for Schools:** "Standards, Sections, PTAs, and report cards — all digitized."
3. **Streamlined for Coaching:** "Courses, Batches, and test series — built for competitive exam prep."

### Stats Ticker
Animated counter section: "₹50Cr+ Tuition Processed" | "1M+ Attendance Records" | "500K+ Assignments Submitted" | "99.99% Uptime"

### Module Grid
A Bento Grid showing 8-10 key modules with icons and one-liner descriptions. Each card links to `/features`.

### What's New Ticker
A floating toast/ticker at the bottom: "🔥 Live Now: AI Viva Examiner & Native Biometric Login!"

### Footer CTA
"Ready to transform your institution?" [Book a Demo] [Talk to Sales]

---

## PAGE 2: ABOUT US (`/about`)

### Headline
Our Journey: Democratizing Elite EdTech

### Body Copy
"Five years ago, we noticed a massive gap. Elite universities had access to multi-million dollar administration software — custom-built portals with real-time analytics, automated grading, and enterprise security. Meanwhile, growing schools and coaching centers were stuck with WhatsApp groups, broken Excel sheets, and disconnected fee ledgers.

We built Classgrid because we believe every educator deserves enterprise-grade infrastructure — regardless of their budget or size.

We don't just sell software. We provide the digital foundation that allows institutions to focus purely on teaching, not administration. We engineer out the chaos.

Today, Classgrid serves engineering colleges, K-12 schools, coaching centers, junior colleges, and diploma institutes — all on one unified, multi-tenant platform. From a 10-student hobby class to a 5,000-student university, the system adapts to fit."

### Team Section
Photos and bios of the founding team.

### Values Section
Three cards:
1. **Zero Data Bleed:** "Your students' data is mathematically isolated. We don't sell it. Ever."
2. **Institution-First Design:** "Your logo. Your colors. Your terminology. Students see YOUR brand."
3. **Built for Scale:** "The same architecture handles 10 students and 10,000 students."

---

## PAGE 3: FEATURES (`/features`)

### Headline
Everything you need. Nothing you don't.

### Interface
A massive Bento Grid with Shadcn Tabs to filter:
- **Tab: Academics** — Classrooms, Timetable, Assignments, Library, Results, Attendance
- **Tab: Assessments** — Online Exams (NTA-style), Quizzes, AI Viva, Test Series
- **Tab: Communication** — Real-Time Chat, Push Notifications, Announcements, Forum, Voice Messages
- **Tab: Finance** — Fee Ledger, Razorpay Payments, PDF Receipts, Split Settlements
- **Tab: Admissions** — Spot, Merit, CET, Parent Tracker, Waitlist
- **Tab: Operations** — HR/Payroll, Biometrics, Leave, Holidays, Events, Certificates
- **Tab: AI** — AI Tutor, AI Quiz Generator, AI Viva, Student Persona, RAG Engine
- **Tab: Integration** — Zoom, Agora, Google Drive, Google Classroom, Google Forms, Firebase, Razorpay

Each module card should expand on click to show a 200-word description + screenshot.

---

## PAGE 4: PRODUCT TOUR (`/tour`)

### Headline
Go Live in 5 Minutes

### Vertical Stepper (Interactive Scroll)
**Step 1: Provision Your Domain**
"Enter your institution name. We auto-generate your subdomain (`yourschool.classgrid.in`). Upload your logo. Set your brand colors. Done."

**Step 2: Define Your Academic Structure**
"Are you a school or a college? Do you have divisions or not? We ask 3 questions and configure your entire hierarchy — timetables, attendance, marks — automatically."

**Step 3: Onboard Your Campus**
"Download our CSV template. Fill in your 5,000 student records. Upload it once. Every student gets their login credentials emailed automatically."

**Step 4: Automate Everything**
"Attendance marks itself. Results calculate themselves. Fees collect themselves. You focus on teaching."

---

## PAGE 5: PRICING (`/pricing`)

### Headline
Transparent pricing that scales with your ambition.

### Three Tier Cards
| | Core | Premium | Enterprise |
|---|---|---|---|
| Price | ~₹2,000/mo | ~₹4,000/mo | Custom |
| Classrooms | ✅ | ✅ | ✅ |
| Attendance | ✅ | ✅ | ✅ |
| Timetable | ✅ | ✅ | ✅ |
| Assignments | ✅ | ✅ | ✅ |
| Results/SGPA | ❌ | ✅ | ✅ |
| Fee Management | ❌ | ✅ | ✅ |
| Real-Time Chat | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Admissions Engine | ❌ | ❌ | ✅ |
| HR/Payroll | ❌ | ❌ | ✅ |
| NAAC Auditor | ❌ | ❌ | ✅ |
| White-Label APK | ❌ | ❌ | ✅ |
| All Modules | 30-day free trial for everything |

### Callout
"Features are NOT locked by institution type. A school can buy Enterprise. A coaching center can buy Premium. Buy what you need."

---

## PAGE 6: DEMO REQUEST (`/demo`)

### Headline
See Classgrid in Action — Free for 30 Days

### Form Fields
- Institution Name (text)
- Organization Type (dropdown: Engineering, School, Junior College, Coaching, Diploma, Other)
- Administrator Name (text)
- Administrator Email (email)
- Administrator Phone (tel)
- State (dropdown)
- City (text)

### Submit Action
`POST` to `https://api.classgrid.in/api/public/request-demo`
Backend provisions sandbox → sends Brevo email with login URL and credentials

### Below Form
"Within 60 seconds, you'll receive an email with your personal dashboard login. No credit card required. No commitments."

---

## PAGES 7-9: USE CASES (`/use-cases/*`)

### `/use-cases/students`
Headline: "Your entire academic life in your pocket"
Copy: Virtual ID card, real-time SGPA tracking, assignment submission from camera, push alerts, Note Marketplace, AI Tutor, exam hall tickets — all on the Android app.

### `/use-cases/teachers`
Headline: "Reclaim your weekends"
Copy: 60-second attendance, drag-and-drop timetables, AI-graded quizzes, digital assignments, biometric payroll, teaching planners, one-click report cards.

### `/use-cases/institutes`
Headline: "Panoramic data oversight"
Copy: Fee collection dashboards, student analytics, NAAC reports, admission funnels, multi-campus management, Zero Data Bleed security.

---

## PAGE 10: INTEGRATIONS (`/integrations`)

Grid layout with logo + description for each:
- **Razorpay:** Fee collection, split settlements, webhook-driven receipts
- **Zoom:** Meeting scheduling, auto-join links in timetable
- **Agora:** Native video classes, cloud recording
- **Google Drive:** File attachment from Drive
- **Google Classroom:** Data sync and import
- **Google Forms:** Quiz import
- **Firebase:** Phone OTP + Push notifications + Deep-link routing
- **AWS S3:** Video lectures, heavy file CDN
- **Supabase:** PostgreSQL + encrypted object storage + pgvector
- **Brevo:** Transactional emails + weekly digests
- **Groq/OpenAI:** AI quiz generation, viva scoring, student persona

---

## PAGES 11-12: REVIEWS & CASE STUDIES

### `/reviews`
Testimonial carousel with institutional logos. Example:
"Managing 3,000 engineering students across 40 divisions used to require a backend team of five. From fee tracking to SGPA calculation, our legacy data was a mess. Classgrid completely eliminated administrative chaos. Our campus now runs on total autopilot." — Dr. Sharma, Principal

### `/case-studies`
Detailed deep-dive articles: "How Pacific College reduced admin overhead by 80% using Classgrid"

---

## PAGES 13-16: CONTENT & MARKETING

### `/blog` — Sanity CMS powered articles. Topics: "The Death of WhatsApp for Schools," "Paperless Campus 2026," "How AI is Changing Viva Exams"
### `/campaigns` — High-conversion landing pages for specific pain points (e.g., "Tired of chasing unpaid fees?")
### `/compare` — DataTable comparing Classgrid vs Legacy ERPs on: Cloud Native, Mobile App, API Speed, Real-Time Chat, Fee APIs
### `/changelog` — Release notes. "V2.4: Native Kotlin Auth Bridge, AI Viva Engine, Row-Level Security"

---

## PAGES 17-20: SUPPORT & LEGAL

### `/faq` — Accordion with 30+ questions covering data migration, offline access, pricing, security, API access
### `/support` — Help articles, video tutorials, support ticket submission
### `/contact` — Sales inquiry form, support email, office address
### `/terms`, `/privacy`, `/security` — Full legal text (see Part 1, Chapter 8)

---

**END OF CLASSGRID PAGES DEEP DIVE.**
This document, combined with CLASSGRID_PAGES_REFERENCE.md and CLASSGRID_DESIGN_SYSTEM.md, gives you the complete Classgrid encyclopedia. Build the Next.js site with the Classgrid design system and absolute precision.



# 🚀 CLASSGRID MARKETING SITE — BUILD PROMPT

---

> ⚠️ **CRITICAL FILE LOCATION:** The three Classgrid reference files must exist in this repository under `docs/`.
> If you cannot access them from this workspace, copy them into this project's `docs/` folder first.

You are building the **Classgrid Marketing & Acquisition Website** (`classgrid.in`).

## Step 1: Read These Three Files FIRST (Mandatory)

Before writing ANY code, you MUST read these three files in full. They are your Single Source of Truth:

1. **`docs/CLASSGRID_PAGES_REFERENCE.md`** (888 lines) — The technical architecture bible. Contains:
   - 4-pillar architecture (Backend, Dashboard, Android, Marketing)
   - All 67 backend route files, 59 database models, 34 services
   - 5-tier role system (SuperAdmin, OrgAdmin, Faculty, Student, Parent)
   - 13 academic hierarchy structure types
   - All 41 platform modules with route/model/function mapping
   - Full Privacy Policy, Terms of Service, Security Trust Center, Cookie Policy
   - Demo & Checkout API bridge specifications

2. **`docs/CLASSGRID_PAGES_DEEP_DIVE.md`** (758 lines) — The content bible. Contains:
   - 500+ word deep-dive for every major module (why it exists, how it works, what to showcase)
   - Full marketing copy for all 20 pages (headlines, sub-headlines, CTAs, section breakdowns)
   - Exact form fields for the Demo page
   - Pricing table with feature matrix
   - Testimonial copy and case study structure

3. **`docs/CLASSGRID_DESIGN_SYSTEM.md`** (100 lines) — The design system bible. Contains:
   - Morphing navigation dropdown mechanics
   - Hero section patterns (Industrial Minimalism)
   - Demo/Lead conversion page blueprint (50/50 split)
   - Information-dense footer structure (6-column grid)
   - Color palette, animation tokens, and glassmorphism specs
   - Specific application patterns for Classgrid pages

## Step 2: Initialize the Project

```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

Then install:
```bash
npm install framer-motion @splinetool/react-spline lucide-react react-hook-form zod @hookform/resolvers
npx shadcn@latest init
```

## Step 3: Build the 20 Pages

Build these pages in this exact order using the App Router (`src/app/`):

| Priority | Route | Page |
|----------|-------|------|
| 1 | `/` | Home (Hero + Social Proof + Module Grid) |
| 2 | `/features` | Features (Tabbed Bento Grid of all 41 modules) |
| 3 | `/pricing` | Pricing (3-tier comparison cards) |
| 4 | `/demo` | Demo Request (Form → POST to api.classgrid.in) |
| 5 | `/about` | About Us (Story + Team + Values) |
| 6 | `/tour` | Product Tour (Interactive stepper) |
| 7 | `/use-cases/students` | Student Use Case |
| 8 | `/use-cases/teachers` | Teacher Use Case |
| 9 | `/use-cases/institutes` | Institute Use Case |
| 10 | `/integrations` | Integrations Grid |
| 11 | `/reviews` | Testimonials |
| 12 | `/case-studies` | Case Studies |
| 13 | `/faq` | FAQ Accordion |
| 14 | `/contact` | Contact Forms |
| 15 | `/support` | Help Center |
| 16 | `/blog` | Blog (Sanity CMS placeholder) |
| 17 | `/compare` | Competitor Comparison |
| 18 | `/changelog` | Release Notes |
| 19 | `/campaigns` | Ad Landing Pages |
| 20 | `/terms` `/privacy` `/security` | Legal Pages |

## Step 4: Classgrid Design Rules

> **CRITICAL:** Follow the `CLASSGRID_DESIGN_SYSTEM.md` for ALL visual and interaction design decisions.

1. **Dark theme by default.** Pure black `#000000` background with `#0A0A0A` surface cards.
2. **Industrial Minimalism.** Clean, technical, premium feel. NOT playful, NOT colorful.
3. **Color palette:**
   - Background: `#000000` (Pure Black)
   - Surface: `#0A0A0A` (Card backgrounds)
   - Border: `#333333` (Subtle UI borders)
   - Primary Text: `#FFFFFF`
   - Secondary Text: `#888888`
   - Primary Blue: `#4a90f5` (Classgrid accent)
   - Gradient: `135deg, #4a90f5 → #8b6fff`
   - Admin Gold: `#f59e0b`
4. **Typography:** Headings = `Geist Sans` or `Inter`, Body = `Geist Sans` or `DM Sans`.
5. **Glassmorphism Header:** `backdrop-filter: blur(12px)` with `rgba(0,0,0,0.8)` background. Sticky, always visible.
6. **Morphing Navigation Dropdown:** Use Radix UI Navigation Menu + Framer Motion shared layout transitions. The dropdown "blob" morphs between menu items — it doesn't unmount/remount.
7. **Animations:**
   - Scroll reveals: `fade-in` + `slide-up` (20px-40px vertical drift)
   - Hover: Micro-interactions using `invert` effects or glowing borders
   - Hero: Perspective 3D grid receding into background OR Spline 3D cube
8. **Footer:** Information-dense 6-column grid. Show all Classgrid modules as discoverable links. Include "Classgrid Status" live indicator and 3-way theme switcher (System/Light/Dark).
9. **Demo Page:** 50/50 split layout. Left = Value Props with ROI metrics. Right = Lead form with `#0A0A0A` backgrounds and `#FFFFFF` focus borders. Social proof logo strip below hero.
10. **"NEW" Badges:** Strategic rounded-rectangle badges next to new features (AI Viva, Biometric Login, etc.)
11. **Mobile responsive.** Every page must look premium on mobile.
12. **SEO:** Proper meta tags, Open Graph, structured data on every page.

## Step 5: API Integration

The Demo form on `/demo` submits to the live backend:
```
POST https://api.classgrid.in/api/public/request-demo
Body: { institutionName, orgType, adminName, adminEmail, adminPhone, state, city }
```

The Pricing checkout redirects to Razorpay:
```
POST https://api.classgrid.in/api/public/checkout
Body: { plan, orgId, billingCycle }
```

## Step 6: Content Rules

- Use the EXACT marketing copy from `CLASSGRID_PAGES_DEEP_DIVE.md`
- Use the EXACT legal text from `CLASSGRID_PAGES_REFERENCE.md` Chapter 8
- Do NOT hallucinate features. Only mention the 41 modules documented in the reference.
- Do NOT use placeholder text like "Lorem ipsum" or "[Your Company]"
- Every feature claim must be backed by a real module from the reference

## Step 7: File Structure

```
src/
├── app/
│   ├── layout.tsx          (Root layout with Geist font + metadata)
│   ├── page.tsx            (Home)
│   ├── about/page.tsx
│   ├── features/page.tsx
│   ├── pricing/page.tsx
│   ├── demo/page.tsx
│   ├── tour/page.tsx
│   ├── use-cases/
│   │   ├── students/page.tsx
│   │   ├── teachers/page.tsx
│   │   └── institutes/page.tsx
│   ├── integrations/page.tsx
│   ├── reviews/page.tsx
│   ├── case-studies/page.tsx
│   ├── blog/page.tsx
│   ├── faq/page.tsx
│   ├── contact/page.tsx
│   ├── support/page.tsx
│   ├── compare/page.tsx
│   ├── changelog/page.tsx
│   ├── campaigns/page.tsx
│   ├── terms/page.tsx
│   ├── privacy/page.tsx
│   └── security/page.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       (Glassmorphism header with morphing dropdown)
│   │   └── Footer.tsx       (6-column information matrix + status indicator)
│   ├── sections/            (Reusable page sections)
│   └── ui/                  (Shadcn primitives)
├── lib/
│   └── utils.ts
└── styles/
    └── globals.css
```

## IMPORTANT REMINDERS
- This site has NO database. It is a static marketing site that POSTs to the existing backend.
- The "Login" button in the navbar links to `https://app.classgrid.in/login` (Project 1, the SaaS app).
- The "Book a Demo" button links to `/#demo` (the demo request form on this site).
- All module descriptions, page copy, legal text, and pricing details are in the Classgrid reference files. READ THEM.
- Follow the **CLASSGRID_DESIGN_SYSTEM.md** document for ALL visual and interaction design decisions.

**Now begin. Start with the Home page (`/`).**
