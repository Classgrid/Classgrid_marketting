# Fix Ticket/Enquiry Follow-Up & Closed-Status Logic in Both Email AI & Chat AI

Codex reviewed every line of both `email-processor.ts` and `server.ts` and found **real bugs and missing features**. This plan fixes all of them.

---

## Bugs Found by Codex (Confirmed)

### Email AI (`email-processor.ts`)

| # | Bug | Impact |
|---|---|---|
| 1 | `threadId` is declared as `const` (line 148) but reassigned on line 195 inside the closed-ticket branch | **Runtime crash** — the closed-ticket flow never actually works |
| 2 | No ticket **reply API** call for open tickets | Follow-up emails are never appended to the actual platform ticket — only an internal email alert is sent to team@ |
| 3 | No Sanity document patch for non-platform follow-ups | Enquiry documents in Sanity are never updated with follow-up messages |

### Chat AI (`server.ts`)

| # | Bug | Impact |
|---|---|---|
| 4 | `savedTicketId` on lines 590 & 601 is not in scope — it's declared later at line 617 | **Runtime crash** — Redis write fails, session tracking breaks |
| 5 | Platform tickets are stored in Sanity as `"handled"`, but recovery query only looks for `"pending"` or `"enquiry_created"` | Platform user tickets are **never recovered** after Redis expires or chat is cleared |
| 6 | If Redis already has a cached session, the MongoDB closed-status check is **skipped entirely** | Admin closes a ticket, but AI keeps appending to it within the 1-hour Redis TTL |
| 7 | Follow-up append only happens when AI emits an `[ESCALATE:]` tag | If the user writes a simple follow-up and the AI responds normally (no escalate tag), nothing is appended |

---

## Proposed Changes

### Email AI (`email-processor.ts`)

#### [MODIFY] [email-processor.ts](file:///c:/classgrid_marketting/Classgrid_marketting/lib/email-ai/email-processor.ts)

**Fix 1 — `const` → `let` for `threadId` (line 148)**
- Change `const threadId` to `let threadId` so the closed-ticket branch can reassign it without crashing.

**Fix 2 — Add ticket reply API call for open-ticket follow-ups (line 359–403)**
- Inside the `else if (escalateMatch && alreadyEscalated)` block, after sending the team alert email, add a `fetch()` call to `POST /api/support/public/tickets/{escalatedTicketId}/reply` to append the follow-up message directly into the existing platform ticket.
- This mirrors the exact same logic that Chat AI already has at lines 628–651.

**Fix 3 — Add Sanity document patch for non-platform follow-ups (line 359–403)**
- Inside the same `alreadyEscalated` block, if the conversation does NOT have an `escalatedTicketId` (non-platform user), patch the Sanity `aiEscalation` document to append the follow-up to `chatTranscript`.
- This mirrors Chat AI's Sanity patch at lines 657–679.

---

### Chat AI (`server.ts`)

#### [MODIFY] [server.ts](file:///c:/classgrid_marketting/Classgrid_marketting/server-ai/server.ts)

**Fix 4 — `savedTicketId` → `escalationId` in initial Redis writes (lines 590 & 601)**
- Replace `escalationId: savedTicketId` with `escalationId: escalationId` since `escalationId` is the variable that holds the Sanity doc ID at that point (declared at line 521, assigned at line 556).

**Fix 5 — Include `"handled"` in Sanity recovery query (line 403)**
- Change the GROQ query from `status in ["pending", "enquiry_created"]` to `status in ["pending", "enquiry_created", "handled"]` so that platform tickets (which are stored as `"handled"`) can also be recovered.

**Fix 6 — Re-check MongoDB ticket status even when Redis has a cached session (around line 382)**
- Move the MongoDB closed-ticket check to ALSO run when `alreadyEscalated` comes from Redis (not just from the Sanity fallback).
- If Redis returns a cached session with a `ticketId`, query MongoDB to verify the ticket is not closed. If it IS closed, clear `alreadyEscalated` so a new ticket is created.

**Fix 7 — This is NOT a bug, by design**
- The follow-up append only happens when the AI emits `[ESCALATE:]`. This is actually correct behavior — if the user asks a general question and the AI answers it normally without escalating, there's no reason to append that to the ticket. The user might just be chatting casually. Only when the AI determines "this needs team attention" does it emit `[ESCALATE:]` and trigger the follow-up flow. **No change needed here.**

---

## Verification Plan

### Manual Verification
1. Restart `server-ai` (pm2 restart) after all fixes
2. Test Chat AI: Send an escalation as a platform user → verify ticket created → close the ticket in Super Admin → send another message → verify NEW ticket is created (not appended to closed one)
3. Test Chat AI: Send an escalation as a non-platform user → verify enquiry created → clear chat → send follow-up → verify it appends to existing enquiry (not duplicate)
4. Test Email AI: Send an email that triggers escalation → verify ticket created → send follow-up email → verify it appends to existing ticket via reply API

> [!IMPORTANT]
> Fix 7 (follow-up only on ESCALATE tag) is intentionally NOT changed. The AI decides when something needs team attention. Casual chat messages should NOT be appended to tickets. Do you agree with this decision?
