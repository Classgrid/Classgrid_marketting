This reference is generated from the current Express route definitions and their handlers. It documents route-level authentication and authorization; deployment-wide middleware may add further checks.

## Conventions

- Base API origin: `https://api.classgrid.in`
- Authentication: authenticated routes use the Classgrid session/JWT recognized by `isAuthenticated`.
- JSON is the default request and response format unless an endpoint explicitly accepts multipart data or redirects.
- Path parameters are always required.
- A field marked `no` means the static handler scan did not find a direct required-field check; business rules may still make it conditionally required.
- Role checks can also accept `super_admin` through the shared authorization middleware where implemented.

This document contains **78 route definitions** from 2 source files.

## admission.routes.js

**Mounted at:** `/api/admission`

| Method | Path | Access |
|---|---|---|
| POST | `/api/admission/cet/validate-en` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/admission/cet/send-otp` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/admission/cet/verify-otp` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/admission/verify-phone` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/admission/send-email-otp` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/admission/verify-email-otp` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/admission/save-draft` | `admission_candidate` |
| POST | `/api/admission/submit` | `admission_candidate` |
| GET | `/api/admission/institution-profile` | `org_admin`, `admission_head`, `admission_counselor`, `admission_clerk`, `admission_verifier` |
| GET | `/api/admission/config` | `org_admin`, `admission_head` |
| PATCH | `/api/admission/config` | `org_admin`, `admission_head` |
| POST | `/api/admission/config/preset` | `org_admin`, `admission_head` |
| GET | `/api/admission/master-field-pool` | `org_admin`, `admission_head` |
| GET | `/api/admission/master-document-pool` | `org_admin`, `admission_head` |
| GET | `/api/admission/docs/checklist` | `admission_candidate` |
| POST | `/api/admission/docs/upload` | `admission_candidate` |
| GET | `/api/admission/docs/view` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/admission/candidate/docs/view` | `admission_candidate` |
| POST | `/api/admission/cet/import` | `org_admin`, `admission_head` |
| PATCH | `/api/admission/admin/verify-doc` | `org_admin`, `admission_head`, `admission_verifier` |
| GET | `/api/admission/broadcast/merit-list/:hierarchyId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/admission/broadcast/seat-matrix` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/admission/broadcast/call-candidate` | `org_admin`, `admission_head`, `admission_counselor` |
| POST | `/api/admission/pay/initiate` | `admission_candidate` |
| POST | `/api/admission/pay/verify` | `admission_candidate` |
| POST | `/api/admission/payments/webhook` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/admission/admin/enroll` | `org_admin`, `admission_head`, `admission_clerk` |
| POST | `/api/admission/admin/waitlist/promote` | `org_admin`, `admission_head` |
| POST | `/api/admission/admin/scholarship/bulk-import` | `org_admin`, `admission_head` |
| POST | `/api/admission/applications/:id/withdraw` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/admission/candidate/withdraw/:id` | `admission_candidate` |
| POST | `/api/admission/apply` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/admission/desk-enroll` | `org_admin`, `admission_head`, `admission_clerk` |
| GET | `/api/admission/export/dte` | `org_admin`, `admission_head` |
| GET | `/api/admission/export/saral` | `org_admin`, `admission_head` |
| GET | `/api/admission/export/aicte` | `org_admin`, `admission_head` |
| GET | `/api/admission/export/state-board` | `org_admin`, `admission_head` |
| POST | `/api/admission/enroll` | `org_admin`, `admission_head`, `admission_clerk` |
| PATCH | `/api/admission/cet/:en/allot-division` | `org_admin`, `admission_head` |
| PATCH | `/api/admission/cet/:en/mark-upgraded` | `org_admin`, `admission_head`, `admission_verifier` |
| GET | `/api/admission/applications` | `org_admin`, `admission_head`, `admission_counselor`, `admission_clerk`, `admission_verifier` |
| POST | `/api/admission/docs/validate-expiry` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/admission/direct/generate-merit` | `org_admin`, `admission_head` |
| GET | `/api/admission/direct/merit-list` | `org_admin`, `admission_head`, `admission_counselor` |
| GET | `/api/admission/print/application/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/admission/applications/merge` | `org_admin`, `admission_head` |
| POST | `/api/admission/allocate-divisions` | `org_admin`, `admission_head` |
| POST | `/api/admission/generate-prns` | `org_admin`, `admission_head` |
| POST | `/api/admission/cet/:en_number/report` | `org_admin`, `admission_head`, `admission_verifier` |
| POST | `/api/admission/cet/:en_number/request-noc` | `org_admin`, `admission_head` |
| POST | `/api/admission/cet/:en_number/confirm-upgrade` | `org_admin`, `admission_head` |
| POST | `/api/admission/notify` | `org_admin`, `admission_head` |
| GET | `/api/admission/sms-budget` | `org_admin`, `admission_head` |
| POST | `/api/admission/parent/login` | Public endpoint unless an upstream platform gate applies. |
| GET | `/api/admission/parent/status/:applicationId` | `parent` |
| GET | `/api/admission/parent/documents/:applicationId` | `parent` |
| GET | `/api/admission/analytics` | `org_admin`, `admission_head` |
| GET | `/api/admission/cet/dashboard` | `org_admin`, `admission_head` |
| POST | `/api/admission/acap/register` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/admission/acap/generate-merit` | `org_admin`, `admission_head` |
| POST | `/api/admission/acap/verify-gate` | `org_admin`, `admission_head`, `admission_verifier` |
| GET | `/api/admission/merit-list/live` | Public endpoint unless an upstream platform gate applies. |
| PATCH | `/api/admission/applications/:id/stage` | `org_admin`, `admission_head`, `admission_verifier` |
| POST | `/api/admission/admin/bulk-verify` | `org_admin`, `admission_head`, `admission_verifier` |
| POST | `/api/admission/admin/bulk-select` | `org_admin`, `admission_head` |
| POST | `/api/admission/admin/bulk-update-compliance` | `org_admin`, `admission_head` |
| POST | `/api/admission/round/advance` | `org_admin`, `admission_head` |
| PATCH | `/api/admission/applications/:id/unlock-edit` | `org_admin`, `admission_head` |
| PATCH | `/api/admission/applications/:id/lock-edit` | `org_admin`, `admission_head` |
| GET | `/api/admission/dashboard/list` | `org_admin` |
| GET | `/api/admission/dashboard/:id` | `org_admin` |
| PATCH | `/api/admission/dashboard/:id/status` | `org_admin` |

### POST /api/admission/cet/validate-en

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `requireCETTrack`

**What it does:** Public Auth: Admission Candidate flows. Validate en.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `en_number` | string | no | Request value for en number. |
| `organization_id` | string | no | Request value for organization id. |

**Response:** JSON response fields observed in the handler include `error`, `hint`, `message`, `candidate_name`, `branch`. Explicit status codes include 400, 403, 404, 500. Allotment found.

**Source:** `server/src/routes/admission.routes.js:103`; handler `validateEN` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/cet/send-otp

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `requireCETTrack`, `otpSendLimiter`

**What it does:** Send enotp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `en_number` | string | no | Request value for en number. |
| `email` | string | no | Request value for email. |
| `organization_id` | string | no | Request value for organization id. |

**Response:** JSON response fields observed in the handler include `error`, `message`, `details`. Explicit status codes include 400, 404, 429, 500. OTP sent to your email.

**Source:** `server/src/routes/admission.routes.js:104`; handler `sendENOTP` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/cet/verify-otp

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `requireCETTrack`, `loginLimiter`

**What it does:** Verify enotp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `en_number` | string | no | Request value for en number. |
| `email` | string | no | Request value for email. |
| `otp` | string | no | Request value for otp. |
| `organization_id` | string | no | Request value for organization id. |

**Response:** JSON response fields observed in the handler include `error`, `message`, `token`, `application_id`, `status`. Explicit status codes include 400, 500. Authentication successful.

**Source:** `server/src/routes/admission.routes.js:105`; handler `verifyENOTP` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/verify-phone

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `requireDirectTrack`, `loginLimiter`

**What it does:** Verify phone otp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `idToken` | string | yes | Request value for id token. |
| `organization_id` | string | yes | Request value for organization id. |

**Response:** JSON response fields observed in the handler include `error`, `hint`, `message`, `token`, `application_id`, `status`, `phone`, `details`. Explicit status codes include 400, 403, 500. Phone verified successfully.

**Source:** `server/src/routes/admission.routes.js:106`; handler `verifyPhoneOTP` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/send-email-otp

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `otpSendLimiter`

**What it does:** Firebase Phone OTP verify. Send email otp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |
| `organization_id` | string | yes | Request value for organization id. |
| `phone` | string | no | Request value for phone. |

**Response:** JSON response fields observed in the handler include `error`, `message`, `details`. Explicit status codes include 400, 429, 500. OTP sent to your email.

**Source:** `server/src/routes/admission.routes.js:107`; handler `sendEmailOTP` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/verify-email-otp

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `loginLimiter`

**What it does:** Verify email otp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | no | Request value for email. |
| `otp` | string | no | Request value for otp. |
| `organization_id` | string | no | Request value for organization id. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`. Explicit status codes include 400, 500. Email verified successfully.

