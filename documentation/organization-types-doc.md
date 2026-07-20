---
type: helpArticle
title: "Organization Types, Academic Structure, Terminology, and Portals"
slug: organization-types-academic-structure
category: "I am an Admin"
subCategory: "Organization Setup"
summary: "A complete reference for choosing a Classgrid organization type, configuring its academic hierarchy, understanding dynamic terminology, assigning roles, and using tenant portal URLs."
---

Classgrid adapts its academic structure, labels, admissions, attendance, fees, examinations, library behavior, roles, and dashboards to the institution selected during onboarding.

This guide is the central reference for:

- Organization types and academic-structure plans.
- Division and no-division variants.
- Dynamic terminology used throughout the platform.
- Admissions, attendance, fees, examination, and library behavior.
- Staff roles and portal login URLs.
- Tenant subdomains and custom domains.
- API contracts that adaptive interfaces must follow.

All examples are generic. Replace `{org-slug}` with the organization’s actual Classgrid slug only when configuring a real tenant.

> Important: an academic hierarchy plan is not a billing plan. Plan 1 through Plan 7 describe how academic data is organized. Subscription state, purchased modules, and feature flags separately determine which paid features are available.

## 1. The three organization settings that control behavior

Classgrid uses three related settings. They must not be treated as interchangeable.

| Setting | Purpose | Examples | Rule |
|---|---|---|---|
| `org_type` | Identifies the institution family | `engineering`, `school`, `coaching` | Selected during onboarding and not changeable through normal organization settings |
| `structure_type` | Selects the academic hierarchy layout | `engineering_with_div`, `school_no_div` | Must match the institution and be finalized before academic records are added |
| `division_mode` | Controls whether divisions or sections are visible | `with_divisions`, `without_divisions` | No-division structures still retain a hidden default division for storage compatibility |
| `allow_sub_batches` | Enables optional splitting below a division | `true` or `false` | Relevant to engineering, junior college, and diploma structures |

Changing an established academic structure after students, classrooms, attendance, fees, or results exist is a data migration, not a label change. Contact Classgrid support before attempting such a change.

## 2. Master organization-type matrix

This is the quickest complete comparison of the supported institution families.

| Organization type | Academic plan | Supported structure keys | Main visible hierarchy | Learner identifier | Educator label | Academic period | Admission model | Fee basis | Result model | Default profile modules |
|---|---:|---|---|---|---|---|---|---|---|---|
| Engineering | 1 | `engineering`, `engineering_with_div`, `engineering_no_div` | Degree -> Department -> Year -> Semester -> Division -> optional Lab Batch | PRN | Faculty | Semester | CET/CAP pipeline and desk entry | Academic year and semester | SGPA/CGPA with credits and backlogs | Admissions, Fees, Attendance, Examinations, Library, Compliance, Placements |
| School | 2 or 3 | `school_with_div`, `school_no_div` | Standard -> Section, or Standard only | Roll No | Teacher | Term | Direct school admission with merit/capacity rules | Academic year, term, or monthly | Term report using percentage or grades | Admissions, Fees, Attendance, Examinations, Library, Transport |
| Coaching | 4 | `coaching` | Course -> Batch | Enrollment No | Mentor | Target year; optional shared Phase label | Direct, fast-track, first-come-first-served enrollment | Course, batch, monthly, or installment | Rank, percentile, and test analysis | Admissions, Fees, Attendance, Examinations, CRM |
| Junior College | 5 | `junior_college`, `junior_college_with_div`, `junior_college_no_div` | Stream -> Standard -> Division -> optional Batch | Roll No | Lecturer | Term | Direct admission using 10th-standard merit and rounds | Academic year, term, or monthly | Stream and term marks, percentage, and rank | Admissions, Fees, Attendance, Examinations, Library |
| Diploma / Polytechnic | 6 | `diploma`, `diploma_with_div`, `diploma_no_div` | Department -> Year -> Semester -> Division -> optional Lab Batch | Enrollment No | Faculty | Semester | CET/CAP-style pipeline and desk entry | Academic year and semester | Semester grade report with credits and backlogs | Admissions, Fees, Attendance, Examinations, Library |
| Other / Custom | 7 | `custom` | Group -> Sub-Group | ID | Instructor | Phase | Admin-defined direct workflow | Configuration-specific | Assessment-specific | Requires Classgrid-assisted configuration |

