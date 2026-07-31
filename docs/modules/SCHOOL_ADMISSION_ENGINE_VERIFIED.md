# SCHOOL ADMISSION ENGINE
> Backend-verified module specification for Classgrid  
> Scope: `structure_type = school_with_div` and `school_no_div`  
> Validation rule: written only after manually reading plans plus backend models, routes, controllers, middleware, and services

This document intentionally does **not** use `MODULE_39_SCHOOL_ADMISSIONS.md` as a source of truth. That file was treated as unreliable. Everything below is grounded in the reviewed planning documents and actual backend code.

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

This school module is the non-CET admission path for standards `1` through `10`. In the reviewed plans and backend, standards `11` and `12` belong to the separate `junior_college` module, so they are intentionally excluded here. The school engine is represented by:

- `Organization.org_type = "school"`
- `Organization.structure_type = "school_with_div"` or `"school_no_div"`
- `Organization.division_mode = "with_divisions"` or `"without_divisions"`

The admission strategy for both school structure types is currently defined in `strategy-selector.js` as:

| Field | `school_with_div` | `school_no_div` |
|---|---|---|
| `auth_method` | `phone_otp` | `phone_otp` |
| `ranking_type` | `merit_percentage` | `merit_percentage` |
| `seat_types` | `GENERAL`, `RTE`, `MANAGEMENT` | `GENERAL`, `RTE`, `MANAGEMENT` |
| `entry_modes` | `PORTAL`, `DESK` | `PORTAL`, `DESK` |
| `workflow_variant` | `standard` | `standard` |
| `requires_printout` | `true` | `true` |
| `govt_exports` | `saral_csv` | `saral_csv` |

---

## 3. Database Architecture

### 3.1 Organization-level admission configuration

The school admission engine is mainly governed by `Organization.admission_config`.

| Path | Type | Verified purpose in backend |
|---|---|---|
| `admission_config.is_portal_open` | `Boolean` | Master gate for school applications and phone verification |
| `admission_config.registration_fee` | `Number` | Admission fee amount config |
| `admission_config.instructions` | `String` | Admin-facing portal guidance text |
| `admission_config.max_applications_per_student` | `Number` | School-level submission cap field |
| `admission_config.cutoff_date` | `Date` | Used by automation/deadline logic |
| `admission_config.application_config.document_validity_days` | object | School document age limits, checked during upload |
| `admission_config.enrollment_config.editable_until` | `Date` | Global edit/upload deadline |
| `admission_config.admission_round.current_round` | `Number` | Multi-round school admission tracking |
| `admission_config.admission_round.max_rounds` | `Number` | Round limit |
| `admission_config.admission_round.round_history[]` | array | Historical round snapshots |
| `admission_config.seat_matrix_policy` | object | Category/reservation configuration structure |
| `admission_config.tie_breaker_rules[]` | array | Tie-break rule storage |
| `admission_config.waitlist_and_deadlines` | object | Waitlist + fee deadline config storage |
| `admission_config.form_builder_config.field_toggles[]` | array | School/admin field toggle definitions |
| `admission_config.form_builder_config.document_toggles[]` | array | Document toggle definitions |
| `admission_config.form_builder_config.custom_fields[]` | array | Org-defined extra school fields |
| `admission_config.fee_config` | object | Admission fee structure and refund policy |

### 3.2 Core applicant record

Each school applicant is stored in `AdmissionApplication`.

| Field | Type | School relevance |
|---|---|---|
| `organization_id` | `ObjectId` | Tenant boundary |
| `hierarchy_id` | `ObjectId` | Links applicant to a school academic node such as a standard |
| `entry_mode` | enum | `PORTAL` or `DESK` are the school-relevant modes |
| `status` | enum | Stored lifecycle state |
| `phone` | `String` | Primary school identity for non-CET flows |
| `email` | `String` | Optional contact / notification channel |
| `full_name` | `String` | Required applicant name |
| `dob` | `Date` | Date of birth |
| `form_data` | mixed nested object | Main school form payload |
| `documents[]` | array | Uploaded scans and verification result |
| `merit_score` | `Number` | Used by school merit/waitlist operations |
| `category` | `String` | Category/RTE/general grouping input |
| `seat_type` | `String` | Seat bucket such as `GENERAL` or `RTE` |
| `waitlist_number` | `Number` | Waitlist ordering |
| `stage_history[]` | array | Audit trail of stage movement |
| `fee_paid` | `Boolean` | Payment completion flag |
| `payment_details` | object | Declared schema for school fee tracking |
| `student_id` | `ObjectId` | Final created student user |
| `prn` | `String` | Enrollment identifier field, even though school may use GR/Roll styles |
| `application_logs[]` | array | Per-application audit log |
| `edit_lock_override` | object | Per-student unlock after school-wide edit deadline |
| `printout_generated` | `Boolean` | School printout generation flag |
| `printout_url` | `String` | Generated school form PDF location |

