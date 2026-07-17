
## Overview

Classgrid uses separate login entry points for students, faculty, organization administrators, and department teams. The portal path helps a user start in the right experience, but the backend is the security boundary. Every protected API request is authenticated and then checked against the user's effective role and organization.

The system uses:

- A signed JWT containing the user ID, primary role, and organization ID.
- An `HttpOnly` authentication cookie named `token`.
- A bearer-token fallback through the `Authorization` header.
- Organization and tenant checks to prevent a user from signing in through another institution's subdomain.
- Role middleware that rejects protected operations unless the user's effective role is allowed.

The frontend also receives the token in successful login responses and currently stores it in `localStorage` for API use. Treat that token as sensitive and never print it in logs, support tickets, screenshots, or browser console output.

## The 10 Login Portals

These are the ten institution-facing login paths currently registered in the frontend:

| Portal | Login path | Primary audience | Typical roles or account types |
|---|---|---|---|
| Organization Admin Portal | `/org/login` | Institution IT and organization administrators | `org_admin`, authorized institution admin roles |
| Student Portal | `/student/login` | Enrolled students | `student` |
| Faculty Portal | `/faculty/login` | Teachers and teaching staff | `teacher`, `faculty` |
| Admissions Portal | `/dept/admissions/login` | Admissions teams | `admission_head`, `admission_verifier`, `admission_counselor`, `admission_clerk` |
| Fees/Finance Portal | `/dept/fees/login` | Fees and accounts teams | `fee_manager`, `org_admin` where the route permits it |
| Exams Portal | `/dept/exams/login` | Examination teams | `exam_controller`, `faculty`, `org_admin` depending on the API operation |
| Attendance Portal | `/dept/attendance/login` | Attendance operations and teaching staff | `faculty`, `teacher`, `org_admin` for the protected operations currently implemented |
| HR & Payroll Portal | `/dept/hr/login` | HR and payroll operations | Use the role list returned by the backend for the organization; do not invent a `dept_hr` role |
| Hostel & Transport Portal | `/dept/hostel/login` | Hostel, transport, and facilities teams | `transport_manager` and other roles enabled for the organization |
| Library Portal | `/dept/library/login` | Library teams | `library_manager`, `org_admin` where permitted |

The department paths are login entry points. They do not replace server-side permission checks. A user who enters the wrong portal is rejected when the login request declares a conflicting audience or role. After login, API middleware remains responsible for access control.

The platform also has a separate Super Admin login path:

```text
/superadmin/login
```

Super Admin accounts are platform-level accounts and are not part of an institution's ten portals. On a tenant subdomain, the backend blocks Super Admin login and directs the user to the Super Admin portal.

### Role naming note

The current backend role keys are specific values such as `admission_head`, `fee_manager`, and `exam_controller`. Generic values such as `dept_admissions` or `dept_fees` are not the backend's source-of-truth role keys.

The Members page loads the allowed role list from:

```text
GET /api/hierarchy/roles?invitable=true
```

Use the returned `value` exactly. Do not manually create accounts with a role string that is not returned by the organization configuration.

## Role-Based Access Control (RBAC)

### How Roles Work

Each user has a primary `role`, and the user record may also contain `additional_roles`. The primary role determines the main dashboard and is the role used by the core `requireRole()` middleware. The frontend can display additional roles in its role switcher, but an additional role should not be assumed to grant access to an API unless the corresponding backend route explicitly supports it.

The main role categories are:

| Category | Role keys | Purpose |
|---|---|---|
| Platform | `super_admin` | Manages the Classgrid platform and all organizations |
| Organization administration | `org_admin` | Manages one institution, its settings, members, and organization data |
| Learners | `student` | Uses student learning, attendance, fees, exams, and academic features |
| Teaching staff | `teacher`, `faculty` | Manages teaching workflows, classrooms, attendance, grading, and course activity |
| Leadership | `principal`, `vice_principal`, `hod`, `coordinator` | Institution or department leadership workflows |
| Admissions | `admission_head`, `admission_verifier`, `admission_counselor`, `admission_clerk` | Application, document, counseling, and enrollment workflows |
| Fees and accounts | `fee_manager` | Fee structures, collection, and finance operations |
| Examinations | `exam_controller` | Exam administration, scheduling, and results workflows |
| Library | `library_manager` | Library inventory and circulation workflows |
| Placements | `tpo_officer` | Training, placement, and recruitment workflows |
| Transport and support | `transport_manager`, `counselor` | Transport logistics or student support workflows |

The roles available for invitation vary by organization type. The server maintains the role definitions and organization mappings in its centralized role utility. Current organization types include school, junior college, engineering, diploma, and coaching configurations.

### API Security

Protected routes normally use middleware in this order:

```js
router.get(
  "/protected-resource",
  isAuthenticated,
  requireRole("org_admin"),
  handler
);
```

The checks work as follows:

1. `isAuthenticated` obtains a token from the `Authorization: Bearer ...` header or the `token`/`jwt` cookie.
2. The JWT signature and expiry are checked with the server's `JWT_SECRET`.
3. The server loads the user from MongoDB and removes sensitive fields such as the password before placing the user on `req.user`.
4. The middleware checks account status, organization status, maintenance mode, global security locks, and recorded password-change invalidation data.
5. `requireRole(...roles)` obtains the effective role and allows the request only when it matches one of the route's required roles.
6. `requireOrganization` can be used to require an organization association. Super Admin and Organization Admin accounts bypass that specific association check.

If the check fails, the usual responses are:

| Situation | Response |
|---|---|
| No token | `401 Not authenticated` |
| Invalid or expired token | `401 Token invalid` |
| User no longer exists | `401 User no longer exists` |
| Role is not allowed | `403 Access denied` |
| User is inactive or organization is blocked | `403` with an account or organization status message |
| Platform maintenance mode | `503` for non-Super Admin users |
| Global security lock | `403` with code `GLOBAL_LOCK` |
| Organization is missing where required | `403` with code `NO_ORG` |

### Effective role and impersonation

The middleware supports controlled impersonation. During impersonation:

- `req.user` represents the account being viewed for data access.
- `req.realUser` identifies the real administrator.
- `getEffectiveRole(req)` returns the real administrator's role for permission checks.
- The response includes `X-Impersonation: true` so the frontend can show the impersonation state.

This prevents a user being granted or denied permissions based only on the account currently being viewed.

### Tenant and organization isolation

When a user signs in through an organization subdomain, the backend resolves that subdomain to an organization. The user must belong to that same organization. A valid password is not enough to sign in through another institution's tenant.

The JWT stores the organization as:

```json
{
  "id": "user-id",
  "role": "student",
  "organizationId": "organization-id"
}
```

The backend treats `organizationId` from the verified JWT as the authoritative effective organization ID for middleware checks. Controllers still scope database queries to the authenticated user's organization.

## Authentication Flow

### 1. Select the correct portal

Use the login route that matches the account type. For example:

```text
https://institution.classgrid.in/student/login
https://institution.classgrid.in/faculty/login
https://institution.classgrid.in/org/login
```

The frontend selects an authentication intent from the audience and role. Student and faculty requests use standard-user intent; institution administration requests use admin intent; platform accounts use Super Admin intent.

### 2. Optional email-first check

The frontend can first call:

```http
POST /api/auth/check-email
```

with:

```json
{
  "email": "user@example.edu"
}
```

For an existing account, the response identifies whether a password exists and returns the account role. For an unknown address, the server returns a non-authenticated response and may send a rate-limited security notification. This flow should not be used to reveal account details to other people.

### 3. Submit credentials

The password login endpoint is:

```http
POST /api/auth/login
```

The frontend sends the email, password, login intent, and selected portal context. A typical request contains fields similar to:

```json
{
  "email": "user@example.edu",
  "password": "your-password",
  "expectedLoginType": "standard",
  "loginTab": "student",
  "role": "student",
  "rememberMe": false
}
```

The backend:

- Normalizes the email to lowercase.
- Compares the password with the stored bcrypt hash.
- Applies failed-login tracking and temporary locking.
- Rejects a user who selected an incompatible portal or login type.
- Rejects suspended or blocked users.
- Checks maintenance and global security settings.
- Checks the user's organization status.
- Enforces tenant matching when the request came from an organization subdomain.
- Requires email verification unless the account was created as a trusted admin invitation or has another trusted state.

After five failed attempts, the account can be temporarily locked for five minutes. After several failed attempts, the response can show a password-reset hint.

### 4. Verify a new device when required

For a non-sandbox, non-internal account, a device fingerprint that is not already trusted can trigger email OTP verification. The login response then indicates:

```json
{
  "needsDeviceOtp": true
}
```

The OTP is six digits and expires after 60 seconds. The relevant endpoints are:

```http
POST /api/auth/request-login-otp
POST /api/auth/verify-device
POST /api/auth/resend-device-otp
```

The verification endpoint accepts the email and OTP. On success, the device fingerprint is added to the user's trusted devices and the normal login token is issued. OTP requests are rate-limited; repeated resend attempts can require a waiting period.

### 5. Issue the JWT and cookie

The token is signed with the server's `JWT_SECRET` and contains:

```json
{
  "id": "user-id",
  "role": "user-role",
  "organizationId": "organization-id-or-null"
}
```

Current token lifetimes are:

| Context | Lifetime |
|---|---:|
| Desktop default | 24 hours |
| Desktop with Remember Me | 7 days |
| Mobile app or mobile WebView detection | 365 days |

The server sets an `HttpOnly` `token` cookie. In production it also uses `Secure` and `SameSite=None`. For Classgrid subdomains, the production cookie can be scoped to `.classgrid.in` so it works across the platform's subdomains. Custom domains are not given the `.classgrid.in` cookie domain.

The successful JSON response also includes the token and user summary. The current frontend stores that token in `localStorage` and sends it through the API client when required.

### 6. Use the authenticated session

The frontend can load the current session from:

```http
GET /api/auth/me
```

This response includes the user's primary role, `additional_roles`, organization branding data, organization association, profile state, and whether a password reset is required.

Every protected request must continue to carry the session cookie or a valid bearer token. A frontend redirect alone never grants access.

### 7. Log out

Use:

```http
POST /api/auth/logout
```

The server clears the host-only token cookie and, in production, the `.classgrid.in` scoped token cookie. The client should also remove its locally stored token and return the user to the appropriate login page.

## Department User Creation

Organization Admins create staff and department accounts from the Members page:

```text
/org/admin/members
```

### Step 1: Load allowed invitation roles

The Members page requests:

```http
GET /api/hierarchy/roles?invitable=true
```

Only roles appropriate for the organization's configured type are returned. The `invitable=true` filter excludes `student`, `org_admin`, and `super_admin` from the manual staff invitation list.

### Step 2: Send the invitation

The Organization Admin submits:

```http
POST /api/org/invite-staff
```

with:

```json
{
  "name": "Example Staff Member",
  "email": "staff@example.edu",
  "role": "fee_manager",
  "department": "Finance"
}
```

The name, email, and role are required. The department is optional. The server scopes the new account to the Organization Admin's `organization_id`, rejects an email that already exists, creates the account as active and verified, and sets `mustResetPassword` so the invitee must establish a password.

The server generates an activation token and sends an invitation email. The activation link is intended to expire after 24 hours. The invitee should use the link, set a password of at least eight characters, and then sign in through the portal appropriate to the assigned role.

### Step 3: Track pending invitations

Pending staff accounts can be viewed with:

```http
GET /api/org/members/pending
```

