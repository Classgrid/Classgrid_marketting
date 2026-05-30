import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
})

const ARTICLE_ID = '3rpjI1abmKeJaJDXiS4TYs'

const newMarkdown = `A complete guide to getting started with Classgrid — how to book a demo step by step, what happens during the demo session, what Classgrid Talk is, and how Support Tickets work.

## How to Book a Demo

Booking a demo is the first step to exploring how Classgrid can transform your institution. The demo booking form is located on the [Classgrid homepage](https://classgrid.in/#demo) — scroll to the bottom of the page or click **Book a Demo** in the navigation bar to jump directly to the form section.

### Step 1: Fill Out the Demo Request Form

The form is divided into three sections:

**Your Details**
Enter your full name, email address, and phone number. All three fields are required.

**Institute Details**
Enter your institution name, state, and city. Then select the type of organization that best describes your institution from the dropdown. The available options include Engineering College, School, Junior College, Coaching Institute, Diploma Institute, and Other.

**Message (Optional)**
You can include an optional message describing your specific requirements or any modules you want us to focus on during the demo.

### Step 2: Complete the Security Verification

Before submitting, you need to pass two security checks:

1. **Visual CAPTCHA** — A 6-character alphanumeric code is displayed on the screen. Type this code exactly as shown in the input field below it. If the characters are hard to read, click the refresh icon next to the code to get a new one.
2. **Cloudflare Turnstile** — An automated security widget appears below the CAPTCHA. This runs automatically and verifies that you are a real person. Both checks must pass before you can submit.

Once both verifications are complete, click the **Submit** button.

### Step 3: Review Your Details on the Confirmation Page

After submitting, you are redirected to a secure confirmation page that shows all the details you entered — your name, email, institution name, organization type, and phone number.

If you notice a mistake, click the **Edit** button to update any field. When you save your changes, a fresh verification code will be sent to the updated email address.

If everything looks correct, click the **Send Verification Code** button. A 6-digit numeric code will be sent to the email address you provided. This step confirms that you own the email and can receive meeting invitations.

### Step 4: Verify Your Email

Enter the 6-digit code you received by email into the verification input on the confirmation page. If the code does not arrive, you can click the **Resend** link after the 60-second cooldown expires to request a new one.

Once verified, click **Verify Email** to unlock the meeting scheduler.

### Step 5: Schedule Your Meeting

After email verification, the page transitions into a calendar scheduling view with three panels:

**Left Panel** — Shows the meeting details: a 30-minute, one-on-one session via Google Meet in the Asia/Kolkata timezone.

**Center Panel** — A full interactive calendar where you can select any available date within the next 60 days. Past dates and dates beyond the 60-day window are disabled. Use the left and right arrows to navigate between months.

**Right Panel** — Once you select a date, available 30-minute time slots appear on the right. Click a time slot to highlight it, then click **Confirm** to lock in your meeting.

### Step 6: Confirmation and Next Steps

After confirming, three things happen:

1. **A Google Calendar event** is created automatically with a unique Google Meet link. The meeting is titled with your institution name and added to both your calendar and the Classgrid team calendar.
2. **A confirmation email** is sent to your email address containing the scheduled date, time, and the Google Meet link.
3. **A Classgrid Talk prompt** appears on screen, inviting you to ask pre-demo questions (see below).

You can copy the Google Meet link from the confirmation page and save it for your records.

---

## What is Classgrid Talk?

Classgrid Talk is an inquiry portal that gives you direct access to Classgrid product specialists before your scheduled demo takes place.

After you book a demo, a popup appears with the option to **Submit an Inquiry**. Clicking this takes you to the [Classgrid Inquiry page](https://classgrid.in/support/inquiry) where you can ask questions, describe your requirements, or request information about specific modules — and a specialist will respond within 24 hours.

Classgrid Talk is designed for:
*   **Direct Inquiry** — Ask questions directly to a product specialist.
*   **Expert Response** — Get answers tailored to your institution's specific needs.
*   **Fast Turnaround** — Responses are provided within 24 hours.

This is ideal for prospective clients who want to make the most of their demo session by getting preliminary questions answered in advance.

---

## What is a Support Ticket?

Support Tickets are the dedicated help channel for active, verified Classgrid users. Unlike Classgrid Talk, which is open to anyone, Support Tickets are exclusively available to students, faculty, and administrators whose email addresses are linked to a registered Classgrid institution.

### How to Raise a Ticket

1. Go to the [Support Ticket page](https://classgrid.in/support/ticket) and sign in with your platform account.
2. The system verifies your email against the platform database. If your account is linked to an active institution, you will see a welcome screen with your organization name and two options: **Submit a New Ticket** or **View My Tickets**.
3. Click **Submit a New Ticket** to open the ticket form. Fill in:
    *   **Subject** — A short summary of your issue.
    *   **Category** — Choose from General, Technical Issue, Billing and Payments, Account and Access, Feature Request, or Other.
    *   **Priority** — Select Low (minor, not urgent), Medium (affecting your work), or High (blocking critical operations).
    *   **Description** — Use the built-in rich-text editor to format your message, add bullet points, embed images, insert links, and attach files (up to 5 files, 5 MB each).
4. Click **Submit**. Your ticket is created and a support team member will respond as soon as possible.

### If Your Account is Not Linked

If your email is not associated with any Classgrid institution, you will see an "Institution Not Found" message. In that case, you can either contact your institution administrator to add your email to the platform, or email the team directly at support@classgrid.in. You also have the option to use Classgrid Talk to speak with the team.

---

## Classgrid Talk vs Support Tickets

| | Classgrid Talk | Support Ticket |
|---|---|---|
| **Who can use it** | Anyone — visitors, prospective clients | Only verified platform users |
| **Purpose** | Pre-sales questions, product inquiries | Technical issues, bug reports, account help |
| **Authentication** | No login required | Requires platform sign-in |
| **Response time** | Within 24 hours | As soon as possible |
| **Where to access** | [classgrid.in/support/inquiry](https://classgrid.in/support/inquiry) | [classgrid.in/support/ticket](https://classgrid.in/support/ticket) |`

async function run() {
  await client
    .patch(ARTICLE_ID)
    .set({
      title: { en: 'Getting Started with Classgrid' },
      markdownBody: newMarkdown,
      content: { en: [] },
      faqs: []
    })
    .commit()

  console.log('✅ Updated "Getting Started with Classgrid" article with verified, accurate content!')
}

run().catch(console.error)