### 3.3 Academic structure for schools

School seat and class mapping uses `AcademicHierarchy` and `SeatConfig`.

| Model | Verified school use |
|---|---|
| `AcademicHierarchy` | Supports `standard` and `division` nodes; comments explicitly describe `school_with_div` and `school_no_div` trees |
| `SeatConfig` | Holds capacity by `hierarchy_id`, `academic_year`, and quota buckets |

### 3.4 Identity/session support

| Model | Verified school use |
|---|---|
| `AdmissionOTP` | Used for email OTP flows and fallback storage; school phone OTP primarily verifies via Firebase token, not DB OTP |
| `User` | Final enrollment target with `role`, `organization_id`, `prn`, `phoneNumber`, `category`, `fcmTokens`, and additional admission staff roles |

### 3.5 Fee subsystem touched by school admissions

| Model | Verified role in current school flow |
|---|---|
| `FeeStructure` | Admission fee amount source |
| `StudentFeeLedger` | Ledger creation after payment/enrollment path |
| `FeeTransaction` | Payment transaction record |

### 3.6 Document storage subsystem

`storage.service.js` uploads school admission documents to the Supabase Storage bucket:

- Bucket: `admission-documents`
- Path pattern: `admissions/{organization_id}/{application_id}/{uuid}.{ext}`
- Access pattern: signed URL generation through `getSignedUrl(path, expiresIn)`

---

## 4. Route Surface For The School Module

### 4.1 Public and candidate routes

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `POST` | `/api/admission/verify-phone` | none | Verify Firebase phone token and issue admission candidate JWT |
| `POST` | `/api/admission/send-email-otp` | none | Send email OTP for Classgrid login email verification |
| `POST` | `/api/admission/verify-email-otp` | none | Validate email OTP before storing verified email on application |
| `POST` | `/api/admission/save-draft` | none | Save draft school application using admission candidate token |
| `POST` | `/api/admission/submit` | none | Final submit via candidate session |
| `POST` | `/api/admission/apply` | none | Public one-shot admission apply route |
| `GET` | `/api/admission/docs/checklist` | none | Candidate document checklist |
| `POST` | `/api/admission/docs/upload` | none | Candidate document upload |
| `GET` | `/api/admission/candidate/docs/view` | query `path` | Candidate document signed URL route |
| `POST` | `/api/admission/pay/initiate` | none | Start fee order |
| `POST` | `/api/admission/pay/verify` | none | Verify payment callback from candidate session |
| `POST` | `/api/admission/candidate/withdraw/:id` | `:id` | Candidate withdrawal route |

### 4.2 Parent routes

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `POST` | `/api/admission/parent/login` | none | Parent login by Firebase phone token |
| `GET` | `/api/admission/parent/status/:applicationId` | `:applicationId` | Parent-friendly status timeline |
| `GET` | `/api/admission/parent/documents/:applicationId` | `:applicationId` | Parent document list |

