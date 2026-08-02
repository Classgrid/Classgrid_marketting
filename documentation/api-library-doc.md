This reference is generated from the current Express route definitions and their handlers. It documents route-level authentication and authorization; deployment-wide middleware may add further checks.

## Conventions

- Base API origin: `https://api.classgrid.in`
- Authentication: authenticated routes use the Classgrid session/JWT recognized by `isAuthenticated`.
- JSON is the default request and response format unless an endpoint explicitly accepts multipart data or redirects.
- Path parameters are always required.
- A field marked `no` means the static handler scan did not find a direct required-field check; business rules may still make it conditionally required.
- Role checks can also accept `super_admin` through the shared authorization middleware where implemented.

This document contains **17 route definitions** from 1 source file.

## library.routes.js

**Mounted at:** `/api/library`

**File-wide middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

| Method | Path | Access |
|---|---|---|
| GET | `/api/library/institution-profile` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/library/catalog` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/library/books` | `org_admin`, `library_manager` |
| POST | `/api/library/import` | `org_admin`, `library_manager` |
| POST | `/api/library/issue` | `org_admin`, `library_manager` |
| POST | `/api/library/return` | `org_admin`, `library_manager` |
| GET | `/api/library/transactions` | `org_admin`, `library_manager` |
| GET | `/api/library/student/books` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/library/student/book-info` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/library/reserve` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| GET | `/api/library/reservations` | `org_admin`, `library_manager` |
| GET | `/api/library/student/reservations` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/library/cancel-reservation` | Any authenticated user, subject to organization, plan, and feature middleware listed below. |
| POST | `/api/library/fulfill-reservation` | `org_admin`, `library_manager` |
| GET | `/api/library/overdue-check` | `org_admin`, `library_manager` |
| GET | `/api/library/analytics` | `org_admin`, `library_manager` |
| DELETE | `/api/library/books/:id` | `org_admin`, `library_manager` |

### GET /api/library/institution-profile

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `attachInstitutionProfile()`

**What it does:** Retrieves institution profile.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `institution_profile`, `library_profile`, `learner_record_profile`.

**Source:** `server/src/routes/library.routes.js:14`; handler `inline handler` in `server/src/routes/library.routes.js`.

### GET /api/library/catalog

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves catalog.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `search` | string | no | Query value for search. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `books`. Explicit status codes include 400, 500. No organization linked

**Source:** `server/src/routes/library.routes.js:35`; handler `inline handler` in `server/src/routes/library.routes.js`.

### POST /api/library/books

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**Roles:** `org_admin`, `library_manager`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**What it does:** Creates or processes books.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | no | Request value for id. |
| `book_id` | string | yes | Request value for book id. |
| `book_name` | string | yes | Request value for book name. |
| `subject` | string | no | Request value for subject. |
| `total_copies` | number | no | Request value for total copies. |

**Response:** JSON response fields observed in the handler include `message`, `book`. Explicit status codes include 400, 409, 500. No organization linked

**Source:** `server/src/routes/library.routes.js:71`; handler `inline handler` in `server/src/routes/library.routes.js`.

### POST /api/library/import

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**Roles:** `org_admin`, `library_manager`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**What it does:** Imports the supplied records.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `books` | string | no | Request value for books. |

**Response:** JSON response fields observed in the handler include `message`, `aiFilledCount`, `records`. Explicit status codes include 400, 500. No organization linked

**Source:** `server/src/routes/library.routes.js:132`; handler `inline handler` in `server/src/routes/library.routes.js`.

### POST /api/library/issue

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**Roles:** `org_admin`, `library_manager`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**What it does:** Issues the requested item.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `book_db_id` | string | yes | Request value for book db id. |
| `student_mongo_id` | string | yes | Request value for student mongo id. |
| `copy_db_id` | string | no | Request value for copy db id. |
| `due_date` | string (date/time) | yes | Request value for due date. |

**Response:** JSON response fields observed in the handler include `message`, `transaction`. Explicit status codes include 400, 404, 500. Missing required fields for issuing

**Source:** `server/src/routes/library.routes.js:252`; handler `inline handler` in `server/src/routes/library.routes.js`.

### POST /api/library/return

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**Roles:** `org_admin`, `library_manager`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**What it does:** Records the requested item return.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `transaction_id` | string | yes | Request value for transaction id. |
| `fine_amount` | number | no | Request value for fine amount. |
| `fine_status` | string | no | Request value for fine status. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 404, 500. Transaction ID is required

**Source:** `server/src/routes/library.routes.js:344`; handler `inline handler` in `server/src/routes/library.routes.js`.

### GET /api/library/transactions

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**Roles:** `org_admin`, `library_manager`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**What it does:** Retrieves transactions.

**Path parameters:** None detected in the route or handler.

**Query parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `status` | string | no | Query value for status. |

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `transactions`, `message`. Explicit status codes include 500. Failed to fetch transactions

**Source:** `server/src/routes/library.routes.js:397`; handler `inline handler` in `server/src/routes/library.routes.js`.

### GET /api/library/student/books

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Retrieves student books.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `transactions`. Explicit status codes include 400, 500. No organization linked

**Source:** `server/src/routes/library.routes.js:443`; handler `inline handler` in `server/src/routes/library.routes.js`.

### POST /api/library/student/book-info

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Creates or processes student book info.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `book_name` | string | yes | Request value for book name. |
| `subject` | string | no | Request value for subject. |

**Response:** JSON response fields observed in the handler include `message`, `summary`. Explicit status codes include 400, 500. Book name is required

**Source:** `server/src/routes/library.routes.js:485`; handler `inline handler` in `server/src/routes/library.routes.js`.

### POST /api/library/reserve

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Student requests a hold on an unavailable book. Creates a reservation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `book_db_id` | string | yes | Request value for book db id. |

**Response:** JSON response fields observed in the handler include `message`, `reservation`. Explicit status codes include 400, 404, 409, 500. Book ID required

**Source:** `server/src/routes/library.routes.js:522`; handler `inline handler` in `server/src/routes/library.routes.js`.

### GET /api/library/reservations

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**Roles:** `org_admin`, `library_manager`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**What it does:** Admin views all pending reservations. Retrieves reservations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `reservations`, `message`. Explicit status codes include 500. Failed to fetch reservations

**Source:** `server/src/routes/library.routes.js:579`; handler `inline handler` in `server/src/routes/library.routes.js`.

### GET /api/library/student/reservations

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Student views their own reservations. Retrieves student reservations.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `reservations`, `message`. Explicit status codes include 500. Failed to fetch your reservations

**Source:** `server/src/routes/library.routes.js:604`; handler `inline handler` in `server/src/routes/library.routes.js`.

### POST /api/library/cancel-reservation

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**Roles:** Any authenticated user, subject to organization, plan, and feature middleware listed below.

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`

