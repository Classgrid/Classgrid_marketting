This reference is generated from the current Express route definitions and their handlers. It documents route-level authentication and authorization; deployment-wide middleware may add further checks.

## Conventions

- Base API origin: `https://api.classgrid.in`
- Authentication: authenticated routes use the Classgrid session/JWT recognized by `isAuthenticated`.
- JSON is the default request and response format unless an endpoint explicitly accepts multipart data or redirects.
- Path parameters are always required.
- A field marked `no` means the static handler scan did not find a direct required-field check; business rules may still make it conditionally required.
- Role checks can also accept `super_admin` through the shared authorization middleware where implemented.

This document contains **67 route definitions** from 5 source files.

## academic.routes.js

**Mounted at:** `/api/academic`

| Method | Path | Access |
|---|---|---|
| GET | `/api/academic` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/academic` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/academic

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `academicInfo`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/academic.routes.js:23`; handler `inline handler` in `server/src/routes/academic.routes.js`.

### PUT /api/academic

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Updates resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `field` | string | no | Request value for field. |

**Response:** JSON response fields observed in the handler include `message`, `academicInfo`. Explicit status codes include 400, 500. No valid fields provided

**Source:** `server/src/routes/academic.routes.js:59`; handler `inline handler` in `server/src/routes/academic.routes.js`.

## academic-plan.routes.js

**Mounted at:** `/api/academic-plans`

| Method | Path | Access |
|---|---|---|
| POST | `/api/academic-plans/classrooms/:classroomId` | Authenticated classroom owner. |
| GET | `/api/academic-plans/classrooms/:classroomId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/academic-plans/:planId/units` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/academic-plans/units/:unitId/topics` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PATCH | `/api/academic-plans/topics/:topicId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/academic-plans/units/:unitId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/academic-plans/topics/:topicId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/academic-plans/me/plans` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### POST /api/academic-plans/classrooms/:classroomId

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Creates or processes classrooms.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `start_date` | string (date/time) | no | Request value for start date. |
| `end_date` | string (date/time) | no | Request value for end date. |

**Response:** JSON response fields observed in the handler include `message`, `plan`. Explicit status codes include 201, 404, 500. Classroom not found

**Source:** `server/src/routes/academic-plan.routes.js:15`; handler `inline handler` in `server/src/routes/academic-plan.routes.js`.

### GET /api/academic-plans/classrooms/:classroomId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves classrooms.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `plan`, `progress`, `units`. Explicit status codes include 403, 404, 500. Not a member of this classroom

**Source:** `server/src/routes/academic-plan.routes.js:57`; handler `inline handler` in `server/src/routes/academic-plan.routes.js`.

### POST /api/academic-plans/:planId/units

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes units.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `planId` | string | yes | Path identifier/value for plan id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `unit_name` | string | no | Request value for unit name. |
| `order_index` | number | no | Request value for order index. |

**Response:** JSON response fields observed in the handler include `message`, `unit`. Explicit status codes include 201, 500. Unit added

**Source:** `server/src/routes/academic-plan.routes.js:139`; handler `inline handler` in `server/src/routes/academic-plan.routes.js`.

### POST /api/academic-plans/units/:unitId/topics

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes units topics.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `unitId` | string | yes | Path identifier/value for unit id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `topic_name` | string | no | Request value for topic name. |
| `planned_start_date` | string (date/time) | no | Request value for planned start date. |
| `planned_end_date` | string (date/time) | no | Request value for planned end date. |
| `lectures_count` | number | no | Request value for lectures count. |
| `order_index` | number | no | Request value for order index. |

**Response:** JSON response fields observed in the handler include `message`, `topic`. Explicit status codes include 201, 500. Topic added

**Source:** `server/src/routes/academic-plan.routes.js:166`; handler `inline handler` in `server/src/routes/academic-plan.routes.js`.

### PATCH /api/academic-plans/topics/:topicId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Updates topics.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `topicId` | string | yes | Path identifier/value for topic id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Request value for status. |
| `actual_start_date` | string (date/time) | yes | Request value for actual start date. |
| `actual_end_date` | string (date/time) | yes | Request value for actual end date. |
| `order_index` | number | no | Request value for order index. |
| `topic_name` | string | no | Request value for topic name. |
| `planned_start_date` | string (date/time) | no | Request value for planned start date. |
| `planned_end_date` | string (date/time) | no | Request value for planned end date. |

**Response:** JSON response fields observed in the handler include `message`, `topic`. Explicit status codes include 500. Topic updated

**Source:** `server/src/routes/academic-plan.routes.js:196`; handler `inline handler` in `server/src/routes/academic-plan.routes.js`.

### DELETE /api/academic-plans/units/:unitId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes units.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `unitId` | string | yes | Path identifier/value for unit id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Unit deleted

**Source:** `server/src/routes/academic-plan.routes.js:231`; handler `inline handler` in `server/src/routes/academic-plan.routes.js`.

### DELETE /api/academic-plans/topics/:topicId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes topics.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `topicId` | string | yes | Path identifier/value for topic id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Topic deleted

**Source:** `server/src/routes/academic-plan.routes.js:241`; handler `inline handler` in `server/src/routes/academic-plan.routes.js`.

### GET /api/academic-plans/me/plans

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves me plans.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `plans`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/academic-plan.routes.js:256`; handler `inline handler` in `server/src/routes/academic-plan.routes.js`.

