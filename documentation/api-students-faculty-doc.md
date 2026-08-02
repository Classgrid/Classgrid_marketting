---
title: Students and Faculty API
description: "Code-grounded Classgrid REST API reference for students and faculty api"
---

# Students and Faculty API

This reference is generated from the current Express route definitions and their handlers. It documents route-level authentication and authorization; deployment-wide middleware may add further checks.

## Conventions

- Base API origin: `https://api.classgrid.in`
- Authentication: authenticated routes use the Classgrid session/JWT recognized by `isAuthenticated`.
- JSON is the default request and response format unless an endpoint explicitly accepts multipart data or redirects.
- Path parameters are always required.
- A field marked `no` means the static handler scan did not find a direct required-field check; business rules may still make it conditionally required.
- Role checks can also accept `super_admin` through the shared authorization middleware where implemented.

This document contains **31 route definitions** from 4 source files.

## student.routes.js

**Mounted at:** `/api/student`

| Method | Path | Access |
|---|---|---|
| POST | `/api/student/send-onboarding-otp` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/student/verify-onboarding-otp` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/student/onboarding` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/student/profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/student/academic-history` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/student/academic-history` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/student/academic-history/:qual_type` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/student/address` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/student/address` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/student/onboarding-progress` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/student/batch-import` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/student/dashboard/summary` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### POST /api/student/send-onboarding-otp

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Sends the requested information.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 429, 500. Please wait 60 seconds before requesting a new code.

**Source:** `server/src/routes/student.routes.js:16`; handler `inline handler` in `server/src/routes/student.routes.js`.

### POST /api/student/verify-onboarding-otp

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Verifies the supplied information.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `otp` | string | yes | Request value for otp. |

**Response:** JSON response fields observed in the handler include `message`, `verified`. Explicit status codes include 400, 429, 500. Verification code is required.

**Source:** `server/src/routes/student.routes.js:66`; handler `inline handler` in `server/src/routes/student.routes.js`.

### POST /api/student/onboarding

**Auth:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**What it does:** Creates or processes onboarding.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `full_name` | string | yes | Request value for full name. |
| `division_id` | string | yes | Request value for division id. |
| `prn` | string | no | Request value for prn. |
| `roll_no` | string | no | Request value for roll no. |
| `year` | number | no | Request value for year. |
| `abc_id` | string | no | Request value for abc id. |

**Response:** JSON response fields observed in the handler include `message`, `student`. Explicit status codes include 400, 409, 500. You do not belong to any organization.

**Source:** `server/src/routes/student.routes.js:102`; handler `inline handler` in `server/src/routes/student.routes.js`.

### GET /api/student/profile

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `student`, `message`. Explicit status codes include 500. Failed to load student profile.

**Source:** `server/src/routes/student.routes.js:243`; handler `inline handler` in `server/src/routes/student.routes.js`.

### GET /api/student/academic-history

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves academic history.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `history`, `message`. Explicit status codes include 500. Failed to fetch academic history.

**Source:** `server/src/routes/student.routes.js:267`; handler `inline handler` in `server/src/routes/student.routes.js`.

### PUT /api/student/academic-history

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Upsert one qualification record (SSC, HSC, CET, etc.). Updates academic history.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `qual_type` | string | yes | Request value for qual type. |
| `board_university` | string | no | Request value for board university. |
| `marks_obtained` | number | no | Request value for marks obtained. |
| `marks_total` | number | no | Request value for marks total. |
| `percentage` | number | no | Request value for percentage. |
| `cgpa` | string | no | Request value for cgpa. |
| `grade` | string | no | Request value for grade. |
| `passing_year` | number | no | Request value for passing year. |
| `stream` | string | no | Request value for stream. |
| `seat_type` | string | no | Request value for seat type. |
| `rank` | string | no | Request value for rank. |
| `score` | number | no | Request value for score. |

**Response:** JSON response fields observed in the handler include `message`, `record`. Explicit status codes include 400, 500. No organization found.