### 4.3 Admin routes relevant to schools

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `GET` | `/api/admission/config` | none | Fetch school admission config |
| `PATCH` | `/api/admission/config` | none | Replace school admission config |
| `POST` | `/api/admission/config/preset` | none | Inject minimal admission preset |
| `PATCH` | `/api/admission/admin/verify-doc` | none | Verify or reject uploaded document |
| `POST` | `/api/admission/desk-enroll` | none | Walk-in school enrollment |
| `GET` | `/api/admission/export/saral` | query `standard`, `status` | School export for SARAL |
| `POST` | `/api/admission/applications/merge` | none | Merge duplicate applications |
| `POST` | `/api/admission/allocate-divisions` | none | Allocate enrolled applicants to divisions/roll numbers |
| `POST` | `/api/admission/generate-prns` | none | Batch-generate IDs using PRN engine |
| `POST` | `/api/admission/notify` | none | Dispatch email/SMS/push |
| `GET` | `/api/admission/sms-budget` | none | SMS usage tracker |
| `GET` | `/api/admission/analytics` | query `hierarchy_id` | School funnel analytics |
| `PATCH` | `/api/admission/applications/:id/stage` | `:id` | Manual stage update |
| `POST` | `/api/admission/admin/bulk-verify` | none | Bulk set applications to verified |
| `POST` | `/api/admission/admin/bulk-select` | none | Bulk move applications toward fee stage |
| `POST` | `/api/admission/round/advance` | none | Advance school round counter |
| `PATCH` | `/api/admission/applications/:id/unlock-edit` | `:id` | Unlock one applicant after deadline |
| `PATCH` | `/api/admission/applications/:id/lock-edit` | `:id` | Re-lock one applicant |

### 4.4 Broadcast routes

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `GET` | `/api/admission/broadcast/merit-list/:hierarchyId` | `:hierarchyId` | Live ranked list by standard/hierarchy |
| `GET` | `/api/admission/broadcast/seat-matrix` | none | Live seat matrix feed |
| `POST` | `/api/admission/broadcast/call-candidate` | none | Mark a candidate as called and broadcast update |

---

## 5. Verified Backend Logic

### 5.1 School entry modes

The reviewed backend currently exposes **two school-facing entry styles**:

1. Candidate session flow:
   - `POST /verify-phone`
   - `POST /save-draft`
   - `POST /submit`

2. Public apply flow:
   - `POST /apply`

It also exposes a third admin-only path:

3. Walk-in desk flow:
   - `POST /desk-enroll`

### 5.2 School workflow variant

For both school structure types, the workflow variant is `standard`.

The `admission-workflow.service.js` standard transitions are:

```text
draft
  -> applied
applied
  -> under_verification
  -> withdrawn
  -> waitlisted
under_verification
  -> verified
  -> draft
  -> withdrawn
verified
  -> fee_pending
  -> withdrawn
fee_pending
  -> enrolled
  -> withdrawn
waitlisted
  -> applied
  -> withdrawn
enrolled
  -> withdrawn
```

### 5.3 Duplicate detection

The duplicate detector checks the same organization for any non-deleted application matching:

- same `phone`
- same `en_number`
- same `full_name` + `dob`
- same `form_data.student_aadhar`

### 5.4 Merit generation

The current merit engine is generic, not school-only. It reads:

- `form_data["10th_board"]` or `form_data.board`
- `form_data["10th_percentage"]` or `form_data.previous_percentage`
- optional CGPA conversion flags

It normalizes using board multipliers:

| Board | Multiplier |
|---|---|
| `SSC` | `1.00` |
| `CBSE` | `0.95` |
| `ICSE` | `0.93` |
| `IB` | `0.92` |
| `IGCSE` | `0.94` |
| `STATE` | `1.00` |
| `NIOS` | `1.02` |

Sorting is:

1. `normalized_score` descending
2. `createdAt` ascending for tie-break

### 5.5 Document processing

School document handling currently includes:

- upload to Supabase Storage through `storage.service.js`
- document status values: `pending`, `verified`, `rejected`
- optional document issue-date validation via `document_validity_days`
- generic signed URL generation for viewing uploaded files

### 5.6 Seat, waitlist, and division logic

The school backend has three separate mechanics:

1. `seat-matrix.service.js`
   - atomic seat claim using optimistic concurrency
   - atomic seat release
   - Socket.IO broadcast to `org_{orgId}_admission`

2. `waitlist.service.js`
   - auto-promotion from waitlist when vacancy opens
   - updates `SeatConfig.quotas`

3. `division-allocator.service.js`
   - allocation methods: `alphabetical`, `merit`, `random`, `manual`
   - persists `form_data.assigned_division`
   - persists `form_data.assigned_roll_number`

### 5.7 School government export

`generateSARALExport()` reads school data from `AdmissionApplication` and exports:

- student name
- father name
- mother name
- DOB
- gender
- category
- caste
- Aadhaar
- contact number
- email
- previous school
- standard
- division
- roll number
- admission date
- status

