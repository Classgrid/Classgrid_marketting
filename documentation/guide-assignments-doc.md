Classgrid's Assignment module handles creation, submission, grading, and analytics for classroom assignments. All assignment data is stored in **Supabase/Postgres** (`assignments`, `assignment_submissions` tables), while classroom membership and student identity are resolved from **MongoDB**.

---

## Creating Assignments (Teacher)

**API:** `POST /api/assignments/:classroomId`  
**Roles:** Classroom owner (enforced via `requireClassroomOwner` middleware)

Body:
```json
{
  "title": "Unit 3 — Data Structures Essay",
  "description": "Write a 2000-word essay on AVL trees vs Red-Black trees.",
  "dueDate": "2026-09-15T23:59:00Z",
  "maxPoints": 100,
  "attachments": [
    { "name": "rubric.pdf", "url": "https://storage.supabase.co/..." }
  ],
  "blockLate": true
}
```

**Holiday Guard:** Before creating, the system checks `isHoliday(today, orgId)`. If today is a holiday, creation is blocked with:
```json
{
  "message": "Today is a holiday (Ganesh Chaturthi). Assignments cannot be created on holidays.",
  "code": "HOLIDAY_BLOCKED"
}
```

After creation:
- Sends **bulk push notifications** to all enrolled students in the classroom via `bulkDispatchNotification`
- Title: "📚 New Assignment"
- Message: "A new assignment '[title]' has been posted"

---

## Student Views

### Global Assignment List (All Classes)

**API:** `GET /api/assignments/global/me`  
**Roles:** Any authenticated student or teacher

**For Students:** Returns assignments across all enrolled classrooms with submission status:

```json
{
  "assignments": [
    {
      "_id": "uuid",
      "title": "Unit 3 — Data Structures Essay",
      "dueDate": "2026-09-15T23:59:00Z",
      "maxPoints": 100,
      "classroom": { "_id": "...", "name": "FY BSc Div A", "subject": "Computer Science" },
      "isSubmitted": true,
      "status": "submitted",
      "submission": { "_id": "uuid", "grade": 85, "status": "returned" },
      "isMissing": false
    }
  ]
}
```

**Status logic:**
- `submitted` — submitted before deadline
- `late` — submitted after deadline
- `missing` — not submitted AND past due date
- `pending` — not submitted AND before due date

**For Teachers:** Returns their assignments across all classes with `submittedCount` per assignment.

### Single Assignment Detail

**API:** `GET /api/assignments/:assignmentId`  
**Roles:** Classroom teacher or enrolled student

**Student view:** Returns assignment details + their own submission (if any) with `submittedFile`, `grade`, `feedback`, `status`.

**Teacher view:** Returns assignment details + all student submissions with:
- Student info (name, email, profile picture) from MongoDB
- Submission status: `Submitted`, `Late`, `Not Submitted`
- Late detection: compares `submitted_at` against `due_date` end-of-day (23:59:59.999)
- Sort order: submitted first (by date), then not-submitted (alphabetical by name)

---

## Submitting Assignments (Student)

**API:** `POST /api/assignments/:assignmentId/submit`  
**Roles:** Enrolled student (verified via `ClassroomMembership`)

Body:
```json
{
  "originalName": "essay_avl_trees.pdf",
  "fileUrl": "https://storage.supabase.co/...",
  "fileType": "application/pdf"
}
```

**Guards:**
1. **Late submission block:** If `block_late === true` and current time > `due_date`, returns HTTP 403:
   ```json
   { "message": "Submissions are closed — the deadline has passed.", "code": "DEADLINE_CLOSED" }
   ```
2. **Holiday guard:** If today is a holiday, submissions are blocked:
   ```json
   { "message": "Today is a holiday. Assignment submissions are paused during holidays.", "code": "HOLIDAY_BLOCKED" }
   ```

**Upsert behavior:** Uses Supabase `upsert` with conflict on `(assignment_id, student_id)` — resubmission overwrites the previous file.

Status is automatically set to `late` if submitted after `due_date` end-of-day.

### Unsubmit (Retract Submission)

**API:** `DELETE /api/assignments/:assignmentId/unsubmit`  
**Roles:** Enrolled student

- Blocked if the submission has already been graded (`grade != null`)
- Returns: "Cannot unsubmit — assignment has already been graded"

---

## Grading (Teacher)

### Grade Individual Submission

**API:** `POST /api/assignments/:assignmentId/grade/:submissionId`  
**Roles:** Assignment creator (teacher)

Body:
```json
{
  "grade": 85,
  "feedback": "Excellent analysis of AVL rotations. Consider adding time complexity comparison."
}
```

After grading:
- Updates submission `status` to `returned` and sets `graded_at` timestamp
- Sends push notification to student: "✅ Assignment Graded — Your assignment '[title]' has been graded: 85 points."

### Bulk Grade

**API:** `POST /api/assignments/:assignmentId/grade-bulk`  
**Roles:** Assignment creator (teacher)

Body:
```json
{
  "grades": [
    { "submissionId": "uuid1", "grade": 85, "feedback": "Good work" },
    { "submissionId": "uuid2", "grade": 72, "feedback": "Needs improvement" },
    { "submissionId": "uuid3", "grade": 91, "feedback": "Outstanding" }
  ]
}
```

- Grades are clamped between 0 and `max_points`
- Processes sequentially; returns count of successes and any errors
- Returns: "Graded 45 submission(s), 2 failed"

---

## Editing & Deleting Assignments

### Edit Assignment

**API:** `PUT /api/assignments/:assignmentId`  
**Roles:** Assignment creator (teacher)

Updatable fields: `title`, `description`, `dueDate`, `maxPoints`, `attachments`

### Delete Assignment

**API:** `DELETE /api/assignments/:assignmentId`  
**Roles:** Assignment creator (teacher)

Deletes the assignment — submissions are automatically cascade-deleted via Supabase `ON DELETE CASCADE`.

---

## Database Tables (Supabase)

| Table | Key Columns |
|---|---|
| `assignments` | `classroom_id`, `teacher_id`, `organization_id`, `title`, `description`, `due_date`, `max_points`, `attachments` (JSONB), `block_late`, `status` |
| `assignment_submissions` | `assignment_id`, `student_id`, `classroom_id`, `organization_id`, `submitted_file` (JSONB), `status`, `grade`, `feedback`, `submitted_at`, `graded_at` |

**Unique constraint on submissions:** `(assignment_id, student_id)` — one submission per student per assignment.

---

## Role Permissions

| Role | Create | Submit | Grade | Edit | Delete | View |
|---|---|---|---|---|---|---|
| Faculty (classroom owner) | ✅ | ❌ | ✅ | ✅ | ✅ | All submissions |
| Student (enrolled) | ❌ | ✅ | ❌ | ❌ | ❌ | Own submission |
| Org Admin | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
