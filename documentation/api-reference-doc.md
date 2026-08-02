---
title: API Reference & Guidelines
description: "Complete technical reference for the Classgrid REST API"
---

# API Reference & Guidelines

The Classgrid API allows you to programmatically manage your institution's data, including students, faculty, billing, and attendance records.

## Base URL

All API requests should be made to the following base URL:

```text
https://api.classgrid.in/v1
```

## Authentication

Classgrid uses API keys to authenticate requests. You can view and manage your API keys in the Classgrid Developer Dashboard. 

Your API keys carry many privileges, so be sure to keep them secure! Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.

All API requests must be made over **HTTPS**. Calls made over plain HTTP will fail. API requests without authentication will also fail.

Include the API key in the `Authorization` header:

```http
Authorization: Bearer <YOUR_API_KEY>
```

<br/><br/>

## Core Endpoints

### 1. Retrieve a Student
Retrieves the details of an existing student. You need only supply the unique student identifier that was returned upon student creation.

**GET** `/students/{student_id}`

**Response:**
```json
{
  "id": "stu_123456789",
  "name": "Akash Sharma",
  "email": "akash.sharma@example.com",
  "department": "Computer Engineering",
  "status": "active",
  "created_at": "2026-08-01T10:00:00Z"
}
```

### 2. Record Attendance
Records daily attendance for a specific batch or class.

**POST** `/attendance/record`

**Payload:**
```json
{
  "batch_id": "batch_cs_2026",
  "date": "2026-08-02",
  "records": [
    { "student_id": "stu_123456789", "status": "present" },
    { "student_id": "stu_987654321", "status": "absent" }
  ]
}
```

<br/><br/>

## Error Codes

Classgrid uses standard HTTP response codes to indicate the success or failure of an API request.

*   **200 OK** - Everything worked as expected.
*   **400 Bad Request** - The request was unacceptable, often due to missing a required parameter.
*   **401 Unauthorized** - No valid API key provided.
*   **403 Forbidden** - The API key doesn't have permissions to perform the request.
*   **404 Not Found** - The requested resource doesn't exist.
*   **429 Too Many Requests** - Too many requests hit the API too quickly. We recommend an exponential backoff of your requests.
*   **500, 502, 503, 504 Server Errors** - Something went wrong on Classgrid's end. (These are rare).
