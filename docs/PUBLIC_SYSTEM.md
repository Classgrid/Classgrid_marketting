# ClassGrid Platform Architecture

> **Executive Summary:** This document represents the final frontend architecture blueprint after completing the ClassGrid enterprise backend, covering 41 production modules, 10 master dashboards across 4 organization types, public marketing systems, CMS, and community ecosystem integrations.
> 
> The backend foundation is now complete. This blueprint maps the scale and structural integrity of the entire ClassGrid operating system.

---

## 🧭 1. Core Architecture Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19 + Vite + React Router DOM |
| **Styling & UI** | Tailwind CSS, Shadcn UI, Radix Primitives, Framer Motion |
| **State Management** | Zustand (Global), React Hook Form + Zod (Forms) |
| **Data Fetching** | TanStack React Query, SWR, Axios |
| **Backend API** | Node.js, Express.js |
| **Database & Caching** | MongoDB (Mongoose), Redis (ioredis), BullMQ |
| **Real-time & Media** | Socket.io, Agora, Face-api.js, Tiptap |
| **Authentication** | Passport.js (OAuth2/JWT), Supabase Auth, Firebase |
| **Infrastructure & Storage**| Cloudflare R2, Supabase Storage, Razorpay |
| **AI Integration Layer** | OpenAI, Anthropic, Google Gemini, Groq, HuggingFace |

---

## 📊 2. The 10 Master Dashboards (across 4 Org Types)

Every dashboard has its own dedicated Layout component to prevent UI leakage between roles. The platform dynamically adapts these layouts based on the 4 Organization Types: **Schools, Engineering Colleges, Coaching Institutes, and Junior Colleges**.

| Dashboard | Application Route | Key User Role |
|---|---|---|
| 1. Org Admin (Principal) | `/org` | Principal / Director |
| 2. Student Portal | `/student` | Enrolled Students |
| 3. Faculty Console | `/faculty` | Teachers / Professors |
| 4. Admission Dept | `/dept/admissions` | Admissions Officer |
| 5. Fee Dept | `/dept/fees` | Financial Admin |
| 6. Library Dashboard | `/dept/library` | Head Librarian |
| 7. Canteen Dashboard | `/dept/canteen` | Cafeteria Manager |
| 8. Parent Portal | `/parent` | Parents / Guardians |
| 9. HR & Payroll Dept | `/dept/hr` | HR Manager |
| 10. Alumni Portal | `/alumni` | Alumni / Graduates |

---

## 🧩 3. The 41 Modules

### 📚 Category A: Academics & Learning (10 Modules)
| Module | Focus Area |
|---|---|
| 1. Live Lectures | High-definition virtual classrooms |
| 2. Assignment Mgmt | Submission portals & grading |
| 3. Attendance System | Biometric & manual roll call |
| 4. Subject Resources | Shared PDFs & study material |
| 5. Timetable Scheduler | Conflict-free class scheduling |
| 6. Doubt Resolution | Peer-to-peer and teacher Q&A |
| 7. Syllabus Tracker | Curriculum progress monitoring |
| 8. Notice Board | Digital announcements |
| 9. Performance Analytics | Student growth tracking |
| 10. Lesson Planning | Faculty teaching schedules |

### 🏆 Category B: Exams & Evaluations (8 Modules)
| Module | Focus Area |
|---|---|
| 11. Exam Setup | Seating & hall tickets |
| 12. Interactive Quiz | Gamified testing |
| 13. Grade & Results | SGPA calculation & publishing |
| 14. Internal Assess | Rubric-based grading |
| 15. CET/JEE Exams | High-stakes mock testing |
| 16. Past Papers | Archives & solutions |
| 17. AI Viva | Voice-interactive testing |
| 18. Test Series | Scheduled exam bundles |

### 🏢 Category C: Management (6 Modules)
| Module | Focus Area |
|---|---|
| 19. Admission Mgmt | Application funnel & tracking |
| 20. Fee Collection | Invoicing & POS terminal |
| 21. Leave & Payroll | Faculty HR operations |
| 22. Canteen Mgmt | Live queues & inventory |
| 23. Digital Library | Cataloging & fine tracking |
| 24. Alumni Network | Graduate directory |

### 🚀 Category D: Advanced (14 Modules)
| Module | Focus Area |
|---|---|
| 25. AI Assistant | Context-aware helper |
| 26. Advanced Analytics | Institution-wide metrics |
| 27. Audit Trails | Compliance logging |
| 28. Digital Certificates | PDF/QR credentials |
| 29. Holiday Mgmt | Academic calendar |
| 30. Digital ID Cards | Smart verification |
| 31. Events Mgmt | Ticketing & RSVPs |
| 32. Feedback System | NPS & sentiment analysis |
| 33. Institution Web | Dynamic CMS & news |
| 34. AI Document Scanner | Auto-grading & OCR |
| 35. Behavior Tracking | Disciplinary records |
| 36. Inventory Mgmt | Lab & asset tracking |
| 37. Transport Routes | Bus & GPS tracking |
| 38. Hostel Mgmt | Dorm & allocation |

### 🌍 Category E: Marketing & Ecosystem (3 Sub-Systems)
| System | Public URL | Primary Purpose |
|---|---|---|
| 39. Marketing Portal | `classgrid.in` | Public-facing site & lead generation. |
| 40. Headless CMS | `studio.classgrid.in` | Content management for marketing. |
| 41. Community Forum | `forum.classgrid.in` | Peer-to-peer support and product updates. |

---

## 🔒 4. Engineering Principles & Security

These principles guide our engineering team to ensure platform stability and data sovereignty:

1. **Strict Separation of Concerns:** The frontend client and the enterprise backend are strictly decoupled to ensure high availability and security.
2. **Immutable Backend Architecture:** The backend API is a finalized, enterprise-grade ERP. All UI dashboards securely consume protected API endpoints.
3. **Data Integrity:** The application strictly enforces API validation rules and real-time synchronization for all critical academic and financial operations.
