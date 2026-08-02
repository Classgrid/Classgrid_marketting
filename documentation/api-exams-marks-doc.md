---
title: Exams and Marks API
description: "Code-grounded Classgrid REST API reference for exams and marks api"
---

# Exams and Marks API

This reference is generated from the current Express route definitions and their handlers. It documents route-level authentication and authorization; deployment-wide middleware may add further checks.

## Conventions

- Base API origin: `https://api.classgrid.in`
- Authentication: authenticated routes use the Classgrid session/JWT recognized by `isAuthenticated`.
- JSON is the default request and response format unless an endpoint explicitly accepts multipart data or redirects.
- Path parameters are always required.
- A field marked `no` means the static handler scan did not find a direct required-field check; business rules may still make it conditionally required.
- Role checks can also accept `super_admin` through the shared authorization middleware where implemented.

This document contains **125 route definitions** from 9 source files.

## exam.routes.js

**Mounted at:** `/api/exams`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| GET | `/api/exams/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/exams` | `org_admin` |
| GET | `/api/exams` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/exams/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/exams/:id` | `org_admin` |
| POST | `/api/exams/:id/parse-timetable` | `org_admin` |
| POST | `/api/exams/:id/timetable` | `org_admin` |
| PUT | `/api/exams/:id/timetable/:entryId` | `org_admin` |
| DELETE | `/api/exams/:id/timetable/:entryId` | `org_admin` |
| POST | `/api/exams/:id/fees/set` | `org_admin` |
| GET | `/api/exams/:id/fees` | `org_admin` |

### GET /api/exams/institution-profile

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**What it does:** Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `examination_profile`, `learner_record_profile`.

**Source:** `server/src/routes/exam.routes.js:15`; handler `inline handler` in `server/src/routes/exam.routes.js`.

### POST /api/exams

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** CREATE EXAM. Creates or processes resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `exam_name` | string | yes | Request value for exam name. |
| `type` | string | no | Request value for type. Default: `college`. |
| `date_from` | string (date/time) | no | Request value for date from. |
| `date_to` | string (date/time) | no | Request value for date to. |
| `exam_fee` | number | no | Request value for exam fee. Default: `0`. |
| `fee_enabled` | boolean | no | Request value for fee enabled. Default: `false`. |

**Response:** JSON response fields observed in the handler include `message`, `exam`. Explicit status codes include 201, 400, 500. Exam name is required

**Source:** `server/src/routes/exam.routes.js:29`; handler `inline handler` in `server/src/routes/exam.routes.js`.

### GET /api/exams

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** LIST EXAMS (org-scoped). Retrieves resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `exams`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/exam.routes.js:52`; handler `inline handler` in `server/src/routes/exam.routes.js`.

### GET /api/exams/:id

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** + TIMETABLE. Retrieves resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `exam`, `entries`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/exam.routes.js:70`; handler `inline handler` in `server/src/routes/exam.routes.js`.

### DELETE /api/exams/:id

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Deletes resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Exam deleted

**Source:** `server/src/routes/exam.routes.js:86`; handler `inline handler` in `server/src/routes/exam.routes.js`.

### POST /api/exams/:id/parse-timetable

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`, `upload.single('pdf')`

**What it does:** UPLOAD PDF AI EXTRACTION. Creates or processes parse timetable.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `pdf` | file | no | Request value for pdf. |

**Response:** JSON response fields observed in the handler include `message`, `rawText`, `entries`, `error`. Explicit status codes include 400, 422, 500. PDF file is required

**Source:** `server/src/routes/exam.routes.js:97`; handler `inline handler` in `server/src/routes/exam.routes.js`.

### POST /api/exams/:id/timetable

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** SAVE TIMETABLE ENTRIES. Creates or processes timetable.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `entries` | string | no | Request value for entries. |

**Response:** JSON response fields observed in the handler include `message`, `entries`. Explicit status codes include 400, 500. No entries provided

**Source:** `server/src/routes/exam.routes.js:161`; handler `inline handler` in `server/src/routes/exam.routes.js`.

### PUT /api/exams/:id/timetable/:entryId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** EDIT SINGLE TIMETABLE ROW. Updates timetable.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `entryId` | string | yes | Path identifier/value for entry id. |
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | no | Request value for subject. |
| `exam_date` | string (date/time) | no | Request value for exam date. |
| `day_of_week` | number | no | Request value for day of week. |
| `start_time` | string | no | Request value for start time. |
| `end_time` | string | no | Request value for end time. |
| `room` | string | no | Request value for room. |

**Response:** JSON response fields observed in the handler include `message`, `entry`. Explicit status codes include 500. Entry updated

**Source:** `server/src/routes/exam.routes.js:198`; handler `inline handler` in `server/src/routes/exam.routes.js`.

### DELETE /api/exams/:id/timetable/:entryId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** TIMETABLE ROW. Deletes timetable.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `entryId` | string | yes | Path identifier/value for entry id. |
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Entry deleted

**Source:** `server/src/routes/exam.routes.js:216`; handler `inline handler` in `server/src/routes/exam.routes.js`.

### POST /api/exams/:id/fees/set

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** FEE MANAGEMENT. Creates or processes fees set.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `exam_fee` | string | no | Request value for exam fee. |
| `fee_enabled` | string | no | Request value for fee enabled. |

**Response:** JSON response fields observed in the handler include `message`, `exam`. Explicit status codes include 500. Fee updated

**Source:** `server/src/routes/exam.routes.js:227`; handler `inline handler` in `server/src/routes/exam.routes.js`.

### GET /api/exams/:id/fees

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Retrieves fees.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `fees`, `summary`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/exam.routes.js:238`; handler `inline handler` in `server/src/routes/exam.routes.js`.

## examination.routes.js

**Mount status:** This route file is not mounted by `server/api/index.js`. Its route-local definitions are included for completeness but are not currently reachable through the main API application.

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| POST | route-local `/create` | `faculty`, `org_admin` |
| GET | route-local `/faculty` | `faculty`, `org_admin` |
| POST | route-local `/student` | `student` |
| GET | route-local `/org` | `org_admin` |
| GET | route-local `/exam/:examId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | route-local `/exam/:examId` | `faculty`, `org_admin` |
| DELETE | route-local `/exam/:examId` | `faculty`, `org_admin` |
| POST | route-local `/exam/:examId/grade/bulk` | `faculty`, `org_admin` |
| POST | route-local `/exam/:examId/grade/:studentId` | `faculty`, `org_admin` |
| GET | route-local `/exam/:examId/results` | `faculty`, `org_admin` |
| GET | route-local `/student/:studentId/results` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | route-local `/report-card/student/:studentId/hierarchy/:hierarchyId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | route-local `/report-card/batch/:hierarchyId` | `faculty`, `org_admin` |

### POST [unmounted] /create

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**What it does:** Admin / Faculty: Create a new exam. Create exam controller.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:30`; handler `createExamController` in `server/src/controllers/examination.controller.js`.

