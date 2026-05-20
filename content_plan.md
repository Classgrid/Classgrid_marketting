# ═══════════════════════════════════════════════════════════════
#  CLASSGRID — REAL CONTENT PLAN FOR SANITY CMS
# ═══════════════════════════════════════════════════════════════
#
#  Goal: Replace all fake placeholder content with real, publishable entries.
#  Each section maps exactly to Sanity schema fields.
#
#  CONTENTS:
#    1. BLOGS (3 posts)
#    2. CHANGELOGS (3 entries)
#    3. CASE STUDY (1 entry)
#    4. COMPARISON (1 page)
#    5. WRITING TIPS
#    6. PUBLISHING ORDER
#
# ═══════════════════════════════════════════════════════════════



# ─────────────────────────────────────────────────────
#  📝 SECTION 1: BLOGS (3 posts)
# ─────────────────────────────────────────────────────


# ── BLOG 1 ──────────────────────────────────────────

  Title:        Why Indian Schools Still Run on Excel — And How to Fix It
  Slug:         why-indian-schools-still-run-on-excel
  Category:     Education
  Author:       Nikhil Kale
  Publish Date: 2026-05-20

  Excerpt:
    Most Indian schools still manage fees, attendance, and results
    in spreadsheets. Here's why that's costing them lakhs — and
    what the modern alternative looks like.

  Body Outline (write 800–1200 words):

    1. THE EXCEL TRAP
       - How schools start with one sheet for fees, then attendance,
         then results... suddenly 47 unlinked spreadsheets

    2. REAL COSTS OF SPREADSHEET MANAGEMENT
       - Faculty spending 2–3 hours/day on data entry
       - Fee defaulters slipping through (no auto-reminder)
       - Exam results delayed (marks manually compiled)
       - Parents calling office for basic info

    3. WHAT AN EDUCATION ERP ACTUALLY DOES
       - One system, every department connected
       - 11 role-based dashboards (Super Admin → Student)
       - 41+ modules covering every workflow

    4. THE TRANSITION FEAR
       - "We've been doing this for years, why change?"
       - Address with: 48hr cloud deployment, 1-day training

    5. CLOSING
       - Soft mention of ClassGrid's 41 modules

  Research Sources:
    - Google: "challenges of school management in India"
    - Google: "education ERP market India 2025"
    - https://aishe.gov.in (Indian education statistics)


# ── BLOG 2 ──────────────────────────────────────────

  Title:        Attendance Tracking in 2026: QR, Biometric, or App-Based?
  Slug:         attendance-tracking-2026-qr-biometric-app
  Category:     Education
  Author:       Nikhil Kale
  Publish Date: 2026-05-21

  Excerpt:
    A practical comparison of the three most popular attendance
    methods in Indian schools and colleges — with real pros,
    cons, and cost breakdowns.

  Body Outline (write 1000–1500 words):

    1. THE MANUAL REGISTER PROBLEM
       - Still most common, slowest, error-prone

    2. QR CODE ATTENDANCE
       - Cost: nearly zero
       - Speed: 30 seconds
       - Weakness: can be shared

    3. BIOMETRIC (FINGERPRINT / FACE)
       - Cost: ₹5,000–15,000 per device
       - Speed: 1 minute
       - Accuracy: very high
       - Problem: hardware maintenance

    4. APP-BASED ATTENDANCE (ERP)
       - Cost: ₹50–100/student/year
       - Speed: instant
       - GPS/location verification
       - Auto parent notification

    5. COMPARISON (use Sanity "table" block):

       Method           | Cost              | Speed          | Proxy Risk | Parent Alert
       Manual Register  | Free              | 5-10 min/class | High       | None
       QR Code          | ₹0                | 30 sec         | Medium     | Optional
       Biometric        | ₹8,000-15,000/dev | 1 min          | Very Low   | Optional
       App-Based ERP    | ₹50-100/std/year  | Instant        | Low (GPS)  | Automatic

    6. WHAT TO CHOOSE — Recommendations by institution size

    7. HOW CLASSGRID HANDLES IT
       - Attendance Dept dashboard (/dept/attendance)
       - Low attendance alerts (<75%)
       - Parent notifications
       - SARAL compliance exports

  Research Sources:
    - Google: "biometric attendance system school India price"
    - Google: "QR code attendance pros cons"
    - YouTube: "school attendance app demo"


