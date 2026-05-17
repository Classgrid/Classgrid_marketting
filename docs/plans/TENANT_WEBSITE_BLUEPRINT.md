# Classgrid Tenant Website — Full Design Blueprint
## Version 2.1 | Added Governance, Academic, and Student-Centric pages
## Built with: Next.js + Tailwind + Framer Motion + Shadcn

---

## 🎨 GLOBAL DESIGN SYSTEM

### Typography
- **Font:** Inter (headings) + Outfit (body) — Google Fonts
- **H1:** 56px bold | **H2:** 36px semibold | **H3:** 24px medium | **Body:** 16px regular

### Colors (Per Org — set in MongoDB `org_website_content.theme`)
- `primary` → Customizable (e.g. dark blue, maroon, green)
- `primary_dark` → 20% darker shade of primary
- `accent` → White or Gold depending on primary
- Background: White (light sections) / `primary_dark` (dark sections)

### Animations (Framer Motion — same library as classgrid_marketting)
- **fadeUp:** `y: 40 → 0, opacity: 0 → 1, duration: 0.6`
- **fadeIn:** `opacity: 0 → 1, duration: 0.4`
- **staggerChildren:** `delayChildren: 0.1, staggerChildren: 0.15`
- **counterAnimation:** Numbers count from 0 → target on scroll-into-view
- All animations trigger on scroll (IntersectionObserver / Framer `whileInView`)

### Floating Elements (All Org Types)
```
RIGHT SIDE (fixed):
  Facebook | Instagram | LinkedIn | YouTube | WhatsApp (stacked icons, hover expands)

BOTTOM RIGHT (fixed):
  [Apply Now] button — pulses softly with CSS keyframe animation
```

---

## 🖼️ HOME PAGE WIREFRAME (All Org Types)
> Exact visual layout using ASCII lines. Every section shown top to bottom.