The “Default profile modules” column describes the institution profile. Actual access can be further restricted by subscription state, purchased modules, feature flags, and user permissions.

## 3. Every accepted structure type

The platform accepts the following `structure_type` values.

| Structure key | Institution family | Division behavior | Recommended use |
|---|---|---|---|
| `engineering` | Engineering | Legacy behavior controlled by `division_mode` | Existing tenants only |
| `engineering_with_div` | Engineering | Visible divisions | New engineering tenant with A/B/C divisions |
| `engineering_no_div` | Engineering | Hidden default division | New engineering tenant without visible divisions |
| `school_with_div` | School | Visible sections | School with sections such as A/B/C |
| `school_no_div` | School | Hidden default division | School with one group per standard |
| `coaching` | Coaching | Native batches, not academic divisions | Coaching institute organized by course and batch |
| `junior_college` | Junior College | Legacy behavior controlled by `division_mode` | Existing tenants only |
| `junior_college_with_div` | Junior College | Visible divisions | Junior college with A/B divisions |
| `junior_college_no_div` | Junior College | Hidden default division | Junior college without visible divisions |
| `diploma` | Diploma | Legacy behavior controlled by `division_mode` | Existing tenants only |
| `diploma_with_div` | Diploma | Visible divisions | Polytechnic with A/B divisions |
| `diploma_no_div` | Diploma | Hidden default division | Polytechnic without visible divisions |
| `custom` | Other | Custom grouping | Special deployments configured with Classgrid |

For new tenants, use an explicit `_with_div` or `_no_div` structure instead of a legacy structure whenever that choice exists.

## 4. How division and no-division plans work

### With divisions

The division or section appears in the interface and users explicitly select it.

Examples:

- Engineering: Degree -> Department -> Year -> Semester -> Division.
- School: Standard -> Section.
- Junior College: Stream -> Standard -> Division.
- Diploma: Department -> Year -> Semester -> Division.

### Without divisions

The interface hides the division step, but the backend automatically creates a `Default` division.

This preserves a consistent storage relationship for:

- Classroom membership.
- Attendance scope.
- Fee structures.
- Examination records.
- Reports and promotions.

The hidden node must not be shown to end users as a real division. Adaptive interfaces should use the visible hierarchy from the institution profile and the storage hierarchy only when persisting records.

### Sub-batches

Sub-batches are optional and are controlled by `allow_sub_batches`.

| Institution family | Sub-batch meaning | Typical parent | Availability |
|---|---|---|---|
| Engineering | Lab Batch | Division | Optional |
| Junior College | Batch | Division | Optional |
| Diploma | Lab Batch | Division | Optional |
| School | Not used | — | Blocked |
| Coaching | Uses native Batch nodes instead | Course | Always part of the coaching structure |

## 5. Complete terminology reference

Classgrid labels must come from the active institution’s terminology profile. Do not hardcode college-specific words into reusable interfaces.

