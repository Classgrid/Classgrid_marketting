# Communication & Messaging

Classgrid's Communication system is built around a **RAG-powered AI chat assistant** (`chat.routes.js`, 863 lines) that serves as the primary student-facing interface. The AI assistant has deep integration with 13 real-time data sources across the platform. Additionally, the platform supports real-time classroom chat, group messaging, threaded conversations, org-wide announcements, forums, and push notifications through dedicated route files.

---

## AI Chat Assistant (Module 24 — RAG Engine)

**API:** `POST /api/chat/stream` (Server-Sent Events)  
**API:** `POST /api/chat/` (Standard request/response with file upload)  
**Roles:** Any authenticated user

The AI chat uses **Groq API** (model: `llama-3.3-70b-versatile`) with a comprehensive RAG (Retrieval-Augmented Generation) engine that pulls real-time context from 13 data sources.

### RAG Data Sources

| # | Source | Database | Data Pulled |
|---|---|---|---|
| 1 | Classroom Materials | Supabase `classroom_content` | Latest 10 materials (title, type, description) |
| 2 | PDF Content Extraction | Supabase + pdf-parse | Full text from latest PDF material (up to 5000 chars) |
| 3 | Classroom Announcements | Supabase `classroom_content` | Latest 5 announcements |
| 4 | Quizzes | Supabase `classroom_content` | Latest 5 quizzes with duration |
| 5 | Lecture Schedule / Timetable | MongoDB `Timetable` | Today's schedule + full weekly timetable |
| 6 | Teacher Availability | MongoDB `Timetable` + `Meeting` | Teacher's current status (BUSY/AVAILABLE), today's slots, upcoming meetings |
| 7 | Exam Results | MongoDB `StudentMark` | Last 10 exams with grades, percentage, pass/fail, subject-wise weakness detection |
| 8 | Quiz Performance | MongoDB `QuizSession` | Last 5 quiz scores with wrong answers shown |
| 9 | Viva Performance | MongoDB `VivaRecord` | Last 5 viva records with knowledge, clarity, confidence, accuracy scores |
| 10 | Attendance | MongoDB `AttendanceRecord` + `AttendanceSession` | Present/total sessions, percentage, defaulter warning (<75%) |
| 11 | Upcoming Exams | MongoDB `ExamRecord` | Next 5 exams with subject breakdown and class analytics |
| 12 | AI Study Suggestions | Auto-generated | Weak areas compiled from exams, quizzes, and vivas |
| 13 | Past Paper Analysis | MongoDB `PastPaper` | Most repeated questions (2+ appearances across 5 years), most-tested topics |

### Request Format

```json
{
  "message": "What topics should I focus on for the exam?",
  "mode": "chat",
  "classroomId": "<MongoDB ObjectId>",
  "userName": "Rahul Sharma",
  "userPrn": "2024001",
  "userRole": "Student",
  "userDept": "Computer Science",
  "userOrg": "XYZ Engineering College",
  "userId": "<MongoDB ObjectId>",
  "isFirstMessage": true,
  "history": "[{\"text\":\"...\",\"role\":\"user\"},{\"text\":\"...\",\"role\":\"assistant\"}]"
}
```

### New User Onboarding

When `isFirstMessage: true` and the user has zero enrolled classrooms, the AI automatically:
1. Greets them by name: "Hi Rahul!"
2. Explains how to join a classroom (10-digit code from teacher)
3. Explains auto-linking to organization
4. Lists available features (notes, quizzes, announcements, viva)
5. Mentions the Classgrid Honor Code

### Streaming Response

