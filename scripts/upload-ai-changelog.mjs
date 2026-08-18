import { createClient } from "@sanity/client";
import { config } from "dotenv";
import crypto from "crypto";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2024-03-30",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const key = () => crypto.randomBytes(12).toString("base64url");

async function main() {
  // Step 1: Delete any existing versions
  console.log("🗑️  Deleting old drafts (if any)...");
  try { await client.delete("changelog_ai_support_agent"); } catch(e) { /* ignore */ }
  try { await client.delete("drafts.changelog_ai_support_agent"); } catch(e) { /* ignore */ }

  console.log("\n📝 Creating new changelog entry...");
  
  const doc = {
    _id: "drafts.changelog_ai_support_agent",
    _type: "changelogEntry",
    title: {
      _type: "localeString",
      en: "Classgrid AI Support Agent is Live 🚀"
    },
    slug: {
      _type: "slug",
      current: "classgrid-ai-support-agent-live"
    },
    seoTitle: "Classgrid AI Support Agent is Live",
    metaDescription: "We have launched our new autonomous AI Support Agent to instantly handle pre-sales inquiries, student/faculty support, and automatic ticket escalation.",
    releaseDate: "2026-08-18",
    updateType: "announcement",
    versionLabel: "v3 AI",
    sendSubscriberNotification: false,
    summary: {
      _type: "localeText",
      en: "Get instant answers 24/7. Our new autonomous AI Support Agent handles pre-sales demo requests, onboarding help, and automatic support ticket escalation for your entire institution."
    },
    content: {
      _type: "localeRichBody",
      en: [
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "We are incredibly excited to announce the launch of the Classgrid AI Support Agent! Our new autonomous AI system is now fully integrated with our support@classgrid.in inbox, designed to provide instant, highly accurate, and deeply empathetic support to our users 24/7." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "h2",
          children: [{ _key: key(), _type: "span", text: "Instant Answers to Pre-Sales & Onboarding Inquiries" }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "The AI Support Agent serves as an expert guide for potential new institutions. Whether a customer is asking general pre-sales questions, needs onboarding assistance, or wants to book a platform demonstration, the AI provides instant, comprehensive replies to keep your admissions and sales workflows moving without delay." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "h2",
          children: [{ _key: key(), _type: "span", text: "Intelligent Support for Students, Teachers, and Admins" }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "We built this AI to support every layer of your institution. From students and teachers to faculty and administrators, the AI can instantly resolve common queries regarding platform usage, features, and workflows." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "h2",
          children: [{ _key: key(), _type: "span", text: "Contextual Thread Memory" }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "Nobody likes repeating themselves to support agents. Our AI automatically remembers the context of your ongoing conversation. It perfectly recalls the history of your current email thread, ensuring that follow-up questions are answered seamlessly without asking you to repeat your previous emails." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "h2",
          children: [{ _key: key(), _type: "span", text: "Auto-Escalation & Automated Ticket Creation" }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "While the AI resolves the vast majority of questions instantly, it knows when to step back. If an inquiry is highly complex or if the user explicitly demands a human review, the AI doesn't just forward an email—it automatically extracts the priority, categorizes the issue, generates a summary, and creates a formal Support Ticket in our system for seamless human intervention." }]
        },
        {
          _key: key(),
          _type: "block",
          style: "h2",
          children: [{ _key: key(), _type: "span", text: "Professional Formatting & Transparency" }]
        },
        {
          _key: key(),
          _type: "block",
          style: "normal",
          children: [{ _key: key(), _type: "span", text: "We believe in building trust. While the AI writes incredibly human-like, professional emails, we added a transparent footer to every automated response so you know exactly when you are interacting with our AI system." }]
        }
      ]
    }
  };

  const result = await client.createOrReplace(doc);
  console.log("   Created:", result._id);
  console.log("\n🎉 DONE! The AI Support Agent changelog is live.");
}

main().catch(console.error);