**Source:** `server/src/routes/student.routes.js:290`; handler `inline handler` in `server/src/routes/student.routes.js`.

### DELETE /api/student/academic-history/:qual_type

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes academic history.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `qual_type` | string | yes | Path identifier/value for qual type. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Record deleted.

**Source:** `server/src/routes/student.routes.js:341`; handler `inline handler` in `server/src/routes/student.routes.js`.

### GET /api/student/address

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves address.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `address`, `message`. Explicit status codes include 500. Failed to fetch address.

**Source:** `server/src/routes/student.routes.js:367`; handler `inline handler` in `server/src/routes/student.routes.js`.

### PUT /api/student/address

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Updates address.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `permanent_address_line1` | string | no | Request value for permanent address line1. |
| `permanent_address_line2` | string | no | Request value for permanent address line2. |
| `permanent_city` | string | no | Request value for permanent city. |
| `permanent_state` | string | no | Request value for permanent state. |
| `permanent_pincode` | string | no | Request value for permanent pincode. |
| `permanent_country` | string | no | Request value for permanent country. |
| `correspondence_same_as_permanent` | string | no | Request value for correspondence same as permanent. |
| `correspondence_address_line1` | string | no | Request value for correspondence address line1. |
| `correspondence_address_line2` | string | no | Request value for correspondence address line2. |
| `correspondence_city` | string | no | Request value for correspondence city. |
| `correspondence_state` | string | no | Request value for correspondence state. |
| `correspondence_pincode` | string | no | Request value for correspondence pincode. |
| `correspondence_country` | string | no | Request value for correspondence country. |

**Response:** JSON response fields observed in the handler include `message`, `address`. Explicit status codes include 400, 500. No organization found.

**Source:** `server/src/routes/student.routes.js:387`; handler `inline handler` in `server/src/routes/student.routes.js`.

### GET /api/student/onboarding-progress

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves onboarding progress.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `steps`, `completed`, `total`, `percentage`, `message`. Explicit status codes include 500. Failed to compute onboarding progress.

**Source:** `server/src/routes/student.routes.js:439`; handler `inline handler` in `server/src/routes/student.routes.js`.

### POST /api/student/batch-import

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes batch import.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `students` | array | no | Request value for students. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 403, 500. Only org admins can batch import students.

**Source:** `server/src/routes/student.routes.js:508`; handler `inline handler` in `server/src/routes/student.routes.js`.

### GET /api/student/dashboard/summary

**Auth:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**What it does:** Get student dashboard data.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `data`. Explicit status codes include 200, 400, 500. Missing required organization or user context.

**Source:** `server/src/routes/student.routes.js:604`; handler `getStudentDashboardData` in `server/src/controllers/student-dashboard.controller.js`.

## student-profile.routes.js

**Mounted at:** `/api/student-profile`

| Method | Path | Access |
|---|---|---|
| GET | `/api/student-profile/family` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/student-profile/family` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/student-profile/qualifications` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/student-profile/qualifications` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/student-profile/qualifications/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/student-profile/documents` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/student-profile/documents` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/student-profile/documents/:doc_type` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/student-profile/compliance` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/student-profile/family

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves family.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `familyInfo`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/student-profile.routes.js:11`; handler `inline handler` in `server/src/routes/student-profile.routes.js`.

### PUT /api/student-profile/family

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Updates family.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `father_name` | string | no | Request value for father name. |
| `mother_name` | string | no | Request value for mother name. |
| `parent_contact` | string | no | Request value for parent contact. |
| `emergency_contact` | string | no | Request value for emergency contact. |

**Response:** JSON response fields observed in the handler include `message`, `familyInfo`. Explicit status codes include 500. Family info saved

**Source:** `server/src/routes/student-profile.routes.js:28`; handler `inline handler` in `server/src/routes/student-profile.routes.js`.