```
╔══════════════════════════════════════════════════════════════════════════════╗
║  TOP BAR  |  📞 +91-XXXXXXXX   ✉ info@college.edu   📍 City, Maharashtra   ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  [LOGO]   Home  About  Programs  Notices  Merit  Fees  Gallery  Events      ║
║           Alumni  Blog  Contact                   [Apply Now]  [Login]      ║
╚══════════════════════════════════════════════════════════════════════════════╝
 ↑ Transparent over video. Becomes solid white + blur after 80px scroll.

┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│                    🎬  HERO — FULL SCREEN VIDEO                              │
│             (Looping campus video, muted, 10–20 sec clip)                   │
│                   Dark gradient overlay 60% opacity                          │
│                                                                              │
│              ┌─────────────────────────────────────┐                        │
│              │   COLLEGE NAME  (fadeUp, 0.0s)       │                        │
│              │   Tagline text  (fadeUp, 0.3s)        │                        │
│              │                                       │                        │
│              │  [Apply Now]     [Explore Programs]   │                        │
│              │   (fadeUp, 0.6s)   (fadeUp, 0.8s)    │                        │
│              └─────────────────────────────────────┘                        │
│                                                                              │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐              │
│  │ 🎓 5000+     │ 🏆 98%       │ 📅 25+ Years │ 👩‍🏫 150+     │              │
│  │  Students    │  Results     │  Excellence  │  Faculty     │              │
│  └──────────────┴──────────────┴──────────────┴──────────────┘              │
│   ↑ Semi-transparent dark bar. Numbers animate 0 → value on load.           │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                    HIGHLIGHTS / ACHIEVEMENTS STRIP                           │
│                        (White background)                                    │
│                                                                              │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐               │
│   │    🏆    │   │    📊    │   │    🎖️    │   │    🏛️    │               │
│   │  [Num]   │   │  [Num]   │   │  [Num]   │   │  [Num]   │               │
│   │  Label   │   │  Label   │   │  Label   │   │  Label   │               │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘               │
│    ↑ Each card fadeUp with 0.15s stagger. Numbers count from 0.             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│              OUR [CLASSES / STREAMS / BATCHES]                               │
│                  (Primary color background)                                  │
│                                                                              │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐         │
│   │  📘 [Program 1]  │  │  📗 [Program 2]  │  │  📙 [Program 3]  │         │
│   │  Duration        │  │  Duration        │  │  Duration        │         │
│   │  Short desc...   │  │  Short desc...   │  │  Short desc...   │         │
│   │  [Know More →]   │  │  [Know More →]   │  │  [Know More →]   │         │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘         │
│    School: Class 10 | Class 11 | Class 12                                   │
│    Junior: Science  | Commerce | Arts                                       │
│    Coaching: JEE Main | JEE Adv | NEET                                      │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                     ADMISSIONS OPEN 2025–26                                  │
│              (Full-width gradient: primary → primary_dark)                   │
│                                                                              │
│   "Applications are now open for the academic year 2025–26"                 │
│   📅 Last Date: 30 June 2025        [ APPLY NOW → ]                         │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                    LATEST NOTICES / ANNOUNCEMENTS                            │
│                                                                              │
│  ┌────────────────────────────┐  ┌────────────────────────────────────────┐ │
│  │  [College building image]  │  │ 📅 15 Apr  Exam Schedule Released  [→] │ │
│  │  with primary overlay      │  │────────────────────────────────────────│ │
│  │                            │  │ 📅 12 Apr  Admission Forms Open    [→] │ │
│  │  "Latest Notices"          │  │────────────────────────────────────────│ │
│  │  Stay up to date...        │  │ 📅 10 Apr  Holiday — Good Friday   [→] │ │
│  │                            │  │────────────────────────────────────────│ │
│  │  [ View All Notices → ]    │  │ 📅 05 Apr  PTM Scheduled           [→] │ │
│  │                            │  │────────────────────────────────────────│ │
│  │  40% width                 │  │ 📅 01 Apr  New Academic Year Starts[→] │ │
│  └────────────────────────────┘  └────────────────────────────────────────┘ │
│   ↑ Right column auto-scrolls upward smoothly. Pauses on hover.             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│              MEET OUR [TEACHERS / FACULTY / MENTORS]                         │
│                        (White background)                                    │
│                                                                              │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │  [Photo]   │  │  [Photo]   │  │  [Photo]   │  │  [Photo]   │            │
│  │  Dr. Name  │  │  Prof Name │  │  Mr. Name  │  │  Ms. Name  │            │
│  │  HOD - CS  │  │  Physics   │  │  Maths     │  │  English   │            │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘            │
│   ↑ Pulled from ERP faculty_profiles (isPublic: true). Hover: scale + shadow│
│                              [ View All Faculty → ]                          │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                  CAMPUS LIFE @ [College Name]                                │
│                   (Light grey background)                                    │
│                                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐                          │
│  │  Photo 1 │  │  Photo 2 │  │                  │                          │
│  │          │  │          │  │     Photo 3       │                          │
│  ├──────────┤  └──────────┘  │   (tall photo)    │                          │
│  │  Photo 4 │  ┌──────────┐  │                  │                          │
│  │          │  │  Photo 5 │  ├──────────────────┤                          │
│  └──────────┘  │          │  │     Photo 6       │                          │
│                └──────────┘  └──────────────────┘                          │
│   ↑ Masonry grid. Hover: dark overlay + 🔍 icon. Click: lightbox opens.    │
│                          [ View Full Gallery → ]                             │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│              WHAT OUR [STUDENTS / ALUMNI] SAY                                │
│                  (White background, auto-scroll carousel)                    │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │ ███ PRIMARY ██ │  │ ███ PRIMARY ██ │  │ ███ PRIMARY ██ │                │
│  │   ○ [Photo] ○  │  │   ○ [Photo] ○  │  │   ○ [Photo] ○  │                │
│  │   ⭐⭐⭐⭐⭐   │  │   ⭐⭐⭐⭐⭐   │  │   ⭐⭐⭐⭐⭐   │                │
│  │  Student Name  │  │  Student Name  │  │  Student Name  │                │
│  │  Batch 2024    │  │  Batch 2023    │  │  Batch 2022    │                │
│  │  "Testimonial  │  │  "Testimonial  │  │  "Testimonial  │                │
│  │   text here.." │  │   text here.." │  │   text here.." │                │
│  │  [f] [in]      │  │  [f] [in]      │  │  [f] [in]      │                │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
│   ↑ Auto-scrolls left. Pauses on hover. Cards have consistent primary color │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│         QUICK ENQUIRY FORM  [Junior College + Coaching ONLY]                 │
│                   (Primary color background)                                 │
│                                                                              │
│  "Interested in joining us? Let us call you back."                          │
│                                                                              │
│  [ Full Name       ] [ Phone Number    ] [ Program ▼ ] [ SUBMIT ]           │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────┐
│                        GOOGLE MAPS (Full Width)                              │
│                          350px height                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                     [ Google Map Embed ]                               │ │
│  │                 (Shows college location pin)                           │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘

╔══════════════════════════════════════════════════════════════════════════════╗
║                     F O O T E R  (Dark background)                          ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  [LOGO]              ║  Academics      ║  Quick Links  ║  Connect           ║
║  Address line 1      ║  ─────────────  ║  ───────────  ║  ──────────        ║
║  Address line 2      ║  Programs       ║  Notices      ║  [Facebook]        ║
║  📞 +91-XXXXXXXX     ║  Faculty        ║  Merit List   ║  [Instagram]       ║
║  ✉ email@college.edu ║  Gallery        ║  Admissions   ║  [YouTube]         ║
║  [WhatsApp Us]       ║  Events         ║  Fees         ║  [LinkedIn]        ║
║                      ║  Alumni         ║  Contact      ║                    ║
║                      ║  Blog           ║  Login        ║  [Subscribe to     ║
║                      ║                 ║  Apply Now    ║   Newsletter]      ║
╠══════════════════════════════════════════════════════════════════════════════╣
║  © 2026 [Institution Name]  |  Powered by Classgrid  |  Privacy  |  Terms  ║
╚══════════════════════════════════════════════════════════════════════════════╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIXED FLOATING ELEMENTS (always visible):
  RIGHT EDGE:  [Facebook] [Instagram] [YouTube] [LinkedIn] [WhatsApp]  (5 icons)
  BOTTOM RIGHT: [  APPLY NOW  ] (pulsing button, primary color)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔝 HEADER / NAVBAR

### Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│ TOP BAR (small, primary color bg):                                  │
│   📞 +91-XXXXXXXXXX  |  ✉ info@college.edu  |  📍 City, State      │
└─────────────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────────────┐
│ MAIN NAV (white bg, sticky):                                        │
│ [College Logo]  Home About Programs Notices Merit Fees Gallery      │
│                 Events Alumni Blog Contact    [Apply Now] [Login]   │
└─────────────────────────────────────────────────────────────────────┘
```