### GET [unmounted] /faculty

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**What it does:** Admin / Faculty: Get exams created by the logged-in faculty. Get faculty exams controller.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |
| `subject_id` | string | no | Query value for subject id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:33`; handler `getFacultyExamsController` in `server/src/controllers/examination.controller.js`.

### POST [unmounted] /student

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**What it does:** Student: Get feed of exams targeted at their hierarchy nodes (Uses POST to accept array in body). Get student exams controller.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchy_ids` | array | no | Request value for hierarchy ids. |

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:36`; handler `getStudentExamsController` in `server/src/controllers/examination.controller.js`.

### GET [unmounted] /org

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("org_admin")`

**What it does:** Admin: Get all exams for the organization (Bento Grid Dashboard). Get exams by organization controller.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |
| `hierarchy_id` | string | no | Query value for hierarchy id. |
| `subject_id` | string | no | Query value for subject id. |
| `date_from` | string (date/time) | no | Query value for date from. |
| `date_to` | string (date/time) | no | Query value for date to. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:39`; handler `getExamsByOrganizationController` in `server/src/controllers/examination.controller.js`.

### GET [unmounted] /exam/:examId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** All Authenticated: Get a specific exam by ID. Get exam by id controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:42`; handler `getExamByIdController` in `server/src/controllers/examination.controller.js`.

### PUT [unmounted] /exam/:examId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**What it does:** Admin / Faculty: Update an exam (must be creator, must be draft/scheduled). Update exam controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:45`; handler `updateExamController` in `server/src/controllers/examination.controller.js`.

### DELETE [unmounted] /exam/:examId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**What it does:** Admin / Faculty: Delete an exam (must be creator, must be draft). Delete exam controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:48`; handler `deleteExamController` in `server/src/controllers/examination.controller.js`.

### POST [unmounted] /exam/:examId/grade/bulk

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**What it does:** Admin / Faculty: Bulk submit grades for a batch. Bulk submit grades controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `gradesArray` | string | no | Request value for grades array. |

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:55`; handler `bulkSubmitGradesController` in `server/src/controllers/examination.controller.js`.

### POST [unmounted] /exam/:examId/grade/:studentId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**What it does:** Admin / Faculty: Submit/update grade for a single student. Submit student grade controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |
| `studentId` | string | yes | Path identifier/value for student id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `obtainedMarks` | string | no | Request value for obtained marks. |
| `remarks` | string | no | Request value for remarks. |

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:58`; handler `submitStudentGradeController` in `server/src/controllers/examination.controller.js`.

### GET [unmounted] /exam/:examId/results

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**What it does:** Admin / Faculty: View the completed gradebook for an exam. Get exam results controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:61`; handler `getExamResultsController` in `server/src/controllers/examination.controller.js`.

### GET [unmounted] /student/:studentId/results

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** All Authenticated: View a student's graded exams feed. Get student results feed controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | string | yes | Path identifier/value for student id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:64`; handler `getStudentResultsFeedController` in `server/src/controllers/examination.controller.js`.

### GET [unmounted] /report-card/student/:studentId/hierarchy/:hierarchyId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** All Authenticated: Generate cumulative report card for a student in a specific term/hierarchy. Generate student report card controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | string | yes | Path identifier/value for student id. |
| `hierarchyId` | string | yes | Path identifier/value for hierarchy id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:71`; handler `generateStudentReportCardController` in `server/src/controllers/examination.controller.js`.

### GET [unmounted] /report-card/batch/:hierarchyId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(["faculty","org_admin"])`

**What it does:** Admin / Faculty: Generate the master batch report (Toppers, Failures, Averages). Generate batch report controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchyId` | string | yes | Path identifier/value for hierarchy id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/examination.routes.js:74`; handler `generateBatchReportController` in `server/src/controllers/examination.controller.js`.

## examinations.routes.js

**Mounted at:** `/api/examinations`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| GET | `/api/examinations/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/examinations/analytics` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/examinations/admin/all` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/examinations/admin/create` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/examinations/admin/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/examinations/admin/:examId/timetable/upload` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/examinations/admin/:examId/timetable/save` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/examinations/admin/:examId/timetables` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/examinations/student/active` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/examinations/institution-profile

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**What it does:** Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `examination_profile`, `learner_record_profile`.

**Source:** `server/src/routes/examinations.routes.js:18`; handler `inline handler` in `server/src/routes/examinations.routes.js`.

### GET /api/examinations/analytics

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `summary`, `recentExams`, `questionBankStats`, `charts`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/examinations.routes.js:29`; handler `inline handler` in `server/src/routes/examinations.routes.js`.

### GET /api/examinations/admin/all

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** 1. Get all exams for the organization. Retrieves admin all.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `exams`. Explicit status codes include 400, 403, 500.

**Source:** `server/src/routes/examinations.routes.js:118`; handler `inline handler` in `server/src/routes/examinations.routes.js`.

### POST /api/examinations/admin/create

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** 2. Create an Exam. Creates the requested resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | no | Request value for name. |
| `type` | string | no | Request value for type. |
| `academic_year_id` | string | no | Request value for academic year id. |
| `semester` | string | no | Request value for semester. |
| `date_range_start` | string (date/time) | no | Request value for date range start. |
| `date_range_end` | string (date/time) | no | Request value for date range end. |
| `exam_fee_amount` | number | no | Request value for exam fee amount. |
| `status` | string | no | Request value for status. |

**Response:** JSON response fields observed in the handler include `error`, `exam`. Explicit status codes include 403, 500.

**Source:** `server/src/routes/examinations.routes.js:142`; handler `inline handler` in `server/src/routes/examinations.routes.js`.

### DELETE /api/examinations/admin/:id

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** 3. Delete an Exam. Deletes admin.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`. Explicit status codes include 403, 500.

**Source:** `server/src/routes/examinations.routes.js:189`; handler `inline handler` in `server/src/routes/examinations.routes.js`.

### POST /api/examinations/admin/:examId/timetable/upload

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `upload.single('file')`

**What it does:** 4. Upload PDF -> Parse Text -> Groq JSON Extraction. Uploads the supplied resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `error`, `pdfUrl`, `extractedData`. Explicit status codes include 400, 403, 500.

**Source:** `server/src/routes/examinations.routes.js:211`; handler `inline handler` in `server/src/routes/examinations.routes.js`.

