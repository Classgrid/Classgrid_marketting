---
title: Authentication API
description: "Code-grounded Classgrid REST API reference for authentication api"
---

# Authentication API

This reference is generated from the current Express route definitions and their handlers. It documents route-level authentication and authorization; deployment-wide middleware may add further checks.

## Conventions

- Base API origin: `https://api.classgrid.in`
- Authentication: authenticated routes use the Classgrid session/JWT recognized by `isAuthenticated`.
- JSON is the default request and response format unless an endpoint explicitly accepts multipart data or redirects.
- Path parameters are always required.
- A field marked `no` means the static handler scan did not find a direct required-field check; business rules may still make it conditionally required.
- Role checks can also accept `super_admin` through the shared authorization middleware where implemented.

This document contains **30 route definitions** from 2 source files.

## auth.routes.js

**Mounted at:** `/api/auth`

| Method | Path | Access |
|---|---|---|
| GET | `/api/auth/system-config` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/check-email` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/signup-init` | Public endpoint unless an upstream platform gate applies. |
| GET | `/api/auth/verify-token/:token` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/signup-complete` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/check-admin-status` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/validate-activation-token` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/activate-admin` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/resend-activation` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/manual-activation-link` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/login` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/request-login-otp` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/resend-device-otp` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/verify-device` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/setup-org-admin` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/logout` | Public endpoint unless an upstream platform gate applies. |
| GET | `/api/auth/me` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/auth/forgot-password` | Public endpoint unless an upstream platform gate applies. |
| GET | `/api/auth/verify-reset-token/:token` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/reset-password` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/faculty-activate` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/auth/force-reset-password` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/auth/change-password` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/auth/delete-account` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/auth/google` | Public endpoint unless an upstream platform gate applies. |
| GET | `/api/auth/google/callback` | Public endpoint unless an upstream platform gate applies. |

### GET /api/auth/system-config

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Public System Config. Get system config.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `maintenanceMode`, `disableRegistrations`, `aiFeatures`, `notesSystem`, `chatSystem`, `message`. Explicit status codes include 200, 500. Server error

**Source:** `server/src/routes/auth.routes.js:26`; handler `getSystemConfig` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/check-email

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `emailCheckLimiter`

**What it does:** Email-first login flow (secure check). Check email for login.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |

**Response:** JSON response fields observed in the handler include `message`, `exists`, `hasPassword`, `role`. Explicit status codes include 200, 400, 500. Email is required.

**Source:** `server/src/routes/auth.routes.js:29`; handler `checkEmailForLogin` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/signup-init

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Manual Auth. Initiate signup.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Request value for name. |
| `email` | string | yes | Request value for email. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 403, 429, 500. New registrations are currently disabled by the Super Admin.

**Source:** `server/src/routes/auth.routes.js:32`; handler `initiateSignup` in `server/src/controllers/auth.controller.js`.

### GET /api/auth/verify-token/:token

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Verify signup token.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Path identifier/value for token. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** Redirects the client to the generated destination URL.

**Source:** `server/src/routes/auth.routes.js:33`; handler `verifySignupToken` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/signup-complete

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Complete signup.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |
| `password` | string | yes | Request value for password. |
| `role` | string | no | Request value for role. |

**Response:** JSON response fields observed in the handler include `message`, `token`, `firstLogin`, `needsOrgCode`, `user`. Explicit status codes include 400, 500. Token and password are required

**Source:** `server/src/routes/auth.routes.js:34`; handler `completeSignup` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/check-admin-status

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Check admin status.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |

**Response:** JSON response fields observed in the handler include `message`, `isOrgAdmin`, `isActivated`. Explicit status codes include 400, 500. Email is required

**Source:** `server/src/routes/auth.routes.js:35`; handler `checkAdminStatus` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/validate-activation-token

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Validate activation token.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |
| `email` | string | no | Request value for email. |
| `activationCode` | string | no | Request value for activation code. |

**Response:** JSON response fields observed in the handler include `message`, `valid`, `mode`. Explicit status codes include 200, 400, 410, 429, 500. Provide either a token or email + activationCode.

**Source:** `server/src/routes/auth.routes.js:36`; handler `validateActivationToken` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/activate-admin

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Activate admin.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |
| `password` | string | yes | Request value for password. |
| `email` | string | no | Request value for email. |
| `activationCode` | string | no | Request value for activation code. |

**Response:** JSON response fields observed in the handler include `message`, `token`, `redirectTo`, `user`. Explicit status codes include 200, 400, 410, 429, 500. Provide password plus either token or email + activationCode.

**Source:** `server/src/routes/auth.routes.js:37`; handler `activateAdmin` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/resend-activation

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Resend activation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |

**Response:** JSON response fields observed in the handler include `message`, `activation`. Explicit status codes include 400, 429, 500. Email is required.

**Source:** `server/src/routes/auth.routes.js:38`; handler `resendActivation` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/manual-activation-link

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Resolve manual activation link.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |
| `activationCode` | string | yes | Request value for activation code. |

**Response:** JSON response fields observed in the handler include `message`, `success`, `activationLink`, `activationCode`, `expiresAt`. Explicit status codes include 400, 500. Email and activationCode are required.

**Source:** `server/src/routes/auth.routes.js:39`; handler `resolveManualActivationLink` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/login

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `loginLimiter`

**What it does:** Login.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | no | Request value for email. |
| `password` | string | no | Request value for password. |
| `expectedLoginType` | string | no | Request value for expected login type. |
| `loginTab` | string | no | Request value for login tab. |
| `deviceFingerprint` | string | yes | Request value for device fingerprint. |
| `fingerprint` | string | no | Request value for fingerprint. |
| `rememberMe` | string | no | Request value for remember me. |
| `recaptchaToken` | string | no | Request value for recaptcha token. |
| `recaptchaAction` | string | no | Request value for recaptcha action. |
| `portalHost` | string | no | Request value for portal host. |
| `role` | string | no | Request value for role. |

**Response:** JSON response fields observed in the handler include `message`, `code`, `retryAfterSeconds`, `wrongTab`, `correctTab`, `suggestion`, `needsDeviceOtp`, `firstLogin`, `mustResetPassword`, `needsOrgCode`, `user`, `organization`, `token`. Explicit status codes include 200, 401, 403, 404, 429, 500, 503. Organization session invalid or not found.

**Source:** `server/src/routes/auth.routes.js:41`; handler `login` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/request-login-otp

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `loginLimiter`

**What it does:** Request login otp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |
| `deviceFingerprint` | string | yes | Request value for device fingerprint. |
| `rememberMe` | boolean | no | Request value for remember me. Default: `false`. |

**Response:** JSON response fields observed in the handler include `message`, `retryAfterSeconds`, `success`, `needsDeviceOtp`. Explicit status codes include 400, 404, 429, 500. Email and device footprint are required.

**Source:** `server/src/routes/auth.routes.js:42`; handler `requestLoginOtp` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/resend-device-otp

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `otpSendLimiter`

**What it does:** Resend device otp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |

**Response:** JSON response fields observed in the handler include `message`, `retryAfterSeconds`. Explicit status codes include 400, 404, 429, 500. Email is required

**Source:** `server/src/routes/auth.routes.js:43`; handler `resendDeviceOtp` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/verify-device

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Verify device otp.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |
| `otp` | string | yes | Request value for otp. |
| `deviceFingerprint` | string | no | Request value for device fingerprint. |

**Response:** JSON response fields observed in the handler include `message`, `firstLogin`, `mustResetPassword`, `needsOrgCode`, `user`, `organization`, `token`. Explicit status codes include 400, 404, 500. Missing required fields.

**Source:** `server/src/routes/auth.routes.js:44`; handler `verifyDeviceOtp` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/setup-org-admin

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Setup org admin.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |
| `orgCode` | string | yes | Request value for org code. |
| `password` | string | yes | Request value for password. |

**Response:** JSON response fields observed in the handler include `message`, `token`, `user`. Explicit status codes include 200, 400, 403, 404, 500. All fields are required

**Source:** `server/src/routes/auth.routes.js:45`; handler `setupOrgAdmin` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/logout

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** kept for backward compat. Logout.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `redirect`. Logged out successfully

**Source:** `server/src/routes/auth.routes.js:46`; handler `logout` in `server/src/controllers/auth.controller.js`.

### GET /api/auth/me

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Get current user.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `id`, `name`, `sidebar_name`, `email`, `role`, `additional_roles`, `department`, `subject`, `profilePicture`, `platformLogo`, `phoneNumber`, `authProvider`, `linkedProviders`, and others. Explicit status codes include 401, 500. Not authenticated

**Source:** `server/src/routes/auth.routes.js:48`; handler `getCurrentUser` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/forgot-password

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `resetPasswordLimiter`

**What it does:** Forgot password.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | yes | Request value for email. |
| `origin` | string | no | Request value for origin. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 429, 500. Email is required.

**Source:** `server/src/routes/auth.routes.js:50`; handler `forgotPassword` in `server/src/controllers/auth.controller.js`.

### GET /api/auth/verify-reset-token/:token

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Verify reset token.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Path identifier/value for token. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `valid`, `message`. Explicit status codes include 400, 500. No token provided

**Source:** `server/src/routes/auth.routes.js:51`; handler `verifyResetToken` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/reset-password

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `resetPasswordLimiter`

**What it does:** Reset password.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |
| `password` | string | yes | Request value for password. |

**Response:** JSON response fields observed in the handler include `message`, `role`. Explicit status codes include 400, 422, 500. Reset token is required.

**Source:** `server/src/routes/auth.routes.js:52`; handler `resetPassword` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/faculty-activate

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `resetPasswordLimiter`

**What it does:** Faculty activate.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `token` | string | yes | Request value for token. |
| `password` | string | yes | Request value for password. |
| `orgCode` | string | yes | Request value for org code. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 422, 500. Activation token is required.

**Source:** `server/src/routes/auth.routes.js:53`; handler `facultyActivate` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/force-reset-password

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Force reset password.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `password` | string | yes | Request value for password. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 404, 500. Password must be at least 8 characters long.

**Source:** `server/src/routes/auth.routes.js:54`; handler `forceResetPassword` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/change-password

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Change password.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `oldPassword` | string | yes | Request value for old password. |
| `newPassword` | string | yes | Request value for new password. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 401, 404, 500. Old password and new password (min 8 chars) are required.

**Source:** `server/src/routes/auth.routes.js:55`; handler `changePassword` in `server/src/controllers/auth.controller.js`.

### POST /api/auth/delete-account

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Delete account.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `password` | string | yes | Request value for password. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 401, 403, 404, 500. Password is required to confirm deletion.

**Source:** `server/src/routes/auth.routes.js:56`; handler `deleteAccount` in `server/src/controllers/auth.controller.js`.

### GET /api/auth/google

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Google OAuth. Retrieves google.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `loginTab` | string | no | Query value for login tab. |
| `role` | string | no | Query value for role. |
| `host` | string | no | Query value for host. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400.

**Source:** `server/src/routes/auth.routes.js:59`; handler `inline handler` in `server/src/routes/auth.routes.js`.

### GET /api/auth/google/callback

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Retrieves google callback.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `state` | string | no | Query value for state. |

**Body:** None detected in the route or handler.

**Response:** Redirects the client to the generated destination URL.

**Source:** `server/src/routes/auth.routes.js:77`; handler `inline handler` in `server/src/routes/auth.routes.js`.

## google.routes.js

**Mounted at:** `/api/google`

| Method | Path | Access |
|---|---|---|
| GET | `/api/google/status` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/google/drive/files` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/google/classroom/courses` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/google/classroom/coursework` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/google/status

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves status.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `connected`.

**Source:** `server/src/routes/google.routes.js:11`; handler `inline handler` in `server/src/routes/google.routes.js`.

### GET /api/google/drive/files

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves drive files.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `q` | string | no | Query value for q. |
| `pageToken` | string | no | Query value for page token. |
| `folderId` | string | no | Query value for folder id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `files`, `nextPageToken`, `currentFolderId`, `message`, `code`, `detail`. Explicit status codes include 401, 403, 500. Google account not connected

**Source:** `server/src/routes/google.routes.js:19`; handler `inline handler` in `server/src/routes/google.routes.js`.

### GET /api/google/classroom/courses

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves classroom courses.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `courses`, `message`, `code`. Explicit status codes include 401, 403, 500. Google account not connected

**Source:** `server/src/routes/google.routes.js:67`; handler `inline handler` in `server/src/routes/google.routes.js`.

### GET /api/google/classroom/coursework

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves classroom coursework.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `courseId` | string | yes | Query value for course id. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `coursework`, `code`. Explicit status codes include 400, 401, 403, 500. courseId is required

**Source:** `server/src/routes/google.routes.js:101`; handler `inline handler` in `server/src/routes/google.routes.js`.