### Behavior
- **Transparent** when overlapping Hero video (top of page)
- **Solid white + drop shadow + blur** after scrolling 80px (glassmorphism)
- Logo: College logo (left) | Tiny "Powered by Classgrid" badge (right corner)
- Nav links: Smooth underline slide animation on hover
- **Apply Now** button: Primary color, hover scale(1.05) + shadow pop
- Mobile: Hamburger menu → full-screen slide-in drawer

---

## 🎬 HERO SECTION (All Org Types)

### Design
```
┌──────────────────────────────────────────────────────────────┐
│  FULL SCREEN VIDEO (looping, muted, 10–20 sec campus clip)  │
│  Dark gradient overlay (from bottom: 60% opacity)           │
│                                                              │
│         [College Name — fadeUp, 0.0s delay]                 │
│         [Tagline — fadeUp, 0.3s delay]                       │
│     [Apply Now Button]  [Explore Programs Button]            │
│      (fadeUp, 0.6s delay each)                              │
│                                                              │
│ ──────────────────────────────────────────────────────────── │
│ STATS STRIP (bottom of hero, semi-transparent dark bar):    │
│  🎓 5000+ Students | 🏆 95% Results | 📅 20+ Years          │
│  Counter animates 0 → number when page loads                │
└──────────────────────────────────────────────────────────────┘
```