### POST /api/examinations/admin/:examId/timetable/save

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** 5. Save the Admin-Reviewed Timetable array to DB (WITH VALIDATION). Creates or processes admin timetable save.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `divisionId` | string | no | Request value for division id. |
| `pdfUrl` | string | no | Request value for pdf url. |
| `structuredData` | object | no | Request value for structured data. |

**Response:** JSON response fields observed in the handler include `error`, `details`, `success`, `timetable`. Explicit status codes include 400, 403, 500.

**Source:** `server/src/routes/examinations.routes.js:287`; handler `inline handler` in `server/src/routes/examinations.routes.js`.

### GET /api/examinations/admin/:examId/timetables

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** 6. Get existing timetables for an exam. Retrieves admin timetables.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `timetables`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/examinations.routes.js:346`; handler `inline handler` in `server/src/routes/examinations.routes.js`.

### GET /api/examinations/student/active

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Filters timetables by matching student division_id. Retrieves student active.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `exams`. Explicit status codes include 403, 500.

**Source:** `server/src/routes/examinations.routes.js:367`; handler `inline handler` in `server/src/routes/examinations.routes.js`.

## marks.routes.js

**Mounted at:** `/api/marks`

| Method | Path | Access |
|---|---|---|
| POST | `/api/marks/upload/:classroomId` | Authenticated classroom owner. |
| POST | `/api/marks/confirm/:examId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/marks/classroom/:classroomId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/marks/classroom/all` | `faculty`, `org_admin`, `super_admin` |
| GET | `/api/marks/exam/:examId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/marks/exam/:examId/analytics` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/marks/student/me` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/marks/student/:studentId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/marks/exam/:examId/mark/:markId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/marks/exam/:examId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/marks/download-template` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/marks/policy` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/marks/policy` | `super_admin`, `org_admin` |
| GET | `/api/marks/subjects` | `super_admin`, `org_admin` |
| POST | `/api/marks/subjects` | `super_admin`, `org_admin` |
| PUT | `/api/marks/subjects/:id` | `super_admin`, `org_admin` |
| DELETE | `/api/marks/subjects/:id` | `super_admin`, `org_admin` |
| POST | `/api/marks/create-exam` | `super_admin`, `org_admin` |
| GET | `/api/marks/classroom-exams/:classroomId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/marks/upload-multi/:examId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/marks/confirm-multi/:examId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/marks/exams/:id/status` | `super_admin`, `org_admin` |
| GET | `/api/marks/exams` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/marks/exams/:examId/export` | `super_admin`, `org_admin` |

### POST /api/marks/upload/:classroomId

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`, `requireClassroomOwner`, `upload.single("file")`

**What it does:** Uploads the supplied resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | yes | Request value for title. |
| `examType` | string | no | Request value for exam type. |
| `totalMarks` | string | no | Request value for total marks. |
| `passingMarks` | string | no | Request value for passing marks. |
| `prnColumn` | string | no | Request value for prn column. |
| `marksColumn` | string | no | Request value for marks column. |
| `nameColumn` | string | no | Request value for name column. |
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `message`, `headers`, `detectedColumns`, `examId`, `fileName`, `stats`, `matched`, `unmatched`, `duplicates`. Explicit status codes include 400, 413, 500. No file uploaded

**Source:** `server/src/routes/marks.routes.js:49`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### POST /api/marks/confirm/:examId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Creates or processes confirm.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `matched` | string | yes | Request value for matched. |

**Response:** JSON response fields observed in the handler include `message`, `examId`, `totalSaved`, `analytics`. Explicit status codes include 400, 403, 404, 409, 500. Exam record not found

**Source:** `server/src/routes/marks.routes.js:152`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/classroom/:classroomId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Retrieves classroom.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `exams`, `total`. Explicit status codes include 403, 404, 500. Classroom not found

**Source:** `server/src/routes/marks.routes.js:252`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/classroom/all

**Auth:** `isAuthenticated`, `requireRole(["faculty","org_admin","super_admin"])`

**Roles:** `faculty`, `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole(["faculty","org_admin","super_admin"])`

**What it does:** Retrieves classroom all.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `exams`, `total`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/marks.routes.js:295`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/exam/:examId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Retrieves exam.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `exam`, `marks`, `totalStudents`. Explicit status codes include 403, 404, 500. Exam not found

**Source:** `server/src/routes/marks.routes.js:325`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/exam/:examId/analytics

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Retrieves exam analytics.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `examId`, `title`, `analytics`. Explicit status codes include 403, 404, 500. Exam not found

**Source:** `server/src/routes/marks.routes.js:356`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/student/me

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Retrieves student me.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `totalExams`, `classrooms`, `organization`, `student`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/marks.routes.js:383`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/student/:studentId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Retrieves student.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | string | yes | Path identifier/value for student id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Query value for classroom id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `marks`, `total`. Explicit status codes include 400, 403, 500. classroomId query param is required

**Source:** `server/src/routes/marks.routes.js:457`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### PUT /api/marks/exam/:examId/mark/:markId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Updates exam mark.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |
| `markId` | string | yes | Path identifier/value for mark id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subjectMarks` | string | yes | Request value for subject marks. |

**Response:** JSON response fields observed in the handler include `message`, `mark`, `analytics`. Explicit status codes include 400, 403, 404, 500. Exam not found

**Source:** `server/src/routes/marks.routes.js:494`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### DELETE /api/marks/exam/:examId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Deletes exam.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `deletedMarks`. Explicit status codes include 403, 404, 500. Exam not found

**Source:** `server/src/routes/marks.routes.js:611`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/download-template

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Downloads the requested resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Server error generating template

**Source:** `server/src/routes/marks.routes.js:644`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/policy

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Retrieves policy.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `policy`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/marks.routes.js:680`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### PUT /api/marks/policy

**Auth:** `isAuthenticated`, `requireRole(["super_admin","org_admin"])`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`, `requireRole(["super_admin","org_admin"])`

**What it does:** Updates policy.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `calculationMethod` | string | no | Request value for calculation method. |
| `passPercentage` | string | no | Request value for pass percentage. |
| `gradeRules` | string | no | Request value for grade rules. |

**Response:** JSON response fields observed in the handler include `message`, `policy`. Explicit status codes include 500. Policy saved

**Source:** `server/src/routes/marks.routes.js:714`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/subjects

**Auth:** `isAuthenticated`, `requireRole(["super_admin","org_admin"])`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`, `requireRole(["super_admin","org_admin"])`

**What it does:** Retrieves subjects.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `subjects`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/marks.routes.js:763`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### POST /api/marks/subjects

**Auth:** `isAuthenticated`, `requireRole(["super_admin","org_admin"])`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`, `requireRole(["super_admin","org_admin"])`

**What it does:** Creates or processes subjects.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subjectName` | string | no | Request value for subject name. |
| `maxMarks` | string | no | Request value for max marks. |
| `classroomId` | string | no | Request value for classroom id. |

