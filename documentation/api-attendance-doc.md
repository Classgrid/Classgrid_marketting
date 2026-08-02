This reference is generated from the current Express route definitions and their handlers. It documents route-level authentication and authorization; deployment-wide middleware may add further checks.

## Conventions

- Base API origin: `https://api.classgrid.in`
- Authentication: authenticated routes use the Classgrid session/JWT recognized by `isAuthenticated`.
- JSON is the default request and response format unless an endpoint explicitly accepts multipart data or redirects.
- Path parameters are always required.
- A field marked `no` means the static handler scan did not find a direct required-field check; business rules may still make it conditionally required.
- Role checks can also accept `super_admin` through the shared authorization middleware where implemented.

This document contains **50 route definitions** from 4 source files.

## attendance.routes.js

**Mounted at:** `/api/attendance`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| GET | `/api/attendance/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/attendance/my-overview` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/attendance/session/:sessionId/detail` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/attendance/my-detailed` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/attendance/:classroomId/start` | Authenticated classroom owner. |
| POST | `/api/attendance/:classroomId/quick-mark` | Authenticated classroom owner. |
| POST | `/api/attendance/:classroomId/stop` | Authenticated classroom owner. |
| POST | `/api/attendance/:classroomId/mark` | Authenticated classroom member. |
| GET | `/api/attendance/:classroomId/report` | Authenticated classroom owner. |
| GET | `/api/attendance/:classroomId/active` | Authenticated classroom member. |
| GET | `/api/attendance/:classroomId/suspicious` | Authenticated classroom owner. |
| POST | `/api/attendance/:classroomId/manual-override` | Authenticated classroom owner. |
| GET | `/api/attendance/:classroomId/sessions` | Authenticated classroom owner. |
| GET | `/api/attendance/:classroomId/report` | Authenticated classroom owner. |
| GET | `/api/attendance/:classroomId/my-attendance` | Authenticated classroom member. |
| POST | `/api/attendance/appeal` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/attendance/appeals` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PATCH | `/api/attendance/appeal/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/attendance/my-appeals` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/attendance/dashboard/submit` | `faculty`, `org_admin` |
| GET | `/api/attendance/dashboard/register/:hierarchyId` | `faculty`, `org_admin` |
| GET | `/api/attendance/analytics/student/:studentId/hierarchy/:hierarchyId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/attendance/analytics/batch/:hierarchyId` | `faculty`, `org_admin` |
| POST | `/api/attendance/leave/apply` | `student` |
| GET | `/api/attendance/leave/pending/:hierarchyId` | `faculty`, `org_admin` |
| GET | `/api/attendance/leave/history/:studentId?` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/attendance/leave/process/:leaveRequestId` | `faculty`, `org_admin` |

### GET /api/attendance/institution-profile

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**What it does:** Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `attendance_profile`, `learner_record_profile`.

**Source:** `server/src/routes/attendance.routes.js:43`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/my-overview

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves my overview.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `startDate` | string (date/time) | no | Query value for start date. |
| `endDate` | string (date/time) | no | Query value for end date. |
| `month` | number | no | Query value for month. |
| `year` | number | no | Query value for year. |
| `classroom` | string | no | Query value for classroom. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `startDate`, `endDate`, `overall`, `classrooms`. Explicit status codes include 400, 500. Invalid date parameters

**Source:** `server/src/routes/attendance.routes.js:131`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/session/:sessionId/detail

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves session detail.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | yes | Path identifier/value for session id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `session`, `classroom`, `summary`, `students`. Explicit status codes include 403, 404, 500. Session not found

