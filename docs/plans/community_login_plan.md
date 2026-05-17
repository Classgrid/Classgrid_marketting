# Forum Login System — Implementation Plan

---

> [!CAUTION]
> ## ⛔ STRICT RULES — READ BEFORE WRITING A SINGLE LINE OF CODE
>
> ### 🔒 SCOPE: Only work in  `classgrid_marketting`
> - **ALL changes go in:** `C:\Users\nikhi\OneDrive\Documents\classgrid_marketting\`
> - **NEVER touch:** `C:\Users\nikhi\OneDrive\Documents\Classgrid_platfrom\classgrid_platform\`
> - The platform project (`classgrid_platform`) is a **READ-ONLY reference**. You may look at its code to understand patterns, but you must NEVER modify, delete, or add any file to it.
>
> ### 🔒 DO NOT INSTALL packages globally or change `package.json` scripts
> Only add to the `dependencies` section of `classgrid_marketting/package.json`.
>
> ### 🔒 TypeScript ONLY — No `.js` or `.jsx` files
> This project enforces TypeScript. Every new file must use `.ts` or `.tsx`. The build will fail otherwise.
>
> ### 🔒 Do NOT break existing pages or components
> - Do NOT modify `Footer.tsx`, `LayoutBits.tsx`, `layout.tsx`, `page.tsx`, or any existing component unless the plan explicitly says so.
> - Do NOT change any Sanity schema files.
> - Do NOT change any existing API routes in `app/api/`.
>
> ### 🔒 Do NOT use Supabase Auth for this feature
> This login system uses **MongoDB + NextAuth.js**. Do not introduce Supabase auth flows. Supabase is only used in this project for realtime chat features — do not expand its usage.
>
> ### 🔒 Environment Variables go in `.env.local` ONLY
> - Add new env vars to `classgrid_marketting/.env.local`
> - Do NOT hardcode any secrets, API keys, or passwords anywhere in the code.
> - Do NOT commit `.env.local` to git.
>
> ### 🔒 The `ForumUser` model is a SEPARATE collection
> - Do NOT use or import the `User` model from `classgrid_platform`.
> - Create a fresh `ForumUser` Mongoose model in `classgrid_marketting/lib/models/ForumUser.ts`.
> - The only read-only cross-check against the main `User` collection is to set `isPlatformUser: true`. This is a READ operation only — never write to the platform's `User` collection.
>
> ### 🔒 No Redis — Use in-memory rate limiting
> This project does not have Redis. Use the `lib/rate-limit.ts` in-memory Map pattern described below. Do NOT install `ioredis` or `redis`.
>
> ### 🔒 Do NOT change the Discourse SSO secret after generating it
> Once `DISCOURSE_SSO_SECRET` is set in `.env.local`, never change it. Changing it will break the live forum SSO connection.

---

## Goal
Add a complete, production-grade authentication system to `classgrid_marketting` to serve as the login gateway for the Discourse forum at `forum.classgrid.in`. Users can sign in with Google, GitHub, or Email+OTP. After login, the system checks if they are a platform user in the MongoDB DB and issues a secure session. A Discourse SSO bridge endpoint connects the forum to this auth system.

---

## Environment Variables to Add
Add the following to `.env.local` in `classgrid_marketting` (copy values from `classgrid_platform/server/.env`):

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.example.mongodb.net/classgrid?retryWrites=true&w=majority

# JWT / Session
JWT_SECRET=replace-with-long-random-secret
NEXTAUTH_SECRET=replace-with-long-random-secret
NEXTAUTH_URL=https://classgrid.in

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Brevo Email (for OTP)
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=your-brevo-smtp-login
BREVO_SMTP_PASS=your-brevo-smtp-key
BREVO_SENDER_NAME=Classgrid
BREVO_SENDER_EMAIL=support@classgrid.in

# Discourse SSO Secret (set a strong random string here)
DISCOURSE_SSO_SECRET=replace-with-strong-random-secret
```

---

## Packages to Install
```bash
npm install next-auth mongoose nodemailer @auth/mongodb-adapter
```
> Note: `nodemailer` is already in `package.json` — skip if present. `mongoose` is not currently installed in `classgrid_marketting`.

---

## Files to Create / Modify

### 1. [NEW] `lib/mongodb.ts`
MongoDB singleton connection for Next.js (same pattern as `classgrid_platform`).
```ts
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI!;
let cached = (global as any).mongoose || { conn: null, promise: null };
export async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  (global as any).mongoose = cached;
  return cached.conn;
}
```