### GET /api/student-profile/qualifications

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves qualifications.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `qualifications`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/student-profile.routes.js:58`; handler `inline handler` in `server/src/routes/student-profile.routes.js`.

### PUT /api/student-profile/qualifications

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Updates qualifications.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `qual_type` | string | yes | Request value for qual type. |
| `board` | string | no | Request value for board. |
| `passing_year` | number | no | Request value for passing year. |
| `marks` | number | no | Request value for marks. |
| `stream` | string | no | Request value for stream. |
| `metadata` | object | no | Request value for metadata. |

**Response:** JSON response fields observed in the handler include `message`, `qualification`. Explicit status codes include 400, 500. Qualification type is required

**Source:** `server/src/routes/student-profile.routes.js:74`; handler `inline handler` in `server/src/routes/student-profile.routes.js`.

### DELETE /api/student-profile/qualifications/:id

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes qualifications.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Qualification deleted

**Source:** `server/src/routes/student-profile.routes.js:105`; handler `inline handler` in `server/src/routes/student-profile.routes.js`.

### GET /api/student-profile/documents

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves documents.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `documents`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/student-profile.routes.js:125`; handler `inline handler` in `server/src/routes/student-profile.routes.js`.

### PUT /api/student-profile/documents

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Updates documents.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `doc_type` | string | yes | Request value for doc type. |
| `file_url` | string | yes | Request value for file url. |

**Response:** JSON response fields observed in the handler include `message`, `document`. Explicit status codes include 400, 500. Doc type and URL required

**Source:** `server/src/routes/student-profile.routes.js:141`; handler `inline handler` in `server/src/routes/student-profile.routes.js`.

### DELETE /api/student-profile/documents/:doc_type

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes documents.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `doc_type` | string | yes | Path identifier/value for doc type. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Document deleted

**Source:** `server/src/routes/student-profile.routes.js:168`; handler `inline handler` in `server/src/routes/student-profile.routes.js`.

### PUT /api/student-profile/compliance

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Update student compliance.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `abc_id` | string | no | Request value for abc id. |
| `anti_ragging_undertaking_no` | string | no | Request value for anti ragging undertaking no. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `user`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/student-profile.routes.js:188`; handler `updateStudentCompliance` in `server/src/controllers/student-compliance.controller.js`.

## faculty.routes.js

**Mounted at:** `/api/faculty`

| Method | Path | Access |
|---|---|---|
| GET | `/api/faculty/dashboard/summary` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/faculty/dashboard/summary

**Auth:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**What it does:** Get faculty dashboard data.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `data`. Explicit status codes include 200, 400, 500. Missing required organization or user context.

**Source:** `server/src/routes/faculty.routes.js:12`; handler `getFacultyDashboardData` in `server/src/controllers/faculty-dashboard.controller.js`.

## user.routes.js

**Mounted at:** `/api/user`

| Method | Path | Access |
|---|---|---|
| GET | `/api/user/profile-schema` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/user/profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/user/update` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/user/upload-url` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/user/email-preferences` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/user/email-preferences` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/user/fcm-token` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/user/divisions` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/user/my-teaching-roles` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/user/profile-schema

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves profile schema.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `schema`, `message`. Explicit status codes include 500. Server error getting schema

**Source:** `server/src/routes/user.routes.js:19`; handler `inline handler` in `server/src/routes/user.routes.js`.

### GET /api/user/profile

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 404, 500. User not found

**Source:** `server/src/routes/user.routes.js:41`; handler `inline handler` in `server/src/routes/user.routes.js`.

