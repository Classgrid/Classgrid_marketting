# COACHING ADMISSION ENGINE
> Backend-verified module specification for Classgrid  
> Scope: `org_type = coaching` with `structure_type = coaching`  
> Validation rule: written only after manually reading plans plus backend models, routes, controllers, middleware, and services

This document is written from the reviewed planning documents and backend code. No unsupported marketing claims are included. No separate coaching-only admission plan file was identified in the reviewed docs, so this module is derived from the master plan, the generic admission plan, and the backend implementation.

---

## 1. Review Basis

### Planning documents reviewed

- `CLASSGRID_ULTIMATE_PLAN.md`
- `docs/CLASSGRID_MASTER_IMPLEMENTATION_PLAN.md`
- `docs/CLASSGRID_ADMISSION_PLAN.md`
- `docs/CLASSGRID_CET_ADMISSION_PLAN.md`
- `docs/CLASSGRID_SCHOOL_ADMISSION_PLAN.md`
- `docs/plan/ADMISSION_ENGINE_SCHEDULE.md`
- `docs/artifacts/implementation_plan.md`

### Backend files reviewed

#### Models

- `server/src/models/Organization.js`
- `server/src/models/AdmissionApplication.js`
- `server/src/models/AdmissionConfig.js`
- `server/src/models/AdmissionOTP.js`
- `server/src/models/SeatConfig.js`
- `server/src/models/AcademicHierarchy.js`
- `server/src/models/User.js`
- `server/src/models/FeeStructure.js`
- `server/src/models/StudentFeeLedger.js`
- `server/src/models/FeeTransaction.js`

#### Routes

- `server/src/routes/admission.routes.js`

#### Controllers

- `server/src/controllers/admission.controller.js`
- `server/src/controllers/admission-operations.controller.js`
- `server/src/controllers/admission-config.controller.js`
- `server/src/controllers/admission-broadcast.controller.js`

#### Middleware

- `server/src/middleware/admission-auth.middleware.js`
- `server/src/middleware/admission-roles.middleware.js`
- `server/src/middleware/auth.middleware.js`

#### Admission services

- `server/src/services/admissions/strategy-selector.js`
- `server/src/services/admissions/admission-form-builder.service.js`
- `server/src/services/admissions/admission-workflow.service.js`
- `server/src/services/admissions/division-allocator.service.js`
- `server/src/services/admissions/merit-engine.service.js`
- `server/src/services/admissions/document-validity.service.js`
- `server/src/services/admissions/duplicate-detector.service.js`
- `server/src/services/admissions/seat-matrix.service.js`
- `server/src/services/admissions/waitlist.service.js`
- `server/src/services/admissions/govt-export.service.js`
- `server/src/services/admissions/admission-notification.service.js`
- `server/src/services/admissions/admission-printout.service.js`
- `server/src/services/admissions/scholarship.service.js`
- `server/src/services/admissions/workflow.service.js`
- `server/src/services/admissions/admission-automation.service.js`

#### Supporting services

- `server/src/services/storage.service.js`
- `server/src/services/razorpay.service.js`
- `server/src/services/firebase.service.js`
- `server/src/services/socket.service.js`

---

## 2. Module Scope

This coaching module is the non-CET direct admission path for coaching organizations such as JEE, NEET, MHT-CET, or similar course-and-batch institutes. In the reviewed backend, the coaching engine is represented by:

- `Organization.org_type = "coaching"`
- `Organization.structure_type = "coaching"`
- `Organization` comments explicitly map coaching to `Plan 4`
- `AcademicHierarchy` comments explicitly define the coaching tree as `Course -> Batch`

The coaching strategy in `strategy-selector.js` is currently:

| Field | `coaching` |
|---|---|
| `auth_method` | `phone_otp` |
| `ranking_type` | `fcfs_or_entrance` |
| `seat_types` | `REGULAR`, `DISCOUNT`, `EARLY_BIRD` |
| `entry_modes` | `PORTAL`, `DESK` |
| `workflow_variant` | `fast_track` |
| `requires_printout` | `true` |
| `govt_exports` | none |

---

## 3. Database Architecture

### 3.1 Organization-level coaching admission configuration

The coaching engine is primarily governed by `Organization.admission_config`.