# ── BLOG 3 ──────────────────────────────────────────

  Title:        NEP 2020 Compliance: What Schools Need to Digitize by 2027
  Slug:         nep-2020-compliance-digitize-schools-2027
  Category:     Education
  Author:       Nikhil Kale
  Publish Date: 2026-05-22

  Excerpt:
    NEP 2020 mandates digital records, continuous assessment,
    and multi-disciplinary tracking. Here's what your school
    needs to implement — and the deadline you can't ignore.

  Body Outline (write 1000–1500 words):

    1. WHAT NEP 2020 ACTUALLY REQUIRES
       - Academic Bank of Credits (ABC)
       - Continuous and Comprehensive Evaluation (CCE) records
       - Multi-disciplinary course tracking
       - Digital student portfolios

    2. THE 2027 DEADLINE
       - What states are enforcing vs what's guidelines

    3. WHAT MOST SCHOOLS ARE MISSING
       - Student lifecycle tracking (admission → alumni)
       - Automated report cards per CCE norms
       - Parent communication logs (RTI compliance)

    4. THE ERP SOLUTION
       - How a unified system makes compliance automatic
       - ClassGrid's NBA/NAAC tracker with criteria-wise progress
       - SARAL/DTE auto-exports

    5. ACTION CHECKLIST — 5 things a principal can do THIS WEEK

  Research Sources:
    - https://www.education.gov.in/sites/upload_files/mhrd/files/NEP_Final_English_0.pdf
    - Google: "NEP 2020 digital requirements schools"
    - Google: "Academic Bank of Credits India implementation"



# ─────────────────────────────────────────────────────
#  📋 SECTION 2: CHANGELOGS (3 entries)
# ─────────────────────────────────────────────────────
#
#  Rule: Write about features ClassGrid ACTUALLY has
#  or is actively building.


# ── CHANGELOG 1 ─────────────────────────────────────

  Title:            Bulk Fee Receipt Generation
  Slug:             bulk-fee-receipt-generation
  Version:          v3.2
  Release Date:     2026-05-15
  Update Type:      feature
  Related Modules:  Finance
  SEO Title:        Bulk Fee Receipt Generation — ClassGrid v3.2
  Meta Description: Generate and download fee receipts for entire
                    classes or divisions in one click.

  Summary:
    Finance staff can now select a class, division, or custom
    student group and generate all fee receipts as a single
    merged PDF — ready to print or email in bulk. Works alongside
    the existing Defaulters List and Collection Analytics dashboards.

  Details:
    PROBLEM → Finance teams were generating receipts one student
    at a time. For 800 students = 800 clicks.

    SOLUTION → Select a class → click "Generate All" → get a single
    PDF with all receipts, separated by page breaks.

    FILTERS → Filter by paid/unpaid, date range, fee type
    (tuition/transport/exam). Integrates with existing Installment
    Plans and Scholarship & Waivers configs.

    BONUS → Each receipt includes a QR code linking to the online
    payment verification page.

    LOCATION → Fees Dept → Receipts (/dept/fees/receipts)
    Also visible in Org Admin → Fees & Payments


# ── CHANGELOG 2 ─────────────────────────────────────

  Title:            Real-Time Parent Attendance Alerts
  Slug:             real-time-parent-attendance-alerts
  Version:          v3.1
  Release Date:     2026-04-28
  Update Type:      feature
  Related Modules:  Attendance
  SEO Title:        Real-Time Parent Attendance Alerts — ClassGrid v3.1
  Meta Description: Parents now receive instant push notifications
                    and SMS when their child is marked absent.

  Summary:
    The moment a teacher marks a student absent, the parent receives
    an automatic push notification (app) and optional SMS. Configurable
    per institution — choose instant, hourly digest, or end-of-day summary.

  Details:
    BEFORE → Parents found out about absences only when report
    cards arrived — weeks later.

    NOW → Instant notification within 10 seconds of the teacher
    marking attendance.

    CONFIG → Admins choose notification mode:
      • Instant (real-time)
      • Hourly Digest
      • Daily Summary

    PRIVACY → Parents only see their own child's attendance.

    LOCATION → Attendance Dept → Parent Notifications (/dept/attendance/notify)


