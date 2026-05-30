import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M'
})

const ARTICLE_ID = '3rpjI1abmKeJaJDXiS4TYs'

const originalMarkdown = `This article explains the first setup path for a Classgrid institution. It is intended for super admins and institution admins who need to move from a provisioned organization to a usable workspace with admissions, users, fees, dashboards, and support channels ready.

## Prerequisites
* A Classgrid organization record created by a super admin
* An activated organization admin account
* Access to the correct login page for your role
* Basic institution data such as departments, divisions, staff, students, fee rules, and admission requirements

## Step 1 - Sign in through the correct portal
Use the login page that matches your role. Students and faculty use the standard institution login, organization admins use the admin login, and platform operators use the super admin login. Classgrid checks the selected login audience, user role, organization status, and tenant context before opening the dashboard.

**Tip:** If login returns a device verification prompt, enter the OTP sent to the registered email instead of retrying the password.

## Step 2 - Review the dashboard
After login, Classgrid routes users to a role-specific dashboard. Organization admins see institution totals, enrollment trends, role distribution, branch distribution, and activity. Department users see module dashboards such as admissions, fees, examinations, library, attendance, HR, or hostel depending on their role.

## Step 3 - Configure institution basics
Open the organization dashboard and confirm the institution details, branding, settings, and modules. The sidebar exposes areas such as Students, Faculty, Classrooms, Timetable, Academic Calendar, Admissions, Fees & Payments, Examinations, Attendance, Library, Hostel, Canteen, Transport, Analytics, Certificates, and Organization Website.

## Step 4 - Prepare admissions and fees
If admissions are used, configure the admission strategy, portal status, cutoff date, registration fee, required documents, merit rules, seat matrix policy, and instructions. If fees are used, create fee structures, add components, assign them to students, and configure Razorpay keys if online fee collection is required.

## Step 5 - Invite and organize users
Create or import users based on their role. Faculty and students have separate workspace launchers. Admin and department users should receive only the roles needed for their work. Classgrid enforces protected routes and role-aware navigation, so incorrect role assignment can hide required pages.

## Common Mistakes
* Using a student or faculty login for an admin account
* Opening the candidate admission portal before admission configuration is complete
* Enabling online payments before Razorpay keys are configured
* Expecting scaffolded department pages to show live data before connected records exist`

async function run() {
  await client
    .patch(ARTICLE_ID)
    .set({
      title: { en: 'Getting Started with Classgrid' },
      markdownBody: originalMarkdown,
      content: { en: [] }, // clear the demo text
      faqs: [] // clear the demo faqs
    })
    .commit()

  console.log('✅ Restored "Getting Started with Classgrid" to its original content!')
}

run().catch(console.error)