### 2. [NEW] `lib/models/ForumUser.ts`
Lightweight Mongoose model for forum-only users. **Does NOT share the same collection as `org.classgrid.in` users.** Stores email, name, avatar, provider, and `isPlatformUser` flag.
```ts
// Fields: email, name, avatar, provider (google|github|email), isPlatformUser (bool), emailVerified (bool), createdAt
```

### 3. [NEW] `lib/models/ForumOTP.ts`
OTP model for email verification. Stores `email`, `otp` (6-digit), `expiresAt` (10 min TTL), `attempts` (max 3).

### 4. [NEW] `lib/auth.ts`
NextAuth.js v5 configuration file. Configures:
- **GoogleProvider** using `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET`
- **CredentialsProvider** for Email+OTP flow (verifies OTP, then finds/creates ForumUser in MongoDB)
- **GitHubProvider** using `GITHUB_CLIENT_ID` + `GITHUB_CLIENT_SECRET`
- JWT session strategy (stateless, no DB sessions needed)
- On `signIn` callback: checks if the user's email exists in the main `User` collection in MongoDB → sets `isPlatformUser: true` on the session token

### 5. [NEW] `app/api/auth/[...nextauth]/route.ts`
Standard NextAuth.js catch-all route handler.

### 6. [NEW] `app/api/forum/send-otp/route.ts`
API route to send OTP email for login.
- **Rate limit:** 5 OTPs per email per hour (use in-memory or `lru-cache` — no Redis needed for marketing site)
- Generates a 6-digit OTP, saves to `ForumOTP` collection with 10-min expiry
- Sends email via Brevo SMTP using `nodemailer`
- Email template: Clean, branded "Your Classgrid Login Code: **123456**"

### 7. [NEW] `app/api/sso/discourse/route.ts`
The Discourse SSO bridge endpoint. This is what Discourse calls when a user clicks "Login" on the forum.
- Receives the `sso` and `sig` query parameters from Discourse
- Verifies the HMAC-SHA256 signature using `DISCOURSE_SSO_SECRET`
- Checks the user's NextAuth session (`getServerSession`)
- If not logged in → redirects to `/login?redirect_discourse=true`
- If logged in → builds the SSO payload (name, email, external_id, avatar_url, add_groups)
- Signs it and redirects back to `forum.classgrid.in/session/sso_login`

### 8. [NEW] `app/login/page.tsx`
The login page must look **exactly like the Cursor login page** (layout, spacing, proportions) but using Classgrid's brand colors.

