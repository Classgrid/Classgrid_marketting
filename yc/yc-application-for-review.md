# YC W2027 Application — Classgrid

## FOUNDER PROFILE

### Role
**CEO & Sole Technical Founder**

### Equity
**100%**

### Walk us through your thinking around balancing your startup, school, and any other obligations.

I am in my second year of B.Tech at PCCoE, Pune. I balance college by turning it into my testbed—my college is actually my first live pilot customer for Classgrid V2.

Classgrid is my primary work. I have no job and no internships. Since college runs from 9 AM to 5 PM, I am highly disciplined with my time: I spend 3–4 hours every weekday optimized via tools like Notion and Antigravity IDE for designing, testing, and debugging. On weekends, I do 7–8 hours a day of deep work — these are the days I build massive architectural features like our multi-tenant subdomain router. The proof of this commitment is that my own engineering college relies on the product I built.

If accepted, I will go full-time on Classgrid — no coursework, no distractions. If I don't get in, I will continue building alongside college, sign our first paying schools, and use that revenue to scale.

---

### Please tell us about a time you most successfully hacked some (non-computer) system to your advantage.

I needed cloud infrastructure but had zero money and no investors. Most startup credit programs are designed for VC-backed companies — I didn't qualify. Instead of giving up, I read every eligibility document. I found that AWS Activate Founders accepted self-funded startups if you could prove a live product and a real architecture.

I prepared detailed evidence — system diagrams, database schemas, live URLs, and infrastructure requirements — and applied. Classgrid was accepted and received $1,000 in AWS credits.

Then I did the same thing with MongoDB, Cloudflare, Razorpay, and Anthropic Claude. Total infrastructure value secured: over $11,000 — without raising a single rupee.

---

### Please tell us in one or two sentences about the most impressive thing other than this startup that you have built or achieved.

To support Classgrid's infrastructure, I built and published two standalone engineering projects: **GridX**, a premium React component library with over 100 components, and **@gridx/ai**, a full-stack AI SDK featuring multi-provider fallback, RAG, and memory. I also built a unified support CRM that bridges our marketing site and enterprise platform, featuring an AI agent that automatically reads, routes, and replies to customer tickets.

---

### Tell us about things you've built before.

- **Classgrid (Evolution)** — Started as an AI academic assistant and evolved into a multi-tenant educational operating system. V1 focused on AI-powered academic help; V2 added live classroom workflows including GPS attendance, quizzes and classroom communication; V3 is the full enterprise platform with multi-tenant provisioning and our own AI SDK.
- **GridX** — A premium React component library with over 100 components.
- **@gridx/ai** — Our AI SDK for multi-provider model routing, RAG, memory, and AI application tooling.

---

### List any competitions/awards you have won, or papers you've published.

No formal awards. Classgrid is registered as an MSME with the Government of India (UDYAM-MH-01-0308803).

---

### List any relevant or impressive test scores.

**[NOTE TO YAHIA — remove before submission]:** I have currently left this section blank as I do not have a 99th percentile score. Given your experience as a YC founder, I would deeply appreciate your guidance on whether I should leave this completely empty or approach it differently.

---

### List any entrepreneurship programs, clubs, or hacker houses you have participated in or are currently participating in.

None. Self-taught. No accelerator, no incubator, no program. I learned everything by building Classgrid from zero.

---

### Who writes code, or does other technical work on your product? Was any of it done by a non-founder? Please explain.

I am the sole founder and the sole technical architect. I design every data model, every API, every system flow. I use AI coding tools (Gemini, Claude, Codex) as pair-programmers to execute at higher velocity — but every architectural decision, every schema, every workflow is mine.

Zero code was outsourced to agencies, freelancers, or contractors. To maintain uptime (e.g. during my own exam weeks), I rely on automated deployment pipelines and highly defensive error handling so I only wake up for critical Sev-1 alerts.

---

### Are you looking for a cofounder?

Yes, absolutely. I built the entire platform up to this point alone, but scaling Classgrid into a massive enterprise business requires a serious partner. I am actively looking for a cofounder who complements me: a technical partner who can own the frontend/mobile architecture, or a business partner who can own enterprise education sales in India.

---

## COMPANY

### Company name
**Classgrid**

### Describe what your company does in 50 characters or less.
**The AI-Powered Operating System for Education**

### Company URL
**https://classgrid.in**

### Please provide a link to the product, if any.
**https://v2.classgrid.in**

### Login credentials
**Email:** yc@classgrid.in  
**Password:** passs@123  
*(We have whitelisted this account for frictionless review access)*

### What is your company going to make?

