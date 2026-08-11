import { defineField, defineType } from "sanity";

export const ipProtectionPageType = defineType({
  name: "ipProtectionPage",
  title: "IP Protection Policy",
  type: "document",
  fields: [
    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: ["en", "hi", "mr"] },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content Strings",
      type: "object",
      fields: [
        defineField({ name: "title", type: "string", title: "Title" }),
        defineField({ name: "subtitle", type: "string", title: "Subtitle" }),
        defineField({ name: "effective", type: "string", title: "Effective Date text" }),
        defineField({ name: "updated", type: "string", title: "Updated Date text" }),
        defineField({ name: "back", type: "string", title: "Back text" }),
        defineField({ name: "print", type: "string", title: "Print text" }),
        defineField({ name: "onThisPage", type: "string", title: "On This Page text" }),
        defineField({ name: "footerContact", type: "string", title: "Footer Contact" }),
        defineField({ name: "footerNote1", type: "string", title: "Footer Note 1" }),
        defineField({ name: "footerNote2", type: "string", title: "Footer Note 2" }),
        defineField({ name: "p1", type: "text", title: "Paragraph 1 (Purpose)" }),
        defineField({ name: "p2", type: "text", title: "Paragraph 2 (What is Classgrid)" }),
        defineField({ name: "p2_highlight", type: "text", title: "Paragraph 2 Highlight" }),
        defineField({ name: "p3_1", type: "string", title: "Paragraph 3.1 Title" }),
        defineField({ name: "p3_1_desc", type: "text", title: "Paragraph 3.1 Description" }),
        defineField({ name: "p3_2", type: "string", title: "Paragraph 3.2 Title" }),
        defineField({ name: "p3_2_desc", type: "text", title: "Paragraph 3.2 Description" }),
        defineField({ name: "p3_3", type: "string", title: "Paragraph 3.3 Title" }),
        defineField({ name: "p3_3_desc", type: "text", title: "Paragraph 3.3 Description" }),
        defineField({ name: "p3_4", type: "string", title: "Paragraph 3.4 Title" }),
        defineField({ name: "p3_4_desc", type: "text", title: "Paragraph 3.4 Description" }),
        defineField({
          name: "executionList",
          title: "Execution List",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "p3_4_outro", type: "text", title: "Paragraph 3.4 Outro" }),
        defineField({ name: "p5_desc", type: "text", title: "Paragraph 5 Description" }),
        defineField({ name: "p5_quote", type: "text", title: "Paragraph 5 Quote" }),
        defineField({ name: "statusActive", type: "string", title: "Status: Active" }),
        defineField({ name: "statusNA", type: "string", title: "Status: Not Applicable" }),
        defineField({ name: "statusNo", type: "string", title: "Status: No" }),
        defineField({ name: "legalBasis", type: "string", title: "Legal Basis Header" }),
        defineField({ name: "tableCompany", type: "string", title: "Table Company Header" }),
        defineField({ name: "tableType", type: "string", title: "Table Type Header" }),
        defineField({ name: "tablePatented", type: "string", title: "Table Patented Header" }),
        defineField({ name: "tableMethod", type: "string", title: "Table Method Header" }),
        defineField({ name: "tableStatus", type: "string", title: "Table Status Header" }),
      ]
    }),
    defineField({
      name: "sections",
      title: "Sections Metadata",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "id", type: "string", title: "Section ID" },
            { name: "title", type: "string", title: "Section Title" },
            { name: "iconName", type: "string", title: "Icon Name" },
          ]
        }
      ]
    }),
    defineField({
      name: "industryExamples",
      title: "Industry Examples",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "company", type: "string", title: "Company" },
            { name: "type", type: "string", title: "Type" },
            { name: "patented", type: "boolean", title: "Patented" },
          ]
        }
      ]
    }),
    defineField({
      name: "protectionMethods",
      title: "Protection Methods",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "method", type: "string", title: "Method" },
            { name: "status", type: "string", title: "Status", options: { list: ["active", "not-applicable"] } },
            { name: "basis", type: "string", title: "Legal Basis" },
            { name: "description", type: "text", title: "Description" },
            { name: "iconName", type: "string", title: "Icon Name" },
          ]
        }
      ]
    }),
  ],
  preview: {
    select: {
      title: 'language',
    },
    prepare({ title }) {
      return {
        title: `IP Protection Policy (${String(title).toUpperCase()})`,
      }
    }
  }
});
