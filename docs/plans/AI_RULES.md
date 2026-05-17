# AI SYSTEM PROMPT & DEVELOPMENT GUIDELINES

> **ATTENTION ALL AI ASSISTANTS (Current & Future):**
> When working on the Classgrid Marketing Platform (`classgrid_marketting`), you MUST strictly adhere to the following rules at all times. These are non-negotiable and designed to maintain a premium, consistent, and flawless user experience.

---
## 🚨 0. CRITICAL: NO TERMINAL SEARCHING ALLOWED
**TERMINAL IS STRICTLY PROHIBITED TO SEARCH FOR SPECIFIC PARTS.**
Do **NOT** use `grep`, `find`, or run terminal bash scripts to search through code. This causes severe local freezing. 
**Instead:** You MUST use your native folder/file reading tools (`list_dir`, `view_file`) exclusively to navigate and search the project.

---

## 1. 🎨 STRICT COLOR SYSTEM (No Custom Colors)
**NEVER use hardcoded colors.** The platform must flawlessly support both **Dark Mode** and **Light Mode** automatically via CSS variables.

### ✅ ALLOWED (Semantic Tailwind Tokens ONLY):
- **Backgrounds:** `bg-background` (main), `bg-card` (cards), `bg-muted` (subtle containers), `bg-surface-container-low` etc.
- **Text:** `text-foreground` (main), `text-muted-foreground` (secondary/helper).
- **Borders:** `border-border`.
- **Brand Color (Green):** ONLY use `emerald-500` (e.g., `bg-emerald-500`, `text-emerald-500`, `border-emerald-500`, `hover:bg-emerald-500/10`).

### ❌ FORBIDDEN:
- **NO hardcoded hex or RGB:** `#0A0A0A`, `#FFFFFF`, `#111111`, etc.
- **NO arbitrary tailwind colors:** `text-white`, `text-black`, `bg-slate-900`, `text-gray-400`.
- **NO `dark:` prefixes:** If you are using a `dark:` prefix, you are doing it wrong. Let the sematic tokens (`bg-background`) handle the switch naturally.
- **NO inline styles for colors:** `style={{ color: '...' }}`.

---

## 2. 🧩 STRICT COMPONENT USAGE (shadcn/ui ONLY)
**NEVER build complex UI elements from raw HTML elements if a shadcn component exists.**

### ✅ ALLOWED:
- Always use the provided `@/components/ui/*` elements first.
- **Buttons:** `<Button>`
- **Inputs/Forms:** `<Input>`, `<Select>`, `<Textarea>`
- **Labels/Tags:** `<Badge>`
- **Containers:** `<Card>`, `<CardContent>`, `<CardHeader>`
- **Dialogs/Modals:** `<Dialog>`
- **Tabs/Accordions:** `<Tabs>`, `<Accordion>`

### ❌ FORBIDDEN:
- Do NOT build custom buttons or dropdowns from scratch using `<div>` and raw Tailwind.
- Do NOT introduce third-party component libraries (Material UI, Chakra, etc.).
- Do NOT rewrite or duplicate existing UI logic.

---

## 3. 📐 NO BLANK SPACE ISSUES (Layout & Spacing)
Pages must never feel empty, disconnected, or poorly aligned.

- **Navbar Clearance:** The first section of every page MUST have top padding (e.g., `pt-20` or `pt-24`) so content isn't hidden behind the fixed navbar.
- **Section Spacing:** Main sections must have consistent vertical padding (e.g., `py-16` or `py-24`).
- **Responsive Grids:** Always use CSS grid for card layouts (e.g., `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`). Never leave a single, massive column on desktop.
- **Container Constraints:** Wrap main content inside a constrained max-width container (e.g., `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`).
- **Images:** 
  - Use `object-contain` for content images to prevent clipping/cutting.
  - Use `object-cover` ONLY for background decorations.
  - Give image containers a neutral background (e.g., `bg-muted` or `bg-surface-container-low`) so they look grounded even if the image is transparent.

---

## 4. 📋 COMPREHENSIVE PAGE CREATION (Think Ahead!)
When asked to create or update a marketing page, **always implement a complete, professional flow.** Do not just drop text on a screen. 

Every standard page MUST include structurally:
1. **Hero Section:** High-impact headline, sub-headline, and a clear Call to Action (CTA) Button.
2. **Value Proposition / Features Section:** A clean 3-column grid highlighting key benefits or features.
3. **Social Proof:** E.g., Testimonials, partner logos, or statistics.
4. **FAQ Section:** Use the shadcn `<Accordion>` component to answer common questions related to the page.
5. **Final CTA Footer:** A closing section encouraging the user to "Book a Demo" or "Talk to Sales".

*If the user just asks for a "Pricing Page", build the ENTIRE professional experience (Pricing tiers, feature comparison table, FAQs, and bottom CTA) out of the box.*

---

## 5. 🛠️ GENERAL BEST PRACTICES
- **Icons:** Use ONLY `lucide-react`. Never use raw platform emojis (like ❤ or 👁). Example: `<Heart className="text-emerald-500" />`.
- **Dynamic Routes (Next.js 15):** Always `await params` in `page.tsx` and `generateMetadata`. Example: `const { slug } = await params;`.
- **Quality Assurance:** Before finishing your turn, imagine the page in both Light and Dark modes. If something will disappear or look bad, fix it proactively.

---

## 6. 🌩️ HOSTING ENVIRONMENT (EC2 ONLY)
**The application is explicitly designed to be self-hosted on AWS EC2 alongside Discourse.** 
- **NO VERCEL:** Do NOT create `vercel.json` files, reference Vercel cron jobs, or assume Vercel deployment.
- **CRON JOBS:** Any scheduled tasks must be handled via the Linux crontab configured in `ec2-setup.sh`.
- Do not attempt to migrate or optimize the platform for Vercel, Netlify, or similar serverless platforms.
