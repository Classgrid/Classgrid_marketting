# Examinations & Results

Classgrid has two exam engines that work together:

1. **Exam Scheduling System** — Supabase-backed exam creation, timetable management, and AI-powered PDF timetable extraction (`exam.routes.js`)
2. **Marks & Results System** — MongoDB-backed Excel upload, marks entry, grading, ranking, analytics, multi-subject result processing, and report cards (`marks.routes.js`)

---

## Part 1: Exam Scheduling (`exam.routes.js`)

### Create an Exam

**API:** `POST /api/exams/`  
**Roles:** `org_admin`  
**Storage:** Supabase `exams` table

Body:
```json
{
  "exam_name": "End Semester Exam - Dec 2026",
  "type": "college",
  "date_from": "2026-12-01",
  "date_to": "2026-12-15",
  "exam_fee": 500,
  "fee_enabled": true
}
```

Fields stored: `org_id`, `exam_name`, `type`, `date_from`, `date_to`, `exam_fee`, `fee_enabled`, `created_by`, `status` (default: `upcoming`)

### List Exams

**API:** `GET /api/exams/`  
**Roles:** Any authenticated user  
Returns all exams for the organization, ordered by `created_at` descending.

### Get Exam + Timetable

**API:** `GET /api/exams/:id`  
**Roles:** Any authenticated user  
Returns exam details + all timetable entries from `exam_timetable_entries` table, ordered by `exam_date` ascending.

### Delete Exam

**API:** `DELETE /api/exams/:id`  
**Roles:** `org_admin`

### AI-Powered Timetable Extraction from PDF

**API:** `POST /api/exams/:id/parse-timetable`  
**Roles:** `org_admin`  
**Upload:** PDF file (max 10MB, multer memory storage)

Workflow:
1. Extracts raw text from uploaded PDF using `pdf-parse` (capped at 8000 characters)
2. Sends text to **Groq AI** (model: `llama3-70b-8192`, temperature: 0.1) with a structured prompt
3. AI returns a JSON array of timetable entries with: `subject`, `exam_date` (YYYY-MM-DD), `day_of_week`, `start_time` (HH:MM 24h), `end_time`, `room`
4. Entries are validated (must have `subject` + `exam_date`)
5. Returns parsed entries for admin review before saving

### Save Timetable Entries

**API:** `POST /api/exams/:id/timetable`  
**Roles:** `org_admin`

- Deletes existing entries for this exam (full replace)
- Inserts new rows into `exam_timetable_entries` table
- Auto-updates the exam's `date_from` and `date_to` from the entry dates

### Edit/Delete Timetable Rows

- **Edit:** `PUT /api/exams/:id/timetable/:entryId` — updates `subject`, `exam_date`, `day_of_week`, `start_time`, `end_time`, `room`
- **Delete:** `DELETE /api/exams/:id/timetable/:entryId`

### Exam Fee Management

- **Set Fee:** `POST /api/exams/:id/fees/set` — updates `exam_fee` and `fee_enabled` on the exam
- **View Fee Status:** `GET /api/exams/:id/fees` — returns all `exam_fees` records with `paid`/`unpaid` summary

---

## Part 2: Marks & Results System (`marks.routes.js`)

**Plan Required:** PRO plan (enforced via `requirePlan("PRO")` middleware)

### Step 1: Upload Excel File

**API:** `POST /api/marks/upload/:classroomId`  
**Roles:** Classroom owner (faculty)  
**Upload:** `.xlsx`, `.xls`, or `.csv` file (max 5MB)

Body (multipart):
- `file` — the Excel file
- `title` — exam title (required)
- `examType` — `unit_test` | `semester` | `midterm` | `other`
- `totalMarks` — must be a positive number
- `passingMarks` — optional (default: 0)
- `prnColumn`, `marksColumn`, `nameColumn` — optional overrides for column detection

Workflow:
1. Parses Excel using `parseExcelFile()` service
2. Auto-detects columns via `autoDetectColumns()` — looks for headers matching PRN/Roll No patterns and Marks patterns
3. Matches Excel rows to enrolled students using `mapStudentsToExcel()` — cross-references PRN/roll numbers against `ClassroomMembership` records
4. Creates an `ExamRecord` in `processing` status with `mappingStats`
5. Returns preview: matched students, unmatched rows, duplicates, and detected column mappings

### Step 2: Confirm & Save Marks

**API:** `POST /api/marks/confirm/:examId`  
**Roles:** Exam creator (faculty)

Body:
```json
{
  "matched": [
    { "studentId": "<mongo_id>", "studentPRN": "2024001", "marksObtained": 85 },
    { "studentId": "<mongo_id>", "studentPRN": "2024002", "marksObtained": 72 }
  ]
}
```

