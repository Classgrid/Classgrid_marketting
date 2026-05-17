# Sanity CMS Setup Guide

This guide explains how to populate your Sanity CMS with content for all marketing pages.

## Quick Setup

1. **Login to Sanity Studio**
   ```
   cd apps/marketing
   npm run dev
   # Visit http://localhost:3000/studio
   ```

2. **Create Documents** - Use the Sanity Studio UI to create instances of each page type below

---

## Page Types & Content Structure

### 🏠 Landing Pages (Top Priority)

#### 1. **Home Page** (`homePage`)
- **Document ID:** `homePage`
- **Fields:** title, subtitle
- **Purpose:** Hero section with headline & CTA
- **Example Content:**
  - Title: "The Operating System for Modern Education"
  - Subtitle: "Stop juggling ten different apps..."

#### 2. **About Page** (`aboutPage`)
- **Document ID:** `about`
- **Fields:** headline, body, mission, vision, teamImage, seo
- **Purpose:** Company story & values

#### 3. **Features Page** (`featuresPage`)
- **Document ID:** `features`
- **Fields:** headline, features[], coreModules[], seo
- **Purpose:** Deep dive into product capabilities
- **Create Nested Data:**
  - Real-time Communication (with icon)
  - Academic Timetable (with icon)
  - Result & Examination Engine (with icon)
  - Fee Management (with icon)

#### 4. **Pricing Page** (`pricingPage`)
- **Document ID:** `pricing`
- **Fields:** headline, plans[], faq[], seo
- **Purpose:** Show subscription tiers
- **Plans to Create:**
  1. Coaching Class Plan
  2. Standard School Plan
  3. College / University Plan

#### 5. **Tour / How It Works** (`tourPage`)
- **Document ID:** `tour`
- **Fields:** headline, steps[], videoUrl, seo
- **Purpose:** Walkthrough of platform
- **Steps:**
  1. Provision Your Domain
  2. Onboard Your Roster
  3. Automate Operations

#### 6. **Demo Page** (`demoPage`)
- **Document ID:** `demo`
- **Fields:** headline, subheadline, benefits, formFields, ctaButton, successMessage, seo
- **Purpose:** Form to create instant org portal
- **CRITICAL:** Links to your backend signup API

#### 7. **Integrations Page** (`integrationsPage`)
- **Document ID:** `integrations`
- **Fields:** headline, integrations[], apiDocumentation, seo
- **Purpose:** Show partnerships
- **Create Integrations:**
  - Zoom & Google Meet
  - Google Drive & Docs
  - Supabase & MongoDB
  - Vercel Edge Network
  - Razorpay
  - Firebase

#### 8. **Use Cases** (`useCasePage`)
- **CREATE 3 DOCUMENTS:**
  1. **For Students** - slug: `students`
     - Headline: "Your entire academic life in your pocket"
     - Benefits: assignments, chat, grades
  
  2. **For Teachers** - slug: `teachers`
     - Headline: "Reclaim your weekends"
     - Benefits: automated grading, attendance
  
  3. **For Institutes** - slug: `institutes`
     - Headline: "Total operational oversight"
     - Benefits: fee tracking, faculty performance

#### 9. **Support Page** (`supportPage`)
- **Document ID:** `support`
- **Fields:** headline, supportChannels[], knowledgeBaseUrl, seo
- **Purpose:** Help center entry point

#### 10. **Contact Page** (`contactPage`)
- **Document ID:** `contact`
- **Fields:** headline, contacts[], officeLocations[], formFields, seo
- **Purpose:** Sales inquiries
- **Pre-populate Contacts:**
  - Primary: nikhil.shinde@classgrid.in
  - Support: support@classgrid.in

#### 11. **Policy Pages** (`policyPage`)
- **CREATE 3 DOCUMENTS:**
  1. **Privacy Policy** - slug: `privacy`
  2. **Terms of Service** - slug: `terms`
  3. **Security/Compliance** - slug: `security`

#### 12. **Campaign Landing Pages** (`campaignPage`)
- **Example:** Campaign for "Stop Chasing Unpaid Fees"
  - Slug: `unpaid-fees`
  - Headline: "Stop Chasing Unpaid Fees. Let Classgrid Do It."
  - Target: School admins

#### 13. **Comparison Pages** (`comparisonPage`)
- **CREATE AS NEEDED:**
  - Classgrid vs Google Classroom
  - Classgrid vs Canvas
  - Classgrid vs Legacy ERPs

---

### 📝 Content Types (Already Configured)

