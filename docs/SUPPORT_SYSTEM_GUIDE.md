# Classgrid Support System Guide

> Internal documentation for the Classgrid support architecture.
> This document is indexed by the RAG AI to understand support channels.

## Overview

Classgrid has **three distinct support channels** that serve different user types. It is critical that the AI (and users) understands which channel to use for which situation.

---

## 1. Formal Support Ticket System

**URL:** `/support/ticket`  
**Track tickets at:** `/support/requests`

### Who Can Use It
- **Verified institution users ONLY** — students, faculty, and administrators whose email is linked to an active Classgrid institution in the database.
- An `organization_id` must be present in the user's profile.
- Users who registered via Classgrid Talk or random signup **without** an institution link **cannot** raise formal tickets. They see a `NO_ORG` error and an "Institution Not Found" screen.

### Authentication Flow (3 States)
1. **Not logged in** → User is prompted to sign in at `/login?next=/support/ticket`
2. **Logged in, no institution** → "Institution Not Found" screen with guidance to:
   - Contact their institution administrator to link the email
   - Email `support@classgrid.in` directly
   - Use the general inquiry form at `/support/inquiry`
3. **Verified platform user** → Can submit new tickets and view existing ones at `/support/requests`

### What Tickets Support
- **Categories:** general, technical, billing & payments, account & access, feature request, other
- **Priority levels:** low (minor), medium (affecting work), high (blocking critical operations)
- **Rich text description** with formatting, images, and links
- **File attachments** up to 5 MB each, up to 5 files
- **Image embeds** in the description via Supabase storage

### Ticket Lifecycle
- **Statuses:** open → in_progress → resolved / closed
- Users can **reply** to open tickets at `/support/requests/[id]`
- Classgrid support team replies with verified "admin" badge
- Closed/resolved tickets cannot receive new replies; a new ticket must be opened

### Technical Architecture
- The ticket API is served from the **Classgrid Platform API** (`NEXT_PUBLIC_PLATFORM_API_URL`), NOT from the marketing site
- Endpoints:
  - `POST /api/support/public/tickets` — create ticket
  - `GET /api/support/public/tickets` — list user's tickets
  - `GET /api/support/public/tickets/:id` — ticket detail (email ownership verified)
  - `POST /api/support/public/tickets/:id/reply` — add reply

---

## 2. Classgrid Talk (Community Forum)

**URL:** `/community`  
**Platform:** Powered by Discourse (self-hosted)

### Who Can Use It
- **Anyone** — Classgrid Talk is open to all, not restricted to institution users
- No institution verification required to join

### What It Is For
- General discussion about Classgrid features and capabilities
- Questions about how to use the platform (peer-to-peer support)
- Sharing workflows, tips, and best practices
- Feature suggestions and product feedback
- Educational conversations about campus management
- Community updates and announcements

### What It Is NOT For
- Critical technical issues requiring SLA response
- Billing disputes or payment problems
- Account security concerns
- Institution-specific data queries

### Important Distinction
- **Classgrid Talk accounts ≠ Institution Classgrid accounts**
- A user who only has a Classgrid Talk account **cannot** raise formal support tickets unless their email is also linked to an institution in the platform database
- If a Classgrid Talk user needs formal support, they must contact their institution admin or email `support@classgrid.in`

---

## 3. General Inquiry Form (Pre-Sales / Prospective)

**URL:** `/support/inquiry`

### Who Uses It
- Prospective institutions exploring Classgrid
- Partners or vendors wanting to connect
- Anyone without an active Classgrid subscription who has questions

### What It Is For
- Pre-sales questions and demo requests
- Partnership inquiries
- General questions for the Classgrid team

---

## Support Routing Decision Guide

| User Type | Recommended Channel |
|-----------|-------------------|
| Active institution user (student/faculty/admin) | `/support/ticket` |
| Classgrid Talk member without institution | Email `support@classgrid.in` or `/support/inquiry` |
| Prospective institution | `/support/inquiry` |
| General community questions | `/community` (Classgrid Talk) |
| Tracking existing ticket | `/support/requests` |

---

## Contact Information

- **Support Email:** support@classgrid.in
- **Phone:** +91 8623947038, +91 8149277038
- **Headquarters:** Akurdi Railway Station Road, Sector No. 26, Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra 411044, India

---

*Last updated: 2026-05-18. This document is auto-indexed by the Classgrid RAG AI system.*
