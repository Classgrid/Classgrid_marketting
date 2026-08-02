Classgrid's Support module provides a full-featured help desk with **public ticket creation** (no login required), **authenticated ticket management**, **file attachments**, **admin reply system**, **ticket lifecycle management**, and **email + push notifications**. All ticket data is stored in **MongoDB** via the `SupportTicket` model.

---

## Two Access Modes

### 1. Public Endpoints (No Login Required)
For marketing site visitors at `classgrid.in/support`. Users are identified by email only (similar to Zendesk/Brevo).

### 2. Authenticated Endpoints (Logged-in Platform Users)
For students, faculty, and admins within the platform.

---

## Strict Session Enforcement

All public endpoints pass through `enforceStrictSession` middleware that prevents:

1. **Session Mismatch** — If a user is logged in but provides a different email, returns HTTP 403:
   ```json
   { "code": "SESSION_MISMATCH", "message": "You are logged in with a different account." }
   ```

2. **Registered User Without Login** — If the email belongs to a registered platform user and they're NOT logged in, blocks access to existing tickets:
   ```json
   { "code": "SESSION_REQUIRED", "message": "This email is registered on Classgrid. You must log in to access this ticket." }
   ```
   Exception: Creating NEW tickets is always allowed.

---

## Public Ticket Creation

**API:** `POST /api/support/public/tickets`  
**Auth:** None (public)  
**Upload:** Up to 5 files via `multipleUploads("files", 5)`

