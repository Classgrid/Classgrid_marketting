# 🚀 CLASSGRID MASTER IMPLEMENTATION PLAN (Unified)

> **💥 CRITICAL RULES FOR ALL FUTURE AI AGENTS:**
> - **🚨 NO TERMINAL FOR SEARCHING:** Use ONLY folder/file native tools (`list_dir`, `view_file`) to search. Terminal commands (like `grep`, `find`/`Get-ChildItem -Recurse`) are **strictly prohibited** to search for specific parts.

This document serves as the **single source of truth** for the Classgrid Platform & Marketing application architecture.

---

## Phase 1: High-Conversion Marketing Homepage (Ongoing)
**Goal:** Build the ultimate B2B educational SaaS homepage using Next.js 15, `magicui`, and `shadcn/ui`.
- **UI Architecture:** Driven by highly interactive visual hooks (Scroll Morph Hero, Animated Beams, Bento Grids, Orbital Timelines).
- **Data Layer:** `content/homepage.ts` manages all the heavy content (41 modules, FAQs, Testimonials) to keep UI components extremely clean.
- **Strict Constraint:** Zero-border radius shapes where specified, strict `emerald` primary coloring, and dark-mode first design natively togglable to light.

---

## Phase 2: "Shopify for Schools" Architecture (The Core Engine)
**Goal:** We are not building a legacy ERP. Classgrid is an all-in-one system. When a school signs up, they receive a fully-hosted, SEO-optimized public website (`theirschool.classgrid.in`) that acts as their primary admissions conversion engine. The ERP is hidden behind this website via a single gateway.

### 2.1 The Public Website Builder Spec
Every tenant automatically gets a public-facing conversion site built on Next.js Wildcard Routing with the following layout:
- **Header:** Logo (left), Nav links (Home | About | Programs | Notices | Merit List | Fees | Blog | Contact), [Apply Now] CTA, and a small [Login] button.
- **Hero:** Large banner, Institution name + tagline, CTAs.
- **Dynamic Programs Section:** Morphs based on org type (School -> Classes, Junior -> Streams, College -> Courses, Coaching -> Batches).
- **Other Sections:** Highlights, About, Admission, Merit List, Fees & Intake, Rules, Notices, Blog, Contact.
- **Footer (4-column):** Inst Info, Programs, Links, Quick Access, integrated Google Map, and "Powered by Classgrid".
- **Design Rules:** Clean/minimal UI, customizable primary hex color per org, Shadcn cards, zero ERP internal bleeding. 

### 2.2 The B2B Onboarding & Sales Funnel
1. **The Hook:** Principal fills out `DemoRequestForm.tsx` (Supports all 4 org types).
2. **The Proxy Setup:** The Next.js `rewrites` config captures `/api/request-demo` and proxies to `http://localhost:5000/api/public/request-demo`.
3. **The Review:** Classgrid Super Admin receives the lead. An automated Cal.com booking is scheduled.
4. **Instant Provisioning:** While on the call, you hit **[Approve Org]**. This instantly spins up `org_id` and the subdomain (`dypatil.classgrid.in`). The Super Admin can set the logic to Path A (Demo Trial) or Path B (Paid Premium).
5. **Initialization Wizard:** The first login forces the Principal to define their term structure forever.
6. **CMS Editing:** The org can edit their website using a simple settings page in their admin dashboard (Supabase JSON) without needing enterprise Sanity accounts.

### 2.3 The 3-Layer Tenant Routing Strategy (Unified Login)
Instead of forcing users onto a generic `erp.vmedulife.com` portal, they authenticate on their own turf:

1. **The Single Gateway (`dypatil.classgrid.in/login`):**
   - A single, beautifully crafted login screen used by *everyone* (Students, Faculty, and Admin).
2. **The RBAC Splitter (Role-Based Access Control):**
   - Upon entering their password, the Node.js backend (`models/User.js`) returns the user's specific role (out of 19 programmed roles).
   - The React router seamlessly isolates them:
     - `student` ➡️ `/dashboard/student`
     - `faculty` ➡️ `/dashboard/faculty`
     - `library_manager` ➡️ `/dashboard/library`
     - `admission_head` ➡️ `/dashboard/admissions` 

### 2.4 The "Bring Your Own Website" (BYOW) Flow
For large institutions (like Engineering Colleges) that already have a custom-built website (`www.pccoe.edu.in`) and do not want to use the Classgrid Website Builder:
- **ERP Login connection:** Their IT team simply adds a **[Login to ERP]** button on their existing public site. It points directly to their gateway (`pccoe.classgrid.in` or `app.classgrid.in`).
- **Admissions connection:** They add an **[Apply Now 2026]** button on their existing site. It points directly to our standalone admissions form (`pccoe.classgrid.in/apply`).
- **Result:** The parent or student is safely routed off their legacy site into our highly-converting, isolated portals, dumping data straight into the Admission Head's dashboard.

---

## Phase 3: Immediate Next Steps for Development
1. **Marketing "Demo Success" Page:** Finish the form flow so `/demo/success` cleanly embeds Cal.com for the Super Admin verification booking.
2. **Tenant Website Builder components:** Begin scaffolding the `TenantHero`, `TenantPrograms`, and `TenantFooter` within the Next.js wildcard routing system using the approved spec above. 
3. **Admin Controllers:** Activate the `superadmin.controller.js` to handle the final push of the Subdomain creation event.