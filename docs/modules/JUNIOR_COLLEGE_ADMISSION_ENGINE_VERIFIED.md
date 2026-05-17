# JUNIOR COLLEGE ADMISSION ENGINE
> Backend-verified module specification for Classgrid  
> Scope: `org_type = junior_college` with `structure_type = junior_college`, `junior_college_with_div`, and `junior_college_no_div`  
> Validation rule: written only after manually reading plans plus backend models, routes, controllers, middleware, and services

This document is written from the reviewed planning documents and backend code. No unsupported marketing claims are included. There is no separate junior-college-only admission plan file in the reviewed docs, so this module is derived from the master plan, the generic admission plan, and the backend implementation.

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

This junior college module is the non-CET admission path for standards `11` and `12`. In the reviewed plans, `school` covers standards `1-10`, while `junior_college` is the separate `11th/12th` stream-based module.

In the reviewed backend, the junior-college engine is represented by:

- `Organization.org_type = "junior_college"`
- `Organization.structure_type = "junior_college"`, `"junior_college_with_div"`, or `"junior_college_no_div"`
- `Organization.division_mode = "with_divisions"` or `"without_divisions"`
- `AcademicHierarchy` comments explicitly define the Plan 5 tree as `Stream -> Standard -> Division`

The current strategy payload in `strategy-selector.js` is defined only for the legacy `junior_college` key:

| Field | `junior_college` |
|---|---|
| `auth_method` | `phone_otp` |
| `ranking_type` | `10th_merit` |
| `seat_types` | `CAP`, `MANAGEMENT`, `MINORITY` |
| `entry_modes` | `PORTAL`, `DESK` |
| `workflow_variant` | `standard` |
| `requires_printout` | `true` |
| `govt_exports` | `state_board_csv` |

Important engineering note:

- the organization model supports `junior_college_with_div` and `junior_college_no_div`
- the strategy table does **not** define those two variant keys
- this naming gap affects multiple junior-college flows later in the stack

---

## 3. Database Architecture

### 3.1 Organization-level junior-college admission configuration

The junior-college engine is primarily governed by `Organization.admission_config`.

| Path | Type | Verified purpose in backend |
|---|---|---|
| `admission_config.is_portal_open` | `Boolean` | Master gate for junior-college applications and phone verification |
| `admission_config.registration_fee` | `Number` | Registration fee configuration |
| `admission_config.instructions` | `String` | Portal guidance text |
| `admission_config.application_config.document_validity_days` | object | Expiry rules checked during document upload |
| `admission_config.enrollment_config.editable_until` | `Date` | Deadline for edits and uploads |
| `admission_config.admission_round.current_round` | `Number` | Multi-round admission tracking |
| `admission_config.admission_round.max_rounds` | `Number` | Maximum round count |
| `admission_config.admission_round.round_history[]` | array | Historic round snapshots |
| `admission_config.seat_matrix_policy` | object | Seat and quota policy storage |
| `admission_config.tie_breaker_rules[]` | array | Tie-break storage |
| `admission_config.waitlist_and_deadlines` | object | Waitlist and deadline config storage |
| `admission_config.form_builder_config.field_toggles[]` | array | Field toggles for the admission form |
| `admission_config.form_builder_config.document_toggles[]` | array | Document toggles |
| `admission_config.form_builder_config.custom_fields[]` | array | Org-defined custom junior-college fields |
| `admission_config.fee_config` | object | Fee and refund policy storage |

### 3.2 Strategy defaults for junior-college forms

`strategy-selector.js` contains `ORG_TYPE_DEFAULTS.junior_college`, which pre-enables a heavier data set than school:

- identity fields
- parent and demographic fields
- address, guardian, and hostel fields
- academic IDs
- `10th_board`
- `10th_percentage`
- `stream_applying`
- `career_choice`
- `alumni_institute`

Default junior-college documents in that file are:

- `10th_marksheet`
- `transfer_certificate`
- `student_aadhar`
- `caste_certificate`
- `income_certificate`
- `domicile_certificate`
- `passport_size_photo`

### 3.3 Core applicant record

