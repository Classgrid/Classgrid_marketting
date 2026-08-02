This reference is generated from the current Express route definitions and their handlers. It documents route-level authentication and authorization; deployment-wide middleware may add further checks.

## Conventions

- Base API origin: `https://api.classgrid.in`
- Authentication: authenticated routes use the Classgrid session/JWT recognized by `isAuthenticated`.
- JSON is the default request and response format unless an endpoint explicitly accepts multipart data or redirects.
- Path parameters are always required.
- A field marked `no` means the static handler scan did not find a direct required-field check; business rules may still make it conditionally required.
- Role checks can also accept `super_admin` through the shared authorization middleware where implemented.

This document contains **226 route definitions** from 4 source files.

## org.routes.js

**Mounted at:** `/api/org-admin`

| Method | Path | Access |
|---|---|---|
| GET | `/api/org-admin/my-config` | `org_admin` |
| GET | `/api/org-admin/usage` | `org_admin` |
| GET | `/api/org-admin/billing` | `org_admin` |
| PUT | `/api/org-admin/billing/settings` | `org_admin` |
| POST | `/api/org-admin/billing/verify-email/send` | `org_admin` |
| POST | `/api/org-admin/billing/verify-email/confirm` | `org_admin` |
| POST | `/api/org-admin/billing/verify-phone/send` | `org_admin` |
| POST | `/api/org-admin/billing/verify-phone/confirm` | `org_admin` |
| GET | `/api/org-admin/billing/invoice/:invoiceId/pdf` | `org_admin` |
| GET | `/api/org-admin/dashboard` | `org_admin` |
| GET | `/api/org-admin/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PATCH | `/api/org-admin/domains` | `org_admin` |
| PATCH | `/api/org-admin/type` | `org_admin` |
| POST | `/api/org-admin/invite-staff` | `org_admin` |
| POST | `/api/org-admin/request-role` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/org-admin/accept-role-request/:requestId` | `org_admin` |
| POST | `/api/org-admin/reject-role-request/:requestId` | `org_admin` |
| GET | `/api/org-admin/members` | `org_admin` |
| GET | `/api/org-admin/members/pending` | `org_admin` |
| DELETE | `/api/org-admin/members/:userId` | `org_admin` |
| POST | `/api/org-admin/members/:userId/resend` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/academic-config` | `org_admin` |
| PUT | `/api/org-admin/academic-config` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/dashboard/overview` | `org_admin` |
| GET | `/api/org-admin/dashboard/billing` | `org_admin` |
| POST | `/api/org-admin/dashboard/billing/razorpay-order` | `org_admin` |
| POST | `/api/org-admin/dashboard/billing/razorpay-verify` | `org_admin` |
| GET | `/api/org-admin/dashboard/analytics` | `org_admin` |
| GET | `/api/org-admin/dashboard/users` | `org_admin` |
| GET | `/api/org-admin/dashboard/classrooms` | `org_admin` |
| GET | `/api/org-admin/dashboard/classrooms/:id/members` | `org_admin` |
| GET | `/api/org-admin/dashboard/activity` | `org_admin` |
| GET | `/api/org-admin/users/export` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| POST | `/api/org-admin/bulk-suspend` | `org_admin` |
| POST | `/api/org-admin/bulk-role-update` | `org_admin` |
| POST | `/api/org-admin/change-role` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/pending-invites` | `org_admin` |
| POST | `/api/org-admin/resend-invite` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/academic-years` | `org_admin` |
| POST | `/api/org-admin/academic-years` | `org_admin` |
| GET | `/api/org-admin/division-mappings` | `org_admin` |
| POST | `/api/org-admin/division-mappings` | `org_admin` |
| GET | `/api/org-admin/promotion-preview` | `org_admin` |
| POST | `/api/org-admin/promote` | `org_admin` |
| GET | `/api/org-admin/promotion-batches` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads` | `org_admin` |
| GET | `/api/org-admin/helpdesk/threads/:threadId` | `org_admin` |
| POST | `/api/org-admin/helpdesk/threads/:threadId/messages` | `org_admin` |
| PATCH | `/api/org-admin/helpdesk/threads/:threadId/read` | `org_admin` |
| GET | `/api/org-admin/data-export` | `org_admin` |
| POST | `/api/org-admin/import/validate` | `org_admin` |
| POST | `/api/org-admin/import/rollback/:batchId` | `org_admin` |
| GET | `/api/org-admin/import/errors/:batchId` | `org_admin` |
| GET | `/api/org-admin/onboarding-progress` | `org_admin` |
| PATCH | `/api/org-admin/onboarding-progress` | `org_admin` |
| GET | `/api/org-admin/onboarding-status` | `org_admin` |
| GET | `/api/org-admin/onboarding-events` | `org_admin` |
| POST | `/api/org-admin/regenerate-org-code` | `org_admin` |
| GET | `/api/org-admin/subdomain` | `org_admin` |
| PATCH | `/api/org-admin/subdomain` | `org_admin` |
| GET | `/api/org-admin/subdomain/check` | `org_admin` |
| GET | `/api/org-admin/custom-domain` | `org_admin` |
| PATCH | `/api/org-admin/custom-domain/settings` | `org_admin` |
| POST | `/api/org-admin/custom-domain` | `org_admin` |
| PATCH | `/api/org-admin/custom-domain` | `org_admin` |
| POST | `/api/org-admin/custom-domain/verify` | `org_admin` |
| DELETE | `/api/org-admin/custom-domain` | `org_admin` |
| GET | `/api/org-admin/dashboard/metrics` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/org-admin/join-codes` | `org_admin` |
| GET | `/api/org-admin/branding` | `org_admin` |
| PATCH | `/api/org-admin/branding` | `org_admin` |
| POST | `/api/org-admin/switch-role` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/org-admin/my-config

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get my organization config.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `orgId` | string | no | Path identifier/value for org id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400. No organization is associated with this account.

**Source:** `server/src/routes/org.routes.js:110`; handler `getMyOrganizationConfig` in `server/src/controllers/org-configuration.controller.js`.

### GET /api/org-admin/usage

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get organization usage summary.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `month` | number | no | Query value for month. |
| `year` | number | no | Query value for year. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `period`, `summary`, `terminology`, `dailySeries`, `studentBreakdown`, `facultyBreakdown`, `deptAdminBreakdown`. Explicit status codes include 400, 500. No organization is associated with this account.

**Source:** `server/src/routes/org.routes.js:111`; handler `getOrganizationUsageSummary` in `server/src/controllers/org-configuration.controller.js`.

### GET /api/org-admin/billing

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get organization billing.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `plan`, `status`, `nextBillingDate`, `moduleLineItems`, `charges`, `history`. Explicit status codes include 400, 500. No organization is associated with this account.

**Source:** `server/src/routes/org.routes.js:112`; handler `getOrganizationBilling` in `server/src/controllers/org-configuration.controller.js`.

### PUT /api/org-admin/billing/settings

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Update organization billing settings.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `field` | string | no | Request value for field. |
| `fees_razorpay_key_id` | string | no | Request value for fees razorpay key id. |
| `fees_razorpay_key_secret` | string | no | Request value for fees razorpay key secret. |
| `fees_razorpay_webhook_secret` | string | no | Request value for fees razorpay webhook secret. |

**Response:** JSON response fields observed in the handler include `message`, `billingSettings`, `fees_razorpay_key_id`, `has_fees_razorpay_key_secret`, `has_fees_razorpay_webhook_secret`. Explicit status codes include 400, 404, 500. No organization associated.

**Source:** `server/src/routes/org.routes.js:113`; handler `updateOrganizationBillingSettings` in `server/src/controllers/org-configuration.controller.js`.

### POST /api/org-admin/billing/verify-email/send

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send billing email verification.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. No organization associated.

**Source:** `server/src/routes/org.routes.js:114`; handler `sendBillingEmailVerification` in `server/src/controllers/org-configuration.controller.js`.

### POST /api/org-admin/billing/verify-email/confirm

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Verify billing email.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |

**Response:** JSON response fields observed in the handler include `message`, `billingSettings`. Explicit status codes include 400, 404, 500. Invalid request.

**Source:** `server/src/routes/org.routes.js:115`; handler `verifyBillingEmail` in `server/src/controllers/org-configuration.controller.js`.

### POST /api/org-admin/billing/verify-phone/send

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send billing phone otp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. No organization associated.

**Source:** `server/src/routes/org.routes.js:116`; handler `sendBillingPhoneOtp` in `server/src/controllers/org-configuration.controller.js`.

### POST /api/org-admin/billing/verify-phone/confirm

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Verify billing phone otp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `otp` | string | yes | Request value for otp. |

**Response:** JSON response fields observed in the handler include `message`, `billingSettings`. Explicit status codes include 400, 404, 500. Invalid request.

**Source:** `server/src/routes/org.routes.js:117`; handler `verifyBillingPhoneOtp` in `server/src/controllers/org-configuration.controller.js`.

### GET /api/org-admin/billing/invoice/:invoiceId/pdf

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Download invoice pdf.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `invoiceId` | string | yes | Path identifier/value for invoice id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 404, 500. Invalid request.

