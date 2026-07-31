# ENGINEERING CET ADMISSION ENGINE
> Backend-verified module specification for Classgrid  
> Scope: `org_type = engineering` with `structure_type = engineering`, `engineering_with_div`, and `engineering_no_div`  
> Validation rule: written only after manually reading plans plus backend models, routes, controllers, middleware, and services

This document is written from the reviewed planning documents and backend code. No unsupported marketing claims are included. The engineering module is the CET-oriented admission path, but the reviewed backend also contains post-CAP ACAP operations for `spot`, `institutional`, and `management` rounds.

---

## 1. Review Basis

### Planning documents reviewed

- `CLASSGRID_ULTIMATE_PLAN.md`
- `docs/CLASSGRID_MASTER_IMPLEMENTATION_PLAN.md`
- `docs/CLASSGRID_ADMISSION_PLAN.md`
- `docs/CLASSGRID_CET_ADMISSION_PLAN.md`
- `docs/plan/ADMISSION_ENGINE_SCHEDULE.md`
- `docs/artifacts/implementation_plan.md`

### Backend files reviewed

#### Models

- `server/src/models/Organization.js`
- `server/src/models/AcademicHierarchy.js`
- `server/src/models/CETAllotment.js`
- `server/src/models/AdmissionApplication.js`
- `server/src/models/AdmissionOTP.js`
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

#### Middleware

- `server/src/middleware/admission-auth.middleware.js`
- `server/src/middleware/admission-roles.middleware.js`
- `server/src/middleware/auth.middleware.js`

#### Admission services and utilities

- `server/src/services/admissions/strategy-selector.js`
- `server/src/services/admissions/admission-form-builder.service.js`
- `server/src/services/admissions/admission-workflow.service.js`
- `server/src/services/admissions/prn-generator.service.js`
- `server/src/services/admissions/govt-export.service.js`
- `server/src/services/admissions/seat-matrix.service.js`
- `server/src/services/admissions/division-allocator.service.js`
- `server/src/services/admissions/merit-engine.service.js`
- `server/src/utils/admission-en-validator.js`

---

## 2. Module Scope

This engineering module is the CET-backed admission path for engineering colleges. In the reviewed plans and backend, it is represented by:

- `Organization.org_type = "engineering"`
- `Organization.structure_type = "engineering"`, `"engineering_with_div"`, or `"engineering_no_div"`
- `Organization.allow_sub_batches` for engineering lab/batch splitting
- `Organization` comments explicitly map engineering to `Plan 1`
- `AcademicHierarchy` comments explicitly define engineering as:
  - `Degree -> Department -> Year -> Semester -> Division -> SubBatch`

The current engineering strategy in `strategy-selector.js` is:

| Field | `engineering` |
|---|---|
| `auth_method` | `cet_en_otp` |
| `ranking_type` | `cap_round` |
| `seat_types` | `CAP`, `INSTITUTIONAL`, `MANAGEMENT`, `SPOT` |
| `entry_modes` | `CET`, `DESK` |
| `workflow_variant` | `cet_pipeline` |
| `requires_printout` | `false` |
| `govt_exports` | `dte_csv`, `aicte_csv` |
| `supports_rla` | `true` |
| `supports_cap_upgrade` | `true` |

Important engineering note:

- `strategy-selector.js` now defines variant aliases for:
  - `engineering_with_div`
  - `engineering_no_div`
- so `getAdmissionStrategy()` does not throw for those engineering variants

---

## 3. Database Architecture

### 3.1 Organization-level engineering admission configuration

Engineering CET flow is governed by `Organization.admission_config`.

| Path | Type | Verified purpose in backend |
|---|---|---|
| `admission_config.is_portal_open` | `Boolean` | Master gate for CET validation and candidate sessions |
| `admission_config.registration_fee` | `Number` | Registration fee configuration |
| `admission_config.instructions` | `String` | Portal guidance text |
| `admission_config.application_config.document_validity_days` | object | Document age limits checked during upload |
| `admission_config.enrollment_config.editable_until` | `Date` | Deadline for edits and uploads |
| `admission_config.admission_round.current_round` | `Number` | Multi-round tracking field |
| `admission_config.admission_round.max_rounds` | `Number` | Maximum round count |
| `admission_config.admission_round.round_history[]` | array | Round history snapshots |
| `admission_config.seat_matrix_policy` | object | Quota/category policy storage |
| `admission_config.tie_breaker_rules[]` | array | Tie-break storage |
| `admission_config.waitlist_and_deadlines` | object | Waitlist and deadline config storage |
| `admission_config.form_builder_config.field_toggles[]` | array | Field toggles for engineering admission |
| `admission_config.form_builder_config.document_toggles[]` | array | Document toggles |
| `admission_config.form_builder_config.custom_fields[]` | array | Org-defined custom engineering fields |
| `admission_config.fee_config` | object | Fee and refund policy storage |