**Source:** `server/src/routes/admission.routes.js:108`; handler `verifyEmailOTP` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/save-draft

**Auth:** `isAdmissionCandidate`

**Roles:** `admission_candidate`

**Middleware:** `isAdmissionCandidate`

**What it does:** Application Forms (Session Required). Save application draft.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `full_name` | string | no | Request value for full name. |
| `dob` | string | no | Request value for dob. |
| `form_data` | object | no | Request value for form data. |

**Response:** JSON response fields observed in the handler include `error`, `duplicate_found`, `message`, `application`. Explicit status codes include 400, 404, 409, 500. Draft saved.

**Source:** `server/src/routes/admission.routes.js:111`; handler `saveApplicationDraft` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/submit

**Auth:** `isAdmissionCandidate`

**Roles:** `admission_candidate`

**Middleware:** `isAdmissionCandidate`

**What it does:** Submit application.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `verified_main_email` | string | no | Request value for verified main email. |

**Response:** JSON response fields observed in the handler include `error`, `details`, `message`, `status`. Explicit status codes include 400, 403, 404, 500. Application submitted successfully.

**Source:** `server/src/routes/admission.routes.js:112`; handler `submitApplication` in `server/src/controllers/admission.controller.js`.

### GET /api/admission/institution-profile

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_counselor","admission_clerk","admission_verifier"])`, `attachInstitutionProfile()`

