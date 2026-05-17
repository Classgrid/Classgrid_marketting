# Classgrid Blog Design Specification: The Green Scholarly Archive

## 1. Core Philosophy & Design North Star
**Theme:** "The Digital Curator" (The Scholarly Archive Variant)
The blog must feel like a premium, editorial piece of literature. It rejects the "dashboard-clutter" look in favor of extreme whitespace, intentional asymmetry, and tonal depth.

### The "No-Line" Rule
*   **Zero 1px Borders:** No hard lines should be used for sectioning or card definition.
*   **Tonal Transitions:** Separation is achieved by shifting between background levels:
    *   **Level 0 (Main Canvas):** `background` (#000000 Dark / #ffffff Light)
    *   **Level 1 (Sections/Feature):** `surface-container-low` (#0a0a0a Dark / #f8f9fa Light)
    *   **Level 2 (Interactive Cards):** `surface-container-lowest` (#111111 Dark / #ffffff Light)

## 2. Color System: The Emerald Grading
Directly mapped from the Classgrid Marketing Home Page.

*   **Primary Accent:** Emerald Green (#34d399).
*   **Secondary Accents:** Neon Pink (#ff0080) and Cyan/Teal (#00dfd8) for micro-interactions.
*   **Signature Gradient:** `Emerald (#34d399)` to `Cyan (#00dfd8)` at 135°.
*   **Progress Indicator:** Fixed 2px rail at the top using the `Emerald to Pink` gradient.

## 3. Typography & Hierarchy
*   **Font Family:** Inter (Display for headlines, Body for reading).
*   **Headline Authority:** Display-LG (3.5rem) headers with `-0.02em` tracking.
*   **Asymmetry:** Headlines should be left-aligned with significant right-side negative space to create editorial rhythm.
*   **Reading Experience:** Body text line-height at 1.6 with generous margins.

## 4. Components & Motion
*   **Shadcn Strictly Only:** Use existing components from `client/src/components/shadcn/` (button, card, badge, avatar, skeleton, etc.).
*   **Animations:** Use **Framer Motion** for smooth entrances. 
    *   Featured post should use a subtle `fadeUp` entrance.
    *   Hover states: 0.98 scale transform with an Emerald outer glow (#10b981 @ 30% opacity).
*   **Smooth Scroll:** Implementation via **Lenis** (already in tech stack).

## 5. Implementation Strategy
*   **Listing Page (`/blog`):** 
    *   Featured Hero Article (Top).
    *   Editorial Asymmetric Grid (Bottom).
    *   Category Filtering (Optional, Emerald Pills).
*   **Post Page (`/blog/[slug]`):**
    *   Clean centered reading column.
    *   Reading progress rail (Top).
    *   Rich text rendering via PortableText.

---
**Status:** Design Blueprint Locked. Ready for implementation.---------------- BLOG PAGE (CONTENT ONLY) ----------------

NOTE:
- Header and Footer already exist → DO NOT include
- Focus only on blog page content

----------------------------------------------------------

------------------- BLOG HERO ----------------------------
| Badge: 📝 Blog / Insights                             |
|                                                       |
| HEADLINE:                                             |
| Insights for Smarter Education Systems                |
|                                                       |
| SUBTEXT:                                              |
| Explore updates, ideas, and deep dives into           |
| modern education technology and ClassGrid             |
|                                                       |
| [ Search articles... ]   [ Filter ▼ ]                 |
----------------------------------------------------------

---------------- FILTER + CATEGORY BAR -------------------
| SORT: [ Latest ▼ ]   [ Month ▼ ]                      |
|                                                       |
| CATEGORY TABS (horizontal):                          |
| [ All ] [ Education ] [ Software ] [ App Updates ]    |
| [ Academic ] [ AI ] [ ERP ]                           |
----------------------------------------------------------

---------------- FEATURED BLOG ---------------------------
| [ LARGE COVER IMAGE ]                                |
|                                                      |
| TAG: Featured                                        |
|                                                      |
| TITLE (large)                                        |
| DESCRIPTION (2–3 lines)                              |
|                                                      |
| AUTHOR • DATE                                        |
|                                                      |
| [ Read Article → ]                                   |
----------------------------------------------------------

---------------- BLOG GRID -------------------------------
| 3 COLUMN RESPONSIVE GRID                             |
|                                                      |
| [Card]   [Card]   [Card]                             |
| [Card]   [Card]   [Card]                             |
----------------------------------------------------------

---------------- BLOG CARD -------------------------------
| [ Image ]                                            |
|                                                      |
| TAG (category badge)                                 |
| TITLE                                                |
| SHORT DESCRIPTION (2 lines max)                      |
|                                                      |
| 📅 Date                                              |
|                                                      |
| [ Read More → ]                                      |
----------------------------------------------------------

---------------- INTERACTIONS ----------------------------
| Hover Effects:                                       |
| - Scale card slightly (1.02)                         |
| - Increase shadow                                    |
| - Subtle image zoom                                  |
----------------------------------------------------------

---------------- PAGINATION ------------------------------
|                [ Load More ]                          |
----------------------------------------------------------

---------------- EMPTY STATE -----------------------------
| No blogs found                                       |
| Try changing filters                                 |
----------------------------------------------------------

---------------- DESIGN RULES ----------------------------

STYLE:
- Premium SaaS UI (Vercel / Notion style)
- Clean, minimal, high spacing
- Rounded cards + soft shadows

THEME:
- Must support BOTH:
  → Dark mode (#000000 background)
  → Light mode

TECH:
- Next.js + Tailwind
- shadcn components ONLY

ALLOWED COMPONENTS:
button, input, label, card, form, toast, dialog, alert,
checkbox, radio-group, select, separator, tabs, badge,
avatar, dropdown-menu, sheet, skeleton, switch, textarea

STRICT RULES:
- DO NOT create new components
- DO NOT redesign structure
- DO NOT use external UI libraries
- DO NOT use @base-ui/react
- DO NOT use useRender or mergeProps
- DO NOT add random Tailwind styles

IF ANY COMPONENT IS MISSING:
→ STOP and say:
"Component [name] not found. Please install it first."

ANIMATION:
- Framer Motion (hover + fade-in)
- Light GSAP (Lenis scroll only)

CMS:
- Sanity CMS (title, image, content, category, date, author)

----------------------------------------------------------

OUTPUT:
Generate production-ready blog page UI strictly following this structure.


{
  "projectId": "1798702199026779475",
  "prompt": "Create the final production-ready Blog Design blueprint by combining these two sources:\n\n1. STRUCTURE (From User Wireframe):\n- Top Hero: Badge '📝 Blog / Insights', Headline 'Insights for Smarter Education Systems', Subtext, [Search] [Filter].\n- Filter Section: 'Latest' and 'Month' dropdowns + Horizontal Tabs [All, Education, Software, App Updates, Academic, AI, ERP].\n- Featured Section: Large full-width card with image, 'Featured' tag, Large Title, 2-line Description, Author/Date, and [Read Article →].\n- Grid Section: 3-column responsive grid of Cards with [Image, Category Badge, Title, 2-line max Description, Date, Read More →].\n- Pagination: [Load More] button at the bottom.\n\n2. AESTHETIC (From Stitch 'Scholarly Archive'):\n- Use Primary EMERALD GREEN (#34d399) from the homepage.\n- No borders! Use Tonal Shifts (#0a0a0a surfaces on #000000 background).\n- Asymmetric, aggressive whitespace.\n- 3.5rem Display headlines.\n- Premium SaaS 'Vercel/Linear' feel.\n\n3. COMPONENT RULES:\n- Use visual styles matching shadcn: button, input, select, tabs, badge, card.\n- Support both Dark and Light modes."
}
Running.
