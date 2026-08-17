---
title: "Introducing GridX: Classgrid's Official UI Component Library"
releaseDate: "2026-08-17"
type: "new feature"
version: "v0.1.5"
---

# 🚀 Introducing GridX: Classgrid's Official UI Component Library

Today, we are thrilled to announce a major leap forward in our frontend engineering architecture: the official release of **GridX (@classgrid/gridx)**.

<DocsImage src="https://cdn.classgrid.in/classgrid/Screenshot_2026-08-17_220924.png" alt="Classgrid GridX Component Library" title="GridX UI" />

As our ecosystem continues to grow, maintaining a cohesive design system by manually copying and pasting component files was no longer a scalable solution. We needed a centralized, enterprise-grade architecture. So, we built one from the ground up.

GridX is our proprietary, fully decoupled, standalone React UI library, now published directly to the NPM registry. It encapsulates our entire design language, leveraging modern Radix primitives, gorgeous micro-animations, and strict TypeScript definitions.

## ✨ What does this mean for our development speed?

- **Instant Cross-Project Consistency:** A button in one app now looks and behaves exactly like a button in another.
- **Zero Configuration:** No more messy local component folders. Just install and import.
- **First-class TypeScript Support:** Perfect autocomplete with auto-generated `.d.ts` types.

## 🛠️ Getting Started

Using GridX is as simple as installing any standard React package. In your terminal, run:

<CodeBlock language="bash">
npm install @classgrid/gridx
</CodeBlock>

Because GridX is pre-compiled, your repository stays perfectly clean. You can import any of our 100+ highly-styled components directly:

<CodeBlock language="tsx">
import { Button, ImageCropperModal } from "@classgrid/gridx";

export default function ProfileUpload() {
  return (
    <div className="p-8">
      <Button variant="default">Open Cropper</Button>
      <ImageCropperModal isOpen={true} />
    </div>
  );
}
</CodeBlock>

---

<DocsFAQItem>
  <DocsFAQSummary>How do I use GridX in my existing projects?</DocsFAQSummary>
  First, install the package via NPM. Then, make sure you add the GridX preset to your `tailwind.config.ts` so that Tailwind can scan the package for utility classes. See the official documentation for the exact Tailwind setup snippet.
</DocsFAQItem>

<DocsFAQItem>
  <DocsFAQSummary>Why aren't the components downloading into my src folder?</DocsFAQSummary>
  Unlike Shadcn UI which pastes raw code into your project, GridX acts like a traditional compiled library (like React or Framer Motion). The compiled JavaScript is securely stored in your `node_modules` folder, keeping your codebase clean!
</DocsFAQItem>