**Source:** `server/src/routes/attendance.routes.js:212`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/my-detailed

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves my detailed.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `filter` | string | no | Query value for filter. |
| `semester` | number | no | Query value for semester. |
| `year` | number | no | Query value for year. |
| `month` | number | no | Query value for month. |
| `classroom` | string | no | Query value for classroom. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `classrooms`, `startDate`, `endDate`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance.routes.js:286`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### POST /api/attendance/:classroomId/start

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**What it does:** Starts the requested operation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string | yes | Request value for code. |
| `teacherLat` | string | no | Request value for teacher lat. |
| `teacherLng` | string | no | Request value for teacher lng. |
| `durationSeconds` | string | no | Request value for duration seconds. |
| `radiusMeters` | string | no | Request value for radius meters. |

**Response:** JSON response fields observed in the handler include `message`, `code`, `session`. Explicit status codes include 201, 400, 403, 409, 500. Code must be 3 30 characters

**Source:** `server/src/routes/attendance.routes.js:351`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### POST /api/attendance/:classroomId/quick-mark

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**What it does:** Creates or processes quick mark.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `studentIds` | string | no | Request value for student ids. |
| `sessionDate` | string | no | Request value for session date. |

**Response:** JSON response fields observed in the handler include `message`, `code`, `session`. Explicit status codes include 201, 400, 403, 500. At least one student must be selected

**Source:** `server/src/routes/attendance.routes.js:465`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### POST /api/attendance/:classroomId/stop

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**What it does:** Stops the requested operation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 404, 500. No active attendance session found to stop.

**Source:** `server/src/routes/attendance.routes.js:546`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### POST /api/attendance/:classroomId/mark

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomMember`

**What it does:** Creates or processes mark.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string | yes | Request value for code. |
| `sessionToken` | string | yes | Request value for session token. |
| `studentLat` | string | no | Request value for student lat. |
| `studentLng` | string | no | Request value for student lng. |
| `pasteDetected` | string | yes | Request value for paste detected. |
| `deviceFingerprint` | string | no | Request value for device fingerprint. |

**Response:** JSON response fields observed in the handler include `message`, `distanceMeters`, `blocked`, `reason`, `markedAt`, `status`. Explicit status codes include 400, 401, 403, 404, 410, 500. Attendance code is required

**Source:** `server/src/routes/attendance.routes.js:611`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/:classroomId/report

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**What it does:** Retrieves report.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `startDate` | string (date/time) | no | Query value for start date. |
| `endDate` | string (date/time) | no | Query value for end date. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `startDate`, `endDate`, `totalSessions`, `students`, `message`. Explicit status codes include 500. Server error generating report

**Source:** `server/src/routes/attendance.routes.js:806`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/:classroomId/active

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requirePlan("PRO")`, `requireClassroomMember`

**What it does:** Retrieves active.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `active`, `session`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance.routes.js:896`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/:classroomId/suspicious

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requirePlan("PRO")`, `requireClassroomOwner`

**What it does:** Retrieves suspicious.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `page` | number | no | Query value for page. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `records`, `total`, `page`, `pages`, `mode`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance.routes.js:947`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### POST /api/attendance/:classroomId/manual-override

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requirePlan("PRO")`, `requireClassroomOwner`

**What it does:** Creates or processes manual override.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | yes | Request value for session id. |
| `studentId` | string | yes | Request value for student id. |
| `action` | string | no | Request value for action. |

**Response:** JSON response fields observed in the handler include `message`, `action`, `student`. Explicit status codes include 400, 404, 500. sessionId, studentId, and action (mark_present|mark_absent) are required

**Source:** `server/src/routes/attendance.routes.js:999`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/:classroomId/sessions

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requirePlan("PRO")`, `requireClassroomOwner`

**What it does:** Retrieves sessions.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `page` | number | no | Query value for page. |
| `filter` | string | no | Query value for filter. |
| `month` | number | no | Query value for month. |
| `year` | number | no | Query value for year. |
| `semester` | number | no | Query value for semester. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `sessions`, `total`, `page`, `pages`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance.routes.js:1091`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/:classroomId/report

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**What it does:** Retrieves report.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `month` | number | no | Query value for month. |
| `year` | number | no | Query value for year. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `month`, `year`, `totalSessions`, `totalStudents`, `defaulterCount`, `students`, `defaulters`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance.routes.js:1135`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/:classroomId/my-attendance

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomMember`

**What it does:** Retrieves my attendance.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `month` | number | no | Query value for month. |
| `year` | number | no | Query value for year. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `month`, `year`, `totalSessions`, `present`, `absent`, `percentage`, `isDefaulter`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance.routes.js:1182`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### POST /api/attendance/appeal

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `(req,res,next)=>{appealUpload.single("proof")(req,res,err=>{if(err){if(err instanceof multer.MulterError&&err.code==="LIMIT_FILE_SIZE"){return res.status(400).json({message:"File must be under 2MB"});}return res.status(400).json({message:err.message||"Upload error"});}next();});}`