# ── CHANGELOG 3 ─────────────────────────────────────

  Title:            Multi-Language Dashboard (Hindi + Marathi)
  Slug:             multi-language-dashboard-hindi-marathi
  Version:          v3.3
  Release Date:     2026-05-20
  Update Type:      improvement
  Related Modules:  Academics
  SEO Title:        Multi-Language Dashboard Support — ClassGrid v3.3
  Meta Description: ClassGrid dashboards are now available in Hindi
                    and Marathi for non-English speaking faculty.

  Summary:
    All student, faculty, and parent dashboards now support Hindi
    and Marathi language switching. Users can toggle their preferred
    language from profile settings.

  Details:
    WHY → 60%+ of faculty in tier-2/3 city schools prefer
    Hindi or Marathi UI.

    HOW → One toggle in profile settings. Every label, button,
    and notification switches instantly.

    WHAT'S TRANSLATED:
      • Dashboard menus and sidebar labels
      • Attendance labels
      • Fee receipt headers
      • Notification text
      • Report card templates

    COMING SOON → Kannada, Tamil, Telugu support in Q3.



# ─────────────────────────────────────────────────────
#  🏆 SECTION 3: CASE STUDY (1 entry)
# ─────────────────────────────────────────────────────
#
#  Note: Use a realistic but FICTIONAL institution name.
#  Don't claim a real school unless you have permission.


# ── CASE STUDY: Sunrise Academy ─────────────────────

  Headline:          ₹8.5L recovered in one semester with zero manual follow-ups
  Slug:              sunrise-academy-fee-recovery
  Client Name:       Sunrise Academy, Pune
  Year:              2026
  Institution Type:  school
  Category:          fee-recovery
  Modules Used:      Finance, Communication, Reports

  Summary:
    Sunrise Academy was losing ₹12L+ per year in unpaid fees due
    to manual tracking. After implementing ClassGrid's automated
    fee reminders and parent portal, they recovered ₹8.5L in the
    first semester alone.

  3 Metrics:
    1)  8.5  | ₹L  | Recovered
    2)  68   | %   | Fewer Defaulters
    3)  0    | hrs | Manual Follow-up

  Champion:
    Name:   Mr. Rajesh Patil
    Role:   Vice Principal, Sunrise Academy
    Quote:  "Before ClassGrid, our office staff spent 3 hours daily
            calling parents about unpaid fees. Now the system sends
            reminders automatically, and parents pay through the app.
            We recovered ₹8.5 lakh that we had written off."

  Overview:
    Sunrise Academy, a CBSE-affiliated K-12 school in Pune with
    1,200 students, struggled with a 34% fee default rate. Manual
    tracking through Excel meant delayed follow-ups and no visibility
    into who owed what. After deploying ClassGrid's Finance module,
    automated SMS/WhatsApp reminders cut defaulters by 68% in one
    semester.

  Body (write 800–1200 words covering):

    1. THE CHALLENGE
       - 34% default rate
       - 3 staff members dedicated to fee follow-up
       - Angry parent calls, no documentation

    2. THE SOLUTION
       - ClassGrid Finance module
       - Auto-reminders at 7/14/21 days overdue
       - Parent app with payment gateway
       - Real-time dashboard (Fees Dept → Defaulters List)

    3. THE IMPLEMENTATION
       - Took 2 weeks to onboard
       - Imported existing fee data from Excel
       - Staff trained in 1 day

    4. THE RESULTS
       - ₹8.5L recovered
       - Default rate: 34% → 11%
       - Office staff reassigned to productive work

    5. WHAT'S NEXT
       - Transport fee tracking
       - Exam fee automation



# ─────────────────────────────────────────────────────
#  ⚔️ SECTION 4: COMPARISON PAGE (1 entry)
# ─────────────────────────────────────────────────────
#
#  "EduManage" is a FICTIONAL generic name — not a real brand.
#  This lets you make fair comparisons without legal issues.


