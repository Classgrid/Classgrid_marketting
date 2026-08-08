import { defineField, defineType } from "sanity";

export const legalTableType = defineType({
  name: "legalTable",
  title: "Legal Table",
  type: "object",
  fields: [
    defineField({
      name: "headers",
      title: "Headers",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineField({
          name: "row",
          type: "object",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      headers: 'headers'
    },
    prepare({ headers }) {
      return {
        title: "Legal Data Table",
        subtitle: headers ? `Columns: ${headers.join(", ")}` : "No headers",
      };
    },
  },
});