**Roles:** `org_admin`, `admission_head`, `admission_counselor`, `admission_clerk`, `admission_verifier`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_counselor","admission_clerk","admission_verifier"])`, `attachInstitutionProfile()`

**What it does:** Protected: Admin Configuration. Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `admission_profile`, `learner_record_profile`.

**Source:** `server/src/routes/admission.routes.js:115`; handler `inline handler` in `server/src/routes/admission.routes.js`.

### GET /api/admission/config

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`, `attachInstitutionProfile()`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`, `attachInstitutionProfile()`

**What it does:** Get admission config.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `organization`, `structure_type`, `config`, `admission_config`, `form_schema`, `institution_profile`, `admission_profile`, `learner_record_profile`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/admission.routes.js:122`; handler `getAdmissionConfig` in `server/src/controllers/admission-config.controller.js`.

### PATCH /api/admission/config

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`, `attachInstitutionProfile()`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`, `attachInstitutionProfile()`

**What it does:** Update admission config.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `admission_config` | object | no | Request value for admission config. |

**Response:** JSON response fields observed in the handler include `message`, `config`, `error`. Explicit status codes include 500. Configuration updated successfully.

**Source:** `server/src/routes/admission.routes.js:123`; handler `updateAdmissionConfig` in `server/src/controllers/admission-config.controller.js`.

### POST /api/admission/config/preset

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`, `attachInstitutionProfile()`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`, `attachInstitutionProfile()`

**What it does:** Inject preset.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `config`, `error`. Explicit status codes include 500. Base preset injected successfully.

**Source:** `server/src/routes/admission.routes.js:124`; handler `injectPreset` in `server/src/controllers/admission-config.controller.js`.

### GET /api/admission/master-field-pool

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Get master field pool.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:125`; handler `getMasterFieldPool` in `server/src/controllers/admission-config.controller.js`.

### GET /api/admission/master-document-pool

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Get master document pool.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:126`; handler `getMasterDocumentPool` in `server/src/controllers/admission-config.controller.js`.

### GET /api/admission/docs/checklist

**Auth:** `isAdmissionCandidate`

**Roles:** `admission_candidate`

**Middleware:** `isAdmissionCandidate`

**What it does:** Document Management. Get required docs checklist.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `checklist`. Explicit status codes include 200, 404, 500. Application not found

**Source:** `server/src/routes/admission.routes.js:129`; handler `getRequiredDocsChecklist` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/docs/upload

**Auth:** `isAdmissionCandidate`

**Roles:** `admission_candidate`

**Middleware:** `isAdmissionCandidate`, `upload.single("file")`

**What it does:** Upload admission doc.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `docName` | string | yes | Request value for doc name. |
| `issueDate` | string | no | Request value for issue date. |
| `file` | string (date/time) | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `success`, `message`, `error`, `hint`, `document`. Explicit status codes include 200, 400, 403, 404, 500. No file uploaded

**Source:** `server/src/routes/admission.routes.js:130`; handler `uploadAdmissionDoc` in `server/src/controllers/admission.controller.js`.

### GET /api/admission/docs/view

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Get doc view link.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `path` | string | yes | Query value for path. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `url`. Explicit status codes include 200, 400, 403, 404, 500. Path is required

**Source:** `server/src/routes/admission.routes.js:131`; handler `getDocViewLink` in `server/src/controllers/admission.controller.js`.

### GET /api/admission/candidate/docs/view

**Auth:** `isAdmissionCandidate`

**Roles:** `admission_candidate`

**Middleware:** `isAdmissionCandidate`

**What it does:** Generic view (checks auth inside). Get doc view link.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `path` | string | yes | Query value for path. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `url`. Explicit status codes include 200, 400, 403, 404, 500. Path is required

**Source:** `server/src/routes/admission.routes.js:132`; handler `getDocViewLink` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/cet/import

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireCETTrack`, `requireAdmissionRole(["org_admin","admission_head"])`, `upload.single("file")`

**What it does:** Protected: Admin-only operations. Import cetallotments.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `allotments` | string | no | Request value for allotments. |
| `cap_round` | string | yes | Request value for cap round. |
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `imported_count`, `failed_count`, `failed_rows`, `auto_flagged_upgrades`, `details`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/admission.routes.js:135`; handler `importCETAllotments` in `server/src/controllers/admission.controller.js`.

### PATCH /api/admission/admin/verify-doc

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**Roles:** `org_admin`, `admission_head`, `admission_verifier`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**What it does:** Verify admission doc.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `application_id` | string | no | Request value for application id. |
| `docName` | string | no | Request value for doc name. |
| `status` | string | no | Request value for status. |
| `rejection_reason` | string | no | Request value for rejection reason. |

**Response:** JSON response fields observed in the handler include `success`, `message`. Explicit status codes include 200, 400, 404, 500. Invalid status

**Source:** `server/src/routes/admission.routes.js:136`; handler `verifyAdmissionDoc` in `server/src/controllers/admission.controller.js`.

### GET /api/admission/broadcast/merit-list/:hierarchyId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Broadcast & Live Projector Endpoints. Get live merit list.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchyId` | string | yes | Path identifier/value for hierarchy id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `candidates`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:139`; handler `getLiveMeritList` in `server/src/controllers/admission-broadcast.controller.js`.

### GET /api/admission/broadcast/seat-matrix

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Get live seat matrix.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `matrix`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:140`; handler `getLiveSeatMatrix` in `server/src/controllers/admission-broadcast.controller.js`.

