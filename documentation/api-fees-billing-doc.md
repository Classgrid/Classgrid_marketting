This reference is generated from the current Express route definitions and their handlers. It documents route-level authentication and authorization; deployment-wide middleware may add further checks.

## Conventions

- Base API origin: `https://api.classgrid.in`
- Authentication: authenticated routes use the Classgrid session/JWT recognized by `isAuthenticated`.
- JSON is the default request and response format unless an endpoint explicitly accepts multipart data or redirects.
- Path parameters are always required.
- A field marked `no` means the static handler scan did not find a direct required-field check; business rules may still make it conditionally required.
- Role checks can also accept `super_admin` through the shared authorization middleware where implemented.

This document contains **35 route definitions** from 6 source files.

## fees.routes.js

**Mounted at:** `/api/fees`

| Method | Path | Access |
|---|---|---|
| GET | `/api/fees/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/fees/structures` | `org_admin` |
| GET | `/api/fees/structures` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/fees/structures/:id` | `org_admin` |
| POST | `/api/fees/assign` | `org_admin` |
| POST | `/api/fees/pay` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/fees/students` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/fees/me` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/fees/payments` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/fees/analytics` | `org_admin` |
| PATCH | `/api/fees/students/:id/block` | `org_admin` |
| POST | `/api/fees/razorpay/order` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/fees/razorpay/verify` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/fees/razorpay/webhook` | Public endpoint unless an upstream platform gate applies. |
| PUT | `/api/fees/razorpay/config` | `org_admin` |
| GET | `/api/fees/razorpay/config` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/fees/institution-profile

**Auth:** `isAuthenticated`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile()`

**What it does:** Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `fee_profile`, `learner_record_profile`.

**Source:** `server/src/routes/fees.routes.js:14`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### POST /api/fees/structures

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`, `requireRole("org_admin")`

**What it does:** Creates or processes structures.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | no | Request value for name. |
| `academic_year` | number | no | Request value for academic year. |
| `division_id` | string | no | Request value for division id. |
| `total_amount` | number | no | Request value for total amount. |
| `due_date` | string (date/time) | no | Request value for due date. |
| `late_fine_per_day` | number | no | Request value for late fine per day. |
| `components` | string | no | Request value for components. |
| `payment_mode` | string | no | Request value for payment mode. |

**Response:** JSON response fields observed in the handler include `structure`, `message`. Explicit status codes include 201, 500. Server error

**Source:** `server/src/routes/fees.routes.js:37`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### GET /api/fees/structures

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`

**What it does:** Retrieves structures.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `structures`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fees.routes.js:102`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### DELETE /api/fees/structures/:id

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`, `requireRole("org_admin")`

**What it does:** Deletes structures.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Fee structure deleted

**Source:** `server/src/routes/fees.routes.js:123`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### POST /api/fees/assign

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`, `requireRole("org_admin")`

**What it does:** Creates or processes assign.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `structure_id` | string | no | Request value for structure id. |
| `student_ids` | array | no | Request value for student ids. |

**Response:** JSON response fields observed in the handler include `message`, `records`. Explicit status codes include 404, 500. Structure not found

**Source:** `server/src/routes/fees.routes.js:142`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### POST /api/fees/pay

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`

**What it does:** Creates or processes pay.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `student_fee_id` | string | no | Request value for student fee id. |
| `amount` | number | no | Request value for amount. |
| `payment_method` | string | no | Request value for payment method. |
| `reference_number` | string | no | Request value for reference number. |
| `notes` | string | no | Request value for notes. |
| `payment_date` | string (date/time) | no | Request value for payment date. |

**Response:** JSON response fields observed in the handler include `message`, `payment`, `new_status`, `new_paid`. Explicit status codes include 403, 404, 500. Students cannot record payments