**Source:** `server/src/routes/org.routes.js:118`; handler `downloadInvoicePdf` in `server/src/controllers/org-configuration.controller.js`.

### GET /api/org-admin/dashboard

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** PATH: /api/org/dashboard Access: org_admin only Desc: Basic placeholder for the localized Org Admin Dashboard. Retrieves dashboard.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `organization`. Explicit status codes include 400, 500. You are not bound to an active organization.

**Source:** `server/src/routes/org.routes.js:272`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/institution-profile

**Auth:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile()`

**What it does:** Frontend contract for institution-specific dashboards and workflows. Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** Returns the handler result as JSON or an HTTP error response.

**Source:** `server/src/routes/org.routes.js:295`; handler `inline handler` in `server/src/routes/org.routes.js`.

### PATCH /api/org-admin/domains

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** PATH: /api/org/domains Access: org_admin only Desc: Modifies the list of allowed domain restrictions for an Org. Updates domains.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `domains` | string | no | Request value for domains. |

**Response:** JSON response fields observed in the handler include `message`, `allowed_domains`. Explicit status codes include 400, 500. Domains payload must be an array of strings.

**Source:** `server/src/routes/org.routes.js:304`; handler `inline handler` in `server/src/routes/org.routes.js`.

### PATCH /api/org-admin/type

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** PATH: /api/org/type Access: org_admin only Desc: Modifies the organization type (SCHOOL or COLLEGE). Updates type.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `org_type` | string | no | Request value for org type. |

**Response:** JSON response fields observed in the handler include `message`, `org_type`. Explicit status codes include 400, 500. Invalid org_type.

**Source:** `server/src/routes/org.routes.js:346`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/invite-staff

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** PATH: /api/org/invite-staff Access: org_admin only Desc: Manually invite a single Faculty / Dept Admin (Method 1 in docs) Note: Staff are instantly 'verified' because they are created by the admin. Creates or processes invite staff.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Request value for name. |
| `email` | string | yes | Request value for email. |
| `role` | string | yes | Request value for role. |
| `department` | string | no | Request value for department. |

**Response:** JSON response fields observed in the handler include `message`, `user`. Explicit status codes include 201, 400, 409, 500. Name, email, and role are required.

**Source:** `server/src/routes/org.routes.js:382`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/request-role

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** PATH: /api/org/request-role Access: Authenticated users Desc: Self-serve role request using Tenant Join Code. Creates or processes request role.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `tenant_join_code` | string | yes | Request value for tenant join code. |
| `role` | string | yes | Request value for role. |
| `email` | string | no | Request value for email. |

**Response:** JSON response fields observed in the handler include `error`, `message`, `instant_approval`. Explicit status codes include 200, 400, 403, 404, 500. Role granted instantly.

**Source:** `server/src/routes/org.routes.js:477`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/accept-role-request/:requestId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** PATH: /api/org/accept-role-request Access: org_admin Desc: Admin approves a pending role request. Creates or processes accept role request.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `requestId` | string | yes | Path identifier/value for request id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `message`. Explicit status codes include 400, 404, 500. Role request approved.

**Source:** `server/src/routes/org.routes.js:610`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/reject-role-request/:requestId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** PATH: /api/org/reject-role-request Access: org_admin. Rejects the requested record.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `requestId` | string | yes | Path identifier/value for request id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `reason` | string | no | Request value for reason. |

**Response:** JSON response fields observed in the handler include `error`, `message`. Explicit status codes include 400, 404, 500. Role request rejected.

**Source:** `server/src/routes/org.routes.js:664`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/members

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: All active dept admins and faculty in this org (for Members page) Roles are fetched dynamically from the org's allowed role list never hardcoded. Retrieves members.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `search` | string | no | Query value for search. |
| `role` | string | no | Query value for role. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `members`, `total`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:713`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/members/pending

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: Users invited but who haven't activated yet (mustResetPassword = true). Retrieves members pending.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `pending`, `total`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:758`; handler `inline handler` in `server/src/routes/org.routes.js`.

### DELETE /api/org-admin/members/:userId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Removes a staff member from this org. Deletes members.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | string | yes | Path identifier/value for user id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:789`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/members/:userId/resend

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Resends the invitation email to a pending member. Resends the requested information.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | string | yes | Path identifier/value for user id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:814`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:857`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:858`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:859`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:860`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:861`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:869`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:870`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:871`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:872`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:873`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/academic-config

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns the current academic configuration for this org. Retrieves academic config.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `academic_config`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:881`; handler `inline handler` in `server/src/routes/org.routes.js`.

### PUT /api/org-admin/academic-config

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Updates the academic configuration for this org. Updates academic config.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `identifierLabel` | string | no | Request value for identifier label. |
| `prnRequired` | string | no | Request value for prn required. |
| `prnLocked` | string | no | Request value for prn locked. |
| `batches` | string | no | Request value for batches. |
| `branches` | string | no | Request value for branches. |
| `requiredFields` | string | no | Request value for required fields. |
| `idCardFields` | string | no | Request value for id card fields. |

**Response:** JSON response fields observed in the handler include `message`, `academic_config`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:908`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:982`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:983`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:984`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:985`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:986`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:994`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:995`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:996`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:997`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:998`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/dashboard/overview

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: org-scoped counts (faculty, students, classrooms, memberships). Retrieves dashboard overview.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `totalFaculty`, `totalStudents`, `totalClassrooms`, `totalMemberships`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1006`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/dashboard/billing

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: Vercel-style Pay-As-You-Go Billing Dashboard with charts. Get org admin billing dashboard.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `currentMonth`, `dailySeries`, `latestInvoice`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1043`; handler `getOrgAdminBillingDashboard` in `server/src/controllers/admin-analytics.controller.js`.

### POST /api/org-admin/dashboard/billing/razorpay-order

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create saas invoice order.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `invoiceId` | string | yes | Request value for invoice id. |

**Response:** JSON response fields observed in the handler include `message`, `key_id`, `order_id`, `amount`, `currency`. Explicit status codes include 400, 404, 500. Missing params

**Source:** `server/src/routes/org.routes.js:1044`; handler `createSaasInvoiceOrder` in `server/src/controllers/admin-analytics.controller.js`.

### POST /api/org-admin/dashboard/billing/razorpay-verify

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Verify saas invoice payment.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `razorpay_order_id` | string | no | Request value for razorpay order id. |
| `razorpay_payment_id` | string | no | Request value for razorpay payment id. |
| `razorpay_signature` | string | no | Request value for razorpay signature. |
| `invoiceId` | string | no | Request value for invoice id. |

**Response:** JSON response fields observed in the handler include `success`, `message`. Explicit status codes include 400, 404, 500. Invoice not found

**Source:** `server/src/routes/org.routes.js:1045`; handler `verifySaasInvoicePayment` in `server/src/controllers/admin-analytics.controller.js`.

### GET /api/org-admin/dashboard/analytics

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: MongoDB aggregated data for Org Admin Dashboard Charts. Retrieves dashboard analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `demographics`, `branchDistribution`, `enrollmentTrends`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1051`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/dashboard/users

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: paginated users within this organization. Retrieves dashboard users.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `page` | number | no | Query value for page. |
| `limit` | number | no | Query value for limit. |
| `role` | string | no | Query value for role. |
| `search` | string | no | Query value for search. |
| `batch` | string | no | Query value for batch. |
| `branch` | string | no | Query value for branch. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `users`, `pagination`, `stack`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1120`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/dashboard/classrooms

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: all classrooms within this organization. Retrieves dashboard classrooms.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `classrooms`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1170`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/dashboard/classrooms/:id/members

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: Students & faculty enrolled in a specific classroom. Retrieves dashboard classrooms members.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `classroom`, `teacher`, `students`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1191`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/dashboard/activity

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: recent membership activity for this org's classrooms. Retrieves dashboard activity.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `limit` | number | no | Query value for limit. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `activity`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1240`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/users/export

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: CSV download of org-scoped users. Retrieves users export.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | string | no | Query value for role. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1290`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1325`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1326`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1327`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:1328`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1329`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1337`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1338`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1339`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:1340`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1341`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/bulk-suspend

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Body: { userIds: [...], action: "suspend" | "reactivate" }. Processes the requested bulk operation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `userIds` | string | no | Request value for user ids. |
| `action` | string | no | Request value for action. |

**Response:** JSON response fields observed in the handler include `message`, `modifiedCount`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1349`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/bulk-role-update

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Body: { userIds: [...], newRole: "student" | "faculty" }. Processes the requested bulk operation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `userIds` | string | no | Request value for user ids. |
| `newRole` | string | no | Request value for new role. |

**Response:** JSON response fields observed in the handler include `message`, `modifiedCount`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1377`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/change-role

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Body: { userId, newRole: "student" | "faculty" }. Creates or processes change role.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | string | yes | Request value for user id. |
| `newRole` | string | no | Request value for new role. |

**Response:** JSON response fields observed in the handler include `message`, `user`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1404`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1454`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1455`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1456`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:1457`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1458`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1466`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1467`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1468`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:1469`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1470`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/pending-invites

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: faculty users in this org that haven't activated yet (status=pending or mustResetPassword=true). Retrieves pending invites.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `invites`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1478`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/resend-invite

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Body: { userId } Resends the activation email for a pending faculty. Resends the requested information.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | string | no | Request value for user id. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1501`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1546`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1547`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1548`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:1549`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1550`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1558`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1559`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1560`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:1561`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1562`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/academic-years

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Retrieves academic years.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `years`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1569`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/academic-years

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Body: { name, start_date, end_date, is_active }. Creates or processes academic years.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | no | Request value for id. |
| `name` | string | yes | Request value for name. |
| `start_date` | string (date/time) | no | Request value for start date. |
| `end_date` | string (date/time) | no | Request value for end date. |
| `is_active` | boolean | yes | Request value for is active. |