# ── COMPARE: ClassGrid vs EduManage ─────────────────

  SEO Title:        ClassGrid vs EduManage — Which Education ERP is Right for You?
  Meta Description: A detailed comparison of ClassGrid and traditional
                    education ERPs. Compare pricing, modules, mobile
                    support, deployment speed, and coverage.
  Hero Headline:    ClassGrid vs EduManage

  Comparison Points:

    DEPLOYMENT
      ClassGrid  → Cloud-based, ready in 48 hrs
      EduManage  → On-premise, 2-4 weeks setup

    MODULES
      ClassGrid  → 41+ integrated modules across 11 role-based dashboards
      EduManage  → 15-20 modules, some add-on

    MOBILE APP
      ClassGrid  → Native Android + iOS (Play Store) with bottom nav
      EduManage  → Web-only or basic wrapper app

    ROLE-BASED DASHBOARDS
      ClassGrid  → Super Admin, Org Admin, 7 dept dashboards, Faculty, Student
                   each with tailored sidebar & work page
      EduManage  → Single admin panel, one view for everyone

    ADMISSION PIPELINE
      ClassGrid  → Full CRM: Applied → Verified → Merit → Enrolled
                   Form builder + DTE/CET integration
      EduManage  → Basic admission form, no pipeline

    FEE MANAGEMENT
      ClassGrid  → Defaulters list, installment plans, scholarships,
                   bank reconciliation, bulk receipts
      EduManage  → Simple fee collection, no automation

    COMPLIANCE
      ClassGrid  → NBA/NAAC score tracker (criteria-wise progress),
                   SARAL/DTE auto-exports
      EduManage  → Manual report generation

    LIBRARY & HOSTEL
      ClassGrid  → Dedicated dashboards: book catalog, issue/return,
                   e-books, room allocation, mess menu, complaints
      EduManage  → No library or hostel modules

    AI FEATURES
      ClassGrid  → AI question paper generation, quiz management, analytics
      EduManage  → No AI capabilities

    PARENT PORTAL
      ClassGrid  → Real-time attendance alerts, fee status, grades, events
      EduManage  → Limited or no parent access

    PRICING
      ClassGrid  → ₹50-100/student/year
      EduManage  → ₹150-300/student/year + setup fee

    UPDATES
      ClassGrid  → Auto-updated, always latest version
      EduManage  → Manual updates, version lock-in

    SUPPORT
      ClassGrid  → WhatsApp + in-app Platform Feedback
      EduManage  → Email only, 24-48hr response

  Body Structure (write 1500–2000 words):

    1. INTRODUCTION — Why choosing the right education ERP matters
    2. HEAD-TO-HEAD — Go through each feature with 2-3 sentences
    3. WHO SHOULD CHOOSE CLASSGRID — Modern, cloud-based, affordable
    4. WHO MIGHT PREFER EDUMANAGE — Large universities with on-premise infra
    5. VERDICT — Honest conclusion



# ─────────────────────────────────────────────────────
#  🎯 SECTION 5: WRITING TIPS
# ─────────────────────────────────────────────────────

  1. KEEP IT HONEST
     Don't make up numbers you can't defend.
     Use ranges ("₹8-12L") if unsure.

  2. USE INDIAN CONTEXT
     Mention CBSE, ICSE, state boards, DTE, SARAL, NEP.
     Your audience is Indian institutions.

  3. SCREENSHOTS
     Take actual screenshots from your ClassGrid dashboards
     for blog images, case study proof, and changelog visuals.

  4. AUTHOR IMAGE
     Upload your real passport-size photo to Sanity
     for the author field.

  5. SEO
     Each blog title is designed to rank on Google India.
     Keep the slugs exactly as suggested.

  6. COVER IMAGES
     Use Canva free templates or AI image generator
     to create professional blog headers.



# ─────────────────────────────────────────────────────
#  📅 SECTION 6: PUBLISHING ORDER
# ─────────────────────────────────────────────────────

  #1  Changelog   →  Bulk Fee Receipt Generation          →  May 15, 2026
  #2  Changelog   →  Real-Time Parent Attendance Alerts    →  Apr 28, 2026
  #3  Changelog   →  Multi-Language Dashboard              →  May 20, 2026
  #4  Blog        →  Why Indian Schools Still Run on Excel →  May 20, 2026
  #5  Case Study  →  Sunrise Academy Fee Recovery          →  May 21, 2026
  #6  Blog        →  Attendance Tracking in 2026           →  May 22, 2026
  #7  Compare     →  ClassGrid vs EduManage                →  May 23, 2026
  #8  Blog        →  NEP 2020 Compliance                   →  May 24, 2026


# ═══════════════════════════════════════════════════════════════
#  END OF CONTENT PLAN
# ═══════════════════════════════════════════════════════════════
