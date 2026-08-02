---
title: Communication API
description: "Code-grounded Classgrid REST API reference for communication api"
---

# Communication API

This reference is generated from the current Express route definitions and their handlers. It documents route-level authentication and authorization; deployment-wide middleware may add further checks.

## Conventions

- Base API origin: `https://api.classgrid.in`
- Authentication: authenticated routes use the Classgrid session/JWT recognized by `isAuthenticated`.
- JSON is the default request and response format unless an endpoint explicitly accepts multipart data or redirects.
- Path parameters are always required.
- A field marked `no` means the static handler scan did not find a direct required-field check; business rules may still make it conditionally required.
- Role checks can also accept `super_admin` through the shared authorization middleware where implemented.

This document contains **35 route definitions** from 5 source files.

## chat.routes.js

**Mounted at:** `/api/chat`

| Method | Path | Access |
|---|---|---|
| GET | `/api/chat/classroom-context/:classroomId` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/chat/stream` | Public endpoint unless an upstream platform gate applies. |
| POST | `/api/chat` | Public endpoint unless an upstream platform gate applies. |
| GET | `/api/chat/groups-in-common/:userId` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/chat/classroom-context/:classroomId

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** None at route level

**What it does:** Returns recent classroom activity as JSON for the assistant welcome screen. Retrieves classroom context.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `error`, `classroom`, `announcements`, `materials`, `quizzes`. Explicit status codes include 400, 404, 500.

**Source:** `server/src/routes/chat.routes.js:578`; handler `inline handler` in `server/src/routes/chat.routes.js`.

### POST /api/chat/stream

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `upload.none()`

**What it does:** Creates or processes stream.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | no | Request value for message. |
| `mode` | string | no | Request value for mode. |
| `classroomId` | string | no | Request value for classroom id. |
| `userName` | string | no | Request value for user name. |
| `username` | string | no | Request value for username. |
| `displayName` | string | no | Request value for display name. |
| `userPrn` | string | no | Request value for user prn. |
| `userRole` | string | no | Request value for user role. |
| `userDept` | string | no | Request value for user dept. |
| `userOrg` | string | no | Request value for user org. |
| `userId` | string | no | Request value for user id. |
| `isFirstMessage` | string | no | Request value for is first message. |
| `history` | string | no | Request value for history. |

**Response:** JSON response fields observed in the handler include `error`, `details`. Explicit status codes include 500.

**Source:** `server/src/routes/chat.routes.js:626`; handler `inline handler` in `server/src/routes/chat.routes.js`.

### POST /api/chat

**Auth:** None at route level

**Roles:** Public endpoint unless an upstream platform gate applies.

**Middleware:** `upload.single('file')`

**What it does:** Creates or processes resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | no | Request value for message. |
| `mode` | string | no | Request value for mode. |
| `classroomId` | string | no | Request value for classroom id. |
| `userName` | string | no | Request value for user name. |
| `username` | string | no | Request value for username. |
| `displayName` | string | no | Request value for display name. |
| `userPrn` | string | no | Request value for user prn. |
| `userRole` | string | no | Request value for user role. |
| `userDept` | string | no | Request value for user dept. |
| `userOrg` | string | no | Request value for user org. |
| `userId` | string | no | Request value for user id. |
| `isFirstMessage` | string | no | Request value for is first message. |
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `reply`, `error`, `details`. Explicit status codes include 500.

**Source:** `server/src/routes/chat.routes.js:730`; handler `inline handler` in `server/src/routes/chat.routes.js`.

### GET /api/chat/groups-in-common/:userId

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves groups in common.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | string | yes | Path identifier/value for user id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `groups`, `error`. Explicit status codes include 500.

**Source:** `server/src/routes/chat.routes.js:837`; handler `inline handler` in `server/src/routes/chat.routes.js`.

## messaging.routes.js

**Mounted at:** `/api/messages`

| Method | Path | Access |
|---|---|---|
| POST | `/api/messages/:classroomId` | Authenticated classroom member. |
| GET | `/api/messages/threads/all` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/messages/:classroomId` | Authenticated classroom member. |
| GET | `/api/messages/:classroomId/private/:userId` | Authenticated classroom member. |
| GET | `/api/messages/:classroomId/threads` | Authenticated classroom member. |
| DELETE | `/api/messages/:classroomId/:messageId` | Authenticated classroom member. |