**Response:** JSON response fields observed in the handler include `message`, `subject`. Explicit status codes include 201, 400, 409, 500. Subject name is required

**Source:** `server/src/routes/marks.routes.js:786`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### PUT /api/marks/subjects/:id

**Auth:** `isAuthenticated`, `requireRole(["super_admin","org_admin"])`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`, `requireRole(["super_admin","org_admin"])`

**What it does:** Updates subjects.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subjectName` | string | no | Request value for subject name. |
| `maxMarks` | number | no | Request value for max marks. |

**Response:** JSON response fields observed in the handler include `message`, `subject`. Explicit status codes include 404, 409, 500. Subject not found

**Source:** `server/src/routes/marks.routes.js:817`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### DELETE /api/marks/subjects/:id

**Auth:** `isAuthenticated`, `requireRole(["super_admin","org_admin"])`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`, `requireRole(["super_admin","org_admin"])`

**What it does:** Deletes subjects.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 404, 500. Subject not found

**Source:** `server/src/routes/marks.routes.js:846`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### POST /api/marks/create-exam

**Auth:** `isAuthenticated`, `requireRole(["super_admin","org_admin"])`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`, `requireRole(["super_admin","org_admin"])`

**What it does:** Creates the requested resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | no | Request value for title. |
| `examType` | string | no | Request value for exam type. |
| `classroomId` | string | yes | Request value for classroom id. |
| `subjectIds` | string | no | Request value for subject ids. |
| `examDate` | string | no | Request value for exam date. |
| `passingMarks` | string | no | Request value for passing marks. |

**Response:** JSON response fields observed in the handler include `message`, `exam`. Explicit status codes include 201, 400, 403, 500. Exam title is required

**Source:** `server/src/routes/marks.routes.js:870`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/classroom-exams/:classroomId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Retrieves classroom exams.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `exams`. Explicit status codes include 403, 404, 500. Classroom not found

**Source:** `server/src/routes/marks.routes.js:930`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### POST /api/marks/upload-multi/:examId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`, `upload.single("file")`

**What it does:** Uploads the supplied resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `message`, `headers`, `excelHeaders`, `expectedSubjects`, `examId`, `subjectColumns`, `stats`, `matched`, `unmatched`. Explicit status codes include 400, 403, 404, 413, 500. Exam not found

**Source:** `server/src/routes/marks.routes.js:965`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### POST /api/marks/confirm-multi/:examId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Creates or processes confirm multi.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `matched` | string | no | Request value for matched. |

**Response:** JSON response fields observed in the handler include `message`, `totalSaved`, `analytics`. Explicit status codes include 400, 403, 404, 409, 500. Exam not found

**Source:** `server/src/routes/marks.routes.js:1145`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### PUT /api/marks/exams/:id/status

**Auth:** `isAuthenticated`, `requireRole(["super_admin","org_admin"])`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`, `requireRole(["super_admin","org_admin"])`

**What it does:** Updates exams status.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Request value for status. |

**Response:** JSON response fields observed in the handler include `message`, `exam`. Explicit status codes include 400, 404, 500. Invalid status

**Source:** `server/src/routes/marks.routes.js:1244`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/exams

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`

**What it does:** Retrieves exams.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `exams`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/marks.routes.js:1287`; handler `inline handler` in `server/src/routes/marks.routes.js`.

### GET /api/marks/exams/:examId/export

**Auth:** `isAuthenticated`, `requireRole(["super_admin","org_admin"])`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requirePlan("PRO")`, `requireRole(["super_admin","org_admin"])`

**What it does:** Retrieves exams export.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 403, 404, 500. Exam not found

**Source:** `server/src/routes/marks.routes.js:1312`; handler `inline handler` in `server/src/routes/marks.routes.js`.

## result.routes.js

**Mounted at:** `/api/results`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| GET | `/api/results/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/results/schemes` | `org_admin`, `teacher` |
| POST | `/api/results/schemes` | `org_admin` |
| DELETE | `/api/results/schemes/:id` | `org_admin` |
| GET | `/api/results/schemes/:id/subjects` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/results/schemes/:id/subjects` | `org_admin` |
| POST | `/api/results/schemes/:id/upload-marks` | `org_admin`, `teacher` |
| POST | `/api/results/schemes/:id/generate` | `org_admin` |
| GET | `/api/results/student/:studentId/cgpa` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/results/schemes/:id/publish` | `org_admin` |
| POST | `/api/results/schemes/:id/lock` | `org_admin` |
| GET | `/api/results/schemes/:id/results` | `org_admin` |
| GET | `/api/results/student/me` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/results/upload-csv` | `org_admin` |

### GET /api/results/institution-profile

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**What it does:** Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `examination_profile`, `learner_record_profile`.

**Source:** `server/src/routes/result.routes.js:13`; handler `inline handler` in `server/src/routes/result.routes.js`.

### GET /api/results/schemes

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','teacher')`

**Roles:** `org_admin`, `teacher`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','teacher')`

**What it does:** Retrieves schemes.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `schemes`, `message`. Explicit status codes include 500. Failed to fetch schemes

**Source:** `server/src/routes/result.routes.js:434`; handler `inline handler` in `server/src/routes/result.routes.js`.

### POST /api/results/schemes

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Creates or processes schemes.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | no | Request value for id. |
| `name` | string | yes | Request value for name. |
| `academic_year` | number | no | Request value for academic year. |
| `semester` | string | no | Request value for semester. |
| `division_id` | string | no | Request value for division id. |
| `rules_json` | string | no | Request value for rules json. |

**Response:** JSON response fields observed in the handler include `message`, `scheme`. Explicit status codes include 400, 500. Scheme name is required

**Source:** `server/src/routes/result.routes.js:450`; handler `inline handler` in `server/src/routes/result.routes.js`.

### DELETE /api/results/schemes/:id

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Deletes schemes.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 403, 500. Locked schemes cannot be deleted

**Source:** `server/src/routes/result.routes.js:525`; handler `inline handler` in `server/src/routes/result.routes.js`.

### GET /api/results/schemes/:id/subjects

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves schemes subjects.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `subjects`, `message`. Explicit status codes include 500. Failed to fetch subjects

**Source:** `server/src/routes/result.routes.js:541`; handler `inline handler` in `server/src/routes/result.routes.js`.

### POST /api/results/schemes/:id/subjects

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Creates or processes schemes subjects.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subjects` | array | no | Request value for subjects. |

**Response:** JSON response fields observed in the handler include `message`, `subjects`. Explicit status codes include 400, 403, 500. Subjects array required

**Source:** `server/src/routes/result.routes.js:553`; handler `inline handler` in `server/src/routes/result.routes.js`.

### POST /api/results/schemes/:id/upload-marks

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','teacher')`