## course.routes.js

**Mounted at:** `/api/courses`

| Method | Path | Access |
|---|---|---|
| POST | `/api/courses` | `org_admin`, `faculty` |
| GET | `/api/courses` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/courses/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/courses/:id` | `org_admin`, `faculty` |
| DELETE | `/api/courses/:id` | `org_admin` |
| POST | `/api/courses/:id/subjects` | `org_admin`, `faculty` |
| PUT | `/api/courses/subjects/:subjectId` | `org_admin`, `faculty` |
| DELETE | `/api/courses/subjects/:subjectId` | `org_admin`, `faculty` |
| GET | `/api/courses/student/my-courses` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/courses/:id/assign-faculty` | `org_admin` |
| DELETE | `/api/courses/faculty-assignment/:assignmentId` | `org_admin` |
| GET | `/api/courses/:id/faculty` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/courses/faculty/my-subjects` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/courses/org/faculty-list` | `org_admin` |
| POST | `/api/courses/:id/bulk-assign-faculty` | `org_admin` |
| POST | `/api/courses/:id/generate-classrooms` | `org_admin` |

### POST /api/courses

**Auth:** `isAuthenticated`, `requireRole('org_admin','faculty')`

**Roles:** `org_admin`, `faculty`

**Middleware:** `isAuthenticated`, `requireRole('org_admin','faculty')`

**What it does:** CREATE COURSE. Creates or processes resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Request value for name. |
| `type` | string | no | Request value for type. |
| `description` | string | no | Request value for description. |
| `year` | number | no | Request value for year. |
| `standard` | string | no | Request value for standard. |
| `course_name` | string | no | Request value for course name. |
| `branch` | string | no | Request value for branch. |
| `total_semesters` | number | no | Request value for total semesters. |

**Response:** JSON response fields observed in the handler include `message`, `course`. Explicit status codes include 201, 400, 500. Course name is required

**Source:** `server/src/routes/course.routes.js:40`; handler `inline handler` in `server/src/routes/course.routes.js`.

### GET /api/courses

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** LIST COURSES. Retrieves resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `courses`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/course.routes.js:67`; handler `inline handler` in `server/src/routes/course.routes.js`.

### GET /api/courses/:id

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** DETAIL + SUBJECTS. Retrieves resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `course`, `subjects`, `bySemester`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/course.routes.js:103`; handler `inline handler` in `server/src/routes/course.routes.js`.

### PUT /api/courses/:id

**Auth:** `isAuthenticated`, `requireRole('org_admin','faculty')`

**Roles:** `org_admin`, `faculty`

**Middleware:** `isAuthenticated`, `requireRole('org_admin','faculty')`

**What it does:** UPDATE COURSE. Updates resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | no | Request value for name. |
| `description` | string | no | Request value for description. |
| `year` | number | no | Request value for year. |
| `standard` | string | no | Request value for standard. |
| `course_name` | string | no | Request value for course name. |
| `branch` | string | no | Request value for branch. |
| `total_semesters` | number | no | Request value for total semesters. |

**Response:** JSON response fields observed in the handler include `message`, `course`. Explicit status codes include 500. Course updated!

**Source:** `server/src/routes/course.routes.js:129`; handler `inline handler` in `server/src/routes/course.routes.js`.

### DELETE /api/courses/:id