**Response:** JSON response fields observed in the handler include `message`, `year`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1593`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/division-mappings

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Retrieves division mappings.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `mappings`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1632`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/division-mappings

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Body: { mappings: [{ from_division_id, to_division_id }] }. Creates or processes division mappings.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `mappings` | string | no | Request value for mappings. |

**Response:** JSON response fields observed in the handler include `message`, `count`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1655`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/promotion-preview

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns preview of what promotion would do (dry-run, no mutations). Retrieves promotion preview.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `target_year_id` | string | yes | Query value for target year id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `preview`, `summary`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1689`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/promote

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Body: { target_year_id, excluded_ids: [], scheduled_for: null | ISOString } Executes promotion via Supabase RPC or schedules it for later (SaaS Automation). Creates or processes promote.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `target_year_id` | string | yes | Request value for target year id. |
| `excluded_ids` | array | no | Request value for excluded ids. |
| `scheduled_for` | string | no | Request value for scheduled for. |

**Response:** JSON response fields observed in the handler include `message`, `scheduled_for`, `batch_id`. Explicit status codes include 400, 409, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1809`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/promotion-batches

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns past promotion batches for audit dashboard. Retrieves promotion batches.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `batches`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1951`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1976`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1977`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1978`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:1979`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1980`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** List org support conversations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversations`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1988`; handler `listOrgSupportConversations` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Create org support conversation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subject` | string | yes | Request value for subject. |
| `department` | string | no | Request value for department. |
| `priority` | number | no | Request value for priority. |
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:1989`; handler `createOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/helpdesk/threads/:threadId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get org support conversation.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1990`; handler `getOrgSupportConversation` in `server/src/controllers/support-communication.controller.js`.

### POST /api/org-admin/helpdesk/threads/:threadId/messages

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send org support message.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | yes | Request value for body. |

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 201, 400, 404, 500. Message body is required.

**Source:** `server/src/routes/org.routes.js:1991`; handler `sendOrgSupportMessage` in `server/src/controllers/support-communication.controller.js`.

### PATCH /api/org-admin/helpdesk/threads/:threadId/read

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Mark org support conversation read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `threadId` | string | yes | Path identifier/value for thread id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `conversation`. Explicit status codes include 404, 500. Conversation not found.

**Source:** `server/src/routes/org.routes.js:1992`; handler `markOrgSupportConversationRead` in `server/src/controllers/support-communication.controller.js`.

### GET /api/org-admin/data-export

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns: Full JSON export of all org data (staff, students, applications) Data Ownership compliance clients can download their data at any time. Retrieves data export.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `format` | string | no | Query value for format. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `success`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:2001`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/import/validate

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Body: { rows: [...], import_type: "students" | "faculty" } Returns: Dry-run validation report (no records created). Creates or processes import validate.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `rows` | string | no | Request value for rows. |
| `import_type` | string | no | Request value for import type. |

**Response:** JSON response fields observed in the handler include `message`, `success`, `dry_run`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:2033`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/import/rollback/:batchId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Rolls back a previously committed import batch. Creates or processes import rollback.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `batchId` | string | yes | Path identifier/value for batch id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `success`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:2057`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/import/errors/:batchId

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Downloads error CSV for a specific import batch. Retrieves import errors.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `batchId` | string | yes | Path identifier/value for batch id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 404, 500. Import batch not found.

**Source:** `server/src/routes/org.routes.js:2076`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/onboarding-progress

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns the onboarding checklist status for the org. Retrieves onboarding progress.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `org_name`, `progress`, `completed_steps`, `total_steps`, `percentage`, `is_complete`, `current_stage`, `next_actions`, `blockers`, `message`. Explicit status codes include 500. Server error.

**Source:** `server/src/routes/org.routes.js:2099`; handler `inline handler` in `server/src/routes/org.routes.js`.

### PATCH /api/org-admin/onboarding-progress

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Body: { step: "staff_imported", value: true } Updates a specific onboarding step. Updates onboarding progress.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `step` | string | no | Request value for step. |
| `value` | string | yes | Request value for value. |

**Response:** JSON response fields observed in the handler include `message`, `success`, `all_complete`. Explicit status codes include 400, 500. Server error.

**Source:** `server/src/routes/org.routes.js:2126`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/onboarding-status

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns the current onboarding stage, next actions, and progress snapshot. Retrieves onboarding status.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`. Explicit status codes include 500. Server error.

**Source:** `server/src/routes/org.routes.js:2156`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/onboarding-events

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Retrieves onboarding events.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `metrics`, `events`, `message`. Explicit status codes include 500. Server error.

**Source:** `server/src/routes/org.routes.js:2166`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/regenerate-org-code

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Regenerates the org code with optional expiry (invalidates old code). Creates or processes regenerate org code.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `expires_in_days` | string | no | Request value for expires in days. |

**Response:** JSON response fields observed in the handler include `message`, `success`, `organizationCode`, `honorCode`, `expires_at`. Explicit status codes include 400, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:2184`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/subdomain

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns the current subdomain for this organization. Retrieves subdomain.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `subdomain`, `url`, `name`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:2236`; handler `inline handler` in `server/src/routes/org.routes.js`.

### PATCH /api/org-admin/subdomain

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Body: { subdomain: "example-campus" } Sets or updates the subdomain slug for this organization. Rules: - 3-30 characters - Lowercase alphanumeric + hyphens only - Cannot start or end with a hyphen - Cannot be a system subdomai. Updates subdomain.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `subdomain` | string | no | Request value for subdomain. |

**Response:** JSON response fields observed in the handler include `message`, `success`, `subdomain`, `url`. Explicit status codes include 400, 409, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:2267`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/subdomain/check

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Public-ish availability check (still requires auth for rate-limit safety). Retrieves subdomain check.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | string | yes | Query value for slug. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `available`, `reason`, `preview`, `message`. Explicit status codes include 500. Server error.

**Source:** `server/src/routes/org.routes.js:2402`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/custom-domain

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Returns the current custom domain configuration. Retrieves custom domain.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `custom_domain`, `erp_domain`, `purchased_modules`. Explicit status codes include 400, 403, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:2573`; handler `inline handler` in `server/src/routes/org.routes.js`.

### PATCH /api/org-admin/custom-domain/settings

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Updates the settings for the custom domain (allow_classgrid_url and is_enabled). Updates custom domain settings.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `allow_classgrid_url` | string | no | Request value for allow classgrid url. |
| `is_enabled` | boolean | no | Request value for is enabled. |
| `domainType` | string | no | Request value for domain type. Default: `custom_domain`. |

**Response:** JSON response fields observed in the handler include `message`, `success`, `custom_domain`, `erp_domain`. Explicit status codes include 400, 403, 404, 409, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:2612`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/custom-domain

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Registers a new custom domain and generates verification tokens. Creates or processes custom domain.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `domain` | string | yes | Request value for domain. |
| `domainType` | string | no | Request value for domain type. Default: `custom_domain`. |

**Response:** JSON response fields observed in the handler include `message`, `success`, `custom_domain`, `erp_domain`. Explicit status codes include 400, 403, 404, 409, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:2727`; handler `inline handler` in `server/src/routes/org.routes.js`.

### PATCH /api/org-admin/custom-domain

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Changes an existing external hostname without deleting or resetting branding. DNS ownership and routing must be verified again for the replacement hostname. Updates custom domain.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `domain` | string | no | Request value for domain. |
| `domainType` | string | no | Request value for domain type. Default: `custom_domain`. |

**Response:** JSON response fields observed in the handler include `message`, `success`, `custom_domain`, `erp_domain`. Explicit status codes include 400, 403, 404, 409, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:2822`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/custom-domain/verify

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Performs DNS lookup to verify TXT and CNAME records. Verifies the supplied information.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `domainType` | string | no | Request value for domain type. Default: `custom_domain`. |

**Response:** JSON response fields observed in the handler include `message`, `success`, `isFullyVerified`, `hasConflicts`, `conflictingRecords`, `txtVerified`, `cnameVerified`, `custom_domain`, `erp_domain`. Explicit status codes include 400, 403, 404, 500. Invalid domainType

**Source:** `server/src/routes/org.routes.js:2928`; handler `inline handler` in `server/src/routes/org.routes.js`.

### DELETE /api/org-admin/custom-domain

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Removes the custom domain. Deletes custom domain.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `domainType` | string | no | Query value for domain type. |

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `domainType` | string | no | Request value for domain type. |

**Response:** JSON response fields observed in the handler include `message`, `success`. Explicit status codes include 400, 403, 404, 500. Invalid domainType

