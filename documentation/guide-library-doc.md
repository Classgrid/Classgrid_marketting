Classgrid's Library Module provides a complete book catalog, issue/return workflow, reservation system, AI-powered book categorization, overdue fine tracking, and analytics dashboard. All data is stored in **Supabase/Postgres** tables (`library_books`, `library_copies`, `library_transactions`, `library_reservations`), with student identity resolved from **MongoDB** (`User` model).

---

## Book Catalog

### View Catalog

**API:** `GET /api/library/catalog`  
**Roles:** Any authenticated user in the organization

Query params:
- `search` — filters by `book_name`, `book_id`, or `subject` using `ilike` (case-insensitive)

Returns all books with their copy-level status:
```json
{
  "books": [
    {
      "id": 1,
      "book_id": "CS101",
      "book_name": "Data Structures in C",
      "subject": "Computer Science",
      "total_copies": 5,
      "available_copies": 3,
      "library_copies": [
        { "id": 1, "copy_id": "CS101-001", "status": "Available" },
        { "id": 2, "copy_id": "CS101-002", "status": "Issued" }
      ]
    }
  ]
}
```

### Add/Edit Book

**API:** `POST /api/library/books`  
**Roles:** `org_admin`, `library_manager`

Body:
```json
{
  "book_id": "CS101",
  "book_name": "Data Structures in C",
  "subject": "Computer Science",
  "total_copies": 5
}
```

- If `id` is provided → updates existing book
- If no `id` → inserts new book
- Duplicate `book_id` within same org returns HTTP 409 (Postgres unique constraint `23505`)

### Delete Book

**API:** `DELETE /api/library/books/:id`  
**Roles:** `org_admin`, `library_manager`

### Bulk Import with AI Categorization

**API:** `POST /api/library/import`  
**Roles:** `org_admin`, `library_manager`

Body:
```json
{
  "books": [
    { "book_name": "Introduction to Algorithms", "book_id": "ALG001", "total_copies": 3 },
    { "book_name": "Hamlet", "book_id": "ENG002", "subject": "Literature", "total_copies": 2 }
  ]
}
```

Workflow:
1. Separates books with missing `subject` field
2. Sends uncategorized book titles to **Groq AI** (model: `llama-3.3-70b-versatile`, temperature: 0.1)
3. AI categorizes them into academic subjects (e.g., "Physics", "Computer Science", "Literature")
4. Books with AI-assigned subjects are flagged with `is_auto_categorized: true`
5. All books are upserted into `library_books` (conflict on `org_id, book_id` — updates existing)
6. Returns count of AI-filled subjects

---

## Issue/Return Workflow

### Issue a Book

**API:** `POST /api/library/issue`  
**Roles:** `org_admin`, `library_manager`

Body:
```json
{
  "book_db_id": 1,
  "student_mongo_id": "<MongoDB ObjectId>",
  "copy_db_id": 5,
  "due_date": "2026-09-15"
}
```

Workflow:
1. Checks book availability (`available_copies > 0`)
2. Decrements `available_copies` on `library_books`
3. Updates specific copy status to `Issued` (if `copy_db_id` provided)
4. Creates `library_transactions` record with status `Issued`
5. Sends checkout email to student via AWS SES:
   - Subject: "📚 Library Book Issued"
   - Body: book name, due date, return reminder
6. Creates in-app `Notification` (type: `library`)
7. If any step fails after decrementing copies, rolls back the availability count

### Return a Book

**API:** `POST /api/library/return`  
**Roles:** `org_admin`, `library_manager`

Body:
```json
{
  "transaction_id": 42,
  "fine_amount": 25,
  "fine_status": "Unpaid"
}
```

Workflow:
1. Validates transaction exists and status is `Issued`
2. Updates transaction: `status` → `Returned`, sets `return_date`, `fine_amount`, `fine_status`
3. Increments `available_copies` on `library_books`
4. Updates copy status to `Available` (if copy tracking is enabled)

---

## Student Views

### My Books (Active + History)

**API:** `GET /api/library/student/books`  
**Roles:** Any authenticated student

Returns all transactions for the logged-in student with:
- Book details (name, ID, subject) via Supabase join
- Dynamically calculated `active_fine` for overdue books:
  - **₹5 per day** past due date
  - Calculated as: `Math.ceil(daysDiff) * 5`

