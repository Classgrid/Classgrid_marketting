import { defineField, defineType } from "sanity";
import { PackageOpen } from "lucide-react";

export const moduleType = defineType({
  name: "module",
  title: "Pricing Module",
  type: "document",
  icon: PackageOpen,
  fields: [
    defineField({
      name: "title",
      title: "Module Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Academics", value: "Academics" },
          { title: "Assessment", value: "Assessment" },
          { title: "Management", value: "Management" },
          { title: "Advanced", value: "Advanced" },
          { title: "Dashboards", value: "Dashboards" },
        ],
      },
    }),
    defineField({
      name: "basicTier",
      title: "Basic Tier",
      description: "Institution types that include this module in the Basic Tier",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "School", value: "School" },
          { title: "Coaching", value: "Coaching" },
          { title: "College", value: "College" },
          { title: "Engineering", value: "Engineering" },
        ],
      },
    }),
    defineField({
      name: "premiumTier",
      title: "Premium Tier",
      description: "Institution types that include this module in the Premium Tier",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "School", value: "School" },
          { title: "Coaching", value: "Coaching" },
          { title: "College", value: "College" },
          { title: "Engineering", value: "Engineering" },
        ],
      },
    }),
    defineField({
      name: "institutionTypes",
      title: "Institution Types",
      description: "All institution types this module is available for",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "School", value: "School" },
          { title: "Coaching", value: "Coaching" },
          { title: "College", value: "College" },
          { title: "Engineering", value: "Engineering" },
        ],
      },
    }),
    defineField({
      name: "iconSvg",
      title: "Icon SVG Link / Code",
      type: "text",
      description: "SVG code or URL to an external SVG icon.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "headline",
      title: "Headline (H1)",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Module Content Details",
      type: "array",
      of: [
        { 
          type: "block",
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong (Bold)', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
              { title: 'Code', value: 'code' },
            ],
          },
        },
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "table",
          title: "Table",
          fields: [
            {
              name: "rows",
              type: "array",
              title: "Table Rows",
              of: [
                {
                  type: "object",
                  name: "row",
                  fields: [
                    {
                      name: "cells",
                      type: "array",
                      title: "Cells",
                      of: [{ type: "string" }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
    }),
    defineField({
      name: "capabilities",
      title: "Capabilities / Features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "feature", title: "Feature", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "roleExperiences",
      title: "Role-Based Experiences",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "roleName", title: "Role Name (e.g. Student, Faculty)", type: "string" },
            { name: "description", title: "Description", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "marketing",
      title: "Marketing Copy",
      type: "object",
      fields: [
        { name: "headline", title: "Headline", type: "string" },
        { name: "body", title: "Short Body Copy", type: "text" },
        { name: "highlights", title: "Sub-Feature Highlights", type: "array", of: [{ type: "string" }] },
      ],
    }),
    defineField({
      name: "faqs",
      title: "Frequently Asked Questions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", title: "Question", type: "string" },
            { name: "answer", title: "Answer", type: "text" },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
    },
  },
});