An account is pending while `mustResetPassword` is true. After activation, it appears in the active member list:

```http
GET /api/org/members
```

The Organization Admin can resend an invitation:

```http
POST /api/org/members/{userId}/resend
```

or remove a member/invitation:

```http
DELETE /api/org/members/{userId}
```

An Organization Admin cannot remove their own account through this member endpoint.

### Password setup for invited users

An invited user whose `mustResetPassword` flag is true must set a password before normal dashboard access. The authenticated forced-reset endpoint is:

```http
POST /api/auth/force-reset-password
```

The minimum password length enforced by this endpoint is eight characters. After the password is set, the flag is cleared.

Students can also be created by enrollment and admission workflows. Those flows create a `student` account, associate it with the organization, and can require a password reset on first access. They are separate from the Organization Admin staff invitation flow.

## Troubleshooting Login Issues

### "Please use the correct portal"

The account role does not match the selected login tab or expected login type. Use the portal assigned to the account:

- Students use `/student/login`.
- Teaching staff use `/faculty/login`.
- Organization and department administrators use the relevant admin or department path.
- Super Admins use `/superadmin/login`.

The backend, not the URL alone, decides whether the login is allowed.

### `401 Not authenticated` or `Token invalid`

Check the following:

1. The browser still has the `token` cookie or the API client still has a valid bearer token.
2. The token has not expired.
3. The request is sending `Authorization: Bearer {token}` when cookie credentials are unavailable.
4. The user still exists and has not had the session invalidated by a recorded password change.

Sign out, clear the Classgrid token from browser storage, and sign in again. Do not copy a token into a support message.

### Account temporarily locked

Repeated incorrect passwords increment the login-attempt counter. After five failed attempts, the account can be locked for five minutes. Wait for the lock to expire or use the password-reset flow instead of repeatedly retrying.

### Device OTP does not arrive

Confirm that the email address is correct and check spam or quarantine folders. A new-device OTP expires after 60 seconds. Resend requests are rate-limited, so wait for the retry timer before requesting another code.

### The account is inactive, suspended, or blocked

The authentication middleware rejects accounts whose status is not active. It also rejects users whose organization is suspended or blocked. An Organization Admin should contact the platform administrator or support team rather than attempting to bypass the status check.

### Faculty or teacher is asked for an organization code

The login response can return `needsOrgCode: true` when a `faculty` or `teacher` account has no `organization_id`. Complete the organization-linking flow or ask the Organization Admin to provide the correct organization code. Do not use another institution's code.

### Invitation link is expired or already used

Ask the Organization Admin to use **Resend** for the pending member. The server generates a fresh activation token for the invitation. Make sure the invitee uses the newest email link.

### The platform reports maintenance or a security lock

Maintenance mode and the global security lock are enforced by the authentication middleware. Non-Super Admin users cannot bypass them. Wait for the platform administrator to restore access.

### Login works but an API returns `403 Access denied`

The session is authenticated, but the effective role is not allowed for that operation. Confirm the user's primary role, organization association, and the route's required roles. Adding a label in the frontend does not grant backend permission.

### Cookies fail on a custom domain

The `.classgrid.in` cookie domain is used only for Classgrid platform subdomains. A custom domain receives its own host-scoped cookie. Confirm that the browser accepts secure cookies over HTTPS and that the API client is configured to send credentials for the custom host.

## Security Checklist

- Use HTTPS in production.
- Use a strong, unique `JWT_SECRET` and keep it outside source control.
- Never log JWTs, passwords, OTPs, activation tokens, or raw reset links.
- Assign roles from `GET /api/hierarchy/roles?invitable=true` rather than typing role strings manually.
- Keep each user linked to the correct organization.
- Remove or suspend accounts promptly when staff leave the institution.
- Keep the Organization Admin emergency login path available during tenant or custom-domain changes.
- Treat `localStorage` tokens as sensitive because the current frontend stores the API token there in addition to the `HttpOnly` cookie.