**Roles:** `org_admin`, `teacher`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','teacher')`

**What it does:** Uploads the supplied resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `rows` | string | no | Request value for rows. |

**Response:** JSON response fields observed in the handler include `message`, `success`, `failed`, `errors`. Explicit status codes include 400, 403, 500. No rows provided

**Source:** `server/src/routes/result.routes.js:591`; handler `inline handler` in `server/src/routes/result.routes.js`.

### POST /api/results/schemes/:id/generate

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Generates the requested resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `generated`, `duration_seconds`, `mode`, `pass`, `distinction`, `first_class`, `compartment`, `fail`. Explicit status codes include 400, 403, 404, 409, 500. Already generating. Please wait.

**Source:** `server/src/routes/result.routes.js:673`; handler `inline handler` in `server/src/routes/result.routes.js`.

### GET /api/results/student/:studentId/cgpa

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves student cgpa.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | string | yes | Path identifier/value for student id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `cgpa`, `semesters`, `percentage_equivalent`, `total_semesters`. Explicit status codes include 403, 500. Access denied

**Source:** `server/src/routes/result.routes.js:934`; handler `inline handler` in `server/src/routes/result.routes.js`.

### POST /api/results/schemes/:id/publish

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Publishes the requested resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 403, 404, 500. Scheme not found

**Source:** `server/src/routes/result.routes.js:986`; handler `inline handler` in `server/src/routes/result.routes.js`.

### POST /api/results/schemes/:id/lock

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Creates or processes schemes lock.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Scheme locked permanently

**Source:** `server/src/routes/result.routes.js:1000`; handler `inline handler` in `server/src/routes/result.routes.js`.

### GET /api/results/schemes/:id/results

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Retrieves schemes results.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `results`, `message`. Explicit status codes include 500. Failed to fetch results

**Source:** `server/src/routes/result.routes.js:1135`; handler `inline handler` in `server/src/routes/result.routes.js`.

### GET /api/results/student/me

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves student me.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `results`, `student`, `message`. Explicit status codes include 500. Failed to fetch your results

**Source:** `server/src/routes/result.routes.js:1164`; handler `inline handler` in `server/src/routes/result.routes.js`.

### POST /api/results/upload-csv

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`, `upload.single('file')`

**What it does:** Uploads the supplied resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `schemeId` | string | yes | Request value for scheme id. |
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `message`, `parsed_rows`, `success`, `failed`, `errors`. Explicit status codes include 400, 403, 404, 500. schemeId is required.

**Source:** `server/src/routes/result.routes.js:1248`; handler `inline handler` in `server/src/routes/result.routes.js`.

## internal-tests.routes.js

**Mounted at:** `/api/internal-tests`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| GET | `/api/internal-tests/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/internal-tests` | `org_admin`, `faculty`, `teacher` |
| GET | `/api/internal-tests/my-tests` | `org_admin`, `faculty`, `teacher` |
| GET | `/api/internal-tests/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/internal-tests/:id` | `org_admin`, `faculty`, `teacher` |
| DELETE | `/api/internal-tests/:id` | `org_admin`, `faculty`, `teacher` |
| GET | `/api/internal-tests/:id/students` | `org_admin`, `faculty`, `teacher` |
| POST | `/api/internal-tests/:id/marks` | `org_admin`, `faculty`, `teacher` |
| GET | `/api/internal-tests/student/my-tests` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/internal-tests/institution-profile

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**What it does:** Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `examination_profile`, `learner_record_profile`.

**Source:** `server/src/routes/internal-tests.routes.js:9`; handler `inline handler` in `server/src/routes/internal-tests.routes.js`.

### POST /api/internal-tests

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**Roles:** `org_admin`, `faculty`, `teacher`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**What it does:** Creates or processes resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `test_name` | string | yes | Request value for test name. |
| `subject` | string | yes | Request value for subject. |
| `division_id` | string | no | Request value for division id. |
| `classroom_id` | string | no | Request value for classroom id. |
| `test_date` | string (date/time) | yes | Request value for test date. |
| `total_marks` | number | yes | Request value for total marks. |
| `description` | string | no | Request value for description. |
| `question_file_url` | string | no | Request value for question file url. |

**Response:** JSON response fields observed in the handler include `message`, `test`. Explicit status codes include 201, 400, 500. test_name, subject, test_date, and total_marks are required

**Source:** `server/src/routes/internal-tests.routes.js:23`; handler `inline handler` in `server/src/routes/internal-tests.routes.js`.

### GET /api/internal-tests/my-tests

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**Roles:** `org_admin`, `faculty`, `teacher`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**What it does:** Retrieves my tests.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `tests`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/internal-tests.routes.js:60`; handler `inline handler` in `server/src/routes/internal-tests.routes.js`.

### GET /api/internal-tests/:id

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `test`, `marks`. Explicit status codes include 404, 500. Test not found

**Source:** `server/src/routes/internal-tests.routes.js:93`; handler `inline handler` in `server/src/routes/internal-tests.routes.js`.

### PUT /api/internal-tests/:id

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**Roles:** `org_admin`, `faculty`, `teacher`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**What it does:** Updates resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `test_name` | string | no | Request value for test name. |
| `subject` | string | no | Request value for subject. |
| `test_date` | string (date/time) | no | Request value for test date. |
| `total_marks` | number | no | Request value for total marks. |
| `description` | string | no | Request value for description. |
| `question_file_url` | string | no | Request value for question file url. |
| `status` | string | no | Request value for status. |

**Response:** JSON response fields observed in the handler include `message`, `test`. Explicit status codes include 500. Test updated!

**Source:** `server/src/routes/internal-tests.routes.js:133`; handler `inline handler` in `server/src/routes/internal-tests.routes.js`.

### DELETE /api/internal-tests/:id

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**Roles:** `org_admin`, `faculty`, `teacher`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**What it does:** Deletes resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Test deleted

**Source:** `server/src/routes/internal-tests.routes.js:160`; handler `inline handler` in `server/src/routes/internal-tests.routes.js`.

### GET /api/internal-tests/:id/students

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**Roles:** `org_admin`, `faculty`, `teacher`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**What it does:** Retrieves students.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `students`, `total_marks`. Explicit status codes include 404, 500. Test not found

**Source:** `server/src/routes/internal-tests.routes.js:175`; handler `inline handler` in `server/src/routes/internal-tests.routes.js`.

### POST /api/internal-tests/:id/marks

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**Roles:** `org_admin`, `faculty`, `teacher`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty','teacher')`

**What it does:** Creates or processes marks.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `marks` | number | no | Request value for marks. |

**Response:** JSON response fields observed in the handler include `message`, `marks`. Explicit status codes include 400, 404, 500. marks array is required

