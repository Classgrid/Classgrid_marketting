Classgrid's Admission System supports **two admission tracks** running in parallel:

1. **CET Track** — For institutions accepting students via Maharashtra CET (Common Entrance Test) allotment through CAP rounds
2. **Direct Track** — For institutions running their own admission process (merit-based or first-come-first-served)

The system spans 24+ development phases (Day 1 through Day 24) with features including application forms, document verification, merit generation, seat allocation, CET allotment import, government exports, parent tracking, and live broadcast projectors.

---

## Admission Tracks & Middleware

Two track-specific middlewares enforce which endpoints are available:
- `requireCETTrack` — only allows access if the org's admission config has CET mode enabled
- `requireDirectTrack` — only allows access for direct admission workflows

---

## Public Authentication (No Login Required)

### CET Track Authentication

Students allotted via CET authenticate using their Enrollment Number (EN):

1. **Validate EN:** `POST /api/admissions/cet/validate-en` — checks if the EN exists in the `CETAllotment` records imported by the admin
2. **Send OTP:** `POST /api/admissions/cet/send-otp` — sends OTP to the phone/email linked to the EN (rate-limited via `otpSendLimiter`)
3. **Verify OTP:** `POST /api/admissions/cet/verify-otp` — validates OTP, issues a session token (rate-limited via `loginLimiter`)

### Direct Track Authentication

Students applying directly authenticate via:
- **Phone OTP:** `POST /api/admissions/verify-phone` — Firebase phone OTP verification
- **Email OTP:** `POST /api/admissions/send-email-otp` → `POST /api/admissions/verify-email-otp`

---

## Application Process

### Save Draft

**API:** `POST /api/admissions/save-draft`  
**Auth:** `isAdmissionCandidate` (session token from OTP verification)

Saves partial application data so candidates can return and complete later.

### Submit Application

**API:** `POST /api/admissions/submit`  
**Auth:** `isAdmissionCandidate`

Finalizes and locks the application. After submission, the application enters the verification pipeline.

### Direct Apply (Public)

**API:** `POST /api/admissions/apply`  
**Auth:** Public (rate-limited via `admissionApplyLimiter`)  
**Track:** Direct only

Dynamic application endpoint that validates fields based on the org's `structure_type` (school vs college vs university).

---

## Document Management

### Candidate-Facing

- **Get Required Docs Checklist:** `GET /api/admissions/docs/checklist` — returns list of required documents based on `AdmissionConfig`
- **Upload Document:** `POST /api/admissions/docs/upload` — uploads a single document (max 5MB, multer memory storage) to Supabase storage
- **View Document:** `GET /api/admissions/candidate/docs/view` — returns a signed URL for viewing

### Admin-Facing

- **Verify Document:** `PATCH /api/admissions/admin/verify-doc` — marks a document as verified/rejected
- **Validate Expiry:** `POST /api/admissions/docs/validate-expiry` — checks document validity dates
- **View Document:** `GET /api/admissions/docs/view` — admin version with auth check

**Roles for verification:** `org_admin`, `admission_head`, `admission_verifier`

---

## Admin Configuration

**API:** `GET /api/admissions/config` | `PATCH /api/admissions/config`  
**Roles:** `org_admin`, `admission_head`

The `AdmissionConfig` model controls:
- Which fields are required on the application form
- Which documents are mandatory
- Admission cycle dates
- Fee amounts
- Seat capacity per program

### Presets & Master Pools

- **Inject Preset:** `POST /api/admissions/config/preset` — loads a pre-configured template (e.g., "Engineering College" preset)
- **Master Field Pool:** `GET /api/admissions/master-field-pool` — returns all available form fields
- **Master Document Pool:** `GET /api/admissions/master-document-pool` — returns all available document types

---

## Merit Engine & Selection

### Generate Merit List

**API:** `POST /api/admissions/direct/generate-merit`  
**Roles:** `org_admin`, `admission_head`

Processes all submitted applications and ranks them based on configured criteria (marks, category, etc.).

### View Merit List

**API:** `GET /api/admissions/direct/merit-list`  
**Roles:** `org_admin`, `admission_head`, `admission_counselor`

### Live Merit List (Public, Cached)

**API:** `GET /api/admissions/merit-list/live`  
**Auth:** Public (rate-limited via `admissionLiveMeritLimiter`, cached 5 seconds)

Optimized for display on projector screens during admission rounds.

---

## Admin Operations

### Application Management

- **List Applications:** `GET /api/admissions/applications` — all roles in `requireAdmissionRole`
- **Update Stage:** `PATCH /api/admissions/applications/:id/stage` — move application through pipeline stages
- **Bulk Verify:** `POST /api/admissions/admin/bulk-verify` — batch document verification
- **Bulk Select:** `POST /api/admissions/admin/bulk-select` — batch selection of candidates
- **Merge Applications:** `POST /api/admissions/applications/merge` — merge duplicate applications
- **Print Application:** `GET /api/admissions/print/application/:id` — generates printable application data
- **Unlock/Lock Edit:** `PATCH /api/admissions/applications/:id/unlock-edit` | `lock-edit` — per-student edit window control