**Auth:** `isAuthenticated`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole('org_admin')`

**What it does:** Deletes resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Course deleted

**Source:** `server/src/routes/course.routes.js:147`; handler `inline handler` in `server/src/routes/course.routes.js`.

### POST /api/courses/:id/subjects

**Auth:** `isAuthenticated`, `requireRole('org_admin','faculty')`

**Roles:** `org_admin`, `faculty`

**Middleware:** `isAuthenticated`, `requireRole('org_admin','faculty')`

**What it does:** ADD SUBJECT TO COURSE. Creates or processes subjects.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject_name` | string | yes | Request value for subject name. |
| `subject_code` | string | no | Request value for subject code. |
| `semester` | string | no | Request value for semester. |
| `credit_hours` | number | no | Request value for credit hours. |
| `subject_type` | string | no | Request value for subject type. |
| `syllabus_url` | string | no | Request value for syllabus url. |
| `resources` | string | no | Request value for resources. |

**Response:** JSON response fields observed in the handler include `message`, `subject`. Explicit status codes include 201, 400, 500. Subject name is required

**Source:** `server/src/routes/course.routes.js:163`; handler `inline handler` in `server/src/routes/course.routes.js`.

### PUT /api/courses/subjects/:subjectId

**Auth:** `isAuthenticated`, `requireRole('org_admin','faculty')`

**Roles:** `org_admin`, `faculty`

**Middleware:** `isAuthenticated`, `requireRole('org_admin','faculty')`

**What it does:** UPDATE SUBJECT. Updates subjects.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subjectId` | string | yes | Path identifier/value for subject id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject_name` | string | no | Request value for subject name. |
| `subject_code` | string | no | Request value for subject code. |
| `semester` | string | no | Request value for semester. |
| `credit_hours` | number | no | Request value for credit hours. |
| `subject_type` | string | no | Request value for subject type. |
| `syllabus_url` | string | no | Request value for syllabus url. |
| `resources` | string | no | Request value for resources. |

**Response:** JSON response fields observed in the handler include `message`, `subject`. Explicit status codes include 500. Subject updated!

**Source:** `server/src/routes/course.routes.js:195`; handler `inline handler` in `server/src/routes/course.routes.js`.

### DELETE /api/courses/subjects/:subjectId

**Auth:** `isAuthenticated`, `requireRole('org_admin','faculty')`

**Roles:** `org_admin`, `faculty`

**Middleware:** `isAuthenticated`, `requireRole('org_admin','faculty')`

**What it does:** Deletes subjects.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subjectId` | string | yes | Path identifier/value for subject id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Subject removed

**Source:** `server/src/routes/course.routes.js:213`; handler `inline handler` in `server/src/routes/course.routes.js`.

### GET /api/courses/student/my-courses

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** COURSES (Student). Retrieves student my courses.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `courses`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/course.routes.js:229`; handler `inline handler` in `server/src/routes/course.routes.js`.

### POST /api/courses/:id/assign-faculty

**Auth:** `isAuthenticated`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole('org_admin')`

**What it does:** ASSIGN FACULTY TO SUBJECT+DIVISION. Creates or processes assign faculty.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `teacher_id` | string | yes | Request value for teacher id. |
| `subject_id` | string | yes | Request value for subject id. |
| `division_id` | string | no | Request value for division id. |
| `role` | string | yes | Request value for role. |

**Response:** JSON response fields observed in the handler include `message`, `assignment`. Explicit status codes include 201, 400, 500. teacher_id and role are required

**Source:** `server/src/routes/course.routes.js:302`; handler `inline handler` in `server/src/routes/course.routes.js`.

### DELETE /api/courses/faculty-assignment/:assignmentId

**Auth:** `isAuthenticated`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole('org_admin')`

**What it does:** REMOVE FACULTY ASSIGNMENT. Deletes faculty assignment.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `assignmentId` | string | yes | Path identifier/value for assignment id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Assignment removed

**Source:** `server/src/routes/course.routes.js:367`; handler `inline handler` in `server/src/routes/course.routes.js`.

### GET /api/courses/:id/faculty

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** ASSIGNMENTS FOR A COURSE (Admin view). Retrieves faculty.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `assignments`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/course.routes.js:380`; handler `inline handler` in `server/src/routes/course.routes.js`.

### GET /api/courses/faculty/my-subjects

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** FACULTY SELF-VIEW: "What do I teach?". Retrieves faculty my subjects.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `assignments`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/course.routes.js:434`; handler `inline handler` in `server/src/routes/course.routes.js`.

### GET /api/courses/org/faculty-list

**Auth:** `isAuthenticated`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole('org_admin')`

**What it does:** LIST FACULTY (for dropdown when assigning). Retrieves org faculty list.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `faculty`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/course.routes.js:483`; handler `inline handler` in `server/src/routes/course.routes.js`.