| Concept | Engineering | School | Coaching | Junior College | Diploma | Custom |
|---|---|---|---|---|---|---|
| Organization label | College | School | Institute | Junior College | Polytechnic | Organization |
| Top level | Degree | Standard | Course | Stream | Department | Group |
| Program/course label | Branch | Class | Course | Stream | Branch | Program |
| Subject label | Course | Subject | Topic | Subject | Course | Course |
| Subject code | Course Code | Subject Code | Topic Code | Subject Code | Course Code | Course Code |
| Year label | Year | Class | Year | Standard | Year | Level |
| Period label | Semester | Term | Phase | Term | Semester | Phase |
| Division label | Division | Section | Batch | Division | Division | Group |
| Sub-batch label | Lab Batch | — | — | Batch | Lab Batch | Sub-Group |
| Learner ID | PRN | Roll No | Enrollment No | Roll No | Enrollment No | ID |
| Full learner ID label | Permanent Registration Number | Roll Number | Enrollment Number | Roll Number | Enrollment Number | Identifier |
| Educator | Faculty | Teacher | Mentor | Lecturer | Faculty | Instructor |
| Classroom | Classroom | Classroom | Classroom | Classroom | Classroom | Group |
| Add learner action | Register Student | Add Student | Enroll Student | Add Student | Register Student | Add Member |
| Add educator action | Add Faculty | Add Teacher | Add Mentor | Add Lecturer | Add Faculty | Add Instructor |
| Assignment | Assignment | Homework | Practice Set | Assignment | Assignment | Task |
| Examination | Examination | Test | Mock Test | Examination | Examination | Assessment |
| Educator ID card | Faculty Identity Card | Teacher Identity Card | Mentor Identity Card | Lecturer Identity Card | Faculty Identity Card | Instructor Identity Card |
| Learner ID card | Student Identity Card | Student Identity Card | Student Identity Card | Student Identity Card | Student Identity Card | Member Identity Card |
| Forum | Forum & Discussion | Student & Parent Board | Doubt Forum | Discussion Forum | Forum & Discussion | Discussion Board |
| Communication | Student Communication | Parent Communication | Student Communication | Student Communication | Student Communication | Member Communication |

### Coaching terminology clarification

The core coaching hierarchy is `Course -> Batch`. Shared screens may also use `Target Year` or `Phase` as metadata labels. These values must not be treated as required academic hierarchy nodes unless the tenant has been explicitly configured that way.

### Terminology API rule

Use:

```http
GET /api/hierarchy/terminology
```

The response includes the tenant’s `org_type`, `structure_type`, and terminology dictionary.

Comparison interfaces can use:

```http
GET /api/hierarchy/terminology/all
```

The comparison response covers Engineering, School, Coaching, Junior College, and Diploma. The active-tenant endpoint remains authoritative for exact variants and custom configurations.

## 6. Academic hierarchy by organization type

### Engineering

With divisions:

```text
Degree -> Department -> Year -> Semester -> Division -> optional Lab Batch
```

Without divisions:

```text
Degree -> Department -> Year -> Semester
```

Storage still includes a hidden default division. Engineering supports up to eight semesters in the standard institution profile and year labels such as FY, SY, TY, and Final Year.

### School

With sections:

```text
Standard -> Section
```

Without sections:

```text
Standard
```

Storage still includes a hidden default division. Terms belong to the academic-session profile; they are not separate hierarchy nodes in the standard school tree.

### Coaching

```text
Course -> Batch
```

Coaching does not use academic divisions or semesters. A target year can be stored as learner or course metadata.

### Junior College

With divisions:

```text
Stream -> Standard -> Division -> optional Batch
```

Without divisions:

```text
Stream -> Standard -> optional Batch
```

Storage includes a hidden default division for no-division plans. Standard values are normally restricted to 11th and 12th.

### Diploma / Polytechnic

With divisions:

```text
Department -> Year -> Semester -> Division -> optional Lab Batch
```

Without divisions:

```text
Department -> Year -> Semester
```

Storage includes a hidden default division. The standard profile supports six semesters and FY, SY, and TY year labels.

### Other / Custom

```text
Group -> Sub-Group
```

Custom organizations require assisted configuration before production use because generic module behavior may otherwise fall back to a standard institution profile.

## 7. Hierarchy node rules

Every academic level is represented as a hierarchy node.

| Field | Purpose |
|---|---|
| `organization_id` | Tenant ownership boundary |
| `level_type` | Node kind such as degree, standard, course, or batch |
| `name` | Display name |
| `code` | Short reporting or timetable code |
| `parent_id` | Parent node; empty only for a root node |
| `sort_order` | Order among sibling nodes |
| `is_sub_batch` | Marks a lab or practical split |
| `sub_batch_capacity` | Optional maximum learners in the sub-batch |
| `academic_year` | Optional academic-year association |
| `student_count` | Denormalized learner count for dashboards |
| `is_active` | Soft-deletion state |

Rules:

- Every node belongs to exactly one organization.
- Parent nodes must belong to the same organization.
- Duplicate names under the same parent are rejected.
- Deleting a node soft-deletes its descendants.
- A sub-batch must be created below a division.
- Sub-batches require `allow_sub_batches: true`.
- No-division plans automatically create a hidden `Default` division.
- Seed operations are one-time and reject an already populated hierarchy.