**Source:** `server/src/routes/fees.routes.js:185`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### GET /api/fees/students

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`

**What it does:** Retrieves students.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |
| `division_id` | string | no | Query value for division id. |
| `structure_id` | string | no | Query value for structure id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `fees`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fees.routes.js:243`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### GET /api/fees/me

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`

**What it does:** Retrieves me.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `fees`, `payments`, `summary`, `razorpay_configured`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fees.routes.js:271`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### GET /api/fees/payments

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`

**What it does:** Retrieves payments.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `payments`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fees.routes.js:312`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### GET /api/fees/analytics

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`, `requireRole("org_admin")`

**What it does:** Retrieves analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `totalCollection`, `totalPayable`, `totalPending`, `totalStudents`, `paidCount`, `partialCount`, `unpaidCount`, `overdueCount`, `collectionRate`, `charts`, `defaulters`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fees.routes.js:334`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### PATCH /api/fees/students/:id/block

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`, `requireRole("org_admin")`

**What it does:** Updates students block.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `is_blocked` | boolean | yes | Request value for is blocked. |

**Response:** JSON response fields observed in the handler include `message`, `record`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fees.routes.js:430`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### POST /api/fees/razorpay/order

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`

**What it does:** Creates or processes razorpay order.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `student_fee_id` | string | no | Request value for student fee id. |
| `amount` | number | no | Request value for amount. |

**Response:** JSON response fields observed in the handler include `message`, `order_id`, `amount`, `currency`, `key_id`, `student_fee_id`, `student_name`, `student_email`. Explicit status codes include 400, 404, 500. Fee record not found

**Source:** `server/src/routes/fees.routes.js:452`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### POST /api/fees/razorpay/verify

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`

**What it does:** Verifies the supplied information.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `razorpay_order_id` | string | no | Request value for razorpay order id. |
| `razorpay_payment_id` | string | no | Request value for razorpay payment id. |
| `razorpay_signature` | string | no | Request value for razorpay signature. |
| `student_fee_id` | string | no | Request value for student fee id. |
| `amount` | number | no | Request value for amount. |

**Response:** JSON response fields observed in the handler include `message`, `payment`, `new_status`. Explicit status codes include 400, 404, 500. Razorpay not configured for this organization

**Source:** `server/src/routes/fees.routes.js:529`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### POST /api/fees/razorpay/webhook

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Creates or processes razorpay webhook.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `event` | string | no | Request value for event. |
| `payload` | object | no | Request value for payload. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. Invalid webhook signature

**Source:** `server/src/routes/fees.routes.js:605`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### PUT /api/fees/razorpay/config

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`, `requireRole("org_admin")`

**What it does:** Updates razorpay config.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `fees_razorpay_key_id` | string | yes | Request value for fees razorpay key id. |
| `fees_razorpay_key_secret` | string | no | Request value for fees razorpay key secret. |
| `fees_razorpay_webhook_secret` | string | no | Request value for fees razorpay webhook secret. |

**Response:** JSON response fields observed in the handler include `message`, `configured`. Explicit status codes include 404, 500. Organization not found

**Source:** `server/src/routes/fees.routes.js:690`; handler `inline handler` in `server/src/routes/fees.routes.js`.

### GET /api/fees/razorpay/config

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachOptionalInstitutionProfile`

**What it does:** Retrieves razorpay config.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `configured`, `key_id_preview`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fees.routes.js:717`; handler `inline handler` in `server/src/routes/fees.routes.js`.

## fee-records.routes.js

**Mounted at:** `/api/fee-records`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| GET | `/api/fee-records/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/fee-records/create` | `org_admin` |
| GET | `/api/fee-records/all` | `org_admin` |
| GET | `/api/fee-records/summary` | `org_admin` |
| GET | `/api/fee-records/reminders` | `org_admin`, `faculty` |
| PATCH | `/api/fee-records/:recordId/pay` | `org_admin`, `faculty` |
| GET | `/api/fee-records/me` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/fee-records/student/:studentId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/fee-records/institution-profile

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**What it does:** Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `fee_profile`, `learner_record_profile`.

**Source:** `server/src/routes/fee-records.routes.js:12`; handler `inline handler` in `server/src/routes/fee-records.routes.js`.

### POST /api/fee-records/create

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Assign a fee record to one or multiple students in bulk. Sends a notification to each student about the new charge. Creates the requested resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `studentIds` | string | yes | Request value for student ids. |
| `title` | string | yes | Request value for title. |
| `category` | string | no | Request value for category. |
| `amount` | number | yes | Request value for amount. |
| `dueDate` | string | yes | Request value for due date. |
| `remarks` | string | no | Request value for remarks. |

**Response:** JSON response fields observed in the handler include `message`, `count`. Explicit status codes include 201, 400, 500. studentIds, title, amount, and dueDate are required

**Source:** `server/src/routes/fee-records.routes.js:29`; handler `inline handler` in `server/src/routes/fee-records.routes.js`.

### GET /api/fee-records/all

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Admin view: All fee records across the org with student names populated. Supports filters: ?status=pending&category=exam&overdue=true. Retrieves all.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |
| `category` | string | no | Query value for category. |
| `overdue` | string | no | Query value for overdue. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `total`, `records`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fee-records.routes.js:77`; handler `inline handler` in `server/src/routes/fee-records.routes.js`.

