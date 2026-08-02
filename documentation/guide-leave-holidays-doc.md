# Leave & Holiday Management

Classgrid's Leave & Holiday system has two interconnected modules:

1. **Leave Management** (`leave.routes.js`) — Student leave requests, teacher approvals, quick-leave mode, leave summary, and weekly calendar view. Stored in **Supabase** `leave_requests` table.
2. **Holiday Calendar** (`holidays.routes.js`) — Organization holiday management with Google Calendar auto-sync for Indian festivals, manual holiday creation, and holiday-aware guards across the platform. Stored in **Supabase** `holidays` table.

---

## Leave Management

### Student: Apply for Leave

**API:** `POST /api/leave/request`  
**Roles:** Any authenticated user (typically student)

Body:
```json
{
  "classroomId": "<MongoDB ObjectId>",
  "from_date": "2026-09-10",
  "to_date": "2026-09-12",
  "leave_type": "sick",
  "day_type": "full",
  "reason": "Medical appointment",
  "attachment_url": "https://storage.supabase.co/...",
  "total_days": 3
}
```

**Leave types:** `casual`, `sick`, `long`, `quick`  
**Day types:** `full`, `first_half`, `second_half`

Workflow:
1. Validates `from_date` is provided
2. Looks up the classroom to find the `teacher_id` (for routing the approval)
3. Creates a `leave_requests` record in Supabase with `status: pending`
4. Sends push notification to the teacher via `dispatchNotification`:
   - Title: "📩 Leave Request — [Student Name]"
   - Message: "[Name] has applied for [type] leave from [date] to [date]"

### Student: Quick Leave (No Approval Needed)

**API:** `POST /api/leave/quick`  
**Roles:** Any authenticated user

Body:
```json
{
  "date": "2026-09-10",
  "day_type": "first_half",
  "classroomId": "<MongoDB ObjectId>"
}
```

Workflow:
1. Auto-generates a message: "Ma'am/Sir, I will not be able to attend class the first half on 10 September, 2026."
2. Creates a leave record with `status: quick` (no approval needed)
3. `total_days` is `1` for full day, `0.5` for half day
4. Sends informational notification to teacher

### Student: View My Leave Requests

**API:** `GET /api/leave/me`  
**Roles:** Any authenticated user

Returns all leave requests for the student, populated with:
- Classroom info (name, subject) from MongoDB
- Leave type, day type, dates, reason
- Status and teacher notes

### Student: Cancel Pending Leave

**API:** `DELETE /api/leave/:requestId`  
**Roles:** Any authenticated user (own leave only)

Only deletes if status is `pending`. Returns error if already approved/rejected.

### Student: Leave Summary & Balance

**API:** `GET /api/leave/summary`  
**Roles:** Any authenticated user

Returns:
```json
{
  "totalRequests": 12,
  "totalDaysUsed": 8.5,
  "pendingCount": 2,
  "typeBreakdown": {
    "casual": { "total": 5, "approved": 3, "rejected": 1, "pending": 1, "daysOff": 3 },
    "sick": { "total": 4, "approved": 4, "rejected": 0, "pending": 0, "daysOff": 4 },
    "quick": { "total": 3, "approved": 3, "rejected": 0, "pending": 0, "daysOff": 1.5 }
  },
  "monthlyUsage": {
    "2026-07": 2,
    "2026-08": 3.5,
    "2026-09": 3
  }
}
```

The `monthlyUsage` map is designed for chart/graph rendering on the frontend.

---

## Teacher: Manage Leave Requests

### View Requests for My Classes

**API:** `GET /api/leave/teacher`  
**Roles:** `faculty`, `org_admin`

Query params: `status` — filter by `pending`, `approved`, `rejected`, `quick`, or `all`

Returns all leave requests where `teacher_id` matches the current user.

### Approve / Reject

**API:** `PUT /api/leave/:requestId/status`  
**Roles:** `faculty`, `org_admin`

Body:
```json
{
  "status": "approved",
  "teacherNote": "Get well soon. Share medical certificate when back."
}
```

Valid statuses: `approved`, `rejected`

Workflow:
1. Updates the leave request in Supabase
2. Sends push notification to student:
   - Approved: "🏠 Leave Approved ✅ — Your [type] request has been approved."
   - Rejected: "🏠 Leave Rejected ❌ — Your [type] request has been rejected. Note: [teacher note]"