### POST /api/admission/broadcast/call-candidate

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_counselor"])`

**Roles:** `org_admin`, `admission_head`, `admission_counselor`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_counselor"])`

**What it does:** Call candidate.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `application_id` | string | no | Request value for application id. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/admission.routes.js:141`; handler `callCandidate` in `server/src/controllers/admission-broadcast.controller.js`.

### POST /api/admission/pay/initiate

**Auth:** `isAdmissionCandidate`

**Roles:** `admission_candidate`

**Middleware:** `isAdmissionCandidate`

**What it does:** Fees & Payments. Initiate fee payment.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `order_id`, `amount`, `currency`, `key_id`, `details`. Explicit status codes include 400, 404, 500.

**Source:** `server/src/routes/admission.routes.js:144`; handler `initiateFeePayment` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/pay/verify

**Auth:** `isAdmissionCandidate`

**Roles:** `admission_candidate`

**Middleware:** `isAdmissionCandidate`

**What it does:** Verify fee payment.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `razorpay_payment_id` | string | no | Request value for razorpay payment id. |
| `razorpay_order_id` | string | no | Request value for razorpay order id. |
| `razorpay_signature` | string | no | Request value for razorpay signature. |

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 500. Payment verified and Enrollment confirmed!

**Source:** `server/src/routes/admission.routes.js:145`; handler `verifyFeePayment` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/payments/webhook

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Handle payment webhook.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `organizationId` | string | no | Query value for organization id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `status`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/admission.routes.js:146`; handler `handlePaymentWebhook` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/admin/enroll

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_clerk"])`

**Roles:** `org_admin`, `admission_head`, `admission_clerk`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_clerk"])`

**What it does:** Final Enrollment. Admin enroll student.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `application_id` | string | no | Request value for application id. |
| `quota_name` | string | no | Request value for quota name. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `vacancy_left`. Explicit status codes include 400, 404, 500. Student enrolled successfully

**Source:** `server/src/routes/admission.routes.js:149`; handler `adminEnrollStudent` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/admin/waitlist/promote

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Waitlist & Scholarships. Promote waitlist.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchy_id` | string | no | Request value for hierarchy id. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/admission.routes.js:152`; handler `promoteWaitlist` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/admin/scholarship/bulk-import

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`, `upload.single("file")`

**What it does:** Import scholarships.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `errors`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/admission.routes.js:153`; handler `importScholarships` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/applications/:id/withdraw

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Withdrawal. Withdraw application.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `reason` | string | no | Request value for reason. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `refundDetails`, `promoted_from_waitlist`. Explicit status codes include 400, 404, 500. Application withdrawn successfully

**Source:** `server/src/routes/admission.routes.js:156`; handler `withdrawApplication` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/candidate/withdraw/:id

**Auth:** `isAdmissionCandidate`

**Roles:** `admission_candidate`

**Middleware:** `isAdmissionCandidate`

**What it does:** Admin withdrawal. Withdraw application.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `reason` | string | no | Request value for reason. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `refundDetails`, `promoted_from_waitlist`. Explicit status codes include 400, 404, 500. Application withdrawn successfully

**Source:** `server/src/routes/admission.routes.js:157`; handler `withdrawApplication` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/apply

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `requireDirectTrack`, `admissionApplyLimiter`

**What it does:** Public: Dynamic Apply (validates per org structure_type). Apply for admission.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `organization_id` | string | yes | Request value for organization id. |
| `form_data` | object | no | Request value for form data. |
| `phone` | string | no | Request value for phone. |
| `email` | string | no | Request value for email. |
| `full_name` | string | yes | Request value for full name. |
| `dob` | string | no | Request value for dob. |

**Response:** JSON response fields observed in the handler include `error`, `hint`, `structure_type`, `missing_fields`, `required_fields`, `existing_application_id`, `existing_status`, `success`, `application_id`, `status`, `printout_url`, `message`, `details`. Explicit status codes include 201, 400, 403, 404, 409, 500.

**Source:** `server/src/routes/admission.routes.js:160`; handler `applyForAdmission` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/desk-enroll

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_clerk"])`

**Roles:** `org_admin`, `admission_head`, `admission_clerk`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_clerk"])`

**What it does:** Admin: Desk Enrollment (Walk-in fast-path, no OTP needed). Desk enroll.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `full_name` | string | yes | Request value for full name. |
| `phone` | string | no | Request value for phone. |
| `email` | string | no | Request value for email. |
| `dob` | string | no | Request value for dob. |
| `gender` | string | no | Request value for gender. |
| `hierarchy_id` | string | no | Request value for hierarchy id. |
| `form_data` | object | no | Request value for form data. |
| `fee_mode` | string | no | Request value for fee mode. |
| `fee_amount` | number | no | Request value for fee amount. |
| `receipt_number` | string | no | Request value for receipt number. |
| `quota_name` | string | no | Request value for quota name. |

**Response:** JSON response fields observed in the handler include `error`, `existing_id`, `hint`, `success`, `application_id`, `message`, `status`, `credentials`. Explicit status codes include 201, 400, 409, 500.