### Org-Type Terminology in Stats Strip:
| Stat         | School              | Junior College         | Coaching              |
|-------------|---------------------|------------------------|-----------------------|
| Stat 1      | Students Enrolled   | Students Enrolled      | Students Enrolled     |
| Stat 2      | Board Pass %        | HSC Result %           | JEE/NEET Selections   |
| Stat 3      | Years of Excellence | Years of Excellence    | Years of Excellence   |
| Stat 4      | Teachers            | Faculty Members        | Expert Mentors        |

---

## 📄 PAGE-BY-PAGE DESIGN

---

### PAGE 1: HOME `/`
**Long-scroll page with 8 sections. All animate on scroll.**

#### Section 1.1 — Hero (see above)

#### Section 1.2 — Highlights / Achievements Strip
```
White background | 4 cards in a row (grid)
Each card: Large emoji/icon | Big Number (animated counter) | Label
Example: 🏆 | 98% | Board Results
On mobile: 2×2 grid
Animation: fadeUp stagger (each card 0.15s after previous)
```

#### Section 1.3 — Quick Programs Preview
```
Primary color background | Section heading: "Our [Classes/Streams/Batches]"
3 cards horizontally:
  Each card: Program name | Duration | Short description | "Know More →"
  Hover: card lifts (translateY -4px + shadow)
```
**School:** Classes (1–12) | **Junior:** Streams (Science/Commerce/Arts) | **Coaching:** Batches (JEE/NEET)

#### Section 1.4 — Admission CTA Banner
```
Full-width gradient banner (primary → primary_dark)
LEFT: "Admissions Open 2025–26" heading + subtext + Important Dates
RIGHT: Large "Apply Now" button (white color, primary text)
Subtle background pattern (dots or grid)
```

#### Section 1.5 — Notices / Announcements (LIKE MMCOE)
```
Split layout:
  LEFT (40%): "Latest Notices" heading | Description | "View All →" button
              College building image with primary color overlay
  RIGHT (60%): Scrolling list of latest 5 notices
               Each row: 📅 Date icon | Notice Title | [View] button
               Marquee/auto-scroll animation (smooth, pauseOnHover)
```

#### Section 1.6 — Faculty Showcase
```
"Meet Our [Teachers/Faculty/Mentors]" heading
Grid of 4 faculty cards (pulled from ERP faculty_profiles marked as Public):
  Each card: Photo | Name | Designation | Subject/Department
  Hover: slight scale + shadow
```

#### Section 1.7 — Gallery Preview
```
Masonry photo grid (6 photos)
"Campus Life @ [College Name]" heading
Hover: overlay with expand icon
"View Full Gallery →" button below
```

#### Section 1.8 — Testimonials (LIKE PCCOE)
```
"What Our [Students/Alumni] Say" heading
Horizontal auto-scrolling carousel (same as PCCOE style but modernized):
  Each card:
    TOP: Primary color gradient header (not random colors like PCCOE)
    Photo (circular, centered on top border)
    Stars (⭐⭐⭐⭐⭐)
    Name | Batch Year | Program
    Testimonial text (3 lines, expandable)
    Social icons (Facebook + LinkedIn)
Auto-scrolls left. Pauses on hover.
```