**What it does:** Student creates an appeal. Creates or processes appeal.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | yes | Request value for session id. |
| `reason` | string | no | Request value for reason. |
| `proof` | file | no | Request value for proof. |

**Response:** JSON response fields observed in the handler include `message`, `appeal`. Explicit status codes include 201, 400, 403, 404, 409, 500. sessionId and reason are required

**Source:** `server/src/routes/attendance.routes.js:1224`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/appeals

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Faculty fetches appeals for a classroom. Retrieves appeals.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Query value for classroom id. |
| `status` | string | no | Query value for status. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `appeals`. Explicit status codes include 400, 403, 404, 500. classroomId is required

**Source:** `server/src/routes/attendance.routes.js:1322`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### PATCH /api/attendance/appeal/:id

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Faculty approves or rejects. Updates appeal.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `action` | string | no | Request value for action. |
| `comment` | string | no | Request value for comment. |

**Response:** JSON response fields observed in the handler include `message`, `appeal`. Explicit status codes include 400, 403, 404, 500. action must be 'approve' or 'reject'

**Source:** `server/src/routes/attendance.routes.js:1366`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### GET /api/attendance/my-appeals

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Student fetches own appeals. Retrieves my appeals.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `appeals`, `bySession`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance.routes.js:1443`; handler `inline handler` in `server/src/routes/attendance.routes.js`.

### POST /api/attendance/dashboard/submit

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(['faculty','org_admin'])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(['faculty','org_admin'])`

**What it does:** Admin / Faculty: Submit the daily master attendance register. Submit daily attendance controller.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchyId` | string | no | Request value for hierarchy id. |
| `date` | string (date/time) | no | Request value for date. |
| `sessionType` | string | no | Request value for session type. |
| `studentRecordsArray` | string | no | Request value for student records array. |

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/attendance.routes.js:1484`; handler `submitDailyAttendanceController` in `server/src/controllers/attendance.controller.js`.

### GET /api/attendance/dashboard/register/:hierarchyId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(['faculty','org_admin'])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(['faculty','org_admin'])`

**What it does:** Admin / Faculty: View a specific day's submitted attendance register. Get attendance register controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchyId` | string | yes | Path identifier/value for hierarchy id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `date` | string (date/time) | no | Query value for date. |
| `sessionType` | string | no | Query value for session type. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/attendance.routes.js:1487`; handler `getAttendanceRegisterController` in `server/src/controllers/attendance.controller.js`.

### GET /api/attendance/analytics/student/:studentId/hierarchy/:hierarchyId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** All Authenticated: Get a student's calculated attendance percentage. Get student attendance percentage controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | string | yes | Path identifier/value for student id. |
| `hierarchyId` | string | yes | Path identifier/value for hierarchy id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `startDate` | string | no | Query value for start date. |
| `endDate` | string | no | Query value for end date. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/attendance.routes.js:1490`; handler `getStudentAttendancePercentageController` in `server/src/controllers/attendance.controller.js`.

### GET /api/attendance/analytics/batch/:hierarchyId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(['faculty','org_admin'])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(['faculty','org_admin'])`

**What it does:** Admin / Faculty: Get the pre-calculated stats and absentees for a batch. Get batch attendance report controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchyId` | string | yes | Path identifier/value for hierarchy id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `date` | string (date/time) | no | Query value for date. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/attendance.routes.js:1493`; handler `getBatchAttendanceReportController` in `server/src/controllers/attendance.controller.js`.

### POST /api/attendance/leave/apply

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('student')`

**Roles:** `student`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('student')`

