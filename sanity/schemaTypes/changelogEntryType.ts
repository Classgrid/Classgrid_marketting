import { defineArrayMember, defineField, defineType } from "sanity";

export const changelogEntryType = defineType({
  name: "changelogEntry",
  title: "Changelog Entry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Entry Title",
      type: "localeString",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || typeof value !== "object" || !("en" in value) || !(value as { en?: string }).en) {
            return "English title is required.";
          }
          return true;
        }),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image (Upload)",
      description: "Upload an image to Sanity. This takes priority over the URL below.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "ogImageUrl",
      title: "Open Graph Image (External URL)",
      description: "Paste an external image URL (e.g. from your CDN). Used as fallback if no uploaded image is set.",
      type: "url",
    }),
    defineField({
      name: "versionLabel",
      title: "Version Label",
      type: "string",
      description: "Optional. Example: v2.4",
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sendSubscriberNotification",
      title: "📧 Send Subscriber Notification",
      description: "Turn this ON to send an email to all subscribers when you publish. After the email is queued, this will automatically reset.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "updateType",
      title: "Update Type",
      type: "string",
      options: {
        list: [
          { title: "New Feature", value: "feature" },
          { title: "Improvement", value: "improvement" },
          { title: "Bug Fix", value: "bugfix" },
          { title: "Announcement", value: "announcement" },
          { title: "Performance", value: "performance" },
          { title: "Security", value: "security" },
          { title: "Deprecation", value: "deprecation" },
          { title: "Removal", value: "removal" },
          { title: "Architecture", value: "architecture" },
          { title: "Infrastructure", value: "infrastructure" },
          { title: "Refactor", value: "refactor" },
          { title: "Documentation", value: "documentation" },
          { title: "UI/UX", value: "ui-ux" },
          { title: "Compliance", value: "compliance" },
          { title: "Legal", value: "legal" },
          { title: "Partnership", value: "partnership" },
          { title: "Hotfix", value: "hotfix" },
          { title: "Rollback", value: "rollback" },
          { title: "Migration", value: "migration" },
          { title: "Maintenance", value: "maintenance" },
          { title: "Dependencies", value: "dependencies" },
          { title: "API Change", value: "api-change" },
          { title: "Data Model", value: "data-model" },
          { title: "Accessibility", value: "accessibility" },
          { title: "Localization", value: "localization" },
          { title: "Testing", value: "testing" },
          { title: "Experiment", value: "experiment" },
          { title: "Beta Release", value: "beta" },
          { title: "Early Access", value: "early-access" },
          { title: "General Availability (GA)", value: "ga" },
          { title: "End of Life (EOL)", value: "eol" },
          { title: "Configuration", value: "configuration" },
          { title: "Design System", value: "design-system" },
          { title: "Analytics", value: "analytics" },
          { title: "SEO", value: "seo" },
          { title: "Marketing", value: "marketing" },
          { title: "Onboarding", value: "onboarding" },
          { title: "Billing & Subscriptions", value: "billing" },
          { title: "Pricing", value: "pricing" },
          { title: "Support", value: "support" },
          { title: "Community", value: "community" },
          { title: "Webhooks", value: "webhooks" },
          { title: "Integrations", value: "integrations" },
          { title: "Mobile App", value: "mobile" },
          { title: "Desktop App", value: "desktop" },
          { title: "Hardware", value: "hardware" },
          { title: "Firmware", value: "firmware" },
          { title: "Open Source", value: "open-source" },
          { title: "Quality of Life (QoL)", value: "qol" },
          { title: "Internal Tooling", value: "internal-tooling" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "modules",
      title: "Related Modules",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "localeText",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || typeof value !== "object" || !("en" in value) || !(value as { en?: string }).en) {
            return "English summary is required.";
          }
          return true;
        }),
    }),
    defineField({
      name: "content",
      title: "Details",
      type: "localeRichBody",
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value || typeof value !== "object" || !Array.isArray((value as { en?: unknown[] }).en) || (value as { en?: unknown[] }).en!.length === 0) {
            return "English details are required.";
          }
          return true;
        }),
    }),
    defineField({
      name: "image",
      title: "Screenshot or GIF",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "relatedTourLabel",
      title: "Related Tour Link Label",
      type: "string",
    }),
    defineField({
      name: "relatedTourHref",
      title: "Related Tour Link Href",
      type: "string",
      description: "Relative URL to a related product tour section or page.",
    }),
  ],
  preview: {
    select: {
      title: "title.en",
      subtitle: "releaseDate",
    },
  },
});