### GET /api/fee-records/summary

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin')`

**What it does:** Admin dashboard: Financial overview with category-wise breakdown. Retrieves summary.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `overview`, `counts`, `categoryBreakdown`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fee-records.routes.js:106`; handler `inline handler` in `server/src/routes/fee-records.routes.js`.

### GET /api/fee-records/reminders

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty')`

**Roles:** `org_admin`, `faculty`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty')`

**What it does:** Auto-flag overdue students and return the list. Also auto-updates status from 'pending' to 'overdue' for past-due records. Retrieves reminders.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `flaggedCount`, `totalOverdueStudents`, `totalOverdueAmount`, `reminders`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fee-records.routes.js:157`; handler `inline handler` in `server/src/routes/fee-records.routes.js`.

### PATCH /api/fee-records/:recordId/pay

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty')`

**Roles:** `org_admin`, `faculty`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','faculty')`

**What it does:** Record a partial or full payment for a specific fee record. Updates pay.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `recordId` | string | yes | Path identifier/value for record id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `amount` | number | yes | Request value for amount. |
| `paymentReference` | string | no | Request value for payment reference. |

**Response:** JSON response fields observed in the handler include `message`, `record`. Explicit status codes include 400, 404, 500. Valid payment amount is required

**Source:** `server/src/routes/fee-records.routes.js:228`; handler `inline handler` in `server/src/routes/fee-records.routes.js`.

### GET /api/fee-records/me

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Student's own fee records with summary. Retrieves me.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `summary`, `records`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/fee-records.routes.js:276`; handler `inline handler` in `server/src/routes/fee-records.routes.js`.

### GET /api/fee-records/student/:studentId

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Faculty/Admin can view a specific student's fees. Retrieves student.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `studentId` | string | yes | Path identifier/value for student id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `student`, `summary`, `records`. Explicit status codes include 403, 500. Access denied

**Source:** `server/src/routes/fee-records.routes.js:304`; handler `inline handler` in `server/src/routes/fee-records.routes.js`.

## billing-checkout.routes.js

**Mounted at:** `/api/billing/checkout`

**File-wide middleware:** `generalLimiter`

| Method | Path | Access |
|---|---|---|
| GET | `/api/billing/checkout/session` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/billing/checkout/verify-otp` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/billing/checkout/confirm` | Public endpoint unless an upstream platform gate applies. |

### GET /api/billing/checkout/session

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `generalLimiter`

**What it does:** Retrieves session.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | no | Query value for token. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `error`, `data`. Explicit status codes include 400, 404.

**Source:** `server/src/routes/billing-checkout.routes.js:42`; handler `inline handler` in `server/src/routes/billing-checkout.routes.js`.

### POST /api/billing/checkout/verify-otp

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `generalLimiter`

**What it does:** Verifies the supplied information.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |
| `otp` | string | no | Request value for otp. |
| `payerName` | string | no | Request value for payer name. |
| `payerEmail` | string | no | Request value for payer email. |

**Response:** JSON response fields observed in the handler include `success`, `error`, `data`. Explicit status codes include 400, 404, 409, 429.

**Source:** `server/src/routes/billing-checkout.routes.js:68`; handler `inline handler` in `server/src/routes/billing-checkout.routes.js`.

### POST /api/billing/checkout/confirm

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `generalLimiter`

**What it does:** Creates or processes confirm.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |
| `razorpay_payment_id` | string | yes | Request value for razorpay payment id. |
| `razorpay_order_id` | string | yes | Request value for razorpay order id. |
| `razorpay_signature` | string | yes | Request value for razorpay signature. |

**Response:** JSON response fields observed in the handler include `success`, `error`, `code`, `data`. Explicit status codes include 400, 404.

**Source:** `server/src/routes/billing-checkout.routes.js:134`; handler `inline handler` in `server/src/routes/billing-checkout.routes.js`.

## billing-demo.routes.js

**Mounted at:** `/api/billing/demo`

| Method | Path | Access |
|---|---|---|
| POST | `/api/billing/demo/session` | Public endpoint unless an upstream platform gate applies. |
| GET | `/api/billing/demo/status` | Public endpoint unless an upstream platform gate applies. |