### POST /api/courses/:id/bulk-assign-faculty

**Auth:** `isAuthenticated`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole('org_admin')`

**What it does:** Processes the requested bulk operation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `teacher_id` | string | yes | Request value for teacher id. |
| `division_id` | string | no | Request value for division id. |
| `subject_ids` | array | no | Request value for subject ids. |
| `role` | string | yes | Request value for role. |

**Response:** JSON response fields observed in the handler include `message`, `assignments`. Explicit status codes include 201, 400, 500. teacher_id, role, and subject_ids[] are required

**Source:** `server/src/routes/course.routes.js:504`; handler `inline handler` in `server/src/routes/course.routes.js`.

### POST /api/courses/:id/generate-classrooms

**Auth:** `isAuthenticated`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole('org_admin')`

**What it does:** Generates the requested resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `created`, `skipped`, `classrooms`. Explicit status codes include 201, 400, 404, 500. Course not found

**Source:** `server/src/routes/course.routes.js:565`; handler `inline handler` in `server/src/routes/course.routes.js`.

## classroom.routes.js

**Mounted at:** `/api/classrooms`, `/api/classroom`

| Method | Path | Access |
|---|---|---|
| GET | `/api/classrooms/proxy/pdf` / `/api/classroom/proxy/pdf` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/classrooms/hf-summarize` / `/api/classroom/hf-summarize` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/classrooms` / `/api/classroom` | `teacher`, `faculty`, `org_admin`, `super_admin` |
| PUT | `/api/classrooms/:id/cover` / `/api/classroom/:id/cover` | Authenticated classroom owner. |
| GET | `/api/classrooms` / `/api/classroom` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/classrooms/all-requests` / `/api/classroom/all-requests` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/classrooms/my-requests` / `/api/classroom/my-requests` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/classrooms/discover` / `/api/classroom/discover` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/classrooms/my-organization` / `/api/classroom/my-organization` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/classrooms/join-by-code` / `/api/classroom/join-by-code` | Authenticated user with access to the classroom. |
| POST | `/api/classrooms/:id/join` / `/api/classroom/:id/join` | Authenticated user with access to the classroom. |
| GET | `/api/classrooms/:id/requests` / `/api/classroom/:id/requests` | Authenticated classroom owner. |
| PUT | `/api/classrooms/:id/requests/:requestId` / `/api/classroom/:id/requests/:requestId` | Authenticated classroom owner. |
| PUT | `/api/classrooms/:id/requests-bulk` / `/api/classroom/:id/requests-bulk` | Authenticated classroom owner. |
| GET | `/api/classrooms/:id` / `/api/classroom/:id` | Authenticated classroom member. |
| PUT | `/api/classrooms/:id` / `/api/classroom/:id` | Authenticated classroom owner. |
| DELETE | `/api/classrooms/:id` / `/api/classroom/:id` | Authenticated classroom owner. |
| GET | `/api/classrooms/:id/meetings` / `/api/classroom/:id/meetings` | Authenticated classroom member. |
| GET | `/api/classrooms/:id/members` / `/api/classroom/:id/members` | Authenticated classroom member. |
| DELETE | `/api/classrooms/:id/members/:userId` / `/api/classroom/:id/members/:userId` | Authenticated classroom owner. |
| POST | `/api/classrooms/:id/upload-urls` / `/api/classroom/:id/upload-urls` | Authenticated classroom owner. |
| POST | `/api/classrooms/:id/content/:type` / `/api/classroom/:id/content/:type` | Authenticated classroom owner. |
| POST | `/api/classrooms/:id/resend-notification` / `/api/classroom/:id/resend-notification` | Authenticated classroom owner. |
| GET | `/api/classrooms/:id/content/:type` / `/api/classroom/:id/content/:type` | Authenticated classroom member. |
| POST | `/api/classrooms/:id/notify` / `/api/classroom/:id/notify` | Authenticated classroom owner. |
| GET | `/api/classrooms/:id/students` / `/api/classroom/:id/students` | Authenticated classroom member. |
| PUT | `/api/classrooms/:id/content/:type/:contentId` / `/api/classroom/:id/content/:type/:contentId` | Authenticated classroom owner. |
| PUT | `/api/classrooms/:id/content/materials/:contentId/replace` / `/api/classroom/:id/content/materials/:contentId/replace` | Authenticated classroom owner. |
| DELETE | `/api/classrooms/:id/content/:type/:contentId` / `/api/classroom/:id/content/:type/:contentId` | Authenticated classroom owner. |
| POST | `/api/classrooms/:id/content/materials/:contentId/summarize` / `/api/classroom/:id/content/materials/:contentId/summarize` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/classrooms/academic-status/:userId` / `/api/classroom/academic-status/:userId` | Public endpoint unless an upstream platform gate applies. |