### POST /api/messages/:classroomId

**Auth:** `isAuthenticated`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `requireClassroomMember`, `upload.single("file")`

**What it does:** Creates or processes resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `content` | string | yes | Request value for content. |
| `receiverId` | string | no | Request value for receiver id. |
| `messageType` | string | no | Request value for message type. |
| `file` | file | no | Request value for file. |

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 201, 400, 500. Message content or file required

**Source:** `server/src/routes/messaging.routes.js:23`; handler `inline handler` in `server/src/routes/messaging.routes.js`.

### GET /api/messages/threads/all

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves threads all.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `threads`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/messaging.routes.js:89`; handler `inline handler` in `server/src/routes/messaging.routes.js`.

### GET /api/messages/:classroomId

**Auth:** `isAuthenticated`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `requireClassroomMember`

**What it does:** Retrieves resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `limit` | number | no | Query value for limit. Default: `50`. |
| `before` | string | no | Query value for before. |
| `after` | string | yes | Query value for after. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `messages`, `hasMore`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/messaging.routes.js:199`; handler `inline handler` in `server/src/routes/messaging.routes.js`.

### GET /api/messages/:classroomId/private/:userId

**Auth:** `isAuthenticated`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `requireClassroomMember`

**What it does:** Retrieves private.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | string | yes | Path identifier/value for user id. |
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `limit` | number | no | Query value for limit. Default: `50`. |
| `before` | string | no | Query value for before. |
| `after` | string | yes | Query value for after. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `messages`, `hasMore`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/messaging.routes.js:248`; handler `inline handler` in `server/src/routes/messaging.routes.js`.

### GET /api/messages/:classroomId/threads

**Auth:** `isAuthenticated`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `requireClassroomMember`

**What it does:** Retrieves threads.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `threads`, `message`, `error`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/messaging.routes.js:295`; handler `inline handler` in `server/src/routes/messaging.routes.js`.

### DELETE /api/messages/:classroomId/:messageId

**Auth:** `isAuthenticated`, `requireClassroomMember`

**Roles:** Authenticated classroom member.

**Middleware:** `isAuthenticated`, `requireClassroomMember`

**What it does:** Deletes resource.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `messageId` | string | yes | Path identifier/value for message id. |
| `classroomId` | string | yes | Path identifier/value for classroom id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `error`. Explicit status codes include 403, 404, 500. Message not found

**Source:** `server/src/routes/messaging.routes.js:349`; handler `inline handler` in `server/src/routes/messaging.routes.js`.

## notification.routes.js

**Mounted at:** `/api/notifications`

| Method | Path | Access |
|---|---|---|
| GET | `/api/notifications` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/notifications/:id/read` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/notifications/read-all` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/notifications/preferences` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PUT | `/api/notifications/preferences` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### GET /api/notifications

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** notifications for current user MERGES Supabase + MongoDB. Retrieves resource.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `notifications`, `unreadCount`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/notification.routes.js:13`; handler `inline handler` in `server/src/routes/notification.routes.js`.

### PUT /api/notifications/:id/read

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Mark notification as read (handles both Supabase and MongoDB). Updates read.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Marked read

**Source:** `server/src/routes/notification.routes.js:87`; handler `inline handler` in `server/src/routes/notification.routes.js`.

### PUT /api/notifications/read-all

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Mark all as read (both Supabase and MongoDB). Updates read all.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. All marked read

**Source:** `server/src/routes/notification.routes.js:115`; handler `inline handler` in `server/src/routes/notification.routes.js`.

### GET /api/notifications/preferences

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Get user's in-app notification preferences. Retrieves preferences.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `preferences`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/notification.routes.js:143`; handler `inline handler` in `server/src/routes/notification.routes.js`.

### PUT /api/notifications/preferences

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Update user's in-app notification preferences. Updates preferences.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `preferences` | string | yes | Request value for preferences. |

**Response:** JSON response fields observed in the handler include `message`, `preferences`. Explicit status codes include 400, 500. Invalid preferences

**Source:** `server/src/routes/notification.routes.js:160`; handler `inline handler` in `server/src/routes/notification.routes.js`.

## push.routes.js

**Mounted at:** `/api/push`