### POST /api/billing/demo/session

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Creates (or refreshes) a 48-hour demo billing session. Returns the checkout URL + demo credentials. Protected: BILLING_DEMO_ENABLED must be "true". Creates or processes session.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `error`, `detail`, `data`. Explicit status codes include 201, 403, 500, 502.

**Source:** `server/src/routes/billing-demo.routes.js:47`; handler `inline handler` in `server/src/routes/billing-demo.routes.js`.

### GET /api/billing/demo/status

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Returns whether demo mode is active + a live checkout URL if a valid session exists. Called by the landing page on load to get the current demo link. Retrieves status.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `enabled`, `has_active_session`, `expires_at`, `error`.

**Source:** `server/src/routes/billing-demo.routes.js:193`; handler `inline handler` in `server/src/routes/billing-demo.routes.js`.

## billing-handoff.routes.js

**Mounted at:** `/api/billing/handoff`

| Method | Path | Access |
|---|---|---|
| POST | `/api/billing/handoff/initiate` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/billing/handoff/resend-otp` | Public endpoint unless an upstream platform gate applies. |

### POST /api/billing/handoff/initiate

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `generalLimiter`, `isAuthenticated`

**What it does:** Creates a checkout only from a server-resolved payable. Client-provided amount, recipient email, merchant account, and arbitrary context are ignored. Creates or processes initiate.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `organization_id` | string | no | Request value for organization id. |
| `organizationId` | string | no | Request value for organization id. |
| `payment_type` | string | no | Request value for payment type. |
| `paymentType` | string | no | Request value for payment type. |
| `return_url` | string | no | Request value for return url. |
| `returnUrl` | string | no | Request value for return url. |

**Response:** JSON response fields observed in the handler include `success`, `code`, `error`, `data`. Explicit status codes include 201, 404, 409.

**Source:** `server/src/routes/billing-handoff.routes.js:79`; handler `inline handler` in `server/src/routes/billing-handoff.routes.js`.

### POST /api/billing/handoff/resend-otp

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `generalLimiter`

**What it does:** Resends the requested information.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | no | Request value for token. |

**Response:** JSON response fields observed in the handler include `success`, `error`, `message`. Explicit status codes include 400, 404, 429. OTP resent successfully

**Source:** `server/src/routes/billing-handoff.routes.js:208`; handler `inline handler` in `server/src/routes/billing-handoff.routes.js`.

## payroll.routes.js

**Mounted at:** `/api/payroll`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| GET | `/api/payroll/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/payroll/calculate` | `org_admin`, `super_admin` |
| GET | `/api/payroll/summary` | `org_admin`, `super_admin` |
| GET | `/api/payroll/me` | `faculty`, `teacher`, `org_admin` |

### GET /api/payroll/institution-profile

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**What it does:** Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `staff_assignment_profile`, `learner_record_profile`.

**Source:** `server/src/routes/payroll.routes.js:10`; handler `inline handler` in `server/src/routes/payroll.routes.js`.

### POST /api/payroll/calculate

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("org_admin","super_admin")`

**What it does:** Admin limits. Calculate payroll.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `month` | number | yes | Request value for month. |

**Response:** JSON response fields observed in the handler include `success`, `message`, `data`. Explicit status codes include 200, 400, 500. Invalid month format. Use YYYY-MM.

**Source:** `server/src/routes/payroll.routes.js:19`; handler `calculatePayroll` in `server/src/controllers/payroll.controller.js`.

### GET /api/payroll/summary

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("org_admin","super_admin")`

**What it does:** Get payroll summary.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `month` | number | yes | Query value for month. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `data`. Explicit status codes include 200, 400, 500. Month is required.

**Source:** `server/src/routes/payroll.routes.js:20`; handler `getPayrollSummary` in `server/src/controllers/payroll.controller.js`.

### GET /api/payroll/me

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","teacher","org_admin")`

**Roles:** `faculty`, `teacher`, `org_admin`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole("faculty","teacher","org_admin")`

**What it does:** Faculty personal route. Get my payslip.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `month` | number | yes | Query value for month. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `data`. Explicit status codes include 200, 400, 404, 500. Month is required.

**Source:** `server/src/routes/payroll.routes.js:23`; handler `getMyPayslip` in `server/src/controllers/payroll.controller.js`.