| Path | Type | Verified purpose in backend |
|---|---|---|
| `admission_config.is_portal_open` | `Boolean` | Master gate for coaching applications and phone verification |
| `admission_config.registration_fee` | `Number` | Registration fee configuration |
| `admission_config.instructions` | `String` | Portal guidance text |
| `admission_config.application_config.document_validity_days` | object | Document age limits checked during upload |
| `admission_config.enrollment_config.editable_until` | `Date` | Deadline for edits and uploads |
| `admission_config.admission_round.current_round` | `Number` | Multi-round tracking field |
| `admission_config.admission_round.max_rounds` | `Number` | Maximum round count |
| `admission_config.admission_round.round_history[]` | array | Historic round snapshots |
| `admission_config.seat_matrix_policy` | object | Quota/category policy storage |
| `admission_config.tie_breaker_rules[]` | array | Tie-break storage |
| `admission_config.waitlist_and_deadlines` | object | Waitlist and deadline config storage |
| `admission_config.form_builder_config.field_toggles[]` | array | Field toggles for the coaching form |
| `admission_config.form_builder_config.document_toggles[]` | array | Document toggles |
| `admission_config.form_builder_config.custom_fields[]` | array | Org-defined custom coaching fields |
| `admission_config.fee_config` | object | Fee and refund policy storage |

### 3.2 Strategy defaults for coaching forms

`strategy-selector.js` contains `ORG_TYPE_DEFAULTS.coaching`, which pre-enables a lightweight coaching form.

Default coaching fields in that file are:

- `first_name`
- `middle_name`
- `last_name`
- `full_name`
- `dob`
- `gender`
- `blood_group`
- `mobile_number`
- `primary_email`
- `father_name`
- `mother_name`
- `religion`
- `mother_tongue`
- `caste`
- `permanent_address`
- `permanent_state`
- `permanent_city`
- `permanent_pincode`
- `aadhar_number`
- `10th_percentage`
- `previous_school`
- `course_selected`
- `batch_preferred`

Default coaching documents in that file are:

- `student_aadhar`
- `passport_size_photo`
- `10th_marksheet`

Important technical note:

- the master field pool also contains `discount_code` and `referral_code`
- those keys exist in the universal form system
- they are not part of the default coaching-enabled set

### 3.3 Core applicant record

Each coaching applicant is stored in `AdmissionApplication`.

| Field | Type | Coaching relevance |
|---|---|---|
| `organization_id` | `ObjectId` | Tenant boundary |
| `hierarchy_id` | `ObjectId` | Links to a coaching course or batch node |
| `entry_mode` | enum | `PORTAL` or `DESK` are the coaching-relevant direct modes |
| `status` | enum | Lifecycle state |
| `phone` | `String` | Main identity field for phone-OTP entry |
| `email` | `String` | Contact field |
| `credentials.verified_main_email` | `String` | Optional verified login email |
| `credentials.is_email_verified` | `Boolean` | Email-verified marker |
| `full_name` | `String` | Applicant name |
| `dob` | `Date` | Date of birth |
| `form_data` | mixed nested object | Main coaching form payload |
| `documents[]` | array | Uploaded proofs and scans |
| `merit_score` | `Number` | Used if the generic merit engine is applied |
| `category` | `String` | Category input when used |
| `seat_type` | `String` | Can carry `REGULAR`, `DISCOUNT`, or `EARLY_BIRD` style values |
| `waitlist_number` | `Number` | Waitlist ordering |
| `stage_history[]` | array | Stage movement audit trail |
| `fee_paid` | `Boolean` | Payment completion flag |
| `payment_details` | object | Declared schema for payment data |
| `student_id` | `ObjectId` | Linked final `User` record |
| `printout_generated` | `Boolean` | Printout generation flag |
| `printout_url` | `String` | Generated application printout location |

### 3.4 Academic structure and seat matrix

Coaching hierarchy and capacity use `AcademicHierarchy` and `SeatConfig`.

| Model | Verified coaching use |
|---|---|
| `AcademicHierarchy` | Supports `course` and `batch` nodes; comments define the coaching tree explicitly |
| `SeatConfig` | Holds intake and quota capacities by `hierarchy_id` and `academic_year` |