**Source:** `server/src/routes/internal-tests.routes.js:240`; handler `inline handler` in `server/src/routes/internal-tests.routes.js`.

### GET /api/internal-tests/student/my-tests

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves student my tests.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `tests`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/internal-tests.routes.js:295`; handler `inline handler` in `server/src/routes/internal-tests.routes.js`.

## online-exam.routes.js

**Mounted at:** `/api/online-exam`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| GET | `/api/online-exam/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/online-exam/ocr-import` | `teacher`, `faculty`, `org_admin` |
| POST | `/api/online-exam/ai/generate` | `teacher`, `faculty`, `org_admin` |
| POST | `/api/online-exam/upload-asset` | `teacher`, `faculty` |
| POST | `/api/online-exam/create` | `faculty`, `org_admin` |
| GET | `/api/online-exam/my-exams` | `faculty`, `org_admin` |
| GET | `/api/online-exam/:examId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/online-exam/:examId` | `faculty`, `org_admin` |
| DELETE | `/api/online-exam/:examId` | `faculty`, `org_admin` |
| POST | `/api/online-exam/:examId/status` | `faculty`, `org_admin` |
| GET | `/api/online-exam/student/dashboard` | `student` |
| GET | `/api/online-exam/:examId/start` | `student` |
| POST | `/api/online-exam/:examId/verify-access` | `student` |
| POST | `/api/online-exam/:examId/run-code` | `student` |
| POST | `/api/online-exam/:examId/autosave` | `student` |
| POST | `/api/online-exam/:examId/anticheat` | `student` |
| POST | `/api/online-exam/:examId/proctor/flag` | `student` |
| GET | `/api/online-exam/:examId/hall-ticket` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/online-exam/:examId/submit` | `student` |
| POST | `/api/online-exam/:examId/verify-access` | `student` |
| GET | `/api/online-exam/:examId/results` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/online-exam/explain-mistake` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/online-exam/:examId/results/all` | `faculty`, `org_admin` |
| PATCH | `/api/online-exam/attempts/:attemptId/grade` | `faculty`, `org_admin` |
| GET | `/api/online-exam/:examId/analytics` | `faculty`, `org_admin` |
| POST | `/api/online-exam/:examId/proctor-heartbeat` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/online-exam/:examId/proctor-report` | `faculty`, `org_admin` |
| GET | `/api/online-exam/student/topic-analysis` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/online-exam/student/rank-prediction` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/online-exam/institution-profile

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**What it does:** Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `examination_profile`, `learner_record_profile`.

**Source:** `server/src/routes/online-exam.routes.js:16`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/ocr-import

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('teacher','faculty','org_admin')`

**Roles:** `teacher`, `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('teacher','faculty','org_admin')`, `upload.single('file')`

**What it does:** Uses Gemini AI to extract structured questions from an image. Creates or processes ocr import.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `questions`, `message`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/online-exam.routes.js:37`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/ai/generate

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('teacher','faculty','org_admin')`

**Roles:** `teacher`, `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('teacher','faculty','org_admin')`

**What it does:** Generates questions using LLM based on subject, topic, and tier. Generates the requested resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `topic` | string | yes | Request value for topic. |
| `tier` | string | no | Request value for tier. |
| `count` | number | no | Request value for count. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `questions`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/online-exam.routes.js:59`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/upload-asset

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('teacher','faculty')`

**Roles:** `teacher`, `faculty`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('teacher','faculty')`, `upload.single('file')`

**What it does:** Uploads the supplied resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `error`, `url`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/online-exam.routes.js:75`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/create

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**What it does:** Create a new online examination. Creates the requested resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | yes | Request value for title. |
| `classroom_id` | string | yes | Request value for classroom id. |
| `description` | string | no | Request value for description. |
| `start_time` | string | no | Request value for start time. |
| `end_time` | string | no | Request value for end time. |
| `sections` | string | yes | Request value for sections. |
| `marking_scheme` | string | no | Request value for marking scheme. |
| `settings` | object | no | Request value for settings. |
| `total_duration_override` | number | no | Request value for total duration override. |

**Response:** JSON response fields observed in the handler include `error`. Explicit status codes include 201, 400, 500.

**Source:** `server/src/routes/online-exam.routes.js:111`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/my-exams

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**What it does:** List all exams created by this faculty. Retrieves my exams.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `mode` | string | no | Query value for mode. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`. Explicit status codes include 500.

**Source:** `server/src/routes/online-exam.routes.js:184`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/:examId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Get full exam details (faculty gets full data, student gets stripped). Retrieves resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:207`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### PUT /api/online-exam/:examId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**What it does:** Update exam (only if draft). Updates resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | no | Request value for title. |
| `classroom_id` | string | no | Request value for classroom id. |
| `description` | string | no | Request value for description. |
| `start_time` | string | no | Request value for start time. |
| `end_time` | string | no | Request value for end time. |
| `sections` | string | no | Request value for sections. |
| `marking_scheme` | string | no | Request value for marking scheme. |
| `settings` | object | no | Request value for settings. |

**Response:** JSON response fields observed in the handler include `error`, `success`. Explicit status codes include 403, 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:238`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### DELETE /api/online-exam/:examId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**What it does:** Deletes resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`. Explicit status codes include 403, 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:276`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/:examId/status

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**What it does:** Change exam status: draft -> active -> closed. Creates or processes status.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Request value for status. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `status`. Explicit status codes include 400, 403, 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:298`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/student/dashboard

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**What it does:** List all exams available to the student. Retrieves student dashboard.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `mode` | string | no | Query value for mode. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `exams`, `stats`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/online-exam.routes.js:352`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/:examId/start

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**What it does:** Start an exam attempt returns questions without answers. Starts the requested operation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `status`, `start_time`, `title`, `exam`, `attempt`. Explicit status codes include 403, 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:457`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/:examId/verify-access

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**What it does:** Verifies student PRN/RollNo and DOB before unlocking the paper. Verifies the supplied information.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `identifier` | string | no | Request value for identifier. |
| `dob` | string | no | Request value for dob. |
| `type` | string | no | Request value for type. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`. Explicit status codes include 403, 404, 500. Examination Entry Authorized

**Source:** `server/src/routes/online-exam.routes.js:615`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/:examId/run-code

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**What it does:** Proxy to Piston API for secure code execution during exam. Creates or processes run code.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string | yes | Request value for code. |
| `language` | string | no | Request value for language. |