### 5.8 Parent portal

Parent access is implemented as a school-relevant public service:

- login by Firebase phone token
- supports multiple child applications linked to one phone
- returns sanitized stage timeline only
- does not expose full admin comments

### 5.9 Notifications

The unified school notification service supports:

- email via Brevo
- SMS via AWS SNS
- push via Firebase FCM

Built trigger templates include:

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

### 5.10 Live broadcast integration

Admission live updates use Socket.IO room naming:

```text
org_{orgId}_admission
```

Broadcast event:

```text
ADMISSION_LIVE_UPDATE
```

Used update types in the reviewed code include:

- `SEAT_ALLOCATED`
- `SEAT_RELEASED`
- `CANDIDATE_CALLED`
- `GATE_ENTRY`

### 5.11 Email verification, Classgrid account creation, and password setup

The reviewed backend does include credential-related steps, but they are split across multiple endpoints and the final account is created only at enrollment time.

Verified flow:

1. Candidate verifies phone first through:
   - `POST /api/admission/verify-phone`
2. Candidate can verify a login email through:
   - `POST /api/admission/send-email-otp`
   - `POST /api/admission/verify-email-otp`
3. During `POST /api/admission/submit`, the candidate session may send `verified_main_email`.
4. If that field is present, `submitApplication()` stores:
   - `application.credentials.verified_main_email`
   - `application.credentials.is_email_verified = true`
5. A real Classgrid `User` account is **not** created during draft save, submit, or public apply.
6. The actual ERP login account is created during:
   - `POST /api/admission/enroll`
   - handler: `fullEnrollStudent()`
7. The login email chosen for the new `User` is resolved in this order:
   - `application.credentials.verified_main_email`
   - `application.email`
   - fallback synthetic email: ``${application.phone}@admission.classgrid.in``
8. The password is not auto-generated by the backend. `fullEnrollStudent()` requires a `password` in the request body.
9. That password is hashed with `bcrypt` before saving to `User.password`.
10. The created `User` is marked with:
   - `role = "student"`
   - `isEmailVerified = true`
   - `linkedProviders = ["manual"]`
   - `mustResetPassword = false`
11. After enrollment, the backend sends a congratulations email containing:
   - login email
   - plaintext password
   - school identifiers such as division, GR number, and roll number when provided

Practical meaning for the school module:

- Admission application and Classgrid ERP account creation are **two different stages**.
- A parent can complete admission submission without the platform creating the final student login yet.
- The Classgrid student login is created only when the school completes the enrollment action.

---

## 6. Plan vs Current Backend Reality

### 6.1 Verified school capabilities present in backend

| Capability | Plan expectation | Current backend reality |
|---|---|---|
| Phone OTP entry | Required for school | Present through Firebase ID token verification |
| Walk-in school admission | Required | Present via `desk-enroll` |
| Parent tracking | Required | Present via parent login/status/documents routes |
| SARAL export | Required | Present via `export/saral` |
| Merit generation | Required for merit-based schools | Present via generic merit service |
| Division allocation | Required | Present via division allocator |
| Waitlist logic | Required | Present through waitlist + seat matrix services |
| Edit deadline + admin unlock | Clarification requirement | Present through `editable_until` + `edit_lock_override` |

### 6.2 Verified mismatches between plan and implementation

These are important engineering/audit notes. They are based on current code, not assumptions.
They mean the school engine needs contract cleanup, not that the school module is missing from backend.

#### A. Strategy contract mismatch

Multiple controllers/services call `getAdmissionStrategy(structureType)` and expect:

- `required_fields`
- `document_checklist`

But the current `strategy-selector.js` returns workflow/auth metadata only, while field/document configuration now lives in:

- `ORG_TYPE_DEFAULTS`
- `getResolvedAdmissionStrategy()`
- `Organization.admission_config.form_builder_config`

Impact:

- `applyForAdmission()` can fail when iterating `strategy.required_fields`
- `getAdmissionConfig()` -> `getFormSchema()` can fail when mapping missing `required_fields`
- `getRequiredDocsChecklist()` can fail when reading missing `document_checklist`
- `checkTransitionGates()` falls back and can skip strict school field validation

#### B. Candidate middleware payload mismatch

`isAdmissionCandidate` stores decoded data on:

- `req.admission_payload`

But several candidate document handlers read:

- `req.candidate`

Affected logic includes:

- checklist retrieval
- document upload
- candidate document viewing

Impact:

- candidate document routes are inconsistent
- candidate document access checks are weaker than intended

#### C. School structure detection mismatch during enrollment

`fullEnrollStudent()` checks:

- `["school", "school_no_divisions"]`

But the actual school structure values defined in `Organization` are:

- `school_with_div`
- `school_no_div`

Impact:

- school-only enrollment branch for roll number / GR number assignment does not align with the actual structure types

#### D. Status enum mismatch

`AdmissionApplication.status` schema enum does **not** include several status values used by controllers/services, including:

- `fee_pending`
- `selected`

But those values are actively used in:

- workflow transitions
- bulk selection
- waitlist promotion
- merit broadcast queries

Impact:

- database updates can store workflow values that are outside the declared schema intent
- later validation and save behavior may become inconsistent

#### E. Payment field mismatch

`AdmissionApplication` declares payment data under:

- `payment_details.razorpay_order_id`
- `payment_details.razorpay_payment_id`

But the reviewed controllers read/write top-level fields such as:

- `application.razorpay_order_id`
- `application.razorpay_payment_id`

Webhook lookup also searches:

- `AdmissionApplication.findOne({ razorpay_order_id: orderId })`

Impact:

- the school admission fee path is structurally inconsistent with the declared application schema

#### F. Fee transaction enum mismatch

`confirmPaymentInternal()` creates `FeeTransaction.method = "razorpay"`, but `FeeTransaction` only allows:

- `cash`
- `upi`
- `bank_transfer`
- `gateway`

Impact:

- payment recording is misaligned with the transaction model

#### G. School export assumes flat form fields

`generateSARALExport()` reads flat keys like:

- `father_name`
- `mother_name`
- `standard_applying`
- `assigned_division`

The application model also supports much deeper nested `form_data` objects.

Impact:

- SARAL export works best only when the school form stores those flat keys exactly as expected

#### H. Email verification and credential flow are only partially enforced

The reviewed backend does expose:

- `send-email-otp`
- `verify-email-otp`
- `credentials.verified_main_email`

However, the school credential flow is not fully enforced end-to-end in one place.

Verified issues:

- `verifyEmailOTP()` only returns success; it does not itself attach the verified email to the application record
- `submitApplication()` trusts a `verified_main_email` value from the request body and marks `is_email_verified = true`
- `fullEnrollStudent()` comment says it uses an OTP-verified email, but it can also fall back to `application.email`
- if neither verified email nor raw email exists, the backend still creates a login using a synthetic email based on phone number
- `mustResetPassword` is stored as `false`, even though the enrollment email tells the student to change the password after first login

Impact:

- the platform has real email verification endpoints, but the verified-email chain is not as tightly enforced as the comments imply
- marketing copy should describe this as a credential setup flow available in backend, not as a fully locked zero-gap identity pipeline

---

## 7. Features Explicitly Not Verified In Backend

The following ideas are **not** described as active school features in this document because they were not found as implemented backend behavior in the reviewed files:

- sibling quota auto-linking
- age-cutoff auto-rejection engine
- bus-route/transport fee engine inside school admission flow
- campus interview scheduler
- family-level parent-first profile model

If any of these are required, they should be documented separately as planned-but-not-built, not as current school module behavior.

---

## 8. How It Works

This school admission engine is designed for two practical school realities:

- parents applying from home on their phone
- walk-in families being helped by school staff at the desk

The backend already supports both patterns. It also supports merit-based review, waitlisting, document upload, parent status checking, and school exports.

### Daily Flow Table

| Step | Parent / Student action | School office action | What the platform does |
|---|---|---|---|
| 1. Portal opens | Parent visits the school admission page | Admin opens the portal in config | `is_portal_open` allows new school sessions |
| 2. Identity check | Parent verifies phone via Firebase OTP | None | Backend verifies Firebase token and creates/returns an application |
| 3. Draft capture | Parent fills basic details and may provide login email | None | Draft data saves into `AdmissionApplication` |
| 4. Final submit | Parent submits the form and may pass a verified email | None | Application moves into submission workflow and can store `credentials.verified_main_email` |
| 5. Documents | Parent uploads school documents | Staff later review them | Files go to Supabase Storage and document status is tracked |
| 6. Review / merit | Parent waits for response | Staff verify or rank applications | School can verify, generate merit, waitlist, or select |
| 7. Payment / confirmation | Parent pays or follows office instruction | Staff confirm next step | Fee path and receipt logic are prepared, though current code has schema mismatches noted above |
| 8. Enrollment | Parent receives final status | Staff enroll, set the student password, and assign division/roll where applicable | The backend creates the final `User` account, hashes the password, links it to the application, and emails Classgrid credentials |