### 3.5 Identity and enrollment target

| Model | Verified coaching use |
|---|---|
| `AdmissionOTP` | Stores email OTPs and related verification records |
| `User` | Final Classgrid ERP account after enrollment with `role`, `organization_id`, `phoneNumber`, and manual-auth credentials |

### 3.6 Fee subsystem touched by coaching admissions

| Model | Verified role |
|---|---|
| `FeeStructure` | Fee amount source |
| `StudentFeeLedger` | Created after successful fee processing |
| `FeeTransaction` | Payment transaction record |

### 3.7 Document storage subsystem

`storage.service.js` uploads coaching admission documents to:

- Bucket: `admission-documents`
- Path pattern: `admissions/{organization_id}/{application_id}/{uuid}.{ext}`
- View access: signed URL generation through `getSignedUrl(path, expiresIn)`

---

## 4. Route Surface For The Coaching Module

### 4.1 Public and candidate routes

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `POST` | `/api/admission/verify-phone` | none | Verify Firebase phone token and issue admission candidate JWT |
| `POST` | `/api/admission/send-email-otp` | none | Send email OTP for login email verification |
| `POST` | `/api/admission/verify-email-otp` | none | Validate email OTP |
| `POST` | `/api/admission/save-draft` | none | Save draft coaching application |
| `POST` | `/api/admission/submit` | none | Final submit via candidate session |
| `POST` | `/api/admission/apply` | none | Public one-shot coaching apply route |
| `GET` | `/api/admission/docs/checklist` | none | Candidate document checklist |
| `POST` | `/api/admission/docs/upload` | none | Candidate document upload |
| `GET` | `/api/admission/candidate/docs/view` | query `path` | Signed document-view link |
| `POST` | `/api/admission/pay/initiate` | none | Start fee order |
| `POST` | `/api/admission/pay/verify` | none | Verify payment callback from candidate session |
| `POST` | `/api/admission/candidate/withdraw/:id` | `:id` | Candidate withdrawal route |

### 4.2 Parent routes

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `POST` | `/api/admission/parent/login` | none | Parent login by Firebase phone token |
| `GET` | `/api/admission/parent/status/:applicationId` | `:applicationId` | Parent-facing status timeline |
| `GET` | `/api/admission/parent/documents/:applicationId` | `:applicationId` | Parent document list |

### 4.3 Admin routes relevant to coaching

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `GET` | `/api/admission/config` | none | Fetch coaching admission config |
| `PATCH` | `/api/admission/config` | none | Replace coaching admission config |
| `POST` | `/api/admission/config/preset` | none | Inject base preset |
| `PATCH` | `/api/admission/admin/verify-doc` | none | Verify or reject uploaded document |
| `POST` | `/api/admission/desk-enroll` | none | Walk-in coaching admission path |
| `POST` | `/api/admission/direct/generate-merit` | none | Persist normalized merit scores through the generic merit engine |
| `GET` | `/api/admission/direct/merit-list` | query `hierarchy_id`, `category`, `seat_type`, `gender`, `page`, `limit` | Admin merit dashboard feed |
| `POST` | `/api/admission/applications/merge` | none | Merge duplicate applications |
| `POST` | `/api/admission/notify` | none | Send email/SMS/push notifications |
| `GET` | `/api/admission/sms-budget` | none | SMS budget tracker |
| `GET` | `/api/admission/analytics` | query `hierarchy_id` | Funnel analytics |
| `POST` | `/api/admission/enroll` | none | Final enrollment and `User` creation |
| `PATCH` | `/api/admission/applications/:id/stage` | `:id` | Manual stage update |
| `POST` | `/api/admission/admin/bulk-verify` | none | Bulk set verified status |
| `POST` | `/api/admission/admin/bulk-select` | none | Bulk move selected candidates toward fee stage |
| `POST` | `/api/admission/round/advance` | none | Advance admission round |
| `PATCH` | `/api/admission/applications/:id/unlock-edit` | `:id` | Unlock one application |
| `PATCH` | `/api/admission/applications/:id/lock-edit` | `:id` | Re-lock one application |

