# Classgrid Email Architecture

The Classgrid platform sends exactly **9 distinct emails**. To ensure maximum deliverability and protect sender reputation, these 9 emails are split into two distinct categories based on their purpose and the infrastructure used to send them: **4 Marketing Emails** and **5 Legal Emails**.

---

## 🟢 Category 1: Marketing & Updates
**Provider:** Brevo SMTP (with Resend as fallback)
**Purpose:** Keep subscribers engaged with product updates and company news.
**Audience:** Users who explicitly opted-in via the Blog or Changelog subscribe forms.

1. **Blog Welcome Email**
   - **Triggered when:** A user submits the subscribe form on the `/blog` page.
   - **Content:** Welcomes them to the blog, sets expectations on content, and shares the most recent blog post.

2. **Changelog Welcome Email**
   - **Triggered when:** A user submits the subscribe form on the `/changelog` page.
   - **Content:** Welcomes them to the changelog, sets expectations on product updates, and shares the most recent changelog entry.

3. **Blog Broadcast**
   - **Triggered when:** A new blog post is published in the Sanity CMS.
   - **Content:** A summary of the new blog post with a link to read the full article.

4. **Changelog Broadcast**
   - **Triggered when:** A new changelog entry is published in the Sanity CMS.
   - **Content:** A summary of the new feature, bugfix, or improvement with a link to view the update.

---

## ⚖️ Category 2: Legal & Compliance
**Provider:** AWS SES (Amazon Simple Email Service)
**Purpose:** Mandatory legal notifications required by law or compliance standards.
**Audience:** ALL active subscribers and platform users (users cannot opt-out of these while their account is active).

AWS SES is used exclusively for these emails because transactional/legal emails require the highest possible deliverability rate and should not be mixed with marketing email infrastructure.

5. **Privacy Policy Update**
   - **Triggered when:** The Privacy Policy is modified in Sanity CMS.
   - **Subject:** "Important update to our Privacy Policy — effective [Date]"

6. **Terms of Service Update**
   - **Triggered when:** The Terms of Service are modified in Sanity CMS.
   - **Subject:** "Notice of updates to our Terms of Service — effective [Date]"

7. **Security Policy Update**
   - **Triggered when:** The Information Security Policy is modified in Sanity CMS.
   - **Subject:** "Update to our Information Security Policy"

8. **Cookies Policy Update**
   - **Triggered when:** The Cookies Policy is modified in Sanity CMS.
   - **Subject:** "Update to our Cookies Policy — effective [Date]"

9. **Disclaimer Update**
   - **Triggered when:** The Disclaimer page is modified in Sanity CMS.
   - **Subject:** "Update to our Disclaimer"

---

## Summary

> **Why are there two different sending systems?** 
> By keeping the Marketing emails on **Brevo** and the Legal emails on **AWS SES**, you protect your main domain's reputation. If marketing emails ever get marked as spam, it will never affect the delivery of critical legal notifications or platform password resets.