**What it does:** Student: Apply for a leave of absence. Apply leave controller.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchyId` | string | no | Request value for hierarchy id. |
| `startDate` | string | no | Request value for start date. |
| `endDate` | string | no | Request value for end date. |
| `reason` | string | no | Request value for reason. |

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/attendance.routes.js:1496`; handler `applyLeaveController` in `server/src/controllers/attendance.controller.js`.

### GET /api/attendance/leave/pending/:hierarchyId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(['faculty','org_admin'])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(['faculty','org_admin'])`

**What it does:** Admin / Faculty: Get all pending leave requests for their specific batch. Get pending leave requests controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchyId` | string | yes | Path identifier/value for hierarchy id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/attendance.routes.js:1499`; handler `getPendingLeaveRequestsController` in `server/src/controllers/attendance.controller.js`.

### GET /api/attendance/leave/history/:studentId?

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** All Authenticated: View a student's leave history (Student sees own, Admin sees any). Get student leave history controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | string | yes | Path identifier/value for student id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/attendance.routes.js:1502`; handler `getStudentLeaveHistoryController` in `server/src/controllers/attendance.controller.js`.

### POST /api/attendance/leave/process/:leaveRequestId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(['faculty','org_admin'])`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole(['faculty','org_admin'])`

**What it does:** Admin / Faculty: Approve or reject a leave request. Process leave controller.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `leaveRequestId` | string | yes | Path identifier/value for leave request id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Request value for status. |
| `remarks` | string | no | Request value for remarks. |

**Response:** JSON response fields observed in the handler include `success`, `data`, `error`. Explicit status codes include 200, 400.

**Source:** `server/src/routes/attendance.routes.js:1505`; handler `processLeaveController` in `server/src/controllers/attendance.controller.js`.

## attendance_dashboard.routes.js

**Mounted at:** `/api/attendance`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| GET | `/api/attendance/active-sessions` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/attendance/dashboard-summary` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/attendance/dashboard-trends` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/attendance/dashboard-insights` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/attendance/:classroomId/bulk-override` | Authenticated classroom owner. |
| POST | `/api/attendance/:classroomId/appeal` | Authenticated classroom member. |
| GET | `/api/attendance/:classroomId/export` | Authenticated classroom owner. |
| GET | `/api/attendance/classroom-members/:classroomId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/attendance/subject-stats` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/attendance/active-sessions

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Active Sessions (for home screen banner). Retrieves active sessions.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `sessions`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance_dashboard.routes.js:19`; handler `inline handler` in `server/src/routes/attendance_dashboard.routes.js`.

### GET /api/attendance/dashboard-summary

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** A. GET /dashboard-summary (Fast). Retrieves dashboard summary.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | no | Query value for classroom id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `overallAttendance`, `totalPresent`, `totalAbsent`, `currentStreak`, `riskLevel`, `totalSessions`, `message`, `detail`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance_dashboard.routes.js:62`; handler `inline handler` in `server/src/routes/attendance_dashboard.routes.js`.

### GET /api/attendance/dashboard-trends

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** B. GET /dashboard-trends. Retrieves dashboard trends.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | no | Query value for classroom id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `timeline`, `facultySessions`, `message`, `detail`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance_dashboard.routes.js:117`; handler `inline handler` in `server/src/routes/attendance_dashboard.routes.js`.

### GET /api/attendance/dashboard-insights

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** C. GET /dashboard-insights. Retrieves dashboard insights.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `velocity`, `recoveryTarget`, `bunkAllowance`, `message`, `velocityAlerts`, `detail`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance_dashboard.routes.js:218`; handler `inline handler` in `server/src/routes/attendance_dashboard.routes.js`.

### POST /api/attendance/:classroomId/bulk-override

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**What it does:** Processes the requested bulk operation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | no | Request value for session id. |
| `action` | string | no | Request value for action. |
| `confirmOverwrite` | string | yes | Request value for confirm overwrite. |