I started Classgrid as an AI academic assistant. V1 let students ask questions, generate quizzes, and get academic help. As I deployed it, I realized the AI was only useful if it understood the institution's underlying data — attendance, classes, exams, students, and faculty workflows. That led me to build Classgrid into a full educational operating system, with AI as the interface on top.

We handle the entire lifecycle of an institution — admissions, attendance, exams, fees, and payroll. We have a working lightweight version (V2) deployed at Pimpri Chinchwad College of Engineering with real faculty and students using our GPS-verified attendance system and AI tools. For our enterprise version (V3), every institution gets its own branded subdomain (e.g. pccoe.classgrid.in) and an isolated data layer, provisioned instantly.

### Where do you live now, and where would the company be based after YC?
**Pune, India / Pune, India**

### Explain your decision regarding location.

We are based in Pune, but our target market is the entire state of Maharashtra — every school, junior college, and engineering college across all districts and cities. Maharashtra alone has thousands of educational institutions that are still running on painful, fragmented software. Our first pilot at PCCoE is just the starting point. We plan to rapidly expand to institutions across Maharashtra and then scale to all states across India.

---

## PROGRESS

### How far along are you?

Since our Fall 2026 rejection, we have made significant progress focusing entirely on deployment and real users:

1. **Live pilot at PCCoE** — A faculty member (Dr. C. L. Ladekar) at Pimpri Chinchwad College of Engineering is actively using our GPS-verified attendance system with real students. We have conducted multiple live classroom sessions.

2. **V2 fully deployed** — v2.classgrid.in is live with GPS attendance, a quiz engine, real-time classroom chat, and admin dashboards with audit logs. 

3. **Solved indoor GPS accuracy** — The core technical hurdle for attendance was indoor GPS drift. We rebuilt the location engine with multi-sample validation and hard rejection of bad readings, achieving reliable 5–20m accuracy.

4. **Built a scalable foundation** — We built a multi-tenant enterprise backend that can instantly provision isolated databases and subdomains for new schools in under 60 seconds.

### How long have each of you been working on this? How much of that has been full-time?

~14 months. I am in college, but I work on Classgrid 3-4 hours every weekday and 7-8 hours a day on weekends. It is effectively full-time.

### What tech stack are you using?

**Platform (V3):** React, TypeScript, Tailwind CSS, Framer Motion / Node.js, Express, MongoDB Atlas, Redis (ioredis), Socket.io  
**Lightweight version (V2):** Vanilla JS, HTML / Node.js, Express, MongoDB, Vercel (serverless)  
**Marketing site:** Next.js, TypeScript, Sanity CMS, Vercel  
**Infrastructure:** AWS, Cloudflare, MongoDB Atlas  
**Payments:** Razorpay (live production)  
**AI:** Google Gemini, Anthropic Claude  
**AI coding tools:** Gemini (Antigravity IDE), Claude, Codex — pair-programming under my architectural direction

### Are people using your product?
**Yes**

### How many active users or customers do you have?

A faculty member (Dr. C. L. Ladekar) and his students at Pimpri Chinchwad College of Engineering actively use our GPS-verified attendance system for live classroom sessions. They open it every class, which has completely eliminated the 10 minutes previously wasted on calling out names manually, while also preventing students from marking proxy attendance. We currently have 70+ registered users — including 60+ students who open the app every single class to mark attendance — alongside active faculty and org admins. It represents real daily usage in an actual engineering college, demonstrating our backend's ability to handle complex institutional workflows.

### Do you have revenue?
**No**

### If you are applying with the same idea as a previous batch, did anything change?

We applied to Fall 2026 and were rejected. Here is what changed:

1. **We have real users now.** Last time: "Are people using your product? No." This time: a faculty member at PCCoE is actively using our attendance system with real students.

2. **We deployed a working product.** V2 is live at v2.classgrid.in. You can log in with real credentials and see real data — attendance sessions, classroom analytics, student records, admin audit logs.

3. **We fixed the core technical problem.** GPS accuracy was showing 200–300m errors indoors. We rebuilt the GPS engine with multi-sample validation, accuracy thresholds, and hard rejection of bad readings. The system now reliably works at 5–20m accuracy.

### If you have already participated or committed to participate in an incubator, "accelerator" or "pre-accelerator" program?

No. 

---

## IDEA

### Why did you pick this idea to work on?

Every educational management system in India treats AI as an afterthought. I wanted to build the opposite: an educational operating system where AI is the first thing you see when you open the platform, not a feature you eventually click on.

I have lived inside this problem my entire academic life — school, JEE coaching, junior college, and now engineering college. Every institution already had software. The software made things worse. Faculty hated it. Students ignored it. Admins paid for it and waited for it to be replaced. The tools had no intelligence. They were just digital paperwork.