**Source:** `server/src/routes/org.routes.js:3097`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/dashboard/metrics

**Auth:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `requireOrganization`, `attachInstitutionProfile`

**What it does:** Get org dashboard metrics.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `data`. Explicit status codes include 200, 400, 500. Organization ID is missing from request context.

**Source:** `server/src/routes/org.routes.js:3196`; handler `getOrgDashboardMetrics` in `server/src/controllers/org-dashboard.controller.js`.

### GET /api/org-admin/join-codes

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** PATH: /api/org-admin/join-codes Access: org_admin only Desc: Retrieves the organization codes (organizationCode and honorCode). Joins the requested resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `tenantId`, `organizationCode`, `honorCode`, `orgType`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:3203`; handler `inline handler` in `server/src/routes/org.routes.js`.

### GET /api/org-admin/branding

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** PATH: /api/org/branding (Often prefixed by /api/org-admin in express mounting) Access: org_admin only Desc: Retrieves the organization's custom branding (logo, favicon, theme colors) and custom domain status. Retrieves branding.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:3228`; handler `inline handler` in `server/src/routes/org.routes.js`.

### PATCH /api/org-admin/branding

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** PATH: /api/org/branding. Updates branding.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `logo_url` | string | no | Request value for logo url. |
| `sidebar_logo_url` | string | no | Request value for sidebar logo url. |
| `favicon_url` | string | no | Request value for favicon url. |
| `campus_photo_url` | string | no | Request value for campus photo url. |
| `social_links` | string | no | Request value for social links. |
| `site_title` | string | no | Request value for site title. |
| `name` | string | no | Request value for name. |
| `sidebar_name` | string | no | Request value for sidebar name. |
| `brand_colors` | string | yes | Request value for brand colors. |

**Response:** JSON response fields observed in the handler include `message`, `branding`. Explicit status codes include 400, 404, 500. No organization bound.

**Source:** `server/src/routes/org.routes.js:3277`; handler `inline handler` in `server/src/routes/org.routes.js`.

### POST /api/org-admin/switch-role

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** PATH: /api/org/switch-role Access: Authenticated users Desc: Switch active role context. Creates or processes switch role.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `targetRole` | string | yes | Request value for target role. |

**Response:** JSON response fields observed in the handler include `error`, `message`. Explicit status codes include 400, 403, 500. Role is already active.

**Source:** `server/src/routes/org.routes.js:3358`; handler `inline handler` in `server/src/routes/org.routes.js`.

## organization.routes.js

**Mounted at:** `/api/organization`, `/api/org`

| Method | Path | Access |
|---|---|---|
| GET | `/api/organization/my-config` / `/api/org/my-config` | `org_admin` |
| GET | `/api/organization/usage` / `/api/org/usage` | `org_admin` |
| GET | `/api/organization/billing` / `/api/org/billing` | `org_admin` |
| PUT | `/api/organization/billing/settings` / `/api/org/billing/settings` | `org_admin` |
| POST | `/api/organization/billing/setup-mandate` / `/api/org/billing/setup-mandate` | `org_admin` |
| POST | `/api/organization/billing/verify-email/send` / `/api/org/billing/verify-email/send` | `org_admin` |
| GET | `/api/organization/billing/verify-email` / `/api/org/billing/verify-email` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/organization/billing/verify-email/confirm` / `/api/org/billing/verify-email/confirm` | `org_admin` |
| POST | `/api/organization/billing/verify-phone/send` / `/api/org/billing/verify-phone/send` | `org_admin` |
| POST | `/api/organization/billing/verify-phone/confirm` / `/api/org/billing/verify-phone/confirm` | `org_admin` |
| POST | `/api/organization/apply` / `/api/org/apply` | Public endpoint unless an upstream platform gate applies. |
| GET | `/api/organization/branding` / `/api/org/branding` | Public endpoint unless an upstream platform gate applies. |
| GET | `/api/organization` / `/api/org` | `super_admin` |
| PATCH | `/api/organization/:id` / `/api/org/:id` | `super_admin` |
| POST | `/api/organization/verify-code` / `/api/org/verify-code` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/organization/validate` / `/api/org/validate` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/organization/add-faculty` / `/api/org/add-faculty` | `super_admin`, `org_admin` |
| DELETE | `/api/organization/remove-faculty/:id` / `/api/org/remove-faculty/:id` | `super_admin`, `org_admin` |
| PUT | `/api/organization/faculty/:id` / `/api/org/faculty/:id` | `super_admin`, `org_admin` |
| PUT | `/api/organization/faculty/:id/role` / `/api/org/faculty/:id/role` | `super_admin`, `org_admin` |
| POST | `/api/organization/reset-faculty-password` / `/api/org/reset-faculty-password` | `super_admin`, `org_admin` |
| GET | `/api/organization/me` / `/api/org/me` | `super_admin`, `org_admin` |
| GET | `/api/organization/public-info` / `/api/org/public-info` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/organization/faculties` / `/api/org/faculties` | `super_admin`, `org_admin` |
| DELETE | `/api/organization/remove-student/:id` / `/api/org/remove-student/:id` | `super_admin`, `org_admin` |
| GET | `/api/organization/students` / `/api/org/students` | `super_admin`, `org_admin` |
| GET | `/api/organization/classrooms` / `/api/org/classrooms` | `super_admin`, `org_admin` |
| GET | `/api/organization/analytics` / `/api/org/analytics` | `super_admin`, `org_admin` |
| GET | `/api/organization/attendance-analytics` / `/api/org/attendance-analytics` | `super_admin`, `org_admin` |
| POST | `/api/organization/announcements` / `/api/org/announcements` | `super_admin`, `org_admin` |
| GET | `/api/organization/announcements` / `/api/org/announcements` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/organization/announcements/:id` / `/api/org/announcements/:id` | `super_admin`, `org_admin` |
| DELETE | `/api/organization/announcements/:id` / `/api/org/announcements/:id` | `super_admin`, `org_admin` |
| GET | `/api/organization/announcements/:id/stats` / `/api/org/announcements/:id/stats` | `super_admin`, `org_admin` |
| POST | `/api/organization/request-delete` / `/api/org/request-delete` | `org_admin` |
| GET | `/api/organization/verify-delete` / `/api/org/verify-delete` | Public endpoint unless an upstream platform gate applies. |
| GET | `/api/organization/notes/pending` / `/api/org/notes/pending` | `org_admin` |
| POST | `/api/organization/notes/:id/approve` / `/api/org/notes/:id/approve` | `org_admin` |
| POST | `/api/organization/notes/:id/reject` / `/api/org/notes/:id/reject` | `org_admin` |
| POST | `/api/organization/change-password` / `/api/org/change-password` | `org_admin`, `super_admin` |
| POST | `/api/organization/archive-classroom/:id` / `/api/org/archive-classroom/:id` | `org_admin`, `super_admin` |
| GET | `/api/organization/student-performance` / `/api/org/student-performance` | `org_admin`, `super_admin` |
| GET | `/api/organization/audit-log` / `/api/org/audit-log` | `org_admin` |
| PUT | `/api/organization/logo` / `/api/org/logo` | `org_admin`, `super_admin` |
| GET | `/api/organization/test-accounts` / `/api/org/test-accounts` | `org_admin`, `super_admin` |
| POST | `/api/organization/test-accounts` / `/api/org/test-accounts` | `org_admin`, `super_admin` |
| POST | `/api/organization/test-accounts/:id/reset` / `/api/org/test-accounts/:id/reset` | `org_admin`, `super_admin` |
| DELETE | `/api/organization/test-accounts/:id` / `/api/org/test-accounts/:id` | `org_admin`, `super_admin` |

### GET /api/organization/my-config

**Aliases:** `/api/org/my-config`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** This router is mounted at both /api/organization and /api/org. Get my organization config.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `orgId` | string | no | Path identifier/value for org id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400. No organization is associated with this account.

**Source:** `server/src/routes/organization.routes.js:66`; handler `getMyOrganizationConfig` in `server/src/controllers/org-configuration.controller.js`.

### GET /api/organization/usage

**Aliases:** `/api/org/usage`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get organization usage summary.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `month` | number | no | Query value for month. |
| `year` | number | no | Query value for year. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `period`, `summary`, `terminology`, `dailySeries`, `studentBreakdown`, `facultyBreakdown`, `deptAdminBreakdown`. Explicit status codes include 400, 500. No organization is associated with this account.

**Source:** `server/src/routes/organization.routes.js:67`; handler `getOrganizationUsageSummary` in `server/src/controllers/org-configuration.controller.js`.

### GET /api/organization/billing

**Aliases:** `/api/org/billing`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Get organization billing.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `plan`, `status`, `nextBillingDate`, `moduleLineItems`, `charges`, `history`. Explicit status codes include 400, 500. No organization is associated with this account.

**Source:** `server/src/routes/organization.routes.js:68`; handler `getOrganizationBilling` in `server/src/controllers/org-configuration.controller.js`.

### PUT /api/organization/billing/settings

**Aliases:** `/api/org/billing/settings`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Update organization billing settings.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `field` | string | no | Request value for field. |
| `fees_razorpay_key_id` | string | no | Request value for fees razorpay key id. |
| `fees_razorpay_key_secret` | string | no | Request value for fees razorpay key secret. |
| `fees_razorpay_webhook_secret` | string | no | Request value for fees razorpay webhook secret. |

**Response:** JSON response fields observed in the handler include `message`, `billingSettings`, `fees_razorpay_key_id`, `has_fees_razorpay_key_secret`, `has_fees_razorpay_webhook_secret`. Explicit status codes include 400, 404, 500. No organization associated.

**Source:** `server/src/routes/organization.routes.js:69`; handler `updateOrganizationBillingSettings` in `server/src/controllers/org-configuration.controller.js`.

### POST /api/organization/billing/setup-mandate

**Aliases:** `/api/org/billing/setup-mandate`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Setup billing mandate.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `key_id`, `order_id`, `amount`, `currency`. Explicit status codes include 400, 500. No organization associated.

**Source:** `server/src/routes/organization.routes.js:70`; handler `setupBillingMandate` in `server/src/controllers/org-configuration.controller.js`.

### POST /api/organization/billing/verify-email/send

**Aliases:** `/api/org/billing/verify-email/send`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send billing email verification.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. No organization associated.

**Source:** `server/src/routes/organization.routes.js:71`; handler `sendBillingEmailVerification` in `server/src/controllers/org-configuration.controller.js`.

### GET /api/organization/billing/verify-email

**Aliases:** `/api/org/billing/verify-email`

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Verify billing email.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |

**Response:** JSON response fields observed in the handler include `message`, `billingSettings`. Explicit status codes include 400, 404, 500. Invalid request.

**Source:** `server/src/routes/organization.routes.js:72`; handler `verifyBillingEmail` in `server/src/controllers/org-configuration.controller.js`.

### POST /api/organization/billing/verify-email/confirm

**Aliases:** `/api/org/billing/verify-email/confirm`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Verify billing email.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |

**Response:** JSON response fields observed in the handler include `message`, `billingSettings`. Explicit status codes include 400, 404, 500. Invalid request.

**Source:** `server/src/routes/organization.routes.js:73`; handler `verifyBillingEmail` in `server/src/controllers/org-configuration.controller.js`.

### POST /api/organization/billing/verify-phone/send

**Aliases:** `/api/org/billing/verify-phone/send`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Send billing phone otp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. No organization associated.

**Source:** `server/src/routes/organization.routes.js:74`; handler `sendBillingPhoneOtp` in `server/src/controllers/org-configuration.controller.js`.

### POST /api/organization/billing/verify-phone/confirm

**Aliases:** `/api/org/billing/verify-phone/confirm`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Verify billing phone otp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `otp` | string | yes | Request value for otp. |

**Response:** JSON response fields observed in the handler include `message`, `billingSettings`. Explicit status codes include 400, 404, 500. Invalid request.

**Source:** `server/src/routes/organization.routes.js:75`; handler `verifyBillingPhoneOtp` in `server/src/controllers/org-configuration.controller.js`.

### POST /api/organization/apply

**Aliases:** `/api/org/apply`

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `applyLimiter`, `validateApplyOrg`

**What it does:** Public: Apply for a new organization (rate limited). Apply organization.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `institute_name` | string | yes | Request value for institute name. |
| `address` | object | yes | Request value for address. |
| `owner_name` | string | yes | Request value for owner name. |
| `owner_email` | string | yes | Request value for owner email. |
| `phone` | string | yes | Request value for phone. |
| `logo_base64` | string | no | Request value for logo base64. |
| `website` | string | no | Request value for website. |
| `designation` | string | no | Request value for designation. |

**Response:** JSON response fields observed in the handler include `message`, `pendingOrgId`, `error`. Explicit status codes include 201, 400, 500. All required fields must be filled

**Source:** `server/src/routes/organization.routes.js:97`; handler `applyOrganization` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/branding

**Aliases:** `/api/org/branding`

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Public: Get branding info for an organization via subdomain. Get org branding.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `slug` | string | yes | Query value for slug. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 403, 404, 500. Organization identifier missing. Please provide a subdomain or slug.

**Source:** `server/src/routes/organization.routes.js:100`; handler `getOrgBranding` in `server/src/controllers/organization.controller.js`.

### GET /api/organization

**Aliases:** `/api/org`

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Super Admin compatibility: legacy frontend calls /api/organization?status=pending. Retrieves resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `data`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/organization.routes.js:103`; handler `inline handler` in `server/src/routes/organization.routes.js`.