**Source:** `server/src/routes/admission.routes.js:163`; handler `deskEnroll` in `server/src/controllers/admission.controller.js`.

### GET /api/admission/export/dte

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Admin: Government CSV Exports. Export dte.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `cap_round` | string | no | Query value for cap round. |
| `status` | string | no | Query value for status. |
| `academic_year` | number | no | Query value for academic year. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `details`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:166`; handler `exportDTE` in `server/src/controllers/admission.controller.js`.

### GET /api/admission/export/saral

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Export saral.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `standard` | string | no | Query value for standard. |
| `status` | string | no | Query value for status. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `details`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:167`; handler `exportSARAL` in `server/src/controllers/admission.controller.js`.

### GET /api/admission/export/aicte

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Export aicte.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |
| `academic_year` | number | no | Query value for academic year. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `details`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:168`; handler `exportAICTE` in `server/src/controllers/admission.controller.js`.

### GET /api/admission/export/state-board

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Export state board.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `stream` | string | no | Query value for stream. |
| `standard` | string | no | Query value for standard. |
| `status` | string | no | Query value for status. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `details`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:169`; handler `exportStateBoard` in `server/src/controllers/admission.controller.js`.

### POST /api/admission/enroll

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_clerk"])`

**Roles:** `org_admin`, `admission_head`, `admission_clerk`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_clerk"])`

**What it does:** Admin: Full Enrollment (Application User Account + PRN + Welcome Email). Full enroll student.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `application_id` | string | yes | Request value for application id. |
| `quota_name` | string | no | Request value for quota name. |
| `division` | string | no | Request value for division. |
| `roll_number` | string | no | Request value for roll number. |
| `gr_number` | string | no | Request value for gr number. |
| `password` | string | yes | Request value for password. |

**Response:** JSON response fields observed in the handler include `error`, `user_id`, `hint`, `success`, `message`, `prn`, `email`, `workspace_email`, `division`, `roll_number`, `details`. Explicit status codes include 400, 404, 500.

**Source:** `server/src/routes/admission.routes.js:172`; handler `fullEnrollStudent` in `server/src/controllers/admission.controller.js`.

### PATCH /api/admission/cet/:en/allot-division

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireCETTrack`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Admin: CET Division Allotment & CAP Upgrade. Allot division for cet.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `en` | string | yes | Path identifier/value for en. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `division` | string | yes | Request value for division. |
| `roll_number` | string | no | Request value for roll number. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `en_number`, `division`, `roll_number`, `message`. Explicit status codes include 400, 404, 500.

**Source:** `server/src/routes/admission.routes.js:175`; handler `allotDivisionForCET` in `server/src/controllers/admission.controller.js`.

### PATCH /api/admission/cet/:en/mark-upgraded

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**Roles:** `org_admin`, `admission_head`, `admission_verifier`

**Middleware:** `isAuthenticated`, `requireCETTrack`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**What it does:** Mark cetupgraded.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `en` | string | yes | Path identifier/value for en. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `reason` | string | no | Request value for reason. |
| `target_college` | string | no | Request value for target college. |
| `cap_round_upgraded_to` | string | no | Request value for cap round upgraded to. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `en_number`, `old_status`, `new_status`, `seat_released`, `promoted_from_waitlist`, `message`. Explicit status codes include 400, 404, 500.

**Source:** `server/src/routes/admission.routes.js:176`; handler `markCETUpgraded` in `server/src/controllers/admission.controller.js`.

### GET /api/admission/applications

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_counselor","admission_clerk","admission_verifier"])`

**Roles:** `org_admin`, `admission_head`, `admission_counselor`, `admission_clerk`, `admission_verifier`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_counselor","admission_clerk","admission_verifier"])`

**What it does:** Day 15: Document Processing & Merit Engine. Get applications list.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchy_id` | string | no | Query value for hierarchy id. |
| `status` | string | no | Query value for status. |
| `search` | string | no | Query value for search. |
| `page` | number | no | Query value for page. Default: `1`. |
| `limit` | number | no | Query value for limit. Default: `50`. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `total`, `page`, `limit`, `applications`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:179`; handler `getApplicationsList` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/docs/validate-expiry

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Validate document expiry.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `application_id` | string | no | Request value for application id. |
| `documents` | string | no | Request value for documents. |

**Response:** JSON response fields observed in the handler include `error`. Explicit status codes include 400, 404, 500.

**Source:** `server/src/routes/admission.routes.js:180`; handler `validateDocumentExpiry` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/direct/generate-merit

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Generate merit.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchy_id` | string | no | Request value for hierarchy id. |

**Response:** JSON response fields observed in the handler include `success`, `message`, `count`, `merit_list`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:181`; handler `generateMerit` in `server/src/controllers/admission-operations.controller.js`.

### GET /api/admission/direct/merit-list

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_counselor"])`

**Roles:** `org_admin`, `admission_head`, `admission_counselor`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_counselor"])`

**What it does:** Get merit list.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchy_id` | string | no | Query value for hierarchy id. |
| `category` | string | no | Query value for category. |
| `seat_type` | string | no | Query value for seat type. |
| `gender` | string | no | Query value for gender. |
| `page` | number | no | Query value for page. Default: `1`. |
| `limit` | number | no | Query value for limit. Default: `100`. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `total`, `page`, `limit`, `merit_list`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:182`; handler `getMeritList` in `server/src/controllers/admission-operations.controller.js`.

