# Codex Prompt — API Reference Documentation

> **⚠️ THIS IS A SEPARATE TASK FROM PLATFORM GUIDES**
> Platform Guides are ALREADY DONE. Do NOT touch them.
> This prompt is ONLY for writing API Reference docs.

---

## ⛔ CRITICAL INSTRUCTIONS — READ FIRST

These docs will be published on **classgrid.in/docs** (public Vercel website).
Anyone on the internet can read them.

### DO NOT INCLUDE:
- ❌ Internal backend file names (no `auth.routes.js`, no `attendance.controller.js`)
- ❌ Internal model/field names (no `deviceFingerprint`, no `sessionToken`, no `organizationId`)
- ❌ Internal algorithms or libraries (no `bcrypt`, no `Haversine`, no `JWT_SECRET`)
- ❌ Database schema details (no MongoDB field names, no schema structures)
- ❌ Middleware names (no `isAuthenticated`, no `requireRole`)
- ❌ Server file paths (no `C:\CLASSGRIDPLATFORM\...`)
- ❌ Environment variable names (no `.env` references)
- ❌ Internal service/function names

### DO INCLUDE:
- ✅ Clean, public-facing API endpoint documentation
- ✅ HTTP method + clean path (e.g. `POST /api/auth/login`)
- ✅ Request parameters described in plain English
- ✅ Response format (clean JSON examples with generic field names)
- ✅ Authentication requirements described simply ("Requires authentication" or "Public")
- ✅ Role requirements described simply ("Admin only", "Faculty and above")
- ✅ Error responses described simply (status codes + user-friendly messages)

### STYLE:
- Write like Stripe, Twilio, or Supabase API docs
- Professional, clean, developer-friendly
- Use tables for parameters
- Use code blocks for JSON examples
- Use generic example data (no real institution names or emails)

---

## ⚠️ DO NOT OVERWRITE THESE FILES — THEY ALREADY EXIST:
- introduction-doc.md
- quickstart-doc.md
- rbac-login-doc.md
- custom-domains-doc.md
- organization-types-doc.md
- guide-attendance-doc.md
- guide-fees-doc.md
- guide-examinations-doc.md
- guide-admissions-doc.md
- guide-academics-doc.md
- guide-communication-doc.md
- guide-library-doc.md
- guide-assignments-doc.md
- guide-leave-holidays-doc.md
- guide-support-doc.md

---

## YOUR TASK

Read the backend at: `C:\CLASSGRIDPLATFORM\classgrid_platoform-desktop-\server\src\`

Study all 90 route files in `routes/` and their corresponding controllers.

Write API Reference docs. Save to: `C:\classgrid_marketting\Classgrid_marketting\documentation\`

### Files to create:

1. **api-auth-doc.md** — Authentication API
   - Login, logout, password reset, email check, device verification, Google SSO
   - Study: auth.routes.js, google.routes.js

2. **api-organization-doc.md** — Organization API
   - Org profile, settings, members, invitations, branding, domains
   - Study: org.routes.js, organization.routes.js, admin.routes.js, hierarchy.routes.js

3. **api-students-doc.md** — Students & Users API
   - Student profiles, user management, role management
   - Study: student.routes.js, student-profile.routes.js, user.routes.js, faculty.routes.js

4. **api-attendance-doc.md** — Attendance API
   - Mark attendance, sessions, dashboards, appeals
   - Study: attendance.routes.js, attendance_dashboard.routes.js

5. **api-fees-doc.md** — Fees & Billing API
   - Fee structures, payments, invoices, transactions
   - Study: fees.routes.js, fee-records.routes.js, billing-checkout.routes.js, billing-handoff.routes.js

6. **api-exams-doc.md** — Exams & Results API
   - Exams, marks, results, online exams, certificates
   - Study: exam.routes.js, examination.routes.js, examinations.routes.js, marks.routes.js, result.routes.js, online-exam.routes.js, certificate.routes.js

7. **api-academics-doc.md** — Academics API
   - Courses, classrooms, timetables, academic hierarchy
   - Study: academic.routes.js, course.routes.js, classroom.routes.js, timetable.routes.js

8. **api-communication-doc.md** — Communication API
   - Chat, messaging, notifications, push, forums
   - Study: chat.routes.js, messaging.routes.js, notification.routes.js, push.routes.js, forum.routes.js

9. **api-admissions-doc.md** — Admissions API
   - Applications, documents, enrollment, CRM
   - Study: admission.routes.js, crm.routes.js

10. **api-library-doc.md** — Library API
    - Books, issue/return, members, fines
    - Study: library.routes.js

### Format for each endpoint:

```
### POST /api/auth/login

Authenticates a user and returns a session token.

**Authentication:** Not required

**Request Body:**

| Parameter | Type   | Required | Description          |
|-----------|--------|----------|----------------------|
| email     | string | Yes      | User's email address |
| password  | string | Yes      | User's password      |

**Success Response (200):**
{json example with generic data}

**Error Responses:**
| Status | Description              |
|--------|--------------------------|
| 401    | Invalid credentials      |
| 403    | Account locked           |
```

Remember: NO internal backend details. Public-facing developer docs only.