#### Section 1.9 — Admission Quick Form (Coaching + Junior Only)
```
Coaching + Junior College get an extra "Quick Enquiry" form on homepage:
  Name | Phone | Program Interested | [Submit]
  On Submit → creates lead in ERP admissions
School: Does NOT show this (parents walk in, not enquire online)
```

---

### PAGE 2: ABOUT `/about`

#### Layout
```
1. Hero banner (college building photo + "About Us" title overlay)
2. "Our Story" — Left image + Right text (split layout, image fades in from left)
3. Vision & Mission — 2 cards side by side (icon + heading + text)
4. Principal's Message — 
   Large photo LEFT | Name + Designation + Message RIGHT
   Quote marks (") decorative element
5. Accreditations strip — Logos of NAAC, AICTE, etc. (grayscale → color on hover)
6. Faculty Grid — Same as Section 1.6 but showing ALL public faculty (not just 4)
   Filter by Department (tabs)
```

**School specific:** Add "Our Vision for Holistic Education" section  
**Junior specific:** Add "Board Results & Toppers" section  
**Coaching specific:** Add "Our Methodology" section (how they teach differently)

---

### PAGE 3: PROGRAMS `/programs`

#### Layout
```
1. Hero banner: "Our [Classes/Streams/Batches]"
2. Grid of program cards:
   Each card:
     Icon (subject-specific emoji or SVG)
     Program Name (e.g. "Science Stream" / "JEE Foundation" / "Class 10")
     Duration
     Key Subjects (bullet list of 4)
     Available Seats / Intake
     [Know More] button → expands accordion below OR navigates to sub-page
3. Eligibility & Admission Process (simple 3-step visual)
4. "Apply Now" CTA banner
```

**School:** Organized by section (Primary / Secondary / Higher Secondary)  
**Junior College:** Science | Commerce | Arts (3 big cards as primary split)  
**Coaching:** Foundation | JEE Main | JEE Advanced | NEET (with batch timing)

---

### PAGE 4: NOTICES `/notices`

#### Layout
```
1. "Notice Board" heading + search bar + category filter (All / Exam / Holiday / General / Admission)
2. Timeline list:
   Each row: [Category Badge] [Date] — Notice Title — [View] [Download PDF?]
   Alternating subtle background on rows
   Newest on top
3. Pagination (10 per page)
```
*(Identical for all 3 org types)*

---

### PAGE 5: NOTICE DETAIL `/notices/[id]`
```
1. Breadcrumb: Home > Notices > [Title]
2. Category Badge + Date
3. Large Title (H1)
4. Rich Text body (from CMS)
5. PDF Attachment download button (if exists)
6. "← Back to Notices" button
7. Related Notices (3 cards at bottom)
```

---

### PAGE 6: MERIT LIST & RESULTS `/merit-list`

#### Layout
```
1. Hero: "Merit Lists & Results" + year filter dropdown
2. TOPPERS SHOWCASE (carousel):
   Each card: Student Photo | Name | Score/Marks | Program | "Batch of 20XX"
   Auto-scroll carousel (like PCCOE's testimonials but for toppers)
3. Published Merit Lists (table/cards):
   Each row: List Name | Program | Round | Date | [View PDF] [Download]
   Filter by Program
4. Overall Result Stats (animated counters):
   Pass % | Distinctions | First Class | Toppers Count
```

**School:** Board results (class 10 + 12 separately)  
**Junior:** HSC results with stream-wise breakdown  
**Coaching:** JEE/NEET selections + score ranges

---

### PAGE 7: FEES & INTAKE `/fees`

#### Layout
```
1. "Fee Structure & Admission" heading + academic year badge
2. Clean responsive table per program:
   | Program | Seats/Intake | Annual Fees | One-Time Fees | Total |
   Hover row highlight
3. Scholarship info (if any) — info card with 💰 icon
4. Rules & Policies section:
   Accordion list of admission rules, dress code, etc.
5. "Apply Now" CTA at bottom
```