**Response:** JSON response fields observed in the handler include `error`, `stdout`, `stderr`, `output`, `exit_code`, `signal`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/online-exam.routes.js:653`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/:examId/autosave

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**What it does:** Save responses + question statuses periodically. Creates or processes autosave.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `section_responses` | string | no | Request value for section responses. |
| `question_statuses` | string | no | Request value for question statuses. |
| `section_time_remaining` | string | no | Request value for section time remaining. |

**Response:** JSON response fields observed in the handler include `error`, `success`. Explicit status codes include 403, 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:693`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/:examId/anticheat

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**What it does:** Log tab switches / kiosk violations. Creates or processes anticheat.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | no | Request value for type. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `switch_count`, `auto_submit`, `max_switches`. Explicit status codes include 403, 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:728`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/:examId/proctor/flag

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**What it does:** Receives a webcam snapshot, analyzes it with Gemini AI, and SAVES the photo as evidence in Supabase Storage. Faculty can later view these snapshots in the Proctor Report as definitive proof of violations. Creates or processes proctor flag.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `image` | file | yes | Request value for image. |

**Response:** JSON response fields observed in the handler include `error`, `success`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/online-exam.routes.js:775`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/:examId/hall-ticket

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Generates a printable HTML hall ticket. Retrieves hall ticket.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** Explicit status codes include 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:830`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/:examId/submit

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**What it does:** Submit the exam calculate scores with marking scheme. Submits the supplied information.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `section_responses` | string | no | Request value for section responses. |
| `question_statuses` | string | no | Request value for question statuses. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `score`, `total_marks`, `section_scores`, `behavior_penalty`. Explicit status codes include 403, 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:909`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/:examId/verify-access

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("student")`

**What it does:** Verifies student PRN and DOB before entering the exam room. Verifies the supplied information.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `prn` | string | yes | Request value for prn. |
| `dob` | string | yes | Request value for dob. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`. Explicit status codes include 400, 403, 404, 500. Identification verified. Welcome to the exam hall.

**Source:** `server/src/routes/online-exam.routes.js:1052`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/:examId/results

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves results.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `exam`, `attempt`, `peer_analytics`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:1093`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/explain-mistake

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Creates or processes explain mistake.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `question` | string | no | Request value for question. |
| `your_answer` | string | no | Request value for your answer. |
| `correct_answer` | string | no | Request value for correct answer. |

**Response:** JSON response fields observed in the handler include `explanation`. Explicit status codes include 500.

**Source:** `server/src/routes/online-exam.routes.js:1201`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/:examId/results/all

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**What it does:** Faculty-only: Get full spreadsheet data. Retrieves results all.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `attempts`, `unattempted`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:1227`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### PATCH /api/online-exam/attempts/:attemptId/grade

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**What it does:** Faculty manually grades theory/coding questions. Updates attempts grade.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `attemptId` | string | yes | Path identifier/value for attempt id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `manual_marks` | number | no | Request value for manual marks. |
| `evaluated_by` | string | no | Request value for evaluated by. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `new_score`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/online-exam.routes.js:1292`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/:examId/analytics

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**What it does:** Faculty-only deep analytics. Retrieves analytics.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `total_attempts`, `avg_score`, `topper`, `section_analytics`, `difficulty_map`, `max_possible`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/online-exam.routes.js:1336`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### POST /api/online-exam/:examId/proctor-heartbeat

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Real-time webcam proctoring check. Client sends this randomly every 10-20 seconds. Evaluates strict/soft mode penalties and tab-switch combos locally. Creates or processes proctor heartbeat.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Request value for status. |
| `face_detected` | string | no | Request value for face detected. |
| `multiple_faces` | string | no | Request value for multiple faces. |
| `tab_switched` | string | no | Request value for tab switched. |
| `timestamp` | string | no | Request value for timestamp. |

**Response:** JSON response fields observed in the handler include `status`, `message`, `success`, `error`, `warning`, `total_violations`, `deducted_marks`, `proctor_score_percent`, `auto_submit`. Explicit status codes include 403, 404, 500. Proctoring disabled

**Source:** `server/src/routes/online-exam.routes.js:1384`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/:examId/proctor-report

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","org_admin")`

**What it does:** Faculty-only: Get webcam proctoring violation report for all students. Retrieves proctor report.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `examId` | string | yes | Path identifier/value for exam id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `proctoring_enabled`, `message`, `exam_title`, `total_students`, `flagged_students`, `report`, `error`. Explicit status codes include 500. Webcam proctoring was not enabled for this exam.

**Source:** `server/src/routes/online-exam.routes.js:1521`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/student/topic-analysis

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Returns topic-wise Weak / Average / Strong breakdown for the logged-in student. Aggregates data from Online Exams, Advanced Quizzes, AND MongoDB AI quiz sessions. Retrieves student topic analysis.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `summary`, `topics`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/online-exam.routes.js:1586`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

### GET /api/online-exam/student/rank-prediction

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Returns CET rank prediction based on mock exam percentiles. Shows predicted rank range, tier, target colleges, and trend. Retrieves student rank prediction.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`. Explicit status codes include 500.

**Source:** `server/src/routes/online-exam.routes.js:1629`; handler `inline handler` in `server/src/routes/online-exam.routes.js`.

## viva.routes.js

**Mounted at:** `/api/viva`

| Method | Path | Access |
|---|---|---|
| POST | `/api/viva/initialize` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/viva/evaluate-session` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/viva/history` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/viva/:vivaId/transcript` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/viva/scheduled` | `student` |
| POST | `/api/viva/schedule` | `faculty`, `org_admin` |
| GET | `/api/viva/faculty/dashboard/:classroomId` | `faculty`, `org_admin` |
| GET | `/api/viva/faculty/student/:studentId` | `faculty`, `org_admin` |
| PATCH | `/api/viva/schedule/:scheduleId/activate` | `faculty`, `org_admin` |
| PATCH | `/api/viva/schedule/:scheduleId/complete` | `faculty`, `org_admin` |

### POST /api/viva/initialize

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Start a new Viva session (self-initiated or from a scheduled viva). Creates or processes initialize.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `topic` | string | no | Request value for topic. |
| `subject` | string | no | Request value for subject. |
| `mode` | string | no | Request value for mode. |
| `classroomId` | string | no | Request value for classroom id. |
| `scheduleId` | string | no | Request value for schedule id. |
| `thinkingTimeSec` | string | no | Request value for thinking time sec. |
| `totalQuestions` | string | no | Request value for total questions. |

**Response:** JSON response fields observed in the handler include `error`, `sessionId`, `introduction`, `systemPrompt`, `config`. Explicit status codes include 403, 404, 500.

**Source:** `server/src/routes/viva.routes.js:113`; handler `inline handler` in `server/src/routes/viva.routes.js`.

