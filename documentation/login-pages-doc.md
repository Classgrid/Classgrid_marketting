Classgrid is designed with a strict Multi-Tenant Architecture. This means every college or institution gets its own secure, isolated environment (e.g., `pccoe.classgrid.in`). 

Because of this architecture, **where** you log in is just as important as **how** you log in.

## 1. The Global Platform Login

For System Administrators and Billing Owners who manage the overarching Classgrid subscription.

*   **URL:** `https://platform.classgrid.in/login`
*   **Who uses this?** The Institute Chairman, Principal, or IT Director.
*   **What it does:** Allows you to manage your global Classgrid subscription, view your MongoDB storage usage, manage billing/invoices, and provision new subdomains for different campuses.

<br/><br/>

## 2. The Tenant (College) Login

This is the primary portal for day-to-day operations. Every institution has their own dedicated URL.

*   **URL:** `https://[your-college].classgrid.in`
*   **Who uses this?** 
    *   **Department Admins:** (HODs, Library Admin, Exam Controller). They access their specific operational dashboards (e.g., `/dept/exams`).
    *   **Faculty/Teachers:** They log in to mark attendance, upload assignments, and grade papers.
    *   **Students:** They log in to view their timetables, pay fees, and access the Notes Marketplace.

### Role-Based Access Control (RBAC)
When a user logs into the Tenant URL, Classgrid automatically determines their role and redirects them to the appropriate dashboard. A student will never see the HR/Payroll dashboard, and a Library Admin cannot access the Exam Controller's database.

<br/><br/>

## 3. The Parent Portal

Parents have a dedicated, simplified view of their child's academic progress.

*   **URL:** Available via the Classgrid Mobile App or `https://[your-college].classgrid.in/parents`
*   **What it does:** Provides live tracking of school buses, push notifications for daily attendance, fee installment reminders, and direct communication with teachers.

<br/><br/>

## Troubleshooting Login Issues

*   **"Tenant Not Found" Error:** This means the user is trying to log into a subdomain that doesn't exist (e.g., a typo in the college name). Ensure they are using the exact subdomain provided during onboarding.
*   **Invalid Credentials:** If a student forgets their password, they must use the "Forgot Password" link on their specific college's login page, NOT the global platform login.