#### Blog Posts (`postType`)
- **Create for:** SEO content, thought leadership
- **Examples:**
  - "5 Ways to Automate Attendance in 2026"
  - "How Cloud ERPs Protect Student Data Privacy"
  - "The Transition from WhatsApp to Secure Institutional Chat"
- **Fields:** title, slug, body, publishedAt, author, category, excerpt, featured image

#### Case Studies (`caseStudyType`)
- **Create for:** Social proof
- **Example:** "How ABC College saved 40 hours/week with Classgrid"
- **Fields:** title, organization, results, challenge, solution, story

#### Testimonials (`testimonialType`)
- **Create for:** Reviews page
- **Fields:** quote, author, role, organization, image

#### FAQ Items (`faqItemType`)
- **Create for:** FAQ page
- **Fields:** question, answer, category

#### Changelog Entries (`changelogEntryType`)
- **Create for:** What's New ticker
- **Fields:** title, version, releaseDate, features[], bugFixes[], breaking changes
- **Keep Updated:** This auto-populates the homepage ticker

---

## Step-by-Step: First Document Creation

### 1. Create a Home Page Document
```
1. Go to Sanity Studio → "Create new document"
2. Select "Home Page"
3. Fill:
   - Title: "The Operating System for Modern Education"
   - Subtitle: "Stop juggling ten different apps..."
4. Hit "Publish" (★ important for it to show live)
```

### 2. Query from Next.js
In `apps/marketing/lib/sanity.ts`:
```typescript
import { client } from '@sanity/client'

export async function getHomePage() {
  return client.fetch(`*[_type == "homePage"][0]{
    title,
    subtitle
  }`)
}
```

Then in `apps/marketing/app/page.tsx`:
```typescript
import { getHomePage } from '@/lib/sanity'

export default async function Home() {
  const home = await getHomePage()
  
  return (
    <div>
      <h1>{home.title}</h1>
      <p>{home.subtitle}</p>
    </div>
  )
}
```

---

## Important Workflow

### SEO Fields
Every page has an `seo` object with:
- `metaTitle` - HTML `<title>` (50-60 chars)
- `metaDescription` - HTML `<meta description>` (155-160 chars)
- `slug` - URL path

### Document Slugs → URL Mapping
| Sanity Slug | Route |
|-----------|-------|
| `about` | `/about` |
| `features` | `/features` |
| `pricing` | `/pricing` |
| `students` (use case) | `/use-cases/students` |
| `unpaid-fees` (campaign) | `/campaigns/unpaid-fees` |
| `vs-google-classroom` (comparison) | `/compare/vs-google-classroom` |

### Publishing Workflow
1. **Create Document** in Sanity Studio
2. **Edit Content** (Markdown, images, references)
3. **Set SEO** (meta title, description)
4. **Preview** (click "Preview" to see on live site)
5. **Publish** (makes it live, indexed by Google)
6. **Draft changes** later (auto-saved, not live until you hit Publish again)

---

## Recommended Content Calendar

**Week 1:**
- [ ] Create Home Page
- [ ] Create About Page
- [ ] Create Pricing Page
- [ ] Create Demo Page

**Week 2:**
- [ ] Create Features Page
- [ ] Create Integrations Page
- [ ] Create Tour Page
- [ ] Create Use Cases (3 docs)

**Week 3:**
- [ ] Create Policy Pages (3 docs)
- [ ] Create Support + Contact Pages
- [ ] Create 2-3 Case Studies
- [ ] Create 10+ FAQ Items

**Week 4:**
- [ ] Create 5 Blog Posts
- [ ] Create Testimonials (5+)
- [ ] Create 2 Comparison Pages
- [ ] Create 2 Ad Campaign Pages

---

## Troubleshooting

### "Page not showing on live site"
1. Check if document is **Published** (not just Draft)
2. Verify slug matches expected URL
3. Check Next.js query in component (use `getStaticProps` for ISR)

### "Images not loading"
1. Upload image via Sanity image picker
2. Use `urlFor()` helper to generate image URL
3. Never hardcode image URLs (they change)

### "Content cached incorrectly"
1. Clear Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. For ISR: Wait for revalidation interval or manually trigger

---

## Next Steps

1. **Log into Sanity Studio:** `npm run dev` in `apps/marketing`
2. **Create Home Page document** (minimum viable)
3. **Query it from Next.js** (see code example above)
4. **Deploy to Vercel** (automatic CI/CD)

For more: https://www.sanity.io/docs