Workflow:
1. Creates `StudentMark` documents for each matched student with:
   - `marksObtained`, `totalMarks`, `percentage` (calculated)
   - `grade` — calculated via `calculateGrade()` service
   - `isPassed` — true if marks ≥ passingMarks (or percentage ≥ 45% if no passing marks set)
2. Assigns ranks via `assignRanks()` — sorted by marks obtained descending
3. Calculates class analytics via `calculateAnalytics()`:
   - `classAverage`, `highest`, `lowest`, `passPercentage`
   - `gradeDistribution` — count per grade
4. Updates `ExamRecord.status` to `active` and stores analytics
5. Sends push notifications to students: "Results for '[title]' are now available (Grade: X)"

### View Exams for a Classroom

**API:** `GET /api/marks/classroom/:classroomId`  
**Roles:** Classroom teacher or enrolled student  
Returns list of exams with title, type, total marks, class average, and highest score.

### View All Exams (Teacher/Admin)

**API:** `GET /api/marks/classroom/all`  
**Roles:** `faculty`, `org_admin`, `super_admin`  
Faculty sees only their exams; admins see all exams for the organization.

### Full Exam Detail + All Marks

**API:** `GET /api/marks/exam/:examId`  
**Roles:** Exam creator  
Returns exam record + all student marks (populated with name, email, PRN), sorted by rank.

### Exam Analytics

**API:** `GET /api/marks/exam/:examId/analytics`  
**Roles:** Exam creator  
Returns `classAverage`, `highest`, `lowest`, `passPercentage`, `gradeDistribution`.

### Student's Own Marks

**API:** `GET /api/marks/student/me`  
**Roles:** Authenticated student  

Returns marks grouped by classroom:
```json
{
  "classrooms": [
    {
      "classroomName": "FY BSc Div A",
      "subject": "Physics",
      "marks": [
        {
          "examTitle": "Unit Test 1",
          "marksObtained": 85,
          "totalMarks": 100,
          "percentage": 85,
          "grade": "A",
          "rank": 3,
          "isPassed": true
        }
      ]
    }
  ],
  "organization": { "name": "XYZ College", "logoUrl": "..." }
}
```

### Edit Individual Mark (with Audit Trail)

**API:** `PUT /api/marks/exam/:examId/mark/:markId`  
**Roles:** Exam creator

- Pushes old state to `mark.history[]` array (full audit trail)
- Recalculates percentage, grade (using `OrgResultPolicy` from Supabase), and pass status
- Increments `mark.version`
- Creates a `ResultAuditLog` entry: `{ action: "mark_overridden", details: "..." }`
- Recalculates ranks for all students in the exam
- Recalculates class analytics

### Delete Exam

**API:** `DELETE /api/marks/exam/:examId`  
**Roles:** Exam creator  
Deletes all `StudentMark` documents first (orphan prevention), then deletes the `ExamRecord`.

### Download Excel Template

**API:** `GET /api/marks/download-template`  
**Roles:** Any authenticated PRO user  
Returns a `.xlsx` file with sample columns: `PRN`, `Student Name`, `Marks Obtained`.

---

## Result Calculation Policy

### Get Policy

**API:** `GET /api/marks/policy`  
**Roles:** PRO plan users  
Returns the organization's `OrgResultPolicy` from Supabase with:
- `calculationMethod` — `percentage` | `grade` | `cgpa`
- `passPercentage` — default 40
- `gradeRules` — array of `{ minPct, maxPct, grade, gradePoint }`

### Save Policy

**API:** `PUT /api/marks/policy`  
**Roles:** `org_admin`, `super_admin`  
Upserts the policy for the organization.

---

## Subject Management

- **List subjects:** `GET /api/marks/subjects` — returns all `OrgSubject` documents for the org
- **Create subject:** `POST /api/marks/subjects` — creates with `subjectName`, `maxMarks`, optional `classroomId`

---

## Key Models

| Model | Storage | Purpose |
|---|---|---|
| `ExamRecord` | MongoDB | Exam metadata, analytics, mapping stats |
| `StudentMark` | MongoDB | Individual student result with grade, rank, history |
| `ResultAuditLog` | MongoDB | Audit trail for mark edits |
| `OrgSubject` | MongoDB | Organization's subject catalog |
| `OrgResultPolicy` | Supabase | Grading rules and calculation method |
| `exams` | Supabase | Exam scheduling and timetable |
| `exam_timetable_entries` | Supabase | Per-subject exam schedule |
| `exam_fees` | Supabase | Exam fee payment tracking |

---

## Role Permissions

| Role | Create Exam | Upload Marks | View Results | Edit Marks | Delete Exam |
|---|---|---|---|---|---|
| Org Admin | ✅ | ❌ | ✅ (all) | ❌ | ❌ |
| Faculty (classroom owner) | ❌ | ✅ | ✅ (own classes) | ✅ | ✅ |
| Student | ❌ | ❌ | ✅ (own marks) | ❌ | ❌ |