### PUT /api/user/update

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Updates update.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | no | Request value for name. |
| `sidebar_name` | string | no | Request value for sidebar name. |
| `phoneNumber` | string | no | Request value for phone number. |
| `profilePicture` | string | no | Request value for profile picture. |
| `platformLogo` | string | no | Request value for platform logo. |
| `profileBanner` | string | no | Request value for profile banner. |
| `qualification` | string | no | Request value for qualification. |
| `department` | string | no | Request value for department. |
| `bio` | string | no | Request value for bio. |
| `prn` | string | no | Request value for prn. |
| `abc_id` | string | no | Request value for abc id. |
| `branch` | string | no | Request value for branch. |
| `batch` | string | no | Request value for batch. |
| `address` | object | no | Request value for address. |
| `hobby` | string | no | Request value for hobby. |
| `subjectsAssigned` | string | no | Request value for subjects assigned. |
| `dob` | string | no | Request value for dob. |
| `gender` | string | no | Request value for gender. |
| `fatherName` | string | no | Request value for father name. |
| `motherName` | string | no | Request value for mother name. |
| `eligibilityNo` | string | no | Request value for eligibility no. |
| `pattern` | string | no | Request value for pattern. |
| `alternateEmail` | string | no | Request value for alternate email. |
| `signature` | string | no | Request value for signature. |
| `admission_type` | string | no | Request value for admission type. |
| `category` | string | no | Request value for category. |
| `pushNotifications` | string | no | Request value for push notifications. |
| `metadata` | string (date/time) | no | Request value for metadata. |

**Response:** JSON response fields observed in the handler include `message`, `user`, `error`. Explicit status codes include 400, 404, 409, 500. Name cannot be empty

**Source:** `server/src/routes/user.routes.js:143`; handler `inline handler` in `server/src/routes/user.routes.js`.

### POST /api/user/upload-url

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Uploads the supplied resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `fileName` | string | yes | Request value for file name. |
| `fileType` | string | yes | Request value for file type. |

**Response:** JSON response fields observed in the handler include `message`, `uploadUrl`, `publicUrl`. Explicit status codes include 400, 500. Filename and file type are required

**Source:** `server/src/routes/user.routes.js:465`; handler `inline handler` in `server/src/routes/user.routes.js`.

### GET /api/user/email-preferences

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves email preferences.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `emailNotifications`. Explicit status codes include 404, 500. User not found

**Source:** `server/src/routes/user.routes.js:487`; handler `inline handler` in `server/src/routes/user.routes.js`.

### PUT /api/user/email-preferences

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Updates email preferences.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | string (date/time) | no | Request value for key. |
| `digestMode` | string (date/time) | no | Request value for digest mode. |

**Response:** JSON response fields observed in the handler include `message`, `emailNotifications`. Explicit status codes include 400, 404, 500. No valid preferences provided

**Source:** `server/src/routes/user.routes.js:515`; handler `inline handler` in `server/src/routes/user.routes.js`.

### POST /api/user/fcm-token

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes fcm token.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. Token is required

**Source:** `server/src/routes/user.routes.js:558`; handler `inline handler` in `server/src/routes/user.routes.js`.

### POST /api/user/divisions

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes divisions.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `standard` | string | yes | Request value for standard. |
| `year` | number | yes | Request value for year. |
| `semester` | string | yes | Request value for semester. |
| `section` | string | no | Request value for section. |
| `name` | string | no | Request value for name. |
| `org_type` | string | no | Request value for org type. |
| `course` | string | no | Request value for course. |
| `branch` | string | no | Request value for branch. |
| `class_teacher_id` | string | yes | Request value for class teacher id. |
| `assistant_teacher_id` | string | no | Request value for assistant teacher id. |
| `subjects` | array | yes | Request value for subjects. |
| `sem_start_date` | string (date/time) | yes | Request value for sem start date. |
| `sem_end_date` | string (date/time) | yes | Request value for sem end date. |
| `sem2_start_date` | string (date/time) | yes | Request value for sem2 start date. |
| `sem2_end_date` | string (date/time) | yes | Request value for sem2 end date. |
| `academic_year_start` | number | yes | Request value for academic year start. |
| `academic_year_end` | number | yes | Request value for academic year end. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 409, 500. User does not belong to any organization.

**Source:** `server/src/routes/user.routes.js:578`; handler `inline handler` in `server/src/routes/user.routes.js`.

### GET /api/user/my-teaching-roles

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves my teaching roles.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `classTeacher`, `assistantTeacher`, `subjectTeacher`. Explicit status codes include 400, 403, 500. Only faculty can access this.

**Source:** `server/src/routes/user.routes.js:676`; handler `inline handler` in `server/src/routes/user.routes.js`.