**School:** Class-wise fee table (Class 1–12)  
**Junior:** Stream-wise (Science higher fees, Arts lower)  
**Coaching:** Batch-wise + installment plans (coaching shows installments prominently)

---

### PAGE 8: GALLERY `/gallery`

#### Layout
```
1. "Campus Life @ [Name]" heading
2. Category tabs: All | Campus | Events | Sports | Academics | Annual Day
3. Masonry photo grid (Pinterest-style)
   Hover: dark overlay + 🔍 expand icon
   Click: Lightbox opens (fullscreen with prev/next navigation)
4. Video Gallery tab:
   YouTube embed cards (from CMS youtube_link field)
   Video thumbnail with play button overlay
5. "View More" button (lazy loads more images from Supabase)
```
*(Identical for all 3 org types — just different photos)*

---

### PAGE 9: EVENTS `/events`

#### Layout
```
1. "Events & Activities" heading
2. FEATURED EVENT (if exists):
   Full-width card with large photo + countdown timer (Days:Hours:Minutes)
   "Register Now" or "Know More" CTA
3. UPCOMING EVENTS grid (3 columns):
   Each card: Event photo | Date badge (overlaid top-left) | Title | Venue | CTA
4. PAST EVENTS list (accordion or simple list):
   Title | Date | "View Photos →" (links to gallery filtered by event)
5. Category filter: Technical | Cultural | Sports | Academic | Annual
```

**School:** Annual Day, Sports Day, Science Fair  
**Junior:** Fresher Party, Farewell, Sports, Cultural Fest  
**Coaching:** Motivational seminars, Mock test series launch events

---

### PAGE 10: EVENT DETAIL `/events/[slug]`
```
1. Large hero image for the event
2. Event title (H1) + Date + Time + Venue
3. Rich Text description (from CMS)
4. Mini photo gallery (grid of 6–12 event photos)
5. Registration form OR "Event Completed" badge
6. Share buttons (WhatsApp, Facebook, LinkedIn)
7. Related Events (3 cards)
```

---

### PAGE 11: ALUMNI `/alumni`

#### Layout
```
1. "Our Alumni — Their Success, Our Pride" heading
2. FEATURED ALUMNI carousel (prominent cards):
   Each card: Large Photo | Name | Batch Year | Current Company/College | City
   LinkedIn icon (links to their profile)
3. ALUMNI GRID (smaller cards, all alumni):
   Search by batch year | Filter by program
4. SUCCESS STORIES section:
   3 large cards with quote format:
   Photo | Testimonial quote | Name | Batch | Achievement
5. ALUMNI CONNECT form:
   "Are you our alumnus? Register with us!"
   Name | Email | Batch Year | Current Role | LinkedIn | [Submit]
```

**Coaching specific:** Add "Our Selections" counter → X students selected in IIT | Y in NIT | Z in MBBS  
**Junior specific:** Add "Our HSC Toppers" prominent showcase  
**School:** Simpler alumni grid (name + current college they joined)

---

### PAGE 12: BLOG `/blog`

#### Layout
```
1. "News & Updates" heading + search bar
2. Featured article (full-width card)
3. Articles grid (3 columns):
   Each card: Thumbnail image | Category badge | Title | 2-line description
              Author + Date | "Read More →"
   Hover: image zoom + shadow
4. Category filter (sidebar or tabs): News | Academic | Events | Tips
5. Pagination
```

---

### PAGE 13: BLOG POST `/blog/[slug]`
```
1. Breadcrumb + Category + Date
2. Title (H1, large)
3. Featured image (full-width, rounded)
4. Author card (small: photo + name + role)
5. Rich Text body (TipTap / Editor.js output rendered)
6. Share bar (sticky on left: WhatsApp, Facebook, LinkedIn, Twitter/X)
7. Related articles (3 cards)
8. Comment CTA ("Have a question? Contact Us")
```

---

### PAGE 14: CONTACT `/contact`