### 4.4 Broadcast routes

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `GET` | `/api/admission/broadcast/merit-list/:hierarchyId` | `:hierarchyId` | Live ranked list by hierarchy |
| `GET` | `/api/admission/broadcast/seat-matrix` | none | Live seat matrix |
| `POST` | `/api/admission/broadcast/call-candidate` | none | Mark candidate as called and broadcast |
| `GET` | `/api/admission/merit-list/live` | query `org_id`, `hierarchy_id`, `category`, `limit` | Public cached live merit list |

### 4.5 Export reality

The coaching strategy advertises:

- `govt_exports = []`

That aligns with the reviewed route/service layer:

- no coaching-specific government export route was found
- the implemented exports are only `dte`, `saral`, and `aicte`

---

## 5. Verified Backend Logic

### 5.1 Coaching entry styles

The reviewed backend exposes three direct-flow entry styles that apply to coaching:

1. Candidate session flow:
   - `POST /verify-phone`
   - `POST /save-draft`
   - `POST /submit`

2. Public apply flow:
   - `POST /apply`

3. Walk-in desk flow:
   - `POST /desk-enroll`

### 5.2 Fast-track workflow variant

The strategy table defines `coaching.workflow_variant = "fast_track"`.

The fast-track transition map in `admission-workflow.service.js` is:

```text
draft
  -> applied
applied
  -> fee_pending
  -> withdrawn
  -> waitlisted
fee_pending
  -> enrolled
  -> withdrawn
waitlisted
  -> applied
  -> withdrawn
enrolled
  -> withdrawn
```

Important technical meaning:

- coaching does not follow the standard `under_verification -> verified -> fee_pending` chain
- the fast-track map allows `applied -> fee_pending`
- document verification endpoints still exist in the router, but the standard document gate is not what drives the coaching state machine

### 5.3 Course and batch structure

The data model for coaching is course-and-batch oriented:

- `AcademicHierarchy.level_type = "course"`
- `AcademicHierarchy.level_type = "batch"`

The reviewed hierarchy comments define the intended tree as:

```text
Course -> Batch
```

This is different from:

- school: `Standard -> Division`
- junior college: `Stream -> Standard -> Division`

### 5.4 Ranking and merit reality

The strategy metadata says:

- `ranking_type = "fcfs_or_entrance"`

What is actually present in backend is more generic:

- admin merit routes exist through `POST /direct/generate-merit` and `GET /direct/merit-list`
- the shared merit engine reads flat fields like `10th_board`, `10th_percentage`, `previous_percentage`, `cet_score`, or stored `merit_score`
- sorting is `normalized_score` descending, then `createdAt` ascending as a tie-break

Board normalization multipliers in `merit-engine.service.js` are:

| Board | Multiplier |
|---|---|
| `SSC` | `1.00` |
| `CBSE` | `0.95` |
| `ICSE` | `0.93` |
| `IB` | `0.92` |
| `IGCSE` | `0.94` |
| `STATE` | `1.00` |
| `NIOS` | `1.02` |

So the verified backend reality is:

- coaching has generic merit/ranking tooling available
- no separate coaching-only entrance-test ranking service was found
- no dedicated first-come-first-served queue service was found beyond normal application timestamps and workflow order

### 5.5 Documents and printout generation

The reviewed document path supports:

- upload to Supabase Storage
- status values `pending`, `verified`, `rejected`
- optional issue-date validity checking
- signed URL viewing

The coaching strategy also sets:

- `requires_printout = true`

And `applyForAdmission()` does attempt to generate a printout through `admission-printout.service.js` when that flag is enabled.

### 5.6 Seat and waitlist behavior

Coaching admissions reuse the generic seat engine:

1. `seat-matrix.service.js`
   - atomic seat claim
   - atomic seat release
   - broadcast to `org_{orgId}_admission`

2. `waitlist.service.js`
   - waitlist promotion when vacancy opens
   - quota count updates in `SeatConfig`

### 5.7 Email verification, Classgrid account creation, and password setup

Credential setup is split into stages:

1. Candidate phone verification:
   - `POST /api/admission/verify-phone`
2. Optional email verification:
   - `POST /api/admission/send-email-otp`
   - `POST /api/admission/verify-email-otp`