**Layout & Styling rules:**
- **Background:** Use `bg-background` (your system's **#0f0f0f** greyish-black), NOT solid black like the footer.
- **Centering:** Card should be perfectly centered on the page.
- **Design Tokens:** Use `text-foreground`, `border-border`, and `text-muted-foreground`.
- **The Card:** Use `bg-card` (your system's **#141414**) or a subtle elevation with `border border-border rounded-xl`.

**Content (top to bottom — matches Cursor screenshots):**
1. Top-left: `CLASSGRID.` logo wordmark (white, bold, tracking-tighter).
2. Heading: `"Welcome to Classgrid"` — large, white, font-bold.
3. Subheading: `"The all-in-one platform for modern institutions"` — muted-foreground, smaller.
4. Button: `"Continue with Google"` — Google icon, `bg-secondary` or dark with border.
5. Button: `"Continue with GitHub"` — GitHub icon, dark with border.
6. Button: `"Continue with LinkedIn"` — LinkedIn icon (replaces Apple).
7. Divider with label `"or"`.
8. Email label + input field: placeholder `"Your email address"`.
9. **Step 1:** `"Continue"` button (full width) — sends OTP.
10. **Step 2 (after OTP sent):** 6 OTP digit boxes + `"Sign In"` button.
11. Toggle link: `"Don't have an account? Sign up"` (switches to First/Last name fields).
12. Bottom footer links: Redirect to **your** `/privacy` and `/terms` pages.

**Logic:**
- All auth handled via NextAuth.js.
- LinkedIn button calls `signIn("linkedin")`.
- Sign-up mode saves user to `ForumUser` collection in MongoDB.

### 9. [NEW] `app/login/loading.tsx`
Simple skeleton/spinner loading state for the login page.

### 10. [NEW] `app/profile/page.tsx` (Verification Page)
A simple page to verify the login worked on localhost.
- Use `getServerSession` to get user data.
- If not logged in → redirect to `/login`.
- **UI:**
  - Heading: "Account Verified"
  - Display: Name, Email, Provider (Google/GitHub/LinkedIn/Email).
  - **Platform Check:** If `isPlatformUser` is true:
    - Show Emerald Badge: "✓ Verified Classgrid Platform Member"
    - Show "Organization: [Org Name]" (Fetch this from the main `User` collection in MongoDB during the session callback).
  - **New User:** If not a platform user, show "Welcome to the Classgrid Community!"

### 11. [MODIFY] `middleware.ts` (create if not exists)
Protect `/api/sso/discourse` and `/profile` — redirect to login if no session.

---

## Rate Limiting Strategy (No Redis needed)

Since this is a Next.js app on Vercel/EC2 (not an Express server), we use an in-memory `Map` with TTL cleanup instead of `express-rate-limit`:

```ts
// lib/rate-limit.ts
const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const record = store.get(key);
  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true; // allowed
  }
  if (record.count >= max) return false; // blocked
  record.count++;
  return true; // allowed
}
```

Apply limits:
- **OTP send:** 5 per email per hour
- **Login attempts:** 10 per IP per 15 minutes

---

## Platform User Check Logic

In the NextAuth `jwt` callback, after a user signs in via Google/GitHub/OTP:
1. Connect to MongoDB
2. Query the main `User` collection: `User.findOne({ email: user.email })`
3. If found → set `token.isPlatformUser = true`, `token.platformRole = user.role`
4. This gets passed to the session and also embedded in the Discourse SSO payload as a group

---

## Discourse SSO Flow (Visual)

```
User clicks "Login" on forum.classgrid.in
        ↓
Discourse redirects to: classgrid.in/api/sso/discourse?sso=...&sig=...
        ↓
Next.js verifies signature, checks session
        ↓ (not logged in)
Redirect to: classgrid.in/login?next=/api/sso/discourse
        ↓ (logged in)
Build SSO payload → sign → redirect back to forum
        ↓
User is logged into Discourse as "Platform User" (if applicable)
```

---

## Email Templates

### Source File (READ ONLY — copy from here, never edit it)
`C:\Users\nikhi\OneDrive\Documents\Classgrid_platfrom\classgrid_platform\server\src\services\email-templates.service.js`

### Destination File (CREATE THIS)
`classgrid_marketting/lib/email-templates.ts`

> [!CAUTION]
> Copy ALL functions from the source file **exactly as-is** — do not rewrite, shorten, or summarize them. The HTML must be identical.

**Copy these functions EXACTLY (word for word, HTML and CSS unchanged):**
- `baseTemplate` (the shared layout wrapper)
- `getPasswordResetEmailHtml` → rename to `getForumPasswordResetEmailHtml`
- `getStudentWelcomeEmailHtml` → rename to `getForumWelcomeEmailHtml`, change heading to `"Welcome to the Classgrid Community"` and remove classroom/honor code references
- `getLoginNotificationHtml` → keep as-is, rename to `getForumLoginNotificationHtml`
- `getVerificationEmailHtml` → keep as-is, rename to `getForumVerificationEmailHtml`

**Create this NEW function (does not exist in the platform yet):**
```ts
export function getForumOtpEmailHtml(otp: string): string {
  // Use the same baseTemplate structure
  // Display the OTP in the .box .code style:
  // monospace font, 24px, letter-spacing: 4px, color: #ffffff
  // Body text: "Use the following code to sign in. Expires in 10 minutes."
  // Footer: "Never share this code with anyone."
}
```

**Rules for converting JS → TypeScript:**
- Change `export const fnName = (args) =>` to `export function fnName(args: string): string`
- The `getFrontendUrl` helper → replace with: `const FRONTEND_URL = process.env.NEXTAUTH_URL ?? "https://classgrid.in";`
- Keep `PLATFORM_LOGO_URL` and `baseTemplate` exactly the same
- Add types to all function parameters
- Do NOT import or reference anything from `classgrid_platform`
- Do NOT use `module.exports`

---

## Verification Plan
1. Run `npm run dev` — confirm no TypeScript/build errors
2. Visit `http://localhost:3000/login` — verify UI renders correctly
3. Test Google OAuth flow end-to-end (redirects and session)
4. Test GitHub OAuth flow end-to-end
5. Test Email OTP: send OTP → receive in inbox → verify → session created
6. Test rate limiting: send OTP 6 times → confirm 6th is blocked
7. Test `/api/sso/discourse` returns 400 for invalid signature
8. Once Discourse is live: test full SSO round-trip
