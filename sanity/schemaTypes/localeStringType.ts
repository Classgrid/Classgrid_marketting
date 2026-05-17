import { defineType, defineField } from "sanity";

export const localeStringType = defineType({
  title: "Localized String",
  name: "localeString",
  type: "object",
  fieldsets: [
    {
      title: "Translations",
      name: "translations",
      options: { collapsible: true, collapsed: false },
    },
  ],
  fields: [
    defineField({
      title: "English",
      name: "en",
      type: "string",
    }),
    defineField({
      title: "Hindi (हिंदी)",
      name: "hi",
      type: "string",
      fieldset: "translations",
    }),
    defineField({
      title: "Marathi (मराठी)",
      name: "mr",
      type: "string",
      fieldset: "translations",
    }),
  ],
});