| Method | Path | Access |
|---|---|---|
| POST | `/api/push/register-device` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/push/unregister-device` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/push/send` | `org_admin`, `faculty` |
| POST | `/api/push/send-by-role` | `org_admin` |
| POST | `/api/push/broadcast` | `org_admin` |
| GET | `/api/push/notifications` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PATCH | `/api/push/notifications/read-all` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |

### POST /api/push/register-device

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes register device.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `fcmToken` | string | yes | Request value for fcm token. |
| `platform` | string | no | Request value for platform. Default: `android`. |
| `appRole` | string | no | Request value for app role. |

**Response:** JSON response fields observed in the handler include `success`, `message`. Explicit status codes include 400, 500. fcmToken is required

**Source:** `server/src/routes/push.routes.js:30`; handler `inline handler` in `server/src/routes/push.routes.js`.

### DELETE /api/push/unregister-device

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes unregister device.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `fcmToken` | string | yes | Request value for fcm token. |

**Response:** JSON response fields observed in the handler include `success`, `message`. Explicit status codes include 400, 500. fcmToken is required

**Source:** `server/src/routes/push.routes.js:77`; handler `inline handler` in `server/src/routes/push.routes.js`.

### POST /api/push/send

**Auth:** `isAuthenticated`, `requireRole("org_admin","faculty")`

**Roles:** `org_admin`, `faculty`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","faculty")`

**What it does:** Sends the requested information.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `recipientIds` | string | yes | Request value for recipient ids. |
| `title` | string | yes | Request value for title. |
| `body` | string | yes | Request value for body. |
| `deepLink` | string | no | Request value for deep link. Default: ``. |
| `type` | string | no | Request value for type. Default: `general`. |

**Response:** JSON response fields observed in the handler include `success`, `message`, `sent`, `failed`, `cleaned`. Explicit status codes include 400, 500. recipientIds array is required

**Source:** `server/src/routes/push.routes.js:116`; handler `inline handler` in `server/src/routes/push.routes.js`.

### POST /api/push/send-by-role

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Sends the requested information.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `role` | string | yes | Request value for role. |
| `title` | string | yes | Request value for title. |
| `body` | string | yes | Request value for body. |
| `deepLink` | string | no | Request value for deep link. Default: ``. |
| `type` | string | no | Request value for type. Default: `general`. |

**Response:** JSON response fields observed in the handler include `success`, `message`, `sent`, `role`, `failed`, `cleaned`. Explicit status codes include 400, 403, 500. role, title, and body are required

**Source:** `server/src/routes/push.routes.js:180`; handler `inline handler` in `server/src/routes/push.routes.js`.

### POST /api/push/broadcast

**Auth:** `isAuthenticated`, `requireRole("org_admin")`

**Roles:** `org_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin")`

**What it does:** Creates or processes broadcast.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | yes | Request value for title. |
| `body` | string | yes | Request value for body. |
| `deepLink` | string | no | Request value for deep link. Default: ``. |
| `type` | string | no | Request value for type. Default: `general`. |

**Response:** JSON response fields observed in the handler include `success`, `message`, `sent`, `failed`, `totalDevices`. Explicit status codes include 400, 403, 500. title and body are required

**Source:** `server/src/routes/push.routes.js:247`; handler `inline handler` in `server/src/routes/push.routes.js`.

### GET /api/push/notifications

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves notifications.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `limit` | number | no | Query value for limit. |
| `skip` | number | no | Query value for skip. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `notifications`, `summary`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/push.routes.js:294`; handler `inline handler` in `server/src/routes/push.routes.js`.

### PATCH /api/push/notifications/read-all

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Updates notifications read all.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`. Explicit status codes include 500. All notifications marked as read

**Source:** `server/src/routes/push.routes.js:324`; handler `inline handler` in `server/src/routes/push.routes.js`.

## forum.routes.js

**Mounted at:** `/api/forum`