### GET /api/classrooms/proxy/pdf

**Aliases:** `/api/classroom/proxy/pdf`

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves proxy pdf.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `url` | string | no | Query value for url. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 400, 403, 500. Missing URL parameter

**Source:** `server/src/routes/classroom.routes.js:60`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### POST /api/classrooms/hf-summarize

**Aliases:** `/api/classroom/hf-summarize`

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes hf summarize.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `text` | string | yes | Request value for text. |
| `title` | string | no | Request value for title. |

**Response:** JSON response fields observed in the handler include `message`, `summary`, `error`. Explicit status codes include 400, 500. Missing or invalid 'text' field

**Source:** `server/src/routes/classroom.routes.js:92`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### POST /api/classrooms

**Aliases:** `/api/classroom`

**Auth:** `isAuthenticated`, `requireRole("teacher","faculty","org_admin","super_admin")`, `requireOrganization`, `attachInstitutionProfile()`

**Roles:** `teacher`, `faculty`, `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("teacher","faculty","org_admin","super_admin")`, `requireOrganization`, `attachInstitutionProfile()`, `validateClassroom`

**What it does:** Creates or processes resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Request value for name. |
| `description` | string | no | Request value for description. |
| `subject` | string | yes | Request value for subject. |
| `subjectSlug` | string | no | Request value for subject slug. |
| `settings` | object | no | Request value for settings. |
| `course_type` | string | no | Request value for course type. |
| `academic_year` | number | no | Request value for academic year. |
| `term` | string | no | Request value for term. |
| `stream` | string | no | Request value for stream. |
| `year` | number | no | Request value for year. |
| `branch` | string | no | Request value for branch. |
| `semester` | string | no | Request value for semester. |
| `standard` | string | no | Request value for standard. |
| `division` | string | no | Request value for division. |
| `division_id` | string | no | Request value for division id. |
| `sub_batch` | string | no | Request value for sub batch. |
| `sub_batch_id` | string | no | Request value for sub batch id. |
| `subject_id` | string | yes | Request value for subject id. |
| `class_teacher` | string | no | Request value for class teacher. |
| `class_teacher_id` | string | no | Request value for class teacher id. |
| `assistant_teacher` | string | no | Request value for assistant teacher. |
| `assistant_teacher_id` | string | no | Request value for assistant teacher id. |
| `mentor` | string | no | Request value for mentor. |
| `mentor_id` | string | no | Request value for mentor id. |
| `is_entrance_batch` | boolean | no | Request value for is entrance batch. |
| `entrance_exam` | string | no | Request value for entrance exam. |
| `entrance_course` | string | no | Request value for entrance course. |

**Response:** JSON response fields observed in the handler include `message`, `classroom`, `error`. Explicit status codes include 201, 400, 500. Name and subject are required

**Source:** `server/src/routes/classroom.routes.js:127`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### PUT /api/classrooms/:id/cover

**Aliases:** `/api/classroom/:id/cover`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`, `upload.single("coverImage")`

**What it does:** Updates cover.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `coverImage` | string | no | Request value for cover image. |

**Response:** JSON response fields observed in the handler include `message`, `coverImage`. Explicit status codes include 400, 404, 500. No image file provided

**Source:** `server/src/routes/classroom.routes.js:203`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms

**Aliases:** `/api/classroom`

**Auth:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**What it does:** Retrieves resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `classrooms`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/classroom.routes.js:232`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/all-requests

**Aliases:** `/api/classroom/all-requests`

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves all requests.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `requests`. Explicit status codes include 403, 500. Teachers only

**Source:** `server/src/routes/classroom.routes.js:310`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/my-requests

**Aliases:** `/api/classroom/my-requests`

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves my requests.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `requests`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/classroom.routes.js:396`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/discover

**Aliases:** `/api/classroom/discover`

**Auth:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**What it does:** Retrieves discover.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `search` | string | no | Query value for search. |
| `subject` | string | no | Query value for subject. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `classrooms`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/classroom.routes.js:445`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/my-organization

**Aliases:** `/api/classroom/my-organization`

