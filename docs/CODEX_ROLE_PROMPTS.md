# Master Prompts for Codex: Solution Pages

Here are the 5 distinct prompts for generating the respective solution pages. **Copy and paste the relevant section into Codex when you are ready to generate that specific page.**

---

## 1. Prompt for the ADMINS Page (Replaces Institutes)

```text
# Master Prompt for Codex: Solution Page Rewrite

**ROLE & CONTEXT**
You are a Senior Product Marketing Manager and Technical Writer for Classgrid. Your task is to rewrite the solution `.mdx` files completely from scratch in plain, engaging English. Our audience consists of non-technical stakeholders (Principals, HODs, Admission Staff).

**CRITICAL RULES**
1. **ZERO API References or DB Jargon:** Remove all mentions of GET, POST, `/api/`, or database models.
2. **Translate Tech into Value:** Instead of "Bulk insert attendance," write "Process campus-wide attendance in seconds."
3. **Format:** Output as an `.mdx` file. Use `<h2>`, `<p>`, `<ul>`, and pure HTML `<table>`s. Keep the YAML frontmatter. Keep the `<h2 id="faq">` section at the end.

**SPECIFIC INSTRUCTIONS FOR THIS RUN: THE ADMIN PAGE (for-admins.mdx)**
For this task, you are **ONLY** writing the Admins page. You MUST structure the **ENTIRE DOCUMENT** as a sequence of Questions (using headings) and Answers (using paragraphs).

1. **Headline:** "FOR ADMINS (Enterprise Control for Your Entire Institution)"
2. **What is the Admin Console?** (Explain the high-level, bird's-eye view of the institution).
3. **Who are the Admins in Classgrid?** *(CRITICAL: Explicitly separate and explain these 8 specific dashboards from the wireframes)*:
   - **Org Admin (`/org/*`)**: The Principal/Director. Sees the Bento grid of total revenue, total admissions, and overall compliance (NBA/NAAC).
   - **Admission Dept (`/dept/admissions/*`)**: Tracks application pipelines, verifies documents, generates merit lists.
   - **Fees & Accounts (`/dept/fees/*`)**: Tracks real-time collection, flags defaulters, auto-generates receipts.
   - **Examination Cell (`/dept/exams/*`)**: Uses the AI Paper Generator, publishes results, and generates hall tickets.
   - **Library (`/dept/library/*`)**: Manages physical book issues, e-books, and overdue fines.
   - **Attendance (`/dept/attendance/*`)**: Tracks low-attendance defaulters and sends automated parent notifications.
   - **HR & Payroll (`/dept/hr/*`)**: Processes staff salaries, tracks staff leaves, and generates payslips.
   - **Hostel & Transport (`/dept/hostel/*`)**: Manages room allocations, mess menus, and live bus routes.
4. **What are the core permissions of an Admin?** (Full CRUD access over their specific domain, strict RBAC preventing a Library admin from seeing HR Payroll data).
5. **How does Data Flow up to the Admins?** (Explain that data originates from Teachers and Students, but aggregates into beautiful Analytics charts for Admins).
6. **What advanced features do Admins get?** (Explain: Bento-grid Analytics, Automated Excel Exports, SARAL/DTE Compliance Reports, Bulk SMS/WhatsApp blasts).
7. **Comparison Table:** (Create a pure HTML `<table>` comparing **Org Admin vs Department Admin** on visibility and control).
```

---

## 2. Prompt for the SCHOOLS Page

```text
# Master Prompt for Codex: Solution Page Rewrite

**ROLE & CONTEXT**
You are a Senior Product Marketing Manager and Technical Writer for Classgrid. Your task is to rewrite the solution `.mdx` files completely from scratch in plain, engaging English. Our audience consists of non-technical stakeholders (Principals, Teachers, Parents).

**CRITICAL RULES**
1. **ZERO API References or DB Jargon:** Remove all mentions of GET, POST, `/api/`, or database models.
2. **Translate Tech into Value:** Instead of "Send payload," write "Send instant push notifications."
3. **Format:** Output as an `.mdx` file. Use `<h2>`, `<p>`, `<ul>`, and pure HTML `<table>`s. Keep the YAML frontmatter. Keep the `<h2 id="faq">` section at the end.

**SPECIFIC INSTRUCTIONS FOR THIS RUN: THE SCHOOLS PAGE (for-schools.mdx)**
For this task, you are **ONLY** writing the Schools page. You MUST structure the **ENTIRE DOCUMENT** as a sequence of Questions (using headings) and Answers.

1. **Headline:** "FOR SCHOOLS (The Operating System for Modern Schools)"
2. **Why do Schools need Classgrid?** (To eliminate paperwork, diaries, and parent-teacher friction).
3. **How does it solve Parent Communication?** (Explain automated SMS/WhatsApp alerts for absences, bus tracking, and daily homework).
4. **How does it handle School-specific workflows?** 
   - **Strict Daily Attendance:** Taking morning attendance in 30 seconds.
   - **Fee Installments:** Managing monthly or term-wise parent fee collections and automatic late-fee rules.
   - **Transport & Buses:** Live tracking for parents, route management for admins.
   - **Curriculum Tracking:** Mapping lessons to State Board/CBSE standards.
5. **How does the data flow?** (Teacher assigns homework -> Student views it -> Parent gets notified -> Principal views compliance).
6. **Comparison Table:** (Create a pure HTML `<table>` comparing the **Parent App vs Teacher App** in a school setting).
```

---

## 3. Prompt for the COLLEGES Page

```text
# Master Prompt for Codex: Solution Page Rewrite

**ROLE & CONTEXT**
You are a Senior Product Marketing Manager and Technical Writer for Classgrid. Your task is to rewrite the solution `.mdx` files completely from scratch in plain, engaging English. 

**CRITICAL RULES**
1. **ZERO API References or DB Jargon:** Remove all mentions of GET, POST, `/api/`, or database models.
2. **Translate Tech into Value:** Instead of "JWT Session," write "Secure, instant login."
3. **Format:** Output as an `.mdx` file. Use `<h2>`, `<p>`, `<ul>`, and pure HTML `<table>`s. Keep the YAML frontmatter. Keep the `<h2 id="faq">` section at the end.

**SPECIFIC INSTRUCTIONS FOR THIS RUN: THE COLLEGES PAGE (for-colleges.mdx)**
For this task, you are **ONLY** writing the Colleges page. You MUST structure the **ENTIRE DOCUMENT** as a sequence of Questions (using headings) and Answers.

1. **Headline:** "FOR COLLEGES (The Digital Campus for Higher Education)"
2. **What makes College management different?** (Complexity of departments, electives, credit systems, and massive student volumes).
3. **How does Classgrid handle College-specific workflows?** 
   - **Lecture-wise Attendance:** Tracking attendance per subject, not just per day.
   - **Complex Examinations:** Managing semester exams, internal tests, hall ticket generation, and GPA calculations.
   - **Campus Life:** Digitizing the Library, Canteen (`/canteen`), and Hostel allocations.
   - **Alumni Network:** Seamlessly shifting graduated students to the Alumni portal.
4. **How do Deans and HODs use it?** (Viewing departmental analytics, faculty performance, and syllabus completion rates).
5. **Comparison Table:** (Create a pure HTML `<table>` comparing **HOD Dashboard vs Professor Dashboard**).
```

---

## 4. Prompt for the ENGINEERING Page

```text
# Master Prompt for Codex: Solution Page Rewrite

**ROLE & CONTEXT**
You are a Senior Product Marketing Manager and Technical Writer for Classgrid. Your task is to rewrite the solution `.mdx` files completely from scratch in plain, engaging English. 

**CRITICAL RULES**
1. **ZERO API References or DB Jargon:** Remove all mentions of GET, POST, `/api/`, or database models.
2. **Translate Tech into Value:** Instead of "Export DB dump," write "Generate compliance reports instantly."
3. **Format:** Output as an `.mdx` file. Use `<h2>`, `<p>`, `<ul>`, and pure HTML `<table>`s. Keep the YAML frontmatter. Keep the `<h2 id="faq">` section at the end.

**SPECIFIC INSTRUCTIONS FOR THIS RUN: THE ENGINEERING PAGE (for-engineering.mdx)**
For this task, you are **ONLY** writing the Engineering page. You MUST structure the **ENTIRE DOCUMENT** as a sequence of Questions (using headings) and Answers.

1. **Headline:** "FOR ENGINEERING (Built for the Complexity of Technical Education)"
2. **Why is Classgrid perfect for Technical Institutes?** (It handles complex lab batches, massive credit requirements, and strict compliance).
3. **How does it solve Engineering-specific workflows?** 
   - **Compliance & Accreditation:** Auto-generating data for NBA, NAAC, and SARAL reports directly from daily faculty usage.
   - **Lab & Practical Management:** Scheduling specific lab batches and tracking practical assignments/submissions via the app.
   - **Placement Cell:** Tracking campus recruitment drives, student resumes, and interview schedules.
   - **Innovation & Notes:** Highlighting the Notes Marketplace (`/marketplace`) for sharing complex technical PDFs.
   - **Virtual ID Card:** Securing library and lab access.
4. **Comparison Table:** (Create a pure HTML `<table>` comparing **Placement Officer vs Exam Controller** workflows).
```

---

## 5. Prompt for the COACHING Page

```text
# Master Prompt for Codex: Solution Page Rewrite

**ROLE & CONTEXT**
You are a Senior Product Marketing Manager and Technical Writer for Classgrid. Your task is to rewrite the solution `.mdx` files completely from scratch in plain, engaging English. 

**CRITICAL RULES**
1. **ZERO API References or DB Jargon:** Remove all mentions of GET, POST, `/api/`, or database models.
2. **Translate Tech into Value:** Instead of "Process webhook," write "Instantly reconcile student fee payments."
3. **Format:** Output as an `.mdx` file. Use `<h2>`, `<p>`, `<ul>`, and pure HTML `<table>`s. Keep the YAML frontmatter. Keep the `<h2 id="faq">` section at the end.

**SPECIFIC INSTRUCTIONS FOR THIS RUN: THE COACHING PAGE (for-coaching.mdx)**
For this task, you are **ONLY** writing the Coaching page. You MUST structure the **ENTIRE DOCUMENT** as a sequence of Questions (using headings) and Answers.

1. **Headline:** "FOR COACHING (The Ultimate Platform for Coaching Institutes)"
2. **What is the focus for Coaching Centers?** (Acquisition, retention, rigorous testing, and fee collection).
3. **How does Classgrid handle Coaching-specific workflows?** 
   - **CRM & Lead Tracking:** Catching demo leads from the website and funneling them into the Admissions dashboard to convert into paid students.
   - **Test Series & Mock Exams:** Using the Quiz Manager and AI Paper Generator to run massive online MCQs for JEE/NEET prep.
   - **Aggressive Fee Follow-ups:** Dashboards that immediately flag fee defaulters and send automated reminders.
   - **Notes Marketplace:** Allowing the institute (or students) to sell premium study packages and video lectures.
4. **How do owners track growth?** (Using the Super/Org Admin bento-grid dashboard to see MRR (Monthly Recurring Revenue) and active student counts).
5. **Comparison Table:** (Create a pure HTML `<table>` comparing the **Admission/CRM Exec vs the Academic Tutor** workflows).
```