## 8. Learner record requirements

Every learner profile contains a system ID, name, and email. Placement and identifier fields then adapt by organization type.

| Organization type | Primary identifier | Required placement | Optional or special fields |
|---|---|---|---|
| Engineering | PRN | Department, Branch, Academic Year, Year, Semester, and visible Division when enabled | Degree, Lab Batch, ABC ID, category, admission type, anti-ragging reference |
| School | Roll No | Standard, Academic Year, and visible Section when enabled | Term |
| Coaching | Enrollment No | Course and Batch | Target Year, current school/college, Standard |
| Junior College | Roll No | Stream, Standard, Academic Year, and visible Division when enabled | Term, optional Batch |
| Diploma | Enrollment No | Department, Academic Year, Year, Semester, and visible Division when enabled | Lab Batch, ABC ID, category, admission type |

Staff assignment behavior also adapts:

- School uses a Class Teacher as the primary owner.
- Engineering, Junior College, and Diploma use Class Teacher or Faculty Mentor ownership.
- Coaching uses a Mentor scoped to a batch.
- No-division plans scope class ownership to the hidden default division.

## 9. Admission behavior

Admissions use the organization structure to select authentication, ranking, seat, entry, and workflow rules.

| Organization type | Applicant authentication | Ranking | Seat types | Entry modes | Workflow | Export/support features |
|---|---|---|---|---|---|---|
| Engineering | Entrance-application number plus OTP | CAP round | CAP, Institutional, Management, Spot | CET import or Desk | CET pipeline | DTE/AICTE exports, reporting-letter support, CAP upgrade |
| School | Phone OTP | Previous merit percentage | General, RTE, Management | Portal or Desk | Standard | Printout and school-system export |
| Coaching | Phone OTP | First come, first served | Regular, Discount, Early Bird | Portal or Desk | Fast track | No government export by default |
| Junior College | Phone OTP | 10th-standard merit | CAP, Management, Minority | Portal or Desk | Standard | Printout and state-board export |
| Diploma | Entrance-application number plus OTP | CAP round | CAP, Institutional, Management | CET import or Desk | CET pipeline | DTE export, reporting-letter support, CAP upgrade |
| Custom | Phone OTP | Admin defined | General | Portal or Desk | Fast track | Configured per deployment |

### Default admission information

| Organization type | Default information emphasis | Default documents |
|---|---|---|
| Engineering | Identity, contact, parent, demographic, address, guardian, academic IDs, entrance scores, seat and branch allotment | Allotment letter, 12th marksheet, identity document, category/income/domicile documents where applicable, photo, anti-ragging document |
| School | Identity, parents, address, category, previous school, previous percentage, standard requested | Transfer certificate, birth certificate, identity document, previous academic records, category document where applicable, photo |
| Coaching | Identity, contact, address, previous percentage, selected course and preferred batch | Identity document, photo, 10th marksheet |
| Junior College | Identity, family, demographics, addresses, guardian, academic IDs, 10th marks, stream requested | 10th marksheet, transfer certificate, identity document, category/income/domicile documents where applicable, photo |
| Diploma | Identity, contact, address, entrance number, 10th details, seat type, allotted branch | Allotment letter, 10th marksheet, identity document, category/income documents where applicable |

Organization Admins can customize admission fields and documents through the form builder. Defaults are starting points, not permanent restrictions.

## 10. Attendance behavior

All standard attendance profiles support live-code marking, faculty quick marking, manual override, student self-marking where enabled, GPS controls, holiday guards, appeals, and suspicious-attendance review. The default minimum percentage is 75 unless the tenant configures another value.

