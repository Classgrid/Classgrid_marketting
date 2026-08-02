# Academics & Classroom Management

Classgrid's Academics module manages the core educational structure: classrooms, membership, timetables, and the relationship between teachers, students, and subjects. The classroom system uses **MongoDB** for identity and membership and **Supabase** for classroom content (materials, announcements, quizzes).

---

## Classroom System

### Core Model: `Classroom` (MongoDB)

Each classroom represents a single class-subject pairing (e.g., "FY BSc Div A — Physics"):

| Field | Type | Description |
|---|---|---|
| `name` | String | Display name |
| `subject` | String | Subject taught |
| `subjectSlug` | String | URL-friendly subject identifier |
| `description` | String | Class description |
| `year` | String | Academic year (e.g., "FY", "SY") |
| `branch` | String | Department/branch |
| `semester` | String | Current semester |
| `division` | String | Division (e.g., "A", "B") |
| `teacher` | ObjectId → User | Classroom owner (faculty) |
| `organization_id` | ObjectId → Organization | Parent institution |
| `classCode` | String | 10-digit unique code for joining |

### Classroom Membership: `ClassroomMembership` (MongoDB)

Students join classrooms using the 10-digit `classCode`. Each membership record tracks:

| Field | Type | Description |
|---|---|---|
| `classroom` | ObjectId → Classroom | The classroom |
| `student` | ObjectId → User | The student |
| `status` | String | `pending` | `approved` | `rejected` |

**Auto-linking:** When a student joins their first classroom, they are automatically linked to the classroom's organization via `organization_id`.

### Classroom Content (Supabase)

All classroom content is stored in the Supabase `classroom_content` table with a `content_type` discriminator:

| Content Type | Description |
|---|---|
| `materials` | Lecture notes, PDFs, videos, files |
| `announcements` | Teacher announcements to students |
| `quizzes` | Quiz configurations |

Content fields: `title`, `type`, `description`, `message`, `file_url`, `duration`, `classroom_id`, `created_at`

---

## Timetable Management

### Model: `Timetable` (MongoDB)

Each timetable entry represents a single lecture slot:

| Field | Type | Description |
|---|---|---|
| `classroom` | ObjectId → Classroom | Linked classroom |
| `user` | ObjectId → User | Teacher assigned |
| `organization` | ObjectId → Organization | Parent org |
| `day` | String | Day of week (e.g., "Monday") |
| `startTime` | String | Start time in HH:MM format |
| `endTime` | String | End time in HH:MM format |
| `subject` | String | Subject name |
| `type` | String | `lecture` | `practical` | `tutorial` |
| `room` | String | Room/hall number |
| `teacher` | String | Teacher name (display) |

### Timetable Usage Across the Platform

The timetable data is used by multiple modules:

1. **AI Chat RAG Engine** — Fetches today's schedule and full weekly timetable for classroom context
2. **Teacher Availability** — Calculates real-time BUSY/AVAILABLE status by checking if current time falls within any scheduled slot
3. **Student Dashboard** — Displays daily schedule

---

## Teacher Planning

### Model: `TeacherPlan` (MongoDB)

Faculty members can create lesson plans linked to their classroom and subject:
- Teaching plan content
- Topic-wise breakdown
- Scheduled dates
- Progress tracking

---

## Organization Subjects

### Model: `OrgSubject` (MongoDB)

Centralized subject catalog for the organization:

| Field | Type | Description |
|---|---|---|
| `organization_id` | ObjectId | Parent org |
| `subjectName` | String | Display name |
| `maxMarks` | Number | Default max marks (for result system) |
| `classroomId` | ObjectId | Optional classroom link |
| `isActive` | Boolean | Soft delete flag |

Used by:
- **Marks system** — Subject configuration for multi-subject exams
- **Classroom creation** — Subject selection
- **Report cards** — Subject-wise result display

---

## Academic Hierarchy

### Model: `AcademicHierarchy` (MongoDB)

Defines the organizational structure for academic programs:

```
University
  └── Faculty/School
       └── Department
            └── Program (e.g., B.Sc. Computer Science)
                 └── Year (FY, SY, TY)
                      └── Division (A, B, C)
```

Used by:
- **Admissions** — Mapping students to programs and divisions
- **Fee structures** — Applying fees to specific programs
- **Reports** — Aggregating data by hierarchy level

---

## Meetings

### Model: `Meeting` (MongoDB)

Online meeting integration for classrooms:

| Field | Type | Description |
|---|---|---|
| `classroom` | ObjectId | Linked classroom |
| `topic` | String | Meeting topic |
| `start_time` | Date | Scheduled start |
| `duration` | Number | Duration in minutes |
| `provider` | String | Meeting platform (e.g., "zoom", "meet") |

Used by the AI chat to show upcoming meetings in the classroom context.

---

## How Students Join a Classroom

1. Teacher creates a classroom → system generates a 10-digit `classCode`
2. Teacher shares the code with students
3. Student enters the code → `ClassroomMembership` is created with `status: pending`
4. Teacher approves → status changes to `approved`
5. Student's `organization_id` is auto-set to match the classroom's organization

This joining flow is referenced across every module:
- **Assignments** — checks `ClassroomMembership` before allowing submission
- **Attendance** — checks membership before allowing mark
- **Marks** — checks membership before showing results
- **Chat** — fetches enrolled classrooms for AI context

---

## Key Relationships

```
Organization
  ├── AcademicHierarchy (program structure)
  ├── OrgSubject[] (subject catalog)
  ├── Classroom[]
  │     ├── teacher → User (faculty)
  │     ├── ClassroomMembership[] → User (students)
  │     ├── Timetable[] (lecture schedule)
  │     ├── TeacherPlan[] (lesson plans)
  │     ├── Meeting[] (online meetings)
  │     └── classroom_content (Supabase)
  │           ├── materials
  │           ├── announcements
  │           └── quizzes
  └── OrganizationAnnouncement[] (org-wide notices)
```

---

## Role Permissions

| Role | Create Classroom | Join Classroom | Manage Timetable | Manage Content | View Content |
|---|---|---|---|---|---|
| Org Admin | ✅ | ❌ | ✅ | ✅ | ✅ |
| Faculty | ✅ (own) | ❌ | ✅ (own) | ✅ (own) | ✅ (own) |
| Student | ❌ | ✅ (via code) | ❌ | ❌ | ✅ (enrolled) |
