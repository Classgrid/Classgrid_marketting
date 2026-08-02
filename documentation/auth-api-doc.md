# Authentication API Reference

Base path: `/api/auth`  
Source: `server/src/routes/auth.routes.js` (112 lines) + `auth.controller.js` (2289 lines)

---

## Public Endpoints (No Auth Required)

### GET `/system-config`

Returns platform-wide feature flags from `SystemSettings` model.

**Response:**
```json
{
  "maintenanceMode": false,
  "disableRegistrations": false,
  "aiFeatures": true,
  "notesSystem": true,
  "chatSystem": true
}
```

---

### POST `/check-email`

Email-first login flow. Checks if an email exists and returns the account type without revealing sensitive data. Sends a "no account" notification email if the email is not registered (Vercel-style security).

**Rate Limit:** `emailCheckLimiter`

**Request Body:**
```json
{
  "email": "student@college.edu"
}
```

**Response (account exists):**
```json
{
  "exists": true,
  "hasPassword": true,
  "provider": "manual",
  "loginTab": "student"
}
```

**Response (no account):**
```json
{
  "exists": false
}
```
A "Sign-in attempt on Classgrid" email is sent to the address (fire-and-forget, rate-limited to 1 per second per email).

---

### POST `/signup-init`

Step 1 of manual signup. Sends a verification email with a UUID token link.