**Response:** JSON response fields observed in the handler include `message`, `detail`. Explicit status codes include 400, 404, 500. Risk confirmation required.

**Source:** `server/src/routes/attendance_dashboard.routes.js:260`; handler `inline handler` in `server/src/routes/attendance_dashboard.routes.js`.

### POST /api/attendance/:classroomId/appeal

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomMember`

**What it does:** E. POST /:classroomId/appeal. Creates or processes appeal.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `sessionId` | string | yes | Request value for session id. |
| `reason` | string | yes | Request value for reason. |

**Response:** JSON response fields observed in the handler include `message`, `detail`. Explicit status codes include 400, 409, 500. Reason is required.

**Source:** `server/src/routes/attendance_dashboard.routes.js:297`; handler `inline handler` in `server/src/routes/attendance_dashboard.routes.js`.

### GET /api/attendance/:classroomId/export

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**Roles:** Authenticated classroom owner.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireClassroomOwner`

**What it does:** F. GET /:classroomId/export. Retrieves export.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `data`. Explicit status codes include 500. Export ready (stub)

**Source:** `server/src/routes/attendance_dashboard.routes.js:321`; handler `inline handler` in `server/src/routes/attendance_dashboard.routes.js`.

### GET /api/attendance/classroom-members/:classroomId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** G. GET /classroom-members/:classroomId Fetch student list for Quick Mark. Retrieves classroom members.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `students`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance_dashboard.routes.js:330`; handler `inline handler` in `server/src/routes/attendance_dashboard.routes.js`.

### GET /api/attendance/subject-stats

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** H. GET /subject-stats Per-subject + weekly attendance breakdown for student analytics. Retrieves subject stats.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `period` | string | no | Query value for period. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `subjects`, `weeklyPct`, `monthlyPct`, `weekTotal`, `monthTotal`, `message`, `detail`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/attendance_dashboard.routes.js:356`; handler `inline handler` in `server/src/routes/attendance_dashboard.routes.js`.

## leave.routes.js

**Mounted at:** `/api/leave`

| Method | Path | Access |
|---|---|---|
| POST | `/api/leave/request` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/leave/quick` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/leave/me` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/leave/teacher` | `faculty`, `org_admin` |
| PUT | `/api/leave/:requestId/status` | `faculty`, `org_admin` |
| DELETE | `/api/leave/:requestId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/leave/summary` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/leave/calendar` | `faculty`, `org_admin` |

### POST /api/leave/request

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** STUDENT: Apply Normal / Casual / Sick / Long Leave. Creates or processes request.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | no | Request value for classroom id. |
| `from_date` | string (date/time) | yes | Request value for from date. |
| `to_date` | string (date/time) | no | Request value for to date. |
| `leave_type` | string | no | Request value for leave type. Default: `casual`. |
| `day_type` | number | no | Request value for day type. Default: `full`. |
| `reason` | string | no | Request value for reason. |
| `attachment_url` | string | no | Request value for attachment url. |
| `total_days` | number | no | Request value for total days. |

**Response:** JSON response fields observed in the handler include `message`, `leaveRequest`. Explicit status codes include 201, 400, 500. From date is required

**Source:** `server/src/routes/leave.routes.js:48`; handler `inline handler` in `server/src/routes/leave.routes.js`.

### POST /api/leave/quick

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** STUDENT: Quick Leave (no approval needed). Creates or processes quick.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `date` | string (date/time) | yes | Request value for date. |
| `day_type` | number | no | Request value for day type. Default: `full`. |
| `classroomId` | string | no | Request value for classroom id. |

**Response:** JSON response fields observed in the handler include `message`, `leaveRequest`. Explicit status codes include 201, 400, 500. Date is required

**Source:** `server/src/routes/leave.routes.js:103`; handler `inline handler` in `server/src/routes/leave.routes.js`.

### GET /api/leave/me

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** STUDENT: My Leave Requests. Retrieves me.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `requests`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/leave.routes.js:160`; handler `inline handler` in `server/src/routes/leave.routes.js`.

### GET /api/leave/teacher