### 3.2 Strategy defaults for engineering forms

`strategy-selector.js` contains `ORG_TYPE_DEFAULTS.engineering`, which enables the heaviest default form footprint in the admission system.

Verified engineering defaults include:

- full student identity fields
- parent and guardian fields
- caste, minority, disability, and ex-serviceman fields
- permanent and current address fields
- emergency and local-guardian fields
- hostel fields
- academic IDs like `eligibility_number`, `abc_id`, `university_prn_number`
- academic history fields including:
  - `10th_board`
  - `10th_percentage`
  - `12th_board`
  - `12th_percentage`
  - `pcm_percentage`
- CET-specific fields:
  - `en_number`
  - `cet_score`
  - `seat_type`
  - `branch_allotted`
  - `cap_round`

Default engineering documents in that file are:

- `allotment_letter`
- `12th_marksheet`
- `student_aadhar`
- `caste_certificate`
- `income_certificate`
- `domicile_certificate`
- `gap_certificate`
- `migration_certificate`
- `passport_size_photo`
- `anti_ragging_affidavit`

### 3.3 Read-only CET import record

Imported CAP/allotment records are stored in `CETAllotment`.

| Field | Type | Engineering CET relevance |
|---|---|---|
| `organization_id` | `ObjectId` | Tenant boundary |
| `cap_round` | enum | `CAP-I`, `CAP-II`, `CAP-III`, `CAP-IV`, `INSTITUTE`, `SPOT`, `MGMT` |
| `en_number` | `String` | CET identity key |
| `candidate_name` | `String` | Candidate name from imported data |
| `merit_number` | `Number` | State merit number |
| `mht_cet_score` | `Number` | CET score |
| `gender` | enum | `M`, `F`, `O` |
| `category` | enum | DTE-style reservation category |
| `candidature_type` | enum | `Type-A` through `Type-E`, `All-India`, `Minority`, `NRI/OCI/PIO`, `J&K/Ladakh` |
| `defence_type` | enum | Defence quota type |
| `person_with_disability` | `Boolean` | Horizontal quota flag |
| `supernumerary_quota` | enum | `EWS`, `TFWS`, `Orphan`, etc. |
| `seat_type` | `String` | Allotted seat type |
| `academic_eligibility` | object | PCM eligibility evaluation |
| `institute_code` | `String` | Institute code |
| `choice_code` | `String` | Branch/course choice code |
| `branch_name` | `String` | Branch name from imported data |
| `status` | enum | Imported-to-enrolled lifecycle tracking field |
| `rla_status` | enum | `pending`, `reported`, `confirmed`, `upgraded`, `cancelled` |
| `upgrade_eligibility` | object | CAP upgrade consent metadata |
| `noc_details` | object | NOC metadata for transfer out |
| `upgrade_transfer` | object | Upgrade transfer metadata |
| `document_verification` | object | Original-document review structure |
| `fee_details` | object | Fee/quota result fields |
| `collected_email` | `String` | Candidate email collected later |
| `email_verified` | `Boolean` | Email verified marker |
| `linked_user_id` | `ObjectId` | Final linked `User` |
| `prn` | `String` | Final PRN |
| `division` | `String` | Final division |
| `roll_number` | `Number` | Final roll number |
| `college_email` | `String` | Final college email |

### 3.4 Core engineering applicant record

Each engineering applicant is stored in `AdmissionApplication`.

