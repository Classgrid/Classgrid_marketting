
Classgrid is the operating system for educational institutions: one modern platform for the academic, administrative, financial, and operational work that keeps an institution running.

Instead of making teams move between disconnected spreadsheets, legacy tools, and separate portals, Classgrid brings the institution's workflows into one coordinated system. Administrators, faculty, department teams, students, and parents can work from the same trusted data layer while using experiences designed for their responsibilities.

## What is Classgrid?

Classgrid is a unified, cloud-based ERP platform for schools, colleges, coaching institutes, junior colleges, engineering institutions, and other education organizations.

It connects the full institutional lifecycle:

- Student and faculty records.
- Admissions and enrollment.
- Academic hierarchy, courses, classrooms, and timetables.
- Attendance, assignments, communication, and learning resources.
- Fees, payments, receipts, and finance operations.
- Examinations, grading, results, and report cards.
- Staff, leave, HR, and payroll workflows.
- Library, hostel, transport, events, notices, and institution operations.
- Public institution websites and organization branding.

Classgrid is built to give decision-makers visibility, give staff practical tools for daily work, and give students and parents a simpler way to access the information they need.

## The Unified Advantage

### Replace fragmented systems with one operating view

When attendance, fees, examinations, admissions, and HR are managed in separate tools, teams spend time reconciling data instead of acting on it. A unified platform keeps the major workflows connected:

| Fragmented workflow | Unified Classgrid approach |
|---|---|
| Attendance stored in registers or isolated systems | Attendance connected to student records, classes, reports, and communication |
| Fee status checked in spreadsheets | Fee structures, payments, receipts, reminders, and reporting in one finance workflow |
| Exam marks collected manually | Exam setup, grading, result processing, and report generation in one system |
| Faculty and staff data spread across files | Centralized profiles, roles, attendance, leave, and operational records |
| Separate portals for each department | Role-aware dashboards connected to the same organization data |
| Public website managed separately from ERP data | Branded institution website and ERP experiences connected to the organization |

### One source of institutional truth

Classgrid keeps organization, user, academic, finance, and operational context connected. This reduces duplicate entry, makes reporting more consistent, and gives authorized users a clearer picture of what is happening across the institution.

### Automation where it helps

Classgrid supports repeatable workflows such as attendance capture, payment tracking, reminders, enrollment, result processing, notifications, and operational reporting. Automation reduces repetitive work while keeping the institution's staff responsible for decisions that require human judgment.

### Built for different institution types

The platform can adapt its terminology, academic hierarchy, role list, and available modules to the organization's structure. A school, junior college, engineering institution, diploma institute, and coaching organization can configure workflows that match how they operate.

## Key Modules

Module availability can depend on the organization's plan, institution type, and enabled features.

- **Student Information System (SIS):** Maintain centralized student profiles, identifiers, enrollment details, academic history, documents, and lifecycle status.

- **Academics and Classroom Management:** Organize courses, subjects, classes, academic hierarchy, assignments, study materials, meetings, and faculty workflows from one connected academic workspace.

- **Attendance and Leave:** Record attendance through supported manual, device, biometric, or location-aware workflows; review trends, manage leave requests, and connect attendance data to institutional reporting.

- **Admissions and Enrollment:** Manage enquiries, applications, document verification, merit and selection workflows, enrollment, and the transition from applicant to student account.

- **Finance and Fee Management:** Configure fee structures, track dues and payments, generate receipts, manage installments and fines, and provide finance teams with operational summaries.

- **Examinations and Grading:** Schedule examinations, manage marks and grade books, support result processing, generate report cards, and provide role-based views for faculty, administrators, and students.

- **HR and Payroll:** Maintain staff records, track staff attendance and leave, support approval workflows, and connect operational records with payroll processes where enabled.

- **Library Management:** Maintain book and resource catalogs, track issue and return activity, manage members, and calculate overdue fines through a dedicated library workflow.

- **Hostel and Transport:** Support room and hostel operations, transport routes, bus tracking, facility workflows, and related fee or student records where enabled.

- **Communication and Community:** Deliver notices, announcements, messaging, classroom communication, feedback, events, and institution-wide updates through role-aware channels.

- **Websites and Organization Management:** Configure organization branding, public website content, tenant subdomains, custom domains, and institution-facing presentation from the organization workspace.

## A Dedicated Experience for Everyone

Classgrid uses a multi-portal architecture. Each audience starts from an appropriate login experience and receives a dashboard shaped around its responsibilities. The backend still verifies the user's role and organization on every protected API request.

### Organization Admins

Organization Admins manage the institution's operating environment. Their responsibilities can include:

- Organization profile, branding, terminology, and academic configuration.
- Custom domains and the default institution subdomain.
- User invitations, role assignment, member status, and access removal.
- Admissions, fees, examinations, attendance, website, and operational settings.
- Organization-level dashboards, reports, usage, and audit activity.

The Organization Admin portal is available at:

```text
/org/login
```

### Department Staff and Leaders

Department teams work from focused portals and dashboards. Examples include:

- Admissions teams managing applications, documents, and enrollment.
- Fees teams managing fee structures, payments, and collections.
- Examination teams managing schedules, marks, and results.
- Library teams managing catalogs, issues, returns, and fines.
- HR teams managing staff workflows and payroll operations.
- Hostel and transport teams managing facilities, routes, and logistics.
- Principals, vice principals, heads of department, coordinators, counselors, and placement teams reviewing the work relevant to their role.

Department portal paths include:

```text
/dept/admissions/login
/dept/fees/login
/dept/exams/login
/dept/attendance/login
/dept/hr/login
/dept/hostel/login
/dept/library/login
```

The exact role values available for invitation are determined by the organization's configured type. Use the role list supplied by the platform instead of creating arbitrary role names.

### Faculty

Faculty can manage the teaching work assigned to them, including:

- Classrooms, subjects, courses, and teaching assignments.
- Attendance and leave workflows.
- Assignments, notes, learning resources, and classroom communication.
- Internal tests, examinations, marks, grading, and result-related tasks.
- Student progress and classroom activity within their authorized scope.

The faculty login entry point is:

```text
/faculty/login
```

### Students

Students use a focused portal to access the academic and institutional services assigned to them, including:

- Classrooms, schedules, assignments, and learning materials.
- Attendance and leave information.
- Examination schedules, marks, results, and report cards.
- Fees, receipts, notices, and institution communication.

The student login entry point is:

```text
/student/login
```

### Parents and Guardians

Parent and guardian experiences can provide visibility into a student's schedules, attendance, notices, fees, results, and communication. Access is limited to the student relationship and institution-approved features; a parent must not be able to view another student's information.

## White-Labeling at its Core

Classgrid is designed so an institution can provide a branded digital experience instead of sending users to an unfamiliar generic system.

### Organization branding

Organizations can configure supported branding elements such as:

- Institution name and short name.
- Logos and favicon.
- Primary, secondary, and theme colors.
- Site title and public-facing website content.
- Organization subdomain and custom-domain settings.

### Default institution subdomain

Each organization can use a Classgrid subdomain such as:

```text
https://institution.classgrid.in
```

The organization can manage its subdomain according to Classgrid's naming and reservation rules. This address is also an important recovery path for Organization Admin access.

### Custom ERP login domain

An institution can connect a domain it owns for the ERP login experience, for example:

```text
https://erp.example.edu
```

The domain setup uses DNS ownership verification and a routing record. After verification and deployment configuration, the domain can serve the ERP portal with the institution's branding.

### Public website domain

An institution can also connect a separate public website domain, such as:

```text
https://www.example.edu
```

The ERP login domain and website domain serve different purposes and can be managed independently.

### Role-aware access behind the brand

White-labeling changes the presentation and access address, not the security model. The same authentication, tenant matching, role checks, and organization isolation continue to protect the institution's data on the branded domain.

## Cloud-Native and Secure by Design

Classgrid is designed for managed cloud deployment and institution-scale access. Its security model combines:

- Signed, expiring JWT authentication.
- `HttpOnly` and secure cookie settings in production.
- Bearer-token support for authenticated API clients.
- Password hashing with bcrypt.
- Failed-login tracking and temporary account locks.
- New-device email OTP verification where required.
- Organization and tenant matching.
- Server-side role checks on protected routes.
- Account, organization, maintenance, and security-lock checks.
- Audit events for important administrative actions.

Security also depends on how each institution operates the platform. Keep administrator accounts protected, assign the least privilege needed, remove former staff promptly, and never share passwords, activation links, OTPs, or session tokens.

## Getting Started

### For institution decision-makers

Start by mapping your current workflows:

1. Identify the systems currently used for students, attendance, fees, exams, HR, admissions, and communication.
2. Decide which departments and user groups need access first.
3. Confirm the organization structure, terminology, and academic hierarchy.
4. Select the modules required for the first rollout.
5. Assign an Organization Admin responsible for configuration and access governance.

### For IT administrators

Prepare the following before onboarding users:

- Organization details and branding assets.
- Staff and student data that must be migrated or imported.
- Role and department assignments.
- DNS access if you will configure a custom ERP or website domain.
- Email delivery and support contacts.
- A communication plan for login URLs and first-time password setup.

### Recommended documentation path

Continue with the documentation that matches your next task:

- [Quickstart](/docs/quickstart) for the initial organization setup.
- [Setup Guide](/docs/setup) for configuration and onboarding.
- [Login and RBAC](/docs/rbac-login) for portals, roles, and authentication.
- [Custom Domains](/docs/custom-domains) for branded ERP and website addresses.

## Next Steps

Classgrid works best when the institution starts with a clear operating model and expands in stages. Begin with the organization profile, users, roles, academic structure, and core student workflows. Then connect finance, admissions, examinations, HR, library, hostel, transport, communication, and website features according to institutional priorities.

When your team is ready, open the Quickstart or Setup guide, invite the first authorized staff members, and establish the role and data-governance practices that will keep the platform reliable as usage grows.