**Auth:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**What it does:** TEACHER: All Leave Requests for My Classes. Retrieves teacher.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `requests`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/leave.routes.js:178`; handler `inline handler` in `server/src/routes/leave.routes.js`.

### PUT /api/leave/:requestId/status

**Auth:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**What it does:** TEACHER: Approve / Reject. Updates status.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `requestId` | string | yes | Path identifier/value for request id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Request value for status. |
| `teacherNote` | string | no | Request value for teacher note. |

**Response:** JSON response fields observed in the handler include `message`, `leaveRequest`. Explicit status codes include 400, 403, 500. Invalid status

**Source:** `server/src/routes/leave.routes.js:200`; handler `inline handler` in `server/src/routes/leave.routes.js`.

### DELETE /api/leave/:requestId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** STUDENT: Cancel Pending Leave. Deletes resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `requestId` | string | yes | Path identifier/value for request id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. Cannot cancel this leave request

**Source:** `server/src/routes/leave.routes.js:237`; handler `inline handler` in `server/src/routes/leave.routes.js`.

### GET /api/leave/summary

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** STUDENT: Leave Summary (balance + breakdown). Retrieves summary.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `totalRequests`, `totalDaysUsed`, `pendingCount`, `typeBreakdown`, `monthlyUsage`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/leave.routes.js:261`; handler `inline handler` in `server/src/routes/leave.routes.js`.

### GET /api/leave/calendar

**Auth:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**Roles:** `faculty`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("faculty","org_admin")`

**What it does:** Shows which students are on leave for each day of the current/given week. Retrieves calendar.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `weekStart` | string | no | Query value for week start. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `weekStart`, `weekEnd`, `calendar`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/leave.routes.js:317`; handler `inline handler` in `server/src/routes/leave.routes.js`.

## holidays.routes.js

**Mounted at:** `/api/holidays`

| Method | Path | Access |
|---|---|---|
| GET | `/api/holidays` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/holidays/upcoming` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/holidays/today` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PATCH | `/api/holidays/:id` | `org_admin` |
| POST | `/api/holidays/manual` | `org_admin` |
| POST | `/api/holidays/sync` | `org_admin` |

### GET /api/holidays

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `month` | number | no | Query value for month. |
| `search` | string | no | Query value for search. |
| `year` | number | no | Query value for year. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `holidays`. Explicit status codes include 400, 500. Organization required

**Source:** `server/src/routes/holidays.routes.js:81`; handler `inline handler` in `server/src/routes/holidays.routes.js`.

### GET /api/holidays/upcoming

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves upcoming.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `holidays`. Explicit status codes include 400, 500. Organization required

**Source:** `server/src/routes/holidays.routes.js:135`; handler `inline handler` in `server/src/routes/holidays.routes.js`.

### GET /api/holidays/today

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves today.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. Organization required

**Source:** `server/src/routes/holidays.routes.js:180`; handler `inline handler` in `server/src/routes/holidays.routes.js`.

### PATCH /api/holidays/:id

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Updates resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `is_holiday` | boolean | no | Request value for is holiday. |

**Response:** JSON response fields observed in the handler include `message`, `holiday`. Explicit status codes include 400, 404, 500. is_holiday must be boolean

**Source:** `server/src/routes/holidays.routes.js:198`; handler `inline handler` in `server/src/routes/holidays.routes.js`.

### POST /api/holidays/manual

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Creates or processes manual.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | yes | Request value for title. |
| `date` | string (date/time) | yes | Request value for date. |
| `end_date` | string (date/time) | no | Request value for end date. |

**Response:** JSON response fields observed in the handler include `message`, `holiday`. Explicit status codes include 201, 400, 500. Title and date are required

**Source:** `server/src/routes/holidays.routes.js:230`; handler `inline handler` in `server/src/routes/holidays.routes.js`.

### POST /api/holidays/sync

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Creates or processes sync.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `year` | number | no | Query value for year. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. Organization required

**Source:** `server/src/routes/holidays.routes.js:267`; handler `inline handler` in `server/src/routes/holidays.routes.js`.