3. During `submitApplication()`, the session may send `verified_main_email`.
4. If sent, the application stores:
   - `credentials.verified_main_email`
   - `credentials.is_email_verified = true`
5. Final Classgrid `User` creation happens only during:
   - `POST /api/admission/enroll`
   - handler: `fullEnrollStudent()`
6. The chosen login email is resolved in this order:
   - `application.credentials.verified_main_email`
   - `application.email`
   - ``${application.phone}@admission.classgrid.in``
7. The password is supplied in the enrollment request body and hashed with `bcrypt`.
8. The resulting `User` is created with:
   - `role = "student"`
   - `isEmailVerified = true`
   - `linkedProviders = ["manual"]`
9. The backend then emails the credentials after successful enrollment.

### 5.8 Desk enrollment versus final ERP enrollment

`deskEnroll()` is a real coaching-relevant fast path, but it is not the same thing as final ERP account creation.

Verified behavior:

- `deskEnroll()` creates an `AdmissionApplication`
- it sets `entry_mode = "DESK"`
- it stores walk-in metadata like `desk_enrollment`, `fee_mode`, `fee_amount`, and `receipt_number`
- it marks the application as `enrolled`
- it sets `fee_paid = true`
- it may allocate a seat if `hierarchy_id` is provided
- it does **not** create the final `User` account

So if the institute wants an actual Classgrid student login, `fullEnrollStudent()` is still the backend path that creates it.

### 5.9 Notifications and live updates

The notification service supports:

- email via Brevo
- SMS via Fast2SMS
- push via Firebase FCM

The reviewed trigger templates include:

- `APPLICATION_RECEIVED`
- `APPLICATION_UNDER_REVIEW`
- `DOCUMENTS_VERIFIED`
- `DOCUMENTS_REJECTED`
- `MERIT_LIST_PUBLISHED`
- `SELECTED`
- `WAITLISTED`
- `FEE_PAYMENT_PENDING`
- `ENROLLED`
- `WITHDRAWN`

Socket room:

```text
org_{orgId}_admission
```

Broadcast event:

```text
ADMISSION_LIVE_UPDATE
```

---

## 6. Plan vs Current Backend Reality

### 6.1 Verified coaching capabilities present in backend

| Capability | Plan expectation | Current backend reality |
|---|---|---|
| Separate coaching module boundary | Required | Present via `org_type = coaching` and `structure_type = coaching` |
| Course-and-batch hierarchy | Required | Present in `AcademicHierarchy` as `course -> batch` |
| Phone OTP entry | Required | Present through Firebase phone token verification |
| Email OTP support | Required for credential setup | Present through `send-email-otp` and `verify-email-otp` |
| Fast-track workflow | Required | Present through `workflow_variant = fast_track` |
| Printout generation flag | Required | Present through `requires_printout = true` and printout generation call in `applyForAdmission()` |
| Document upload and signed URLs | Required | Present through shared document routes and storage service |
| Walk-in coaching admission | Required | Present through `desk-enroll` |
| Generic merit and live merit list tooling | Useful for ranking-based institutes | Present through `direct/generate-merit`, `direct/merit-list`, and live merit endpoints |
| Waitlist and seat handling | Required | Present through shared seat and waitlist services |
| Final Classgrid login creation | Required | Present through `fullEnrollStudent()` |
| Coaching government export | Not expected | Correctly absent; strategy sets `govt_exports = []` |

### 6.2 Verified mismatches between plan and implementation

These are code-level mismatches, not guesses.
They mean the coaching engine needs integration cleanup, not that the coaching module is missing from backend.

#### A. Strategy/form-schema contract mismatch

Multiple flows still expect the strategy object to contain:

- `required_fields`
- `optional_fields`
- `document_checklist`

But `getAdmissionStrategy()` returns workflow metadata only.

Impact:

- public apply validation can fail
- admin form-schema generation can fail
- document checklist generation can fail
- workflow field/document gates can silently skip strict checks

#### B. Candidate middleware payload mismatch

`isAdmissionCandidate` writes:

- `req.admission_payload`

But some candidate document handlers read:

- `req.candidate`

Affected logic includes:

- checklist retrieval
- document upload
- candidate document view security checks

Impact:

- coaching candidate document routes are inconsistent in the reviewed code