| Organization type | Recording unit | Session types | Scope | Reporting periods | Special behavior |
|---|---|---|---|---|---|
| Engineering | Lecture, practical, or lab | Lecture, practical, lab, tutorial | Degree through Semester, Division, optional Lab Batch | Day, week, month, semester, academic year | Faculty-wise analytics and defaulter list |
| School | Day or period | Day, period, activity | Standard and visible Section | Day, week, month, term, academic year | Class Teacher and Subject Teacher ownership |
| Coaching | Session | Class, test, doubt session, counselling | Course and Batch | Day, week, month, target year | Mentor ownership; no default defaulter list |
| Junior College | Lecture or practical | Lecture, practical, tutorial, activity | Stream, Standard, Division, optional Batch | Day, week, month, term, academic year | Entrance-batch attendance support |
| Diploma | Lecture, practical, or lab | Lecture, practical, lab, tutorial | Department through Semester, Division, optional Lab Batch | Day, week, month, semester, academic year | Faculty-wise analytics and defaulter list |

## 11. Fee behavior

Common capabilities include fee structures, ledgers, installments, concessions, online and manual payments, reminders, receipts, and admission-fee linking.

| Organization type | Fee label | Billing basis | Billing periods | Typical components | Scholarship/CAP behavior |
|---|---|---|---|---|---|
| Engineering | College Fee | Academic year and semester | Annual, semester, installment | Tuition, development, exam, lab, library, hostel, transport | Category scholarships and CAP-round fees supported |
| School | School Fee | Academic year or term | Annual, term, monthly | Tuition, admission, exam, transport, activity, library | Category scholarship behavior off by default |
| Coaching | Course Fee | Course or batch | Course, monthly, installment | Registration, course, test series, materials, counselling | CAP fees and category scholarships off by default |
| Junior College | Junior College Fee | Academic year or term | Annual, term, monthly | Tuition, admission, exam, practical, library, entrance batch | Category scholarships supported |
| Diploma | Diploma Fee | Academic year and semester | Annual, semester, installment | Tuition, development, exam, lab, library, transport | Category scholarships supported; CAP-round fee behavior off by default |

## 12. Examination and result behavior

All standard profiles support offline and online exams, internal tests, question banks, timetables, result publishing, proctoring, and analytics when the corresponding modules are enabled.

| Organization type | Main exam label | Assessment types | Result model | Credits | Backlogs | Hall ticket |
|---|---|---|---|---:|---:|---:|
| Engineering | Semester Exam | Internal, external, end-semester, practical, lab, viva | SGPA/CGPA and credit grade points | Yes | Yes | Yes |
| School | Exam/Test | Unit test, term exam, annual exam, oral, practical | Term report with percentage or grade | No | No | Yes |
| Coaching | Test/Mock Test | Topic, chapter, mock, full-length, doubt test | Marks, rank, and percentile analysis | No | No | No by default |
| Junior College | Examination | Unit test, term exam, prelim, board practical, entrance mock | Stream term report with marks, percentage, and rank | No | No | Yes |
| Diploma | Semester Exam | Internal, external, end-semester, practical, lab, viva | Semester grade report and credit grade points | Yes | Yes | Yes |

## 13. Library behavior

| Organization type | Physical library | Digital/content library | Typical collections |
|---|---:|---:|---|
| Engineering | Yes | Yes | Textbooks, references, journals, lab manuals, project reports, digital resources |
| School | Yes | Yes | Textbooks, references, stories, activities, digital resources |
| Coaching | No by default | Yes | Course videos, test solutions, study materials, digital resources |
| Junior College | Yes | Yes | Textbooks, references, competitive-exam resources, practical manuals, digital resources |
| Diploma | Yes | Yes | Textbooks, references, lab manuals, project reports, digital resources |

Physical-library profiles include cataloguing, circulation, reservations, and overdue fines. Availability still depends on module entitlement.

## 14. Module availability matrix

