Base path: `/api/org` (mounted as org.routes.js)  
Source: `server/src/routes/org.routes.js` (3394 lines)  
Auth: All endpoints require `isAuthenticated` + `requireRole("org_admin")` unless noted.

---

## Configuration

### GET `/my-config`

Returns the full organization configuration.

**Controller:** `getMyOrganizationConfig`

---

### GET `/usage`

Returns organization usage summary (students, faculty, storage, etc.).

**Controller:** `getOrganizationUsageSummary`

---

### GET `/institution-profile`

Returns the institution-specific profile for frontend dashboards and workflows. Auto-resolves based on `org_type` / `structure_type`.

**Auth:** `isAuthenticated` + `requireOrganization` + `attachInstitutionProfile` middleware

**Response includes:**
```json
{
  "organization": { "id": "...", "name": "...", "org_type": "engineering", "structure_type": "..." },
  "dashboardVariant": "engineering",
  "terminology": {
    "institution": "Engineering College",
    "learner": "Student",
    "educator": "Faculty",
    "program": "Branch",
    "group": "Division",
    "identifier": "PRN"
  },
  "academicHierarchy": ["degree", "department", "year", "semester", "division", "batch"],
  "enabledModules": ["admissions", "fees", "attendance", "examinations", "library", "compliance", "placements"],
  "admissionProfile": {
    "mode": "engineering_cet_cap",
    "track": "cet",
    "enabledWorkflows": ["cet_import", "cap_rounds", "branch_merit", "seat_matrix", "document_review"]
  }
}
```

**Supported org types:** `school`, `junior_college`, `engineering`, `coaching`, `diploma`

---

## Domain Management

### PATCH `/domains`

Updates the list of allowed email domains for the organization.

**Request Body:**
```json
{
  "domains": ["college.edu", "university.ac.in"]
}
```

**Sanitization:** lowercase, trimmed, `@` stripped, deduplicated, empty strings removed.

**Response:**
```json
{
  "message": "Organization domains updated successfully",
  "allowed_domains": ["college.edu", "university.ac.in"]
}
```

**Audit:** `logAdminAction("update_domains")`

---

### PATCH `/type`

Updates the organization type.

**Request Body:**
```json
{
  "org_type": "SCHOOL"
}
```

**Validation:** Must be `"SCHOOL"` or `"COLLEGE"`.

---

## Staff Management

### POST `/invite-staff`

Invites a new faculty/dept admin. The user is created instantly as `verified` with `mustResetPassword: true`.

**Request Body:**
```json
{
  "name": "Prof. Desai",
  "email": "desai@college.edu",
  "role": "library_manager",
  "department": "Library"
}
```

**Workflow:**
1. Creates User with `verification_status: "verified"`, `mustResetPassword: true`
2. Generates 7-hour single-use activation token
3. Sends invitation email with activation link
4. Syncs onboarding progress
5. Tracks `staff_invited` onboarding event

**Available Roles:**
`admission_head`, `fee_manager`, `exam_controller`, `library_manager`, `hod`, `tpo_officer`, `transport_manager`, `coordinator`, `counselor`, `faculty`, `teacher`, `principal`, `vice_principal`, `admission_verifier`, `admission_counselor`, `admission_clerk`

**Response:**
```json
{
  "message": "Invitation sent successfully.",
  "user": { "_id": "...", "name": "Prof. Desai", "email": "desai@college.edu", "role": "library_manager" }
}
```

---

### POST `/request-role`

Self-serve role request using Tenant Join Code. Authenticated users can request roles; org admins can instantly grant them.

**Auth:** `isAuthenticated` (any role)

**Request Body:**
```json
{
  "tenant_join_code": "ABCD1234",
  "role": "library_manager",
  "email": "faculty@college.edu"
}
```

**Two flows:**
1. **Org Admin calling** → instant role assignment + email notification
2. **Normal user** → creates `RoleRequest` with `status: "pending"` + notifies org admin via email

**Blocked roles:** `student`, `org_admin`, `super_admin` cannot be requested.

---

### POST `/accept-role-request/:requestId`

Approves a pending role request. Adds role to user's `additional_roles` array.

**Response:** `{ "message": "Role request approved." }`

**Emails:** "Access Approved" notification to the requester with a welcome link.

---

### POST `/reject-role-request/:requestId`

Rejects a pending role request.

**Request Body:**
```json
{
  "reason": "This role is not available for your department."
}
```

**Emails:** "Access Request Declined" notification with optional reason.

---

### GET `/members`

Returns all activated staff members (non-student, non-admin roles). Dynamically resolves available roles based on org type.

**Query Params:** `search` (name/email), `role` (filter by specific role)

**Response:**
```json
{
  "members": [
    { "_id": "...", "name": "Prof. Desai", "email": "...", "role": "library_manager", "department": "Library", "status": "active", "createdAt": "...", "profilePicture": "..." }
  ],
  "total": 5
}
```

---

### GET `/members/pending`

Returns invited but unactivated staff (`mustResetPassword: true`).

---

### DELETE `/members/:userId`

Removes a staff member. Cannot remove yourself.

---

### POST `/members/:userId/resend`

Resends activation email to a pending member. Regenerates 7-hour token.

---

## Billing (Org-Scoped)

### GET `/billing`

Returns the organization's billing information.

**Controller:** `getOrganizationBilling`

---

### PUT `/billing/settings`

Updates billing settings for the organization.

**Controller:** `updateOrganizationBillingSettings`

---

### POST `/billing/verify-email/send`

Sends billing email verification OTP.

---

### POST `/billing/verify-email/confirm`

Confirms billing email with OTP.

---

### POST `/billing/verify-phone/send`

Sends billing phone OTP.

---

