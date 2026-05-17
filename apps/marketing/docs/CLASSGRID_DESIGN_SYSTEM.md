# Classgrid Design System & UX Blueprint
**Purpose:** Technical design system specification for the Classgrid marketing site (`classgrid.in`).

---

## 1. Header & Navigation (The Morphing Experience)
The header is the most sophisticated component of the Classgrid design system, characterized by fluid transitions and a clean technical aesthetic.

### Navigation Mechanism
- Engine: Radix UI Navigation Menu primitives.
- Animations: Framer Motion shared layout transitions. Switching between `Modules`, `Institutions`, and `Platform` morphs the same dropdown container instead of unmounting/remounting.
- Glassmorphism: `backdrop-filter: blur(12px)` with `rgba(0,0,0,0.8)` background in dark mode.

### Dropdown Layouts
- Modules: AI Tools, Core Platform, Security.
- Institutions: Engineering, School, Coaching with adaptive capabilities.
- Platform: Docs, Blog, Changelog, Support, Status, Company links.

---

## 2. Hero Section & Branding
The hero uses industrial minimalism to communicate infrastructure-level trust.

- Typography: Geist Sans or Inter for headings, Geist Sans or DM Sans for body.
- Visual system:
  - Perspective grid background for scale depth.
  - Subtle radial highlights in `#4a90f5` and `#8b6fff`.
  - Optional Spline 3D element.
- Sticky/live counters above the fold: institutions, attendance/exams, uptime style metrics.

---

## 3. Demo Page (Lead Conversion Design)
The demo request route (`/demo`) is a strict conversion layout.

- Desktop split:
  - Left: value proof, ROI statements, trust bullets.
  - Right: focused form with minimal fields.
- Form visual constraints:
  - Surface: `#0A0A0A`
  - Focus borders: white/high contrast
- Trust strip below fold: institutions/social proof tokens.
- Full header remains visible for low-friction return navigation.

---

## 4. Footer & Bottom Utility Bar
The footer is an information-dense system map for module discoverability.

### Structure
- Tier 1: Utility grid of capability links.
- Tier 2: Categorized directory columns:
  - Platforms
  - Modules
  - Use Cases
  - Company
  - Community

### Utility Elements
- NEW badges for current launches (AI Viva, Biometric Login).
- Live status indicator: `All systems operational`.
- 3-way theme control: System / Light / Dark with persistence.

---

## 5. Design Foundation (Tokens)

### Colors (Dark Mode Default)
- Background: `#000000`
- Surface: `#0A0A0A`
- Border: `#333333`
- Primary Text: `#FFFFFF`
- Secondary Text: `#888888`
- Accent Blue: `#4a90f5`
- Gradient: `135deg, #4a90f5 -> #8b6fff`
- Admin Gold: `#f59e0b`

### Typography
- Headings: Geist Sans or Inter fallback.
- Body: Geist Sans or DM Sans fallback.

### Motion
- Reveal: fade-in + slide-up (20-40px drift).
- Hover: subtle glow/invert border transitions.
- Motion behavior: intentional, never distracting.

---

## 6. Application Patterns for Marketing Pages
1. Identity path selector in header with adaptive institution content.
2. Information-dense footer to showcase breadth of Classgrid capabilities.
3. Live status at footer utility level to reinforce trust.
4. High-contrast dark hierarchy for legal/trust pages.
5. Treat the website as system interface, not brochure pages.

---
**Report updated on:** 2026-04-12  
**Author:** Nikhil + Antigravity AI
