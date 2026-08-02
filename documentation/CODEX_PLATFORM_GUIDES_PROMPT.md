# Codex Prompt — Platform Guides Documentation

> **⚠️ THIS IS A SEPARATE TASK FROM API REFERENCE**
> API Reference docs are a DIFFERENT task. Do NOT write any API Reference docs.
> This prompt is ONLY for writing Platform Guides.

---

## ⛔ CRITICAL INSTRUCTIONS — READ FIRST

These docs will be published on **classgrid.in/docs** (public Vercel website).
Anyone on the internet can read them.

### DO NOT INCLUDE:
- ❌ Internal backend file names (no `auth.routes.js`, no `attendance.controller.js`)
- ❌ Internal model/field names (no `deviceFingerprint`, no `sessionToken`)
- ❌ Internal algorithms or libraries (no `bcrypt`, no `Haversine`, no `JWT_SECRET`)
- ❌ Database schema details (no MongoDB field names)
- ❌ Middleware names (no `isAuthenticated`, no `requireRole`)
- ❌ Server file paths (no `C:\CLASSGRIDPLATFORM\...`)
- ❌ Environment variable names
- ❌ Internal service/function names
- ❌ Any API endpoint paths (no `/api/attendance/mark` — that belongs in API Reference)

### DO INCLUDE:
- ✅ User-facing feature explanations (for admins, teachers, students)
- ✅ Step-by-step workflows ("How to mark attendance", "How to create a fee structure")
- ✅ Role permissions in plain English ("Only Organization Admins can configure fee structures")
- ✅ Feature descriptions, screenshots descriptions, UI flow explanations
- ✅ Tables comparing features, roles, or options

### STYLE:
- Write like Notion, Canva, or Intercom help docs
- Written for institution users, NOT developers
- Friendly, clear, step-by-step
- Use headers, bullet points, and tables
- Use generic example data (no real institution names)

---

## ⚠️ DO NOT OVERWRITE THESE FILES — THEY ALREADY EXIST:
- introduction-doc.md
- quickstart-doc.md
- rbac-login-doc.md (Login System & RBAC)
- custom-domains-doc.md
- organization-types-doc.md
- Any file starting with `api-` (those are API Reference)

---

## YOUR TASK

Read the backend at: `C:\CLASSGRIDPLATFORM\classgrid_platoform-desktop-\server\src\`

Study routes, controllers, models, and services to understand each feature.
Then write user-facing Platform Guides. Save to: `C:\classgrid_marketting\Classgrid_marketting\documentation\`

### Files to create:

1. **guide-attendance-doc.md** — Attendance System
   - How attendance is recorded (manual, code-based, GPS-based)
   - Faculty workflow: starting a session, marking students
   - Student workflow: entering attendance code
   - Attendance dashboard and reports
   - Attendance appeals
   - Who can mark, who can view, who can edit
   - Study: attendance.routes.js, attendance_dashboard.routes.js, services/attendance/

2. **guide-fees-doc.md** — Fees & Payment Management
   - Creating fee structures and categories
   - Assigning fees to students
   - Payment collection and receipts
   - Discounts and concessions
   - Overdue tracking and reminders
   - Payment gateway flow
   - Study: fees.routes.js, fee-records.routes.js, services/fees/

3. **guide-examinations-doc.md** — Examinations & Results
   - Creating and scheduling exams
   - Exam types (internal tests, online exams, viva)
   - Marks entry and grading
   - Result processing and publishing
   - Report card generation
   - Certificates
   - Study: exam.routes.js, marks.routes.js, result.routes.js, online-exam.routes.js

4. **guide-admissions-doc.md** — Admissions & Enrollment
   - Setting up admission cycles
   - Application forms and document collection
   - Merit lists and seat allocation
   - Enrollment workflow
   - Lead management
   - Study: admission.routes.js, crm.routes.js

5. **guide-academics-doc.md** — Academics & Classroom Management
   - Academic hierarchy setup
   - Creating courses and subjects
   - Classroom creation and student/faculty assignment
   - Timetable management
   - Teacher planning
   - Study: academic.routes.js, course.routes.js, classroom.routes.js, timetable.routes.js

6. **guide-communication-doc.md** — Communication & Messaging
   - Chat (1:1, group, classroom, org-wide)
   - Announcements and notices
   - Notifications (in-app, push, email)
   - Forum/discussion boards
   - Study: chat.routes.js, messaging.routes.js, notification.routes.js, forum.routes.js

7. **guide-library-doc.md** — Library Management
   - Book catalog management
   - Issue and return workflow
   - Member management
   - Overdue fines and tracking
   - Study: library.routes.js

8. **guide-assignments-doc.md** — Assignments, Notes & Quizzes
   - Creating and submitting assignments
   - Grading submissions
   - Quiz creation (basic and advanced)
   - Study notes and past papers
   - Study: assignment.routes.js, quiz.routes.js, notes.routes.js

9. **guide-leave-holidays-doc.md** — Leave & Holiday Management
   - Leave request and approval workflow
   - Holiday calendar management
   - Academic events
   - Study: leave.routes.js, holidays.routes.js, calendar.routes.js, events.routes.js

10. **guide-support-doc.md** — Support & Help Desk
    - Creating support tickets
    - Ticket lifecycle and priority
    - Communication within tickets
    - Study: support.routes.js

### Format for each guide:

```markdown
# Feature Name

Brief description of what this feature does.

## Overview
What it is, who uses it, why it matters.

## Who Can Access This
| Role | Can do |
|------|--------|
| Organization Admin | Full access, configure settings |
| Faculty | Mark attendance for their classes |
| Student | View their own records |

## How It Works
### Step 1: ...
### Step 2: ...
### Step 3: ...

## Key Features
- Feature 1
- Feature 2

## FAQ
- Common question → answer
```

Remember: These are USER guides, not developer docs. No code, no API paths, no internal details.