Each junior-college applicant is stored in `AdmissionApplication`.

| Field | Type | Junior-college relevance |
|---|---|---|
| `organization_id` | `ObjectId` | Tenant boundary |
| `hierarchy_id` | `ObjectId` | Links to a stream/standard node |
| `entry_mode` | enum | `PORTAL` or `DESK` are the junior-college-relevant direct modes |
| `status` | enum | Lifecycle state |
| `phone` | `String` | Main non-CET identity field |
| `email` | `String` | Candidate contact field |
| `credentials.verified_main_email` | `String` | Optional verified Classgrid login email |
| `credentials.is_email_verified` | `Boolean` | Email-verified marker |
| `full_name` | `String` | Applicant name |
| `dob` | `Date` | Date of birth |
| `form_data` | mixed nested object | Main junior-college form payload |
| `documents[]` | array | Uploaded certificates and proof documents |
| `merit_score` | `Number` | Normalized 10th-based merit |
| `category` | `String` | Category/reservation input |
| `seat_type` | `String` | Seat bucket like `CAP`, `MANAGEMENT`, `MINORITY` |
| `waitlist_number` | `Number` | Waitlist ordering |
| `stage_history[]` | array | Stage movement audit trail |
| `fee_paid` | `Boolean` | Payment completion flag |
| `payment_details` | object | Declared schema for payment data |
| `student_id` | `ObjectId` | Linked final `User` record |
| `prn` | `String` | Student identifier field |
| `printout_generated` | `Boolean` | Printout generation flag |
| `printout_url` | `String` | Generated application printout location |

### 3.4 Academic structure and seat matrix

Junior-college seat and class structure use `AcademicHierarchy` and `SeatConfig`.

| Model | Verified junior-college use |
|---|---|
| `AcademicHierarchy` | Supports `stream`, `standard`, and `division` nodes; comments define the junior-college tree explicitly |
| `SeatConfig` | Holds intake and quota capacities by `hierarchy_id` and `academic_year` |

### 3.5 Identity and enrollment target

| Model | Verified junior-college use |
|---|---|
| `AdmissionOTP` | Stores email OTPs and related verification records |
| `User` | Final Classgrid ERP account after enrollment with `role`, `organization_id`, `prn`, `phoneNumber`, `category`, and manual-auth credentials |

### 3.6 Fee subsystem touched by junior-college admissions

| Model | Verified role |
|---|---|
| `FeeStructure` | Fee amount source |
| `StudentFeeLedger` | Created after successful fee processing |
| `FeeTransaction` | Payment transaction record |

### 3.7 Document storage subsystem

`storage.service.js` uploads junior-college admission documents to:

- Bucket: `admission-documents`
- Path pattern: `admissions/{organization_id}/{application_id}/{uuid}.{ext}`
- View access: signed URL generation through `getSignedUrl(path, expiresIn)`

---

## 4. Route Surface For The Junior-College Module

### 4.1 Public and candidate routes

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `POST` | `/api/admission/verify-phone` | none | Verify Firebase phone token and issue admission candidate JWT |
| `POST` | `/api/admission/send-email-otp` | none | Send email OTP for login email verification |
| `POST` | `/api/admission/verify-email-otp` | none | Validate email OTP |
| `POST` | `/api/admission/save-draft` | none | Save draft junior-college application |
| `POST` | `/api/admission/submit` | none | Final submit via candidate session |
| `POST` | `/api/admission/apply` | none | Public one-shot apply route |
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

### 4.3 Admin routes relevant to junior college

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `GET` | `/api/admission/config` | none | Fetch admission config |
| `PATCH` | `/api/admission/config` | none | Replace admission config |
| `POST` | `/api/admission/config/preset` | none | Inject base preset |
| `PATCH` | `/api/admission/admin/verify-doc` | none | Verify or reject uploaded document |
| `POST` | `/api/admission/desk-enroll` | none | Walk-in admission path |
| `POST` | `/api/admission/direct/generate-merit` | none | Persist normalized merit scores |
| `GET` | `/api/admission/direct/merit-list` | query `hierarchy_id`, `category`, `seat_type`, `gender`, `page`, `limit` | Admin merit dashboard feed |
| `POST` | `/api/admission/applications/merge` | none | Merge duplicate applications |
| `POST` | `/api/admission/allocate-divisions` | none | Allocate divisions and roll numbers |
| `POST` | `/api/admission/generate-prns` | none | Batch PRN generation route |
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