**Auth:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**What it does:** Retrieves my organization.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `classrooms`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/classroom.routes.js:515`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### POST /api/classrooms/join-by-code

**Aliases:** `/api/classroom/join-by-code`

**Auth:** `isAuthenticated`, `enforceClassroomAccess`

**Roles:** Authenticated user with access to the classroom.

**Middleware:** `isAuthenticated`, `joinClassroomLimiter`, `enforceClassroomAccess`, `validateJoinCode`

**What it does:** Joins the requested resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classCode` | string | yes | Request value for class code. |
| `requestMessage` | string | no | Request value for request message. |

**Response:** JSON response fields observed in the handler include `message`, `code`, `classroomName`, `membership`. Explicit status codes include 201, 400, 403, 404, 500. Class code is required

**Source:** `server/src/routes/classroom.routes.js:536`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### POST /api/classrooms/:id/join

**Aliases:** `/api/classroom/:id/join`

**Auth:** `isAuthenticated`, `enforceClassroomAccess`

**Roles:** Authenticated user with access to the classroom.

**Middleware:** `isAuthenticated`, `joinClassroomLimiter`, `enforceClassroomAccess`

**What it does:** Joins the requested resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `requestMessage` | string | no | Request value for request message. |

**Response:** JSON response fields observed in the handler include `message`, `code`. Explicit status codes include 201, 400, 403, 404, 500. Classroom not found

**Source:** `server/src/routes/classroom.routes.js:703`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/:id/requests

**Aliases:** `/api/classroom/:id/requests`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Retrieves requests.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `requests`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/classroom.routes.js:839`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### PUT /api/classrooms/:id/requests/:requestId

**Aliases:** `/api/classroom/:id/requests/:requestId`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Updates requests.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `requestId` | string | yes | Path identifier/value for request id. |
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `action` | string | no | Request value for action. |
| `rejectionReason` | string | no | Request value for rejection reason. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 404, 500. Action must be 'approve' or 'reject'

**Source:** `server/src/routes/classroom.routes.js:874`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### PUT /api/classrooms/:id/requests-bulk

**Aliases:** `/api/classroom/:id/requests-bulk`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Updates requests bulk.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `requestIds` | string | yes | Request value for request ids. |
| `action` | string | no | Request value for action. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. requestIds array required

**Source:** `server/src/routes/classroom.routes.js:945`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/:id

**Aliases:** `/api/classroom/:id`

**Auth:** `isAuthenticated`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `requireClassroomMember`

**What it does:** Retrieves resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `code`, `missingFields`, `missingIdLabel`, `classroom`, `isOwner`. Explicit status codes include 403, 404, 500. Classroom not found

**Source:** `server/src/routes/classroom.routes.js:1026`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### PUT /api/classrooms/:id

**Aliases:** `/api/classroom/:id`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Updates resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `field` | string (date/time) | no | Request value for field. |

**Response:** JSON response fields observed in the handler include `message`, `classroom`. Explicit status codes include 500. Classroom updated

**Source:** `server/src/routes/classroom.routes.js:1111`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### DELETE /api/classrooms/:id

**Aliases:** `/api/classroom/:id`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Deletes resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Classroom deleted successfully

**Source:** `server/src/routes/classroom.routes.js:1138`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/:id/meetings

**Aliases:** `/api/classroom/:id/meetings`

**Auth:** `isAuthenticated`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `requireClassroomMember`

**What it does:** Retrieves meetings.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `meetings`, `message`. Explicit status codes include 500. Server error fetching meetings

**Source:** `server/src/routes/classroom.routes.js:1160`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/:id/members

**Aliases:** `/api/classroom/:id/members`

**Auth:** `isAuthenticated`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `requireClassroomMember`

**What it does:** Retrieves members.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `members`, `total`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/classroom.routes.js:1181`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### DELETE /api/classrooms/:id/members/:userId

**Aliases:** `/api/classroom/:id/members/:userId`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Deletes members.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |
| `userId` | string | yes | Path identifier/value for user id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 404, 500. Member not found

**Source:** `server/src/routes/classroom.routes.js:1220`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### POST /api/classrooms/:id/upload-urls

**Aliases:** `/api/classroom/:id/upload-urls`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Uploads the supplied resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `files` | array | yes | Request value for files. |

**Response:** JSON response fields observed in the handler include `message`, `urls`. Explicit status codes include 400, 500. Files array required

**Source:** `server/src/routes/classroom.routes.js:1250`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### POST /api/classrooms/:id/content/:type

