# Unsubscribe Bug — Debug Notes

## Status: NOT FULLY FIXED YET — needs production testing after Vercel deploys

---

## The Bug

When a user receives a changelog/blog/legal email and clicks "Unsubscribe":
- If already logged in as a **different account**, the system unsubscribes the wrong person
- If not logged in, redirects to login — but after login, the `email` param was being dropped from the redirect URL
- Error pages show raw JSON `{"error":"Invalid unsubscribe link."}` instead of a proper HTML page

---

## Root Cause

**File:** `app/login/page.tsx` (lines 44-57)

The login page builds a redirect URL after login. For unsubscribe, it was building:
```
/api/preferences/unsubscribe?type=changelog&token=XXX
```

But it was **missing the `email` parameter**. So the unsubscribe route never knew which email the link was for.

**Fix applied:** Added `email` to the redirect URL:
```
/api/preferences/unsubscribe?type=changelog&email=user@example.com&token=XXX
```

---

## Files Changed

### 1. `app/login/page.tsx`
- Added `const targetEmail = searchParams.get("email");`
- Added `email` parameter to `unsubscribeReturnTo` URL

### 2. `app/api/preferences/unsubscribe/route.ts`
- Reads `email` from URL params
- Verifies HMAC token matches email
- If not logged in → redirects to `/login` with intent, type, email, token
- If logged in with WRONG email → redirects to `/logout` then login with error
- If logged in with CORRECT email → unsubscribes → green checkmark
- All error responses now show HTML pages, not JSON

### 3. `app/api/blog/unsubscribe/route.ts`
- All error responses now show HTML pages, not JSON

### 4. Platform worker (`server/src/workers/marketing-email-blast.worker.js`)
- Generates HMAC token for each email
- Builds URL: `/api/preferences/unsubscribe?type=X&email=Y&token=Z`

---

## Expected Flow

### Scenario 1: Not logged in
1. Click Unsubscribe in email
2. → Login page with yellow banner
3. → Log in with correct email
4. → Green checkmark success

### Scenario 2: Already logged in with correct email
1. Click Unsubscribe in email
2. → Green checkmark success immediately

### Scenario 3: Already logged in with wrong email
1. Click Unsubscribe in email
2. → Gets logged out
3. → Login page with RED error: "You must log in with the exact email address"
4. → Log in with correct email
5. → Green checkmark success

---

## What is still broken (as of 01:12 AM Aug 18)

1. Production (classgrid.in) still shows old JSON error — Vercel has not deployed latest commits yet
2. Need to verify all 3 scenarios on production after deployment
3. Old emails sent BEFORE the platform worker fix will have broken unsubscribe links (no email/token params)

---

## RULES — DO NOT BREAK THESE

1. DO NOT remove `getServerSession` from preferences/unsubscribe route — login is required
2. DO NOT remove the `email` parameter from login page redirect URL — that was the root cause
3. DO NOT make unsubscribe stateless/public — user wants login-based security
4. DO NOT show raw JSON errors — always use HTML error pages
5. DO NOT touch login page's general auth flow — only the `unsubscribeReturnTo` URL matters

---

## Git Commits (in order)

| Commit | What |
|--------|------|
| `cc7a6cf` | Replace all JSON errors with HTML pages in both routes |
| `e7da504` | Show proper HTML error page instead of raw JSON |
| `f9d75cd` | **ROOT CAUSE FIX** — login page: added missing `email` param |
| `8c0c318` | Restored login-based unsubscribe with email matching |
| `7ad2b3a` | (wrong) Made route stateless |
| `4cdcea6` | (wrong) Made route stateless with HMAC |