---

## 5. Verified Backend Logic

### 5.1 Junior-college entry styles

The reviewed backend exposes three direct-flow entry styles that apply to junior college:

1. Candidate session flow:
   - `POST /verify-phone`
   - `POST /save-draft`
   - `POST /submit`

2. Public apply flow:
   - `POST /apply`

3. Walk-in desk flow:
   - `POST /desk-enroll`

### 5.2 Merit and ranking logic

The current merit engine is generic but maps well to junior-college admissions because it reads 10th board and 10th marks.

It uses:

- `form_data["10th_board"]`
- `form_data.board`
- `form_data["10th_percentage"]`
- `form_data.previous_percentage`
- optional CGPA conversion flags

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

Sorting is:

1. `normalized_score` descending
2. `createdAt` ascending for tie-break

### 5.3 Workflow variant

The strategy table defines `junior_college.workflow_variant = "standard"`.

The standard transition map in `admission-workflow.service.js` is:

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

### 5.4 Stream, standard, and division structure

The data model for junior college is stream-oriented:

- `AcademicHierarchy.level_type = "stream"`
- `AcademicHierarchy.level_type = "standard"`
- `AcademicHierarchy.level_type = "division"`

The reviewed comments define the intended tree as:

```text
Stream -> Standard -> Division
```

Division allocation is handled by `division-allocator.service.js` using:

- `alphabetical`
- `merit`
- `random`
- `manual`

Persisted fields:

- `form_data.assigned_division`
- `form_data.assigned_roll_number`

### 5.5 Seat and waitlist logic

Junior-college admissions reuse the generic seat engine:

1. `seat-matrix.service.js`
   - atomic seat claim
   - atomic seat release
   - broadcast to `org_{orgId}_admission`

2. `waitlist.service.js`
   - waitlist promotion when vacancy opens
   - quota count updates in `SeatConfig`

### 5.6 Document processing

The reviewed document path supports:

- upload to Supabase Storage
- status values `pending`, `verified`, `rejected`
- optional issue-date validity checking
- signed URL viewing

### 5.7 Parent portal

The parent-facing path is shared with the school flow:

- login by Firebase phone token
- multi-child aware response
- status timeline view
- document list view

### 5.8 Email verification, account creation, and password setup

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

### 5.9 PRN and college-style enrollment behavior

`fullEnrollStudent()` attempts college-style behavior only when:

- `org.structure_type` is `"college"` or `"junior_college"`

In that branch, the code can:

- generate PRN through `generatePRNForApplication()`
- copy college-style identifiers such as `abc_id`
- store PRN on the final `User`

This matters because the organization model also allows:

- `junior_college_with_div`
- `junior_college_no_div`

Those variant names are not recognized by the `isCollege` check in the enrollment controller.

### 5.10 Notifications and live updates

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

### 5.11 Government output reality

The junior-college strategy advertises:

- `govt_exports = ["state_board_csv"]`

But the reviewed routes and export service only implement:

- `export/dte`
- `export/saral`
- `export/aicte`

No dedicated junior-college `state_board_csv` route or export generator was found in the reviewed backend.

---

## 6. Plan vs Current Backend Reality

### 6.1 Verified junior-college capabilities present in backend

| Capability | Plan expectation | Current backend reality |
|---|---|---|
| Separate junior-college module boundary | Required | Present via `org_type = junior_college` and Plan 5 hierarchy comments |
| Stream-based hierarchy | Required | Present in `AcademicHierarchy` as `stream -> standard -> division` |
| Phone OTP entry | Required | Present through Firebase phone token verification |
| Email OTP support | Required for credential setup | Present through `send-email-otp` and `verify-email-otp` |
| 10th-based merit ranking | Required | Present through generic merit engine and merit routes |
| Parent tracking | Required | Present via parent login/status/documents |
| Waitlist and seat matrix | Required | Present through shared seat and waitlist services |
| Division allocation | Required | Present through `allocate-divisions` |
| Final Classgrid login creation | Required | Present through `fullEnrollStudent()` |

