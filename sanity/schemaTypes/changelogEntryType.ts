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
      title: "Open Graph Image",
      type: "image",
      options: { hotspot: true },
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
        list: [
          { title: "Finance", value: "finance" },
          { title: "Academics", value: "academics" },
          { title: "Admissions", value: "admissions" },
          { title: "Exams", value: "exams" },
          { title: "Support & Helpdesk", value: "support" },
          { title: "Websites CMS", value: "websites" },
          { title: "Canteen & Operations", value: "canteen" },
        ],
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
