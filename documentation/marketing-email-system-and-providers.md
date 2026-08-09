# Classgrid Email Architecture & Providers

The Classgrid platform sends exactly 19 distinct emails across the Marketing site and Platform backend. To ensure maximum deliverability and protect sender reputation, these emails are strictly segregated into categories based on their purpose and the infrastructure used to send them.

---

## 🟢 Category 1: Marketing & Updates (4 Emails)
**Provider:** Brevo SMTP (with Resend as fallback)  
**Purpose:** Keep subscribers engaged with product updates and company news.  
**Audience:** Users who explicitly opted-in via the Blog or Changelog subscribe forms.

1. **Blog Welcome Email**
   * Triggered when: A user submits the subscribe form on the `/blog` page.
   * Content: Welcomes them to the blog, sets expectations on content, and shares the most recent blog post.
2. **Changelog Welcome Email**
   * Triggered when: A user submits the subscribe form on the `/changelog` page.
   * Content: Welcomes them to the changelog, sets expectations on product updates, and shares the most recent changelog entry.
3. **Blog Broadcast**
   * Triggered when: A new blog post is published in the Sanity CMS.
   * Content: A summary of the new blog post with a link to read the full article.
4. **Changelog Broadcast**
   * Triggered when: A new changelog entry is published in the Sanity CMS.
   * Content: A summary of the new feature, bugfix, or improvement with a link to view the update.

---

## ⚖️ Category 2: Legal & Compliance (5 Emails)
**Provider:** AWS SES (Amazon Simple Email Service)  
**Purpose:** Mandatory legal notifications required by law or compliance standards.  
**Audience:** ALL active subscribers and platform users (users cannot opt-out of these while their account is active).

*AWS SES is used exclusively for these 5 emails because transactional/legal emails require the highest possible deliverability rate and should not be mixed with marketing email infrastructure.*

5. **Privacy Policy Update**
   * Triggered when: The Privacy Policy is modified in Sanity CMS.
   * Subject: "Important update to our Privacy Policy — effective [Date]"
6. **Terms of Service Update**
   * Triggered when: The Terms of Service are modified in Sanity CMS.
   * Subject: "Notice of updates to our Terms of Service — effective [Date]"
7. **Security Policy Update**
   * Triggered when: The Information Security Policy is modified in Sanity CMS.
   * Subject: "Update to our Information Security Policy"
8. **Cookies Policy Update**
   * Triggered when: The Cookies Policy is modified in Sanity CMS.
   * Subject: "Update to our Cookies Policy — effective [Date]"
9. **Disclaimer Update**
   * Triggered when: The Disclaimer page is modified in Sanity CMS.
   * Subject: "Update to our Disclaimer"

---

## 🔒 Category 3: Authentication & Security (2 Emails)
**Provider:** AWS SES & Resend  
**Purpose:** Critical security infrastructure for the Community/Docs portals.

10. **Login OTP Codes (6-digits)** (AWS SES)
11. **"No Account Found" Alert** (Resend)

---

## 🏢 Category 4: Transactional & Internal Operations (8 Emails)
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

> [!TIP]
> **Why separate them?** By keeping marketing emails on Brevo (with Resend fallbacks) and transactional/legal emails strictly on AWS SES, you protect your main domain's reputation. If marketing emails ever get marked as spam or hit a rate limit, it will automatically fail over to Resend, and it will never affect the delivery of critical legal notifications or platform password resets because they use an entirely different AWS SES infrastructure.