| Module | Engineering | School | Coaching | Junior College | Diploma | Notes |
|---|---:|---:|---:|---:|---:|---|
| Organization Dashboard | Yes | Yes | Yes | Yes | Yes | Common route |
| Admissions | Yes | Yes | Yes | Yes | Yes | Workflow changes by type |
| Fees | Yes | Yes | Yes | Yes | Yes | Billing basis changes by type |
| Attendance | Yes | Yes | Yes | Yes | Yes | Session and scope change by type |
| Examinations | Yes | Yes | Yes | Yes | Yes | Result model changes by type |
| Physical Library | Yes | Yes | No by default | Yes | Yes | Coaching uses a content library profile |
| Transport | Optional | Profile default | Optional | Optional | Optional | Controlled by enabled modules and feature flags |
| HR & Payroll | Optional | Optional | Optional | Optional | Optional | Common route; entitlement required |
| Hostel | Optional | Optional | Optional | Optional | Optional | Entitlement required |
| Compliance | Profile default | Optional | Optional | Optional | Optional | Engineering profile includes compliance |
| Placements | Profile default | Optional | Optional | Optional | Optional | Engineering profile includes placements |
| CRM | Optional | Optional | Profile default | Optional | Optional | Coaching profile includes CRM |
| Custom Domain | Optional | Optional | Optional | Optional | Optional | Requires the custom-domain module |
| AI Assistant | Optional | Optional | Optional | Optional | Optional | Controlled separately by feature flag |

“Yes” means the organization profile supports the module. It does not override subscription, feature-flag, or role checks.

## 15. Roles by organization type

All standard organization types support learners, educators, and an Organization Admin. Additional leadership and department roles vary.

| Role | Engineering | School | Coaching | Junior College | Diploma |
|---|---:|---:|---:|---:|---:|
| Student | Yes | Yes | Yes | Yes | Yes |
| Teacher/Faculty educator role | Faculty | Teacher | Mentor | Lecturer | Faculty |
| Organization Admin | Yes | Yes | Yes | Yes | Yes |
| Principal | Yes | Yes | No | Yes | Yes |
| Vice Principal | Yes | Yes | No | Yes | Yes |
| Head of Department | Yes | No | Yes | Yes | Yes |
| Academic Coordinator | Yes | Yes | Yes | Yes | Yes |
| Examination Controller | Yes | Yes | No | Yes | Yes |
| Fees & Accounts Manager | Yes | Yes | Yes | Yes | Yes |
| Library Manager | Yes | Yes | No by default | Yes | Yes |
| Transport Manager | Yes | Yes | No by default | Yes | Yes |
| Student Counselor | Yes | Yes | Yes | Yes | Yes |
| Training & Placement Officer | Yes | No | No | No | Yes |
| Admissions Head | Yes | Yes | Yes | Yes | Yes |
| Admissions Counselor | Yes | Yes | Yes | Yes | Yes |
| Admissions Verifier | Yes | Yes | No by default | Yes | Yes |
| Admissions Clerk | Yes | Yes | Yes | Yes | Yes |

Role keys remain stable even when labels change. For example, the same educator capability may be displayed as Teacher, Faculty, Lecturer, or Mentor.

Use the role API instead of maintaining a frontend copy:

```http
GET /api/hierarchy/roles
GET /api/hierarchy/roles?invitable=true
```

## 16. Default tenant URL and portal links

Every tenant receives a default Classgrid URL:

```text
https://{org-slug}.classgrid.in
```

The same portal paths work on an enabled custom ERP domain.

| Portal | Generic URL | Intended audience |
|---|---|---|
| Organization Admin | `https://{org-slug}.classgrid.in/org/login` | Organization Admin and institution leadership |
| Student | `https://{org-slug}.classgrid.in/student/login` | Students/learners |
| Faculty | `https://{org-slug}.classgrid.in/faculty/login` | Teachers, faculty, lecturers, and mentors |
| Admissions | `https://{org-slug}.classgrid.in/dept/admissions/login` | Admissions roles |
| Fees | `https://{org-slug}.classgrid.in/dept/fees/login` | Fee Manager and accounts roles |
| Examinations | `https://{org-slug}.classgrid.in/dept/exams/login` | Examination Controller and authorized staff |
| Attendance | `https://{org-slug}.classgrid.in/dept/attendance/login` | Authorized attendance staff |
| HR & Payroll | `https://{org-slug}.classgrid.in/dept/hr/login` | HR users when enabled |
| Hostel & Transport | `https://{org-slug}.classgrid.in/dept/hostel/login` | Hostel and transport users when enabled |
| Library | `https://{org-slug}.classgrid.in/dept/library/login` | Library Manager and authorized staff |

A login URL does not grant permission. The authenticated role and organization membership determine the destination and allowed actions.