### Common Scenarios

#### Scenario A: Parent applies from home

1. The school opens admissions.
2. The parent verifies the registered phone number.
3. The parent fills the child details and uploads required files.
4. The application is reviewed by the school.
5. The parent tracks progress from the parent portal instead of calling the office repeatedly.

#### Scenario B: Walk-in admission at the school office

1. A family comes to campus directly.
2. The admission clerk uses `desk-enroll`.
3. The school records the student immediately with desk metadata such as fee mode and receipt number.
4. The student can be placed into the system without waiting for the full portal journey.

#### Scenario C: Merit list plus waitlist handling

1. The school generates or reviews a ranked list.
2. Top applicants move forward.
3. Remaining applicants can be placed on waitlist.
4. If a seat opens, the waitlist engine and seat matrix logic can promote the next eligible student.

#### Scenario D: The edit deadline has passed

1. The school closes normal edits using `editable_until`.
2. One parent still needs a correction.
3. An authorized admin unlocks that specific application only.
4. The correction window can later be re-locked without reopening everyone else's form.

#### Scenario E: The parent submitted the form, but the student still does not have a Classgrid login

1. The admission form is submitted successfully.
2. The application exists in `AdmissionApplication`, but no final `User` exists yet.
3. The school completes verification and decides to enroll the student.
4. During `fullEnrollStudent()`, the school sets the password, the backend creates the Classgrid `User`, and the system emails the credentials.

### Assumptions & Clarifications

- The module supports both `school_with_div` and `school_no_div` at the data-model level.
- `school_no_div` is represented in the hierarchy comments/models, but the reviewed admission routes/controllers do not themselves contain the hidden-default-division creation logic.
- Parent tracking is already multi-child aware because parent login returns multiple linked applications for the same phone number.
- Administrative flexibility is present through manual stage updates, desk enrollment, duplicate merge, round advance, per-student unlock, and bulk verification/selection routes.
- Retroactive editing is not universally open. It is controlled by `editable_until` plus `edit_lock_override`.
- The hierarchy rule is explicit: applicants can be tied to `hierarchy_id`, and final division/roll data is stored back in `form_data.assigned_division` and `form_data.assigned_roll_number`.
- SARAL export is the school-specific government output currently wired in backend code.
- Email OTP support exists in backend, but the final Classgrid student account is created only at enrollment time, not at first application submit.
- The backend can create a login even without a separately persisted verified email by falling back to `application.email` or a synthetic phone-based email alias.
- The enrollment password is manually supplied during `fullEnrollStudent()` and stored as a bcrypt hash on the final `User` record.
- Marketing claims not backed by reviewed code were deliberately excluded from this document.

---

## 9. Bottom-Line Assessment

The reviewed backend **does contain a real school admission engine**, not just a placeholder. The strongest verified pieces are:

- phone-based school entry
- school applicant records
- document upload
- parent tracking
- merit generation
- waitlist and seat handling
- division allocation
- SARAL export

However, the reviewed code shows that the school module is **implemented, but several controller/schema contracts are still misaligned**. These are not "missing idea" gaps; they are concrete code-level mismatches that can affect runtime behavior:

- strategy object mismatch between `getAdmissionStrategy()` consumers and the strategy payload that is actually returned
- candidate payload mismatch where middleware writes `req.admission_payload` but some handlers read `req.candidate`
- school structure-name mismatch during enrollment for `school_with_div` / `school_no_div`
- status enum drift between workflow logic and `AdmissionApplication.status`
- payment schema drift between `payment_details.*` fields and top-level controller reads/writes

So the correct engineering statement is:

> The school admission engine is real and structurally rich in backend code, but several verified contract mismatches still need correction before it can be described as fully clean end-to-end.