**Aliases:** `/api/classroom/:id/content/:type`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Creates or processes content.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | yes | Path identifier/value for type. |
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | yes | Request value for title. |
| `description` | string | no | Request value for description. |
| `message` | string | yes | Request value for message. |
| `tags` | array | no | Request value for tags. |
| `link` | string | yes | Request value for link. |
| `provider` | string | no | Request value for provider. |
| `uploaded_files` | array | no | Request value for uploaded files. |

**Response:** JSON response fields observed in the handler include `message`, `items`, `item`, `emailJobsCreated`. Explicit status codes include 201, 400, 404, 500. Invalid content type

**Source:** `server/src/routes/classroom.routes.js:1280`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### POST /api/classrooms/:id/resend-notification

**Aliases:** `/api/classroom/:id/resend-notification`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Resends the requested information.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | no | Request value for type. |

**Response:** JSON response fields observed in the handler include `message`, `resetCount`. Explicit status codes include 500. No failed email jobs found for this classroom

**Source:** `server/src/routes/classroom.routes.js:1453`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/:id/content/:type

**Aliases:** `/api/classroom/:id/content/:type`

**Auth:** `isAuthenticated`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `requireClassroomMember`

**What it does:** Retrieves content.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | yes | Path identifier/value for type. |
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `content`, `source`. Explicit status codes include 400, 500. Invalid content type

**Source:** `server/src/routes/classroom.routes.js:1477`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### POST /api/classrooms/:id/notify

**Aliases:** `/api/classroom/:id/notify`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Creates or processes notify.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | yes | Request value for title. |
| `message` | string | yes | Request value for message. |
| `type` | string | no | Request value for type. |
| `link` | string | no | Request value for link. |

**Response:** JSON response fields observed in the handler include `message`, `count`. Explicit status codes include 400, 500. Title and message are required

**Source:** `server/src/routes/classroom.routes.js:1531`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/:id/students

**Aliases:** `/api/classroom/:id/students`

**Auth:** `isAuthenticated`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `requireClassroomMember`

**What it does:** Retrieves students.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `students`, `total`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/classroom.routes.js:1571`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### PUT /api/classrooms/:id/content/:type/:contentId

**Aliases:** `/api/classroom/:id/content/:type/:contentId`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Updates content.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string (date/time) | yes | Path identifier/value for type. |
| `contentId` | string | yes | Path identifier/value for content id. |
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `field` | string (date/time) | no | Request value for field. |
| `content` | string (date/time) | no | Request value for content. |

**Response:** JSON response fields observed in the handler include `message`, `item`. Explicit status codes include 400, 500. Invalid content type

**Source:** `server/src/routes/classroom.routes.js:1618`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### PUT /api/classrooms/:id/content/materials/:contentId/replace

**Aliases:** `/api/classroom/:id/content/materials/:contentId/replace`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`, `upload.single("file")`

**What it does:** Updates content materials replace.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |
| `contentId` | string | yes | Path identifier/value for content id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `message`, `item`. Explicit status codes include 400, 404, 500. No file provided

**Source:** `server/src/routes/classroom.routes.js:1671`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### DELETE /api/classrooms/:id/content/:type/:contentId

**Aliases:** `/api/classroom/:id/content/:type/:contentId`

**Auth:** `isAuthenticated`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `requireClassroomOwner`

**What it does:** Deletes content.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | string | yes | Path identifier/value for type. |
| `contentId` | string | yes | Path identifier/value for content id. |
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. Invalid content type

**Source:** `server/src/routes/classroom.routes.js:1721`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### POST /api/classrooms/:id/content/materials/:contentId/summarize

**Aliases:** `/api/classroom/:id/content/materials/:contentId/summarize`

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes content materials summarize.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |
| `contentId` | string | yes | Path identifier/value for content id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `summary`, `cached`, `message`. Explicit status codes include 400, 404, 500. Material not found

**Source:** `server/src/routes/classroom.routes.js:1745`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

### GET /api/classrooms/academic-status/:userId

**Aliases:** `/api/classroom/academic-status/:userId`

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Retrieves academic status.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | string | yes | Path identifier/value for user id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `status`. Explicit status codes include 404, 500. User not found

**Source:** `server/src/routes/classroom.routes.js:1830`; handler `inline handler` in `server/src/routes/classroom.routes.js`.

## timetable.routes.js

**Mounted at:** `/api/timetable`

