# Case Study Detail Page — Plan

## Wireframe

```
 CASE STUDY DETAIL PAGE
 ============================================================

 [1] HERO — full width image with text overlaid
 ------------------------------------------------------------
 |                                                          |
 |  [ green badge: ENGINEERING - FEE RECOVERY - 2024 ]     |
 |                                                          |
 |    BIG BOLD TITLE:                                       |
 |    Rs.12L recovered in one semester                      |
 |    with zero manual follow-ups                           |
 |                                                          |
 |    PCCOE, Pune  (grey text)                              |
 |                                                          |
 |   (dark gradient overlay on image, text at bottom-left) |
 ------------------------------------------------------------

 [2] META SIDEBAR + 3 STATS — two columns
 ----------------------- | ----------------------------------
 | Client:  PCCOE       | |  Rs.12L   |  100%  |  45 Days  |
 | Year:    2024        | |  -------  | ------  | --------  |
 | Type:    Engineering | | Recovered | On-Time |  Deployed |
 | Modules:            | |           |         |           |
 |  - Finance          | |  (emerald green numbers)         |
 |  - Attendance       | |                                  |
 |  - Reports          | |                                  |
 ----------------------- | ----------------------------------
 (sticky left card)          (3 big stat boxes, right side)

 [3] STORYBLOCK 1 — image LEFT, text RIGHT
 ----------------------- | ----------------------------------
 |                      | |  01 -- The Challenge           |
 |   [ PHOTO ]          | |                                |
 |   4:3 ratio          | |  Body paragraph text goes      |
 |                      | |  here describing the problem   |
 |   slides in from     | |  before Classgrid...           |
 |   LEFT on scroll     | |                                |
 |                      | |  slides in from RIGHT          |
 ----------------------- | ----------------------------------

 [4] STORYBLOCK 2 — text LEFT, image RIGHT (REVERSED)
 ----------------------- | ----------------------------------
 |  02 -- The Solution  | |                                |
 |                      | |   [ PHOTO ]                    |
 |  Body paragraph text | |   4:3 ratio                    |
 |  here describing how | |                                |
 |  Classgrid was used  | |   slides in from               |
 |                      | |   RIGHT on scroll              |
 |  slides in from LEFT | |                                |
 ----------------------- | ----------------------------------

 [5] STORYBLOCK 3 — image LEFT, text RIGHT
 ----------------------- | ----------------------------------
 |                      | |  03 -- The Outcome             |
 |   [ PHOTO ]          | |                                |
 |   4:3 ratio          | |  Body paragraph text goes      |
 |                      | |  here showing what changed     |
 |   slides in from     | |  after going live...           |
 |   LEFT on scroll     | |                                |
 |                      | |  slides in from RIGHT          |
 ----------------------- | ----------------------------------

 [6] CHAMPION QUOTE — dark background
 ------------------------------------------------------------
 |                                                          |
 |  " The best quote from the champion person goes here,   |
 |    written in large italic serif font, centered "        |
 |                                                          |
 |              [ headshot photo ]                          |
 |              Rahul Sharma                                |
 |              HOD Finance - PCCOE, Pune                   |
 |                                                          |
 ------------------------------------------------------------

 [7] PROOF GALLERY — 3 column grid
 ------------------------------------------------------------
 | [ img 1 ]  |  [ img 2 ]  |  [ img 3 ]                  |
 |            |             |                              |
 | [ img 4 - wide          ]|  [ img 5 ]                  |
 |            |             |                              |
 ------------------------------------------------------------
 (click image to open fullscreen lightbox)

 [8] MODULES STRIP
 ------------------------------------------------------------
 | Modules Used In This Deployment:                        |
 | [ Finance ] [ Attendance ] [ Reports ] [ Compliance ]   |
 ------------------------------------------------------------

 [9] NEXT CASE STUDY TEASER
 ------------------------------------------------------------
 | [ thumb ] |  Title of Next Case Study             ->   |
 |           |  Client Name - Category                    |
 ------------------------------------------------------------

 ============================================================
 END OF PAGE
```


## Page Layout (Top to Bottom)


### SECTION 1 — Immersive Hero
- Full-width image (16:9 aspect ratio)
- Dark gradient overlay from bottom
- Text overlaid BOTTOM-LEFT of the image:
  - Green pill badge: ENGINEERING · FEE RECOVERY · 2024
  - Giant bold white title: the case study headline
  - Grey client name: PCCOE, Pune

---

### SECTION 2 — Meta Info + Key Stats (two columns)

**Left column — sticky info card:**
- Client Name
- Year
- Institution Type
- Modules Used (list)

**Right column — 3 big stat boxes:**
- Stat 1: Big green number + label (e.g. 12L / Recovered)
- Stat 2: Big green number + label (e.g. 100% / On-Time)
- Stat 3: Big green number + label (e.g. 45 Days / Deployed)

---

### SECTION 3 — StoryBlock 1
- Image on LEFT (4:3 ratio) — slides in from left on scroll
- Text on RIGHT:
  - Number: 01
  - Heading: The Challenge
  - Body paragraph
- Framer Motion animation

---

### SECTION 4 — StoryBlock 2 (reversed)
- Text on LEFT:
  - Number: 02
  - Heading: The Solution
  - Body paragraph
- Image on RIGHT (4:3 ratio) — slides in from right
- Framer Motion animation

---

### SECTION 5 — StoryBlock 3
- Image on LEFT (4:3 ratio) — slides in from left
- Text on RIGHT:
  - Number: 03
  - Heading: The Outcome
  - Body paragraph
- Framer Motion animation

---

### SECTION 6 — Champion Quote
- Full-width section with dark background
- Large italic serif quote centered on page
- Small circular headshot photo below the quote
- Name, Role, Institution in small grey text beneath headshot

---

### SECTION 7 — Proof Gallery
- 3-column photo grid
- Images fetched from galleryImages field in Sanity
- Click image to open lightbox/fullscreen

---

### SECTION 8 — Modules Strip
- Label: "Modules Used in This Deployment"
- Horizontal row of pill badges
- Example: Finance · Attendance · Reports · Compliance
- Each pill has a small icon

---

### SECTION 9 — Next Case Study Teaser
- Wide horizontal card
- Thumbnail image on the left
- Title + client name in the center
- Arrow on the right
- Clicking goes to the next published case study

---

## Sanity Fields Used

| Section | Sanity Fields |
|---------|--------------|
| Hero | heroImage, title, clientName, category, institutionType, year |
| Meta + Stats | clientName, year, institutionType, modules, metrics (3 items) |
| StoryBlock 1, 2, 3 | body (Portable Text with embedded images) |
| Champion Quote | championQuote, championName, championRole, championHeadshot |
| Gallery | galleryImages array |
| Modules Strip | modules array |
| Next Teaser | Next document fetched from Sanity by date |

---

## Files to Create or Modify

| File | Action |
|------|--------|
| app/case-studies/[slug]/page.tsx | MODIFY — add data fetch + render |
| components/case-studies/CaseStudyDetail.tsx | CREATE — assembles all sections |
| components/case-studies/StoryBlock.tsx | CREATE — alternating image/text block |
| components/case-studies/ChampionQuote.tsx | CREATE — quote + headshot section |

---

## Status
- [ ] Awaiting approval from user
- [ ] Build CaseStudyDetail component
- [ ] Build StoryBlock component
- [ ] Build ChampionQuote component
- [ ] Update [slug]/page.tsx with data fetch
- [ ] Update GROQ query to fetch all detail fields