### POST `/billing/verify-phone/confirm`

Confirms billing phone with OTP.

---

### GET `/billing/invoice/:invoiceId/pdf`

Downloads an invoice PDF.

**Controller:** `downloadInvoicePdf`

---

## Dashboard APIs

### GET `/dashboard`

Basic org admin dashboard. Returns org name, plan, allowed domains, status.

---

### GET `/dashboard/overview`

Returns org-scoped counts.

**Response:**
```json
{
  "totalFaculty": 12,
  "totalStudents": 450,
  "totalClassrooms": 24,
  "totalMemberships": 1200
}
```

`totalMemberships` is fetched from Supabase `classroom_memberships` table.

---

### GET `/dashboard/billing`

Vercel-style Pay-As-You-Go billing dashboard with charts.

**Controller:** `getOrgAdminBillingDashboard`

---

### POST `/dashboard/billing/razorpay-order`

Creates a Razorpay order for SaaS invoice payment.

**Controller:** `createSaasInvoiceOrder`

---

### POST `/dashboard/billing/razorpay-verify`

Verifies Razorpay payment for SaaS invoice.

**Controller:** `verifySaasInvoicePayment`

---

### GET `/dashboard/analytics`

MongoDB-aggregated analytics for charts.

**Response:**
```json
{
  "demographics": [
    { "name": "Student", "value": 450, "color": "hsl(var(--primary))" },
    { "name": "Faculty", "value": 12, "color": "hsl(var(--accent))" }
  ],
  "branchDistribution": [
    { "branch": "Computer Science", "students": 120 },
    { "branch": "Mechanical", "students": 80 }
  ],
  "enrollmentTrends": [
    { "month": "Jul 26", "newUsers": 45 },
    { "month": "Aug 26", "newUsers": 23 }
  ]
}
```

---

### GET `/dashboard/users`

Paginated user list with search, role, batch, and branch filters.

**Query Params:** `page`, `limit` (max 100), `role`, `search`, `batch`, `branch`

**Response:**
```json
{
  "users": [...],
  "pagination": { "page": 1, "limit": 20, "total": 450, "totalPages": 23 }
}
```

---

### GET `/dashboard/classrooms`

All classrooms in the organization with teacher info.

---

### GET `/dashboard/classrooms/:id/members`

Students and faculty in a specific classroom. Students fetched from Supabase `classroom_memberships`, enriched with MongoDB user data.

---

### GET `/dashboard/activity`

Recent membership activity (joins) across org classrooms.

**Query Params:** `limit` (max 50, default 10)

---

### GET `/users/export`

CSV download of org users.

**Query Params:** `role` (optional filter)

**Headers:** `Content-Type: text/csv`, `Content-Disposition: attachment`

**CSV columns:** Name, Email, Role, Status, Profile Complete, PRN, Branch, Batch, Department, Created At

---

## Academic Configuration

### GET `/academic-config`

Returns academic config (identifier label, PRN settings, batches, branches).

**Response:**
```json
{
  "academic_config": {
    "identifierLabel": "PRN",
    "prnRequired": true,
    "prnLocked": false,
    "batches": ["2024-25", "2025-26"],
    "branches": ["Computer Science", "Mechanical"]
  }
}
```

---

### PUT `/academic-config`

Updates academic config.

**Request Body:**
```json
{
  "identifierLabel": "PRN",
  "prnRequired": true,
  "prnLocked": false,
  "batches": ["2024-25", "2025-26"],
  "branches": ["Computer Science", "Mechanical"],
  "requiredFields": { "prn": true, "batch": true, "branch": true },
  "idCardFields": ["prn", "rollNo"]
}
```

**Validation:** `identifierLabel` must be `"PRN"`, `"Roll No"`, or `"Enrollment No"`.

---

## Academic Years

### GET `/academic-years`

Returns all academic years for the org from Supabase `academic_years` table.

---

### POST `/academic-years`

Creates or updates an academic year.

**Request Body:**
```json
{
  "name": "2026-27",
  "start_date": "2026-06-01",
  "end_date": "2027-05-31",
  "is_active": true
}
```

---

## Bulk Actions

### POST `/bulk-suspend`

Bulk suspend or reactivate users (max 50 at a time). Cannot target org admins.

**Request Body:**
```json
{
  "userIds": ["id1", "id2", "id3"],
  "action": "suspend"
}
```

---

### POST `/bulk-role-update`

Bulk role change (max 50). Target role must be `"student"` or `"faculty"`.

**Request Body:**
```json
{
  "userIds": ["id1", "id2"],
  "newRole": "faculty"
}
```

---

### POST `/change-role`

Single user role change with email notification.

**Request Body:**
```json
{
  "userId": "<ObjectId>",
  "newRole": "faculty"
}
```

---

## Pending Invites

### GET `/pending-invites`

Returns faculty who haven't activated yet.

---

### POST `/resend-invite`

Resends activation email for a specific user.

**Request Body:**
```json
{
  "userId": "<ObjectId>"
}
```

---

## Helpdesk / Communication Center

### GET `/helpdesk/threads`

Lists all support conversations for the org.

### POST `/helpdesk/threads`

Creates a new support conversation.

### GET `/helpdesk/threads/:threadId`

Gets a specific support thread with messages.

### POST `/helpdesk/threads/:threadId/messages`

Sends a message in a support thread.

### PATCH `/helpdesk/threads/:threadId/read`

Marks a support thread as read.

---

## Audit Logging

All write operations call `logAdminAction()` which records:
- `action` — e.g., `invite_staff`, `update_domains`, `remove_member`
- `targetType` — e.g., `user`, `organization`
- `targetId` — the affected entity ID
- `targetLabel` — human-readable name
- `metadata` — action-specific context