I started building Classgrid in my first year of college because I was tired of waiting for someone else to fix it. The insight was this: when a student opens their dashboard, they should not see a list of menus. They should land directly on Classgrid AI — our own AI assistant that knows their full academic context. While incumbents treat AI as a bolt-on feature, we built it into the foundation.

### Who are your competitors?

**vmedulife** (vmedulife.com) and **EduPlusCampus** (edupluscampus.com).

The structural advantages of our approach:

1. **UX is not optional.** Legacy ERPs are built by enterprise contractors who have never been students. The interfaces are so painful that institutions buy them and faculty refuse to use them. We build for the person who actually opens the app at 8am — the teacher who has 60 students waiting.

2. **Multi-tenant Architecture.** Competitors deploy separate, hard-to-maintain instances per institution. We provision a new school in under 60 seconds on the same platform — auto-generated branded subdomain (e.g. school.classgrid.in), role-based access, and complete data isolation. Premium institutions can also point their own domain (e.g. erp.school.edu.in) via CNAME verification.

3. **AI is built in, not bolted on.** Our competitors run on legacy architectures built before modern AI existed. Because their pricing models weren't designed for it, they often pass LLM costs as massive premium add-on charges to institutions. We built AI into the foundation from day one — AI email processing, AI chat support, AI quiz generation — so it comes included, not as an upsell. When two products both handle attendance and fees, but one includes embedded AI at the same price, schools pick ours.

Our platform is built on four structural advantages: deep educational domain backend, AI-first architecture, multi-tenant provisioning, and a modern tech stack. No new AI startup has the domain depth — our backend has 637 route operations across 5 institution types (school, coaching, junior college, engineering, diploma) with institution-specific workflows for each.

### How do or will you make money?

Institutions pay a B2B SaaS subscription (e.g., ₹50,000–₹2,00,000/year depending on campus size). The economic value is clear: replacing 4 fragmented legacy tools (attendance, fees, exams, AI) with Classgrid saves them more money than our subscription costs. Our pricing model includes: per-module subscriptions, per-active learner/campus pricing, usage-based fees (storage/SMS), monthly/annual contracts, and custom enterprise contracts for large institutions.

Our go-to-market is deliberate: although our pilot is at an engineering college, our first paying targets are K-12 schools and coaching institutes. We chose this path because selling to engineering colleges in India requires expensive relationship-based sales (wining and dining directors) that we cannot fund yet, and their technical onboarding is massively complex. If we target them first, we will get bogged down in endless custom edge cases. Schools, however, have simple onboarding and principals can make a buying decision in a 20-minute demo. We will use schools to generate fast revenue and expand our engineering team initially, while quietly perfecting the complex college onboarding flow using our PCCoE pilot in the background.

We are currently initiating conversations with our first target institutions: Dahanukar English Medium School, Trimurti Arts, Commerce & Science Higher Secondary School, and Pentagon Career Institute. Next in our prospecting pipeline are Dahanukar Junior College, C. D. Jain College of Commerce, Kha. Shri. Govindrao Adik Law College, and RBNB College, Shrirampur.

### If you had any other ideas you considered applying with, please list them.

**GridX Mail** — We built an internal AI email agent that automatically reads, classifies, and replies to support@classgrid.in tickets so I don't have to manually triage them. It can also escalate to a real human when it detects complex issues, and send automated follow-ups. The technology works incredibly well and could easily be spun out as a standalone B2B SaaS. However, Classgrid is my sole focus, and we only plan to open-source GridX Mail or sell it as a side-project if it doesn't distract from the core platform.

---

## EQUITY

### Have you formed ANY legal entity yet?
**No** — but Classgrid is MSME registered with the Government of India (UDYAM-MH-01-0308803, Classification: Computer Programming Activities - 62011).

### Planned equity ownership
Nikhil Shinde — Sole Founder & CEO — 100% equity. Plan to reserve 10–15% ESOP pool for early engineers when we hire.

### Have you taken any investment yet?
**No**

### Are you currently fundraising?
**No**

---

## CURIOUS

### What convinced you to apply to Y Combinator?

We applied to Fall 2026 and were rejected. That rejection forced me to stop building in isolation and start deploying the product with real users. Since then, my college has become our first live deployment: faculty and students are using Classgrid every class to save time on attendance.

I am applying again because I now have evidence that the product can work in a real institution, not just a demo. My immediate goal is to turn this pilot into our first paid deployment and then repeat the process with other institutions. YC would help me hire the 2–3 engineers I need to finish the product and scale that process.

### How did you hear about Y Combinator?

Vercel's startup team mentioned YC as one of their accelerator partners.

---

## BATCH PREFERENCE
**Winter 2027** (current batch)

---