Body (multipart):
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@college.edu",
  "subject": "Cannot access marks page",
  "message": "When I click on Academic Profile, I get a blank screen...",
  "category": "technical",
  "priority": "high",
  "institution": "",
  "role": "student"
}
```

**Two ticket types based on `institution` field:**
- If `institution` is provided → **General Inquiry** (Classgrid Talk) — open to anyone
- If `institution` is empty → **Technical Support Ticket** — requires registered email with an organization:
  ```json
  { "message": "This email is not registered on Classgrid. Only registered users can raise support tickets." }
  ```
  ```json
  { "code": "NO_ORG", "message": "Support tickets can only be raised by users who belong to a registered institution." }
  ```

**Ticket creation workflow:**
1. Validates email, subject (max 200 chars), message
2. Looks up user in MongoDB for profile picture, role, org info
3. Uploads files to Supabase storage bucket `support-attachments` (path: `support_tickets/public/{email}/`)
4. Creates `SupportTicket` with:
   - `messages[]` — initial message with author info, avatar, org name, org logo
   - `events[]` — `{ type: 'ticketCreated', label: 'Ticket submitted' }`
   - `lastComment` — timestamp for sorting
5. Sends confirmation email:
   - Technical: `notifyUserOfTicketCreation()`
   - Inquiry: `notifyUserOfTalkRequestCreation()`
6. Notifies all `super_admin` users via `bulkDispatchNotification` with push notification

---

## Public Ticket Viewing & Replies

### List My Tickets

**API:** `GET /api/support/public/tickets?email=xxx`  
**Auth:** Public (with strict session enforcement)

Returns all tickets for the email with:
- `replyCount` — number of messages minus 1 (excludes initial message)
- `lastComment` — timestamp of most recent activity
- `isPlatformUser` — boolean indicating if email is registered
- `hasOrganization` — boolean indicating if user has an org

### View Single Ticket

**API:** `GET /api/support/public/tickets/:id?email=xxx`  
**Auth:** Public  
Email must match `ticket.submitterEmail`. Returns full ticket with all messages and events.

### Reply to Ticket

**API:** `POST /api/support/public/tickets/:id/reply`  
**Auth:** Public (email verified against ticket owner)  
**Upload:** Up to 5 files

Body: `{ "email": "...", "message": "...", "name": "..." }`

Workflow:
1. Validates ticket is not `closed`
2. Verifies email matches ticket owner
3. Uploads any attachments to Supabase
4. Fetches user's current profile, role, org info from MongoDB
5. Pushes to both `ticket.replies[]` and `ticket.messages[]` (dual format for compatibility)
6. Adds event: `{ type: 'userReply', label: '[Role] replied' }`
7. Updates `lastComment` and `lastUserReplyAt`
8. If ticket was `resolved`, reopens it (status → `reopened`)
9. Otherwise sets status to `open`
10. Notifies all super admins

### Close Ticket

**API:** `POST /api/support/public/tickets/:id/close`  
**Auth:** Public (email verified)

Sets `status: closed`. Adds event: `{ type: 'statusChanged', label: 'User closed ticket' }`.

---

## Authenticated Ticket Creation

**API:** `POST /api/support/tickets`  
**Roles:** Any authenticated user with an organization  
**Upload:** Up to 5 files

Same as public creation but:
- Uses `req.user._id` as `submittedBy` (ObjectId reference)
- Requires `organization_id` — blocks orgless accounts:
  ```json
  { "code": "NO_ORG", "message": "Support tickets can only be raised by users who belong to a registered institution." }
  ```
- Attaches user's profile picture, role, org name, org logo to the initial message

### View My Tickets

**API:** `GET /api/support/tickets`  
**Roles:** Any authenticated user

Returns tickets with stats:
```json
{
  "tickets": [...],
  "total": 5,
  "stats": { "open": 2, "inProgress": 1, "resolved": 2 }
}
```

### View Ticket Detail

**API:** `GET /api/support/tickets/:id`  
**Roles:** Any authenticated user

Returns full ticket with populated `submittedBy` and `assignedTo` fields.

---

## Ticket Lifecycle

| Status | Description |
|---|---|
| `open` | Newly created or user has replied |
| `in_progress` | Admin is working on it |
| `resolved` | Admin has resolved (user can reopen by replying) |
| `reopened` | User replied to a resolved ticket |
| `closed` | Permanently closed by user or admin |

---

## Message Format

Each message in `ticket.messages[]` contains:

| Field | Description |
|---|---|
| `author` | Display name |
| `role` | `user` or `admin` (normalized) |
| `body` | Message text |
| `date` | Timestamp |
| `footer` | "Email: user@email.com" |
| `avatar` | Profile picture URL |
| `orgName` | User's organization name |
| `orgLogo` | Organization logo URL |
| `authorRole` | Raw role (e.g., `student`, `faculty`, `super_admin`) |
| `attachments` | Array of uploaded files |

---

## Event Timeline

Each ticket tracks events in `ticket.events[]`:

| Event Type | Label |
|---|---|
| `ticketCreated` | "Ticket submitted" / "Ticket created" |
| `userReply` | "[Role] replied" |
| `adminReply` | "Admin replied" |
| `statusChanged` | "Status changed to [status]" / "User closed ticket" |
| `assigned` | "Assigned to [admin name]" |

---

## File Attachments

- Storage: Supabase bucket `support-attachments`
- Path: `support_tickets/{userId}/` (authenticated) or `support_tickets/public/{email}/` (public)
- Max files per request: 5
- Each attachment stores: `id`, `name`, `url` (storage_path), `mimeType`, `size`, `uploadedAt`

---

## Email Notifications

| Event | Service Function | Recipient |
|---|---|---|
| New technical ticket | `notifyUserOfTicketCreation()` | Ticket creator |
| New inquiry | `notifyUserOfTalkRequestCreation()` | Ticket creator |
| Admin replies | `notifyTicketCreatorOfAdminReply()` | Ticket creator |
| Admin replies to inquiry | `notifyTalkCreatorOfAdminReply()` | Inquiry creator |

All via `support-ticket-email.service.js`

---

## Push Notifications to Super Admins

Every ticket action sends push notifications to all `super_admin` users:
- New ticket: "New Support Ticket: [subject]"
- New inquiry: "New Inquiry: [subject]"  
- User reply: "New Reply (Public): [subject]"
- Link: `/superadmin/support/view/{ticketId}`

---

## Key Models

| Model | Storage | Purpose |
|---|---|---|
| `SupportTicket` | MongoDB | Full ticket with messages, replies, events, attachments |
| `SupportConversation` | MongoDB | Extended conversation threads |
| `User` | MongoDB | User identity, profile, org lookup |

### SupportTicket Schema Key Fields

`subject`, `message`, `category`, `priority`, `status`, `submitterEmail`, `submitterName`, `submitterRole`, `submittedBy` (ObjectId), `organization_id`, `assignedTo` (ObjectId), `messages[]`, `replies[]`, `events[]`, `attachments[]`, `lastComment`, `lastUserReplyAt`, `institution`