### 6.2 Verified mismatches between plan and implementation

These are code-level mismatches, not guesses.
They mean the junior-college engine needs integration cleanup, not that the junior-college module boundary is absent from backend.

#### A. Strategy-key mismatch for junior-college variants

The organization model allows:

- `junior_college`
- `junior_college_with_div`
- `junior_college_no_div`

But `ADMISSION_STRATEGIES` defines only:

- `junior_college`

Impact:

- `getAdmissionStrategy("junior_college_with_div")` throws
- `getAdmissionStrategy("junior_college_no_div")` throws
- any controller/service that directly uses `org.structure_type` with those values can fail

Affected areas include:

- `applyForAdmission()`
- `getAdmissionConfig()` -> `getFormSchema()`
- workflow gate checks in `admission-workflow.service.js`
- document checklist generation

#### B. Form-schema contract mismatch

Multiple flows still expect the strategy object to contain:

- `required_fields`
- `optional_fields`
- `document_checklist`

But `getAdmissionStrategy()` returns workflow metadata only.

Impact:

- admin config form schema generation can fail
- public apply validation can fail
- document checklist generation can fail
- workflow document gates can silently skip strict checks

#### C. Enrollment misclassifies `junior_college_with_div` and `junior_college_no_div`

`fullEnrollStudent()` uses:

- `const isCollege = ["college", "junior_college"].includes(org.structure_type)`

Impact for variant-based junior colleges:

- PRN generation branch does not run
- college-specific identifier copy logic does not run
- the controller treats those orgs as neither school nor college

#### D. Government export mismatch

The junior-college strategy declares:

- `state_board_csv`

But the actual route/service layer exposes only:

- DTE
- SARAL
- AICTE

Impact:

- the reviewed backend does not provide a dedicated junior-college state-board export path even though the strategy metadata suggests one

#### E. Merit engine reads flat 10th fields, not the full structured academic-history model

The application model supports deeper academic storage through:

- `form_data.previous_education[]`

But the merit engine reads only flat keys such as:

- `10th_board`
- `10th_percentage`
- `previous_percentage`

Impact:

- junior-college merit ranking works best when 10th data is stored in the expected flat keys
- a form that only populates `previous_education[]` may not feed the merit engine correctly

#### F. Candidate middleware payload mismatch

`isAdmissionCandidate` writes:

- `req.admission_payload`

But some candidate document handlers read:

- `req.candidate`

Impact:

- checklist retrieval
- document upload
- candidate document view security checks

are inconsistent in the reviewed code

#### G. Status enum drift

The schema enum for `AdmissionApplication.status` does not include values that are actively used in workflow and merit operations, including:

- `fee_pending`
- `selected`

Impact:

- runtime stage handling is broader than the declared schema enum

#### H. Payment schema and transaction drift

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

- the fee path is implemented, but not cleanly aligned with the declared models

#### I. Email verification chain is only partially enforced

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

The following junior-college ideas were not found as implemented backend behavior in the reviewed files, so they are not claimed here as active features:

- dedicated `state_board_csv` export implementation
- stream-wise cutoff publication engine
- subject-combination eligibility validator
- automatic XI-to-XII continuation workflow
- minority-seat document gating logic as a separate rules engine

If any of these are required for public copy, they should be documented as planned items, not current backend behavior.

---

## 8. How It Works

This junior-college engine is meant for the `11th/12th` intake process where students usually apply on the basis of `10th` marks and select a stream such as Science, Commerce, or Arts.

The backend supports:

- remote application from home
- walk-in desk handling
- 10th-based merit ranking
- waitlisting
- document verification
- parent status tracking
- final Classgrid account creation at enrollment

### Daily Flow Table

