# CLASSGRID MARKETING SITE - SUPREME TECHNICAL DIRECTIVE (v3.0)

You are building the Classgrid Marketing Website (classgrid.in). This chat message contains your entire technical architecture, database models, and legal policies. You must save this info into your own "docs/" folder and use it for all page content.

---

## 1. TECHNICAL ARCHITECTURE (4 PILLARS)
Pillar 1: Express.js Backend (Managed by PM2 on AWS). 67 routes, 59 models, 34 services.
Pillar 2: SaaS Dashboard (React 18 + Vite + Shadcn UI).
Pillar 3: Android Native Ecosystem (Kotlin).
Pillar 4: This Next.js Marketing Site.

## 2. THE 41 PLATFORM MODULES (TO BE LISTED ON /FEATURES)
1. Auth & Identity, 2. Org Management, 3. Classrooms, 4. Academic Hierarchy, 5. Attendance, 6. Assignments, 7. Result Engine, 8. Online Exam (NTA-style), 9. Quiz System, 10. AI Viva, 11. Real-Time Chat, 12. Fee Management (Razorpay), 13. Timetable, 14. Leave Mgmt, 15. Live Meetings (Agora/Zoom), 16. Library, 17. Notes Marketplace, 18. Feedback, 19. Push Notifications, 20. AI Assistant (RAG), 21. Admission Engine, 22. Teacher Planner, 23. Alumni, 24. Student Analytics, 25. Certificate Gen, 26. Events, 27. Holidays, 28. HR/Payroll, 29. Audit (NAAC/NBA), 30. Demo Provisioning, 31. Webhooks, 32. Cron Jobs, 33. Forums, 34. Google Suite, 35. Voice Messages, 36. Pending Actions, 37. Student Profile, 38. Virtual ID, 39. Org Announcements, 40. API Monitoring, 41. Subscriptions.

## 3. DESIGN SYSTEM (REPLACE PLACEHOLDERS WITH THIS)
- Theme: Pure Black (#000000) Industrial Minimalism.
- Colors: #0A0A0A (Surface), #333333 (Border), #4a90f5 (Primary Blue).
- Header: Glassmorphism (blur 12px), morphing navigation dropdown.
- Footer: 6-column grid containing all modules.

## 4. LEGAL & PRIVACY (ZERO-PLACEHOLDER TEXT)
### Privacy Policy Summary:
Classgrid acts as a Data Processor (DPDP Act 2023). We use Logical Row-Level Isolation (orgId scoping). We DO NOT sell student PII. Biometrics are processed locally on-device. AES-256 for data at rest, TLS 1.3 for transit. 7-day grace period before cascading VPC deletion for cancelled accounts.

## 5. RELEVANT ENDPOINTS
- Demo Request: POST https://api.classgrid.in/api/public/request-demo
- Checkout: POST https://api.classgrid.in/api/public/checkout

---

## YOUR FIRST TASKS:
1. Initialize a new Next.js project: `npx -y create-next-app@latest ./ --typescript --tailwind --lucide`
2. Create a `docs/` folder in your project and save this technical profile as `TECHNICAL_REFERENCE.md`.
3. Build the Home page (/) features section using the list of 41 modules above.
4. Build the /privacy and /terms pages using the real legal logic provided.

What information do you need from me (user) or Sorra (the backend AI) to start the first page?