#### Layout
```
1. "Contact Us" heading
2. 3-column info cards:
   📍 Address   |   📞 Phone / WhatsApp   |   ✉ Email
3. Google Maps embed (full width, 400px height)
4. Quick Inquiry Form:
   Name | Phone | Email | Subject | Message | [Send Message]
   On Submit → email notification to college admin
5. Office Hours card (Monday–Saturday: 9AM–5PM)
6. Social media links
```

---

### PAGE 15: APPLY `/apply`

#### Layout
```
1. "Apply for Admissions 2025–26" heading
2. Progress stepper: Step 1: Basic Info → Step 2: Academic Info → Step 3: Submit
3. STEP 1 fields: Full Name | DOB | Gender | Phone | Email | Address
4. STEP 2 fields: Program Interested | Previous School/College | Percentage/Marks
5. STEP 3: Review summary + Submit
6. On Submit:
   → Creates admission lead in ERP (admission.controller.js)
   → Shows confirmation screen: "Application Received! 
      Application ID: CG-XXXX | Our team will contact you within 24 hours"
   → Sends confirmation SMS/email to applicant
```

**School specific:** Add Class Interested (Class 1–12 dropdown)  
**Junior specific:** Add Stream Preference (Science/Commerce/Arts) + HSC/SSC marks  
**Coaching specific:** Add Batch Preference + Previous Exam scores (JEE/NEET attempt)

---

## 🦶 FOOTER (All Org Types)

### Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│ GOOGLE MAPS (full width, 350px height, above footer)                │
├──────────────────┬──────────────────┬──────────────┬───────────────┤
│ COL 1:           │ COL 2:           │ COL 3:       │ COL 4:        │
│ Institution Info │ Academics        │ Quick Links  │ Connect       │
│ ──────────────── │ ──────────────── │ ──────────── │ ──────────────│
│ [College Logo]   │ Programs         │ Notices      │ Facebook      │
│ Address          │ Faculty          │ Merit List   │ Instagram     │
│ Phone            │ Gallery          │ Admissions   │ YouTube       │
│ Email            │ Events           │ Fees         │ LinkedIn      │
│ WhatsApp link    │ Alumni           │ Contact      │               │
│                  │ Blog             │ Login        │ [Newsletter   │
│                  │                  │ Apply Now    │  Subscribe]   │
├──────────────────┴──────────────────┴──────────────┴───────────────┤
│ BOTTOM STRIP (primary color background):                            │
│ © 2026 [Institution Name] | Powered by Classgrid                   │
│ Privacy Policy | Terms of Use                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### Footer Animations
- Each column **fadeUp** with stagger (0.1s each) when scrolled into view
- Social icons: **hover scale(1.2) + color transition**
- "Powered by Classgrid" link → opens classgrid.in in new tab

---

## 📱 MOBILE RESPONSIVENESS

| Element          | Desktop              | Mobile                        |
|-----------------|----------------------|-------------------------------|
| Header          | Full horizontal nav  | Hamburger → Slide-in drawer   |
| Hero            | Full-screen video    | Fallback image (no video autoplay) |
| Stats strip     | 4 in a row           | 2×2 grid                      |
| Programs grid   | 3 columns            | 1 column (stacked cards)      |
| Faculty grid    | 4 columns            | 2 columns                     |
| Footer          | 4 columns            | 2 columns → 1 column          |
| Floating FAB    | Bottom right         | Bottom center                 |

---

## 🔀 ORG-TYPE DIFFERENCES SUMMARY