### AI Book Summary

**API:** `POST /api/library/student/book-info`  
**Roles:** Any authenticated student

Body: `{ "book_name": "Data Structures in C", "subject": "Computer Science" }`

Uses **Groq AI** (model: `llama-3.3-70b-versatile`, temperature: 0.5) to generate a 2-3 sentence overview of what the student will learn from the book.

---

## Book Reservation System

### Reserve a Book

**API:** `POST /api/library/reserve`  
**Roles:** Any authenticated student

Body: `{ "book_db_id": 1 }`

- Checks for existing pending reservation (prevents duplicates, returns HTTP 409)
- Calculates queue position based on existing pending reservations
- Creates `library_reservations` record with `status: pending` and `queue_position`
- Returns: "Book reserved! You are #3 in queue."

### View My Reservations (Student)

**API:** `GET /api/library/student/reservations`  
**Roles:** Any authenticated student

### Cancel Reservation

**API:** `POST /api/library/cancel-reservation`  
**Roles:** Any authenticated user (student or admin)

Body: `{ "reservation_id": 15 }`  
Updates status to `cancelled`.

### Admin: View All Reservations

**API:** `GET /api/library/reservations`  
**Roles:** `org_admin`, `library_manager`

Returns all pending reservations with student info (name, PRN, roll number) from MongoDB.

### Fulfill Reservation

**API:** `POST /api/library/fulfill-reservation`  
**Roles:** `org_admin`, `library_manager`

Body: `{ "reservation_id": 15 }`

Workflow:
1. Updates reservation status to `fulfilled`
2. Sends email to student: "📚 Your Reserved Book is Ready!"
3. Creates in-app notification: "Please visit the library to collect it within 48 hours."

---

## Overdue Reminder System

**API:** `GET /api/library/overdue-check`  
**Roles:** `org_admin`, `library_manager`

Workflow:
1. Queries all transactions with `status: Issued` and `due_date < now`
2. For each overdue transaction:
   - Calculates `daysOverdue` and `fine` (₹5/day)
   - Sends email via AWS SES: "⚠️ Library Book Overdue Reminder" with book name, due date, days overdue, and current fine
   - Creates in-app `Notification`
3. Returns `{ sent: 12, totalOverdue: 15 }`

---

## Analytics Dashboard

**API:** `GET /api/library/analytics`  
**Roles:** `org_admin`, `library_manager`

Returns:

### Summary
- `totalBooks` — sum of all `total_copies`
- `availableBooks` — sum of all `available_copies`
- `totalIssued` — count of active issues
- `totalReturned` — count of returns
- `totalOverdue` — count of overdue books
- `totalFines` — sum of all calculated fines (₹5/day for each overdue)

### Most Issued Books (Top 10)
Aggregated from all transactions, sorted by issue count.

### Top Defaulters (Top 10)
Students with the most overdue books, with name and PRN from MongoDB.

### Monthly Trends (Last 6 Months)
Per-month breakdown of issued vs returned books.

---

## Admin View: All Transactions

**API:** `GET /api/library/transactions`  
**Roles:** `org_admin`, `library_manager`

Query params: `status` — filter by `Issued` or `Returned`

Returns all transactions with:
- Book info (name, book_id) via Supabase join
- Copy info (copy_id) via Supabase join
- Student info (name, PRN, roll_no) from MongoDB

---

## Role Permissions

| Role | Manage Catalog | Issue/Return | View Catalog | Reserve | View Own Books | Analytics |
|---|---|---|---|---|---|---|
| Org Admin | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Library Manager | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Student | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Faculty | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |

---

## Database Tables (Supabase)

| Table | Key Columns |
|---|---|
| `library_books` | `org_id`, `book_id`, `book_name`, `subject`, `total_copies`, `available_copies`, `is_auto_categorized` |
| `library_copies` | `id`, `copy_id`, `status` (Available/Issued), FK to `library_books` |
| `library_transactions` | `org_id`, `book_id`, `copy_id`, `student_id`, `issued_by`, `due_date`, `return_date`, `status`, `fine_amount`, `fine_status` |
| `library_reservations` | `org_id`, `book_id`, `student_id`, `status` (pending/fulfilled/cancelled), `queue_position` |