| Field | Type | Engineering relevance |
|---|---|---|
| `organization_id` | `ObjectId` | Tenant boundary |
| `hierarchy_id` | `ObjectId` | Links to a degree/department/year/semester hierarchy node |
| `entry_mode` | enum | `CET`, `DESK`, or `PORTAL` |
| `status` | enum | Applicant lifecycle state |
| `en_number` | `String` | CET identity key on the application |
| `email` | `String` | Candidate contact field |
| `credentials.verified_main_email` | `String` | Verified login email candidate |
| `merit_score` | `Number` | Ranking score if merit tools are used |
| `category` | `String` | Category input |
| `seat_type` | `String` | Seat bucket like `CAP`, `MANAGEMENT`, `INSTITUTIONAL`, `SPOT` |
| `rla_status` | enum | Application-side RLA gate field |
| `allotment_history[]` | array | CAP/branch/seat movement history |
| `documents[]` | array | Uploaded documents |
| `payment_details` | object | Declared fee and Razorpay schema |
| `student_id` | `ObjectId` | Final linked `User` record |
| `prn` | `String` | Final PRN |

### 3.5 Academic structure and engineering hierarchy

Engineering hierarchy uses `AcademicHierarchy`.

| Model detail | Verified meaning |
|---|---|
| `level_type = degree` | Engineering degree node |
| `level_type = department` | Department/branch node |
| `level_type = year` | Academic year node |
| `level_type = semester` | Semester node |
| `level_type = division` | Section/division node |
| `level_type = sub_batch` | Engineering lab-batch split under a division |

### 3.6 OTP and identity support

`AdmissionOTP` supports the engineering EN flow through:

- `en_number`
- `email`
- `purpose = "en_validation"`
- `expires_at` TTL deletion

### 3.7 Final enrollment target and PRN engine

| Model / service | Verified role |
|---|---|
| `User` | Final Classgrid ERP account after enrollment |
| `prn-generator.service.js` | Template-based PRN generation using `{YEAR}`, `{BRANCH_CODE}`, `{SERIAL:N}`, `{DIVISION}`, `{REJOIN_FLAG}` |
| `FeeStructure` / `StudentFeeLedger` / `FeeTransaction` | Engineering fee and receipt records |

---

## 4. Route Surface For The Engineering CET Module

### 4.1 CET candidate entry routes

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `POST` | `/api/admission/cet/validate-en` | none | Validate EN number against imported allotment data |
| `POST` | `/api/admission/cet/send-otp` | none | Send OTP to the email entered after EN validation |
| `POST` | `/api/admission/cet/verify-otp` | none | Verify email OTP and create/return engineering admission session |

### 4.2 Candidate session routes used after CET login

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `POST` | `/api/admission/save-draft` | none | Save draft engineering application after session creation |
| `POST` | `/api/admission/submit` | none | Final submit via candidate session |
| `GET` | `/api/admission/docs/checklist` | none | Candidate document checklist |
| `POST` | `/api/admission/docs/upload` | none | Candidate document upload |
| `GET` | `/api/admission/candidate/docs/view` | query `path` | Candidate signed document-view link |
| `POST` | `/api/admission/pay/initiate` | none | Start fee order |
| `POST` | `/api/admission/pay/verify` | none | Verify payment callback from candidate session |
| `POST` | `/api/admission/candidate/withdraw/:id` | `:id` | Candidate withdrawal route |

### 4.3 Admin engineering routes

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `POST` | `/api/admission/cet/import` | none | Import CET allotment data from Excel/CSV |
| `GET` | `/api/admission/config` | none | Fetch engineering admission config |
| `PATCH` | `/api/admission/config` | none | Replace engineering admission config |
| `POST` | `/api/admission/config/preset` | none | Inject preset config |
| `PATCH` | `/api/admission/admin/verify-doc` | none | Verify/reject uploaded documents |
| `POST` | `/api/admission/desk-enroll` | none | Walk-in desk enrollment path |
| `GET` | `/api/admission/export/dte` | query `cap_round`, `status`, `academic_year` | DTE export |
| `GET` | `/api/admission/export/aicte` | query `status`, `academic_year` | AICTE export |
| `POST` | `/api/admission/enroll` | none | Final enrollment and Classgrid `User` creation |
| `PATCH` | `/api/admission/cet/:en/allot-division` | `:en` | Set division and optional roll number |
| `PATCH` | `/api/admission/cet/:en/mark-upgraded` | `:en` | Mark application upgraded to another college |
| `POST` | `/api/admission/cet/:en_number/report` | `:en_number` | Mark physical reporting / RLA |
| `POST` | `/api/admission/cet/:en_number/request-noc` | `:en_number` | Issue NOC and release seat |
| `POST` | `/api/admission/cet/:en_number/confirm-upgrade` | `:en_number` | Confirm incoming upgrade transfer |
| `GET` | `/api/admission/cet/dashboard` | none | Engineering-specific dashboard |
| `POST` | `/api/admission/allocate-divisions` | none | Run division allocation |
| `POST` | `/api/admission/generate-prns` | none | Batch PRN generation |
| `POST` | `/api/admission/notify` | none | Manual notification dispatch |
| `GET` | `/api/admission/sms-budget` | none | SMS budget tracker |
| `GET` | `/api/admission/analytics` | query `hierarchy_id` | Funnel analytics |
| `PATCH` | `/api/admission/applications/:id/stage` | `:id` | Manual stage update |
| `POST` | `/api/admission/admin/bulk-verify` | none | Bulk set verified state |
| `POST` | `/api/admission/admin/bulk-select` | none | Bulk move candidates to fee stage |
| `POST` | `/api/admission/round/advance` | none | Advance admission round |