**What it does:** Cancels a reservation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `reservation_id` | string | yes | Request value for reservation id. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 400, 500. Reservation ID required

**Source:** `server/src/routes/library.routes.js:622`; handler `inline handler` in `server/src/routes/library.routes.js`.

### POST /api/library/fulfill-reservation

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**Roles:** `org_admin`, `library_manager`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**What it does:** Admin marks reservation as fulfilled (book issued). Fulfills a reservation.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:**

| Field | Type | Required | Description |
|---|---|---|---|
| `reservation_id` | string | no | Request value for reservation id. |

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Reservation fulfilled & student notified

**Source:** `server/src/routes/library.routes.js:642`; handler `inline handler` in `server/src/routes/library.routes.js`.

### GET /api/library/overdue-check

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**Roles:** `org_admin`, `library_manager`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**What it does:** Retrieves overdue check.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`, `sent`, `totalOverdue`. Explicit status codes include 500. No overdue books!

**Source:** `server/src/routes/library.routes.js:695`; handler `inline handler` in `server/src/routes/library.routes.js`.

### GET /api/library/analytics

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**Roles:** `org_admin`, `library_manager`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**What it does:** Retrieves analytics.

**Path parameters:** None detected in the route or handler.

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `success`, `summary`, `mostIssued`, `topDefaulters`, `trends`, `message`. Explicit status codes include 500. Failed to fetch analytics

**Source:** `server/src/routes/library.routes.js:759`; handler `inline handler` in `server/src/routes/library.routes.js`.

### DELETE /api/library/books/:id

**Auth:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**Roles:** `org_admin`, `library_manager`

**Middleware:** `isAuthenticated`, `attachInstitutionProfile({required:false})`, `requireRole('org_admin','library_manager')`

**What it does:** Deletes books.

**Path parameters:**

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Path identifier/value for id. |

**Query parameters:** None detected in the route or handler.

**Body:** None detected in the route or handler.

**Response:** JSON response fields observed in the handler include `message`. Explicit status codes include 500. Book deleted

**Source:** `server/src/routes/library.routes.js:858`; handler `inline handler` in `server/src/routes/library.routes.js`.