**Request Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@college.edu"
}
```

**Validation:**
- If email is already verified → `400 "Email already registered. Please login."`
- If unverified user exists → deletes old record, creates fresh verification
- Rate limit: max 2 verification emails per hour per email

**Response:**
```json
{
  "message": "Verification email sent. Please check your inbox."
}
```

**Email sent:** "📧 Verify Email - Classgrid" with a verification link.

---

### GET `/verify-token/:token`

Step 2 of signup. Validates the email verification UUID token.

**Params:** `token` — UUID from the verification email link

**Response (valid):** Redirects or returns verification status for frontend to show the "Set Password" form.

**Response (invalid/expired):** `400`

---

### POST `/signup-complete`

Step 3 of signup. Sets password and creates the verified user account.

**Request Body:**
```json
{
  "email": "rahul@college.edu",
  "password": "SecureP@ss1",
  "role": "student"
}
```

**Password Requirements:** Min 8 chars, must include uppercase, lowercase, number, and special character (`@$!%*?&`).

**Response:** Returns JWT token + user object + sets `token` cookie.

---

### POST `/check-admin-status`

Checks if an email belongs to an `org_admin` and whether they've activated their account.

**Request Body:**
```json
{
  "email": "admin@college.edu"
}
```

**Response:**
```json
{
  "isOrgAdmin": true,
  "isActivated": false
}
```

`isActivated` = `!user.mustResetPassword` (true means they've set their password).

---

### POST `/validate-activation-token`

Validates a staff/admin activation token or email+code pair. Used by the activation page before showing the password form.

**Request Body (link mode):**
```json
{
  "token": "<64-char hex token from email link>"
}
```

**Request Body (code mode):**
```json
{
  "email": "admin@college.edu",
  "activationCode": "482916"
}
```

**Security:**
- Tokens are SHA-256 hashed before DB lookup
- Single-use: rejected if `activationUsedAt` is set
- Rate limited: max 5 attempts per 15-minute window per user
- `410` if token already used or expired (with specific messages)

**Response:** `{ "valid": true, "mode": "link" | "code" }`

---

### POST `/activate-admin`

Sets password for an invited staff member. Marks account as activated, auto-logs in, and sends confirmation email.

**Request Body:**
```json
{
  "token": "<hex token>",
  "password": "SecureP@ss1"
}
```
OR:
```json
{
  "email": "admin@college.edu",
  "activationCode": "482916",
  "password": "SecureP@ss1"
}
```

**Workflow:**
1. Validates token/code (single-use, rate-limited)
2. Hashes password with bcrypt (10 rounds)
3. Sets `mustResetPassword: false`, `isEmailVerified: true`
4. Marks token as consumed (`activationUsedAt: Date`)
5. Syncs onboarding progress, tracks event
6. Sends "Your Classgrid Admin Account is Active" email
7. Generates JWT, sets cookie, returns redirect path

**Response:**
```json
{
  "message": "Account activated successfully",
  "token": "<JWT>",
  "redirectTo": "/org/admin/dashboard",
  "user": {
    "id": "<ObjectId>",
    "name": "Admin Name",
    "email": "admin@college.edu",
    "role": "org_admin",
    "profilePicture": "",
    "photoURL": "",
    "organization_id": "<ObjectId>",
    "authProvider": "manual"
  }
}
```

---

### POST `/resend-activation`

Regenerates activation credentials and resends the invite email for unactivated org admins.

**Rate Limit:** `resetPasswordLimiter`. Additional: blocks if token was issued less than 2 minutes ago.

**Request Body:**
```json
{
  "email": "admin@college.edu"
}
```

**Response (always safe — prevents enumeration):**
```json
{
  "message": "If that email is a pending admin account, a new activation link has been sent.",
  "activation": {
    "activationCode": "482916",
    "activationLink": "https://classgrid.in/admin/activate?token=...",
    "expiresAt": "2026-08-03T06:25:00Z"
  }
}
```

---

### POST `/manual-activation-link`

Resolves a fresh activation link using email + activation code (fallback for users who lost the email link).

**Request Body:**
```json
{
  "email": "admin@college.edu",
  "activationCode": "482916"
}
```

**Response:**
```json
{
  "success": true,
  "activationLink": "https://classgrid.in/admin/activate?token=...",
  "activationCode": "new_code",
  "expiresAt": "2026-08-03T06:25:00Z"
}
```

---

### POST `/login`

Manual email+password login with device fingerprinting, reCAPTCHA, and multi-portal support.

**Rate Limit:** `loginLimiter`

**Request Body:**
```json
{
  "email": "student@college.edu",
  "password": "SecureP@ss1",
  "loginTab": "student",
  "rememberMe": true,
  "deviceFingerprint": "<browser fingerprint>",
  "recaptchaToken": "<reCAPTCHA v3 token>",
  "recaptchaAction": "login",
  "portalHost": "ganesha.classgrid.in"
}
```

**JWT Expiry (Platform-Aware "Login Law"):**
- Mobile app (`x-platform-app: android|ios`): **365 days**
- Desktop + Remember Me: **7 days**
- Desktop default: **24 hours**

**Cookie:** `token` cookie set with `httpOnly`, `secure` (prod), `sameSite: None` (prod). Domain scoped to `.classgrid.in` for subdomain SSO.

**Response:**
```json
{
  "token": "<JWT>",
  "redirectTo": "/student/work",
  "user": {
    "id": "<ObjectId>",
    "name": "Rahul Sharma",
    "email": "student@college.edu",
    "role": "student",
    "profilePicture": "...",
    "organization_id": "<ObjectId>"
  }
}
```

**Dashboard Targets by Role:**
| Role | Redirect |
|---|---|
| `student` | `/student/work` |
| `faculty` / `teacher` | `/work` |
| `org_admin` | `/org/admin/dashboard` |
| `library_manager` | `/dept/library/dashboard` |
| `exam_controller` | `/dept/exams/dashboard` |
| `fee_manager` | `/dept/fees/dashboard` |
| `admission_head` | `/dept/admissions/dashboard` |
| `super_admin` | `/superadmin/dashboard` |

---

### POST `/request-login-otp`

Requests OTP for passwordless login (device verification).

**Rate Limit:** `loginLimiter`

**Request Body:**
```json
{
  "email": "student@college.edu"
}
```

---

### POST `/resend-device-otp`

Resends device verification OTP.

**Rate Limit:** `otpSendLimiter`

---

### POST `/verify-device`

Verifies device OTP and completes login.

**Request Body:**
```json
{
  "email": "student@college.edu",
  "otp": "123456"
}
```

---

### POST `/setup-org-admin`

Legacy endpoint for backward compatibility. Sets up an org admin account.

---

### POST `/logout`

Clears the `token` cookie.

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

---

### POST `/forgot-password`

Sends a password reset email with a token link.

**Rate Limit:** `resetPasswordLimiter`

**Request Body:**
```json
{
  "email": "student@college.edu"
}
```

**Email sent:** "🔐 Classgrid - Reset Your Password"

---

### GET `/verify-reset-token/:token`

Validates a password reset token.

---

### POST `/reset-password`

Resets password using the token from the email.

**Rate Limit:** `resetPasswordLimiter`

**Request Body:**
```json
{
  "token": "<reset token>",
  "password": "NewSecureP@ss1"
}
```

---

### POST `/faculty-activate`

Faculty-specific activation endpoint (uses `resetPasswordLimiter`).

---

## Authenticated Endpoints

### GET `/me`

Returns the currently logged-in user's profile.

**Auth:** `isAuthenticated` (JWT cookie or `Authorization: Bearer <token>`)

**Response:**
```json
{
  "id": "<ObjectId>",
  "name": "Rahul Sharma",
  "email": "student@college.edu",
  "role": "student",
  "profilePicture": "...",
  "organization_id": "<ObjectId>",
  "additional_roles": ["library_manager"],
  "profile_completed": true
}
```

---

### POST `/force-reset-password`

Admin-forced password reset for a user.

**Auth:** `isAuthenticated`

---

### POST `/change-password`

User changes their own password (requires current password).

**Auth:** `isAuthenticated`

**Request Body:**
```json
{
  "currentPassword": "OldP@ss1",
  "newPassword": "NewP@ss1"
}
```

---

### POST `/delete-account`

User deletes their own account.

**Auth:** `isAuthenticated`

---

## Google OAuth

### GET `/google`

Initiates Google OAuth flow. Creates an encrypted OAuth state containing `loginTab` and `host` for multi-portal routing.

**Query Params:**
- `loginTab` — `student` | `faculty` | `admin` | `super_admin` (default: `student`)
- `host` — custom domain or subdomain (e.g., `ganesha.classgrid.in`)

**Flow:**
1. Creates OAuth state with `loginTab` + `host` (encrypted, stored in cookie)
2. Redirects to Google with `scope: ["profile", "email"]`, `prompt: "select_account consent"`

### GET `/google/callback`

Google OAuth callback. Verifies OAuth state cookie, authenticates user, and redirects.

**Flow:**
1. Verifies `x-oauth-state` cookie against `req.query.state`
2. Resolves target URL from `host` in state (custom domain or default frontend)
3. On success → calls `authController.oauthCallback` which generates JWT, sets cookie, redirects to dashboard
4. On error → redirects to login page with `?error=google_blocked` or `?error=AuthFailed`

---

## JWT Token Structure

```json
{
  "id": "<MongoDB ObjectId>",
  "role": "student",
  "organizationId": "<ObjectId or null>",
  "rememberMe": false,
  "iat": 1722600000,
  "exp": 1722686400
}
```

Signed with `JWT_SECRET` env variable using `jsonwebtoken`.

---

## Rate Limiters

| Limiter | Applied To |
|---|---|
| `loginLimiter` | `/login`, `/request-login-otp` |
| `emailCheckLimiter` | `/check-email` |
| `resetPasswordLimiter` | `/forgot-password`, `/reset-password`, `/faculty-activate` |
| `otpSendLimiter` | `/resend-device-otp` |

---

## Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcrypt (10 rounds) |
| Token hashing | SHA-256 (activation tokens stored hashed) |
| Single-use tokens | `activationUsedAt` field prevents re-use |
| Device fingerprinting | `device-fingerprint.service.js` |
| reCAPTCHA v3 | `recaptcha.service.js` (on login) |
| OAuth state | Encrypted nonce in cookie + query param |
| "No account" emails | Sent on failed lookups (prevents silent enumeration) |
| IP geolocation | `ip-api.com` + `ipinfo.io` fallback for login notifications |