| Section              | School 🏫         | Junior College 🎓   | Coaching 📚         |
|---------------------|-------------------|---------------------|---------------------|
| Hero Tagline        | "Nurturing Young Minds Since [Year]" | "Your Gateway to Higher Education" | "Where Toppers Are Made" |
| Programs label      | Classes           | Streams             | Batches             |
| Stat 2              | Board Pass %      | HSC Result %        | IIT/NEET Selections |
| Faculty label       | Teachers          | Faculty Members     | Expert Mentors      |
| Homepage extra form | ❌ No             | ✅ Quick Enquiry    | ✅ Quick Enquiry    |
| Merit List focus    | Board results     | HSC toppers         | JEE/NEET ranks      |
| Alumni section      | Simple grid       | Toppers in college  | IIT/NIT/MBBS list   |
| Fees table          | Class-wise        | Stream-wise         | Batch + Installments|
| Apply form Step 2   | Class of interest | Stream + 10th marks | Exam scores         |

---

## 🗄️ DATA FLOW (Where data comes from)
| Page/Section        | Data Source                                |
|--------------------|--------------------------------------------|
| All content        | `org_website_content` MongoDB collection   |
| Faculty Grid       | ERP `User` model (role: faculty, isPublic: true) |
| Events             | ERP events (filtered: isPublic: true)      |
| Notices            | ERP announcements (filtered: isPublic: true)|
| Gallery            | Supabase Storage URLs (images only)        |
| Hero Video         | Supabase Storage URL (short loop, max 20MB)|
| Blog posts         | `org_website_content.blog[]`               |
| Apply form         | → POST `admission.controller.js` lead      |
| Merit Lists        | Supabase PDF URLs                          |
| Alumni             | `org_website_content.alumni[]`             |
| Testimonials       | `org_website_content.testimonials[]`       |
| Videos (Gallery)   | YouTube embed URLs ONLY (no S3 video)      |

---

## 🏛️ NEW: GOVERNANCE & MANDATORY PAGES
*(Required for School & Junior College compliance with NAAC/Boards)*

### PAGE 16: MANDATORY DISCLOSURES `/mandatory-disclosure`
- Trust / Society details
- Affiliation details (Board/University, code)
- Infrastructure summary
- Staff summary
- PDFs upload grid (Mandatory documents grid)

### PAGE 17: COMMITTEES `/committees`
- List of committees (Grievance Redressal, Anti-Ragging, ICC, SC/ST)
- For each: Name, mandate, and table of members (Role, Name, Contact)

### PAGE 18: INFRASTRUCTURE `/infrastructure`
- Tabs for Categories (Labs, Library, Transport, Safety, Classrooms)
- For each category: Description + Photo gallery

---

## 📚 NEW: ACADEMIC PAGES

### PAGE 19: ACADEMIC CALENDAR `/academic-calendar`
- Year-wise timeline of events, exam schedules, and holidays.
- Viewable table & downloadable PDF.

### PAGE 20: SYLLABUS `/syllabus`
- Organized by Class (School), Stream (Junior College), or Batch (Coaching).
- Topic breakdowns and download syllabus PDFs.

### PAGE 21: EXAMINATIONS `/examinations`
- Breakdown of internal tests, unit tests, and semester evaluation patterns.

---

## 👨‍🎓 NEW: STUDENT-CENTRIC PAGES

### PAGE 22: STUDENT CORNER `/students`
- Fast-links hub for enrolled students (acts as a mini-dashboard before they login to ERP).
- Links: Timetable, Notices, Results, Downloads, Forms.

### PAGE 23: DOWNLOADS `/downloads`
- Centralized resource hub.
- Filterable table: Admission forms, prospectus, fee circulars, exam timetables.

---

## ⚙️ PLATFORM-LEVEL ENHANCEMENTS (V2.1)
- **Global Search:** Search bar to query Notices, Events, Blogs, Programs, and Faculty.
- **Accessibility:** A+/A- font size controls, high-contrast toggle.
- **SEO Layer:** Dynamic meta titles, Schema.org for Education, OpenGraph.
- **Error Pages:** Custom branded 404, 500 Maintenance, and Offline pages.

---

## ✅ FINAL STATUS: BLUEPRINT V2.1 LOCKED & READY TO BUILD
