const fs = require('fs');
const path = require('path');

const DIR = "C:\\Users\\nikhi\\OneDrive\\Documents\\Classgrid_platfrom\\classgrid_platform\\marketing_content";

const FILES = {
  "01_SCHOOLS_PAGE.md":
`# The Operating System for Modern Schools

Classgrid unifies your entire school's operations into one seamless platform. From admissions and fee collection to daily attendance and report cards, we eliminate paperwork so your staff can focus entirely on education.

## Complete Administrative Control

Manage your entire school from a single dashboard. Track daily fee collections, monitor student attendance trends, and oversee staff leave balances in real-time without juggling multiple tools or spreadsheets.

- **Unified Dashboard**: Get a bird's-eye view of your school's daily operations.
- **Staff Management**: Track teacher attendance, leave requests, and payroll in one place.
- **Document Vault**: Securely store and verify student documents like birth certificates and transfer certificates.

## Streamlined Admissions

Move your entire admission process online. Parents can purchase forms, submit documents, and pay fees from their phones. Generate merit lists automatically based on your custom criteria, eliminating weeks of manual processing.

## Smart Fee Management

Automate fee collection with integrated payment gateways. Send automated WhatsApp reminders to parents for pending dues, apply late fees dynamically, and generate instant tax-compliant receipts.

## Attendance and Timetable

Teachers can mark attendance in 90 seconds using our mobile app. The smart timetable generator automatically resolves faculty clashes and optimizes classroom allocation across your entire school.

## Automated Report Cards

Generate beautiful, compliant report cards in one click. Classgrid automatically pulls marks from unit tests and term exams, calculating grades and percentages without any manual Excel work.

## Parent Communication App

Keep parents engaged with a dedicated mobile app. Send instant push notifications for attendance, exam schedules, and circulars, ensuring 100% deliverability compared to paper diaries.`,

  "02_COLLEGES_PAGE.md":
`# The Digital Campus for Higher Education

Classgrid provides colleges with an end-to-end ERP that handles the full complexity of higher education. Manage CBCS curriculums, university exams, and campus placements from one powerful, unified platform.

## Academic Excellence

Handle complex academic structures with ease. Classgrid supports multi-disciplinary courses, elective selections, and credit-based grading systems out of the box with no configuration required.

- **CBCS Support**: Fully compliant with Choice Based Credit System requirements.
- **Elective Bidding**: Allow students to bid for and select their preferred elective subjects online.
- **Faculty Workload**: Automatically track and optimize faculty teaching hours and research time.

## University Exam Management

End-to-end exam management tailored for colleges. Generate hall tickets, allocate seating arrangements automatically, and process external and internal marks securely within a single workflow.

## Placement Cell Automation

Streamline your campus recruitment. Companies can register and post jobs, while eligible students can apply with one click. Track interview rounds and offer letters centrally without email chains.

## Campus Operations

Digitize your campus infrastructure. Manage hostel room allocations, track library book issues, and handle canteen billing through student ID cards.

## AI-Powered Analytics

Give your principal and management deep, actionable insights. Identify at-risk students based on attendance drops and academic performance, enabling timely counseling and intervention before it is too late.`,

  "03_JR_COLLEGES_PAGE.md":
`# Built Specifically for Junior Colleges

Bridge the gap between school and college with a platform designed specifically for Junior Colleges. Manage 11th and 12th grade admissions, board exam preparations, and daily attendance effortlessly.

## Specialized Curriculum Management

Tailored for Junior College streams including Science, Commerce, and Arts. Manage practical batches, theory lectures, and vocational subjects without timetable clashes or manual scheduling headaches.

- **Batch Management**: Automatically split classes into smaller practical batches.
- **Board Compliance**: Format reports and data exports to match state board requirements exactly.
- **Mock Exams**: Conduct and grade mock board exams efficiently with instant result generation.

## Streamlined FYJC Admissions

Handle the rush of 11th-grade admissions smoothly. Integrate with state CAP data, collect offline forms, and verify leaving certificates securely, all from one dashboard.

## Parent and Student Engagement

Keep both parents and teenagers in the loop. Parents receive attendance alerts, while students access study materials and assignments through their dedicated app with no WhatsApp groups needed.

## Performance Tracking

Track student progress closely during these crucial two years. Generate detailed performance analytics to help students identify their weak subjects before board exams, enabling targeted revision.`,

  "04_COACHING_PAGE.md":
`# The Ultimate Platform for Coaching Institutes

Scale your coaching institute with Classgrid. Manage multiple branches, conduct online tests, track fee installments, and provide students with a premium, structured learning experience.

## Multi-Branch Management

Control your entire coaching business from one central admin panel. Track revenue, student enrollments, and faculty performance across all your centers in real-time without visiting each branch.

- **Centralized Control**: Standardize study materials and test series across all branches.
- **Revenue Tracking**: Monitor daily fee collections and pending dues per center.
- **Faculty Sharing**: Manage faculty who teach across multiple branches with automatic schedule syncing.

## Advanced Test Series

Conduct tests that mirror actual competitive exams including JEE, NEET, and CET. Support for complex marking schemes, negative marking, and detailed section-wise analytics to identify student weak points.

## Installment-Based Fee Collection

Make fees manageable for students. Set up custom installment plans, send automated payment reminders via WhatsApp, and collect payments online with real-time tracking of every installment.

## Digital Study Material

Distribute your premium notes and video lectures securely. Prevent unauthorized downloading and track which students have completed the reading material before each class.

## Student Performance Analytics

Give students and parents detailed, actionable insights. Provide rank predictions, subject-wise strength analysis, and historical performance tracking to ensure every student is exam-ready.`,

  "05_ENGINEERING_PAGE.md":
`# Built for the Complexity of Engineering Colleges

Classgrid handles the extreme complexity of Engineering Colleges. From NBA accreditation reports and massive timetable generation to campus placements and alumni networking, all in one system.

## NBA and NAAC Accreditation Ready

Stop scrambling for data during accreditation visits. Classgrid automatically maps Course Outcomes to Program Outcomes and generates compliance reports instantly, ready for any audit.

- **CO-PO Mapping**: Map every assignment and exam question to specific learning outcomes.
- **Automated Reports**: Generate NAAC Criterion reports directly from live campus data.
- **Faculty Profiles**: Track faculty publications, research grants, and patents centrally.

## Complex Timetable Generation

Solve the engineering timetable puzzle. Automatically schedule theory lectures, massive 4-hour practical labs, and elective batches without a single faculty or room clash.

## Technical Placements and Internships

Run your Training and Placement cell efficiently. Track student coding profiles on GitHub and LeetCode, manage company drives, and handle internship NOCs digitally without paper-based processes.

## Lab and Infrastructure Management

Track expensive lab equipment and inventory. Manage maintenance schedules, handle breakage reports, and audit department-wise asset utilization ensuring nothing falls through the cracks.

## Alumni Networking

Keep your graduates connected and engaged. Manage alumni directories, facilitate mentorship programs for current students, and track alumni career progression for institutional ranking improvement.`,

  "06_STUDENTS_PAGE.md":
`# Your Entire Academic Life. One App.

Classgrid puts your entire academic life in your pocket. Track attendance, submit assignments, take quizzes, and access study materials from a beautiful, fast, native mobile app.

## Your Academic Command Center

Say goodbye to missing deadlines and checking notice boards. Your personalized dashboard shows exactly what needs your attention today, nothing more and nothing less.

- **Today's Schedule**: Know exactly which class is next and in which room.
- **Pending Tasks**: See assignments due this week and upcoming quizzes at a glance.
- **Recent Results**: Get instant push notifications the moment your marks are published.

## Real-Time Attendance

Always know exactly where you stand. Track your attendance percentage in real-time, subject by subject. If you were incorrectly marked absent, raise an appeal directly from the app to your professor without any office visits.

## Effortless Assignments

Submit your work from anywhere. Upload PDFs, photos, or documents directly from your phone. Track your submission status and view your professor's detailed feedback instantly after grading.

## Study Material Vault

Never lose a PDF again. Access all your professor's notes, presentation slides, and reference links organized neatly by subject and chapter, always available offline.

## Quick Leave Applications

Need a day off? Submit a leave request with your reason and supporting document in 30 seconds. Track the approval status in real-time without visiting the admin office.

## Premium Native Experience

Enjoy a fast, smooth, and secure native app. Unlock with Face ID or your Fingerprint. Distraction-free dark mode designed for late-night studying, your campus in your pocket.`,

  "07_TEACHERS_PAGE.md":
`# Less Admin Work. More Time to Actually Teach.

Classgrid handles your attendance sessions, assignment grading, quiz management, and mark entry with AI assistance for question generation and viva scoring. Everything in one dashboard, not seven different tools.

## The Faculty Dashboard

Access all your teaching tools from a single, unified interface designed around your daily workflow.

- **Quick Actions**: Instantly mark attendance, post assignments, or upload study materials.
- **My Classrooms**: Navigate directly to any assigned classroom and view all student data.
- **Pending Actions**: See ungraded assignments and attendance appeals in one place.
- **Today's Schedule**: Automatically fetched from the timetable, your day at a glance.

## Attendance Management

Mark 60 students present in under 2 minutes. Open the Quick Mark panel, select your classroom, tap Mark All Present, and flip the absentees. GPS and device fingerprinting blocks proxy attendance automatically.

## Assignment Management

Create assignments with file attachments, due dates, and late submission blocks. Grade submissions inline with numeric scores and optional written feedback. Students receive instant notifications the moment you submit a grade.

## AI-Powered Quizzes

AI writes your question paper. You approve it. Enter your topic, difficulty level, and question count. Groq AI generates a complete question set in 15 seconds. Edit anything, then publish directly to your students. Google Forms sync is also available.

## AI Viva Sessions

Assign an AI Viva to your entire batch in one click. Students complete it independently before a deadline. You receive full transcripts and a detailed 4-parameter score breakdown covering Accuracy, Depth, Clarity, and Relevance for every student.

## Study Material and Lesson Planner

Upload and categorize notes for your students with subject and topic tags. Use the weekly lesson planner to map topics to timetable slots, track your lecture progress, and prepare NAAC-ready exports.

## Leave Management

Submit a leave application in 30 seconds. Select the type, dates, and reason. Your HOD approves it directly from their dashboard. Your leave balance updates automatically with no paper forms and no office visits.`,

  "08_INSTITUTES_PAGE.md":
`# Enterprise Control for Your Entire Institution

Classgrid gives Principals, Directors, and Admins a powerful command center to monitor, analyze, and control every aspect of the institution in real-time from any device.

## Global Organization Dashboard

Get absolute, real-time visibility into your institution's operational health. Monitor live attendance across the entire campus, track fee collection targets, and identify systemic issues before they escalate.

- **Live Campus View**: See exactly how many classes are currently running and how many students are present.
- **Revenue Analytics**: Track daily, weekly, and monthly fee collections with a detailed breakdown by department.
- **Defaulter Tracking**: Instantly generate lists of students falling below required attendance thresholds.

## Staff and Role Management

Maintain strict, granular access control across your institution. Assign custom roles to HODs, Coordinators, and Support Staff ensuring every person only sees data relevant to their specific function.

## Centralized Communication

Reach your entire campus instantly and reliably. Send emergency broadcasts, holiday announcements, and critical notices via Push Notifications and Emails to all students and staff simultaneously with delivery confirmation.

## Compliance and Reporting

Generate complex institutional reports in seconds. Whether you need data for university audits, government compliance submissions, or internal quarterly reviews, Classgrid exports exactly what you need in the right format.

## Helpdesk and Grievance Redressal

Manage campus complaints with full accountability. Students and staff raise tickets for IT issues, infrastructure problems, or administrative queries. Track resolution times, assign owners, and close issues with complete audit trails.

## Seamless Data Migration

Moving to Classgrid is effortless. Our onboarding team helps you bulk-import existing student records, faculty data, and historical fee structures so you are live and operational within days, not months.`
};

for (const [filename, content] of Object.entries(FILES)) {
  fs.writeFileSync(path.join(DIR, filename), content, { encoding: 'utf8' });
  console.log('Rewrote', filename);
}