## 17. Subdomain rules

The organization slug:

- Must be between 3 and 30 characters.
- Can contain lowercase letters, numbers, and hyphens.
- Cannot start or end with a hyphen.
- Must be unique.
- Cannot use reserved system names such as `www`, `app`, `api`, `admin`, `superadmin`, `docs`, `help`, `support`, `status`, `demo`, or `dashboard`.

Changing a tenant slug changes every default Classgrid portal link. Existing bookmarks and shared links must be updated.

Relevant Organization Admin endpoints:

```http
GET   /api/org-admin/subdomain
GET   /api/org-admin/subdomain/check?slug={candidate}
PATCH /api/org-admin/subdomain
```

## 18. Custom domains

Classgrid distinguishes two domain purposes:

- ERP domain: custom host for application and portal access.
- Public custom domain: custom host for the institution’s public website experience.

Domain states include pending verification, verified, active, and failed. Verification can include TXT ownership validation, CNAME or A-record validation, and SSL provisioning.

Safety rules:

- Keep the default `{org-slug}.classgrid.in` URL enabled until the custom ERP domain is verified and tested.
- Save the Organization Admin emergency URL before disabling the default URL.
- If the default URL is disabled and custom DNS fails, users can lose portal access.
- A custom domain must be unique across all tenants.
- Disabling a custom domain does not delete the tenant or its records.

Relevant endpoints:

```http
GET    /api/org-admin/custom-domain
POST   /api/org-admin/custom-domain
POST   /api/org-admin/custom-domain/verify
PATCH  /api/org-admin/custom-domain/settings
DELETE /api/org-admin/custom-domain
```

## 19. Organization codes

Organization Admins can retrieve three organization identifiers:

| Value | Purpose |
|---|---|
| Tenant ID | Internal organization identifier used for support and integrations |
| Faculty Join Code | Secure code used in supported faculty/staff onboarding flows |
| Student Honor Code | Secure code used in supported student joining flows |

Use:

```http
GET /api/org-admin/join-codes
```

Treat join codes as sensitive onboarding credentials. Do not publish them in public documentation, screenshots, or unrestricted channels.

## 20. Institution profile API

Adaptive module behavior should begin with:

```http
GET /api/org-admin/institution-profile
```

The profile includes:

- Normalized organization and structure type.
- Visible and storage hierarchies.
- Dynamic terminology and level labels.
- Division and sub-batch capabilities.
- Academic-session and semester profiles.
- Learner-record fields.
- Staff-assignment rules.
- Admissions profile.
- Attendance profile.
- Fee profile.
- Examination profile.
- Library profile.
- Enabled-module hints and module routes.

Module-specific profile endpoints include:

```http
GET /api/admission/institution-profile
GET /api/fees/institution-profile
GET /api/attendance/institution-profile
GET /api/examinations/institution-profile
GET /api/library/institution-profile
GET /api/payroll/institution-profile
```

## 21. Hierarchy API reference