### 4.4 ACAP and live operations routes

| Method | Route | Route variables | Verified purpose |
|---|---|---|---|
| `POST` | `/api/admission/acap/register` | none | Public ACAP registration for `spot`, `institutional`, or `management` |
| `POST` | `/api/admission/acap/generate-merit` | none | Generate ACAP merit list |
| `POST` | `/api/admission/acap/verify-gate` | none | Gate verification and boarding token issuance |
| `GET` | `/api/admission/merit-list/live` | query `org_id`, `hierarchy_id`, `category`, `limit` | Public cached live merit list |
| `GET` | `/api/admission/broadcast/merit-list/:hierarchyId` | `:hierarchyId` | Live ranked list |
| `GET` | `/api/admission/broadcast/seat-matrix` | none | Live seat matrix |
| `POST` | `/api/admission/broadcast/call-candidate` | none | Mark candidate as called and broadcast |

---

## 5. Verified Backend Logic

### 5.1 Engineering hierarchy and structure variants

The engineering org model supports:

- `engineering`
- `engineering_with_div`
- `engineering_no_div`

The hierarchy comments define the engineering tree as:

```text
Degree -> Department -> Year -> Semester -> Division -> SubBatch
```

This is the most complex admission hierarchy among the reviewed modules.

### 5.2 CET authentication flow

The reviewed engineering CET entry path is:

1. `POST /api/admission/cet/validate-en`
2. `POST /api/admission/cet/send-otp`
3. `POST /api/admission/cet/verify-otp`
4. Candidate session routes:
   - `/save-draft`
   - `/submit`
   - `/docs/upload`
   - `/pay/initiate`

`validateENNumber()` enforces:

- format: `EN + Year + CollegeCode + Serial + Checksum`
- current-cycle year rule
- institute-code match when provided
- MOD-11 checksum validation

### 5.3 CET workflow variant

Engineering strategy uses:

- `workflow_variant = "cet_pipeline"`

The CET transition map in `admission-workflow.service.js` is:

```text
draft
  -> applied
applied
  -> under_verification
  -> withdrawn
under_verification
  -> verified
  -> withdrawn
verified
  -> rla_pending
  -> withdrawn
rla_pending
  -> fee_pending
  -> withdrawn
fee_pending
  -> enrolled
  -> withdrawn
enrolled
  -> upgraded
  -> withdrawn
upgraded
  -> enrolled
```

The workflow gate for CET fee movement is explicit:

- `application.rla_status` must equal `"reported"` before transition to `fee_pending`

### 5.4 CET import and auto-upgrade flagging

`importCETAllotments()` supports:

- Excel upload
- CSV upload
- raw JSON array input

It also:

- normalizes EN values to uppercase
- validates checksum and institute code
- bulk upserts allotments
- scans existing `AdmissionApplication` records for the same EN
- flags possible upgrades in `stage_history` when the same EN appears again in a later round

### 5.5 Application print data and live dashboards

The engineering backend exposes:

- `GET /api/admission/print/application/:id`
- `GET /api/admission/cet/dashboard`
- `GET /api/admission/merit-list/live`

`getApplicationPrintData()` includes engineering-specific fields such as:

- `en_number`
- `rla_status`
- `cap_round`
- `merit_number`
- `mht_cet_score`
- `choice_code`

`getCETDashboard()` attempts to return:

- CAP-round-wise totals
- branch-wise fill rates
- RLA breakdown
- current seat matrix

### 5.6 RLA, NOC, and upgrade flows

The reviewed backend has explicit engineering-only DTE-style operations:

1. `reportRLA()`
   - marks CET allotment `rla_status = "reported"`
   - stores `reported_at` and officer

2. `requestNOC()`
   - marks CET allotment `rla_status = "upgraded"`
   - stores NOC metadata

3. `confirmUpgrade()`
   - treats an incoming upgraded student as reported
   - stores upgrade-transfer metadata

4. `markCETUpgraded()`
   - updates the `AdmissionApplication`
   - sets `status = upgraded`
   - sets `rla_status = upgraded`
   - releases seat
   - suspends linked `User` if one exists

### 5.7 PRN generation and final account creation

`fullEnrollStudent()` is the final engineering enrollment path.

Verified behavior:

- seat allocation is attempted through `seatMatrixService.allocateSeat()`
- PRN is generated for college-type orgs when PRN template config is enabled
- final email resolution order is:
  - `credentials.verified_main_email`
  - `application.email`
  - phone-based synthetic alias
- password is required in the request body
- password is hashed with `bcrypt`
- final `User` gets:
  - `role = "student"`
  - `admission_type = "CAP"` when `en_number` exists
  - `prn`
  - `branch`
  - optional `abc_id`
  - optional `anti_ragging_undertaking_no`

The enrollment response can also return:

- `workspace_email` when `google_workspace_domain` is configured

### 5.8 ACAP, spot, institutional, and management operations

The reviewed backend does not stop at CAP.

It also includes:

- public ACAP registration through `acap/register`
- ACAP merit generation through `acap/generate-merit`
- auditorium/gate verification through `acap/verify-gate`

Supported ACAP types in code:

- `spot`
- `institutional`
- `management`

The ACAP registration path stores:

- `form_data.acap_type`
- `form_data.acap_registered_at`
- `form_data.scholarships_enabled`

with the verified rule:

- scholarships enabled only for `spot`
- scholarships disabled for `institutional`
- scholarships disabled for `management`

### 5.9 Generic engineering document and notification support

Engineering reuses the shared document and notification layers:

- document upload to Supabase Storage
- signed URL viewing
- document status values `pending`, `verified`, `rejected`
- notification channels:
  - email via Brevo
  - SMS via AWS SNS
  - push via Firebase FCM

---

## 6. Plan vs Current Backend Reality

### 6.1 Verified engineering capabilities present in backend

| Capability | Plan expectation | Current backend reality |
|---|---|---|
| Separate engineering module boundary | Required | Present via `org_type = engineering` and `Plan 1` hierarchy comments |
| Engineering structure variants | Required | Present for `engineering`, `engineering_with_div`, and `engineering_no_div` |
| CET EN validation | Required | Present through `validateENNumber()` and `/cet/validate-en` |
| Email OTP after EN validation | Required | Present through `/cet/send-otp` and `/cet/verify-otp` |
| CET pipeline workflow | Required | Present through `workflow_variant = cet_pipeline` |
| RLA support | Required | Present in strategy and controllers |
| CAP upgrade support | Required | Present in strategy and controllers |
| DTE export | Required | Present through `/export/dte` |
| AICTE export | Required | Present through `/export/aicte` |
| Engineering dashboard | Required | Present through `/cet/dashboard` |
| PRN generation | Required | Present through PRN generator and `/generate-prns` |
| Final Classgrid account creation | Required | Present through `/enroll` |
| Post-CAP ACAP operations | Required | Present through `acap/register`, `acap/generate-merit`, `acap/verify-gate` |

### 6.2 Verified mismatches between plan and implementation

These are code-level mismatches, not guesses.
They mean the engineering engine is substantial but still needs contract cleanup in critical CET areas.

#### A. CETAllotment field-name mismatch across model, import, and export logic

The `CETAllotment` model declares fields such as:

- `branch_name`
- `seat_type`
- `merit_number`

But multiple controllers/services read or write different names such as:

- `branch_allotted`
- `allotted_seat_type`
- `merit_no`

Affected areas include:

- `importCETAllotments()`
- `validateEN()`
- `verifyENOTP()`
- `getApplicationPrintData()`
- `generateDTEExport()`
- `getCETDashboard()`

Impact:

- imported CET fields are not consistently mapped to the schema that the rest of the engineering flow expects

#### B. `is_claimed` mismatch in CET validation and dashboard logic

The reviewed `CETAllotment` model does not declare:

- `is_claimed`

But the reviewed engineering code uses it in:

- `validateEN()`
- `sendENOTP()`
- `getCETDashboard()`

Impact:

- EN lookup and branch/round "claimed" counts are relying on a field that is not part of the reviewed model contract

#### C. RLA gate is checked on `AdmissionApplication`, but reporting updates `CETAllotment`

The CET workflow gate for moving to `fee_pending` checks:

- `application.rla_status === "reported"`

But `reportRLA()` updates:

- `CETAllotment.rla_status`

and does not update the matching `AdmissionApplication.rla_status`.

Impact:

- engineering RLA reporting is not cleanly synchronized with the actual workflow gate that controls fee progression

#### D. Full enrollment can bypass the strict CET pipeline

`fullEnrollStudent()` allows enrollment to continue when application status is already:

- `verified`
- `fee_pending`

even if `checkTransitionGates()` would otherwise fail.

Impact:

- engineering enrollment can bypass the stricter `verified -> rla_pending -> fee_pending -> enrolled` pipeline intent

#### E. Generic form-builder contract mismatch still affects engineering

`admission-form-builder.service.js` expects the strategy object to contain:

- `required_fields`
- `optional_fields`
- `document_checklist`

But `getAdmissionStrategy()` returns workflow metadata only.

Impact:

- engineering form schema generation can fail
- strategy-driven engineering validation remains only partially aligned

#### F. Engineering/direct-quota isolation is only partially clean

`applyForAdmission()` now explicitly blocks:

- `engineering`
- `engineering_with_div`
- `engineering_no_div`

and tells callers to use `/api/admission/cet/validate-en`.

That is consistent for CET-only handling.

However:

- `verifyPhoneOTP()` is still a shared route and does not block engineering orgs by structure type
- the reviewed backend therefore still has overlapping entry paths around direct phone-OTP drafts versus CET EN flow

Impact:

- engineering entry-path isolation is better than before, but not perfectly sealed across all shared auth endpoints

#### G. Institute-code path mismatch across engineering services

Some engineering CET flows read institute code from:

- `admission_config.institute_code`

while engineering export services read:

- `admission_config.engineering_config.institute_code`
- `admission_config.engineering_config.aicte_id`

Impact:

- engineering metadata paths are not fully normalized across import, validation, and export logic

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

- engineering fee confirmation is implemented, but not cleanly aligned with the declared models

#### I. Allotment history round-type mismatch

`verifyENOTP()` creates `AdmissionApplication.allotment_history` using:

- `round: allotment.cap_round`

But `AdmissionApplication.allotment_history.round` is modeled as:

- `Number`

while `cap_round` values in `CETAllotment` are strings like:

- `CAP-I`
- `CAP-II`
- `SPOT`

Impact:

- engineering allotment history is not cleanly type-aligned between model and controller logic

---

## 7. Features Explicitly Not Verified In Backend

The following engineering ideas were not found as fully implemented end-to-end backend behavior in the reviewed files, so they are not claimed here as active features:

- direct live API integration with the government CET portal
- fully synchronized `is_claimed` lifecycle on imported CET allotments
- strictly wired RLA sync from `CETAllotment` into `AdmissionApplication`
- clean end-to-end quota-home-apply flow for engineering before CET/ACAP branching
- fully normalized engineering metadata path for institute code and AICTE ID across all services

If these are needed for public copy, they should be described as planned or partially wired, not as already clean end-to-end.

---

## 8. How It Works

This engineering engine is the most advanced admission path in the reviewed backend. It handles the government-CET side, the internal college-processing side, and also the post-CAP ACAP side.

The important human explanation is simple:

- CET and CAP decide who gets allotted
- Classgrid processes the college-side steps after that
- the final Classgrid student account is created only at final enrollment

### Daily Flow Table