#### C. Ranking metadata versus implemented ranking engine

The strategy metadata says:

- `ranking_type = "fcfs_or_entrance"`

But the reviewed backend does not expose a separate coaching-only engine for either:

- first-come-first-served queueing
- coaching entrance-test scoring

Instead, the generic merit engine reads flat academic keys such as:

- `10th_percentage`
- `previous_percentage`
- `cet_score`
- existing `merit_score`

Impact:

- coaching ranking metadata is more ambitious than the dedicated ranking implementation that was actually found
- marketing copy should describe coaching ranking carefully as shared admission tooling, not as a separately proven coaching entrance engine

#### D. Coaching course/batch mapping gap during enrollment

`fullEnrollStudent()` defines:

- `const isCoaching = org.structure_type === "coaching"`

But that flag is not used to drive a coaching-specific enrollment branch later in the function.

Also, the final `User` record is populated mainly from:

- `application.form_data?.branch_allotted`
- `application.form_data?.stream_applying`

The reviewed code does not map:

- `course_selected`
- `batch_preferred`

into a dedicated coaching-specific user profile field during final enrollment.

Impact:

- the application can capture coaching course and batch preferences
- the final `User` creation path does not clearly persist that coaching identity in a dedicated end-state field

#### E. Desk-enroll versus final account-creation gap

`deskEnroll()` marks the application:

- `status = enrolled`
- `fee_paid = true`

But it does not create the final `User`.

Impact:

- a walk-in coaching candidate can appear enrolled before a Classgrid ERP login exists
- `/api/admission/enroll` is still required if the institute wants the final student account and credentials

#### F. Status enum drift

The schema enum for `AdmissionApplication.status` does not include values that are actively used in workflow and merit operations, including:

- `fee_pending`
- `selected`

Impact:

- runtime stage handling is broader than the declared schema enum

#### G. Payment schema and transaction drift

The application schema stores payment identifiers under:

- `payment_details.razorpay_order_id`
- `payment_details.razorpay_payment_id`

But controllers read and write top-level fields such as:

- `application.razorpay_order_id`
- `application.razorpay_payment_id`

Also:

- `FeeTransaction.method` enum allows `cash`, `upi`, `bank_transfer`, `gateway`
- payment confirmation creates `method = "razorpay"`

Impact:

- the coaching fee path is implemented, but not cleanly aligned with the declared models

#### H. Email verification chain is only partially enforced

The reviewed backend exposes:

- `send-email-otp`
- `verify-email-otp`
- `credentials.verified_main_email`

But:

- `verifyEmailOTP()` does not itself attach the verified email to the application
- `submitApplication()` trusts `verified_main_email` from request body
- enrollment can still fall back to raw `application.email` or a synthetic phone-based alias

Impact:

- credential setup exists, but it is not a tightly locked end-to-end verification chain

---

## 7. Features Explicitly Not Verified In Backend

The following coaching ideas were not found as implemented backend behavior in the reviewed files, so they are not claimed here as active features:

- automatic early-bird expiry engine
- coupon or referral-code pricing engine
- guaranteed batch allotment engine based on `batch_preferred`
- separate coaching entrance-test evaluator
- coaching-specific government export
- coaching CRM or counselor scheduling inside the admission flow

If any of these are needed for public copy, they should be documented as planned items, not current backend behavior.

---

## 8. How It Works

This coaching engine is designed for two practical realities:

- students applying from home for a course and preferred batch
- walk-in students being enrolled quickly at the desk

The backend already supports both patterns. It also supports document upload, fee initiation, waitlisting, notifications, and final Classgrid account creation during enrollment.

### Daily Flow Table