`POST /api/chat/stream` returns Server-Sent Events:
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"content": "Based on your past paper analysis..."}
data: {"content": " the most repeated topics are..."}
data: [DONE]
```

### Classroom Context API

**API:** `GET /api/chat/classroom-context/:classroomId`  
**Roles:** Any user

Returns recent classroom activity as structured JSON for the assistant's welcome screen:
```json
{
  "classroom": { "name": "FY BSc Div A", "subject": "Physics" },
  "announcements": [...],
  "materials": [...],
  "quizzes": [...]
}
```

---

## Real-Time Chat System

The platform has multiple chat route files for different contexts:

### Classroom Chat
- File: `classroom_chat.routes.js`
- Scope: Messages within a specific classroom between teacher and students
- Storage: Supabase

### Organization Chat
- File: `org_chat.routes.js`
- Scope: Org-wide communication channels

### Group Chat
- File: `group_chat.routes.js` (59KB)
- Scope: Custom groups within the organization
- Features: Group creation, member management, message history

### Threaded Conversations
- File: `thread_chat.routes.js` (123KB — largest route file)
- Scope: Reply threads on messages
- Features: Nested replies, thread resolution, pagination

### Direct Messaging
- File: `messaging.routes.js`
- Scope: 1:1 direct messages between users

---

## Notifications System

### In-App Notifications

**Model:** `Notification` (MongoDB)

Fields:
- `recipient` — ObjectId reference to User
- `type` — `assignment`, `result`, `attendance`, `library`, `quick_leave`, `system`, `request_approved`, `request_rejected`
- `title` — notification title with emoji
- `message` — notification body
- `link` — deep link to relevant page
- `relatedId` — reference to the related entity
- `emailSent` — boolean tracking if email was dispatched
- `emailSentAt` — timestamp of email dispatch

### Push Notifications

**Service:** `push.service.js` + `firebase.service.js`  
**Route:** `push.routes.js`

Uses **Firebase Cloud Messaging (FCM)** for native push notifications to mobile and desktop.

### Central Notification Service

**Service:** `notification.service.js`

Two main functions used across all modules:

1. **`dispatchNotification()`** — sends to a single recipient
   ```javascript
   await dispatchNotification({
     recipientId: "userId",
     type: "result",
     title: "✅ Assignment Graded",
     message: "Your assignment has been graded: 85 points.",
     link: "/assignments",
     relatedId: "submissionId"
   });
   ```

2. **`bulkDispatchNotification()`** — sends to multiple recipients
   ```javascript
   await bulkDispatchNotification({
     recipientIds: ["userId1", "userId2", ...],
     type: "assignment",
     title: "📚 New Assignment",
     message: "A new assignment has been posted.",
     link: "/assignments",
     sendPush: true
   });
   ```

### Scheduled Notifications

**Model:** `ScheduledNotification`

Supports scheduling notifications for future delivery (e.g., exam reminders, fee due reminders).

---

## Organization Announcements

**Model:** `OrganizationAnnouncement` (MongoDB)

Fields:
- `organization_id` — scoped to org
- `title`, `content` — announcement text
- `type` — `general`, `holiday`, `event`, `notice`
- `status` — `draft`, `published`
- `target_type` — `all` or specific targets
- `target_classrooms` — array of classroom ObjectIds
- `sent_at` — publication timestamp

Used by:
- Admin dashboard for org-wide communication
- RAG engine (Source #6) — feeds into AI chat context as academic calendar events

---

## Forums

**Models:** `ForumPost`, `ForumComment` (MongoDB)

Community discussion boards within the organization. Features:
- Post creation with rich text
- Threaded comments on posts
- Accessible via `forum.routes.js`

---

## Notification Types Across the Platform

| Module | Notification Type | Title Format |
|---|---|---|
| Assignments | `assignment` | 📚 New Assignment |
| Assignments | `result` | ✅ Assignment Graded |
| Attendance | `attendance` | ⏰ Attendance Started / You were marked absent |
| Leave | `request_approved` | 📩 Leave Request / 🏠 Leave Approved ✅ |
| Leave | `request_rejected` | 🏠 Leave Rejected ❌ |
| Leave | `quick_leave` | ⚡ Quick Leave |
| Library | `library` | 📚 Library Book Issued / ⚠️ Overdue Reminder / 📚 Reserved Book Available |
| Support | `system` | New Support Ticket / New Reply |
| Marks | `result` | Exam Result Published |

---

## Key Models

| Model | Storage | Purpose |
|---|---|---|
| `Message` | MongoDB | Chat messages |
| `Notification` | MongoDB | In-app notifications |
| `ForumPost` | MongoDB | Forum discussions |
| `ForumComment` | MongoDB | Forum replies |
| `OrganizationAnnouncement` | MongoDB | Org-wide announcements |
| `ScheduledNotification` | MongoDB | Future notification scheduling |
