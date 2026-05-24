<div align="center">
  <img src="https://raw.githubusercontent.com/Classgrid/Classgrid_marketting/main/public/logo.png" alt="Classgrid Logo" width="140" height="140" />
  
  <h1 align="center">Classgrid | Marketing & Growth Engine</h1>

  <p align="center">
    <strong>The Operating System for Modern Education — Built on the Edge.</strong>
  </p>

  <p align="center">
    <a href="https://classgrid.in">Website</a>
    ·
    <a href="https://classgrid.in/blog">Blog</a>
    ·
    <a href="https://classgrid.in/case-studies">Case Studies</a>
    ·
    <a href="https://classgrid.in/changelog">Changelog</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-14_App_Router-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Framer_Motion-Dynamic-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
    <br/>
    <img src="https://img.shields.io/badge/Sanity_CMS-GROQ-F03E2F?style=for-the-badge&logo=sanity&logoColor=white" alt="Sanity" />
    <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/MongoDB-NoSQL-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <br/>
    <img src="https://img.shields.io/badge/AWS-EC2-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS EC2" />
    <img src="https://img.shields.io/badge/Vercel-Edge_Network-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
    <img src="https://img.shields.io/badge/Nginx-Proxy-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
  </p>
</div>

---

<br/>

> **Proprietary Software**
> This repository represents the proprietary frontend and marketing engine for Classgrid. It is **NOT** open-source software. This is a private organization repository.

## 🏫 What is Classgrid?

Classgrid is a comprehensive Operating System built exclusively for modern education. We replace fragmented legacy software by combining:
- **Core ERP:** Admissions, Fee Management, and Attendance.
- **Academic Engine:** Exams, Report Cards, and AI-driven insights.
- **Growth Engine:** Lead tracking, Marketing automation, and parent communication.

Our software is utilized by forward-thinking Schools, Junior Colleges, and Coaching Institutes to scale their operations efficiently.

<br/>

## ✨ Next-Level Engineering Highlights

<table>
  <tr>
    <td width="50%">
      <h3>🛸 The Blueprint Box Architecture</h3>
      <p>We abandoned standard <code>&lt;div&gt;</code> containers. Every section of the blog and platform comparisons is wrapped in our custom <code>BlueprintBox</code>—a dynamically styled, responsive grid container featuring animated crosshair corners inspired by raw engineering schematics.</p>
    </td>
    <td width="50%">
      <h3>🪐 Radial Orbital Timelines</h3>
      <p>No basic SVG lines here. We utilized raw trigonometry and Framer Motion to build an infinite-rotating, pulsing timeline that visually explains how Classgrid connects the entire ecosystem (Admissions → Fees → Academics).</p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📝 Sanity Headless Integration</h3>
      <p>Our Sanity Studio isn't a basic text editor. We engineered <strong>Dynamic Content Sections</strong> allowing content writers to inject videos, multi-author case studies, and customized split-layouts dynamically without ever touching a line of code.</p>
    </td>
    <td width="50%">
      <h3>⚡ Serverless Cron & Webhooks</h3>
      <p>Our background infrastructure never sleeps. Supabase runs secure Cron Jobs that trigger Next.js Serverless API routes to process bulk email notifications automatically, entirely bypassing frontend timeouts.</p>
    </td>
  </tr>
</table>

<br/>

## 🏗️ Technical Architecture

<details>
  <summary><strong>1. Design System & Animations</strong></summary>
  <br/>
  <ul>
    <li><strong>Vercel Aesthetic:</strong> Deep dark modes, subtle borders, perfect typography (Geist/Inter).</li>
    <li><strong>Tailwind Mastery:</strong> Zero external CSS files. Everything is utility-first, utilizing complex <code>conic-gradient</code> and <code>radial-gradient</code> logic embedded directly in Tailwind configurations.</li>
    <li><strong>Micro-Interactions:</strong> Custom <code>Button</code> components utilizing <code>useMotionTemplate</code> and <code>useMotionValue</code> to create a dynamic "flashlight" glow that follows the user's cursor perfectly at 60fps.</li>
  </ul>
</details>