| Step | Student action | College admission office action | What the platform does |
|---|---|---|---|
| 1. CET allotment imported | None yet | Admin imports allotment Excel/CSV | `CETAllotment` records are created or updated |
| 2. Identity check | CET student enters EN number | None | Backend validates EN format, institute code, and imported presence |
| 3. Email verification | Student enters personal email and OTP | None | Backend sends and verifies EN-linked email OTP |
| 4. Draft application | Student fills remaining admission details | None | `AdmissionApplication` is created or resumed and draft data is saved |
| 5. Documents | Student uploads documents | Staff later verify | Files go to storage and document status is tracked |
| 6. Review | Student waits | Staff verify and manage stage movement | CET pipeline moves through verification and RLA-related states |
| 7. Reporting / RLA | Student physically reports if required | Staff mark reporting | Backend records engineering reporting actions |
| 8. Fee and seat finalization | Student pays as instructed | Staff allocate seat/division as needed | Fee flow, division allocation, and PRN generation can run |
| 9. Final enrollment | Student receives login details | Staff set password and complete enrollment | Backend creates the final Classgrid `User`, hashes password, sends credentials |

### Common Scenarios

#### Scenario A: CAP student receives allotment and completes admission

1. The college imports CET allotment data.
2. The student enters EN number.
3. The student verifies the entered email through OTP.
4. The student fills the remaining form and uploads documents.
5. The college processes reporting, fee, PRN, and final enrollment.

#### Scenario B: Student gets upgraded to a better college later

1. The application already exists in the system.
2. The college marks the student upgraded through the CET upgrade route.
3. The seat is released.
4. The student's linked Classgrid account can be suspended if one already exists.

#### Scenario C: Post-CAP spot or institutional round starts

1. The college opens ACAP registration.
2. Students register for `spot`, `institutional`, or `management`.
3. The college generates the merit list and verifies entry at the gate.
4. The live merit and seat matrix feeds can be shown to staff or projectors.

#### Scenario D: Engineering staff want to know when the ERP login is created

1. EN validation and form submission do not create the final student login.
2. The application remains an admission record first.
3. During `/api/admission/enroll`, the staff set the password.
4. Only then does the final `User` account get created in Classgrid.

#### Scenario E: A friend or parent asks "does CET directly fill everything in Classgrid?"

1. No direct government API was verified in backend.
2. The college imports CET data manually through file upload.
3. Classgrid then handles the college-side workflow after import.

### Assumptions & Clarifications

- Engineering is the `Plan 1` admission boundary in the reviewed org model.
- The engineering hierarchy supports the richest structure: degree, department, year, semester, division, and sub-batch.
- CET identity is modeled around `EN` number, not phone-first entry, in the primary engineering strategy.
- Engineering now has strategy aliases for `engineering_with_div` and `engineering_no_div`, so that specific variant lookup problem is already addressed.
- The reviewed backend also includes ACAP operations, so engineering is not limited to pre-CAP or CAP-only documentation.
- The final Classgrid student login is created at `/api/admission/enroll`, not at EN validation or OTP verification.
- Passwords are manually supplied during enrollment and stored as bcrypt hashes on the final `User`.
- PRN generation is real in backend, but it depends on org PRN template configuration.
- Government export support is engineering-specific through DTE and AICTE exporters.
- Marketing claims not backed by reviewed code were deliberately excluded.

---

## 9. Bottom-Line Assessment

The reviewed backend **does contain a real engineering CET admission engine**. The strongest verified pieces are:

- separate engineering module boundary
- engineering hierarchy variants
- EN validation with checksum logic
- email OTP after EN validation
- CET-specific workflow variant
- DTE-style reporting and upgrade routes
- DTE and AICTE export endpoints
- PRN generation and final Classgrid account creation
- ACAP, spot, institutional, and management operations

However, the reviewed code also shows that some of the most important engineering contracts still need cleanup. The main engineering-specific risks are:

- CET allotment field-name mismatch
- `is_claimed` mismatch in lookup/dashboard logic
- RLA state living on `CETAllotment` while workflow gate checks `AdmissionApplication`
- partial bypass of the strict CET pipeline during final enrollment
- generic form-builder contract mismatch
- institute-code path drift across services
- payment schema drift

So the correct engineering statement is:

> The engineering CET admission engine is real, feature-rich, and broader than just EN validation, but the allotment-model contract, RLA synchronization, and some workflow bindings still need cleanup before it can be described as fully clean end-to-end.