| Method | Path | Access |
|---|---|---|
| GET | `/api/forum/posts` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/forum/posts` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/forum/posts/:id/upvote` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/forum/posts/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/forum/posts/:id/comments` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PATCH | `/api/forum/posts/:id/pin` | `org_admin`, `super_admin` |
| DELETE | `/api/forum/posts/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| PATCH | `/api/forum/posts/:id/lock` | `org_admin`, `super_admin` |
| POST | `/api/forum/comments/:id/upvote` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| DELETE | `/api/forum/comments/:id` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/forum/admin/posts` | `super_admin` |
| GET | `/api/forum/admin/analytics` | `super_admin` |
| PATCH | `/api/forum/admin/posts/:id` | `super_admin` |

### GET /api/forum/posts

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Reserved ID for Classgrid Global Forum. Retrieves posts.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `category` | string | no | Query value for category. |
| `sort` | string | no | Query value for sort. Default: `hot`. |
| `search` | string | no | Query value for search. |
| `scope` | string | no | Query value for scope. Default: `institute`. |
| `page` | number | no | Query value for page. Default: `1`. |
| `limit` | number | no | Query value for limit. Default: `20`. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `posts`, `total`, `page`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/forum.routes.js:13`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### POST /api/forum/posts

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes posts.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | no | Request value for title. |
| `body` | string | no | Request value for body. |
| `category` | string | no | Request value for category. |
| `tags` | array | no | Request value for tags. |
| `scope` | string | no | Request value for scope. Default: `institute`. |

**Response:** JSON response fields observed in the handler include `success`, `message`, `post`. Explicit status codes include 201, 400, 500. Title and body are required

**Source:** `server/src/routes/forum.routes.js:56`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### POST /api/forum/posts/:id/upvote

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes posts upvote.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `upvotes`, `upvoted`. Explicit status codes include 404, 500. Post not found

**Source:** `server/src/routes/forum.routes.js:90`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### GET /api/forum/posts/:id

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Retrieves posts.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `post`, `comments`. Explicit status codes include 404, 500. Post not found

**Source:** `server/src/routes/forum.routes.js:116`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### POST /api/forum/posts/:id/comments

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes posts comments.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `body` | string | no | Request value for body. |
| `parentComment` | string | no | Request value for parent comment. |

**Response:** JSON response fields observed in the handler include `success`, `message`, `comment`. Explicit status codes include 201, 400, 403, 404, 500. Comment body is required

**Source:** `server/src/routes/forum.routes.js:137`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### PATCH /api/forum/posts/:id/pin

**Auth:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**What it does:** Updates posts pin.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `isPinned`. Explicit status codes include 404, 500. Post not found

**Source:** `server/src/routes/forum.routes.js:172`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### DELETE /api/forum/posts/:id

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes posts.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`. Explicit status codes include 403, 404, 500. Post not found

**Source:** `server/src/routes/forum.routes.js:189`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### PATCH /api/forum/posts/:id/lock

**Auth:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**Roles:** `org_admin`, `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("org_admin","super_admin")`

**What it does:** Updates posts lock.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `isLocked`. Explicit status codes include 404, 500. Post not found

**Source:** `server/src/routes/forum.routes.js:210`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### POST /api/forum/comments/:id/upvote

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Creates or processes comments upvote.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`, `upvotes`, `upvoted`. Explicit status codes include 404, 500. Comment not found

**Source:** `server/src/routes/forum.routes.js:227`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### DELETE /api/forum/comments/:id

**Auth:** `isAuthenticated`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`

**What it does:** Deletes comments.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `message`. Explicit status codes include 403, 404, 500. Comment not found

**Source:** `server/src/routes/forum.routes.js:253`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### GET /api/forum/admin/posts

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Retrieves admin posts.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |
| `scope` | string | no | Query value for scope. |
| `category` | string | no | Query value for category. |
| `page` | number | no | Query value for page. Default: `1`. |
| `limit` | number | no | Query value for limit. Default: `30`. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `posts`, `total`, `page`, `stats`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/forum.routes.js:277`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### GET /api/forum/admin/analytics

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Retrieves admin analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `analytics`, `message`. Explicit status codes include 500. Server error

**Source:** `server/src/routes/forum.routes.js:340`; handler `inline handler` in `server/src/routes/forum.routes.js`.

### PATCH /api/forum/admin/posts/:id

**Auth:** `isAuthenticated`, `requireRole("super_admin")`

**Roles:** `super_admin`

**Middleware:** `isAuthenticated`, `requireRole("super_admin")`

**What it does:** Updates admin posts.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `isPinned` | string | no | Request value for is pinned. |
| `isLocked` | string | no | Request value for is locked. |
| `isDeleted` | string | no | Request value for is deleted. |

**Response:** JSON response fields observed in the handler include `success`, `message`, `post`. Explicit status codes include 404, 500. Post not found

**Source:** `server/src/routes/forum.routes.js:410`; handler `inline handler` in `server/src/routes/forum.routes.js`.

