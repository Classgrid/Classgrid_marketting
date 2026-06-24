# Upgrade Result Engine to University ERP Standard (Supabase Architecture)

Based on the latest deep-dive, we are **abandoning** the idea of upgrading the MongoDB `StudentMark.js` model. That model will remain for basic school-level unit tests. 

Instead, we will upgrade the newer, more powerful **Supabase (PostgreSQL) Result Engine** found in `result.routes.js`. It already handles SGPAs and Credits, but it's missing the final layer of ERP capabilities (Relative Grading, S3 URLs, Backlog flags, and Audit tracking).

## User Review Required

> [!IMPORTANT]
> This plan shifts our focus entirely from MongoDB to PostgreSQL (Supabase) + Node.js. Please review the SQL migrations and API changes below to ensure they perfectly align with your vision for the ERP result engine.

## Proposed Changes

---

### 1. Database Migrations (Supabase SQL) - For Universities
We need to execute the following SQL commands in Supabase to add the missing EduPlus-style fields to the existing result tables for Engineering/Degree colleges.

#### [NEW SQL] `result_engine_upgrades.sql`
```sql
-- 1. Upgrade result_subjects table (Pass marks, Course Codes)
ALTER TABLE result_subjects 
ADD COLUMN course_code VARCHAR(50),
ADD COLUMN pass_marks INT DEFAULT 40;

-- 2. Upgrade result_marks table (Internal/External split & Flags)
ALTER TABLE result_marks 
ADD COLUMN internal_marks DECIMAL(5,2),
ADD COLUMN external_marks DECIMAL(5,2),
ADD COLUMN is_backlog BOOLEAN DEFAULT FALSE,
ADD COLUMN passed_in_reexam BOOLEAN DEFAULT FALSE,
ADD COLUMN ordinance_applied VARCHAR(100); -- e.g., "Ordinance 8"

-- 3. Upgrade results table (Snapshotting & Identity Freezing)
ALTER TABLE results 
ADD COLUMN seat_no VARCHAR(100),
ADD COLUMN snapshot_student_name VARCHAR(255),
ADD COLUMN snapshot_prn VARCHAR(100),
ADD COLUMN snapshot_abc_id VARCHAR(50),
ADD COLUMN snapshot_program VARCHAR(150),
ADD COLUMN snapshot_college VARCHAR(255);

-- 4. Create Audit Log table for correction tracking
CREATE TABLE result_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scheme_id UUID REFERENCES result_schemes(id),
    student_id VARCHAR(255), -- Reference to Mongo User ID
    changed_by UUID, -- Reference to Admin who made the change
    reason TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

### 2. MongoDB Schema Addition - For Schools & Junior Colleges (LKG to 12th)

Since Supabase will handle the complex University math, we need a dedicated document schema in MongoDB for School/Junior College report cards. The old `StudentMark.js` is too basic.

#### [NEW] `server/src/models/SchoolReportCard.js`
This schema will capture the flexible, term-based structure required for schools.
- **Identity Snapshot**: `academicYear`, `standard`, `division`, `stream` (Science/Commerce/Arts).
- **Term Structure**: Array of terms (e.g., Term 1, Term 2, Unit Tests).
- **Assessment Components**: Theory, Practical, Oral, Notebook, Project splits per subject.
- **Pass Rules**: Separate theory and practical pass validation (crucial for 11th/12th Science).
- **Qualitative Grading**: Support for LKG/UKG remarks ("Needs Improvement", "Excellent").
- **Co-Scholastic Areas**: Array for grading handwriting, sports, discipline, hygiene.
- **Attendance**: `totalWorkingDays`, `presentDays`, `attendancePercentage`.
- **Final Outcomes**: `promotionStatus` (Promoted/Detained), `classTeacherRemark`, `principalRemark`.

---

### 3. Grading Algorithm Upgrades (True Relative Grading)

#### [MODIFY] `server/src/routes/result.routes.js`
We will rewrite the generation logic to use true statistical relative grading:
- Instead of using the static `grade_scale`, we will calculate the **Class Average (Mean)** and **Standard Deviation** for each `subject_id` across all students.
- We will dynamically map grades based on SPPU statistical cutoffs (e.g., `Mean + 1.5*SD = O`).
- We will correctly handle Internal vs External marks and calculate SGPA appropriately using the new `credit_earned` logic for failed subjects.

---

### 4. API & JSON Presentation Layer (The Missing ERP Payload)

#### [MODIFY] `server/src/routes/result.routes.js` (GET `/schemes/:id/results`)
We will rewrite the API endpoint to construct the *exact* JSON blueprint you found from EduPlusCampus.
- Construct the `spiarray` (Semester progression array).
- Generate dynamic Cloudflare R2 Pre-signed URLs (S3 compatible) for `photourl`, `logo`, and `examSignature`.
- Generate QR codes dynamically using the `api.qrserver.com` endpoint (`qrimageMultipleNew`).
- Inject the Display Configuration flags (e.g., `displaytransitionalgrade: true`, `relativegrading: true`).

---

### 5. Robust Data Ingestion (Excel/CSV)

#### [MODIFY] `server/src/routes/result.routes.js` (POST `/upload-csv`)
- Replace the brittle `.split(',')` logic.
- Integrate `xlsx` to parse real Excel files uploaded by teachers, allowing them to map columns for `Internal Marks`, `External Marks`, and `Total Marks` seamlessly.

---

### 6. Teacher Ownership Validation

#### [MODIFY] `server/src/routes/result.routes.js` (POST `/upload-marks`)
- Add strict validation checking: Does `req.user._id` match the `teacher_id` assigned to the `result_subjects` table? If not, throw a `403 Forbidden`.

---

## Verification Plan
1. Run the SQL migrations in Supabase.
2. Upgrade `result.routes.js` to implement statistical grading and generate the exact EduPlus JSON payload.
3. Test by generating a mock result and verifying it matches the `erp_result_system_blueprint` exactly.