| Method | Path | Access |
|---|---|---|
| GET | `/api/timetable/division/:divisionId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/timetable/division/:divisionId/today` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/timetable/me/today` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/timetable/division/:divisionId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/timetable/division/:divisionId/bulk` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/timetable/:slotId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/timetable/:slotId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/timetable/extra` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/timetable/extra/division/:divisionId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/timetable/extra/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/timetable/division/:divisionId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves division.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `divisionId` | string | yes | Path identifier/value for division id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `slots`, `grouped`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/timetable.routes.js:67`; handler `inline handler` in `server/src/routes/timetable.routes.js`.

### GET /api/timetable/division/:divisionId/today

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves division today.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `divisionId` | string | yes | Path identifier/value for division id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `schedule`, `day`, `date`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/timetable.routes.js:95`; handler `inline handler` in `server/src/routes/timetable.routes.js`.

### GET /api/timetable/me/today

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves me today.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `schedule`, `day`, `date`, `message`. Explicit status codes include 500. No division assigned

**Source:** `server/src/routes/timetable.routes.js:139`; handler `inline handler` in `server/src/routes/timetable.routes.js`.

### POST /api/timetable/division/:divisionId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes division.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `divisionId` | string | yes | Path identifier/value for division id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `day` | number | no | Request value for day. |
| `start_time` | string | no | Request value for start time. |
| `end_time` | string | no | Request value for end time. |
| `subject` | string | no | Request value for subject. |
| `teacher_name` | string | no | Request value for teacher name. |
| `teacher_id` | string | no | Request value for teacher id. |
| `room` | string | no | Request value for room. |
| `type` | string | no | Request value for type. |
| `force` | string | yes | Request value for force. |

**Response:** JSON response fields observed in the handler include `message`, `conflict`, `needs_force`, `slot`. Explicit status codes include 201, 403, 409, 500. Students cannot manage timetable

**Source:** `server/src/routes/timetable.routes.js:221`; handler `inline handler` in `server/src/routes/timetable.routes.js`.

### POST /api/timetable/division/:divisionId/bulk

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Processes the requested bulk operation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `divisionId` | string | yes | Path identifier/value for division id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `day` | number | yes | Request value for day. |
| `slots` | string | no | Request value for slots. |

**Response:** JSON response fields observed in the handler include `message`, `slots`. Explicit status codes include 400, 403, 500. Students cannot manage timetable

**Source:** `server/src/routes/timetable.routes.js:277`; handler `inline handler` in `server/src/routes/timetable.routes.js`.

### PUT /api/timetable/:slotId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Updates resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `slotId` | string | yes | Path identifier/value for slot id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | no | Request value for subject. |
| `teacher_name` | string | no | Request value for teacher name. |
| `teacher_id` | string | no | Request value for teacher id. |
| `room` | string | no | Request value for room. |
| `type` | string | no | Request value for type. |
| `start_time` | string | no | Request value for start time. |
| `end_time` | string | no | Request value for end time. |

**Response:** JSON response fields observed in the handler include `message`, `slot`. Explicit status codes include 403, 500. Students cannot manage timetable

**Source:** `server/src/routes/timetable.routes.js:332`; handler `inline handler` in `server/src/routes/timetable.routes.js`.

### DELETE /api/timetable/:slotId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `slotId` | string | yes | Path identifier/value for slot id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 403, 500. Students cannot manage timetable

**Source:** `server/src/routes/timetable.routes.js:366`; handler `inline handler` in `server/src/routes/timetable.routes.js`.

### POST /api/timetable/extra

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes extra.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `division_id` | string | no | Request value for division id. |
| `date` | string (date/time) | no | Request value for date. |
| `start_time` | string | no | Request value for start time. |
| `end_time` | string | no | Request value for end time. |
| `subject` | string | no | Request value for subject. |
| `teacher_name` | string | no | Request value for teacher name. |
| `teacher_id` | string | no | Request value for teacher id. |
| `room` | string | no | Request value for room. |
| `force` | string | yes | Request value for force. |

**Response:** JSON response fields observed in the handler include `message`, `conflict`, `needs_force`, `lecture`. Explicit status codes include 201, 403, 409, 500. Students cannot add extra lectures

**Source:** `server/src/routes/timetable.routes.js:388`; handler `inline handler` in `server/src/routes/timetable.routes.js`.

### GET /api/timetable/extra/division/:divisionId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves extra division.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `divisionId` | string | yes | Path identifier/value for division id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `extras`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/timetable.routes.js:437`; handler `inline handler` in `server/src/routes/timetable.routes.js`.

### DELETE /api/timetable/extra/:id

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes extra.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 403, 500. Not allowed

**Source:** `server/src/routes/timetable.routes.js:460`; handler `inline handler` in `server/src/routes/timetable.routes.js`.