### PATCH /api/organization/:id

**Aliases:** `/api/org/:id`

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Super Admin compatibility: approve pending organization from the new dashboard. Updates resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`. Explicit status codes include 400. Only approval is supported from this endpoint

**Source:** `server/src/routes/organization.routes.js:128`; handler `inline handler` in `server/src/routes/organization.routes.js`.

### POST /api/organization/verify-code

**Aliases:** `/api/org/verify-code`

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `verifyCodeLimiter`, `validateVerifyCode`

**What it does:** Authenticated + Rate limited. Verify org code.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `code` | string | yes | Request value for code. |
| `type` | string | yes | Request value for type. |

**Response:** JSON response fields observed in the handler include `message`, `code`, `organizationId`, `organizationName`, `organizationLogo`, `userRole`, `verificationStatus`, `orgType`, `mustResetPassword`. Explicit status codes include 400, 403, 404, 409, 410, 500. Both 'code' and 'type' are required

**Source:** `server/src/routes/organization.routes.js:138`; handler `verifyOrgCode` in `server/src/controllers/organization.controller.js`.

### POST /api/organization/validate

**Aliases:** `/api/org/validate`

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `validateOrgCode`

**What it does:** legacy endpoint (kept for backward compat). Validate organization.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `organizationCode` | string | yes | Request value for organization code. |

**Response:** JSON response fields observed in the handler include `message`, `organizationId`, `organizationName`, `organizationLogo`, `code`, `currentOrganizationName`. Explicit status codes include 400, 404, 409, 500. Organization code is required

**Source:** `server/src/routes/organization.routes.js:141`; handler `validateOrganization` in `server/src/controllers/organization.controller.js`.

### POST /api/organization/add-faculty

**Aliases:** `/api/org/add-faculty`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`, `validateFaculty`

**What it does:** Org Admin + Super Admin routes (requirePasswordSet blocks org_admin if mustResetPassword=true). Add faculty.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |
| `name` | string | yes | Request value for name. |

**Response:** JSON response fields observed in the handler include `message`, `error`, `faculty`. Explicit status codes include 201, 400, 403, 404, 500. Faculty name and email are required

**Source:** `server/src/routes/organization.routes.js:144`; handler `addFaculty` in `server/src/controllers/organization.controller.js`.

### DELETE /api/organization/remove-faculty/:id

**Aliases:** `/api/org/remove-faculty/:id`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Remove faculty.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 403, 404, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:145`; handler `removeFaculty` in `server/src/controllers/organization.controller.js`.

### PUT /api/organization/faculty/:id

**Aliases:** `/api/org/faculty/:id`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Update faculty.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | no | Request value for name. |

**Response:** JSON response fields observed in the handler include `message`, `faculty`, `error`. Explicit status codes include 403, 404, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:146`; handler `updateFaculty` in `server/src/controllers/organization.controller.js`.

### PUT /api/organization/faculty/:id/role

**Aliases:** `/api/org/faculty/:id/role`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Update faculty role.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | string | no | Request value for role. |

**Response:** JSON response fields observed in the handler include `message`, `user`, `error`. Explicit status codes include 400, 403, 404, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:147`; handler `updateFacultyRole` in `server/src/controllers/organization.controller.js`.

### POST /api/organization/reset-faculty-password

**Aliases:** `/api/org/reset-faculty-password`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Reset faculty password.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `facultyId` | string | yes | Request value for faculty id. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 403, 404, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:148`; handler `resetFacultyPassword` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/me

**Aliases:** `/api/org/me`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Get organization details.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `organization`, `stats`, `error`. Explicit status codes include 403, 404, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:149`; handler `getOrganizationDetails` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/public-info

**Aliases:** `/api/org/public-info`

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Get org public info.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `org`, `faculties`, `stats`, `userJoinedAt`. Explicit status codes include 403, 404, 500. You are not connected to an organization

**Source:** `server/src/routes/organization.routes.js:150`; handler `getOrgPublicInfo` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/faculties

**Aliases:** `/api/org/faculties`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Get faculties.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 403, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:151`; handler `getFaculties` in `server/src/controllers/organization.controller.js`.

### DELETE /api/organization/remove-student/:id

**Aliases:** `/api/org/remove-student/:id`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Remove student.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 403, 404, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:153`; handler `removeStudent` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/students

**Aliases:** `/api/org/students`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Get students.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 403, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:154`; handler `getStudents` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/classrooms

**Aliases:** `/api/org/classrooms`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Get classrooms.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 403, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:155`; handler `getClassrooms` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/analytics

**Aliases:** `/api/org/analytics`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Get organization analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `kpis`, `roleBreakdown`, `contentStats`, `activityTrend`, `engagement`, `insights`, `planUtilization`, `alerts`. Explicit status codes include 403, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:156`; handler `getOrganizationAnalytics` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/attendance-analytics

