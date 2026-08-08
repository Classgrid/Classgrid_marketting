import { defineField, defineType } from "sanity";

export const legalPageType = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
      description: "Use privacy, terms, security, cookies, or disclaimer.",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "datetime",
    }),
    defineField({
      name: "sendSubscriberNotification",
      title: "Send Email Notification to Subscribers",
      description: "Toggle ON before publishing to send a legal update email to all subscribers.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "emailSentSuccessfully",
      title: "Email Sent Successfully",
      description: "Automatically turns ON when the webhook successfully queues the email.",
      type: "boolean",
      readOnly: true,
      initialValue: false,
    }),
    defineField({
      name: "lastNotificationSentAt",
      title: "Email Summary",
      description: "A short summary of the legal updates to include in the email notification.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "effectiveDate",
      title: "Effective Date",
      type: "datetime",
      description: "Optional. If empty, UI falls back to Last Updated date.",
    }),
    defineField({
      name: "intro",
      title: "Intro Block",
      type: "object",
      fields: [
        defineField({
          name: "introductionHeading",
          title: "Introduction Heading",
          type: "string",
          initialValue: "Introduction",
        }),
        defineField({
          name: "introductionBody",
          title: "Introduction Body",
          type: "text",
          rows: 6,
          description: "Use blank lines to separate paragraphs.",
        }),
        defineField({
          name: "scopeHeading",
          title: "Scope Heading",
          type: "string",
          initialValue: "Scope",
        }),
        defineField({
          name: "scopeBody",
          title: "Scope Body",
          type: "text",
          rows: 4,
          description: "Use blank lines to separate paragraphs.",
        }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        defineField({
          name: "section",
          title: "Section",
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "ID",
              type: "string",
              description: "Anchor id used in table of contents (example: information-we-collect).",
            }),
            defineField({
              name: "title",
              title: "Section Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "content",
              title: "Section Content",
              type: "array",
              of: [
                {
                  type: "block",
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
                    ],
                  },
                },
                { type: "legalTable" },
              ],
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});