### Weekly Calendar View

**API:** `GET /api/leave/calendar`  
**Roles:** `faculty`, `org_admin`

Query params: `weekStart` — e.g., `2026-09-07` (Monday). Defaults to current week.

Returns a 7-day calendar showing which students are on leave each day:
```json
{
  "weekStart": "2026-09-07",
  "weekEnd": "2026-09-13",
  "calendar": [
    {
      "date": "2026-09-07",
      "day": "Monday",
      "absentCount": 3,
      "absentees": [
        {
          "studentName": "Rahul Sharma",
          "prn": "2024001",
          "leaveType": "sick",
          "dayType": "full",
          "reason": "Fever"
        }
      ]
    }
  ]
}
```

Filters: only shows `approved` and `quick` leaves that overlap with the requested week.

---

## Holiday Calendar

### View All Holidays

**API:** `GET /api/holidays/`  
**Roles:** Any authenticated user

Query params:
- `year` — defaults to current year
- `month` — format `YYYY-MM` (e.g., `2026-08`)
- `search` — text search on holiday title

**Auto-sync behavior:** If zero holidays exist for the requested year, the system automatically syncs festivals from Google Calendar before returning results.

### Check Today's Holiday

**API:** `GET /api/holidays/today`  
**Roles:** Any authenticated user

Returns `{ isHoliday: true/false, holiday: { title, date } }` using the shared `isHoliday()` utility function. This same function is used by the attendance and assignment modules to block operations on holidays.

### Upcoming Holidays (Next 5 Days)

**API:** `GET /api/holidays/upcoming`  
**Roles:** Any authenticated user

Returns holidays within the next 5 days with countdown info:
```json
{
  "holidays": [
    {
      "title": "Ganesh Chaturthi",
      "date": "2026-09-10",
      "daysLeft": 2,
      "countdownText": "in 2 days"
    }
  ]
}
```

`countdownText` returns "Today", "Tomorrow", or "in X days".

### Toggle Holiday Status (Admin)

**API:** `PATCH /api/holidays/:id`  
**Roles:** `org_admin`

Body: `{ "is_holiday": true }`

Allows admins to mark/unmark a festival as a working day or holiday for their organization. Google-synced festivals default to `is_holiday: false` — admins must explicitly enable the ones they observe.

### Add Custom Holiday

**API:** `POST /api/holidays/manual`  
**Roles:** `org_admin`

Body:
```json
{
  "title": "College Foundation Day",
  "date": "2026-10-15",
  "end_date": "2026-10-15"
}
```

Creates a holiday with `source: manual` and `is_holiday: true`.

### Sync Indian Festivals from Google Calendar

**API:** `POST /api/holidays/sync`  
**Roles:** `org_admin`

Query params: `year` — defaults to current year

Workflow:
1. Checks if festivals for this year already exist for the org (skips if yes)
2. Fetches the public Indian holidays iCal feed from Google Calendar: `calendar.google.com/calendar/ical/en.indian%23holiday@group.v.calendar.google.com/public/basic.ics`
3. Parses ICS format — extracts `SUMMARY`, `DTSTART`, `DTEND` for each `VEVENT`
4. Filters to the target year
5. Upserts into `holidays` table (conflict on `org_id, title, date`)
6. Returns: "Synced 45 festivals for 2026"

---

## Holiday Guards Across the Platform

The `isHoliday()` utility function is used as a guard in:

| Module | Behavior on Holiday |
|---|---|
| **Attendance** | Blocks starting attendance sessions |
| **Assignments** | Blocks creating assignments; blocks student submissions |
| **Leave** | Does NOT block (students can still apply for leave on holidays) |

---

## Database Tables (Supabase)

| Table | Key Columns |
|---|---|
| `leave_requests` | `student_id`, `classroom_id`, `teacher_id`, `from_date`, `to_date`, `leave_type`, `day_type`, `total_days`, `reason`, `auto_message`, `attachment_url`, `status`, `teacher_notes` |
| `holidays` | `org_id`, `title`, `date`, `end_date`, `year`, `is_holiday`, `source` (google/manual), `last_synced_at` |

---

## Role Permissions

| Role | Apply Leave | Quick Leave | Approve/Reject | View Calendar | Manage Holidays | Sync Festivals |
|---|---|---|---|---|---|---|
| Student | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Faculty | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| Org Admin | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