### GET /api/admission/print/application/:id

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Get application print data.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`, `print_data`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/admission.routes.js:183`; handler `getApplicationPrintData` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/applications/merge

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Day 16: Merge, Division Allocation & Batch PRN. Merge applications.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `primary_id` | string | yes | Request value for primary id. |
| `duplicate_id` | string | yes | Request value for duplicate id. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `primary_id`, `deleted_duplicate`. Explicit status codes include 400, 404, 500. Applications merged successfully.

**Source:** `server/src/routes/admission.routes.js:186`; handler `mergeApplications` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/allocate-divisions

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Allocate divisions.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchy_id` | string | yes | Request value for hierarchy id. |
| `divisions` | string | yes | Request value for divisions. |
| `method` | string | no | Request value for method. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/admission.routes.js:187`; handler `allocateDivisions` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/generate-prns

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Batch generate prns route.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `application_ids` | array | yes | Request value for application ids. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `results`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/admission.routes.js:188`; handler `batchGeneratePRNsRoute` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/cet/:en_number/report

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**Roles:** `org_admin`, `admission_head`, `admission_verifier`

**Middleware:** `isAuthenticated`, `requireCETTrack`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**What it does:** Day 18 & Phase D: RLA, NOC, & Upgrades. Report rla.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `en_number` | string | yes | Path identifier/value for en number. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `rla_status`, `details`. Explicit status codes include 400, 404, 500. Student physically reported successfully. Fee payment unlocked.

**Source:** `server/src/routes/admission.routes.js:191`; handler `reportRLA` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/cet/:en_number/request-noc

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireCETTrack`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Request noc.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `en_number` | string | yes | Path identifier/value for en number. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `details`. Explicit status codes include 404, 500. NOC Issued. Seat released to pool.

**Source:** `server/src/routes/admission.routes.js:192`; handler `requestNOC` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/cet/:en_number/confirm-upgrade

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireCETTrack`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Confirm upgrade.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `en_number` | string | yes | Path identifier/value for en number. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `details`. Explicit status codes include 404, 500. Upgrade transfer confirmed successfully. Proceed to Fee Payment.

**Source:** `server/src/routes/admission.routes.js:193`; handler `confirmUpgrade` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/notify

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Day 19: Notification Dispatch. Send admission notification.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `application_ids` | array | yes | Request value for application ids. |
| `trigger` | string | yes | Request value for trigger. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `total`, `results`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/admission.routes.js:196`; handler `sendAdmissionNotification` in `server/src/controllers/admission-operations.controller.js`.

### GET /api/admission/sms-budget

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Get sms budget.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** Returns the handler result as JSON or an HTTP error response.

**Source:** `server/src/routes/admission.routes.js:197`; handler `getSmsBudget` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/parent/login

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `admissionParentLoginLimiter`

**What it does:** Day 20: Parent Tracking Portal (Public Auth). Parent login.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id_token` | string | yes | Request value for id token. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `token`, `children`. Explicit status codes include 400, 401, 404, 500.

**Source:** `server/src/routes/admission.routes.js:200`; handler `parentLogin` in `server/src/controllers/admission-operations.controller.js`.

### GET /api/admission/parent/status/:applicationId

**Auth:** `isParent`

**Roles:** `parent`

**Middleware:** `isParent`

**What it does:** Parent get status.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `applicationId` | string | yes | Path identifier/value for application id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`, `student_name`, `status`, `organization`, `program`, `category`, `merit_score`, `prn`, `fee_paid`, `applied_at`, `timeline`. Explicit status codes include 403, 404, 500.

**Source:** `server/src/routes/admission.routes.js:201`; handler `parentGetStatus` in `server/src/controllers/admission-operations.controller.js`.

### GET /api/admission/parent/documents/:applicationId

**Auth:** `isParent`

**Roles:** `parent`

**Middleware:** `isParent`

**What it does:** Parent get documents.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `applicationId` | string | yes | Path identifier/value for application id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`, `student_name`, `prn`, `documents`. Explicit status codes include 403, 404, 500.

**Source:** `server/src/routes/admission.routes.js:202`; handler `parentGetDocuments` in `server/src/controllers/admission-operations.controller.js`.

### GET /api/admission/analytics

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Day 20: Admin Analytics & Engineering Dashboard. Get admission analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchy_id` | string | no | Query value for hierarchy id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `summary`, `document_summary`, `fee_summary`, `merit_rounds_status`, `breakdown`, `daily_trend`, `score_distribution`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:205`; handler `getAdmissionAnalytics` in `server/src/controllers/admission-operations.controller.js`.

### GET /api/admission/cet/dashboard

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Get cetdashboard.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `cap_rounds`, `branch_fill_rates`, `rla_breakdown`, `seat_matrix`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/admission.routes.js:206`; handler `getCETDashboard` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/acap/register

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `admissionApplyLimiter`