All hierarchy operations require authentication and tenant context.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/hierarchy/tree` | Return the active hierarchy as a nested tree |
| `GET` | `/api/hierarchy/tree?flat=true` | Return hierarchy nodes as a flat list |
| `GET` | `/api/hierarchy/children/:parentId` | Return direct children of one node |
| `GET` | `/api/hierarchy/terminology` | Return active-tenant labels |
| `GET` | `/api/hierarchy/terminology/all` | Return the standard comparison matrix |
| `GET` | `/api/hierarchy/roles` | Return organization-compatible roles |
| `POST` | `/api/hierarchy/node` | Create a validated hierarchy node |
| `POST` | `/api/hierarchy/seed` | Seed a new tenant’s initial hierarchy once |
| `PATCH` | `/api/hierarchy/node/:nodeId` | Rename, recode, reorder, activate, or deactivate a node |
| `DELETE` | `/api/hierarchy/node/:nodeId` | Soft-delete a node and its descendants |

## 22. Public tenant resolution

Public or pre-login screens must resolve the tenant from the host or a supported slug parameter before showing organization-specific branding.

Public tenant information can be resolved through supported tenant endpoints such as:

```http
GET /api/tenant/info
GET /api/public/tenant/resolve?slug={org-slug}
```

Public responses must contain only public-safe organization details. Private configuration, credentials, join codes, and internal billing data must never be exposed through tenant-resolution responses.

## 23. Rules for frontend and API developers

1. Never infer behavior from the institution name.
2. Never hardcode College, Semester, Division, PRN, or Faculty in a reusable component.
3. Resolve tenant context before loading organization-specific data.
4. Fetch the institution profile for module behavior.
5. Fetch active terminology for visible labels.
6. Use visible hierarchy for selectors and storage hierarchy for persistence.
7. Hide the default division in no-division plans.
8. Do not expose sub-batch controls unless the profile enables them.
9. Do not treat a profile-supported module as purchased or enabled without checking entitlement.
10. Do not treat a login path as authorization.
11. Scope every query and mutation to the authenticated organization.
12. Keep role keys stable while rendering role labels dynamically.
13. Use generic examples and test records in documentation and demonstrations.
14. Do not change `org_type` or `structure_type` after production data exists without a migration plan.

## 24. Recommended onboarding order

1. Select the organization type.
2. Select the exact structure type.
3. Decide with-divisions or without-divisions.
4. Decide whether sub-batches are required.
5. Provision the tenant and Organization Admin.
6. Confirm the default subdomain.
7. Load the institution profile and verify terminology.
8. Seed or manually create the hierarchy.
9. Configure the academic year and terms or semesters.
10. Configure admissions fields and documents.
11. Enable entitled modules.
12. Assign staff and department roles.
13. Add test learners.
14. Create a test classroom against the correct hierarchy node.
15. Test attendance, fees, examinations, and reports.
16. Test every required portal URL.
17. Configure a custom domain only after the default tenant works.
18. Run a small pilot before importing production records.

## 25. Organization-type verification checklist

### Identity and hierarchy

- [ ] `org_type` matches the institution family.
- [ ] `structure_type` is explicit and correct.
- [ ] Division mode matches the real institution.
- [ ] Hidden default divisions do not appear in the UI.
- [ ] Sub-batches appear only when enabled.
- [ ] Parent-child hierarchy relationships are valid.
- [ ] Duplicate sibling names are rejected.

### Terminology

- [ ] Learner ID label is correct.
- [ ] Educator label is correct.
- [ ] Period and division labels are correct.
- [ ] Assignment and examination labels are correct.
- [ ] Reusable screens do not contain hardcoded college terminology.

### Modules

- [ ] Admissions uses the correct workflow and ranking model.
- [ ] Attendance uses the correct session types and hierarchy scope.
- [ ] Fees use the correct billing basis and periods.
- [ ] Examinations use the correct grading/result model.
- [ ] Library behavior matches the institution profile.
- [ ] Disabled or unpurchased modules are not shown as available.

### Roles and portals

- [ ] Organization Admin reaches the organization dashboard.
- [ ] Student and educator logins reach the correct tenant.
- [ ] Department roles reach only their authorized modules.
- [ ] Portal links use the current slug or verified custom domain.
- [ ] Join codes are not publicly exposed.

### Tenant safety

- [ ] Every read and write is scoped to the correct organization.
- [ ] Public tenant responses contain only public-safe data.
- [ ] Custom-domain verification is complete before disabling the default URL.
- [ ] The emergency Organization Admin URL is saved.

## 26. Quick decision guide

Choose:

- Engineering with divisions for degree/department/year/semester institutions that use A/B/C divisions.
- Engineering without divisions for the same academic model with one group per semester.
- School with divisions for standards split into sections.
- School without divisions for one group per standard.
- Coaching for course-and-batch enrollment, mentoring, and test-series workflows.
- Junior College with divisions for stream/11th-12th/division structures.
- Junior College without divisions when each stream and standard has one group.
- Diploma with divisions for department/year/semester/division structures.
- Diploma without divisions for one group per semester.
- Custom only when none of the standard institution families fits and Classgrid has reviewed the required behavior.

When uncertain, stop before importing students. Correcting the structure during onboarding is simple; changing it after attendance, fees, classrooms, and results exist requires migration work.
