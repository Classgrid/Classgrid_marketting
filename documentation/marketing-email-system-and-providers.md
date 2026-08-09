# Classgrid Marketing & Legal Email Sending Logic

This document details the exact technical implementation of the bulk email sending logic, specifically how limits, daily quotas, and providers are handled in the `marketing-email-blast.worker.js` background worker.

## 1. Marketing & Product Updates (Blog & Changelog)

**Providers Used:** Brevo SMTP (Primary) + Resend SMTP (Fallback)
**Use Case:** Sending newsletters, product updates, and changelog announcements.

### The "Waterfall" Quota System
Since these emails are sent using free-tier consumer products, they are subject to strict daily sending limits (e.g., Brevo = 300/day, Resend = 100/day). The worker handles this seamlessly:

1. **Primary Provider (Brevo):** The server begins iterating through the subscriber list and attempts to send via Brevo.
2. **Instant Fallback (Resend):** If Brevo hits its daily quota and throws an error, the worker catches the error and instantly switches to the Resend transporter without interrupting the loop.
3. **Limit Detection & Pausing:** If Resend *also* hits its quota (e.g., throws a 429 Too Many Requests error), the worker detects this global rate limit. 
4. **State Persistence:** The worker immediately pauses the loop, saves the exact number of successfully sent emails (`sent_count`) in the database, and flags the batch as `rate_limited`.

### The 24-Hour Resumption Cycle
If a broadcast requires 1,000 emails, and the combined daily limit is 400, the system automatically stretches the broadcast across multiple days:
*   **Day 1:** Sends emails 1 to 400. Hits the limit. Pauses.
*   **Day 2:** Exactly 24 hours later, the cron job wakes up, checks the database, finds the paused batch, and resumes sending **exactly from subscriber #401**. It sends emails 401 to 800.
*   **Day 3:** Resumes from 801 to 1,000. Marks the broadcast as `completed`.

This allows Classgrid to blast thousands of marketing emails on free tiers without any manual intervention.

---

## 2. Legal & Compliance Updates

**Provider Used:** AWS SES (Amazon Simple Email Service)
**Use Case:** Sending mandatory legal notices (Privacy Policy updates, Terms of Service changes, etc.) to all users and subscribers.

### Infinite Daily Limits
Unlike marketing emails, legal updates are sent using AWS SES. Because SES is a professional cloud infrastructure service, it does **not** have a small daily limit (typically starting at 50,000/day and scaling to millions). 
Therefore, if you need to blast 10,000 users about a Privacy Policy update, the system will deliver all 10,000 emails on the exact same day.

### The "Per-Second" Throttle
While AWS SES has a massive daily limit, it strictly enforces a *per-second* speed limit (e.g., 14 emails per second). 

To prevent crashing the SES connection and getting blocked, the worker script includes a built-in throttle specifically for legal emails:
```javascript
// Slight delay to respect SES 14/sec rate limits
if (item.document_type === "legalPage") {
  await new Promise(res => setTimeout(res, 100)); // 10 per sec
}
```
By forcing a tiny 100-millisecond delay between each email, the worker reliably streams out exactly 10 emails per second. This ensures 100% deliverability for critical legal notices while staying safely under the AWS SES speed limit.

---

## 3. The 19-Email Architecture Map

The Classgrid platform sends exactly 19 distinct emails across the Marketing site and Platform backend. They are strictly segregated into categories based on their purpose and infrastructure.

### 🟢 Category 1: Marketing & Updates (4 Emails)
**Provider:** Brevo SMTP (with Resend as fallback)  
**Purpose:** Keep subscribers engaged with product updates and company news.

1. **Blog Welcome Email** (`/api/blog/subscribe`)
2. **Changelog Welcome Email** (`/api/blog/subscribe`)
3. **Blog Broadcast** (`marketing-email-blast.worker.js`)
4. **Changelog Broadcast** (`marketing-email-blast.worker.js`)

### ⚖️ Category 2: Legal & Compliance (5 Emails)
**Provider:** AWS SES (Amazon Simple Email Service)  
**Purpose:** Mandatory legal notifications.

5. **Privacy Policy Update** 
6. **Terms of Service Update**
7. **Security Policy Update**
8. **Cookies Policy Update**
9. **Disclaimer Update**

### 🔒 Category 3: Authentication & Security (2 Emails)
**Provider:** AWS SES & Resend  
**Purpose:** Critical security infrastructure for the Community/Docs portals.

10. **Login OTP Codes (6-digits)** (AWS SES)
11. **"No Account Found" Alert** (Resend)

### 🏢 Category 4: Transactional & Internal Operations (8 Emails)
**Provider:** AWS SES  
**Purpose:** Direct communication between leads, users, and the Classgrid internal team.

12. **User Review Submitted** (`team@classgrid.in`)
13. **User Review "Thank You"** (The Reviewer)
14. **Demo Booking Confirmed** (Lead & Admin)
15. **Demo Booking Updated** (Lead)
16. **Contact Form Submission** (`team@classgrid.in`)
17. **Careers App Submitted** (The Applicant)
18. **New Career Notification** (`hr@classgrid.in`)
19. **Team Welcome Email** (New Employee)

---

## 📊 Master Configuration Table

| Feature / Action | File Location | Provider (Primary) | Provider (Fallback) |
| :--- | :--- | :--- | :--- |
| **Blog Welcome Email** | Website (`/api/blog/subscribe`) | **Brevo** | None |
| **Changelog Welcome Email** | Website (`/api/blog/subscribe`) | **Brevo** | None |
| **Blog Broadcast** | Platform (`marketing-email-blast.worker.js`) | **Brevo** | **Resend** |
| **Changelog Broadcast** | Platform (`marketing-email-blast.worker.js`) | **Brevo** | **Resend** |
| **Privacy Policy Update** | Platform (`marketing-email-blast.worker.js`) | **AWS SES** | None |
| **Terms of Service Update**| Platform (`marketing-email-blast.worker.js`) | **AWS SES** | None |
| **Security Policy Update** | Platform (`marketing-email-blast.worker.js`) | **AWS SES** | None |
| **Cookies Policy Update** | Platform (`marketing-email-blast.worker.js`) | **AWS SES** | None |
| **Disclaimer Update** | Platform (`marketing-email-blast.worker.js`) | **AWS SES** | None |
| **Login OTP Codes** | Website (`/api/forum/send-otp`) | **AWS SES** | None |
| **"No Account Found" Alert** | Website (`lib/auth.ts`) | **Resend** | None |
| **User Review Submitted** | Website (`/api/reviews`) | **AWS SES** | None |
| **User Review "Thank You"** | Website (`/api/reviews/send-thanks`) | **AWS SES** | None |
| **Demo Booking Confirmed** | Website (`/api/request-demo/...`) | **AWS SES** | None |
| **Demo Booking Updated** | Website (`/api/request-demo/...`) | **AWS SES** | None |
| **Contact Form Submission** | Website (`/api/contact`) | **AWS SES** | None |
| **Careers App Submitted** | Website (`/api/careers`) | **AWS SES** | None |
| **New Career Notification** | Website (`/api/careers`) | **AWS SES** | None |
| **Team Welcome Email** | Website (`/api/team/welcome`) | **AWS SES** | None |