**Aliases:** `/api/org/attendance-analytics`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Get attendance analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroom` | string | no | Query value for classroom. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `classrooms`, `selectedClassroom`, `overall`, `classroomStats`, `dailyChart`, `lowAttendanceAlerts`, `error`. Explicit status codes include 403, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:157`; handler `getAttendanceAnalytics` in `server/src/controllers/organization.controller.js`.

### POST /api/organization/announcements

**Aliases:** `/api/org/announcements`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`, `validateOrganizationAnnouncement`

**What it does:** Announcements (Smart Broadcast System). Create organization announcement.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | no | Request value for title. |
| `content` | string | no | Request value for content. |
| `type` | string | no | Request value for type. |
| `target_type` | string | no | Request value for target type. |
| `target_classrooms` | string | no | Request value for target classrooms. |
| `status` | string | yes | Request value for status. |
| `expires_at` | string (date/time) | no | Request value for expires at. |
| `attachment_base64` | string | no | Request value for attachment base64. |
| `attachment_name` | string | no | Request value for attachment name. |

**Response:** JSON response fields observed in the handler include `message`, `announcement`, `notificationDelivery`, `code`, `error`. Explicit status codes include 201, 400, 403, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:160`; handler `createOrganizationAnnouncement` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/announcements

**Aliases:** `/api/org/announcements`

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Get organization announcements.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `page` | number | no | Query value for page. |
| `limit` | number | no | Query value for limit. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `announcements`, `pagination`, `error`. Explicit status codes include 403, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:161`; handler `getOrganizationAnnouncements` in `server/src/controllers/organization.controller.js`.

### PUT /api/organization/announcements/:id

**Aliases:** `/api/org/announcements/:id`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`, `validateOrganizationAnnouncement`

**What it does:** Accessible by faculty/students too, filtered inside controller. Update organization announcement.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | no | Request value for title. |
| `content` | string | no | Request value for content. |
| `type` | string | no | Request value for type. |
| `target_type` | string | no | Request value for target type. |
| `target_classrooms` | string | no | Request value for target classrooms. |
| `status` | string | no | Request value for status. |
| `expires_at` | string (date/time) | no | Request value for expires at. |
| `attachment_base64` | string | no | Request value for attachment base64. |
| `attachment_name` | string | no | Request value for attachment name. |
| `remove_attachment` | string | no | Request value for remove attachment. |

**Response:** JSON response fields observed in the handler include `message`, `code`, `announcement`, `notificationDelivery`, `error`. Explicit status codes include 400, 403, 404, 500. Announcement not found

**Source:** `server/src/routes/organization.routes.js:162`; handler `updateOrganizationAnnouncement` in `server/src/controllers/organization.controller.js`.

### DELETE /api/organization/announcements/:id

**Aliases:** `/api/org/announcements/:id`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Delete organization announcement.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 404, 500. Announcement not found

**Source:** `server/src/routes/organization.routes.js:163`; handler `deleteOrganizationAnnouncement` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/announcements/:id/stats

**Aliases:** `/api/org/announcements/:id/stats`

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Get organization announcement stats.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `code`, `stats`, `error`. Explicit status codes include 403, 404, 500. Announcement delivery analytics requires the paid plan.

**Source:** `server/src/routes/organization.routes.js:164`; handler `getOrganizationAnnouncementStats` in `server/src/controllers/organization.controller.js`.

### POST /api/organization/request-delete

**Aliases:** `/api/org/request-delete`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Organisation deletion (Org Admin email verification flow). Request delete organization.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `email`, `error`. Explicit status codes include 403, 404, 500. Only organisation admins can request deletion.

**Source:** `server/src/routes/organization.routes.js:167`; handler `requestDeleteOrganization` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/verify-delete

**Aliases:** `/api/org/verify-delete`

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Verify delete organization.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Query value for token. |

**Body:** None detected in the route or handler.

**Response:** Explicit status codes include 400, 500.

**Source:** `server/src/routes/organization.routes.js:168`; handler `verifyDeleteOrganization` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/notes/pending

**Aliases:** `/api/org/notes/pending`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Org Admin Notes Review (scoped to their organization). Get org pending notes.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 200, 400, 500. No organization linked to this admin.

**Source:** `server/src/routes/organization.routes.js:171`; handler `getOrgPendingNotes` in `server/src/controllers/admin.controller.js`.

### POST /api/organization/notes/:id/approve

**Aliases:** `/api/org/notes/:id/approve`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Approve org note.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `note`. Explicit status codes include 200, 400, 403, 404, 500. No organization linked to this admin.

**Source:** `server/src/routes/organization.routes.js:172`; handler `approveOrgNote` in `server/src/controllers/admin.controller.js`.

### POST /api/organization/notes/:id/reject

**Aliases:** `/api/org/notes/:id/reject`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Reject org note.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `note`. Explicit status codes include 200, 400, 403, 404, 500. No organization linked to this admin.

**Source:** `server/src/routes/organization.routes.js:173`; handler `rejectOrgNote` in `server/src/controllers/admin.controller.js`.

### POST /api/organization/change-password

**Aliases:** `/api/org/change-password`

**Auth:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**What it does:** Org Admin Change own password (in-dashboard). Change org admin password.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `currentPassword` | string | yes | Request value for current password. |
| `newPassword` | string | yes | Request value for new password. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 401, 404, 500. Current and new password are required.

**Source:** `server/src/routes/organization.routes.js:176`; handler `changeOrgAdminPassword` in `server/src/controllers/organization.controller.js`.

### POST /api/organization/archive-classroom/:id

**Aliases:** `/api/org/archive-classroom/:id`

**Auth:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**What it does:** Org Admin Archive a classroom in their org (org-level admin action). Archive classroom by admin.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `isArchived`. Explicit status codes include 403, 404, 500. You do not belong to an organization.

**Source:** `server/src/routes/organization.routes.js:179`; handler `archiveClassroomByAdmin` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/student-performance

**Aliases:** `/api/org/student-performance`

**Auth:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**What it does:** Org Admin Student Performance Snapshot (top 10, 5-min cached). Get student performance.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `students`, `cached`. Explicit status codes include 403, 500. You do not belong to an organization.

**Source:** `server/src/routes/organization.routes.js:182`; handler `getStudentPerformance` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/audit-log

**Aliases:** `/api/org/audit-log`

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Org Admin Admin Audit Log (last 50, this org only). Get org audit log.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `action` | string | no | Query value for action. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `logs`. Explicit status codes include 403, 500. You do not belong to an organization.

**Source:** `server/src/routes/organization.routes.js:185`; handler `getOrgAuditLog` in `server/src/controllers/organization.controller.js`.

### PUT /api/organization/logo

**Aliases:** `/api/org/logo`

**Auth:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**What it does:** Org Admin Update organization logo. Update org logo.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `logo_base64` | string | yes | Request value for logo base64. |

**Response:** JSON response fields observed in the handler include `message`, `logo_url`, `error`. Explicit status codes include 400, 403, 500. You do not belong to an organization

**Source:** `server/src/routes/organization.routes.js:188`; handler `updateOrgLogo` in `server/src/controllers/organization.controller.js`.

### GET /api/organization/test-accounts

**Aliases:** `/api/org/test-accounts`

**Auth:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**What it does:** Org Admin - Test Accounts (Role Sandbox). Get test accounts.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `testAccounts`. Explicit status codes include 200, 403, 500. Not associated with an organization.

**Source:** `server/src/routes/organization.routes.js:191`; handler `getTestAccounts` in `server/src/controllers/organization.controller.js`.

### POST /api/organization/test-accounts

**Aliases:** `/api/org/test-accounts`

**Auth:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**What it does:** Create test account.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | string | yes | Request value for role. |

**Response:** JSON response fields observed in the handler include `message`, `account`, `plaintextPassword`. Explicit status codes include 201, 400, 403, 404, 409, 500. Not associated with an organization.

**Source:** `server/src/routes/organization.routes.js:192`; handler `createTestAccount` in `server/src/controllers/organization.controller.js`.

### POST /api/organization/test-accounts/:id/reset

**Aliases:** `/api/org/test-accounts/:id/reset`

**Auth:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**What it does:** Reset test account password.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `customPassword` | string | no | Request value for custom password. |

**Response:** JSON response fields observed in the handler include `message`, `plaintextPassword`. Explicit status codes include 200, 403, 404, 500. Not associated with an organization.

**Source:** `server/src/routes/organization.routes.js:193`; handler `resetTestAccountPassword` in `server/src/controllers/organization.controller.js`.

### DELETE /api/organization/test-accounts/:id

**Aliases:** `/api/org/test-accounts/:id`

**Auth:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**What it does:** Delete test account.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 200, 403, 404, 500. Not associated with an organization.

**Source:** `server/src/routes/organization.routes.js:194`; handler `deleteTestAccount` in `server/src/controllers/organization.controller.js`.

## admin.routes.js

**Mounted at:** `/api/admin`

**File-wide middleware:** `adminLimiter`