### Enrollment

- **Admin Enroll:** `POST /api/admissions/admin/enroll` — manual enrollment by admin
- **Full Enroll:** `POST /api/admissions/enroll` — complete workflow: Application → User Account + PRN + Welcome Email
- **Desk Enroll:** `POST /api/admissions/desk-enroll` — walk-in fast-path, no OTP needed

**Roles:** `org_admin`, `admission_head`, `admission_clerk`

### Division & PRN

- **Allocate Divisions:** `POST /api/admissions/allocate-divisions` — auto-assigns students to divisions
- **Batch Generate PRNs:** `POST /api/admissions/generate-prns` — bulk PRN generation

---

## CET-Specific Operations

- **Import CET Allotments:** `POST /api/admissions/cet/import` — CSV upload of CET allotment data
- **Allot Division for CET:** `PATCH /api/admissions/cet/:en/allot-division`
- **Mark CET Upgraded:** `PATCH /api/admissions/cet/:en/mark-upgraded` — for CAP round upgrades
- **Report RLA:** `POST /api/admissions/cet/:en_number/report` — Report Left After (student didn't report)
- **Request NOC:** `POST /api/admissions/cet/:en_number/request-noc` — No Objection Certificate
- **Confirm Upgrade:** `POST /api/admissions/cet/:en_number/confirm-upgrade`
- **CET Dashboard:** `GET /api/admissions/cet/dashboard` — CET-specific analytics
- **Advance Round:** `POST /api/admissions/round/advance` — advance to next admission round

---

## Broadcast & Live Projector

For live admission events (e.g., counseling rounds with projector display):

- **Live Merit List:** `GET /api/admissions/broadcast/merit-list/:hierarchyId`
- **Live Seat Matrix:** `GET /api/admissions/broadcast/seat-matrix`
- **Call Candidate:** `POST /api/admissions/broadcast/call-candidate` — announces candidate's name/token on projector

**Roles for calling:** `org_admin`, `admission_head`, `admission_counselor`

---

## ACAP (Admission Counseling & Allotment Process)

- **Register:** `POST /api/admissions/acap/register` — public registration
- **Generate Merit:** `POST /api/admissions/acap/generate-merit`
- **Verify Gate Entry:** `POST /api/admissions/acap/verify-gate` — QR/token-based gate check

---

## Payment Integration

- **Initiate Fee Payment:** `POST /api/admissions/pay/initiate` — creates Razorpay/Easebuzz order for admission fee
- **Verify Payment:** `POST /api/admissions/pay/verify` — confirms payment via signature verification
- **Webhook:** `POST /api/admissions/payments/webhook` — public endpoint verified via payment gateway signature

---

## Parent Tracking Portal

Parents can track their child's admission status without a platform account:

- **Parent Login:** `POST /api/admissions/parent/login` — authenticates via application ID + phone (rate-limited)
- **Check Status:** `GET /api/admissions/parent/status/:applicationId` — returns current application stage
- **View Documents:** `GET /api/admissions/parent/documents/:applicationId` — returns uploaded document list

**Auth:** `isParent` middleware (session-based after parent login)

---

## Government CSV Exports

- **DTE Export:** `GET /api/admissions/export/dte`
- **SARAL Export:** `GET /api/admissions/export/saral`
- **AICTE Export:** `GET /api/admissions/export/aicte`
- **State Board Export:** `GET /api/admissions/export/state-board`

**Roles:** `org_admin`, `admission_head`

---

## Notifications & SMS

- **Send Notification:** `POST /api/admissions/notify` — sends SMS/email/push to candidates
- **SMS Budget:** `GET /api/admissions/sms-budget` — check remaining SMS credits

---

## Waitlist & Scholarships

- **Promote Waitlist:** `POST /api/admissions/admin/waitlist/promote`
- **Import Scholarships:** `POST /api/admissions/admin/scholarship/bulk-import` — CSV upload

---

## Withdrawal

- **Admin Withdraw:** `POST /api/admissions/applications/:id/withdraw`
- **Candidate Self-Withdraw:** `POST /api/admissions/candidate/withdraw/:id`

---

## Admission Role System

The admission module uses `requireAdmissionRole` middleware with these roles:

| Role | Description |
|---|---|
| `org_admin` | Full access to all admission operations |
| `admission_head` | Manages merit, selection, enrollment, exports |
| `admission_counselor` | Views applications, merit lists, broadcasts |
| `admission_clerk` | Desk enrollment, basic data entry |
| `admission_verifier` | Document verification, CET verification |

---

## Key Models

| Model | Purpose |
|---|---|
| `AdmissionApplication` | Individual student application with all form data |
| `AdmissionConfig` | Per-org admission settings (fields, docs, cycles) |
| `AdmissionOTP` | OTP records for admission authentication |
| `Lead` | CRM lead tracking (pre-application interest) |
| `SeatConfig` | Seat capacity per program/category |
| `CETAllotment` | Imported CET allotment records |