<details>
  <summary><strong>2. The Blog Engine</strong></summary>
  <br/>
  <ul>
    <li><strong>Sticky Intelligent TOC:</strong> The Table of Contents automatically calculates scroll position and highlights the active section in real-time.</li>
    <li><strong>GROQ Optimization:</strong> We fetch only exactly what we need using highly typed GROQ queries inside the <code>sanity/lib</code> directory.</li>
    <li><strong>Flawless Open Graph:</strong> Engineered to defeat WhatsApp and Telegram scrapers. The metadata perfectly exposes custom-generated 1200x630 images for flawless social sharing.</li>
  </ul>
</details>

<details>
  <summary><strong>3. Database & Cloud Infrastructure</strong></summary>
  <br/>
  <ul>
    <li><strong>AWS EC2 & Nginx:</strong> Platform backend routing and intensive data processing are deployed on a secure, self-hosted AWS EC2 Linux instance with Nginx serving as the reverse proxy for SSL termination.</li>
    <li><strong>Vercel Edge Network:</strong> The Next.js frontend (this repo) is hosted on Vercel to utilize their global CDN for millisecond load times on marketing pages.</li>
    <li><strong>Hybrid Database Architecture:</strong> 
      <ul>
        <li><strong>MongoDB:</strong> Handles the massive scale of student records, exam data, and dynamic RPC platform calls.</li>
        <li><strong>Supabase (PostgreSQL):</strong> Specifically utilized for marketing lead tracking, blog metrics, and executing serverless Cron Jobs.</li>
      </ul>
    </li>
    <li><strong>Sanity Webhooks:</strong> Revalidates Next.js cache <em>instantly</em> when a blog post is published. No waiting for rebuilds.</li>
  </ul>
</details>

<br/>

## 📂 Folder Structure Map

```text
Classgrid_marketting/
├── app/
│   ├── (marketing)/       # Landing pages, pricing, features
│   ├── blog/              # Headless Blog Engine
│   ├── case-studies/      # Enterprise client stories
│   ├── api/               # Serverless Webhooks & Crons
│   └── layout.tsx         # Global Providers & SEO Base
├── components/
│   ├── ui/                # Custom shadcn/framer components
│   ├── blog/              # PortableText and CMS renderers
│   └── shared/            # Navbars, Footers, Contact Forms
├── sanity/                # CMS Schemas & GROQ Queries
└── lib/                   # Utility functions, Supabase clients
```

<br/>

## 🚀 Deployment Instructions

Getting the environment running locally is seamless. 

1. **Clone the Source Code**
   ```bash
   git clone https://github.com/Classgrid/Classgrid_marketting.git
   cd Classgrid_marketting
   ```

2. **Install Dependencies**
   *We use npm for strict dependency locking.*
   ```bash
   npm install
   ```

3. **Configure the Environment**
   Duplicate `.env.example` to `.env.local` and inject your keys.
   ```env
   # Sanity Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID="your_sanity_id"
   NEXT_PUBLIC_SANITY_DATASET="production"

   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL="https://your_db.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"

   # Environment URL
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Ignite the Server**
   ```bash
   npm run dev
   ```
   > 🌐 Application is now running on `http://localhost:3000`

---

## ⚖️ Legal & Licensing (Strictly Enforced)

**Copyright © 2026 Classgrid Operating System. All Rights Reserved.**

This repository and all source code, design assets, and UI components within it are the exclusive intellectual property of Classgrid. 

🚫 **Strictly Prohibited:**
- You may **NOT** copy, clone, distribute, or host this website (or parts of it) for any personal, commercial, or agency use.
- You may **NOT** rip the design, CSS, or custom animations (like the BlueprintBox) for other projects.
- This is a proprietary repository. It is **not** MIT or GPL licensed. 

🤝 **Contribution & Access:**
- Access to this code is strictly limited to authorized members of the **[Classgrid GitHub Organization](https://github.com/Classgrid)**.
- Only official organization members are authorized to branch, commit, or open Pull Requests (PRs).
- Unauthorized PRs or forks will be reported and removed.

---
<div align="center">
  <img src="https://raw.githubusercontent.com/Classgrid/Classgrid_marketting/main/public/logo.png" alt="Classgrid Logo" width="50" />
  <p><b>Built with absolute precision for the future of Indian Education.</b></p>
</div>