**What it does:** Day 21: ACAP Operations. Acap register.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `organization_id` | string | yes | Request value for organization id. |
| `full_name` | string | yes | Request value for full name. |
| `phone` | string | no | Request value for phone. |
| `email` | string | no | Request value for email. |
| `dob` | string | no | Request value for dob. |
| `form_data` | object | no | Request value for form data. |
| `acap_type` | string | yes | Request value for acap type. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `application_id`, `acap_type`, `scholarships_enabled`, `message`. Explicit status codes include 201, 400, 403, 500.

**Source:** `server/src/routes/admission.routes.js:209`; handler `acapRegister` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/acap/generate-merit

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Public. Acap generate merit.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `hierarchy_id` | string | no | Request value for hierarchy id. |
| `acap_type` | string | yes | Request value for acap type. |
| `list_type` | string | no | Request value for list type. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `acap_type`, `list_type`, `count`, `merit_list`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/admission.routes.js:210`; handler `acapGenerateMerit` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/acap/verify-gate

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**Roles:** `org_admin`, `admission_head`, `admission_verifier`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**What it does:** Verify gate entry.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `application_id` | string | no | Request value for application id. |
| `phone` | string | no | Request value for phone. |
| `en_number` | string | no | Request value for en number. |

**Response:** JSON response fields observed in the handler include `verified`, `error`, `action`, `boarding_token`, `full_name`, `merit_score`, `category`, `status`. Explicit status codes include 403, 404, 500.

**Source:** `server/src/routes/admission.routes.js:211`; handler `verifyGateEntry` in `server/src/controllers/admission-operations.controller.js`.

### GET /api/admission/merit-list/live

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `admissionLiveMeritLimiter`

**What it does:** Day 21: Live Merit List (Public-accessible with org_id, cached 5s). Get live merit list optimized.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `org_id` | string | no | Query value for org id. |
| `hierarchy_id` | string | no | Query value for hierarchy id. |
| `category` | string | no | Query value for category. |
| `limit` | number | no | Query value for limit. Default: `200`. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`, `timestamp`, `count`, `list`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/admission.routes.js:214`; handler `getLiveMeritListOptimized` in `server/src/controllers/admission-operations.controller.js`.

### PATCH /api/admission/applications/:id/stage

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**Roles:** `org_admin`, `admission_head`, `admission_verifier`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**What it does:** Day 22: Admin Verification & Selection. Update application stage.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Request value for status. |
| `comment` | string | no | Request value for comment. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `application_id`, `status`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/admission.routes.js:217`; handler `updateApplicationStage` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/admin/bulk-verify

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**Roles:** `org_admin`, `admission_head`, `admission_verifier`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head","admission_verifier"])`

**What it does:** Bulk verify applications.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `application_ids` | array | yes | Request value for application ids. |
| `comment` | string | no | Request value for comment. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `count`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/admission.routes.js:218`; handler `bulkVerifyApplications` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/admin/bulk-select

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Bulk select applications.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `application_ids` | array | yes | Request value for application ids. |
| `comment` | string | no | Request value for comment. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `count`. Explicit status codes include 400, 500.

**Source:** `server/src/routes/admission.routes.js:219`; handler `bulkSelectApplications` in `server/src/controllers/admission-operations.controller.js`.

### POST /api/admission/admin/bulk-update-compliance

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Bulk update compliance.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `updates` | string (date/time) | no | Request value for updates. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `failed_updates`. Explicit status codes include 400, 404, 500.

**Source:** `server/src/routes/admission.routes.js:220`; handler `bulkUpdateCompliance` in `server/src/controllers/student-compliance.controller.js`.

### POST /api/admission/round/advance

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Day 24: Round Management. Advance admission round.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `round_data`, `details`. Explicit status codes include 400, 404, 500.

**Source:** `server/src/routes/admission.routes.js:223`; handler `advanceAdmissionRound` in `server/src/controllers/admission-operations.controller.js`.

### PATCH /api/admission/applications/:id/unlock-edit

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Edge Case 4 Extension: Per-Student Edit Lock Override. Unlock student edit window.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `reason` | string | yes | Request value for reason. |

**Response:** JSON response fields observed in the handler include `error`, `unlocked_at`, `success`, `message`, `application_id`, `unlocked_by`, `details`. Explicit status codes include 400, 404, 500.

**Source:** `server/src/routes/admission.routes.js:226`; handler `unlockStudentEditWindow` in `server/src/controllers/admission-operations.controller.js`.

### PATCH /api/admission/applications/:id/lock-edit

**Auth:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**Roles:** `org_admin`, `admission_head`

**Middleware:** `isAuthenticated`, `requireAdmissionRole(["org_admin","admission_head"])`

**What it does:** Lock student edit window.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `success`, `message`, `details`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/admission.routes.js:227`; handler `lockStudentEditWindow` in `server/src/controllers/admission-operations.controller.js`.

### GET /api/admission/dashboard/list