### POST /api/viva/evaluate-session

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Final step: Pass transcript + timing metadata to AI for 4-parameter evaluation. Saves result permanently to VivaRecord in MongoDB. Creates or processes evaluate session.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `transcript` | string | no | Request value for transcript. |
| `topic` | string | no | Request value for topic. |
| `subject` | string | no | Request value for subject. |
| `mode` | string | no | Request value for mode. |
| `classroomId` | string | no | Request value for classroom id. |
| `scheduleId` | string | no | Request value for schedule id. |
| `thinkingTimes` | string | no | Request value for thinking times. |
| `voiceMetadata` | object | no | Request value for voice metadata. |

**Response:** JSON response fields observed in the handler include `message`, `vivaId`, `report`, `error`. Explicit status codes include 500. Viva evaluated and saved successfully

**Source:** `server/src/routes/viva.routes.js:161`; handler `inline handler` in `server/src/routes/viva.routes.js`.

### GET /api/viva/history

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Fetch student's viva history with progress tracking data. Retrieves history.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `totalSessions`, `trend`, `persistentWeakAreas`, `avgScore`, `sessions`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/viva.routes.js:291`; handler `inline handler` in `server/src/routes/viva.routes.js`.

### GET /api/viva/:vivaId/transcript

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Get the full transcript and detailed report for a specific viva session. Retrieves transcript.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `vivaId` | string | yes | Path identifier/value for viva id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/viva.routes.js:341`; handler `inline handler` in `server/src/routes/viva.routes.js`.

### GET /api/viva/scheduled

**Auth:** `isAuthenticated`, `requireRole("student")`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `requireRole("student")`

**What it does:** Get all scheduled vivas for the student's classrooms. Retrieves scheduled.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`. Explicit status codes include 500.

**Source:** `server/src/routes/viva.routes.js:356`; handler `inline handler` in `server/src/routes/viva.routes.js`.

### POST /api/viva/schedule

**Auth:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**What it does:** Faculty schedules a class-wide viva for a specific topic. Creates or processes schedule.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Request value for classroom id. |
| `topic` | string | yes | Request value for topic. |
| `subject` | string | no | Request value for subject. |
| `mode` | string | no | Request value for mode. |
| `scheduledAt` | string (date/time) | yes | Request value for scheduled at. |
| `deadline` | string | no | Request value for deadline. |
| `thinkingTimeSec` | string | no | Request value for thinking time sec. |
| `totalQuestions` | string | no | Request value for total questions. |
| `settings` | object | no | Request value for settings. |

**Response:** JSON response fields observed in the handler include `error`, `message`, `schedule`. Explicit status codes include 201, 400, 500.

**Source:** `server/src/routes/viva.routes.js:397`; handler `inline handler` in `server/src/routes/viva.routes.js`.

### GET /api/viva/faculty/dashboard/:classroomId

**Auth:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**What it does:** Faculty dashboard: View all student viva results for a classroom. Retrieves faculty dashboard.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `totalStudents`, `totalSessions`, `classAvgScore`, `students`, `scheduledVivas`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/viva.routes.js:462`; handler `inline handler` in `server/src/routes/viva.routes.js`.

### GET /api/viva/faculty/student/:studentId

**Auth:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**What it does:** Faculty views detailed viva history for a specific student. Retrieves faculty student.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | string | yes | Path identifier/value for student id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `student`, `totalSessions`, `progressData`, `detailedRecords`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/viva.routes.js:547`; handler `inline handler` in `server/src/routes/viva.routes.js`.

### PATCH /api/viva/schedule/:scheduleId/activate

**Auth:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**What it does:** Faculty activates a scheduled viva so students can start it. Updates schedule activate.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `scheduleId` | string | yes | Path identifier/value for schedule id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `message`, `schedule`. Explicit status codes include 404, 500. Viva is now active

**Source:** `server/src/routes/viva.routes.js:585`; handler `inline handler` in `server/src/routes/viva.routes.js`.

### PATCH /api/viva/schedule/:scheduleId/complete

**Auth:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**What it does:** Faculty marks a scheduled viva as completed. Completes the requested operation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `scheduleId` | string | yes | Path identifier/value for schedule id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `message`, `schedule`. Explicit status codes include 404, 500. Viva marked as completed

**Source:** `server/src/routes/viva.routes.js:603`; handler `inline handler` in `server/src/routes/viva.routes.js`.

## certificate.routes.js

**Mounted at:** `/api/certificates`

| Method | Path | Access |
|---|---|---|
| POST | `/api/certificates` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/certificates` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PATCH | `/api/certificates/:id/status` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/certificates/trusted-domains` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/certificates/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/certificates/analytics` | `org_admin` |

### POST /api/certificates

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `student_id` | string | no | Request value for student id. |
| `title` | string | yes | Request value for title. |
| `type` | string | yes | Request value for type. |
| `issuer` | string | no | Request value for issuer. |
| `subject` | string | no | Request value for subject. |
| `certificate_date` | string (date/time) | no | Request value for certificate date. |
| `valid_until` | string | no | Request value for valid until. |
| `file_url` | string | no | Request value for file url. |
| `certificate_link` | string | no | Request value for certificate link. |
| `division_id` | string | no | Request value for division id. |
| `classroom_id` | string | no | Request value for classroom id. |
| `mode` | string | no | Request value for mode. |

**Response:** JSON response fields observed in the handler include `message`, `certificate`. Explicit status codes include 201, 400, 409, 500. Title and type are required

**Source:** `server/src/routes/certificate.routes.js:47`; handler `inline handler` in `server/src/routes/certificate.routes.js`.

### GET /api/certificates

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | no | Query value for type. |
| `subject` | string | no | Query value for subject. |
| `student_id` | string | no | Query value for student id. |
| `status` | string | no | Query value for status. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `certificates`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/certificate.routes.js:158`; handler `inline handler` in `server/src/routes/certificate.routes.js`.

### PATCH /api/certificates/:id/status

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Updates status.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Request value for status. |

**Response:** JSON response fields observed in the handler include `message`, `certificate`. Explicit status codes include 400, 403, 500. Status must be 'approved' or 'rejected'

**Source:** `server/src/routes/certificate.routes.js:205`; handler `inline handler` in `server/src/routes/certificate.routes.js`.

### GET /api/certificates/trusted-domains

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves trusted domains.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `domains`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/certificate.routes.js:246`; handler `inline handler` in `server/src/routes/certificate.routes.js`.

### DELETE /api/certificates/:id

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Certificate deleted

**Source:** `server/src/routes/certificate.routes.js:266`; handler `inline handler` in `server/src/routes/certificate.routes.js`.

### GET /api/certificates/analytics

**Auth:** `isAuthenticated`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole('org_admin')`

**What it does:** Retrieves analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `total`, `verified`, `byType`, `topIssuers`, `topStudents`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/certificate.routes.js:294`; handler `inline handler` in `server/src/routes/certificate.routes.js`.

