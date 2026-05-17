# Classgrid Documentation — MD File Format Specification
# Give this file to Codex as the exact format to follow for ALL generated content.
# =========================================================================

## FOLDER STRUCTURE TO CREATE

```
/docs/
├── api/
│   ├── overview.md
│   ├── authentication.md
│   ├── admissions.md
│   ├── students.md
│   ├── fees.md
│   ├── attendance.md
│   ├── webhooks.md
│   └── rate-limits.md
├── guides/
│   ├── getting-started.md
│   ├── onboarding-admin.md
│   ├── onboarding-teacher.md
│   ├── onboarding-student.md
│   ├── dashboard-overview.md
│   ├── fee-management.md
│   ├── attendance-tracking.md
│   ├── admission-workflow.md
│   ├── report-generation.md
│   ├── user-management.md
│   ├── roles-permissions.md
│   ├── notifications.md
│   ├── integrations.md
│   ├── data-export.md
│   └── troubleshooting.md
└── faq/
    ├── general.md
    ├── account-auth.md
    ├── dashboard.md
    ├── billing-pricing.md
    ├── integrations.md
    ├── roles-permissions.md
    ├── data-privacy.md
    └── troubleshooting.md
```

---

## FORMAT 1 — HELP CENTER ARTICLE (guides/ and api/)

Used for: guides, API docs, getting-started, troubleshooting, walkthroughs
Sanity type: `helpArticle`

```markdown
---
title: "Getting Started with Classgrid"
slug: "getting-started"
category: "Getting Started"
summary: "A complete walkthrough to set up your institution on Classgrid from scratch."
tags: [setup, onboarding, admin]
type: helpArticle
---

## Overview

Brief 2-3 sentence intro explaining what this article covers and who it is for.

## Prerequisites

- What the user needs before starting
- Role required (Admin / Teacher / Student)
- Any setup that must happen first

## Step 1 — [Action Title]

Clear step description. What to click, where to go, what happens.

> **Tip:** Any helpful shortcut or best practice goes here.

## Step 2 — [Action Title]

Continue steps logically. Each step = one clear action.

> **Warning:** Any important caution or data risk.

## Step 3 — [Action Title]

...

## Common Mistakes

- Mistake 1 and how to avoid it
- Mistake 2 and how to avoid it

## Related Articles

- [Link to related guide]
- [Link to another article]
```

---

## FORMAT 2 — FAQ ITEM

Used for: faq/ folder
Sanity type: `faqItem`

Each FAQ file can contain MULTIPLE questions under one category.

```markdown
---
category: "Getting Started"
type: faqItem
displayPages: [home, help-center]
---

### What is Classgrid?

Classgrid is an all-in-one education management platform built for schools, colleges, junior colleges, and coaching institutes. It unifies admissions, academics, fee collection, attendance, communication, and analytics into a single system — eliminating disconnected tools and manual processes.

---

### How long does it take to set up Classgrid for my institution?

Most institutions are fully live within 3–7 working days. Our onboarding team handles data migration, role setup, and initial configuration. You just need to provide your institution's existing student, staff, and course data.

---

### Do I need technical knowledge to use Classgrid?

No. Classgrid is designed for non-technical administrators, teachers, and staff. The interface is intuitive, and our Help Center has step-by-step guides for every workflow.

---
```

---

## FORMAT 3 — API DOCUMENTATION

Used for: api/ folder
Sanity type: `helpArticle` with category: "API Reference"

```markdown
---
title: "Authentication API"
slug: "api-authentication"
category: "API Reference"
summary: "Learn how to authenticate with the Classgrid API using JWT tokens and OAuth."
tags: [api, authentication, jwt, oauth]
type: helpArticle
---

## Overview

Brief description of what this API covers.

## Base URL

```
https://api.classgrid.in/v1
```

## Authentication

All API requests require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

---

## Endpoint: POST /auth/login

**Description:** Authenticate a user and receive a JWT token.

**Auth Required:** No

### Request Body

| Field      | Type   | Required | Description           |
|------------|--------|----------|-----------------------|
| email      | string | Yes      | User's email address  |
| password   | string | Yes      | User's password       |
| institutionId | string | Yes   | Institution identifier |

### Example Request

```json
{
  "email": "admin@institution.edu",
  "password": "your_password",
  "institutionId": "inst_abc123"
}
```

### Example Response (200 OK)

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR...",
  "expiresIn": 86400,
  "user": {
    "id": "user_xyz",
    "email": "admin@institution.edu",
    "role": "admin"
  }
}
```

### Error Responses

| Status | Code               | Description                     |
|--------|--------------------|---------------------------------|
| 401    | INVALID_CREDENTIALS | Wrong email or password         |
| 403    | ACCOUNT_DISABLED   | Account suspended by super-admin |
| 429    | RATE_LIMITED       | Too many login attempts          |

---

## Rate Limits

| Endpoint        | Limit          |
|-----------------|----------------|
| /auth/*         | 10 req/minute  |
| /students/*     | 100 req/minute |
| /fees/*         | 60 req/minute  |

---
```

---

## RULES FOR CODEX

1. Every file must start with the `---` frontmatter block
2. `slug` must be lowercase, hyphens only, no spaces
3. `category` must EXACTLY match one of: Getting Started, Guides, FAQ, API Reference, Release Notes, I am an Admin, I am a Teacher, I am a Student
4. `type` field must be exactly: `helpArticle` or `faqItem`
5. `displayPages` for faqItems must be an array: `[home]` (shows on homepage) or `[home, help-center]` (shows both places)
6. Use only REAL Classgrid features from the codebase — no invented functionality
7. All steps must be specific and actionable
8. Minimum article length: 300 words. Maximum: 2000 words.
9. FAQ answers: 40–120 words each. Clear, professional, no fluff.
10. Heading hierarchy: H2 for sections, H3 for sub-sections, H3 for FAQ questions

---

## IMPORT COMMAND (run after Codex creates files)

```bash
node scripts/import-docs-to-sanity.mjs
```

This script will automatically read all /docs/ MD files and push them into Sanity.