**Auth:** `isAuthenticated`, `requireRole("org_admin")`, `attachInstitutionProfile()`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`, `attachInstitutionProfile()`

**What it does:** Get admissions.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |
| `search` | string | no | Query value for search. |
| `page` | number | no | Query value for page. |
| `limit` | number | no | Query value for limit. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `message`. Explicit status codes include 200, 500.

**Source:** `server/src/routes/admission.routes.js:232`; handler `getAdmissions` in `server/src/controllers/admission.controller.js`.

### GET /api/admission/dashboard/:id

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get application.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `message`. Explicit status codes include 200.

**Source:** `server/src/routes/admission.routes.js:233`; handler `getApplication` in `server/src/controllers/admission.controller.js`.

### PATCH /api/admission/dashboard/:id/status

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Update status.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | yes | Request value for status. |
| `reviewNotes` | string | no | Request value for review notes. |

**Response:** JSON response fields observed in the handler include `success`, `message`, `data`. Explicit status codes include 200, 400. New status is required.

**Source:** `server/src/routes/admission.routes.js:234`; handler `updateStatus` in `server/src/controllers/admission.controller.js`.

## crm.routes.js

**Mounted at:** `/api/crm`

| Method | Path | Access |
|---|---|---|
| POST | `/api/crm/leads` | `org_admin`, `counselor`, `fee_manager`, `admission_head` |
| GET | `/api/crm/leads` | `org_admin`, `counselor`, `fee_manager`, `admission_head` |
| PATCH | `/api/crm/leads/:id/stage` | `org_admin`, `counselor`, `fee_manager` |
| PATCH | `/api/crm/leads/:id/follow-up` | `org_admin`, `counselor`, `fee_manager` |
| GET | `/api/crm/leads/due-today` | `org_admin`, `counselor` |
| DELETE | `/api/crm/leads/:id` | `org_admin` |

### POST /api/crm/leads

**Auth:** `isAuthenticated`, `requireRole(["org_admin","counselor","fee_manager","admission_head"])`

**Roles:** `org_admin`, `counselor`, `fee_manager`, `admission_head`

**Middleware:** `isAuthenticated`, `requireRole(["org_admin","counselor","fee_manager","admission_head"])`

**What it does:** Create a new lead. Creates or processes leads.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `student_name` | string | yes | Request value for student name. |
| `parent_name` | string | no | Request value for parent name. |
| `phone` | string | yes | Request value for phone. |
| `email` | string | no | Request value for email. |
| `source` | string | no | Request value for source. |
| `interested_course` | string | no | Request value for interested course. |
| `interested_batch` | string | no | Request value for interested batch. |
| `current_class` | string | no | Request value for current class. |
| `notes` | string | no | Request value for notes. |

**Response:** JSON response fields observed in the handler include `error`, `existing_stage`, `success`, `lead`. Explicit status codes include 201, 400, 409, 500.

**Source:** `server/src/routes/crm.routes.js:16`; handler `inline handler` in `server/src/routes/crm.routes.js`.

### GET /api/crm/leads

**Auth:** `isAuthenticated`, `requireRole(["org_admin","counselor","fee_manager","admission_head"])`

**Roles:** `org_admin`, `counselor`, `fee_manager`, `admission_head`

**Middleware:** `isAuthenticated`, `requireRole(["org_admin","counselor","fee_manager","admission_head"])`

**What it does:** List leads with pipeline filtering. Retrieves leads.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `stage` | string | no | Query value for stage. |
| `assigned_to` | string | no | Query value for assigned to. |
| `source` | string | no | Query value for source. |
| `page` | number | no | Query value for page. Default: `1`. |
| `limit` | number | no | Query value for limit. Default: `50`. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `leads`, `total`, `pipeline`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/crm.routes.js:56`; handler `inline handler` in `server/src/routes/crm.routes.js`.

### PATCH /api/crm/leads/:id/stage

**Auth:** `isAuthenticated`, `requireRole(["org_admin","counselor","fee_manager"])`

**Roles:** `org_admin`, `counselor`, `fee_manager`

**Middleware:** `isAuthenticated`, `requireRole(["org_admin","counselor","fee_manager"])`

**What it does:** Update lead stage. Updates leads stage.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `stage` | string | no | Request value for stage. |
| `note` | string | no | Request value for note. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `lead`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/crm.routes.js:90`; handler `inline handler` in `server/src/routes/crm.routes.js`.

### PATCH /api/crm/leads/:id/follow-up

**Auth:** `isAuthenticated`, `requireRole(["org_admin","counselor","fee_manager"])`

**Roles:** `org_admin`, `counselor`, `fee_manager`

**Middleware:** `isAuthenticated`, `requireRole(["org_admin","counselor","fee_manager"])`

**What it does:** Add follow-up note + set next date. Updates leads follow up.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `note` | string | no | Request value for note. |
| `next_follow_up` | string | no | Request value for next follow up. |

**Response:** JSON response fields observed in the handler include `error`, `success`, `lead`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/crm.routes.js:115`; handler `inline handler` in `server/src/routes/crm.routes.js`.

### GET /api/crm/leads/due-today

**Auth:** `isAuthenticated`, `requireRole(["org_admin","counselor"])`

**Roles:** `org_admin`, `counselor`

**Middleware:** `isAuthenticated`, `requireRole(["org_admin","counselor"])`

**What it does:** Get leads needing follow-up today. Retrieves leads due today.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `count`, `leads`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/crm.routes.js:137`; handler `inline handler` in `server/src/routes/crm.routes.js`.

### DELETE /api/crm/leads/:id

**Auth:** `isAuthenticated`, `requireRole(["org_admin"])`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole(["org_admin"])`

**What it does:** Soft delete a lead. Deletes leads.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `error`. Explicit status codes include 500. Lead deleted.

**Source:** `server/src/routes/crm.routes.js:161`; handler `inline handler` in `server/src/routes/crm.routes.js`.