| Method | Path | Access |
|---|---|---|
| GET | `/api/admin/pending-organizations` | `super_admin` |
| POST | `/api/admin/approve-organization/:id` | `super_admin` |
| POST | `/api/admin/reject-organization/:id` | `super_admin` |
| GET | `/api/admin/all-organizations` | `super_admin` |
| GET | `/api/admin/all-users` | `super_admin` |
| POST | `/api/admin/suspend-organization/:id` | `super_admin` |
| POST | `/api/admin/block-organization/:id` | `super_admin` |
| POST | `/api/admin/reactivate-organization/:id` | `super_admin` |
| DELETE | `/api/admin/delete-organization/:id` | `super_admin` |
| POST | `/api/admin/reset-admin-password/:id` | `super_admin` |
| POST | `/api/admin/suspend-user/:id` | `super_admin`, `org_admin` |
| POST | `/api/admin/reactivate-user/:id` | `super_admin`, `org_admin` |
| DELETE | `/api/admin/delete-user/:id` | `super_admin` |
| POST | `/api/admin/create-super-admin` | `super_admin` |
| GET | `/api/admin/notes/pending` | `super_admin` |
| POST | `/api/admin/notes/:id/approve` | `super_admin` |
| POST | `/api/admin/notes/:id/reject` | `super_admin` |
| GET | `/api/admin/system-settings` | `super_admin` |
| POST | `/api/admin/system-settings` | `super_admin` |
| GET | `/api/admin/usage/:orgId` | `super_admin` |
| GET | `/api/admin/org/:orgId/config` | `super_admin` |
| PUT | `/api/admin/org/:orgId/config` | `super_admin` |
| GET | `/api/admin/email-analytics` | `super_admin` |
| GET | `/api/admin/dashboard-analytics` | `super_admin` |
| GET | `/api/admin/global-storage` | `super_admin` |
| GET | `/api/admin/org-insight/:orgId` | `super_admin` |
| GET | `/api/admin/api-metrics` | `super_admin` |
| GET | `/api/admin/system-activity` | `super_admin` |
| GET | `/api/admin/email-stats` | `super_admin` |
| GET | `/api/admin/email-logs` | `super_admin` |
| POST | `/api/admin/email-resend/:jobId` | `super_admin` |
| GET | `/api/admin/student-performance` | `super_admin` |
| GET | `/api/admin/audit-log` | `super_admin` |
| GET | `/api/admin/dashboard/overview` | `super_admin` |
| GET | `/api/admin/dashboard/organizations` | `super_admin` |
| GET | `/api/admin/dashboard/users` | `super_admin` |
| GET | `/api/admin/dashboard/activity` | `super_admin` |
| PATCH | `/api/admin/organization/:id/domains` | `super_admin` |
| GET | `/api/admin/org-analytics/:orgId` | `super_admin` |
| GET | `/api/admin/users/export` | `super_admin` |
| POST | `/api/admin/organizations/provision` | `super_admin` |

### GET /api/admin/pending-organizations

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Pending org management. Get pending organizations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 200, 500. Server error

**Source:** `server/src/routes/admin.routes.js:54`; handler `getPendingOrganizations` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/approve-organization/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Approve organization.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `org`, `error`. Explicit status codes include 200, 404, 500. Pending organization not found or already processed

**Source:** `server/src/routes/admin.routes.js:55`; handler `approveOrganization` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/reject-organization/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Reject organization.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `reason` | string | no | Request value for reason. |

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 200, 404, 500. Pending organization not found or already processed

**Source:** `server/src/routes/admin.routes.js:56`; handler `rejectOrganization` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/all-organizations

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Global data (super admin only). Get all organizations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:59`; handler `getAllOrganizations` in `server/src/controllers/organization.controller.js`.

### GET /api/admin/all-users

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get all users.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | string | no | Query value for role. |
| `org` | string | no | Query value for org. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:60`; handler `getAllUsers` in `server/src/controllers/organization.controller.js`.

### POST /api/admin/suspend-organization/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Organization Actions (super admin only). Suspend organization.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `org`, `error`. Explicit status codes include 403, 404, 500. Only the system owner can suspend organizations

**Source:** `server/src/routes/admin.routes.js:63`; handler `suspendOrganization` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/block-organization/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Block organization.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `org`, `error`. Explicit status codes include 403, 404, 500. Only the system owner can block organizations

**Source:** `server/src/routes/admin.routes.js:64`; handler `blockOrganization` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/reactivate-organization/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Reactivate organization.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `org`, `error`. Explicit status codes include 403, 404, 500. Only the system owner can reactivate organizations

**Source:** `server/src/routes/admin.routes.js:65`; handler `reactivateOrganization` in `server/src/controllers/admin.controller.js`.

### DELETE /api/admin/delete-organization/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Delete organization.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `details`, `error`.

**Source:** `server/src/routes/admin.routes.js:66`; handler `deleteOrganization` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/reset-admin-password/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Reset org admin password.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `email`, `error`. Explicit status codes include 404, 500. Organization not found

**Source:** `server/src/routes/admin.routes.js:67`; handler `resetOrgAdminPassword` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/suspend-user/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** User Actions. Suspend user.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `reason` | string | yes | Request value for reason. |

**Response:** JSON response fields observed in the handler include `message`, `user`, `error`. Explicit status codes include 400, 403, 404, 500. Reason for suspension is required

**Source:** `server/src/routes/admin.routes.js:70`; handler `suspendUser` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/reactivate-user/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin","org_admin")`

**Roles:** `super_admin`, `org_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin","org_admin")`

**What it does:** Reactivate user.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `user`, `error`. Explicit status codes include 403, 404, 500. User not found

**Source:** `server/src/routes/admin.routes.js:71`; handler `reactivateUser` in `server/src/controllers/admin.controller.js`.

### DELETE /api/admin/delete-user/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Delete user.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `reason` | string | yes | Request value for reason. |

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 400, 403, 404, 500. Reason for deletion is required

**Source:** `server/src/routes/admin.routes.js:72`; handler `deleteUser` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/create-super-admin

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Create super admin (god user only). Create super admin.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Request value for name. |
| `email` | string | yes | Request value for email. |
| `password` | string | yes | Request value for password. |

**Response:** JSON response fields observed in the handler include `message`, `user`, `error`. Explicit status codes include 201, 400, 403, 500. Only the system owner can create Super Admins

**Source:** `server/src/routes/admin.routes.js:75`; handler `createSuperAdmin` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/notes/pending

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Notes Review Actions (super admin only). Get pending notes.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `org` | string | no | Query value for org. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 200, 500. Server error fetching notes

**Source:** `server/src/routes/admin.routes.js:78`; handler `getPendingNotes` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/notes/:id/approve

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Approve note.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `note`. Explicit status codes include 200, 500. Note approved successfully

**Source:** `server/src/routes/admin.routes.js:79`; handler `approveNote` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/notes/:id/reject

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Reject note.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `note`. Explicit status codes include 200, 500. Note rejected successfully

**Source:** `server/src/routes/admin.routes.js:80`; handler `rejectNote` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/system-settings

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** NEW: System Settings & Analytics. Get system settings.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 200, 500. Server error

**Source:** `server/src/routes/admin.routes.js:83`; handler `getSystemSettings` in `server/src/controllers/admin-analytics.controller.js`.

### POST /api/admin/system-settings

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Update system settings.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `settings`, `error`. Explicit status codes include 200, 500. Settings updated

**Source:** `server/src/routes/admin.routes.js:84`; handler `updateSystemSettings` in `server/src/controllers/admin-analytics.controller.js`.

### GET /api/admin/usage/:orgId

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get org usage.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `orgId` | string | yes | Path identifier/value for org id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 200, 500. Server error

**Source:** `server/src/routes/admin.routes.js:86`; handler `getOrgUsage` in `server/src/controllers/admin-analytics.controller.js`.

### GET /api/admin/org/:orgId/config

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get organization config.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `orgId` | string | yes | Path identifier/value for org id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 404, 500. Organization not found.

**Source:** `server/src/routes/admin.routes.js:87`; handler `getOrganizationConfig` in `server/src/controllers/org-configuration.controller.js`.

### PUT /api/admin/org/:orgId/config

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Update organization config.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `orgId` | string | yes | Path identifier/value for org id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `featureFlags` | string | no | Request value for feature flags. |
| `billing` | string | no | Request value for billing. |
| `limits` | string | no | Request value for limits. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 404, 500. Feature and dashboard values must be boolean.

**Source:** `server/src/routes/admin.routes.js:88`; handler `updateOrganizationConfig` in `server/src/controllers/org-configuration.controller.js`.

### GET /api/admin/email-analytics

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get email analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `orgId` | string | no | Query value for org id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `total`, `daily`, `monthly`, `typeBreakdown`, `dailyChart`, `message`, `error`. Explicit status codes include 200, 500. Server error

**Source:** `server/src/routes/admin.routes.js:89`; handler `getEmailAnalytics` in `server/src/controllers/admin-analytics.controller.js`.

### GET /api/admin/dashboard-analytics

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get dashboard analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `notes`, `students`, `message`, `error`. Explicit status codes include 200, 500. Server error

**Source:** `server/src/routes/admin.routes.js:90`; handler `getDashboardAnalytics` in `server/src/controllers/admin-analytics.controller.js`.

### GET /api/admin/global-storage

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get global storage usage.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 200, 500. Server error