## **FOUNDER VIDEO SCRIPT** (Max 1 Minute — Webcam, Face to Camera)

**TIPS:** Sit in a quiet, well-lit room. Look directly into the camera lens (not the screen). Speak naturally like you're talking to a friend. Do NOT read from a script — just glance at these bullet points and talk. YC partners want to see YOUR energy and conviction, not a polished production.

---

**[0:00–0:10] WHO YOU ARE:**
> "Hi, I'm Nikhil Shinde. I'm 19, I'm in my second year of B.Tech at Pimpri Chinchwad College of Engineering in Pune, and I'm the solo founder of Classgrid."

**[0:10–0:25] WHAT CLASSGRID IS:**
> "Classgrid is the AI-powered operating system for educational institutions in India. We replace the 4 or 5 fragmented legacy tools that schools and colleges hate — attendance systems, exam software, fee platforms, communication apps — with a single, modern platform that has AI built directly into the foundation."

**[0:25–0:40] WHY YOU BUILT IT:**
> "I built this because I've lived through terrible educational software my entire life — school, coaching, junior college, and now engineering college. Every institution already had software. The software made things worse. Faculty hated it. Students ignored it. I got tired of waiting for someone else to fix it, so I taught myself to code and built what institutions actually need."

**[0:40–0:55] TRACTION:**
> "Right now, my own engineering college is our first live pilot. A faculty member and his students use Classgrid every single class to run GPS-verified attendance. It completely eliminated proxy attendance and saves 10 minutes per lecture. We solved the hard technical problem of indoor GPS drift and achieve 5 to 20 meter accuracy."

**[0:55–1:00] CLOSE:**
> "I'm applying to YC because I now have proof that this works in a real institution. I need help hiring 2-3 engineers to finish the product and scale to more schools across Maharashtra."

---

## **DEMO VIDEO SCRIPT** (1–2 Minutes — Screen Recording + Voice Narration)

**TIPS:** Use Loom (free at loom.com) to screen record with your voice. No webcam needed for this one. Talk fast and energetically. Don't pause or hesitate — just keep moving through the product. Show real data, not empty dashboards.

---

**[0:00–0:08] OPEN LOGIN PAGE (v2.classgrid.in)**
> "This is Classgrid — the AI-powered operating system for educational institutions. Let me show you the live version deployed at my engineering college."

**[0:08–0:18] LOG IN → DASHBOARD LOADS**
> "This is the faculty dashboard. Everything an institution needs — attendance, quizzes, classroom tools, analytics — all in one place. No more switching between 5 different apps."

**[0:18–0:35] CLICK ON GPS ATTENDANCE → START A SESSION**
> "This is our killer feature — GPS-verified attendance. Faculty starts a session, and students can only mark attendance if they are physically present inside the classroom. We solved indoor GPS drift — most competitors give up on GPS indoors because readings jump to 200 or 300 meters. We rebuilt the location engine with multi-sample validation and hard rejection of bad readings, achieving reliable 5 to 20 meter accuracy."

**[0:35–0:50] SHOW ATTENDANCE RECORDS / ANALYTICS**
> "This is real data — real students at Pimpri Chinchwad College of Engineering use this every single class. It completely eliminated proxy attendance and saves 10 minutes per lecture that was previously wasted calling out names."

**[0:50–1:05] OPEN ASK AI PANEL → TYPE A QUESTION**
> "And this is Classgrid AI — our built-in AI assistant. It's not a generic chatbot bolted on top. It uses RAG — retrieval-augmented generation — to pull answers directly from the institution's own data and documentation. Watch — it answers in under 2 seconds."

**[1:05–1:15] SHOW THE AI RESPONSE APPEARING**
> "No competitor in the Indian education market has this. Legacy ERPs were built before modern AI existed. We built AI into the foundation from day one — so it comes included, not as a premium add-on that costs extra."

**[1:15–1:25] QUICK SCROLL THROUGH ADMIN PANEL / ORG SETTINGS**
> "On the enterprise side, we built a multi-tenant architecture. We can provision a brand new school — with its own branded subdomain, complete data isolation, and role-based access — in under 60 seconds."

**[1:25–1:30] END**
> "This is Classgrid. Real product, real users, real institution. Thank you."

---

## **[PENDING — Remove this section before submission]**

- [ ] Record Founder Video (1 min, webcam, face to camera)
- [ ] Record Demo Video (1-2 min, screen recording + voice narration)
- [ ] Capture user count / traction screenshot
- [ ] Capture super admin dashboard image
- [ ] Get Yahia's review and feedback
- [ ] Remove the `[NOTE TO YAHIA]` tag from test scores section
- [ ] Remove both video script sections before final submission
- [ ] Final proofread before pasting into YC form 