| Step | Student / Parent action | Coaching office action | What the platform does |
|---|---|---|---|
| 1. Portal opens | Student visits the coaching admission page | Admin opens the portal in config | `is_portal_open` allows new coaching sessions |
| 2. Identity check | Student verifies phone via Firebase OTP | None | Backend creates or resumes the candidate application session |
| 3. Draft form | Student fills personal details, course choice, and preferred batch | None | Draft data saves into `AdmissionApplication` |
| 4. Email setup | Student may verify an email for future Classgrid login | None | Email OTP endpoints can validate the login email |
| 5. Final submit | Student submits the form | None | Application moves to `applied` and can store `verified_main_email` |
| 6. Documents and review | Student uploads marksheet and photo | Staff review if needed | Files go to storage and verification status is tracked |
| 7. Selection / fees | Student waits for response or payment link | Staff move the student forward or waitlist them | Fast-track workflow can move directly toward `fee_pending` |
| 8. Final enrollment | Student receives confirmation | Staff set the password and complete enrollment | Backend creates the final Classgrid `User`, hashes the password, and emails credentials |
| 9. Learning batch starts | Student logs into Classgrid | Staff manage the batch | The application is now linked to a final ERP student account |

### Common Scenarios

#### Scenario A: Student applies for a JEE or NEET course from home

1. The student verifies phone.
2. The form is filled with personal details, marks, course choice, and preferred batch.
3. Supporting files are uploaded.
4. The institute reviews the application and moves it toward payment or waitlist.
5. The final Classgrid login is created only when enrollment is completed.

#### Scenario B: Walk-in coaching admission at the office

1. A student comes directly to the coaching center.
2. Staff use `desk-enroll`.
3. The application is stored immediately with desk fee metadata.
4. If the institute also wants a Classgrid student login, staff still need the final `/enroll` step.

#### Scenario C: Preferred batch is full

1. The student applies for a popular batch.
2. Staff can keep the student in waitlist flow.
3. If capacity opens, the shared waitlist and seat services can move the next eligible candidate forward.

#### Scenario D: The student submitted the form but still has no Classgrid login

1. The application exists in `AdmissionApplication`.
2. No final `User` account exists yet.
3. The institute completes the enrollment action.
4. During `fullEnrollStudent()`, the backend creates the final Classgrid login and emails the credentials.

#### Scenario E: The student wants a quick explanation of what happens after phone verification

1. Phone verification starts the admission session.
2. The student fills the coaching form and submits it.
3. Documents, payment, and internal review happen after that.
4. The actual Classgrid account is created at final enrollment, not at the first OTP step.

### Assumptions & Clarifications

- Coaching is treated as its own module boundary through `org_type = coaching` and `structure_type = coaching`.
- The hierarchy rule is explicit: coaching uses `Course -> Batch`, not standards, streams, divisions, or semesters.
- Fast-track workflow is real in backend and allows `applied -> fee_pending` without the standard school/junior-college verification chain.
- Shared admin document verification routes still exist, but they are not the same as a hard standard-track gate.
- Generic merit tools are present, but a separate coaching-only entrance ranking engine was not verified.
- No coaching government export route was found, which aligns with `govt_exports = []`.
- Administrative flexibility is present through desk enrollment, manual stage updates, bulk actions, notifications, round advance, duplicate merge, and per-student unlock routes.
- Retroactive editing is controlled by `editable_until` plus `edit_lock_override`.
- Final Classgrid login creation happens at `/api/admission/enroll`, not at draft save, submit, or desk-enroll.
- Passwords are manually supplied during final enrollment and stored as bcrypt hashes on the final `User`.
- The reviewed enrollment code does not clearly map `course_selected` or `batch_preferred` into a dedicated coaching-specific user profile field.
- Marketing claims not backed by reviewed code were deliberately excluded.

---

## 9. Bottom-Line Assessment

The reviewed backend **does contain a real coaching admission engine**. The strongest verified pieces are:

- separate coaching org boundary
- `Course -> Batch` hierarchy support
- phone OTP candidate entry
- fast-track workflow
- document upload and printout handling
- walk-in desk enrollment
- waitlist and seat handling
- final Classgrid account creation during enrollment

However, the reviewed code also shows that several controller/schema contracts are still misaligned. The main coaching-specific cleanup risks are:

- strategy/form-schema contract mismatch
- candidate payload mismatch between middleware and document handlers
- ranking metadata being broader than the dedicated ranking engine actually found
- coaching course/batch mapping gap during final enrollment
- desk-enroll marking students enrolled before final ERP account creation
- status enum drift
- payment schema drift

So the correct engineering statement is:

> The coaching admission engine is real and functionally substantial in backend code, but its ranking, enrollment-mapping, and controller/schema contracts still need cleanup before it can be described as fully clean end-to-end.
