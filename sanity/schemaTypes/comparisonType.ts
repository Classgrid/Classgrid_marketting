import { defineArrayMember, defineField, defineType } from "sanity";

export const comparisonType = defineType({
  name: "comparison",
  title: "Competitor Comparison",
  type: "document",
  fields: [
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
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "competitorName",
      title: "Competitor Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "competitorName" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "competitorLogo",
      title: "Competitor Logo",
      type: "image",
      options: { hotspot: true },
      description: "Optional. The frontend falls back to a generic building icon when this is empty.",
    }),
    defineField({
      name: "websiteLink",
      title: "Competitor Website Link",
      type: "url",
      description: "Optional. Link to the competitor's website.",
    }),
    defineField({
      name: "body",
      title: "Long-form Content",
      type: "array",
      description: "Optional. Vercel-style rich content with headings, tables, bullet points. Managed from Sanity.",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "White Bold", value: "whiteBold" },
              { title: "Green Highlight", value: "greenHighlight" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
        }),
        defineArrayMember({
          name: "table",
          type: "object",
          title: "Custom Table",
          fields: [
            {
              name: "rows",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "cells",
                      type: "array",
                      of: [{ type: "string" }],
                    },
                  ],
                },
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "ratingBadges",
      title: "Rating Badges",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform Name", type: "string" }),
            defineField({ name: "score", title: "Rating Score", type: "number" }),
            defineField({ name: "badgeImage", title: "Badge Image", type: "image", options: { hotspot: true } }),
            defineField({ name: "badgeLabel", title: "Badge Label", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "usps",
      title: "Our Unique Selling Propositions",
      type: "array",
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icon String", type: "string" }),
            defineField({ name: "title", title: "USP Title", type: "string" }),
            defineField({ name: "description", title: "USP Description", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "featureMatrix",
      title: "Feature Comparison Matrix",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: "featureName", title: "Feature Name", type: "string" }),
            defineField({ name: "ourStatus", title: "Classgrid Status", type: "string" }),
            defineField({
              name: "ourIcon",
              title: "Classgrid Icon",
              type: "string",
              options: { list: ["check", "warning", "cross"] },
            }),
            defineField({ name: "competitorStatus", title: "Competitor Status", type: "string" }),
            defineField({
              name: "competitorIcon",
              title: "Competitor Icon",
              type: "string",
              options: { list: ["check", "warning", "cross"] },
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "migrationTestimonial",
      title: "Migration Testimonial",
      type: "object",
      fields: [
        defineField({ name: "quoteText", title: "Quote Text", type: "text", rows: 4 }),
        defineField({ name: "authorName", title: "Author Name", type: "string" }),
        defineField({ name: "authorRole", title: "Author Role", type: "string" }),
      ],
    }),
    defineField({
      name: "faqs",
      title: "Frequently Asked Questions",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string" }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 4 }),
          ],
        }),
      ],
    }),
  ],
});