| Step | Student / Parent action | College office action | What the platform does |
|---|---|---|---|
| 1. Portal opens | Student visits the junior-college admission page | Admin opens portal in config | `is_portal_open` allows new application sessions |
| 2. Identity check | Student or parent verifies phone via Firebase OTP | None | Backend creates or resumes the candidate application session |
| 3. Draft form | Student fills personal, 10th marks, and stream details | None | Draft data saves into `AdmissionApplication` |
| 4. Email setup | Student may verify an email for future Classgrid login | None | Email OTP endpoints can validate the login email |
| 5. Final submit | Student submits the form | None | Application moves into the admission workflow and can store `verified_main_email` |
| 6. Documents | Student uploads marksheet and supporting documents | Staff review later | Files go to storage and verification status is tracked |
| 7. Merit and review | Student waits for result | Staff generate merit, verify, shortlist, or waitlist | Backend calculates normalized ranking and serves merit-list endpoints |
| 8. Selection and fee | Student follows the selection result | Staff move selected students forward | Status can advance toward fee collection and enrollment |
| 9. Enrollment and login | Student receives final confirmation | Staff enroll the student, set password, and assign division if used | Backend creates the final Classgrid `User`, hashes password, and emails credentials |

### Common Scenarios

#### Scenario A: Student applies for Science stream from home

1. The student verifies phone.
2. The form is filled with 10th marks and stream preference.
3. Supporting documents are uploaded.
4. The junior college reviews merit and selection status.
5. The student checks the result through the portal or notification.

#### Scenario B: Merit list and waitlist handling

1. The college generates the merit list.
2. Higher-ranked students move forward first.
3. Others may remain on waitlist.
4. If a seat opens, the waitlist engine can promote the next candidate.

#### Scenario C: Walk-in junior-college admission

1. A student arrives physically at the office.
2. Staff use `desk-enroll`.
3. The application can be entered directly with desk metadata.
4. The office can move the student through admission without relying only on the home portal flow.

#### Scenario D: The student has submitted the form, but still has no Classgrid login

1. The application exists in `AdmissionApplication`.
2. No final `User` account exists yet.
3. The college finishes verification and decides to enroll.
4. During `fullEnrollStudent()`, the backend creates the final Classgrid login and emails the credentials.

#### Scenario E: The college uses stream and division structure

1. Students are attached to the proper hierarchy node.
2. After enrollment, the admin can run division allocation.
3. The backend stores assigned division and roll number on the application record.

### Assumptions & Clarifications

- Junior college is treated as the `11th/12th` module boundary, not as part of school `1-10`.
- The data model supports both legacy `junior_college` and the newer `junior_college_with_div` / `junior_college_no_div` variants.
- The strategy and enrollment layers are cleaner for the legacy `junior_college` key than for the two variant keys.
- Merit generation is real in backend, but it is shared generic logic rather than a separate junior-college-only engine.
- Parent tracking is available through phone-linked access and can return multiple child applications.
- The final Classgrid login is created at enrollment time, not at first form submission.
- Passwords are manually supplied during enrollment and stored as bcrypt hashes on the final `User`.
- No dedicated junior-college state-board export route was found in the reviewed backend, even though the strategy metadata advertises one.
- Marketing claims not backed by reviewed code were deliberately excluded.

---

## 9. Bottom-Line Assessment

The reviewed backend **does contain a real junior-college admission engine**. The strongest verified pieces are:

- 11th/12th module boundary in the org model
- stream-based hierarchy support
- phone OTP candidate entry
- 10th-based merit calculation
- document upload and verification
- parent tracking
- waitlist and seat handling
- final Classgrid account creation during enrollment

However, the reviewed code also shows that several controller/schema contracts are still misaligned. The main junior-college-specific risks are:

- strategy-key mismatch for `junior_college_with_div` and `junior_college_no_div`
- form-schema contract mismatch
- enrollment branch misclassification for the variant structure names
- missing dedicated `state_board_csv` export implementation
- flat-field dependence in the merit engine

So the correct engineering statement is:

> The junior-college admission engine is real and functionally substantial in backend code, but the structure-type mapping and export contracts still need correction before it can be described as fully clean end-to-end.