**Source:** `server/src/routes/admin.routes.js:91`; handler `getGlobalStorageUsage` in `server/src/controllers/admin-analytics.controller.js`.

### GET /api/admin/org-insight/:orgId

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Org Insight & API Metrics. Get org insight.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `orgId` | string | yes | Path identifier/value for org id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `totalFaculty`, `totalStudents`, `totalClassrooms`, `faculty`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:94`; handler `getOrgInsight` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/api-metrics

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get api metrics.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `health`, `totalRequests`, `successCount`, `clientErrCount`, `serverErrCount`, `errorRate`, `avgRespMs`, `requestsPerMinute`, `topRoutes`, `recentFailures`, `windowHours`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:95`; handler `getApiMetrics` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/system-activity

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get system activity.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 200, 500. Server error

**Source:** `server/src/routes/admin.routes.js:96`; handler `getSystemActivity` in `server/src/controllers/admin-analytics.controller.js`.

### GET /api/admin/email-stats

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Email Queue Monitoring (super admin only). Retrieves email stats.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:99`; handler `inline handler` in `server/src/routes/admin.routes.js`.

### GET /api/admin/email-logs

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Retrieves email logs.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `page` | number | no | Query value for page. Default: `1`. |
| `limit` | number | no | Query value for limit. Default: `50`. |
| `status` | string | no | Query value for status. |
| `classroomId` | string | no | Query value for classroom id. |
| `type` | string | no | Query value for type. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:110`; handler `inline handler` in `server/src/routes/admin.routes.js`.

### POST /api/admin/email-resend/:jobId

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Creates or processes email resend.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `jobId` | string | yes | Path identifier/value for job id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `job`. Explicit status codes include 404, 500. Job not found or not in failed state

**Source:** `server/src/routes/admin.routes.js:128`; handler `inline handler` in `server/src/routes/admin.routes.js`.

### GET /api/admin/student-performance

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** - Student Performance & Audit Log (NEW) --. Get global student performance.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `cached`, `students`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:144`; handler `getGlobalStudentPerformance` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/audit-log

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get global audit log.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `org` | string | no | Query value for org. |
| `action` | string | no | Query value for action. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `logs`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:145`; handler `getGlobalAuditLog` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/dashboard/overview

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Super Admin Dashboard API. Get dashboard overview.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `totalUsers`, `totalOrgs`, `totalClassrooms`, `totalMemberships`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:148`; handler `getDashboardOverview` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/dashboard/organizations

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get dashboard organizations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `organizations`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:149`; handler `getDashboardOrganizations` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/dashboard/users

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get dashboard users.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `page` | number | no | Query value for page. |
| `limit` | number | no | Query value for limit. |
| `role` | string | no | Query value for role. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `users`, `pagination`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:150`; handler `getDashboardUsers` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/dashboard/activity

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get recent activity.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `limit` | number | no | Query value for limit. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `activity`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:151`; handler `getRecentActivity` in `server/src/controllers/admin.controller.js`.

### PATCH /api/admin/organization/:id/domains

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Update org domains.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `domains` | string | no | Request value for domains. |

**Response:** JSON response fields observed in the handler include `message`, `organization`, `error`. Explicit status codes include 400, 404, 500. Domains must be an array of strings.

**Source:** `server/src/routes/admin.routes.js:152`; handler `updateOrgDomains` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/org-analytics/:orgId

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Get org analytics.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `orgId` | string | yes | Path identifier/value for org id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `organization`, `revenue`, `users`, `classrooms`, `error`. Explicit status codes include 404, 500. Organization not found

**Source:** `server/src/routes/admin.routes.js:153`; handler `getOrgAnalytics` in `server/src/controllers/admin.controller.js`.

### GET /api/admin/users/export

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Export users.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | string | no | Query value for role. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/admin.routes.js:154`; handler `exportUsers` in `server/src/controllers/admin.controller.js`.

### POST /api/admin/organizations/provision

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `adminLimiter`, `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Provisioning Logic (Day 4). Handle manual provisioning.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `admin` | string | no | Request value for admin. |
| `organization` | string | no | Request value for organization. |

**Response:** JSON response fields observed in the handler include `message`, `data`, `error`. Explicit status codes include 201, 400, 403, 500. Admin phone and Organization name are required.

**Source:** `server/src/routes/admin.routes.js:157`; handler `handleManualProvisioning` in `server/src/controllers/provisioning.controller.js`.

## hierarchy.routes.js

**Mounted at:** `/api/hierarchy`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile()`

| Method | Path | Access |
|---|---|---|
| GET | `/api/hierarchy/tree` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/hierarchy/terminology` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/hierarchy/terminology/all` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/hierarchy/roles` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/hierarchy/children/:parentId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/hierarchy/node` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/hierarchy/seed` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PATCH | `/api/hierarchy/node/:nodeId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/hierarchy/node/:nodeId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/hierarchy/tree

**Auth:** `isAuthenticated`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile()`

**What it does:** Full hierarchy tree (nested or flat). Get tree.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `flat` | string | no | Query value for flat. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `nodes`, `tree`, `terminology`, `error`, `details`. Explicit status codes include 500.

**Source:** `server/src/routes/hierarchy.routes.js:28`; handler `getTree` in `server/src/controllers/hierarchy.controller.js`.

### GET /api/hierarchy/terminology

**Auth:** `isAuthenticated`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile()`

**What it does:** Get org-specific labels. Get org terminology.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `structure_type`, `org_type`, `terminology`, `details`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/hierarchy.routes.js:31`; handler `getOrgTerminology` in `server/src/controllers/hierarchy.controller.js`.

### GET /api/hierarchy/terminology/all

**Auth:** `isAuthenticated`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile()`

**What it does:** Get ALL org types' terminology (for settings comparison table). Get all terminology.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `comparisonCols`, `comparisonConcepts`, `allTerminology`, `error`, `details`. Explicit status codes include 500.

**Source:** `server/src/routes/hierarchy.routes.js:34`; handler `getAllTerminology` in `server/src/controllers/hierarchy.controller.js`.

### GET /api/hierarchy/roles

**Auth:** `isAuthenticated`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile()`

**What it does:** Get allowed roles based on org type. Get org roles.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `all` | string | no | Query value for all. |
| `invitable` | string | no | Query value for invitable. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `allRoles`, `roles`, `error`, `org_type`, `structure_type`, `details`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/hierarchy.routes.js:37`; handler `getOrgRoles` in `server/src/controllers/hierarchy.controller.js`.

### GET /api/hierarchy/children/:parentId

**Auth:** `isAuthenticated`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile()`

**What it does:** Direct children of a node. Get children.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `parentId` | string | yes | Path identifier/value for parent id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `children`, `error`, `details`. Explicit status codes include 500.

**Source:** `server/src/routes/hierarchy.routes.js:40`; handler `getChildren` in `server/src/controllers/hierarchy.controller.js`.

### POST /api/hierarchy/node

**Auth:** `isAuthenticated`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile()`, `validateHierarchyRequest`

**What it does:** Validated by hierarchy-validator middleware (blocks invalid level_types per org plan). Create node.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `level_type` | string | yes | Request value for level type. |
| `name` | string | yes | Request value for name. |
| `code` | string | no | Request value for code. |
| `parent_id` | string | no | Request value for parent id. |
| `sort_order` | number | no | Request value for sort order. |
| `academic_year` | number | no | Request value for academic year. |
| `sub_batch_capacity` | number | no | Request value for sub batch capacity. |

**Response:** JSON response fields observed in the handler include `error`, `message`, `node`, `details`. Explicit status codes include 201, 400, 404, 409, 500.

**Source:** `server/src/routes/hierarchy.routes.js:44`; handler `createNode` in `server/src/controllers/hierarchy.controller.js`.

### POST /api/hierarchy/seed

**Auth:** `isAuthenticated`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile()`

**What it does:** Seed default structure (one-time during onboarding). Seed hierarchy.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `existing_count`, `message`, `total_nodes`, `details`. Explicit status codes include 201, 404, 409, 500.

**Source:** `server/src/routes/hierarchy.routes.js:47`; handler `seedHierarchy` in `server/src/controllers/hierarchy.controller.js`.

### PATCH /api/hierarchy/node/:nodeId

**Auth:** `isAuthenticated`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile()`

**What it does:** Update a node. Update node.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `nodeId` | string | yes | Path identifier/value for node id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | no | Request value for name. |
| `code` | string | no | Request value for code. |
| `sort_order` | number | no | Request value for sort order. |
| `is_active` | boolean | no | Request value for is active. |

**Response:** JSON response fields observed in the handler include `error`, `message`, `node`, `details`. Explicit status codes include 404, 409, 500. Node updated.

**Source:** `server/src/routes/hierarchy.routes.js:50`; handler `updateNode` in `server/src/controllers/hierarchy.controller.js`.

### DELETE /api/hierarchy/node/:nodeId

**Auth:** `isAuthenticated`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile()`

**What it does:** Soft-delete a node + descendants. Delete node.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `nodeId` | string | yes | Path identifier/value for node id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `message`, `details`. Explicit status codes include 404, 500.

**Source:** `server/src/routes/hierarchy.routes.js:53`; handler `deleteNode` in `server/src/controllers/hierarchy.controller.js`.

